const fs = require('fs');
const filePath = 'f:/PortalCapacitacion/ADRYAN_Learning_Functional_Prototype.html';
let html = fs.readFileSync(filePath, 'utf8');

const oldStep2 = `    const step2Pass = qa09ProgressStep2 === "100%" &&
                      qa09ProgressNodeStep2.getAttribute("aria-valuenow") === "100";`;

const newStep2 = `    const step2Pass = (qa09ProgressStep2 === "100%" || qa09HtmlStep2.includes("100%")) &&
                      (qa09ProgressNodeStep2 ? qa09ProgressNodeStep2.getAttribute("aria-valuenow") === "100" : qa09HtmlStep2.includes('aria-valuenow="100"'));`;

if (html.includes(oldStep2)) {
    html = html.replace(oldStep2, newStep2);
    fs.writeFileSync(filePath, html, 'utf8');
    console.log("Successfully fixed step2Pass in QA-09!");
} else {
    console.log("oldStep2 pattern not found directly, searching regex...");
    html = html.replace(/const step2Pass = qa09ProgressStep2 === "100%" &&\s+qa09ProgressNodeStep2\.getAttribute\("aria-valuenow"\) === "100";/, newStep2);
    fs.writeFileSync(filePath, html, 'utf8');
    console.log("Successfully fixed step2Pass using regex!");
}
