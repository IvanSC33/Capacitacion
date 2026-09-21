ADRYAN.UI = {
    navigate: function(sectionId) {
        const viewer = document.getElementById('adr-viewer-content');
        if (viewer && sectionId !== 'adr-course-view') {
            viewer.innerHTML = ''; 
        }

        document.querySelectorAll('.adr-view-section').forEach(s => s.classList.remove('active'));
        const targetSection = document.getElementById(sectionId);
        if(targetSection) targetSection.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        document.querySelectorAll('#adr-main-nav .nav-link').forEach(el => {
            el.classList.remove('active');
            if(el.getAttribute('data-target') === sectionId) el.classList.add('active');
        });

        if(sectionId === 'adr-dashboard') ADRYAN.LMS.loadDashboard();
        if(sectionId === 'adr-progress-view') ADRYAN.LMS.loadHistory();
    },
    
    setupSearch: function() {
        const searchInput = document.getElementById('adr-module-search');
        if(!searchInput) return;

        searchInput.addEventListener('keyup', (e) => {
            const q = e.target.value.toLowerCase();
            document.querySelectorAll('#adr-dashboard .adr-module-item').forEach(item => {
                const text = item.getAttribute('data-title').toLowerCase();
                item.style.display = text.includes(q) ? 'block' : 'none';
            });
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    ADRYAN.Auth.init();
    ADRYAN.UI.setupSearch();
    ADRYAN.UI.navigate('adr-dashboard');
});
