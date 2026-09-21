const fs = require('fs');

const filePath = 'f:/PortalCapacitacion/ADRYAN_Learning_Functional_Prototype.html';
let html = fs.readFileSync(filePath, 'utf8');

const oldCode = 'const markOtherNotifFail = NotificationService.markAsRead("NOTIF-OTHER-EMP-FAIL");';
const newCode = `NotificationRepository.create({ id: "NOTIF-OTHER-EMP-FAIL", employeeId: "EMP-0004001", tenantId: "TEN-001", read: false });
    const markOtherNotifFail = NotificationService.markAsRead("NOTIF-OTHER-EMP-FAIL");`;

if (html.includes(oldCode)) {
    html = html.replace(oldCode, newCode);
    fs.writeFileSync(filePath, html, 'utf8');
    console.log('Successfully fixed Notification test fixture in runSecurityNegativeTests!');
} else {
    console.error('Target code not found.');
}
