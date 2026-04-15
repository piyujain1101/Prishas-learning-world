# tools/sync_audio.py
#!/usr/bin/env python3
"""
========================================
Smart Audio Sync for Learning World
========================================
Scans JS source files, extracts all text
that needs audio, generates missing MP3s
via Edge TTS, cleans up orphans, and
auto-generates manifest.json.

Usage:
    cd tools
    python sync_audio.py

Requirements:
    pip install edge-tts
========================================
"""

import os
import re
import sys
import json
import asyncio
import random
from pathlib import Path

# ========================================
# CONFIGURATION
# ========================================

# Project root (parent of tools/)
PROJECT_DIR = Path(__file__).parent.parent
JS_DIR = PROJECT_DIR / "js"
AUDIO_DIR = PROJECT_DIR / "audio"
MANIFEST_PATH = AUDIO_DIR / "manifest.json"

# Edge TTS settings
VOICE = "en-US-AnaNeural"
TTS_SETTINGS = {
    "letter_name":    {"rate": "-25%", "pitch": "+8Hz"},
    "phonics":        {"rate": "-25%", "pitch": "+2Hz"},
    "word":           {"rate": "-15%", "pitch": "+8Hz"},
    "sentence":       {"rate": "-15%", "pitch": "+8Hz"},
    "celebration":    {"rate": "-5%",  "pitch": "+12Hz"},
    "instruction":    {"rate": "-15%", "pitch": "+8Hz"},
    "animal_sound":   {"rate": "-5%",  "pitch": "+12Hz"},
    "counting":       {"rate": "-25%", "pitch": "+8Hz"},
}

# ========================================
# JS PARSING HELPERS
# ========================================

def read_file(filepath):
    """Read a file and return its content."""
    with open(filepath, 'r', encoding='utf-8') as f:
        return f.read()


def extract_js_array(content, var_name):
    """
    Extract the contents of a JS array variable.
    Handles: var NAME = [...];  /  const NAME = [...];  /  let NAME = [...];
    Returns the raw string between the outer [ and ].
    """
    # Match: var/let/const VARNAME = [
    pattern = r'(?:var|let|const)\s+' + re.escape(var_name) + r'\s*=\s*\['
    match = re.search(pattern, content)
    if not match:
        return None

    start = match.end() - 1  # position of '['
    depth = 0
    i = start
    while i < len(content):
        if content[i] == '[':
            depth += 1
        elif content[i] == ']':
            depth -= 1
            if depth == 0:
                return content[start:i + 1]
        i += 1
    return None


def extract_objects_from_array(array_str):
    """
    Extract individual { ... } objects from a JS array string.
    Returns a list of raw object strings.
    """
    objects = []
    depth = 0
    current_start = None

    for i, char in enumerate(array_str):
        if char == '{':
            if depth == 0:
                current_start = i
            depth += 1
        elif char == '}':
            depth -= 1
            if depth == 0 and current_start is not None:
                objects.append(array_str[current_start:i + 1])
                current_start = None
    return objects


def extract_field(obj_str, field_name):
    """
    Extract a string field value from a JS object string.
    Handles both single and double quotes.
    e.g., extract_field("{ name: 'Cat', id: 'cat' }", "name") -> "Cat"
    """
    # Pattern: fieldName: 'value' or fieldName: "value"
    pattern = r'(?:^|[,\s{])' + re.escape(field_name) + r"""\s*:\s*(['"])((?:(?!\1).|\\.)*?)\1"""
    match = re.search(pattern, obj_str)
    if match:
        return match.group(2)
    return None


def text_to_id(text):
    """Convert text to a file-safe snake_case ID."""
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s]', '', text)
    text = re.sub(r'\s+', '_', text.strip())
    return text[:60]  # Cap length


def file_exists_and_valid(filepath):
    """Check if file exists and has content (>100 bytes)."""
    return filepath.exists() and filepath.stat().st_size > 100


# ========================================
# SCANNERS — One per source file / data type
# ========================================

def scan_letters():
    """Scan phonics.js for LETTERS array."""
    audio_entries = {}
    filepath = JS_DIR / "phonics.js"
    if not filepath.exists():
        print("   ⚠️  phonics.js not found")
        return audio_entries

    content = read_file(filepath)
    array_str = extract_js_array(content, 'LETTERS')
    if not array_str:
        print("   ⚠️  LETTERS array not found in phonics.js")
        return audio_entries

    objects = extract_objects_from_array(array_str)
    print(f"   📝 Found {len(objects)} letters in phonics.js")

    for obj_str in objects:
        upper = extract_field(obj_str, 'upper')
        lower = extract_field(obj_str, 'lower')
        word = extract_field(obj_str, 'word')
        dino_tip = extract_field(obj_str, 'dinoTip')

        if not upper or not lower:
            continue

        letter = lower.lower()

        # Extract phonics sound from dinoTip: 'A says "aah" like Apple!'
        phonics_text = extract_phonics_from_tip(upper, dino_tip)

        # Letter name
        audio_entries[f"audio/letters/{letter}.mp3"] = {
            "text": f"{upper}.",
            "type": "letter_name",
            "category": "letters"
        }

        # Phonics sound
        audio_entries[f"audio/phonics/{letter}.mp3"] = {
            "text": phonics_text,
            "type": "phonics",
            "category": "letters"
        }

        # Word
        if word:
            audio_entries[f"audio/words/{letter}.mp3"] = {
                "text": f"{word}.",
                "type": "word",
                "category": "letters"
            }

            # Sentence
            audio_entries[f"audio/sentences/{letter}.mp3"] = {
                "text": f"{upper} is for {word}",
                "type": "sentence",
                "category": "letters"
            }

    return audio_entries


def extract_phonics_from_tip(letter, dino_tip):
    """Extract phonics sound text from dinoTip string."""
    phonics_map = {
        'A': 'aah', 'B': 'bah', 'C': 'kah', 'D': 'dah', 'E': 'ehh',
        'F': 'fah', 'G': 'gah', 'H': 'hah', 'I': 'iih', 'J': 'jah',
        'K': 'kah', 'L': 'lah', 'M': 'mah', 'N': 'nah', 'O': 'awe',
        'P': 'pah', 'Q': 'kwah', 'R': 'rah', 'S': 'sah', 'T': 'tah',
        'U': 'uhh', 'V': 'vah', 'W': 'wah', 'X': 'ecks', 'Y': 'yah', 'Z': 'zah'
    }

    if dino_tip:
        # Try to extract from pattern: says "XXX"
        match = re.search(r'says\s+["\']([^"\']+)["\']', dino_tip)
        if match:
            return match.group(1)

    return phonics_map.get(letter.upper(), letter.lower())


def scan_numbers():
    """Scan numbers.js for NUMBERS_DATA array."""
    audio_entries = {}
    filepath = JS_DIR / "numbers.js"
    if not filepath.exists():
        print("   ⚠️  numbers.js not found")
        return audio_entries

    content = read_file(filepath)
    array_str = extract_js_array(content, 'NUMBERS_DATA')
    if not array_str:
        print("   ⚠️  NUMBERS_DATA array not found in numbers.js")
        return audio_entries

    objects = extract_objects_from_array(array_str)
    print(f"   🔢 Found {len(objects)} numbers in numbers.js")

    for obj_str in objects:
        # Extract num field (it's not a string, so special handling)
        num_match = re.search(r'num\s*:\s*(\d+)', obj_str)
        word = extract_field(obj_str, 'word')
        emoji = extract_field(obj_str, 'emoji')

        if not num_match or not word:
            continue

        num = num_match.group(1)
        num_int = int(num)

        # Number name
        audio_entries[f"audio/numbers/names/{num}.mp3"] = {
            "text": word,
            "type": "word",
            "category": "numbers"
        }

        # Number sentence
        if num_int <= 10 and emoji:
            object_name = get_object_name_from_emoji(emoji, num_int)
            sentence = f"{word}. {num} {object_name}!"
        else:
            sentence = f"{word}."

        audio_entries[f"audio/numbers/sentences/{num}.mp3"] = {
            "text": sentence,
            "type": "sentence",
            "category": "numbers"
        }

    # Counting sequences (1-10)
    for i in range(1, 11):
        words = ", ".join([str(x) for x in range(1, i + 1)])
        audio_entries[f"audio/numbers/counting/count_{i}.mp3"] = {
            "text": f"{words}!",
            "type": "counting",
            "category": "numbers"
        }

    return audio_entries


def get_object_name_from_emoji(emoji, count):
    """Get object name from emoji for number sentences."""
    names = {
        '🦕': ('Dinosaur', 'Dinosaurs'), '🐱': ('Cat', 'Cats'),
        '⭐': ('Star', 'Stars'), '🐟': ('Fish', 'Fish'),
        '🍎': ('Apple', 'Apples'), '🦋': ('Butterfly', 'Butterflies'),
        '🌙': ('Moon', 'Moons'), '🐢': ('Turtle', 'Turtles'),
        '🌈': ('Rainbow', 'Rainbows'), '🐧': ('Penguin', 'Penguins'),
        '🍇': ('Grape', 'Grapes'), '🐘': ('Elephant', 'Elephants'),
        '🦁': ('Lion', 'Lions'), '🍦': ('Ice Cream', 'Ice Creams'),
        '🐙': ('Octopus', 'Octopuses'), '🪁': ('Kite', 'Kites'),
        '🐋': ('Whale', 'Whales'), '🎵': ('Music Note', 'Music Notes'),
        '🧶': ('Yarn Ball', 'Yarn Balls'), '🦖': ('T-Rex', 'T-Rexes'),
    }
    singular, plural = names.get(emoji, ('item', 'items'))
    return singular if count == 1 else plural


def scan_colors():
    """Scan vocabulary.js for COLORS_DATA."""
    audio_entries = {}
    filepath = JS_DIR / "vocabulary.js"
    if not filepath.exists():
        print("   ⚠️  vocabulary.js not found")
        return audio_entries

    content = read_file(filepath)
    array_str = extract_js_array(content, 'COLORS_DATA')
    if not array_str:
        print("   ⚠️  COLORS_DATA array not found")
        return audio_entries

    objects = extract_objects_from_array(array_str)
    print(f"   🎨 Found {len(objects)} colors in vocabulary.js")

    for obj_str in objects:
        name = extract_field(obj_str, 'name')
        item_id = extract_field(obj_str, 'id')
        sentence = extract_field(obj_str, 'sentence')

        if not name or not item_id:
            continue

        audio_entries[f"audio/vocabulary/colors/words/{item_id}.mp3"] = {
            "text": name,
            "type": "word",
            "category": "vocabulary_colors"
        }

        if sentence:
            audio_entries[f"audio/vocabulary/colors/sentences/{item_id}.mp3"] = {
                "text": f"{name}! {sentence}",
                "type": "sentence",
                "category": "vocabulary_colors"
            }

    return audio_entries


def scan_shapes():
    """Scan vocabulary.js for SHAPES_DATA."""
    audio_entries = {}
    filepath = JS_DIR / "vocabulary.js"
    if not filepath.exists():
        return audio_entries

    content = read_file(filepath)
    array_str = extract_js_array(content, 'SHAPES_DATA')
    if not array_str:
        print("   ⚠️  SHAPES_DATA array not found")
        return audio_entries

    objects = extract_objects_from_array(array_str)
    print(f"   🔷 Found {len(objects)} shapes in vocabulary.js")

    for obj_str in objects:
        name = extract_field(obj_str, 'name')
        item_id = extract_field(obj_str, 'id')
        sentence = extract_field(obj_str, 'sentence')

        if not name or not item_id:
            continue

        audio_entries[f"audio/vocabulary/shapes/words/{item_id}.mp3"] = {
            "text": name,
            "type": "word",
            "category": "vocabulary_shapes"
        }

        if sentence:
            audio_entries[f"audio/vocabulary/shapes/sentences/{item_id}.mp3"] = {
                "text": f"{name}! {sentence}",
                "type": "sentence",
                "category": "vocabulary_shapes"
            }

    return audio_entries


def scan_animals():
    """Scan vocabulary.js for ANIMALS_DATA."""
    audio_entries = {}
    filepath = JS_DIR / "vocabulary.js"
    if not filepath.exists():
        return audio_entries

    content = read_file(filepath)
    array_str = extract_js_array(content, 'ANIMALS_DATA')
    if not array_str:
        print("   ⚠️  ANIMALS_DATA array not found")
        return audio_entries

    objects = extract_objects_from_array(array_str)
    print(f"   🐾 Found {len(objects)} animals in vocabulary.js")

    for obj_str in objects:
        name = extract_field(obj_str, 'name')
        item_id = extract_field(obj_str, 'id')
        sound = extract_field(obj_str, 'sound')
        sentence = extract_field(obj_str, 'sentence')

        if not name or not item_id:
            continue

        audio_entries[f"audio/vocabulary/animals/words/{item_id}.mp3"] = {
            "text": name,
            "type": "word",
            "category": "vocabulary_animals"
        }

        if sound:
            audio_entries[f"audio/vocabulary/animals/sounds/{item_id}.mp3"] = {
                "text": sound,
                "type": "animal_sound",
                "category": "vocabulary_animals"
            }

        if sentence:
            audio_entries[f"audio/vocabulary/animals/sentences/{item_id}.mp3"] = {
                "text": f"{name}! {sentence}",
                "type": "sentence",
                "category": "vocabulary_animals"
            }

    return audio_entries


def scan_picture_phonics():
    """Scan picture-phonics.js for PP_PICTURES — every unique word gets audio."""
    audio_entries = {}
    filepath = JS_DIR / "picture-phonics.js"
    if not filepath.exists():
        print("   ⚠️  picture-phonics.js not found")
        return audio_entries

    content = read_file(filepath)
    array_str = extract_js_array(content, 'PP_PICTURES')
    if not array_str:
        print("   ⚠️  PP_PICTURES array not found")
        return audio_entries

    objects = extract_objects_from_array(array_str)

    # Deduplicate by word (multiple entries may have same word)
    seen_words = set()
    unique_count = 0

    for obj_str in objects:
        word = extract_field(obj_str, 'word')
        letter = extract_field(obj_str, 'letter')

        if not word or not letter:
            continue

        word_id = text_to_id(word)
        if word_id in seen_words:
            continue
        seen_words.add(word_id)
        unique_count += 1

        # Word audio: "Apple!"
        audio_entries[f"audio/picture-phonics/words/{word_id}.mp3"] = {
            "text": f"{word}!",
            "type": "word",
            "category": "picture_phonics"
        }

        # Sentence audio: "Apple starts with A!"
        audio_entries[f"audio/picture-phonics/sentences/{word_id}.mp3"] = {
            "text": f"{word} starts with {letter.upper()}!",
            "type": "sentence",
            "category": "picture_phonics"
        }

    print(f"   🖼️  Found {unique_count} unique picture-phonics words in picture-phonics.js")
    return audio_entries


def scan_odd_one_out():
    """Scan odd-one-out.js for OOO_PUZZLES explanations."""
    audio_entries = {}
    filepath = JS_DIR / "odd-one-out.js"
    if not filepath.exists():
        print("   ⚠️  odd-one-out.js not found")
        return audio_entries

    content = read_file(filepath)
    array_str = extract_js_array(content, 'OOO_PUZZLES')
    if not array_str:
        print("   ⚠️  OOO_PUZZLES array not found")
        return audio_entries

    objects = extract_objects_from_array(array_str)

    seen_explanations = set()
    count = 0

    for obj_str in objects:
        explanation = extract_field(obj_str, 'explanation')
        if not explanation:
            continue

        exp_id = text_to_id(explanation)
        if exp_id in seen_explanations:
            continue
        seen_explanations.add(exp_id)
        count += 1

        audio_entries[f"audio/games/explanations/{exp_id}.mp3"] = {
            "text": explanation,
            "type": "sentence",
            "category": "game_explanations"
        }

    print(f"   🎮 Found {count} unique game explanations in odd-one-out.js")
    return audio_entries


def scan_any_game_file():
    """
    Scan ALL JS files in js/ for any array that contains 'explanation' fields.
    This future-proofs for new game types.
    Skips odd-one-out.js (already handled separately).
    """
    audio_entries = {}
    skip_files = {'odd-one-out.js', 'app.js', 'speech.js', 'home.js'}

    for js_file in JS_DIR.glob("*.js"):
        if js_file.name in skip_files:
            continue

        content = read_file(js_file)

        # Find all explanation fields in any context
        explanation_matches = re.findall(
            r"""explanation\s*:\s*['"]([^'"]+)['"]""",
            content
        )

        if not explanation_matches:
            continue

        count = 0
        for explanation in explanation_matches:
            exp_id = text_to_id(explanation)
            path = f"audio/games/explanations/{exp_id}.mp3"

            # Don't overwrite entries already found by specific scanners
            if path not in audio_entries:
                audio_entries[path] = {
                    "text": explanation,
                    "type": "sentence",
                    "category": "game_explanations"
                }
                count += 1

        if count > 0:
            print(f"   🎮 Found {count} additional game explanations in {js_file.name}")

    return audio_entries


def scan_instructions():
    """
    Scan speech.js for instruction text, celebration text,
    and all instruction fallback maps.
    """
    audio_entries = {}
    filepath = JS_DIR / "speech.js"
    if not filepath.exists():
        print("   ⚠️  speech.js not found")
        return audio_entries

    content = read_file(filepath)

    # --- Extract instruction fallback text maps ---
    # Pattern: 'instruction_id': "Text to speak"
    # Found in: playInstruction, _speakNumInstructionFallback, _speakVocabInstructionFallback, _speakGameInstructionFallback

    instruction_maps = {
        "instructions": {},
        "numbers/instructions": {},
        "vocabulary/instructions": {},
        "games/instructions": {},
    }

    # General instructions (in playInstruction fallback)
    general_instructions = extract_fallback_map(content, 'playInstruction')
    if general_instructions:
        for inst_id, text in general_instructions.items():
            audio_entries[f"audio/instructions/{inst_id}.mp3"] = {
                "text": text,
                "type": "instruction",
                "category": "instructions"
            }

    # Number instructions
    num_instructions = extract_fallback_map(content, '_speakNumInstructionFallback')
    if num_instructions:
        for inst_id, text in num_instructions.items():
            audio_entries[f"audio/numbers/instructions/{inst_id}.mp3"] = {
                "text": text,
                "type": "instruction",
                "category": "number_instructions"
            }

    # Vocab instructions
    vocab_instructions = extract_fallback_map(content, '_speakVocabInstructionFallback')
    if vocab_instructions:
        for inst_id, text in vocab_instructions.items():
            audio_entries[f"audio/vocabulary/instructions/{inst_id}.mp3"] = {
                "text": text,
                "type": "instruction",
                "category": "vocabulary_instructions"
            }

    # Game instructions
    game_instructions = extract_fallback_map(content, '_speakGameInstructionFallback')
    if game_instructions:
        for inst_id, text in game_instructions.items():
            audio_entries[f"audio/games/instructions/{inst_id}.mp3"] = {
                "text": text,
                "type": "instruction",
                "category": "game_instructions"
            }

    inst_count = len(audio_entries)
    print(f"   🗣️  Found {inst_count} instructions in speech.js")

    return audio_entries


def scan_celebrations():
    """Scan app.js for celebration phrases."""
    audio_entries = {}

    # Check app.js for celebration phrases
    filepath = JS_DIR / "app.js"
    if not filepath.exists():
        print("   ⚠️  app.js not found")
        return audio_entries

    content = read_file(filepath)

    # Find the celebrate() function and extract phrases
    # Pattern: "Great job, ...", "You're amazing, ...", etc.
    celebrate_match = re.search(
        r'celebrate\s*\(\s*\)\s*\{.*?phrases\s*=\s*\[(.*?)\]',
        content, re.DOTALL
    )

    if celebrate_match:
        phrases_block = celebrate_match.group(1)
        # Extract quoted strings, remove ${name} / variable interpolation
        phrases = re.findall(r'[`"\'](.*?)[`"\']', phrases_block)

        for phrase in phrases:
            # Clean up template literal variables
            clean_phrase = re.sub(r'\$\{[^}]+\}', '', phrase).strip()
            clean_phrase = re.sub(r',\s*$', '', clean_phrase).strip()
            if not clean_phrase or len(clean_phrase) < 3:
                continue

            phrase_id = text_to_id(clean_phrase)
            audio_entries[f"audio/celebrations/{phrase_id}.mp3"] = {
                "text": clean_phrase,
                "type": "celebration",
                "category": "celebrations"
            }

    # Also add well-known celebrations that might be referenced
    # These are the standard ones used throughout the app
    standard_celebrations = [
        {"id": "great_job", "text": "Great job!"},
        {"id": "amazing", "text": "You're amazing!"},
        {"id": "wonderful", "text": "Wonderful!"},
        {"id": "you_did_it", "text": "You did it!"},
        {"id": "super_star", "text": "Super star!"},
        {"id": "yay", "text": "Yay!"},
        {"id": "keep_going", "text": "Keep going! You're doing great!"},
        {"id": "well_done", "text": "Well done!"},
        {"id": "fantastic", "text": "Fantastic!"},
        {"id": "proud", "text": "I'm so proud of you!"},
    ]

    for item in standard_celebrations:
        path = f"audio/celebrations/{item['id']}.mp3"
        if path not in audio_entries:
            audio_entries[path] = {
                "text": item["text"],
                "type": "celebration",
                "category": "celebrations"
            }

    print(f"   🎉 Found {len(audio_entries)} celebrations")
    return audio_entries


def extract_fallback_map(content, function_name):
    """
    Extract a fallback text map from a JS function.
    Looks for patterns like:
        var fallback = {
            'id': "Text to speak",
            'id2': 'More text',
        };
    Inside or near the specified function.
    """
    results = {}

    # Find the function
    func_pattern = re.escape(function_name) + r'\s*[:=]\s*function\s*\([^)]*\)\s*\{'
    func_match = re.search(func_pattern, content)

    if not func_match:
        # Also try: async functionName() {
        func_pattern2 = r'(?:async\s+)?' + re.escape(function_name) + r'\s*\([^)]*\)\s*\{'
        func_match = re.search(func_pattern2, content)

    if not func_match:
        return results

    # Extract from the function body (find matching closing brace)
    start = func_match.end()
    depth = 1
    i = start
    while i < len(content) and depth > 0:
        if content[i] == '{':
            depth += 1
        elif content[i] == '}':
            depth -= 1
        i += 1

    func_body = content[start:i]

    # Find fallback map entries: 'key': "value" or 'key': 'value'
    entries = re.findall(
        r"""['"]([a-z_]+)['"]\s*:\s*['"`]((?:(?!['"`]).)*?)['"`]""",
        func_body
    )

    for key, value in entries:
        # Clean up template literals and interpolated variables
        clean_value = re.sub(r'\$\{[^}]+\}', '', value).strip()
        clean_value = re.sub(r'\s*\+\s*\w+\s*\+\s*', ' ', clean_value).strip()
        clean_value = re.sub(r"['\"]?\s*\+\s*['\"]?", ' ', clean_value).strip()
        clean_value = re.sub(r'\s+', ' ', clean_value).strip()

        # Remove trailing commas or quotes
        clean_value = clean_value.rstrip("',\"")

        if clean_value and len(clean_value) >= 3:
            results[key] = clean_value

    return results


# ========================================
# MASTER SCAN
# ========================================

def scan_all():
    """Run all scanners and merge results."""
    print("🔍 Scanning JS files...\n")

    all_entries = {}

    scanners = [
        ("Letters", scan_letters),
        ("Numbers", scan_numbers),
        ("Colors", scan_colors),
        ("Shapes", scan_shapes),
        ("Animals", scan_animals),
        ("Picture Phonics", scan_picture_phonics),
        ("Odd One Out", scan_odd_one_out),
        ("Other Games", scan_any_game_file),
        ("Instructions", scan_instructions),
        ("Celebrations", scan_celebrations),
    ]

    for name, scanner in scanners:
        entries = scanner()
        # Merge without overwriting
        for path, data in entries.items():
            if path not in all_entries:
                all_entries[path] = data
        # Small separator
        pass

    print(f"\n   📊 Total: {len(all_entries)} audio entries found across all JS files")
    return all_entries


# ========================================
# DIFF ENGINE
# ========================================

def diff_audio(all_entries):
    """
    Compare scanned entries against existing MP3 files on disk.
    Returns: (new_entries, existing_entries, orphaned_files)
    """
    new_entries = {}
    existing_entries = {}
    orphaned_files = []

    # Check which scanned entries already exist
    for path, data in all_entries.items():
        full_path = PROJECT_DIR / path
        if file_exists_and_valid(full_path):
            existing_entries[path] = data
        else:
            new_entries[path] = data

    # Find orphaned MP3 files (exist on disk but not in scan results)
    audio_subdirs = [
        "letters", "phonics", "words", "sentences",
        "celebrations", "instructions",
        "numbers/names", "numbers/sentences", "numbers/counting", "numbers/instructions",
        "vocabulary/colors/words", "vocabulary/colors/sentences",
        "vocabulary/shapes/words", "vocabulary/shapes/sentences",
        "vocabulary/animals/words", "vocabulary/animals/sounds", "vocabulary/animals/sentences",
        "vocabulary/instructions",
        "games/instructions", "games/explanations",
        "picture-phonics/words", "picture-phonics/sentences",
    ]

    for subdir in audio_subdirs:
        dir_path = AUDIO_DIR / subdir
        if not dir_path.exists():
            continue
        for mp3_file in dir_path.glob("*.mp3"):
            rel_path = str(mp3_file.relative_to(PROJECT_DIR)).replace("\\", "/")
            if rel_path not in all_entries:
                orphaned_files.append(rel_path)

    return new_entries, existing_entries, orphaned_files


# ========================================
# AUDIO GENERATION
# ========================================

async def generate_edge_tts(text, filepath, tts_type="word", max_retries=3):
    """Generate a single MP3 file using Edge TTS."""
    import edge_tts

    settings = TTS_SETTINGS.get(tts_type, TTS_SETTINGS["word"])

    # Ensure directory exists
    filepath.parent.mkdir(parents=True, exist_ok=True)

    for attempt in range(max_retries):
        try:
            communicate = edge_tts.Communicate(
                text=text,
                voice=VOICE,
                rate=settings["rate"],
                pitch=settings["pitch"]
            )
            await communicate.save(str(filepath))
            await asyncio.sleep(random.uniform(1.5, 3.0))
            return True
        except Exception as e:
            if attempt < max_retries - 1:
                wait_time = (attempt + 1) * 8 + random.uniform(2, 5)
                print(f"      ⚠️  Retry {attempt + 1}/{max_retries} in {wait_time:.0f}s... ({e})")
                await asyncio.sleep(wait_time)
            else:
                print(f"      ❌ Failed after {max_retries} attempts: {text}")
                return False


async def generate_all_new(new_entries):
    """Generate all new audio files."""
    if not new_entries:
        print("   ✅ Nothing to generate!")
        return

    total = len(new_entries)
    print(f"\n🎙️  Generating {total} new audio files...\n")

    # Group by category for nicer output
    by_category = {}
    for path, data in new_entries.items():
        cat = data.get("category", "other")
        if cat not in by_category:
            by_category[cat] = []
        by_category[cat].append((path, data))

    generated = 0
    failed = 0

    for category, entries in by_category.items():
        print(f"   📂 {category} ({len(entries)} files)")

        for path, data in entries:
            full_path = PROJECT_DIR / path
            text = data["text"]
            tts_type = data.get("type", "word")

            success = await generate_edge_tts(text, full_path, tts_type)

            if success:
                generated += 1
                print(f"      ✅ {path}")
            else:
                failed += 1
                print(f"      ❌ {path}")

        # Pause between categories to avoid rate limiting
        await asyncio.sleep(random.uniform(2, 4))

    print(f"\n   🎉 Generated: {generated} | Failed: {failed}")


# ========================================
# CLEANUP
# ========================================

def cleanup_orphans(orphaned_files):
    """Delete orphaned MP3 files."""
    if not orphaned_files:
        return

    print(f"\n🗑️  Cleaning up {len(orphaned_files)} orphaned files:\n")
    for rel_path in orphaned_files:
        full_path = PROJECT_DIR / rel_path
        try:
            full_path.unlink()
            print(f"   🗑️  Deleted: {rel_path}")
        except Exception as e:
            print(f"   ⚠️  Failed to delete {rel_path}: {e}")

    # Clean up empty directories
    for subdir in AUDIO_DIR.rglob("*"):
        if subdir.is_dir() and not any(subdir.iterdir()):
            try:
                subdir.rmdir()
                print(f"   📁 Removed empty dir: {subdir.relative_to(PROJECT_DIR)}")
            except Exception:
                pass


# ========================================
# MANIFEST GENERATION
# ========================================

def generate_manifest(all_entries):
    """Auto-generate manifest.json from scan results."""
    manifest = {
        "letters": {},
        "celebrations": [],
        "instructions": [],
        "numbers": {},
        "counting": {},
        "number_instructions": [],
        "vocabulary": {
            "colors": {},
            "shapes": {},
            "animals": {},
            "instructions": []
        },
        "picture_phonics": {},
        "game_instructions": [],
        "game_explanations": {}
    }

    for path, data in sorted(all_entries.items()):
        category = data.get("category", "")

        # --- Letters ---
        if category == "letters":
            # Extract letter from path: audio/letters/a.mp3 → a
            filename = Path(path).stem

            if "/letters/" in path:
                if filename not in manifest["letters"]:
                    manifest["letters"][filename] = {}
                manifest["letters"][filename]["name"] = path
            elif "/phonics/" in path:
                if filename not in manifest["letters"]:
                    manifest["letters"][filename] = {}
                manifest["letters"][filename]["phonics"] = path
            elif "/words/" in path:
                if filename not in manifest["letters"]:
                    manifest["letters"][filename] = {}
                manifest["letters"][filename]["word"] = path
            elif "/sentences/" in path:
                if filename not in manifest["letters"]:
                    manifest["letters"][filename] = {}
                manifest["letters"][filename]["sentence"] = path

        # --- Celebrations ---
        elif category == "celebrations":
            manifest["celebrations"].append(path)

        # --- Instructions ---
        elif category == "instructions":
            inst_id = Path(path).stem
            manifest["instructions"].append({"id": inst_id, "path": path})

        # --- Numbers ---
        elif category == "numbers":
            num = Path(path).stem
            if num not in manifest["numbers"]:
                manifest["numbers"][num] = {}
            if "/names/" in path:
                manifest["numbers"][num]["name"] = path
            elif "/sentences/" in path:
                manifest["numbers"][num]["sentence"] = path
            elif "/counting/" in path:
                count_num = num.replace("count_", "")
                manifest["counting"][count_num] = path

        # --- Number Instructions ---
        elif category == "number_instructions":
            inst_id = Path(path).stem
            manifest["number_instructions"].append({"id": inst_id, "path": path})

        # --- Vocabulary Colors ---
        elif category == "vocabulary_colors":
            item_id = Path(path).stem
            if item_id not in manifest["vocabulary"]["colors"]:
                manifest["vocabulary"]["colors"][item_id] = {}
            if "/words/" in path:
                manifest["vocabulary"]["colors"][item_id]["word"] = path
            elif "/sentences/" in path:
                manifest["vocabulary"]["colors"][item_id]["sentence"] = path

        # --- Vocabulary Shapes ---
        elif category == "vocabulary_shapes":
            item_id = Path(path).stem
            if item_id not in manifest["vocabulary"]["shapes"]:
                manifest["vocabulary"]["shapes"][item_id] = {}
            if "/words/" in path:
                manifest["vocabulary"]["shapes"][item_id]["word"] = path
            elif "/sentences/" in path:
                manifest["vocabulary"]["shapes"][item_id]["sentence"] = path

        # --- Vocabulary Animals ---
        elif category == "vocabulary_animals":
            item_id = Path(path).stem
            if item_id not in manifest["vocabulary"]["animals"]:
                manifest["vocabulary"]["animals"][item_id] = {}
            if "/words/" in path:
                manifest["vocabulary"]["animals"][item_id]["word"] = path
            elif "/sounds/" in path:
                manifest["vocabulary"]["animals"][item_id]["sound"] = path
            elif "/sentences/" in path:
                manifest["vocabulary"]["animals"][item_id]["sentence"] = path

        # --- Vocabulary Instructions ---
        elif category == "vocabulary_instructions":
            inst_id = Path(path).stem
            manifest["vocabulary"]["instructions"].append({"id": inst_id, "path": path})

        # --- Picture Phonics ---
        elif category == "picture_phonics":
            word_id = Path(path).stem
            if word_id not in manifest["picture_phonics"]:
                manifest["picture_phonics"][word_id] = {}
            if "/words/" in path:
                manifest["picture_phonics"][word_id]["word"] = path
            elif "/sentences/" in path:
                manifest["picture_phonics"][word_id]["sentence"] = path

        # --- Game Instructions ---
        elif category == "game_instructions":
            inst_id = Path(path).stem
            manifest["game_instructions"].append({"id": inst_id, "path": path})

        # --- Game Explanations ---
        elif category == "game_explanations":
            exp_id = Path(path).stem
            manifest["game_explanations"][exp_id] = path

    # Handle counting entries that weren't caught above
    for path, data in all_entries.items():
        if "/counting/" in path and data.get("category") == "numbers":
            num = Path(path).stem.replace("count_", "")
            manifest["counting"][num] = path

    # Save manifest
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    with open(MANIFEST_PATH, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, indent=2)

    print(f"\n📋 Manifest saved to {MANIFEST_PATH.relative_to(PROJECT_DIR)}")
    print(f"   Letters: {len(manifest['letters'])}")
    print(f"   Numbers: {len(manifest['numbers'])}")
    print(f"   Celebrations: {len(manifest['celebrations'])}")
    print(f"   Instructions: {len(manifest['instructions'])}")
    print(f"   Colors: {len(manifest['vocabulary']['colors'])}")
    print(f"   Shapes: {len(manifest['vocabulary']['shapes'])}")
    print(f"   Animals: {len(manifest['vocabulary']['animals'])}")
    print(f"   Picture Phonics: {len(manifest['picture_phonics'])}")
    print(f"   Game Explanations: {len(manifest['game_explanations'])}")
    print(f"   Game Instructions: {len(manifest['game_instructions'])}")


# ========================================
# SERVICE WORKER UPDATER
# ========================================

def update_service_worker():
    """Bump the service worker cache version to force refresh."""
    sw_path = PROJECT_DIR / "sw.js"
    if not sw_path.exists():
        return

    content = read_file(sw_path)

    # Find and bump version: 'learning-world-v7' -> 'learning-world-v8'
    match = re.search(r"CACHE_NAME\s*=\s*'learning-world-v(\d+)'", content)
    if match:
        old_version = int(match.group(1))
        new_version = old_version + 1
        new_content = content.replace(
            f"learning-world-v{old_version}",
            f"learning-world-v{new_version}"
        )
        with open(sw_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"\n🔄 Service worker cache bumped: v{old_version} → v{new_version}")


# ========================================
# MAIN
# ========================================

def main():
    print("=" * 50)
    print("🦕 Learning World — Smart Audio Sync")
    print("=" * 50)
    print()

    # Step 1: Scan
    all_entries = scan_all()

    # Step 2: Diff
    print("\n📊 Comparing with existing audio files...\n")
    new_entries, existing_entries, orphaned_files = diff_audio(all_entries)

    print(f"   ✅ Existing (up to date): {len(existing_entries)}")
    print(f"   🆕 New (to generate):     {len(new_entries)}")
    print(f"   🗑️  Orphaned (to delete):  {len(orphaned_files)}")

    if new_entries:
        print("\n   New files needed:")
        for path in sorted(new_entries.keys()):
            print(f"      + {path}")

    if orphaned_files:
        print("\n   Orphaned files:")
        for path in sorted(orphaned_files):
            print(f"      - {path}")

    # Step 3: Generate new files
    if new_entries:
        try:
            import edge_tts
        except ImportError:
            print("\n❌ edge-tts not installed!")
            print("   Run: pip install edge-tts")
            print("\n   Skipping generation, but manifest will still be updated.")
            new_entries = {}  # Skip generation but continue with manifest

        if new_entries:
            asyncio.run(generate_all_new(new_entries))

    # Step 4: Cleanup orphans
    if orphaned_files:
        cleanup_orphans(orphaned_files)

    # Step 5: Generate manifest (always, to ensure it's in sync)
    generate_manifest(all_entries)

    # Step 6: Bump service worker
    if new_entries or orphaned_files:
        update_service_worker()

    print("\n" + "=" * 50)
    print("✅ Audio sync complete!")
    print("=" * 50)

    if new_entries or orphaned_files:
        print("\n💡 Next steps:")
        print("   git add .")
        print('   git commit -m "Sync audio files"')
        print("   git push")


if __name__ == "__main__":
    main()