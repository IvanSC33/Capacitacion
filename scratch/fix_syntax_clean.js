const fs = require('fs');
const filePath = 'f:/PortalCapacitacion/ADRYAN_Learning_Functional_Prototype.html';
let html = fs.readFileSync(filePath, 'utf8');

const target = `    \`;\`;`;
const replacement = `    \`;`;

if (html.includes(target)) {
    html = html.replace(target, replacement);
    fs.writeFileSync(filePath, html, 'utf8');
    console.log("Replaced target successfully!");
} else {
    console.log("Target not found directly, searching regex...");
    html = html.replace(/`;\s*`;/g, '`;');
    fs.writeFileSync(filePath, html, 'utf8');
    console.log("Replaced regex successfully!");
}
