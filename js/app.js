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
    
    // Skip setup - use the embedded image directly
    state.photoData = 'asher_generated.png'; // Use the provided image
    state.setupComplete = true;
    
    // Start on welcome screen
    showScreen('welcome');
}

function setupEventListeners() {
    // Welcome screen - generate puzzle and go to hub
    const startBtn = document.getElementById('btn-start');
    
    if (startBtn) {
        startBtn.addEventListener('click', (e) => {
            e.preventDefault();
            startNewGame();
        });
    }
    
    // Add resume button if enabled
    if (CONFIG.resumeOptions && CONFIG.resumeOptions.enabled && CONFIG.resumeOptions.resumeToMission > 0) {
        addResumeButton();
    }
    
    // Reset button
    document.getElementById('btn-reset').addEventListener('click', () => {
        if (confirm('Are you sure you want to reset the entire game? This will delete all progress.')) {
            resetGame();
        }
    });
}

function startNewGame() {
    // Reset the game state for a fresh start
    state = resetState();
    state.photoData = 'asher_generated.png';
    state.setupComplete = true;
    saveState(state);
    
    // Generate puzzle pieces first (this will show the preview)
    generatePuzzlePieces();
    
    // Show hub after a brief delay to ensure puzzle generation completes
    setTimeout(() => {
        showScreen('hub');
        renderPuzzleGrid();
        renderMissions();
    }, 100);
}

function resumeProgress() {
    const resumeTo = CONFIG.resumeOptions.resumeToMission;
    
    // Reset the game state
    state = resetState();
    state.photoData = 'asher_generated.png';
    state.setupComplete = true;
    
    // Mark previous missions as completed with good scores
    for (let i = 1; i < resumeTo; i++) {
        state.completedMissions.push(i);
        state.missionScores[i] = 85; // Give good scores for completed missions
        state.unlockedPieces.push(i);
        state.totalPoints += 85;
    }
    
    saveState(state);
    
    // Generate puzzle pieces
    generatePuzzlePieces();
    
    // Show hub with progress restored
    setTimeout(() => {
        showScreen('hub');
        renderPuzzleGrid();
        renderMissions();
        
        // Show a welcome back message
        setTimeout(() => {
            alert(`Welcome back, ${CONFIG.childName}! Your progress has been restored. You can continue from the Math Fun mission! 🎯`);
        }, 500);
    }, 100);
}

function goDirectlyToPrizes() {
    // Set up state as if all missions completed with max points
    state = resetState();
    state.photoData = 'asher_generated.png';
    state.setupComplete = true;
    
    // Mark ALL missions as completed with perfect scores
    for (let i = 1; i <= CONFIG.missions.length; i++) {
        state.completedMissions.push(i);
        state.missionScores[i] = 100; // Perfect scores
        state.unlockedPieces.push(i);
    }
    
    // Give maximum possible points (100 per mission)
    state.totalPoints = CONFIG.missions.length * 100;
    
    saveState(state);
    
    // Go directly to prizes screen
    showScreen('prizes');
    renderPrizeVault();
    
    // Welcome message
    setTimeout(() => {
        alert(`Congratulations ${CONFIG.childName}! You've earned ${state.totalPoints} points! Time to claim your prizes! 🎁`);
    }, 500);
}

function addResumeButton() {
    const welcomeScreen = document.getElementById('screen-welcome');
    const startBtn = document.getElementById('btn-start');
    
    // Create resume button
    const resumeBtn = document.createElement('button');
    resumeBtn.id = 'btn-resume';
    resumeBtn.className = 'btn btn-secondary';
    resumeBtn.style.marginTop = '15px';
    resumeBtn.innerHTML = `
        <span style="font-size: 1.2rem; margin-right: 8px;">⚡</span>
        ${CONFIG.resumeOptions.resumeMessage || 'Resume Progress'}
    `;
    
    // Add click handler
    resumeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        resumeProgress();
    });
    
    // Insert after start button
    startBtn.parentNode.insertBefore(resumeBtn, startBtn.nextSibling);
    
    // Add prize claim button if enabled
    if (CONFIG.resumeOptions.enablePrizeClaim) {
        const prizeBtn = document.createElement('button');
        prizeBtn.id = 'btn-claim-prizes';
        prizeBtn.className = 'btn btn-success';
        prizeBtn.style.marginTop = '15px';
        prizeBtn.innerHTML = `
            <span style="font-size: 1.2rem; margin-right: 8px;">🏆</span>
            ${CONFIG.resumeOptions.prizeClaimMessage || 'Claim Prizes'}
        `;
        
        prizeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            goDirectlyToPrizes();
        });
        
        resumeBtn.parentNode.insertBefore(prizeBtn, resumeBtn.nextSibling);
    }
    
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
        // Always return to hub after mission completion
        // Player must manually place all pieces to reach final screen
        showScreen('hub');
        renderPuzzleGrid();
        renderPiecesBank();
        renderMissions();
    });
    
    // Prizes screen
    const confirmBtn = document.getElementById('btn-confirm-prizes');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
            confirmPrizes();
        });
    }
}

function showScreen(screenName) {
    Object.values(screens).forEach(screen => {
        if (screen) screen.classList.remove('active');
    });
    
    if (screens[screenName]) {
        screens[screenName].classList.add('active');
    }
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

function showImagePreview(img) {
    const previewOverlay = document.createElement('div');
    previewOverlay.style.cssText = 
        'position: fixed; top: 0; left: 0; width: 100%; height: 100%; ' +
        'background: rgba(0,0,0,0.9); display: flex; flex-direction: column; ' +
        'justify-content: center; align-items: center; z-index: 10000; ' +
        'color: white; text-align: center;';
    
    const previewImg = document.createElement('img');
    previewImg.src = img.src;
    previewImg.style.cssText = 
        'max-width: 80%; max-height: 60%; border: 3px solid gold; ' +
        'border-radius: 10px; box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);';
    
    const previewText = document.createElement('div');
    previewText.innerHTML = 
        '<h2 style="margin-bottom: 10px;">🎯 Your Mission Preview</h2>' +
        '<p style="margin-bottom: 5px;">This is what you\'re building piece by piece!</p>' +
        '<p style="font-size: 14px; opacity: 0.8;">Take a good look... this preview disappears in <span id="countdown">4</span> seconds</p>';
    
    previewOverlay.appendChild(previewText);
    previewOverlay.appendChild(previewImg);
    document.body.appendChild(previewOverlay);
    
    // Countdown and fade out
    let seconds = 4;
    const countdown = setInterval(() => {
        seconds--;
        const countdownEl = document.getElementById('countdown');
        if (countdownEl) countdownEl.textContent = seconds;
        
        if (seconds <= 0) {
            clearInterval(countdown);
            previewOverlay.style.transition = 'opacity 1s';
            previewOverlay.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(previewOverlay)) {
                    document.body.removeChild(previewOverlay);
                }
            }, 1000);
        }
    }, 1000);
}

function generatePuzzlePieces() {
    if (!state.photoData) return;
    
    puzzlePieces = [];
    const img = new Image();
    const imagePath = 'asher_generated.png';
    
    img.onload = () => {
        // Show preview for 4 seconds if this is the first time
        if (!state.previewShown) {
            showImagePreview(img);
            state.previewShown = true;
        }
        
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
        
        // Update the grid once pieces are generated
        if (document.getElementById('puzzle-grid')) {
            renderPuzzleGrid();
        }
    };
    img.src = imagePath;
}

function renderPuzzleGrid() {
    const grid = document.getElementById('puzzle-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    // Regenerate puzzle pieces if needed
    if (puzzlePieces.length === 0 && state.photoData) {
        generatePuzzlePieces();
        return;
    }
    
    for (let i = 0; i < CONFIG.totalPieces; i++) {
        const slot = document.createElement('div');
        slot.className = 'puzzle-slot';
        slot.dataset.slotId = i + 1;
        
        // Check if a piece is already placed here correctly
        const placedPieceId = Object.keys(state.placedPieces || {}).find(
            pieceId => state.placedPieces[pieceId] === (i + 1)
        );
        
        if (placedPieceId) {
            // Show the correctly placed piece
            slot.classList.add('filled');
            const img = document.createElement('img');
            img.src = puzzlePieces[placedPieceId - 1];
            slot.appendChild(img);
        } else {
            // Show numbered drop zone
            const slotNumber = document.createElement('div');
            slotNumber.className = 'slot-number';
            slotNumber.textContent = i + 1;
            slot.appendChild(slotNumber);
            
            // Set up drag and drop events inline
            slot.addEventListener('dragover', (e) => {
                e.preventDefault();
                if (!slot.classList.contains('filled')) {
                    slot.classList.add('drop-hover');
                }
            });
            
            slot.addEventListener('dragleave', () => {
                slot.classList.remove('drop-hover');
            });
            
            slot.addEventListener('drop', (e) => {
                e.preventDefault();
                slot.classList.remove('drop-hover');
                
                if (slot.classList.contains('filled')) return;
                
                const pieceId = parseInt(e.dataTransfer.getData('text/plain'));
                const slotId = parseInt(slot.dataset.slotId);
                
                // Inline piece placement logic
                if (!state.placedPieces) state.placedPieces = {};
                
                const isCorrect = pieceId === slotId;
                if (isCorrect) {
                    state.placedPieces[pieceId] = slotId;
                    saveState(state);
                    
                    // Show success feedback
                    showPlacementFeedback(true, 'Perfect! Piece ' + pieceId + ' fits perfectly! ✨');
                    
                    // Re-render to update display
                    setTimeout(() => {
                        renderPuzzleGrid();
                        renderPiecesBank();
                        
                        // Check if puzzle is complete
                        const correctPlacements = Object.keys(state.placedPieces).filter(
                            pId => state.placedPieces[pId] === parseInt(pId)
                        );
                        if (correctPlacements.length === CONFIG.totalPieces) {
                            setTimeout(() => {
                                showScreen('final');
                                showFinalReveal();
                            }, 1500);
                        }
                    }, 1000);
                } else {
                    showPlacementFeedback(false, 'Hmm, piece ' + pieceId + ' doesn\'t belong in slot ' + slotId + '. Try another spot!');
                }
            });
        }
        
        grid.appendChild(slot);
    }
    
    // Update progress
    document.getElementById('pieces-count').textContent = state.unlockedPieces.length;
    document.getElementById('points-total').textContent = state.totalPoints || 0;
    
    // Add preview button if all pieces are unlocked
    addPreviewButton();
}

function addPreviewButton() {
    // Only show preview button if all pieces are unlocked
    if (state.unlockedPieces.length < CONFIG.totalPieces) return;
    
    const puzzleContainer = document.querySelector('.puzzle-container');
    let previewBtn = document.getElementById('preview-btn');
    
    if (!previewBtn) {
        previewBtn = document.createElement('button');
        previewBtn.id = 'preview-btn';
        previewBtn.className = 'btn btn-secondary';
        previewBtn.textContent = '👁️ Quick Preview';
        previewBtn.style.marginTop = '10px';
        previewBtn.addEventListener('click', showCompleteImagePreview);
        puzzleContainer.appendChild(previewBtn);
    }
}

function showCompleteImagePreview() {
    const previewOverlay = document.createElement('div');
    previewOverlay.style.cssText = 
        'position: fixed; top: 0; left: 0; width: 100%; height: 100%; ' +
        'background: rgba(0,0,0,0.9); display: flex; flex-direction: column; ' +
        'justify-content: center; align-items: center; z-index: 10000; ' +
        'color: white; text-align: center;';
    
    const previewImg = document.createElement('img');
    previewImg.src = 'asher_generated.png';
    previewImg.style.cssText = 
        'max-width: 80%; max-height: 60%; border: 3px solid gold; ' +
        'border-radius: 10px; box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);';
    
    const previewText = document.createElement('div');
    previewText.innerHTML = 
        '<h2 style="margin-bottom: 10px;">🎯 Complete Picture Preview</h2>' +
        '<p style="margin-bottom: 5px;">This is what you\'re building!</p>' +
        '<p style="font-size: 14px; opacity: 0.8;">Preview disappears in <span id="preview-countdown">3</span> seconds</p>';
    
    previewOverlay.appendChild(previewText);
    previewOverlay.appendChild(previewImg);
    document.body.appendChild(previewOverlay);
    
    // Countdown and fade out
    let seconds = 3;
    const countdown = setInterval(() => {
        seconds--;
        const countdownEl = document.getElementById('preview-countdown');
        if (countdownEl) countdownEl.textContent = seconds;
        
        if (seconds <= 0) {
            clearInterval(countdown);
            previewOverlay.style.transition = 'opacity 1s';
            previewOverlay.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(previewOverlay)) {
                    document.body.removeChild(previewOverlay);
                }
            }, 1000);
        }
    }, 1000);
}

function renderPiecesBank() {
    const bank = document.getElementById('pieces-bank');
    if (!bank) return;
    
    bank.innerHTML = '';
    
    // Show earned pieces that can be dragged
    state.unlockedPieces.forEach(pieceNum => {
        // Skip pieces that are already placed correctly
        if (state.placedPieces && state.placedPieces[pieceNum] === pieceNum) {
            return;
        }
        
        const piece = document.createElement('div');
        piece.className = 'draggable-piece';
        piece.draggable = true;
        piece.dataset.pieceId = pieceNum;
        
        if (puzzlePieces[pieceNum - 1]) {
            const img = document.createElement('img');
            img.src = puzzlePieces[pieceNum - 1];
            piece.appendChild(img);
            
            // Add piece number for easy identification
            const numberBadge = document.createElement('div');
            numberBadge.className = 'piece-number';
            numberBadge.textContent = pieceNum;
            piece.appendChild(numberBadge);
        }
        
        // Set up drag events inline
        piece.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', piece.dataset.pieceId);
            piece.classList.add('dragging');
        });
        
        piece.addEventListener('dragend', () => {
            piece.classList.remove('dragging');
        });
        
        bank.appendChild(piece);
    });
    
    if (state.unlockedPieces.length === 0) {
        bank.innerHTML = '<p class="empty-bank">Complete missions to earn puzzle pieces!</p>';
    }
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
        
        card.innerHTML = 
            '<div class="mission-icon">' + mission.icon + '</div>' +
            '<div class="mission-info">' +
                '<h4>' + mission.name + '</h4>' +
                '<p>' + mission.description + '</p>' +
            '</div>' +
            '<div class="mission-status">' +
                (isCompleted ? '✅' : isLocked ? '🔒' : '→') +
            '</div>';
        
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

function onMissionComplete(success, score = 0) {
    if (success && currentMission) {
        // Mark mission as complete
        if (!state.completedMissions.includes(currentMission.id)) {
            state.completedMissions.push(currentMission.id);
        }
        
        // Add points
        const points = Math.max(0, Math.min(100, Math.floor(score)));
        state.totalPoints = (state.totalPoints || 0) + points;
        state.missionScores = state.missionScores || {};
        state.missionScores[currentMission.id] = points;
        
        // Unlock corresponding piece
        const pieceNum = currentMission.id;
        if (!state.unlockedPieces.includes(pieceNum)) {
            state.unlockedPieces.push(pieceNum);
        }
        
        saveState(state);
        
        // Show completion screen
        showMissionComplete(pieceNum, points);
    } else {
        // Failed - return to hub
        showScreen('hub');
    }
}

function showMissionComplete(pieceNum, points = 0) {
    document.getElementById('piece-number').textContent = pieceNum;
    
    // Show the revealed piece
    const pieceContainer = document.getElementById('revealed-piece');
    if (puzzlePieces[pieceNum - 1]) {
        pieceContainer.innerHTML = '<img src="' + puzzlePieces[pieceNum - 1] + '" alt="Puzzle piece ' + pieceNum + '">';
    }
    
    // Show dad's message
    const message = CONFIG.messages[pieceNum - 1] || "Great job!";
    document.getElementById('dad-message-text').textContent = message;
    
    showScreen('complete');
    
    // Add points display after screen is shown
    setTimeout(() => {
        const completeContent = document.querySelector('.complete-content');
        const pieceReveal = completeContent.querySelector('.piece-reveal');
        
        // Check if points display already exists
        if (!pieceReveal.querySelector('.points-earned')) {
            const pointsDisplay = document.createElement('div');
            pointsDisplay.className = 'points-earned';
            pointsDisplay.innerHTML = '<p>⭐ Points Earned: ' + points + '/100</p>';
            pointsDisplay.style.textAlign = 'center';
            pointsDisplay.style.color = '#ffe66d';
            pointsDisplay.style.fontSize = '1.2rem';
            pointsDisplay.style.fontWeight = 'bold';
            pointsDisplay.style.marginTop = '15px';
            
            pieceReveal.appendChild(pointsDisplay);
        }
    }, 100);
}

function showFinalReveal() {
    // Show full image
    document.getElementById('final-image').src = 'asher_generated.png';
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
                document.getElementById('final-points').textContent = state.totalPoints || 0;
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
        piece.style.animationDuration = (Math.random() * 3 + 2) + 's';
        piece.style.animationDelay = Math.random() * 2 + 's';
        confettiContainer.appendChild(piece);
    }
}

function renderPrizes() {
    const prizesList = document.getElementById('prizes-list');
    if (!prizesList) return;
    
    prizesList.innerHTML = '';
    const totalPoints = state.totalPoints || 0;
    
    // Sort prizes by cost (cheapest first for better UX)
    const sortedPrizes = [...CONFIG.prizes].sort((a, b) => a.cost - b.cost);
    
    sortedPrizes.forEach(prize => {
        const item = document.createElement('div');
        item.className = 'prize-item';
        const canAfford = totalPoints >= prize.cost;
        const isSelected = state.selectedPrizes.includes(prize.id);
        
        if (isSelected) item.classList.add('selected');
        if (!canAfford) item.classList.add('unaffordable');
        
        item.innerHTML = 
            '<span class="prize-icon">' + prize.icon + '</span>' +
            '<div class="prize-info">' +
                '<span class="prize-name">' + prize.name + '</span>' +
                '<span class="prize-cost">' + prize.cost + ' points</span>' +
            '</div>' +
            '<span class="prize-check">' + (isSelected ? '✓' : canAfford ? '⭐' : '🔒') + '</span>';
        
        if (canAfford) {
            item.addEventListener('click', () => togglePrize(prize.id, prize.cost));
        }
        
        prizesList.appendChild(item);
    });
    
    updatePrizeCount();
}

function togglePrize(prizeId, prizeCost) {
    const index = state.selectedPrizes.indexOf(prizeId);
    const totalPoints = state.totalPoints || 0;
    
    if (index > -1) {
        // Deselect
        state.selectedPrizes.splice(index, 1);
    } else if (state.selectedPrizes.length < CONFIG.maxPrizePicks && totalPoints >= prizeCost) {
        // Check if we can afford it with current selection
        const currentCost = calculateSelectedCost();
        if (currentCost + prizeCost <= totalPoints) {
            state.selectedPrizes.push(prizeId);
        }
    }
    
    saveState(state);
    renderPrizes();
}

function calculateSelectedCost() {
    return state.selectedPrizes.reduce((total, prizeId) => {
        const prize = CONFIG.prizes.find(p => p.id === prizeId);
        return total + (prize ? prize.cost : 0);
    }, 0);
}

function updatePrizeCount() {
    const remaining = CONFIG.maxPrizePicks - state.selectedPrizes.length;
    const totalPoints = state.totalPoints || 0;
    const spentPoints = calculateSelectedCost();
    const remainingPoints = totalPoints - spentPoints;
    
    document.getElementById('picks-count').textContent = remaining;
    document.getElementById('points-remaining').textContent = remainingPoints;
    document.getElementById('btn-confirm-prizes').disabled = state.selectedPrizes.length === 0;
}

function confirmPrizes() {
    const selectedNames = CONFIG.prizes
        .filter(p => state.selectedPrizes.includes(p.id))
        .map(p => p.name)
        .join(', ');
    
    alert('🎉 Awesome choices, ' + CONFIG.childName + '!\n\nYou picked: ' + selectedNames + '\n\nDad will make it happen! Merry Christmas! 🎄');
}

// Dev helper: Reset game
function resetGame() {
    state = resetState();
    puzzlePieces = [];
    localStorage.removeItem('pictureMissionState');
    location.reload();
}

// Dev helper: Jump to final completion (for testing)
function testFinal() {
    // Mark all missions as completed
    state.completedMissions = CONFIG.missions.map(m => m.id);
    
    // Unlock all pieces
    state.unlockedPieces = Array.from({length: CONFIG.totalPieces}, (_, i) => i + 1);
    
    // Set reasonable points (assuming ~80 points per mission)
    state.totalPoints = CONFIG.missions.length * 80;
    
    // Generate puzzle pieces if needed
    if (puzzlePieces.length === 0) {
        generatePuzzlePieces();
    }
    
    // Save state and show final screen
    saveState(state);
    showScreen('final');
    showFinalReveal();
    
    console.log('🎮 Jumped to final completion state for testing!');
    console.log('- All missions completed:', state.completedMissions.length);
    console.log('- All pieces unlocked:', state.unlockedPieces.length);
    console.log('- Total points:', state.totalPoints);
}

// Dev helper: Test puzzle completion (all pieces earned, ready to place)
function testPuzzle() {
    // Mark all missions as completed
    state.completedMissions = CONFIG.missions.map(m => m.id);
    
    // Unlock all pieces
    state.unlockedPieces = Array.from({length: CONFIG.totalPieces}, (_, i) => i + 1);
    
    // Set reasonable points
    state.totalPoints = CONFIG.missions.length * 80;
    
    // Clear any existing puzzle placements (pieces go back to bank)
    state.placedPieces = {};
    
    // Save state first
    saveState(state);
    
    // Generate puzzle pieces if needed, then render
    if (puzzlePieces.length === 0) {
        // Generate pieces and wait for completion
        const img = new Image();
        img.onload = () => {
            const pieceSize = 600 / CONFIG.gridSize;
            puzzlePieces = [];
            
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
            
            // Now render everything with pieces ready
            showScreen('hub');
            renderPuzzleGrid();
            renderPiecesBank();
            renderMissions();
            
            console.log('🧩 Ready to test puzzle placement!');
            console.log('- All pieces are in the earned pieces bank');
            console.log('- Drag pieces to complete the puzzle');
            console.log('- Use preview button to see target image');
        };
        img.src = 'asher_generated.png';
    } else {
        // Pieces already generated, just render
        showScreen('hub');
        renderPuzzleGrid();
        renderPiecesBank();
        renderMissions();
        
        console.log('🧩 Ready to test puzzle placement!');
    }
}

// Make it available globally for console access too
window.resetGame = resetGame;
window.testFinal = testFinal;
window.testPuzzle = testPuzzle;

// Drag and Drop Functions for Interactive Puzzle
function setupDragPiece(piece) {
    piece.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', piece.dataset.pieceId);
        piece.classList.add('dragging');
    });
    
    piece.addEventListener('dragend', () => {
        piece.classList.remove('dragging');
    });
    
    // Touch support for mobile
    let touchStartPos = null;
    
    piece.addEventListener('touchstart', (e) => {
        e.preventDefault();
        touchStartPos = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
        piece.classList.add('dragging');
    });
    
    piece.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (!touchStartPos) return;
        
        const touch = e.touches[0];
        piece.style.position = 'fixed';
        piece.style.left = touch.clientX - 50 + 'px';
        piece.style.top = touch.clientY - 50 + 'px';
        piece.style.zIndex = '1000';
        piece.style.transform = 'scale(1.1)';
    });
    
    piece.addEventListener('touchend', (e) => {
        e.preventDefault();
        if (!touchStartPos) return;
        
        const touch = e.changedTouches[0];
        const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
        const slot = elementBelow?.closest('.puzzle-slot');
        
        if (slot && !slot.classList.contains('filled')) {
            const pieceId = parseInt(piece.dataset.pieceId);
            const slotId = parseInt(slot.dataset.slotId);
            placePiece(pieceId, slotId);
        }
        
        // Reset styles
        piece.style.position = '';
        piece.style.left = '';
        piece.style.top = '';
        piece.style.zIndex = '';
        piece.style.transform = '';
        piece.classList.remove('dragging');
        touchStartPos = null;
    });
}

function setupDropZone(slot) {
    slot.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (!slot.classList.contains('filled')) {
            slot.classList.add('drop-hover');
        }
    });
    
    slot.addEventListener('dragleave', () => {
        slot.classList.remove('drop-hover');
    });
    
    slot.addEventListener('drop', (e) => {
        e.preventDefault();
        slot.classList.remove('drop-hover');
        
        if (slot.classList.contains('filled')) return;
        
        const pieceId = parseInt(e.dataTransfer.getData('text/plain'));
        const slotId = parseInt(slot.dataset.slotId);
        
        placePiece(pieceId, slotId);
    });
}

function placePiece(pieceId, slotId) {
    // Initialize placedPieces if needed
    if (!state.placedPieces) state.placedPieces = {};
    
    // Check if it's the correct piece for this slot
    const isCorrect = pieceId === slotId;
    
    if (isCorrect) {
        // Correct placement!
        state.placedPieces[pieceId] = slotId;
        saveState(state);
        
        // Show success feedback
        showPlacementFeedback(true, 'Perfect! Piece ' + pieceId + ' fits perfectly! ✨');
        
        // Re-render to update the display
        setTimeout(() => {
            renderPuzzleGrid();
            renderPiecesBank();
        }, 1000);
    } else {
        // Wrong placement
        showPlacementFeedback(false, 'Hmm, piece ' + pieceId + ' doesn\'t belong in slot ' + slotId + '. Try another spot!');
    }
}

function showPlacementFeedback(success, message) {
    // Remove any existing feedback
    const existingFeedback = document.querySelector('.placement-feedback');
    if (existingFeedback) existingFeedback.remove();
    
    const feedback = document.createElement('div');
    feedback.className = 'placement-feedback';
    feedback.style.cssText = 
        'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); ' +
        'background: ' + (success ? '#51cf66' : '#ff6b6b') + '; color: white; padding: 20px; ' +
        'border-radius: 12px; font-size: 1.1rem; font-weight: bold; text-align: center; ' +
        'z-index: 2000; box-shadow: 0 10px 30px rgba(0,0,0,0.3); animation: fadeIn 0.3s ease; ' +
        'max-width: 300px;';
    feedback.innerHTML = 
        '<div style="font-size: 2rem; margin-bottom: 10px;">' +
        (success ? '🎉' : '🤔') +
        '</div><div>' + message + '</div>';
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => feedback.remove(), 300);
    }, success ? 2000 : 3000);
}

function checkPuzzleComplete() {
    if (!state.placedPieces) return;
    
    const correctPlacements = Object.keys(state.placedPieces).filter(
        pieceId => state.placedPieces[pieceId] === parseInt(pieceId)
    );
    
    if (correctPlacements.length === CONFIG.totalPieces) {
        setTimeout(() => {
            showScreen('final');
            showFinalReveal();
        }, 1500);
    }
}
