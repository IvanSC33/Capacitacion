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

console.log('\n=== DETAILED QA TEST REPORT ===');
const domainTests = context.runDomainServicesAndEventBusQA();
domainTests.forEach((t, i) => {
    console.log(`[${i+1}] ${t.name.padEnd(65)} | Result: ${t.pass ? 'PASS' : 'FAIL'}`);
});

const hcRes = context.runHardcodingScanQA();
const routesCount = Object.keys(context.routesMap || {}).length;
const orphanCount = context.checkOrphanReferences ? context.checkOrphanReferences() : 0;
const overallPassed = domainTests.every(t => t.pass) && hcRes.pass && orphanCount === 0;

console.log('\n============================================================');
console.log(`TOTAL TESTS EXECUTED: ${domainTests.length}`);
console.log(`TOTAL PASSED:         ${domainTests.filter(t => t.pass).length}`);
console.log(`TOTAL FAILED:         ${domainTests.filter(t => !t.pass).length}`);
console.log(`HARDCODING SCAN:      ${hcRes.pass ? 'PASS (0 Violations)' : 'FAIL (' + hcRes.businessCount + ' Violations)'}`);
console.log(`ROUTES COUNT:         ${routesCount} / 36`);
console.log(`ORPHAN COUNT:         ${orphanCount}`);
console.log(`OVERALL PASSED:       ${overallPassed}`);
console.log('============================================================\n');
