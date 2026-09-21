const fs = require('fs');

const path = 'f:/PortalCapacitacion/ADRYAN_Learning_Functional_Prototype_III5_WORK.html';
let content = fs.readFileSync(path, 'utf8');

const c3Logic = `
// BLOCK C3 - Resume + Reproducción
function formatPlaybackTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return \`\${m}:\${s}\`;
}

function initPlayerPlayback(activity) {
    const context = AppState.playerContext;
    if (!context) return;
    
    // Check if we need to clean up previous playback
    if (context.playerPlayback && context.playerPlayback.activityId !== activity.id) {
        stopAndPersistPlayback();
    }
    
    // Find existing progress
    const enrollmentId = context.enrollment.id;
    const tenantId = context.tenant.id;
    
    const existingProgress = ActivityProgressRepository.getAll().find(p => 
        p.tenantId === tenantId && 
        p.enrollmentId === enrollmentId && 
        p.activityId === activity.id
    );
    
    const durationSeconds = activity.type === "Video" || activity.type === "Simulator" ? 2400 : 60; // Mock duration
    
    if (existingProgress) {
        let isCompleted = existingProgress.status === "Completed" || existingProgress.progressPct >= 100;
        context.playerPlayback = {
            activityId: activity.id,
            durationSeconds: durationSeconds,
            currentPositionSeconds: isCompleted ? durationSeconds : existingProgress.lastPositionSeconds || 0,
            progressPct: isCompleted ? 100 : existingProgress.progressPct || 0,
            effectiveTimeSeconds: existingProgress.effectiveTimeSeconds || 0,
            isPlaying: false
        };
    } else {
        context.playerPlayback = {
            activityId: activity.id,
            durationSeconds: durationSeconds,
            currentPositionSeconds: 0,
            progressPct: 0,
            effectiveTimeSeconds: 0,
            isPlaying: false
        };
    }
}

function togglePlayPause() {
    const context = AppState.playerContext;
    if (!context || !context.playerPlayback) return;
    
    const pb = context.playerPlayback;
    
    if (pb.currentPositionSeconds >= pb.durationSeconds) {
        return; // Already completed, cannot play
    }
    
    if (pb.isPlaying) {
        // Pause
        pb.isPlaying = false;
        if (window.playerSimulationTimer) {
            clearInterval(window.playerSimulationTimer);
            window.playerSimulationTimer = null;
        }
        persistPartialPlayback();
    } else {
        // Play
        pb.isPlaying = true;
        if (window.playerSimulationTimer) {
            clearInterval(window.playerSimulationTimer);
        }
        window.playerSimulationTimer = setInterval(tickPlayback, 1000);
    }
    
    // Manually update the DOM for speed, or re-render
    const act = context.orderedActivities[context.currentActivityIndex];
    if (window.location.hash.includes(act.id)) {
        renderApp(); // Simple re-render
    }
}

function tickPlayback() {
    const context = AppState.playerContext;
    if (!context || !context.playerPlayback || !context.playerPlayback.isPlaying) {
        if (window.playerSimulationTimer) {
            clearInterval(window.playerSimulationTimer);
            window.playerSimulationTimer = null;
        }
        return;
    }
    
    const pb = context.playerPlayback;
    pb.currentPositionSeconds++;
    pb.effectiveTimeSeconds++;
    
    pb.progressPct = Math.min(100, Math.floor((pb.currentPositionSeconds / pb.durationSeconds) * 100));
    
    if (pb.currentPositionSeconds >= pb.durationSeconds) {
        // Completion!
        pb.currentPositionSeconds = pb.durationSeconds;
        pb.progressPct = 100;
        pb.isPlaying = false;
        if (window.playerSimulationTimer) {
            clearInterval(window.playerSimulationTimer);
            window.playerSimulationTimer = null;
        }
        
        // Delegate to Block B
        ProgressService.completeActivity(
            context.tenant.id,
            context.employee.id,
            context.enrollment.id,
            pb.activityId,
            pb.effectiveTimeSeconds
        );
    }
    
    // Just update the UI text instead of full re-render for performance
    const timeEl = document.getElementById('c3-time-display');
    const barEl = document.getElementById('c3-progress-bar');
    if (timeEl) {
        timeEl.innerText = \`\${formatPlaybackTime(pb.currentPositionSeconds)} / \${formatPlaybackTime(pb.durationSeconds)} (\${pb.progressPct}%)\`;
    }
    if (barEl) {
        barEl.style.width = \`\${pb.progressPct}%\`;
    }
    
    if (pb.progressPct >= 100) {
        renderApp(); // Re-render to show completed state
    }
}

function persistPartialPlayback() {
    const context = AppState.playerContext;
    if (!context || !context.playerPlayback) return;
    
    const pb = context.playerPlayback;
    if (pb.progressPct >= 100) {
        return; // Do not persist partial if completed
    }
    
    ProgressService.updateActivityProgress(
        context.tenant.id,
        context.employee.id,
        context.enrollment.id,
        pb.activityId,
        pb.progressPct,
        pb.currentPositionSeconds,
        pb.effectiveTimeSeconds
    );
}

function stopAndPersistPlayback() {
    const context = AppState.playerContext;
    if (!context || !context.playerPlayback) return;
    
    const pb = context.playerPlayback;
    pb.isPlaying = false;
    if (window.playerSimulationTimer) {
        clearInterval(window.playerSimulationTimer);
        window.playerSimulationTimer = null;
    }
    
    persistPartialPlayback();
}

function handlePlayerExit() {
    stopAndPersistPlayback();
    if (AppState.playerContext) {
        AppState.playerContext.playerPlayback = null;
    }
}

// Hook into hash change to detect exit
window.addEventListener('hashchange', () => {
    if (!window.location.hash.startsWith('#/player')) {
        handlePlayerExit();
    }
});
`;

// Inject C3 Logic right before navigatePlayerActivity
const scriptInsertionIndex = content.indexOf('function navigatePlayerActivity');
if (!content.includes('function initPlayerPlayback')) {
    content = content.substring(0, scriptInsertionIndex) + c3Logic + '\n' + content.substring(scriptInsertionIndex);
}

// Modify navigatePlayerActivity to hook stopAndPersistPlayback
content = content.replace(
    /const nextAct = context\.orderedActivities\[newIndex\];/,
    "stopAndPersistPlayback();\n    const nextAct = context.orderedActivities[newIndex];"
);

// Modify renderScreenPlayer to use C3
const renderStart = content.indexOf('function renderScreenPlayer() {');
const renderEndRegex = /function renderScreenPlayer\(\) \{[\s\S]*?    `;\n\}/;

const newRenderScreenPlayer = `function renderScreenPlayer() {
    // BLOCK C1 - Resolve Context
    const courseId = getCourseIdFromUrlOrState();
    
    if (!courseId) {
        showToast("Error E-03", "No se puede abrir el aprendizaje directamente. Selecciona un curso desde Mi Aprendizaje.", "danger");
        window.location.hash = "#/my-learning";
        return "";
    }

    // Only resolve context if it's not already resolved for this course
    if (!AppState.playerContext || AppState.playerContext.course?.id !== courseId) {
        const contextResult = resolvePlayerContext(courseId);
        
        if (!contextResult.success) {
            const errCode = contextResult.error.code;
            if (errCode === "E-08") {
                showToast("Error E-08", "No existe Enrollment para este aprendizaje.", "danger");
            } else if (errCode === "E-03") {
                showToast("Error E-03", "No se puede abrir el aprendizaje directamente. Selecciona un curso desde Mi Aprendizaje.", "danger");
            } else {
                showToast("Error " + errCode, contextResult.error.message || "Este aprendizaje ya no está disponible.", "danger");
            }
            window.location.hash = "#/my-learning";
            return "";
        }
        
        AppState.playerContext = contextResult.data;
        // BLOCK C2 - Order activities
        AppState.playerContext.orderedActivities = getOrderedPlayerActivities(AppState.playerContext);
    }
    
    // Get activityId from URL, or default to first
    const hashParts = window.location.hash.split('?');
    let activityId = null;
    if (hashParts.length > 1) {
        const params = new URLSearchParams(hashParts[1]);
        activityId = params.get('activityId');
    }
    
    if (!activityId && AppState.playerContext.orderedActivities.length > 0) {
        activityId = AppState.playerContext.orderedActivities[0].id;
    }
    
    // BLOCK C2 - Select activity
    const selectResult = selectPlayerActivity(activityId);
    if (!selectResult.success) {
        showToast("Error " + selectResult.error.code, selectResult.error.message, "danger");
        AppState.playerContext = null;
        window.location.hash = "#/my-learning";
        return "";
    }
    
    const currentAct = selectResult.data;
    
    // BLOCK C3 - Init playback state if needed
    if (!AppState.playerContext.playerPlayback || AppState.playerContext.playerPlayback.activityId !== currentAct.id) {
        initPlayerPlayback(currentAct);
    }
    
    const pb = AppState.playerContext.playerPlayback;
    
    const isFirst = AppState.playerContext.currentActivityIndex === 0;
    const isLast = AppState.playerContext.currentActivityIndex === AppState.playerContext.orderedActivities.length - 1;

    // Build sidebar
    let sidebarHtml = \`<div class="obsidian-card">
        <h6 class="fw-bold text-white mb-3">Contenido del Curso</h6>\`;
    
    let currentUnit = null;
    AppState.playerContext.orderedActivities.forEach((a, i) => {
        if (a._unitTitle !== currentUnit) {
            sidebarHtml += \`<div class="fw-bold text-white mt-3 mb-2">\${a._unitTitle}</div>\`;
            currentUnit = a._unitTitle;
        }
        
        const isSelected = a.id === currentAct.id;
        const colorClass = isSelected ? "text-cyan border-start border-cyan ps-2" : "text-muted ps-2";
        const icon = a.type === "Video" ? "fa-video" : 
                     a.type === "Simulator" ? "fa-gamepad" : 
                     a.type === "Document" ? "fa-file-pdf" : "fa-list-check";
        
        sidebarHtml += \`
            <div class="\${colorClass} mb-2 fs-7" style="cursor: pointer" onclick="window.location.hash='#/player?courseId=\${courseId}&activityId=\${a.id}'">
                <i class="fa-solid \${icon} me-1"></i> \${a.title} 
                <span class="badge bg-dark ms-1">\${a.required === true ? 'Obligatoria' : 'Opcional'}</span>
            </div>
        \`;
    });
    sidebarHtml += \`</div>\`;

    const isCompleted = pb.progressPct >= 100;
    const statusText = isCompleted ? "Completado" : "En progreso";
    
    return \`
        <div class="row g-3">
            <div class="col-md-9">
                <div class="obsidian-card p-0 overflow-hidden mb-3">
                    <div class="bg-black text-center p-5 position-relative d-flex flex-column justify-content-center align-items-center" style="min-height: 380px;">
                        
                        <div class="mb-4">
                            \${isCompleted ? 
                                \`<i class="fa-solid fa-check-circle text-success display-1"></i>\` :
                                \`<i class="fa-solid \${pb.isPlaying ? 'fa-pause-circle text-warning' : 'fa-play-circle text-cyan'} display-1" style="cursor:pointer;" onclick="togglePlayPause()"></i>\`
                            }
                        </div>
                        
                        <h4 class="text-white">\${currentAct.title}</h4>
                        <p class="text-muted">\${currentAct.type} - \${currentAct.required === true ? 'Obligatoria' : 'Opcional'}</p>
                        <p class="text-white fw-bold mb-1">\${statusText}</p>
                        
                        <div class="w-75 mt-3">
                            <div class="progress bg-dark" style="height: 10px;">
                                <div id="c3-progress-bar" class="progress-bar \${isCompleted ? 'bg-success' : 'bg-cyan'}" role="progressbar" style="width: \${pb.progressPct}%"></div>
                            </div>
                            <div id="c3-time-display" class="text-muted fs-7 text-start mt-1">
                                \${formatPlaybackTime(pb.currentPositionSeconds)} / \${formatPlaybackTime(pb.durationSeconds)} (\${pb.progressPct}%)
                            </div>
                        </div>
                        
                        <div class="position-absolute bottom-0 start-0 end-0 bg-dark p-2 d-flex align-items-center justify-content-between px-3">
                            <button class="btn btn-sm btn-outline-secondary" \${isFirst ? 'disabled' : ''} onclick="navigatePlayerActivity('prev')">
                                <i class="fa-solid fa-arrow-left me-1"></i> Anterior
                            </button>
                            <span class="fs-7 text-white">Actividad \${AppState.playerContext.currentActivityIndex + 1} de \${AppState.playerContext.orderedActivities.length}</span>
                            <button class="btn btn-sm btn-outline-secondary" \${isLast ? 'disabled' : ''} onclick="navigatePlayerActivity('next')">
                                Siguiente <i class="fa-solid fa-arrow-right ms-1"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                \${sidebarHtml}
            </div>
        </div>
    \`;
}`;

content = content.replace(renderEndRegex, newRenderScreenPlayer);

fs.writeFileSync(path, content);
console.log("C3 implementation written successfully!");
