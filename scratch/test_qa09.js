const fs = require('fs');
const vm = require('vm');
const html = fs.readFileSync('f:/PortalCapacitacion/ADRYAN_Learning_Functional_Prototype.html', 'utf8');

const scriptRegex = /<script>([\s\S]*?)<\/script>/g;
let match;
let fullScript = '';
while ((match = scriptRegex.exec(html)) !== null) { fullScript += match[1] + '\n'; }

const dummyJQuery = function() { return { ready: () => {}, on: () => {}, append: () => {}, html: () => {}, attr: () => {}, addClass: () => {}, removeClass: () => {}, val: () => '' }; };
dummyJQuery.ready = () => {};
const mockStorage = {};
const localStorage = { getItem: k => mockStorage[k] || null, setItem: (k,v) => mockStorage[k]=String(v), removeItem: k => delete mockStorage[k], clear: () => Object.keys(mockStorage).forEach(k => delete mockStorage[k]) };
function MockToast() {} MockToast.prototype.show = function() {};
const bootstrap = { Toast: MockToast };
const locationObj = { hash: '#/dashboard' };
const context = { console: { log: console.log, warn: () => {}, error: () => {} }, $: dummyJQuery, jQuery: dummyJQuery, location: locationObj, document: { readyState: 'complete', getElementById: () => null, location: locationObj, createElement: () => ({ getAttribute: () => null, querySelector: () => null, querySelectorAll: () => [] }) }, localStorage, bootstrap, setTimeout: () => {}, clearTimeout: () => {} };
context.window = context; context.document.defaultView = context.window;
vm.createContext(context);
vm.runInContext(fullScript, context);

vm.runInContext(`
    const activeTenant = TenantContext.getCurrentTenantId();
    const testEmpId = AppState.session ? AppState.session.employeeId : "EMP-0001635";

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
    console.log("qa09HtmlStep1 includes 75%:", qa09HtmlStep1.includes("75%"));
    console.log("qa09HtmlStep1 includes aria-valuenow 75:", qa09HtmlStep1.includes('aria-valuenow="75"'));
`, context);
