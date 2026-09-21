const fs = require('fs');
const vm = require('vm');
const html = fs.readFileSync('f:/PortalCapacitacion/ADRYAN_Learning_Functional_Prototype.html', 'utf8');

const scriptRegex = /<script>([\s\S]*?)<\/script>/g;
let match;
let fullScript = '';
while ((match = scriptRegex.exec(html)) !== null) { fullScript += match[1] + '\n'; }

const dummyJQuery = function() { return { ready: function() {}, on: function() {}, append: function() {}, html: function() {}, attr: function() {}, addClass: function() {}, removeClass: function() {}, val: function() { return ''; } }; };
dummyJQuery.ready = function() {};
const mockStorage = {};
const localStorage = { getItem: (k) => mockStorage[k] || null, setItem: (k, v) => { mockStorage[k] = String(v); }, removeItem: (k) => { delete mockStorage[k]; }, clear: () => {} };
const bootstrap = { Toast: function() { return { show: function() {} }; } };
const locationObj = { hash: '#/dashboard' };

const context = { console, $: dummyJQuery, jQuery: dummyJQuery, location: locationObj, document: { readyState: 'complete', getElementById: () => null, createElement: (t) => ({ getAttribute: () => null, querySelector: () => null, querySelectorAll: () => [] }) }, localStorage, bootstrap, setTimeout: () => {}, clearTimeout: () => {} };
context.window = context;

vm.createContext(context);
vm.runInContext(fullScript, context);

context.runDomainServicesAndEventBusQA();
context.AppState.session.tenantId = 'TEN-001';
context.AppState.session.role = 'HRAdmin';
context.AppState.session.employeeId = 'EMP-0001635';

// Run QA-09 test logic manually to inspect
const activeTenant = 'TEN-001';
const testEmpId = 'EMP-0001635';

context.CourseRepository.create({ id: "COURSE-TEMP-PROG", title: "Progress Test Course", tenantId: activeTenant, currentVersionId: "CVERS-TEMP-PROG" });
context.CourseVersionRepository.create({ id: "CVERS-TEMP-PROG", courseId: "COURSE-TEMP-PROG", version: "v1.0", status: "Published", tenantId: activeTenant });
const uProg = context.UnitRepository.create({ id: "UNIT-TEMP-PROG", courseVersionId: "CVERS-TEMP-PROG", title: "Unidad Progreso", order: 1, tenantId: activeTenant });
const actProg1 = context.ActivityRepository.create({ id: "ACT-TEMP-P1", unitId: uProg.id, title: "Act 1", order: 1, tenantId: activeTenant });
const actProg2 = context.ActivityRepository.create({ id: "ACT-TEMP-P2", unitId: uProg.id, title: "Act 2", order: 2, tenantId: activeTenant });

const enrProg = context.EnrollmentRepository.create({ id: "ENR-TEMP-PROG", employeeId: testEmpId, courseId: "COURSE-TEMP-PROG", courseVersionId: "CVERS-TEMP-PROG", status: "Active", progressPct: 0, tenantId: activeTenant });
const ap1 = context.ActivityProgressRepository.create({ id: "AP-TEMP-1", enrollmentId: enrProg.id, activityId: actProg1.id, progressPct: 100, tenantId: activeTenant });
const ap2 = context.ActivityProgressRepository.create({ id: "AP-TEMP-2", enrollmentId: enrProg.id, activityId: actProg2.id, progressPct: 50, tenantId: activeTenant });

context.location.hash = "#/course?id=COURSE-TEMP-PROG";
const qa09HtmlStep1 = context.renderScreenCourseDetail();

console.log('qa09HtmlStep1 contains 75%:', qa09HtmlStep1.includes('75%'));
console.log('qa09HtmlStep1 contains aria-valuenow="75":', qa09HtmlStep1.includes('aria-valuenow="75"'));
