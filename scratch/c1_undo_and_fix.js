const fs = require('fs');
const path = 'f:/PortalCapacitacion/ADRYAN_Learning_Functional_Prototype_III5_WORK.html';
let content = fs.readFileSync(path, 'utf8');

// Remove from <style>
content = content.replace(/\/\/ BLOCK C1 - Player Context Resolution[\s\S]*?    };\n}\n/, '');

// Find the JS section and append it there.
// We can append it right before function resolvePlayerContext if it exists, or at the end of the script tag.
const scriptEndIndex = content.lastIndexOf('</script>');
const scriptInsertionIndex = content.lastIndexOf('/* ==========================================================================', scriptEndIndex);

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

content = content.substring(0, scriptInsertionIndex) + resolveContextCode + '\n' + content.substring(scriptInsertionIndex);

fs.writeFileSync(path, content);
console.log("Fixed C1 placement.");
