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

var numIndex = 0;
var visitedNums = new Set();
var numDirection = 'next';

var countState = {
    currentRound: 0,
    totalRounds: 20,
    correctCount: 0,
    wrongCount: 0,
    currentAnswer: 0,
    isAnswered: false,
    lastGame: 'counting',
    usedNumbers: []
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
        AudioManager.playNumberInstruction('lets_count');
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
    var name = ChildName.get() || 'friend';

    AudioManager.stopAll();

    card.style.animation = 'none';
    void card.offsetHeight;
    card.style.animation = numDirection === 'next' ? 'cardSlideIn 0.4s ease' : 'cardSlideInReverse 0.4s ease';

    document.getElementById('number-display').textContent = data.num;
    document.getElementById('number-word').textContent = data.word;
    document.getElementById('number-objects').textContent = data.objects;
    document.getElementById('number-label').textContent = data.num + ' ' + getObjectName(data.emoji, data.num);

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
                showCelebration('🌟', visitedNums.size + ' Numbers Explored!', 'Keep going, ' + name + '!');
            }, 800);
        }
    }

    saveNumProgress();

    // Use AudioManager for number name
    setTimeout(function() {
        AudioManager.playNumberName(data.num);
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
    var singular = {
        '🦕': 'Dinosaur', '🐱': 'Cat', '⭐': 'Star', '🐟': 'Fish',
        '🍎': 'Apple', '🦋': 'Butterfly', '🌙': 'Moon', '🐢': 'Turtle',
        '🌈': 'Rainbow', '🐧': 'Penguin', '🍇': 'Grape', '🐘': 'Elephant',
        '🦁': 'Lion', '🍦': 'Ice Cream', '🐙': 'Octopus', '🪁': 'Kite',
        '🐋': 'Whale', '🎵': 'Music Note', '🧶': 'Yarn Ball', '🦖': 'T-Rex'
    };
    if (count === 1) return singular[emoji] || 'item';
    return names[emoji] || 'items';
}

function nextNumber() {
    var name = ChildName.get() || 'friend';
    if (numIndex >= 19) {
        launchConfetti();
        AudioManager.playNumberInstruction('all_numbers_done');
        showCelebration('🏆🦕', 'Amazing, ' + name + '!', 'You explored all 20 numbers!', function() { showNumbersMenu(); });
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
    AudioManager.playNumberName(data.num);
}

function playCountUp() {
    var data = NUMBERS_DATA[numIndex];
    // Use counting sequence for 1-10, fallback for 11-20
    if (data.num <= 10) {
        AudioManager.playCountingSequence(data.num);
    } else {
        // For 11-20, just speak the number
        AudioManager.playNumberSentence(data.num);
    }
}

// ========================================
// COUNT & TAP GAME
// ========================================
function startCountingGame() {
    countState.currentRound = 0;
    countState.totalRounds = 20;
    countState.correctCount = 0;
    countState.wrongCount = 0;
    countState.isAnswered = false;
    countState.lastGame = 'counting';
    countState.usedNumbers = [];

    document.getElementById('count-score-correct').textContent = '✅ 0';
    document.getElementById('count-score-wrong').textContent = '❌ 0';

    showNumScreen('counting-game');
    AudioManager.stopAll();

    AudioManager.playNumberInstruction('count_animals');
    setTimeout(function() { nextCountRound(); }, 2500);
}

function nextCountRound() {
    countState.currentRound++;
    countState.isAnswered = false;

    if (countState.currentRound > countState.totalRounds) {
        showNumResults();
        return;
    }

// No-repeat: cycle through 1-10 twice
    var available = [];
    for (var av = 1; av <= 10; av++) {
        var usedCount = 0;
        for (var uc = 0; uc < countState.usedNumbers.length; uc++) {
            if (countState.usedNumbers[uc] === av) usedCount++;
        }
        if (usedCount < 2) available.push(av);
    }
    if (available.length === 0) {
        countState.usedNumbers = [];
        for (var rf = 1; rf <= 10; rf++) available.push(rf);
    }
    var correctNum = available[Math.floor(Math.random() * available.length)];
    countState.usedNumbers.push(correctNum);
    countState.currentAnswer = correctNum;

    var animal = COUNTING_ANIMALS[Math.floor(Math.random() * COUNTING_ANIMALS.length)];

    document.getElementById('count-round-text').textContent = 'Round ' + countState.currentRound + ' of ' + countState.totalRounds;
    document.getElementById('count-progress-fill').style.width = (((countState.currentRound - 1) / countState.totalRounds) * 100) + '%';
    document.getElementById('count-prompt').textContent = 'How many ' + animal + ' do you see?';
    document.getElementById('count-feedback').innerHTML = '';

    var area = document.getElementById('counting-area');
    area.innerHTML = '';
    for (var i = 0; i < correctNum; i++) {
        var span = document.createElement('span');
        span.className = 'count-animal';
        span.textContent = animal;
        span.style.animationDelay = (i * 0.1) + 's';
        area.appendChild(span);
    }

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

    // Use AudioManager
    setTimeout(function() {
        AudioManager.playNumberInstruction('how_many');
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

        // Highlight correct answer
        for (var k = 0; k < allBtns.length; k++) {
            if (allBtns[k].getAttribute('data-num') === countState.currentAnswer.toString()) {
                allBtns[k].classList.add('hint');
            }
        }

        feedback.innerHTML = '<div class="feedback-msg wrong">Oops! The answer is ' + countState.currentAnswer + '!</div>';

        // Play "try again" audio
        setTimeout(function() {
            AudioManager.playInstruction('try_again');
        }, 200);

        // After try-again audio, let child tap the correct one
        setTimeout(function() {
            countState.isAnswered = false;

            // Update prompt
            document.getElementById('count-prompt').textContent = 'Tap the number ' + countState.currentAnswer + '!';

            // Enable only the correct button
            for (var n = 0; n < allBtns.length; n++) {
                if (allBtns[n].getAttribute('data-num') === countState.currentAnswer.toString()) {
                    allBtns[n].classList.remove('wrong', 'disabled');
                    allBtns[n].classList.add('hint');

                    (function(btn, answer) {
                        btn.onclick = function() {
                            if (countState.isAnswered) return;
                            countState.isAnswered = true;

                            AudioManager.stopAll();

                            btn.classList.remove('hint');
                            btn.classList.add('correct');
                            feedback.innerHTML = '<div class="feedback-msg correct">🎉 That\'s it! ' + answer + '!</div>';

                            // Disable all buttons
                            var btns = document.querySelectorAll('.count-choice-btn');
                            for (var p = 0; p < btns.length; p++) {
                                btns[p].classList.add('disabled');
                            }

                            // Celebrate
                            setTimeout(function() {
                                AudioManager.playCelebration();
                            }, 200);

                            // Then speak the number
                            setTimeout(function() {
                                AudioManager.playNumberName(answer);
                            }, 1800);

                            // Next round
                            setTimeout(function() {
                                nextCountRound();
                            }, 3000);
                        };
                    })(allBtns[n], countState.currentAnswer);
                }
                // Keep wrong buttons disabled
            }
        }, 2500);
    }
}
// ========================================
// NUMBER MATCH GAME
// ========================================
function startNumberMatch() {
    countState.currentRound = 0;
    countState.totalRounds = 20;
    countState.correctCount = 0;
    countState.wrongCount = 0;
    countState.isAnswered = false;
    countState.lastGame = 'match';
    countState.usedNumbers = [];

    document.getElementById('nmatch-score-correct').textContent = '✅ 0';
    document.getElementById('nmatch-score-wrong').textContent = '❌ 0';

    showNumScreen('number-match');
    AudioManager.stopAll();

    AudioManager.playNumberInstruction('match_number');
    setTimeout(function() { nextNMatchRound(); }, 3000);
}

function nextNMatchRound() {
    countState.currentRound++;
    countState.isAnswered = false;

    if (countState.currentRound > countState.totalRounds) {
        showNumResults();
        return;
    }
// No-repeat: cycle through 1-10 twice
    var available = [];
    for (var av = 1; av <= 10; av++) {
        var usedCount = 0;
        for (var uc = 0; uc < countState.usedNumbers.length; uc++) {
            if (countState.usedNumbers[uc] === av) usedCount++;
        }
        if (usedCount < 2) available.push(av);
    }
    if (available.length === 0) {
        countState.usedNumbers = [];
        for (var rf = 1; rf <= 10; rf++) available.push(rf);
    }
    var targetNum = available[Math.floor(Math.random() * available.length)];
    countState.usedNumbers.push(targetNum);
    countState.currentAnswer = targetNum;

    document.getElementById('nmatch-round-text').textContent = 'Round ' + countState.currentRound + ' of ' + countState.totalRounds;
    document.getElementById('nmatch-progress-fill').style.width = (((countState.currentRound - 1) / countState.totalRounds) * 100) + '%';
    document.getElementById('nmatch-number').textContent = targetNum;
    document.getElementById('nmatch-number').style.animation = 'none';
    void document.getElementById('nmatch-number').offsetHeight;
    document.getElementById('nmatch-number').style.animation = 'targetPop 0.5s cubic-bezier(0.68,-0.55,0.265,1.55)';
    document.getElementById('nmatch-prompt').textContent = 'Which group has ' + targetNum + '?';
    document.getElementById('nmatch-feedback').innerHTML = '';

    var choiceNums = [targetNum];
    while (choiceNums.length < 3) {
        var r = Math.floor(Math.random() * 10) + 1;
        if (choiceNums.indexOf(r) === -1) {
            choiceNums.push(r);
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

    // Use AudioManager
    setTimeout(function() {
        AudioManager.playNumberName(targetNum);
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

        // Highlight correct answer
        for (var k = 0; k < allBtns.length; k++) {
            if (allBtns[k].getAttribute('data-num') === countState.currentAnswer.toString()) {
                allBtns[k].classList.add('hint');
            }
        }

        feedback.innerHTML = '<div class="feedback-msg wrong">Oops! Look for the group with ' + countState.currentAnswer + '!</div>';

        // Play "try again" audio
        setTimeout(function() {
            AudioManager.playInstruction('try_again');
        }, 200);

        // After try-again audio, let child tap the correct one
        setTimeout(function() {
            countState.isAnswered = false;

            // Update prompt
            document.getElementById('nmatch-prompt').textContent = 'Tap the group with ' + countState.currentAnswer + '!';

            // Enable only the correct button
            for (var n = 0; n < allBtns.length; n++) {
                if (allBtns[n].getAttribute('data-num') === countState.currentAnswer.toString()) {
                    allBtns[n].classList.remove('wrong', 'disabled');
                    allBtns[n].classList.add('hint');

                    (function(btn, answer) {
                        btn.onclick = function() {
                            if (countState.isAnswered) return;
                            countState.isAnswered = true;

                            AudioManager.stopAll();

                            btn.classList.remove('hint');
                            btn.classList.add('correct');
                            feedback.innerHTML = '<div class="feedback-msg correct">🎉 That\'s ' + answer + '! Great job!</div>';

                            // Disable all buttons
                            var btns = document.querySelectorAll('.nmatch-choice-btn');
                            for (var p = 0; p < btns.length; p++) {
                                btns[p].classList.add('disabled');
                            }

                            // Celebrate
                            setTimeout(function() {
                                AudioManager.playCelebration();
                            }, 200);

                            // Then speak the number
                            setTimeout(function() {
                                AudioManager.playNumberName(answer);
                            }, 1800);

                            // Next round
                            setTimeout(function() {
                                nextNMatchRound();
                            }, 3000);
                        };
                    })(allBtns[n], countState.currentAnswer);
                }
                // Keep wrong buttons disabled
            }
        }, 2500);
    }
}
// ========================================
// RESULTS
// ========================================
function showNumResults() {
    AudioManager.stopAll();
    showNumScreen('number-results');

    var name = ChildName.get() || 'friend';
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

    if (pct >= 90) { title.textContent = 'SUPERSTAR, ' + name + '!'; mascot.textContent = '🦕🎉'; }
    else if (pct >= 70) { title.textContent = 'Great Job, ' + name + '!'; mascot.textContent = '🦕⭐'; }
    else if (pct >= 50) { title.textContent = 'Good Try, ' + name + '!'; mascot.textContent = '🦕👍'; }
    else { title.textContent = 'Keep Practicing!'; mascot.textContent = '🦕💪'; }

    document.getElementById('num-results-text').innerHTML = 'You got <strong>' + score + ' out of ' + total + '</strong> correct!';

    var playAgainBtn = document.getElementById('num-play-again-btn');
    if (countState.lastGame === 'counting') {
        playAgainBtn.onclick = function() { startCountingGame(); };
    } else {
        playAgainBtn.onclick = function() { startNumberMatch(); };
    }

    setTimeout(function() {
        if (pct >= 70) {
            launchConfetti();
            AudioManager.playCelebration();
        } else {
            AudioManager.playNumberInstruction('keep_practicing');
        }
    }, 800);

    updateNumStars();
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