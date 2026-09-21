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
    const domainTests = runDomainServicesAndEventBusQA();
    const secTests = runSecurityNegativeTests();
    const hcRes = runHardcodingScanQA();
    const routesCount = Object.keys(routesMap || {}).length;

    console.log("\\n==================================================");
    console.log("=== FINAL QA SUITE SUMMARY ===");
    console.log("Domain Tests Total:   ", domainTests.length);
    console.log("Domain Tests Passed:  ", domainTests.filter(t => t.pass).length);
    console.log("Domain Tests Failed:  ", domainTests.filter(t => !t.pass).length);

    console.log("Security Tests Total: ", secTests.length);
    console.log("Security Tests Passed:", secTests.filter(t => t.pass).length);
    console.log("Security Tests Failed:", secTests.filter(t => !t.pass).length);

    console.log("Hardcoding Violations:", hcRes.violations.length);
    console.log("Routes Registered:    ", routesCount, "/ 36");
    console.log("==================================================\\n");
`, context);
