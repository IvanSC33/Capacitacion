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

const context = { console, $: dummyJQuery, jQuery: dummyJQuery, location: locationObj, document: { readyState: 'complete', getElementById: () => null, createElement: () => ({ getAttribute: () => null, querySelector: () => null, querySelectorAll: () => [] }) }, localStorage, bootstrap, setTimeout: () => {}, clearTimeout: () => {} };
context.window = context;

vm.createContext(context);
vm.runInContext(fullScript, context);

context.StorageService.load();
context.AppState.session.tenantId = 'TEN-001';
context.AppState.session.role = 'Employee';
context.AppState.session.employeeId = 'EMP-0001635';

context.NotificationRepository.create({ id: 'NOTIF-OTHER-EMP-FAIL', employeeId: 'EMP-0004001', tenantId: 'TEN-001', read: false });
const res = context.NotificationService.markAsRead('NOTIF-OTHER-EMP-FAIL');
console.log('markAsRead res:', res);
