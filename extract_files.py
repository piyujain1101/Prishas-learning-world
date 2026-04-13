#!/usr/bin/env python3
"""extract_files.py - Extract all project files into project_dump.txt"""
import os

PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_FILE = os.path.join(PROJECT_DIR, "project_dump.txt")

SKIP_DIRS = {'venv', '.venv', 'env', '.env', 'ENV', 'node_modules', '.git', '__pycache__', '.tox', '.mypy_cache'}
SKIP_EXTENSIONS = {'.mp3', '.png', '.jpg', '.ico', '.pyc', '.log'}
INCLUDE_EXTENSIONS = {'.html', '.css', '.js', '.json', '.py', '.md', '.sh'}
INCLUDE_NAMES = {'.gitignore'}

print(f"Extracting files from: {PROJECT_DIR}")
print(f"Output destination: {OUTPUT_FILE}")

with open(OUTPUT_FILE, 'w', encoding='utf-8') as out_f:
    out_f.write(f"PROJECT_DIR: {PROJECT_DIR}\n")
    out_f.write("=== Learning World - Project Files ===\n\n")

    for root, dirs, files in os.walk(PROJECT_DIR):
        # Filter directories in-place to skip unwanted folders
        dirs[:] = [d for d in sorted(dirs) if d not in SKIP_DIRS]

        for fname in sorted(files):
            # Skip the output file itself to avoid a recursive feedback loop
            if fname == "project_dump.txt":
                continue

            ext = os.path.splitext(fname)[1].lower()
            if ext not in INCLUDE_EXTENSIONS and fname not in INCLUDE_NAMES:
                continue
            if ext in SKIP_EXTENSIONS:
                continue

            filepath = os.path.join(root, fname)
            relpath = os.path.relpath(filepath, PROJECT_DIR)

            out_f.write("=" * 64 + "\n")
            out_f.write(f"FILE: {relpath}\n")
            out_f.write("=" * 64 + "\n")

            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    out_f.write(f.read())
            except Exception as e:
                out_f.write(f"[Error reading file: {str(e)}]")

            out_f.write("\n\n")

print("Done! Check project_dump.txt for the results.")