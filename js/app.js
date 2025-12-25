// Main Application Logic

let state = loadState();
let currentMission = null;
let puzzlePieces = [];

// DOM Elements
const screens = {
    welcome: document.getElementById('screen-welcome'),
    setup: document.getElementById('screen-setup'),
    hub: document.getElementById('screen-hub'),
    game: document.getElementById('screen-game'),
    complete: document.getElementById('screen-complete'),
    final: document.getElementById('screen-final'),
    prizes: document.getElementById('screen-prizes')
};

// Initialize app
document.addEventListener('DOMContentLoaded', init);

function init() {
    setupEventListeners();
    
    // Check if we have a saved photo
    if (state.setupComplete && state.photoData) {
        showScreen('hub');
        renderPuzzleGrid();
        renderMissions();
    } else {
        showScreen('welcome');
    }
}

function setupEventListeners() {
    // Welcome screen
    document.getElementById('btn-start').addEventListener('click', () => {
        if (state.setupComplete && state.photoData) {
            showScreen('hub');
            renderPuzzleGrid();
            renderMissions();
        } else {
            showScreen('setup');
        }
    });
    
    // Setup screen
    const uploadArea = document.getElementById('upload-area');
    const photoInput = document.getElementById('photo-input');
    
    uploadArea.addEventListener('click', () => photoInput.click());
    photoInput.addEventListener('change', handlePhotoUpload);
    
    document.getElementById('btn-confirm-photo').addEventListener('click', () => {
        state.setupComplete = true;
        state.gameStarted = true;
        saveState(state);
        showScreen('hub');
        renderPuzzleGrid();
        renderMissions();
    });
    
    // Game screen
    document.getElementById('btn-back').addEventListener('click', () => {
        if (currentMission && window.currentGame && window.currentGame.cleanup) {
            window.currentGame.cleanup();
        }
        showScreen('hub');
    });
    
    // Complete screen
    document.getElementById('btn-continue').addEventListener('click', () => {
        // Check if all pieces unlocked
        if (state.unlockedPieces.length >= CONFIG.totalPieces) {
            showScreen('final');
            showFinalReveal();
        } else {
            showScreen('hub');
            renderPuzzleGrid();
            renderMissions();
        }
    });
    
    // Prizes screen
    document.getElementById('btn-confirm-prizes').addEventListener('click', confirmPrizes);
}

function showScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.remove('active'));
    screens[screenName].classList.add('active');
}

// Photo handling
function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            // Create canvas to resize/crop image to square
            const canvas = document.createElement('canvas');
            const size = Math.min(img.width, img.height);
            canvas.width = 600;
            canvas.height = 600;
            
            const ctx = canvas.getContext('2d');
            const sx = (img.width - size) / 2;
            const sy = (img.height - size) / 2;
            
            ctx.drawImage(img, sx, sy, size, size, 0, 0, 600, 600);
            
            state.photoData = canvas.toDataURL('image/jpeg', 0.9);
            saveState(state);
            
            // Show preview
            const preview = document.getElementById('photo-preview');
            preview.src = state.photoData;
            preview.hidden = false;
            document.querySelector('.upload-placeholder').style.display = 'none';
            document.getElementById('btn-confirm-photo').disabled = false;
            
            // Generate puzzle pieces
            generatePuzzlePieces();
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

function generatePuzzlePieces() {
    if (!state.photoData) return;
    
    puzzlePieces = [];
    const img = new Image();
    img.onload = () => {
        const pieceSize = 600 / CONFIG.gridSize;
        
        for (let row = 0; row < CONFIG.gridSize; row++) {
            for (let col = 0; col < CONFIG.gridSize; col++) {
                const canvas = document.createElement('canvas');
                canvas.width = pieceSize;
                canvas.height = pieceSize;
                const ctx = canvas.getContext('2d');
                
                ctx.drawImage(
                    img,
                    col * pieceSize, row * pieceSize, pieceSize, pieceSize,
                    0, 0, pieceSize, pieceSize
                );
                
                puzzlePieces.push(canvas.toDataURL('image/jpeg', 0.9));
            }
        }
    };
    img.src = state.photoData;
}

// Render functions
function renderPuzzleGrid() {
    const grid = document.getElementById('puzzle-grid');
    grid.innerHTML = '';
    
    // Regenerate puzzle pieces if needed
    if (puzzlePieces.length === 0 && state.photoData) {
        generatePuzzlePieces();
    }
    
    for (let i = 0; i < CONFIG.totalPieces; i++) {
        const piece = document.createElement('div');
        piece.className = 'puzzle-piece';
        
        if (state.unlockedPieces.includes(i + 1)) {
            piece.classList.add('unlocked');
            if (puzzlePieces[i]) {
                const img = document.createElement('img');
                img.src = puzzlePieces[i];
                piece.appendChild(img);
            }
        } else {
            piece.innerHTML = '<span class="lock-icon">🔒</span>';
        }
        
        grid.appendChild(piece);
    }
    
    // Update progress
    document.getElementById('pieces-count').textContent = state.unlockedPieces.length;
}

function renderMissions() {
    const list = document.getElementById('missions-list');
    list.innerHTML = '';
    
    // Find next available mission
    const nextMissionId = state.completedMissions.length + 1;
    
    CONFIG.missions.forEach((mission, index) => {
        const card = document.createElement('div');
        card.className = 'mission-card';
        
        const isCompleted = state.completedMissions.includes(mission.id);
        const isNext = mission.id === nextMissionId;
        const isLocked = mission.id > nextMissionId;
        
        if (isCompleted) card.classList.add('completed');
        if (isLocked) card.classList.add('locked');
        
        card.innerHTML = `
            <div class="mission-icon">${mission.icon}</div>
            <div class="mission-info">
                <h4>${mission.name}</h4>
                <p>${mission.description}</p>
            </div>
            <div class="mission-status">
                ${isCompleted ? '✅' : isLocked ? '🔒' : '→'}
            </div>
        `;
        
        if (!isCompleted && !isLocked) {
            card.addEventListener('click', () => startMission(mission));
        }
        
        list.appendChild(card);
    });
}

// Game flow
function startMission(mission) {
    currentMission = mission;
    document.getElementById('game-title').textContent = mission.name;
    document.getElementById('game-instructions').textContent = mission.description;
    document.getElementById('game-area').innerHTML = '';
    document.getElementById('game-timer').hidden = true;
    
    showScreen('game');
    
    // Start the appropriate game
    setTimeout(() => {
        switch (mission.game) {
            case 'tap-targets':
                window.currentGame = new TapTargetsGame(10, onMissionComplete);
                break;
            case 'tap-targets-hard':
                window.currentGame = new TapTargetsGame(15, onMissionComplete, true);
                break;
            case 'memory-sequence':
                window.currentGame = new MemorySequenceGame(onMissionComplete);
                break;
            case 'reaction-game':
                window.currentGame = new ReactionGame(onMissionComplete);
                break;
            case 'sliding-puzzle':
                window.currentGame = new SlidingPuzzleGame(onMissionComplete);
                break;
            case 'speed-tap':
                window.currentGame = new SpeedTapGame(onMissionComplete);
                break;
            case 'quick-math':
                window.currentGame = new QuickMathGame(onMissionComplete);
                break;
            case 'trace-shape':
                window.currentGame = new TraceShapeGame(onMissionComplete);
                break;
            case 'dodge-game':
                window.currentGame = new DodgeGame(onMissionComplete);
                break;
            default:
                console.error('Unknown game:', mission.game);
        }
    }, 300);
}

function onMissionComplete(success) {
    if (success && currentMission) {
        // Mark mission as complete
        if (!state.completedMissions.includes(currentMission.id)) {
            state.completedMissions.push(currentMission.id);
        }
        
        // Unlock corresponding piece
        const pieceNum = currentMission.id;
        if (!state.unlockedPieces.includes(pieceNum)) {
            state.unlockedPieces.push(pieceNum);
        }
        
        saveState(state);
        
        // Show completion screen
        showMissionComplete(pieceNum);
    } else {
        // Failed - return to hub
        showScreen('hub');
    }
}

function showMissionComplete(pieceNum) {
    document.getElementById('piece-number').textContent = pieceNum;
    
    // Show the revealed piece
    const pieceContainer = document.getElementById('revealed-piece');
    if (puzzlePieces[pieceNum - 1]) {
        pieceContainer.innerHTML = `<img src="${puzzlePieces[pieceNum - 1]}" alt="Puzzle piece ${pieceNum}">`;
    }
    
    // Show dad's message
    const message = CONFIG.messages[pieceNum - 1] || "Great job!";
    document.getElementById('dad-message-text').textContent = message;
    
    showScreen('complete');
}

function showFinalReveal() {
    // Show full image
    document.getElementById('final-image').src = state.photoData;
    document.getElementById('final-message-text').textContent = CONFIG.finalMessage;
    
    // Trigger confetti
    createConfetti();
    
    // After delay, show prizes (if enabled)
    if (CONFIG.enablePrizes) {
        setTimeout(() => {
            const prizeBtn = document.createElement('button');
            prizeBtn.className = 'btn btn-primary btn-large';
            prizeBtn.textContent = '🎁 Open Prize Vault!';
            prizeBtn.onclick = () => {
                showScreen('prizes');
                renderPrizes();
            };
            document.querySelector('.final-content').appendChild(prizeBtn);
        }, 3000);
    }
}

function createConfetti() {
    const confettiContainer = document.getElementById('confetti');
    confettiContainer.innerHTML = '';
    
    const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#a855f7', '#51cf66'];
    
    for (let i = 0; i < 50; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + '%';
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDuration = (Math.random() * 2 + 2) + 's';
        piece.style.animationDelay = Math.random() * 2 + 's';
        confettiContainer.appendChild(piece);
    }
}

function renderPrizes() {
    const list = document.getElementById('prizes-list');
    list.innerHTML = '';
    
    CONFIG.prizes.forEach(prize => {
        const item = document.createElement('div');
        item.className = 'prize-item';
        if (state.selectedPrizes.includes(prize.id)) {
            item.classList.add('selected');
        }
        
        item.innerHTML = `
            <span class="prize-icon">${prize.icon}</span>
            <span class="prize-name">${prize.name}</span>
            <span class="prize-check">${state.selectedPrizes.includes(prize.id) ? '✓' : ''}</span>
        `;
        
        item.addEventListener('click', () => togglePrize(prize.id));
        list.appendChild(item);
    });
    
    updatePrizeCount();
}

function togglePrize(prizeId) {
    const index = state.selectedPrizes.indexOf(prizeId);
    
    if (index > -1) {
        state.selectedPrizes.splice(index, 1);
    } else if (state.selectedPrizes.length < CONFIG.maxPrizePicks) {
        state.selectedPrizes.push(prizeId);
    }
    
    saveState(state);
    renderPrizes();
}

function updatePrizeCount() {
    const remaining = CONFIG.maxPrizePicks - state.selectedPrizes.length;
    document.getElementById('picks-count').textContent = remaining;
    document.getElementById('btn-confirm-prizes').disabled = state.selectedPrizes.length === 0;
}

function confirmPrizes() {
    const selectedNames = CONFIG.prizes
        .filter(p => state.selectedPrizes.includes(p.id))
        .map(p => p.name)
        .join(', ');
    
    alert(`🎉 Awesome choices, ${CONFIG.childName}!\n\nYou picked: ${selectedNames}\n\nDad will make it happen! Merry Christmas! 🎄`);
}

// Dev helper: Reset game
window.resetGame = function() {
    state = resetState();
    puzzlePieces = [];
    location.reload();
};
