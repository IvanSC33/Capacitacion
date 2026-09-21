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
    const empExactId = "EMP-DEDUP-EXACT-001";
    const lobjExactId = "LOBJ-001";

    MockDB.assignments = (MockDB.assignments || []).filter(a => a.employeeId !== empExactId);
    MockDB.assignmentReasons = (MockDB.assignmentReasons || []).filter(r => r.employeeId !== empExactId);
    MockDB.enrollments = (MockDB.enrollments || []).filter(e => e.employeeId !== empExactId);
    MockDB.employees = (MockDB.employees || []).filter(e => e.id !== empExactId);

    EmployeeRepository.create({ id: empExactId, name: "Emp Deduplication Exact Test", area: "Operaciones Subterráneas", position: "Operador", site: "Faena Norte", tenantId: "TEN-001" });

    const r1Res = AssignmentRuleService.create({ name: "Rule 1 - Puesto", category: "Test", conditions: [{ field: "position", op: "EQUALS", val: "Operador" }], actions: { learningObjectId: lobjExactId, obligationType: "Mandatory", assignedBy: "Regla Puesto", dueDateOffsetDays: 30, reasonCode: "REASON_POSITION", reasonDescription: "Asignación por Puesto de Operador" } });
    const r1 = r1Res.data.rule;
    AssignmentRuleService.forcePublish(r1.id, "Publish test R1");

    const ver1 = AssignmentRuleVersionRepository.getById(r1.currentVersionId);
    console.log("ver1 status:", ver1 ? ver1.status : null);

    const execRes1 = AssignmentExecutionService.executeRuleForEmployee(ver1, empExactId);
    console.log("execRes1:", execRes1);
`, context);
