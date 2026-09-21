const fs = require('fs');

const filepath = 'f:/PortalCapacitacion/ADRYAN_Learning_Functional_Prototype.html';
let content = fs.readFileSync(filepath, 'utf8');

content = content.replace('{ name: "Hardcoded idx + 1 Fallback", pattern: /idxs*+s*1/ }', '{ name: "Hardcoded idx + 1 Fallback", pattern: /idx\\s*\\+\\s*1/ }');

fs.writeFileSync(filepath, content, 'utf8');
console.log('Fixed idx + 1 regex!');
