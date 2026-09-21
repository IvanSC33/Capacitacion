const fs = require('fs');
const filePath = 'f:/PortalCapacitacion/ADRYAN_Learning_Functional_Prototype.html';
let html = fs.readFileSync(filePath, 'utf8');

const brokenStr = 'results.push({ name: "E2E PositionChanged Flow (EventBus -> Assignment Engine)';
const idx = html.indexOf(brokenStr);
if (idx !== -1) {
    const endLine = html.indexOf('catch(e)', idx);
    const oldPart = html.substring(idx, endLine);
    const newPart = 'results.push({ name: "E2E PositionChanged Flow (EventBus -> Assignment Engine)", pass: asgPos.length > 0 });\n    } ';
    html = html.replace(oldPart, newPart);
    fs.writeFileSync(filePath, html, 'utf8');
    console.log('Fixed broken quote!');
} else {
    console.log('Broken string not found!');
}
