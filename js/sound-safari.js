/* ========================================
   Sound Safari Game
   ========================================
   Prisha hears a phonics sound and must
   pick the correct letter.
   ======================================== */

// --- Letter data with phonics for this game ---
var SAFARI_LETTERS = [
    { upper: 'A', lower: 'a', phonics: 'aah', word: 'Apple',     emoji: '🍎' },
    { upper: 'B', lower: 'b', phonics: 'bah', word: 'Butterfly',  emoji: '🦋' },
    { upper: 'C', lower: 'c', phonics: 'kah', word: 'Cat',        emoji: '🐱' },
    { upper: 'D', lower: 'd', phonics: 'dah', word: 'Dinosaur',   emoji: '🦕' },
    { upper: 'E', lower: 'e', phonics: 'ehh', word: 'Elephant',   emoji: '🐘' },
    { upper: 'F', lower: 'f', phonics: 'fah', word: 'Fish',       emoji: '🐟' },
    { upper: 'G', lower: 'g', phonics: 'gah', word: 'Grapes',     emoji: '🍇' },
    { upper: 'H', lower: 'h', phonics: 'hah', word: 'Heart',      emoji: '❤️' },
    { upper: 'I', lower: 'i', phonics: 'iih', word: 'Ice Cream',  emoji: '🍦' },
    { upper: 'J', lower: 'j', phonics: 'jah', word: 'Jellyfish',  emoji: '🪼' },
    { upper: 'K', lower: 'k', phonics: 'kah', word: 'Kite',       emoji: '🪁' },
    { upper: 'L', lower: 'l', phonics: 'lah', word: 'Lion',       emoji: '🦁' },
    { upper: 'M', lower: 'm', phonics: 'mah', word: 'Moon',       emoji: '🌙' },
    { upper: 'N', lower: 'n', phonics: 'nah', word: 'Nest',       emoji: '🪺' },
    { upper: 'O', lower: 'o', phonics: 'awe', word: 'Octopus',    emoji: '🐙' },
    { upper: 'P', lower: 'p', phonics: 'pah', word: 'Penguin',    emoji: '🐧' },
    { upper: 'Q', lower: 'q', phonics: 'kwah', word: 'Queen',     emoji: '👑' },
    { upper: 'R', lower: 'r', phonics: 'rah', word: 'Rainbow',    emoji: '🌈' },
    { upper: 'S', lower: 's', phonics: 'sah', word: 'Star',       emoji: '⭐' },
    { upper: 'T', lower: 't', phonics: 'tah', word: 'Turtle',     emoji: '🐢' },
    { upper: 'U', lower: 'u', phonics: 'uhh', word: 'Umbrella',   emoji: '☂️' },
    { upper: 'V', lower: 'v', phonics: 'vah', word: 'Violin',     emoji: '🎻' },
    { upper: 'W', lower: 'w', phonics: 'wah', word: 'Whale',      emoji: '🐋' },
    { upper: 'X', lower: 'x', phonics: 'ecks', word: 'Xylophone', emoji: '🎵' },
    { upper: 'Y', lower: 'y', phonics: 'yah', word: 'Yarn',       emoji: '🧶' },
    { upper: 'Z', lower: 'z', phonics: 'zah', word: 'Zebra',      emoji: '🦓' }
];

// --- Similar SOUNDING letters (different from visually similar) ---
var SIMILAR_SOUNDS = {
    'a': ['e', 'u', 'o'],
    'b': ['d', 'p', 'g'],
    'c': ['k', 'g', 't'],
    'd': ['b', 't', 'g'],
    'e': ['i', 'a', 'u'],
    'f': ['v', 's', 'h'],
    'g': ['d', 'b', 'k'],
    'h': ['f', 'a', 'e'],
    'i': ['e', 'a', 'y'],
    'j': ['g', 'z', 'ch'],
    'k': ['c', 'g', 't'],
    'l': ['r', 'n', 'w'],
    'm': ['n', 'b', 'w'],
    'n': ['m', 'l', 'd'],
    'o': ['u', 'a', 'e'],
    'p': ['b', 't', 'k'],
    'q': ['k', 'g', 'c'],
    'r': ['l', 'w', 'n'],
    's': ['z', 'f', 'sh'],
    't': ['d', 'p', 'k'],
    'u': ['o', 'a', 'e'],
    'v': ['f', 'w', 'b'],
    'w': ['v', 'r', 'l'],
    'x': ['s', 'z', 'k'],
    'y': ['i', 'e', 'w'],
    'z': ['s', 'j', 'v']
};

// --- Safari Game State ---
var safariState = {
    difficulty: 'easy',
    totalRounds: 10,
    currentRound: 0,
    correctCount: 0,
    wrongCount: 0,
    usedLetters: [],
    roundHistory: [],
    currentAnswer: null,
    isAnswered: false
};

// --- Difficulty ---
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

// --- Screen Management ---
function showSafariScreen(screenId) {
    var screens = document.querySelectorAll('.screen');
    for (var i = 0; i < screens.length; i++) {
        screens[i].classList.remove('active');
    }
    document.getElementById(screenId).classList.add('active');
}

// --- Start Safari ---
function startSafari() {
    safariState.currentRound = 0;
    safariState.correctCount = 0;
    safariState.wrongCount = 0;
    safariState.usedLetters = [];
    safariState.roundHistory = [];
    safariState.isAnswered = false;

    document.getElementById('safari-score-correct').textContent = '✅ 0';
    document.getElementById('safari-score-wrong').textContent = '❌ 0';

    showSafariScreen('safari-game');

    AudioManager.stopAll();

    // Play instruction then start
    AudioManager.playInstruction('listen_carefully');

    setTimeout(function() {
        nextSafariRound();
    }, 2500);
}

// --- Next Round ---
function nextSafariRound() {
    safariState.currentRound++;
    safariState.isAnswered = false;

    if (safariState.currentRound > safariState.totalRounds) {
        showSafariResults();
        return;
    }

    // Pick random unused letter
    var available = [];
    for (var i = 0; i < SAFARI_LETTERS.length; i++) {
        var letter = SAFARI_LETTERS[i].lower;
        if (safariState.usedLetters.indexOf(letter) === -1) {
            available.push(i);
        }
    }

    if (available.length === 0) {
        safariState.usedLetters = [];
        for (var j = 0; j < SAFARI_LETTERS.length; j++) {
            available.push(j);
        }
    }

    var correctIndex = available[Math.floor(Math.random() * available.length)];
    safariState.currentAnswer = SAFARI_LETTERS[correctIndex];
    safariState.usedLetters.push(safariState.currentAnswer.lower);

    // Update UI
    document.getElementById('safari-round-text').textContent = 'Round ' + safariState.currentRound + ' of ' + safariState.totalRounds;
    document.getElementById('safari-progress-fill').style.width = (((safariState.currentRound - 1) / safariState.totalRounds) * 100) + '%';
    document.getElementById('safari-prompt-text').textContent = 'What letter makes this sound?';
    document.getElementById('safari-feedback').innerHTML = '';
    document.getElementById('teaching-moment').innerHTML = '';

    // Reset play button
    var playBtn = document.getElementById('safari-play-btn');
    playBtn.classList.remove('playing');
    document.getElementById('sound-waves').classList.remove('active');

    // Generate choices
    generateSafariChoices(safariState.currentAnswer);

    // Auto-play the sound after a short delay
    setTimeout(function() {
        playCurrentSound();
    }, 600);
}

// --- Play Current Phonics Sound ---
function playCurrentSound() {
    if (!safariState.currentAnswer) return;

    AudioManager.stopAll();

    var playBtn = document.getElementById('safari-play-btn');
    var waves = document.getElementById('sound-waves');

    // Visual feedback
    playBtn.classList.add('playing');
    waves.classList.add('active');

    // Play the phonics sound
    AudioManager.playPhonicsSound(safariState.currentAnswer.lower);

    // Remove visual feedback after sound duration
    setTimeout(function() {
        playBtn.classList.remove('playing');
        waves.classList.remove('active');
    }, 1500);
}

// --- Replay Sound (button click) ---
function replaySound() {
    if (safariState.isAnswered) return;
    playCurrentSound();
}

// --- Generate Choices ---
function generateSafariChoices(correctData) {
    var choiceCount = getSafariChoiceCount();
    var choiceIndices = [SAFARI_LETTERS.indexOf(correctData)];

    // Get similar sounding letters
    var similar = SIMILAR_SOUNDS[correctData.lower] || [];
    var shuffledSimilar = shuffleArray2(similar.slice());

    for (var i = 0; i < shuffledSimilar.length && choiceIndices.length < choiceCount; i++) {
        var similarLetter = shuffledSimilar[i];
        // Find index of this letter in SAFARI_LETTERS
        for (var j = 0; j < SAFARI_LETTERS.length; j++) {
            if (SAFARI_LETTERS[j].lower === similarLetter && choiceIndices.indexOf(j) === -1) {
                choiceIndices.push(j);
                break;
            }
        }
    }

    // Fill remaining with random letters
    while (choiceIndices.length < choiceCount) {
        var randomIndex = Math.floor(Math.random() * SAFARI_LETTERS.length);
        if (choiceIndices.indexOf(randomIndex) === -1) {
            choiceIndices.push(randomIndex);
        }
    }

    // Shuffle
    choiceIndices = shuffleArray2(choiceIndices);

    // Render
    var container = document.getElementById('safari-choices');
    container.innerHTML = '';

    for (var k = 0; k < choiceIndices.length; k++) {
        var letterData = SAFARI_LETTERS[choiceIndices[k]];
        var btn = document.createElement('button');
        btn.className = 'safari-choice-btn';
        btn.setAttribute('data-letter', letterData.lower);
        btn.innerHTML =
            '<span class="safari-choice-upper">' + letterData.upper + '</span>' +
            '<span class="safari-choice-lower">' + letterData.lower + '</span>';

        (function(data) {
            btn.addEventListener('click', function() {
                handleSafariChoice(data, this);
            });
        })(letterData);

        container.appendChild(btn);
    }
}

// --- Handle Choice ---
function handleSafariChoice(selectedData, buttonElement) {
    if (safariState.isAnswered) return;
    safariState.isAnswered = true;

    AudioManager.stopAll();

    var isCorrect = selectedData.lower === safariState.currentAnswer.lower;
    var feedbackArea = document.getElementById('safari-feedback');
    var teachingArea = document.getElementById('teaching-moment');

    // Disable all buttons
    var allButtons = document.querySelectorAll('.safari-choice-btn');
    for (var i = 0; i < allButtons.length; i++) {
        allButtons[i].classList.add('disabled');
    }

    if (isCorrect) {
        buttonElement.classList.add('correct');
        safariState.correctCount++;
        document.getElementById('safari-score-correct').textContent = '✅ ' + safariState.correctCount;

        feedbackArea.innerHTML = '<div class="feedback-msg correct">🎉 Correct!</div>';

        // Teaching moment
        var answer = safariState.currentAnswer;
        teachingArea.innerHTML =
            '<div class="teaching-msg">' +
                '<span class="teaching-emoji">' + answer.emoji + '</span> ' +
                answer.upper + ' says "' + answer.phonics + '" — ' +
                answer.upper + ' is for ' + answer.word + '!' +
            '</div>';

        safariState.roundHistory.push({
            letter: answer.lower,
            phonics: answer.phonics,
            word: answer.word,
            correct: true
        });

        Rewards.addStar('phonics');
        updateSafariStars();

        // Play celebration
        setTimeout(function() {
            AudioManager.playCelebration();
        }, 200);

        // Then play the sentence for learning
        setTimeout(function() {
            AudioManager.playSentence(answer.lower);
        }, 2000);

        if (safariState.correctCount % 3 === 0) {
            launchConfetti();
        }

        // Next round
        setTimeout(function() {
            nextSafariRound();
        }, 4000);

    } else {
        buttonElement.classList.add('wrong');
        safariState.wrongCount++;
        document.getElementById('safari-score-wrong').textContent = '❌ ' + safariState.wrongCount;

        // Highlight correct
        for (var k = 0; k < allButtons.length; k++) {
            if (allButtons[k].getAttribute('data-letter') === safariState.currentAnswer.lower) {
                allButtons[k].classList.add('hint');
            }
        }

        var answer2 = safariState.currentAnswer;
        feedbackArea.innerHTML = '<div class="feedback-msg wrong">That was ' + selectedData.upper + '. The answer is ' + answer2.upper + '!</div>';

        // Teaching moment for wrong answer too
        teachingArea.innerHTML =
            '<div class="teaching-msg">' +
                '<span class="teaching-emoji">' + answer2.emoji + '</span> ' +
                answer2.upper + ' says "' + answer2.phonics + '" — ' +
                answer2.upper + ' is for ' + answer2.word + '!' +
            '</div>';

        safariState.roundHistory.push({
            letter: answer2.lower,
            phonics: answer2.phonics,
            word: answer2.word,
            correct: false,
            chosen: selectedData.upper
        });

        // Play try again
        setTimeout(function() {
            AudioManager.playInstruction('try_again');
        }, 200);

        // Let Prisha tap the correct one
        setTimeout(function() {
            safariState.isAnswered = false;

            document.getElementById('safari-prompt-text').textContent = 'Tap the highlighted letter ' + answer2.upper + '!';

            for (var n = 0; n < allButtons.length; n++) {
                if (allButtons[n].getAttribute('data-letter') === answer2.lower) {
                    allButtons[n].classList.remove('wrong', 'disabled');
                    allButtons[n].classList.add('hint');

                    (function(btn) {
                        btn.onclick = function() {
                            if (safariState.isAnswered) return;
                            safariState.isAnswered = true;

                            AudioManager.stopAll();

                            btn.classList.remove('hint');
                            btn.classList.add('correct');
                            feedbackArea.innerHTML = '<div class="feedback-msg correct">🎉 That\'s it!</div>';

                            var btns = document.querySelectorAll('.safari-choice-btn');
                            for (var p = 0; p < btns.length; p++) {
                                btns[p].classList.add('disabled');
                            }

                            setTimeout(function() {
                                AudioManager.playCelebration();
                            }, 200);

                            setTimeout(function() {
                                AudioManager.playSentence(answer2.lower);
                            }, 1800);

                            setTimeout(function() {
                                nextSafariRound();
                            }, 3500);
                        };
                    })(allButtons[n]);
                }
            }
        }, 2500);
    }
}

// --- Show Results ---
function showSafariResults() {
    AudioManager.stopAll();

    showSafariScreen('safari-results');

    var score = safariState.correctCount;
    var total = safariState.totalRounds;
    var percentage = Math.round((score / total) * 100);

    var starCount = 0;
    if (percentage >= 90) starCount = 5;
    else if (percentage >= 70) starCount = 4;
    else if (percentage >= 50) starCount = 3;
    else if (percentage >= 30) starCount = 2;
    else starCount = 1;

    var starsHtml = '';
    for (var i = 0; i < 5; i++) {
        starsHtml += (i < starCount) ? '⭐' : '☆';
    }
    document.getElementById('safari-results-stars').innerHTML = starsHtml;

    var titleEl = document.getElementById('safari-results-title');
    var mascotEl = document.getElementById('safari-results-mascot');

    if (percentage >= 90) {
        titleEl.textContent = 'SUPERSTAR, Prisha!';
        mascotEl.textContent = '🦕🎉';
    } else if (percentage >= 70) {
        titleEl.textContent = 'Great Job, Prisha!';
        mascotEl.textContent = '🦕⭐';
    } else if (percentage >= 50) {
        titleEl.textContent = 'Good Try, Prisha!';
        mascotEl.textContent = '🦕👍';
    } else {
        titleEl.textContent = 'Keep Practicing, Prisha!';
        mascotEl.textContent = '🦕💪';
    }

    document.getElementById('safari-results-text').innerHTML =
        'You got <strong>' + score + ' out of ' + total + '</strong> correct!<br>' +
        'That is ' + percentage + '%!';

    // Review
    var reviewEl = document.getElementById('safari-results-review');
    var wrongOnes = [];
    for (var j = 0; j < safariState.roundHistory.length; j++) {
        if (!safariState.roundHistory[j].correct) {
            wrongOnes.push(safariState.roundHistory[j]);
        }
    }

    if (wrongOnes.length > 0) {
        var reviewHtml = '<div class="review-title">Sounds to practice:</div>';
        for (var k = 0; k < wrongOnes.length; k++) {
            var item = wrongOnes[k];
            reviewHtml += '<div class="review-item">' +
                '<span class="review-pair">"' + item.phonics + '" → ' + item.letter.toUpperCase() + '</span>' +
                '<span>(' + item.word + ')</span>' +
                '<span class="review-status">📝</span>' +
                '</div>';
        }
        reviewEl.innerHTML = reviewHtml;
    } else {
        reviewEl.innerHTML = '<div class="review-title">🎉 Perfect score! Amazing ears, Prisha!</div>';
    }

    setTimeout(function() {
        if (percentage >= 70) {
            launchConfetti();
            AudioManager.playCelebration();
        } else {
            AudioManager.playInstruction('lets_learn');
        }
    }, 800);

    updateSafariStars();
}

// --- Update Stars ---
function updateSafariStars() {
    var el = document.getElementById('star-counter');
    if (el) {
        el.textContent = '⭐ ' + Rewards.getStars('phonics');
    }
}

// --- Shuffle ---
function shuffleArray2(arr) {
    var newArr = arr.slice();
    for (var i = newArr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = newArr[i];
        newArr[i] = newArr[j];
        newArr[j] = temp;
    }
    return newArr;
}

// --- Initialize ---
document.addEventListener('DOMContentLoaded', function() {
    updateSafariStars();
});
