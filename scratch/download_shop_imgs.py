import urllib.request
import os
from PIL import Image

output_dir = "/Users/mungyeongjae/Documents/GitHub/SENTI/assets"

items = [
    # (filename, url) - keep original aspect ratio for product images
    ("shop_img31.png", "http://localhost:3845/assets/1297c5bd21e64c1ee0fb9407532b2d8a330043e7.png"),
    ("shop_img30.png", "http://localhost:3845/assets/4206c4fe8a3c15bdfefb73affdaa88d00e91a0b7.png"),
    ("shop_memoir1.png", "http://localhost:3845/assets/ae409c2cddb2ed4aa55ef526870aefc2eeeabf8c.png"),
]

for name, url in items:
    raw = os.path.join(output_dir, name + ".raw")
    print(f"Downloading {name}...")
    try:
        urllib.request.urlretrieve(url, raw)
        img = Image.open(raw)
        w, h = img.size
        print(f"  Size: {w}x{h}")
        # Save as-is (will be displayed with CSS object-fit: cover in the fixed container)
        img.save(os.path.join(output_dir, name))
        os.remove(raw)
        print(f"  Saved {name}")
    except Exception as e:
        print(f"  FAILED: {e}")

print("Done!")
