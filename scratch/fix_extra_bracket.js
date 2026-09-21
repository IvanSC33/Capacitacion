const fs = require('fs');

const filepath = 'f:/PortalCapacitacion/ADRYAN_Learning_Functional_Prototype.html';
let content = fs.readFileSync(filepath, 'utf8');

const targetStr = `    return {
        pass: violations.length === 0,
        businessCount: violations.length,
        violations: violations,
        report: report
    };
}
}`;

const replacementStr = `    return {
        pass: violations.length === 0,
        businessCount: violations.length,
        violations: violations,
        report: report
    };
}`;

if (content.includes(targetStr)) {
    content = content.replace(targetStr, replacementStr);
    fs.writeFileSync(filepath, content, 'utf8');
    console.log('Successfully removed extra closing bracket!');
} else {
    console.error('Target string with extra bracket not found!');
}
