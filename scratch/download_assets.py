import urllib.request
import os
from PIL import Image

output_dir = "/Users/mungyeongjae/Documents/GitHub/SENTI/assets"

urls = {
    "perfume_dawn_forest.png": "http://localhost:3845/assets/59bc8dcece6167cbc4062d57ce1d32ebe98974cc.png",
    "perfume_falling_petals.png": "http://localhost:3845/assets/20df5e82a8b872676c7f7584c24d2275c8af466d.png"
}

for name, url in urls.items():
    dest = os.path.join(output_dir, name + ".raw")
    print(f"Downloading {url} to {dest}...")
    try:
        urllib.request.urlretrieve(url, dest)
        print(f"Downloaded {name} successfully!")
        
        # Let's inspect size of the downloaded image
        img = Image.open(dest)
        print(f"Image {name} size: {img.size}")
        
        # Let's resize it to exactly 445x557
        # Since the design displays it as object-cover in a 445x557 container,
        # we can perform a proper center crop to 445:557 aspect ratio and then resize.
        w, h = img.size
        target_aspect = 445 / 557
        current_aspect = w / h
        
        if current_aspect > target_aspect:
            # Image is wider than target. Crop width.
            new_w = int(h * target_aspect)
            left = (w - new_w) // 2
            right = left + new_w
            cropped = img.crop((left, 0, right, h))
        else:
            # Image is taller than target. Crop height.
            new_h = int(w / target_aspect)
            top = (h - new_h) // 2
            bottom = top + new_h
            cropped = img.crop((0, top, w, bottom))
            
        resized = cropped.resize((445, 557), Image.Resampling.LANCZOS)
        final_dest = os.path.join(output_dir, name)
        resized.save(final_dest)
        print(f"Saved processed image to {final_dest}")
        os.remove(dest)
    except Exception as e:
        print(f"Failed to download/process {name}: {e}")
