/* ========================================
   Vocabulary Module
   Colors, Shapes, Animals
   ======================================== */

// --- DATA ---
var COLORS_DATA = [
    { name: 'Red',    hex: '#FF0000', emoji: '🔴', objects: '🍎🌹🫀',  sentence: 'Red like an apple!' },
    { name: 'Blue',   hex: '#0066FF', emoji: '🔵', objects: '🌊💙🫐',  sentence: 'Blue like the ocean!' },
    { name: 'Yellow', hex: '#FFD700', emoji: '🟡', objects: '⭐🌻🍌',  sentence: 'Yellow like the sun!' },
    { name: 'Green',  hex: '#00CC00', emoji: '🟢', objects: '🌿🐸🥒',  sentence: 'Green like a frog!' },
    { name: 'Orange', hex: '#FF8C00', emoji: '🟠', objects: '🍊🥕🏀',  sentence: 'Orange like an orange!' },
    { name: 'Purple', hex: '#8B00FF', emoji: '🟣', objects: '🍇🦄💜',  sentence: 'Purple like grapes!' },
    { name: 'Pink',   hex: '#FF69B4', emoji: '🩷', objects: '🌸🦩💗',  sentence: 'Pink like a flamingo!' },
    { name: 'Brown',  hex: '#8B4513', emoji: '🟤', objects: '🐻🍫🪵',  sentence: 'Brown like a bear!' },
    { name: 'Black',  hex: '#000000', emoji: '⚫', objects: '🐱‍👤🎱🖤', sentence: 'Black like the night!' },
    { name: 'White',  hex: '#FFFFFF', emoji: '⚪', objects: '☁️🐑❄️',  sentence: 'White like a cloud!' }
];

var SHAPES_DATA = [
    { name: 'Circle',    emoji: '⭕', svg: 'circle',    sentence: 'A circle is round like a ball!' },
    { name: 'Square',    emoji: '🟧', svg: 'square',    sentence: 'A square has 4 equal sides!' },
    { name: 'Triangle',  emoji: '🔺', svg: 'triangle',  sentence: 'A triangle has 3 sides!' },
    { name: 'Star',      emoji: '⭐', svg: 'star',      sentence: 'A star has 5 points!' },
    { name: 'Heart',     emoji: '❤️', svg: 'heart',     sentence: 'A heart means love!' },
    { name: 'Diamond',   emoji: '💎', svg: 'diamond',   sentence: 'A diamond has 4 pointy sides!' },
    { name: 'Rectangle', emoji: '📋', svg: 'rectangle', sentence: 'A rectangle is like a long square!' },
    { name: 'Oval',      emoji: '🥚', svg: 'oval',      sentence: 'An oval is like a stretched circle!' }
];

var ANIMALS_DATA = [
    { name: 'Cat',     emoji: '🐱', sound: 'Meow!',    sentence: 'A cat says meow!' },
    { name: 'Dog',     emoji: '🐶', sound: 'Woof!',    sentence: 'A dog says woof!' },
    { name: 'Cow',     emoji: '🐮', sound: 'Moo!',     sentence: 'A cow says moo!' },
    { name: 'Duck',    emoji: '🦆', sound: 'Quack!',   sentence: 'A duck says quack!' },
    { name: 'Pig',     emoji: '🐷', sound: 'Oink!',    sentence: 'A pig says oink!' },
    { name: 'Sheep',   emoji: '🐑', sound: 'Baa!',     sentence: 'A sheep says baa!' },
    { name: 'Horse',   emoji: '🐴', sound: 'Neigh!',   sentence: 'A horse says neigh!' },
    { name: 'Lion',    emoji: '🦁', sound: 'Roar!',    sentence: 'A lion says roar!' },
    { name: 'Frog',    emoji: '🐸', sound: 'Ribbit!',  sentence: 'A frog says ribbit!' },
    { name: 'Chicken', emoji: '🐔', sound: 'Cluck!',   sentence: 'A chicken says cluck!' },
    { name: 'Bird',    emoji: '🐦', sound: 'Tweet!',   sentence: 'A bird says tweet!' },
    { name: 'Monkey',  emoji: '🐵', sound: 'Ooh ooh!', sentence: 'A monkey says ooh ooh ah ah!' },
    { name: 'Elephant',emoji: '🐘', sound: 'Trumpet!', sentence: 'An elephant makes a trumpet sound!' },
    { name: 'Snake',   emoji: '🐍', sound: 'Hiss!',    sentence: 'A snake says hiss!' },
    { name: 'Bee',     emoji: '🐝', sound: 'Buzz!',    sentence: 'A bee says buzz!' }
];

// --- STATE ---
var vocabState = {
    currentData: [],
    currentIndex: 0,
    currentType: 'colors', // colors, shapes, animals
    direction: 'next',
    visited: new Set(),
    // Quiz state
    quizType: 'color',
    quizRound: 0,
    quizTotal: 10,
    quizCorrect: 0,
    quizWrong: 0,
    quizAnswer: null,
    quizAnswered: false
};

// --- SCREEN MANAGEMENT ---
function showVocabMenu() {
    var screens = document.querySelectorAll('.screen');
    for (var i = 0; i < screens.length; i++) screens[i].classList.remove('active');
    document.getElementById('vocab-menu').classList.add('active');
    AudioManager.stopAll();
}

function showVocabScreen(id) {
    var screens = document.querySelectorAll('.screen');
    for (var i = 0; i < screens.length; i++) screens[i].classList.remove('active');
    document.getElementById(id).classList.add('active');
}

// ========================================
// FLASHCARD EXPLORER (shared for all types)
// ========================================

function startColorExplorer() {
    vocabState.currentData = COLORS_DATA;
    vocabState.currentType = 'colors';
    vocabState.currentIndex = 0;
    vocabState.visited = new Set();
    showVocabScreen('vocab-explorer');
    AudioManager.stopAll();
    Speech.speak('Lets learn colors, Prisha!', 0.9, 1.1);
    setTimeout(function() { showVocabCard(0); }, 2000);
}

function startShapeExplorer() {
    vocabState.currentData = SHAPES_DATA;
    vocabState.currentType = 'shapes';
    vocabState.currentIndex = 0;
    vocabState.visited = new Set();
    showVocabScreen('vocab-explorer');
    AudioManager.stopAll();
    Speech.speak('Lets learn shapes, Prisha!', 0.9, 1.1);
    setTimeout(function() { showVocabCard(0); }, 2000);
}

function startAnimalExplorer() {
    vocabState.currentData = ANIMALS_DATA;
    vocabState.currentType = 'animals';
    vocabState.currentIndex = 0;
    vocabState.visited = new Set();
    showVocabScreen('vocab-explorer');
    AudioManager.stopAll();
    Speech.speak('Lets learn animals, Prisha!', 0.9, 1.1);
    setTimeout(function() { showVocabCard(0); }, 2000);
}

function showVocabCard(index) {
    var data = vocabState.currentData;
    var item = data[index];
    var card = document.getElementById('vocab-card');

    AudioManager.stopAll();

    card.style.animation = 'none';
    void card.offsetHeight;
    card.style.animation = vocabState.direction === 'next' ? 'cardSlideIn 0.4s ease' : 'cardSlideInReverse 0.4s ease';

    // Set visual based on type
    var visualEl = document.getElementById('vocab-visual');
    var wordEl = document.getElementById('vocab-word');
    var hintEl = document.getElementById('vocab-hint');

    if (vocabState.currentType === 'colors') {
        visualEl.innerHTML = '<div class="color-swatch" style="background:' + item.hex + ';' +
            (item.name === 'White' ? 'border-color:#ccc;' : '') + '"></div>' +
            '<div style="font-size:40px;margin-top:5px;">' + item.objects + '</div>';
        wordEl.textContent = item.name;
        hintEl.textContent = item.sentence;
    } else if (vocabState.currentType === 'shapes') {
        visualEl.innerHTML = '<span style="font-size:100px;">' + item.emoji + '</span>';
        wordEl.textContent = item.name;
        hintEl.textContent = item.sentence;
    } else if (vocabState.currentType === 'animals') {
        visualEl.innerHTML = '<span style="font-size:100px;">' + item.emoji + '</span>';
        wordEl.textContent = item.name;
        hintEl.textContent = item.sound + ' — ' + item.sentence;
    }

    // Update counter
    document.getElementById('vocab-counter').textContent = (index + 1) + ' of ' + data.length;
    document.getElementById('vocab-progress-fill').style.width = (((index + 1) / data.length) * 100) + '%';

    // Dino tip
    if (vocabState.currentType === 'animals') {
        document.getElementById('vocab-dino-text').textContent = 'A ' + item.name + ' says ' + item.sound;
    } else {
        document.getElementById('vocab-dino-text').textContent = 'This is ' + item.name + '!';
    }

    // Nav buttons
    document.getElementById('vocab-btn-prev').disabled = (index === 0);
    document.getElementById('vocab-btn-next').textContent = (index === data.length - 1) ? '🎉 Finish!' : 'Next ▶️';

    // Stars
    if (!vocabState.visited.has(index)) {
        vocabState.visited.add(index);
        Rewards.addStar('vocabulary');
        updateVocabStars();

        if (vocabState.visited.size % 5 === 0 && vocabState.visited.size > 0) {
            setTimeout(function() {
                launchConfetti();
                showCelebration('🌟', vocabState.visited.size + ' Words Learned!', 'Keep going, Prisha!');
            }, 800);
        }
    }

    // Auto speak
    setTimeout(function() {
        Speech.speak(item.name, 0.8, 1.1);
    }, 400);
}

function playVocabWord() {
    var item = vocabState.currentData[vocabState.currentIndex];
    Speech.speak(item.name, 0.8, 1.1);
}

function playVocabSentence() {
    var item = vocabState.currentData[vocabState.currentIndex];
    Speech.speak(item.sentence, 0.85, 1.1);
}

function nextVocabCard() {
    var data = vocabState.currentData;
    if (vocabState.currentIndex >= data.length - 1) {
        launchConfetti();
        AudioManager.playCelebration();
        showCelebration('🏆🦕', 'Amazing, Prisha!', 'You learned all ' + data.length + ' words!', function() { showVocabMenu(); });
        return;
    }
    vocabState.direction = 'next';
    vocabState.currentIndex++;
    showVocabCard(vocabState.currentIndex);
}

function prevVocabCard() {
    if (vocabState.currentIndex <= 0) return;
    vocabState.direction = 'prev';
    vocabState.currentIndex--;
    showVocabCard(vocabState.currentIndex);
}

// ========================================
// COLOR QUIZ
// ========================================

function startColorQuiz() {
    vocabState.quizType = 'color';
    vocabState.quizRound = 0;
    vocabState.quizCorrect = 0;
    vocabState.quizWrong = 0;
    vocabState.quizAnswered = false;

    document.getElementById('vquiz-score-correct').textContent = '✅ 0';
    document.getElementById('vquiz-score-wrong').textContent = '❌ 0';

    showVocabScreen('vocab-quiz');
    AudioManager.stopAll();

    Speech.speak('Find the right color, Prisha!', 0.9, 1.1);
    setTimeout(function() { nextQuizRound(); }, 2500);
}

// ========================================
// SHAPE QUIZ
// ========================================

function startShapeQuiz() {
    vocabState.quizType = 'shape';
    vocabState.quizRound = 0;
    vocabState.quizCorrect = 0;
    vocabState.quizWrong = 0;
    vocabState.quizAnswered = false;

    document.getElementById('vquiz-score-correct').textContent = '✅ 0';
    document.getElementById('vquiz-score-wrong').textContent = '❌ 0';

    showVocabScreen('vocab-quiz');
    AudioManager.stopAll();

    Speech.speak('Find the right shape, Prisha!', 0.9, 1.1);
    setTimeout(function() { nextQuizRound(); }, 2500);
}

// ========================================
// ANIMAL SOUND QUIZ
// ========================================

function startAnimalQuiz() {
    vocabState.quizType = 'animal';
    vocabState.quizRound = 0;
    vocabState.quizCorrect = 0;
    vocabState.quizWrong = 0;
    vocabState.quizAnswered = false;

    document.getElementById('vquiz-score-correct').textContent = '✅ 0';
    document.getElementById('vquiz-score-wrong').textContent = '❌ 0';

    showVocabScreen('vocab-quiz');
    AudioManager.stopAll();

    Speech.speak('What animal makes this sound, Prisha?', 0.9, 1.1);
    setTimeout(function() { nextQuizRound(); }, 3000);
}

// ========================================
// SHARED QUIZ LOGIC
// ========================================

function nextQuizRound() {
    vocabState.quizRound++;
    vocabState.quizAnswered = false;

    if (vocabState.quizRound > vocabState.quizTotal) {
        showVocabResults();
        return;
    }

    document.getElementById('vquiz-round-text').textContent = 'Round ' + vocabState.quizRound + ' of ' + vocabState.quizTotal;
    document.getElementById('vquiz-progress-fill').style.width = (((vocabState.quizRound - 1) / vocabState.quizTotal) * 100) + '%';
    document.getElementById('vquiz-feedback').innerHTML = '';

    if (vocabState.quizType === 'color') {
        generateColorQuizRound();
    } else if (vocabState.quizType === 'shape') {
        generateShapeQuizRound();
    } else if (vocabState.quizType === 'animal') {
        generateAnimalQuizRound();
    }
}

// --- Color Quiz Round ---
function generateColorQuizRound() {
    var correctIndex = Math.floor(Math.random() * COLORS_DATA.length);
    var correct = COLORS_DATA[correctIndex];
    vocabState.quizAnswer = correct;

    document.getElementById('vquiz-prompt').textContent = 'Find the ' + correct.name + ' one!';
    document.getElementById('vquiz-visual').innerHTML = '<div class="vquiz-target" style="font-size:60px;">' + correct.objects.charAt(0) + correct.objects.charAt(1) + '</div>';

    // Generate 4 color choices
    var choiceIndices = [correctIndex];
    while (choiceIndices.length < 4) {
        var r = Math.floor(Math.random() * COLORS_DATA.length);
        if (choiceIndices.indexOf(r) === -1) choiceIndices.push(r);
    }
    choiceIndices = shuffleVocabArray(choiceIndices);

    var container = document.getElementById('vquiz-choices');
    container.innerHTML = '';

    for (var i = 0; i < choiceIndices.length; i++) {
        var color = COLORS_DATA[choiceIndices[i]];
        var btn = document.createElement('button');
        btn.className = 'color-choice-btn';
        btn.style.background = color.hex;
        if (color.name === 'White') btn.style.border = '5px solid #ccc';
        btn.setAttribute('data-name', color.name);
        btn.title = color.name;

        (function(colorData) {
            btn.addEventListener('click', function() {
                handleQuizChoice(colorData, this);
            });
        })(color);

        container.appendChild(btn);
    }

    setTimeout(function() { Speech.speak(correct.name, 0.8, 1.1); }, 500);
}

// --- Shape Quiz Round ---
function generateShapeQuizRound() {
    var correctIndex = Math.floor(Math.random() * SHAPES_DATA.length);
    var correct = SHAPES_DATA[correctIndex];
    vocabState.quizAnswer = correct;

    document.getElementById('vquiz-prompt').textContent = 'Find the ' + correct.name + '!';
    document.getElementById('vquiz-visual').innerHTML = '<div class="vquiz-target">' + correct.name + '</div>';

    var choiceIndices = [correctIndex];
    while (choiceIndices.length < 4) {
        var r = Math.floor(Math.random() * SHAPES_DATA.length);
        if (choiceIndices.indexOf(r) === -1) choiceIndices.push(r);
    }
    choiceIndices = shuffleVocabArray(choiceIndices);

    var container = document.getElementById('vquiz-choices');
    container.innerHTML = '';

    for (var i = 0; i < choiceIndices.length; i++) {
        var shape = SHAPES_DATA[choiceIndices[i]];
        var btn = document.createElement('button');
        btn.className = 'shape-choice-btn';
        btn.textContent = shape.emoji;
        btn.setAttribute('data-name', shape.name);

        (function(shapeData) {
            btn.addEventListener('click', function() {
                handleQuizChoice(shapeData, this);
            });
        })(shape);

        container.appendChild(btn);
    }

    setTimeout(function() { Speech.speak(correct.name, 0.8, 1.1); }, 500);
}

// --- Animal Sound Quiz Round ---
function generateAnimalQuizRound() {
    var correctIndex = Math.floor(Math.random() * ANIMALS_DATA.length);
    var correct = ANIMALS_DATA[correctIndex];
    vocabState.quizAnswer = correct;

    document.getElementById('vquiz-prompt').textContent = 'What animal says "' + correct.sound + '"?';
    document.getElementById('vquiz-visual').innerHTML =
        '<div class="animal-sound-display">' +
            '<div class="animal-sound-text">"' + correct.sound + '"</div>' +
        '</div>';

    var choiceIndices = [correctIndex];
    while (choiceIndices.length < 4) {
        var r = Math.floor(Math.random() * ANIMALS_DATA.length);
        if (choiceIndices.indexOf(r) === -1) choiceIndices.push(r);
    }
    choiceIndices = shuffleVocabArray(choiceIndices);

    var container = document.getElementById('vquiz-choices');
    container.innerHTML = '';

    for (var i = 0; i < choiceIndices.length; i++) {
        var animal = ANIMALS_DATA[choiceIndices[i]];
        var btn = document.createElement('button');
        btn.className = 'animal-choice-btn';
        btn.innerHTML = '<span class="animal-emoji">' + animal.emoji + '</span>' +
                        '<span class="animal-name">' + animal.name + '</span>';
        btn.setAttribute('data-name', animal.name);

        (function(animalData) {
            btn.addEventListener('click', function() {
                handleQuizChoice(animalData, this);
            });
        })(animal);

        container.appendChild(btn);
    }

    setTimeout(function() { Speech.speak(correct.sound, 0.8, 1.0); }, 500);
}

// --- Handle Quiz Choice (shared) ---
function handleQuizChoice(selectedData, btnEl) {
    if (vocabState.quizAnswered) return;
    vocabState.quizAnswered = true;
    AudioManager.stopAll();

    var isCorrect = selectedData.name === vocabState.quizAnswer.name;
    var feedback = document.getElementById('vquiz-feedback');
    var btnClass = vocabState.quizType === 'color' ? '.color-choice-btn' :
                   vocabState.quizType === 'shape' ? '.shape-choice-btn' : '.animal-choice-btn';

    var allBtns = document.querySelectorAll(btnClass);
    for (var i = 0; i < allBtns.length; i++) {
        allBtns[i].classList.add('disabled');
    }

    if (isCorrect) {
        btnEl.classList.add('correct');
        vocabState.quizCorrect++;
        document.getElementById('vquiz-score-correct').textContent = '✅ ' + vocabState.quizCorrect;
        feedback.innerHTML = '<div class="feedback-msg correct">🎉 Yes! ' + vocabState.quizAnswer.name + '!</div>';

        Rewards.addStar('vocabulary');
        updateVocabStars();

        setTimeout(function() { AudioManager.playCelebration(); }, 200);
        if (vocabState.quizCorrect % 3 === 0) launchConfetti();

        // Speak the answer
        setTimeout(function() {
            Speech.speak(vocabState.quizAnswer.sentence, 0.85, 1.1);
        }, 1800);

        setTimeout(function() { nextQuizRound(); }, 3500);

    } else {
        btnEl.classList.add('wrong');
        vocabState.quizWrong++;
        document.getElementById('vquiz-score-wrong').textContent = '❌ ' + vocabState.quizWrong;

        // Highlight correct
        for (var k = 0; k < allBtns.length; k++) {
            if (allBtns[k].getAttribute('data-name') === vocabState.quizAnswer.name) {
                allBtns[k].classList.add('hint');
            }
        }

        feedback.innerHTML = '<div class="feedback-msg wrong">Oops! That\'s ' + selectedData.name + '. The answer is ' + vocabState.quizAnswer.name + '!</div>';

        setTimeout(function() {
            AudioManager.playInstruction('try_again');
        }, 200);

        // Let Prisha tap the correct one
        setTimeout(function() {
            vocabState.quizAnswered = false;

            document.getElementById('vquiz-prompt').textContent = 'Tap ' + vocabState.quizAnswer.name + '!';

            for (var n = 0; n < allBtns.length; n++) {
                if (allBtns[n].getAttribute('data-name') === vocabState.quizAnswer.name) {
                    allBtns[n].classList.remove('wrong', 'disabled');
                    allBtns[n].classList.add('hint');

                    (function(btn, answer) {
                        btn.onclick = function() {
                            if (vocabState.quizAnswered) return;
                            vocabState.quizAnswered = true;
                            AudioManager.stopAll();

                            btn.classList.remove('hint');
                            btn.classList.add('correct');
                            feedback.innerHTML = '<div class="feedback-msg correct">🎉 That\'s ' + answer.name + '!</div>';

                            var btns = document.querySelectorAll(btnClass);
                            for (var p = 0; p < btns.length; p++) btns[p].classList.add('disabled');

                            setTimeout(function() { AudioManager.playCelebration(); }, 200);
                            setTimeout(function() { Speech.speak(answer.sentence, 0.85, 1.1); }, 1800);
                            setTimeout(function() { nextQuizRound(); }, 3500);
                        };
                    })(allBtns[n], vocabState.quizAnswer);
                }
            }
        }, 2500);
    }
}

// ========================================
// RESULTS
// ========================================

function showVocabResults() {
    AudioManager.stopAll();
    showVocabScreen('vocab-results');

    var score = vocabState.quizCorrect;
    var total = vocabState.quizTotal;
    var pct = Math.round((score / total) * 100);

    var stars = pct >= 90 ? 5 : pct >= 70 ? 4 : pct >= 50 ? 3 : pct >= 30 ? 2 : 1;
    var starsHtml = '';
    for (var i = 0; i < 5; i++) starsHtml += (i < stars) ? '⭐' : '☆';
    document.getElementById('vocab-results-stars').innerHTML = starsHtml;

    var title = document.getElementById('vocab-results-title');
    var mascot = document.getElementById('vocab-results-mascot');

    if (pct >= 90) { title.textContent = 'SUPERSTAR, Prisha!'; mascot.textContent = '🦕🎉'; }
    else if (pct >= 70) { title.textContent = 'Great Job, Prisha!'; mascot.textContent = '🦕⭐'; }
    else if (pct >= 50) { title.textContent = 'Good Try, Prisha!'; mascot.textContent = '🦕👍'; }
    else { title.textContent = 'Keep Practicing!'; mascot.textContent = '🦕💪'; }

    document.getElementById('vocab-results-text').innerHTML = 'You got <strong>' + score + ' out of ' + total + '</strong> correct!';

    // Play again button
    var playAgainBtn = document.getElementById('vocab-play-again-btn');
    if (vocabState.quizType === 'color') {
        playAgainBtn.onclick = function() { startColorQuiz(); };
    } else if (vocabState.quizType === 'shape') {
        playAgainBtn.onclick = function() { startShapeQuiz(); };
    } else {
        playAgainBtn.onclick = function() { startAnimalQuiz(); };
    }

    setTimeout(function() {
        if (pct >= 70) { launchConfetti(); AudioManager.playCelebration(); }
        else { Speech.speak('Keep practicing, Prisha!', 0.9, 1.1); }
    }, 800);

    updateVocabStars();
}

// ========================================
// HELPERS
// ========================================

function updateVocabStars() {
    var el = document.getElementById('star-counter');
    if (el) el.textContent = '⭐ ' + Rewards.getStars('vocabulary');
}

function shuffleVocabArray(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
}

document.addEventListener('DOMContentLoaded', function() {
    updateVocabStars();
});
