const fs = require('fs');

const filePath = 'f:/PortalCapacitacion/ADRYAN_Learning_Functional_Prototype.html';
let html = fs.readFileSync(filePath, 'utf8');

const target = 'let AppState = {';
const replacement = 'window.AppState = {';

if (html.includes(target)) {
    html = html.replace(target, 'window.AppState = {');
    html = html.replace(/\bAppState\b/g, 'window.AppState');
    // Keep clean syntax
    fs.writeFileSync(filePath, html, 'utf8');
    console.log('Exposed AppState on window object.');
} else {
    console.error('Target AppState declaration not found.');
}
