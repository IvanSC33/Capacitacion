const fs = require('fs');

const filePath = 'f:/PortalCapacitacion/ADRYAN_Learning_Functional_Prototype.html';
let html = fs.readFileSync(filePath, 'utf8');

const oldPqa30 = `    // PLAYER-QA-30: Tipo de Actividad No Soportado (E-11)
    ActivityRepository.create({ id: "PACT-UNSUPPORTED", unitId: "UNIT-P-PROG", title: "Actividad Desconocida", type: "Unsupported3DGame", order: 7, tenantId: activeTenant });
    selectPlayerActivity("PACT-UNSUPPORTED");
    const pQa30Html = renderScreenPlayer();
    const pQa30Pass = pQa30Html.includes("E-11") || pQa30Html.includes("No Soportado");
    results.push({ name: "PLAYER-QA-30: Tipo No Soportado (E-11)", pass: pQa30Pass });`;

const newPqa30 = `    // PLAYER-QA-30: Tipo de Actividad No Soportado (E-11)
    window.location.hash = "#/player?id=COURSE-PLAYER-PROG";
    ActivityRepository.create({ id: "PACT-UNSUPPORTED", unitId: "UNIT-P-PROG", title: "Actividad Desconocida", type: "Unsupported3DGame", order: 7, tenantId: activeTenant });
    selectPlayerActivity("PACT-UNSUPPORTED");
    const pQa30Html = renderScreenPlayer();
    const pQa30Pass = pQa30Html.includes("E-11") || pQa30Html.includes("No Soportado");
    results.push({ name: "PLAYER-QA-30: Tipo No Soportado (E-11)", pass: pQa30Pass });`;

if (html.includes(oldPqa30)) {
    html = html.replace(oldPqa30, newPqa30);
    fs.writeFileSync(filePath, html, 'utf8');
    console.log('Successfully fixed PLAYER-QA-30 hash location!');
} else {
    console.error('Target PLAYER-QA-30 block not found.');
}
