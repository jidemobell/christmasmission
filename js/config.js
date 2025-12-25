// Configuration for Asher's Christmas Mission

const CONFIG = {
    childName: "Asher",
    parentName: "Dad",
    title: "A Christmas Mission from Dad",
    
    // Number of puzzle pieces (3x3 grid)
    gridSize: 3,
    totalPieces: 9,
    
    // Messages for each piece unlock (customize these!)
    messages: [
        // Piece 1
        "You started! That's my boy. This first piece shows the top of something special... Let's see what you've got! 💪",
        
        // Piece 2
        "Two down! You're getting warmed up now. I can see part of a festive background taking shape. Keep going, champ!",
        
        // Piece 3
        "Nice work! The top row is coming together - I think I can see some Christmas magic happening!",
        
        // Piece 4
        "Almost halfway there! The left side is looking great. I want you to know - even when we're not together, I think about you every single day.",
        
        // Piece 5
        "HALFWAY! 🎉 The center piece - and there's your amazing smile starting to show! You know what I love about you? You don't give up.",
        
        // Piece 6
        "You're crushing it! The right side is filling in. Can you see your face coming together? You're looking so grown up!",
        
        // Piece 7
        "Three more to go! The bottom left is revealing more Christmas spirit. I'm so proud of the young man you're becoming.",
        
        // Piece 8
        "Almost there... Just one more piece! Your whole face is almost visible now - still that same wonderful kid I love.",
        
        // Piece 9 (Final)
        "YOU DID IT! There you are in all your Christmas glory! This AI made you look extra festive. I love you more than any game could ever show. Merry Christmas, Asher! 🎄"
    ],
    
    // Final message shown after all pieces revealed
    finalMessage: "Asher, completing this mission proves what I already knew - you're amazing. This Christmas and every day, know that your Dad loves you and is cheering for you. Now go claim your prizes! 🎁",
    
    // Mission definitions
    missions: [
        {
            id: 1,
            name: "Target Practice",
            description: "Tap 10 targets as fast as you can!",
            icon: "🎯",
            game: "tap-targets"
        },
        {
            id: 2,
            name: "Memory Master",
            description: "Remember and repeat the color sequence",
            icon: "🧠",
            game: "memory-sequence"
        },
        {
            id: 3,
            name: "Quick Reflexes",
            description: "Tap when the light turns green!",
            icon: "⚡",
            game: "reaction-game"
        },
        {
            id: 4,
            name: "Puzzle Slider",
            description: "Arrange the numbers in order",
            icon: "🧩",
            game: "sliding-puzzle"
        },
        {
            id: 5,
            name: "Speed Tapper",
            description: "Tap 20 targets in 15 seconds!",
            icon: "👆",
            game: "speed-tap"
        },
        {
            id: 6,
            name: "Math Blitz",
            description: "Solve 8 math problems super fast!",
            icon: "🔢",
            game: "quick-math"
        },
        {
            id: 7,
            name: "Shape Tracer",
            description: "Draw the shape as accurately as you can",
            icon: "🎨",
            game: "trace-shape"
        },
        {
            id: 8,
            name: "Dodge Master",
            description: "Avoid the falling blocks for 15 seconds!",
            icon: "🏃",
            game: "dodge-game"
        },
        {
            id: 9,
            name: "Final Challenge",
            description: "The ultimate target challenge!",
            icon: "🏆",
            game: "tap-targets-hard"
        }
    ],
    
    // Prize list - Asher's actual wish list with point costs
    prizes: [
        { id: 1, name: "Electric Scooter", icon: "🛴", cost: 700 }, // Need almost perfect scores
        { id: 2, name: "Bike", icon: "🚴", cost: 650 }, // Need very high scores  
        { id: 3, name: "Thames & Kosmos Gumball Machine Maker", icon: "🍬", cost: 400 },
        { id: 4, name: "Shape Shifting Shashibo Box", icon: "📦", cost: 300 },
        { id: 5, name: "Circuits", icon: "⚡", cost: 350 },
        { id: 6, name: "Magic 8 Ball", icon: "🎱", cost: 250 },
        { id: 7, name: "Uno Show Em No Mercy", icon: "🃏", cost: 150 }
    ],
    
    // How many prizes can be picked
    maxPrizePicks: 2,
    
    // Enable prize vault feature
    enablePrizes: true
};

// Game state (persisted to localStorage)
const defaultState = {
    photoData: null,
    completedMissions: [],
    unlockedPieces: [],
    selectedPrizes: [],
    placedPieces: {}, // Track which pieces are correctly placed
    gameStarted: false,
    setupComplete: false,
    totalPoints: 0,
    missionScores: {} // Store individual mission scores
};

function loadState() {
    try {
        const saved = localStorage.getItem('pictureMissionState');
        return saved ? { ...defaultState, ...JSON.parse(saved) } : { ...defaultState };
    } catch (e) {
        return { ...defaultState };
    }
}

function saveState(state) {
    try {
        localStorage.setItem('pictureMissionState', JSON.stringify(state));
    } catch (e) {
        console.warn('Could not save state:', e);
    }
}

function resetState() {
    localStorage.removeItem('pictureMissionState');
    return { ...defaultState };
}
