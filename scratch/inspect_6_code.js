const fs = require('fs');
const html = fs.readFileSync('f:/PortalCapacitacion/ADRYAN_Learning_Functional_Prototype.html', 'utf8');

function getBlock(name) {
    const idx = html.indexOf(name);
    if (idx === -1) return "NOT FOUND: " + name;
    return html.substring(idx - 50, idx + 700);
}

console.log("=== QA-09 ===");
console.log(getBlock("QA-09: Progreso Real en Pantalla"));

console.log("\n=== QA-20 ===");
console.log(getBlock("QA-20: Orden Real de Units en DOM"));

console.log("\n=== QA-21 ===");
console.log(getBlock("QA-21: Orden Real de Activities en DOM"));

console.log("\n=== QA-23 ===");
console.log(getBlock("QA-23: Datos Incompletos"));

console.log("\n=== PLAYER-QA-11 ===");
console.log(getBlock("PLAYER-QA-11: Orden de Units"));

console.log("\n=== PLAYER-QA-12 ===");
console.log(getBlock("PLAYER-QA-12: Orden de Activities"));
