import re
import os
from pathlib import Path


def find_filepath(text):
    """
    Hunts for a valid file path in a given string.
    Matches formats like: script.py, src/app.js, .env, Dockerfile
    """
    if not text:
        return None

    # Strip common markdown formatting characters
    clean_text = re.sub(r'[*`#:]', ' ', text).strip()

    # Regex to find a file path. It looks for:
    # 1. Standard files with extensions (e.g., folder/file.py, .env.example)
    # 2. Specific extensionless files (Dockerfile, Makefile)
    pattern = r'([a-zA-Z0-9_\-\./\\]+\.[a-zA-Z0-9]+|Dockerfile|Makefile|\.env[a-zA-Z0-9_\-]*)'

    match = re.search(pattern, clean_text)
    if match:
        path = match.group(1)
        # Ignore common false positives (like sentence ending in a dot)
        if not path.endswith('.') and path.lower() not in ['example.com', 'readme.md']:
            return path
    return None


def extract_generic(md_file_path):
    if not os.path.exists(md_file_path):
        print(f"Error: {md_file_path} not found.")
        return

    with open(md_file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find all markdown code blocks
    # Group 1: Language (optional), Group 2: The actual code
    pattern = re.compile(r'```(?:\w+)?\n(.*?)```', re.DOTALL)

    count = 0
    for match in pattern.finditer(content):
        code = match.group(1)
        start_idx = match.start()

        filename = None

        # --- STRATEGY 1: Look at the text immediately before the code block ---
        # Grab the text before this code block, split by newlines, get the last 2 non-empty lines
        preceding_text = content[:start_idx].strip().split('\n')
        preceding_lines = [line for line in preceding_text if line.strip()][-2:]

        for line in reversed(preceding_lines):
            filename = find_filepath(line)
            if filename:
                break

        # --- STRATEGY 2: Look inside the code block (first 2 lines for comments) ---
        if not filename:
            code_lines = code.strip().split('\n')[:2]  # Check first 2 lines (to bypass shebangs like #!/bin/bash)
            for line in code_lines:
                if line.strip().startswith(('#', '//', '/*', '<!--', '"""')):
                    filename = find_filepath(line)
                    if filename:
                        break

        # --- EXECUTE: Create the file if a name was found ---
        if filename:
            file_path = Path(filename.strip())

            # Skip standard bash terminal commands that aren't actual files
            if file_path.name in ['bash', 'sh', 'python'] or file_path.name.startswith('pip'):
                continue

            print(f"Creating: {file_path}")

            # Ensure directory exists
            file_path.parent.mkdir(parents=True, exist_ok=True)

            # Write the file
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(code.strip() + '\n')
            count += 1
        else:
            print("Skipped a code block (could not determine a valid filename).")

    print(f"\nDone! Successfully extracted {count} files.")


if __name__ == "__main__":
    extract_generic('response.md')