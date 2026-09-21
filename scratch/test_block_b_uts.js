const fs = require('fs');

const extractedJsPath = 'f:/PortalCapacitacion/scratch/temp_extracted.js';
let jsCode = fs.readFileSync(extractedJsPath, 'utf8');

// We need to polyfill window and document to allow the JS to run
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
    ActivityProgressRepository
};
`;

fs.writeFileSync('f:/PortalCapacitacion/scratch/temp_test_env.js', env + jsCode + exportStatement);

const {
    SEED_MOCK_DB,
    EventBus,
    EnrollmentService,
    ProgressService,
    TenantContext,
    AuthorizationService,
    ActivityProgressRepository
} = require('f:/PortalCapacitacion/scratch/temp_test_env.js');

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

// Helper to reset mocks
function resetMocks() {
    EventBus.listeners = {};
    // reset some DB state if necessary
}

// Override auth for tests
AuthorizationService.can = () => true;
AuthorizationService.checkScope = () => true;
TenantContext.getCurrentTenantId = () => "TEN-001";
TenantContext.getCurrentUser = () => ({ id: "EMP-0001635" });

try {
    console.log("=== RUNNING UT-01 to UT-10 ===");

    // Find valid test data
    const enrollment = SEED_MOCK_DB.enrollments[0]; // ENR-001, EMP-0001635, TEN-001
    const activity1 = SEED_MOCK_DB.learningActivities.find(a => a.id === "ACT-101-22"); // required: true, doesn't exist in progress yet
    const activity2 = SEED_MOCK_DB.learningActivities.find(a => a.id === "ACT-101-21"); // required: true, exists in progress (50%)
    
    const initialDbLength = ActivityProgressRepository.getByEnrollment(enrollment.id).length;

    // UT-01
    const res1 = ProgressService.updateActivityProgress({
        enrollmentId: enrollment.id,
        activityId: activity1.id,
        progressPct: 30,
        tenantId: "TEN-001"
    });
    console.log("UT-01 res1:", res1, "DB length:", ActivityProgressRepository.getByEnrollment(enrollment.id).length);
    assert(res1.success === true && ActivityProgressRepository.getByEnrollment(enrollment.id).length === initialDbLength + 1, "UT-01: updateActivityProgress crea registro");
    const progId = res1.success ? res1.data.id : null;

    // UT-02
    const res2 = ProgressService.updateActivityProgress({
        enrollmentId: enrollment.id,
        activityId: activity1.id,
        progressPct: 60,
        tenantId: "TEN-001"
    });
    console.log("UT-02 res2:", res2, "DB length:", ActivityProgressRepository.getByEnrollment(enrollment.id).length);
    assert(res2.success === true && ActivityProgressRepository.getByEnrollment(enrollment.id).length === initialDbLength + 1 && res2.data.progressPct === 60, "UT-02: Idempotencia en actualización");

    // UT-03
    const res3 = ProgressService.updateActivityProgress({
        enrollmentId: enrollment.id,
        activityId: activity1.id,
        progressPct: 150,
        tenantId: "TEN-001"
    });
    const prog3 = ActivityProgressRepository.getById(progId) || ActivityProgressRepository.getByEnrollment(enrollment.id).find(p => p.activityId === activity1.id);
    assert(prog3.progressPct === 100 && prog3.status === "Completed", "UT-03: pct > 100 normaliza a 100 y status Completed");

    // UT-04
    assert(prog3.completedAt !== null, "UT-04: completeActivity persiste completedAt ISO");

    // UT-05 calculateEnrollmentProgress
    const calc = ProgressService.calculateEnrollmentProgress(enrollment.id, "TEN-001");
    console.log("UT-05 calc:", calc);
    // ACT-101-11 (100%), ACT-101-21 (50%), ACT-101-22 (now 100%) are required. Total 3.
    // Progress should be (100+50+100)/3 = 250/3 = 83%
    assert(calc.progressPct === 83 && calc.allRequiredCompleted === false, "UT-05: Cálculo de progreso parcial correcto");

    // UT-06 Cinco llamadas idénticas
    for (let i = 0; i < 5; i++) {
        ProgressService.updateActivityProgress({ enrollmentId: enrollment.id, activityId: activity2.id, progressPct: 10, tenantId: "TEN-001" });
    }
    const progList = ActivityProgressRepository.getByEnrollment(enrollment.id);
    assert(progList.filter(p => p.activityId === activity2.id).length === 1, "UT-06: Idempotencia mantenida tras multiples llamadas");

    // UT-07 Actividad fuera del curso
    const res7 = ProgressService.updateActivityProgress({
        enrollmentId: enrollment.id,
        activityId: "ACT-102-11", // Outside course 101
        progressPct: 50,
        tenantId: "TEN-001"
    });
    assert(res7.success === false && res7.error.code === "E-07", "UT-07: Error E-07 por actividad no perteneciente");

    // UT-08 Tenant diferente
    const res8 = ProgressService.updateActivityProgress({
        enrollmentId: enrollment.id,
        activityId: activity1.id,
        progressPct: 50,
        tenantId: "TEN-002" // Diferente tenant
    });
    assert(res8.success === false && res8.error.code === "E-10", "UT-08: Error E-10 por aislamiento tenant");

    // UT-09 Evento ActivityProgressUpdated
    let eventReceived = false;
    EventBus.subscribe("Learning.ActivityProgressUpdated", (payload) => {
        if (payload.aggregateId === progList.find(p => p.activityId === activity2.id).id) eventReceived = true;
    });
    ProgressService.updateActivityProgress({ enrollmentId: enrollment.id, activityId: activity2.id, progressPct: 20, tenantId: "TEN-001" });
    assert(eventReceived === true, "UT-09: Evento Learning.ActivityProgressUpdated emitido");

    // UT-10 Completar todas las requeridas
    let enrollmentEvent = false;
    EventBus.subscribe("Learning.EnrollmentCompleted", (payload) => {
        if (payload.aggregateId === enrollment.id) enrollmentEvent = true;
    });
    // ACT-101-11 is already completed.
    // Complete ACT-101-21
    ProgressService.updateActivityProgress({ enrollmentId: enrollment.id, activityId: activity2.id, progressPct: 100, tenantId: "TEN-001" });
    // Complete ACT-101-22
    ProgressService.updateActivityProgress({ enrollmentId: enrollment.id, activityId: "ACT-101-22", progressPct: 100, tenantId: "TEN-001" });
    
    assert(enrollmentEvent === true, "UT-10: Evento Learning.EnrollmentCompleted emitido");

    console.log("\\nTest Results: " + passed + " passed, " + failed + " failed");
    
} catch (e) {
    console.error(e);
}
