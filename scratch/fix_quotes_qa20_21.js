const fs = require('fs');

const filePath = 'f:/PortalCapacitacion/ADRYAN_Learning_Functional_Prototype.html';
let html = fs.readFileSync(filePath, 'utf8');

const oldQa20Pos = `    const posUA = uOrderHtml.indexOf('data-unit-id="UNIT-TEMP-01"');
    const posUB = uOrderHtml.indexOf('data-unit-id="UNIT-TEMP-02"');
    const posUC = uOrderHtml.indexOf('data-unit-id="UNIT-TEMP-03"');`;

const newQa20Pos = `    const posUA = uOrderHtml.indexOf("data-unit-id='UNIT-TEMP-01'") !== -1 ? uOrderHtml.indexOf("data-unit-id='UNIT-TEMP-01'") : uOrderHtml.indexOf('data-unit-id="UNIT-TEMP-01"');
    const posUB = uOrderHtml.indexOf("data-unit-id='UNIT-TEMP-02'") !== -1 ? uOrderHtml.indexOf("data-unit-id='UNIT-TEMP-02'") : uOrderHtml.indexOf('data-unit-id="UNIT-TEMP-02"');
    const posUC = uOrderHtml.indexOf("data-unit-id='UNIT-TEMP-03'") !== -1 ? uOrderHtml.indexOf("data-unit-id='UNIT-TEMP-03'") : uOrderHtml.indexOf('data-unit-id="UNIT-TEMP-03"');`;

if (html.includes(oldQa20Pos)) {
    html = html.replace(oldQa20Pos, newQa20Pos);
}

const oldQa21Pos = `    const posAA = aOrderHtml.indexOf('data-activity-id="ACT-TEMP-01"');
    const posAB = aOrderHtml.indexOf('data-activity-id="ACT-TEMP-02"');
    const posAC = aOrderHtml.indexOf('data-activity-id="ACT-TEMP-03"');`;

const newQa21Pos = `    const posAA = aOrderHtml.indexOf("data-activity-id='ACT-TEMP-01'") !== -1 ? aOrderHtml.indexOf("data-activity-id='ACT-TEMP-01'") : aOrderHtml.indexOf('data-activity-id="ACT-TEMP-01"');
    const posAB = aOrderHtml.indexOf("data-activity-id='ACT-TEMP-02'") !== -1 ? aOrderHtml.indexOf("data-activity-id='ACT-TEMP-02'") : aOrderHtml.indexOf('data-activity-id="ACT-TEMP-02"');
    const posAC = aOrderHtml.indexOf("data-activity-id='ACT-TEMP-03'") !== -1 ? aOrderHtml.indexOf("data-activity-id='ACT-TEMP-03'") : aOrderHtml.indexOf('data-activity-id="ACT-TEMP-03"');`;

if (html.includes(oldQa21Pos)) {
    html = html.replace(oldQa21Pos, newQa21Pos);
}

fs.writeFileSync(filePath, html, 'utf8');
console.log('Successfully fixed single vs double quotes in QA-20 and QA-21!');
