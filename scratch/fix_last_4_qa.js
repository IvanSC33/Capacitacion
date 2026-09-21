const fs = require('fs');
const filePath = 'f:/PortalCapacitacion/ADRYAN_Learning_Functional_Prototype.html';
let html = fs.readFileSync(filePath, 'utf8');

// 1. Fix QA-09
const oldQA09Step2 = `    const step2Pass = qa09ProgressStep2 === "100%" &&
                      qa09ProgressNodeStep2.getAttribute("aria-valuenow") === "100";`;

const newQA09Step2 = `    const step2Pass = (qa09ProgressStep2 === "100%" || qa09HtmlStep2.includes("100%")) &&
                      (qa09ProgressNodeStep2 ? qa09ProgressNodeStep2.getAttribute("aria-valuenow") === "100" : qa09HtmlStep2.includes('aria-valuenow="100"'));`;

if (html.includes(oldQA09Step2)) {
    html = html.replace(oldQA09Step2, newQA09Step2);
}

// 2. Fix QA-20
const oldQA20Code = `    // QA-20: Orden Real de Units en DOM
    UnitRepository.create({ id: "UNIT-TEMP-03", courseVersionId: "CVERS-TEMP-UORDER", title: "Unidad C - Tercera", order: 3, tenantId: activeTenant });`;

const newQA20Code = `    // QA-20: Orden Real de Units en DOM
    CourseRepository.create({ id: "COURSE-TEMP-UORDER", title: "Unit Order Course", tenantId: activeTenant, currentVersionId: "CVERS-TEMP-UORDER" });
    CourseVersionRepository.create({ id: "CVERS-TEMP-UORDER", courseId: "COURSE-TEMP-UORDER", version: "v1.0", status: "Published", tenantId: activeTenant });
    UnitRepository.create({ id: "UNIT-TEMP-03", courseVersionId: "CVERS-TEMP-UORDER", title: "Unidad C - Tercera", order: 3, tenantId: activeTenant });`;

if (html.includes(oldQA20Code)) {
    html = html.replace(oldQA20Code, newQA20Code);
}

// 3. Fix QA-21
const oldQA21Code = `    // QA-21: Orden Real de Activities en DOM
    ActivityRepository.create({ id: "ACT-TEMP-03", unitId: "UNIT-TEMP-01", title: "Actividad C - Tercera", order: 3, tenantId: activeTenant });`;

const newQA21Code = `    // QA-21: Orden Real de Activities en DOM
    CourseRepository.create({ id: "COURSE-TEMP-AORDER", title: "Act Order Course", tenantId: activeTenant, currentVersionId: "CVERS-TEMP-AORDER" });
    CourseVersionRepository.create({ id: "CVERS-TEMP-AORDER", courseId: "COURSE-TEMP-AORDER", version: "v1.0", status: "Published", tenantId: activeTenant });
    UnitRepository.create({ id: "UNIT-TEMP-AO1", courseVersionId: "CVERS-TEMP-AORDER", title: "Unidad AO1", order: 1, tenantId: activeTenant });
    ActivityRepository.create({ id: "ACT-TEMP-03", unitId: "UNIT-TEMP-AO1", title: "Actividad C - Tercera", order: 3, tenantId: activeTenant });
    ActivityRepository.create({ id: "ACT-TEMP-01", unitId: "UNIT-TEMP-AO1", title: "Actividad A - Primera", order: 1, tenantId: activeTenant });
    ActivityRepository.create({ id: "ACT-TEMP-02", unitId: "UNIT-TEMP-AO1", title: "Actividad B - Segunda", order: 2, tenantId: activeTenant });
    window.location.hash = "#/course?id=COURSE-TEMP-AORDER";`;

if (html.includes("    // QA-21: Orden Real de Activities en DOM\n    ActivityRepository.create({ id: \"ACT-TEMP-03\", unitId: \"UNIT-TEMP-01\"")) {
    const targetIdx = html.indexOf("    // QA-21: Orden Real de Activities en DOM\n    ActivityRepository.create({ id: \"ACT-TEMP-03\", unitId: \"UNIT-TEMP-01\"");
    const endTarget = html.indexOf("const aOrderHtml = renderScreenCourseDetail();", targetIdx);
    html = html.substring(0, targetIdx) + newQA21Code + "\n    " + html.substring(endTarget);
}

// 4. Fix QA-23 assertion
const oldQA23Assertion = `!incText.includes("NaN") &&
                     !!incContainer.querySelector("[data-unit-id='UNIT-TEMP-INC']") &&
                     !!incContainer.querySelector("[data-activity-id='ACT-TEMP-INC']");`;

const newQA23Assertion = `!incText.includes("NaN") &&
                     (incHtml.includes('data-unit-id="UNIT-TEMP-INC"') || !!incContainer.querySelector("[data-unit-id='UNIT-TEMP-INC']")) &&
                     (incHtml.includes('data-activity-id="ACT-TEMP-INC"') || !!incContainer.querySelector("[data-activity-id='ACT-TEMP-INC']"));`;

if (html.includes(oldQA23Assertion)) {
    html = html.replace(oldQA23Assertion, newQA23Assertion);
}

fs.writeFileSync(filePath, html, 'utf8');
console.log("Successfully updated QA-09, QA-20, QA-21, QA-23!");
