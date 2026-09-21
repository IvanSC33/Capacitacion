const fs = require('fs');

const filepath = 'f:/PortalCapacitacion/ADRYAN_Learning_Functional_Prototype.html';
let content = fs.readFileSync(filepath, 'utf8');

// 1. Fix TenantContext.getCurrentTenantId() to eliminate fallback TEN-001
const oldTenantFunc = `getCurrentTenantId() {
        return (AppState && AppState.session) ? AppState.session.tenantId || "TEN-001" : "TEN-001";
    }`;

const newTenantFunc = `getCurrentTenantId() {
        return (AppState && AppState.session && AppState.session.tenantId) ? AppState.session.tenantId : null;
    }`;

if (content.includes(oldTenantFunc)) {
    content = content.replace(oldTenantFunc, newTenantFunc);
    console.log('1. TenantContext fallback TEN-001 eliminated.');
}

// 2. Update renderScreenCourseDetail implementation
const startRender = 'function renderScreenCourseDetail() {';
const endRender = 'window.renderScreenCourseDetail = renderScreenCourseDetail;';

const idxStartRender = content.indexOf(startRender);
const idxEndRender = content.indexOf(endRender);

if (idxStartRender === -1 || idxEndRender === -1) {
    console.error('Render markers not found!');
    process.exit(1);
}

const newRenderFunc = `function renderScreenCourseDetail() {
    const activeTenant = typeof AppState !== "undefined" && AppState.session ? AppState.session.tenantId : null;
    const employeeId = typeof AppState !== "undefined" && AppState.session ? AppState.session.employeeId : null;

    if (!activeTenant) {
        return \`
            <div class="obsidian-card text-center p-5">
                <i class="fa-solid fa-building-circle-exclamation text-amber display-4 mb-3"></i>
                <h4 class="fw-bold text-white mb-2">Contexto de Organización no Disponible</h4>
                <p class="text-muted fs-7 mb-4">No se ha detectado una organización activa en la sesión actual.</p>
                <a href="#/dashboard" class="btn btn-obsidian-primary"><i class="fa-solid fa-house me-2"></i>Ir al Dashboard</a>
            </div>
        \`;
    }

    if (!employeeId) {
        return \`
            <div class="obsidian-card text-center p-5">
                <i class="fa-solid fa-user-slash text-amber display-4 mb-3"></i>
                <h4 class="fw-bold text-white mb-2">Contexto de Colaborador no Disponible</h4>
                <p class="text-muted fs-7 mb-4">No se ha detectado una sesión válida de colaborador para consultar esta pantalla.</p>
                <a href="#/dashboard" class="btn btn-obsidian-primary"><i class="fa-solid fa-house me-2"></i>Ir al Dashboard</a>
            </div>
        \`;
    }

    const targetCourseId = getCourseIdFromUrlOrState();

    if (!targetCourseId) {
        return \`
            <div class="obsidian-card text-center p-5">
                <i class="fa-solid fa-triangle-exclamation text-amber display-4 mb-3"></i>
                <h4 class="fw-bold text-white mb-2">Curso no disponible</h4>
                <p class="text-muted fs-7 mb-4">El curso solicitado no existe o no se encuentra accesible para su organización.</p>
                <a href="#/catalog" class="btn btn-obsidian-primary"><i class="fa-solid fa-compass me-2"></i>Ir al Catálogo</a>
            </div>
        \`;
    }

    const course = CourseRepository.getById(targetCourseId);
    if (!course || course.tenantId !== activeTenant) {
        return \`
            <div class="obsidian-card text-center p-5">
                <i class="fa-solid fa-triangle-exclamation text-amber display-4 mb-3"></i>
                <h4 class="fw-bold text-white mb-2">Curso no disponible</h4>
                <p class="text-muted fs-7 mb-4">El curso solicitado no existe o no se encuentra accesible para su organización.</p>
                <a href="#/catalog" class="btn btn-obsidian-primary"><i class="fa-solid fa-compass me-2"></i>Ir al Catálogo</a>
            </div>
        \`;
    }

    if (!course.currentVersionId) {
        return \`
            <div class="obsidian-card text-center p-5">
                <i class="fa-solid fa-code-branch text-amber display-4 mb-3"></i>
                <h4 class="fw-bold text-white mb-2">Versión no disponible</h4>
                <p class="text-muted fs-7 mb-4">La versión del curso solicitada no se encuentra configurada o no coincide con la referencia del sistema.</p>
                <a href="#/catalog" class="btn btn-obsidian-primary"><i class="fa-solid fa-compass me-2"></i>Ir al Catálogo</a>
            </div>
        \`;
    }

    const version = CourseVersionRepository.getById(course.currentVersionId);
    if (!version || version.tenantId !== activeTenant || version.courseId !== course.id) {
        return \`
            <div class="obsidian-card text-center p-5">
                <i class="fa-solid fa-code-branch text-amber display-4 mb-3"></i>
                <h4 class="fw-bold text-white mb-2">Versión no disponible</h4>
                <p class="text-muted fs-7 mb-4">La versión del curso solicitada no se encuentra configurada o no coincide con la referencia del sistema.</p>
                <a href="#/catalog" class="btn btn-obsidian-primary"><i class="fa-solid fa-compass me-2"></i>Ir al Catálogo</a>
            </div>
        \`;
    }

    if (version.status !== "Published") {
        return \`
            <div class="obsidian-card text-center p-5">
                <i class="fa-solid fa-lock text-amber display-4 mb-3"></i>
                <h4 class="fw-bold text-white mb-2">Esta versión no está disponible para consumo.</h4>
                <p class="text-muted fs-7 mb-4">La versión actual de este curso no ha sido publicada para colaboradores.</p>
                <a href="#/catalog" class="btn btn-obsidian-primary"><i class="fa-solid fa-compass me-2"></i>Ir al Catálogo</a>
            </div>
        \`;
    }

    // Units and Activities (Strict Tenant Isolation & Deterministic Real Ordering)
    const allUnits = (typeof UnitRepository !== "undefined" && UnitRepository.getByCourseVersion) ?
        UnitRepository.getByCourseVersion(version.id) : (UnitRepository.find(u => u.courseVersionId === version.id) || []);
    
    const units = allUnits.filter(u => u.tenantId === activeTenant)
                          .sort((a, b) => {
                              const orderA = typeof a.order === 'number' ? a.order : 0;
                              const orderB = typeof b.order === 'number' ? b.order : 0;
                              if (orderA === orderB) return String(a.id).localeCompare(String(b.id));
                              return orderA - orderB;
                          });

    // Calculate total activities count across units
    let totalActivitiesCount = 0;
    units.forEach(u => {
        const acts = (typeof ActivityRepository !== "undefined" && ActivityRepository.getByUnit ?
            ActivityRepository.getByUnit(u.id) : (ActivityRepository.find(a => a.unitId === u.id) || []))
            .filter(a => a.tenantId === activeTenant);
        totalActivitiesCount += acts.length;
    });

    // Employee Context & Precedence Resolution
    const enrollments = EnrollmentRepository.getByEmployee(employeeId) || [];
    const userEnrollment = enrollments.find(e => e.courseId === course.id || e.courseVersionId === version.id);

    let userStatus = "AVAILABLE";
    let badgeHtml = "";
    let ctaHtml = "";
    let progressText = "Sin progreso registrado";
    let progressPct = 0;
    let dueDateDisplay = "No disponible";
    let assignmentReasonDisplay = "Sin motivo registrado";

    const versionNumber = version.versionNumber ?? version.version ?? null;
    const versionNumText = versionNumber ? String(versionNumber) : "No disponible";

    if (userEnrollment && userEnrollment.status === "Completed") {
        userStatus = "COMPLETED";
        progressPct = 100;
        progressText = "100%";
        badgeHtml = '<span class="status-badge completed mb-0"><i class="fa-solid fa-circle-check me-1"></i> Completado</span>';

        const certs = (CertificateRepository.getByEmployee ? CertificateRepository.getByEmployee(employeeId) : CertificateRepository.find(c => c.employeeId === employeeId)) || [];
        const cert = certs.find(c => c.courseId === course.id || c.enrollmentId === userEnrollment.id);
        if (cert) {
            ctaHtml = '<a href="#/certifications" class="btn btn-obsidian-primary px-4 py-2"><i class="fa-solid fa-award me-2"></i> Ver Certificado</a>';
        } else {
            ctaHtml = '<a href="#/player" class="btn btn-obsidian-secondary px-4 py-2"><i class="fa-solid fa-book-open me-2"></i> Revisar Contenido</a>';
        }
        if (userEnrollment.dueDate) {
            dueDateDisplay = userEnrollment.dueDate;
        }
    } else if (userEnrollment && (userEnrollment.status === "Active" || userEnrollment.status === "In_Progress" || userEnrollment.status === "InProgress")) {
        userStatus = "ACTIVE";
        
        // Progress resolution from ActivityProgressRepository if available, else userEnrollment.progressPct
        if (typeof ActivityProgressRepository !== "undefined") {
            const actProgs = ActivityProgressRepository.find(p => p.enrollmentId === userEnrollment.id && p.tenantId === activeTenant);
            if (actProgs && actProgs.length > 0 && totalActivitiesCount > 0) {
                const completedActs = actProgs.filter(p => p.progressPct >= 100 || p.status === 'Completed').length;
                const calcPct = Math.round((completedActs / totalActivitiesCount) * 100);
                progressPct = Math.max(calcPct, typeof userEnrollment.progressPct === 'number' ? userEnrollment.progressPct : 0);
            } else {
                progressPct = typeof userEnrollment.progressPct === 'number' ? userEnrollment.progressPct : 0;
            }
        } else {
            progressPct = typeof userEnrollment.progressPct === 'number' ? userEnrollment.progressPct : 0;
        }

        progressText = progressPct + '%';
        badgeHtml = '<span class="status-badge in-progress mb-0"><i class="fa-solid fa-spinner me-1"></i> En Curso</span>';
        ctaHtml = '<a href="#/player" class="btn btn-cyan text-dark fw-bold px-4 py-2 shadow-sm"><i class="fa-solid fa-play me-2"></i> Continuar Lección (v' + versionNumText + ')</a>';
        if (userEnrollment.dueDate) {
            dueDateDisplay = userEnrollment.dueDate;
        }
    } else {
        const asg = resolveAssignmentForCourse(course, employeeId);
        if (asg && asg.status !== "Cancelled" && asg.status !== "Completed") {
            userStatus = "ASSIGNED";
            badgeHtml = '<span class="status-badge mandatory mb-0"><i class="fa-solid fa-user-shield me-1"></i> Asignado HR/Sup</span>';
            progressText = "Sin progreso registrado";
            ctaHtml = '<a href="#/player" class="btn btn-cyan text-dark fw-bold px-4 py-2 shadow-sm"><i class="fa-solid fa-play me-2"></i> Iniciar Aprendizaje</a>';

            if (asg.dueDate) {
                dueDateDisplay = asg.dueDate;
            }

            if (asg.reasonId) {
                const reasonObj = AssignmentReasonRepository.getById(asg.reasonId);
                if (reasonObj && reasonObj.description) {
                    assignmentReasonDisplay = reasonObj.description;
                }
            } else {
                const reasons = AssignmentReasonRepository.find(r => r.assignmentId === asg.id);
                if (reasons && reasons.length > 0 && reasons[0].description) {
                    assignmentReasonDisplay = reasons[0].description;
                }
            }
        } else {
            userStatus = "AVAILABLE";
            badgeHtml = '<span class="status-badge elective mb-0"><i class="fa-solid fa-compass me-1"></i> Disponible</span>';
            progressText = "Sin progreso registrado";
            ctaHtml = '<a href="#/catalog" class="btn btn-obsidian-secondary px-4 py-2"><i class="fa-solid fa-cart-plus me-2"></i> Disponible en Catálogo</a>';
        }
    }

    if (dueDateDisplay === "No disponible") {
        if (typeof version.dueDateOffsetDays === "number" && version.dueDateOffsetDays >= 0) {
            const now = new Date();
            now.setDate(now.getDate() + version.dueDateOffsetDays);
            dueDateDisplay = now.toISOString().split("T")[0];
        } else if (typeof course.dueDateOffsetDays === "number" && course.dueDateOffsetDays >= 0) {
            const now = new Date();
            now.setDate(now.getDate() + course.dueDateOffsetDays);
            dueDateDisplay = now.toISOString().split("T")[0];
        }
    }

    const titleText = course.title || "No disponible";
    const codeText = course.code || "No disponible";
    const categoryText = course.category || "No disponible";
    const senceText = course.senceCode ? ("SENCE " + course.senceCode) : "No disponible";
    const descText = course.description || "Sin descripción disponible.";
    const durationText = course.durationHours ? (course.durationHours + " Horas") : "No disponible";
    const modalityText = course.modality || "No disponible";
    const levelText = course.level || "No disponible";
    const versionStatusText = version.status || "No disponible";
    const releaseDateText = version.releaseDate || "No disponible";

    let programOrPathText = "No disponible";
    if (course.programId) {
        const prog = typeof ProgramRepository !== "undefined" ? ProgramRepository.getById(course.programId) : null;
        if (prog && prog.name) programOrPathText = prog.name;
    } else if (course.learningPathId) {
        const path = typeof LearningPathRepository !== "undefined" ? LearningPathRepository.getById(course.learningPathId) : null;
        if (path && path.title) programOrPathText = path.title;
    }

    // Dynamic Units Accordion Rendering
    let unitsContentHtml = "";
    if (units.length === 0) {
        unitsContentHtml = \`
            <div class="obsidian-card text-center p-4 my-3 bg-navy border-bright">
                <i class="fa-solid fa-folder-open text-muted fs-2 mb-2"></i>
                <h6 class="fw-bold text-white mb-1">Este curso todavía no tiene contenido estructurado.</h6>
                <p class="text-muted fs-7 mb-0">No se registran módulos o unidades académicas asociadas a esta versión.</p>
            </div>
        \`;
    } else {
        unitsContentHtml = \`
            <div class="accordion accordion-flush" id="course-units-accordion">
                \${units.map((u, idx) => {
                    const uActivities = (typeof ActivityRepository !== "undefined" && ActivityRepository.getByUnit ?
                        ActivityRepository.getByUnit(u.id) : (ActivityRepository.find(a => a.unitId === u.id) || []))
                        .filter(a => a.tenantId === activeTenant)
                        .sort((a, b) => {
                            const orderA = typeof a.order === 'number' ? a.order : 0;
                            const orderB = typeof b.order === 'number' ? b.order : 0;
                            if (orderA === orderB) return String(a.id).localeCompare(String(b.id));
                            return orderA - orderB;
                        });

                    const orderNum = u.order < 10 ? '0' + u.order : String(u.order);
                    const isFirst = idx === 0;

                    const completedActs = uActivities.filter(a => a.status === 'Completed' || a.status === 'Finalizado').length;
                    let unitBadge = '<span class="badge bg-cyan-subtle text-cyan border border-cyan px-2 py-1 fs-8"><i class="fa-solid fa-layer-group me-1"></i> UNIDAD ' + u.order + '</span>';
                    let unitBorder = isFirst ? 'style="border-left: 3px solid var(--cyan-accent);"' : '';

                    if (completedActs === uActivities.length && uActivities.length > 0) {
                        unitBadge = '<span class="badge bg-emerald-subtle text-emerald border border-emerald px-2 py-1 fs-8"><i class="fa-solid fa-circle-check me-1"></i> UNIDAD ' + u.order + ' - FINALIZADA</span>';
                    } else if (completedActs > 0 || isFirst) {
                        unitBadge = '<span class="badge bg-cyan-subtle text-cyan border border-cyan px-2 py-1 fs-8"><i class="fa-solid fa-spinner me-1"></i> UNIDAD ' + u.order + ' - EN PROGRESO</span>';
                        unitBorder = 'style="border: 1px solid var(--cyan-accent); box-shadow: 0 0 10px rgba(6, 182, 212, 0.15);"';
                    } else {
                        unitBadge = '<span class="badge bg-secondary-subtle text-secondary border border-secondary px-2 py-1 fs-8"><i class="fa-solid fa-lock me-1"></i> UNIDAD ' + u.order + ' - PENDIENTE</span>';
                    }

                    let unitContentHtml = '';
                    if (uActivities.length === 0) {
                        unitContentHtml = \`
                            <div class="p-3 text-muted fs-7 text-center">
                                <i class="fa-solid fa-circle-info me-2 text-cyan"></i>Esta unidad no tiene actividades configuradas.
                            </div>
                        \`;
                    } else {
                        unitContentHtml = \`
                            <div class="list-group list-group-flush bg-transparent">
                                \${uActivities.map(a => {
                                    let iconClass = 'fa-film text-cyan';
                                    if (a.type === 'Simulator') iconClass = 'fa-gamepad text-purple';
                                    else if (a.type === 'Exam') iconClass = 'fa-file-signature text-amber';
                                    else if (a.type === 'Quiz') iconClass = 'fa-circle-question text-emerald';

                                    const reqText = a.required ? '<span class="badge bg-danger-subtle text-danger border border-danger fs-8 ms-2">Obligatorio</span>' : '<span class="badge bg-secondary-subtle text-muted fs-8 ms-2">Opcional</span>';
                                    const actStatus = a.status || 'No disponible';

                                    return \`
                                        <div class="list-group-item bg-transparent text-white border-secondary d-flex align-items-center justify-content-between py-3" data-activity-id="\${a.id}">
                                            <div class="d-flex align-items-center gap-3">
                                                <i class="fa-solid \${iconClass} fs-5"></i>
                                                <div>
                                                    <div class="fw-semibold text-white fs-7">\${a.title || 'No disponible'} \${reqText}</div>
                                                    <div class="text-muted fs-8">Tipo: \${a.type || 'No disponible'} | Orden: \${a.order}</div>
                                                </div>
                                            </div>
                                            <span class="badge bg-navy border border-secondary text-secondary">\${actStatus}</span>
                                        </div>
                                    \`;
                                }).join('')}
                            </div>
                        \`;
                    }

                    return \`
                        <div class="obsidian-card mb-3 p-0 overflow-hidden" data-unit-id="\${u.id}" \${unitBorder}>
                            <div class="p-3 bg-navy border-bottom border-secondary d-flex align-items-center justify-content-between cursor-pointer" data-bs-toggle="collapse" data-bs-target="#unit-collapse-\${u.id}">
                                <div class="d-flex align-items-center gap-3">
                                    <span class="badge bg-cyan text-dark fw-bold fs-7 px-2 py-1">\${orderNum}</span>
                                    <div>
                                        <div class="d-flex align-items-center gap-2 mb-1">
                                            \${unitBadge}
                                            <h6 class="fw-bold text-white mb-0 d-inline">\${u.title || 'No disponible'}</h6>
                                        </div>
                                        <span class="text-muted fs-8">\${uActivities.length} \${uActivities.length === 1 ? 'actividad' : 'actividades'}</span>
                                    </div>
                                </div>
                                <i class="fa-solid fa-chevron-down text-secondary"></i>
                            </div>
                            <div id="unit-collapse-\${u.id}" class="collapse \${isFirst ? 'show' : ''}">
                                \${unitContentHtml}
                            </div>
                        </div>
                    \`;
                }).join('')}
            </div>
        \`;
    }

    return \`
        <!-- Breadcrumb Bar -->
        <div class="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom border-secondary">
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb mb-0 fs-8 text-muted">
                    <li class="breadcrumb-item"><a href="#/mylearning" class="text-secondary text-decoration-none"><i class="fa-solid fa-book-open me-1"></i> Mi Aprendizaje</a></li>
                    <li class="breadcrumb-item"><a href="#/catalog" class="text-secondary text-decoration-none">\${categoryText}</a></li>
                    <li class="breadcrumb-item active text-cyan" aria-current="page">\${titleText}</li>
                </ol>
            </nav>
            <a href="#/catalog" class="btn btn-sm btn-outline-secondary fs-8"><i class="fa-solid fa-arrow-left me-1"></i> Volver al Catálogo</a>
        </div>

        <!-- Hero Banner Header Section -->
        <div class="obsidian-card p-4 mb-4 position-relative overflow-hidden" style="background: linear-gradient(135deg, rgba(13, 28, 45, 0.95) 0%, rgba(5, 20, 36, 0.98) 100%); border-left: 4px solid var(--cyan-accent);">
            <div class="d-flex justify-content-between align-items-start flex-wrap gap-3">
                <div class="flex-grow-1" style="max-width: 800px;">
                    <div class="d-flex align-items-center gap-2 mb-2 flex-wrap">
                        <span class="badge bg-cyan-subtle text-cyan border border-cyan px-2 py-1 fs-8 uppercase"><i class="fa-solid fa-building-circle-check me-1"></i> \${categoryText.toUpperCase()}</span>
                        <span class="badge bg-navy text-white border border-secondary px-2 py-1 fs-8"><i class="fa-solid fa-barcode me-1"></i> CÓD: \${codeText}</span>
                        <span class="badge bg-emerald-subtle text-emerald border border-emerald px-2 py-1 fs-8"><i class="fa-solid fa-shield-halved me-1"></i> \${senceText}</span>
                    </div>
                    <h2 class="fw-bold text-white mb-2 fs-3">\${titleText}</h2>
                    <p class="text-secondary fs-7 mb-0 line-clamp-2">\${descText}</p>
                </div>
                <div class="text-end bg-navy p-3 rounded border border-secondary" style="min-width: 180px;">
                    <div class="text-muted fs-8 mb-1"><i class="fa-solid fa-certificate text-amber me-1"></i> Reconocimiento Global</div>
                    <div class="fw-bold text-cyan fs-5">2.5 Créditos CPE</div>
                    <div class="text-emerald fs-8 mt-1"><i class="fa-solid fa-check-double me-1"></i> Acreditación ISO27001</div>
                </div>
            </div>
        </div>

        <!-- Active Executable Version Box (Hero Panel Stitch Style) -->
        <div class="obsidian-card p-4 mb-4" style="background: var(--bg-surface-navy); border: 1px solid var(--border-bright);">
            <div class="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3 pb-2 border-bottom border-secondary">
                <div class="d-flex align-items-center gap-2 flex-wrap">
                    <span class="text-cyan fw-bold fs-8 tracking-wider text-uppercase"><i class="fa-solid fa-code-branch me-1"></i> VERSIÓN ACTIVA EJECUTABLE:</span>
                    <span class="badge bg-navy text-cyan border border-cyan fs-7 px-3 py-1 fw-semibold">\${versionNumText} (Vigente / Actual - Publicada \${releaseDateText})</span>
                    <span class="text-muted fs-8 ms-2"><i class="fa-solid fa-calendar me-1"></i> Vigencia: Exención activa</span>
                    <span class="badge bg-emerald-subtle text-emerald fs-8"><i class="fa-solid fa-circle-check me-1"></i> Vigente & Acreditado</span>
                </div>
                <div class="d-flex gap-2">
                    <span class="badge bg-amber-subtle text-amber border border-amber fs-8">REQUISITO NORMATIVO</span>
                    <span class="badge bg-dark border border-secondary text-white fs-8">Obligatorio por Matriz</span>
                    <span class="badge bg-dark border border-secondary text-white fs-8">Nivel: \${levelText}</span>
                </div>
            </div>

            <!-- Progress & Action Bar -->
            <div class="row align-items-center g-3">
                <div class="col-lg-8">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <span class="fs-7 fw-semibold text-white"><i class="fa-solid fa-chart-pie text-cyan me-1"></i> Progreso en Versión v\${versionNumText}: <span class="text-cyan fw-bold">\${progressText}</span></span>
                        \${badgeHtml}
                    </div>
                    <div class="progress bg-dark rounded-pill mb-2" style="height: 10px; border: 1px solid var(--border-color);">
                        <div class="progress-bar bg-cyan progress-bar-striped progress-bar-animated rounded-pill" role="progressbar" style="width: \${progressPct}%;"></div>
                    </div>
                    <div class="d-flex justify-content-between text-muted fs-8">
                        <span><i class="fa-solid fa-user-gear me-1"></i> Contexto: \${assignmentReasonDisplay}</span>
                        <span><i class="fa-solid fa-clock me-1"></i> Fecha de Vencimiento: <strong class="text-white">\${dueDateDisplay}</strong></span>
                    </div>
                </div>
                <div class="col-lg-4 text-lg-end d-flex flex-wrap gap-2 justify-content-lg-end">
                    <button class="btn btn-outline-secondary btn-sm px-3" onclick="alert('Descargando Guía Metodológica PDF...')"><i class="fa-solid fa-file-pdf me-1 text-danger"></i> Guía PDF</button>
                    \${ctaHtml}
                </div>
            </div>
        </div>

        <!-- Tabs Navigation -->
        <ul class="nav nav-tabs border-secondary mb-4 fs-7 fw-semibold" id="courseDetailTabs" role="tablist">
            <li class="nav-item" role="presentation">
                <button class="nav-link active text-cyan border-bottom border-cyan border-0 bg-transparent pb-3" id="tab-content-tab" data-bs-toggle="tab" data-bs-target="#tab-content" type="button"><i class="fa-solid fa-list-check me-2"></i>Contenido y Actividades (v\${versionNumText})</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link text-secondary border-0 bg-transparent pb-3" id="tab-competencies-tab" data-bs-toggle="tab" data-bs-target="#tab-competencies" type="button"><i class="fa-solid fa-award me-2"></i>Competencias Desarrolladas (3)</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link text-secondary border-0 bg-transparent pb-3" id="tab-requirements-tab" data-bs-toggle="tab" data-bs-target="#tab-requirements" type="button"><i class="fa-solid fa-clipboard-check me-2"></i>Requisitos & Política de Aprobación</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link text-secondary border-0 bg-transparent pb-3" id="tab-certificate-tab" data-bs-toggle="tab" data-bs-target="#tab-certificate" type="button"><i class="fa-solid fa-certificate me-2"></i>Certificado & Credenciales</button>
            </li>
        </ul>

        <!-- 2-Column Main Layout: Left col 8, Right col 4 -->
        <div class="row g-4">
            <!-- LEFT COLUMN: Academic Structure & Exam -->
            <div class="col-lg-8">
                <!-- Structure Summary Bar -->
                <div class="obsidian-card p-3 mb-3 bg-navy d-flex flex-wrap justify-content-between align-items-center text-muted fs-8 gap-2">
                    <div><i class="fa-solid fa-layer-group text-cyan me-1"></i> Estructura de la Versión: <strong class="text-white">\${units.length} Unidades Temáticas</strong></div>
                    <div><i class="fa-solid fa-list-ul text-purple me-1"></i> <strong class="text-white">\${totalActivitiesCount} Actividades & Evaluaciones</strong></div>
                    <div><i class="fa-solid fa-clock text-amber me-1"></i> <strong class="text-white">\${durationText} estimadas</strong></div>
                    <div class="text-cyan"><i class="fa-solid fa-sync me-1"></i> ISO27001 & BCI Sincronizado</div>
                </div>

                <!-- Accordion Units -->
                <h5 class="fw-bold text-white mb-3 visually-hidden">Estructura Académica</h5>
                \${unitsContentHtml}

                <!-- Final Assessment / Certification Exam Card -->
                <div class="obsidian-card p-4 mt-4" style="background: linear-gradient(135deg, rgba(13, 28, 45, 0.98) 0%, rgba(10, 20, 35, 0.95) 100%); border: 1px solid var(--border-bright);">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="badge bg-amber-subtle text-amber border border-amber fs-8 uppercase"><i class="fa-solid fa-file-signature me-1"></i> EVALUACIÓN SUMATIVA</span>
                        <span class="text-muted fs-8">CÓDIGO: EV-\${codeText}-V\${versionNumText}</span>
                    </div>
                    <h5 class="fw-bold text-white mb-2"><i class="fa-solid fa-graduation-cap text-cyan me-2"></i> Examen de Certificación Oficial v\${versionNumText}</h5>
                    <p class="text-secondary fs-7 mb-3">60 preguntas aleatorias de banco continuo | Tiempo límite: 45 min | Calificación mínima para aprobar: 80% | 3 intentos disponibles (Intentos restantes: 3/3)</p>
                    <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 pt-2 border-top border-secondary">
                        <span class="text-muted fs-8"><i class="fa-solid fa-circle-info text-cyan me-1"></i> Requisito: Completar 100% de actividades académicas</span>
                        <a href="#/assessment" class="btn btn-outline-cyan btn-sm px-4"><i class="fa-solid fa-play me-1"></i> Iniciar Examen Oficial</a>
                    </div>
                </div>
            </div>

            <!-- RIGHT COLUMN: Technical Release Sheet, Competencies & L&D Support -->
            <div class="col-lg-4">
                <!-- Card 1: Ficha Técnica de Release -->
                <div class="obsidian-card bg-navy p-3 mb-4">
                    <div class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-secondary">
                        <h6 class="fw-bold text-white mb-0 fs-7"><i class="fa-solid fa-microchip text-cyan me-2"></i> Ficha Técnica de Release</h6>
                        <span class="badge bg-cyan-subtle text-cyan border border-cyan fs-8">v\${versionNumText} Production</span>
                    </div>
                    <div class="fs-8 text-secondary space-y-2">
                        <div class="d-flex justify-content-between py-1 border-bottom border-dark">
                            <span>Interacción:</span>
                            <strong class="text-white">RELOJ - 24/7 EN LÍNEA</strong>
                        </div>
                        <div class="d-flex justify-content-between py-1 border-bottom border-dark">
                            <span>Sistema Origen:</span>
                            <strong class="text-emerald">ADMIN / IMMUTABLE</strong>
                        </div>
                        <div class="py-1 border-bottom border-dark text-cyan text-truncate">
                            <i class="fa-solid fa-code me-1"></i> @VisibleInTenantModelAndServicesGlobal
                        </div>
                        <div class="d-flex justify-content-between py-1 border-bottom border-dark">
                            <span>Estándares de Formación:</span>
                            <strong class="text-white">ISO27001 / GDPR / NIS2</strong>
                        </div>
                        <div class="d-flex justify-content-between py-1 border-bottom border-dark">
                            <span>ID Versión / Tenant:</span>
                            <strong class="text-white text-truncate" style="max-width: 140px;">\${version.id} | \${activeTenant}</strong>
                        </div>
                        <div class="py-1 border-bottom border-dark">
                            <span>Proveedor & Auditor:</span>
                            <div class="text-white fw-semibold">Adryan Compliance & Garrigues Legal</div>
                        </div>
                        <div class="d-flex justify-content-between py-1">
                            <span>Idiomas Disponibles:</span>
                            <div class="d-flex gap-1">
                                <span class="badge bg-dark border border-secondary text-white">ES</span>
                                <span class="badge bg-dark border border-secondary text-white">EN</span>
                                <span class="badge bg-dark border border-secondary text-white">PT</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Card 2: Impacto en Competencias -->
                <div class="obsidian-card bg-navy p-3 mb-4">
                    <h6 class="fw-bold text-white mb-3 pb-2 border-bottom border-secondary fs-7"><i class="fa-solid fa-award text-cyan me-2"></i> Impacto en Competencias</h6>
                    <div class="mb-3">
                        <div class="d-flex justify-content-between fs-8 mb-1">
                            <span class="text-white fw-semibold">Protección de Datos & Compliance</span>
                            <span class="text-emerald fw-bold">+4 Nivel</span>
                        </div>
                        <div class="progress bg-dark" style="height: 6px;">
                            <div class="progress-bar bg-cyan" style="width: 75%;"></div>
                        </div>
                        <div class="d-flex justify-content-between text-muted fs-8 mt-1">
                            <span>Actual: Nivel 2 (General)</span>
                            <span class="text-cyan">Objetivo: Nivel 4 (Avanzado)</span>
                        </div>
                    </div>
                    <div>
                        <div class="d-flex justify-content-between fs-8 mb-1">
                            <span class="text-white fw-semibold">Gobierno de Riesgos Tecnológicos</span>
                            <span class="text-cyan fw-bold">Cierre Brecha</span>
                        </div>
                        <div class="progress bg-dark" style="height: 6px;">
                            <div class="progress-bar bg-emerald" style="width: 50%;"></div>
                        </div>
                        <div class="d-flex justify-content-between text-muted fs-8 mt-1">
                            <span>Actual: Nivel 1 (Básico)</span>
                            <span class="text-emerald">Objetivo: Nivel 2 (Intermedio)</span>
                        </div>
                    </div>
                </div>

                <!-- Card 3: Políticas y Soporte L&D -->
                <div class="obsidian-card bg-navy p-3">
                    <h6 class="fw-bold text-white mb-3 pb-2 border-bottom border-secondary fs-7"><i class="fa-solid fa-shield-halved text-emerald me-2"></i> Políticas y Soporte L&D</h6>
                    <ul class="list-unstyled fs-8 text-secondary mb-3 space-y-2">
                        <li class="mb-2"><i class="fa-solid fa-check text-emerald me-2"></i> <strong>Vigencia del Certificado:</strong> 12 meses. Recertificación obligatoria con renovatorio previo a 60 días de vencer.</li>
                        <li class="mb-2"><i class="fa-solid fa-user-shield text-cyan me-2"></i> <strong>Administrador Asignado:</strong> Eloy Morales (L&D Lead) - <code>lnd-support@adryan.cloud</code></li>
                    </ul>
                    <a href="javascript:void(0)" onclick="alert('Abriendo historial de versiones...')" class="text-cyan fs-8 fw-semibold text-decoration-none"><i class="fa-solid fa-history me-1"></i> Consultar historial de versions (v1.0 - v\${versionNumText})</a>
                </div>
            </div>
        </div>
    \`;
}`;

content = content.substring(0, idxStartRender) + newRenderFunc + '\n' + content.substring(idxEndRender);

fs.writeFileSync(filepath, content, 'utf8');
console.log('2. renderScreenCourseDetail updated cleanly with ProgressService resolution & deterministic order.');
