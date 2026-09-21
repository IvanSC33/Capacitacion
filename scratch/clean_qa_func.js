const fs = require('fs');
const filePath = 'f:/PortalCapacitacion/ADRYAN_Learning_Functional_Prototype.html';
let html = fs.readFileSync(filePath, 'utf8');

// Replace runDomainServicesAndEventBusQA with clean single implementation
const startFunc = html.indexOf("function runDomainServicesAndEventBusQA()");
const endFunc = html.indexOf("function runHardcodingScanQA()", startFunc);

if (startFunc !== -1 && endFunc !== -1) {
    const cleanQA = `function runDomainServicesAndEventBusQA() {
    if (typeof initEventHandlers === "function") {
        initEventHandlers();
    }
    const results = [];
    const currentTenantBackup = AppState.session.tenantId;
    const currentRoleBackup = AppState.session.role;
    const currentEmpBackup = AppState.session.employeeId;

    AppState.session.tenantId = "TEN-001";
    AppState.session.role = "HRAdmin";

    // Test 1: Domain Services Existence Mapping
    const servicesExist = (typeof DomainServices !== "undefined") &&
                          (typeof DomainServices.AssignmentService !== "undefined") &&
                          (typeof DomainServices.EnrollmentService !== "undefined") &&
                          (typeof DomainServices.CertificationService !== "undefined") &&
                          (typeof DomainServices.NotificationService !== "undefined");
    results.push({ name: "Domain Services Mapping", pass: servicesExist });

    // Test 2: Authorization Service Guard (Employee role cannot create assignment)
    AppState.session.role = "Employee";
    const unauthorizedAsg = AssignmentService.create({
        employeeId: "EMP-0001635",
        learningObjectId: "LOBJ-001",
        courseId: "COURSE-101",
        courseVersionId: "CVERS-101-V24",
        obligationType: "Mandatory",
        dueDate: "2026-10-15",
        assignedBy: "Test Suite",
        assignmentReasonIds: ["REASON-001"]
    });
    results.push({ name: "Service Authorization Guard", pass: unauthorizedAsg.success === false && unauthorizedAsg.error.code === "AUTHORIZATION_DENIED" });

    // Restore HRAdmin for subsequent tests
    AppState.session.role = "HRAdmin";

    // Test 3: Negative Validations - Missing Data
    const missingDueDate = AssignmentService.create({ employeeId: "EMP-0001635", learningObjectId: "LOBJ-001", obligationType: "Mandatory", assignedBy: "Test" });
    results.push({ name: "Negative Test: Missing DueDate Fails", pass: missingDueDate.success === false });

    const missingObligation = AssignmentService.create({ employeeId: "EMP-0001635", learningObjectId: "LOBJ-001", dueDate: "2026-10-15", assignedBy: "Test" });
    results.push({ name: "Negative Test: Missing ObligationType Fails", pass: missingObligation.success === false });

    const missingAssignedBy = AssignmentService.create({ employeeId: "EMP-0001635", learningObjectId: "LOBJ-001", obligationType: "Mandatory", dueDate: "2026-10-15" });
    results.push({ name: "Negative Test: Missing AssignedBy Fails", pass: missingAssignedBy.success === false });

    const missingReason = AssignmentService.create({ employeeId: "EMP-0001635", learningObjectId: "LOBJ-001", obligationType: "Mandatory", dueDate: "2026-10-15", assignedBy: "Test", assignmentReasonIds: [] });
    results.push({ name: "Negative Test: Missing AssignmentReason Fails", pass: missingReason.success === false });

    const missingObligationEnrollment = EnrollmentService.enroll({ employeeId: "EMP-0001635", courseId: "COURSE-101", courseVersionId: "CVERS-101-V24", assignedBy: "Test", dueDate: "2026-10-15" });
    results.push({ name: "Negative Test: Missing ObligationType in Enrollment Fails", pass: missingObligationEnrollment.success === false });

    const missingAssignedByEnrollment = EnrollmentService.enroll({ employeeId: "EMP-0001635", courseId: "COURSE-101", courseVersionId: "CVERS-101-V24", obligationType: "Mandatory", dueDate: "2026-10-15" });
    results.push({ name: "Negative Test: Missing AssignedBy in Enrollment Fails", pass: missingAssignedByEnrollment.success === false });

    // Test 4: Cross-Tenant Guard in Domain Services
    AppState.session.role = "HRAdmin";
    AppState.session.tenantId = "TEN-002";
    const crossTenantAsg = AssignmentService.create({
        employeeId: "EMP-0001635",
        learningObjectId: "LOBJ-001",
        courseId: "COURSE-101",
        courseVersionId: "CVERS-101-V24",
        obligationType: "Mandatory",
        dueDate: "2026-10-15",
        assignedBy: "Test",
        assignmentReasonIds: ["REASON-001"],
        tenantId: "TEN-001"
    });
    results.push({ name: "Service Cross-Tenant Guard", pass: crossTenantAsg.success === false && crossTenantAsg.error.code === "TENANT_WRITE_DENIED" });

    AppState.session.tenantId = "TEN-001";

    // Test 5: Flow 1 (AssignmentService.create -> Learning.AssignmentCreated -> EnrollmentService.enroll)
    const flow1EmpId = "EMP-TEST-FLOW1-001";
    EmployeeRepository.create({ id: flow1EmpId, name: "Emp Test Flow 1", position: "Operador", area: "Operaciones Subterráneas", tenantId: "TEN-001" });
    const flow1Reason = AssignmentReasonRepository.create({ id: "REASON-FLOW1-001", assignmentId: "PENDING", ruleVersionId: "RVERS-001-V1", tenantId: "TEN-001" });
    
    const flow1Res = AssignmentService.create({
        employeeId: flow1EmpId,
        learningObjectId: "LOBJ-001",
        courseId: "COURSE-101",
        courseVersionId: "CVERS-101-V24",
        obligationType: "Mandatory",
        dueDate: "2026-12-31",
        assignedBy: "Flow1 Test",
        assignmentReasonIds: [flow1Reason.id],
        tenantId: "TEN-001"
    });

    results.push({ name: "Flow 1 (Asg -> Enr)", pass: flow1Res.success === true });

    const createdEnr = EnrollmentRepository.find(e => e.employeeId === flow1EmpId);
    const hasAutoEnrollment = createdEnr.length > 0 && createdEnr[0].assignedBy === "Flow1 Test" && createdEnr[0].obligationType === "Mandatory";
    results.push({ name: "Flow 1 Auto Enrollment & Contract Integrity", pass: hasAutoEnrollment });

    // Test 6: Flow 2 (EnrollmentCompleted -> CertificationIssued -> NotificationCreated)
    if (createdEnr.length > 0) {
        const enrId = createdEnr[0].id;
        EnrollmentService.complete(enrId, { scorePct: 95, requirementId: "CREQ-001" });
        const certs = CertificateRepository.find(c => c.employeeId === flow1EmpId);
        const notifs = NotificationRepository.find(n => n.employeeId === flow1EmpId);
        results.push({ name: "Flow 2 (Comp -> Cert -> Notif)", pass: certs.length > 0 && notifs.length > 0 });
    } else {
        results.push({ name: "Flow 2 (Comp -> Cert -> Notif)", pass: false });
    }

    // Test 7: Duplicate Event & Cross-Tenant Event Idempotency
    const dupEvt = EventBus.publish({ eventId: "EVT-DUP-TEST-001", eventType: "TestEvent", payload: {}, tenantId: "TEN-001" });
    const dupEvt2 = EventBus.publish({ eventId: "EVT-DUP-TEST-001", eventType: "TestEvent", payload: {}, tenantId: "TEN-001" });
    results.push({ name: "Duplicate Event Blocked", pass: dupEvt.success === true && (dupEvt2.duplicate === true || (dupEvt2.success === false && dupEvt2.error && dupEvt2.error.code === "DUPLICATE_EVENT")) });

    const crossEvt = EventBus.publish({ eventId: "EVT-CROSS-TEST-001", eventType: "TestEvent", payload: {}, tenantId: "TEN-999" });
    results.push({ name: "Cross-Tenant Event Blocked", pass: crossEvt.success === false && crossEvt.error.code === "TENANT_EVENT_DENIED" });

    // Test 8: QR Verification Boolean Preservation (verifiedByQR=false preserves false)
    AppState.session.role = "Employee";
    const qrTestRes = ClassroomService.enrollSession({ sessionId: "SESS-001", verifiedByQR: false });
    results.push({ name: "QR Boolean Preserved", pass: qrTestRes.success === true && qrTestRes.data.verifiedByQR === false });

    // Test 9: Assessment without Enrollment Protection
    const unauthAssess = AssessmentService.startAttempt({ assessmentId: "ASSESS-001", enrollmentId: "ENR-NON-EXISTENT" });
    results.push({ name: "Assessment Enrollment Protection", pass: unauthAssess.success === false });

    // === FASE II — ASSIGNMENT ENGINE QA TESTS ===
    AppState.session.role = "HRAdmin";
    AppState.session.tenantId = "TEN-001";

    try {
        const govRuleRes = AssignmentRuleService.create({
            name: "Regla Gobernanza Test",
            category: "Gobernanza",
            conditions: [{ field: "area", op: "EQUALS", val: "Operaciones" }],
            actions: { learningObjectId: "LOBJ-001", obligationType: "Mandatory", assignedBy: "Gobernanza Test", dueDateOffsetDays: 30 }
        });
        const govRule = govRuleRes.data.rule;

        const draftPubRes = AssignmentRuleService.updateStatus(govRule.id, "Published");
        const draftPubDenied = draftPubRes.success === false && draftPubRes.error.code === "INVALID_STATE_TRANSITION";

        AssignmentRuleService.updateStatus(govRule.id, "Review");
        const revPubRes = AssignmentRuleService.updateStatus(govRule.id, "Published");
        const revPubDenied = revPubRes.success === false && revPubRes.error.code === "INVALID_STATE_TRANSITION";

        AssignmentRuleService.updateStatus(govRule.id, "Approved");
        const appPubRes = AssignmentRuleService.updateStatus(govRule.id, "Published");

        const govPass = draftPubDenied && revPubDenied && appPubRes.success === true;
        results.push({ name: "Governance Normal Flow & Transition Denials (Draft->Pub / Rev->Pub Denied)", pass: govPass });
    } catch(e) {
        results.push({ name: "Governance Normal Flow & Transition Denials", pass: false, error: e.message });
    }

    try {
        const fpRuleRes = AssignmentRuleService.create({
            name: "Regla Force Publish Test",
            category: "Gobernanza",
            conditions: [{ field: "position", op: "EQUALS", val: "Operador" }],
            actions: { learningObjectId: "LOBJ-001", obligationType: "Mandatory", assignedBy: "ForcePublish Test", dueDateOffsetDays: 30 }
        });
        const fpRule = fpRuleRes.data.rule;

        const fpNoJust = AssignmentRuleService.forcePublish(fpRule.id, "");
        const fpNoJustDenied = fpNoJust.success === false && fpNoJust.error.code === "FORCE_PUBLISH_JUSTIFICATION_REQUIRED";

        const backupRole = AppState.session.role;
        AppState.session.role = "Employee";
        const fpUnauth = AssignmentRuleService.forcePublish(fpRule.id, "Publicación urgente por auditoría");
        const fpUnauthDenied = fpUnauth.success === false && fpUnauth.error.code === "AUTHORIZATION_DENIED";
        AppState.session.role = backupRole;

        const fpSuccess = AssignmentRuleService.forcePublish(fpRule.id, "Publicación excepcional aprobada por comité SST");
        const auditLog = AuditRepository.find(a => a.resourceId === fpRule.id && a.action === "FORCE_PUBLISH");

        const fpPass = fpNoJustDenied && fpUnauthDenied && fpSuccess.success === true && auditLog.length > 0;
        results.push({ name: "forcePublish Exception Mechanism & Audit Traceability", pass: fpPass });
    } catch(e) {
        results.push({ name: "forcePublish Exception Mechanism & Audit Traceability", pass: false, error: e.message });
    }

    try {
        const ctxTest = {
            position: "Especialista Senior Operaciones",
            seniorityMonths: 36,
            area: "Operaciones Subterráneas",
            site: "Faena Norte",
            tags: ["SST", "Maquinaria"],
            birthDate: "1990-05-15",
            middleName: null
        };

        const opsResults = [
            { op: "EQUALS", pass: AssignmentEvaluationService.evaluateOperator("EQUALS", ctxTest.position, "Especialista Senior Operaciones") },
            { op: "NOT_EQUALS", pass: AssignmentEvaluationService.evaluateOperator("NOT_EQUALS", ctxTest.site, "Faena Sur") },
            { op: "GREATER_THAN", pass: AssignmentEvaluationService.evaluateOperator("GREATER_THAN", ctxTest.seniorityMonths, 12) },
            { op: "GREATER_OR_EQUAL", pass: AssignmentEvaluationService.evaluateOperator("GREATER_OR_EQUAL", ctxTest.seniorityMonths, 36) },
            { op: "LESS_THAN", pass: AssignmentEvaluationService.evaluateOperator("LESS_THAN", ctxTest.seniorityMonths, 48) },
            { op: "LESS_OR_EQUAL", pass: AssignmentEvaluationService.evaluateOperator("LESS_OR_EQUAL", ctxTest.seniorityMonths, 36) },
            { op: "CONTAINS", pass: AssignmentEvaluationService.evaluateOperator("CONTAINS", ctxTest.area, "Subterráneas") },
            { op: "NOT_CONTAINS", pass: AssignmentEvaluationService.evaluateOperator("NOT_CONTAINS", ctxTest.area, "Finanzas") },
            { op: "STARTS_WITH", pass: AssignmentEvaluationService.evaluateOperator("STARTS_WITH", ctxTest.area, "Operaciones") },
            { op: "ENDS_WITH", pass: AssignmentEvaluationService.evaluateOperator("ENDS_WITH", ctxTest.site, "Norte") },
            { op: "IN", pass: AssignmentEvaluationService.evaluateOperator("IN", ctxTest.site, ["Faena Norte", "Faena Centro"]) },
            { op: "NOT_IN", pass: AssignmentEvaluationService.evaluateOperator("NOT_IN", ctxTest.site, ["Faena Sur", "Oficina Central"]) },
            { op: "ANY", pass: AssignmentEvaluationService.evaluateOperator("ANY", ctxTest.tags, "SST") },
            { op: "ALL", pass: AssignmentEvaluationService.evaluateOperator("ALL", ctxTest.tags, ["SST", "Maquinaria"]) },
            { op: "EXISTS", pass: AssignmentEvaluationService.evaluateOperator("EXISTS", ctxTest.position, null) },
            { op: "NOT_EXISTS", pass: AssignmentEvaluationService.evaluateOperator("NOT_EXISTS", ctxTest.middleName, null) },
            { op: "BEFORE", pass: AssignmentEvaluationService.evaluateOperator("BEFORE", "2026-05-10", "2026-12-31") },
            { op: "AFTER", pass: AssignmentEvaluationService.evaluateOperator("AFTER", "2026-05-10", "2026-01-01") },
            { op: "BETWEEN", pass: AssignmentEvaluationService.evaluateOperator("BETWEEN", "2026-05-10", ["2026-01-01", "2026-12-31"]) },
            { op: "AND", pass: AssignmentEvaluationService.evaluateConditionGroup({ logic: "AND", conditions: [{ field: "position", op: "EQUALS", val: "Especialista Senior Operaciones" }, { field: "site", op: "EQUALS", val: "Faena Norte" }] }, ctxTest).match },
            { op: "OR", pass: AssignmentEvaluationService.evaluateConditionGroup({ logic: "OR", conditions: [{ field: "site", op: "EQUALS", val: "Faena Sur" }, { field: "area", op: "EQUALS", val: "Operaciones Subterráneas" }] }, ctxTest).match },
            { op: "NOT", pass: AssignmentEvaluationService.evaluateConditionGroup({ logic: "NOT", conditions: [{ field: "site", op: "EQUALS", val: "Faena Sur" }] }, ctxTest).match }
        ];

        const all22Pass = opsResults.every(r => r.pass) && opsResults.length === 22;
        results.push({ name: "All 22 Contractual Operators (6 Comparison, 4 Text, 2 Sets, 2 Multi, 2 Exist, 3 Dates, 3 Logical)", pass: all22Pass });
    } catch(e) {
        results.push({ name: "All 22 Contractual Operators", pass: false, error: e.message });
    }

    try {
        const empExactId = "EMP-DEDUP-EXACT-001";
        const lobjExactId = "LOBJ-001";

        MockDB.assignments = (MockDB.assignments || []).filter(a => a.employeeId !== empExactId);
        MockDB.assignmentReasons = (MockDB.assignmentReasons || []).filter(r => r.employeeId !== empExactId);
        MockDB.enrollments = (MockDB.enrollments || []).filter(e => e.employeeId !== empExactId);
        MockDB.employees = (MockDB.employees || []).filter(e => e.id !== empExactId);

        EmployeeRepository.create({ id: empExactId, name: "Emp Deduplication Exact Test", area: "Operaciones Subterráneas", position: "Operador", site: "Faena Norte", tenantId: "TEN-001" });

        const r1Res = AssignmentRuleService.create({ name: "Rule 1 - Puesto", category: "Test", conditions: [{ field: "position", op: "EQUALS", val: "Operador" }], actions: { learningObjectId: lobjExactId, obligationType: "Mandatory", assignedBy: "Regla Puesto", dueDateOffsetDays: 30, reasonCode: "REASON_POSITION", reasonDescription: "Asignación por Puesto de Operador" } });
        const r1 = r1Res.data.rule;
        AssignmentRuleService.forcePublish(r1.id, "Publish test R1");

        const r2Res = AssignmentRuleService.create({ name: "Rule 2 - Competencia", category: "Test", conditions: [{ field: "area", op: "EQUALS", val: "Operaciones Subterráneas" }], actions: { learningObjectId: lobjExactId, obligationType: "Mandatory", assignedBy: "Regla Competencia", dueDateOffsetDays: 30, reasonCode: "REASON_COMPETENCY", reasonDescription: "Asignación por Competencia de Área" } });
        const r2 = r2Res.data.rule;
        AssignmentRuleService.forcePublish(r2.id, "Publish test R2");

        const r3Res = AssignmentRuleService.create({ name: "Rule 3 - Zona", category: "Test", conditions: [{ field: "site", op: "EQUALS", val: "Faena Norte" }], actions: { learningObjectId: lobjExactId, obligationType: "Mandatory", assignedBy: "Regla Zona", dueDateOffsetDays: 30, reasonCode: "REASON_SITE", reasonDescription: "Asignación por Faena Operativa" } });
        const r3 = r3Res.data.rule;
        AssignmentRuleService.forcePublish(r3.id, "Publish test R3");

        AssignmentExecutionService.executeRuleForEmployee(AssignmentRuleVersionRepository.getById(r1.currentVersionId), empExactId);
        AssignmentExecutionService.executeRuleForEmployee(AssignmentRuleVersionRepository.getById(r2.currentVersionId), empExactId);
        AssignmentExecutionService.executeRuleForEmployee(AssignmentRuleVersionRepository.getById(r3.currentVersionId), empExactId);

        const empAsgs = AssignmentRepository.find(a => a.employeeId === empExactId && a.learningObjectId === lobjExactId);
        const empReasons = AssignmentReasonRepository.find(r => r.employeeId === empExactId);
        const empEnrs = EnrollmentRepository.find(e => e.employeeId === empExactId && e.learningObjectId === lobjExactId);

        const exactCountsPass = (empAsgs.length === 1) && (empReasons.length === 3) && (empEnrs.length === 1);

        AssignmentExecutionService.executeRuleForEmployee(AssignmentRuleVersionRepository.getById(r1.currentVersionId), empExactId);

        const empAsgsAfter = AssignmentRepository.find(a => a.employeeId === empExactId && a.learningObjectId === lobjExactId);
        const empReasonsAfter = AssignmentReasonRepository.find(r => r.employeeId === empExactId);
        const empEnrsAfter = EnrollmentRepository.find(e => e.employeeId === empExactId && e.learningObjectId === lobjExactId);

        const idempotencyPass = (empAsgsAfter.length === 1) && (empReasonsAfter.length === 3) && (empEnrsAfter.length === 1);

        results.push({ name: "Exact Deduplication Contract (3 Rules -> 1 Assignment, 3 Reasons, 1 Enrollment + Idempotency)", pass: exactCountsPass && idempotencyPass });
    } catch(e) {
        results.push({ name: "Exact Deduplication Contract", pass: false, error: e.message });
    }

    try {
        const asgBefore = AssignmentRepository.getAll().length;
        const reasonBefore = AssignmentReasonRepository.getAll().length;
        const enrBefore = EnrollmentRepository.getAll().length;
        const notifBefore = NotificationRepository.getAll().length;

        const simRes = AssignmentSimulationService.simulateRule("RULE-001", "RVERS-001-V1");

        const asgAfter = AssignmentRepository.getAll().length;
        const reasonAfter = AssignmentReasonRepository.getAll().length;
        const enrAfter = EnrollmentRepository.getAll().length;
        const notifAfter = NotificationRepository.getAll().length;

        const zeroSideEffects = (asgBefore === asgAfter) && (reasonBefore === reasonAfter) && (enrBefore === enrAfter) && (notifBefore === notifAfter) && simRes.success && (simRes.data.zeroSideEffectsAudit.assignmentsCreated === 0);
        results.push({ name: "Simulation Zero Side-Effects (Assignments/Reasons/Enrollments/Notifs Deltas = 0)", pass: zeroSideEffects });
    } catch(e) {
        results.push({ name: "Simulation Zero Side-Effects", pass: false, error: e.message });
    }

    try {
        let capturedRealEvt = null;
        const subId = EventBus.subscribe("Learning.AssignmentCreated", function onAssignmentCreatedQA(evt) {
            capturedRealEvt = evt;
        });

        const testCorrId = "CORR-REAL-EVT-QA-99";
        const realAsgCmd = {
            employeeId: "EMP-0001635",
            learningObjectId: "LOBJ-001",
            courseId: "COURSE-101",
            courseVersionId: "CVERS-101-V24",
            obligationType: "Mandatory",
            dueDate: "2026-12-31",
            assignedBy: "Real Event QA Test",
            assignmentReasonIds: ["REASON-001"],
            tenantId: "TEN-001"
        };

        const createRes = AssignmentService.create(realAsgCmd, testCorrId);
        const realAsg = createRes.data;

        let passRealEvt = false;
        if (createRes.success && realAsg && capturedRealEvt && capturedRealEvt.payload) {
            const p = capturedRealEvt.payload;
            const envCorr = capturedRealEvt.correlationId;

            const hasId = (p.id === realAsg.id);
            const hasAsgId = (p.assignmentId === realAsg.id);
            const hasEmpId = (p.employeeId === realAsg.employeeId);
            const hasLobjId = (p.learningObjectId === realAsg.learningObjectId);
            const hasLobjType = !!p.learningObjectType;
            const hasCrsId = (p.courseId === "COURSE-101");
            const hasCrsVerId = (p.courseVersionId === "CVERS-101-V24");
            const hasDueDate = (p.dueDate === realAsg.dueDate);
            const hasObligation = (p.obligationType === realAsg.obligationType);
            const hasAssignedBy = (p.assignedBy === realAsg.assignedBy);
            const hasReasons = Array.isArray(p.assignmentReasonIds) && p.assignmentReasonIds.includes("REASON-001");
            const hasCorrId = (envCorr === testCorrId || p.correlationId === testCorrId);

            passRealEvt = hasId && hasAsgId && hasEmpId && hasLobjId && hasLobjType && hasCrsId && hasCrsVerId && hasDueDate && hasObligation && hasAssignedBy && hasReasons && hasCorrId;
        }

        results.push({ name: "AssignmentCreated Event Contract (Real EventBus Emission & All 12 Fields Match)", pass: passRealEvt });
    } catch(e) {
        results.push({ name: "AssignmentCreated Event Contract", pass: false, error: e.message });
    }

    try {
        const orphansBefore = checkOrphanReferences();
        AssignmentReasonRepository.create({ id: "REASON-ORPHAN-TEMP", assignmentId: "NON_EXISTENT_ASG_999", ruleVersionId: "RVERS-001-V1", tenantId: "TEN-001" });
        const orphansDuring = checkOrphanReferences();

        AssignmentReasonRepository.remove("REASON-ORPHAN-TEMP");
        const orphansAfter = checkOrphanReferences();

        const orphanControlPass = (orphansBefore === 0) && (orphansDuring > 0) && (orphansAfter === 0);
        results.push({ name: "Controlled Orphan Reference Detection (Orphans > 0 fails, restored = 0 passes)", pass: orphanControlPass });
    } catch(e) {
        results.push({ name: "Controlled Orphan Reference Detection", pass: false, error: e.message });
    }

    try {
        const empHiredId = "EMP-HIRED-001";
        EmployeeRepository.create({ id: empHiredId, name: "Nuevo Contratado SST", position: "Operador", area: "Operaciones Subterráneas", site: "Faena Minera Norte", tenantId: "TEN-001" });
        
        const r1 = AssignmentRuleRepository.getById("RULE-001");
        if (r1 && r1.status !== "Published") {
            AssignmentRuleService.forcePublish("RULE-001", "Publicar para test E2E");
        }

        EventBus.publish({
            eventType: "EmployeeHired",
            payload: { employeeId: empHiredId },
            source: "HRIS_Integration",
            tenantId: "TEN-001"
        });

        const asg = AssignmentRepository.find(a => a.employeeId === empHiredId);
        const enr = EnrollmentRepository.find(e => e.employeeId === empHiredId);

        results.push({ name: "E2E EmployeeHired Flow (EventBus -> Assignment -> Auto Enrollment)", pass: asg.length > 0 && enr.length > 0 });
    } catch(e) {
        results.push({ name: "E2E EmployeeHired Flow", pass: false, error: e.message });
    }

    try {
        const empPosId = "EMP-POS-CHANGE-001";
        MockDB.employees = (MockDB.employees || []).filter(e => e.id !== empPosId);
        MockDB.assignments = (MockDB.assignments || []).filter(a => a.employeeId !== empPosId);

        EmployeeRepository.create({ id: empPosId, name: "Empleado Cambio Cargo", position: "Operador Junior", area: "Operaciones", tenantId: "TEN-001" });
        
        const r2 = AssignmentRuleRepository.getById("RULE-002");
        if (r2 && r2.status !== "Published") {
            AssignmentRuleService.forcePublish("RULE-002", "Publicar para test E2E");
        }

        EventBus.publish({
            eventType: "EmployeePositionChanged",
            payload: { employeeId: empPosId, newPosition: "Especialista Senior Operaciones" },
            source: "HRIS_Integration",
            tenantId: "TEN-001"
        });

        const asgPos = AssignmentRepository.find(a => a.employeeId === empPosId);
        results.push({ name: "E2E PositionChanged Flow (EventBus -> Assignment Engine)", pass: asgPos.length > 0 });
    } catch(e) {
        results.push({ name: "E2E PositionChanged Flow", pass: false, error: e.message });
    }

    // Restore state
    AppState.session.tenantId = currentTenantBackup;
    AppState.session.role = currentRoleBackup;
    AppState.session.employeeId = currentEmpBackup;

    return results;
}
`;

    html = html.substring(0, startFunc) + cleanQA + "\n\n" + html.substring(endFunc);
    fs.writeFileSync(filePath, html, 'utf8');
    console.log("Successfully replaced clean runDomainServicesAndEventBusQA!");
} else {
    console.log("Could not find function boundaries!");
}
