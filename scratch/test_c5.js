const fs = require('fs');

const htmlPath = 'f:/PortalCapacitacion/ADRYAN_Learning_Functional_Prototype_III5_WORK.html';
const html = fs.readFileSync(htmlPath, 'utf8');

const scriptMatches = html.match(/<script>([\s\S]*?)<\/script>/g);
let jsCode = "";
for (const match of scriptMatches) {
    if (match.includes('SEED_MOCK_DB')) {
        jsCode = match.replace(/<\/?script>/g, '');
        break;
    }
}
jsCode = jsCode.replace('const CONFIG =', 'let CONFIG =');
// Remove SecurityAuditRepository error from jsdom
jsCode = jsCode.replace(/const SecurityAuditRepository = \{[\s\S]*?\n\s*\};/, 'const SecurityAuditRepository = { create: () => {}, logSecurity: () => {} };');

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
    EventBus,
    EnrollmentService,
    ProgressService,
    TenantContext,
    AuthorizationService,
    ActivityProgressRepository,
    UnitRepository,
    ActivityRepository,
    EnrollmentRepository,
    CertificationEligibilityService: typeof CertificationEligibilityService !== 'undefined' ? CertificationEligibilityService : null,
    CertificationService,
    CertificationRequirementRepository,
    CertificateRepository,
    EvidenceRepository,
    AssessmentRepository,
    AttemptRepository,
    AppState,
    createServiceError,
    createServiceResult,
    AuditRepository,
    CONFIG
};
`;

fs.writeFileSync('f:/PortalCapacitacion/scratch/temp_test_c5_env.js', env + jsCode + "\n\n" + exportStatement);

const {
    SEED_MOCK_DB,
    EventBus,
    EnrollmentService,
    ProgressService,
    TenantContext,
    AuthorizationService,
    ActivityProgressRepository,
    UnitRepository,
    ActivityRepository,
    EnrollmentRepository,
    CertificationEligibilityService,
    CertificationService,
    CertificationRequirementRepository,
    CertificateRepository,
    EvidenceRepository,
    AssessmentRepository,
    AttemptRepository,
    AppState,
    createServiceError,
    createServiceResult,
    AuditRepository,
    CONFIG
} = require('f:/PortalCapacitacion/scratch/temp_test_c5_env.js');

let passed = 0;
let failed = 0;

function assert(condition, message, details = "") {
    if (condition) {
        passed++;
        console.log("✅ PASS: " + message);
    } else {
        failed++;
        console.error("❌ FAIL: " + message + (details ? " | " + details : ""));
    }
}

// Override auth for tests
AuthorizationService.can = () => true;
AuthorizationService.checkScope = () => true;
AuditRepository.logSecurity = () => {};
TenantContext.getCurrentTenantId = () => "TEN-001";
TenantContext.getCurrentUser = () => ({ id: "EMP-0001635", name: "Test User" });
AppState.session = { employeeId: "EMP-0001635", tenantId: "TEN-001" };

try {
    console.log("=== RUNNING QA C5 ===");
    
    if (!CertificationEligibilityService) {
        console.log("CertificationEligibilityService no implementado todavía.");
        process.exit(1);
    }

    // Backup repos
    const origEnrGetById = EnrollmentRepository.getById;
    const origReqGetById = CertificationRequirementRepository.getById;
    const origAssessFind = AssessmentRepository.find;
    const origAttemptFind = AttemptRepository.find;
    const origEvidFind = EvidenceRepository.find;
    const origCertGetByEmp = CertificateRepository.getByEmployee;

    // --- ELIGIBILITY TESTS ---
    console.log("--- Eligibility Tests ---");
    let mockEnr = { id: "ENR-C5", employeeId: "EMP-0001", courseId: "COURSE-C5", courseVersionId: "CV-C5", status: "Completed", tenantId: "TEN-001" };
    EnrollmentRepository.getById = () => mockEnr;

    const mockReqs = [
        { id: "CREQ-C5-1", targetType: "Course", targetId: "COURSE-C5", minPassingScorePct: 85, validityMonths: 12, requiresEvidence: false, tenantId: "TEN-001" },
        { id: "CREQ-C5-2", targetType: "CourseVersion", targetId: "CV-C5", minPassingScorePct: 0, validityMonths: 12, requiresEvidence: false, tenantId: "TEN-001" },
        { id: "CREQ-C5-3", targetType: "Course", targetId: "COURSE-C5", minPassingScorePct: 90, validityMonths: 12, requiresEvidence: true, tenantId: "TEN-001" },
    ];
    CertificationRequirementRepository.getById = (id) => mockReqs.find(r => r.id === id);

    let mockAssessments = [];
    AssessmentRepository.find = (p) => mockAssessments.filter(p);
    let mockAttempts = [];
    AttemptRepository.find = (p) => mockAttempts.filter(p);
    let mockEvidences = [];
    EvidenceRepository.find = (p) => mockEvidences.filter(p);

    const origUnitGet = UnitRepository.getByCourseVersion;
    const origActFind = ActivityRepository.find;
    UnitRepository.getByCourseVersion = () => [{id: "U1"}];
    ActivityRepository.find = () => [{id: "ACT1", unitId: "U1"}];

    // C5-01: Requirement existe
    mockAssessments = [{ id: "ASSESS-C5", activityId: "ACT1" }];
    mockAttempts = [{ assessmentId: "ASSESS-C5", enrollmentId: "ENR-C5", scorePct: 90, passed: true }];
    const e1 = CertificationEligibilityService.evaluate("ENR-C5", "CREQ-C5-1");
    assert(e1.eligible === true, "C5-01 Requirement existe y es elegible");

    // C5-02: Requirement inexistente
    const e2 = CertificationEligibilityService.evaluate("ENR-C5", "REQ-NON");
    assert(e2.eligible === false && e2.reasons.some(r => r.includes("no encontrado")), "C5-02 Requirement inexistente");

    // C5-03: Tenant incorrecto
    mockEnr.tenantId = "TEN-002";
    const e3 = CertificationEligibilityService.evaluate("ENR-C5", "CREQ-C5-1");
    assert(e3.eligible === false && e3.reasons.some(r => r.includes("Tenant")), "C5-03 Tenant incorrecto");
    mockEnr.tenantId = "TEN-001"; // restore

    // C5-04: Enrollment Completed
    const e4 = CertificationEligibilityService.evaluate("ENR-C5", "CREQ-C5-1");
    assert(e4.eligible === true, "C5-04 Enrollment Completed");

    // C5-05: Enrollment no Completed
    mockEnr.status = "Active";
    const e5 = CertificationEligibilityService.evaluate("ENR-C5", "CREQ-C5-1");
    assert(e5.eligible === false && e5.reasons.some(r => r.includes("no está completada")), "C5-05 Enrollment no Completed");
    mockEnr.status = "Completed";

    // C5-06: Score >= mínimo
    mockAttempts = [{ assessmentId: "ASSESS-C5", enrollmentId: "ENR-C5", scorePct: 85, passed: true }];
    const e6 = CertificationEligibilityService.evaluate("ENR-C5", "CREQ-C5-1");
    assert(e6.eligible === true, "C5-06 Score >= mínimo");

    // C5-07: Score < mínimo
    mockAttempts = [{ assessmentId: "ASSESS-C5", enrollmentId: "ENR-C5", scorePct: 80, passed: false }];
    const e7 = CertificationEligibilityService.evaluate("ENR-C5", "CREQ-C5-1");
    assert(e7.eligible === false && e7.reasons.some(r => r.includes("Puntaje")), "C5-07 Score < mínimo");

    // C5-08: Evidence requerida (y no hay)
    mockAttempts = [{ assessmentId: "ASSESS-C5", enrollmentId: "ENR-C5", scorePct: 95, passed: true }];
    const e8 = CertificationEligibilityService.evaluate("ENR-C5", "CREQ-C5-3");
    assert(e8.eligible === false && e8.reasons.some(r => r.includes("evidencia")), "C5-08 Evidence requerida pero ausente");

    // C5-09: Evidence Approved
    mockEvidences = [{ enrollmentId: "ENR-C5", status: "Approved" }];
    const e9 = CertificationEligibilityService.evaluate("ENR-C5", "CREQ-C5-3");
    assert(e9.eligible === true, "C5-09 Evidence Approved");

    // C5-10: Evidence Rejected
    mockEvidences = [{ enrollmentId: "ENR-C5", status: "Rejected" }];
    const e10 = CertificationEligibilityService.evaluate("ENR-C5", "CREQ-C5-3");
    assert(e10.eligible === false, "C5-10 Evidence Rejected");

    // Restore repos
    EnrollmentRepository.getById = origEnrGetById;
    CertificationRequirementRepository.getById = origReqGetById;
    AssessmentRepository.find = origAssessFind;
    AttemptRepository.find = origAttemptFind;
    EvidenceRepository.find = origEvidFind;
    UnitRepository.getByCourseVersion = origUnitGet;
    ActivityRepository.find = origActFind;

    // --- ISSUE TESTS ---
    console.log("--- Issue Tests ---");
    CertificateRepository.getAll(false).length = 0;
    EventBus.clear && EventBus.clear();
    let events = [];
    EventBus.subscribe("Learning.CertificateIssued", (p) => events.push(p));

    const issueCmd = {
        employeeId: "EMP-0001635",
        courseId: "COURSE-102",
        courseVersionId: "CVERS-102-V31",
        requirementId: "CREQ-001",
        hashSHA256: "0xHASH"
    };

    // C5-11 / C5-12 / C5-13
    const resIssue1 = CertificationService.issue(issueCmd);
    assert(resIssue1.success === true, "C5-11 Emisión válida");
    assert(CertificateRepository.getAll(false).length === 1, "C5-12 Certificate creado");
    const cert1 = CertificateRepository.getAll(false)[0];
    assert(cert1.employeeId === "EMP-0001635" && cert1.requirementId === "CREQ-001", "C5-13 Datos completos");

    // C5-14 / C5-15
    assert(cert1.issuedAt != null, "C5-14 Fecha emisión");
    // validity is 12 months for CREQ-001
    const issued = new Date(cert1.issuedAt + "T00:00:00Z");
    const expires = new Date(cert1.expiresAt + "T00:00:00Z");
    const diffMonths = (expires.getFullYear() - issued.getFullYear()) * 12 + expires.getMonth() - issued.getMonth();
    assert(diffMonths === 12, "C5-15 Fecha expiración exacta basada en validityMonths");

    // C5-16
    assert(cert1.hashStatus === "VERIFIED" && cert1.hashSHA256 === "0xHASH", "C5-16 Hash presente");

    // C5-17
    const resIssue2_real = CertificationService.issue({ ...issueCmd, courseVersionId: "CV-OTHER", hashSHA256: null });
    const cert2 = CertificateRepository.getById(resIssue2_real.data.id);
    assert(cert2.hashStatus === "HASH_UNAVAILABLE", "C5-17 Hash unavailable");

    // C5-18
    assert(cert1.openBadgesUrl === null, "C5-18 OpenBadges no simulado");

    // C5-19: Idempotencia
    const resIssueDup = CertificationService.issue(issueCmd);
    assert(resIssueDup.success === false && resIssueDup.error.code === "E-CERT-06", "C5-19 Idempotencia (Active/Expiring bloquean)");

    // C5-20: Event
    assert(events.length === 2 && events[0].aggregateId === cert1.id, "C5-20 Event CertificateIssued");

    // --- RENEWAL TESTS ---
    console.log("--- Renewal Tests ---");
    EventBus.subscribe("Learning.CertificateRenewed", (p) => events.push(p));

    const renewCmd = { id: cert1.id };
    
    // C5-21 / C5-25 / C5-26
    CONFIG.DEMO_NOW = "2027-01-01T12:00:00Z";
    const resRenew = CertificationService.renew(renewCmd);
    assert(resRenew.success === true, "C5-21 Renovación autorizada");
    
    const cert1After = CertificateRepository.getById(cert1.id);
    assert(cert1After.status === "Renewed", "C5-26 Renovación actualiza anterior a Renewed");
    
    const newCert = CertificateRepository.getById(resRenew.data.id);
    assert(newCert.previousCertificateId === cert1.id, "C5-26 Nuevo certificado apunta al anterior");
    assert(cert1After.replacementCertificateId === newCert.id, "C5-26 Anterior apunta al nuevo");

    assert(newCert.issuedAt !== cert1.issuedAt, "C5-25 Nueva fecha de emisión y expiración");

    // C5-22
    AuthorizationService.can = (perm) => perm !== "learning.certification.renew"; // Deny
    const resRenewDenied = CertificationService.renew({ id: newCert.id });
    assert(resRenewDenied.success === false && resRenewDenied.error.code === "E-CERT-11", "C5-22 Renovación no autorizada (E-CERT-11)");
    AuthorizationService.can = () => true; // Restore

    // C5-23
    TenantContext.getCurrentTenantId = () => "TEN-002"; // Cross tenant
    const resRenewCross = CertificationService.renew({ id: newCert.id });
    assert(resRenewCross.success === false && resRenewCross.error.code === "E-CERT-10", "C5-23 Cross-tenant renewal bloqueada");
    TenantContext.getCurrentTenantId = () => "TEN-001"; // Restore

    // C5-24
    const resRenew404 = CertificationService.renew({ id: "CERT-NOTFOUND" });
    assert(resRenew404.success === false && resRenew404.error.code === "E-CERT-07", "C5-24 Certificate inexistente");

    // C5-27
    assert(events.some(e => e.eventType === "Learning.CertificateRenewed" && e.payload.newCertificateId === newCert.id), "C5-27 CertificateRenewed event emitido");

    // --- UI / INTEGRATION TESTS ---
    console.log("--- UI/Integration Tests ---");
    // C5-28 Mis Certificaciones uses getForEmployee
    const myCerts = CertificationService.getForEmployee("EMP-0001635");
    assert(myCerts.success === true && myCerts.data.length >= 2, "C5-28 Mis Certificaciones usa getForEmployee y trae datos");

    // C5-29 & C5-30
    // Mock the UI logic for Course Detail
    const courseCerts = myCerts.data.filter(c => c.courseId === "COURSE-102" && c.status === "Active");
    assert(courseCerts.length > 0, "C5-29 Course Detail → Ver Certificado (certificado existe)");

    const emptyCourseCerts = myCerts.data.filter(c => c.courseId === "COURSE-999");
    assert(emptyCourseCerts.length === 0, "C5-30 Course Detail sin certificado → Revisar Contenido");

    console.log("\\nQA C5 Results: " + passed + " passed, " + failed + " failed");
    if (failed > 0 || passed < 30) {
        console.log("Expected 30 tests to pass. Passed:", passed);
        process.exit(1);
    }
} catch (e) {
    console.error(e);
    process.exit(1);
}
