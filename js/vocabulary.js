/* ========================================
   Vocabulary Module
   Colors, Shapes, Animals
   ======================================== */

// --- DATA ---
var COLORS_DATA = [
    { name: 'Red',    id: 'red',    hex: '#FF0000', emoji: '🔴', objects: '🍎🍒🫐',  sentence: 'Red like an apple!' },
    { name: 'Blue',   id: 'blue',   hex: '#0066FF', emoji: '🔵', objects: '🌊🐟🫐',  sentence: 'Blue like the ocean!' },
    { name: 'Yellow', id: 'yellow', hex: '#FFD700', emoji: '🟡', objects: '⭐🌻🍌',  sentence: 'Yellow like the sun!' },
    { name: 'Green',  id: 'green',  hex: '#00CC00', emoji: '🟢', objects: '🌿🐸🥒',  sentence: 'Green like a frog!' },
    { name: 'Orange', id: 'orange', hex: '#FF8C00', emoji: '🟠', objects: '🍊🥕🏀',  sentence: 'Orange like an orange!' },
    { name: 'Purple', id: 'purple', hex: '#8B00FF', emoji: '🟣', objects: '🍇🦄🔮',  sentence: 'Purple like grapes!' },
    { name: 'Pink',   id: 'pink',   hex: '#FF69B4', emoji: '🩷', objects: '🌸🦩🎀',  sentence: 'Pink like a flamingo!' },
    { name: 'Brown',  id: 'brown',  hex: '#8B4513', emoji: '🤎', objects: '🐻🍫🪵',  sentence: 'Brown like a bear!' },
    { name: 'Black',  id: 'black',  hex: '#000000', emoji: '⚫', objects: '🐱‍👤🐱🤎', sentence: 'Black like the night!' },
    { name: 'White',  id: 'white',  hex: '#FFFFFF', emoji: '⚪', objects: '☁️🐑☁️',  sentence: 'White like a cloud!' },
    { name: 'Gray',   id: 'gray',   hex: '#808080', emoji: '🩶', objects: '🐘🌫️🪨',  sentence: 'Gray like an elephant!' },
    { name: 'Gold',   id: 'gold',   hex: '#FFD700', emoji: '🥇', objects: '🏆👑⭐',  sentence: 'Gold like a trophy!' },
    { name: 'Peach',  id: 'peach',  hex: '#FFCBA4', emoji: '🍑', objects: '🍑🌅🧁',  sentence: 'Peach like a peach fruit!' },
    { name: 'Aqua',   id: 'aqua',   hex: '#00CED1', emoji: '💎', objects: '🌊🐬💎',  sentence: 'Aqua like the sea!' },
    { name: 'Lime',   id: 'lime',   hex: '#32CD32', emoji: '🍈', objects: '🍈🐸🌿',  sentence: 'Lime like a lime fruit!' }
];

var SHAPES_DATA = [
    { name: 'Circle',    id: 'circle',    emoji: '⭕', svg: 'circle',    sentence: 'A circle is round like a ball!' },
    { name: 'Square',    id: 'square',    emoji: '🟧', svg: 'square',    sentence: 'A square has 4 equal sides!' },
    { name: 'Triangle',  id: 'triangle',  emoji: '🔺', svg: 'triangle',  sentence: 'A triangle has 3 sides!' },
    { name: 'Star',      id: 'star',      emoji: '⭐', svg: 'star',      sentence: 'A star has 5 points!' },
    { name: 'Heart',     id: 'heart',     emoji: '❤️', svg: 'heart',     sentence: 'A heart means love!' },
    { name: 'Diamond',   id: 'diamond',   emoji: '💎', svg: 'diamond',   sentence: 'A diamond has 4 pointy sides!' },
    { name: 'Rectangle', id: 'rectangle', emoji: '📋', svg: 'rectangle', sentence: 'A rectangle is like a long square!' },
    { name: 'Oval',      id: 'oval',      emoji: '🥚', svg: 'oval',      sentence: 'An oval is like a stretched circle!' },
    { name: 'Crescent',  id: 'crescent',  emoji: '🌙', svg: 'crescent',  sentence: 'A crescent is shaped like the moon!' },
    { name: 'Arrow',     id: 'arrow',     emoji: '➡️', svg: 'arrow',     sentence: 'An arrow points the way!' },
    { name: 'Cross',     id: 'cross',     emoji: '✚', svg: 'cross',     sentence: 'A cross has four arms!' },
    { name: 'Hexagon',   id: 'hexagon',   emoji: '⬡', svg: 'hexagon',   sentence: 'A hexagon has 6 sides!' },
    { name: 'Cloud',     id: 'cloud',     emoji: '☁️', svg: 'cloud',     sentence: 'A cloud is fluffy and round!' },
    { name: 'Lightning', id: 'lightning', emoji: '⚡', svg: 'lightning', sentence: 'Lightning is a zigzag shape!' },
    { name: 'Drop',      id: 'drop',      emoji: '💧', svg: 'drop',      sentence: 'A drop is shaped like a raindrop!' }
];

var ANIMALS_DATA = [
    { name: 'Cat',     id: 'cat',      emoji: '🐱', sound: 'Meow!',    sentence: 'A cat says meow!' },
    { name: 'Dog',     id: 'dog',      emoji: '🐶', sound: 'Woof!',    sentence: 'A dog says woof!' },
    { name: 'Cow',     id: 'cow',      emoji: '🐮', sound: 'Moo!',     sentence: 'A cow says moo!' },
    { name: 'Duck',    id: 'duck',     emoji: '🦆', sound: 'Quack!',   sentence: 'A duck says quack!' },
    { name: 'Pig',     id: 'pig',      emoji: '🐷', sound: 'Oink!',    sentence: 'A pig says oink!' },
    { name: 'Sheep',   id: 'sheep',    emoji: '🐑', sound: 'Baa!',     sentence: 'A sheep says baa!' },
    { name: 'Horse',   id: 'horse',    emoji: '🐴', sound: 'Neigh!',   sentence: 'A horse says neigh!' },
    { name: 'Lion',    id: 'lion',     emoji: '🦁', sound: 'Roar!',    sentence: 'A lion says roar!' },
    { name: 'Frog',    id: 'frog',     emoji: '🐸', sound: 'Ribbit!',  sentence: 'A frog says ribbit!' },
    { name: 'Chicken', id: 'chicken',  emoji: '🐔', sound: 'Cluck!',   sentence: 'A chicken says cluck!' },
    { name: 'Bird',    id: 'bird',     emoji: '🐦', sound: 'Tweet!',   sentence: 'A bird says tweet!' },
    { name: 'Monkey',  id: 'monkey',   emoji: '🐵', sound: 'Ooh ooh!', sentence: 'A monkey says ooh ooh ah ah!' },
    { name: 'Elephant',id: 'elephant', emoji: '🐘', sound: 'Trumpet!', sentence: 'An elephant makes a trumpet sound!' },
    { name: 'Snake',   id: 'snake',    emoji: '🐍', sound: 'Hiss!',    sentence: 'A snake says hiss!' },
    { name: 'Bee',      id: 'bee',      emoji: '🐝', sound: 'Buzz!',      sentence: 'A bee says buzz!' },
    { name: 'Owl',      id: 'owl',      emoji: '🦉', sound: 'Hoot!',      sentence: 'An owl says hoot!' },
    { name: 'Bear',     id: 'bear',     emoji: '🐻', sound: 'Growl!',     sentence: 'A bear says growl!' },
    { name: 'Mouse',    id: 'mouse',    emoji: '🐭', sound: 'Squeak!',    sentence: 'A mouse says squeak!' },
    { name: 'Donkey',   id: 'donkey',   emoji: '🫏', sound: 'Hee-haw!',   sentence: 'A donkey says hee-haw!' },
    { name: 'Rooster',  id: 'rooster',  emoji: '🐓', sound: 'Cock-a-doodle-doo!', sentence: 'A rooster says cock-a-doodle-doo!' },
    { name: 'Whale',    id: 'whale',    emoji: '🐳', sound: 'Wooo!',      sentence: 'A whale sings wooo!' },
    { name: 'Tiger',    id: 'tiger',    emoji: '🐯', sound: 'Grrr!',      sentence: 'A tiger says grrr!' },
    { name: 'Penguin',  id: 'penguin',  emoji: '🐧', sound: 'Honk!',      sentence: 'A penguin says honk!' },
    { name: 'Goat',     id: 'goat',     emoji: '🐐', sound: 'Maa!',       sentence: 'A goat says maa!' }
];

// --- STATE ---
var vocabState = {
    currentData: [],
    currentIndex: 0,
    currentType: 'colors',
    direction: 'next',
    visited: new Set(),
    quizType: 'color',
    quizRound: 0,
    quizTotal: 10,
    quizCorrect: 0,
    quizWrong: 0,
    quizAnswer: null,
    quizAnswered: false,
    usedQuizItems: []       // <-- ADD THIS

};

// ========================================
// TIMER MANAGEMENT — prevents audio overlap
// ========================================
var vocabTimers = [];

function clearVocabTimers() {
    for (var i = 0; i < vocabTimers.length; i++) {
        clearTimeout(vocabTimers[i]);
    }
    vocabTimers = [];
}

function vocabDelay(fn, ms) {
    var id = setTimeout(fn, ms);
    vocabTimers.push(id);
    return id;
}

// ========================================
// HELPERS
// ========================================

function getAudioCategory() {
    if (vocabState.currentType === 'colors') return 'colors';
    if (vocabState.currentType === 'shapes') return 'shapes';
    if (vocabState.currentType === 'animals') return 'animals';
    return 'colors';
}

function getItemId(item) {
    return item.id || item.name.toLowerCase().replace(/\s+/g, '_');
}

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

// --- SCREEN MANAGEMENT ---
function showVocabMenu() {
    clearVocabTimers();
    AudioManager.stopAll();
    var screens = document.querySelectorAll('.screen');
    for (var i = 0; i < screens.length; i++) screens[i].classList.remove('active');
    document.getElementById('vocab-menu').classList.add('active');
}

function showVocabScreen(id) {
    var screens = document.querySelectorAll('.screen');
    for (var i = 0; i < screens.length; i++) screens[i].classList.remove('active');
    document.getElementById(id).classList.add('active');
}

// ========================================
// FLASHCARD EXPLORER
// ========================================

function startColorExplorer() {
    vocabState.currentData = COLORS_DATA;
    vocabState.currentType = 'colors';
    vocabState.currentIndex = 0;
    vocabState.visited = new Set();
    showVocabScreen('vocab-explorer');
    clearVocabTimers();
    AudioManager.stopAll();
    AudioManager.preloadVocabCategory('colors');

    AudioManager.playVocabInstruction('lets_learn_colors')
        .then(function() {
            vocabDelay(function() { showVocabCard(0); }, 300);
        })
        .catch(function() {
            vocabDelay(function() { showVocabCard(0); }, 2500);
        });
}

function startShapeExplorer() {
    vocabState.currentData = SHAPES_DATA;
    vocabState.currentType = 'shapes';
    vocabState.currentIndex = 0;
    vocabState.visited = new Set();
    showVocabScreen('vocab-explorer');
    clearVocabTimers();
    AudioManager.stopAll();
    AudioManager.preloadVocabCategory('shapes');

    AudioManager.playVocabInstruction('lets_learn_shapes')
        .then(function() {
            vocabDelay(function() { showVocabCard(0); }, 300);
        })
        .catch(function() {
            vocabDelay(function() { showVocabCard(0); }, 2500);
        });
}

function startAnimalExplorer() {
    vocabState.currentData = ANIMALS_DATA;
    vocabState.currentType = 'animals';
    vocabState.currentIndex = 0;
    vocabState.visited = new Set();
    showVocabScreen('vocab-explorer');
    clearVocabTimers();
    AudioManager.stopAll();
    AudioManager.preloadVocabCategory('animals');

    AudioManager.playVocabInstruction('lets_learn_animals')
        .then(function() {
            vocabDelay(function() { showVocabCard(0); }, 300);
        })
        .catch(function() {
            vocabDelay(function() { showVocabCard(0); }, 2500);
        });
}

function showVocabCard(index) {
    var data = vocabState.currentData;
    var item = data[index];
    var card = document.getElementById('vocab-card');
    var category = getAudioCategory();
    var itemId = getItemId(item);

    clearVocabTimers();
    AudioManager.stopAll();

    card.style.animation = 'none';
    void card.offsetHeight;
    card.style.animation = vocabState.direction === 'next' ? 'cardSlideIn 0.4s ease' : 'cardSlideInReverse 0.4s ease';

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

    document.getElementById('vocab-counter').textContent = (index + 1) + ' of ' + data.length;
    document.getElementById('vocab-progress-fill').style.width = (((index + 1) / data.length) * 100) + '%';

    if (vocabState.currentType === 'animals') {
        document.getElementById('vocab-dino-text').textContent = 'A ' + item.name + ' says ' + item.sound;
    } else {
        document.getElementById('vocab-dino-text').textContent = 'This is ' + item.name + '!';
    }

    document.getElementById('vocab-btn-prev').disabled = (index === 0);
    document.getElementById('vocab-btn-next').textContent = (index === data.length - 1) ? '🏆 Finish!' : 'Next ▶️';

    if (!vocabState.visited.has(index)) {
        vocabState.visited.add(index);
        Rewards.addStar('vocabulary');
        updateVocabStars();

        if (vocabState.visited.size % 5 === 0 && vocabState.visited.size > 0) {
            vocabDelay(function() {
                launchConfetti();
                var cName = ChildName.get() || 'friend';
                showCelebration('🎉', vocabState.visited.size + ' Words Learned!', 'Keep going, ' + cName + '!');            }, 800);
        }
    }

    // Auto speak using AudioManager MP3
    vocabDelay(function() {
        AudioManager.playVocabWord(category, itemId);
    }, 400);
}

function playVocabWord() {
    clearVocabTimers();
    AudioManager.stopAll();
    var item = vocabState.currentData[vocabState.currentIndex];
    var category = getAudioCategory();
    var itemId = getItemId(item);
    AudioManager.playVocabWord(category, itemId);
}

function playVocabSentence() {
    clearVocabTimers();
    AudioManager.stopAll();
    var item = vocabState.currentData[vocabState.currentIndex];
    var category = getAudioCategory();
    var itemId = getItemId(item);
    AudioManager.playVocabSentence(category, itemId);
}

function nextVocabCard() {
    var data = vocabState.currentData;
    if (vocabState.currentIndex >= data.length - 1) {
        clearVocabTimers();
        AudioManager.stopAll();
        launchConfetti();
        AudioManager.playCelebration();
        var cName = ChildName.get() || 'friend';
        showCelebration('🎉🦕', 'Amazing, ' + cName + '!', 'You learned all ' + data.length + ' words!', function() { showVocabMenu(); });        return;
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
    vocabState.quizTotal = COLORS_DATA.length;
    vocabState.quizCorrect = 0;
    vocabState.quizWrong = 0;
    vocabState.quizAnswered = false;
    vocabState.usedQuizItems = [];

    document.getElementById('vquiz-score-correct').textContent = '✅ 0';
    document.getElementById('vquiz-score-wrong').textContent = '❌ 0';

    showVocabScreen('vocab-quiz');
    clearVocabTimers();
    AudioManager.stopAll();
    AudioManager.preloadVocabCategory('colors');

    AudioManager.playVocabInstruction('find_the_color')
        .then(function() {
            vocabDelay(function() { nextQuizRound(); }, 300);
        })
        .catch(function() {
            vocabDelay(function() { nextQuizRound(); }, 2500);
        });
}

// ========================================
// SHAPE QUIZ
// ========================================

function startShapeQuiz() {
    vocabState.quizType = 'shape';
    vocabState.quizRound = 0;
    vocabState.quizTotal = SHAPES_DATA.length;
    vocabState.quizCorrect = 0;
    vocabState.quizWrong = 0;
    vocabState.quizAnswered = false;
    vocabState.usedQuizItems = [];

    document.getElementById('vquiz-score-correct').textContent = '✅ 0';
    document.getElementById('vquiz-score-wrong').textContent = '❌ 0';

    showVocabScreen('vocab-quiz');
    clearVocabTimers();
    AudioManager.stopAll();
    AudioManager.preloadVocabCategory('shapes');

    AudioManager.playVocabInstruction('find_the_shape')
        .then(function() {
            vocabDelay(function() { nextQuizRound(); }, 300);
        })
        .catch(function() {
            vocabDelay(function() { nextQuizRound(); }, 2500);
        });
}

// ========================================
// ANIMAL SOUND QUIZ
// ========================================

function startAnimalQuiz() {
    vocabState.quizType = 'animal';
    vocabState.quizRound = 0;
    vocabState.quizTotal = ANIMALS_DATA.length;
    vocabState.quizCorrect = 0;
    vocabState.quizWrong = 0;
    vocabState.quizAnswered = false;
    vocabState.usedQuizItems = [];

    document.getElementById('vquiz-score-correct').textContent = '✅ 0';
    document.getElementById('vquiz-score-wrong').textContent = '❌ 0';

    showVocabScreen('vocab-quiz');
    clearVocabTimers();
    AudioManager.stopAll();
    AudioManager.preloadVocabCategory('animals');

    AudioManager.playVocabInstruction('what_animal_sound')
        .then(function() {
            vocabDelay(function() { nextQuizRound(); }, 300);
        })
        .catch(function() {
            vocabDelay(function() { nextQuizRound(); }, 3000);
        });
}

// ========================================
// SHARED QUIZ LOGIC
// ========================================

function nextQuizRound() {
    clearVocabTimers();
    AudioManager.stopAll();

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

// --- Color Quiz Round (no repeats) ---
function generateColorQuizRound() {
    var available = [];
    for (var a = 0; a < COLORS_DATA.length; a++) {
        if (vocabState.usedQuizItems.indexOf(a) === -1) available.push(a);
    }
    // If we've used all items, reset the pool
    if (available.length === 0) {
        vocabState.usedQuizItems = [];
        for (var b = 0; b < COLORS_DATA.length; b++) available.push(b);
    }

    var correctIndex = available[Math.floor(Math.random() * available.length)];
    vocabState.usedQuizItems.push(correctIndex);

    var correct = COLORS_DATA[correctIndex];
    vocabState.quizAnswer = correct;

    document.getElementById('vquiz-prompt').textContent = 'Find the ' + correct.name + ' one!';
    document.getElementById('vquiz-visual').innerHTML = '<div class="vquiz-target" style="font-size:60px;">' + correct.objects.charAt(0) + correct.objects.charAt(1) + '</div>';

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
        btn.setAttribute('data-id', color.id);
        btn.title = color.name;

        (function(colorData) {
            btn.addEventListener('click', function() {
                handleQuizChoice(colorData, this);
            });
        })(color);

        container.appendChild(btn);
    }

    vocabDelay(function() {
        AudioManager.playVocabWord('colors', correct.id);
    }, 500);
}

// --- Shape Quiz Round (no repeats) ---
function generateShapeQuizRound() {
    var available = [];
    for (var a = 0; a < SHAPES_DATA.length; a++) {
        if (vocabState.usedQuizItems.indexOf(a) === -1) available.push(a);
    }
    if (available.length === 0) {
        vocabState.usedQuizItems = [];
        for (var b = 0; b < SHAPES_DATA.length; b++) available.push(b);
    }

    var correctIndex = available[Math.floor(Math.random() * available.length)];
    vocabState.usedQuizItems.push(correctIndex);

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
        btn.setAttribute('data-id', shape.id);

        (function(shapeData) {
            btn.addEventListener('click', function() {
                handleQuizChoice(shapeData, this);
            });
        })(shape);

        container.appendChild(btn);
    }

    vocabDelay(function() {
        AudioManager.playVocabWord('shapes', correct.id);
    }, 500);
}

// --- Animal Sound Quiz Round (no repeats) ---
function generateAnimalQuizRound() {
    var available = [];
    for (var a = 0; a < ANIMALS_DATA.length; a++) {
        if (vocabState.usedQuizItems.indexOf(a) === -1) available.push(a);
    }
    if (available.length === 0) {
        vocabState.usedQuizItems = [];
        for (var b = 0; b < ANIMALS_DATA.length; b++) available.push(b);
    }

    var correctIndex = available[Math.floor(Math.random() * available.length)];
    vocabState.usedQuizItems.push(correctIndex);

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
        btn.setAttribute('data-id', animal.id);

        (function(animalData) {
            btn.addEventListener('click', function() {
                handleQuizChoice(animalData, this);
            });
        })(animal);

        container.appendChild(btn);
    }

    vocabDelay(function() {
        AudioManager.playAnimalSound(correct.id);
    }, 600);
}

// ========================================
// HANDLE QUIZ CHOICE (shared)
// ========================================

function handleQuizChoice(selectedData, btnEl) {
    if (vocabState.quizAnswered) return;
    vocabState.quizAnswered = true;

    clearVocabTimers();
    AudioManager.stopAll();

    var isCorrect = selectedData.name === vocabState.quizAnswer.name;
    var feedback = document.getElementById('vquiz-feedback');
    var btnClass = vocabState.quizType === 'color' ? '.color-choice-btn' :
                   vocabState.quizType === 'shape' ? '.shape-choice-btn' : '.animal-choice-btn';
    var quizCategory = vocabState.quizType === 'color' ? 'colors' :
                       vocabState.quizType === 'shape' ? 'shapes' : 'animals';

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

        if (vocabState.quizCorrect % 3 === 0) launchConfetti();

        // Sequential: celebration → sentence → next round
        vocabDelay(function() {
            AudioManager.playCelebration()
                .then(function() {
                    return AudioManager.playVocabSentence(quizCategory, getItemId(vocabState.quizAnswer));
                })
                .then(function() {
                    vocabDelay(function() { nextQuizRound(); }, 500);
                })
                .catch(function() {
                    vocabDelay(function() { nextQuizRound(); }, 2000);
                });
        }, 300);

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

        // Sequential: try_again → enable retry
        vocabDelay(function() {
            AudioManager.playInstruction('try_again')
                .then(function() {
                    enableCorrectButtonRetry(allBtns, btnClass, feedback, quizCategory);
                })
                .catch(function() {
                    vocabDelay(function() {
                        enableCorrectButtonRetry(allBtns, btnClass, feedback, quizCategory);
                    }, 1500);
                });
        }, 300);
    }
}

// ========================================
// RETRY — Let Prisha tap the correct answer
// ========================================

function enableCorrectButtonRetry(allBtns, btnClass, feedback, quizCategory) {
    vocabState.quizAnswered = false;

    document.getElementById('vquiz-prompt').textContent = 'Tap ' + vocabState.quizAnswer.name + '!';

    for (var n = 0; n < allBtns.length; n++) {
        if (allBtns[n].getAttribute('data-name') === vocabState.quizAnswer.name) {
            allBtns[n].classList.remove('wrong', 'disabled');
            allBtns[n].classList.add('hint');

            (function(btn, answer, cat, bClass) {
                btn.onclick = function() {
                    if (vocabState.quizAnswered) return;
                    vocabState.quizAnswered = true;

                    clearVocabTimers();
                    AudioManager.stopAll();

                    btn.classList.remove('hint');
                    btn.classList.add('correct');
                    feedback.innerHTML = '<div class="feedback-msg correct">🎉 That\'s ' + answer.name + '!</div>';

                    var btns = document.querySelectorAll(bClass);
                    for (var p = 0; p < btns.length; p++) btns[p].classList.add('disabled');

                    // Sequential: celebration → sentence → next round
                    vocabDelay(function() {
                        AudioManager.playCelebration()
                            .then(function() {
                                return AudioManager.playVocabSentence(cat, getItemId(answer));
                            })
                            .then(function() {
                                vocabDelay(function() { nextQuizRound(); }, 500);
                            })
                            .catch(function() {
                                vocabDelay(function() { nextQuizRound(); }, 2000);
                            });
                    }, 300);
                };
            })(allBtns[n], vocabState.quizAnswer, quizCategory, btnClass);
        }
    }
}

// ========================================
// RESULTS
// ========================================

function showVocabResults() {
    clearVocabTimers();
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

    var name = ChildName.get() || 'friend';

    if (pct >= 90) { title.textContent = 'SUPERSTAR, ' + name + '!'; mascot.textContent = '🦕🏆'; }
    else if (pct >= 70) { title.textContent = 'Great Job, ' + name + '!'; mascot.textContent = '🦕⭐'; }
    else if (pct >= 50) { title.textContent = 'Good Try, ' + name + '!'; mascot.textContent = '🦕😊'; }
    else { title.textContent = 'Keep Practicing!'; mascot.textContent = '🦕💪'; }

    document.getElementById('vocab-results-text').innerHTML = 'You got <strong>' + score + ' out of ' + total + '</strong> correct!';

    var playAgainBtn = document.getElementById('vocab-play-again-btn');
    if (vocabState.quizType === 'color') {
        playAgainBtn.onclick = function() { startColorQuiz(); };
    } else if (vocabState.quizType === 'shape') {
        playAgainBtn.onclick = function() { startShapeQuiz(); };
    } else {
        playAgainBtn.onclick = function() { startAnimalQuiz(); };
    }

    vocabDelay(function() {
        if (pct >= 70) {
            launchConfetti();
            AudioManager.playCelebration();
        } else {
            AudioManager.playVocabInstruction('keep_practicing_vocab');
        }
    }, 800);

    updateVocabStars();
}

// ========================================
// INIT
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    updateVocabStars();
});