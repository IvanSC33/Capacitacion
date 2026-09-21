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
    CourseRepository.create({ id: "COURSE-TEMP-INC", title: "Incomplete Course", tenantId: activeTenant, currentVersionId: "CVERS-TEMP-INC" });
    CourseVersionRepository.create({ id: "CVERS-TEMP-INC", courseId: "COURSE-TEMP-INC", version: "v1.0", status: "Published", tenantId: activeTenant });
    UnitRepository.create({ id: "UNIT-TEMP-INC", courseVersionId: "CVERS-TEMP-INC", title: "Unidad Datos Incompletos", order: 1, tenantId: activeTenant });
    ActivityRepository.create({ id: "ACT-TEMP-INC", unitId: "UNIT-TEMP-INC", title: "Actividad Datos Incompletos", order: 1, tenantId: activeTenant });

    window.location.hash = "#/course?id=COURSE-TEMP-INC";
    const incHtml = renderScreenCourseDetail();
    console.log("incHtml includes No disponible:", incHtml.includes("No disponible"));
    console.log("incHtml includes Sin descripción disponible.:", incHtml.includes("Sin descripción disponible."));
    console.log("incHtml includes data-unit-id UNIT-TEMP-INC:", incHtml.includes('data-unit-id="UNIT-TEMP-INC"'));
    console.log("incHtml includes data-activity-id ACT-TEMP-INC:", incHtml.includes('data-activity-id="ACT-TEMP-INC"'));
`, context);
