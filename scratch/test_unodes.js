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
    CourseRepository.create({ id: "COURSE-PLAYER-UORDER", title: "Unit Order Course", tenantId: activeTenant, currentVersionId: "CVERS-PLAYER-UORDER" });
    CourseVersionRepository.create({ id: "CVERS-PLAYER-UORDER", courseId: "COURSE-PLAYER-UORDER", version: "v1.0", status: "Published", tenantId: activeTenant });
    UnitRepository.create({ id: "UNIT-PLAYER-03", courseVersionId: "CVERS-PLAYER-UORDER", title: "Unidad Z (Order 3)", order: 3, tenantId: activeTenant });
    UnitRepository.create({ id: "UNIT-PLAYER-01", courseVersionId: "CVERS-PLAYER-UORDER", title: "Unidad A (Order 1)", order: 1, tenantId: activeTenant });
    UnitRepository.create({ id: "UNIT-PLAYER-02", courseVersionId: "CVERS-PLAYER-UORDER", title: "Unidad M (Order 2)", order: 2, tenantId: activeTenant });
    ActivityRepository.create({ id: "ACT-PLAYER-U01", unitId: "UNIT-PLAYER-01", title: "Act U1", order: 1, tenantId: activeTenant });
    ActivityRepository.create({ id: "ACT-PLAYER-U02", unitId: "UNIT-PLAYER-02", title: "Act U2", order: 1, tenantId: activeTenant });
    ActivityRepository.create({ id: "ACT-PLAYER-U03", unitId: "UNIT-PLAYER-03", title: "Act U3", order: 1, tenantId: activeTenant });
    window.location.hash = "#/player?id=COURSE-PLAYER-UORDER";
    const pQa11Html = renderScreenPlayer();
    
    const pQa11Container = document.createElement("div");
    pQa11Container.innerHTML = pQa11Html;
    const uNodes = pQa11Container.querySelectorAll("[data-unit-id]");
    console.log("uNodes inside prototype script:", uNodes ? uNodes.length : null);
`, context);
