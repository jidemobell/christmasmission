// Tap Targets Game - Click targets as they appear

class TapTargetsGame {
    constructor(targetCount = 10, onComplete, isHard = false) {
        this.targetCount = targetCount;
        this.onComplete = onComplete;
        this.isHard = isHard;
        this.tapped = 0;
        this.missed = 0;
        this.targets = [];
        this.gameArea = document.getElementById('game-area');
        this.isActive = true;
        
        this.init();
    }
    
    init() {
        this.gameArea.innerHTML = `
            <div class="score-display">Targets: ${this.tapped}/${this.targetCount}</div>
            <div class="tap-game-area" style="position: relative; width: 100%; height: 300px; background: rgba(255,255,255,0.05); border-radius: 16px; overflow: hidden;"></div>
        `;
        
        this.tapArea = this.gameArea.querySelector('.tap-game-area');
        this.scoreDisplay = this.gameArea.querySelector('.score-display');
        
        // Start spawning targets
        this.spawnNextTarget();
    }
    
    spawnNextTarget() {
        if (!this.isActive || this.tapped >= this.targetCount) {
            this.endGame();
            return;
        }
        
        const target = document.createElement('div');
        target.className = 'tap-target';
        target.innerHTML = this.isHard ? '💥' : '🎯';
        
        // Random position within the area
        const maxX = this.tapArea.offsetWidth - 60;
        const maxY = this.tapArea.offsetHeight - 60;
        target.style.left = Math.random() * maxX + 'px';
        target.style.top = Math.random() * maxY + 'px';
        
        this.tapArea.appendChild(target);
        this.targets.push(target);
        
        // Handle tap
        target.addEventListener('click', () => {
            if (!this.isActive) return;
            this.tapTarget(target);
        });
        
        // Auto-remove after timeout
        const timeout = this.isHard ? 1500 : 2500;
        setTimeout(() => {
            if (target.parentNode && this.isActive) {
                this.missTarget(target);
            }
        }, timeout);
        
        // Spawn next target
        const spawnDelay = this.isHard ? 800 : 1200;
        setTimeout(() => this.spawnNextTarget(), spawnDelay);
    }
    
    tapTarget(target) {
        if (!target.parentNode) return;
        
        this.tapped++;
        this.scoreDisplay.textContent = `Targets: ${this.tapped}/${this.targetCount}`;
        
        // Visual feedback
        target.style.background = 'linear-gradient(135deg, #51cf66 0%, #40c057 100%)';
        target.innerHTML = '✨';
        target.style.transform = 'scale(1.3)';
        target.style.pointerEvents = 'none';
        
        setTimeout(() => {
            if (target.parentNode) {
                target.remove();
            }
        }, 300);
        
        const index = this.targets.indexOf(target);
        if (index > -1) this.targets.splice(index, 1);
        
        // Check win condition
        if (this.tapped >= this.targetCount) {
            setTimeout(() => this.endGame(), 500);
        }
    }
    
    missTarget(target) {
        if (!target.parentNode) return;
        
        this.missed++;
        
        // Visual feedback for miss
        target.style.background = '#666';
        target.innerHTML = '💨';
        target.style.opacity = '0.5';
        
        setTimeout(() => {
            if (target.parentNode) {
                target.remove();
            }
        }, 300);
        
        const index = this.targets.indexOf(target);
        if (index > -1) this.targets.splice(index, 1);
    }
    
    endGame() {
        this.isActive = false;
        
        // Clean up remaining targets
        this.targets.forEach(target => {
            if (target.parentNode) {
                target.remove();
            }
        });
        
        const success = this.tapped >= this.targetCount;
        
        // Show result
        this.gameArea.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 4rem; margin-bottom: 20px;">
                    ${success ? '🎉' : '😅'}
                </div>
                <h3>${success ? 'Mission Complete!' : 'Try Again!'}</h3>
                <p>You hit ${this.tapped} out of ${this.targetCount} targets!</p>
                ${!success ? '<p>You need to hit all targets to complete the mission.</p>' : ''}
                <button id="game-result-btn" class="btn btn-primary" style="margin-top: 20px;">
                    ${success ? 'Continue →' : 'Try Again'}
                </button>
            </div>
        `;
        
        document.getElementById('game-result-btn').addEventListener('click', () => {
            if (success) {
                this.onComplete(true);
            } else {
                // Restart the game
                this.tapped = 0;
                this.missed = 0;
                this.targets = [];
                this.isActive = true;
                this.init();
            }
        });
    }
    
    cleanup() {
        this.isActive = false;
        this.targets.forEach(target => {
            if (target.parentNode) {
                target.remove();
            }
        });
    }
}