from PIL import Image
import os

ZONE1_DIR = "public/assets/backgrounds/zone1"
TARGET_W = 3840
TARGET_H = 1080

def normalize_layer(filepath):
    img = Image.open(filepath).convert("RGBA")
    
    if img.size == (TARGET_W, TARGET_H):
        print(f"  skipped (already correct): {filepath}")
        return

    # Create transparent canvas at target size
    canvas = Image.new("RGBA", (TARGET_W, TARGET_H), (0, 0, 0, 0))
    
    # Scale image to fit height, maintain aspect ratio
    scale = TARGET_H / img.height
    new_w = int(img.width * scale)
    new_h = TARGET_H
    img_resized = img.resize((new_w, new_h), Image.NEAREST)  # NEAREST keeps pixel art crisp
    
    # Paste at top-left
    canvas.paste(img_resized, (0, 0), img_resized)
    canvas.save(filepath, "PNG")
    print(f"  ✓ normalized: {os.path.basename(filepath)} → {TARGET_W}x{TARGET_H}")

def main():
    for filename in sorted(os.listdir(ZONE1_DIR)):
        if filename.endswith(".png"):
            normalize_layer(os.path.join(ZONE1_DIR, filename))
    print("\nDone.")

if __name__ == "__main__":
    main()