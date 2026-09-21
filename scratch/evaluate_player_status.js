const fs = require('fs');
const vm = require('vm');
const html = fs.readFileSync('f:/PortalCapacitacion/ADRYAN_Learning_Functional_Prototype.html', 'utf8');

const scriptRegex = /<script>([\s\S]*?)<\/script>/g;
let match;
let fullScript = '';
while ((match = scriptRegex.exec(html)) !== null) {
    fullScript += match[1] + '\n';
}

const dummyJQuery = function() {
    return { ready: () => {}, on: () => {}, append: () => {}, html: () => {}, attr: () => {}, addClass: () => {}, removeClass: () => {}, val: () => '' };
};
dummyJQuery.ready = () => {};
const mockStorage = {};
const localStorage = {
    getItem: k => mockStorage[k] || null,
    setItem: (k,v) => mockStorage[k]=String(v),
    removeItem: k => delete mockStorage[k],
    clear: () => Object.keys(mockStorage).forEach(k => delete mockStorage[k])
};

function MockToast() {}
MockToast.prototype.show = function() {};

const bootstrap = { Toast: MockToast };
const locationObj = { hash: '#/dashboard' };
const context = {
    console: { log: () => {}, warn: () => {}, error: () => {} },
    $: dummyJQuery,
    jQuery: dummyJQuery,
    location: locationObj,
    document: {
        readyState: 'complete',
        getElementById: () => null,
        location: locationObj,
        createElement: () => ({ getAttribute: () => null, querySelector: () => null, querySelectorAll: () => [] })
    },
    localStorage,
    bootstrap,
    setTimeout: () => {},
    clearTimeout: () => {}
};
context.window = context;
context.document.defaultView = context.window;

vm.createContext(context);
vm.runInContext(fullScript, context);

const qaRes = context.runPrototypeQA();
const domainTests = context.runDomainServicesAndEventBusQA();

console.log("Domain Tests Count:", domainTests.length);
console.log("Domain Passed:", domainTests.filter(t => t.pass).length);
console.log("Domain Failed:", domainTests.filter(t => !t.pass).length);
console.log("Failed Domain Tests:");
domainTests.filter(t => !t.pass).forEach(t => console.log(" - " + t.name));

const secTests = context.runSecurityNegativeTests();
console.log("\nSec Tests Count:", secTests.length);
console.log("Sec Passed:", secTests.filter(t => t.pass).length);
console.log("Sec Failed:", secTests.filter(t => !t.pass).length);
console.log("Failed Sec Tests:");
secTests.filter(t => !t.pass).forEach(t => console.log(" - " + t.name));
