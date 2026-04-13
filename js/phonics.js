/* ========================================
   Phonics Module - Letter Explorer
   ========================================
   Features:
   - 26 letter cards with uppercase + lowercase
   - High-quality audio (MP3 with TTS fallback)
   - Swipe navigation on mobile
   - Keyboard navigation on desktop
   - Star rewards + celebrations
   - Progress saving (localStorage)
   ======================================== */

// --- Letter Data (26 letters with words, images, and themes) ---
var LETTERS = [
    { upper: 'A', lower: 'a', word: 'Apple',     emoji: '🍎', theme: 'theme-warm',   dinoTip: 'A says "aah" like Apple!' },
    { upper: 'B', lower: 'b', word: 'Butterfly',  emoji: '🦋', theme: 'theme-cool',   dinoTip: 'B says "bah" like Butterfly!' },
    { upper: 'C', lower: 'c', word: 'Cat',        emoji: '🐱', theme: 'theme-orange', dinoTip: 'C says "kah" like Cat!' },
    { upper: 'D', lower: 'd', word: 'Dinosaur',   emoji: '🦕', theme: 'theme-nature', dinoTip: 'D says "dah" like Dinosaur! That\'s me!' },
    { upper: 'E', lower: 'e', word: 'Elephant',   emoji: '🐘', theme: 'theme-purple', dinoTip: 'E says "ehh" like Elephant!' },
    { upper: 'F', lower: 'f', word: 'Fish',       emoji: '🐟', theme: 'theme-cool',   dinoTip: 'F says "fah" like Fish!' },
    { upper: 'G', lower: 'g', word: 'Grapes',     emoji: '🍇', theme: 'theme-purple', dinoTip: 'G says "gah" like Grapes!' },
    { upper: 'H', lower: 'h', word: 'Heart',      emoji: '❤️', theme: 'theme-warm',   dinoTip: 'H says "hah" like Heart!' },
    { upper: 'I', lower: 'i', word: 'Ice Cream',  emoji: '🍦', theme: 'theme-sun',    dinoTip: 'I says "iih" like Ice Cream!' },
    { upper: 'J', lower: 'j', word: 'Jellyfish',  emoji: '🪼', theme: 'theme-cool',   dinoTip: 'J says "jah" like Jellyfish!' },
    { upper: 'K', lower: 'k', word: 'Kite',       emoji: '🪁', theme: 'theme-orange', dinoTip: 'K says "kah" like Kite!' },
    { upper: 'L', lower: 'l', word: 'Lion',       emoji: '🦁', theme: 'theme-sun',    dinoTip: 'L says "lah" like Lion!' },
    { upper: 'M', lower: 'm', word: 'Moon',       emoji: '🌙', theme: 'theme-purple', dinoTip: 'M says "mah" like Moon!' },
    { upper: 'N', lower: 'n', word: 'Nest',       emoji: '🪺', theme: 'theme-nature', dinoTip: 'N says "nah" like Nest!' },
    { upper: 'O', lower: 'o', word: 'Octopus',    emoji: '🐙', theme: 'theme-warm',   dinoTip: 'O says "awe" like Octopus!' },
    { upper: 'P', lower: 'p', word: 'Penguin',    emoji: '🐧', theme: 'theme-cool',   dinoTip: 'P says "pah" like Penguin!' },
    { upper: 'Q', lower: 'q', word: 'Queen',      emoji: '👑', theme: 'theme-sun',    dinoTip: 'Q says "kwah" like Queen!' },
    { upper: 'R', lower: 'r', word: 'Rainbow',    emoji: '🌈', theme: 'theme-warm',   dinoTip: 'R says "rah" like Rainbow!' },
    { upper: 'S', lower: 's', word: 'Star',       emoji: '⭐', theme: 'theme-sun',    dinoTip: 'S says "sah" like Star!' },
    { upper: 'T', lower: 't', word: 'Turtle',     emoji: '🐢', theme: 'theme-nature', dinoTip: 'T says "tah" like Turtle!' },
    { upper: 'U', lower: 'u', word: 'Umbrella',   emoji: '☂️', theme: 'theme-purple', dinoTip: 'U says "uhh" like Umbrella!' },
    { upper: 'V', lower: 'v', word: 'Violin',     emoji: '🎻', theme: 'theme-orange', dinoTip: 'V says "vah" like Violin!' },
    { upper: 'W', lower: 'w', word: 'Whale',      emoji: '🐋', theme: 'theme-cool',   dinoTip: 'W says "wah" like Whale!' },
    { upper: 'X', lower: 'x', word: 'Xylophone',  emoji: '🎵', theme: 'theme-warm',   dinoTip: 'X says "ecks" like Xylophone!' },
    { upper: 'Y', lower: 'y', word: 'Yarn',       emoji: '🧶', theme: 'theme-orange', dinoTip: 'Y says "yah" like Yarn!' },
    { upper: 'Z', lower: 'z', word: 'Zebra',      emoji: '🦓', theme: 'theme-nature', dinoTip: 'Z says "zah" like Zebra!' }
];
// --- State ---
let currentIndex = 0;
let visitedLetters = new Set();
let direction = 'next'; // for animation direction

// --- Load saved progress ---
function loadProgress() {
    const saved = localStorage.getItem('phonics_visited');
    if (saved) {
        try {
            visitedLetters = new Set(JSON.parse(saved));
        } catch (e) {
            visitedLetters = new Set();
        }
    }
    const savedIndex = localStorage.getItem('phonics_currentIndex');
    if (savedIndex !== null) {
        currentIndex = parseInt(savedIndex);
        // Validate index
        if (currentIndex < 0 || currentIndex > 25) currentIndex = 0;
    }
}

function saveProgress() {
    localStorage.setItem('phonics_visited', JSON.stringify([...visitedLetters]));
    localStorage.setItem('phonics_currentIndex', currentIndex);
}

// --- Screen Management ---
function showPhonicsMenu() {
    document.getElementById('phonics-menu').classList.add('active');
    document.getElementById('letter-explorer').classList.remove('active');
    updateMenuProgress();
    AudioManager.stopAll();
}

function startLetterExplorer() {
    document.getElementById('phonics-menu').classList.remove('active');
    document.getElementById('letter-explorer').classList.add('active');
    loadProgress();
    buildDotIndicators();
    showLetter(currentIndex);

    // Welcome speech
    setTimeout(() => {
        AudioManager.playInstruction('lets_learn');
    }, 500);
}

// --- Update Menu Progress ---
function updateMenuProgress() {
    const el = document.getElementById('explorer-progress');
    if (el) {
        el.textContent = `${visitedLetters.size} / 26 explored`;
    }
}

// --- Build Dot Indicators ---
function buildDotIndicators() {
    const container = document.getElementById('dot-indicators');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 26; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot';
        dot.setAttribute('data-index', i);
        dot.addEventListener('click', () => {
            direction = i > currentIndex ? 'next' : 'prev';
            currentIndex = i;
            showLetter(currentIndex);
        });
        container.appendChild(dot);
    }
}

// --- Show Letter ---
function showLetter(index) {
    const letter = LETTERS[index];
    const card = document.getElementById('letter-card');
    const name = ChildName.get() || 'friend';

    // Stop any playing audio
    AudioManager.stopAll();

    // Animate card
    card.style.animation = 'none';
    card.offsetHeight; // trigger reflow
    card.style.animation = direction === 'next'
        ? 'cardSlideIn 0.4s ease'
        : 'cardSlideInReverse 0.4s ease';

    // Update card content
    document.getElementById('letter-upper').textContent = letter.upper;
    document.getElementById('letter-lower').textContent = letter.lower;
    document.getElementById('letter-image').textContent = letter.emoji;
    document.getElementById('letter-word').textContent = letter.word;

    // Update card theme
    card.className = 'letter-card ' + letter.theme;

    // Update counter
    document.getElementById('explorer-counter').textContent = `Letter ${index + 1} of 26`;

    // Update progress bar
    const progressFill = document.getElementById('progress-fill');
    if (progressFill) {
        progressFill.style.width = `${((index + 1) / 26) * 100}%`;
    }

    // Update dino tip
    const dinoText = document.getElementById('dino-says-text');
    if (dinoText) {
        dinoText.textContent = letter.dinoTip;
    }

    // Update navigation buttons
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    if (btnPrev) btnPrev.disabled = index === 0;
    if (btnNext) btnNext.textContent = index === 25 ? '🎉 Finish!' : 'Next ▶️';

    // Mark as visited & award star
    if (!visitedLetters.has(index)) {
        visitedLetters.add(index);
        Rewards.addStar('phonics');
        updateStarCounter();

        // Small celebration for every 5 letters
        if (visitedLetters.size % 5 === 0 && visitedLetters.size > 0) {
            setTimeout(() => {
                launchConfetti();
                showCelebration(
                    '🌟',
                    `${visitedLetters.size} Letters Explored!`,
                    'Keep going, ' + name + '! You\'re doing great!'
                );
            }, 800);
        }
    }

    // Update dots
    updateDots();

    // Save progress
    saveProgress();

    // Preload nearby letters for instant playback
    preloadNearbyLetters(index);

    // Auto-speak the letter name using AudioManager
    setTimeout(() => {
        AudioManager.playLetterName(letter.lower);
    }, 400);
}

// --- Preload audio for nearby letters ---
function preloadNearbyLetters(index) {
    // Preload next 2 and previous 1
    for (let offset = -1; offset <= 2; offset++) {
        const i = index + offset;
        if (i >= 0 && i < 26 && i !== index) {
            AudioManager.preloadLetter(LETTERS[i].lower);
        }
    }
}

// --- Update Dot Indicators ---
function updateDots() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
        dot.classList.remove('active', 'visited');
        if (i === currentIndex) {
            dot.classList.add('active');
        } else if (visitedLetters.has(i)) {
            dot.classList.add('visited');
        }
    });
}

// --- Update Star Counter ---
function updateStarCounter() {
    const el = document.getElementById('star-counter');
    if (el) {
        el.textContent = `⭐ ${Rewards.getStars('phonics')}`;
    }
}

// --- Navigation ---
function nextLetter() {
    var name = ChildName.get() || 'friend';
    if (currentIndex >= 25) {
        // Finished all letters!
        launchConfetti();
        AudioManager.playInstruction('all_done');
        showCelebration(
            '🏆🦕',
            'Amazing, ' + name + '!',
            'You explored all 26 letters! You earned ' + Rewards.getStars('phonics') + ' stars!',
            () => showPhonicsMenu()
        );
        return;
    }
    direction = 'next';
    currentIndex++;
    showLetter(currentIndex);
}

function prevLetter() {
    if (currentIndex <= 0) return;
    direction = 'prev';
    currentIndex--;
    showLetter(currentIndex);
}

// --- Sound Buttons ---
function playLetterName() {
    const letter = LETTERS[currentIndex];
    AudioManager.playLetterName(letter.lower);
    animateButton('btn-letter-name');
}

function playPhonicsSound() {
    const letter = LETTERS[currentIndex];
    AudioManager.playPhonicsSound(letter.lower);
    animateButton('btn-phonics-sound');
}

function playWord() {
    const letter = LETTERS[currentIndex];

    // Play sentence ("A is for Apple") for richer experience
    AudioManager.playSentence(letter.lower);
    animateButton('btn-word');
}

// --- Button Animation Feedback ---
function animateButton(btnId) {
    const btn = document.getElementById(btnId);
    if (!btn) return;

    // Visual feedback
    btn.style.background = '#FFD93D';
    btn.style.transform = 'scale(1.1)';
    btn.style.transition = 'all 0.15s ease';

    setTimeout(() => {
        btn.style.background = 'rgba(255, 255, 255, 0.9)';
        btn.style.transform = 'scale(1)';
    }, 300);
}

// --- Touch Swipe Support ---
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let isSwiping = false;

document.addEventListener('DOMContentLoaded', () => {
    // Load progress and update UI
    loadProgress();
    updateStarCounter();
    updateMenuProgress();

    // --- Swipe Handling ---
    const cardContainer = document.getElementById('letter-card-container');
    if (cardContainer) {
        cardContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
            isSwiping = false;
        }, { passive: true });

        cardContainer.addEventListener('touchmove', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diffX = touchStartX - touchEndX;
            const diffY = Math.abs(e.changedTouches[0].screenY - touchStartY);

            // Only swipe if horizontal movement is greater than vertical
            if (Math.abs(diffX) > diffY && Math.abs(diffX) > 30) {
                isSwiping = true;
                const card = document.getElementById('letter-card');
                if (diffX > 0) {
                    card.classList.add('swiping-left');
                    card.classList.remove('swiping-right');
                } else {
                    card.classList.add('swiping-right');
                    card.classList.remove('swiping-left');
                }
            }
        }, { passive: true });

        cardContainer.addEventListener('touchend', (e) => {
            const card = document.getElementById('letter-card');
            card.classList.remove('swiping-left', 'swiping-right');

            if (!isSwiping) return;

            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;

            if (diff > 60) {
                // Swiped left → next letter
                nextLetter();
            } else if (diff < -60) {
                // Swiped right → previous letter
                prevLetter();
            }

            isSwiping = false;
        }, { passive: true });
    }

    // --- Keyboard Navigation (Desktop / Mac) ---
    document.addEventListener('keydown', (e) => {
        const explorer = document.getElementById('letter-explorer');
        if (!explorer || !explorer.classList.contains('active')) return;

        switch (e.key) {
            case 'ArrowRight':
            case ' ':
                e.preventDefault();
                nextLetter();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                prevLetter();
                break;
            case '1':
                e.preventDefault();
                playLetterName();
                break;
            case '2':
                e.preventDefault();
                playPhonicsSound();
                break;
            case '3':
                e.preventDefault();
                playWord();
                break;
            case 'Escape':
                e.preventDefault();
                showPhonicsMenu();
                break;
        }
    });

    // --- Double-tap card to hear full intro ---
    let lastTapTime = 0;
    const letterCard = document.getElementById('letter-card');
    if (letterCard) {
        letterCard.addEventListener('click', () => {
            const now = Date.now();
            if (now - lastTapTime < 400) {
                // Double-tap: play full intro sequence
                const letter = LETTERS[currentIndex];
                AudioManager.playFullLetterIntro(letter.lower);
            } else {
                // Single tap: play letter name
                const letter = LETTERS[currentIndex];
                AudioManager.playLetterName(letter.lower);
            }
            lastTapTime = now;
        });
    }
});