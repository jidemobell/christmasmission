// Dodge Game - Avoid falling obstacles

class DodgeGame {
    constructor(onComplete) {
        this.onComplete = onComplete;
        this.gameArea = document.getElementById('game-area');
        this.isActive = false;
        this.gameTime = 15; // seconds
        this.timeLeft = this.gameTime;
        this.playerX = 50; // percentage
        this.obstacles = [];
        this.gameTimer = null;
        this.spawnTimer = null;
        this.animationFrame = null;
        
        this.init();
    }
    
    init() {
        this.gameArea.innerHTML = `
            <div class="score-display">Survive for ${this.gameTime} seconds!</div>
            <div class="game-timer">Time: ${this.timeLeft}s</div>
            <div class="dodge-area" id="dodge-area">
                <div class="dodge-player" id="dodge-player"></div>
            </div>
            <div style="text-align: center; margin-top: 15px;">
                <button id="start-dodge" class="btn btn-primary">Start Dodging!</button>
            </div>
            <div style="text-align: center; margin-top: 10px; color: #a0a0a0; font-size: 14px;">
                <p>Move left and right to avoid the falling blocks!</p>
                <p>Touch the left/right sides of the screen to move.</p>
            </div>
        `;
        
        this.dodgeArea = document.getElementById('dodge-area');
        this.player = document.getElementById('dodge-player');
        this.scoreDisplay = this.gameArea.querySelector('.score-display');
        this.timerDisplay = this.gameArea.querySelector('.game-timer');
        
        document.getElementById('start-dodge').addEventListener('click', () => this.startGame());
        
        this.setupControls();
    }
    
    setupControls() {
        // Touch controls for mobile
        this.dodgeArea.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (!this.isActive) return;
            
            const touch = e.touches[0];
            const rect = this.dodgeArea.getBoundingClientRect();
            const touchX = touch.clientX - rect.left;
            const areaWidth = rect.width;
            
            if (touchX < areaWidth / 2) {
                this.movePlayer(-15); // Move left
            } else {
                this.movePlayer(15); // Move right
            }
        });
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (!this.isActive) return;
            
            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
                this.movePlayer(-15);
            } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
                this.movePlayer(15);
            }
        });
        
        // Mouse controls
        this.dodgeArea.addEventListener('click', (e) => {
            if (!this.isActive) return;
            
            const rect = this.dodgeArea.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const areaWidth = rect.width;
            
            if (clickX < areaWidth / 2) {
                this.movePlayer(-15);
            } else {
                this.movePlayer(15);
            }
        });
    }
    
    movePlayer(deltaX) {
        this.playerX = Math.max(10, Math.min(90, this.playerX + deltaX));
        this.player.style.left = this.playerX + '%';
    }
    
    startGame() {
        this.isActive = true;
        this.timeLeft = this.gameTime;
        this.obstacles = [];
        this.playerX = 50;
        this.player.style.left = '50%';
        
        // Hide start button
        document.getElementById('start-dodge').style.display = 'none';
        
        // Start game timer
        this.gameTimer = setInterval(() => {
            this.timeLeft--;
            this.timerDisplay.textContent = `Time: ${this.timeLeft}s`;
            
            if (this.timeLeft <= 0) {
                this.endGame(true); // Survived!
            }
        }, 1000);
        
        // Start spawning obstacles
        this.spawnObstacle();
        
        // Start game loop
        this.gameLoop();
    }
    
    spawnObstacle() {
        if (!this.isActive) return;
        
        const obstacle = document.createElement('div');
        obstacle.className = 'dodge-obstacle';
        obstacle.style.left = Math.random() * 90 + '%';
        obstacle.style.top = '-40px';
        
        this.dodgeArea.appendChild(obstacle);
        this.obstacles.push({
            element: obstacle,
            y: -40,
            x: parseFloat(obstacle.style.left)
        });
        
        // Schedule next obstacle
        const spawnDelay = Math.random() * 1000 + 800; // 0.8-1.8 seconds
        this.spawnTimer = setTimeout(() => this.spawnObstacle(), spawnDelay);
    }
    
    gameLoop() {
        if (!this.isActive) return;
        
        // Move obstacles down
        this.obstacles.forEach((obstacle, index) => {
            obstacle.y += 3; // Speed
            obstacle.element.style.top = obstacle.y + 'px';
            
            // Remove if off screen
            if (obstacle.y > this.dodgeArea.offsetHeight) {
                obstacle.element.remove();
                this.obstacles.splice(index, 1);
                return;
            }
            
            // Check collision with player
            const playerRect = {
                x: this.playerX,
                width: 8, // percentage
                y: 85, // percentage from top
                height: 8
            };
            
            const obstacleRect = {
                x: obstacle.x,
                width: 8,
                y: (obstacle.y / this.dodgeArea.offsetHeight) * 100,
                height: 8
            };
            
            if (this.checkCollision(playerRect, obstacleRect)) {
                this.endGame(false); // Hit!
                return;
            }
        });
        
        this.animationFrame = requestAnimationFrame(() => this.gameLoop());
    }
    
    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    endGame(success) {
        this.isActive = false;
        
        // Clear timers
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
        if (this.spawnTimer) {
            clearTimeout(this.spawnTimer);
            this.spawnTimer = null;
        }
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
        
        // Clear obstacles
        this.obstacles.forEach(obstacle => obstacle.element.remove());
        this.obstacles = [];
        
        const timesSurvived = this.gameTime - this.timeLeft;
        
        this.gameArea.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 4rem; margin-bottom: 20px;">
                    ${success ? '🏃' : '💥'}
                </div>
                <h3>${success ? 'Dodge Master!' : 'Ouch!'}</h3>
                <p>You survived for ${timesSurvived} seconds!</p>
                <p>${success ? 
                    'Amazing dodging skills!' : 
                    'You got hit! Try to avoid the falling blocks.'
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
                this.init();
            }
        });
    }
    
    cleanup() {
        this.isActive = false;
        if (this.gameTimer) clearInterval(this.gameTimer);
        if (this.spawnTimer) clearTimeout(this.spawnTimer);
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
        this.obstacles.forEach(obstacle => obstacle.element.remove());
    }
}