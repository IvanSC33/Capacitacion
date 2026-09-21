const fs = require('fs');
const filePath = 'f:/PortalCapacitacion/ADRYAN_Learning_Functional_Prototype.html';
let html = fs.readFileSync(filePath, 'utf8');

// Fix test 20 (Exact Deduplication Contract)
const oldTest20 = html.indexOf("Exact 3-Rule Deduplication Contract");
const endTest20 = html.indexOf("results.push({ name: \"Exact Deduplication Contract", oldTest20);

if (oldTest20 !== -1 && endTest20 !== -1) {
    const newTest20Code = `Exact 3-Rule Deduplication Contract (3 Rules -> 1 Assignment, 3 Reasons, 1 Enrollment)
    try {
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

        const r2Res = AssignmentRuleService.create({ name: "Rule 2 - Competencia", category: "Test", conditions: [{ field: "area", op: "EQUALS", val: "Operaciones Subterráneas" }], actions: { learningObjectId: lobjExactId, obligationType: "Mandatory", assignedBy: "Regla Competencia", dueDateOffsetDays: 30, reasonCode: "REASON_COMPETENCY", reasonDescription: "Asignación por Competencia de Área" } });
        const r2 = r2Res.data.rule;
        AssignmentRuleService.forcePublish(r2.id, "Publish test R2");

        const r3Res = AssignmentRuleService.create({ name: "Rule 3 - Zona", category: "Test", conditions: [{ field: "site", op: "EQUALS", val: "Faena Norte" }], actions: { learningObjectId: lobjExactId, obligationType: "Mandatory", assignedBy: "Regla Zona", dueDateOffsetDays: 30, reasonCode: "REASON_SITE", reasonDescription: "Asignación por Faena Operativa" } });
        const r3 = r3Res.data.rule;
        AssignmentRuleService.forcePublish(r3.id, "Publish test R3");

        AssignmentExecutionService.executeRuleForEmployee(AssignmentRuleVersionRepository.getById(r1.currentVersionId), empExactId);
        AssignmentExecutionService.executeRuleForEmployee(AssignmentRuleVersionRepository.getById(r2.currentVersionId), empExactId);
        AssignmentExecutionService.executeRuleForEmployee(AssignmentRuleVersionRepository.getById(r3.currentVersionId), empExactId);

        const empAsgs = AssignmentRepository.find(a => a.employeeId === empExactId && a.learningObjectId === lobjExactId);
        const empReasons = AssignmentReasonRepository.find(r => r.employeeId === empExactId);
        const empEnrs = EnrollmentRepository.find(e => e.employeeId === empExactId && e.learningObjectId === lobjExactId);

        const exactCountsPass = (empAsgs.length === 1) && (empReasons.length === 3) && (empEnrs.length === 1);

        AssignmentExecutionService.executeRuleForEmployee(AssignmentRuleVersionRepository.getById(r1.currentVersionId), empExactId);

        const empAsgsAfter = AssignmentRepository.find(a => a.employeeId === empExactId && a.learningObjectId === lobjExactId);
        const empReasonsAfter = AssignmentReasonRepository.find(r => r.employeeId === empExactId);
        const empEnrsAfter = EnrollmentRepository.find(e => e.employeeId === empExactId && e.learningObjectId === lobjExactId);

        const idempotencyPass = (empAsgsAfter.length === 1) && (empReasonsAfter.length === 3) && (empEnrsAfter.length === 1);

        `;

    const oldCode = html.substring(oldTest20, endTest20);
    html = html.replace(oldCode, newTest20Code);
}

// Fix test 25 (E2E PositionChanged Flow)
const oldTest25 = html.indexOf("E2E PositionChanged Flow");
const endTest25 = html.indexOf("results.push({ name: \"E2E PositionChanged Flow\"", oldTest25);

if (oldTest25 !== -1 && endTest25 !== -1) {
    const newTest25Code = `E2E PositionChanged Flow (EventBus -> Assignment Engine)
    try {
        const empPosId = "EMP-POS-CHANGE-001";
        MockDB.employees = (MockDB.employees || []).filter(e => e.id !== empPosId);
        MockDB.assignments = (MockDB.assignments || []).filter(a => a.employeeId !== empPosId);

        EmployeeRepository.create({ id: empPosId, name: "Empleado Cambio Cargo", position: "Operador Junior", area: "Operaciones", tenantId: "TEN-001" });
        
        const r2 = AssignmentRuleRepository.getById("RULE-002");
        if (r2 && r2.status !== "Published") {
            AssignmentRuleService.forcePublish("RULE-002", "Publicar para test E2E");
        }

        EventBus.publish({
            eventType: "EmployeePositionChanged",
            payload: { employeeId: empPosId, newPosition: "Especialista Senior Operaciones" },
            source: "HRIS_Integration",
            tenantId: "TEN-001"
        });

        const asgPos = AssignmentRepository.find(a => a.employeeId === empPosId);
        `;

    const oldCode25 = html.substring(oldTest25, endTest25);
    html = html.replace(oldCode25, newTest25Code);
}

fs.writeFileSync(filePath, html, 'utf8');
console.log("Successfully fixed test 20 and test 25 setups!");
