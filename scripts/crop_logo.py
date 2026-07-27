from PIL import Image

def crop_transparent(image_path):
    print(f"Processing {image_path}...")
    try:
        img = Image.open(image_path).convert("RGBA")
        bbox = img.getbbox()
        if bbox:
            print(f"Cropping to bbox {bbox}")
            img_cropped = img.crop(bbox)
            img_cropped.save(image_path)
            print("Saved cropped image.")
        else:
            print("Empty image, nothing to crop.")
    except Exception as e:
        print(f"Error: {e}")

crop_transparent('public/logo.png')
crop_transparent('app/icon.png')
