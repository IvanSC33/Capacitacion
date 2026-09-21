const fs = require('fs');
const path = 'f:/PortalCapacitacion/ADRYAN_Learning_Functional_Prototype_III5_WORK.html';
let content = fs.readFileSync(path, 'utf8');

// 1. Add resolvePlayerContext function
const resolveContextCode = `
// BLOCK C1 - Player Context Resolution
function resolvePlayerContext(courseId) {
    const session = AppState?.session;
    if (!session || !session.tenantId || !session.employeeId) {
        return createServiceError("E-03", "Sesión no válida");
    }

    if (!courseId) {
        return createServiceError("E-03", "No se puede abrir el aprendizaje directamente. Selecciona un curso desde Mi Aprendizaje.");
    }

    const course = CourseRepository.getById(courseId);
    if (!course || course.tenantId !== session.tenantId) {
        return createServiceError("E-07", "Curso no válido");
    }

    const version = CourseVersionRepository.getAll().find(v => v.courseId === courseId && v.status === "Published" && v.tenantId === session.tenantId);
    if (!version) {
        return createServiceError("E-07", "Versión de curso no disponible");
    }

    const units = UnitRepository.getByCourseVersion(version.id);
    const activities = ActivityRepository.getAll().filter(a => units.some(u => u.id === a.unitId));

    const enrollment = EnrollmentRepository.getAll().find(e => 
        e.courseId === courseId && 
        e.courseVersionId === version.id &&
        e.tenantId === session.tenantId && 
        e.employeeId === session.employeeId
    );

    if (!enrollment) {
        return createServiceError("E-08", "No existe Enrollment para este aprendizaje.");
    }

    return {
        success: true,
        data: {
            tenant: session.tenantId,
            employeeId: session.employeeId,
            course,
            courseVersion: version,
            units,
            activities,
            enrollment
        }
    };
}
`;

if (!content.includes('resolvePlayerContext')) {
    content = content.replace('/* ==========================================================================', resolveContextCode + '\n/* ==========================================================================');
}

// 2. Modify renderScreenPlayer to use it
const newRenderScreenPlayer = `function renderScreenPlayer() {
    // BLOCK C1 - Resolve Context
    const courseId = getCourseIdFromUrlOrState();
    
    if (!courseId) {
        showToast("Error E-03", "No se puede abrir el aprendizaje directamente. Selecciona un curso desde Mi Aprendizaje.", "danger");
        window.location.hash = "#/my-learning";
        return "";
    }

    const contextResult = resolvePlayerContext(courseId);
    
    if (!contextResult.success) {
        const errCode = contextResult.error.code;
        if (errCode === "E-08") {
            showToast("Error E-08", "No existe Enrollment para este aprendizaje.", "danger");
        } else if (errCode === "E-03") {
            showToast("Error E-03", "No se puede abrir el aprendizaje directamente. Selecciona un curso desde Mi Aprendizaje.", "danger");
        } else {
            showToast("Error " + errCode, "Este aprendizaje ya no está disponible.", "danger");
        }
        window.location.hash = "#/my-learning";
        return "";
    }

    // Context is valid!
    AppState.playerContext = contextResult.data;

    return \`
        <div class="row g-3">
            <div class="col-md-9">
                <div class="obsidian-card p-0 overflow-hidden">
                    <div class="bg-black text-center p-5 position-relative" style="min-height: 380px;">
                        <i class="fa-solid fa-circle-play text-cyan display-1 position-absolute top-50 start-50 translate-middle" style="cursor:pointer;" onclick="showToast('Success', 'Contexto resuelto correctamente', 'success')"></i>
                        <div class="position-absolute bottom-0 start-0 end-0 bg-dark p-2 d-flex align-items-center justify-content-between px-3">
                            <span class="fs-7 text-white"><i class="fa-solid fa-play text-cyan me-2"></i> 00:00 / 00:00 (0%)</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="obsidian-card">
                    <h6 class="fw-bold text-white mb-3">Contenido de \${contextResult.data.course.title}</h6>
                    \${contextResult.data.activities.map((a, i) => \`<div class="ps-2 mb-2 text-muted fs-7">\${i+1}. \${a.title} (\${a.required ? 'Obligatoria' : 'Opcional'})</div>\`).join('')}
                </div>
            </div>
        </div>
    \`;
}`;

content = content.replace(/function renderScreenPlayer\(\) \{[\s\S]*?    `;\n\}/, newRenderScreenPlayer);

fs.writeFileSync(path, content);
console.log("C1 Applied successfully.");
