const fs = require('fs');

const extractedJsPath = 'f:/PortalCapacitacion/scratch/temp_extracted.js';
let jsCode = fs.readFileSync(extractedJsPath, 'utf8');

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

fs.writeFileSync('f:/PortalCapacitacion/scratch/temp_test_c1_env.js', env + jsCode + "\n\n" + exportStatement);

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
} = require('f:/PortalCapacitacion/scratch/temp_test_c1_env.js');

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
    console.log("=== RUNNING QA C1 ===");

    // 1. Contexto Válido
    AppState.session = { employeeId: "EMP-0001635", tenantId: "TEN-001" };
    const resValid = resolvePlayerContext("COURSE-101");
    assert(resValid.success === true && resValid.data.course.id === "COURSE-101", "Contexto Válido resuelto correctamente");

    // 2. Tenant validado (E-07)
    AppState.session = { employeeId: "EMP-0001635", tenantId: "TEN-002" };
    const resTenant = resolvePlayerContext("COURSE-101");
    assert(resTenant.success === false && resTenant.error.code === "E-07", "E-07 por Tenant distinto en Curso");

    // 3. Employee validado (E-08)
    AppState.session = { employeeId: "EMP-9999999", tenantId: "TEN-001" };
    const resEmp = resolvePlayerContext("COURSE-101");
    assert(resEmp.success === false && resEmp.error.code === "E-08", "E-08 por Enrollment no perteneciente a Employee");

    // 4. E-03 Acceso sin cursoId
    AppState.session = { employeeId: "EMP-0001635", tenantId: "TEN-001" };
    const resNoCourse = resolvePlayerContext(null);
    assert(resNoCourse.success === false && resNoCourse.error.code === "E-03", "E-03 por acceso sin Course ID");

    console.log("\\nQA C1 Results: " + passed + " passed, " + failed + " failed");
    if (failed > 0) process.exit(1);
} catch(e) {
    console.error(e);
    process.exit(1);
}
