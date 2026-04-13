/* ========================================
   Home Screen Logic
   Parent Controls, Timer, Stickers, Name Entry
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

// --- Letter-pop colors for the animated title ---
var TITLE_COLORS = ['#FF6B6B', '#FFA502', '#FFD93D', '#6BCB77', '#4D96FF', '#9B59B6', '#FF6B6B', '#FFA502', '#FFD93D', '#6BCB77', '#4D96FF', '#9B59B6', '#FF6B6B', '#FFA502', '#FFD93D', '#6BCB77', '#4D96FF', '#9B59B6', '#FF6B6B', '#FFA502'];

// ========================================
// NAME ENTRY
// ========================================

function initNameEntry() {
    if (ChildName.isSet()) {
        // Name already set — skip to loading screen
        showLoadingThenHome();
    } else {
        // First visit — show name entry
        showNameEntryScreen();
    }
}

function showNameEntryScreen() {
    var screens = document.querySelectorAll('.screen');
    for (var i = 0; i < screens.length; i++) {
        screens[i].classList.remove('active');
    }
    document.getElementById('name-entry-screen').classList.add('active');

    // Focus the input
    setTimeout(function() {
        var input = document.getElementById('child-name-input');
        if (input) input.focus();
    }, 500);
}

function submitChildName() {
    var input = document.getElementById('child-name-input');
    var name = (input.value || '').trim();

    if (!name) {
        input.style.borderColor = '#FF6B6B';
        input.setAttribute('placeholder', 'Please type a name!');
        input.focus();
        return;
    }

    // Capitalize first letter
    name = name.charAt(0).toUpperCase() + name.slice(1);

    ChildName.set(name);
    showLoadingThenHome();
}

function showLoadingThenHome() {
    // Hide all screens
    var screens = document.querySelectorAll('.screen');
    for (var i = 0; i < screens.length; i++) {
        screens[i].classList.remove('active');
    }

    // Show loading screen
    var loadingScreen = document.getElementById('loading-screen');
    loadingScreen.style.display = '';
    loadingScreen.classList.remove('hidden');

    // Update the page title
    var name = ChildName.get();
    document.title = ChildName.possessive() + ' Learning World 🦕';

    // Build dynamic title
    buildAnimatedTitle(name);

    // Update greeting
    updateGreeting();

    // After loading animation, show home
    setTimeout(function() {
        loadingScreen.classList.add('hidden');

        setTimeout(function() {
            loadingScreen.style.display = 'none';
            document.getElementById('home-screen').classList.add('active');
        }, 500);
    }, 1800);
}

// ========================================
// DYNAMIC ANIMATED TITLE
// ========================================

function buildAnimatedTitle(name) {
    var titleEl = document.getElementById('app-title');
    if (!titleEl) return;

    // Build: "Name's" with letter-pop animation
    var possessive = ChildName.possessive();
    titleEl.innerHTML = '';

    for (var i = 0; i < possessive.length; i++) {
        var span = document.createElement('span');
        span.className = 'letter-pop';
        span.textContent = possessive.charAt(i);
        var delay = (i + 1) * 0.1;
        span.style.setProperty('--delay', delay + 's');
        span.style.color = TITLE_COLORS[i % TITLE_COLORS.length];
        titleEl.appendChild(span);
    }
}

// ========================================
// GREETING
// ========================================

function updateGreeting() {
    var greeting = document.getElementById('greeting');
    if (!greeting) return;

    var name = ChildName.get() || 'friend';
    var hour = new Date().getHours();
    var timeGreeting = 'Hi';
    if (hour < 12) timeGreeting = 'Good morning';
    else if (hour < 17) timeGreeting = 'Good afternoon';
    else timeGreeting = 'Good evening';
    greeting.textContent = timeGreeting + ', ' + name + '! Ready to learn? 🦕';
}

// ========================================
// CHILD NAME FROM PARENT CONTROLS
// ========================================

function saveChildNameFromParent() {
    var input = document.getElementById('parent-child-name');
    var name = (input.value || '').trim();
    var status = document.getElementById('name-save-status');

    if (!name) {
        status.textContent = '⚠️ Enter a name';
        status.style.color = '#FF6B6B';
        return;
    }

    // Capitalize first letter
    name = name.charAt(0).toUpperCase() + name.slice(1);
    ChildName.set(name);

    // Update UI immediately
    document.title = ChildName.possessive() + ' Learning World 🦕';
    buildAnimatedTitle(name);
    updateGreeting();

    status.textContent = '✅ Saved!';
    status.style.color = '#6BCB77';
    setTimeout(function() { status.textContent = ''; }, 2000);
}

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
    var name = ChildName.get() || 'friend';

    // Hide all screens
    var screens = document.querySelectorAll('.screen');
    for (var i = 0; i < screens.length; i++) {
        screens[i].classList.remove('active');
        screens[i].style.display = '';
    }

    var timesUp = document.getElementById('times-up-screen');
    timesUp.style.display = 'flex';
    timesUp.classList.add('active');

    // Update times up text with name
    var timesUpText = document.getElementById('times-up-text');
    if (timesUpText) {
        timesUpText.innerHTML = 'Great learning today, ' + name + '!<br>Dino needs a nap. Come back later!';
    }

    document.getElementById('times-up-stars-count').textContent = Rewards.getTotalStars();

    AudioManager.stopAll();
    setTimeout(function() {
        Speech.speak('Great learning today, ' + name + '! Time for a break. Come back later!', 0.9, 1.1);
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

    // Load child name into parent input
    var nameInput = document.getElementById('parent-child-name');
    if (nameInput) {
        nameInput.value = ChildName.get();
    }
    var nameStatus = document.getElementById('name-save-status');
    if (nameStatus) nameStatus.textContent = '';
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
    var name = ChildName.get();
    if (confirm('Are you sure you want to reset ALL of ' + (name || 'your child') + '\'s progress? This cannot be undone.')) {
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
    // Update UI
    Rewards.updateUI();
    updateStickerPreview();
    initVolume();

    // Update numbers stars
    var numbersStars = document.getElementById('numbers-stars');
    if (numbersStars) {
        numbersStars.textContent = '⭐ ' + Rewards.getStars('numbers');
    }

    var vocabStars = document.getElementById('vocabulary-stars');
    if (vocabStars) {
        vocabStars.textContent = '⭐ ' + Rewards.getStars('vocabulary');
    }

    var gamesStars = document.getElementById('games-stars');
    if (gamesStars) {
        gamesStars.textContent = '⭐ ' + Rewards.getStars('games');
    }

    // Check if name is set — show name entry or loading
    initNameEntry();

    // Dino interaction (set up but only works once home-screen is active)
    var dino = document.getElementById('dino');
    if (dino) {
        dino.addEventListener('click', function() {
            var name = ChildName.get() || 'friend';
            var dinoSays = [
                'Hi ' + name + '! Lets learn!',
                'Roar! I am Dino!',
                'Pick a game to play!',
                'You are awesome, ' + name + '!',
                'Lets have fun!'
            ];
            var msg = dinoSays[Math.floor(Math.random() * dinoSays.length)];
            Speech.speak(msg, 0.9, 1.2);
            dino.style.animation = 'none';
            setTimeout(function() { dino.style.animation = 'dinoJump 0.5s ease'; }, 10);
        });
    }

    // Start timer (will run after home screen is shown)
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

    // Name entry input enter key
    var nameInput = document.getElementById('child-name-input');
    if (nameInput) {
        nameInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                submitChildName();
            }
        });
    }
});