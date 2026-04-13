/* ========================================
   Odd One Out Game
   ========================================
   Prisha sees 3-5 items. One is different.
   She taps the odd one out.

   Rules applied:
   - AudioManager only (no Speech.speak)
   - .then() promise chains for audio sequencing
   - clearTimers + stopAll at every transition
   - No repeat puzzles via usedPuzzles tracking
   - Empty HTML placeholders
   ======================================== */

// ========================================
// PUZZLE DATA
// ========================================

var OOO_PUZZLES = [
    // --- CATEGORY: Fruits vs Animals ---
    {
        category: 'fruits',
        prompt: 'Which one is NOT a fruit?',
        items: [
            { emoji: '🍎', label: 'Apple' },
            { emoji: '🍌', label: 'Banana' },
            { emoji: '🍇', label: 'Grapes' },
            { emoji: '🍊', label: 'Orange' },
            { emoji: '🍓', label: 'Strawberry' }
        ],
        odd: { emoji: '🐱', label: 'Cat' },
        explanation: 'Cat is an animal, not a fruit!'
    },
    {
        category: 'fruits',
        prompt: 'Which one is NOT a fruit?',
        items: [
            { emoji: '🍎', label: 'Apple' },
            { emoji: '🍒', label: 'Cherry' },
            { emoji: '🍑', label: 'Peach' },
            { emoji: '🍋', label: 'Lemon' },
            { emoji: '🫐', label: 'Blueberry' }
        ],
        odd: { emoji: '🐶', label: 'Dog' },
        explanation: 'Dog is an animal, not a fruit!'
    },
    {
        category: 'fruits',
        prompt: 'Which one is NOT a fruit?',
        items: [
            { emoji: '🍌', label: 'Banana' },
            { emoji: '🍉', label: 'Watermelon' },
            { emoji: '🥭', label: 'Mango' },
            { emoji: '🍇', label: 'Grapes' },
            { emoji: '🍊', label: 'Orange' }
        ],
        odd: { emoji: '🌸', label: 'Flower' },
        explanation: 'Flower is a plant, not a fruit!'
    },

    // --- CATEGORY: Animals vs Objects ---
    {
        category: 'animals',
        prompt: 'Which one is NOT an animal?',
        items: [
            { emoji: '🐶', label: 'Dog' },
            { emoji: '🐱', label: 'Cat' },
            { emoji: '🐰', label: 'Rabbit' },
            { emoji: '🐸', label: 'Frog' },
            { emoji: '🐦', label: 'Bird' }
        ],
        odd: { emoji: '🚗', label: 'Car' },
        explanation: 'Car is a vehicle, not an animal!'
    },
    {
        category: 'animals',
        prompt: 'Which one is NOT an animal?',
        items: [
            { emoji: '🦁', label: 'Lion' },
            { emoji: '🐘', label: 'Elephant' },
            { emoji: '🐵', label: 'Monkey' },
            { emoji: '🦒', label: 'Giraffe' },
            { emoji: '🐻', label: 'Bear' }
        ],
        odd: { emoji: '⭐', label: 'Star' },
        explanation: 'Star is in the sky, not an animal!'
    },
    {
        category: 'animals',
        prompt: 'Which one is NOT an animal?',
        items: [
            { emoji: '🐷', label: 'Pig' },
            { emoji: '🐮', label: 'Cow' },
            { emoji: '🐴', label: 'Horse' },
            { emoji: '🐑', label: 'Sheep' },
            { emoji: '🐔', label: 'Chicken' }
        ],
        odd: { emoji: '🍕', label: 'Pizza' },
        explanation: 'Pizza is food, not an animal!'
    },

    // --- CATEGORY: Colors ---
    {
        category: 'colors',
        prompt: 'Which color is different?',
        items: [
            { emoji: '', label: 'Red', color: '#FF0000' },
            { emoji: '', label: 'Red', color: '#FF0000' },
            { emoji: '', label: 'Red', color: '#FF0000' },
            { emoji: '', label: 'Red', color: '#FF0000' },
            { emoji: '', label: 'Red', color: '#FF0000' }
        ],
        odd: { emoji: '', label: 'Blue', color: '#0066FF' },
        explanation: 'Blue is different from all the red ones!'
    },
    {
        category: 'colors',
        prompt: 'Which color is different?',
        items: [
            { emoji: '', label: 'Green', color: '#00CC00' },
            { emoji: '', label: 'Green', color: '#00CC00' },
            { emoji: '', label: 'Green', color: '#00CC00' },
            { emoji: '', label: 'Green', color: '#00CC00' },
            { emoji: '', label: 'Green', color: '#00CC00' }
        ],
        odd: { emoji: '', label: 'Yellow', color: '#FFD700' },
        explanation: 'Yellow is different from all the green ones!'
    },
    {
        category: 'colors',
        prompt: 'Which color is different?',
        items: [
            { emoji: '', label: 'Purple', color: '#8B00FF' },
            { emoji: '', label: 'Purple', color: '#8B00FF' },
            { emoji: '', label: 'Purple', color: '#8B00FF' },
            { emoji: '', label: 'Purple', color: '#8B00FF' },
            { emoji: '', label: 'Purple', color: '#8B00FF' }
        ],
        odd: { emoji: '', label: 'Orange', color: '#FF8C00' },
        explanation: 'Orange is different from all the purple ones!'
    },
    {
        category: 'colors',
        prompt: 'Which color is different?',
        items: [
            { emoji: '', label: 'Pink', color: '#FF69B4' },
            { emoji: '', label: 'Pink', color: '#FF69B4' },
            { emoji: '', label: 'Pink', color: '#FF69B4' },
            { emoji: '', label: 'Pink', color: '#FF69B4' },
            { emoji: '', label: 'Pink', color: '#FF69B4' }
        ],
        odd: { emoji: '', label: 'Brown', color: '#8B4513' },
        explanation: 'Brown is different from all the pink ones!'
    },

    // --- CATEGORY: Shapes ---
    {
        category: 'shapes',
        prompt: 'Which shape is different?',
        items: [
            { emoji: '⭕', label: 'Circle' },
            { emoji: '⭕', label: 'Circle' },
            { emoji: '⭕', label: 'Circle' },
            { emoji: '⭕', label: 'Circle' },
            { emoji: '⭕', label: 'Circle' }
        ],
        odd: { emoji: '🔺', label: 'Triangle' },
        explanation: 'Triangle has 3 sides, circles are round!'
    },
    {
        category: 'shapes',
        prompt: 'Which shape is different?',
        items: [
            { emoji: '⭐', label: 'Star' },
            { emoji: '⭐', label: 'Star' },
            { emoji: '⭐', label: 'Star' },
            { emoji: '⭐', label: 'Star' },
            { emoji: '⭐', label: 'Star' }
        ],
        odd: { emoji: '❤️', label: 'Heart' },
        explanation: 'Heart is different from all the stars!'
    },
    {
        category: 'shapes',
        prompt: 'Which shape is different?',
        items: [
            { emoji: '🟧', label: 'Square' },
            { emoji: '🟧', label: 'Square' },
            { emoji: '🟧', label: 'Square' },
            { emoji: '🟧', label: 'Square' },
            { emoji: '🟧', label: 'Square' }
        ],
        odd: { emoji: '⭕', label: 'Circle' },
        explanation: 'Circle is round, squares have straight sides!'
    },

    // --- CATEGORY: Big vs Small (emoji size trick) ---
    {
        category: 'size',
        prompt: 'Which one is different?',
        items: [
            { emoji: '🐘', label: 'Elephant' },
            { emoji: '🐘', label: 'Elephant' },
            { emoji: '🐘', label: 'Elephant' },
            { emoji: '🐘', label: 'Elephant' },
            { emoji: '🐘', label: 'Elephant' }
        ],
        odd: { emoji: '🐭', label: 'Mouse' },
        explanation: 'Mouse is tiny, elephants are big!'
    },

    // --- CATEGORY: Food vs Toys ---
    {
        category: 'food',
        prompt: 'Which one is NOT food?',
        items: [
            { emoji: '🍕', label: 'Pizza' },
            { emoji: '🍔', label: 'Burger' },
            { emoji: '🌮', label: 'Taco' },
            { emoji: '🍩', label: 'Donut' },
            { emoji: '🧁', label: 'Cupcake' }
        ],
        odd: { emoji: '🧸', label: 'Teddy Bear' },
        explanation: 'Teddy Bear is a toy, not food!'
    },
    {
        category: 'food',
        prompt: 'Which one is NOT food?',
        items: [
            { emoji: '🍎', label: 'Apple' },
            { emoji: '🥕', label: 'Carrot' },
            { emoji: '🥦', label: 'Broccoli' },
            { emoji: '🌽', label: 'Corn' },
            { emoji: '🍌', label: 'Banana' }
        ],
        odd: { emoji: '⚽', label: 'Ball' },
        explanation: 'Ball is a toy, not food!'
    },

    // --- CATEGORY: Sky vs Water ---
    {
        category: 'sky',
        prompt: 'Which one does NOT fly?',
        items: [
            { emoji: '🐦', label: 'Bird' },
            { emoji: '🦋', label: 'Butterfly' },
            { emoji: '✈️', label: 'Airplane' },
            { emoji: '🎈', label: 'Balloon' },
            { emoji: '🐝', label: 'Bee' }
        ],
        odd: { emoji: '🐟', label: 'Fish' },
        explanation: 'Fish swims in water, it cannot fly!'
    },

    // --- CATEGORY: Water animals vs Land ---
    {
        category: 'water',
        prompt: 'Which one does NOT live in water?',
        items: [
            { emoji: '🐟', label: 'Fish' },
            { emoji: '🐙', label: 'Octopus' },
            { emoji: '🐳', label: 'Whale' },
            { emoji: '🦀', label: 'Crab' },
            { emoji: '🐢', label: 'Turtle' }
        ],
        odd: { emoji: '🦁', label: 'Lion' },
        explanation: 'Lion lives on land, not in water!'
    },

    // --- CATEGORY: Vehicles vs Animals ---
    {
        category: 'vehicles',
        prompt: 'Which one is NOT a vehicle?',
        items: [
            { emoji: '🚗', label: 'Car' },
            { emoji: '🚌', label: 'Bus' },
            { emoji: '🚂', label: 'Train' },
            { emoji: '✈️', label: 'Airplane' },
            { emoji: '🚢', label: 'Ship' }
        ],
        odd: { emoji: '🐘', label: 'Elephant' },
        explanation: 'Elephant is an animal, not a vehicle!'
    },

    // --- CATEGORY: Same emoji, one different ---
    {
        category: 'same',
        prompt: 'Which one is different?',
        items: [
            { emoji: '🌟', label: 'Star' },
            { emoji: '🌟', label: 'Star' },
            { emoji: '🌟', label: 'Star' },
            { emoji: '🌟', label: 'Star' },
            { emoji: '🌟', label: 'Star' }
        ],
        odd: { emoji: '🌙', label: 'Moon' },
        explanation: 'Moon is different from all the stars!'
    },
    {
        category: 'same',
        prompt: 'Which one is different?',
        items: [
            { emoji: '🐱', label: 'Cat' },
            { emoji: '🐱', label: 'Cat' },
            { emoji: '🐱', label: 'Cat' },
            { emoji: '🐱', label: 'Cat' },
            { emoji: '🐱', label: 'Cat' }
        ],
        odd: { emoji: '🐶', label: 'Dog' },
        explanation: 'Dog is different from all the cats!'
    }
];

// ========================================
// GAME STATE
// ========================================

var oooState = {
    difficulty: 'easy',
    totalRounds: 10,
    currentRound: 0,
    correctCount: 0,
    wrongCount: 0,
    isAnswered: false,
    usedPuzzles: [],
    roundHistory: [],
    currentPuzzle: null,
    oddIndex: -1
};

// ========================================
// TIMER MANAGEMENT
// ========================================

var oooTimers = [];

function clearOooTimers() {
    for (var i = 0; i < oooTimers.length; i++) {
        clearTimeout(oooTimers[i]);
    }
    oooTimers = [];
}

function oooDelay(fn, ms) {
    var id = setTimeout(fn, ms);
    oooTimers.push(id);
    return id;
}

// ========================================
// DIFFICULTY
// ========================================

function setOooDifficulty(level) {
    oooState.difficulty = level;
    var buttons = document.querySelectorAll('.diff-btn');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active');
    }
    document.getElementById('ooo-diff-' + level).classList.add('active');
}

function getOooItemCount() {
    if (oooState.difficulty === 'easy') return 3;
    if (oooState.difficulty === 'medium') return 4;
    return 5;
}

// ========================================
// SCREEN MANAGEMENT
// ========================================

function showOooScreen(id) {
    var screens = document.querySelectorAll('.screen');
    for (var i = 0; i < screens.length; i++) {
        screens[i].classList.remove('active');
    }
    document.getElementById(id).classList.add('active');
}

// ========================================
// START GAME
// ========================================

function startOddOneOut() {
    oooState.currentRound = 0;
    oooState.correctCount = 0;
    oooState.wrongCount = 0;
    oooState.isAnswered = false;
    oooState.usedPuzzles = [];
    oooState.roundHistory = [];

    document.getElementById('ooo-score-correct').textContent = '✅ 0';
    document.getElementById('ooo-score-wrong').textContent = '❌ 0';

    showOooScreen('ooo-game');
    clearOooTimers();
    AudioManager.stopAll();

    AudioManager.playGameInstruction('find_the_different')
        .then(function() {
            oooDelay(function() { nextOooRound(); }, 300);
        })
        .catch(function() {
            oooDelay(function() { nextOooRound(); }, 2500);
        });
}

// ========================================
// NEXT ROUND
// ========================================

function nextOooRound() {
    clearOooTimers();
    AudioManager.stopAll();

    oooState.currentRound++;
    oooState.isAnswered = false;

    if (oooState.currentRound > oooState.totalRounds) {
        showOooResults();
        return;
    }

    // Update progress
    document.getElementById('ooo-round-text').textContent = 'Round ' + oooState.currentRound + ' of ' + oooState.totalRounds;
    document.getElementById('ooo-progress-fill').style.width = (((oooState.currentRound - 1) / oooState.totalRounds) * 100) + '%';
    document.getElementById('ooo-feedback').innerHTML = '';
    document.getElementById('ooo-teaching').innerHTML = '';

    // Pick unused puzzle
    var available = [];
    for (var a = 0; a < OOO_PUZZLES.length; a++) {
        if (oooState.usedPuzzles.indexOf(a) === -1) available.push(a);
    }
    if (available.length === 0) {
        oooState.usedPuzzles = [];
        for (var b = 0; b < OOO_PUZZLES.length; b++) available.push(b);
    }

    var puzzleIndex = available[Math.floor(Math.random() * available.length)];
    oooState.usedPuzzles.push(puzzleIndex);

    var puzzle = OOO_PUZZLES[puzzleIndex];
    oooState.currentPuzzle = puzzle;

    // Set prompt
    document.getElementById('ooo-prompt-text').textContent = puzzle.prompt;

    // Category hint
    var hintEl = document.getElementById('ooo-category-hint');
    var hintMap = {
        'fruits': '🍎 Fruits',
        'animals': '🐾 Animals',
        'colors': '🎨 Colors',
        'shapes': '🔷 Shapes',
        'size': '📏 Big & Small',
        'food': '🍕 Food',
        'sky': '☁️ Things that Fly',
        'water': '🌊 Water Animals',
        'vehicles': '🚗 Vehicles',
        'same': '👀 Look Carefully'
    };
    hintEl.textContent = hintMap[puzzle.category] || '';

    // Build items array: pick (itemCount - 1) normal items + 1 odd
    var itemCount = getOooItemCount();
    var normalCount = itemCount - 1;

    // Pick random normal items from the puzzle's items array
    var normalPool = puzzle.items.slice();
    var displayItems = [];

    for (var n = 0; n < normalCount; n++) {
        if (normalPool.length > 0) {
            var randIdx = Math.floor(Math.random() * normalPool.length);
            displayItems.push(normalPool[randIdx]);
            // For "same" category, don't remove — we want duplicates
            if (puzzle.category !== 'same' && puzzle.category !== 'colors' &&
                puzzle.category !== 'shapes' && puzzle.category !== 'size') {
                normalPool.splice(randIdx, 1);
            }
        } else {
            // Reuse from original
            displayItems.push(puzzle.items[Math.floor(Math.random() * puzzle.items.length)]);
        }
    }

    // Add the odd one
    displayItems.push(puzzle.odd);

    // Shuffle
    displayItems = shuffleOooArray(displayItems);

    // Find where the odd one ended up
    oooState.oddIndex = -1;
    for (var f = 0; f < displayItems.length; f++) {
        if (displayItems[f].label === puzzle.odd.label &&
            displayItems[f].emoji === puzzle.odd.emoji) {
            oooState.oddIndex = f;
            break;
        }
    }

    // Render items
    var container = document.getElementById('ooo-items-container');
    container.innerHTML = '';

    for (var i = 0; i < displayItems.length; i++) {
        var item = displayItems[i];
        var card = document.createElement('button');
        card.className = 'ooo-item-card';
        card.setAttribute('data-index', i.toString());

        if (puzzle.category === 'colors' && item.color) {
            // Color swatch
            card.innerHTML =
                '<div class="ooo-color-swatch" style="background:' + item.color + ';"></div>' +
                '<span class="ooo-item-label">' + item.label + '</span>';
        } else {
            card.innerHTML =
                '<span class="ooo-item-emoji">' + item.emoji + '</span>' +
                '<span class="ooo-item-label">' + item.label + '</span>';
        }

        (function(idx) {
            card.addEventListener('click', function() {
                handleOooChoice(idx, this);
            });
        })(i);

        container.appendChild(card);
    }

    // Speak the prompt
    oooDelay(function() {
        AudioManager.playGameInstruction('which_one_different');
    }, 500);
}

// ========================================
// HANDLE CHOICE
// ========================================

function handleOooChoice(selectedIndex, cardEl) {
    if (oooState.isAnswered) return;
    oooState.isAnswered = true;

    clearOooTimers();
    AudioManager.stopAll();

    var isCorrect = selectedIndex === oooState.oddIndex;
    var feedback = document.getElementById('ooo-feedback');
    var teaching = document.getElementById('ooo-teaching');
    var puzzle = oooState.currentPuzzle;

    var allCards = document.querySelectorAll('.ooo-item-card');
    for (var i = 0; i < allCards.length; i++) {
        allCards[i].classList.add('disabled');
    }

    if (isCorrect) {
        cardEl.classList.add('correct');
        oooState.correctCount++;
        document.getElementById('ooo-score-correct').textContent = '✅ ' + oooState.correctCount;

        // Dim the normal items
        for (var d = 0; d < allCards.length; d++) {
            if (d !== selectedIndex) {
                allCards[d].classList.add('dimmed');
            }
        }

        feedback.innerHTML = '<div class="feedback-msg correct">🎉 Yes! ' + puzzle.odd.label + '!</div>';
        teaching.innerHTML =
            '<div class="teaching-msg">' +
                '<span class="teaching-emoji">' + puzzle.odd.emoji + '</span> ' +
                puzzle.explanation +
            '</div>';

        oooState.roundHistory.push({
            puzzle: puzzle,
            correct: true
        });

        Rewards.addStar('games');
        updateOooStars();

        if (oooState.correctCount % 3 === 0) launchConfetti();

        // Sequential: celebration → explanation → next round
        oooDelay(function() {
            AudioManager.playCelebration()
                .then(function() {
                    return AudioManager.playGameExplanation(puzzle.explanation);
                })
                .then(function() {
                    oooDelay(function() { nextOooRound(); }, 500);
                })
                .catch(function() {
                    oooDelay(function() { nextOooRound(); }, 2500);
                });
        }, 300);

    } else {
        cardEl.classList.add('wrong');
        oooState.wrongCount++;
        document.getElementById('ooo-score-wrong').textContent = '❌ ' + oooState.wrongCount;

        // Highlight correct answer
        allCards[oooState.oddIndex].classList.add('hint');

        feedback.innerHTML = '<div class="feedback-msg wrong">Oops! Look for ' + puzzle.odd.label + '!</div>';
        teaching.innerHTML =
            '<div class="teaching-msg">' +
                '<span class="teaching-emoji">' + puzzle.odd.emoji + '</span> ' +
                puzzle.explanation +
            '</div>';

        oooState.roundHistory.push({
            puzzle: puzzle,
            correct: false
        });

        // Sequential: try_again → enable retry on correct card
        oooDelay(function() {
            AudioManager.playInstruction('try_again')
                .then(function() {
                    enableOooRetry(allCards, feedback, teaching, puzzle);
                })
                .catch(function() {
                    oooDelay(function() {
                        enableOooRetry(allCards, feedback, teaching, puzzle);
                    }, 1500);
                });
        }, 300);
    }
}

// ========================================
// RETRY — Let Prisha tap the correct one
// ========================================

function enableOooRetry(allCards, feedback, teaching, puzzle) {
    oooState.isAnswered = false;

    document.getElementById('ooo-prompt-text').textContent = 'Tap ' + puzzle.odd.label + '!';

    var correctCard = allCards[oooState.oddIndex];
    correctCard.classList.remove('wrong', 'disabled');
    correctCard.classList.add('hint');

    (function(card, oddItem, explain) {
        card.onclick = function() {
            if (oooState.isAnswered) return;
            oooState.isAnswered = true;

            clearOooTimers();
            AudioManager.stopAll();

            card.classList.remove('hint');
            card.classList.add('correct');

            // Dim others
            for (var d = 0; d < allCards.length; d++) {
                if (d !== oooState.oddIndex) {
                    allCards[d].classList.add('dimmed');
                }
                allCards[d].classList.add('disabled');
            }

            feedback.innerHTML = '<div class="feedback-msg correct">🎉 That\'s ' + oddItem.label + '!</div>';

            // Sequential: celebration → explanation → next round
            oooDelay(function() {
                AudioManager.playCelebration()
                    .then(function() {
                        return AudioManager.playGameExplanation(explain);
                    })
                    .then(function() {
                        oooDelay(function() { nextOooRound(); }, 500);
                    })
                    .catch(function() {
                        oooDelay(function() { nextOooRound(); }, 2500);
                    });
            }, 300);
        };
    })(correctCard, puzzle.odd, puzzle.explanation);
}

// ========================================
// RESULTS
// ========================================

function showOooResults() {
    clearOooTimers();
    AudioManager.stopAll();
    showOooScreen('ooo-results');

    var score = oooState.correctCount;
    var total = oooState.totalRounds;
    var pct = Math.round((score / total) * 100);

    var stars = pct >= 90 ? 5 : pct >= 70 ? 4 : pct >= 50 ? 3 : pct >= 30 ? 2 : 1;
    var starsHtml = '';
    for (var i = 0; i < 5; i++) starsHtml += (i < stars) ? '⭐' : '☆';
    document.getElementById('ooo-results-stars').innerHTML = starsHtml;

    var title = document.getElementById('ooo-results-title');
    var mascot = document.getElementById('ooo-results-mascot');

    var name = ChildName.get() || 'friend';

    if (pct >= 90) { title.textContent = 'SUPERSTAR, ' + name + '!'; mascot.textContent = '🦕🏆'; }
    else if (pct >= 70) { title.textContent = 'Great Job, ' + name + '!'; mascot.textContent = '🦕⭐'; }
    else if (pct >= 50) { title.textContent = 'Good Try, ' + name + '!'; mascot.textContent = '🦕😊'; }
    else { title.textContent = 'Keep Practicing!'; mascot.textContent = '🦕💪'; }

    document.getElementById('ooo-results-text').innerHTML =
        'You got <strong>' + score + ' out of ' + total + '</strong> correct!<br>' +
        'That is ' + pct + '%!';

    // Review wrong answers
    var reviewEl = document.getElementById('ooo-results-review');
    var wrongOnes = [];
    for (var j = 0; j < oooState.roundHistory.length; j++) {
        if (!oooState.roundHistory[j].correct) {
            wrongOnes.push(oooState.roundHistory[j]);
        }
    }

    if (wrongOnes.length > 0) {
        var reviewHtml = '<div class="review-title">Tricky ones:</div>';
        for (var k = 0; k < wrongOnes.length; k++) {
            var p = wrongOnes[k].puzzle;
            reviewHtml += '<div class="review-item">' +
                '<span class="review-pair">' + p.odd.emoji + ' ' + p.odd.label + '</span>' +
                '<span>' + p.explanation + '</span>' +
                '</div>';
        }
        reviewEl.innerHTML = reviewHtml;
    } else {
        reviewEl.innerHTML = '<div class="review-title">🎉 Perfect score! You found them all!</div>';
    }

    oooDelay(function() {
        if (pct >= 70) {
            launchConfetti();
            AudioManager.playCelebration();
        } else {
            AudioManager.playGameInstruction('keep_trying');
        }
    }, 800);

    updateOooStars();
}

// ========================================
// HELPERS
// ========================================

function updateOooStars() {
    var el = document.getElementById('star-counter');
    if (el) el.textContent = '⭐ ' + Rewards.getStars('games');
}

function shuffleOooArray(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
}

// ========================================
// INIT
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    updateOooStars();
});
