"""
========================================
Audio Generator for Learning World
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
# ========================================
# GAME AUDIO DATA
# ========================================

GAME_INSTRUCTIONS = [
    {"id": "find_the_different", "text": "Find the one that's different!"},
    {"id": "which_one_different", "text": "Which one is different?"},
    {"id": "great_thinking", "text": "Great thinking!"},
    {"id": "keep_trying", "text": "Keep trying! You can do it!"},
    {"id": "odd_one_out_intro", "text": "One of these doesn't belong. Can you find it?"},
]

GAME_EXPLANATIONS = [
    {"id": "cat_is_an_animal_not_a_fruit", "text": "Cat is an animal, not a fruit!"},
    {"id": "dog_is_an_animal_not_a_fruit", "text": "Dog is an animal, not a fruit!"},
    {"id": "flower_is_a_plant_not_a_fruit", "text": "Flower is a plant, not a fruit!"},
    {"id": "car_is_a_vehicle_not_an_animal", "text": "Car is a vehicle, not an animal!"},
    {"id": "star_is_in_the_sky_not_an_animal", "text": "Star is in the sky, not an animal!"},
    {"id": "pizza_is_food_not_an_animal", "text": "Pizza is food, not an animal!"},
    {"id": "blue_is_different_from_all_the_red_ones", "text": "Blue is different from all the red ones!"},
    {"id": "yellow_is_different_from_all_the_green_ones", "text": "Yellow is different from all the green ones!"},
    {"id": "orange_is_different_from_all_the_purple_ones", "text": "Orange is different from all the purple ones!"},
    {"id": "brown_is_different_from_all_the_pink_ones", "text": "Brown is different from all the pink ones!"},
    {"id": "triangle_has_3_sides_circles_are_round", "text": "Triangle has 3 sides, circles are round!"},
    {"id": "heart_is_different_from_all_the_stars", "text": "Heart is different from all the stars!"},
    {"id": "circle_is_round_squares_have_straight_sides", "text": "Circle is round, squares have straight sides!"},
    {"id": "mouse_is_tiny_elephants_are_big", "text": "Mouse is tiny, elephants are big!"},
    {"id": "teddy_bear_is_a_toy_not_food", "text": "Teddy Bear is a toy, not food!"},
    {"id": "ball_is_a_toy_not_food", "text": "Ball is a toy, not food!"},
    {"id": "fish_swims_in_water_it_cannot_fly", "text": "Fish swims in water, it cannot fly!"},
    {"id": "lion_lives_on_land_not_in_water", "text": "Lion lives on land, not in water!"},
    {"id": "elephant_is_an_animal_not_a_vehicle", "text": "Elephant is an animal, not a vehicle!"},
    {"id": "moon_is_different_from_all_the_stars", "text": "Moon is different from all the stars!"},
    {"id": "dog_is_different_from_all_the_cats", "text": "Dog is different from all the cats!"},
]
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

INSTRUCTIONS = [
    {"id": "welcome", "text": "Hi ! Welcome to your learning world!"},
    {"id": "lets_learn", "text": "Let's learn letters!"},
    {"id": "find_lowercase", "text": "Find the lowercase friend!"},
    {"id": "what_sound", "text": "What letter makes this sound?"},
    {"id": "tap_to_hear", "text": "Tap the buttons to hear the sounds!"},
    {"id": "try_again", "text": "Oops! Try again!"},
    {"id": "all_done", "text": "Wow ! You explored all 26 letters! You are a superstar!"},
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
    {"id": "lets_count", "text": "Let's explore numbers!"},
    {"id": "count_animals", "text": "Count the animals!"},
    {"id": "how_many", "text": "How many do you see?"},
    {"id": "match_number", "text": "Match the number to the right group!"},
    {"id": "all_numbers_done", "text": "Wow ! You explored all 20 numbers! Amazing!"},
    {"id": "keep_practicing", "text": "Keep practicing! You can do it!"},
]

COUNTING_SEQUENCES = []
for i in range(1, 11):
    words = ", ".join([str(x) for x in range(1, i + 1)])
    COUNTING_SEQUENCES.append({
        "id": f"count_{i}",
        "text": f"{words}!"
    })

# ========================================
# VOCABULARY AUDIO DATA
# ========================================

COLORS_AUDIO = [
    {"id": "red",    "word": "Red",    "sentence": "Red! Red like an apple!"},
    {"id": "blue",   "word": "Blue",   "sentence": "Blue! Blue like the ocean!"},
    {"id": "yellow", "word": "Yellow", "sentence": "Yellow! Yellow like the sun!"},
    {"id": "green",  "word": "Green",  "sentence": "Green! Green like a frog!"},
    {"id": "orange", "word": "Orange", "sentence": "Orange! Orange like an orange!"},
    {"id": "purple", "word": "Purple", "sentence": "Purple! Purple like grapes!"},
    {"id": "pink",   "word": "Pink",   "sentence": "Pink! Pink like a flamingo!"},
    {"id": "brown",  "word": "Brown",  "sentence": "Brown! Brown like a bear!"},
    {"id": "black",  "word": "Black",  "sentence": "Black! Black like the night!"},
    {"id": "white",  "word": "White",  "sentence": "White! White like a cloud!"},
]

SHAPES_AUDIO = [
    {"id": "circle",    "word": "Circle",    "sentence": "Circle! A circle is round like a ball!"},
    {"id": "square",    "word": "Square",    "sentence": "Square! A square has 4 equal sides!"},
    {"id": "triangle",  "word": "Triangle",  "sentence": "Triangle! A triangle has 3 sides!"},
    {"id": "star",      "word": "Star",      "sentence": "Star! A star has 5 points!"},
    {"id": "heart",     "word": "Heart",     "sentence": "Heart! A heart means love!"},
    {"id": "diamond",   "word": "Diamond",   "sentence": "Diamond! A diamond has 4 pointy sides!"},
    {"id": "rectangle", "word": "Rectangle", "sentence": "Rectangle! A rectangle is like a long square!"},
    {"id": "oval",      "word": "Oval",      "sentence": "Oval! An oval is like a stretched circle!"},
]

ANIMALS_AUDIO = [
    {"id": "cat",      "word": "Cat",      "sound": "Meow!",    "sentence": "Cat! A cat says meow!"},
    {"id": "dog",      "word": "Dog",      "sound": "Woof!",    "sentence": "Dog! A dog says woof!"},
    {"id": "cow",      "word": "Cow",      "sound": "Moo!",     "sentence": "Cow! A cow says moo!"},
    {"id": "duck",     "word": "Duck",     "sound": "Quack!",   "sentence": "Duck! A duck says quack!"},
    {"id": "pig",      "word": "Pig",      "sound": "Oink!",    "sentence": "Pig! A pig says oink!"},
    {"id": "sheep",    "word": "Sheep",    "sound": "Baa!",     "sentence": "Sheep! A sheep says baa!"},
    {"id": "horse",    "word": "Horse",    "sound": "Neigh!",   "sentence": "Horse! A horse says neigh!"},
    {"id": "lion",     "word": "Lion",     "sound": "Roar!",    "sentence": "Lion! A lion says roar!"},
    {"id": "frog",     "word": "Frog",     "sound": "Ribbit!",  "sentence": "Frog! A frog says ribbit!"},
    {"id": "chicken",  "word": "Chicken",  "sound": "Cluck!",   "sentence": "Chicken! A chicken says cluck!"},
    {"id": "bird",     "word": "Bird",     "sound": "Tweet!",   "sentence": "Bird! A bird says tweet!"},
    {"id": "monkey",   "word": "Monkey",   "sound": "Ooh ooh!", "sentence": "Monkey! A monkey says ooh ooh ah ah!"},
    {"id": "elephant", "word": "Elephant", "sound": "Trumpet!", "sentence": "Elephant! An elephant makes a trumpet sound!"},
    {"id": "snake",    "word": "Snake",    "sound": "Hiss!",    "sentence": "Snake! A snake says hiss!"},
    {"id": "bee",      "word": "Bee",      "sound": "Buzz!",    "sentence": "Bee! A bee says buzz!"},
]

VOCAB_INSTRUCTIONS = [
    {"id": "lets_learn_colors",  "text": "Let's learn colors!"},
    {"id": "lets_learn_shapes",  "text": "Let's learn shapes!"},
    {"id": "lets_learn_animals", "text": "Let's learn animals!"},
    {"id": "find_the_color",     "text": "Find the right color!"},
    {"id": "find_the_shape",     "text": "Find the right shape!"},
    {"id": "what_animal_sound",  "text": "What animal makes this sound?"},
    {"id": "this_is",            "text": "This is"},
    {"id": "keep_practicing_vocab", "text": "Keep practicing! You're learning so many words!"},
]

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
        "numbers/counting", "numbers/instructions",
        "vocabulary/colors/words", "vocabulary/colors/sentences",
        "vocabulary/shapes/words", "vocabulary/shapes/sentences",
        "vocabulary/animals/words", "vocabulary/animals/sentences",
        "vocabulary/animals/sounds",
        "vocabulary/instructions",
        "games/instructions",        # ADD
        "games/explanations",        # ADD
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
    wait = random.uniform(1, 3)
    print(f"\n   ⏳ Pausing {wait:.0f}s before {name}...")
    await asyncio.sleep(wait)


async def generate_all_edge():
    print("🎙 Generating audio with Edge TTS (Ana Neural voice)...")
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
    print("🔊 Generating phonics sounds...")
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
    print("📖 Generating example words...")
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
    print("💬 Generating sentences...")
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
    print("🎉 Generating celebrations...")
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
    print("🗣 Generating instructions...")
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
    print("🔢 Generating number names...")
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
    print("💬 Generating number sentences...")
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
    print("🔢 Generating counting sequences...")
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
    print("🗣 Generating number instructions...")
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

    await section_pause("vocabulary - color words")

    # ========================================
    # 11. VOCABULARY - Colors
    # ========================================
    print("🎨 Generating color words...")
    for item in COLORS_AUDIO:
        filepath = AUDIO_DIR / "vocabulary" / "colors" / "words" / f"{item['id']}.mp3"
        if file_exists(filepath):
            print(f"   ⏭️  {item['word']} (exists)")
            skipped += 1
            total += 1
            continue
        await generate_edge_tts(item["word"], filepath, voice, rate_normal, pitch)
        total += 1
        print(f"   ✅ {item['word']}")

    await section_pause("color sentences")

    print("🎨 Generating color sentences...")
    for item in COLORS_AUDIO:
        filepath = AUDIO_DIR / "vocabulary" / "colors" / "sentences" / f"{item['id']}.mp3"
        if file_exists(filepath):
            print(f"   ⏭️  {item['sentence']} (exists)")
            skipped += 1
            total += 1
            continue
        await generate_edge_tts(item["sentence"], filepath, voice, rate_normal, pitch)
        total += 1
        print(f"   ✅ {item['sentence']}")

    await section_pause("vocabulary - shape words")

    # ========================================
    # 12. VOCABULARY - Shapes
    # ========================================
    print("🔷 Generating shape words...")
    for item in SHAPES_AUDIO:
        filepath = AUDIO_DIR / "vocabulary" / "shapes" / "words" / f"{item['id']}.mp3"
        if file_exists(filepath):
            print(f"   ⏭️  {item['word']} (exists)")
            skipped += 1
            total += 1
            continue
        await generate_edge_tts(item["word"], filepath, voice, rate_normal, pitch)
        total += 1
        print(f"   ✅ {item['word']}")

    await section_pause("shape sentences")

    print("🔷 Generating shape sentences...")
    for item in SHAPES_AUDIO:
        filepath = AUDIO_DIR / "vocabulary" / "shapes" / "sentences" / f"{item['id']}.mp3"
        if file_exists(filepath):
            print(f"   ⏭️  {item['sentence']} (exists)")
            skipped += 1
            total += 1
            continue
        await generate_edge_tts(item["sentence"], filepath, voice, rate_normal, pitch)
        total += 1
        print(f"   ✅ {item['sentence']}")

    await section_pause("vocabulary - animal words")

    # ========================================
    # 13. VOCABULARY - Animals
    # ========================================
    print("🐾 Generating animal words...")
    for item in ANIMALS_AUDIO:
        filepath = AUDIO_DIR / "vocabulary" / "animals" / "words" / f"{item['id']}.mp3"
        if file_exists(filepath):
            print(f"   ⏭️  {item['word']} (exists)")
            skipped += 1
            total += 1
            continue
        await generate_edge_tts(item["word"], filepath, voice, rate_normal, pitch)
        total += 1
        print(f"   ✅ {item['word']}")

    await section_pause("animal sounds")

    print("🐾 Generating animal sounds...")
    for item in ANIMALS_AUDIO:
        filepath = AUDIO_DIR / "vocabulary" / "animals" / "sounds" / f"{item['id']}.mp3"
        if file_exists(filepath):
            print(f"   ⏭️  {item['sound']} (exists)")
            skipped += 1
            total += 1
            continue
        await generate_edge_tts(item["sound"], filepath, voice, "-5%", "+12Hz")
        total += 1
        print(f"   ✅ {item['sound']}")

    await section_pause("animal sentences")

    print("🐾 Generating animal sentences...")
    for item in ANIMALS_AUDIO:
        filepath = AUDIO_DIR / "vocabulary" / "animals" / "sentences" / f"{item['id']}.mp3"
        if file_exists(filepath):
            print(f"   ⏭️  {item['sentence']} (exists)")
            skipped += 1
            total += 1
            continue
        await generate_edge_tts(item["sentence"], filepath, voice, rate_normal, pitch)
        total += 1
        print(f"   ✅ {item['sentence']}")

    await section_pause("vocabulary instructions")

    # ========================================
    # 14. VOCABULARY - Instructions
    # ========================================
    print("🗣 Generating vocabulary instructions...")
    for item in VOCAB_INSTRUCTIONS:
        filepath = AUDIO_DIR / "vocabulary" / "instructions" / f"{item['id']}.mp3"
        if file_exists(filepath):
            print(f"   ⏭️  {item['text']} (exists)")
            skipped += 1
            total += 1
            continue
        await generate_edge_tts(item["text"], filepath, voice, rate_normal, pitch)
        total += 1
        print(f"   ✅ {item['text']}")
    await section_pause("game instructions")

    # 15. Game instructions
    print("🎮 Generating game instructions...")
    for item in GAME_INSTRUCTIONS:
        filepath = AUDIO_DIR / "games" / "instructions" / f"{item['id']}.mp3"
        if file_exists(filepath):
            print(f"   ⏭️  {item['text']} (exists)")
            skipped += 1
            total += 1
            continue
        await generate_edge_tts(item["text"], filepath, voice, rate_normal, pitch)
        total += 1
        print(f"   ✅ {item['text']}")

    await section_pause("game explanations")

    # 16. Game explanations
    print("🎮 Generating game explanations...")
    for item in GAME_EXPLANATIONS:
        filepath = AUDIO_DIR / "games" / "explanations" / f"{item['id']}.mp3"
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
                "numbers": {}, "counting": {}, "number_instructions": [],
                "vocabulary": {
                    "colors": {},
                    "shapes": {},
                    "animals": {},
                    "instructions": []
                }}

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

    # Vocabulary - Colors
    for item in COLORS_AUDIO:
        manifest["vocabulary"]["colors"][item["id"]] = {
            "word": f"audio/vocabulary/colors/words/{item['id']}.mp3",
            "sentence": f"audio/vocabulary/colors/sentences/{item['id']}.mp3",
        }

    # Vocabulary - Shapes
    for item in SHAPES_AUDIO:
        manifest["vocabulary"]["shapes"][item["id"]] = {
            "word": f"audio/vocabulary/shapes/words/{item['id']}.mp3",
            "sentence": f"audio/vocabulary/shapes/sentences/{item['id']}.mp3",
        }

    # Vocabulary - Animals
    for item in ANIMALS_AUDIO:
        manifest["vocabulary"]["animals"][item["id"]] = {
            "word": f"audio/vocabulary/animals/words/{item['id']}.mp3",
            "sound": f"audio/vocabulary/animals/sounds/{item['id']}.mp3",
            "sentence": f"audio/vocabulary/animals/sentences/{item['id']}.mp3",
        }

    # Vocabulary - Instructions
    for item in VOCAB_INSTRUCTIONS:
        manifest["vocabulary"]["instructions"].append({
            "id": item["id"],
            "path": f"audio/vocabulary/instructions/{item['id']}.mp3"
        })

    # Games
    manifest["game_instructions"] = []
    for item in GAME_INSTRUCTIONS:
        manifest["game_instructions"].append({
            "id": item["id"],
            "path": f"audio/games/instructions/{item['id']}.mp3"
        })

    manifest["game_explanations"] = {}
    for item in GAME_EXPLANATIONS:
        manifest["game_explanations"][item["id"]] = f"audio/games/explanations/{item['id']}.mp3"

    manifest_path = AUDIO_DIR / "manifest.json"
    with open(manifest_path, 'w') as f:
        json.dump(manifest, f, indent=2)
    print(f"\n📋 Audio manifest saved to {manifest_path}")


def main():
    parser = argparse.ArgumentParser(description="Generate audio for 's Learning World")
    parser.add_argument('--method', choices=['edge', 'macos'], default='edge')
    args = parser.parse_args()

    setup_dirs()

    if args.method == 'edge':
        print("\n🎤 Using Edge TTS (Microsoft Ana Neural)")
        print("   With retry logic and rate limit protection\n")
        asyncio.run(generate_all_edge())

    generate_audio_manifest()


if __name__ == "__main__":
    main()