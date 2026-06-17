from PIL import Image
import os

# Define the size you want for all sprites
new_size = (128, 128)

for foldername, subfolders, filenames in os.walk('./sprites'):
    for filename in filenames:
        if '.png' in filename:
            img_path = os.path.join(foldername, filename)
            
            # Open the image and get its original size
            img = Image.open(img_path)
            width, height = img.size

            # Calculate center of the image for anchor point
            center_x = width // 2
            center_y = height // 2
            
            # Prepare the cropping box coordinates
            left = center_x - (new_size[0] // 2)
            top = center_y - (new_size[1] // 2)
            right = center_x + (new_size[0] // 2)
            bottom = center_y + (new_size[1] // 2)
            
            # Crop the image to the box coordinates and resize it
            img_cropped = img.crop((left, top, right, bottom))
            img_resized = img_cropped.resize(new_size, Image.LANCZOS)
            
            # Save the resized cropped image back to disk
            img_resized.save(img_path)
