// Speed Tap Game - Tap targets quickly

class SpeedTapGame {
    constructor(onComplete) {
        this.onComplete = onComplete;
        this.gameArea = document.getElementById('game-area');
        this.isActive = false;
        this.timeLimit = 15; // seconds
        this.targetGoal = 20;
        this.tapped = 0;
        this.timeLeft = this.timeLimit;
        this.gameTimer = null;
        this.spawnTimer = null;
        
        this.init();
    }
    
    init() {
        this.gameArea.innerHTML = `
            <div class="speed-tap-header">
                <div class="score-display">Targets: ${this.tapped}/${this.targetGoal}</div>
                <div class="game-timer">Time: ${this.timeLeft}s</div>
            </div>
            <div class="speed-tap-area" id="speed-tap-area"></div>
            <div style="text-align: center; margin-top: 15px;">
                <button id="start-speed-tap" class="btn btn-primary">Start!</button>
            </div>
            <div style="text-align: center; margin-top: 10px; color: #a0a0a0; font-size: 14px;">
                <p>Tap ${this.targetGoal} targets in ${this.timeLimit} seconds!</p>
            </div>
        `;
        
        this.tapArea = document.getElementById('speed-tap-area');
        this.scoreDisplay = this.gameArea.querySelector('.score-display');
        this.timerDisplay = this.gameArea.querySelector('.game-timer');
        
        document.getElementById('start-speed-tap').addEventListener('click', () => this.startGame());
    }
    
    startGame() {
        this.isActive = true;
        this.tapped = 0;
        this.timeLeft = this.timeLimit;
        
        // Hide start button
        document.getElementById('start-speed-tap').style.display = 'none';
        
        // Start game timer
        this.gameTimer = setInterval(() => {
            this.timeLeft--;
            this.timerDisplay.textContent = `Time: ${this.timeLeft}s`;
            
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
        
        // Start spawning targets
        this.spawnTarget();
    }
    
    spawnTarget() {
        if (!this.isActive) return;
        
        const target = document.createElement('div');
        target.className = 'speed-target';
        target.innerHTML = '🎯';
        
        // Random position
        const maxX = this.tapArea.offsetWidth - 50;
        const maxY = this.tapArea.offsetHeight - 50;
        target.style.left = Math.random() * maxX + 'px';
        target.style.top = Math.random() * maxY + 'px';
        
        this.tapArea.appendChild(target);
        
        // Handle tap
        target.addEventListener('click', () => {
            if (!this.isActive) return;
            
            this.tapped++;
            this.scoreDisplay.textContent = `Targets: ${this.tapped}/${this.targetGoal}`;
            
            // Visual feedback
            target.style.background = '#51cf66';
            target.innerHTML = '✨';
            target.style.transform = 'scale(1.3)';
            target.style.pointerEvents = 'none';
            
            setTimeout(() => target.remove(), 200);
            
            // Check win condition
            if (this.tapped >= this.targetGoal) {
                setTimeout(() => this.endGame(), 300);
            }
        });
        
        // Auto-remove target after 2 seconds
        setTimeout(() => {
            if (target.parentNode && this.isActive) {
                target.style.opacity = '0.3';
                target.innerHTML = '💨';
                setTimeout(() => target.remove(), 200);
            }
        }, 2000);
        
        // Spawn next target
        if (this.isActive) {
            this.spawnTimer = setTimeout(() => this.spawnTarget(), 600);
        }
    }
    
    endGame() {
        this.isActive = false;
        
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
        
        if (this.spawnTimer) {
            clearTimeout(this.spawnTimer);
            this.spawnTimer = null;
        }
        
        // Clear remaining targets
        this.tapArea.innerHTML = '';
        
        const success = this.tapped >= this.targetGoal;
        
        this.gameArea.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 4rem; margin-bottom: 20px;">
                    ${success ? '👆' : '😅'}
                </div>
                <h3>${success ? 'Speed Demon!' : 'So Close!'}</h3>
                <p>You tapped ${this.tapped} out of ${this.targetGoal} targets!</p>
                <p>${success ? 
                    'Amazing finger speed!' : 
                    `You needed ${this.targetGoal - this.tapped} more!`
                }</p>
                <button id="game-result-btn" class="btn btn-primary" style="margin-top: 20px;">
                    ${success ? 'Continue →' : 'Try Again'}
                </button>
            </div>
        `;
        
        document.getElementById('game-result-btn').addEventListener('click', () => {
            if (success) {
                this.onComplete(true);
            } else {
                // Restart
                this.isActive = false;
                this.init();
            }
        });
    }
    
    cleanup() {
        this.isActive = false;
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
        }
        if (this.spawnTimer) {
            clearTimeout(this.spawnTimer);
        }
    }
}