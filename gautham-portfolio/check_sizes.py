from PIL import Image
import os

folder = "public/assets/backgrounds/zone1"
for f in sorted(os.listdir(folder)):
    if f.endswith(".png"):
        img = Image.open(os.path.join(folder, f))
        print(f"{f}: {img.size}")