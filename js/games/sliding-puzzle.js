// Sliding Puzzle Game - Arrange numbers 1-8 in order

class SlidingPuzzleGame {
    constructor(onComplete) {
        this.onComplete = onComplete;
        this.gameArea = document.getElementById('game-area');
        this.isActive = true;
        this.moves = 0;
        this.tiles = this.generatePuzzle();
        
        this.init();
    }
    
    generatePuzzle() {
        // Start with solved state, then shuffle
        let tiles = [1, 2, 3, 4, 5, 6, 7, 8, 0]; // 0 = empty space
        
        // Shuffle by making random valid moves
        for (let i = 0; i < 100; i++) {
            const emptyPos = tiles.indexOf(0);
            const validMoves = this.getValidMoves(emptyPos);
            const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
            this.swapTiles(tiles, emptyPos, randomMove);
        }
        
        return tiles;
    }
    
    getValidMoves(emptyPos) {
        const moves = [];
        const row = Math.floor(emptyPos / 3);
        const col = emptyPos % 3;
        
        // Up
        if (row > 0) moves.push(emptyPos - 3);
        // Down
        if (row < 2) moves.push(emptyPos + 3);
        // Left
        if (col > 0) moves.push(emptyPos - 1);
        // Right
        if (col < 2) moves.push(emptyPos + 1);
        
        return moves;
    }
    
    swapTiles(tiles, pos1, pos2) {
        [tiles[pos1], tiles[pos2]] = [tiles[pos2], tiles[pos1]];
    }
    
    init() {
        this.gameArea.innerHTML = `
            <div class="score-display">Moves: ${this.moves}</div>
            <div class="sliding-grid" id="sliding-grid"></div>
            <div style="text-align: center; margin-top: 20px; color: #a0a0a0;">
                <p>Arrange numbers 1-8 in order!</p>
                <p>Tap tiles next to the empty space to move them.</p>
            </div>
        `;
        
        this.grid = document.getElementById('sliding-grid');
        this.scoreDisplay = this.gameArea.querySelector('.score-display');
        
        this.renderGrid();
    }
    
    renderGrid() {
        this.grid.innerHTML = '';
        
        this.tiles.forEach((tile, index) => {
            const tileElement = document.createElement('div');
            tileElement.className = 'sliding-tile';
            
            if (tile === 0) {
                tileElement.classList.add('empty');
            } else {
                tileElement.textContent = tile;
                tileElement.addEventListener('click', () => this.handleTileClick(index));
            }
            
            this.grid.appendChild(tileElement);
        });
    }
    
    handleTileClick(tilePos) {
        if (!this.isActive) return;
        
        const emptyPos = this.tiles.indexOf(0);
        const validMoves = this.getValidMoves(emptyPos);
        
        if (validMoves.includes(tilePos)) {
            // Valid move
            this.swapTiles(this.tiles, emptyPos, tilePos);
            this.moves++;
            this.scoreDisplay.textContent = `Moves: ${this.moves}`;
            this.renderGrid();
            
            // Check win condition
            setTimeout(() => this.checkWin(), 300);
        }
    }
    
    checkWin() {
        const solved = [1, 2, 3, 4, 5, 6, 7, 8, 0];
        const isWon = this.tiles.every((tile, index) => tile === solved[index]);
        
        if (isWon) {
            this.endGame(true);
        }
    }
    
    endGame(success) {
        this.isActive = false;
        
        this.gameArea.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 4rem; margin-bottom: 20px;">
                    ${success ? '🧩' : '😅'}
                </div>
                <h3>${success ? 'Puzzle Solved!' : 'Keep Trying!'}</h3>
                <p>You completed it in ${this.moves} moves!</p>
                <p>${success ? 
                    'Great problem-solving skills!' : 
                    'The puzzle needs to be in order 1-8.'
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
                this.moves = 0;
                this.tiles = this.generatePuzzle();
                this.isActive = true;
                this.init();
            }
        });
    }
    
    cleanup() {
        this.isActive = false;
    }
}