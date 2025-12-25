# Picture Mission - Product Ideation Document

**Created:** December 25, 2025  
**Status:** Concept Development  

---

## 🎯 Core Concept

A gamified puzzle experience where a user uploads a meaningful photo (e.g., parent-child photo), which gets split into puzzle pieces. Each piece is locked behind a mini-mission/game. Completing missions reveals pieces one by one until the full picture is revealed.

**Tagline Ideas:**
- "Unlock the Picture. Complete the Mission."
- "Every Piece Has a Purpose"

---

## 👥 Target Audiences

### Primary Segments:

| Segment | Scenario | Key Need |
|---------|----------|----------|
| **Separated/Divorced Parents** | Parent wants to connect with child remotely | Meaningful engagement without requiring co-parent cooperation |
| **Long-Distance Grandparents** | Grandparents far from grandchildren | Fun way to bond across distance |
| **Co-Parenting Families** | Collaborative parenting situations | Interactive activities to do together remotely |
| **Gift Givers** | Birthdays, holidays, special occasions | Unique personalized digital gift |

---

## 🎮 Product Modes

### Mode 1: "Together Mode"
**Scenario:** Co-parenting friendly, grandparents, collaborative situations

**Features:**
- Real-time missions requiring interaction ("Call me", "Video chat", "Send me a voice message")
- Parent can see progress live
- Two-way engagement

**Mission Examples:**
- "Call Dad and tell him your favorite animal"
- "Send Grandma a drawing"
- "Show me your room on video"

---

### Mode 2: "Solo Quest Mode"
**Scenario:** Boundary situations, async gifting, no real-time contact needed

**Features:**
- Self-contained mini-games (no external interaction required)
- Pre-loaded personalized messages from parent
- Child completes independently
- Parent can check completion later (optional)

**Mission Examples:**
- Tap-the-target games
- Memory sequences
- Reaction time challenges
- Speed puzzles

---

## 🧩 Mission Types (AI-Proof Design)

Key insight: Traditional trivia/math can be cheated with AI. Missions must require real-time interaction, physical skill, or time pressure.

| Type | Description | Why AI-Proof |
|------|-------------|--------------|
| ⚡ **Reflex/Reaction** | Tap targets as they appear | Requires real-time clicking |
| 🧠 **Memory Sequence** | Simon Says - remember & repeat patterns | Time pressure, sequential |
| 🎯 **Precision** | Guide ball through maze, trace shapes | Motor skill required |
| 👀 **Spot the Difference** | Find differences in images (timed) | Visual scanning |
| 🏃 **Rhythm/Timing** | Tap when object hits target zone | Real-time coordination |
| 🎨 **Drawing** | Draw shapes, scored on accuracy | Motor skill |
| 🔢 **Speed Math** | 10 questions in 30 seconds | Too fast for AI lookup |
| 🧩 **Sliding Puzzle** | Classic tile puzzle | Manual solving |
| 🔍 **Hidden Object** | Find items in a scene | Visual search |
| 🎮 **Dodge Game** | Avoid falling objects | Continuous attention |

---

## 💝 Emotional Layer

### Message System
Each puzzle piece unlock triggers a personal message from the parent.

**Tone Guidelines for Separated Parent Situations:**

| Instead of... | Use... |
|---------------|--------|
| "Remember when we..." (forced nostalgia) | "I've always..." (continuous truth) |
| Heavy/sad | Proud/celebratory |
| Making up for lost time | Building what's here now |
| Guilt-based | Simple, stated love |

### Sample Message Flow (9 pieces):

**Piece 1:**
> "You started! That's my boy. I've been watching you grow from afar, and you never stop amazing me. Let's see what you've got. 💪"

**Piece 5 (midway):**
> "Halfway there! You know what I love about you? You don't give up. I've seen that in you since you were tiny. Keep going."

**Piece 8:**
> "Almost there... I want you to know - even when we're not together, I think about you every single day. That's not just words. It's true."

**Final Piece:**
> "You did it. This picture is us. Distance doesn't change what we are. I love you more than any game could ever show. Merry Christmas, champ. 🎄"

---

## 🎁 Prize/Wish List Integration

### Option A: "Earn Your Picks"
- Complete ALL missions → Unlock right to CHOOSE X items from wish list
- Builds to climax, gives child agency

### Option B: "Mission = Prize Tier"
- Easy missions (1-3) → Small item
- Medium missions (4-6) → Medium item
- Hard missions (7-9) → Big item

### Option C: "Mystery Unlock"
- Each mission → Spin wheel / open mystery box
- Reveals one item from list they've won
- Surprise element

### Option D: "Points Shop"
- Missions earn coins/points
- After completion, "shop" opens
- Items have point costs
- Child "buys" what they can afford

### Recommended: Hybrid Approach
1. Missions unlock puzzle pieces + messages (emotional)
2. Completing ALL missions unlocks "Prize Vault"
3. Prize Vault shows wish list → Child picks X items
4. Parent controls how many picks are available

---

## 📱 Technical Approach

### Platform: Progressive Web App (PWA)

**Why PWA:**
- Works on all devices (iOS, Android, Desktop)
- No App Store approval needed
- Installable via "Add to Home Screen"
- Send as a simple link
- Feels like native app when installed

**User Flow:**
```
1. Parent creates experience (uploads photo, writes messages)
2. Parent gets shareable link
3. Child opens link on phone/tablet
4. Prompt: "Add to Home Screen" (optional)
5. Child plays through missions
6. Picture reveals piece by piece
7. Final reveal + prize vault (if configured)
```

### Tech Stack (Suggested):
- **Frontend:** React or Vue.js
- **Styling:** Tailwind CSS
- **Games:** HTML5 Canvas or Phaser.js
- **Backend:** Node.js or serverless functions
- **Storage:** Firebase or Supabase
- **Image Processing:** Client-side canvas manipulation

---

## 🎄 MVP: Asher's Christmas Mission

**For:** Asher (age 8, almost 9)  
**From:** Dad  
**Occasion:** Christmas 2025

### Scope:
- 9 puzzle pieces (3x3 grid)
- 5-6 varied mini-games
- Personal messages for each unlock
- Final reveal with special message
- Prize vault integration (optional)

### Mission Lineup:
1. 🎯 Tap the Targets (warmup, easy win)
2. 🧠 Memory Sequence (Simon Says - 4 rounds)
3. 🏃 Reaction Game (tap when light turns green)
4. 🧩 Mini Sliding Puzzle (3x3)
5. 👀 Spot the Difference (find 3 things)
6. ⚡ Speed Tap (tap 20 targets in 15 sec)
7. 🎨 Trace the Shape (draw a star)
8. 🔢 Quick Math (10 problems, 3 sec each)
9. 🎮 Final Boss: Dodge falling objects 20 seconds

---

## 💰 Commercial Potential

### Revenue Models:

| Model | Description |
|-------|-------------|
| **Freemium** | Free basic (4 pieces), paid full experience |
| **One-time Purchase** | $4.99-9.99 per experience created |
| **Subscription** | $9.99/month unlimited experiences |
| **Credits** | Buy packs of "missions" to add |

### Market Differentiators:
1. **Personalization** - Uses YOUR photos, not stock content
2. **Emotional Design** - Built for real family situations
3. **Boundary-Aware** - Solo Quest mode respects complex family dynamics
4. **Gamification Done Right** - Real games, not just quizzes
5. **Prize Integration** - Connects to real-world rewards

### Comparable Products:
- Osmo (physical + digital play)
- Wonderbly (personalized books)
- Custom puzzle sites (just puzzles, no gamification)
- None combine: personalization + missions + emotional messaging

---

## 📋 Next Steps

### Immediate (MVP for Asher):
- [ ] Scaffold project structure
- [ ] Build core game engine
- [ ] Implement 5-6 mini-games
- [ ] Create puzzle reveal system
- [ ] Add message display layer
- [ ] Photo upload + slicing
- [ ] PWA configuration
- [ ] Test on mobile

### Future (Commercial Product):
- [ ] User accounts / authentication
- [ ] Experience builder for parents
- [ ] Multiple theme options
- [ ] More mission types
- [ ] Analytics dashboard
- [ ] Social sharing
- [ ] Print-on-demand final puzzle option

---

## 🗒️ Notes

- Age range sweet spot: 6-12 years old
- Mission difficulty should scale with age setting
- Consider accessibility (colorblind modes, etc.)
- Parent preview mode before sending
- Expiration dates for seasonal content (Christmas themes)

---

*Document will be updated as development progresses.*
