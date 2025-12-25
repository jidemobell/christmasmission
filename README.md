# 🎄 Christmas Mission for Asher

A special picture puzzle game created with love from Dad.

## How It Works

1. **Upload a Photo**: Dad uploads a meaningful photo (you and Asher, or just Asher)
2. **Complete Missions**: Asher plays 9 different mini-games to unlock puzzle pieces
3. **Reveal the Picture**: Each mission completed reveals one piece of the puzzle
4. **Personal Messages**: Each unlock includes a heartfelt message from Dad
5. **Prize Vault** (optional): Unlock prizes from Asher's wish list

## Games Included

- 🎯 **Target Practice** - Tap targets as they appear
- 🧠 **Memory Master** - Remember and repeat color sequences
- ⚡ **Quick Reflexes** - Tap when the light turns green
- 🧩 **Puzzle Slider** - Arrange numbers in order
- 👆 **Speed Tapper** - Tap targets quickly
- 🔢 **Math Blitz** - Solve math problems fast
- 🎨 **Shape Tracer** - Draw shapes accurately
- 🏃 **Dodge Master** - Avoid falling obstacles
- 🏆 **Final Challenge** - Ultimate target challenge

## Running the Game

### Simple Local Testing
1. Open `index.html` in a web browser
2. Use the setup screen to upload a photo
3. Play through the missions!

### For Mobile (PWA)
1. Serve the files from a local server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Or using Node.js (if you have it)
   npx serve .
   ```
2. Open `http://localhost:8000` on your phone
3. Add to home screen for app-like experience

## Customization

### Messages for Asher
Edit the messages in `js/config.js`:
```javascript
messages: [
    "Your custom message for piece 1...",
    "Your custom message for piece 2...",
    // ... etc
]
```

### Prize List
Update the prizes in `js/config.js`:
```javascript
prizes: [
    { id: 1, name: "Nintendo Game", icon: "🎮" },
    { id: 2, name: "LEGO Set", icon: "🧱" },
    // ... add Asher's actual wish list items
]
```

## Development Notes

- Built with vanilla JavaScript for simplicity and speed
- PWA-ready (installable on mobile devices)
- No build process required
- Touch and mouse friendly
- All games are "AI-proof" (require real-time interaction)

## Sending to Asher

1. Host the files on any web server (GitHub Pages, Netlify, etc.)
2. Send Asher the link
3. He can add it to his home screen for the full app experience

---

**Made with ❤️ for Christmas 2025**