const fs = require('fs');

const extractedJsPath = 'f:/PortalCapacitacion/scratch/temp_extracted.js';
let jsCode = fs.readFileSync(extractedJsPath, 'utf8');

// Also extract resolvePlayerContext
const htmlContent = fs.readFileSync('f:/PortalCapacitacion/ADRYAN_Learning_Functional_Prototype_III5_WORK.html', 'utf8');
const resolveStart = htmlContent.indexOf('function resolvePlayerContext(courseId)');
const retIdx = htmlContent.indexOf('return {', resolveStart);
const innerEnd = htmlContent.indexOf('}', retIdx);
const middleEnd = htmlContent.indexOf('}', innerEnd + 1);
const finalEnd = htmlContent.indexOf('}', middleEnd + 1);
const resolveCode = htmlContent.substring(resolveStart, finalEnd + 1);

jsCode = jsCode.replace(/const SecurityAuditRepository = \{[\s\S]*?\n\s*\};/, 'const SecurityAuditRepository = { create: () => {} };');

const env = `
const window = {};
window.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
const localStorage = window.localStorage;
const document = { getElementById: () => ({ addEventListener: () => {} }), querySelectorAll: () => [] };
const crypto = { subtle: { digest: async () => new ArrayBuffer(32) }, randomUUID: () => "uuid-" + Math.random() };
window.crypto = crypto;
const $ = () => ({ append: () => {}, html: () => {}, on: () => {}, ready: () => {} });
const bootstrap = { Modal: class { show(){} hide(){} }, Toast: class { show(){} } };
`;

const exportStatement = `
module.exports = {
    SEED_MOCK_DB,
    createServiceError,
    CourseRepository,
    CourseVersionRepository,
    UnitRepository,
    ActivityRepository,
    EnrollmentRepository,
    AppState,
    resolvePlayerContext
};
`;

fs.writeFileSync('f:/PortalCapacitacion/scratch/temp_test_c1_env_h.js', env + jsCode + "\n\n" + resolveCode + "\n\n" + exportStatement);

const {
    SEED_MOCK_DB,
    createServiceError,
    CourseRepository,
    CourseVersionRepository,
    UnitRepository,
    ActivityRepository,
    EnrollmentRepository,
    AppState,
    resolvePlayerContext
} = require('f:/PortalCapacitacion/scratch/temp_test_c1_env_h.js');

let passed = 0;
let failed = 0;

function assert(condition, message, details = "") {
    if (condition) {
        passed++;
        console.log("✅ PASS: " + message);
    } else {
        failed++;
        console.error("❌ FAIL: " + message + (details ? " | " + details : ""));
    }
}

try {
    console.log("=== RUNNING QA C1 HARDENING ===");

    // Base context valid
    AppState.session = { employeeId: "EMP-0001635", tenantId: "TEN-001" };
    
    // C1-05 currentVersionId correcto
    const resValid = resolvePlayerContext("COURSE-101");
    assert(resValid.success === true && resValid.data.course.id === "COURSE-101" && resValid.data.courseVersion.id === "CVERS-101-V24", "C1-05 currentVersionId correcto resuelto exitosamente");

    // Backup
    const c101 = CourseRepository.getById("COURSE-101");
    const v24 = CourseVersionRepository.getById("CVERS-101-V24");
    const originalCurrentVer = c101.currentVersionId;
    const originalStatus = v24.status;

    // C1-06 currentVersionId inexistente
    c101.currentVersionId = "CVERS-NOT-EXIST";
    const resNoVer = resolvePlayerContext("COURSE-101");
    assert(resNoVer.success === false && resNoVer.error.code === "E-07", "C1-06 E-07 por currentVersionId inexistente");

    // C1-07 currentVersionId de otro Course
    c101.currentVersionId = "CVERS-102-V10"; // Belongs to COURSE-102
    const resOtherCourseVer = resolvePlayerContext("COURSE-101");
    assert(resOtherCourseVer.success === false && resOtherCourseVer.error.code === "E-07", "C1-07 E-07 por currentVersionId que pertenece a otro curso");

    // C1-08 currentVersionId de otro Tenant
    // Need a mock version from another tenant
    CourseVersionRepository.getAll().push({ id: "CVERS-OTHER-TENANT", courseId: "COURSE-101", tenantId: "TEN-002", status: "Published" });
    c101.currentVersionId = "CVERS-OTHER-TENANT";
    const resOtherTenantVer = resolvePlayerContext("COURSE-101");
    assert(resOtherTenantVer.success === false && resOtherTenantVer.error.code === "E-07", "C1-08 E-07 por currentVersionId de otro tenant");

    // C1-09 currentVersionId no Published
    c101.currentVersionId = originalCurrentVer;
    v24.status = "Draft";
    const resNotPub = resolvePlayerContext("COURSE-101");
    assert(resNotPub.success === false && resNotPub.error.code === "E-07", "C1-09 E-07 por currentVersionId no Published");
    v24.status = originalStatus; // restore

    // C1-10 Unit fuera del CourseVersion
    // Delete all units for CVERS-101-V24
    const originalUnits = UnitRepository.getAll().filter(u => u.courseVersionId === "CVERS-101-V24");
    const dbUnits = UnitRepository.getAll(false);
    // Remove them
    for(let i = dbUnits.length - 1; i >= 0; i--) {
        if(dbUnits[i].courseVersionId === "CVERS-101-V24") dbUnits.splice(i, 1);
    }
    const resNoUnit = resolvePlayerContext("COURSE-101");
    assert(resNoUnit.success === false && resNoUnit.error.code === "E-07", "C1-10 E-07 por CourseVersion sin unidades (Unit fuera del CourseVersion)");
    // Restore
    originalUnits.forEach(u => dbUnits.push(u));

    // C1-11 Activity fuera de las Units resueltas
    // Remove all activities for units of CVERS-101-V24
    const originalActs = ActivityRepository.getAll(false).filter(a => originalUnits.some(u => u.id === a.unitId));
    const dbActs = ActivityRepository.getAll(false);
    for(let i = dbActs.length - 1; i >= 0; i--) {
        if(originalUnits.some(u => u.id === dbActs[i].unitId)) dbActs.splice(i, 1);
    }
    const resNoAct = resolvePlayerContext("COURSE-101");
    assert(resNoAct.success === false && resNoAct.error.code === "E-07", "C1-11 E-07 por CourseVersion sin actividades (fuera de units)");
    // Restore
    originalActs.forEach(a => dbActs.push(a));

    // C1-12 Enrollment con courseVersionId incorrecto
    const enr = EnrollmentRepository.getAll().find(e => e.courseId === "COURSE-101" && e.employeeId === "EMP-0001635");
    const oldEnrVer = enr.courseVersionId;
    enr.courseVersionId = "CVERS-OLD-123";
    const resEnrVerMismatch = resolvePlayerContext("COURSE-101");
    assert(resEnrVerMismatch.success === false && resEnrVerMismatch.error.code === "E-08", "C1-12 E-08 por Enrollment apuntando a una versión incorrecta");
    enr.courseVersionId = oldEnrVer;

    // Y repetir E-07 tenant diferente, E-08 empleado distinto, E-03 sin curso
    AppState.session = { employeeId: "EMP-0001635", tenantId: "TEN-002" };
    assert(resolvePlayerContext("COURSE-101").success === false, "E-07 tenant diferente");
    
    AppState.session = { employeeId: "EMP-9999999", tenantId: "TEN-001" };
    assert(resolvePlayerContext("COURSE-101").success === false, "E-08 enrollment empleado distinto");

    AppState.session = { employeeId: "EMP-0001635", tenantId: "TEN-001" };
    assert(resolvePlayerContext(null).success === false, "E-03 sin curso");

    console.log("\\nQA C1 Results: " + passed + " passed, " + failed + " failed");
    if (failed > 0) process.exit(1);
} catch(e) {
    console.error(e);
    process.exit(1);
}
