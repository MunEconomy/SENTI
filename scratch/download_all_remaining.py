import urllib.request
import os
from PIL import Image

output_dir = "/Users/mungyeongjae/Documents/GitHub/SENTI/assets"

items = [
    # (filename, url, coordinate_top from Figma)
    ("perfume_3am.png",           "http://localhost:3845/assets/cd62836ab1c845819ca52cdfa7b27ea706841b73.png"),
    ("perfume_rainy_alley.png",   "http://localhost:3845/assets/12a55b423fbcd2933a5469347120e5a56ed93e9a.png"),
    ("perfume_the_first_day.png", "http://localhost:3845/assets/0c9c6687ea9b60fd0f0afaa9a9fc4d4ce693d9fb.png"),
    ("perfume_old_room.png",      "http://localhost:3845/assets/e43f0c365fc0b5be6853366f47268b4597fb7ee7.png"),
    ("perfume_silent_morning.png","http://localhost:3845/assets/2e9dc672d1b31fc1ac74a013678fbe809696a65b.png"),
    ("perfume_last_scent.png",    "http://localhost:3845/assets/657cf470208e86bc70a1b21113c5ccd00696ce9c.png"),
]

def download_and_resize(name, url):
    raw = os.path.join(output_dir, name + ".raw")
    try:
        urllib.request.urlretrieve(url, raw)
        img = Image.open(raw)
        w, h = img.size
        print(f"  Downloaded {name}: {w}x{h}")

        target_aspect = 445 / 557
        current_aspect = w / h

        if current_aspect > target_aspect:
            new_w = int(h * target_aspect)
            left = (w - new_w) // 2
            cropped = img.crop((left, 0, left + new_w, h))
        else:
            new_h = int(w / target_aspect)
            top = (h - new_h) // 2
            cropped = img.crop((0, top, w, top + new_h))

        resized = cropped.resize((445, 557), Image.Resampling.LANCZOS)
        resized.save(os.path.join(output_dir, name))
        os.remove(raw)
        print(f"  Saved {name}")
    except Exception as e:
        print(f"  FAILED {name}: {e}")

for name, url in items:
    print(f"Downloading {name}...")
    download_and_resize(name, url)

print("Done!")
