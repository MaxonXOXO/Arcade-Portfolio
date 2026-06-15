from PIL import Image
import os

ZONE1_DIR = "public/assets/backgrounds/zone1"
SKIP = ["layer1_sky.png"]  # sky has real black, don't touch it

def remove_black(filepath):
    img = Image.open(filepath).convert("RGBA")
    data = img.getdata()
    clean = []
    for r, g, b, a in data:
        # If pixel is near-black and not part of actual art
        if r < 20 and g < 20 and b < 20:
            clean.append((0, 0, 0, 0))  # transparent
        else:
            clean.append((r, g, b, a))
    img.putdata(clean)
    img.save(filepath, "PNG")
    print(f"  ✓ cleaned: {os.path.basename(filepath)}")

def main():
    for filename in sorted(os.listdir(ZONE1_DIR)):
        if filename.endswith(".png") and filename not in SKIP:
            remove_black(os.path.join(ZONE1_DIR, filename))
    print("\nDone.")

if __name__ == "__main__":
    main()