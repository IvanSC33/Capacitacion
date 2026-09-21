const fs = require('fs');

const extractedJsPath = 'f:/PortalCapacitacion/scratch/temp_extracted.js';
let jsCode = fs.readFileSync(extractedJsPath, 'utf8');

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
    EnrollmentRepository
};
`;

fs.writeFileSync('f:/PortalCapacitacion/scratch/temp_test_env_v2.js', env + jsCode + exportStatement);

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
    SecurityAuditRepository
} = require('f:/PortalCapacitacion/scratch/temp_test_env_v2.js');

let passed = 0;
let failed = 0;

function assert(condition, message) {
    if (condition) {
        passed++;
        console.log("✅ PASS: " + message);
    } else {
        failed++;
        console.error("❌ FAIL: " + message);
    }
}

AuthorizationService.can = () => true;
AuthorizationService.checkScope = () => true;
AuthorizationService.logSecurity = () => {};
TenantContext.getCurrentTenantId = () => "TEN-001";
TenantContext.getCurrentUser = () => ({ id: "EMP-0001635" });

try {
    console.log("=== RUNNING UT-01 to UT-10 ===");

    const enrollment = SEED_MOCK_DB.enrollments[0]; 
    const activity1 = SEED_MOCK_DB.learningActivities.find(a => a.id === "ACT-101-22"); 
    const activity2 = SEED_MOCK_DB.learningActivities.find(a => a.id === "ACT-101-21"); 
    
    const initialDbLength = ActivityProgressRepository.getByEnrollment(enrollment.id).length;

    // Clear event bus
    if (EventBus.clear) EventBus.clear();
    const events = [];
    EventBus.subscribe("Learning.ActivityProgressUpdated", (payload) => { events.push(payload); });
    EventBus.subscribe("Learning.EnrollmentCompleted", (payload) => { events.push(payload); });

    // UT-01
    const res1 = ProgressService.updateActivityProgress({
        enrollmentId: enrollment.id,
        activityId: activity1.id,
        progressPct: 30
    });
    assert(res1.success === true && ActivityProgressRepository.getByEnrollment(enrollment.id).length === initialDbLength + 1, "UT-01: updateActivityProgress crea registro");
    console.log("events after UT-01:", JSON.stringify(events));
    const progId = res1.success ? res1.data.id : null;

    // UT-02
    const res2 = ProgressService.updateActivityProgress({
        enrollmentId: enrollment.id,
        activityId: activity1.id,
        progressPct: 60
    });
    assert(res2.success === true && ActivityProgressRepository.getByEnrollment(enrollment.id).length === initialDbLength + 1 && res2.data.progressPct === 60, "UT-02: Idempotencia en actualización");

    // UT-03
    const res3 = ProgressService.updateActivityProgress({
        enrollmentId: enrollment.id,
        activityId: activity1.id,
        progressPct: 150
    });
    const prog3 = ActivityProgressRepository.getById(progId) || ActivityProgressRepository.getByEnrollment(enrollment.id).find(p => p.activityId === activity1.id);
    assert(prog3.progressPct === 100 && prog3.status === "Completed", "UT-03: pct > 100 normaliza a 100 y status Completed");

    // UT-04
    assert(prog3.completedAt !== null, "UT-04: completeActivity persiste completedAt ISO");

    // UT-05
    // Need to test A, B, C, D, E, F by mocking repositories temporarily
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
        assert(calc.progressPct === expectedPct && calc.allRequiredCompleted === expectedComplete, "UT-05: " + testName);
    }

    testCalc("Caso A (1 req, 1 comp)", 1, 1, 100, true);
    testCalc("Caso B (2 req, 1 comp)", 2, 1, 50, false);
    testCalc("Caso C (3 req, 1 comp)", 3, 1, 33, false);
    testCalc("Caso D (3 req, 2 comp)", 3, 2, 67, false);
    testCalc("Caso E (3 req, 3 comp)", 3, 3, 100, true);
    testCalc("Caso F (0 req, 0 comp)", 0, 0, 0, false);

    // Restore
    EnrollmentRepository.getById = originalEnrGetById;
    UnitRepository.getByCourseVersion = originalUnitGetByCourseVersion;
    ActivityRepository.find = originalActFind;
    ActivityProgressRepository.getByEnrollment = originalProgGetByEnr;

    // UT-06
    for (let i = 0; i < 5; i++) {
        ProgressService.updateActivityProgress({ enrollmentId: enrollment.id, activityId: activity2.id, progressPct: 10 });
    }
    const progList = ActivityProgressRepository.getByEnrollment(enrollment.id);
    assert(progList.filter(p => p.activityId === activity2.id).length === 1, "UT-06: Idempotencia mantenida tras multiples llamadas");

    // UT-07
    const res7 = ProgressService.updateActivityProgress({
        enrollmentId: enrollment.id,
        activityId: "ACT-102-11", // Outside course
        progressPct: 50
    });
    assert(res7.success === false && res7.error.code === "E-07", "UT-07: Error E-07 por actividad no perteneciente");

    // UT-08
    const oldEnr = EnrollmentRepository.getById(enrollment.id);
    EnrollmentRepository.getById = () => ({ id: oldEnr.id, tenantId: "TEN-999", employeeId: oldEnr.employeeId });
    const res8 = ProgressService.updateActivityProgress({
        enrollmentId: enrollment.id,
        activityId: activity1.id,
        progressPct: 50
    });
    assert(res8.success === false && res8.error.code === "E-10", "UT-08: Error E-10 por aislamiento tenant");
    EnrollmentRepository.getById = () => oldEnr; // restore

    // UT-09
    const actsEvents = events.filter(e => Object.keys(e).includes('enrollmentId') || e.eventId); 
    // Just verify that updateActivityProgress doesn't double emit if completeActivity is called
    events.length = 0;
    ProgressService.updateActivityProgress({ enrollmentId: enrollment.id, activityId: activity2.id, progressPct: 100 });
    const progEvents = events.filter(e => e.payload && e.payload.activityId === activity2.id && e.payload.progressPct === 100);
    console.log("events array:", JSON.stringify(events));
    console.log("progEvents.length:", progEvents.length);
    assert(progEvents.length === 1, "UT-09: Un solo ActivityProgressUpdated por operación de completado");

    // UT-10
    // ACT-101-11, ACT-101-21, ACT-101-22 are the 3 required.
    // 11 is 100% in db? Wait, let's complete all.
    ProgressService.updateActivityProgress({ enrollmentId: enrollment.id, activityId: "ACT-101-11", progressPct: 100 });
    const enrEvents = events.filter(e => e.payload && e.payload.scorePct === 100); // from EnrollmentCompleted
    assert(enrEvents.length > 0, "UT-10: Evento Learning.EnrollmentCompleted emitido al completar todo");

    console.log("\\nTest Results: " + passed + " passed, " + failed + " failed");
    
} catch (e) {
    console.error(e);
}
