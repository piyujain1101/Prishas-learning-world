"""
========================================
Audio Generator for Prisha's Learning World
========================================
pip install edge-tts
python generate_audio.py --method edge
========================================
"""

import os
import json
import asyncio
import argparse
import random
from pathlib import Path

# --- Letter audio data ---
LETTERS_DATA = [
    {"letter": "A", "phonics": "aah", "word": "Apple", "sentence": "A is for Apple"},
    {"letter": "B", "phonics": "bah", "word": "Butterfly", "sentence": "B is for Butterfly"},
    {"letter": "C", "phonics": "kah", "word": "Cat", "sentence": "C is for Cat"},
    {"letter": "D", "phonics": "dah", "word": "Dinosaur", "sentence": "D is for Dinosaur"},
    {"letter": "E", "phonics": "ehh", "word": "Elephant", "sentence": "E is for Elephant"},
    {"letter": "F", "phonics": "fah", "word": "Fish", "sentence": "F is for Fish"},
    {"letter": "G", "phonics": "gah", "word": "Grapes", "sentence": "G is for Grapes"},
    {"letter": "H", "phonics": "hah", "word": "Heart", "sentence": "H is for Heart"},
    {"letter": "I", "phonics": "iih", "word": "Ice Cream", "sentence": "I is for Ice Cream"},
    {"letter": "J", "phonics": "jah", "word": "Jellyfish", "sentence": "J is for Jellyfish"},
    {"letter": "K", "phonics": "kah", "word": "Kite", "sentence": "K is for Kite"},
    {"letter": "L", "phonics": "lah", "word": "Lion", "sentence": "L is for Lion"},
    {"letter": "M", "phonics": "mah", "word": "Moon", "sentence": "M is for Moon"},
    {"letter": "N", "phonics": "nah", "word": "Nest", "sentence": "N is for Nest"},
    {"letter": "O", "phonics": "awe", "word": "Octopus", "sentence": "O is for Octopus"},
    {"letter": "P", "phonics": "pah", "word": "Penguin", "sentence": "P is for Penguin"},
    {"letter": "Q", "phonics": "kwah", "word": "Queen", "sentence": "Q is for Queen"},
    {"letter": "R", "phonics": "rah", "word": "Rainbow", "sentence": "R is for Rainbow"},
    {"letter": "S", "phonics": "sah", "word": "Star", "sentence": "S is for Star"},
    {"letter": "T", "phonics": "tah", "word": "Turtle", "sentence": "T is for Turtle"},
    {"letter": "U", "phonics": "uhh", "word": "Umbrella", "sentence": "U is for Umbrella"},
    {"letter": "V", "phonics": "vah", "word": "Violin", "sentence": "V is for Violin"},
    {"letter": "W", "phonics": "wah", "word": "Whale", "sentence": "W is for Whale"},
    {"letter": "X", "phonics": "ecks", "word": "Xylophone", "sentence": "X is for Xylophone"},
    {"letter": "Y", "phonics": "yah", "word": "Yarn", "sentence": "Y is for Yarn"},
    {"letter": "Z", "phonics": "zah", "word": "Zebra", "sentence": "Z is for Zebra"},
]

CELEBRATIONS = [
    {"id": "great_job", "text": "Great job, Prisha!"},
    {"id": "amazing", "text": "You're amazing, Prisha!"},
    {"id": "wonderful", "text": "Wonderful, Prisha!"},
    {"id": "you_did_it", "text": "You did it, Prisha!"},
    {"id": "super_star", "text": "Super star, Prisha!"},
    {"id": "yay", "text": "Yay, Prisha!"},
    {"id": "keep_going", "text": "Keep going, Prisha! You're doing great!"},
    {"id": "well_done", "text": "Well done, Prisha!"},
    {"id": "fantastic", "text": "Fantastic, Prisha!"},
    {"id": "proud", "text": "I'm so proud of you, Prisha!"},
]

INSTRUCTIONS = [
    {"id": "welcome", "text": "Hi Prisha! Welcome to your learning world!"},
    {"id": "lets_learn", "text": "Let's learn letters, Prisha!"},
    {"id": "find_lowercase", "text": "Find the lowercase friend!"},
    {"id": "what_sound", "text": "What letter makes this sound?"},
    {"id": "tap_to_hear", "text": "Tap the buttons to hear the sounds!"},
    {"id": "try_again", "text": "Oops! Try again, Prisha!"},
    {"id": "all_done", "text": "Wow Prisha! You explored all 26 letters! You are a superstar!"},
    {"id": "pick_letter", "text": "Pick the right letter!"},
    {"id": "listen_carefully", "text": "Listen carefully!"},
    {"id": "roar", "text": "Roar! I'm Dino! Let's have fun!"},
]

NUMBERS_DATA_AUDIO = [
    {"num": 1,  "word": "One",       "sentence": "One. 1 Dinosaur!"},
    {"num": 2,  "word": "Two",       "sentence": "Two. 2 Cats!"},
    {"num": 3,  "word": "Three",     "sentence": "Three. 3 Stars!"},
    {"num": 4,  "word": "Four",      "sentence": "Four. 4 Fish!"},
    {"num": 5,  "word": "Five",      "sentence": "Five. 5 Apples!"},
    {"num": 6,  "word": "Six",       "sentence": "Six. 6 Butterflies!"},
    {"num": 7,  "word": "Seven",     "sentence": "Seven. 7 Moons!"},
    {"num": 8,  "word": "Eight",     "sentence": "Eight. 8 Turtles!"},
    {"num": 9,  "word": "Nine",      "sentence": "Nine. 9 Rainbows!"},
    {"num": 10, "word": "Ten",       "sentence": "Ten. 10 Penguins!"},
    {"num": 11, "word": "Eleven",    "sentence": "Eleven."},
    {"num": 12, "word": "Twelve",    "sentence": "Twelve."},
    {"num": 13, "word": "Thirteen",  "sentence": "Thirteen."},
    {"num": 14, "word": "Fourteen",  "sentence": "Fourteen."},
    {"num": 15, "word": "Fifteen",   "sentence": "Fifteen."},
    {"num": 16, "word": "Sixteen",   "sentence": "Sixteen."},
    {"num": 17, "word": "Seventeen", "sentence": "Seventeen."},
    {"num": 18, "word": "Eighteen",  "sentence": "Eighteen."},
    {"num": 19, "word": "Nineteen",  "sentence": "Nineteen."},
    {"num": 20, "word": "Twenty",    "sentence": "Twenty."},
]

NUMBERS_INSTRUCTIONS = [
    {"id": "lets_count", "text": "Let's explore numbers, Prisha!"},
    {"id": "count_animals", "text": "Count the animals, Prisha!"},
    {"id": "how_many", "text": "How many do you see?"},
    {"id": "match_number", "text": "Match the number to the right group, Prisha!"},
    {"id": "all_numbers_done", "text": "Wow Prisha! You explored all 20 numbers! Amazing!"},
    {"id": "keep_practicing", "text": "Keep practicing, Prisha! You can do it!"},
]

COUNTING_SEQUENCES = []
for i in range(1, 11):
    words = ", ".join([str(x) for x in range(1, i + 1)])
    COUNTING_SEQUENCES.append({
        "id": f"count_{i}",
        "text": f"{words}!"
    })

AUDIO_DIR = Path("../audio")

def get_phonics_speech_text(letter, phonics):
    phonics_speech = {
        'A': 'aah', 'B': 'bah', 'C': 'kah', 'D': 'dah', 'E': 'ehh',
        'F': 'fah', 'G': 'gah', 'H': 'hah', 'I': 'iih', 'J': 'jah',
        'K': 'kah', 'L': 'lah', 'M': 'mah', 'N': 'nah', 'O': 'awe',
        'P': 'pah', 'Q': 'kwah', 'R': 'rah', 'S': 'sah', 'T': 'tah',
        'U': 'uhh', 'V': 'vah', 'W': 'wah', 'X': 'ecks', 'Y': 'yah', 'Z': 'zah'
    }
    return phonics_speech.get(letter, phonics)


def setup_dirs():
    dirs = [
        "letters", "phonics", "words", "sentences",
        "celebrations", "instructions",
        "numbers/names", "numbers/sentences",
        "numbers/counting", "numbers/instructions"
    ]
    for d in dirs:
        (AUDIO_DIR / d).mkdir(parents=True, exist_ok=True)
    print("✅ Created audio directories")


def file_exists(filepath):
    """Check if file exists and is not empty"""
    return filepath.exists() and filepath.stat().st_size > 100


async def generate_edge_tts(text, filepath, voice="en-US-AnaNeural", rate="-10%", pitch="+5Hz", max_retries=3):
    import edge_tts

    for attempt in range(max_retries):
        try:
            communicate = edge_tts.Communicate(
                text=text,
                voice=voice,
                rate=rate,
                pitch=pitch
            )
            await communicate.save(str(filepath))
            # Random delay to avoid rate limiting
            await asyncio.sleep(random.uniform(1.5, 3.0))
            return
        except Exception as e:
            if attempt < max_retries - 1:
                wait_time = (attempt + 1) * 8 + random.uniform(2, 5)
                print(f"   ⚠️  Error. Waiting {wait_time:.0f}s before retry ({attempt + 1}/{max_retries})...")
                await asyncio.sleep(wait_time)
            else:
                print(f"   ❌ Failed after {max_retries} attempts: {text}")
                print(f"      Error: {e}")


async def section_pause(name):
    wait = random.uniform(5, 8)
    print(f"\n   ⏳ Pausing {wait:.0f}s before {name}...")
    await asyncio.sleep(wait)


async def generate_all_edge():
    print("🔊 Generating audio with Edge TTS (Ana Neural voice)...")
    print("   Skipping files that already exist.\n")

    voice = "en-US-AnaNeural"
    rate_normal = "-15%"
    rate_slow = "-25%"
    pitch = "+8Hz"
    total = 0
    skipped = 0

    # 1. Letter names
    print("📝 Generating letter names...")
    for item in LETTERS_DATA:
        letter = item["letter"]
        filepath = AUDIO_DIR / "letters" / f"{letter.lower()}.mp3"
        if file_exists(filepath):
            print(f"   ⏭️  {letter} (exists)")
            skipped += 1
            total += 1
            continue
        await generate_edge_tts(f"{letter}.", filepath, voice, rate_slow, pitch)
        total += 1
        print(f"   ✅ {letter}")

    await section_pause("phonics sounds")

    # 2. Phonics sounds
    print("📝 Generating phonics sounds...")
    for item in LETTERS_DATA:
        letter = item["letter"]
        filepath = AUDIO_DIR / "phonics" / f"{letter.lower()}.mp3"
        if file_exists(filepath):
            print(f"   ⏭️  {letter} phonics (exists)")
            skipped += 1
            total += 1
            continue
        phonics_text = get_phonics_speech_text(letter, item["phonics"])
        await generate_edge_tts(phonics_text, filepath, voice, rate_slow, "+2Hz")
        total += 1
        print(f"   ✅ {letter} → '{item['phonics']}'")

    await section_pause("example words")

    # 3. Example words
    print("📝 Generating example words...")
    for item in LETTERS_DATA:
        letter = item["letter"]
        filepath = AUDIO_DIR / "words" / f"{letter.lower()}.mp3"
        if file_exists(filepath):
            print(f"   ⏭️  {item['word']} (exists)")
            skipped += 1
            total += 1
            continue
        await generate_edge_tts(f"{item['word']}.", filepath, voice, rate_normal, pitch)
        total += 1
        print(f"   ✅ {item['word']}")

    await section_pause("sentences")

    # 4. Full sentences
    print("📝 Generating sentences...")
    for item in LETTERS_DATA:
        letter = item["letter"]
        filepath = AUDIO_DIR / "sentences" / f"{letter.lower()}.mp3"
        if file_exists(filepath):
            print(f"   ⏭️  {item['sentence']} (exists)")
            skipped += 1
            total += 1
            continue
        await generate_edge_tts(item["sentence"], filepath, voice, rate_normal, pitch)
        total += 1
        print(f"   ✅ {item['sentence']}")

    await section_pause("celebrations")

    # 5. Celebrations
    print("📝 Generating celebrations...")
    for item in CELEBRATIONS:
        filepath = AUDIO_DIR / "celebrations" / f"{item['id']}.mp3"
        if file_exists(filepath):
            print(f"   ⏭️  {item['text']} (exists)")
            skipped += 1
            total += 1
            continue
        await generate_edge_tts(item["text"], filepath, voice, "-5%", "+12Hz")
        total += 1
        print(f"   ✅ {item['text']}")

    await section_pause("instructions")

    # 6. Instructions
    print("📝 Generating instructions...")
    for item in INSTRUCTIONS:
        filepath = AUDIO_DIR / "instructions" / f"{item['id']}.mp3"
        if file_exists(filepath):
            print(f"   ⏭️  {item['text']} (exists)")
            skipped += 1
            total += 1
            continue
        await generate_edge_tts(item["text"], filepath, voice, rate_normal, pitch)
        total += 1
        print(f"   ✅ {item['text']}")

    await section_pause("number names")

    # 7. Number names
    print("📝 Generating number names...")
    for item in NUMBERS_DATA_AUDIO:
        num = item["num"]
        filepath = AUDIO_DIR / "numbers" / "names" / f"{num}.mp3"
        if file_exists(filepath):
            print(f"   ⏭️  {num} - {item['word']} (exists)")
            skipped += 1
            total += 1
            continue
        await generate_edge_tts(item["word"], filepath, voice, rate_normal, pitch)
        total += 1
        print(f"   ✅ {num} - {item['word']}")

    await section_pause("number sentences")

    # 8. Number sentences
    print("📝 Generating number sentences...")
    for item in NUMBERS_DATA_AUDIO:
        num = item["num"]
        filepath = AUDIO_DIR / "numbers" / "sentences" / f"{num}.mp3"
        if file_exists(filepath):
            print(f"   ⏭️  {item['sentence']} (exists)")
            skipped += 1
            total += 1
            continue
        await generate_edge_tts(item["sentence"], filepath, voice, rate_normal, pitch)
        total += 1
        print(f"   ✅ {item['sentence']}")

    await section_pause("counting sequences")

    # 9. Counting sequences
    print("📝 Generating counting sequences...")
    for item in COUNTING_SEQUENCES:
        filepath = AUDIO_DIR / "numbers" / "counting" / f"{item['id']}.mp3"
        if file_exists(filepath):
            print(f"   ⏭️  {item['text']} (exists)")
            skipped += 1
            total += 1
            continue
        await generate_edge_tts(item["text"], filepath, voice, rate_slow, pitch)
        total += 1
        print(f"   ✅ {item['text']}")

    await section_pause("number instructions")

    # 10. Number instructions
    print("📝 Generating number instructions...")
    for item in NUMBERS_INSTRUCTIONS:
        filepath = AUDIO_DIR / "numbers" / "instructions" / f"{item['id']}.mp3"
        if file_exists(filepath):
            print(f"   ⏭️  {item['text']} (exists)")
            skipped += 1
            total += 1
            continue
        await generate_edge_tts(item["text"], filepath, voice, rate_normal, pitch)
        total += 1
        print(f"   ✅ {item['text']}")

    print(f"\n🎉 Done! Generated {total} files ({skipped} skipped, {total - skipped} new)")


def generate_audio_manifest():
    manifest = {"letters": {}, "celebrations": [], "instructions": [],
                "numbers": {}, "counting": {}, "number_instructions": []}

    for item in LETTERS_DATA:
        letter = item["letter"].lower()
        manifest["letters"][letter] = {
            "name": f"audio/letters/{letter}.mp3",
            "phonics": f"audio/phonics/{letter}.mp3",
            "word": f"audio/words/{letter}.mp3",
            "sentence": f"audio/sentences/{letter}.mp3",
        }

    for item in CELEBRATIONS:
        manifest["celebrations"].append(f"audio/celebrations/{item['id']}.mp3")

    for item in INSTRUCTIONS:
        manifest["instructions"].append({
            "id": item["id"],
            "path": f"audio/instructions/{item['id']}.mp3"
        })

    for item in NUMBERS_DATA_AUDIO:
        num = str(item["num"])
        manifest["numbers"][num] = {
            "name": f"audio/numbers/names/{num}.mp3",
            "sentence": f"audio/numbers/sentences/{num}.mp3",
        }

    for i in range(1, 11):
        manifest["counting"][str(i)] = f"audio/numbers/counting/count_{i}.mp3"

    for item in NUMBERS_INSTRUCTIONS:
        manifest["number_instructions"].append({
            "id": item["id"],
            "path": f"audio/numbers/instructions/{item['id']}.mp3"
        })

    manifest_path = AUDIO_DIR / "manifest.json"
    with open(manifest_path, 'w') as f:
        json.dump(manifest, f, indent=2)
    print(f"\n📋 Audio manifest saved to {manifest_path}")


def main():
    parser = argparse.ArgumentParser(description="Generate audio for Prisha's Learning World")
    parser.add_argument('--method', choices=['edge', 'macos'], default='edge')
    args = parser.parse_args()

    setup_dirs()

    if args.method == 'edge':
        print("\n🌟 Using Edge TTS (Microsoft Ana Neural)")
        print("   With retry logic and rate limit protection\n")
        asyncio.run(generate_all_edge())

    generate_audio_manifest()


if __name__ == "__main__":
    main()