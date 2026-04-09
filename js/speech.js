/* ========================================
   Audio Manager for Prisha's Learning World
   ========================================
   High-quality MP3 playback with TTS fallback.

   Priority:
   1. Pre-generated MP3 files (natural voice)
   2. Web Speech API fallback (if MP3 missing)

   Usage:
     AudioManager.playLetterName('a');
     AudioManager.playPhonicsSound('b');
     AudioManager.playWord('c');
     AudioManager.playSentence('d');
     AudioManager.playCelebration();
     AudioManager.playInstruction('welcome');
   ======================================== */

const AudioManager = {
    // Cache for loaded audio elements
    cache: {},

    // Audio manifest (loaded from manifest.json)
    audioManifest: null,

    // Whether manifest loaded successfully
    isLoaded: false,

    // Currently playing audio element
    currentAudio: null,

    // Volume (0.0 to 1.0)
    volume: 1.0,

    // --- Initialize: Load manifest ---
    async init() {
        try {
            const response = await fetch('audio/manifest.json');
            if (!response.ok) throw new Error('Manifest not found');
            this.audioManifest = await response.json();
            this.isLoaded = true;
            console.log('✅ Audio manifest loaded successfully');
            console.log(`   📁 ${Object.keys(this.audioManifest.letters).length} letters`);
            console.log(`   🎉 ${this.audioManifest.celebrations.length} celebrations`);
            console.log(`   📋 ${this.audioManifest.instructions.length} instructions`);
            this.preloadCelebrations();
            this.preloadFirstLetters();
        } catch (e) {
            console.warn('⚠️ Audio manifest not found. Using text-to-speech fallback.');
            console.warn('   Run: cd tools && python generate_audio.py --method edge');
            this.isLoaded = false;
        }
    },

    // --- Preload celebration audio (used frequently) ---
    preloadCelebrations() {
        if (!this.audioManifest) return;
        this.audioManifest.celebrations.forEach(path => {
            this.preload(path);
        });
    },

    // --- Preload first few letters for instant playback ---
    preloadFirstLetters() {
        if (!this.audioManifest) return;
        const firstLetters = ['a', 'b', 'c', 'd', 'e'];
        firstLetters.forEach(letter => {
            const data = this.audioManifest.letters[letter];
            if (data) {
                this.preload(data.name);
                this.preload(data.phonics);
                this.preload(data.word);
                this.preload(data.sentence);
            }
        });
    },

    // --- Preload a single file into cache ---
    preload(path) {
        if (!this.cache[path]) {
            const audio = new Audio(path);
            audio.preload = 'auto';
            audio.volume = this.volume;
            this.cache[path] = audio;
        }
    },

    // --- Preload a specific letter (call when approaching that letter) ---
    preloadLetter(letter) {
        letter = letter.toLowerCase();
        if (!this.isLoaded || !this.audioManifest.letters[letter]) return;
        const data = this.audioManifest.letters[letter];
        this.preload(data.name);
        this.preload(data.phonics);
        this.preload(data.word);
        this.preload(data.sentence);
    },

    // --- Play an audio file (returns a Promise) ---
    play(path) {
        return new Promise((resolve, reject) => {
            // Stop any currently playing audio
            this.stopAll();

            let audio;
            if (this.cache[path]) {
                audio = this.cache[path];
                audio.currentTime = 0;
            } else {
                audio = new Audio(path);
                audio.volume = this.volume;
                this.cache[path] = audio;
            }

            this.currentAudio = audio;

            audio.onended = () => {
                this.currentAudio = null;
                resolve();
            };

            audio.onerror = (e) => {
                console.warn(`Audio error for ${path}:`, e);
                this.currentAudio = null;
                reject(e);
            };

            audio.play().catch(err => {
                console.warn(`Failed to play ${path}:`, err);
                this.currentAudio = null;
                reject(err);
            });
        });
    },

    // --- Stop all playing audio ---
// --- Stop all audio --- (Replace this function in speech.js)
    stopAll: function() {
    // Stop current MP3
    if (this.currentAudio) {
        try {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
        } catch(e) {}
        this.currentAudio = null;
    }

    // Stop ALL cached audio (not just current)
    var paths = Object.keys(this.cache);
    for (var i = 0; i < paths.length; i++) {
        try {
            this.cache[paths[i]].pause();
            this.cache[paths[i]].currentTime = 0;
        } catch(e) {}
    }

    // Stop TTS
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
},

    // --- Set volume ---
    setVolume(vol) {
        this.volume = Math.max(0, Math.min(1, vol));
        Object.values(this.cache).forEach(audio => {
            audio.volume = this.volume;
        });
    },

    // =============================================
    // HIGH-LEVEL PLAYBACK METHODS
    // =============================================

    // --- Play letter name ("A", "B", etc.) ---
    async playLetterName(letter) {
        letter = letter.toLowerCase();
        if (this.isLoaded && this.audioManifest.letters[letter]) {
            try {
                await this.play(this.audioManifest.letters[letter].name);
                return;
            } catch (e) {
                console.warn(`MP3 failed for letter ${letter}, using TTS fallback`);
            }
        }
        // Fallback to TTS
        Speech.speakLetter(letter);
    },

    // --- Play phonics sound ("ah", "buh", "kuh", etc.) ---
    async playPhonicsSound(letter) {
        letter = letter.toLowerCase();
        if (this.isLoaded && this.audioManifest.letters[letter]) {
            try {
                await this.play(this.audioManifest.letters[letter].phonics);
                return;
            } catch (e) {
                console.warn(`MP3 failed for phonics ${letter}, using TTS fallback`);
            }
        }
        // Fallback
        Speech.speakPhonics(letter);
    },

    // --- Play example word ("Apple", "Butterfly", etc.) ---
    async playWord(letter) {
        letter = letter.toLowerCase();
        if (this.isLoaded && this.audioManifest.letters[letter]) {
            try {
                await this.play(this.audioManifest.letters[letter].word);
                return;
            } catch (e) {
                console.warn(`MP3 failed for word ${letter}, using TTS fallback`);
            }
        }
        // Fallback: find the word from LETTERS data
        if (typeof LETTERS !== 'undefined') {
            const letterData = LETTERS.find(l => l.lower === letter);
            if (letterData) {
                Speech.speak(letterData.word, 0.85, 1.1);
            }
        }
    },

    // --- Play full sentence ("A is for Apple") ---
    async playSentence(letter) {
        letter = letter.toLowerCase();
        if (this.isLoaded && this.audioManifest.letters[letter]) {
            try {
                await this.play(this.audioManifest.letters[letter].sentence);
                return;
            } catch (e) {
                console.warn(`MP3 failed for sentence ${letter}, using TTS fallback`);
            }
        }
        // Fallback
        if (typeof LETTERS !== 'undefined') {
            const letterData = LETTERS.find(l => l.lower === letter);
            if (letterData) {
                Speech.speak(`${letterData.upper} is for ${letterData.word}`, 0.85, 1.1);
            }
        }
    },

    // --- Play random celebration ---
    async playCelebration() {
        if (this.isLoaded && this.audioManifest.celebrations.length > 0) {
            const celebrations = this.audioManifest.celebrations;
            const randomPath = celebrations[Math.floor(Math.random() * celebrations.length)];
            try {
                await this.play(randomPath);
                return;
            } catch (e) {
                console.warn('Celebration MP3 failed, using TTS fallback');
            }
        }
        // Fallback
        Speech.celebrate();
    },

    // --- Play specific celebration by ID ---
    async playCelebrationById(id) {
        if (this.isLoaded) {
            const path = `audio/celebrations/${id}.mp3`;
            try {
                await this.play(path);
                return;
            } catch (e) {
                console.warn(`Celebration ${id} MP3 failed`);
            }
        }
        Speech.celebrate();
    },

    // --- Play instruction by ID ---
    async playInstruction(id) {
        if (this.isLoaded && this.audioManifest.instructions) {
            const instruction = this.audioManifest.instructions.find(i => i.id === id);
            if (instruction) {
                try {
                    await this.play(instruction.path);
                    return;
                } catch (e) {
                    console.warn(`Instruction MP3 failed for ${id}`);
                }
            }
        }
        // Fallback text map
        const fallbackText = {
            'welcome': "Hi Prisha! Welcome to your learning world!",
            'lets_learn': "Let's learn letters, Prisha!",
            'find_lowercase': "Find the lowercase friend!",
            'what_sound': "What letter makes this sound?",
            'tap_to_hear': "Tap the buttons to hear the sounds!",
            'try_again': "Oops! Try again, Prisha!",
            'all_done': "Wow Prisha! You explored all 26 letters! You are a superstar!",
            'pick_letter': "Pick the right letter!",
            'listen_carefully': "Listen carefully!",
            'roar': "Roar! I'm Dino! Let's have fun!"
        };
        Speech.speak(fallbackText[id] || id, 0.9, 1.1);
    },

    // --- Play multiple audio files in sequence ---
    async playSequence(items, delayBetween = 500) {
        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            if (typeof item === 'string') {
                // It's a file path
                try {
                    await this.play(item);
                } catch (e) {
                    console.warn(`Sequence playback failed for: ${item}`);
                }
            } else if (typeof item === 'function') {
                // It's a callback function
                await item();
            }

            // Wait between items (except after the last one)
            if (i < items.length - 1) {
                await new Promise(resolve => setTimeout(resolve, delayBetween));
            }
        }
    },

    // --- Play letter name + phonics sound + word in sequence ---
    async playFullLetterIntro(letter) {
        letter = letter.toLowerCase();
        await this.playLetterName(letter);
        await new Promise(resolve => setTimeout(resolve, 400));
        await this.playPhonicsSound(letter);
        await new Promise(resolve => setTimeout(resolve, 400));
        await this.playSentence(letter);
    },

    // --- Check if a specific audio file exists ---
    hasAudio(letter, type) {
        letter = letter.toLowerCase();
        if (!this.isLoaded || !this.audioManifest.letters[letter]) return false;
        return !!this.audioManifest.letters[letter][type];
    },

    // --- Get loading status ---
    getStatus() {
        return {
            isLoaded: this.isLoaded,
            cachedFiles: Object.keys(this.cache).length,
            hasManifest: !!this.audioManifest,
            volume: this.volume
        };
    },
    // --- Play number name ("One", "Two", etc.) ---
    playNumberName: function(num) {
        num = num.toString();
        var self = this;
        if (this.isLoaded && this.audioManifest.numbers && this.audioManifest.numbers[num]) {
            return this.play(this.audioManifest.numbers[num].name)
                .catch(function() {
                    console.warn('MP3 failed for number ' + num + ', using TTS');
                    self._speakNumberFallback(num);
                });
        }
        this._speakNumberFallback(num);
        return Promise.resolve();
    },

    // --- Play number sentence ("One. 1 Dinosaur!") ---
    playNumberSentence: function(num) {
        num = num.toString();
        var self = this;
        if (this.isLoaded && this.audioManifest.numbers && this.audioManifest.numbers[num]) {
            return this.play(this.audioManifest.numbers[num].sentence)
                .catch(function() {
                    console.warn('MP3 failed for number sentence ' + num);
                    self._speakNumberFallback(num);
                });
        }
        this._speakNumberFallback(num);
        return Promise.resolve();
    },

    // --- Play counting sequence ("1, 2, 3!") ---
    playCountingSequence: function(upTo) {
        upTo = upTo.toString();
        var self = this;
        if (this.isLoaded && this.audioManifest.counting && this.audioManifest.counting[upTo]) {
            return this.play(this.audioManifest.counting[upTo])
                .catch(function() {
                    console.warn('MP3 failed for counting ' + upTo);
                    self._speakCountFallback(parseInt(upTo));
                });
        }
        this._speakCountFallback(parseInt(upTo));
        return Promise.resolve();
    },

    // --- Play number instruction ---
    playNumberInstruction: function(id) {
        var self = this;
        if (this.isLoaded && this.audioManifest.number_instructions) {
            var instruction = null;
            for (var i = 0; i < this.audioManifest.number_instructions.length; i++) {
                if (this.audioManifest.number_instructions[i].id === id) {
                    instruction = this.audioManifest.number_instructions[i];
                    break;
                }
            }
            if (instruction) {
                return this.play(instruction.path)
                    .catch(function() {
                        console.warn('Number instruction MP3 failed for ' + id);
                        self._speakNumInstructionFallback(id);
                    });
            }
        }
        this._speakNumInstructionFallback(id);
        return Promise.resolve();
    },

    // --- Number TTS Fallbacks ---
    _speakNumberFallback: function(num) {
        var words = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven',
                     'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen',
                     'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen',
                     'Nineteen', 'Twenty'];
        var word = words[parseInt(num)] || num.toString();
        Speech.speak(word, 0.8, 1.1);
    },

    _speakCountFallback: function(upTo) {
        var text = '';
        for (var i = 1; i <= upTo; i++) {
            text += i + ', ';
        }
        Speech.speak(text, 0.7, 1.1);
    },

    _speakNumInstructionFallback: function(id) {
        var fallback = {
            'lets_count': 'Lets explore numbers, Prisha!',
            'count_animals': 'Count the animals, Prisha!',
            'how_many': 'How many do you see?',
            'match_number': 'Match the number to the right group, Prisha!',
            'all_numbers_done': 'Wow Prisha! You explored all 20 numbers! Amazing!',
            'keep_practicing': 'Keep practicing, Prisha! You can do it!'
        };
        Speech.speak(fallback[id] || id, 0.9, 1.1);
    },
    // =============================================
    // VOCABULARY PLAYBACK METHODS
    // =============================================

    // --- Play vocabulary word (color name, shape name, animal name) ---
    playVocabWord: function(type, id) {
        var self = this;
        id = id.toLowerCase();
        if (this.isLoaded && this.audioManifest.vocabulary &&
            this.audioManifest.vocabulary[type] &&
            this.audioManifest.vocabulary[type][id]) {
            return this.play(this.audioManifest.vocabulary[type][id].word)
                .catch(function() {
                    console.warn('MP3 failed for vocab word ' + type + '/' + id + ', using TTS');
                    self._speakVocabFallback(id);
                });
        }
        this._speakVocabFallback(id);
        return Promise.resolve();
    },

    // --- Play vocabulary sentence ---
    playVocabSentence: function(type, id) {
        var self = this;
        id = id.toLowerCase();
        if (this.isLoaded && this.audioManifest.vocabulary &&
            this.audioManifest.vocabulary[type] &&
            this.audioManifest.vocabulary[type][id]) {
            return this.play(this.audioManifest.vocabulary[type][id].sentence)
                .catch(function() {
                    console.warn('MP3 failed for vocab sentence ' + type + '/' + id + ', using TTS');
                    self._speakVocabFallback(id);
                });
        }
        this._speakVocabFallback(id);
        return Promise.resolve();
    },

    // --- Play animal sound ("Meow!", "Woof!", etc.) ---
    playAnimalSound: function(id) {
        var self = this;
        id = id.toLowerCase();
        if (this.isLoaded && this.audioManifest.vocabulary &&
            this.audioManifest.vocabulary.animals &&
            this.audioManifest.vocabulary.animals[id]) {
            return this.play(this.audioManifest.vocabulary.animals[id].sound)
                .catch(function() {
                    console.warn('MP3 failed for animal sound ' + id + ', using TTS');
                    Speech.speak(id, 0.8, 1.1);
                });
        }
        Speech.speak(id, 0.8, 1.1);
        return Promise.resolve();
    },

    // --- Play vocabulary instruction ---
    playVocabInstruction: function(id) {
        var self = this;
        if (this.isLoaded && this.audioManifest.vocabulary &&
            this.audioManifest.vocabulary.instructions) {
            var instruction = null;
            for (var i = 0; i < this.audioManifest.vocabulary.instructions.length; i++) {
                if (this.audioManifest.vocabulary.instructions[i].id === id) {
                    instruction = this.audioManifest.vocabulary.instructions[i];
                    break;
                }
            }
            if (instruction) {
                return this.play(instruction.path)
                    .catch(function() {
                        console.warn('Vocab instruction MP3 failed for ' + id);
                        self._speakVocabInstructionFallback(id);
                    });
            }
        }
        this._speakVocabInstructionFallback(id);
        return Promise.resolve();
    },

    // --- Preload vocabulary audio for a category ---
    preloadVocabCategory: function(type) {
        if (!this.isLoaded || !this.audioManifest.vocabulary ||
            !this.audioManifest.vocabulary[type]) return;
        var category = this.audioManifest.vocabulary[type];
        var ids = Object.keys(category);
        for (var i = 0; i < Math.min(ids.length, 5); i++) {
            var item = category[ids[i]];
            if (item.word) this.preload(item.word);
            if (item.sentence) this.preload(item.sentence);
            if (item.sound) this.preload(item.sound);
        }
    },

    // --- Vocab TTS Fallbacks ---
    _speakVocabFallback: function(id) {
        // Capitalize first letter
        var word = id.charAt(0).toUpperCase() + id.slice(1);
        Speech.speak(word, 0.8, 1.1);
    },

    _speakVocabInstructionFallback: function(id) {
        var fallback = {
            'lets_learn_colors': "Let's learn colors, Prisha!",
            'lets_learn_shapes': "Let's learn shapes, Prisha!",
            'lets_learn_animals': "Let's learn animals, Prisha!",
            'find_the_color': 'Find the right color, Prisha!',
            'find_the_shape': 'Find the right shape, Prisha!',
            'what_animal_sound': 'What animal makes this sound, Prisha?',
            'this_is': 'This is',
            'keep_practicing_vocab': "Keep practicing, Prisha! You're learning so many words!"
        };
        Speech.speak(fallback[id] || id, 0.9, 1.1);
    }
};

// --- Initialize AudioManager on page load ---
document.addEventListener('DOMContentLoaded', () => {
    AudioManager.init();
});