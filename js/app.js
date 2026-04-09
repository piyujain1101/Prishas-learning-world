/* ========================================
   Prisha's Learning World - Core App Logic
   ======================================== */

// --- Rewards / Stars System (localStorage) ---
const Rewards = {
    getStars(module) {
        return parseInt(localStorage.getItem(`stars_${module}`) || '0');
    },
    addStar(module, count = 1) {
        const current = this.getStars(module);
        localStorage.setItem(`stars_${module}`, current + count);
        this.updateUI();
    },
    getTotalStars() {
        const modules = ['phonics', 'numbers', 'vocabulary', 'games'];
        return modules.reduce((sum, m) => sum + this.getStars(m), 0);
    },
    updateUI() {
        const phonicsStars = document.getElementById('phonics-stars');
        const totalStars = document.getElementById('total-stars');
        if (phonicsStars) phonicsStars.textContent = `⭐ ${this.getStars('phonics')}`;
        if (totalStars) totalStars.textContent = this.getTotalStars();
    },
    reset() {
        localStorage.clear();
        this.updateUI();
    }
};

// --- Legacy Text-to-Speech Helper (Fallback only) ---
const Speech = {
    speak(text, rate = 0.85, pitch = 1.1) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = rate;
            utterance.pitch = pitch;
            utterance.volume = 1;

            // Try to use a friendly voice
            const voices = window.speechSynthesis.getVoices();
            const preferred = voices.find(v =>
                v.name.includes('Samantha') ||
                v.name.includes('Karen') ||
                v.name.includes('Moira') ||
                v.lang.startsWith('en')
            );
            if (preferred) utterance.voice = preferred;

            window.speechSynthesis.speak(utterance);
        }
    },
    speakLetter(letter) {
        this.speak(`${letter.toUpperCase()}`, 0.8, 1.1);
    },
    speakPhonics: function(letter) {
    var phonicsMap = {
        'a': 'aah',
        'b': 'bah',
        'c': 'kah',
        'd': 'dah',
        'e': 'ehh',
        'f': 'fah',
        'g': 'gah',
        'h': 'hah',
        'i': 'iih',
        'j': 'jah',
        'k': 'kah',
        'l': 'lah',
        'm': 'mah',
        'n': 'nah',
        'o': 'awe',
        'p': 'pah',
        'q': 'kwah',
        'r': 'rah',
        's': 'sah',
        't': 'tah',
        'u': 'uhh',
        'v': 'vah',
        'w': 'wah',
        'x': 'ecks',
        'y': 'yah',
        'z': 'zah'
    };
    var sound = phonicsMap[letter.toLowerCase()] || letter;
    this.speak(sound, 0.65, 1.0);
},
    celebrate(name = 'Prisha') {
        const phrases = [
            `Great job, ${name}!`,
            `You're amazing, ${name}!`,
            `Wonderful, ${name}!`,
            `You did it, ${name}!`,
            `Super star, ${name}!`,
            `Yay ${name}!`
        ];
        const phrase = phrases[Math.floor(Math.random() * phrases.length)];
        this.speak(phrase, 0.9, 1.2);
    }
};

// --- Load voices (needed for some browsers) ---
if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
    };
}

// --- Navigation ---
function navigateTo(page) {
    window.location.href = page;
}

// --- Dino tap interaction ---
document.addEventListener('DOMContentLoaded', () => {
    Rewards.updateUI();

    const dino = document.getElementById('dino');
    if (dino) {
        dino.addEventListener('click', () => {
            const dinoSays = [
                "Hi Prisha! Let's learn!",
                "Roar! I'm Dino!",
                "Tap Phonics to start!",
                "You're awesome, Prisha!",
                "Let's have fun!"
            ];
            const msg = dinoSays[Math.floor(Math.random() * dinoSays.length)];

            // Use AudioManager if available, otherwise fallback to Speech
            if (typeof AudioManager !== 'undefined' && AudioManager.isLoaded) {
                AudioManager.playInstruction('roar');
            } else {
                Speech.speak(msg, 0.9, 1.2);
            }

            dino.style.animation = 'none';
            setTimeout(() => dino.style.animation = 'dinoJump 0.5s ease', 10);
        });
    }

    // Greeting based on time of day
    const greeting = document.getElementById('greeting');
    if (greeting) {
        const hour = new Date().getHours();
        let timeGreeting = 'Hi';
        if (hour < 12) timeGreeting = 'Good morning';
        else if (hour < 17) timeGreeting = 'Good afternoon';
        else timeGreeting = 'Good evening';
        greeting.textContent = `${timeGreeting}, Prisha! Ready to learn? 🦕`;
    }
});

// --- Show Celebration Popup ---
function showCelebration(emoji, text, subText, callback) {
    const overlay = document.createElement('div');
    overlay.className = 'celebration';
    overlay.innerHTML = `
        <div class="celebration-content">
            <div class="celebration-emoji">${emoji}</div>
            <div class="celebration-text">${text}</div>
            <div class="celebration-sub">${subText}</div>
            <button class="big-button btn-primary celebration-btn">
                Continue ▶️
            </button>
        </div>
    `;
    document.body.appendChild(overlay);

    // Use AudioManager for celebration if available
    if (typeof AudioManager !== 'undefined' && AudioManager.isLoaded) {
        AudioManager.playCelebration();
    } else {
        Speech.celebrate();
    }

    // Handle continue button
    const continueBtn = overlay.querySelector('.celebration-btn');
    continueBtn.addEventListener('click', () => {
        overlay.remove();
        if (callback) callback();
    });

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        if (document.body.contains(overlay)) {
            overlay.remove();
            if (callback) callback();
        }
    }, 5000);
}

// --- Confetti Effect ---
function launchConfetti() {
    const container = document.createElement('div');
    container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:300;overflow:hidden;';
    document.body.appendChild(container);

    const colors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#9B59B6', '#FFA502'];
    const emojis = ['⭐', '🌟', '✨', '🎉', '🦕'];

    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        const isEmoji = Math.random() > 0.5;
        particle.textContent = isEmoji ? emojis[Math.floor(Math.random() * emojis.length)] : '';
        particle.style.cssText = `
            position: absolute;
            top: -20px;
            left: ${Math.random() * 100}%;
            font-size: ${isEmoji ? '20px' : '0px'};
            width: ${isEmoji ? 'auto' : '10px'};
            height: ${isEmoji ? 'auto' : '10px'};
            background: ${isEmoji ? 'transparent' : colors[Math.floor(Math.random() * colors.length)]};
            border-radius: 50%;
            animation: confettiFall ${2 + Math.random() * 3}s linear forwards;
            animation-delay: ${Math.random() * 0.5}s;
        `;
        container.appendChild(particle);
    }

    // Add confetti animation
    if (!document.getElementById('confetti-style')) {
        const style = document.createElement('style');
        style.id = 'confetti-style';
        style.textContent = `
            @keyframes confettiFall {
                0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
                100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    setTimeout(() => container.remove(), 4000);
}