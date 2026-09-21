const fs = require('fs');

const filePath = 'f:/PortalCapacitacion/ADRYAN_Learning_Functional_Prototype.html';
let html = fs.readFileSync(filePath, 'utf8');

const targetStr = `    MockDB.assignments = (MockDB.assignments || []).filter(asg => !asg.id.includes("TEMP"));
    MockDB.assignmentReasons = (MockDB.assignmentReasons || []).filter(r => !r.id.includes("TEMP"));
    return results;
}




    return results;
}

function runHardcodingScanQA() {`;

const replaceStr = `    MockDB.assignments = (MockDB.assignments || []).filter(asg => !asg.id.includes("TEMP"));
    MockDB.assignmentReasons = (MockDB.assignmentReasons || []).filter(r => !r.id.includes("TEMP"));
    return results;
}

function runHardcodingScanQA() {`;

if (html.includes(targetStr)) {
    html = html.replace(targetStr, replaceStr);
    fs.writeFileSync(filePath, html, 'utf8');
    console.log('Successfully removed duplicate return statement!');
} else {
    console.error('Target string for duplicate return statement not found.');
}
