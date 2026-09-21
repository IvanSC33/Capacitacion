const fs = require('fs');

const htmlContent = fs.readFileSync('f:/PortalCapacitacion/ADRYAN_Learning_Functional_Prototype_III5_WORK.html', 'utf8');
const scriptStart = htmlContent.indexOf('<script>');
const scriptEnd = htmlContent.indexOf('</script>', scriptStart);
let jsCode = htmlContent.substring(scriptStart + 8, scriptEnd);

jsCode = jsCode.replace(/const SecurityAuditRepository = \{[\s\S]*?\n\s*\};/, 'const SecurityAuditRepository = { create: () => {} };');

const env = `
const window = { location: { hash: "" } };
window.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
const localStorage = window.localStorage;
const document = { getElementById: () => ({ addEventListener: () => {} }), querySelectorAll: () => [] };
const crypto = { subtle: { digest: async () => new ArrayBuffer(32) }, randomUUID: () => "uuid-" + Math.random() };
window.crypto = crypto;
const $ = () => ({ append: () => {}, html: () => {}, on: () => {}, ready: () => {} });
const bootstrap = { Modal: class { show(){} hide(){} }, Toast: class { show(){} } };
`;

const exportStatement = `
module.exports = {
    SEED_MOCK_DB,
    createServiceError,
    CourseRepository,
    CourseVersionRepository,
    UnitRepository,
    ActivityRepository,
    EnrollmentRepository,
    ActivityProgressRepository,
    EventBus,
    AppState,
    window,
    resolvePlayerContext,
    getOrderedPlayerActivities,
    selectPlayerActivity,
    navigatePlayerActivity
};
`;

fs.writeFileSync('f:/PortalCapacitacion/scratch/temp_test_c2_env.js', env + jsCode + "\n\n" + exportStatement);
console.log("Extracted JS securely");
