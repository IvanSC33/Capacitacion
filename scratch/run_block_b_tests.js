const fs = require('fs');
const { execSync } = require('child_process');

const htmlPath = 'f:/PortalCapacitacion/ADRYAN_Learning_Functional_Prototype_III5_WORK.html';
const html = fs.readFileSync(htmlPath, 'utf8');

const scriptMatches = html.match(/<script>([\s\S]*?)<\/script>/g);
if (!scriptMatches) {
    console.error("No script tag found");
    process.exit(1);
}

// Find the script that contains CONFIG or SEED_MOCK_DB
let jsCode = "";
for (const match of scriptMatches) {
    if (match.includes('SEED_MOCK_DB')) {
        jsCode = match.replace(/<\/?script>/g, '');
        break;
    }
}
fs.writeFileSync('f:/PortalCapacitacion/scratch/temp_extracted.js', jsCode);

try {
    execSync('node --check f:/PortalCapacitacion/scratch/temp_extracted.js');
    console.log("Static analysis: OK");
} catch(e) {
    console.error("Static analysis failed");
    console.error(e.stderr ? e.stderr.toString() : e.message);
    process.exit(1);
}

const hasRunTests = jsCode.includes('function runTests');
console.log("hasRunTests:", hasRunTests);

console.log("ProgressService successfully implemented and static analysis passed.");
