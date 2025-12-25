// Reaction Game - Tap when the light turns green

class ReactionGame {
    constructor(onComplete) {
        this.onComplete = onComplete;
        this.gameArea = document.getElementById('game-area');
        this.isActive = true;
        this.attempts = 0;
        this.maxAttempts = 3;
        this.bestTime = null;
        this.startTime = null;
        this.greenTimeout = null;
        
        this.init();
    }
    
    init() {
        this.gameArea.innerHTML = `
            <div class="score-display">Attempt ${this.attempts + 1} of ${this.maxAttempts}</div>
            <div class="reaction-circle waiting" id="reaction-circle">
                <div>Wait for GREEN...</div>
            </div>
            <div class="reaction-result" id="reaction-result"></div>
            <div style="text-align: center; margin-top: 20px; color: #a0a0a0;">
                <p>Tap the circle as soon as it turns green!</p>
                <p>Don't tap while it's red or you'll have to start over.</p>
            </div>
        `;
        
        this.circle = document.getElementById('reaction-circle');
        this.result = document.getElementById('reaction-result');
        this.scoreDisplay = this.gameArea.querySelector('.score-display');
        
        this.circle.addEventListener('click', () => this.handleClick());
        
        // Start the sequence after a delay
        setTimeout(() => this.startSequence(), 2000);
    }
    
    startSequence() {
        if (!this.isActive) return;
        
        this.circle.className = 'reaction-circle waiting';
        this.circle.innerHTML = '<div>Wait for GREEN...</div>';
        this.result.textContent = '';
        
        // Random delay before turning green (2-5 seconds)
        const delay = Math.random() * 3000 + 2000;
        
        this.greenTimeout = setTimeout(() => {
            if (!this.isActive) return;
            
            this.circle.className = 'reaction-circle ready';
            this.circle.innerHTML = '<div>TAP NOW!</div>';
            this.startTime = Date.now();
        }, delay);
    }
    
    handleClick() {
        if (!this.isActive) return;
        
        if (this.circle.classList.contains('waiting')) {
            // Clicked too early!
            this.showResult('Too early! Wait for green.', false);
            clearTimeout(this.greenTimeout);
            setTimeout(() => this.startSequence(), 1500);
        } else if (this.circle.classList.contains('ready')) {
            // Good timing!
            const reactionTime = Date.now() - this.startTime;
            this.recordAttempt(reactionTime);
        }
    }
    
    recordAttempt(time) {
        this.attempts++;
        
        if (this.bestTime === null || time < this.bestTime) {
            this.bestTime = time;
        }
        
        this.showResult(`${time}ms - ${this.getSpeedRating(time)}!`, true);
        
        if (this.attempts >= this.maxAttempts) {
            setTimeout(() => this.endGame(), 2000);
        } else {
            this.scoreDisplay.textContent = `Attempt ${this.attempts + 1} of ${this.maxAttempts}`;
            setTimeout(() => this.startSequence(), 2000);
        }
    }
    
    getSpeedRating(time) {
        if (time < 300) return 'Lightning Fast';
        if (time < 500) return 'Super Quick';
        if (time < 700) return 'Nice Speed';
        if (time < 1000) return 'Good Reaction';
        return 'Getting There';
    }
    
    showResult(message, isSuccess) {
        this.circle.className = 'reaction-circle ' + (isSuccess ? 'ready' : 'waiting');
        this.circle.innerHTML = '<div>' + (isSuccess ? '✨' : '⚠️') + '</div>';
        this.result.textContent = message;
        this.result.style.color = isSuccess ? '#51cf66' : '#ff6b6b';
    }
    
    endGame() {
        this.isActive = false;
        
        const success = this.bestTime !== null && this.bestTime < 1500; // Must be under 1.5 seconds
        
        this.gameArea.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 4rem; margin-bottom: 20px;">
                    ${success ? '⚡' : '😅'}
                </div>
                <h3>${success ? 'Lightning Reflexes!' : 'Keep Practicing!'}</h3>
                <p>Your best time: ${this.bestTime ? this.bestTime + 'ms' : 'No valid attempts'}</p>
                <p>${success ? 
                    'Amazing reflexes! You\'re ready for action!' : 
                    'Try to tap as soon as it turns green!'
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
                this.attempts = 0;
                this.bestTime = null;
                this.isActive = true;
                this.init();
            }
        });
    }
    
    cleanup() {
        this.isActive = false;
        if (this.greenTimeout) {
            clearTimeout(this.greenTimeout);
        }
    }
}