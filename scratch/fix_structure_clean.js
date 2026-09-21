const fs = require('fs');

const filePath = 'f:/PortalCapacitacion/ADRYAN_Learning_Functional_Prototype.html';
let html = fs.readFileSync(filePath, 'utf8');

// Find runSecurityNegativeTests
const secStart = html.indexOf('function runSecurityNegativeTests()');
const secEndPattern = 'AppState.session.employeeId = currentEmpBackup;\n\n    return results;\n}';
const secEndIdx = html.indexOf(secEndPattern, secStart);

if (secStart !== -1 && secEndIdx !== -1) {
    // End of runSecurityNegativeTests function
    const secCutPoint = secEndIdx + secEndPattern.length;
    
    // Find start of runDomainServicesAndEventBusQA
    const domStart = html.indexOf('function runDomainServicesAndEventBusQA()', secCutPoint);
    
    // The QA tests block is between secCutPoint and domStart
    const qaBlock = html.substring(secCutPoint, domStart);

    // Find return results inside runDomainServicesAndEventBusQA
    const domEndIdx = html.lastIndexOf('return results;\n}');
    
    if (domEndIdx > domStart) {
        // Remove qaBlock from sec function area and put inside runDomainServicesAndEventBusQA
        let cleanSecArea = html.substring(0, secCutPoint) + '\n\n';
        let cleanDomArea = html.substring(domStart, domEndIdx) + qaBlock + '\n    return results;\n' + html.substring(domEndIdx + 'return results;\n'.length);

        html = cleanSecArea + cleanDomArea;
        fs.writeFileSync(filePath, html, 'utf8');
        console.log('Successfully cleaned QA function scopes!');
    } else {
        console.error('Could not find return results in runDomainServicesAndEventBusQA');
    }
} else {
    console.error('Could not find runSecurityNegativeTests markers');
}
