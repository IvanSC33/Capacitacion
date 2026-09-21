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
AppState.session.role = "Employee";
AppState.session.employeeId = "EMP-0001635";
AppState.session.tenantId = "TEN-001";

const createRes = NotificationRepository.create({ id: "NOTIF-OTHER-EMP-FAIL", employeeId: "EMP-0004001", tenantId: "TEN-001", read: false });
console.log("Created notif:", createRes);

const getRes = NotificationRepository.getById("NOTIF-OTHER-EMP-FAIL");
console.log("GetByid notif:", getRes);

const csRes = AuthorizationService.checkScope("SELF", { employeeId: getRes.employeeId });
console.log("checkScope SELF res:", csRes);

const markRes = NotificationService.markAsRead("NOTIF-OTHER-EMP-FAIL");
console.log("markAsRead res:", markRes);
`, context);
