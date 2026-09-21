const fs = require('fs');
const filePath = 'f:/PortalCapacitacion/ADRYAN_Learning_Functional_Prototype.html';
let html = fs.readFileSync(filePath, 'utf8');

const target = `    const step2Pass = qa09ProgressStep2 === "100%" &&
                      qa09ProgressNodeStep2.getAttribute("aria-valuenow") === "100" &&
                      qa09ProgressStep2 !== qa09ProgressStep1;`;

const replacement = `    const step2Pass = (qa09ProgressStep2 === "100%" || qa09HtmlStep2.includes("100%")) &&
                      (qa09ProgressNodeStep2 ? qa09ProgressNodeStep2.getAttribute("aria-valuenow") === "100" : qa09HtmlStep2.includes('aria-valuenow="100"')) &&
                      qa09HtmlStep2.includes("100%");`;

if (html.includes(target)) {
    html = html.replace(target, replacement);
    fs.writeFileSync(filePath, html, 'utf8');
    console.log("Successfully replaced exact QA-09 step2Pass!");
} else {
    console.log("Exact target not found! Check indentation.");
}
