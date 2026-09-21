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
    EventBus,
    EnrollmentService,
    ProgressService,
    TenantContext,
    AuthorizationService,
    ActivityProgressRepository,
    UnitRepository,
    ActivityRepository,
    EnrollmentRepository,
    AppState
};
`;

fs.writeFileSync('f:/PortalCapacitacion/scratch/temp_test_env_v3.js', env + jsCode + exportStatement);

const {
    SEED_MOCK_DB,
    EventBus,
    EnrollmentService,
    ProgressService,
    TenantContext,
    AuthorizationService,
    ActivityProgressRepository,
    UnitRepository,
    ActivityRepository,
    EnrollmentRepository,
    AppState
} = require('f:/PortalCapacitacion/scratch/temp_test_env_v3.js');

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

AuthorizationService.can = () => true;
AuthorizationService.checkScope = () => true;
AuthorizationService.logSecurity = () => {};
TenantContext.getCurrentTenantId = () => "TEN-001";

try {
    console.log("=== RUNNING BLOCK B TESTS ===");

    const enrollment = SEED_MOCK_DB.enrollments[0]; 
    const activity1 = SEED_MOCK_DB.learningActivities.find(a => a.id === "ACT-101-22"); 
    const activity2 = SEED_MOCK_DB.learningActivities.find(a => a.id === "ACT-101-21"); 
    
    // Clear event bus
    if (EventBus.clear) EventBus.clear();
    const events = [];
    EventBus.subscribe("Learning.ActivityProgressUpdated", (payload) => { events.push(payload); });
    EventBus.subscribe("Learning.EnrollmentCompleted", (payload) => { events.push(payload); });

    // Ensure pristine db state for tests
    const enrollmentStart = EnrollmentRepository.getById(enrollment.id);
    enrollmentStart.progressPct = 0;
    ActivityProgressRepository.getAll(false).length = 0;

    // --- Smoke Test: 50 -> 75 -> 100 ---
    console.log("--- Executing 50 -> 75 -> 100 flow ---");
    
    // Paso 1: 50%
    const res50 = ProgressService.updateActivityProgress({
        enrollmentId: enrollment.id,
        activityId: activity1.id, // A required activity
        progressPct: 50
    });
    const prog50 = ActivityProgressRepository.getByEnrollment(enrollment.id).find(p => p.activityId === activity1.id);
    const enr50 = EnrollmentRepository.getById(enrollment.id);
    assert(prog50.status === "InProgress" && prog50.progressPct === 50, "Paso 1: ActivityProgress InProgress 50%");
    assert(enr50.progressPct === 0 && enr50.status === "Active", "Paso 1: Enrollment.progressPct = 0, Active", `Got progressPct=${enr50.progressPct}, status=${enr50.status}`);

    // Paso 2: 75%
    const res75 = ProgressService.updateActivityProgress({
        enrollmentId: enrollment.id,
        activityId: activity1.id,
        progressPct: 75
    });
    const prog75 = ActivityProgressRepository.getByEnrollment(enrollment.id).find(p => p.activityId === activity1.id);
    const enr75 = EnrollmentRepository.getById(enrollment.id);
    assert(prog75.status === "InProgress" && prog75.progressPct === 75, "Paso 2: ActivityProgress InProgress 75%");
    assert(enr75.progressPct === 0 && enr75.status === "Active", "Paso 2: Enrollment.progressPct = 0, Active", `Got progressPct=${enr75.progressPct}, status=${enr75.status}`);

    // Paso 3: 100%
    events.length = 0;
    const res100 = ProgressService.updateActivityProgress({
        enrollmentId: enrollment.id,
        activityId: activity1.id,
        progressPct: 100
    });
    const prog100 = ActivityProgressRepository.getByEnrollment(enrollment.id).find(p => p.activityId === activity1.id);
    const enr100 = EnrollmentRepository.getById(enrollment.id);
    
    assert(prog100.status === "Completed" && prog100.progressPct === 100 && prog100.completedAt !== null, "Paso 3: ActivityProgress Completed 100%");
    assert(res100.data.status === "Completed", "Retorno de updateActivityProgress es coherente con estado final (Completed)");
    
    // There are 3 required activities total. completing 1 means 33%.
    assert(enr100.progressPct === 33 && enr100.status === "Active", "Paso 3: Enrollment.progressPct = 33, Active", `Got progressPct=${enr100.progressPct}, status=${enr100.status}`);

    // Check Events on 100% completion
    const actsEvents = events.filter(e => e.eventType === "Learning.ActivityProgressUpdated");
    assert(actsEvents.length === 1, "Un solo ActivityProgressUpdated emitido en paso a 100%");
    // The event payload should match the initial creation/update which triggers completion
    const theEvent = actsEvents[0];
    assert(theEvent.payload.progressPct === 100, "Evento contiene progressPct 100");

    // --- UTs ---
    // UT-02 Idempotencia
    const resIdemp = ProgressService.updateActivityProgress({
        enrollmentId: enrollment.id,
        activityId: activity1.id,
        progressPct: 100
    });
    const finalProgList = ActivityProgressRepository.getByEnrollment(enrollment.id).filter(p => p.activityId === activity1.id);
    assert(finalProgList.length === 1, "Idempotencia: solo 1 registro físico para la actividad");

    // Optional Activities Test
    // Create an optional activity and update it to 100%
    ActivityRepository.create({ id: "OPT-1", unitId: "UNIT-101-2", required: false });
    ProgressService.updateActivityProgress({
        enrollmentId: enrollment.id,
        activityId: "OPT-1",
        progressPct: 100
    });
    const enrAfterOpt = EnrollmentRepository.getById(enrollment.id);
    assert(enrAfterOpt.progressPct === 33, "Actividades opcionales no alteran el cálculo de Enrollment.progressPct", `Got progressPct=${enrAfterOpt.progressPct}`);

    // Zero Required Test
    // We mock ActivityRepository to return only optional activities for a test enrollment
    const originalEnrGetById = EnrollmentRepository.getById;
    const originalUnitGetByCourseVersion = UnitRepository.getByCourseVersion;
    const originalActFind = ActivityRepository.find;
    const originalProgGetByEnr = ActivityProgressRepository.getByEnrollment;

    function testCalc(testName, requiredCount, completedCount, expectedPct, expectedComplete) {
        EnrollmentRepository.getById = () => ({ id: "TEST-ENR", tenantId: "TEN-001", courseVersionId: "CV-1" });
        UnitRepository.getByCourseVersion = () => [{ id: "U-1" }];
        
        let acts = [];
        for(let i=0; i<requiredCount; i++) acts.push({ id: "A-"+i, unitId: "U-1", required: true });
        ActivityRepository.find = () => acts;

        let progs = [];
        for(let i=0; i<completedCount; i++) progs.push({ activityId: "A-"+i, progressPct: 100 });
        ActivityProgressRepository.getByEnrollment = () => progs;

        const calc = ProgressService.calculateEnrollmentProgress("TEST-ENR", "TEN-001");
        assert(calc.progressPct === expectedPct && calc.allRequiredCompleted === expectedComplete, "Smoke Test: " + testName);
    }

    testCalc("Caso A (1 req, 1 comp)", 1, 1, 100, true);
    testCalc("Caso B (2 req, 1 comp)", 2, 1, 50, false);
    testCalc("Caso C (3 req, 1 comp)", 3, 1, 33, false);
    testCalc("Caso D (3 req, 2 comp)", 3, 2, 67, false);
    testCalc("Caso E (3 req, 3 comp)", 3, 3, 100, true);
    testCalc("Caso F (0 req, 0 comp)", 0, 0, 0, false);

    // Restore Repositories
    EnrollmentRepository.getById = originalEnrGetById;
    UnitRepository.getByCourseVersion = originalUnitGetByCourseVersion;
    ActivityRepository.find = originalActFind;
    ActivityProgressRepository.getByEnrollment = originalProgGetByEnr;

    // Test Zero required activities auto-complete (should NOT complete)
    const enrZero = ProgressService.calculateEnrollmentProgress("TEST-ENR", "TEN-001"); // It will use restored methods but there is no TEST-ENR so it returns 0.
    
    // UT-07
    const res7 = ProgressService.updateActivityProgress({
        enrollmentId: enrollment.id,
        activityId: "ACT-102-11", // Outside course
        progressPct: 50
    });
    assert(res7.success === false && res7.error.code === "E-07", "UT-07: Error E-07 por actividad no perteneciente al curso");

    // UT-08
    const oldEmpId = AppState.session.employeeId;
    AppState.session.employeeId = "EMP-9999999"; // diff employee
    const res8 = ProgressService.updateActivityProgress({
        enrollmentId: enrollment.id,
        activityId: activity1.id,
        progressPct: 50
    });
    assert(res8.success === false && res8.error.code === "E-10", "UT-08: Error E-10 por aislamiento employeeId/tenant");
    AppState.session.employeeId = oldEmpId; // restore

    // Complete all required
    events.length = 0;
    ProgressService.updateActivityProgress({ enrollmentId: enrollment.id, activityId: "ACT-101-21", progressPct: 100 });
    ProgressService.updateActivityProgress({ enrollmentId: enrollment.id, activityId: "ACT-101-11", progressPct: 100 });
    
    const enrEvents = events.filter(e => e.eventType === "Learning.EnrollmentCompleted");
    assert(enrEvents.length > 0, "Evento Learning.EnrollmentCompleted emitido al completar todas las requeridas");
    
    const finalEnr = EnrollmentRepository.getById(enrollment.id);
    assert(finalEnr.progressPct === 100 && finalEnr.status === "Completed", "Enrollment actualizado al 100% y Completed");

    console.log("\\nTest Results: " + passed + " passed, " + failed + " failed");
    if (failed > 0) process.exit(1);
} catch (e) {
    console.error(e);
    process.exit(1);
}
