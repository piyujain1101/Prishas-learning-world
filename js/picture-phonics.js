/* js/picture-phonics.js */
/* ========================================
   Picture Phonics Game
   ========================================
   Shows a picture, child picks what letter
   it starts with. Options show "Aa", "Bb" etc.

   Rules applied:
   - AudioManager only (no Speech.speak)
   - .then() promise chains for audio sequencing
   - clearTimers + stopAll at every transition
   - No repeat pictures via usedPictures tracking
   - Retry pattern on wrong answer
   - Combo counter for streaks
   - Caterpillar progress bar
   ======================================== */

// ========================================
// PICTURE DATA — multiple pictures per letter
// ========================================

var PP_PICTURES = [
    // A
    { letter: 'a', word: 'Apple',      emoji: '🍎' },
    { letter: 'a', word: 'Airplane',   emoji: '✈️' },
    { letter: 'a', word: 'Ant',        emoji: '🐜' },
    // B
    { letter: 'b', word: 'Butterfly',  emoji: '🦋' },
    { letter: 'b', word: 'Banana',     emoji: '🍌' },
    { letter: 'b', word: 'Bear',       emoji: '🐻' },
    // C
    { letter: 'c', word: 'Cat',        emoji: '🐱' },
    { letter: 'c', word: 'Car',        emoji: '🚗' },
    { letter: 'c', word: 'Cupcake',    emoji: '🧁' },
    // D
    { letter: 'd', word: 'Dinosaur',   emoji: '🦕' },
    { letter: 'd', word: 'Dog',        emoji: '🐶' },
    { letter: 'd', word: 'Duck',       emoji: '🦆' },
    // E
    { letter: 'e', word: 'Elephant',   emoji: '🐘' },
    { letter: 'e', word: 'Egg',        emoji: '🥚' },
    { letter: 'e', word: 'Eagle',      emoji: '🦅' },
    // F
    { letter: 'f', word: 'Fish',       emoji: '🐟' },
    { letter: 'f', word: 'Frog',       emoji: '🐸' },
    { letter: 'f', word: 'Flower',     emoji: '🌸' },
    // G
    { letter: 'g', word: 'Grapes',     emoji: '🍇' },
    { letter: 'g', word: 'Giraffe',    emoji: '🦒' },
    { letter: 'g', word: 'Guitar',     emoji: '🎸' },
    // H
    { letter: 'h', word: 'Heart',      emoji: '❤️' },
    { letter: 'h', word: 'Horse',      emoji: '🐴' },
    { letter: 'h', word: 'House',      emoji: '🏠' },
    // I
    { letter: 'i', word: 'Ice Cream',  emoji: '🍦' },
    { letter: 'i', word: 'Igloo',      emoji: '🏔️' },
    // J
    { letter: 'j', word: 'Jellyfish',  emoji: '🪼' },
    { letter: 'j', word: 'Juice',      emoji: '🧃' },
    // K
    { letter: 'k', word: 'Kite',       emoji: '🪁' },
    { letter: 'k', word: 'Kangaroo',   emoji: '🦘' },
    { letter: 'k', word: 'Key',        emoji: '🔑' },
    // L
    { letter: 'l', word: 'Lion',       emoji: '🦁' },
    { letter: 'l', word: 'Ladybug',    emoji: '🐞' },
    { letter: 'l', word: 'Lemon',      emoji: '🍋' },
    // M
    { letter: 'm', word: 'Moon',       emoji: '🌙' },
    { letter: 'm', word: 'Monkey',     emoji: '🐵' },
    { letter: 'm', word: 'Mushroom',   emoji: '🍄' },
    // N
    { letter: 'n', word: 'Nest',       emoji: '🪺' },
    { letter: 'n', word: 'Narwhal',    emoji: '🐳' },
    // O
    { letter: 'o', word: 'Octopus',    emoji: '🐙' },
    { letter: 'o', word: 'Owl',        emoji: '🦉' },
    { letter: 'o', word: 'Orange',     emoji: '🍊' },
    // P
    { letter: 'p', word: 'Penguin',    emoji: '🐧' },
    { letter: 'p', word: 'Pizza',      emoji: '🍕' },
    { letter: 'p', word: 'Panda',      emoji: '🐼' },
    // Q
    { letter: 'q', word: 'Queen',      emoji: '👑' },
    { letter: 'q', word: 'Quail',      emoji: '🐦' },
    // R
    { letter: 'r', word: 'Rainbow',    emoji: '🌈' },
    { letter: 'r', word: 'Rabbit',     emoji: '🐰' },
    { letter: 'r', word: 'Rocket',     emoji: '🚀' },
    // S
    { letter: 's', word: 'Star',       emoji: '⭐' },
    { letter: 's', word: 'Snake',      emoji: '🐍' },
    { letter: 's', word: 'Sun',        emoji: '☀️' },
    // T
    { letter: 't', word: 'Turtle',     emoji: '🐢' },
    { letter: 't', word: 'Tiger',      emoji: '🐯' },
    { letter: 't', word: 'Tree',       emoji: '🌳' },
    // U
    { letter: 'u', word: 'Umbrella',   emoji: '☂️' },
    { letter: 'u', word: 'Unicorn',    emoji: '🦄' },
    // V
    { letter: 'v', word: 'Violin',     emoji: '🎻' },
    { letter: 'v', word: 'Volcano',    emoji: '🌋' },
    // W
    { letter: 'w', word: 'Whale',      emoji: '🐋' },
    { letter: 'w', word: 'Watermelon', emoji: '🍉' },
    { letter: 'w', word: 'Worm',       emoji: '🪱' },
    // X
    { letter: 'x', word: 'Xylophone',  emoji: '🎵' },
    { letter: 'x', word: 'X-ray',      emoji: '🩻' },
    // Y
    { letter: 'y', word: 'Yarn',       emoji: '🧶' },
    { letter: 'y', word: 'Yak',        emoji: '🐃' },
    // Z
    { letter: 'z', word: 'Zebra',      emoji: '🦓' },
    { letter: 'z', word: 'Zap',        emoji: '⚡' }
];

// Similar-sounding/looking letters for distractors
var PP_SIMILAR = {
    'a': ['e', 'o', 'u', 'i'],
    'b': ['d', 'p', 'g', 'q'],
    'c': ['k', 's', 'g', 'o'],
    'd': ['b', 'p', 'g', 'q'],
    'e': ['a', 'i', 'o', 'u'],
    'f': ['v', 't', 's', 'p'],
    'g': ['q', 'd', 'b', 'j'],
    'h': ['n', 'b', 'k', 'm'],
    'i': ['l', 'j', 'e', 't'],
    'j': ['g', 'i', 'l', 'y'],
    'k': ['c', 'g', 'x', 'q'],
    'l': ['i', 'j', 't', 'f'],
    'm': ['n', 'w', 'h', 'r'],
    'n': ['m', 'h', 'r', 'u'],
    'o': ['c', 'a', 'e', 'u'],
    'p': ['b', 'q', 'd', 'g'],
    'q': ['p', 'g', 'o', 'c'],
    'r': ['n', 'l', 'v', 'p'],
    's': ['z', 'c', 'x', 'f'],
    't': ['f', 'l', 'i', 'j'],
    'u': ['v', 'n', 'w', 'o'],
    'v': ['u', 'w', 'f', 'y'],
    'w': ['v', 'm', 'u', 'n'],
    'x': ['k', 'z', 's', 'y'],
    'y': ['v', 'g', 'j', 'i'],
    'z': ['s', 'x', 'n', 'c']
};

// Dino reactions based on combo streak
var DINO_COMBO_MESSAGES = [
    '',
    '',
    '🔥 2 in a row!',
    '🔥 3 in a row! Amazing!',
    '🔥🔥 4 in a row! WOW!',
    '🔥🔥🔥 5 in a row! SUPERSTAR!',
    '⭐🔥⭐ 6 in a row! UNSTOPPABLE!',
    '🌟🔥🌟 7 in a row! LEGENDARY!',
    '🏆🔥🏆 8 in a row! CHAMPION!',
    '👑🔥👑 9 in a row! INCREDIBLE!',
    '🦕💥🦕 10 in a row! DINO-MITE!'
];

// ========================================
// GAME STATE
// ========================================

var ppState = {
    difficulty: 'easy',
    totalRounds: 26,
    currentRound: 0,
    correctCount: 0,
    wrongCount: 0,
    isAnswered: false,
    usedPictures: [],
    roundHistory: [],
    currentPicture: null,
    comboStreak: 0,
    bestStreak: 0
};

// ========================================
// TIMER MANAGEMENT
// ========================================

var ppTimers = [];

function clearPpTimers() {
    for (var i = 0; i < ppTimers.length; i++) {
        clearTimeout(ppTimers[i]);
    }
    ppTimers = [];
}

function ppDelay(fn, ms) {
    var id = setTimeout(fn, ms);
    ppTimers.push(id);
    return id;
}

// ========================================
// DIFFICULTY
// ========================================

function setPpDifficulty(level) {
    ppState.difficulty = level;
    var buttons = document.querySelectorAll('.diff-btn');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active');
    }
    document.getElementById('pp-diff-' + level).classList.add('active');
}

function getPpChoiceCount() {
    if (ppState.difficulty === 'easy') return 3;
    if (ppState.difficulty === 'medium') return 4;
    return 5;
}

// ========================================
// SCREEN MANAGEMENT
// ========================================

function showPpScreen(id) {
    var screens = document.querySelectorAll('.screen');
    for (var i = 0; i < screens.length; i++) {
        screens[i].classList.remove('active');
    }
    document.getElementById(id).classList.add('active');
}

// ========================================
// CATERPILLAR PROGRESS
// ========================================

function buildCaterpillar() {
    var container = document.getElementById('pp-caterpillar');
    container.innerHTML = '';

    // Head
    var head = document.createElement('div');
    head.className = 'pp-cat-segment head';
    head.textContent = '🐛';
    container.appendChild(head);

    // Body segments (one per round)
    for (var i = 0; i < ppState.totalRounds; i++) {
        var seg = document.createElement('div');
        seg.className = 'pp-cat-segment';
        seg.setAttribute('data-round', (i + 1).toString());
        if (i === 0) seg.classList.add('current');
        container.appendChild(seg);
    }
}

function updateCaterpillar(round, wasCorrect) {
    var segments = document.querySelectorAll('.pp-cat-segment[data-round]');

    // Mark completed segment
    for (var i = 0; i < segments.length; i++) {
        var segRound = parseInt(segments[i].getAttribute('data-round'));
        if (segRound === round) {
            segments[i].classList.remove('current');
            segments[i].classList.add(wasCorrect ? 'correct' : 'wrong');
            segments[i].textContent = wasCorrect ? '✅' : '❌';
        } else if (segRound === round + 1) {
            segments[i].classList.add('current');
        }
    }
}

// ========================================
// COMBO SYSTEM
// ========================================

function updateCombo(correct) {
    var comboEl = document.getElementById('pp-combo');

    if (correct) {
        ppState.comboStreak++;
        if (ppState.comboStreak > ppState.bestStreak) {
            ppState.bestStreak = ppState.comboStreak;
        }

        if (ppState.comboStreak >= 2) {
            var msgIndex = Math.min(ppState.comboStreak, DINO_COMBO_MESSAGES.length - 1);
            var msg = DINO_COMBO_MESSAGES[msgIndex];

            var cssClass = 'pp-combo-text';
            if (ppState.comboStreak >= 5) cssClass += ' super';
            else if (ppState.comboStreak >= 3) cssClass += ' fire';

            comboEl.innerHTML = '<span class="' + cssClass + '">' + msg + '</span>';
        } else {
            comboEl.innerHTML = '';
        }
    } else {
        ppState.comboStreak = 0;
        comboEl.innerHTML = '';
    }
}

// ========================================
// DINO CHEERLEADER
// ========================================

function setDinoMood(mood) {
    var dino = document.getElementById('pp-dino');
    if (!dino) return;

    dino.classList.remove('celebrating', 'excited', 'thinking');

    if (mood === 'celebrate') {
        dino.classList.add('celebrating');
    } else if (mood === 'excited') {
        dino.classList.add('excited');
    } else if (mood === 'think') {
        dino.classList.add('thinking');
    }
}

// ========================================
// STAR BURST EFFECT
// ========================================

function createStarBurst() {
    var pictureArea = document.getElementById('pp-picture-area');
    var burst = document.createElement('div');
    burst.className = 'pp-starburst';

    var starEmojis = ['⭐', '✨', '🌟', '💫', '⭐', '✨', '🌟', '💫'];
    var angles = [0, 45, 90, 135, 180, 225, 270, 315];

    for (var i = 0; i < starEmojis.length; i++) {
        var star = document.createElement('span');
        star.className = 'pp-burst-star';
        star.textContent = starEmojis[i];

        var angle = angles[i] * (Math.PI / 180);
        var distance = 50 + Math.random() * 30;
        var bx = Math.cos(angle) * distance;
        var by = Math.sin(angle) * distance;

        star.style.setProperty('--bx', bx + 'px');
        star.style.setProperty('--by', by + 'px');
        star.style.animationDelay = (i * 0.05) + 's';

        burst.appendChild(star);
    }

    pictureArea.appendChild(burst);

    setTimeout(function() {
        if (burst.parentNode) burst.parentNode.removeChild(burst);
    }, 1200);
}

// ========================================
// STAR TRAIL EFFECT
// ========================================

function createStarTrail() {
    var starCounter = document.getElementById('star-counter');
    if (!starCounter) return;

    var counterRect = starCounter.getBoundingClientRect();
    var pictureEl = document.getElementById('pp-picture');
    if (!pictureEl) return;

    var picRect = pictureEl.getBoundingClientRect();
    var startX = picRect.left + picRect.width / 2;
    var startY = picRect.top + picRect.height / 2;
    var endX = counterRect.left + counterRect.width / 2;
    var endY = counterRect.top + counterRect.height / 2;

    var stars = ['⭐', '🌟', '✨'];
    for (var i = 0; i < 3; i++) {
        var trail = document.createElement('div');
        trail.className = 'pp-star-trail';
        trail.textContent = stars[i];
        trail.style.left = startX + 'px';
        trail.style.top = startY + 'px';

        var midX = (endX - startX) * 0.5 + (Math.random() - 0.5) * 60;
        var midY = (endY - startY) * 0.5 - 50 - Math.random() * 40;
        trail.style.setProperty('--tx', midX + 'px');
        trail.style.setProperty('--ty', midY + 'px');
        trail.style.setProperty('--fx', (endX - startX) + 'px');
        trail.style.setProperty('--fy', (endY - startY) + 'px');
        trail.style.animationDelay = (i * 0.15) + 's';

        document.body.appendChild(trail);

        (function(el) {
            setTimeout(function() {
                if (el.parentNode) el.parentNode.removeChild(el);
            }, 1200);
        })(trail);
    }
}

// ========================================
// START GAME
// ========================================

function startPicturePhonics() {
    ppState.currentRound = 0;
    ppState.correctCount = 0;
    ppState.wrongCount = 0;
    ppState.isAnswered = false;
    ppState.usedPictures = [];
    ppState.roundHistory = [];
    ppState.comboStreak = 0;
    ppState.bestStreak = 0;

    document.getElementById('pp-score-correct').textContent = '✅ 0';
    document.getElementById('pp-score-wrong').textContent = '❌ 0';
    document.getElementById('pp-combo').innerHTML = '';

    showPpScreen('pp-game');
    buildCaterpillar();
    clearPpTimers();
    AudioManager.stopAll();

    // Play instruction then start first round
    AudioManager.playInstruction('pick_letter')
        .then(function() {
            ppDelay(function() { nextPpRound(); }, 300);
        })
        .catch(function() {
            ppDelay(function() { nextPpRound(); }, 2500);
        });
}

// ========================================
// NEXT ROUND
// ========================================

function nextPpRound() {
    clearPpTimers();
    AudioManager.stopAll();

    ppState.currentRound++;
    ppState.isAnswered = false;

    if (ppState.currentRound > ppState.totalRounds) {
        showPpResults();
        return;
    }

    // Update progress text
    document.getElementById('pp-round-text').textContent =
        'Round ' + ppState.currentRound + ' of ' + ppState.totalRounds;
    document.getElementById('pp-feedback').innerHTML = '';
    document.getElementById('pp-teaching').innerHTML = '';

    setDinoMood('think');

    // Pick unused picture
    var available = [];
    for (var a = 0; a < PP_PICTURES.length; a++) {
        if (ppState.usedPictures.indexOf(a) === -1) available.push(a);
    }
    if (available.length === 0) {
        ppState.usedPictures = [];
        for (var b = 0; b < PP_PICTURES.length; b++) available.push(b);
    }

    var picIndex = available[Math.floor(Math.random() * available.length)];
    ppState.usedPictures.push(picIndex);

    var picture = PP_PICTURES[picIndex];
    ppState.currentPicture = picture;

    // Set prompt
    document.getElementById('pp-prompt-text').textContent =
        'What letter does ' + picture.word + ' start with?';

    // Set picture with animation
    var pictureEl = document.getElementById('pp-picture');
    pictureEl.textContent = picture.emoji;
    pictureEl.className = 'pp-picture'; // reset classes
    void pictureEl.offsetHeight; // trigger reflow
    // pictureAppear runs by default, then switch to wobble after
    ppDelay(function() {
        pictureEl.classList.add('wobble');
    }, 700);

    // Set word (has its own fade-in animation via CSS)
    var wordEl = document.getElementById('pp-picture-word');
    wordEl.style.animation = 'none';
    void wordEl.offsetHeight;
    wordEl.style.animation = 'wordFadeIn 0.5s ease 0.4s forwards';
    wordEl.style.opacity = '0';
    wordEl.textContent = picture.word;

    // Build choices
    generatePpChoices(picture);

    // Speak the word after picture appears
    ppDelay(function() {
        speakPictureWord();
    }, 700);
}

// ========================================
// SPEAK PICTURE WORD
// ========================================

function speakPictureWord() {
    if (!ppState.currentPicture) return;
    var word = ppState.currentPicture.word;

    // Try to use existing audio for known words, fallback to TTS
    var letter = ppState.currentPicture.letter;

    // Check if this word matches the letter's default word in phonics
    if (AudioManager.isLoaded && AudioManager.audioManifest &&
        AudioManager.audioManifest.letters && AudioManager.audioManifest.letters[letter]) {
        // Use the word audio for this letter
        AudioManager.play(AudioManager.audioManifest.letters[letter].word)
            .catch(function() {
                Speech.speak(word, 0.8, 1.1);
            });
    } else {
        Speech.speak(word, 0.8, 1.1);
    }
}

function replayPictureWord() {
    if (ppState.isAnswered) return;
    clearPpTimers();
    AudioManager.stopAll();

    var btn = document.getElementById('pp-hear-btn');
    btn.classList.add('playing');

    speakPictureWord();

    ppDelay(function() {
        btn.classList.remove('playing');
    }, 1500);
}

// ========================================
// GENERATE CHOICES
// ========================================

function generatePpChoices(picture) {
    var correctLetter = picture.letter;
    var choiceCount = getPpChoiceCount();
    var choices = [correctLetter];

    // Add similar letters as distractors
    var similar = PP_SIMILAR[correctLetter] || [];
    var shuffledSimilar = shufflePpArray(similar.slice());

    for (var i = 0; i < shuffledSimilar.length && choices.length < choiceCount; i++) {
        if (choices.indexOf(shuffledSimilar[i]) === -1) {
            choices.push(shuffledSimilar[i]);
        }
    }

    // Fill remaining with random
    while (choices.length < choiceCount) {
        var randomLetter = String.fromCharCode(97 + Math.floor(Math.random() * 26));
        if (choices.indexOf(randomLetter) === -1) {
            choices.push(randomLetter);
        }
    }

    choices = shufflePpArray(choices);

    // Render choices
    var container = document.getElementById('pp-choices');
    container.innerHTML = '';

    for (var j = 0; j < choices.length; j++) {
        var letter = choices[j];
        var btn = document.createElement('button');
        btn.className = 'pp-choice-btn fly-in';
        btn.innerHTML =
            '<span class="pp-choice-upper">' + letter.toUpperCase() + '</span>' +
            '<span class="pp-choice-lower">' + letter + '</span>';
        btn.setAttribute('data-letter', letter);

        (function(l) {
            btn.addEventListener('click', function() {
                handlePpChoice(l, this);
            });
        })(letter);

        container.appendChild(btn);
    }
}

// ========================================
// HANDLE CHOICE
// ========================================

function handlePpChoice(selectedLetter, btnEl) {
    if (ppState.isAnswered) return;
    ppState.isAnswered = true;

    clearPpTimers();
    AudioManager.stopAll();

    var picture = ppState.currentPicture;
    var correctLetter = picture.letter;
    var isCorrect = selectedLetter === correctLetter;
    var feedback = document.getElementById('pp-feedback');
    var teaching = document.getElementById('pp-teaching');
    var pictureEl = document.getElementById('pp-picture');

    // Disable all buttons
    var allBtns = document.querySelectorAll('.pp-choice-btn');
    for (var i = 0; i < allBtns.length; i++) {
        allBtns[i].classList.add('disabled');
    }

    if (isCorrect) {
        // === CORRECT ===
        btnEl.classList.add('correct');
        ppState.correctCount++;
        document.getElementById('pp-score-correct').textContent = '✅ ' + ppState.correctCount;

        // Update combo
        updateCombo(true);

        // Picture celebrates
        pictureEl.className = 'pp-picture celebrate';

        // Star burst around picture
        createStarBurst();

        // Star trail to counter
        ppDelay(function() { createStarTrail(); }, 300);

        // Dino celebrates
        setDinoMood('celebrate');
        if (ppState.comboStreak >= 3) {
            setDinoMood('excited');
        }

        feedback.innerHTML = '<div class="feedback-msg correct">🎉 Yes! ' +
            correctLetter.toUpperCase() + correctLetter + ' for ' + picture.word + '!</div>';

        teaching.innerHTML =
            '<div class="teaching-msg">' +
                '<span class="teaching-letter">' + correctLetter.toUpperCase() + correctLetter + '</span> ' +
                picture.word + ' starts with ' + correctLetter.toUpperCase() + '!' +
            '</div>';

        // Update caterpillar
        updateCaterpillar(ppState.currentRound, true);

        ppState.roundHistory.push({
            picture: picture,
            correct: true
        });

        Rewards.addStar('phonics');
        updatePpStars();

        if (ppState.comboStreak >= 3 || ppState.correctCount % 3 === 0) {
            launchConfetti();
        }

        // Audio sequence: celebration → letter sound → next round
        ppDelay(function() {
            AudioManager.playCelebration()
                .then(function() {
                    return AudioManager.playPhonicsSound(correctLetter);
                })
                .then(function() {
                    ppDelay(function() { nextPpRound(); }, 600);
                })
                .catch(function() {
                    ppDelay(function() { nextPpRound(); }, 2500);
                });
        }, 400);

    } else {
        // === WRONG ===
        btnEl.classList.add('wrong');
        ppState.wrongCount++;
        document.getElementById('pp-score-wrong').textContent = '❌ ' + ppState.wrongCount;

        // Reset combo
        updateCombo(false);

        // Picture goes sad
        pictureEl.className = 'pp-picture sad';

        setDinoMood('think');

        // Highlight correct answer
        for (var k = 0; k < allBtns.length; k++) {
            if (allBtns[k].getAttribute('data-letter') === correctLetter) {
                allBtns[k].classList.add('hint');
            }
        }

        feedback.innerHTML = '<div class="feedback-msg wrong">Oops! ' +
            picture.word + ' starts with ' + correctLetter.toUpperCase() + correctLetter + '!</div>';

        teaching.innerHTML =
            '<div class="teaching-msg">' +
                '<span class="teaching-letter">' + correctLetter.toUpperCase() + correctLetter + '</span> ' +
                picture.word + ' starts with ' + correctLetter.toUpperCase() + '!' +
            '</div>';

        // Update caterpillar
        updateCaterpillar(ppState.currentRound, false);

        ppState.roundHistory.push({
            picture: picture,
            correct: false,
            chosen: selectedLetter
        });

        // Audio sequence: try_again → enable retry
        ppDelay(function() {
            AudioManager.playInstruction('try_again')
                .then(function() {
                    enablePpRetry(allBtns, feedback, teaching, picture);
                })
                .catch(function() {
                    ppDelay(function() {
                        enablePpRetry(allBtns, feedback, teaching, picture);
                    }, 1500);
                });
        }, 300);
    }
}

// ========================================
// RETRY — Let child tap the correct one
// ========================================

function enablePpRetry(allBtns, feedback, teaching, picture) {
    ppState.isAnswered = false;

    var correctLetter = picture.letter;

    document.getElementById('pp-prompt-text').textContent =
        'Tap ' + correctLetter.toUpperCase() + correctLetter + ' for ' + picture.word + '!';

    // Enable only the correct button
    for (var n = 0; n < allBtns.length; n++) {
        if (allBtns[n].getAttribute('data-letter') === correctLetter) {
            allBtns[n].classList.remove('wrong', 'disabled');
            allBtns[n].classList.add('hint');

            (function(btn, letter, pic) {
                btn.onclick = function() {
                    if (ppState.isAnswered) return;
                    ppState.isAnswered = true;

                    clearPpTimers();
                    AudioManager.stopAll();

                    btn.classList.remove('hint');
                    btn.classList.add('correct');

                    // Picture celebrates on retry success too
                    var pictureEl = document.getElementById('pp-picture');
                    pictureEl.className = 'pp-picture celebrate';
                    createStarBurst();

                    setDinoMood('celebrate');

                    feedback.innerHTML = '<div class="feedback-msg correct">🎉 That\'s ' +
                        letter.toUpperCase() + letter + '! ' + pic.word + '!</div>';

                    // Disable all buttons
                    var btns = document.querySelectorAll('.pp-choice-btn');
                    for (var p = 0; p < btns.length; p++) {
                        btns[p].classList.add('disabled');
                    }

                    // Audio: celebration → phonics sound → next round
                    ppDelay(function() {
                        AudioManager.playCelebration()
                            .then(function() {
                                return AudioManager.playPhonicsSound(letter);
                            })
                            .then(function() {
                                ppDelay(function() { nextPpRound(); }, 600);
                            })
                            .catch(function() {
                                ppDelay(function() { nextPpRound(); }, 2500);
                            });
                    }, 300);
                };
            })(allBtns[n], correctLetter, picture);
        }
    }
}

// ========================================
// RESULTS
// ========================================

function showPpResults() {
    clearPpTimers();
    AudioManager.stopAll();
    showPpScreen('pp-results');

    var score = ppState.correctCount;
    var total = ppState.totalRounds;
    var pct = Math.round((score / total) * 100);

    var stars = pct >= 90 ? 5 : pct >= 70 ? 4 : pct >= 50 ? 3 : pct >= 30 ? 2 : 1;
    var starsHtml = '';
    for (var i = 0; i < 5; i++) {
        starsHtml += (i < stars) ? '⭐' : '☆';
    }
    document.getElementById('pp-results-stars').innerHTML = starsHtml;

    var title = document.getElementById('pp-results-title');
    var mascot = document.getElementById('pp-results-mascot');
    var name = ChildName.get() || 'friend';

    if (pct >= 90) {
        title.textContent = 'SUPERSTAR, ' + name + '!';
        mascot.textContent = '🦕🏆';
    } else if (pct >= 70) {
        title.textContent = 'Great Job, ' + name + '!';
        mascot.textContent = '🦕⭐';
    } else if (pct >= 50) {
        title.textContent = 'Good Try, ' + name + '!';
        mascot.textContent = '🦕😊';
    } else {
        title.textContent = 'Keep Practicing, ' + name + '!';
        mascot.textContent = '🦕💪';
    }

    var resultText = 'You got <strong>' + score + ' out of ' + total + '</strong> correct!<br>' +
        'That\'s ' + pct + '%!';

    if (ppState.bestStreak >= 3) {
        resultText += '<br>🔥 Best streak: ' + ppState.bestStreak + ' in a row!';
    }

    document.getElementById('pp-results-text').innerHTML = resultText;

    // Review wrong answers
    var reviewEl = document.getElementById('pp-results-review');
    var wrongOnes = [];
    for (var j = 0; j < ppState.roundHistory.length; j++) {
        if (!ppState.roundHistory[j].correct) {
            wrongOnes.push(ppState.roundHistory[j]);
        }
    }

    if (wrongOnes.length > 0) {
        var reviewHtml = '<div class="review-title">Letters to practice:</div>';
        for (var k = 0; k < wrongOnes.length; k++) {
            var item = wrongOnes[k];
            reviewHtml += '<div class="review-item">' +
                '<span class="review-pair">' + item.picture.emoji + ' ' +
                    item.picture.word + ' → ' +
                    item.picture.letter.toUpperCase() + item.picture.letter + '</span>' +
                '<span>You picked: ' + item.chosen.toUpperCase() + item.chosen + '</span>' +
                '<span class="review-status">📝</span>' +
                '</div>';
        }
        reviewEl.innerHTML = reviewHtml;
    } else {
        reviewEl.innerHTML = '<div class="review-title">🎉 Perfect score! No mistakes!</div>';
    }

    // Celebration audio
    ppDelay(function() {
        if (pct >= 70) {
            launchConfetti();
            AudioManager.playCelebration();
        } else {
            AudioManager.playInstruction('lets_learn');
        }
    }, 800);

    updatePpStars();
}

// ========================================
// HELPERS
// ========================================

function updatePpStars() {
    var el = document.getElementById('star-counter');
    if (el) el.textContent = '⭐ ' + Rewards.getStars('phonics');
}

function shufflePpArray(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = a[i];
        a[i] = a[j];
        a[j] = t;
    }
    return a;
}

// ========================================
// INIT
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    updatePpStars();
});