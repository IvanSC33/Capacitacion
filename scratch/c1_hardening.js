const fs = require('fs');

const path = 'f:/PortalCapacitacion/ADRYAN_Learning_Functional_Prototype_III5_WORK.html';
let content = fs.readFileSync(path, 'utf8');

const startTag = '// BLOCK C1 - Player Context Resolution';
const startIndex = content.indexOf(startTag);
if (startIndex === -1) {
    console.error("Could not find start tag");
    process.exit(1);
}

const functionStart = content.indexOf('function resolvePlayerContext', startIndex);
const returnIndex = content.indexOf('return {', functionStart);
const endIndex = content.indexOf('};', returnIndex) + 2;
const functionEnd = content.indexOf('}', endIndex) + 1;

const newResolvePlayerContext = `// BLOCK C1 - Player Context Resolution
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

    if (!course.currentVersionId) {
        return createServiceError("E-07", "El curso no tiene una versión activa");
    }

    const version = CourseVersionRepository.getById(course.currentVersionId);
    if (!version || version.courseId !== courseId || version.tenantId !== session.tenantId || version.status !== "Published") {
        return createServiceError("E-07", "Versión de curso no válida o no publicada");
    }

    const units = UnitRepository.getByCourseVersion(version.id);
    if (!units || units.length === 0) {
        return createServiceError("E-07", "La versión del curso no contiene unidades");
    }
    const unitIds = units.map(u => u.id);

    const activities = ActivityRepository.getAll().filter(a => unitIds.includes(a.unitId));
    if (!activities || activities.length === 0) {
         return createServiceError("E-07", "La versión del curso no contiene actividades");
    }

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
            tenant: session.tenantId, // Only internal usage
            employeeId: session.employeeId,
            course,
            courseVersion: version,
            units,
            activities,
            enrollment
        }
    };
}`;

content = content.substring(0, startIndex) + newResolvePlayerContext + content.substring(functionEnd);
fs.writeFileSync(path, content);
console.log("C1 Hardening replaced successfully.");
