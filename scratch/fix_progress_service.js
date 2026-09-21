const fs = require('fs');
const filePath = 'f:/PortalCapacitacion/ADRYAN_Learning_Functional_Prototype_III5_WORK.html';

let content = fs.readFileSync(filePath, 'utf8');

const newProgressService = `const ProgressService = {
    getByEnrollment(enrollmentId) {
        if (!AuthorizationService.can("learning.player.use") && !AuthorizationService.can("learning.myLearning.read")) {
            return createServiceError("E-03", "No tiene permisos para ver progreso");
        }
        return ActivityProgressRepository.getByEnrollment(enrollmentId);
    },

    record(command, correlationId = null) {
        return this.updateActivityProgress(command, correlationId);
    },

    updateActivityProgress(command, correlationId = null) {
        if (!AuthorizationService.can("learning.player.use")) {
            return createServiceError("E-03", "No tiene permisos", correlationId);
        }

        const enrollment = EnrollmentRepository.getById(command.enrollmentId);
        const currentTenant = TenantContext.getCurrentTenantId();
        const currentEmployeeId = (typeof AppState !== "undefined" && AppState?.session?.employeeId) ? AppState.session.employeeId : null;

        if (!enrollment || enrollment.tenantId !== currentTenant || enrollment.employeeId !== currentEmployeeId) {
            return createServiceError("E-10", "El Enrollment no pertenece al empleado o tenant actual.", correlationId);
        }

        const units = UnitRepository.getByCourseVersion(enrollment.courseVersionId) || [];
        const unitIds = units.map(u => u.id);
        const activities = ActivityRepository.find(a => unitIds.includes(a.unitId)) || [];
        const activity = activities.find(a => a.id === command.activityId);

        if (!activity) {
            return createServiceError("E-07", "La actividad no pertenece al CourseVersion del enrollment", correlationId);
        }

        const existing = ActivityProgressRepository.find(
            p => p.tenantId === currentTenant && 
                 p.enrollmentId === command.enrollmentId && 
                 p.activityId === command.activityId
        )[0];

        let progressPct = Math.min(Math.max(command.progressPct || 0, 0), 100);
        let resultObj;

        if (existing) {
            resultObj = ActivityProgressRepository.update(existing.id, {
                progressPct: progressPct,
                lastPositionSeconds: command.lastPositionSeconds || existing.lastPositionSeconds,
                effectiveTimeSeconds: command.effectiveTimeSeconds || existing.effectiveTimeSeconds,
                status: "InProgress"
            });
        } else {
            const progData = {
                enrollmentId: command.enrollmentId,
                activityId: command.activityId,
                status: "InProgress",
                progressPct: progressPct,
                effectiveTimeSeconds: command.effectiveTimeSeconds || 0,
                lastPositionSeconds: command.lastPositionSeconds || 0,
                completedAt: null,
                tenantId: currentTenant
            };
            resultObj = ActivityProgressRepository.create(progData);
        }

        EventBus.publish({
            eventType: "Learning.ActivityProgressUpdated",
            eventId: "EVT-" + crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            aggregateId: resultObj.id,
            tenantId: currentTenant,
            payload: {
                enrollmentId: resultObj.enrollmentId,
                activityId: resultObj.activityId,
                progressPct: resultObj.progressPct,
                status: resultObj.status
            },
            correlationId
        });

        const enrollmentCalc = this.calculateEnrollmentProgress(command.enrollmentId, currentTenant);
        
        EnrollmentRepository.update(command.enrollmentId, {
            progressPct: enrollmentCalc.progressPct
        });

        if (progressPct >= 100) {
            this.completeActivity(command.enrollmentId, command.activityId, correlationId);
            const finalProg = ActivityProgressRepository.getById(resultObj.id);
            if (finalProg) resultObj = finalProg;
        }

        return { success: true, data: resultObj, error: null, correlationId, eventId: null };
    },

    completeActivity(enrollmentId, activityId, correlationId = null) {
        if (!AuthorizationService.can("learning.player.use")) {
            return createServiceError("E-03", "No tiene permisos", correlationId);
        }

        const enrollment = EnrollmentRepository.getById(enrollmentId);
        const currentTenant = TenantContext.getCurrentTenantId();
        const currentEmployeeId = (typeof AppState !== "undefined" && AppState?.session?.employeeId) ? AppState.session.employeeId : null;

        if (!enrollment || enrollment.tenantId !== currentTenant || enrollment.employeeId !== currentEmployeeId) {
            return createServiceError("E-10", "El Enrollment no pertenece al empleado o tenant actual.", correlationId);
        }

        const units = UnitRepository.getByCourseVersion(enrollment.courseVersionId) || [];
        const unitIds = units.map(u => u.id);
        const activities = ActivityRepository.find(a => unitIds.includes(a.unitId)) || [];
        const activity = activities.find(a => a.id === activityId);

        if (!activity) {
            return createServiceError("E-07", "La actividad no pertenece al CourseVersion del enrollment", correlationId);
        }

        const existing = ActivityProgressRepository.find(
            p => p.tenantId === currentTenant && 
                 p.enrollmentId === enrollmentId && 
                 p.activityId === activityId
        )[0];

        let resultObj;
        if (existing) {
            resultObj = ActivityProgressRepository.update(existing.id, {
                status: "Completed",
                progressPct: 100,
                completedAt: new Date().toISOString()
            });
        } else {
            const progData = {
                enrollmentId: enrollmentId,
                activityId: activityId,
                status: "Completed",
                progressPct: 100,
                effectiveTimeSeconds: 0,
                lastPositionSeconds: 0,
                completedAt: new Date().toISOString(),
                tenantId: currentTenant
            };
            resultObj = ActivityProgressRepository.create(progData);
        }

        const enrollmentCalc = this.calculateEnrollmentProgress(enrollmentId, currentTenant);

        EnrollmentRepository.update(enrollmentId, {
            progressPct: enrollmentCalc.progressPct
        });

        if (enrollmentCalc.allRequiredCompleted) {
            EnrollmentService.complete(enrollmentId, { scorePct: 100, isInternal: true }, correlationId);
        }

        return { success: true, data: resultObj, error: null, correlationId, eventId: null };
    },

    calculateEnrollmentProgress(enrollmentId, tenantId) {
        const enr = EnrollmentRepository.getById(enrollmentId);

        if (!enr || enr.tenantId !== tenantId) {
            return {
                progressPct: 0,
                requiredCount: 0,
                completedRequiredCount: 0,
                allRequiredCompleted: false
            };
        }

        const units = UnitRepository.getByCourseVersion(enr.courseVersionId) || [];
        const unitIds = units.map(u => u.id);

        const activities = ActivityRepository.find(a => unitIds.includes(a.unitId)) || [];
        const requiredActivities = activities.filter(a => a.required === true);
        const requiredCount = requiredActivities.length;

        if (requiredCount === 0) {
            return {
                progressPct: 0,
                requiredCount: 0,
                completedRequiredCount: 0,
                allRequiredCompleted: false
            };
        }

        const progressList = ActivityProgressRepository.getByEnrollment(enrollmentId) || [];

        const completedRequiredCount = requiredActivities.filter(activity => {
            const progress = progressList.find(p => p.activityId === activity.id);
            return progress && Number(progress.progressPct) >= 100;
        }).length;

        const progressPct = Math.round(
            (completedRequiredCount / requiredCount) * 100
        );

        return {
            progressPct,
            requiredCount,
            completedRequiredCount,
            allRequiredCompleted: completedRequiredCount === requiredCount
        };
    }
};`;

const regex = /const ProgressService = \{[\s\S]*?\n\s*\};\s*(?=\n\s*\/\* --- 5)/;
if (regex.test(content)) {
    content = content.replace(regex, newProgressService);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Replaced successfully");
} else {
    console.error("Could not find ProgressService via regex.");
    process.exit(1);
}
