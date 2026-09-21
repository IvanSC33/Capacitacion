const fs = require('fs');
const filePath = 'f:/PortalCapacitacion/ADRYAN_Learning_Functional_Prototype.html';
let html = fs.readFileSync(filePath, 'utf8');

const newPlayerModularFuncs = `
/* ==========================================================================
   FASE III.5 — PLAYER MODULAR RENDER FUNCTIONS (SECTION 31)
   ========================================================================== */
function renderPlayerProgress(globalProgressPct, completedCount, totalCount) {
    const roundedPct = Math.round(globalProgressPct * 10) / 10;
    return \`
        <div class="obsidian-card p-3 border-bright mb-3" data-qa-player="progress">
            <div class="d-flex align-items-center justify-content-between mb-1">
                <span class="text-white fw-semibold fs-7"><i class="fa-solid fa-chart-line text-cyan me-1"></i> Progreso del Aprendizaje</span>
                <span class="text-cyan fw-bold fs-7">\${completedCount} / \${totalCount} Actividades (\${roundedPct}%)</span>
            </div>
            <div class="progress bg-navy" style="height: 10px;" aria-label="Progreso general del curso">
                <div class="progress-bar bg-cyan-gradient" role="progressbar" 
                     style="width: \${roundedPct}%;" 
                     aria-valuenow="\${roundedPct}" 
                     aria-valuemin="0" 
                     aria-valuemax="100">\${roundedPct}%</div>
            </div>
        </div>
    \`;
}

function renderActivityContent(currentActivity, isSupported, isCompletedCurrent) {
    const activityType = currentActivity.type || currentActivity.activityType || "Video";

    if (!isSupported) {
        return \`
            <div class="obsidian-card p-5 text-center my-4 border-danger" data-qa-player="unsupported" data-qa-player="content-canvas">
                <i class="fa-solid fa-ban display-1 text-danger mb-3"></i>
                <h4 class="fw-bold text-white mb-2" id="player-current-activity-title">Tipo de Actividad No Soportado</h4>
                <p class="text-secondary mb-3">La actividad "\${currentActivity.title}" (\${activityType}) no cuenta con visor compatible.</p>
                <span class="badge bg-danger text-white">E-11: Tipo no soportado</span>
            </div>
        \`;
    }

    if (activityType === "Exam" || activityType === "Quiz") {
        return \`
            <div class="obsidian-card p-4 text-center my-3 border-bright" data-qa-player="content-canvas">
                <i class="fa-solid fa-file-signature display-2 text-cyan mb-3"></i>
                <h4 class="fw-bold text-white mb-2" id="player-current-activity-title">\${currentActivity.title}</h4>
                <p class="text-secondary mb-4">Esta actividad corresponde a una evaluación oficial.</p>
                <a href="#/assessment?activityId=\${currentActivity.id}" class="btn btn-obsidian-primary px-4 py-2 fw-semibold">
                    <i class="fa-solid fa-pen-to-square me-2"></i> Iniciar Evaluación
                </a>
            </div>
        \`;
    }

    if (currentActivity.requiresEvidence) {
        return \`
            <div class="obsidian-card p-4 my-3 border-bright" data-qa-player="content-canvas">
                <div class="d-flex align-items-center justify-content-between mb-3 border-bottom border-secondary pb-3">
                    <h5 class="fw-bold text-white mb-0" id="player-current-activity-title"><i class="fa-solid fa-upload text-cyan me-2"></i> \${currentActivity.title}</h5>
                    <span class="badge bg-dark border border-cyan text-cyan">Evidencia Requerida</span>
                </div>
                <p class="text-secondary fs-6 mb-4">\${currentActivity.description || 'Debe cargar una evidencia para completar esta actividad.'}</p>
                <a href="#/evidence?activityId=\${currentActivity.id}" class="btn btn-obsidian-primary px-4 py-2 fw-semibold">
                    <i class="fa-solid fa-cloud-arrow-up me-2"></i> Cargar Evidencia
                </a>
            </div>
        \`;
    }

    if (activityType === "Document" || activityType === "Reading") {
        return \`
            <div class="obsidian-card p-4 my-3 border-bright" data-qa-player="content-canvas">
                <div class="d-flex align-items-center justify-content-between mb-3 border-bottom border-secondary pb-3">
                    <h5 class="fw-bold text-white mb-0" id="player-current-activity-title"><i class="fa-solid fa-book-open text-cyan me-2"></i> \${currentActivity.title}</h5>
                    <span class="badge bg-dark border border-cyan text-cyan">\${activityType}</span>
                </div>
                <div class="text-secondary fs-6 leading-relaxed mb-4">
                    \${currentActivity.description || 'Instrucciones y material de lectura para esta unidad de aprendizaje.'}
                </div>
            </div>
        \`;
    }

    // Default Video / Simulator Player
    return \`
        <div class="obsidian-card p-3 my-3 border-bright" data-qa-player="content" data-qa-player="content-canvas">
            <div class="ratio ratio-16x9 bg-black rounded border border-secondary mb-3 overflow-hidden position-relative">
                <div class="d-flex flex-column align-items-center justify-content-center text-center p-4">
                    <i class="fa-solid fa-circle-play display-1 text-cyan mb-3 opacity-75"></i>
                    <h5 class="fw-bold text-white" id="player-current-activity-title">\${currentActivity.title}</h5>
                    <p class="text-muted fs-7 mb-0">Visor Interactivo — Modo Ejecución (\${activityType})</p>
                </div>
            </div>
            <div class="d-flex align-items-center justify-content-between">
                <div>
                    <h6 class="fw-bold text-white mb-1">\${currentActivity.title}</h6>
                    <p class="text-secondary fs-7 mb-0">\${currentActivity.description || 'Actividad práctica de aprendizaje.'}</p>
                </div>
                <div>
                    \${isCompletedCurrent 
                        ? '<span class="badge bg-success text-white px-3 py-2"><i class="fa-solid fa-circle-check me-1"></i> Completada</span>'
                        : '<button class="btn btn-obsidian-primary btn-sm px-3" onclick="completeCurrentActivity()"><i class="fa-solid fa-check me-1"></i> Marcar Completada</button>'
                    }
                </div>
            </div>
        </div>
    \`;
}

function renderPlayerSidebar(units, allActivities, currentActivity, activityProgressMap) {
    let sidebarHtml = \`
        <div class="obsidian-card p-3 border-bright" data-qa-player="sidebar">
            <h6 class="fw-bold text-white mb-3 d-flex align-items-center justify-content-between">
                <span><i class="fa-solid fa-list-check text-cyan me-2"></i> Índice Académico</span>
                <span class="badge bg-dark text-cyan fs-8">\${units.length} Unidades</span>
            </h6>
            <div class="accordion accordion-obsidian" id="playerAcademicIndex">
    \`;

    units.forEach((unit, uIdx) => {
        const unitActivities = allActivities.filter(a => a.unitId === unit.id);
        const isUnitActive = unitActivities.some(a => a.id === currentActivity.id);

        sidebarHtml += \`
            <div class="accordion-item bg-dark border border-secondary mb-2 rounded overflow-hidden" data-unit-id="\${unit.id}">
                <h2 class="accordion-header" id="heading-\${unit.id}">
                    <button class="accordion-button \${isUnitActive ? '' : 'collapsed'} bg-dark text-white py-2 fs-7 fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-\${unit.id}">
                        <i class="fa-solid fa-layer-group text-cyan me-2 fs-8"></i> \${unit.title}
                    </button>
                </h2>
                <div id="collapse-\${unit.id}" class="accordion-collapse collapse \${isUnitActive ? 'show' : ''}" data-bs-parent="#playerAcademicIndex">
                    <div class="accordion-body p-2 bg-navy">
                        <div class="list-group list-group-flush gap-1">
        \`;

        unitActivities.forEach(act => {
            const isCurrent = act.id === currentActivity.id;
            const prog = activityProgressMap[act.id];
            const isDone = prog && (prog.progressPct >= 100 || prog.status === "Completed");
            
            let statusIcon = '<span class="text-secondary me-1">○</span><i class="fa-regular fa-circle text-muted fs-8"></i>';
            let statusClass = 'text-secondary';
            if (isDone) {
                statusIcon = '<span class="text-success me-1">✓</span><i class="fa-solid fa-circle-check text-success fs-8"></i>';
                statusClass = 'text-white';
            } else if (isCurrent) {
                statusIcon = '<span class="text-cyan me-1">▶</span><i class="fa-solid fa-circle-play text-cyan fs-8"></i>';
                statusClass = 'text-cyan fw-semibold';
            }

            sidebarHtml += \`
                <button type="button" 
                        class="list-group-item list-group-item-action bg-dark border-0 rounded p-2 d-flex align-items-center justify-content-between \${statusClass}" 
                        data-activity-id="\${act.id}"
                        onclick="selectPlayerActivity('\${act.id}')">
                    <div class="d-flex align-items-center gap-2 overflow-hidden me-2">
                        \${statusIcon}
                        <span class="fs-7 text-truncate">\${act.title}</span>
                    </div>
                    <span class="badge bg-navy border border-secondary text-secondary fs-8">\${act.type || 'Video'}</span>
                </button>
            \`;
        });

        sidebarHtml += \`
                        </div>
                    </div>
                </div>
            </div>
        \`;
    });

    sidebarHtml += \`
            </div>
        </div>
    \`;

    return sidebarHtml;
}
`;

// Replace renderPlayerProgress, renderActivityContent, renderPlayerSidebar definition
const startIdx = html.indexOf("/* ==========================================================================\n   FASE III.5 — PLAYER MODULAR RENDER FUNCTIONS");
const endIdx = html.indexOf("function renderScreenPlayer()", startIdx);

if (startIdx !== -1 && endIdx !== -1) {
    html = html.substring(0, startIdx) + newPlayerModularFuncs + "\n" + html.substring(endIdx);
}

// Update renderScreenPlayer implementation
const oldScreenPlayerStart = html.indexOf("function renderScreenPlayer()");
const oldScreenPlayerEnd = html.indexOf("window.renderScreenPlayer = renderScreenPlayer;");

const newRenderScreenPlayerFunc = `function renderScreenPlayer() {
    // RBAC Security Check
    if (!AuthorizationService.can("learning.player.use")) {
        return render403AccessDenied("1.7 Visor Player de Aprendizaje", "learning.player.use");
    }

    const context = resolvePlayerContext();

    // Render error state if context resolution failed
    if (!context.success) {
        return \`
            <div class="obsidian-card p-4 text-center my-4 border-warning" data-qa-player="error">
                <div class="mb-3">
                    <i class="fa-solid fa-triangle-exclamation display-1 text-warning"></i>
                </div>
                <h4 class="fw-bold text-white mb-2">Visor Player — Contenido No Disponible</h4>
                <p class="text-secondary fs-6 mb-3">\${context.errorMessage || 'No se puede cargar el visor de aprendizaje.'}</p>
                <div class="d-inline-block bg-dark px-3 py-2 rounded border border-secondary mb-4 font-monospace fs-7 text-start">
                    <div><span class="text-muted">Código de Error:</span> <span class="text-warning">\${context.errorCode}</span></div>
                    <div><span class="text-muted">Tenant Activo:</span> <span class="text-cyan">\${TenantContext.getCurrentTenantId()}</span></div>
                </div>
                <div>
                    <a href="#/my-learning" class="btn btn-obsidian-primary px-4"><i class="fa-solid fa-arrow-left me-2"></i> Volver a Mi Aprendizaje</a>
                </div>
            </div>
        \`;
    }

    const { course, version, units, allActivities, currentActivity, globalProgressPct, activityProgressMap } = context;

    // Check unsupported activity type
    const supportedTypes = ["Video", "Simulator", "Exam", "Quiz", "Document", "Reading", "Interactive"];
    const activityType = currentActivity.type || currentActivity.activityType || "Video";
    const isSupported = supportedTypes.includes(activityType);

    const currentIndex = allActivities.findIndex(a => a.id === currentActivity.id);
    const isFirstActivity = currentIndex === 0;
    const isLastActivity = currentIndex === allActivities.length - 1;
    const isCompletedCurrent = activityProgressMap[currentActivity.id] && (activityProgressMap[currentActivity.id].progressPct >= 100 || activityProgressMap[currentActivity.id].status === "Completed");
    const isCourseCompleted = globalProgressPct >= 100 || Object.values(activityProgressMap).filter(p => p && (p.progressPct >= 100 || p.status === "Completed")).length === allActivities.length;

    const completedCount = Object.values(activityProgressMap).filter(p => p && (p.progressPct >= 100 || p.status === "Completed")).length;
    const totalCount = allActivities.length;

    const progressHeaderHtml = renderPlayerProgress(globalProgressPct, completedCount, totalCount);
    const contentAreaHtml = renderActivityContent(currentActivity, isSupported, isCompletedCurrent);
    const sidebarAreaHtml = renderPlayerSidebar(units, allActivities, currentActivity, activityProgressMap);

    return \`
        <div class="player-shell d-flex flex-column gap-3" data-qa-player="shell">
            <!-- Header & Global Progress -->
            <div class="obsidian-card p-3 border-bright">
                <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-2">
                    <div>
                        <div class="text-muted fs-7 mb-1">
                            <a href="#/dashboard" class="text-secondary text-decoration-none"><i class="fa-solid fa-house me-1"></i>Inicio</a>
                            <i class="fa-solid fa-chevron-right mx-2 fs-8"></i>
                            <a href="#/my-learning" class="text-secondary text-decoration-none">Mi Aprendizaje</a>
                            <i class="fa-solid fa-chevron-right mx-2 fs-8"></i>
                            <span class="text-cyan fw-semibold">\${course.title}</span>
                            <span class="badge bg-dark border border-cyan text-cyan ms-2">Visor Player</span>
                        </div>
                        <h4 class="fw-bold text-white mb-0 d-flex align-items-center gap-2">
                            <i class="fa-solid fa-circle-play text-cyan me-1"></i> \${course.title}
                            <span class="badge bg-navy border border-cyan text-cyan fs-7 fw-normal">\${version.version} Published</span>
                        </h4>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                        <a href="#/course?id=\${course.id}" class="btn btn-obsidian-secondary btn-sm"><i class="fa-solid fa-circle-info me-1"></i> Ver Ficha Curso</a>
                        \${isCourseCompleted ? '<a href="#/certifications" class="btn btn-success btn-sm"><i class="fa-solid fa-award me-1"></i> Ver Certificación</a>' : ''}
                    </div>
                </div>
            </div>

            \${progressHeaderHtml}

            <div class="row g-3">
                <div class="col-lg-8">
                    \${contentAreaHtml}
                    <!-- Navigation Controls -->
                    <div class="obsidian-card p-3 border-bright d-flex align-items-center justify-content-between gap-2" data-qa-player="nav" data-qa-player="controls">
                        <button id="btn-player-prev" class="btn btn-obsidian-secondary btn-sm px-3" \${isFirstActivity ? 'disabled' : ''} onclick="navigatePlayerActivity('prev')">
                            <i class="fa-solid fa-chevron-left me-1"></i> Anterior
                        </button>
                        <div class="text-muted fs-7">
                            Actividad \${currentIndex + 1} de \${allActivities.length}
                        </div>
                        <button id="btn-player-next" class="btn btn-obsidian-primary btn-sm px-3" \${isLastActivity && !isCompletedCurrent ? 'disabled' : ''} onclick="navigatePlayerActivity('next')">
                            Siguiente <i class="fa-solid fa-chevron-right ms-1"></i>
                        </button>
                    </div>
                </div>
                <div class="col-lg-4">
                    \${sidebarAreaHtml}
                </div>
            </div>
        </div>
    \`;
}
`;

if (oldScreenPlayerStart !== -1 && oldScreenPlayerEnd !== -1) {
    html = html.substring(0, oldScreenPlayerStart) + newRenderScreenPlayerFunc + "\n\n" + html.substring(oldScreenPlayerEnd);
}

// Make sure renderPlayerProgress, renderActivityContent, renderPlayerSidebar are exposed on window
const oldExposures = "window.renderScreenPlayer = renderScreenPlayer;";
const newExposures = `window.renderScreenPlayer = renderScreenPlayer;
window.renderPlayerProgress = renderPlayerProgress;
window.renderActivityContent = renderActivityContent;
window.renderPlayerSidebar = renderPlayerSidebar;`;

if (html.includes(oldExposures)) {
    html = html.replace(oldExposures, newExposures);
}

fs.writeFileSync(filePath, html, 'utf8');
console.log("Applied perfect player closure updates!");
