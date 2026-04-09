

# 🚀 Let's Add More Features! 

Let me add Phase 5 (Polish + Parent Controls) and then jump into the Numbers Module since Prisha already knows counting to 10.

---

## Phase 5: Polish + Parent Controls

### What We're Adding:
```
┌─────────────────────────────────┐
│  ✨ POLISH & PARENT FEATURES    │
│                                 │
│  1. 🔒 Parent Lock Screen       │
│     - Simple math lock          │
│     - Reset progress            │
│     - Screen time settings      │
│     - Volume control            │
│                                 │
│  2. ⏱️ Screen Time Timer        │
│     - Configurable limit        │
│     - Gentle reminder           │
│     - "Time's up!" screen       │
│                                 │
│  3. 🏆 Sticker Collection       │
│     - Dinosaur stickers earned  │
│     - Visual reward gallery     │
│                                 │
│  4. 🎨 UI Improvements          │
│     - Loading screen            │
│     - Better transitions        │
│     - Sound effects             │
└─────────────────────────────────┘
```

---

## 📄 Updated `index.html` (Full — with Parent Lock + Stickers + Timer)

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="theme-color" content="#6C5CE7">
    <link rel="manifest" href="manifest.json">
    <link rel="apple-touch-icon" href="images/icon-192.png">
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🦕</text></svg>">
    <title>Prisha's Learning World 🦕</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/home.css">
</head>
<body>
    <div id="app">
        <!-- Loading Screen -->
        <div id="loading-screen" class="loading-screen">
            <div class="loading-dino">🦕</div>
            <div class="loading-text">Loading...</div>
            <div class="loading-bar">
                <div class="loading-fill"></div>
            </div>
        </div>

        <!-- Home Screen -->
        <div id="home-screen" class="screen">
            <div class="stars-bg"></div>

            <!-- Screen Time Banner -->
            <div class="timer-banner" id="timer-banner">
                <span class="timer-icon">⏱️</span>
                <span class="timer-text" id="timer-text">20:00</span>
            </div>

            <div class="welcome-section">
                <div class="mascot-container">
                    <div class="dino-mascot" id="dino">🦕</div>
                </div>
                <h1 class="app-title">
                    <span class="letter-pop" style="--delay: 0.1s; color: #FF6B6B;">P</span>
                    <span class="letter-pop" style="--delay: 0.2s; color: #FFA502;">r</span>
                    <span class="letter-pop" style="--delay: 0.3s; color: #FFD93D;">i</span>
                    <span class="letter-pop" style="--delay: 0.4s; color: #6BCB77;">s</span>
                    <span class="letter-pop" style="--delay: 0.5s; color: #4D96FF;">h</span>
                    <span class="letter-pop" style="--delay: 0.6s; color: #9B59B6;">a</span>
                    <span class="letter-pop" style="--delay: 0.7s; color: #FF6B6B;">'</span>
                    <span class="letter-pop" style="--delay: 0.8s; color: #FFA502;">s</span>
                </h1>
                <h2 class="subtitle">Learning World 🌍</h2>
                <p class="greeting" id="greeting">Hi Prisha! Ready to learn?</p>
            </div>

            <div class="modules-grid">
                <div class="module-card active-module" onclick="navigateTo('phonics.html')">
                    <div class="module-icon">🔤</div>
                    <div class="module-name">Phonics</div>
                    <div class="module-stars" id="phonics-stars">⭐ 0</div>
                </div>

                <div class="module-card active-module" onclick="navigateTo('numbers.html')">
                    <div class="module-icon">🔢</div>
                    <div class="module-name">Numbers</div>
                    <div class="module-stars" id="numbers-stars">⭐ 0</div>
                </div>

                <div class="module-card locked-module">
                    <div class="module-icon">📖</div>
                    <div class="module-name">Words</div>
                    <div class="module-badge">Coming Soon!</div>
                </div>

                <div class="module-card locked-module">
                    <div class="module-icon">🎮</div>
                    <div class="module-name">Games</div>
                    <div class="module-badge">Coming Soon!</div>
                </div>
            </div>

            <!-- Sticker Collection Preview -->
            <div class="sticker-preview" onclick="showStickers()">
                <span class="sticker-preview-label">🦕 My Stickers:</span>
                <span class="sticker-preview-count" id="sticker-count">0</span>
                <span class="sticker-preview-arrow">→</span>
            </div>

            <div class="total-stars-bar">
                <span>🌟 Total Stars: <strong id="total-stars">0</strong></span>
            </div>

            <!-- Parent Lock Button -->
            <button class="parent-btn" onclick="showParentLock()">
                🔒 Parent
            </button>
        </div>

        <!-- Sticker Collection Screen -->
        <div id="sticker-screen" class="screen">
            <div class="stars-bg"></div>
            <button class="back-button" onclick="hideStickers()">🏠</button>

            <div class="sticker-header">
                <h1 class="sticker-title">🦕 My Sticker Collection!</h1>
                <p class="sticker-subtitle" id="sticker-subtitle">You have 0 stickers!</p>
            </div>

            <div class="sticker-grid" id="sticker-grid">
                <!-- Generated dynamically -->
            </div>
        </div>

        <!-- Parent Control Panel -->
        <div id="parent-overlay" class="parent-overlay" style="display:none;">
            <div class="parent-panel">
                <div class="parent-header">
                    <h2>🔒 Parent Controls</h2>
                    <button class="parent-close-btn" onclick="hideParentPanel()">✕</button>
                </div>

                <div class="parent-lock-screen" id="parent-lock-screen">
                    <p class="lock-question" id="lock-question">What is 7 + 5?</p>
                    <input type="number" class="lock-input" id="lock-input" placeholder="Answer">
                    <button class="lock-submit-btn" onclick="checkParentLock()">Unlock</button>
                    <p class="lock-error" id="lock-error"></p>
                </div>

                <div class="parent-controls" id="parent-controls" style="display:none;">
                    <!-- Screen Time -->
                    <div class="control-section">
                        <h3>⏱️ Screen Time</h3>
                        <div class="control-row">
                            <label>Session Limit:</label>
                            <select id="time-limit" onchange="saveParentSettings()">
                                <option value="10">10 minutes</option>
                                <option value="15">15 minutes</option>
                                <option value="20" selected>20 minutes</option>
                                <option value="30">30 minutes</option>
                                <option value="0">No limit</option>
                            </select>
                        </div>
                        <div class="control-row">
                            <label>Time used today:</label>
                            <span id="time-used-today">0 minutes</span>
                        </div>
                    </div>

                    <!-- Volume -->
                    <div class="control-section">
                        <h3>🔊 Volume</h3>
                        <div class="control-row">
                            <input type="range" id="volume-slider" min="0" max="100" value="100" oninput="changeVolume(this.value)">
                            <span id="volume-display">100%</span>
                        </div>
                    </div>

                    <!-- Progress -->
                    <div class="control-section">
                        <h3>📊 Progress</h3>
                        <div class="control-row">
                            <label>Phonics Stars:</label>
                            <span id="parent-phonics-stars">0</span>
                        </div>
                        <div class="control-row">
                            <label>Numbers Stars:</label>
                            <span id="parent-numbers-stars">0</span>
                        </div>
                        <div class="control-row">
                            <label>Letters Explored:</label>
                            <span id="parent-letters-explored">0 / 26</span>
                        </div>
                        <div class="control-row">
                            <label>Total Stickers:</label>
                            <span id="parent-stickers">0</span>
                        </div>
                    </div>

                    <!-- Reset -->
                    <div class="control-section">
                        <h3>🔄 Reset</h3>
                        <button class="reset-btn" onclick="confirmReset()">
                            Reset All Progress
                        </button>
                        <p class="reset-warning">This cannot be undone!</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Time's Up Screen -->
        <div id="times-up-screen" class="screen" style="display:none;">
            <div class="times-up-content">
                <div class="times-up-dino">🦕😴</div>
                <h1 class="times-up-title">Time for a Break!</h1>
                <p class="times-up-text">
                    Great learning today, Prisha!<br>
                    Dino needs a nap. Come back later!
                </p>
                <div class="times-up-stars">
                    🌟 You earned <strong id="times-up-stars-count">0</strong> stars today!
                </div>
                <button class="parent-btn" onclick="showParentLock()" style="margin-top:20px;">
                    🔒 Parent Override
                </button>
            </div>
        </div>
    </div>

    <script src="js/app.js"></script>
    <script src="js/speech.js"></script>
    <script src="js/home.js"></script>
    <script>
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js')
                .then(function() { console.log('SW registered'); })
                .catch(function(err) { console.log('SW failed:', err); });
        }
    </script>
</body>
</html>
```

---

## 📄 `css/home.css`

```css
/* ========================================
   Home Screen + Parent Controls + Timer
   ======================================== */

/* --- Loading Screen --- */
.loading-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #667eea, #764ba2);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    transition: opacity 0.5s ease;
}

.loading-screen.hidden {
    opacity: 0;
    pointer-events: none;
}

.loading-dino {
    font-size: 80px;
    animation: dinoWiggle 1s ease-in-out infinite;
}

.loading-text {
    color: white;
    font-size: 20px;
    margin: 15px 0;
}

.loading-bar {
    width: 200px;
    height: 6px;
    background: rgba(255,255,255,0.3);
    border-radius: 3px;
    overflow: hidden;
}

.loading-fill {
    height: 100%;
    background: #FFD93D;
    border-radius: 3px;
    animation: loadingProgress 1.5s ease forwards;
}

@keyframes loadingProgress {
    0% { width: 0%; }
    100% { width: 100%; }
}

/* --- Timer Banner --- */
.timer-banner {
    position: fixed;
    top: 15px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(255,255,255,0.9);
    padding: 6px 18px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: bold;
    color: #2d3436;
    box-shadow: 0 3px 10px rgba(0,0,0,0.1);
    z-index: 100;
    display: none;
}

.timer-banner.visible {
    display: flex;
    align-items: center;
    gap: 6px;
}

.timer-banner.warning {
    background: #FFD93D;
    animation: timerPulse 1s ease-in-out infinite;
}

.timer-banner.danger {
    background: #FF6B6B;
    color: white;
    animation: timerPulse 0.5s ease-in-out infinite;
}

@keyframes timerPulse {
    0%, 100% { transform: translateX(-50%) scale(1); }
    50% { transform: translateX(-50%) scale(1.05); }
}

/* --- Sticker Preview --- */
.sticker-preview {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255,255,255,0.2);
    padding: 10px 20px;
    border-radius: 20px;
    backdrop-filter: blur(5px);
    cursor: pointer;
    margin-top: 15px;
    z-index: 1;
    transition: background 0.2s;
}

.sticker-preview:active {
    background: rgba(255,255,255,0.3);
}

.sticker-preview-label {
    color: white;
    font-size: 16px;
}

.sticker-preview-count {
    color: #FFD93D;
    font-size: 20px;
    font-weight: bold;
}

.sticker-preview-arrow {
    color: rgba(255,255,255,0.6);
    font-size: 18px;
    margin-left: auto;
}

/* --- Sticker Collection Screen --- */
.sticker-header {
    text-align: center;
    margin-top: 60px;
    margin-bottom: 20px;
    z-index: 1;
}

.sticker-title {
    font-size: 28px;
    color: white;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.sticker-subtitle {
    font-size: 16px;
    color: rgba(255,255,255,0.8);
    margin-top: 5px;
}

.sticker-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;
    max-width: 400px;
    width: 100%;
    z-index: 1;
    padding: 0 10px;
}

.sticker-item {
    width: 100%;
    aspect-ratio: 1;
    background: rgba(255,255,255,0.15);
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 35px;
    backdrop-filter: blur(5px);
    transition: transform 0.2s;
}

.sticker-item.earned {
    background: rgba(255,255,255,0.3);
    animation: stickerPop 0.3s ease;
}

.sticker-item.locked {
    opacity: 0.3;
    font-size: 20px;
}

@keyframes stickerPop {
    0% { transform: scale(0); }
    60% { transform: scale(1.2); }
    100% { transform: scale(1); }
}

/* --- Parent Button --- */
.parent-btn {
    position: fixed;
    bottom: 15px;
    right: 15px;
    background: rgba(255,255,255,0.2);
    border: 1px solid rgba(255,255,255,0.3);
    color: rgba(255,255,255,0.7);
    padding: 8px 15px;
    border-radius: 20px;
    font-size: 12px;
    cursor: pointer;
    z-index: 100;
    backdrop-filter: blur(5px);
}

/* --- Parent Overlay --- */
.parent-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.7);
    z-index: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.3s ease;
}

.parent-panel {
    background: white;
    border-radius: 25px;
    padding: 25px;
    max-width: 380px;
    width: 90%;
    max-height: 85vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

.parent-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
}

.parent-header h2 {
    font-size: 20px;
    color: #2d3436;
}

.parent-close-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: none;
    background: #f1f2f6;
    font-size: 18px;
    cursor: pointer;
    color: #636e72;
}

/* --- Lock Screen --- */
.lock-question {
    font-size: 22px;
    font-weight: bold;
    color: #2d3436;
    text-align: center;
    margin-bottom: 15px;
}

.lock-input {
    width: 100%;
    padding: 12px;
    font-size: 24px;
    text-align: center;
    border: 3px solid #dfe6e9;
    border-radius: 15px;
    outline: none;
    margin-bottom: 10px;
}

.lock-input:focus {
    border-color: #6C5CE7;
}

.lock-submit-btn {
    width: 100%;
    padding: 12px;
    border: none;
    border-radius: 15px;
    background: linear-gradient(135deg, #6C5CE7, #a29bfe);
    color: white;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
}

.lock-error {
    color: #FF6B6B;
    font-size: 14px;
    text-align: center;
    margin-top: 8px;
    min-height: 20px;
}

/* --- Control Sections --- */
.control-section {
    border-top: 1px solid #f1f2f6;
    padding-top: 15px;
    margin-top: 15px;
}

.control-section h3 {
    font-size: 16px;
    color: #2d3436;
    margin-bottom: 10px;
}

.control-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 14px;
    color: #636e72;
}

.control-row select {
    padding: 6px 10px;
    border: 2px solid #dfe6e9;
    border-radius: 10px;
    font-size: 14px;
    outline: none;
}

.control-row input[type="range"] {
    flex: 1;
    margin-right: 10px;
}

.reset-btn {
    width: 100%;
    padding: 10px;
    border: 2px solid #FF6B6B;
    background: white;
    color: #FF6B6B;
    border-radius: 12px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;
}

.reset-btn:active {
    background: #FF6B6B;
    color: white;
}

.reset-warning {
    font-size: 12px;
    color: #b2bec3;
    text-align: center;
    margin-top: 5px;
}

/* --- Time's Up Screen --- */
.times-up-content {
    text-align: center;
    padding: 40px 20px;
    z-index: 1;
}

.times-up-dino {
    font-size: 80px;
    margin-bottom: 15px;
}

.times-up-title {
    font-size: 32px;
    color: white;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    margin-bottom: 15px;
}

.times-up-text {
    font-size: 18px;
    color: rgba(255,255,255,0.9);
    line-height: 1.6;
    margin-bottom: 20px;
}

.times-up-stars {
    font-size: 18px;
    color: white;
    background: rgba(255,255,255,0.2);
    padding: 12px 25px;
    border-radius: 20px;
    display: inline-block;
}

/* --- Numbers Stars on Home --- */
#numbers-stars {
    font-size: 14px;
    color: #f39c12;
    margin-top: 5px;
}
```

---

## 📄 `js/home.js`

```javascript
/* ========================================
   Home Screen Logic
   Parent Controls, Timer, Stickers
   ======================================== */

// --- Sticker Collection ---
var STICKER_COLLECTION = [
    { emoji: '🦕', name: 'Dino', cost: 0 },
    { emoji: '🦖', name: 'T-Rex', cost: 5 },
    { emoji: '🐣', name: 'Baby Dino', cost: 10 },
    { emoji: '🌋', name: 'Volcano', cost: 15 },
    { emoji: '🥚', name: 'Dino Egg', cost: 20 },
    { emoji: '🌿', name: 'Fern', cost: 25 },
    { emoji: '🦋', name: 'Butterfly', cost: 30 },
    { emoji: '🌈', name: 'Rainbow', cost: 35 },
    { emoji: '⭐', name: 'Star', cost: 40 },
    { emoji: '🌙', name: 'Moon', cost: 45 },
    { emoji: '🐱', name: 'Cat', cost: 50 },
    { emoji: '🐶', name: 'Dog', cost: 55 },
    { emoji: '🦁', name: 'Lion', cost: 60 },
    { emoji: '🐘', name: 'Elephant', cost: 65 },
    { emoji: '🐧', name: 'Penguin', cost: 70 },
    { emoji: '🐢', name: 'Turtle', cost: 75 },
    { emoji: '🐋', name: 'Whale', cost: 80 },
    { emoji: '🦄', name: 'Unicorn', cost: 90 },
    { emoji: '👑', name: 'Crown', cost: 100 },
    { emoji: '🏆', name: 'Trophy', cost: 120 }
];

// --- Sticker Functions ---
function getStickerCount() {
    var totalStars = Rewards.getTotalStars();
    var count = 0;
    for (var i = 0; i < STICKER_COLLECTION.length; i++) {
        if (totalStars >= STICKER_COLLECTION[i].cost) {
            count++;
        }
    }
    return count;
}

function updateStickerPreview() {
    var el = document.getElementById('sticker-count');
    if (el) {
        el.textContent = getStickerCount();
    }
}

function showStickers() {
    document.getElementById('home-screen').classList.remove('active');
    document.getElementById('sticker-screen').classList.add('active');
    renderStickerGrid();
}

function hideStickers() {
    document.getElementById('sticker-screen').classList.remove('active');
    document.getElementById('home-screen').classList.add('active');
}

function renderStickerGrid() {
    var grid = document.getElementById('sticker-grid');
    var totalStars = Rewards.getTotalStars();
    grid.innerHTML = '';

    var earned = 0;
    for (var i = 0; i < STICKER_COLLECTION.length; i++) {
        var sticker = STICKER_COLLECTION[i];
        var isEarned = totalStars >= sticker.cost;
        if (isEarned) earned++;

        var item = document.createElement('div');
        item.className = 'sticker-item ' + (isEarned ? 'earned' : 'locked');

        if (isEarned) {
            item.textContent = sticker.emoji;
            item.title = sticker.name;
        } else {
            item.textContent = '🔒';
            item.title = sticker.name + ' (Need ' + sticker.cost + ' stars)';
        }

        grid.appendChild(item);
    }

    var subtitle = document.getElementById('sticker-subtitle');
    if (subtitle) {
        subtitle.textContent = 'You have ' + earned + ' of ' + STICKER_COLLECTION.length + ' stickers! Keep earning stars!';
    }
}

// --- Screen Time Timer ---
var timerState = {
    sessionStart: null,
    timerInterval: null,
    limitMinutes: 20,
    isRunning: false
};

function initTimer() {
    var savedLimit = localStorage.getItem('screen_time_limit');
    if (savedLimit !== null) {
        timerState.limitMinutes = parseInt(savedLimit);
    }

    if (timerState.limitMinutes === 0) {
        // No limit
        document.getElementById('timer-banner').classList.remove('visible');
        return;
    }

    timerState.sessionStart = Date.now();
    timerState.isRunning = true;

    var banner = document.getElementById('timer-banner');
    banner.classList.add('visible');

    // Update every second
    timerState.timerInterval = setInterval(function() {
        updateTimer();
    }, 1000);

    updateTimer();
}

function updateTimer() {
    if (!timerState.isRunning || timerState.limitMinutes === 0) return;

    var elapsed = Math.floor((Date.now() - timerState.sessionStart) / 1000);
    var totalSeconds = timerState.limitMinutes * 60;
    var remaining = totalSeconds - elapsed;

    if (remaining <= 0) {
        // Time's up!
        timerState.isRunning = false;
        clearInterval(timerState.timerInterval);
        showTimesUp();
        return;
    }

    var mins = Math.floor(remaining / 60);
    var secs = remaining % 60;
    var timeStr = mins + ':' + (secs < 10 ? '0' : '') + secs;

    document.getElementById('timer-text').textContent = timeStr;

    var banner = document.getElementById('timer-banner');
    banner.classList.remove('warning', 'danger');

    if (remaining <= 60) {
        banner.classList.add('danger');
    } else if (remaining <= 180) {
        banner.classList.add('warning');
    }

    // Save time used
    localStorage.setItem('time_used_today', Math.floor(elapsed / 60).toString());
}

function showTimesUp() {
    // Hide all screens
    var screens = document.querySelectorAll('.screen');
    for (var i = 0; i < screens.length; i++) {
        screens[i].classList.remove('active');
        screens[i].style.display = '';
    }

    var timesUp = document.getElementById('times-up-screen');
    timesUp.style.display = 'flex';
    timesUp.classList.add('active');

    document.getElementById('times-up-stars-count').textContent = Rewards.getTotalStars();

    AudioManager.stopAll();
    setTimeout(function() {
        Speech.speak('Great learning today, Prisha! Time for a break. Come back later!', 0.9, 1.1);
    }, 500);
}

// --- Parent Lock ---
var parentLockAnswer = 0;

function showParentLock() {
    // Generate random math problem
    var a = Math.floor(Math.random() * 10) + 5;
    var b = Math.floor(Math.random() * 10) + 3;
    parentLockAnswer = a + b;

    document.getElementById('lock-question').textContent = 'What is ' + a + ' + ' + b + '?';
    document.getElementById('lock-input').value = '';
    document.getElementById('lock-error').textContent = '';
    document.getElementById('parent-lock-screen').style.display = 'block';
    document.getElementById('parent-controls').style.display = 'none';
    document.getElementById('parent-overlay').style.display = 'flex';
}

function checkParentLock() {
    var input = document.getElementById('lock-input');
    var answer = parseInt(input.value);

    if (answer === parentLockAnswer) {
        // Correct — show controls
        document.getElementById('parent-lock-screen').style.display = 'none';
        document.getElementById('parent-controls').style.display = 'block';
        loadParentSettings();
        updateParentProgress();
    } else {
        document.getElementById('lock-error').textContent = 'Try again!';
        input.value = '';
        input.focus();
    }
}

function hideParentPanel() {
    document.getElementById('parent-overlay').style.display = 'none';
}

function loadParentSettings() {
    var limit = localStorage.getItem('screen_time_limit');
    if (limit !== null) {
        document.getElementById('time-limit').value = limit;
    }

    var vol = localStorage.getItem('app_volume');
    if (vol !== null) {
        document.getElementById('volume-slider').value = vol;
        document.getElementById('volume-display').textContent = vol + '%';
    }

    var used = localStorage.getItem('time_used_today') || '0';
    document.getElementById('time-used-today').textContent = used + ' minutes';
}

function saveParentSettings() {
    var limit = document.getElementById('time-limit').value;
    localStorage.setItem('screen_time_limit', limit);
    timerState.limitMinutes = parseInt(limit);

    if (parseInt(limit) === 0) {
        document.getElementById('timer-banner').classList.remove('visible');
        clearInterval(timerState.timerInterval);
    }
}

function changeVolume(val) {
    document.getElementById('volume-display').textContent = val + '%';
    localStorage.setItem('app_volume', val);
    if (typeof AudioManager !== 'undefined') {
        AudioManager.setVolume(val / 100);
    }
}

function updateParentProgress() {
    document.getElementById('parent-phonics-stars').textContent = Rewards.getStars('phonics');
    document.getElementById('parent-numbers-stars').textContent = Rewards.getStars('numbers');

    var visited = localStorage.getItem('phonics_visited');
    var count = 0;
    if (visited) {
        try {
            count = JSON.parse(visited).length;
        } catch(e) {}
    }
    document.getElementById('parent-letters-explored').textContent = count + ' / 26';
    document.getElementById('parent-stickers').textContent = getStickerCount();
}

function confirmReset() {
    if (confirm('Are you sure you want to reset ALL of Prisha\'s progress? This cannot be undone.')) {
        Rewards.reset();
        localStorage.removeItem('phonics_visited');
        localStorage.removeItem('phonics_currentIndex');
        localStorage.removeItem('time_used_today');
        updateParentProgress();
        Rewards.updateUI();
        updateStickerPreview();
        alert('Progress has been reset.');
    }
}

// --- Volume Init ---
function initVolume() {
    var vol = localStorage.getItem('app_volume');
    if (vol !== null && typeof AudioManager !== 'undefined') {
        AudioManager.setVolume(parseInt(vol) / 100);
    }
}

// --- Add setVolume to AudioManager if not present ---
if (typeof AudioManager !== 'undefined' && !AudioManager.setVolume) {
    AudioManager.setVolume = function(vol) {
        this.volume = Math.max(0, Math.min(1, vol));
        var paths = Object.keys(this.cache);
        for (var i = 0; i < paths.length; i++) {
            this.cache[paths[i]].volume = this.volume;
        }
    };
}

// --- Initialize Home ---
document.addEventListener('DOMContentLoaded', function() {
    // Loading screen
    setTimeout(function() {
        var loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('hidden');

        setTimeout(function() {
            loadingScreen.style.display = 'none';
            document.getElementById('home-screen').classList.add('active');
        }, 500);
    }, 1800);

    // Update UI
    Rewards.updateUI();
    updateStickerPreview();
    initVolume();

    // Greeting
    var greeting = document.getElementById('greeting');
    if (greeting) {
        var hour = new Date().getHours();
        var timeGreeting = 'Hi';
        if (hour < 12) timeGreeting = 'Good morning';
        else if (hour < 17) timeGreeting = 'Good afternoon';
        else timeGreeting = 'Good evening';
        greeting.textContent = timeGreeting + ', Prisha! Ready to learn? 🦕';
    }

    // Update numbers stars
    var numbersStars = document.getElementById('numbers-stars');
    if (numbersStars) {
        numbersStars.textContent = '⭐ ' + Rewards.getStars('numbers');
    }

    // Dino interaction
    var dino = document.getElementById('dino');
    if (dino) {
        dino.addEventListener('click', function() {
            var dinoSays = [
                'Hi Prisha! Lets learn!',
                'Roar! I am Dino!',
                'Pick a game to play!',
                'You are awesome, Prisha!',
                'Lets have fun!'
            ];
            var msg = dinoSays[Math.floor(Math.random() * dinoSays.length)];
            Speech.speak(msg, 0.9, 1.2);
            dino.style.animation = 'none';
            setTimeout(function() { dino.style.animation = 'dinoJump 0.5s ease'; }, 10);
        });
    }

    // Start timer
    initTimer();

    // Lock input enter key
    var lockInput = document.getElementById('lock-input');
    if (lockInput) {
        lockInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                checkParentLock();
            }
        });
    }
});
```

---

Now let me build the **Numbers Module** since Prisha can count to 10:

---

## 🔢 Numbers Module

### 📄 `numbers.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="theme-color" content="#6C5CE7">
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🦕</text></svg>">
    <title>Numbers - Prisha's Learning World 🦕</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/phonics.css">
    <link rel="stylesheet" href="css/numbers.css">
</head>
<body>
    <button class="back-button" onclick="navigateTo('index.html')">🏠</button>
    <div class="star-counter" id="star-counter">⭐ 0</div>

    <div id="app">
        <!-- Numbers Menu -->
        <div id="numbers-menu" class="screen active">
            <div class="stars-bg"></div>

            <div class="phonics-header">
                <div class="dino-small">🦕</div>
                <h1 class="phonics-title">Number Fun!</h1>
                <p class="phonics-subtitle">Let's count with Dino!</p>
            </div>

            <div class="phonics-options">
                <div class="phonics-option-card" onclick="startNumberExplorer()">
                    <div class="option-icon">🔢</div>
                    <div class="option-title">Number Explorer</div>
                    <div class="option-desc">Learn numbers 1-20!</div>
                    <div class="option-progress" id="num-explorer-progress">0 / 20 explored</div>
                </div>

                <div class="phonics-option-card" onclick="startCountingGame()">
                    <div class="option-icon">🐵</div>
                    <div class="option-title">Count & Tap</div>
                    <div class="option-desc">Count the animals!</div>
                    <div class="option-progress">Fun!</div>
                </div>

                <div class="phonics-option-card" onclick="startNumberMatch()">
                    <div class="option-icon">🎯</div>
                    <div class="option-title">Number Match</div>
                    <div class="option-desc">Match numbers to groups!</div>
                    <div class="option-progress">New!</div>
                </div>
            </div>
        </div>

        <!-- Number Explorer -->
        <div id="number-explorer" class="screen">
            <div class="explorer-progress-bar">
                <div class="progress-fill" id="num-progress-fill"></div>
            </div>
            <div class="explorer-counter" id="num-counter">Number 1 of 20</div>

            <div class="number-card-container">
                <div class="number-card" id="number-card">
                    <div class="number-display" id="number-display">1</div>
                    <div class="number-word" id="number-word">One</div>
                    <div class="number-objects" id="number-objects">🦕</div>
                    <div class="number-label" id="number-label">1 Dinosaur</div>
                </div>
            </div>

            <div class="sound-buttons">
                <button class="sound-btn" id="btn-num-name" onclick="playNumberName()">
                    <span class="sound-btn-icon">🔊</span>
                    <span class="sound-btn-label">Number</span>
                </button>
                <button class="sound-btn" id="btn-num-count" onclick="playCountUp()">
                    <span class="sound-btn-icon">👆</span>
                    <span class="sound-btn-label">Count</span>
                </button>
            </div>

            <div class="dino-says" id="num-dino-says">
                <span class="dino-says-icon">🦕</span>
                <span class="dino-says-text" id="num-dino-text">Tap to hear the number!</span>
            </div>

            <div class="nav-buttons">
                <button class="nav-btn nav-prev" id="num-btn-prev" onclick="prevNumber()">◀️ Prev</button>
                <button class="nav-btn nav-next" id="num-btn-next" onclick="nextNumber()">Next ▶️</button>
            </div>

            <button class="back-to-menu" onclick="showNumbersMenu()">📋 Back to Numbers Menu</button>
        </div>

        <!-- Count & Tap Game -->
        <div id="counting-game" class="screen">
            <div class="game-progress">
                <div class="game-progress-bar">
                    <div class="game-progress-fill" id="count-progress-fill"></div>
                </div>
                <div class="game-round-text" id="count-round-text">Round 1 of 10</div>
            </div>

            <div class="game-prompt">
                <div class="prompt-dino">🦕</div>
                <div class="prompt-text" id="count-prompt">How many do you see?</div>
            </div>

            <div class="counting-area" id="counting-area">
                <!-- Animals displayed here -->
            </div>

            <div class="counting-choices" id="counting-choices">
                <!-- Number choices here -->
            </div>

            <div class="feedback-area" id="count-feedback"></div>

            <div class="game-score">
                <span class="score-correct" id="count-score-correct">✅ 0</span>
                <span class="score-wrong" id="count-score-wrong">❌ 0</span>
            </div>
        </div>

        <!-- Number Match Game -->
        <div id="number-match" class="screen">
            <div class="game-progress">
                <div class="game-progress-bar">
                    <div class="game-progress-fill" id="nmatch-progress-fill"></div>
                </div>
                <div class="game-round-text" id="nmatch-round-text">Round 1 of 10</div>
            </div>

            <div class="game-prompt">
                <div class="prompt-dino">🦕</div>
                <div class="prompt-text" id="nmatch-prompt">Which group has this many?</div>
            </div>

            <div class="nmatch-number" id="nmatch-number">3</div>

            <div class="nmatch-choices" id="nmatch-choices">
                <!-- Groups of objects -->
            </div>

            <div class="feedback-area" id="nmatch-feedback"></div>

            <div class="game-score">
                <span class="score-correct" id="nmatch-score-correct">✅ 0</span>
                <span class="score-wrong" id="nmatch-score-wrong">❌ 0</span>
            </div>
        </div>

        <!-- Number Results -->
        <div id="number-results" class="screen">
            <div class="stars-bg"></div>
            <div class="results-content">
                <div class="results-mascot" id="num-results-mascot">🦕</div>
                <h1 class="results-title" id="num-results-title">Great Job!</h1>
                <div class="results-score">
                    <div class="results-stars-display" id="num-results-stars"></div>
                    <p class="results-text" id="num-results-text"></p>
                </div>
                <div class="results-buttons">
                    <button class="big-button btn-primary" id="num-play-again-btn">Play Again! 🔄</button>
                    <button class="big-button btn-secondary" onclick="showNumbersMenu()">Back to Numbers 📋</button>
                </div>
            </div>
        </div>
    </div>

    <script src="js/app.js"></script>
    <script src="js/speech.js"></script>
    <script src="js/numbers.js"></script>
</body>
</html>
```

---

## 📄 `css/numbers.css`

```css
/* ========================================
   Numbers Module Styles
   ======================================== */

/* --- Number Card --- */
.number-card-container {
    width: 100%;
    max-width: 320px;
    margin-top: 20px;
}

.number-card {
    background: white;
    border-radius: 30px;
    padding: 25px 20px;
    text-align: center;
    box-shadow: 0 15px 40px rgba(0,0,0,0.2);
    animation: cardSlideIn 0.4s ease;
    border-top: 5px solid #FFD93D;
}

.number-display {
    font-size: 100px;
    font-weight: bold;
    color: #6C5CE7;
    line-height: 1;
    text-shadow: 3px 3px 0px rgba(108,92,231,0.2);
}

.number-word {
    font-size: 28px;
    font-weight: bold;
    color: #FF6B6B;
    margin: 5px 0;
}

.number-objects {
    font-size: 40px;
    margin: 10px 0;
    letter-spacing: 5px;
    line-height: 1.4;
    min-height: 50px;
}

.number-label {
    font-size: 18px;
    color: #636e72;
}

/* --- Counting Game --- */
.counting-area {
    background: rgba(255,255,255,0.15);
    border-radius: 25px;
    padding: 20px;
    margin: 20px 0;
    min-height: 150px;
    max-width: 350px;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 10px;
    backdrop-filter: blur(5px);
}

.count-animal {
    font-size: 45px;
    animation: animalPop 0.3s ease backwards;
    cursor: pointer;
    transition: transform 0.2s;
}

.count-animal:active {
    transform: scale(1.3);
}

.count-animal.counted {
    filter: brightness(1.3);
    transform: scale(1.1);
}

@keyframes animalPop {
    0% { transform: scale(0); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
}

.counting-choices {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
    max-width: 400px;
    margin-top: 10px;
}

.count-choice-btn {
    width: 70px;
    height: 70px;
    border: 4px solid white;
    background: white;
    border-radius: 50%;
    font-size: 32px;
    font-weight: bold;
    color: #6C5CE7;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(0,0,0,0.15);
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.count-choice-btn:active {
    transform: scale(0.92);
}

.count-choice-btn.correct {
    background: #6BCB77;
    border-color: #4CAF50;
    color: white;
    animation: correctBounce 0.5s ease;
}

.count-choice-btn.wrong {
    background: #FF6B6B;
    border-color: #e74c3c;
    color: white;
    animation: wrongShake 0.5s ease;
}

.count-choice-btn.disabled {
    pointer-events: none;
    opacity: 0.5;
}

.count-choice-btn.hint {
    border-color: #FFD93D;
    box-shadow: 0 0 20px rgba(255,217,61,0.5);
}

/* --- Number Match Game --- */
.nmatch-number {
    font-size: 80px;
    font-weight: bold;
    color: white;
    text-shadow: 3px 3px 0 rgba(0,0,0,0.2);
    text-align: center;
    margin: 15px 0;
    animation: targetPop 0.5s cubic-bezier(0.68,-0.55,0.265,1.55);
}

.nmatch-choices {
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-width: 350px;
    width: 100%;
    margin-top: 10px;
}

.nmatch-choice-btn {
    background: rgba(255,255,255,0.9);
    border: 4px solid white;
    border-radius: 20px;
    padding: 15px;
    cursor: pointer;
    text-align: center;
    font-size: 30px;
    letter-spacing: 5px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    transition: all 0.2s;
    min-height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.nmatch-choice-btn:active {
    transform: scale(0.97);
}

.nmatch-choice-btn.correct {
    background: #6BCB77;
    border-color: #4CAF50;
    animation: correctBounce 0.5s ease;
}

.nmatch-choice-btn.wrong {
    background: #FF6B6B;
    border-color: #e74c3c;
    animation: wrongShake 0.5s ease;
}

.nmatch-choice-btn.disabled {
    pointer-events: none;
    opacity: 0.5;
}

.nmatch-choice-btn.hint {
    border-color: #FFD93D;
    box-shadow: 0 0 20px rgba(255,217,61,0.5);
}
```

---

## 📄 `js/numbers.js`

```javascript
/* ========================================
   Numbers Module
   ======================================== */

var NUMBERS_DATA = [
    { num: 1,  word: 'One',       emoji: '🦕', objects: '🦕' },
    { num: 2,  word: 'Two',       emoji: '🐱', objects: '🐱🐱' },
    { num: 3,  word: 'Three',     emoji: '⭐', objects: '⭐⭐⭐' },
    { num: 4,  word: 'Four',      emoji: '🐟', objects: '🐟🐟🐟🐟' },
    { num: 5,  word: 'Five',      emoji: '🍎', objects: '🍎🍎🍎🍎🍎' },
    { num: 6,  word: 'Six',       emoji: '🦋', objects: '🦋🦋🦋🦋🦋🦋' },
    { num: 7,  word: 'Seven',     emoji: '🌙', objects: '🌙🌙🌙🌙🌙🌙🌙' },
    { num: 8,  word: 'Eight',     emoji: '🐢', objects: '🐢🐢🐢🐢🐢🐢🐢🐢' },
    { num: 9,  word: 'Nine',      emoji: '🌈', objects: '🌈🌈🌈🌈🌈🌈🌈🌈🌈' },
    { num: 10, word: 'Ten',       emoji: '🐧', objects: '🐧🐧🐧🐧🐧🐧🐧🐧🐧🐧' },
    { num: 11, word: 'Eleven',    emoji: '🍇', objects: '🍇🍇🍇🍇🍇🍇🍇🍇🍇🍇🍇' },
    { num: 12, word: 'Twelve',    emoji: '🐘', objects: '🐘🐘🐘🐘🐘🐘🐘🐘🐘🐘🐘🐘' },
    { num: 13, word: 'Thirteen',  emoji: '🦁', objects: '🦁🦁🦁🦁🦁🦁🦁🦁🦁🦁🦁🦁🦁' },
    { num: 14, word: 'Fourteen',  emoji: '🍦', objects: '🍦🍦🍦🍦🍦🍦🍦🍦🍦🍦🍦🍦🍦🍦' },
    { num: 15, word: 'Fifteen',   emoji: '🐙', objects: '🐙🐙🐙🐙🐙🐙🐙🐙🐙🐙🐙🐙🐙🐙🐙' },
    { num: 16, word: 'Sixteen',   emoji: '🪁', objects: '🪁🪁🪁🪁🪁🪁🪁🪁🪁🪁🪁🪁🪁🪁🪁🪁' },
    { num: 17, word: 'Seventeen', emoji: '🐋', objects: '🐋🐋🐋🐋🐋🐋🐋🐋🐋🐋🐋🐋🐋🐋🐋🐋🐋' },
    { num: 18, word: 'Eighteen',  emoji: '🎵', objects: '🎵🎵🎵🎵🎵🎵🎵🎵🎵🎵🎵🎵🎵🎵🎵🎵🎵🎵' },
    { num: 19, word: 'Nineteen',  emoji: '🧶', objects: '🧶🧶🧶🧶🧶🧶🧶🧶🧶🧶🧶🧶🧶🧶🧶🧶🧶🧶🧶' },
    { num: 20, word: 'Twenty',    emoji: '🦖', objects: '🦖🦖🦖🦖🦖🦖🦖🦖🦖🦖🦖🦖🦖🦖🦖🦖🦖🦖🦖🦖' }
];

var COUNTING_ANIMALS = ['🐵', '🐸', '🐰', '🐻', '🐼', '🐨', '🦊', '🐷', '🐮', '🐔'];

// --- Number Explorer State ---
var numIndex = 0;
var visitedNums = new Set();
var numDirection = 'next';

// --- Counting Game State ---
var countState = {
    currentRound: 0,
    totalRounds: 10,
    correctCount: 0,
    wrongCount: 0,
    currentAnswer: 0,
    isAnswered: false,
    lastGame: 'counting'
};

// --- Screen Management ---
function showNumbersMenu() {
    var screens = document.querySelectorAll('.screen');
    for (var i = 0; i < screens.length; i++) {
        screens[i].classList.remove('active');
    }
    document.getElementById('numbers-menu').classList.add('active');
    AudioManager.stopAll();
    updateNumMenuProgress();
}

function showNumScreen(id) {
    var screens = document.querySelectorAll('.screen');
    for (var i = 0; i < screens.length; i++) {
        screens[i].classList.remove('active');
    }
    document.getElementById(id).classList.add('active');
}

// ========================================
// NUMBER EXPLORER
// ========================================
function startNumberExplorer() {
    showNumScreen('number-explorer');
    loadNumProgress();
    showNumber(numIndex);

    setTimeout(function() {
        Speech.speak('Lets explore numbers, Prisha!', 0.9, 1.1);
    }, 500);
}

function loadNumProgress() {
    var saved = localStorage.getItem('numbers_visited');
    if (saved) {
        try { visitedNums = new Set(JSON.parse(saved)); } catch(e) { visitedNums = new Set(); }
    }
    var idx = localStorage.getItem('numbers_currentIndex');
    if (idx !== null) {
        numIndex = parseInt(idx);
        if (numIndex < 0 || numIndex > 19) numIndex = 0;
    }
}

function saveNumProgress() {
    localStorage.setItem('numbers_visited', JSON.stringify(Array.from(visitedNums)));
    localStorage.setItem('numbers_currentIndex', numIndex.toString());
}

function showNumber(index) {
    var data = NUMBERS_DATA[index];
    var card = document.getElementById('number-card');

    AudioManager.stopAll();

    card.style.animation = 'none';
    void card.offsetHeight;
    card.style.animation = numDirection === 'next' ? 'cardSlideIn 0.4s ease' : 'cardSlideInReverse 0.4s ease';

    document.getElementById('number-display').textContent = data.num;
    document.getElementById('number-word').textContent = data.word;
    document.getElementById('number-objects').textContent = data.objects;
    document.getElementById('number-label').textContent = data.num + ' ' + (data.num === 1 ? 'Dinosaur' : getObjectName(data.emoji, data.num));

    document.getElementById('num-counter').textContent = 'Number ' + (index + 1) + ' of 20';
    document.getElementById('num-progress-fill').style.width = (((index + 1) / 20) * 100) + '%';

    document.getElementById('num-dino-text').textContent = data.num + ' is ' + data.word + '! Can you count ' + data.num + ' ' + getObjectName(data.emoji, data.num) + '?';

    document.getElementById('num-btn-prev').disabled = (index === 0);
    document.getElementById('num-btn-next').textContent = (index === 19) ? '🎉 Finish!' : 'Next ▶️';

    if (!visitedNums.has(index)) {
        visitedNums.add(index);
        Rewards.addStar('numbers');
        updateNumStars();

        if (visitedNums.size % 5 === 0 && visitedNums.size > 0) {
            setTimeout(function() {
                launchConfetti();
                showCelebration('🌟', visitedNums.size + ' Numbers Explored!', 'Keep going, Prisha!');
            }, 800);
        }
    }

    saveNumProgress();

    setTimeout(function() {
        Speech.speak(data.word, 0.8, 1.1);
    }, 400);
}

function getObjectName(emoji, count) {
    var names = {
        '🦕': 'Dinosaurs', '🐱': 'Cats', '⭐': 'Stars', '🐟': 'Fish',
        '🍎': 'Apples', '🦋': 'Butterflies', '🌙': 'Moons', '🐢': 'Turtles',
        '🌈': 'Rainbows', '🐧': 'Penguins', '🍇': 'Grapes', '🐘': 'Elephants',
        '🦁': 'Lions', '🍦': 'Ice Creams', '🐙': 'Octopuses', '🪁': 'Kites',
        '🐋': 'Whales', '🎵': 'Music Notes', '🧶': 'Yarn Balls', '🦖': 'T-Rexes'
    };
    if (count === 1) {
        var singular = {
            '🦕': 'Dinosaur', '🐱': 'Cat', '⭐': 'Star', '🐟': 'Fish',
            '🍎': 'Apple', '🦋': 'Butterfly', '🌙': 'Moon', '🐢': 'Turtle'
        };
        return singular[emoji] || 'item';
    }
    return names[emoji] || 'items';
}

function nextNumber() {
    if (numIndex >= 19) {
        launchConfetti();
        Speech.speak('Wow Prisha! You explored all 20 numbers! Amazing!', 0.9, 1.1);
        showCelebration('🏆🦕', 'Amazing, Prisha!', 'You explored all 20 numbers!', function() { showNumbersMenu(); });
        return;
    }
    numDirection = 'next';
    numIndex++;
    showNumber(numIndex);
}

function prevNumber() {
    if (numIndex <= 0) return;
    numDirection = 'prev';
    numIndex--;
    showNumber(numIndex);
}

function playNumberName() {
    var data = NUMBERS_DATA[numIndex];
    Speech.speak(data.word, 0.8, 1.1);
}

function playCountUp() {
    var data = NUMBERS_DATA[numIndex];
    var countText = '';
    for (var i = 1; i <= data.num; i++) {
        countText += i + ', ';
    }
    countText += data.word + '!';
    Speech.speak(countText, 0.7, 1.1);
}

// ========================================
// COUNT & TAP GAME
// ========================================
function startCountingGame() {
    countState.currentRound = 0;
    countState.correctCount = 0;
    countState.wrongCount = 0;
    countState.isAnswered = false;
    countState.lastGame = 'counting';

    document.getElementById('count-score-correct').textContent = '✅ 0';
    document.getElementById('count-score-wrong').textContent = '❌ 0';

    showNumScreen('counting-game');
    AudioManager.stopAll();

    Speech.speak('Count the animals, Prisha!', 0.9, 1.1);
    setTimeout(function() { nextCountRound(); }, 2500);
}

function nextCountRound() {
    countState.currentRound++;
    countState.isAnswered = false;

    if (countState.currentRound > countState.totalRounds) {
        showNumResults();
        return;
    }

    // Random count between 1-10
    var correctNum = Math.floor(Math.random() * 10) + 1;
    countState.currentAnswer = correctNum;

    // Pick random animal
    var animal = COUNTING_ANIMALS[Math.floor(Math.random() * COUNTING_ANIMALS.length)];

    document.getElementById('count-round-text').textContent = 'Round ' + countState.currentRound + ' of ' + countState.totalRounds;
    document.getElementById('count-progress-fill').style.width = (((countState.currentRound - 1) / countState.totalRounds) * 100) + '%';
    document.getElementById('count-prompt').textContent = 'How many ' + animal + ' do you see?';
    document.getElementById('count-feedback').innerHTML = '';

    // Display animals with staggered animation
    var area = document.getElementById('counting-area');
    area.innerHTML = '';
    for (var i = 0; i < correctNum; i++) {
        var span = document.createElement('span');
        span.className = 'count-animal';
        span.textContent = animal;
        span.style.animationDelay = (i * 0.1) + 's';
        area.appendChild(span);
    }

    // Generate 4 number choices
    var choices = [correctNum];
    while (choices.length < 4) {
        var rand = Math.floor(Math.random() * 10) + 1;
        if (choices.indexOf(rand) === -1) {
            choices.push(rand);
        }
    }
    choices = shuffleNumArray(choices);

    var container = document.getElementById('counting-choices');
    container.innerHTML = '';
    for (var j = 0; j < choices.length; j++) {
        var btn = document.createElement('button');
        btn.className = 'count-choice-btn';
        btn.textContent = choices[j];
        btn.setAttribute('data-num', choices[j].toString());

        (function(num) {
            btn.addEventListener('click', function() {
                handleCountChoice(num, this);
            });
        })(choices[j]);

        container.appendChild(btn);
    }

    // Speak
    setTimeout(function() {
        Speech.speak('How many?', 0.9, 1.1);
    }, 500);
}

function handleCountChoice(selected, btnEl) {
    if (countState.isAnswered) return;
    countState.isAnswered = true;
    AudioManager.stopAll();

    var isCorrect = selected === countState.currentAnswer;
    var feedback = document.getElementById('count-feedback');

    var allBtns = document.querySelectorAll('.count-choice-btn');
    for (var i = 0; i < allBtns.length; i++) {
        allBtns[i].classList.add('disabled');
    }

    if (isCorrect) {
        btnEl.classList.add('correct');
        countState.correctCount++;
        document.getElementById('count-score-correct').textContent = '✅ ' + countState.correctCount;
        feedback.innerHTML = '<div class="feedback-msg correct">🎉 Yes! ' + countState.currentAnswer + '!</div>';

        Rewards.addStar('numbers');
        updateNumStars();

        setTimeout(function() { AudioManager.playCelebration(); }, 200);
        if (countState.correctCount % 3 === 0) launchConfetti();
        setTimeout(function() { nextCountRound(); }, 2500);
    } else {
        btnEl.classList.add('wrong');
        countState.wrongCount++;
        document.getElementById('count-score-wrong').textContent = '❌ ' + countState.wrongCount;

        for (var k = 0; k < allBtns.length; k++) {
            if (allBtns[k].getAttribute('data-num') === countState.currentAnswer.toString()) {
                allBtns[k].classList.add('hint');
            }
        }

        feedback.innerHTML = '<div class="feedback-msg wrong">The answer is ' + countState.currentAnswer + '!</div>';
        setTimeout(function() { AudioManager.playInstruction('try_again'); }, 200);
        setTimeout(function() { nextCountRound(); }, 3000);
    }
}

// ========================================
// NUMBER MATCH GAME
// ========================================
function startNumberMatch() {
    countState.currentRound = 0;
    countState.correctCount = 0;
    countState.wrongCount = 0;
    countState.isAnswered = false;
    countState.lastGame = 'match';

    document.getElementById('nmatch-score-correct').textContent = '✅ 0';
    document.getElementById('nmatch-score-wrong').textContent = '❌ 0';

    showNumScreen('number-match');
    AudioManager.stopAll();

    Speech.speak('Match the number to the right group, Prisha!', 0.9, 1.1);
    setTimeout(function() { nextNMatchRound(); }, 3000);
}

function nextNMatchRound() {
    countState.currentRound++;
    countState.isAnswered = false;

    if (countState.currentRound > countState.totalRounds) {
        showNumResults();
        return;
    }

    var targetNum = Math.floor(Math.random() * 8) + 1; // 1-8 for readability
    countState.currentAnswer = targetNum;

    document.getElementById('nmatch-round-text').textContent = 'Round ' + countState.currentRound + ' of ' + countState.totalRounds;
    document.getElementById('nmatch-progress-fill').style.width = (((countState.currentRound - 1) / countState.totalRounds) * 100) + '%';
    document.getElementById('nmatch-number').textContent = targetNum;
    document.getElementById('nmatch-number').style.animation = 'none';
    void document.getElementById('nmatch-number').offsetHeight;
    document.getElementById('nmatch-number').style.animation = 'targetPop 0.5s cubic-bezier(0.68,-0.55,0.265,1.55)';
    document.getElementById('nmatch-prompt').textContent = 'Which group has ' + targetNum + '?';
    document.getElementById('nmatch-feedback').innerHTML = '';

    // Generate 3 choices with different counts
    var choiceNums = [targetNum];
    while (choiceNums.length < 3) {
        var r = Math.floor(Math.random() * 8) + 1;
        if (choiceNums.indexOf(r) === -1 && Math.abs(r - targetNum) <= 3) {
            choiceNums.push(r);
        }
        // Fallback if we can't find close numbers
        if (choiceNums.length < 3) {
            r = Math.floor(Math.random() * 8) + 1;
            if (choiceNums.indexOf(r) === -1) {
                choiceNums.push(r);
            }
        }
    }
    choiceNums = shuffleNumArray(choiceNums);

    var container = document.getElementById('nmatch-choices');
    container.innerHTML = '';

    for (var i = 0; i < choiceNums.length; i++) {
        var animal = COUNTING_ANIMALS[Math.floor(Math.random() * COUNTING_ANIMALS.length)];
        var objectStr = '';
        for (var j = 0; j < choiceNums[i]; j++) {
            objectStr += animal;
        }

        var btn = document.createElement('button');
        btn.className = 'nmatch-choice-btn';
        btn.textContent = objectStr;
        btn.setAttribute('data-num', choiceNums[i].toString());

        (function(num) {
            btn.addEventListener('click', function() {
                handleNMatchChoice(num, this);
            });
        })(choiceNums[i]);

        container.appendChild(btn);
    }

    setTimeout(function() {
        Speech.speak('' + targetNum, 0.8, 1.1);
    }, 500);
}

function handleNMatchChoice(selected, btnEl) {
    if (countState.isAnswered) return;
    countState.isAnswered = true;
    AudioManager.stopAll();

    var isCorrect = selected === countState.currentAnswer;
    var feedback = document.getElementById('nmatch-feedback');

    var allBtns = document.querySelectorAll('.nmatch-choice-btn');
    for (var i = 0; i < allBtns.length; i++) {
        allBtns[i].classList.add('disabled');
    }

    if (isCorrect) {
        btnEl.classList.add('correct');
        countState.correctCount++;
        document.getElementById('nmatch-score-correct').textContent = '✅ ' + countState.correctCount;
        feedback.innerHTML = '<div class="feedback-msg correct">🎉 Yes! That\'s ' + countState.currentAnswer + '!</div>';

        Rewards.addStar('numbers');
        updateNumStars();

        setTimeout(function() { AudioManager.playCelebration(); }, 200);
        if (countState.correctCount % 3 === 0) launchConfetti();
        setTimeout(function() { nextNMatchRound(); }, 2500);
    } else {
        btnEl.classList.add('wrong');
        countState.wrongCount++;
        document.getElementById('nmatch-score-wrong').textContent = '❌ ' + countState.wrongCount;

        for (var k = 0; k < allBtns.length; k++) {
            if (allBtns[k].getAttribute('data-num') === countState.currentAnswer.toString()) {
                allBtns[k].classList.add('hint');
            }
        }

        feedback.innerHTML = '<div class="feedback-msg wrong">Look for ' + countState.currentAnswer + '!</div>';
        setTimeout(function() { AudioManager.playInstruction('try_again'); }, 200);
        setTimeout(function() { nextNMatchRound(); }, 3000);
    }
}

// ========================================
// RESULTS
// ========================================
function showNumResults() {
    AudioManager.stopAll();
    showNumScreen('number-results');

    var score = countState.correctCount;
    var total = countState.totalRounds;
    var pct = Math.round((score / total) * 100);

    var stars = pct >= 90 ? 5 : pct >= 70 ? 4 : pct >= 50 ? 3 : pct >= 30 ? 2 : 1;

    var starsHtml = '';
    for (var i = 0; i < 5; i++) {
        starsHtml += (i < stars) ? '⭐' : '☆';
    }
    document.getElementById('num-results-stars').innerHTML = starsHtml;

    var title = document.getElementById('num-results-title');
    var mascot = document.getElementById('num-results-mascot');

    if (pct >= 90) { title.textContent = 'SUPERSTAR, Prisha!'; mascot.textContent = '🦕🎉'; }
    else if (pct >= 70) { title.textContent = 'Great Job, Prisha!'; mascot.textContent = '🦕⭐'; }
    else if (pct >= 50) { title.textContent = 'Good Try, Prisha!'; mascot.textContent = '🦕👍'; }
    else { title.textContent = 'Keep Practicing!'; mascot.textContent = '🦕💪'; }

    document.getElementById('num-results-text').innerHTML = 'You got <strong>' + score + ' out of ' + total + '</strong> correct!';

    // Play again button
    var playAgainBtn = document.getElementById('num-play-again-btn');
    if (countState.lastGame === 'counting') {
        playAgainBtn.onclick = function() { startCountingGame(); };
    } else {
        playAgainBtn.onclick = function() { startNumberMatch(); };
    }

    setTimeout(function() {
        if (pct >= 70) { launchConfetti(); AudioManager.playCelebration(); }
        else { Speech.speak('Keep practicing, Prisha! You can do it!', 0.9, 1.1); }
    }, 800);
}

// ========================================
// HELPERS
// ========================================
function updateNumStars() {
    var el = document.getElementById('star-counter');
    if (el) el.textContent = '⭐ ' + Rewards.getStars('numbers');
}

function updateNumMenuProgress() {
    var el = document.getElementById('num-explorer-progress');
    if (el) el.textContent = visitedNums.size + ' / 20 explored';
}

function shuffleNumArray(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
}

document.addEventListener('DOMContentLoaded', function() {
    loadNumProgress();
    updateNumStars();
    updateNumMenuProgress();
});
```

---

## ✅ Phase 5 + Numbers Module Complete!

### What's New:

| Feature | Details |
|---------|---------|
| 🔒 **Parent Controls** | Math lock, screen time, volume, progress view, reset |
| ⏱️ **Screen Timer** | Configurable limit with warnings, "time's up" screen |
| 🦕 **Sticker Collection** | 20 dinosaur-themed stickers earned by stars |
| 🎨 **Loading Screen** | Animated loading with progress bar |
| 🔢 **Number Explorer** | Numbers 1-20 with visual objects + audio |
| 🐵 **Count & Tap** | Count animals and pick the right number |
| 🎯 **Number Match** | Match a number to the correct group of objects |
| 📊 **Results Screen** | Shared results for number games |

### Updated File Structure:

```
prishas-learning-world/
├── index.html              ✅ Updated
├── phonics.html            ✅
├── matching.html           ✅
├── sound-safari.html       ✅
├── numbers.html            ✅ NEW
├── css/
│   ├── style.css           ✅
│   ├── home.css            ✅ NEW
│   ├── phonics.css         ✅
│   ├── matching.css        ✅
│   ├── sound-safari.css    ✅
│   └── numbers.css         ✅ NEW
├── js/
│   ├── app.js              ✅
│   ├── speech.js           ✅
│   ├── home.js             ✅ NEW
│   ├── phonics.js          ✅
│   ├── matching.js         ✅
│   ├── sound-safari.js     ✅
│   └── numbers.js          ✅ NEW
├── audio/
├── tools/
│   └── generate_audio.py   ✅
├── manifest.json            ✅
└── sw.js                    ✅
```

---

## 🔜 What's Next?

| Option | Description |
|--------|-------------|
| **Phase 6** | 🚀 **Deploy to GitHub Pages** — Get it on Prisha's device! |
| **Bonus A** | 📖 **Vocabulary Module** — Animals, colors, shapes, body parts |
| **Bonus B** | ✍️ **Letter Tracing** — Draw letters with finger |
| **Bonus C** | 🎵 **ABC Song** — Sing-along with highlighted letters |

**I'd recommend deploying now (Phase 6) so Prisha can start using it while we add more features. Want to deploy?** 🚀