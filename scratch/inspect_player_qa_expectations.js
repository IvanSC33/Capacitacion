const fs = require('fs');
const html = fs.readFileSync('f:/PortalCapacitacion/ADRYAN_Learning_Functional_Prototype.html', 'utf8');

function printTest(name) {
    const idx = html.indexOf(name);
    if (idx === -1) return "NOT FOUND: " + name;
    return html.substring(idx - 50, idx + 700);
}

const tests = [
  "PLAYER-QA-01",
  "PLAYER-QA-22",
  "PLAYER-QA-26",
  "PLAYER-QA-27",
  "PLAYER-QA-28",
  "S02: Header / Breadcrumb",
  "S03: Área de Contenido Principal",
  "S06: Actividad Actual Indicador",
  "S07: Estados Visuales",
  "S08: Navegación Anterior/Siguiente"
];

tests.forEach(t => {
  console.log("=== " + t + " ===");
  console.log(printTest(t));
});
