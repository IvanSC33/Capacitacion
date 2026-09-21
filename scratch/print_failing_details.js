const fs = require('fs');
const html = fs.readFileSync('f:/PortalCapacitacion/ADRYAN_Learning_Functional_Prototype.html', 'utf8');

function findTestCode(name) {
    const idx = html.indexOf(name);
    if (idx === -1) return "NOT FOUND";
    return html.substring(idx - 100, idx + 800);
}

console.log("=== CROSS EMPLOYEE NOTIFICATION ===");
console.log(findTestCode("Cross-Employee Notification"));

console.log("\n=== QA-09 ===");
console.log(findTestCode("QA-09: Progreso Real en Pantalla"));

console.log("\n=== QA-20 ===");
console.log(findTestCode("QA-20: Orden Real de Units en DOM"));

console.log("\n=== QA-21 ===");
console.log(findTestCode("QA-21: Orden Real de Activities en DOM"));

console.log("\n=== QA-23 ===");
console.log(findTestCode("QA-23: Datos Incompletos"));

console.log("\n=== PLAYER-QA-11 ===");
console.log(findTestCode("PLAYER-QA-11: Orden de Units"));

console.log("\n=== PLAYER-QA-12 ===");
console.log(findTestCode("PLAYER-QA-12: Orden de Activities"));
