const fs = require('fs');

const filePath = 'f:/PortalCapacitacion/ADRYAN_Learning_Functional_Prototype.html';
let html = fs.readFileSync(filePath, 'utf8');

// Find start of runSecurityNegativeTests and end of Audit Security test
const secStartIdx = html.indexOf('function runSecurityNegativeTests()');
const secRestoreIdx = html.indexOf('AppState.session.employeeId = currentEmpBackup;', secStartIdx);
const secEndIdx = html.indexOf('return results;', secRestoreIdx);

if (secStartIdx !== -1 && secRestoreIdx !== -1 && secEndIdx !== -1) {
    const secBody = html.substring(secStartIdx, secEndIdx + 'return results;'.length + 1);
    
    // Extract everything after secRestoreIdx up to return results
    const extraBlock = html.substring(secRestoreIdx + 'AppState.session.employeeId = currentEmpBackup;'.length, secEndIdx);
    
    // Clean runSecurityNegativeTests body
    const cleanSecFunc = `function runSecurityNegativeTests() {
    const results = [];
    const currentTenantBackup = AppState.session.tenantId;
    const currentRoleBackup = AppState.session.role;
    const currentEmpBackup = AppState.session.employeeId;

    // Test 1: Cross-Tenant Read Protection (TENANT-003)
    AppState.session.tenantId = "TEN-001";
    const crossTenantRead = EmployeeRepository.getById("EMP-0004001", true);
    results.push({ name: "Cross-Tenant Read", pass: crossTenantRead === null });

    // Test 2: Cross-Tenant Write Protection (TENANT-005)
    const crossTenantCreate = EmployeeRepository.create({
        id: "EMP-TEST-CROSS",
        name: "Cross Tenant Test",
        tenantId: "TEN-002"
    });
    results.push({ name: "Cross-Tenant Write", pass: crossTenantCreate === null });

    // Test 3: Cross-Tenant Update Protection (TENANT-006)
    const crossTenantUpdate = EmployeeRepository.update("EMP-0004001", { name: "Hacked" });
    results.push({ name: "Cross-Tenant Update", pass: crossTenantUpdate === null });

    // Test 4: RBAC Unauthorized Action (RBAC-002)
    AppState.session.role = "Employee";
    const empCanCreateAssignment = AuthorizationService.can("learning.assignment.create");
    results.push({ name: "Unauthorized Action", pass: empCanCreateAssignment === false });

    // Test 5: RBAC Authorized Action (RBAC-003)
    AppState.session.role = "Supervisor";
    const supCanCreateAssignment = AuthorizationService.can("learning.assignment.create");
    results.push({ name: "Authorized Action", pass: supCanCreateAssignment === true });

    // Test 6: SELF Scope Protection (SELF-002)
    AppState.session.role = "Employee";
    AppState.session.employeeId = "EMP-0001635";
    const selfCheckOther = AuthorizationService.checkScope("SELF", { employeeId: "EMP-0001842" });
    results.push({ name: "Self Scope", pass: selfCheckOther === false });

    // Test 7: TEAM Scope Protection (TEAM-002)
    AppState.session.role = "Supervisor";
    AppState.session.employeeId = "EMP-0001900";
    const teamCheckNonTeam = AuthorizationService.checkScope("TEAM", { employeeId: "EMP-0004001" });
    results.push({ name: "Team Scope", pass: teamCheckNonTeam === false });

    // Test 8: Route Guard Protection (ROUTER-001)
    AppState.session.role = "Employee";
    const empRouteObj = routesMap["#/assignment-rules"];
    const empRouteCanAccess = empRouteObj && empRouteObj.permission ? AuthorizationService.can(empRouteObj.permission) : true;
    results.push({ name: "Unauthorized Route", pass: empRouteCanAccess === false });

    // Test 9: Cross-Employee Notification Protection
    AppState.session.role = "Employee";
    AppState.session.employeeId = "EMP-0001635";
    MockDB.notifications = (MockDB.notifications || []).filter(n => n.id !== "NOTIF-OTHER-EMP-FAIL");
    NotificationRepository.create({ id: "NOTIF-OTHER-EMP-FAIL", employeeId: "EMP-0004001", tenantId: "TEN-001", read: false });
    const markOtherNotif = NotificationService.markAsRead("NOTIF-003"); // belongs to EMP-0001635 (read true)
    const markOtherNotifFail = NotificationService.markAsRead("NOTIF-OTHER-EMP-FAIL");
    results.push({ name: "Cross-Employee Notification", pass: markOtherNotifFail.success === false });

    // Test 10: Unauthorized Certification Renewal Protection
    AppState.session.role = "Employee";
    const unauthRenew = CertificationService.renew({ id: "CERT-001" });
    results.push({ name: "Unauthorized Cert Renewal", pass: unauthRenew.success === false });

    // Test 11: Audit Security Logging
    const hasAuditLogs = AuditRepository.getAll(false).length > 0;
    results.push({ name: "Audit Security", pass: hasAuditLogs });

    // Restore state
    AppState.session.tenantId = currentTenantBackup;
    AppState.session.role = currentRoleBackup;
    AppState.session.employeeId = currentEmpBackup;

    return results;
}`;

    // Replace old runSecurityNegativeTests in html
    const oldFullSec = html.substring(secStartIdx, secEndIdx + 'return results;}'.length);
    html = html.replace(oldFullSec, cleanSecFunc);

    // Now append extraBlock to runDomainServicesAndEventBusQA
    const domainEndIdx = html.indexOf('return results;', html.indexOf('function runDomainServicesAndEventBusQA()'));
    if (domainEndIdx !== -1) {
        html = html.substring(0, domainEndIdx) + extraBlock + '\n    return results;' + html.substring(domainEndIdx + 'return results;'.length);
    }
}

fs.writeFileSync(filePath, html, 'utf8');
console.log('Successfully restructured runSecurityNegativeTests and runDomainServicesAndEventBusQA!');
