/* ========================================
   Letter Matching Game
   ======================================== */

var SIMILAR_LETTERS = {
    'a': ['e', 'o', 'c', 'u'],
    'b': ['d', 'p', 'q', 'h'],
    'c': ['o', 'e', 'a', 'u'],
    'd': ['b', 'p', 'q', 'g'],
    'e': ['a', 'c', 'o', 'i'],
    'f': ['t', 'l', 'j', 'r'],
    'g': ['q', 'p', 'd', 'j'],
    'h': ['n', 'b', 'k', 'r'],
    'i': ['l', 'j', 't', 'e'],
    'j': ['i', 'g', 'l', 'f'],
    'k': ['h', 'x', 'r', 'l'],
    'l': ['i', 'j', 't', 'f'],
    'm': ['n', 'w', 'h', 'r'],
    'n': ['m', 'h', 'r', 'u'],
    'o': ['c', 'a', 'e', 'u'],
    'p': ['q', 'b', 'd', 'g'],
    'q': ['p', 'g', 'd', 'b'],
    'r': ['n', 'h', 'f', 'v'],
    's': ['z', 'c', 'e', 'a'],
    't': ['f', 'l', 'i', 'j'],
    'u': ['v', 'n', 'c', 'a'],
    'v': ['u', 'w', 'y', 'r'],
    'w': ['v', 'm', 'u', 'n'],
    'x': ['k', 'z', 'y', 'v'],
    'y': ['v', 'g', 'j', 'x'],
    'z': ['s', 'x', 'n', 'r']
};

var gameState = {
    difficulty: 'easy',
    totalRounds: 10,
    currentRound: 0,
    correctCount: 0,
    wrongCount: 0,
    usedLetters: [],
    roundHistory: [],
    currentAnswer: '',
    isAnswered: false
};

// --- Difficulty Setting ---
function setDifficulty(level) {
    gameState.difficulty = level;

    var buttons = document.querySelectorAll('.diff-btn');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active');
    }
    document.getElementById('diff-' + level).classList.add('active');
}

function getChoiceCount() {
    if (gameState.difficulty === 'easy') return 3;
    if (gameState.difficulty === 'medium') return 4;
    return 5;
}

// --- Screen Management ---
function showScreen(screenId) {
    var screens = document.querySelectorAll('.screen');
    for (var i = 0; i < screens.length; i++) {
        screens[i].classList.remove('active');
    }
    document.getElementById(screenId).classList.add('active');
}

// --- Start Game ---
function startGame() {
    gameState.currentRound = 0;
    gameState.correctCount = 0;
    gameState.wrongCount = 0;
    gameState.usedLetters = [];
    gameState.roundHistory = [];
    gameState.isAnswered = false;

    document.getElementById('score-correct').textContent = '✅ 0';
    document.getElementById('score-wrong').textContent = '❌ 0';

    showScreen('match-game');

    // Stop everything, play instruction, THEN start first round after it finishes
    AudioManager.stopAll();

    // Wait for instruction to finish before starting the game
    AudioManager.playInstruction('find_lowercase');

    setTimeout(function() {
        nextRound();
    }, 3000);
}

// --- Generate Next Round ---
function nextRound() {
    gameState.currentRound++;
    gameState.isAnswered = false;

    if (gameState.currentRound > gameState.totalRounds) {
        showResults();
        return;
    }

    // Pick a random letter not yet used
    var available = [];
    for (var i = 0; i < 26; i++) {
        var letter = String.fromCharCode(97 + i);
        if (gameState.usedLetters.indexOf(letter) === -1) {
            available.push(letter);
        }
    }

    if (available.length === 0) {
        gameState.usedLetters = [];
        for (var j = 0; j < 26; j++) {
            available.push(String.fromCharCode(97 + j));
        }
    }

    var correctLetter = available[Math.floor(Math.random() * available.length)];
    gameState.currentAnswer = correctLetter;
    gameState.usedLetters.push(correctLetter);

    // Update UI
    var targetEl = document.getElementById('target-letter');
    targetEl.textContent = correctLetter.toUpperCase();
    targetEl.style.animation = 'none';
    void targetEl.offsetHeight;
    targetEl.style.animation = 'targetPop 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';

    document.getElementById('game-round-text').textContent = 'Round ' + gameState.currentRound + ' of ' + gameState.totalRounds;
    document.getElementById('game-progress-fill').style.width = (((gameState.currentRound - 1) / gameState.totalRounds) * 100) + '%';
    document.getElementById('prompt-text').textContent = 'Find the lowercase friend of ' + correctLetter.toUpperCase() + '!';
    document.getElementById('feedback-area').innerHTML = '';

    generateChoices(correctLetter);

    // Play ONLY the letter name
    setTimeout(function() {
        AudioManager.playLetterName(correctLetter);
    }, 500);
}

// --- Generate Answer Choices ---
function generateChoices(correctLetter) {
    var choiceCount = getChoiceCount();
    var choices = [correctLetter];

    var similar = SIMILAR_LETTERS[correctLetter] || [];
    var shuffledSimilar = shuffleArray(similar.slice());

    for (var i = 0; i < shuffledSimilar.length && choices.length < choiceCount; i++) {
        if (choices.indexOf(shuffledSimilar[i]) === -1) {
            choices.push(shuffledSimilar[i]);
        }
    }

    while (choices.length < choiceCount) {
        var randomLetter = String.fromCharCode(97 + Math.floor(Math.random() * 26));
        if (choices.indexOf(randomLetter) === -1) {
            choices.push(randomLetter);
        }
    }

    choices = shuffleArray(choices);

    var container = document.getElementById('choices-container');
    container.innerHTML = '';

    for (var j = 0; j < choices.length; j++) {
        var btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.textContent = choices[j];
        btn.setAttribute('data-letter', choices[j]);

        (function(letter) {
            btn.addEventListener('click', function() {
                handleChoice(letter, this);
            });
        })(choices[j]);

        container.appendChild(btn);
    }
}

// --- Handle Choice Selection ---
function handleChoice(selectedLetter, buttonElement) {
    if (gameState.isAnswered) return;
    gameState.isAnswered = true;

    // Stop any playing audio
    AudioManager.stopAll();

    var isCorrect = selectedLetter === gameState.currentAnswer;
    var feedbackArea = document.getElementById('feedback-area');

    // Disable all buttons
    var allButtons = document.querySelectorAll('.choice-btn');
    for (var i = 0; i < allButtons.length; i++) {
        allButtons[i].classList.add('disabled');
    }

    if (isCorrect) {
        buttonElement.classList.add('correct');
        gameState.correctCount++;
        document.getElementById('score-correct').textContent = '✅ ' + gameState.correctCount;

        feedbackArea.innerHTML = '<div class="feedback-msg correct">🎉 Correct!</div>';

        gameState.roundHistory.push({
            letter: gameState.currentAnswer,
            correct: true
        });

        Rewards.addStar('phonics');
        updateStarCounter();

        // Play celebration after a moment
        setTimeout(function() {
            AudioManager.playCelebration();
        }, 200);

        if (gameState.correctCount % 3 === 0) {
            launchConfetti();
        }

        // Wait for celebration to finish, then next round
        setTimeout(function() {
            nextRound();
        }, 2500);

    } else {
        buttonElement.classList.add('wrong');
        gameState.wrongCount++;
        document.getElementById('score-wrong').textContent = '❌ ' + gameState.wrongCount;

        // Highlight correct answer
        for (var k = 0; k < allButtons.length; k++) {
            if (allButtons[k].getAttribute('data-letter') === gameState.currentAnswer) {
                allButtons[k].classList.add('hint');
            }
        }

        feedbackArea.innerHTML = '<div class="feedback-msg wrong">The answer is ' + gameState.currentAnswer + '!</div>';

        gameState.roundHistory.push({
            letter: gameState.currentAnswer,
            correct: false,
            chosen: selectedLetter
        });

        // Play try again after a moment
        setTimeout(function() {
            AudioManager.playInstruction('try_again');
        }, 200);

        // After try-again audio, let child tap the correct one
        setTimeout(function() {
            gameState.isAnswered = false;

            // Update prompt
            document.getElementById('prompt-text').textContent = 'Tap the green letter ' + gameState.currentAnswer + '!';

            // Only enable the correct button
            for (var n = 0; n < allButtons.length; n++) {
                if (allButtons[n].getAttribute('data-letter') === gameState.currentAnswer) {
                    allButtons[n].classList.remove('wrong', 'disabled');
                    allButtons[n].classList.add('hint');

                    (function(btn) {
                        btn.onclick = function() {
                            if (gameState.isAnswered) return;
                            gameState.isAnswered = true;

                            AudioManager.stopAll();

                            btn.classList.remove('hint');
                            btn.classList.add('correct');
                            feedbackArea.innerHTML = '<div class="feedback-msg correct">🎉 That\'s it!</div>';

                            var btns = document.querySelectorAll('.choice-btn');
                            for (var p = 0; p < btns.length; p++) {
                                btns[p].classList.add('disabled');
                            }

                            setTimeout(function() {
                                AudioManager.playCelebration();
                            }, 200);

                            setTimeout(function() {
                                nextRound();
                            }, 2000);
                        };
                    })(allButtons[n]);
                }
                // Keep wrong buttons disabled
            }
        }, 2500);
    }
}

// --- Show Results ---
function showResults() {
    AudioManager.stopAll();

    showScreen('match-results');

    var name = ChildName.get() || 'friend';
    var score = gameState.correctCount;
    var total = gameState.totalRounds;
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
    document.getElementById('results-stars-display').innerHTML = starsHtml;

    var titleEl = document.getElementById('results-title');
    var mascotEl = document.getElementById('results-mascot');

    if (percentage >= 90) {
        titleEl.textContent = 'SUPERSTAR, ' + name + '!';
        mascotEl.textContent = '🦕🎉';
    } else if (percentage >= 70) {
        titleEl.textContent = 'Great Job, ' + name + '!';
        mascotEl.textContent = '🦕⭐';
    } else if (percentage >= 50) {
        titleEl.textContent = 'Good Try, ' + name + '!';
        mascotEl.textContent = '🦕👍';
    } else {
        titleEl.textContent = 'Keep Practicing, ' + name + '!';
        mascotEl.textContent = '🦕💪';
    }

    document.getElementById('results-text').innerHTML =
        'You got <strong>' + score + ' out of ' + total + '</strong> correct!<br>' +
        'That is ' + percentage + '%!';

    var reviewEl = document.getElementById('results-review');
    var wrongOnes = [];
    for (var j = 0; j < gameState.roundHistory.length; j++) {
        if (!gameState.roundHistory[j].correct) {
            wrongOnes.push(gameState.roundHistory[j]);
        }
    }

    if (wrongOnes.length > 0) {
        var reviewHtml = '<div class="review-title">Letters to practice:</div>';
        for (var k = 0; k < wrongOnes.length; k++) {
            var item = wrongOnes[k];
            reviewHtml += '<div class="review-item">' +
                '<span class="review-pair">' + item.letter.toUpperCase() + ' → ' + item.letter + '</span>' +
                '<span>You picked: ' + item.chosen + '</span>' +
                '<span class="review-status">📝</span>' +
                '</div>';
        }
        reviewEl.innerHTML = reviewHtml;
    } else {
        reviewEl.innerHTML = '<div class="review-title">🎉 Perfect score! No mistakes!</div>';
    }

    // Play result audio after screen is shown
    setTimeout(function() {
        if (percentage >= 70) {
            launchConfetti();
            AudioManager.playCelebration();
        } else {
            AudioManager.playInstruction('lets_learn');
        }
    }, 800);

    updateStarCounter();
}

// --- Update Star Counter ---
function updateStarCounter() {
    var el = document.getElementById('star-counter');
    if (el) {
        el.textContent = '⭐ ' + Rewards.getStars('phonics');
    }
}

// --- Shuffle Array ---
function shuffleArray(arr) {
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
    updateStarCounter();
});