// C6-FINAL-01C.3 supplementary gate.
// Covers only controls marked PENDING in C6_COVERAGE_MATRIX.md.

"use strict";

const fs = require("fs");
const path = require("path");
const { createRuntime, setSession, makeEligible, htmlPath, productHash } = require("./run_legacy_regression_current");

const html = fs.readFileSync(htmlPath, "utf8");
const domainSource = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
    .map(match => match[1])
    .find(script => script.includes("SEED_MOCK_DB"));

if (!domainSource) throw new Error("No se encontró el dominio del SUT.");

let passed = 0;
let failed = 0;

function assert(condition, id, description, detail = "") {
    if (condition) {
        passed++;
        console.log(`PASS ${id} - ${description}`);
    } else {
        failed++;
        console.error(`FAIL ${id} - ${description}${detail ? ` | ${detail}` : ""}`);
    }
}

function test(id, description, callback) {
    try {
        assert(Boolean(callback()), id, description);
    } catch (error) {
        assert(false, id, description, error.message);
    }
}

function sourceBlock(startExpression) {
    const match = startExpression.exec(domainSource);
    if (!match) return "";
    const start = match.index;
    const brace = domainSource.indexOf("{", start);
    let depth = 0;
    for (let i = brace; i < domainSource.length; i++) {
        if (domainSource[i] === "{") depth++;
        if (domainSource[i] === "}" && --depth === 0) return domainSource.slice(start, i + 1);
    }
    return domainSource.slice(start);
}

function eligibleEnrollment(api, id, employeeId = "EMP-0001635") {
    makeEligible(api, id, employeeId);
    return api.EnrollmentRepository.getById(id, false);
}

function assignmentEnrollmentFixture(api, assignmentId) {
    setSession(api, "HRAdmin", "EMP-0001100", "TEN-001");
    api.EventBus.clear();
    api.initEventHandlers();
    const assignment = api.AssignmentService.create({
        id: assignmentId,
        employeeId: "EMP-0002104",
        learningObjectId: "LOBJ-001",
        dueDate: "2026-10-15",
        obligationType: "Mandatory",
        assignedBy: "C6 QA",
        assignmentReasonIds: ["REASON-001"]
    }, `corr-${assignmentId}`);
    const enrollment = api.EnrollmentRepository.getAll(false)
        .find(item => item.assignmentId === assignmentId);
    return { assignment, enrollment };
}

function playerFixture(api, activityId = "ACT-101-21") {
    setSession(api, "Employee", "EMP-0001635", "TEN-001");
    const contextResult = api.resolvePlayerContext("COURSE-101");
    if (!contextResult.success) throw new Error("No fue posible resolver el contexto real del Player.");
    const context = contextResult.data;
    context.orderedActivities = api.getOrderedPlayerActivities(context);
    context.currentActivityIndex = context.orderedActivities.findIndex(activity => activity.id === activityId);
    if (context.currentActivityIndex < 0) throw new Error(`No se encontró la actividad ${activityId}.`);
    api.AppState.playerContext = context;
    api.initPlayerPlayback(context.orderedActivities[context.currentActivityIndex]);
    return { context, activity: context.orderedActivities[context.currentActivityIndex] };
}

console.log("=== ADRYAN Learning - C6 supplementary gate 01C.3 (A+B+C+D+E+F+G) ===");
console.log(`SUT: ${htmlPath}`);
console.log(`SHA-256: ${productHash}\n`);

// A — Architecture
test("C6-A05", "UI de certificaciones consulta CertificationService y no CertificateRepository directo", () => {
    const certifications = sourceBlock(/function\s+renderScreenCertifications\s*\(/);
    const modal = sourceBlock(/window\.showCourseDetailModal\s*=\s*function\s*\(/);
    return /CertificationService\.getForEmployee\s*\(/.test(certifications) &&
        /CertificationService\.getForEmployee\s*\(/.test(modal) &&
        !/CertificateRepository\./.test(certifications) && !/CertificateRepository\./.test(modal);
});

test("C6-A07", "Repositories exponen datos, no HTML ni lógica de presentación", () => {
    const runtime = createRuntime();
    const repositories = [
        runtime.api.CourseRepository, runtime.api.CourseVersionRepository, runtime.api.UnitRepository,
        runtime.api.ActivityRepository, runtime.api.EnrollmentRepository, runtime.api.ActivityProgressRepository,
        runtime.api.CertificateRepository, runtime.api.CertificationRequirementRepository
    ];
    return repositories.every(repository => {
        const data = typeof repository.getAll === "function" ? repository.getAll(false) : [];
        return Array.isArray(data) && data.every(item => typeof item === "object" && !/<(?:div|span|table|button)\b/i.test(JSON.stringify(item)));
    });
});

test("C6-A10", "Cadena de arquitectura no introduce bypass entre Player, progreso, evento, eligibility y emisión", () => {
    const player = `${sourceBlock(/function\s+tickPlayback\s*\(/)}${sourceBlock(/function\s+persistPartialPlayback\s*\(/)}${sourceBlock(/function\s+stopAndPersistPlayback\s*\(/)}`;
    const completion = sourceBlock(/const\s+EnrollmentService\s*=\s*\{/);
    const handler = sourceBlock(/function\s+initEventHandlers\s*\(/);
    const runtime = createRuntime();
    const { api } = runtime;
    setSession(api, "Employee");
    api.initEventHandlers();
    eligibleEnrollment(api, "ENR-A10");
    const certificate = api.CertificateRepository.getAll(false).find(cert => cert.employeeId === "EMP-0001635" && cert.courseId === "COURSE-102");
    return /ProgressService\.(?:updateActivityProgress|completeActivity)\s*\(/.test(player) &&
        !/ActivityProgressRepository\.(?:create|update)\s*\(/.test(player) &&
        /Learning\.EnrollmentCompleted/.test(completion) &&
        /CertificationEligibilityService\.evaluate\s*\(/.test(handler) &&
        /CertificationService\.issue\s*\(/.test(handler) &&
        certificate && certificate.status === "Active";
});

// B — Tenant and employee isolation
test("C6-B04", "getForEmployee no expone certificados de tenant ajeno", () => {
    const { api } = createRuntime();
    api.MockDB.certificates.push({ id: "CERT-B04-T2", employeeId: "EMP-B04-T2", courseId: "COURSE-102", courseVersionId: "CVERS-102-V31", requirementId: "CREQ-001", status: "Active", tenantId: "TEN-002" });
    setSession(api, "HRAdmin", "EMP-0001635", "TEN-001");
    const result = api.CertificationService.getForEmployee("EMP-B04-T2");
    return result.success && result.data.every(cert => cert.tenantId === "TEN-001") && !result.data.some(cert => cert.id === "CERT-B04-T2");
});

test("C6-B06", "renew rechaza certificado de tenant ajeno", () => {
    const { api } = createRuntime();
    api.MockDB.certificates.push({ id: "CERT-B06-T2", employeeId: "EMP-0001635", courseId: "COURSE-102", courseVersionId: "CVERS-102-V31", requirementId: "CREQ-001", status: "Active", tenantId: "TEN-002" });
    setSession(api, "LearningManager", "EMP-0001635", "TEN-001");
    const result = api.CertificationService.renew({ id: "CERT-B06-T2" });
    return !result.success && result.error.code === "E-CERT-10";
});

test("C6-B08", "handler no emite certificado a partir de EnrollmentCompleted de tenant ajeno", () => {
    const { api } = createRuntime();
    setSession(api, "Employee", "EMP-0001635", "TEN-001");
    api.initEventHandlers();
    const before = api.CertificateRepository.getAll(false).length;
    api.EventBus.publish({
        eventType: "Learning.EnrollmentCompleted", aggregateId: "ENR-B08-T2", correlationId: "corr-b08",
        tenantId: "TEN-002",
        payload: { enrollmentId: "ENR-B08-T2", employeeId: "EMP-T2", courseId: "COURSE-102", courseVersionId: "CVERS-102-V31" }
    });
    return api.CertificateRepository.getAll(false).length === before;
});

test("C6-B09", "Employee no puede actualizar progreso de enrollment ajeno", () => {
    const { api } = createRuntime();
    setSession(api, "Employee", "EMP-0001842", "TEN-001");
    const result = api.ProgressService.updateActivityProgress({ enrollmentId: "ENR-001", activityId: "ACT-101-21", progressPct: 50 });
    return !result.success && result.error.code === "E-10";
});

test("C6-B12", "Eligibility rechaza explícitamente tenant mismatch", () => {
    const { api } = createRuntime();
    setSession(api, "Employee", "EMP-0001635", "TEN-001");
    const original = api.EnrollmentRepository.getById;
    try {
        api.EnrollmentRepository.getById = () => ({ id: "ENR-B12-T2", employeeId: "EMP-T2", courseId: "COURSE-102", courseVersionId: "CVERS-102-V31", status: "Completed", tenantId: "TEN-002" });
        const result = api.CertificationEligibilityService.evaluate("ENR-B12-T2", "CREQ-001");
        return !result.eligible && result.reasons.some(reason => /Tenant/i.test(reason));
    } finally {
        api.EnrollmentRepository.getById = original;
    }
});

test("C6-B14", "getStatus no expone certificado de tenant ajeno", () => {
    const { api } = createRuntime();
    api.MockDB.certificates.push({ id: "CERT-B14-T2", employeeId: "EMP-0001635", courseId: "COURSE-102", courseVersionId: "CVERS-102-V31", requirementId: "CREQ-001", status: "Active", tenantId: "TEN-002" });
    setSession(api, "HRAdmin", "EMP-0001635", "TEN-001");
    const result = api.CertificationService.getStatus("CERT-B14-T2");
    return !result.success && result.error.code === "E-CERT-10";
});

// C — Authorization and scope
test("C6-C05", "isInternal no elude el aislamiento de tenant", () => {
    const { api } = createRuntime();
    setSession(api, "LearningManager", "EMP-0001635", "TEN-002");
    const result = api.CertificationService.issue({
        employeeId: "EMP-0001635", courseId: "COURSE-102", courseVersionId: "CVERS-102-V31",
        requirementId: "CREQ-001", tenantId: "TEN-002", isInternal: true
    });
    return !result.success && result.error.code === "E-CERT-10";
});

test("C6-C06", "Player interno puede persistir y employee ajeno es rechazado sin nuevo permiso", () => {
    const { api } = createRuntime();
    setSession(api, "Employee", "EMP-0001635", "TEN-001");
    const internal = api.ProgressService.updateActivityProgress({ enrollmentId: "ENR-001", activityId: "ACT-101-21", progressPct: 50 });
    setSession(api, "Employee", "EMP-0001842", "TEN-001");
    const external = api.ProgressService.updateActivityProgress({ enrollmentId: "ENR-001", activityId: "ACT-101-21", progressPct: 75 });
    return internal.success && !external.success && external.error.code === "E-10";
});

function calculationFixture(requiredCount, completedCount, optionalCompleted = false) {
    const { api } = createRuntime();
    setSession(api, "Employee");
    const originals = {
        enrollment: api.EnrollmentRepository.getById,
        units: api.UnitRepository.getByCourseVersion,
        activities: api.ActivityRepository.find,
        progress: api.ActivityProgressRepository.getByEnrollment
    };
    try {
        api.EnrollmentRepository.getById = () => ({ id: "ENR-D", courseVersionId: "CV-D", tenantId: "TEN-001" });
        api.UnitRepository.getByCourseVersion = () => [{ id: "UNIT-D" }];
        api.ActivityRepository.find = () => [
            ...Array.from({ length: requiredCount }, (_, index) => ({ id: `REQ-${index}`, unitId: "UNIT-D", required: true })),
            { id: "OPT-D", unitId: "UNIT-D", required: false }
        ];
        api.ActivityProgressRepository.getByEnrollment = () => [
            ...Array.from({ length: completedCount }, (_, index) => ({ activityId: `REQ-${index}`, progressPct: 100 })),
            ...(optionalCompleted ? [{ activityId: "OPT-D", progressPct: 100 }] : [])
        ];
        return api.ProgressService.calculateEnrollmentProgress("ENR-D", "TEN-001");
    } finally {
        api.EnrollmentRepository.getById = originals.enrollment;
        api.UnitRepository.getByCourseVersion = originals.units;
        api.ActivityRepository.find = originals.activities;
        api.ActivityProgressRepository.getByEnrollment = originals.progress;
    }
}

// D — Domain rules
test("C6-D01", "Actividad Optional no completa requisitos Required", () => {
    const result = calculationFixture(1, 0, true);
    return result.progressPct === 0 && result.allRequiredCompleted === false;
});

test("C6-D02", "Sin ActivityProgress el progreso es 0%", () => {
    const result = calculationFixture(2, 0);
    return result.progressPct === 0 && result.allRequiredCompleted === false;
});

test("C6-D03", "Una de dos actividades Required completadas equivale a 50%", () => {
    const result = calculationFixture(2, 1);
    return result.progressPct === 50 && result.allRequiredCompleted === false;
});

test("C6-D05", "ProgressService solo llama complete cuando todas las Required terminan", () => {
    const { api } = createRuntime();
    setSession(api, "Employee");
    api.MockDB.activityProgress.length = 0;
    const originalComplete = api.EnrollmentService.complete;
    let calls = 0;
    try {
        api.EnrollmentService.complete = (...args) => { calls++; return originalComplete(...args); };
        api.ProgressService.updateActivityProgress({ enrollmentId: "ENR-001", activityId: "ACT-101-21", progressPct: 100 });
        return calls === 0;
    } finally {
        api.EnrollmentService.complete = originalComplete;
    }
});

test("C6-D06", "Actividad de otro CourseVersion es rechazada", () => {
    const { api } = createRuntime();
    setSession(api, "Employee");
    const result = api.ProgressService.updateActivityProgress({ enrollmentId: "ENR-001", activityId: "ACT-999-99", progressPct: 50 });
    return !result.success && result.error.code === "E-07";
});

test("C6-D07", "Certificado emitido conserva el CourseVersion del enrollment", () => {
    const { api } = createRuntime();
    eligibleEnrollment(api, "ENR-D07");
    setSession(api, "LearningManager");
    const result = api.CertificationService.issue({ employeeId: "EMP-0001635", courseId: "COURSE-102", courseVersionId: "CVERS-102-V31", requirementId: "CREQ-001" });
    return result.success && result.data.courseVersionId === "CVERS-102-V31";
});

test("C6-D08", "Sin Attempt aprobado no existe elegibilidad", () => {
    const { api } = createRuntime();
    eligibleEnrollment(api, "ENR-D08");
    api.MockDB.attempts = api.MockDB.attempts.filter(attempt => attempt.enrollmentId !== "ENR-D08");
    setSession(api, "Employee");
    const result = api.CertificationEligibilityService.evaluate("ENR-D08", "CREQ-001");
    return !result.eligible && result.assessmentSatisfied === false;
});

test("C6-D09", "Evidence no aprobada falla la elegibilidad", () => {
    const { api } = createRuntime();
    const original = {
        enrollment: api.EnrollmentRepository.getById,
        requirement: api.CertificationRequirementRepository.getById,
        evidence: api.EvidenceRepository.find
    };
    try {
        api.EnrollmentRepository.getById = () => ({ id: "ENR-D09", employeeId: "EMP-0001635", learningObjectId: "LOBJ-D09", courseVersionId: "CVERS-102-V31", status: "Completed", tenantId: "TEN-001" });
        api.CertificationRequirementRepository.getById = () => ({ id: "REQ-D09", tenantId: "TEN-001", minPassingScorePct: 0, requiresEvidence: true });
        api.EvidenceRepository.find = predicate => [{ enrollmentId: "ENR-D09", status: "Rejected" }].filter(predicate);
        const result = api.CertificationEligibilityService.evaluate("ENR-D09", "REQ-D09");
        return !result.eligible && result.evidenceSatisfied === false;
    } finally {
        api.EnrollmentRepository.getById = original.enrollment;
        api.CertificationRequirementRepository.getById = original.requirement;
        api.EvidenceRepository.find = original.evidence;
    }
});

test("C6-D10", "Enrollment Active no desencadena emisión de certificado", () => {
    const { api } = createRuntime();
    setSession(api, "Employee");
    api.MockDB.enrollments.push({ id: "ENR-D10", employeeId: "EMP-0001635", courseId: "COURSE-102", courseVersionId: "CVERS-102-V31", status: "Active", progressPct: 0, tenantId: "TEN-001" });
    api.initEventHandlers();
    const before = api.CertificateRepository.getAll(false).length;
    api.EventBus.publish({ eventType: "Learning.EnrollmentCompleted", aggregateId: "ENR-D10", tenantId: "TEN-001", payload: { enrollmentId: "ENR-D10", employeeId: "EMP-0001635", courseId: "COURSE-102", courseVersionId: "CVERS-102-V31" } });
    return api.CertificateRepository.getAll(false).length === before;
});

test("C6-D11", "Renewed prevalece sobre fechas futuras", () => {
    const { api } = createRuntime();
    return api.CertificationService.deriveCertificateStatus({ status: "Renewed", expiresAt: "2099-01-01" }, "2026-09-18") === "Renewed";
});

test("C6-D12", "Certificado que vence en 29 días es Expiring", () => {
    const { api } = createRuntime();
    return api.CertificationService.deriveCertificateStatus({ status: "Active", expiresAt: "2026-10-17" }, "2026-09-18") === "Expiring";
});

test("C6-D13", "Certificado vencido naturalmente es Expired", () => {
    const { api } = createRuntime();
    return api.CertificationService.deriveCertificateStatus({ status: "Active", expiresAt: "2026-09-17" }, "2026-09-18") === "Expired";
});

test("C6-D14", "renew crea nuevo certificado y marca el anterior Renewed", () => {
    const { api } = createRuntime();
    eligibleEnrollment(api, "ENR-D14");
    setSession(api, "LearningManager");
    const issued = api.CertificationService.issue({ employeeId: "EMP-0001635", courseId: "COURSE-102", courseVersionId: "CVERS-102-V31", requirementId: "CREQ-001" });
    api.CONFIG.DEMO_NOW = "2027-01-01T12:00:00Z";
    const renewed = api.CertificationService.renew({ id: issued.data.id });
    const prior = api.CertificateRepository.getById(issued.data.id, false);
    return issued.success && renewed.success && prior.status === "Renewed" && renewed.data.status === "Active";
});

test("C6-D15", "renew conserva vínculos previous/replacement", () => {
    const { api } = createRuntime();
    eligibleEnrollment(api, "ENR-D15");
    setSession(api, "LearningManager");
    const issued = api.CertificationService.issue({ employeeId: "EMP-0001635", courseId: "COURSE-102", courseVersionId: "CVERS-102-V31", requirementId: "CREQ-001" });
    api.CONFIG.DEMO_NOW = "2027-01-01T12:00:00Z";
    const renewed = api.CertificationService.renew({ id: issued.data.id });
    const prior = api.CertificateRepository.getById(issued.data.id, false);
    return issued.success && renewed.success && prior.replacementCertificateId === renewed.data.id && renewed.data.previousCertificateId === issued.data.id;
});

function eventHistory(api, eventType) {
    return api.EventBus.getHistory().filter(event => !eventType || event.eventType === eventType);
}

function certificateCommand() {
    return { employeeId: "EMP-0001635", courseId: "COURSE-102", courseVersionId: "CVERS-102-V31", requirementId: "CREQ-001" };
}

// E — Events
test("C6-E01", "ActivityProgressUpdated se observa solo después de persistir ActivityProgress", () => {
    const { api } = createRuntime();
    setSession(api, "Employee");
    api.MockDB.activityProgress.length = 0;
    api.EventBus.clear();
    let persistedWhenObserved = false;
    api.EventBus.subscribe("Learning.ActivityProgressUpdated", event => {
        const record = api.ActivityProgressRepository.getByEnrollment(event.payload.enrollmentId)
            .find(progress => progress.activityId === event.payload.activityId);
        persistedWhenObserved = Boolean(record && record.progressPct === event.payload.progressPct);
    });
    const result = api.ProgressService.updateActivityProgress({ enrollmentId: "ENR-001", activityId: "ACT-101-21", progressPct: 50 });
    return result.success && persistedWhenObserved;
});

test("C6-E03", "CertificateIssued publica payload y metadatos del certificado real", () => {
    const { api } = createRuntime();
    eligibleEnrollment(api, "ENR-E03");
    setSession(api, "LearningManager");
    api.EventBus.clear();
    const issued = api.CertificationService.issue(certificateCommand(), "corr-e03");
    const event = eventHistory(api, "Learning.CertificateIssued")[0];
    return issued.success && event && event.payload.id === issued.data.id &&
        event.payload.employeeId === issued.data.employeeId && event.payload.courseId === issued.data.courseId &&
        event.aggregateId === issued.data.id && event.tenantId === "TEN-001" && event.correlationId === "corr-e03";
});

test("C6-E04", "CertificateRenewed publica previousCertificateId y newCertificateId correctos", () => {
    const { api } = createRuntime();
    eligibleEnrollment(api, "ENR-E04");
    setSession(api, "LearningManager");
    const issued = api.CertificationService.issue(certificateCommand(), "corr-e04-issue");
    api.CONFIG.DEMO_NOW = "2027-01-01T12:00:00Z";
    api.EventBus.clear();
    const renewed = api.CertificationService.renew({ id: issued.data.id }, "corr-e04-renew");
    const event = eventHistory(api, "Learning.CertificateRenewed")[0];
    return issued.success && renewed.success && event &&
        event.payload.previousCertificateId === issued.data.id && event.payload.newCertificateId === renewed.data.id &&
        event.payload.employeeId === "EMP-0001635" && event.payload.courseId === "COURSE-102" &&
        event.aggregateId === issued.data.id && event.tenantId === "TEN-001" && event.correlationId === "corr-e04-renew";
});

test("C6-E05", "Operación fallida no publica eventos de dominio", () => {
    const { api } = createRuntime();
    setSession(api, "Employee");
    api.EventBus.clear();
    const before = eventHistory(api).length;
    const result = api.CertificationService.issue(certificateCommand(), "corr-e05");
    return !result.success && eventHistory(api).length === before;
});

test("C6-E06", "correlationId se conserva desde EnrollmentCompleted hasta CertificateIssued", () => {
    const { api } = createRuntime();
    eligibleEnrollment(api, "ENR-E06");
    setSession(api, "Employee");
    api.EventBus.clear();
    api.initEventHandlers();
    api.EventBus.publish({
        eventType: "Learning.EnrollmentCompleted", aggregateId: "ENR-E06", correlationId: "corr-c6-e06",
        tenantId: "TEN-001",
        payload: { enrollmentId: "ENR-E06", employeeId: "EMP-0001635", courseId: "COURSE-102", courseVersionId: "CVERS-102-V31" }
    });
    const events = eventHistory(api);
    const completed = events.find(event => event.eventType === "Learning.EnrollmentCompleted");
    const issued = events.find(event => event.eventType === "Learning.CertificateIssued");
    return completed && issued && completed.correlationId === "corr-c6-e06" && issued.correlationId === "corr-c6-e06";
});

test("C6-E07", "tenantId del evento proviene del contexto y no del command", () => {
    const { api } = createRuntime();
    eligibleEnrollment(api, "ENR-E07");
    setSession(api, "LearningManager", "EMP-0001635", "TEN-001");
    api.EventBus.clear();
    const issued = api.CertificationService.issue({ ...certificateCommand(), tenantId: "TEN-002" }, "corr-e07");
    const event = eventHistory(api, "Learning.CertificateIssued")[0];
    return issued.success && event && event.tenantId === "TEN-001";
});

test("C6-E08", "Handler ante evento duplicado no publica un segundo CertificateIssued", () => {
    const { api } = createRuntime();
    eligibleEnrollment(api, "ENR-E08");
    setSession(api, "Employee");
    api.EventBus.clear();
    api.initEventHandlers();
    const event = {
        eventType: "Learning.EnrollmentCompleted", aggregateId: "ENR-E08", correlationId: "corr-e08", tenantId: "TEN-001",
        payload: { enrollmentId: "ENR-E08", employeeId: "EMP-0001635", courseId: "COURSE-102", courseVersionId: "CVERS-102-V31" }
    };
    api.EventBus.publish(event);
    api.EventBus.publish(event);
    return eventHistory(api, "Learning.CertificateIssued").length === 1;
});

test("C6-E09", "CertificateIssued usa Certificate.id como aggregateId", () => {
    const { api } = createRuntime();
    eligibleEnrollment(api, "ENR-E09");
    setSession(api, "LearningManager");
    api.EventBus.clear();
    const issued = api.CertificationService.issue(certificateCommand(), "corr-e09");
    const event = eventHistory(api, "Learning.CertificateIssued")[0];
    return issued.success && event && event.aggregateId === issued.data.id;
});

test("C6-E10", "Operaciones de lectura no generan eventos de dominio", () => {
    const { api } = createRuntime();
    eligibleEnrollment(api, "ENR-E10");
    setSession(api, "LearningManager");
    const issued = api.CertificationService.issue(certificateCommand(), "corr-e10-issue");
    setSession(api, "HRAdmin");
    api.EventBus.clear();
    const before = eventHistory(api).length;
    const byId = api.CertificationService.getById(issued.data.id);
    const list = api.CertificationService.getForEmployee("EMP-0001635");
    const status = api.CertificationService.getStatus(issued.data.id);
    return issued.success && byId.success && list.success && status.success && eventHistory(api).length === before;
});

// F — Idempotency
test("C6-F01", "Repetir progreso 100% conserva un único ActivityProgress", () => {
    const { api } = createRuntime();
    setSession(api, "Employee");
    api.MockDB.activityProgress.length = 0;
    for (let index = 0; index < 3; index++) {
        api.ProgressService.updateActivityProgress({ enrollmentId: "ENR-001", activityId: "ACT-101-21", progressPct: 100 });
    }
    const records = api.ActivityProgressRepository.getByEnrollment("ENR-001").filter(progress => progress.activityId === "ACT-101-21");
    return records.length === 1 && records[0].progressPct === 100;
});

test("C6-F03", "EnrollmentService.complete repetido no duplica EnrollmentCompleted", () => {
    const { api } = createRuntime();
    setSession(api, "Employee");
    const enrollment = api.EnrollmentRepository.getById("ENR-001", false);
    enrollment.status = "Active";
    enrollment.progressPct = 100;
    api.EventBus.clear();
    const first = api.EnrollmentService.complete("ENR-001", { scorePct: 100 }, "corr-f03");
    const second = api.EnrollmentService.complete("ENR-001", { scorePct: 100 }, "corr-f03-repeat");
    const events = eventHistory(api, "Learning.EnrollmentCompleted");
    return first.success && second.success && api.EnrollmentRepository.getById("ENR-001", false).status === "Completed" && events.length === 1;
});

test("C6-F05", "Certificado Expiring bloquea emisión duplicada", () => {
    const { api } = createRuntime();
    eligibleEnrollment(api, "ENR-F05");
    setSession(api, "LearningManager");
    const first = api.CertificationService.issue(certificateCommand());
    first.data.status = "Expiring";
    const second = api.CertificationService.issue(certificateCommand());
    return first.success && !second.success && second.error.code === "E-CERT-06";
});

test("C6-F06", "Certificado Expired permite una nueva emisión válida", () => {
    const { api } = createRuntime();
    eligibleEnrollment(api, "ENR-F06");
    setSession(api, "LearningManager");
    const first = api.CertificationService.issue(certificateCommand());
    first.data.status = "Active";
    first.data.expiresAt = "2026-09-17";
    const second = api.CertificationService.issue(certificateCommand());
    return first.success && second.success && second.data.id !== first.data.id;
});

test("C6-F07", "Certificado Renewed permite una nueva emisión válida", () => {
    const { api } = createRuntime();
    eligibleEnrollment(api, "ENR-F07");
    setSession(api, "LearningManager");
    const first = api.CertificationService.issue(certificateCommand());
    first.data.status = "Renewed";
    const second = api.CertificationService.issue(certificateCommand());
    return first.success && second.success && second.data.id !== first.data.id;
});

test("C6-F08", "Segunda renovación del mismo certificado original es bloqueada", () => {
    const { api } = createRuntime();
    eligibleEnrollment(api, "ENR-F08");
    setSession(api, "LearningManager");
    const issued = api.CertificationService.issue(certificateCommand());
    api.CONFIG.DEMO_NOW = "2027-01-01T12:00:00Z";
    const firstRenewal = api.CertificationService.renew({ id: issued.data.id });
    const countAfterFirst = api.CertificateRepository.getAll(false).length;
    const secondRenewal = api.CertificationService.renew({ id: issued.data.id });
    return issued.success && firstRenewal.success && !secondRenewal.success && api.CertificateRepository.getAll(false).length === countAfterFirst;
});

test("C6-F09", "Tres EnrollmentCompleted duplicados dejan un único certificado persistido", () => {
    const { api } = createRuntime();
    eligibleEnrollment(api, "ENR-F09");
    setSession(api, "Employee");
    api.EventBus.clear();
    api.initEventHandlers();
    const event = {
        eventType: "Learning.EnrollmentCompleted", aggregateId: "ENR-F09", correlationId: "corr-f09", tenantId: "TEN-001",
        payload: { enrollmentId: "ENR-F09", employeeId: "EMP-0001635", courseId: "COURSE-102", courseVersionId: "CVERS-102-V31" }
    };
    api.EventBus.publish(event);
    api.EventBus.publish(event);
    api.EventBus.publish(event);
    const certificates = api.CertificateRepository.getAll(false).filter(cert => cert.employeeId === "EMP-0001635" && cert.courseId === "COURSE-102" && cert.courseVersionId === "CVERS-102-V31");
    return certificates.length === 1;
});

test("C6-F10", "Eligibility repetida permanece pura y devuelve el mismo resultado", () => {
    const { api } = createRuntime();
    eligibleEnrollment(api, "ENR-F10");
    setSession(api, "Employee");
    const before = JSON.stringify(api.MockDB);
    const results = Array.from({ length: 5 }, () => api.CertificationEligibilityService.evaluate("ENR-F10", "CREQ-001"));
    return JSON.stringify(api.MockDB) === before && results.every(result => result.eligible === results[0].eligible && JSON.stringify(result.reasons) === JSON.stringify(results[0].reasons));
});

// G — Assignment, Player and completion flow
test("C6-G01", "AssignmentCreated crea el Enrollment real del colaborador asignado", () => {
    const { api } = createRuntime();
    const { assignment, enrollment } = assignmentEnrollmentFixture(api, "ASG-G01");
    return assignment.success && enrollment && enrollment.employeeId === "EMP-0002104" &&
        enrollment.assignmentId === assignment.data.id && enrollment.status === "Active" &&
        enrollment.tenantId === "TEN-001";
});

test("C6-G02", "Enrollment creado desde Assignment usa Course.currentVersionId", () => {
    const { api } = createRuntime();
    const { assignment, enrollment } = assignmentEnrollmentFixture(api, "ASG-G02");
    const course = enrollment && api.CourseRepository.getById(enrollment.courseId);
    return assignment.success && course && enrollment.courseVersionId === course.currentVersionId;
});

test("C6-G03", "Enrollment resuelve CourseVersion, Units y Activities de pertenencia real", () => {
    const { api } = createRuntime();
    const { assignment, enrollment } = assignmentEnrollmentFixture(api, "ASG-G03");
    if (!assignment.success || !enrollment) return false;
    const version = api.CourseVersionRepository.getById(enrollment.courseVersionId);
    const units = api.UnitRepository.getByCourseVersion(enrollment.courseVersionId);
    const unitIds = units.map(unit => unit.id);
    const activities = api.ActivityRepository.getAll(false).filter(activity => unitIds.includes(activity.unitId));
    return version && version.courseId === enrollment.courseId && units.length > 0 && activities.length > 0 &&
        units.every(unit => unit.courseVersionId === version.id) && activities.every(activity => unitIds.includes(activity.unitId));
});

test("C6-G04", "Player reanuda progressPct, lastPositionSeconds y effectiveTimeSeconds almacenados", () => {
    const { api } = createRuntime();
    setSession(api, "Employee", "EMP-0001635", "TEN-001");
    const persisted = api.ProgressService.updateActivityProgress({
        enrollmentId: "ENR-001", activityId: "ACT-101-21", progressPct: 50,
        lastPositionSeconds: 120, effectiveTimeSeconds: 60
    });
    const { context } = playerFixture(api);
    const playback = context.playerPlayback;
    return persisted.success && playback && playback.activityId === "ACT-101-21" &&
        playback.progressPct === 50 && playback.currentPositionSeconds === 120 &&
        playback.effectiveTimeSeconds === 60 && playback.isPlaying === false;
});

test("C6-G05", "Player no persiste durante ticks y persiste al pausar", () => {
    const { api } = createRuntime();
    const { context, activity } = playerFixture(api);
    const initialPosition = context.playerPlayback.currentPositionSeconds;
    const initialEffectiveTime = context.playerPlayback.effectiveTimeSeconds;
    const beforeTicks = JSON.stringify(api.MockDB.activityProgress);
    api.togglePlayPause();
    api.tickPlayback();
    api.tickPlayback();
    api.tickPlayback();
    const unchangedDuringTicks = JSON.stringify(api.MockDB.activityProgress) === beforeTicks;
    api.togglePlayPause();
    const persisted = api.ActivityProgressRepository.getByEnrollment(context.enrollment.id)
        .find(progress => progress.activityId === activity.id);
    return unchangedDuringTicks && persisted && persisted.lastPositionSeconds === initialPosition + 3 &&
        persisted.effectiveTimeSeconds === initialEffectiveTime + 3 && persisted.progressPct < 100 &&
        context.playerPlayback.isPlaying === false;
});

test("C6-G07", "EnrollmentCompleted recorre handler real, eligibility y emisión sin sustituir servicios", () => {
    const { api } = createRuntime();
    eligibleEnrollment(api, "ENR-G07");
    setSession(api, "Employee", "EMP-0001635", "TEN-001");
    api.EventBus.clear();
    api.initEventHandlers();
    const originalEvaluate = api.CertificationEligibilityService.evaluate;
    const originalIssue = api.CertificationService.issue;
    const trace = [];
    let evaluationCalls = 0;
    let issueCalls = 0;
    try {
        api.CertificationEligibilityService.evaluate = (...args) => {
            evaluationCalls++;
            trace.push("evaluate");
            return originalEvaluate(...args);
        };
        api.CertificationService.issue = (...args) => {
            issueCalls++;
            trace.push("issue");
            return originalIssue(...args);
        };
        api.EventBus.publish({
            eventType: "Learning.EnrollmentCompleted",
            aggregateId: "ENR-G07",
            correlationId: "corr-g07",
            tenantId: "TEN-001",
            payload: {
                enrollmentId: "ENR-G07",
                employeeId: "EMP-0001635",
                courseId: "COURSE-102",
                courseVersionId: "CVERS-102-V31"
            }
        });
    } finally {
        api.CertificationEligibilityService.evaluate = originalEvaluate;
        api.CertificationService.issue = originalIssue;
    }
    const certificates = api.CertificateRepository.getAll(false)
        .filter(certificate => certificate.employeeId === "EMP-0001635" && certificate.courseId === "COURSE-102" && certificate.status === "Active");
    return evaluationCalls >= 1 && issueCalls === 1 && trace[0] === "evaluate" && trace.includes("issue") &&
        certificates.length === 1 && eventHistory(api, "Learning.CertificateIssued").length === 1;
});

console.log(`\n=== Resultado C6 01C.3 (A+B+C+D+E+F+G): ${passed} PASS, ${failed} FAIL ===`);
if (failed > 0) process.exitCode = 1;
