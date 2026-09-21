ADRYAN.Quiz = {
    questions: [], currentQ: 0, score: 0,
    
    start: function(course) {
        this.questions = ADRYAN.Data.quizzes[course.id];
        this.currentQ = 0;
        this.score = 0;
        ADRYAN.UI.navigate('adr-quiz-view');
        this.render();
    },
    
    render: function() {
        const q = this.questions[this.currentQ];
        document.getElementById('adr-quiz-progress-text').innerText = `Pregunta ${this.currentQ + 1} de ${this.questions.length}`;
        document.getElementById('adr-quiz-bar').style.width = (((this.currentQ) / this.questions.length) * 100) + '%';
        
        document.getElementById('adr-quiz-question').innerText = q.q;
        document.getElementById('adr-quiz-options').innerHTML = q.options.map((opt, i) => `
            <div class="adr-quiz-option" onclick="ADRYAN.Quiz.selectOption(${i}, this)">
                <div class="d-flex align-items-center">
                    <div class="rounded-circle border d-flex align-items-center justify-content-center me-3" style="width:30px;height:30px;">${String.fromCharCode(65+i)}</div>
                    <span class="fs-5">${opt}</span>
                </div>
            </div>
        `).join('');
        document.getElementById('adr-btn-next-question').disabled = true;
        this.selectedAnswer = null;
    },
    
    selectOption: function(idx, element) {
        document.querySelectorAll('.adr-quiz-option').forEach(el => el.classList.remove('selected'));
        element.classList.add('selected');
        this.selectedAnswer = idx;
        document.getElementById('adr-btn-next-question').disabled = false;
    },
    
    nextQuestion: function() {
        if(this.selectedAnswer === this.questions[this.currentQ].correct) this.score++;
        
        this.currentQ++;
        if(this.currentQ < this.questions.length) {
            this.render();
        } else {
            this.finish();
        }
    },
    
    finish: function() {
        const percent = (this.score / this.questions.length) * 100;
        if(percent >= 50) {
            alert(`¡Examen Aprobado! Puntaje: ${Math.round(percent)}%`);
            ADRYAN.LMS.markCourseComplete();
        } else {
            alert(`No has superado el mínimo (Puntaje: ${Math.round(percent)}%). Vuelve a intentarlo.`);
            ADRYAN.LMS.openModule(ADRYAN.LMS.currentModuleId);
        }
    }
};