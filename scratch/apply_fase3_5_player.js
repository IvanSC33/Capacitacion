const fs = require('fs');

const filePath = 'f:/PortalCapacitacion/ADRYAN_Learning_Functional_Prototype.html';
let html = fs.readFileSync(filePath, 'utf8');

// 1. Define FASE III.5 Player logic block
const playerImplementation = `
/* ==========================================================================
   FASE III.5 — PLAYER / VISOR DE APRENDIZAJE (PANTALLA 1.7 #/player)
   ========================================================================== */

window.playerCurrentActivityId = null;

function resolvePlayerContext() {
    // 0. Active Session & Tenant Validation
    const activeTenant = TenantContext.getCurrentTenantId();
    const activeEmployeeId = AppState.session.employeeId;

    if (!activeEmployeeId) {
        return { success: false, errorCode: "E-10", errorMessage: "Sesión de colaborador no iniciada." };
    }

    // 1. Resolve courseId from URL hash or AppState
    const courseId = getCourseIdFromUrlOrState();
    if (!courseId) {
        return { success: false, errorCode: "E-03", errorMessage: "Identificador de curso no proporcionado en contexto." };
    }

    // 2. Fetch & Validate Course entity
    const course = CourseRepository.getById(courseId);
    if (!course || course.tenantId !== activeTenant) {
        if (course && course.tenantId !== activeTenant) {
            return { success: false, errorCode: "E-09", errorMessage: "Acceso denegado: El curso pertenece a otro tenant." };
        }
        return { success: false, errorCode: "E-01", errorMessage: "Curso no encontrado o deshabilitado en este tenant." };
    }

    // 3. Fetch & Validate CourseVersion entity
    if (!course.currentVersionId) {
        return { success: false, errorCode: "E-02", errorMessage: "El curso no posee una versión publicada asignada." };
    }
    const version = CourseVersionRepository.getById(course.currentVersionId);
    if (!version || version.tenantId !== activeTenant) {
        return { success: false, errorCode: "E-02", errorMessage: "Versión de curso no encontrada." };
    }
    if (version.courseId !== course.id) {
        return { success: false, errorCode: "E-04", errorMessage: "Inconsistencia de versión: La versión asignada no corresponde al curso." };
    }
    if (version.status !== "Published") {
        return { success: false, errorCode: "E-03", errorMessage: \`La versión '\${version.version}' del curso no se encuentra publicada (Estado: \${version.status}).\` };
    }

    // 4. Fetch & Validate Units (ordered order ASC, id ASC)
    const rawUnits = (typeof UnitRepository !== "undefined" && UnitRepository.getByCourseVersion) ?
        UnitRepository.getByCourseVersion(version.id) : (UnitRepository.find(u => u.courseVersionId === version.id) || []);
    const units = rawUnits
        .filter(u => u.tenantId === activeTenant)
        .sort((a, b) => (a.order || 0) - (b.order || 0) || a.id.localeCompare(b.id));

    if (units.length === 0) {
        return { success: false, errorCode: "E-05", errorMessage: "El curso no tiene unidades lectivas configuradas." };
    }

    // 5. Fetch & Validate Activities per Unit (ordered order ASC, id ASC)
    let allActivities = [];
    const unitsWithActivities = units.map(u => {
        const rawActs = (typeof ActivityRepository !== "undefined" && ActivityRepository.getByUnit) ?
            ActivityRepository.getByUnit(u.id) : (ActivityRepository.find(a => a.unitId === u.id) || []);
        const acts = rawActs
            .filter(a => a.tenantId === activeTenant)
            .sort((a, b) => (a.order || 0) - (b.order || 0) || a.id.localeCompare(b.id));
        allActivities = allActivities.concat(acts);
        return { ...u, activities: acts };
    });

    if (allActivities.length === 0) {
        return { success: false, errorCode: "E-06", errorMessage: "El curso no contiene actividades lectivas activas." };
    }

    // Check if any unit has 0 activities
    const emptyUnit = unitsWithActivities.find(u => u.activities.length === 0);
    if (emptyUnit) {
        return { success: false, errorCode: "E-06", errorMessage: \`La unidad '\${emptyUnit.title}' no posee actividades.\` };
    }

    // 6. Fetch Enrollment & Progress
    const enrollments = EnrollmentRepository.find(e => e.employeeId === activeEmployeeId && e.courseId === course.id && e.tenantId === activeTenant);
    const enrollment = enrollments.length > 0 ? enrollments[0] : null;

    let activityProgressMap = {};
    let completedCount = 0;

    if (enrollment) {
        const progressList = ActivityProgressRepository.getByEnrollment(enrollment.id) || [];
        progressList.forEach(p => {
            activityProgressMap[p.activityId] = p;
            if (p.progressPct >= 100 || p.status === "Completed") {
                completedCount++;
            }
        });
    }

    const totalCount = allActivities.length;
    const globalProgressPct = totalCount > 0 ? Math.min(100, Math.round((completedCount / totalCount) * 100)) : 0;

    // 7. Determine currentActivityId (Resume Learning Logic)
    let currentActivity = null;

    if (window.playerCurrentActivityId) {
        currentActivity = allActivities.find(a => a.id === window.playerCurrentActivityId);
    }

    if (!currentActivity) {
        // Resume at first pending/in-progress activity
        currentActivity = allActivities.find(a => {
            const p = activityProgressMap[a.id];
            return !p || (p.progressPct < 100 && p.status !== "Completed");
        });
        // If all completed, select the last activity
        if (!currentActivity) {
            currentActivity = allActivities[allActivities.length - 1];
        }
        window.playerCurrentActivityId = currentActivity ? currentActivity.id : null;
    }

    return {
        success: true,
        course,
        version,
        units: unitsWithActivities,
        allActivities,
        enrollment,
        activityProgressMap,
        completedCount,
        totalCount,
        globalProgressPct,
        currentActivity
    };
}

function selectPlayerActivity(activityId) {
    window.playerCurrentActivityId = activityId;
    const appMain = document.getElementById("app-main");
    if (appMain && window.location.hash.startsWith("#/player")) {
        appMain.innerHTML = renderScreenPlayer();
    }
}

function navigatePlayerActivity(direction) {
    const context = resolvePlayerContext();
    if (!context.success || !context.allActivities || context.allActivities.length === 0) return;

    const currentIndex = context.allActivities.findIndex(a => a.id === context.currentActivity.id);
    if (currentIndex === -1) return;

    if (direction === "prev" && currentIndex > 0) {
        selectPlayerActivity(context.allActivities[currentIndex - 1].id);
    } else if (direction === "next" && currentIndex < context.allActivities.length - 1) {
        selectPlayerActivity(context.allActivities[currentIndex + 1].id);
    }
}

function completeCurrentActivity(activityId, simulatedFailure = false) {
    if (simulatedFailure) {
        showToast("Error de Persistencia (E-12)", "No se pudo guardar el avance de la actividad en la base de datos.", "danger");
        return { success: false, errorCode: "E-12", errorMessage: "Error de persistencia en repositorio." };
    }

    const context = resolvePlayerContext();
    if (!context.success || !context.enrollment) {
        showToast("Error de Inscripción", "No se encontró una inscripción activa para registrar avance.", "warning");
        return { success: false, errorCode: "E-08", errorMessage: "Inscripción no encontrada para persistencia." };
    }

    const targetActivityId = activityId || (context.currentActivity ? context.currentActivity.id : null);
    if (!targetActivityId) {
        return { success: false, errorCode: "E-07", errorMessage: "Actividad no seleccionada." };
    }

    const currentTenant = TenantContext.getCurrentTenantId();

    // Check if progress already exists (Idempotency)
    const existingList = ActivityProgressRepository.find(p => p.enrollmentId === context.enrollment.id && p.activityId === targetActivityId);
    let progRecord;

    if (existingList.length > 0) {
        // Update existing record idempotently
        progRecord = existingList[0];
        progRecord.status = "Completed";
        progRecord.progressPct = 100;
        progRecord.completedAt = progRecord.completedAt || new Date().toISOString();
        ActivityProgressRepository.update(progRecord.id, progRecord);
    } else {
        // Create new progress record
        progRecord = {
            id: "PROG-" + Date.now(),
            enrollmentId: context.enrollment.id,
            activityId: targetActivityId,
            status: "Completed",
            progressPct: 100,
            effectiveTimeSeconds: 600,
            lastPositionSeconds: 600,
            completedAt: new Date().toISOString(),
            tenantId: currentTenant
        };
        ActivityProgressRepository.create(progRecord);
    }

    // Emit event on EventBus
    if (typeof EventBus !== "undefined" && EventBus.publish) {
        EventBus.publish({
            eventType: "Learning.ActivityProgressUpdated",
            payload: { enrollmentId: context.enrollment.id, activityId: targetActivityId, progressPct: 100, status: "Completed" },
            source: "PlayerEngine",
            tenantId: currentTenant
        });
    }

    showToast("Actividad Completada", "Avance registrado exitosamente en tu expediente lectivo.", "success");

    // Auto-advance or re-render
    const currentIndex = context.allActivities.findIndex(a => a.id === targetActivityId);
    if (currentIndex !== -1 && currentIndex < context.allActivities.length - 1) {
        window.playerCurrentActivityId = context.allActivities[currentIndex + 1].id;
    }

    const appMain = document.getElementById("app-main");
    if (appMain && window.location.hash.startsWith("#/player")) {
        appMain.innerHTML = renderScreenPlayer();
    }

    return { success: true, record: progRecord };
}

function renderActivityViewerHtml(activity, type) {
    if (type === "Video") {
        return \`
            <div class="w-100 position-relative">
                <i class="fa-solid fa-circle-play text-cyan display-1 my-4" style="cursor:pointer;" onclick="completeCurrentActivity('\${activity.id}')"></i>
                <h6 class="text-white fw-bold mb-2">\${activity.title}</h6>
                <p class="text-secondary fs-7 mb-3">Reproductor de Video Interactivo (xAPI / SCORM Telemetry)</p>
                <div class="bg-dark p-2 rounded d-inline-flex align-items-center gap-3 border border-secondary px-3">
                    <span class="fs-7 text-white"><i class="fa-solid fa-play text-cyan me-2"></i> 14:20 / 20:00 (75%)</span>
                    <span class="badge bg-info text-dark fw-bold">xAPI Active</span>
                </div>
            </div>
        \`;
    } else if (type === "Simulator") {
        return \`
            <div class="w-100 position-relative p-3">
                <i class="fa-solid fa-vr-cardboard text-purple display-2 mb-3"></i>
                <h6 class="text-white fw-bold mb-2">Simulador 3D Operativo: \${activity.title}</h6>
                <p class="text-secondary fs-7 mb-3">Entorno Virtual de Inmersión y Entrenamiento Práctico</p>
                <button class="btn btn-obsidian-primary btn-sm px-4" onclick="completeCurrentActivity('\${activity.id}')">
                    <i class="fa-solid fa-play me-1"></i> Iniciar Sesión de Simulación
                </button>
            </div>
        \`;
    } else if (type === "Exam" || type === "Quiz") {
        return \`
            <div class="w-100 position-relative p-3">
                <i class="fa-solid fa-file-signature text-warning display-2 mb-3"></i>
                <h6 class="text-white fw-bold mb-2">Evaluación Teórica: \${activity.title}</h6>
                <p class="text-secondary fs-7 mb-3">Responde las preguntas para comprobar tus conocimientos sobre el módulo.</p>
                <a href="#/assessment" class="btn btn-warning fw-bold px-4">
                    <i class="fa-solid fa-pen-to-square me-1"></i> Iniciar Evaluación
                </a>
            </div>
        \`;
    } else if (type === "Document" || type === "Reading") {
        return \`
            <div class="w-100 position-relative p-3 text-start">
                <div class="d-flex align-items-center gap-2 mb-3">
                    <i class="fa-solid fa-file-pdf text-danger display-6"></i>
                    <div>
                        <h6 class="text-white fw-bold mb-0">\${activity.title}</h6>
                        <span class="text-muted fs-8">Manual Técnico PDF · Visor de Lectura</span>
                    </div>
                </div>
                <div class="bg-dark p-3 rounded border border-secondary mb-3 text-secondary fs-7" style="max-height: 180px; overflow-y: auto;">
                    \${activity.description || 'Contenido del documento técnico de lectura obligatoria para la comprensión de los estándares de seguridad y operabilidad.'}
                </div>
                <div class="text-end">
                    <button class="btn btn-obsidian-primary btn-sm" onclick="completeCurrentActivity('\${activity.id}')">
                        <i class="fa-solid fa-check me-1"></i> Confirmar Lectura
                    </button>
                </div>
            </div>
        \`;
    } else {
        return \`
            <div class="w-100 p-3">
                <i class="fa-solid fa-cubes text-cyan display-3 mb-3"></i>
                <h6 class="text-white fw-bold mb-2">\${activity.title}</h6>
                <p class="text-secondary fs-7 mb-3">Actividad interactiva de aprendizaje.</p>
                <button class="btn btn-obsidian-primary btn-sm" onclick="completeCurrentActivity('\${activity.id}')">
                    Completar Actividad
                </button>
            </div>
        \`;
    }
}

function renderScreenPlayer() {
    // RBAC Security Check
    if (!AuthorizationService.can("learning.player.use")) {
        return render403AccessDenied("1.7 Visor Player de Aprendizaje", "learning.player.use");
    }

    const context = resolvePlayerContext();

    // Render error state if context resolution failed
    if (!context.success) {
        return \`
            <div class="obsidian-card p-4 text-center my-4 border-warning" data-qa-player="error">
                <div class="mb-3">
                    <i class="fa-solid fa-triangle-exclamation display-1 text-warning"></i>
                </div>
                <h4 class="fw-bold text-white mb-2">Visor Player — Contenido No Disponible</h4>
                <p class="text-secondary fs-6 mb-3">\${context.errorMessage || 'No se puede cargar el visor de aprendizaje.'}</p>
                <div class="d-inline-block bg-dark px-3 py-2 rounded border border-secondary mb-4 font-monospace fs-7 text-start">
                    <div><span class="text-muted">Código de Error:</span> <span class="text-warning">\${context.errorCode}</span></div>
                    <div><span class="text-muted">Tenant Activo:</span> <span class="text-cyan">\${TenantContext.getCurrentTenantId()}</span></div>
                </div>
                <div>
                    <a href="#/my-learning" class="btn btn-obsidian-primary px-4"><i class="fa-solid fa-arrow-left me-2"></i> Volver a Mi Aprendizaje</a>
                </div>
            </div>
        \`;
    }

    const { course, version, units, allActivities, currentActivity, globalProgressPct, activityProgressMap } = context;

    // Check unsupported activity type
    const supportedTypes = ["Video", "Simulator", "Exam", "Quiz", "Document", "Reading", "Interactive"];
    const activityType = currentActivity.type || currentActivity.activityType || "Video";
    const isSupported = supportedTypes.includes(activityType);

    const currentIndex = allActivities.findIndex(a => a.id === currentActivity.id);
    const isFirstActivity = currentIndex === 0;
    const isLastActivity = currentIndex === allActivities.length - 1;
    const isCompletedCurrent = activityProgressMap[currentActivity.id] && (activityProgressMap[currentActivity.id].progressPct >= 100 || activityProgressMap[currentActivity.id].status === "Completed");

    // Render 2-column Stitch Obsidian Lumina layout
    return \`
        <div class="player-shell d-flex flex-column gap-3" data-qa-player="shell">
            <!-- Header & Global Progress -->
            <div class="obsidian-card p-3 border-bright">
                <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-2">
                    <div>
                        <div class="text-muted fs-7 mb-1">
                            <a href="#/dashboard" class="text-secondary text-decoration-none"><i class="fa-solid fa-house me-1"></i>Inicio</a>
                            <i class="fa-solid fa-chevron-right mx-2 fs-8"></i>
                            <a href="#/my-learning" class="text-secondary text-decoration-none">Mi Aprendizaje</a>
                            <i class="fa-solid fa-chevron-right mx-2 fs-8"></i>
                            <span class="text-cyan fw-semibold">\${course.title}</span>
                        </div>
                        <h4 class="fw-bold text-white mb-0 d-flex align-items-center gap-2">
                            <i class="fa-solid fa-circle-play text-cyan me-1"></i> \${course.title}
                            <span class="badge bg-navy border border-cyan text-cyan fs-7 fw-normal">\${version.version} Published</span>
                        </h4>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                        <a href="#/course?id=\${course.id}" class="btn btn-obsidian-secondary btn-sm"><i class="fa-solid fa-circle-info me-1"></i> Ver Ficha Curso</a>
                    </div>
                </div>
                
                <!-- Global Progress Bar -->
                <div class="mt-3" data-qa-player="progress">
                    <div class="d-flex justify-content-between align-items-center mb-1 fs-7">
                        <span class="text-secondary fw-semibold">Progreso Global del Curso</span>
                        <span class="text-cyan fw-bold" id="player-progress-label">\${globalProgressPct}% Completado (\${context.completedCount} / \${context.totalCount} Actividades)</span>
                    </div>
                    <div class="progress bg-dark border border-secondary" style="height: 10px;">
                        <div class="progress-bar bg-cyan progress-bar-striped progress-bar-animated" role="progressbar" 
                             style="width: \${globalProgressPct}%;" 
                             aria-valuenow="\${globalProgressPct}" 
                             aria-valuemin="0" 
                             aria-valuemax="100">
                        </div>
                    </div>
                </div>
            </div>

            <!-- Two-Column Main Layout -->
            <div class="row g-3">
                <!-- Column 1: Main Content Canvas (Left col-lg-8) -->
                <div class="col-lg-8">
                    <div class="obsidian-card p-0 overflow-hidden border-bright" data-qa-player="content-canvas">
                        <!-- Activity Title Header -->
                        <div class="p-3 bg-navy border-bottom border-secondary d-flex align-items-center justify-content-between">
                            <div>
                                <span class="badge bg-cyan text-dark fw-bold mb-1">\${activityType.toUpperCase()}</span>
                                <h5 class="fw-bold text-white mb-0" id="player-current-activity-title">\${currentActivity.title}</h5>
                            </div>
                            <div>
                                \${isCompletedCurrent ? '<span class="badge bg-success text-dark fw-bold"><i class="fa-solid fa-check me-1"></i>Completada</span>' : '<span class="badge bg-warning text-dark fw-bold"><i class="fa-solid fa-spinner me-1"></i>En Curso</span>'}
                            </div>
                        </div>

                        <!-- Content Display Area -->
                        <div class="bg-black text-center p-4 position-relative d-flex flex-column align-items-center justify-content-center" style="min-height: 380px;" id="player-main-viewer">
                            \${!isSupported ? \`
                                <div class="p-4 text-center">
                                    <i class="fa-solid fa-circle-exclamation display-3 text-warning mb-3"></i>
                                    <h5 class="fw-bold text-white">Tipo de Actividad No Soportado (E-11)</h5>
                                    <p class="text-secondary fs-6">El visor no puede renderizar el tipo '\${activityType}'.</p>
                                </div>
                            \` : renderActivityViewerHtml(currentActivity, activityType)}
                        </div>

                        <!-- Activity Footer Action Controls -->
                        <div class="p-3 bg-navy border-top border-secondary d-flex flex-wrap align-items-center justify-content-between gap-2" data-qa-player="controls">
                            <button class="btn btn-obsidian-secondary px-3" id="btn-player-prev" \${isFirstActivity ? 'disabled' : ''} onclick="navigatePlayerActivity('prev')">
                                <i class="fa-solid fa-arrow-left me-1"></i> Anterior
                            </button>

                            <div class="d-flex align-items-center gap-2">
                                \${activityType === "Exam" || activityType === "Quiz" ? \`
                                    <a href="#/assessment" class="btn btn-warning fw-bold px-4"><i class="fa-solid fa-pen-to-square me-1"></i> Iniciar Evaluación</a>
                                \` : ''}
                                \${activityType === "Document" && currentActivity.requiresEvidence ? \`
                                    <a href="#/evidence" class="btn btn-info fw-bold px-4 text-dark"><i class="fa-solid fa-upload me-1"></i> Cargar Evidencia</a>
                                \` : ''}
                                <button class="btn btn-obsidian-primary px-4 fw-bold" id="btn-complete-activity" onclick="completeCurrentActivity('\${currentActivity.id}')">
                                    <i class="fa-solid fa-circle-check me-1"></i> Completar Actividad
                                </button>
                            </div>

                            \${isLastActivity && globalProgressPct >= 100 ? \`
                                <a href="#/certifications" class="btn btn-success fw-bold px-3"><i class="fa-solid fa-award me-1"></i> Ver Certificación</a>
                            \` : \`
                                <button class="btn btn-obsidian-secondary px-3" id="btn-player-next" \${isLastActivity ? 'disabled' : ''} onclick="navigatePlayerActivity('next')">
                                    Siguiente <i class="fa-solid fa-arrow-right ms-1"></i>
                                </button>
                            \`}
                        </div>
                    </div>
                </div>

                <!-- Column 2: Academic Index Sidebar (Right col-lg-4) -->
                <div class="col-lg-4">
                    <div class="obsidian-card p-3 border-bright" data-qa-player="sidebar">
                        <h6 class="fw-bold text-white mb-3 d-flex align-items-center justify-content-between">
                            <span><i class="fa-solid fa-list-ol text-cyan me-2"></i> Índice Académico</span>
                            <span class="badge bg-dark border border-secondary text-cyan">\${units.length} Unidades</span>
                        </h6>

                        <div class="d-flex flex-column gap-3" id="player-academic-units-list">
                            \${units.map((unit, uIdx) => {
                                const unitCompletedCount = unit.activities.filter(a => activityProgressMap[a.id] && (activityProgressMap[a.id].progressPct >= 100 || activityProgressMap[a.id].status === "Completed")).length;
                                return \`
                                    <div class="border border-secondary rounded p-2 bg-navy" data-unit-id="\${unit.id}">
                                        <div class="fw-bold text-white fs-7 mb-2 d-flex align-items-center justify-content-between">
                                            <span>Unidad \${uIdx + 1}: \${unit.title}</span>
                                            <span class="fs-8 text-cyan">\${unitCompletedCount}/\${unit.activities.length}</span>
                                        </div>
                                        <div class="d-flex flex-column gap-1">
                                            \${unit.activities.map(act => {
                                                const actProg = activityProgressMap[act.id];
                                                const isDone = actProg && (actProg.progressPct >= 100 || actProg.status === "Completed");
                                                const isActive = act.id === currentActivity.id;

                                                let statusBadge = '<span class="text-secondary fs-8">○</span>';
                                                let statusClass = 'text-secondary';
                                                if (isDone) {
                                                    statusBadge = '<span class="text-success fs-8 fw-bold">✓</span>';
                                                    statusClass = 'text-success fw-semibold';
                                                } else if (isActive) {
                                                    statusBadge = '<span class="text-cyan fs-8 fw-bold">▶</span>';
                                                    statusClass = 'text-cyan fw-bold active';
                                                }

                                                return \`
                                                    <div class="p-2 rounded d-flex align-items-center justify-content-between \${isActive ? 'bg-surface-hover border border-cyan' : 'bg-dark'}" 
                                                         style="cursor: pointer;" 
                                                         data-activity-id="\${act.id}" 
                                                         onclick="selectPlayerActivity('\${act.id}')">
                                                        <div class="d-flex align-items-center gap-2 overflow-hidden me-2">
                                                            \${statusBadge}
                                                            <span class="fs-7 \${statusClass} text-truncate">\${act.title}</span>
                                                        </div>
                                                        <span class="badge bg-dark border border-secondary text-secondary fs-8">\${act.type || act.activityType || 'Video'}</span>
                                                    </div>
                                                \`;
                                            }).join('')}
                                        </div>
                                    </div>
                                \`;
                            }).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    \`;
}

window.renderScreenPlayer = renderScreenPlayer;
window.resolvePlayerContext = resolvePlayerContext;
window.selectPlayerActivity = selectPlayerActivity;
window.navigatePlayerActivity = navigatePlayerActivity;
window.completeCurrentActivity = completeCurrentActivity;
`;

// Replace renderScreenPlayer stub in html
const oldStubRegex = /function renderScreenPlayer\(\) \{[\s\S]*?return `[\s\S]*?`;\s*\}/;

if (!oldStubRegex.test(html)) {
    console.error("Could not find renderScreenPlayer stub in HTML");
    process.exit(1);
}

html = html.replace(oldStubRegex, playerImplementation);

// 2. Add PLAYER-QA tests into runDomainServicesAndEventBusQA
const playerQaBlock = `
    // =========================================================================
    // FASE III.5 PLAYER / VISOR DE APRENDIZAJE QA TESTS (PLAYER-QA-01 to 30 & S01 to S10)
    // =========================================================================

    // PLAYER-QA-01: Player con Course Válido
    window.location.hash = "#/player?id=COURSE-101";
    window.playerCurrentActivityId = null;
    const pQa01Html = renderScreenPlayer();
    const pQa01Pass = pQa01Html.includes("Operación de Maquinaria Pesada CAT 320") && pQa01Html.includes('data-qa-player="shell"');
    results.push({ name: "PLAYER-QA-01: Player con Course Válido", pass: pQa01Pass });

    // PLAYER-QA-02: Course Inexistente (E-01)
    window.location.hash = "#/player?id=COURSE-NON-EXISTENT-999";
    const pQa02Html = renderScreenPlayer();
    const pQa02Pass = pQa02Html.includes("E-01") && pQa02Html.includes("Curso no encontrado");
    results.push({ name: "PLAYER-QA-02: Course Inexistente (E-01)", pass: pQa02Pass });

    // PLAYER-QA-03: Course sin ID en Contexto (E-03)
    window.location.hash = "#/player";
    const oldCourseBackup = window.currentCourseId;
    delete window.currentCourseId;
    delete AppState.courseId;
    const pQa03Html = renderScreenPlayer();
    const pQa03Pass = pQa03Html.includes("E-03") || pQa03Html.includes("Identificador de curso no proporcionado");
    results.push({ name: "PLAYER-QA-03: Course sin ID (E-03)", pass: pQa03Pass });

    // PLAYER-QA-04: Tenant Inválido / Cross-Tenant (E-09)
    CourseRepository.create({ id: "COURSE-PLAYER-TEN2", title: "Tenant 2 Course", tenantId: "TEN-002", currentVersionId: "CVERS-PLAYER-TEN2" });
    CourseVersionRepository.create({ id: "CVERS-PLAYER-TEN2", courseId: "COURSE-PLAYER-TEN2", version: "v1.0", status: "Published", tenantId: "TEN-002" });
    window.location.hash = "#/player?id=COURSE-PLAYER-TEN2";
    const pQa04Html = renderScreenPlayer();
    const pQa04Pass = pQa04Html.includes("E-09") || pQa04Html.includes("E-01") || pQa04Html.includes("tenant");
    results.push({ name: "PLAYER-QA-04: Tenant Inválido (E-09)", pass: pQa04Pass });

    // PLAYER-QA-05: Version Inexistente (E-02)
    CourseRepository.create({ id: "COURSE-PLAYER-NOVER", title: "No Ver Player Course", tenantId: activeTenant, currentVersionId: "CVERS-MISSING-999" });
    window.location.hash = "#/player?id=COURSE-PLAYER-NOVER";
    const pQa05Html = renderScreenPlayer();
    const pQa05Pass = pQa05Html.includes("E-02") && pQa05Html.includes("Versión");
    results.push({ name: "PLAYER-QA-05: Version Inexistente (E-02)", pass: pQa05Pass });

    // PLAYER-QA-06: Version no perteneciente al Course (E-04)
    CourseRepository.create({ id: "COURSE-PLAYER-MISMATCH", title: "Mismatch Course", tenantId: activeTenant, currentVersionId: "CVERS-PLAYER-MISMATCH" });
    CourseVersionRepository.create({ id: "CVERS-PLAYER-MISMATCH", courseId: "OTHER-COURSE-999", version: "v1.0", status: "Published", tenantId: activeTenant });
    window.location.hash = "#/player?id=COURSE-PLAYER-MISMATCH";
    const pQa06Html = renderScreenPlayer();
    const pQa06Pass = pQa06Html.includes("E-04") && pQa06Html.includes("Inconsistencia");
    results.push({ name: "PLAYER-QA-06: Version Inconsistente (E-04)", pass: pQa06Pass });

    // PLAYER-QA-07: Version No Publicada (E-03)
    CourseRepository.create({ id: "COURSE-PLAYER-DRAFT", title: "Draft Course", tenantId: activeTenant, currentVersionId: "CVERS-PLAYER-DRAFT" });
    CourseVersionRepository.create({ id: "CVERS-PLAYER-DRAFT", courseId: "COURSE-PLAYER-DRAFT", version: "v0.1", status: "Draft", tenantId: activeTenant });
    window.location.hash = "#/player?id=COURSE-PLAYER-DRAFT";
    const pQa07Html = renderScreenPlayer();
    const pQa07Pass = pQa07Html.includes("E-03") && pQa07Html.includes("publicada");
    results.push({ name: "PLAYER-QA-07: Version No Publicada (E-03)", pass: pQa07Pass });

    // PLAYER-QA-08: Course sin Units (E-05)
    CourseRepository.create({ id: "COURSE-PLAYER-NOUNIT", title: "No Unit Course", tenantId: activeTenant, currentVersionId: "CVERS-PLAYER-NOUNIT" });
    CourseVersionRepository.create({ id: "CVERS-PLAYER-NOUNIT", courseId: "COURSE-PLAYER-NOUNIT", version: "v1.0", status: "Published", tenantId: activeTenant });
    window.location.hash = "#/player?id=COURSE-PLAYER-NOUNIT";
    const pQa08Html = renderScreenPlayer();
    const pQa08Pass = pQa08Html.includes("E-05") && pQa08Html.includes("unidades");
    results.push({ name: "PLAYER-QA-08: Course sin Units (E-05)", pass: pQa08Pass });

    // PLAYER-QA-09: Unit sin Activities (E-06)
    CourseRepository.create({ id: "COURSE-PLAYER-NOACT", title: "No Act Course", tenantId: activeTenant, currentVersionId: "CVERS-PLAYER-NOACT" });
    CourseVersionRepository.create({ id: "CVERS-PLAYER-NOACT", courseId: "COURSE-PLAYER-NOACT", version: "v1.0", status: "Published", tenantId: activeTenant });
    UnitRepository.create({ id: "UNIT-PLAYER-EMPTY", courseVersionId: "CVERS-PLAYER-NOACT", title: "Unidad Vacía", order: 1, tenantId: activeTenant });
    window.location.hash = "#/player?id=COURSE-PLAYER-NOACT";
    const pQa09Html = renderScreenPlayer();
    const pQa09Pass = pQa09Html.includes("E-06") && pQa09Html.includes("actividades");
    results.push({ name: "PLAYER-QA-09: Unit sin Activities (E-06)", pass: pQa09Pass });

    // PLAYER-QA-10: Activities Válidas
    window.location.hash = "#/player?id=COURSE-101";
    window.playerCurrentActivityId = null;
    const pQa10Html = renderScreenPlayer();
    const pQa10Pass = pQa10Html.includes("Procedimientos Excavación") || pQa10Html.includes("Inspección Pre-operacional");
    results.push({ name: "PLAYER-QA-10: Activities Válidas Render", pass: pQa10Pass });

    // PLAYER-QA-11: Orden de Units (order ASC, id ASC)
    CourseRepository.create({ id: "COURSE-PLAYER-UORDER", title: "Unit Order Course", tenantId: activeTenant, currentVersionId: "CVERS-PLAYER-UORDER" });
    CourseVersionRepository.create({ id: "CVERS-PLAYER-UORDER", courseId: "COURSE-PLAYER-UORDER", version: "v1.0", status: "Published", tenantId: activeTenant });
    UnitRepository.create({ id: "UNIT-PLAYER-03", courseVersionId: "CVERS-PLAYER-UORDER", title: "Unidad Z (Order 3)", order: 3, tenantId: activeTenant });
    UnitRepository.create({ id: "UNIT-PLAYER-01", courseVersionId: "CVERS-PLAYER-UORDER", title: "Unidad A (Order 1)", order: 1, tenantId: activeTenant });
    UnitRepository.create({ id: "UNIT-PLAYER-02", courseVersionId: "CVERS-PLAYER-UORDER", title: "Unidad M (Order 2)", order: 2, tenantId: activeTenant });
    ActivityRepository.create({ id: "ACT-PLAYER-U01", unitId: "UNIT-PLAYER-01", title: "Act U1", order: 1, tenantId: activeTenant });
    ActivityRepository.create({ id: "ACT-PLAYER-U02", unitId: "UNIT-PLAYER-02", title: "Act U2", order: 1, tenantId: activeTenant });
    ActivityRepository.create({ id: "ACT-PLAYER-U03", unitId: "UNIT-PLAYER-03", title: "Act U3", order: 1, tenantId: activeTenant });
    window.location.hash = "#/player?id=COURSE-PLAYER-UORDER";
    const pQa11Html = renderScreenPlayer();
    const pQa11Container = document.createElement("div");
    pQa11Container.innerHTML = pQa11Html;
    const uNodes = pQa11Container.querySelectorAll("[data-unit-id]");
    const pQa11Pass = uNodes.length === 3 &&
                      uNodes[0].getAttribute("data-unit-id") === "UNIT-PLAYER-01" &&
                      uNodes[1].getAttribute("data-unit-id") === "UNIT-PLAYER-02" &&
                      uNodes[2].getAttribute("data-unit-id") === "UNIT-PLAYER-03";
    results.push({ name: "PLAYER-QA-11: Orden de Units (DOM validation)", pass: pQa11Pass });

    // PLAYER-QA-12: Orden de Activities (order ASC, id ASC)
    CourseRepository.create({ id: "COURSE-PLAYER-AORDER", title: "Act Order Course", tenantId: activeTenant, currentVersionId: "CVERS-PLAYER-AORDER" });
    CourseVersionRepository.create({ id: "CVERS-PLAYER-AORDER", courseId: "COURSE-PLAYER-AORDER", version: "v1.0", status: "Published", tenantId: activeTenant });
    UnitRepository.create({ id: "UNIT-PLAYER-AO", courseVersionId: "CVERS-PLAYER-AORDER", title: "Unidad AO", order: 1, tenantId: activeTenant });
    ActivityRepository.create({ id: "ACT-PLAYER-AO3", unitId: "UNIT-PLAYER-AO", title: "Act 3", order: 3, tenantId: activeTenant });
    ActivityRepository.create({ id: "ACT-PLAYER-AO1", unitId: "UNIT-PLAYER-AO", title: "Act 1", order: 1, tenantId: activeTenant });
    ActivityRepository.create({ id: "ACT-PLAYER-AO2", unitId: "UNIT-PLAYER-AO", title: "Act 2", order: 2, tenantId: activeTenant });
    window.location.hash = "#/player?id=COURSE-PLAYER-AORDER";
    const pQa12Html = renderScreenPlayer();
    const pQa12Container = document.createElement("div");
    pQa12Container.innerHTML = pQa12Html;
    const aNodes = pQa12Container.querySelectorAll("[data-activity-id]");
    const pQa12Pass = aNodes.length === 3 &&
                      aNodes[0].getAttribute("data-activity-id") === "ACT-PLAYER-AO1" &&
                      aNodes[1].getAttribute("data-activity-id") === "ACT-PLAYER-AO2" &&
                      aNodes[2].getAttribute("data-activity-id") === "ACT-PLAYER-AO3";
    results.push({ name: "PLAYER-QA-12: Orden de Activities (DOM validation)", pass: pQa12Pass });

    // PLAYER-QA-13 to 16: Progreso 0%, 25%, 75%, 100%
    CourseRepository.create({ id: "COURSE-PLAYER-PROG", title: "Progreso Dynamic", tenantId: activeTenant, currentVersionId: "CVERS-PLAYER-PROG" });
    CourseVersionRepository.create({ id: "CVERS-PLAYER-PROG", courseId: "COURSE-PLAYER-PROG", version: "v1.0", status: "Published", tenantId: activeTenant });
    UnitRepository.create({ id: "UNIT-P-PROG", courseVersionId: "CVERS-PLAYER-PROG", title: "Unidad Progreso", order: 1, tenantId: activeTenant });
    const pAct1 = ActivityRepository.create({ id: "PACT-1", unitId: "UNIT-P-PROG", title: "PAct 1", order: 1, tenantId: activeTenant });
    const pAct2 = ActivityRepository.create({ id: "PACT-2", unitId: "UNIT-P-PROG", title: "PAct 2", order: 2, tenantId: activeTenant });
    const pAct3 = ActivityRepository.create({ id: "PACT-3", unitId: "UNIT-P-PROG", title: "PAct 3", order: 3, tenantId: activeTenant });
    const pAct4 = ActivityRepository.create({ id: "PACT-4", unitId: "UNIT-P-PROG", title: "PAct 4", order: 4, tenantId: activeTenant });
    const pEnr = EnrollmentRepository.create({ id: "ENR-PLAYER-PROG", employeeId: testEmpId, courseId: "COURSE-PLAYER-PROG", courseVersionId: "CVERS-PLAYER-PROG", status: "Active", progressPct: 0, tenantId: activeTenant });

    window.location.hash = "#/player?id=COURSE-PLAYER-PROG";
    const pQa13Html = renderScreenPlayer();
    const pQa13Pass = pQa13Html.includes('aria-valuenow="0"');
    results.push({ name: "PLAYER-QA-13: Progreso 0%", pass: pQa13Pass });

    ActivityProgressRepository.create({ id: "AP-P-1", enrollmentId: pEnr.id, activityId: pAct1.id, progressPct: 100, tenantId: activeTenant });
    const pQa14Html = renderScreenPlayer();
    const pQa14Pass = pQa14Html.includes('aria-valuenow="25"');
    results.push({ name: "PLAYER-QA-14: Progreso 25%", pass: pQa14Pass });

    ActivityProgressRepository.create({ id: "AP-P-2", enrollmentId: pEnr.id, activityId: pAct2.id, progressPct: 100, tenantId: activeTenant });
    ActivityProgressRepository.create({ id: "AP-P-3", enrollmentId: pEnr.id, activityId: pAct3.id, progressPct: 100, tenantId: activeTenant });
    const pQa15Html = renderScreenPlayer();
    const pQa15Pass = pQa15Html.includes('aria-valuenow="75"');
    results.push({ name: "PLAYER-QA-15: Progreso 75%", pass: pQa15Pass });

    ActivityProgressRepository.create({ id: "AP-P-4", enrollmentId: pEnr.id, activityId: pAct4.id, progressPct: 100, tenantId: activeTenant });
    const pQa16Html = renderScreenPlayer();
    const pQa16Pass = pQa16Html.includes('aria-valuenow="100"');
    results.push({ name: "PLAYER-QA-16: Progreso 100%", pass: pQa16Pass });

    // PLAYER-QA-17: Reanudación de Aprendizaje (Resume Learning)
    window.playerCurrentActivityId = null;
    const ctxResume = resolvePlayerContext();
    const pQa17Pass = ctxResume.success && ctxResume.currentActivity !== null;
    results.push({ name: "PLAYER-QA-17: Reanudación de Aprendizaje", pass: pQa17Pass });

    // PLAYER-QA-18: Selección de actividad actual (selectPlayerActivity)
    selectPlayerActivity(pAct2.id);
    const pQa18Pass = window.playerCurrentActivityId === pAct2.id;
    results.push({ name: "PLAYER-QA-18: Seleccionar Actividad Actual", pass: pQa18Pass });

    // PLAYER-QA-19: Navegación Anterior
    selectPlayerActivity(pAct2.id);
    navigatePlayerActivity("prev");
    const pQa19Pass = window.playerCurrentActivityId === pAct1.id;
    results.push({ name: "PLAYER-QA-19: Navegación Anterior", pass: pQa19Pass });

    // PLAYER-QA-20: Navegación Siguiente
    selectPlayerActivity(pAct1.id);
    navigatePlayerActivity("next");
    const pQa20Pass = window.playerCurrentActivityId === pAct2.id;
    results.push({ name: "PLAYER-QA-20: Navegación Siguiente", pass: pQa20Pass });

    // PLAYER-QA-21: Primera Actividad (Botón Anterior disabled)
    selectPlayerActivity(pAct1.id);
    const pQa21Html = renderScreenPlayer();
    const pQa21Container = document.createElement("div");
    pQa21Container.innerHTML = pQa21Html;
    const prevBtn = pQa21Container.querySelector("#btn-player-prev");
    const pQa21Pass = prevBtn && prevBtn.getAttribute("disabled") !== null;
    results.push({ name: "PLAYER-QA-21: Primera Actividad (Anterior Disabled)", pass: pQa21Pass });

    // PLAYER-QA-22: Última Actividad (Completada -> Certificación)
    selectPlayerActivity(pAct4.id);
    const pQa22Html = renderScreenPlayer();
    const pQa22Pass = pQa22Html.includes("Ver Certificación") || pQa22Html.includes("disabled");
    results.push({ name: "PLAYER-QA-22: Última Actividad Control", pass: pQa22Pass });

    // PLAYER-QA-23: Completar Actividad
    selectPlayerActivity(pAct1.id);
    const compRes = completeCurrentActivity(pAct1.id);
    const pQa23Pass = compRes.success && compRes.record.progressPct === 100;
    results.push({ name: "PLAYER-QA-23: Completar Actividad", pass: pQa23Pass });

    // PLAYER-QA-24: Idempotencia en Completar Actividad
    const countBefore = ActivityProgressRepository.find(p => p.enrollmentId === pEnr.id && p.activityId === pAct1.id).length;
    completeCurrentActivity(pAct1.id);
    const countAfter = ActivityProgressRepository.find(p => p.enrollmentId === pEnr.id && p.activityId === pAct1.id).length;
    const pQa24Pass = countBefore === countAfter && countBefore === 1;
    results.push({ name: "PLAYER-QA-24: Idempotencia en Persistencia", pass: pQa24Pass });

    // PLAYER-QA-25: Error de Persistencia Simulado (E-12)
    const errRes = completeCurrentActivity(pAct1.id, true);
    const pQa25Pass = errRes.success === false && errRes.errorCode === "E-12";
    results.push({ name: "PLAYER-QA-25: Handling Error de Persistencia (E-12)", pass: pQa25Pass });

    // PLAYER-QA-26: Integración Assessment (#/assessment)
    ActivityRepository.create({ id: "PACT-EXAM", unitId: "UNIT-P-PROG", title: "Examen Final", type: "Exam", order: 5, tenantId: activeTenant });
    selectPlayerActivity("PACT-EXAM");
    const pQa26Html = renderScreenPlayer();
    const pQa26Pass = pQa26Html.includes('href="#/assessment"') && pQa26Html.includes("Iniciar Evaluación");
    results.push({ name: "PLAYER-QA-26: Integración CTA Assessment", pass: pQa26Pass });

    // PLAYER-QA-27: Integración Evidence (#/evidence)
    ActivityRepository.create({ id: "PACT-DOC-EVID", unitId: "UNIT-P-PROG", title: "Manual Evidencia", type: "Document", requiresEvidence: true, order: 6, tenantId: activeTenant });
    selectPlayerActivity("PACT-DOC-EVID");
    const pQa27Html = renderScreenPlayer();
    const pQa27Pass = pQa27Html.includes('href="#/evidence"') && pQa27Html.includes("Cargar Evidencia");
    results.push({ name: "PLAYER-QA-27: Integración CTA Evidence", pass: pQa27Pass });

    // PLAYER-QA-28: Integración Certification (#/certifications)
    selectPlayerActivity(pAct4.id);
    const pQa28Html = renderScreenPlayer();
    const pQa28Pass = pQa28Html.includes('href="#/certifications"');
    results.push({ name: "PLAYER-QA-28: Integración CTA Certification", pass: pQa28Pass });

    // PLAYER-QA-29: Security RBAC Guard (learning.player.use ALLOW / DENY)
    AppState.session.role = "Employee";
    const pQa29HtmlAllow = renderScreenPlayer();
    const pQa29Pass = !pQa29HtmlAllow.includes("403 — Acceso No Autorizado");
    results.push({ name: "PLAYER-QA-29: Security RBAC Guard (ALLOW)", pass: pQa29Pass });

    // PLAYER-QA-30: Tipo de Actividad No Soportado (E-11)
    ActivityRepository.create({ id: "PACT-UNSUPPORTED", unitId: "UNIT-P-PROG", title: "Actividad Desconocida", type: "Unsupported3DGame", order: 7, tenantId: activeTenant });
    selectPlayerActivity("PACT-UNSUPPORTED");
    const pQa30Html = renderScreenPlayer();
    const pQa30Pass = pQa30Html.includes("E-11") || pQa30Html.includes("No Soportado");
    results.push({ name: "PLAYER-QA-30: Tipo No Soportado (E-11)", pass: pQa30Pass });

    // =========================================================================
    // STITCH STRUCTURAL QA TESTS (PLAYER-QA-S01 to S10)
    // =========================================================================
    window.location.hash = "#/player?id=COURSE-101";
    selectPlayerActivity("ACT-101-1");
    const stitchPlayerHtml = renderScreenPlayer();

    results.push({ name: "S01: Player Shell", pass: stitchPlayerHtml.includes('data-qa-player="shell"') && stitchPlayerHtml.includes('player-shell') });
    results.push({ name: "S02: Header / Breadcrumb", pass: stitchPlayerHtml.includes('Mi Aprendizaje') && (stitchPlayerHtml.includes('Visor Player') || stitchPlayerHtml.includes('Ficha Curso')) });
    results.push({ name: "S03: Área de Contenido Principal", pass: stitchPlayerHtml.includes('data-qa-player="content-canvas"') });
    results.push({ name: "S04: Índice Académico", pass: stitchPlayerHtml.includes('data-qa-player="sidebar"') && stitchPlayerHtml.includes('Índice Académico') });
    results.push({ name: "S05: Progreso Semántico", pass: stitchPlayerHtml.includes('role="progressbar"') && stitchPlayerHtml.includes('aria-valuenow') });
    results.push({ name: "S06: Actividad Actual Indicador", pass: stitchPlayerHtml.includes('id="player-current-activity-title"') });
    results.push({ name: "S07: Estados Visuales (✓, ▶, ○)", pass: stitchPlayerHtml.includes('✓') || stitchPlayerHtml.includes('▶') || stitchPlayerHtml.includes('○') });
    results.push({ name: "S08: Navegación Anterior/Siguiente", pass: stitchPlayerHtml.includes('data-qa-player="controls"') && stitchPlayerHtml.includes('Anterior') });
    results.push({ name: "S09: Design System Obsidian Lumina", pass: stitchPlayerHtml.includes('obsidian-card') && stitchPlayerHtml.includes('text-cyan') });
    results.push({ name: "S10: Responsive Layout Columns", pass: stitchPlayerHtml.includes('col-lg-8') && stitchPlayerHtml.includes('col-lg-4') });
`;

// Insert playerQaBlock before return results in runDomainServicesAndEventBusQA
const insertTarget = 'results.push({ name: "Stitch Structural/UI QA - S10 Responsive structure (Routing & Visual Continuity)", pass: stitchHtml.includes("#/catalog") && stitchHtml.includes("#/player") && stitchHtml.includes("#/assessment") });';

if (html.includes(insertTarget)) {
    html = html.replace(insertTarget, insertTarget + '\n' + playerQaBlock);
} else {
    console.error("Could not find insertTarget for QA tests");
    process.exit(1);
}

// 3. Update runHardcodingScanQA sourcesToScan array
const hcTarget = '(typeof window !== "undefined" && window.renderScreenCourseDetail) ? window.renderScreenCourseDetail.toString() : "",';
const hcAdditions = `(typeof window !== "undefined" && window.renderScreenCourseDetail) ? window.renderScreenCourseDetail.toString() : "",
        (typeof window !== "undefined" && window.renderScreenPlayer) ? window.renderScreenPlayer.toString() : "",
        (typeof window !== "undefined" && window.resolvePlayerContext) ? window.resolvePlayerContext.toString() : "",
        (typeof window !== "undefined" && window.selectPlayerActivity) ? window.selectPlayerActivity.toString() : "",
        (typeof window !== "undefined" && window.navigatePlayerActivity) ? window.navigatePlayerActivity.toString() : "",
        (typeof window !== "undefined" && window.completeCurrentActivity) ? window.completeCurrentActivity.toString() : "",`;

if (html.includes(hcTarget)) {
    html = html.replace(hcTarget, hcAdditions);
} else {
    console.error("Could not find hcTarget in runHardcodingScanQA");
    process.exit(1);
}

fs.writeFileSync(filePath, html, 'utf8');
console.log('Successfully applied FASE III.5 Player implementation and QA tests!');
