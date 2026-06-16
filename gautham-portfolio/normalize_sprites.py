from PIL import Image
import os
OUTPUT_SIZE = (198, 198)   # your canvas size
PADDING = 10        
import os
SPRITES_ROOT = os.path.join("public", "assets", "sprites")       # breathing room around the sprite edges

def normalize_frame(img):
    img = img.convert("RGBA")
    bbox = img.getbbox()   # finds tight bounding box of non-transparent pixels
    if not bbox:
        return img         # fully transparent frame, skip

    # Crop to just the visible pixels
    cropped = img.crop(bbox)
    cw, ch = cropped.size

    # Create fresh transparent canvas
    canvas = Image.new("RGBA", OUTPUT_SIZE, (0, 0, 0, 0))

    # Paste cropped sprite centered on canvas
    x = (OUTPUT_SIZE[0] - cw) // 2
    y = (OUTPUT_SIZE[1] - ch) // 2
    canvas.paste(cropped, (x, y), cropped)

    return canvas

def process_all():
    for anim_folder in os.listdir(SPRITES_ROOT):
        folder_path = os.path.join(SPRITES_ROOT, anim_folder)
        if not os.path.isdir(folder_path):
            continue

        print(f"Processing: {anim_folder}")

        for filename in sorted(os.listdir(folder_path)):
            if not filename.endswith(".png"):
                continue

            filepath = os.path.join(folder_path, filename)
            img = Image.open(filepath)
            normalized = normalize_frame(img)

            # Overwrites original — backup first if you want to be safe
            normalized.save(filepath, "PNG")
            print(f"  ✓ {filename}")

    print("\nDone. All frames normalized.")

if __name__ == "__main__":
    process_all()