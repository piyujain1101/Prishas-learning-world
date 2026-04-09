# Run this: pip install Pillow
# Then: python create_icons.py

from PIL import Image, ImageDraw, ImageFont


def create_icon(size, filename):
    img = Image.new('RGBA', (size, size), (108, 92, 231, 255))
    draw = ImageDraw.Draw(img)

    # Draw a circle background
    padding = size // 8
    draw.ellipse(
        [padding, padding, size - padding, size - padding],
        fill=(255, 255, 255, 50)
    )

    # Add emoji text (will show as text, but works as placeholder)
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Apple Color Emoji.ttc", size // 2)
    except:
        font = ImageFont.load_default()

    # Center the text
    text = "🦕"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    x = (size - text_width) // 2
    y = (size - text_height) // 2
    draw.text((x, y), text, font=font)

    img.save(filename)
    print(f"✅ Created {filename}")


create_icon(192, "images/icon-192.png")
create_icon(512, "images/icon-512.png")