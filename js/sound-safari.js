/* ========================================
   Sound Safari Game
   ========================================
   Dino plays a phonics sound, child picks
   which letter makes that sound.

   Rules applied:
   - AudioManager only (no Speech.speak)
   - .then() promise chains for audio sequencing
   - clearTimers + stopAll at every transition
   - No repeat letters via usedLetters tracking
   - Retry pattern on wrong answer
   ======================================== */

// ========================================
// LETTER DATA FOR SAFARI
// ========================================

var SAFARI_LETTERS = [
    { letter: 'a', upper: 'A', word: 'Apple',     emoji: '🍎' },
    { letter: 'b', upper: 'B', word: 'Butterfly',  emoji: '🦋' },
    { letter: 'c', upper: 'C', word: 'Cat',        emoji: '🐱' },
    { letter: 'd', upper: 'D', word: 'Dinosaur',   emoji: '🦕' },
    { letter: 'e', upper: 'E', word: 'Elephant',   emoji: '🐘' },
    { letter: 'f', upper: 'F', word: 'Fish',       emoji: '🐟' },
    { letter: 'g', upper: 'G', word: 'Grapes',     emoji: '🍇' },
    { letter: 'h', upper: 'H', word: 'Heart',      emoji: '❤️' },
    { letter: 'i', upper: 'I', word: 'Ice Cream',  emoji: '🍦' },
    { letter: 'j', upper: 'J', word: 'Jellyfish',  emoji: '🪼' },
    { letter: 'k', upper: 'K', word: 'Kite',       emoji: '🪁' },
    { letter: 'l', upper: 'L', word: 'Lion',       emoji: '🦁' },
    { letter: 'm', upper: 'M', word: 'Moon',       emoji: '🌙' },
    { letter: 'n', upper: 'N', word: 'Nest',       emoji: '🪺' },
    { letter: 'o', upper: 'O', word: 'Octopus',    emoji: '🐙' },
    { letter: 'p', upper: 'P', word: 'Penguin',    emoji: '🐧' },
    { letter: 'q', upper: 'Q', word: 'Queen',      emoji: '👑' },
    { letter: 'r', upper: 'R', word: 'Rainbow',    emoji: '🌈' },
    { letter: 's', upper: 'S', word: 'Star',       emoji: '⭐' },
    { letter: 't', upper: 'T', word: 'Turtle',     emoji: '🐢' },
    { letter: 'u', upper: 'U', word: 'Umbrella',   emoji: '☂️' },
    { letter: 'v', upper: 'V', word: 'Violin',     emoji: '🎻' },
    { letter: 'w', upper: 'W', word: 'Whale',      emoji: '🐋' },
    { letter: 'x', upper: 'X', word: 'Xylophone',  emoji: '🎵' },
    { letter: 'y', upper: 'Y', word: 'Yarn',       emoji: '🧶' },
    { letter: 'z', upper: 'Z', word: 'Zebra',      emoji: '🦓' }
];

// Similar-sounding letters for harder distractors
var SAFARI_SIMILAR = {
    'a': ['e', 'o', 'u'],
    'b': ['d', 'p', 'g'],
    'c': ['k', 's', 'g'],
    'd': ['b', 't', 'g'],
    'e': ['a', 'i', 'o'],
    'f': ['v', 's', 'th'],
    'g': ['d', 'b', 'k'],
    'h': ['a', 'e', 'k'],
    'i': ['e', 'a', 'y'],
    'j': ['g', 'ch', 'd'],
    'k': ['c', 'g', 't'],
    'l': ['r', 'n', 'w'],
    'm': ['n', 'b', 'p'],
    'n': ['m', 'd', 'l'],
    'o': ['a', 'u', 'e'],
    'p': ['b', 't', 'd'],
    'q': ['k', 'g', 'c'],
    'r': ['l', 'w', 'n'],
    's': ['z', 'c', 'sh'],
    't': ['d', 'p', 'k'],
    'u': ['o', 'a', 'e'],
    'v': ['f', 'b', 'w'],
    'w': ['r', 'v', 'l'],
    'x': ['s', 'z', 'k'],
    'y': ['i', 'e', 'w'],
    'z': ['s', 'x', 'v']
};

// ========================================
// GAME STATE
// ========================================

var safariState = {
    difficulty: 'easy',
    totalRounds: 10,
    currentRound: 0,
    correctCount: 0,
    wrongCount: 0,
    isAnswered: false,
    usedLetters: [],
    roundHistory: [],
    currentLetter: null
};

// ========================================
// TIMER MANAGEMENT
// ========================================

var safariTimers = [];

function clearSafariTimers() {
    for (var i = 0; i < safariTimers.length; i++) {
        clearTimeout(safariTimers[i]);
    }
    safariTimers = [];
}

function safariDelay(fn, ms) {
    var id = setTimeout(fn, ms);
    safariTimers.push(id);
    return id;
}

// ========================================
// DIFFICULTY
// ========================================

function setSafariDifficulty(level) {
    safariState.difficulty = level;
    var buttons = document.querySelectorAll('.diff-btn');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active');
    }
    document.getElementById('safari-diff-' + level).classList.add('active');
}

function getSafariChoiceCount() {
    if (safariState.difficulty === 'easy') return 3;
    if (safariState.difficulty === 'medium') return 4;
    return 5;
}

// ========================================
// SCREEN MANAGEMENT
// ========================================

function showSafariScreen(id) {
    var screens = document.querySelectorAll('.screen');
    for (var i = 0; i < screens.length; i++) {
        screens[i].classList.remove('active');
    }
    document.getElementById(id).classList.add('active');
}

// ========================================
// START GAME
// ========================================

function startSafari() {
    safariState.currentRound = 0;
    safariState.correctCount = 0;
    safariState.wrongCount = 0;
    safariState.isAnswered = false;
    safariState.usedLetters = [];
    safariState.roundHistory = [];

    document.getElementById('safari-score-correct').textContent = '✅ 0';
    document.getElementById('safari-score-wrong').textContent = '❌ 0';

    showSafariScreen('safari-game');
    clearSafariTimers();
    AudioManager.stopAll();

    AudioManager.playInstruction('listen_carefully')
        .then(function() {
            safariDelay(function() { nextSafariRound(); }, 300);
        })
        .catch(function() {
            safariDelay(function() { nextSafariRound(); }, 2500);
        });
}

// ========================================
// NEXT ROUND
// ========================================

function nextSafariRound() {
    clearSafariTimers();
    AudioManager.stopAll();

    safariState.currentRound++;
    safariState.isAnswered = false;

    if (safariState.currentRound > safariState.totalRounds) {
        showSafariResults();
        return;
    }

    // Update progress
    document.getElementById('safari-round-text').textContent = 'Round ' + safariState.currentRound + ' of ' + safariState.totalRounds;
    document.getElementById('safari-progress-fill').style.width = (((safariState.currentRound - 1) / safariState.totalRounds) * 100) + '%';
    document.getElementById('safari-feedback').innerHTML = '';
    document.getElementById('teaching-moment').innerHTML = '';
    document.getElementById('safari-prompt-text').textContent = 'What letter makes this sound?';

    // Pick unused letter
    var available = [];
    for (var a = 0; a < SAFARI_LETTERS.length; a++) {
        if (safariState.usedLetters.indexOf(a) === -1) available.push(a);
    }
    if (available.length === 0) {
        safariState.usedLetters = [];
        for (var b = 0; b < SAFARI_LETTERS.length; b++) available.push(b);
    }

    var correctIndex = available[Math.floor(Math.random() * available.length)];
    safariState.usedLetters.push(correctIndex);

    var correctLetter = SAFARI_LETTERS[correctIndex];
    safariState.currentLetter = correctLetter;

    // Build choices
    var choiceCount = getSafariChoiceCount();
    var choiceIndices = [correctIndex];

    // Add similar-sounding letters as distractors
    var similar = SAFARI_SIMILAR[correctLetter.letter] || [];
    for (var s = 0; s < similar.length && choiceIndices.length < choiceCount; s++) {
        for (var si = 0; si < SAFARI_LETTERS.length; si++) {
            if (SAFARI_LETTERS[si].letter === similar[s] && choiceIndices.indexOf(si) === -1) {
                choiceIndices.push(si);
                break;
            }
        }
    }

    // Fill remaining with random
    while (choiceIndices.length < choiceCount) {
        var r = Math.floor(Math.random() * SAFARI_LETTERS.length);
        if (choiceIndices.indexOf(r) === -1) {
            choiceIndices.push(r);
        }
    }

    choiceIndices = shuffleSafariArray(choiceIndices);

    // Render choices
    var container = document.getElementById('safari-choices');
    container.innerHTML = '';

    for (var i = 0; i < choiceIndices.length; i++) {
        var item = SAFARI_LETTERS[choiceIndices[i]];
        var btn = document.createElement('button');
        btn.className = 'safari-choice-btn';
        btn.innerHTML = '<span class="safari-choice-upper">' + item.upper + '</span>' +
                        '<span class="safari-choice-lower">' + item.letter + '</span>';
        btn.setAttribute('data-letter', item.letter);

        (function(letterData) {
            btn.addEventListener('click', function() {
                handleSafariChoice(letterData, this);
            });
        })(item);

        container.appendChild(btn);
    }

    // Play the phonics sound after a short delay
    safariDelay(function() {
        playSafariSound();
    }, 600);
}

// ========================================
// PLAY / REPLAY SOUND
// ========================================

function playSafariSound() {
    if (!safariState.currentLetter) return;

    var playBtn = document.getElementById('safari-play-btn');
    var waves = document.getElementById('sound-waves');

    playBtn.classList.add('playing');
    waves.classList.add('active');

    AudioManager.playPhonicsSound(safariState.currentLetter.letter)
        .then(function() {
            playBtn.classList.remove('playing');
            waves.classList.remove('active');
        })
        .catch(function() {
            playBtn.classList.remove('playing');
            waves.classList.remove('active');
        });
}

function replaySound() {
    if (safariState.isAnswered) return;
    clearSafariTimers();
    AudioManager.stopAll();
    playSafariSound();
}