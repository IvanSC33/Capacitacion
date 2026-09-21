const fs = require('fs');
const filePath = 'f:/PortalCapacitacion/ADRYAN_Learning_Functional_Prototype.html';
let html = fs.readFileSync(filePath, 'utf8');

// Fix Exact Deduplication Contract setup in runDomainServicesAndEventBusQA
const oldDedupSetup = `        // Rule 1: Position
        const r1Res = AssignmentRuleService.create({ name: "Rule 1 - Puesto", category: "Test", conditions: [{ field: "position", op: "EQUALS", val: "Operador" }], actions: { learningObjectId: lobjExactId, obligationType: "Mandatory", assignedBy: "Regla Puesto", dueDateOffsetDays: 30, reasonCode: "REASON_POSITION", reasonDescription: "Asignación por Puesto de Operador" } });`;

const newDedupSetup = `        // Clean up any prior test state for idempotency
        MockDB.assignments = (MockDB.assignments || []).filter(a => a.employeeId !== empExactId);
        MockDB.assignmentReasons = (MockDB.assignmentReasons || []).filter(r => r.employeeId !== empExactId);
        MockDB.enrollments = (MockDB.enrollments || []).filter(e => e.employeeId !== empExactId);

        // Rule 1: Position
        const r1Res = AssignmentRuleService.create({ name: "Rule 1 - Puesto", category: "Test", conditions: [{ field: "position", op: "EQUALS", val: "Operador" }], actions: { learningObjectId: lobjExactId, obligationType: "Mandatory", assignedBy: "Regla Puesto", dueDateOffsetDays: 30, reasonCode: "REASON_POSITION", reasonDescription: "Asignación por Puesto de Operador" } });`;

if (html.includes(oldDedupSetup)) {
    html = html.replace(oldDedupSetup, newDedupSetup);
}

// Fix E2E PositionChanged setup
const oldPosSetup = `        const empPosId = "EMP-POS-CHANGE-001";
        EmployeeRepository.create({ id: empPosId, name: "Empleado Cambio Cargo", position: "Operador Junior", area: "Operaciones", tenantId: "TEN-001" });`;

const newPosSetup = `        const empPosId = "EMP-POS-CHANGE-001";
        MockDB.employees = (MockDB.employees || []).filter(e => e.id !== empPosId);
        MockDB.assignments = (MockDB.assignments || []).filter(a => a.employeeId !== empPosId);
        EmployeeRepository.create({ id: empPosId, name: "Empleado Cambio Cargo", position: "Operador Junior", area: "Operaciones", tenantId: "TEN-001" });`;

if (html.includes(oldPosSetup)) {
    html = html.replace(oldPosSetup, newPosSetup);
}

fs.writeFileSync(filePath, html, 'utf8');
console.log("Successfully fixed cleanup in test setups!");
