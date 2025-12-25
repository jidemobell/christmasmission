// Quick Math Game - Solve math problems fast

class QuickMathGame {
    constructor(onComplete) {
        this.onComplete = onComplete;
        this.gameArea = document.getElementById('game-area');
        this.isActive = false;
        this.problems = 8;
        this.currentProblem = 0;
        this.correct = 0;
        this.timePerProblem = 4; // seconds
        this.timeLeft = this.timePerProblem;
        this.timer = null;
        this.currentAnswer = 0;
        
        this.init();
    }
    
    init() {
        this.gameArea.innerHTML = `
            <div class="math-progress">Problem ${this.currentProblem + 1} of ${this.problems}</div>
            <div class="math-problem" id="math-problem">Ready?</div>
            <div class="math-options" id="math-options">
                <button class="btn btn-primary">Start!</button>
            </div>
            <div class="math-timer-bar">
                <div class="math-timer-fill" id="timer-fill" style="width: 100%;"></div>
            </div>
            <div style="text-align: center; margin-top: 15px; color: #a0a0a0; font-size: 14px;">
                <p>Solve ${this.problems} math problems quickly!</p>
                <p>You have ${this.timePerProblem} seconds per problem.</p>
            </div>
        `;
        
        this.problemDiv = document.getElementById('math-problem');
        this.optionsDiv = document.getElementById('math-options');
        this.timerFill = document.getElementById('timer-fill');
        this.progressDiv = this.gameArea.querySelector('.math-progress');
        
        // Start button
        this.optionsDiv.querySelector('button').addEventListener('click', () => this.startGame());
    }
    
    startGame() {
        this.isActive = true;
        this.currentProblem = 0;
        this.correct = 0;
        this.nextProblem();
    }
    
    nextProblem() {
        if (this.currentProblem >= this.problems) {
            this.endGame();
            return;
        }
        
        this.timeLeft = this.timePerProblem;
        this.progressDiv.textContent = `Problem ${this.currentProblem + 1} of ${this.problems}`;
        
        // Generate math problem
        const problem = this.generateProblem();
        this.currentAnswer = problem.answer;
        this.problemDiv.textContent = problem.question;
        
        // Generate answer options
        const options = this.generateOptions(problem.answer);
        this.optionsDiv.innerHTML = '';
        
        options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'math-option';
            button.textContent = option;
            button.addEventListener('click', () => this.selectAnswer(option));
            this.optionsDiv.appendChild(button);
        });
        
        // Start timer
        this.startTimer();
    }
    
    generateProblem() {
        const operations = ['+', '-', '×'];
        const operation = operations[Math.floor(Math.random() * operations.length)];
        
        let a, b, answer, question;
        
        switch (operation) {
            case '+':
                a = Math.floor(Math.random() * 20) + 1;
                b = Math.floor(Math.random() * 20) + 1;
                answer = a + b;
                question = `${a} + ${b}`;
                break;
            case '-':
                a = Math.floor(Math.random() * 20) + 10;
                b = Math.floor(Math.random() * 10) + 1;
                answer = a - b;
                question = `${a} - ${b}`;
                break;
            case '×':
                a = Math.floor(Math.random() * 9) + 2;
                b = Math.floor(Math.random() * 9) + 2;
                answer = a * b;
                question = `${a} × ${b}`;
                break;
        }
        
        return { question, answer };
    }
    
    generateOptions(correct) {
        const options = [correct];
        
        // Generate 3 wrong answers
        while (options.length < 4) {
            const wrong = correct + (Math.floor(Math.random() * 10) - 5);
            if (wrong > 0 && !options.includes(wrong)) {
                options.push(wrong);
            }
        }
        
        // Shuffle options
        return options.sort(() => Math.random() - 0.5);
    }
    
    startTimer() {
        this.timerFill.style.width = '100%';
        
        this.timer = setInterval(() => {
            this.timeLeft -= 0.1;
            const percentage = (this.timeLeft / this.timePerProblem) * 100;
            this.timerFill.style.width = Math.max(0, percentage) + '%';
            
            if (this.timeLeft <= 0) {
                this.selectAnswer(null); // Time up
            }
        }, 100);
    }
    
    selectAnswer(selected) {
        if (!this.isActive) return;
        
        clearInterval(this.timer);
        
        const isCorrect = selected === this.currentAnswer;
        if (isCorrect) this.correct++;
        
        // Visual feedback
        const buttons = this.optionsDiv.querySelectorAll('.math-option');
        buttons.forEach(button => {
            if (parseInt(button.textContent) === this.currentAnswer) {
                button.classList.add('correct');
            } else if (button.textContent === String(selected)) {
                button.classList.add('wrong');
            }
            button.style.pointerEvents = 'none';
        });
        
        this.currentProblem++;
        
        setTimeout(() => this.nextProblem(), 1000);
    }
    
    endGame() {
        this.isActive = false;
        
        const success = this.correct >= Math.ceil(this.problems * 0.75); // Need 75% correct
        
        // Calculate score: points per correct answer, bonus for 100%
        const baseScore = Math.floor((this.correct / this.problems) * 100);
        const perfectBonus = this.correct === this.problems ? 10 : 0;
        const score = success ? Math.min(100, baseScore + perfectBonus) : 0;
        
        this.gameArea.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 4rem; margin-bottom: 20px;">
                    ${success ? '🔢' : '😅'}
                </div>
                <h3>${success ? 'Math Wizard!' : 'Keep Practicing!'}</h3>
                <p>You got ${this.correct} out of ${this.problems} correct!</p>
                ${success ? `<p class="score-display">Score: ${score}/100 points!</p>` : ''}
                <p>${success ? 
                    'Excellent math skills!' : 
                    `You need at least ${Math.ceil(this.problems * 0.75)} correct to pass.`
                }</p>
                <button id="game-result-btn" class="btn btn-primary" style="margin-top: 20px;">
                    ${success ? 'Continue →' : 'Try Again'}
                </button>
            </div>
        `;
        
        document.getElementById('game-result-btn').addEventListener('click', () => {
            if (success) {
                this.onComplete(true, score);
            } else {
                // Restart
                this.init();
            }
        });
    }
    
    cleanup() {
        this.isActive = false;
        if (this.timer) {
            clearInterval(this.timer);
        }
    }
}