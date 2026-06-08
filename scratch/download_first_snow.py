import urllib.request
import os
from PIL import Image

output_dir = "/Users/mungyeongjae/Documents/GitHub/SENTI/assets"

urls = {
    "perfume_first_snow.png": "http://localhost:3845/assets/ce3da28a04881150ac322d1f475e056420ae1bf2.png",
}

for name, url in urls.items():
    dest = os.path.join(output_dir, name + ".raw")
    print(f"Downloading {url}...")
    try:
        urllib.request.urlretrieve(url, dest)
        print(f"Downloaded!")
        
        img = Image.open(dest)
        print(f"Image size: {img.size}")
        
        # Resize to 445x557 (center crop to maintain aspect ratio)
        w, h = img.size
        target_aspect = 445 / 557
        current_aspect = w / h
        
        if current_aspect > target_aspect:
            new_w = int(h * target_aspect)
            left = (w - new_w) // 2
            right = left + new_w
            cropped = img.crop((left, 0, right, h))
        else:
            new_h = int(w / target_aspect)
            top = (h - new_h) // 2
            bottom = top + new_h
            cropped = img.crop((0, top, w, bottom))
            
        resized = cropped.resize((445, 557), Image.Resampling.LANCZOS)
        final_dest = os.path.join(output_dir, name)
        resized.save(final_dest)
        print(f"Saved to {final_dest}")
        os.remove(dest)
    except Exception as e:
        print(f"Failed: {e}")
