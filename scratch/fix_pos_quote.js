const fs = require('fs');
const filePath = 'f:/PortalCapacitacion/ADRYAN_Learning_Functional_Prototype.html';
let html = fs.readFileSync(filePath, 'utf8');

const targetIdx = html.indexOf('E2E PositionChanged Flow (EventBus -> Assignment Engine)');
if (targetIdx !== -1) {
    const endLine = html.indexOf('results.push', targetIdx);
    const endBlock = html.indexOf('} catch(e)', targetIdx);
    const snippet = html.substring(targetIdx, endBlock);
    console.log("Snippet around position changed:", snippet);
    
    // Replace with correct clean block
    const cleanBlock = `E2E PositionChanged Flow (EventBus -> Assignment Engine)
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
        results.push({ name: "E2E PositionChanged Flow (EventBus -> Assignment Engine)", pass: asgPos.length > 0 });
    `;

    html = html.substring(0, targetIdx) + cleanBlock + html.substring(endBlock);
    fs.writeFileSync(filePath, html, 'utf8');
    console.log("Successfully fixed position changed block!");
}
