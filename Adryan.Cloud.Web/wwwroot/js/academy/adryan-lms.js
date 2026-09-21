ADRYAN.LMS = {
    currentModuleId: null,
    currentCourseId: null,
    
    loadDashboard: function() {
        const container = document.getElementById('adr-modules-container');
        if(!container) return;
        
        container.innerHTML = ADRYAN.Data.modules.map(mod => {
            const prog = ADRYAN.Auth.user.progress[mod.id] || 0;
            const isComplete = prog === 100;
            const isStarted = prog > 0 && prog < 100;
            
            let badgeClass = 'bg-secondary';
            if (isComplete) badgeClass = 'bg-success';
            else if (isStarted) badgeClass = 'bg-primary';

            let barColor = 'var(--adr-interactive)';
            if (isComplete) barColor = 'var(--adr-success)';
            else if (prog === 0) barColor = 'transparent';

            let statusText = isComplete ? `<span class="text-success small fw-bold"><i class="fas fa-check-circle me-1"></i> Completado</span>` : `<span class="text-dark small fw-bold">${prog}%</span>`;
            let actionText = isComplete || isStarted ? 'Continuar aprendiendo' : 'Empezar módulo';
            
            return `
            <div class="col-md-6 col-lg-4 adr-module-item mb-4" data-title="${mod.title}">
                <div class="card adr-module-card p-4 h-100 d-flex flex-column border-0 shadow-sm" onclick="ADRYAN.LMS.openModule('${mod.id}')" style="border: 1px solid #f0f2f5; border-radius: 12px;">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div class="rounded-3 d-flex align-items-center justify-content-center" style="width: 48px; height: 48px; background-color: ${mod.color}15; color: ${mod.color};">
                            <i class="fas ${mod.icon} fs-5"></i>
                        </div>
                        <span class="badge ${badgeClass} rounded-pill px-3 py-2 shadow-0">${prog}%</span>
                    </div>
                    <h5 class="fw-bold mb-2 text-dark" style="font-size: 1.1rem;">${mod.title}</h5>
                    <p class="text-muted small flex-grow-1 mb-4" style="font-size: 0.85rem; line-height: 1.5;">${mod.desc}</p>
                    <div class="mt-auto">
                        <div class="d-flex justify-content-between align-items-end mb-2">
                            <span class="text-muted small fw-bold">Avance</span>
                            ${statusText}
                        </div>
                        <div class="adr-progress-bar-container mb-4" style="height: 6px; background-color: #ebecf0; border-radius: 3px;">
                            <div class="adr-progress-fill" style="width: ${prog}%; background-color: ${barColor};"></div>
                        </div>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="text-primary small fw-bold text-decoration-none" style="color: var(--adr-interactive) !important;">
                                ${actionText} <i class="fas fa-arrow-right ms-1"></i>
                            </span>
                            ${isComplete ? '<i class="fas fa-trophy text-warning fs-5"></i>' : ''}
                        </div>
                    </div>
                </div>
            </div>`;
        }).join('');
    },

    openModule: function(modId) {
        this.currentModuleId = modId;
        const mod = ADRYAN.Data.modules.find(m => m.id === modId);
        const prog = ADRYAN.Auth.user.progress[modId] || 0;
        
        document.getElementById('adr-breadcrumb-current').innerText = mod.title;
        document.getElementById('adr-module-header').innerHTML = `
            <div class="d-flex align-items-center">
                <div class="rounded-circle p-4 me-4 text-white shadow-sm" style="background: ${mod.color};"><i class="fas ${mod.icon} fa-2x"></i></div>
                <div><h2 class="fw-bold text-dark mb-1">${mod.title}</h2><p class="text-muted mb-0">${mod.desc}</p></div>
            </div>
        `;

        document.getElementById('adr-cert-progress-bar').style.width = prog + '%';
        const btnCert = document.getElementById('adr-btn-cert');
        if(prog === 100) {
            btnCert.classList.remove('disabled', 'btn-light'); btnCert.classList.add('btn-success');
        } else {
            btnCert.classList.add('disabled', 'btn-light'); btnCert.classList.remove('btn-success');
        }

        const courses = ADRYAN.Data.courses[modId] || [];
        document.getElementById('adr-courses-list').innerHTML = courses.map((c, i) => {
            const isDone = ADRYAN.Auth.user.completedCourses[c.id];
            const isLocked = !isDone && i > 0 && !ADRYAN.Auth.user.completedCourses[courses[i-1].id];
            
            let btnHtml = '';
            if(isDone) btnHtml = `<button class="btn btn-light btn-sm px-3 border text-success fw-bold me-2"><i class="fas fa-check me-1"></i> Listo</button> <button class="btn btn-outline-secondary btn-sm" onclick="event.stopPropagation(); ADRYAN.LMS.startCourse('${c.id}')">Repasar</button>`;
            else if(isLocked) btnHtml = '<i class="fas fa-lock text-muted mx-3"></i>';
            else btnHtml = `<button class="btn adr-btn-primary btn-sm px-4" onclick="event.stopPropagation(); ADRYAN.LMS.startCourse('${c.id}')">Iniciar</button>`;

            let iconType = c.isQuiz ? 'fa-clipboard-list' : (c.simUrl ? 'fa-laptop-code' : 'fa-play');

            return `
            <div class="d-flex align-items-center p-4 border-bottom ${isLocked ? 'bg-light opacity-50' : 'hover-overlay'}" style="cursor: ${isLocked?'not-allowed':'pointer'}" ${!isLocked ? `onclick="ADRYAN.LMS.startCourse('${c.id}')"` : ''}>
                <div class="me-4"><div class="rounded-circle d-flex align-items-center justify-content-center border" style="width: 40px; height: 40px; background: ${isDone?'#e3fcef':'#fff'}; border-color: ${isDone?'#00875a':'#ccc'}!important; color: ${isDone?'#00875a':'#333'};">${isDone ? '<i class="fas fa-check"></i>' : (i+1)}</div></div>
                <div class="flex-grow-1">
                    <span class="badge ${c.isQuiz?'bg-danger':'bg-primary'} bg-opacity-10 text-dark mb-1 border"><i class="fas ${iconType} me-1"></i> ${c.type}</span>
                    <h6 class="mb-0 fw-bold text-dark">${c.title}</h6>
                </div>
                <div class="text-end d-flex align-items-center gap-3">
                    ${c.cup ? `<i class="fas fa-award fa-2x ${isDone?'text-warning':'text-muted opacity-20'}" title="Otorga Insignia"></i>` : ''}
                    ${btnHtml}
                </div>
            </div>`;
        }).join('');

        if(courses.length === 0) {
             document.getElementById('adr-courses-list').innerHTML = `
            <div class="p-5 text-center">
                <div class="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 80px; height: 80px;">
                    <i class="fas fa-tools fa-2x text-muted"></i>
                </div>
                <h5 class="fw-bold text-dark">Módulo en Construcción</h5>
                <p class="text-muted">El equipo de capacitación está preparando el contenido interactivo para este proceso.</p>
            </div>`;
        }

        ADRYAN.UI.navigate('adr-module-view');
    },

    startCourse: function(courseId) {
        this.currentCourseId = courseId;
        const courses = ADRYAN.Data.courses[this.currentModuleId];
        const course = courses.find(c => c.id === courseId);
        
        if (course.isQuiz) {
            ADRYAN.Quiz.start(course);
        } else {
            document.getElementById('adr-viewer-title').innerText = course.title;
            const btnComplete = document.getElementById('adr-btn-complete-course');
            
            if(ADRYAN.Auth.user.completedCourses[courseId]) {
                btnComplete.classList.replace('adr-btn-primary', 'btn-success');
                btnComplete.innerHTML = '<i class="fas fa-check-double me-2"></i> Completado';
                btnComplete.disabled = true;
            } else {
                btnComplete.classList.replace('btn-success', 'adr-btn-primary');
                btnComplete.innerHTML = '<i class="fas fa-check me-2"></i> Marcar como Completado';
                btnComplete.disabled = false;
            }
            
            const viewerContent = document.getElementById('adr-viewer-content');
            
            if (course.simUrl) {
                viewerContent.innerHTML = `<iframe src="${course.simUrl}" style="width:100%; height:100%; min-height: 700px; border:none; border-radius: 0 0 16px 16px;"></iframe>`;
                viewerContent.classList.remove('p-5', 'd-flex', 'align-items-center', 'justify-content-center');
                viewerContent.classList.add('p-0');
            } else {
                viewerContent.innerHTML = `
                    <div class="text-center p-5">
                        <img src="[https://cdn-icons-png.flaticon.com/512/2210/2210153.png](https://cdn-icons-png.flaticon.com/512/2210/2210153.png)" width="120" class="mb-4 opacity-50" alt="Learning">
                        <h3 class="text-muted fw-bold">Entorno Interactivo</h3>
                        <p class="text-muted">El contenido de este curso se cargaría aquí.</p>
                    </div>
                `;
                viewerContent.classList.remove('p-0');
                viewerContent.classList.add('p-5', 'd-flex', 'align-items-center', 'justify-content-center');
            }
            
            ADRYAN.UI.navigate('adr-course-view');
        }
    },

    markCourseComplete: function() {
        const cid = this.currentCourseId;
        if(!ADRYAN.Auth.user.completedCourses[cid]) {
            const dateStr = new Date().toLocaleDateString();
            ADRYAN.Auth.user.completedCourses[cid] = dateStr;
            
            let courseObj = null;
            const mod = ADRYAN.Data.modules.find(m => m.id === this.currentModuleId);
            ADRYAN.Data.courses[this.currentModuleId].forEach(c => { if(c.id === cid) courseObj = c; });
            
            ADRYAN.Auth.user.history.push({ course: courseObj.title, mod: mod.title, date: dateStr });
            if(courseObj.cup) ADRYAN.Auth.user.trophies++;
            
            this.recalculateProgress();
            ADRYAN.Auth.save();
            
            this.openModule(this.currentModuleId);
        }
    },

    recalculateProgress: function() {
        const modId = this.currentModuleId;
        const courses = ADRYAN.Data.courses[modId];
        if (!courses || courses.length === 0) return;
        
        let doneCount = 0;
        courses.forEach(c => {
            if(ADRYAN.Auth.user.completedCourses[c.id]) doneCount++;
        });
        const percent = Math.round((doneCount / courses.length) * 100);
        ADRYAN.Auth.user.progress[modId] = percent;
    },

    generateCertificate: function() {
        const mod = ADRYAN.Data.modules.find(m => m.id === this.currentModuleId);
        document.getElementById('adr-cert-user').innerText = ADRYAN.Auth.user.name;
        document.getElementById('adr-cert-module').innerText = mod.title;
        document.getElementById('adr-cert-date').innerText = new Date().toLocaleDateString();
        
        document.getElementById('adr-cert-id').innerText = (ADRYAN.Config ? ADRYAN.Config.certificatePrefix : "ADR-") + (Math.floor(Math.random() * 90000) + 10000);
        
        ADRYAN.UI.navigate('adr-certificate-view');
    },
    
    loadHistory: function() {
        const tbody = document.getElementById('adr-history-table');
        if(!tbody) return;

        if(ADRYAN.Auth.user.history.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted py-4">Aún no has completado ningún curso.</td></tr>';
            return;
        }
        tbody.innerHTML = ADRYAN.Auth.user.history.map(h => `
            <tr>
                <td class="ps-4 fw-bold text-dark">${h.course}</td>
                <td><span class="badge bg-light text-secondary border">${h.mod}</span></td>
                <td class="text-muted"><i class="far fa-calendar-alt me-1"></i> ${h.date}</td>
                <td class="text-center"><span class="badge bg-success rounded-pill">Aprobado</span></td>
            </tr>
        `).reverse().join('');
    }
};