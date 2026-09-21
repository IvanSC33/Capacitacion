const fs = require('fs');
const filePath = 'f:/PortalCapacitacion/ADRYAN_Learning_Functional_Prototype.html';
let html = fs.readFileSync(filePath, 'utf8');

const startIdx = html.indexOf('const empPosId = "EMP-POS-CHANGE-001";');
const endIdx = html.indexOf('// Restore state', startIdx);

if (startIdx !== -1 && endIdx !== -1) {
    const cleanBlock = `const empPosId = "EMP-POS-CHANGE-001";
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
        results.push({ name: "E2E PositionChanged Flow (EventBus -> Assignment Engine)", pass: asgPos.length > 0 });
    } catch(e) {
        results.push({ name: "E2E PositionChanged Flow", pass: false, error: e.message });
    }

    `;

    // Back up to the 'try {' before startIdx
    const tryIdx = html.lastIndexOf('try {', startIdx);
    html = html.substring(0, tryIdx) + "try {\n        " + cleanBlock + html.substring(endIdx);
    fs.writeFileSync(filePath, html, 'utf8');
    console.log("Successfully replaced clean PositionChanged block!");
} else {
    console.log("Could not find PositionChanged block boundaries!");
}
