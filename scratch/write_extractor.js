const fs = require('fs');

const extractJsPath = 'f:/PortalCapacitacion/scratch/fix_extraction_c3.js';
const extractContent = `
const fs = require('fs');
const htmlContent = fs.readFileSync('f:/PortalCapacitacion/ADRYAN_Learning_Functional_Prototype_III5_WORK.html', 'utf8');
const scriptStart = htmlContent.indexOf('<script>');
const scriptEnd = htmlContent.indexOf('</script>', scriptStart);
let jsCode = htmlContent.substring(scriptStart + 8, scriptEnd);

jsCode = jsCode.replace(/const SecurityAuditRepository = \\{[\\s\\S]*?\\n\\s*\\};/, 'const SecurityAuditRepository = { create: () => {} };');

const env = \`
const window = { location: { hash: "" }, addEventListener: (event, cb) => {} };
window.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
const localStorage = window.localStorage;
const document = { getElementById: () => ({ addEventListener: () => {}, style: {} }), querySelectorAll: () => [] };
const crypto = { subtle: { digest: async () => new ArrayBuffer(32) }, randomUUID: () => "uuid-" + Math.random() };
window.crypto = crypto;
const $ = () => ({ append: () => {}, html: () => {}, on: () => {}, ready: () => {} });
const bootstrap = { Modal: class { show(){} hide(){} }, Toast: class { show(){} } };
const renderApp = () => {};
\`;

const exportStatement = \`
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
    navigatePlayerActivity,
    initPlayerPlayback,
    togglePlayPause,
    tickPlayback,
    persistPartialPlayback,
    stopAndPersistPlayback,
    handlePlayerExit
};
\`;

fs.writeFileSync('f:/PortalCapacitacion/scratch/temp_test_c3_env.js', env + jsCode + "\\n\\n" + exportStatement);
console.log("C3 Extracted JS securely");
`;
fs.writeFileSync(extractJsPath, extractContent);
