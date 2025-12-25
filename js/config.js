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
        "You started! That's my boy. I've been watching you grow from afar, and you never stop amazing me. Let's see what you've got! 💪",
        
        // Piece 2
        "Two down! You're getting warmed up now. Did you know you have the same determination I had at your age? Keep going, champ!",
        
        // Piece 3
        "Nice work! Every time I hear about what you're up to, it makes me smile. You're doing great!",
        
        // Piece 4
        "Almost halfway there! I want you to know - even when we're not together, I think about you every single day.",
        
        // Piece 5
        "HALFWAY! 🎉 You know what I love about you? You don't give up. I've seen that in you since you were tiny. That's special.",
        
        // Piece 6
        "You're crushing it! The picture is starting to take shape. Can you guess what it is yet?",
        
        // Piece 7
        "Three more to go! I'm so proud of the young man you're becoming. You've got skills!",
        
        // Piece 8
        "Almost there... Just one more mission after this. You've earned every single piece.",
        
        // Piece 9 (Final)
        "YOU DID IT! This picture is us - a reminder that distance doesn't change what we are. I love you more than any game could ever show. Merry Christmas, Asher! 🎄"
    ],
    
    // Final message shown after all pieces revealed
    finalMessage: "Asher, completing this mission proves what I already knew - you're amazing. I may not be there every day, but you're in my heart always. This Christmas and every day, know that your Dad loves you and is cheering for you. Now go claim your prizes! 🎁",
    
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
    
    // Prize list (optional - customize with Asher's wish list)
    prizes: [
        { id: 1, name: "Nintendo Game", icon: "🎮" },
        { id: 2, name: "LEGO Set", icon: "🧱" },
        { id: 3, name: "Action Figure", icon: "🦸" },
        { id: 4, name: "Art Supplies", icon: "🎨" },
        { id: 5, name: "Book", icon: "📚" },
        { id: 6, name: "Sports Equipment", icon: "⚽" }
    ],
    
    // How many prizes can be picked
    maxPrizePicks: 3,
    
    // Enable prize vault feature
    enablePrizes: true
};

// Game state (persisted to localStorage)
const defaultState = {
    photoData: null,
    completedMissions: [],
    unlockedPieces: [],
    selectedPrizes: [],
    gameStarted: false,
    setupComplete: false
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
