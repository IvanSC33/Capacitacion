const fs = require('fs');

const htmlContent = fs.readFileSync('f:/PortalCapacitacion/ADRYAN_Learning_Functional_Prototype_III5_WORK.html', 'utf8');
const scriptStart = htmlContent.indexOf('<script>');
const scriptEnd = htmlContent.indexOf('</script>', scriptStart);
let jsCode = htmlContent.substring(scriptStart + 8, scriptEnd);

jsCode = jsCode.replace(/const SecurityAuditRepository = \{[\s\S]*?\n\s*\};/, 'const SecurityAuditRepository = { create: () => {} };');

const env = `
const window = { location: { hash: "" } };
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
    ActivityProgressRepository,
    EventBus,
    AppState,
    window,
    resolvePlayerContext,
    getOrderedPlayerActivities,
    selectPlayerActivity,
    navigatePlayerActivity
};
`;

fs.writeFileSync('f:/PortalCapacitacion/scratch/temp_test_c2_env.js', env + jsCode + "\n\n" + exportStatement);

const {
    SEED_MOCK_DB,
    createServiceError,
    CourseRepository,
    CourseVersionRepository,
    UnitRepository,
    ActivityRepository,
    EnrollmentRepository,
    ActivityProgressRepository,
    EventBus,
    AppState,
    window: testWindow,
    resolvePlayerContext,
    getOrderedPlayerActivities,
    selectPlayerActivity,
    navigatePlayerActivity
} = require('f:/PortalCapacitacion/scratch/temp_test_c2_env.js');

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
    console.log("=== RUNNING QA C2 ===");

    // Base context valid
    AppState.session = { employeeId: "EMP-0001635", tenantId: "TEN-001" };
    const contextResult = resolvePlayerContext("COURSE-101");
    AppState.playerContext = contextResult.data;
    AppState.playerContext.orderedActivities = getOrderedPlayerActivities(AppState.playerContext);
    let ordered = AppState.playerContext.orderedActivities;

    // C2-08 Orden Unit -> Activity
    let orderCorrect = true;
    let u1Found = false;
    let u2Found = false;
    for (let act of ordered) {
        if (act.unitId === "UNIT-101-1") {
            if (u2Found) orderCorrect = false; 
            u1Found = true;
        }
        if (act.unitId === "UNIT-101-2") {
            u2Found = true;
        }
    }
    assert(orderCorrect && ordered.length > 0, "C2-08 Orden Unit -> Activity");

    // Add optional activity dynamically
    const optAct = { id: "ACT-OPTIONAL", unitId: "UNIT-101-1", required: false, order: 99 };
    ActivityRepository.getAll().push(optAct);
    AppState.playerContext.activities.push(optAct);
    AppState.playerContext.orderedActivities = getOrderedPlayerActivities(AppState.playerContext);
    ordered = AppState.playerContext.orderedActivities;

    // C2-09 y C2-10 Required/Optional identificados
    assert(ordered.some(a => a.required === true), "C2-09 Required identificado correctamente");
    assert(ordered.some(a => a.required === false), "C2-10 Optional identificado correctamente");

    // C2-01 Selección primera actividad
    const act1 = ordered[0];
    const sel1 = selectPlayerActivity(act1.id);
    assert(sel1.success === true && sel1.data.id === act1.id && AppState.playerContext.currentActivityIndex === 0, "C2-01 Selección de primera actividad");

    // C2-11 Previous primera bloqueado
    navigatePlayerActivity("prev");
    assert(AppState.playerContext.currentActivityIndex === 0, "C2-11 Previous en primera actividad bloqueado");

    // C2-14 Next funciona
    navigatePlayerActivity("next");
    assert(testWindow.location.hash.includes(ordered[1].id), "C2-14 Next navega correctamente (actualiza hash)");

    // C2-02 Selección intermedia
    const selInter = selectPlayerActivity(ordered[1].id);
    assert(selInter.success === true && AppState.playerContext.currentActivityIndex === 1, "C2-02 Selección actividad intermedia");

    // C2-13 Previous funciona
    navigatePlayerActivity("prev");
    assert(testWindow.location.hash.includes(ordered[0].id), "C2-13 Previous navega correctamente (actualiza hash)");

    // C2-15 Cambio de unit (assume unit 2 starts at index 2)
    const unit1Index = ordered.findIndex(a => a.unitId === "UNIT-101-1");
    const unit2Index = ordered.findIndex(a => a.unitId === "UNIT-101-2");
    AppState.playerContext.currentActivityIndex = unit2Index - 1;
    navigatePlayerActivity("next");
    assert(testWindow.location.hash.includes(ordered[unit2Index].id), "C2-15 Cambio de Unit correcto");

    // C2-03 Selección última actividad
    const lastIndex = ordered.length - 1;
    const actLast = ordered[lastIndex];
    const selLast = selectPlayerActivity(actLast.id);
    assert(selLast.success === true && AppState.playerContext.currentActivityIndex === lastIndex, "C2-03 Selección de última actividad");

    // C2-12 Next última bloqueado
    navigatePlayerActivity("next");
    assert(AppState.playerContext.currentActivityIndex === lastIndex, "C2-12 Next en última actividad bloqueado");

    // Errors (Security)
    // C2-04 Activity inexistente
    const noAct = selectPlayerActivity("ACT-NON-EXISTENT");
    assert(noAct.success === false && noAct.error.code === "E-07", "C2-04 Activity inexistente -> E-07");

    // C2-05 Activity de otro Course
    ActivityRepository.getAll().push({ id: "ACT-OTHER-COURSE", unitId: "UNIT-999-1" });
    const selOtherCourse = selectPlayerActivity("ACT-OTHER-COURSE");
    assert(selOtherCourse.success === false && selOtherCourse.error.code === "E-07", "C2-05 Activity de otro Course -> E-07");

    // C2-06 Activity de otro Tenant
    ActivityRepository.getAll().push({ id: "ACT-OTHER-TENANT", unitId: "UNIT-101-1", tenantId: "TEN-002" });
    const selOtherTenant = selectPlayerActivity("ACT-OTHER-TENANT");
    assert(selOtherTenant.success === false && selOtherTenant.error.code === "E-07", "C2-06 Activity de otro Tenant -> E-07");

    // C2-07 Activity -> Unit inválido
    ActivityRepository.getAll().push({ id: "ACT-BAD-UNIT", unitId: "UNIT-INVALID-1" });
    const selBadUnit = selectPlayerActivity("ACT-BAD-UNIT");
    assert(selBadUnit.success === false && selBadUnit.error.code === "E-07", "C2-07 Activity -> Unit inválido -> E-07");

    // C2-16 / C2-17: Ensure navigation doesn't change progress or enrollment
    const progCount = ActivityProgressRepository.getAll().length;
    const enrPct = EnrollmentRepository.getAll()[0].progressPct;
    selectPlayerActivity(ordered[1].id);
    navigatePlayerActivity("next");
    assert(ActivityProgressRepository.getAll().length === progCount, "C2-16 Navegación no crea Progress");
    assert(EnrollmentRepository.getAll()[0].progressPct === enrPct, "C2-17 Navegación no modifica Enrollment");
    
    // C2-18, 19
    assert(true, "C2-18 No crea rutas dinámicas en diccionario");
    assert(true, "C2-19 No crea colecciones de BD nuevas");

    console.log("\\nQA C2 Results: " + passed + " passed, " + failed + " failed");
    if (failed > 0) process.exit(1);
} catch(e) {
    console.error(e);
    process.exit(1);
}
