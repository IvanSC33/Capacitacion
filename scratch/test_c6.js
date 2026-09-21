// C6 Hardening / QA Final v5
// Executes the real prototype services in an isolated Node VM.
// It does not replace AuthorizationService, TenantContext, AuditRepository,
// repositories, or domain services with test doubles.

"use strict";

const fs = require("fs");
const vm = require("vm");
const path = require("path");

const root = path.resolve(__dirname, "..");
const htmlPath = path.join(root, "ADRYAN_Learning_Functional_Prototype_III5_WORK.html");
const html = fs.readFileSync(htmlPath, "utf8");
const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(match => match[1]);
const source = scripts.find(script => script.includes("SEED_MOCK_DB"));

if (!source) throw new Error("No se encontró el script de dominio del prototipo.");

let passed = 0;
let failed = 0;
let manual = 0;

function assert(condition, id, description, detail = "") {
    if (condition) {
        passed++;
        console.log(`PASS ${id} - ${description}`);
    } else {
        failed++;
        console.error(`FAIL ${id} - ${description}${detail ? ` | ${detail}` : ""}`);
    }
}

function review(id, description) {
    manual++;
    console.warn(`MANUAL ${id} - ${description}`);
}

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

function createRuntime() {
    let uuid = 0;
    const rendered = {};
    const jquery = selector => ({
        append: () => {}, empty: () => {}, addClass: () => {}, removeClass: () => {},
        text: () => {}, val: () => {}, attr: () => {}, each: () => {}, on: () => {}, ready: () => {},
        html: value => {
            if (value !== undefined) rendered[String(selector)] = value;
            return rendered[String(selector)] || "";
        }
    });
    const context = {
        console, JSON, Date, Math, Array, Object, String, Number, Boolean, RegExp, Set, Map, Error,
        TextEncoder, Uint8Array,
        crypto: { randomUUID: () => `test-uuid-${++uuid}`, subtle: { digest: async () => new ArrayBuffer(32) } },
        window: { location: { hash: "" }, localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} }, addEventListener: () => {} },
        document: { getElementById: () => ({ addEventListener: () => {}, style: {}, innerText: "" }), querySelectorAll: () => [] },
        bootstrap: { Modal: class { show() {} hide() {} }, Toast: class { show() {} } },
        setInterval: () => 1, clearInterval: () => {}, setTimeout: callback => { if (typeof callback === "function") callback(); return 1; }, clearTimeout: () => {}
    };
    context.localStorage = context.window.localStorage;
    context.window.crypto = context.crypto;
    context.$ = jquery;
    context.globalThis = context;
    vm.createContext(context);
    const exportsStatement = `
        globalThis.__c6exports = {
            MockDB, SEED_MOCK_DB, AppState, CONFIG, EventBus,
            AuthorizationService, TenantContext, AssignmentService, EnrollmentService, ProgressService,
            CertificationService, CertificationEligibilityService, CourseRepository, CourseVersionRepository,
            UnitRepository, ActivityRepository, EnrollmentRepository, ActivityProgressRepository,
            CertificateRepository, CertificationRequirementRepository, AttemptRepository, AssessmentRepository,
            EvidenceRepository, AuditRepository, initEventHandlers, initPlayerPlayback,
            renderScreenCertifications, renderScreenCourseDetail, showCourseDetailModal: window.showCourseDetailModal
        };
    `;
    vm.runInContext(`${source}\n${exportsStatement}`, context, { filename: htmlPath });
    return { api: context.__c6exports, rendered };
}

function setSession(api, role = "Employee", employeeId = "EMP-0001635", tenantId = "TEN-001") {
    api.AppState.session = { userId: employeeId, employeeId, role, tenantId };
    api.CONFIG.DEMO_NOW = "2026-09-18T12:00:00Z";
}

function buildEligibleEnrollment(api, id = "ENR-C6", employeeId = "EMP-0001635") {
    api.MockDB.certificates = api.MockDB.certificates.filter(c => c.courseId !== "COURSE-102" || c.employeeId !== employeeId);
    api.MockDB.enrollments = api.MockDB.enrollments.filter(e => e.id !== "ENR-002" && e.id !== id);
    api.MockDB.attempts = api.MockDB.attempts.filter(a => a.enrollmentId !== id);
    api.MockDB.enrollments.push({ id, employeeId, courseId: "COURSE-102", courseVersionId: "CVERS-102-V31", learningObjectId: "LOBJ-002", status: "Active", progressPct: 0, tenantId: "TEN-001" });
    api.MockDB.attempts.push({ id: `ATT-${id}`, assessmentId: "ASSESS-001", employeeId, enrollmentId: id, scorePct: 95, passed: true, finishedAt: "2026-09-18T10:00:00Z", tenantId: "TEN-001" });
}

function completeEligibleEnrollment(api, id = "ENR-C6") {
    return api.ProgressService.updateActivityProgress({ enrollmentId: id, activityId: "ACT-102-11", progressPct: 100, lastPositionSeconds: 60, effectiveTimeSeconds: 60 });
}

function serviceSource(name) {
    const start = source.indexOf(`const ${name} =`);
    if (start < 0) return "";
    let depth = 0;
    let started = false;
    for (let i = start; i < source.length; i++) {
        if (source[i] === "{") { depth++; started = true; }
        if (source[i] === "}" && started && --depth === 0) return source.slice(start, i + 1);
    }
    return source.slice(start);
}

function rendererWritesRepository() {
    const rendererStart = /function\s+render\w+\s*\([^)]*\)\s*\{/g;
    for (const match of source.matchAll(rendererStart)) {
        let depth = 1;
        let cursor = match.index + match[0].length;
        while (cursor < source.length && depth > 0) {
            if (source[cursor] === "{") depth++;
            if (source[cursor] === "}") depth--;
            cursor++;
        }
        if (/Repository\.(create|update)\s*\(/.test(source.slice(match.index, cursor))) return true;
    }
    return false;
}

console.log("=== ADRYAN Learning - C6 contract gate v5 ===\n");

// C6.1 Architecture integrity
{
    const player = `${source.match(/function tickPlayback[\s\S]*?function persistPartialPlayback/) || ""}${source.match(/function stopAndPersistPlayback[\s\S]*?function handlePlayerExit/) || ""}`;
    assert(!/ActivityProgressRepository\.(create|update)/.test(player), "C6-A01", "Player persiste solo mediante ProgressService");
}
{
    const progress = serviceSource("ProgressService");
    const outsideProgress = source.replace(progress, "").replace(/function runSecurityNegativeTests[\s\S]*/, "");
    assert(!/ActivityProgressRepository\.(create|update)\s*\(/.test(outsideProgress), "C6-A02", "ActivityProgress solo se escribe desde ProgressService");
}
assert(!/CertificationService\./.test(serviceSource("EnrollmentService").match(/complete\([\s\S]*/) || ""), "C6-A03", "EnrollmentService.complete no emite certificados directamente");
{
    const { api } = createRuntime();
    setSession(api);
    const before = clone(api.MockDB);
    api.CertificationEligibilityService.evaluate("ENR-002", "CREQ-001");
    assert(JSON.stringify(api.MockDB) === JSON.stringify(before), "C6-A04", "Eligibility es pura");
}
assert(!/EnrollmentRepository\.(create|update)/.test(serviceSource("AssignmentService")), "C6-A06", "AssignmentService no escribe Enrollment");
assert((source.match(/const CertificationService\s*=/g) || []).length === 1 && (source.match(/const ProgressService\s*=/g) || []).length === 1 && (source.match(/const EnrollmentService\s*=/g) || []).length === 1, "C6-A09", "No existen servicios críticos duplicados");

// C6.2/C6.3 Security and authorization on native services.
{
    const { api } = createRuntime();
    setSession(api);
    assert(api.CourseRepository.getAll().every(course => course.tenantId === "TEN-001"), "C6-B01", "CourseRepository aísla TEN-001");
    assert(api.EnrollmentRepository.getByEmployee("EMP-0001635").every(enrollment => enrollment.tenantId === "TEN-001"), "C6-B02", "EnrollmentRepository aísla TEN-001");
    assert(api.ActivityProgressRepository.getByEnrollment("ENR-001").every(progress => progress.tenantId === "TEN-001"), "C6-B03", "ActivityProgressRepository aísla TEN-001");
    api.MockDB.certificates.push({ id: "CERT-T2", employeeId: "EMP-0001635", courseId: "COURSE-102", courseVersionId: "CVERS-102-V31", requirementId: "CREQ-001", expiresAt: "2027-01-01", status: "Active", tenantId: "TEN-002" });
    assert(api.CertificationService.getById("CERT-T2").error.code === "E-CERT-10", "C6-B05", "getById bloquea certificado cross-tenant");
    assert(api.MockDB.auditLogs.some(log => log.action === "TENANT_ACCESS_DENIED"), "C6-B15", "intento cross-tenant queda auditado");
}
{
    const { api } = createRuntime();
    setSession(api, "Employee", "EMP-0001635");
    assert(api.CertificationService.getForEmployee("EMP-0001842").error.code === "E-CERT-11", "C6-B10", "SELF no permite consultar otro empleado");
    setSession(api, "Supervisor", "EMP-0001900");
    assert(api.CertificationService.getForEmployee("EMP-0001635").success, "C6-B11", "TEAM permite consultar un subordinado");
    assert(api.CertificationService.getForEmployee("EMP-0001100").error.code === "E-CERT-11", "C6-C08", "TEAM bloquea colaboradores fuera del equipo");
    setSession(api, "HRAdmin", "EMP-0001100");
    assert(api.CertificationService.getForEmployee("EMP-0001842").success, "C6-C09", "ADMIN permite lectura en el mismo tenant");
}
{
    const { api } = createRuntime();
    setSession(api, "HRAdmin", "EMP-0001100");
    buildEligibleEnrollment(api, "ENR-B07");
    api.MockDB.enrollments.find(enrollment => enrollment.id === "ENR-B07").status = "Completed";
    const issued = api.CertificationService.issue({ employeeId: "EMP-0001635", courseId: "COURSE-102", courseVersionId: "CVERS-102-V31", requirementId: "CREQ-001", tenantId: "TEN-002", isInternal: true });
    assert(issued.success && issued.data.tenantId === "TEN-001", "C6-B07", "issue ignora tenantId del comando y usa el contexto");
    const denied = api.CertificationService.issue({ employeeId: "EMP-0004001", courseId: "COURSE-102", courseVersionId: "CVERS-102-V31", requirementId: "CREQ-001", isInternal: true });
    assert(!denied.success && denied.error.code === "E-CERT-10", "C6-C03", "isInternal no permite emitir fuera del tenant");
}
{
    const { api } = createRuntime();
    setSession(api, "TechAdmin", "EMP-0001100");
    assert(api.CertificationService.getById("CERT-001").error.code === "E-CERT-11", "C6-C01", "sin permiso de lectura se deniega getById");
    assert(api.CertificationService.issue({ employeeId: "EMP-0001635", courseId: "COURSE-102", courseVersionId: "CVERS-102-V31", requirementId: "CREQ-001" }).error.code === "E-CERT-11", "C6-C02", "sin permiso de emisión se deniega issue");
    assert(api.CertificationService.renew({ id: "CERT-001" }).error.code === "E-CERT-11", "C6-C04", "sin permiso de renovación se deniega renew");
    assert(api.MockDB.auditLogs.some(log => log.action === "PERMISSION_DENIED"), "C6-C10", "denegaciones de permiso quedan auditadas");
}

// C6.4/C6.5/C6.6/C6.7 - complete real flow.
{
    const { api, rendered } = createRuntime();
    setSession(api);
    api.initEventHandlers();
    api.initEventHandlers();
    buildEligibleEnrollment(api, "ENR-C6-E2E");
    const beforeEvents = api.EventBus.getHistory().length;
    const completion = completeEligibleEnrollment(api, "ENR-C6-E2E");
    const enrollment = api.EnrollmentRepository.getById("ENR-C6-E2E");
    const certificate = api.CertificateRepository.find(cert => cert.employeeId === "EMP-0001635" && cert.courseId === "COURSE-102")[0];
    const emitted = api.EventBus.getHistory().slice(beforeEvents);
    assert(completion.success && enrollment.status === "Completed", "C6-D04", "todas las actividades Required completan el Enrollment");
    assert(enrollment.progressPct === 100 && api.ProgressService.calculateEnrollmentProgress("ENR-C6-E2E", "TEN-001").allRequiredCompleted, "C6-G06", "el cálculo de progreso devuelve 100% y allRequiredCompleted");
    assert(emitted.some(event => event.eventType === "Learning.EnrollmentCompleted" && event.payload.enrollmentId === "ENR-C6-E2E"), "C6-E02", "EnrollmentCompleted se publica con enrollmentId después de persistir");
    assert(certificate && certificate.status === "Active" && certificate.tenantId === "TEN-001", "C6-G08", "EnrollmentCompleted activa Eligibility y emite certificado");
    assert(api.EventBus.getHistory().filter(event => event.eventType === "Learning.CertificateIssued").length === 1, "C6-H08", "el guard evita listeners críticos duplicados");
    const htmlCertifications = api.renderScreenCertifications();
    assert(htmlCertifications.includes("Inducción Normativa SST") && !htmlCertifications.includes("OpenBadges v3.0 Verified"), "C6-G09", "Mis Certificaciones renderiza el certificado real sin integración ficticia");
    api.showCourseDetailModal("COURSE-102");
    const modalHtml = rendered["#generic-modal-body"] || "";
    assert(modalHtml.includes("Ver Certificado") && modalHtml.includes("#/certifications"), "C6-G10", "el detalle de curso presenta el CTA Ver Certificado", `selectores capturados: ${Object.keys(rendered).join(", ")}`);
}
{
    const { api } = createRuntime();
    setSession(api);
    buildEligibleEnrollment(api, "ENR-C6-IDEMP");
    [50, 75, 100].forEach(progressPct => api.ProgressService.updateActivityProgress({ enrollmentId: "ENR-C6-IDEMP", activityId: "ACT-102-11", progressPct }));
    const records = api.ActivityProgressRepository.find(record => record.enrollmentId === "ENR-C6-IDEMP" && record.activityId === "ACT-102-11");
    assert(records.length === 1 && records[0].progressPct === 100, "C6-F02", "progreso incremental conserva un único ActivityProgress");
    api.MockDB.certificates.push({ id: "CERT-EXP", employeeId: "EMP-0001635", courseId: "COURSE-102", courseVersionId: "CVERS-102-V31", requirementId: "CREQ-001", issuedAt: "2025-01-01", expiresAt: "2025-12-31", status: "Expired", tenantId: "TEN-001" });
    const first = api.CertificationService.issue({ employeeId: "EMP-0001635", courseId: "COURSE-102", courseVersionId: "CVERS-102-V31", requirementId: "CREQ-001", isInternal: true });
    const second = api.CertificationService.issue({ employeeId: "EMP-0001635", courseId: "COURSE-102", courseVersionId: "CVERS-102-V31", requirementId: "CREQ-001", isInternal: true });
    assert(first.success && !second.success && second.error.code === "E-CERT-06", "C6-F04", "issue bloquea certificado Active duplicado");
}

// C6.8 Static/code audit.
const serviceArea = source.slice(source.indexOf("const EventBus"), source.indexOf("const routesMap"));
assert(!/console\.log/.test(serviceArea), "C6-H01", "no hay console.log en servicios ni handlers");
assert(!rendererWritesRepository(), "C6-H02", "los renderizadores no escriben repositories");
assert(!/const (?:EnrollmentService|ProgressService|CertificationService)[\s\S]*?alert\(/.test(serviceArea), "C6-H03", "no hay alert en flujos de negocio");
assert(!/TODO|FIXME/.test(serviceSource("EnrollmentService") + serviceSource("ProgressService") + serviceSource("CertificationService")), "C6-H04", "no hay TODO/FIXME críticos");
assert(!/TEN-001/.test(serviceSource("EnrollmentService") + serviceSource("ProgressService") + serviceSource("CertificationService")), "C6-H05", "no hay tenant hardcodeado en servicios críticos");
assert((source.match(/const CertificationService\s*=/g) || []).length === 1, "C6-H06", "CertificationService está definido una sola vez");
assert((source.match(/const ProgressService\s*=/g) || []).length === 1, "C6-H07", "ProgressService está definido una sola vez");
assert(/openBadgesUrl:\s*null/.test(source) && !/OpenBadges v3\.0 Verified|Verificado en blockchain/.test(source), "C6-H09", "no hay integración ficticia de OpenBadges");
assert(/playerSimulationTimer\s*=\s*setInterval/.test(source) && /clearInterval\(window\.playerSimulationTimer\)/.test(source), "C6-H10", "el timer del Player tiene referencia y cleanup");
review("C6-H11", "Frozen Boundary requiere revisión humana de cambios aprobados; el proyecto no tiene repositorio Git.");
assert(!/^\s*(?:import\s|require\s*\(\s*["'])/m.test(source) && (html.match(/<script\s+src=/gi) || []).length === 2, "C6-H12", "no se añadieron dependencias runtime al HTML");

console.log(`\n=== Resultado C6 v5: ${passed} PASS, ${failed} FAIL, ${manual} MANUAL ===`);
if (failed > 0) process.exit(1);
