#!/usr/bin/env python3
"""extract_files.py - Extract all project files for sharing"""
import os

PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))

SKIP_DIRS = {'venv', '.venv', 'env', '.env', 'ENV', 'node_modules', '.git', '__pycache__', '.tox', '.mypy_cache'}
SKIP_EXTENSIONS = {'.mp3', '.png', '.jpg', '.ico', '.pyc', '.log'}
INCLUDE_EXTENSIONS = {'.html', '.css', '.js', '.json', '.py', '.md', '.sh'}
INCLUDE_NAMES = {'.gitignore'}

print("PROJECT_DIR:", PROJECT_DIR)
print("=== Prisha's Learning World - Project Files ===\n")

for root, dirs, files in os.walk(PROJECT_DIR):
    # This MUST happen before sorted() consumes the walk
    # In-place modification tells os.walk to skip these directories
    dirs[:] = [d for d in sorted(dirs) if d not in SKIP_DIRS]

    for fname in sorted(files):
        ext = os.path.splitext(fname)[1].lower()
        if ext not in INCLUDE_EXTENSIONS and fname not in INCLUDE_NAMES:
            continue
        if ext in SKIP_EXTENSIONS:
            continue

        filepath = os.path.join(root, fname)
        relpath = os.path.relpath(filepath, PROJECT_DIR)

        print("=" * 64)
        print("FILE: " + relpath)
        print("=" * 64)
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                print(f.read())
        except Exception as e:
            print("[Error reading file: " + str(e) + "]")
        print("\n")