const fs = require('fs');
const filePath = 'f:/PortalCapacitacion/ADRYAN_Learning_Functional_Prototype.html';
let html = fs.readFileSync(filePath, 'utf8');

const broken = 'results.push({ name: "E2E PositionChanged Flow (EventBus -> Assignment Engine)\n';
if (html.includes(broken)) {
    html = html.replace(broken, 'results.push({ name: "E2E PositionChanged Flow (EventBus -> Assignment Engine)", pass: asgPos.length > 0 });\n');
    fs.writeFileSync(filePath, html, 'utf8');
    console.log("Fixed broken line 6753!");
} else {
    console.log("Searching regex...");
    html = html.replace(/results\.push\(\{ name: "E2E PositionChanged Flow \(EventBus -> Assignment Engine\)\s+pass: asgPos\.length > 0 \}\);/, 'results.push({ name: "E2E PositionChanged Flow (EventBus -> Assignment Engine)", pass: asgPos.length > 0 });');
    fs.writeFileSync(filePath, html, 'utf8');
    console.log("Fixed regex!");
}
