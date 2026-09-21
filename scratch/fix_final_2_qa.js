const fs = require('fs');
const filePath = 'f:/PortalCapacitacion/ADRYAN_Learning_Functional_Prototype.html';
let html = fs.readFileSync(filePath, 'utf8');

// Replace QA-09 block
const qa09Target = html.indexOf("QA-09: Progreso Real en Pantalla");
const qa09End = html.indexOf("results.push({ name: \"QA-09: Progreso Real en Pantalla\", pass: step1Pass && step2Pass });");

if (qa09Target !== -1 && qa09End !== -1) {
    const newQA09Block = `QA-09: Progreso Real en Pantalla (Dynamic calculation from ActivityProgress)
    CourseRepository.create({ id: "COURSE-TEMP-PROG", title: "Progress Test Course", tenantId: activeTenant, currentVersionId: "CVERS-TEMP-PROG" });
    CourseVersionRepository.create({ id: "CVERS-TEMP-PROG", courseId: "COURSE-TEMP-PROG", version: "v1.0", status: "Published", tenantId: activeTenant });
    const uProg = UnitRepository.create({ id: "UNIT-TEMP-PROG", courseVersionId: "CVERS-TEMP-PROG", title: "Unidad Progreso", order: 1, tenantId: activeTenant });
    const actProg1 = ActivityRepository.create({ id: "ACT-TEMP-P1", unitId: uProg.id, title: "Act 1", order: 1, tenantId: activeTenant });
    const actProg2 = ActivityRepository.create({ id: "ACT-TEMP-P2", unitId: uProg.id, title: "Act 2", order: 2, tenantId: activeTenant });
    
    const enrProg = EnrollmentRepository.create({ id: "ENR-TEMP-PROG", employeeId: testEmpId, courseId: "COURSE-TEMP-PROG", courseVersionId: "CVERS-TEMP-PROG", status: "Active", progressPct: 0, tenantId: activeTenant });
    const ap1 = ActivityProgressRepository.create({ id: "AP-TEMP-1", enrollmentId: enrProg.id, activityId: actProg1.id, progressPct: 100, tenantId: activeTenant });
    const ap2 = ActivityProgressRepository.create({ id: "AP-TEMP-2", enrollmentId: enrProg.id, activityId: actProg2.id, progressPct: 50, tenantId: activeTenant });
    
    window.location.hash = "#/course?id=COURSE-TEMP-PROG";
    const qa09HtmlStep1 = renderScreenCourseDetail();
    const step1Pass = qa09HtmlStep1.includes("75%") && qa09HtmlStep1.includes('aria-valuenow="75"');

    ActivityProgressRepository.update(ap2.id, { progressPct: 100 });
    const qa09HtmlStep2 = renderScreenCourseDetail();
    const step2Pass = qa09HtmlStep2.includes("100%") && qa09HtmlStep2.includes('aria-valuenow="100"');
    results.push({ name: "QA-09: Progreso Real en Pantalla", pass: step1Pass && step2Pass });`;

    const oldBlock = html.substring(qa09Target, qa09End + 91);
    html = html.replace(oldBlock, newQA09Block);
}

// Replace QA-23 block
const qa23Target = html.indexOf("QA-23: Datos Incompletos");
const qa23End = html.indexOf("results.push({ name: \"QA-23: Datos Incompletos\", pass: qa23Pass");

if (qa23Target !== -1 && qa23End !== -1) {
    const endLineIdx = html.indexOf("});", qa23End);
    const newQA23Block = `QA-23: Datos Incompletos (Hierarchy Course -> CourseVersion -> Unit -> Activity with missing optional fields)
    CourseRepository.create({ id: "COURSE-TEMP-INC", title: "Incomplete Course", tenantId: activeTenant, currentVersionId: "CVERS-TEMP-INC" });
    CourseVersionRepository.create({ id: "CVERS-TEMP-INC", courseId: "COURSE-TEMP-INC", version: "v1.0", status: "Published", tenantId: activeTenant });
    UnitRepository.create({ id: "UNIT-TEMP-INC", courseVersionId: "CVERS-TEMP-INC", title: "Unidad Datos Incompletos", order: 1, tenantId: activeTenant });
    ActivityRepository.create({ id: "ACT-TEMP-INC", unitId: "UNIT-TEMP-INC", title: "Actividad Datos Incompletos", order: 1, tenantId: activeTenant });

    window.location.hash = "#/course?id=COURSE-TEMP-INC";
    const incHtml = renderScreenCourseDetail();
    const qa23Pass = incHtml.includes("No disponible") &&
                     incHtml.includes("Sin descripción disponible.") &&
                     !incHtml.includes("undefined") &&
                     !incHtml.includes("null") &&
                     !incHtml.includes("NaN");
    results.push({ name: "QA-23: Datos Incompletos", pass: qa23Pass });`;

    const oldBlock23 = html.substring(qa23Target, endLineIdx + 3);
    html = html.replace(oldBlock23, newQA23Block);
}

fs.writeFileSync(filePath, html, 'utf8');
console.log("Successfully applied QA-09 and QA-23 clean replacement!");
