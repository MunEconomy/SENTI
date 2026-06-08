from PIL import Image
import glob
import os

screenshot_dir = "/Users/mungyeongjae/.gemini/antigravity-ide/brain/de025697-1c1d-4989-af52-51007e7b564b/.tempmediaStorage"
files = glob.glob(os.path.join(screenshot_dir, "*.png"))
files.sort(key=os.path.getmtime, reverse=True)

print(f"Total png files: {len(files)}")
for path in files[:10]:
    filename = os.path.basename(path)
    img = Image.open(path)
    w, h = img.size
    
    # Let's calculate mean color to identify the content
    # Forest image should have a lot of green (G > R and G > B)
    # Flower field image should have a lot of white/blue/orange
    pixels = list(img.resize((10, 10)).getdata())
    r_mean = sum(p[0] for p in pixels) / len(pixels)
    g_mean = sum(p[1] for p in pixels) / len(pixels)
    b_mean = sum(p[2] for p in pixels) / len(pixels)
    
    print(f"File: {filename}, Size: {w}x{h}, Mean RGB: ({r_mean:.1f}, {g_mean:.1f}, {b_mean:.1f})")
