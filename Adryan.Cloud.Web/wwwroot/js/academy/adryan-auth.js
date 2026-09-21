ADRYAN.Auth = {
    user: null,
    init: function() {
        const saved = ADRYAN.Storage.get('adryan_lms_user');
        if (saved) {
            this.user = JSON.parse(saved);
        } else {
            this.resetData();
        }
        this.updateProfileUI();
    },
    save: function() {
        ADRYAN.Storage.set('adryan_lms_user', JSON.stringify(this.user));
        this.updateProfileUI();
    },
    resetData: function() {
        this.user = {
            id: '1001', name: 'Juan Pérez', trophies: 1,
            progress: { 'vacaciones': 75, 'planillas': 10, 'carga-masiva': 100, 'perfiles': 0, 'organizacion': 0 },
            completedCourses: { 'c1': '2026-03-15', 'c2': '2026-03-15' }, 
            history: []
        };
        this.save();
        if(ADRYAN.UI) ADRYAN.UI.navigate('adr-dashboard');
        if(ADRYAN.LMS) ADRYAN.LMS.loadDashboard();
    },
    updateProfileUI: function() {
        if(document.getElementById('adr-nav-username')){
            document.getElementById('adr-nav-username').innerText = this.user.name;
            document.getElementById('adr-total-trophies').innerText = this.user.trophies;
        }
        
        const completedCount = Object.keys(this.user.completedCourses).length;
        if(document.getElementById('adr-stat-courses')){
            document.getElementById('adr-stat-courses').innerText = completedCount;
            document.getElementById('adr-stat-badges').innerText = this.user.trophies;
            
            let totalProg = 0, fullyCompleted = 0;
            const mods = Object.values(this.user.progress);
            mods.forEach(p => { 
                totalProg += p; 
                if(p === 100) fullyCompleted++; 
            });
            const avgProg = mods.length ? Math.round(totalProg / mods.length) : 0;
            
            document.getElementById('adr-stat-progress').innerText = avgProg + '%';
            document.getElementById('adr-stat-progress-bar').style.width = avgProg + '%';
            document.getElementById('adr-stat-modules').innerText = fullyCompleted;
            
            let lvl = "Principiante";
            if(completedCount > 2) lvl = "Intermedio";
            if(completedCount > 5) lvl = "Experto";
            document.getElementById('adr-sidebar-level').innerText = "Nivel " + lvl;
            document.getElementById('adr-sidebar-xp').style.width = (avgProg) + '%';
        }
    }
};
