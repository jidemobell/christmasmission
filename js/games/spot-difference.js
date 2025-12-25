// Spot the Difference Game - Find differences between images

class SpotDifferenceGame {
    constructor(onComplete) {
        this.onComplete = onComplete;
        this.gameArea = document.getElementById('game-area');
        this.isActive = true;
        this.differences = [];
        this.found = 0;
        this.totalDifferences = 3;
        
        this.init();
    }
    
    init() {
        // For simplicity, we'll create a pattern-based difference game
        // In a real implementation, you'd use actual images
        
        this.gameArea.innerHTML = `
            <div class="score-display">Find ${this.totalDifferences} differences!</div>
            <div class="spot-game-container">
                <div class="spot-image" id="spot-image1">
                    <div class="spot-pattern">🌟🎄🎁</div>
                    <div class="spot-pattern">🔔⭐🎅</div>
                    <div class="spot-pattern">🎉❄️🍪</div>
                </div>
                <div class="spot-image" id="spot-image2">
                    <div class="spot-pattern">🌟🎄🎁</div>
                    <div class="spot-pattern">🔔💫🎅</div>
                    <div class="spot-pattern">🎊❄️🍪</div>
                </div>
            </div>
            <div class="spot-differences" id="differences-found">
                Differences found: ${this.found}/${this.totalDifferences}
            </div>
            <div style="text-align: center; margin-top: 15px; color: #a0a0a0; font-size: 14px;">
                <p>Compare the two images and tap on the differences!</p>
            </div>
        `;
        
        this.setupDifferences();
    }
    
    setupDifferences() {
        const image2 = document.getElementById('spot-image2');
        const patterns = image2.querySelectorAll('.spot-pattern');
        
        // Mark the differences (⭐ instead of ⭐, 🎊 instead of 🎉)
        // In pattern 2: 🔔💫🎅 (💫 is different from ⭐)
        // In pattern 3: 🎊❄️🍪 (🎊 is different from 🎉)
        
        // Create clickable difference zones
        this.createDifferenceZone(patterns[1], '💫', 1);
        this.createDifferenceZone(patterns[2], '🎊', 2);
        
        // Add a third more subtle difference - add one to first pattern
        patterns[0].innerHTML = '🌟🎄🎁⚡'; // Added ⚡
        this.createDifferenceZone(patterns[0], '⚡', 3);
        
        this.updateFoundCount();
    }
    
    createDifferenceZone(pattern, diffChar, diffId) {
        const chars = pattern.textContent.split('');
        const diffIndex = chars.indexOf(diffChar);
        
        if (diffIndex === -1) return;
        
        // Create clickable overlay
        const overlay = document.createElement('div');
        overlay.style.position = 'absolute';
        overlay.style.left = (diffIndex * 33.33) + '%';
        overlay.style.top = '0';
        overlay.style.width = '33.33%';
        overlay.style.height = '100%';
        overlay.style.cursor = 'pointer';
        overlay.style.zIndex = '10';
        overlay.dataset.diffId = diffId;
        
        pattern.style.position = 'relative';
        pattern.appendChild(overlay);
        
        overlay.addEventListener('click', () => this.foundDifference(diffId, overlay));
    }
    
    foundDifference(diffId, element) {
        if (this.differences.includes(diffId) || !this.isActive) return;
        
        this.differences.push(diffId);
        this.found++;
        
        // Visual feedback
        element.style.background = 'rgba(81, 207, 102, 0.3)';
        element.style.border = '2px solid #51cf66';
        element.style.borderRadius = '8px';
        element.innerHTML = '✓';
        element.style.display = 'flex';
        element.style.alignItems = 'center';
        element.style.justifyContent = 'center';
        element.style.fontSize = '1.5rem';
        element.style.pointerEvents = 'none';
        
        this.updateFoundCount();
        
        if (this.found >= this.totalDifferences) {
            setTimeout(() => this.endGame(true), 1000);
        }
    }
    
    updateFoundCount() {
        document.getElementById('differences-found').textContent = 
            `Differences found: ${this.found}/${this.totalDifferences}`;
    }
    
    endGame(success) {
        this.isActive = false;
        
        this.gameArea.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 4rem; margin-bottom: 20px;">
                    ${success ? '👀' : '😅'}
                </div>
                <h3>${success ? 'Sharp Eyes!' : 'Keep Looking!'}</h3>
                <p>You found ${this.found} out of ${this.totalDifferences} differences!</p>
                <p>${success ? 
                    'Excellent observation skills!' : 
                    'Look more carefully at the details!'
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
                this.differences = [];
                this.found = 0;
                this.isActive = true;
                this.init();
            }
        });
    }
    
    cleanup() {
        this.isActive = false;
    }
}

// Add required CSS for spot the difference game
if (!document.querySelector('#spot-difference-styles')) {
    const style = document.createElement('style');
    style.id = 'spot-difference-styles';
    style.textContent = `
        .spot-game-container {
            display: flex;
            flex-direction: column;
            gap: 20px;
            align-items: center;
            margin: 20px 0;
        }
        
        .spot-image {
            width: 100%;
            max-width: 250px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 15px;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .spot-pattern {
            font-size: 1.8rem;
            text-align: center;
            padding: 8px;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 8px;
            position: relative;
        }
        
        .spot-differences {
            text-align: center;
            color: var(--accent);
            font-size: 1.1rem;
            font-weight: bold;
        }
        
        @media (min-width: 400px) {
            .spot-game-container {
                flex-direction: row;
                justify-content: space-between;
            }
            
            .spot-image {
                width: 48%;
            }
        }
    `;
    document.head.appendChild(style);
}