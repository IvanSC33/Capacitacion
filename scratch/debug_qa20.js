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

function makeSimulatedElement(tagName = 'DIV') {
    let htmlContent = '';
    return {
        tagName: tagName.toUpperCase(),
        get innerHTML() { return htmlContent; },
        set innerHTML(val) { htmlContent = String(val); },
        get textContent() { return htmlContent.replace(/<[^>]*>/g, ''); },
        getAttribute(attrName) {
            const regex = new RegExp(attrName + '=["\']([^"\']*)["\']', 'i');
            const m = htmlContent.match(regex);
            return m ? m[1] : null;
        },
        querySelector(selector) {
            const list = this.querySelectorAll(selector);
            return list.length > 0 ? list[0] : null;
        },
        querySelectorAll(selector) {
            return [];
        }
    };
}

const context = { console, $: dummyJQuery, jQuery: dummyJQuery, location: locationObj, document: { readyState: 'complete', getElementById: () => null, createElement: (t) => makeSimulatedElement(t) }, localStorage, bootstrap, setTimeout: () => {}, clearTimeout: () => {} };
context.window = context;

vm.createContext(context);
vm.runInContext(fullScript, context);

context.runDomainServicesAndEventBusQA();
context.AppState.session.tenantId = 'TEN-001';
context.AppState.session.role = 'HRAdmin';
context.AppState.session.employeeId = 'EMP-0001635';

context.CourseRepository.create({ id: "COURSE-TEMP-UORDER", title: "Unit Order Course", tenantId: "TEN-001", currentVersionId: "CVERS-TEMP-UORDER" });
context.CourseVersionRepository.create({ id: "CVERS-TEMP-UORDER", courseId: "COURSE-TEMP-UORDER", version: "v1.0", status: "Published", tenantId: "TEN-001" });
context.UnitRepository.create({ id: "UNIT-TEMP-03", courseVersionId: "CVERS-TEMP-UORDER", title: "Unidad C - Tercera", order: 3, tenantId: "TEN-001" });
context.UnitRepository.create({ id: "UNIT-TEMP-01", courseVersionId: "CVERS-TEMP-UORDER", title: "Unidad A - Primera", order: 1, tenantId: "TEN-001" });
context.UnitRepository.create({ id: "UNIT-TEMP-02", courseVersionId: "CVERS-TEMP-UORDER", title: "Unidad B - Segunda", order: 2, tenantId: "TEN-001" });
context.location.hash = "#/course?id=COURSE-TEMP-UORDER";
const uOrderHtml = context.renderScreenCourseDetail();

console.log('pos 01:', uOrderHtml.indexOf('UNIT-TEMP-01'));
console.log('pos 02:', uOrderHtml.indexOf('UNIT-TEMP-02'));
console.log('pos 03:', uOrderHtml.indexOf('UNIT-TEMP-03'));
