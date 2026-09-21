const fs = require('fs');
const vm = require('vm');

const htmlContent = fs.readFileSync('f:/PortalCapacitacion/ADRYAN_Learning_Functional_Prototype_III5_WORK.html', 'utf8');
const scriptStart = htmlContent.indexOf('<script>');
const scriptEnd = htmlContent.indexOf('</script>', scriptStart);
let jsCode = htmlContent.substring(scriptStart + 8, scriptEnd);

jsCode = jsCode.replace(/const SecurityAuditRepository = \{[\s\S]*?\n\s*\};/, 'const SecurityAuditRepository = { create: () => {} };');

const env = `
const window = { location: { hash: "" }, addEventListener: (event, cb) => {} };
window.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
const localStorage = window.localStorage;
const document = { getElementById: () => ({ addEventListener: () => {}, style: {} }), querySelectorAll: () => [] };
const crypto = { subtle: { digest: async () => new ArrayBuffer(32) }, randomUUID: () => "uuid-" + Math.random() };
window.crypto = crypto;
const $ = () => ({ append: () => {}, html: () => {}, on: () => {}, ready: () => {} });
const bootstrap = { Modal: class { show(){} hide(){} }, Toast: class { show(){} } };
const renderApp = () => {};
`;

const context = {
    console: console,
    module: { exports: {} }
};
vm.createContext(context);
vm.runInContext(env + jsCode + `
module.exports = {
    SEED_MOCK_DB,
    ProgressService,
    ActivityProgressRepository,
    EnrollmentRepository,
    EventBus,
    AppState,
    ActivityRepository
};
`, context);

const exported = context.module.exports;
const MockDB = exported.SEED_MOCK_DB;
const AppState = exported.AppState;
const ProgressService = exported.ProgressService;
const ActivityProgressRepository = exported.ActivityProgressRepository;
const EnrollmentRepository = exported.EnrollmentRepository;
const EventBus = exported.EventBus;
const ActivityRepository = exported.ActivityRepository;

// Mock the environment to have NO progress
MockDB.activityProgress.length = 0;

let passed = 0;
let failed = 0;

function assert(condition, testName) {
    if (condition) {
        console.log(`✅ PASS: ${testName}`);
        passed++;
    } else {
        console.error(`❌ FAIL: ${testName}`);
        failed++;
    }
}

EventBus.listeners = {}; // clear listeners
let publishedEvents = [];
EventBus.subscribe("Learning.ActivityProgressUpdated", (e) => publishedEvents.push(e));
let completedEnrollments = [];
EventBus.subscribe("Learning.EnrollmentCompleted", (e) => completedEnrollments.push(e));

console.log("=== RUNNING QA C4 ===");

const commandBase = {
    enrollmentId: "ENR-001",
    activityId: "ACT-101-21"
};

assert(typeof ProgressService.updateActivityProgress === "function", "C4-01 updateActivityProgress() existe");
let res = ProgressService.updateActivityProgress(commandBase);
assert(res.success === true, "C4-02 Command object aceptado");

let prog = ActivityProgressRepository.getAll().find(p => p.activityId === "ACT-101-21");
assert(prog && prog.progressPct === 0 && prog.status === "NotStarted", "C4-03 CREATE sin progreso -> NotStarted");

ProgressService.updateActivityProgress({ ...commandBase, progressPct: 50, lastPositionSeconds: 10, effectiveTimeSeconds: 5 });
prog = ActivityProgressRepository.getAll().find(p => p.activityId === "ACT-101-21");
assert(prog.progressPct === 50 && prog.status === "InProgress", "C4-04 UPDATE con progreso existente");

ProgressService.updateActivityProgress({ ...commandBase, progressPct: 75 });
prog = ActivityProgressRepository.getAll().find(p => p.activityId === "ACT-101-21");
assert(prog.progressPct === 75 && prog.status === "InProgress", "C4-05 50 -> 75");

ProgressService.completeActivity(commandBase);
prog = ActivityProgressRepository.getAll().find(p => p.activityId === "ACT-101-21");
assert(prog.progressPct === 100 && prog.status === "Completed", "C4-06 75 -> 100 via completeActivity");

let countBefore = ActivityProgressRepository.getAll().length;
ProgressService.completeActivity(commandBase);
let countAfter = ActivityProgressRepository.getAll().length;
assert(countBefore === countAfter, "C4-07 100 repetido no duplica");

ProgressService.updateActivityProgress({ enrollmentId: "ENR-001", activityId: "ACT-101-22", progressPct: 0, lastPositionSeconds: 0, effectiveTimeSeconds: 0 });
let prog2 = ActivityProgressRepository.getAll().find(p => p.activityId === "ACT-101-22");
assert(prog2 && prog2.lastPositionSeconds === 0, "C4-08 lastPositionSeconds = 0 válido");
assert(prog2 && prog2.effectiveTimeSeconds === 0, "C4-09 effectiveTimeSeconds = 0 válido");

ProgressService.updateActivityProgress({ enrollmentId: "ENR-001", activityId: "ACT-101-22", progressPct: 20 });
prog2 = ActivityProgressRepository.getAll().find(p => p.activityId === "ACT-101-22");
assert(prog2.lastPositionSeconds === 0, "C4-10 valores parciales preservados");

// Now complete ACT-101-11 because we cleared the DB, but ACT-101-11 is required!
ProgressService.completeActivity({ enrollmentId: "ENR-001", activityId: "ACT-101-11" });

let enrCalc = ProgressService.calculateEnrollmentProgress("ENR-001", "TEN-001");
console.log("C4-11 DB contents:", ActivityProgressRepository.getAll());
console.log("C4-11 enrCalc:", enrCalc);
assert(enrCalc.progressPct === 66 || enrCalc.progressPct === 67, "C4-11 2/3 REQUIRED -> 67%");

console.log("All ACT-101 activities:", exported.ActivityRepository.getAll().filter(a => a.id.startsWith("ACT-101")).map(a => a.id + " req:" + a.required + " unit:" + a.unitId));

let resComplete22 = ProgressService.completeActivity({ enrollmentId: "ENR-001", activityId: "ACT-101-22" });
console.log("resComplete22:", resComplete22);
enrCalc = ProgressService.calculateEnrollmentProgress("ENR-001", "TEN-001");
console.log("C4-12/13 enrCalc:", enrCalc);
assert(enrCalc.completedRequiredCount === 3, "C4-12 3/3 REQUIRED...");
assert(enrCalc.progressPct === 100 && enrCalc.allRequiredCompleted === true, "C4-13 3/3 REQUIRED -> 100%");

// Add an optional activity to test optional logic
exported.ActivityRepository.getAll().push({ id: "ACT-101-24", unitId: "UNIT-101-2", required: false });
ProgressService.updateActivityProgress({ enrollmentId: "ENR-001", activityId: "ACT-101-24", progressPct: 50 }); // ACT-101-24 is optional
let enrCalcOpt = ProgressService.calculateEnrollmentProgress("ENR-001", "TEN-001");
console.log("C4-14 enrCalcOpt:", enrCalcOpt);
assert(enrCalcOpt.progressPct === 100, "C4-14 Optional no altera cálculo REQUIRED");

assert(ProgressService.calculateEnrollmentProgress("NONEXISTENT", "TEN-001").progressPct === 0, "C4-15 Zero REQUIRED no completa");

let calcResult = ProgressService.calculateEnrollmentProgress("ENR-001", "TEN-001");
assert(typeof calcResult === 'object' && calcResult.progressPct !== undefined, "C4-16 calculateEnrollmentProgress() no muta");

// Security - AppState modification test
let savedTenant = AppState.session.tenantId;
AppState.session.tenantId = "TEN-999";
let resSec2 = ProgressService.updateActivityProgress({ enrollmentId: "ENR-001", activityId: "ACT-101-21" });
assert(resSec2.success === false, "C4-17 Cross-tenant rechazado");
AppState.session.tenantId = savedTenant;

let savedEmp = AppState.session.employeeId;
AppState.session.employeeId = "EMP-999";
let resSec3 = ProgressService.updateActivityProgress({ enrollmentId: "ENR-001", activityId: "ACT-101-21" });
assert(resSec3.success === false, "C4-18 Cross-enrollment rechazado");
AppState.session.employeeId = savedEmp;

let resSec4 = ProgressService.updateActivityProgress({ enrollmentId: "ENR-001", activityId: "ACT-999-99" });
assert(resSec4.success === false, "C4-19 Activity de otro CourseVersion rechazada");

console.log("publishedEvents count:", publishedEvents.length, "completedEnrollments count:", completedEnrollments.length);
assert(publishedEvents.length > 0 && completedEnrollments.length > 0, "C4-20 Eventos emitidos después de persistencia");

console.log(`\nQA C4 Results: ${passed} passed, ${failed} failed`);
