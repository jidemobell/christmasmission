// Trace Shape Game - Draw shapes accurately

class TraceShapeGame {
    constructor(onComplete) {
        this.onComplete = onComplete;
        this.gameArea = document.getElementById('game-area');
        this.isActive = true;
        this.canvas = null;
        this.ctx = null;
        this.isDrawing = false;
        this.accuracy = 0;
        this.targetShape = 'star'; // Could be 'star', 'circle', 'triangle'
        
        this.init();
    }
    
    init() {
        this.gameArea.innerHTML = `
            <div class="score-display">Trace the ${this.targetShape}!</div>
            <canvas id="trace-canvas" class="trace-canvas" width="300" height="300"></canvas>
            <div style="text-align: center; margin-top: 15px; color: #a0a0a0; font-size: 14px;">
                <p>Follow the dotted line as closely as you can!</p>
                <p>Use your finger or mouse to draw.</p>
            </div>
            <div style="text-align: center; margin-top: 15px;">
                <button id="clear-trace" class="btn btn-secondary">Clear & Restart</button>
            </div>
        `;
        
        this.canvas = document.getElementById('trace-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreDisplay = this.gameArea.querySelector('.score-display');
        
        // Setup canvas
        this.setupCanvas();
        this.drawTargetShape();
        
        // Clear button
        document.getElementById('clear-trace').addEventListener('click', () => {
            this.clearCanvas();
            this.drawTargetShape();
        });
        
        // Auto-evaluate after drawing
        setTimeout(() => this.startEvaluation(), 2000);
    }
    
    setupCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        
        // Mouse events
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        
        // Touch events
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.startDrawing(e.touches[0]);
        });
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.draw(e.touches[0]);
        });
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.stopDrawing();
        });
    }
    
    getCanvasPos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) * (this.canvas.width / rect.width),
            y: (e.clientY - rect.top) * (this.canvas.height / rect.height)
        };
    }
    
    startDrawing(e) {
        this.isDrawing = true;
        const pos = this.getCanvasPos(e);
        this.ctx.beginPath();
        this.ctx.moveTo(pos.x, pos.y);
    }
    
    draw(e) {
        if (!this.isDrawing) return;
        
        const pos = this.getCanvasPos(e);
        
        this.ctx.lineWidth = 4;
        this.ctx.strokeStyle = '#4ecdc4';
        this.ctx.lineCap = 'round';
        this.ctx.lineTo(pos.x, pos.y);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(pos.x, pos.y);
    }
    
    stopDrawing() {
        this.isDrawing = false;
        this.ctx.beginPath();
        
        // Start evaluation timer
        setTimeout(() => this.evaluateDrawing(), 1000);
    }
    
    drawTargetShape() {
        this.ctx.setLineDash([8, 8]);
        this.ctx.strokeStyle = '#666';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const size = 80;
        
        if (this.targetShape === 'star') {
            this.drawStar(centerX, centerY, size);
        } else if (this.targetShape === 'circle') {
            this.ctx.arc(centerX, centerY, size, 0, Math.PI * 2);
        } else if (this.targetShape === 'triangle') {
            this.drawTriangle(centerX, centerY, size);
        }
        
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }
    
    drawStar(x, y, radius) {
        const spikes = 5;
        const outerRadius = radius;
        const innerRadius = radius * 0.4;
        
        let rot = Math.PI / 2 * 3;
        const step = Math.PI / spikes;
        
        this.ctx.moveTo(x, y - outerRadius);
        
        for (let i = 0; i < spikes; i++) {
            this.ctx.lineTo(x + Math.cos(rot) * outerRadius, y + Math.sin(rot) * outerRadius);
            rot += step;
            this.ctx.lineTo(x + Math.cos(rot) * innerRadius, y + Math.sin(rot) * innerRadius);
            rot += step;
        }
        
        this.ctx.lineTo(x, y - outerRadius);
    }
    
    drawTriangle(x, y, size) {
        this.ctx.moveTo(x, y - size);
        this.ctx.lineTo(x - size, y + size);
        this.ctx.lineTo(x + size, y + size);
        this.ctx.lineTo(x, y - size);
    }
    
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    startEvaluation() {
        // Add evaluation button
        const evalButton = document.createElement('button');
        evalButton.className = 'btn btn-primary';
        evalButton.textContent = 'Finished Drawing!';
        evalButton.style.marginTop = '15px';
        evalButton.onclick = () => this.evaluateDrawing();
        
        const container = this.gameArea.querySelector('div:last-child');
        container.appendChild(evalButton);
    }
    
    evaluateDrawing() {
        // Simple evaluation - check if there's enough drawing
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        let pixelsDrawn = 0;
        
        for (let i = 0; i < imageData.data.length; i += 4) {
            // Check alpha channel for drawn pixels
            if (imageData.data[i + 3] > 0) {
                pixelsDrawn++;
            }
        }
        
        // Very basic scoring - just check if they drew something substantial
        this.accuracy = Math.min(100, Math.floor(pixelsDrawn / 100));
        const success = this.accuracy > 30; // Pretty lenient
        
        this.endGame(success);
    }
    
    endGame(success) {
        this.isActive = false;
        
        this.gameArea.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 4rem; margin-bottom: 20px;">
                    ${success ? '🎨' : '😅'}
                </div>
                <h3>${success ? 'Great Drawing!' : 'Keep Practicing!'}</h3>
                <p>Drawing effort: ${this.accuracy > 30 ? 'Excellent' : 'Try tracing closer to the line'}</p>
                <p>${success ? 
                    'Nice artistic skills!' : 
                    'Try to follow the dotted line more closely.'
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
    }
}