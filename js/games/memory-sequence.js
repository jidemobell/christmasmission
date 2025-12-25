// Memory Sequence Game - Simon Says style

class MemorySequenceGame {
    constructor(onComplete) {
        this.onComplete = onComplete;
        this.sequence = [];
        this.playerSequence = [];
        this.round = 1;
        this.maxRounds = 5;
        this.isShowing = false;
        this.gameArea = document.getElementById('game-area');
        this.colors = ['red', 'blue', 'yellow', 'purple'];
        this.isActive = true;
        
        this.init();
    }
    
    init() {
        this.gameArea.innerHTML = `
            <div class="score-display">Round ${this.round} of ${this.maxRounds}</div>
            <div class="memory-grid">
                <button class="memory-button" data-color="0" style="background: #ff6b6b;"></button>
                <button class="memory-button" data-color="1" style="background: #4ecdc4;"></button>
                <button class="memory-button" data-color="2" style="background: #ffe66d;"></button>
                <button class="memory-button" data-color="3" style="background: #a855f7;"></button>
            </div>
            <div class="memory-status">Watch the sequence...</div>
        `;
        
        this.buttons = this.gameArea.querySelectorAll('.memory-button');
        this.statusDiv = this.gameArea.querySelector('.memory-status');
        this.scoreDisplay = this.gameArea.querySelector('.score-display');
        
        this.buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                if (!this.isShowing && this.isActive) {
                    this.handlePlayerInput(parseInt(e.target.dataset.color));
                }
            });
        });
        
        // Start first round
        this.startRound();
    }
    
    startRound() {
        this.playerSequence = [];
        this.sequence.push(Math.floor(Math.random() * 4));
        this.showSequence();
    }
    
    async showSequence() {
        this.isShowing = true;
        this.statusDiv.textContent = 'Watch the sequence...';
        this.buttons.forEach(btn => btn.style.opacity = '0.6');
        
        await this.delay(1000);
        
        for (let i = 0; i < this.sequence.length; i++) {
            const colorIndex = this.sequence[i];
            this.flashButton(colorIndex);
            await this.delay(800);
        }
        
        this.isShowing = false;
        this.statusDiv.textContent = 'Now repeat the sequence!';
        this.buttons.forEach(btn => btn.style.opacity = '1');
    }
    
    flashButton(colorIndex) {
        const button = this.buttons[colorIndex];
        button.classList.add('active');
        
        // Play a simple audio feedback (visual)
        button.style.transform = 'scale(1.05)';
        
        setTimeout(() => {
            button.classList.remove('active');
            button.style.transform = 'scale(1)';
        }, 400);
    }
    
    handlePlayerInput(colorIndex) {
        this.playerSequence.push(colorIndex);
        this.flashButton(colorIndex);
        
        // Check if input matches sequence so far
        const currentIndex = this.playerSequence.length - 1;
        
        if (this.playerSequence[currentIndex] !== this.sequence[currentIndex]) {
            // Wrong! Game over
            this.endGame(false);
            return;
        }
        
        // Check if sequence is complete
        if (this.playerSequence.length === this.sequence.length) {
            this.round++;
            
            if (this.round > this.maxRounds) {
                // Won all rounds!
                this.endGame(true);
            } else {
                // Next round
                this.statusDiv.textContent = 'Correct! Next round...';
                this.scoreDisplay.textContent = `Round ${this.round} of ${this.maxRounds}`;
                setTimeout(() => this.startRound(), 1500);
            }
        }
    }
    
    endGame(success) {
        this.isActive = false;
        
        // Calculate score: 20 points per round completed
        const score = success ? 100 : Math.max(0, (this.round - 1) * 20);
        
        this.gameArea.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 4rem; margin-bottom: 20px;">
                    ${success ? '🧠' : '😅'}
                </div>
                <h3>${success ? 'Memory Master!' : 'Oops!'}</h3>
                <p>${success ? 
                    `Amazing! You completed all ${this.maxRounds} rounds!` : 
                    `You made it to round ${this.round - 1}. Try again!`
                }</p>
                ${success || this.round > 1 ? `<p class="score-display">Score: ${score}/100 points!</p>` : ''}
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
                this.sequence = [];
                this.playerSequence = [];
                this.round = 1;
                this.isActive = true;
                this.init();
            }
        });
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    cleanup() {
        this.isActive = false;
    }
}