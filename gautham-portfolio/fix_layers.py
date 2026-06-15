from PIL import Image
import os

FOLDER = "public/assets/backgrounds/zone1"
TARGET = (3840, 1080)

for filename in sorted(os.listdir(FOLDER)):
    if not filename.endswith(".png"):
        continue
    
    path = os.path.join(FOLDER, filename)
    img = Image.open(path).convert("RGBA")
    
    if img.size == TARGET:
        print(f"  skipped {filename} already correct size")
        continue

    # Scale to fit TARGET height, maintain aspect ratio
    scale = TARGET[1] / img.height
    new_w = int(img.width * scale)
    resized = img.resize((new_w, TARGET[1]), Image.NEAREST)

    # Paste onto correct size transparent canvas
    canvas = Image.new("RGBA", TARGET, (0, 0, 0, 0))
    canvas.paste(resized, (0, 0), resized)
    canvas.save(path, "PNG")
    print(f"  ✓ {filename}: {img.size} → {TARGET}")

print("\nAll layers normalized to 3840x1080")