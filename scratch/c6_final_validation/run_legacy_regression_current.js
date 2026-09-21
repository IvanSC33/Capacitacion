// C6-FINAL-01B regression adapter.
// Reuses historical test bodies without editing them, but executes them against
// the current prototype in an in-memory VM. No temporary test environment is written.

"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const projectRoot = path.resolve(__dirname, "..", "..");
const htmlPath = path.join(projectRoot, "ADRYAN_Learning_Functional_Prototype_III5_WORK.html");
const historicalRoot = path.join(projectRoot, "scratch");
const suite = (process.argv[2] || "").toUpperCase();

const suiteFiles = {
    B: "test_block_b_uts_v3.js",
    C1: "test_c1_h.js",
    C2: "test_c2.js",
    C3: "test_c3.js",
    C4: "test_c4.js",
    C5: "test_c5.js"
};

if (require.main === module && !suiteFiles[suite]) {
    throw new Error(`Uso: node ${path.basename(__filename)} <${Object.keys(suiteFiles).join("|")}>`);
}

const html = fs.readFileSync(htmlPath, "utf8");
const source = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
    .map(match => match[1])
    .find(script => script.includes("SEED_MOCK_DB"));

if (!source) throw new Error("No se encontró el script de dominio del prototipo actual.");

function createRuntime() {
    let uuid = 0;
    let timerId = 0;
    const activeTimers = new Set();
    const timerCallbacks = new Map();
    const rendered = {};
    const elements = new Map();
    const getElement = id => {
        if (!elements.has(id)) elements.set(id, { addEventListener: () => {}, style: {}, innerText: "", innerHTML: "" });
        return elements.get(id);
    };
    const jquery = selector => ({
        append: () => {}, empty: () => {}, addClass: () => {}, removeClass: () => {},
        text: () => {}, val: () => {}, attr: () => {}, each: () => {}, on: () => {}, ready: () => {},
        html: value => {
            if (value !== undefined) rendered[String(selector)] = value;
            return rendered[String(selector)] || "";
        }
    });
    const setIntervalStub = callback => {
        const id = ++timerId;
        activeTimers.add(id);
        timerCallbacks.set(id, callback);
        return id;
    };
    const clearIntervalStub = id => {
        activeTimers.delete(id);
        timerCallbacks.delete(id);
    };
    const setTimeoutStub = callback => {
        const id = ++timerId;
        timerCallbacks.set(id, callback);
        return id;
    };
    const clearTimeoutStub = clearIntervalStub;
    const context = {
        console, JSON, Date, Math, Array, Object, String, Number, Boolean, RegExp, Set, Map, Error,
        TextEncoder, Uint8Array,
        crypto: { randomUUID: () => `regression-uuid-${++uuid}`, subtle: { digest: async () => new ArrayBuffer(32) } },
        window: {
            location: { hash: "" },
            localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
            addEventListener: () => {},
            setInterval: setIntervalStub,
            clearInterval: clearIntervalStub,
            setTimeout: setTimeoutStub,
            clearTimeout: clearTimeoutStub
        },
        document: { getElementById: getElement, querySelectorAll: () => [] },
        bootstrap: { Modal: class { show() {} hide() {} }, Toast: class { show() {} } },
        renderApp: () => {},
        setInterval: setIntervalStub,
        clearInterval: clearIntervalStub,
        setTimeout: setTimeoutStub,
        clearTimeout: clearTimeoutStub
    };
    context.localStorage = context.window.localStorage;
    context.window.crypto = context.crypto;
    context.$ = jquery;
    context.globalThis = context;
    vm.createContext(context);
    const exportsStatement = `
        globalThis.__regressionExports = {
            MockDB, SEED_MOCK_DB, AppState, CONFIG, EventBus,
            createServiceError, createServiceResult, AuthorizationService, TenantContext,
            CourseRepository, CourseVersionRepository, UnitRepository, ActivityRepository,
            EnrollmentRepository, ActivityProgressRepository, CertificateRepository,
            CertificationRequirementRepository, AssessmentRepository, AttemptRepository,
            EvidenceRepository, AuditRepository, ProgressService, EnrollmentService,
            CertificationService, CertificationEligibilityService, AssignmentService,
            resolvePlayerContext, getOrderedPlayerActivities, selectPlayerActivity,
            navigatePlayerActivity, initPlayerPlayback, togglePlayPause, tickPlayback,
            persistPartialPlayback, stopAndPersistPlayback, handlePlayerExit,
            initEventHandlers
        };
    `;
    vm.runInContext(`${source}\n${exportsStatement}`, context, { filename: htmlPath });
    return { api: context.__regressionExports, context, activeTimers, rendered };
}

function setSession(api, role = "Employee", employeeId = "EMP-0001635", tenantId = "TEN-001") {
    api.AppState.session = { userId: employeeId, employeeId, role, tenantId };
    api.CONFIG.DEMO_NOW = "2026-09-18T12:00:00Z";
}

function makeEligible(api, id, employeeId) {
    api.MockDB.certificates = api.MockDB.certificates.filter(cert => cert.employeeId !== employeeId || cert.courseId !== "COURSE-102");
    api.MockDB.enrollments = api.MockDB.enrollments.filter(enrollment => enrollment.id !== id && enrollment.id !== "ENR-002");
    api.MockDB.attempts = api.MockDB.attempts.filter(attempt => attempt.enrollmentId !== id);
    api.MockDB.enrollments.push({
        id, employeeId, courseId: "COURSE-102", courseVersionId: "CVERS-102-V31",
        learningObjectId: "LOBJ-002", status: "Active", progressPct: 0, tenantId: "TEN-001"
    });
    api.MockDB.attempts.push({
        id: `ATT-${id}`, assessmentId: "ASSESS-001", employeeId, enrollmentId: id,
        scorePct: 95, passed: true, finishedAt: "2026-09-18T10:00:00Z", tenantId: "TEN-001"
    });
    setSession(api, "Employee", employeeId, "TEN-001");
    const completion = api.ProgressService.updateActivityProgress({
        enrollmentId: id, activityId: "ACT-102-11", progressPct: 100,
        lastPositionSeconds: 60, effectiveTimeSeconds: 60
    });
    if (!completion.success) throw new Error(`No fue posible preparar enrollment elegible ${id}.`);
}

function adaptBody(original) {
    const bodyStart = original.indexOf("let passed = 0;");
    if (bodyStart < 0) throw new Error(`No se encontró el cuerpo verificable de la suite ${suite}.`);
    let body = original.slice(bodyStart);

    if (suite === "B") {
        body = body.replace(
            /AuthorizationService\.can = \(\) => true;\s*\r?\nAuthorizationService\.checkScope = \(\) => true;\s*\r?\nAuthorizationService\.logSecurity = \(\) => \{\};\s*\r?\nTenantContext\.getCurrentTenantId = \(\) => "TEN-001";/,
            "// C6-FINAL adapter: no authorization/tenant override."
        );
    }

    if (suite === "C5") {
        body = body.replace(
            /\/\/ Override auth for tests[\s\S]*?AppState\.session = \{ employeeId: "EMP-0001635", tenantId: "TEN-001" \};/,
            'AppState.session = { userId: "EMP-0001635", employeeId: "EMP-0001635", role: "LearningManager", tenantId: "TEN-001" };'
        );
        body = body.replace(
            'const resIssue2_real = CertificationService.issue({ ...issueCmd, courseVersionId: "CV-OTHER", hashSHA256: null });',
            'const resIssue2_real = CertificationService.issue({ ...issueCmd, employeeId: "EMP-0001842", hashSHA256: null });'
        );
        body = body.replace(
            'AuthorizationService.can = (perm) => perm !== "learning.certification.renew"; // Deny',
            'AppState.session = { userId: "EMP-0001635", employeeId: "EMP-0001635", role: "Employee", tenantId: "TEN-001" }; // Deny with actual role'
        );
        body = body.replace(
            'AuthorizationService.can = () => true; // Restore',
            'AppState.session = { userId: "EMP-0001635", employeeId: "EMP-0001635", role: "LearningManager", tenantId: "TEN-001" }; // Restore actual role'
        );
        body = body.replace(
            'TenantContext.getCurrentTenantId = () => "TEN-002"; // Cross tenant',
            'AppState.session = { userId: "EMP-0001635", employeeId: "EMP-0001635", role: "LearningManager", tenantId: "TEN-002" }; // Cross tenant'
        );
        body = body.replace(
            'TenantContext.getCurrentTenantId = () => "TEN-001"; // Restore',
            'AppState.session = { userId: "EMP-0001635", employeeId: "EMP-0001635", role: "LearningManager", tenantId: "TEN-001" }; // Restore tenant'
        );
    }

    return body;
}

module.exports = { createRuntime, setSession, makeEligible, htmlPath, productHash: crypto.createHash("sha256").update(html).digest("hex").toUpperCase() };

if (require.main === module) {
    const historicalPath = path.join(historicalRoot, suiteFiles[suite]);
    const historicalBody = fs.readFileSync(historicalPath, "utf8");
    const runtime = createRuntime();
    const { api, context, activeTimers } = runtime;
    setSession(api);

    if (suite === "C4") api.MockDB.activityProgress.length = 0;
    if (suite === "C5") {
        makeEligible(api, "ENR-C5-ISSUE", "EMP-0001635");
        makeEligible(api, "ENR-C5-HASH-NONE", "EMP-0001842");
        setSession(api, "LearningManager");
    }

    const exitSignal = Symbol("suite-exit");
    const scope = {
        console,
        process: { exit: code => { if (code) throw exitSignal; } },
        ...api,
        exported: api,
        window: context.window,
        testWindow: context.window,
        activeTimers
    };
    // C3 replaces Node's global timer functions. Route those assignments into the
    // prototype VM so the tested Player functions observe the same timer double.
    const timerGlobal = {};
    Object.defineProperties(timerGlobal, {
        setInterval: {
            get: () => context.setInterval,
            set: value => { context.setInterval = value; context.window.setInterval = value; }
        },
        clearInterval: {
            get: () => context.clearInterval,
            set: value => { context.clearInterval = value; context.window.clearInterval = value; }
        }
    });
    scope.global = timerGlobal;
    scope.globalThis = scope;

    console.log(`=== C6-FINAL current regression adapter: ${suite} ===`);
    console.log(`SUT: ${htmlPath}`);
    console.log(`SHA-256: ${module.exports.productHash}`);
    console.log("Mode: current source, isolated VM, no temporary files, original suite preserved.\n");

    try {
        vm.runInNewContext(adaptBody(historicalBody), scope, { filename: historicalPath });
    } catch (error) {
        if (error !== exitSignal) throw error;
        process.exitCode = 1;
    }
}
