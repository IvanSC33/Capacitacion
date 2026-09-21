const fs = require('fs');

const path = 'f:/PortalCapacitacion/ADRYAN_Learning_Functional_Prototype_III5_WORK.html';
let content = fs.readFileSync(path, 'utf8');

const newFunctions = `
// BLOCK C2 - Actividad y Navegación
function getOrderedPlayerActivities(context) {
    const orderedUnits = [...context.units].sort((a, b) => a.order - b.order);
    const orderedActivities = [];
    
    for (const unit of orderedUnits) {
        const unitActivities = context.activities
            .filter(a => a.unitId === unit.id)
            .sort((a, b) => a.order - b.order);
            
        // Attach unit reference for UI convenience
        unitActivities.forEach(a => {
            a._unitTitle = unit.title;
        });
        
        orderedActivities.push(...unitActivities);
    }
    
    return orderedActivities;
}

function selectPlayerActivity(activityId) {
    const context = AppState.playerContext;
    if (!context || !context.orderedActivities) {
        return createServiceError("E-03", "Contexto de reproductor no inicializado");
    }
    
    if (!activityId) {
        return createServiceError("E-07", "ID de actividad no proporcionado");
    }
    
    const index = context.orderedActivities.findIndex(a => a.id === activityId);
    
    if (index === -1) {
        return createServiceError("E-07", "La actividad no pertenece al contexto actual");
    }
    
    context.currentActivityId = activityId;
    context.currentActivityIndex = index;
    
    return {
        success: true,
        data: context.orderedActivities[index]
    };
}

function navigatePlayerActivity(direction) {
    const context = AppState.playerContext;
    if (!context || context.currentActivityIndex === undefined) return;
    
    let newIndex = context.currentActivityIndex;
    if (direction === "prev" && newIndex > 0) {
        newIndex--;
    } else if (direction === "next" && newIndex < context.orderedActivities.length - 1) {
        newIndex++;
    } else {
        return; // out of bounds
    }
    
    const nextAct = context.orderedActivities[newIndex];
    
    // Instead of using history.pushState, we just update state and re-render manually
    // or update hash if we use hash routing
    // Let's just update the hash so it re-renders naturally
    window.location.hash = \`#/player?courseId=\${context.course.id}&activityId=\${nextAct.id}\`;
}
`;

const scriptInsertionIndex = content.lastIndexOf('function renderScreenPlayer() {');
if (!content.includes('function selectPlayerActivity')) {
    content = content.substring(0, scriptInsertionIndex) + newFunctions + '\n' + content.substring(scriptInsertionIndex);
}

// Modify renderScreenPlayer
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
        // We don't change hash here, just select it
    }
    
    // BLOCK C2 - Select activity
    const selectResult = selectPlayerActivity(activityId);
    if (!selectResult.success) {
        showToast("Error " + selectResult.error.code, selectResult.error.message, "danger");
        // Clear context and go back to safety
        AppState.playerContext = null;
        window.location.hash = "#/my-learning";
        return "";
    }
    
    const currentAct = selectResult.data;
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
                <span class="badge bg-dark ms-1">\${a.required ? 'Obligatoria' : 'Opcional'}</span>
            </div>
        \`;
    });
    sidebarHtml += \`</div>\`;

    return \`
        <div class="row g-3">
            <div class="col-md-9">
                <div class="obsidian-card p-0 overflow-hidden mb-3">
                    <div class="bg-black text-center p-5 position-relative d-flex flex-column justify-content-center align-items-center" style="min-height: 380px;">
                        <i class="fa-solid fa-play text-cyan display-1 mb-3"></i>
                        <h4 class="text-white">\${currentAct.title}</h4>
                        <p class="text-muted">\${currentAct.type} - \${currentAct.required ? 'Obligatoria' : 'Opcional'}</p>
                        
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

content = content.replace(/function renderScreenPlayer\(\) \{[\s\S]*?    `;\n\}/, newRenderScreenPlayer);

fs.writeFileSync(path, content);
console.log("C2 Implementation written successfully.");
