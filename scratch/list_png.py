import os
import glob

screenshot_dir = "/Users/mungyeongjae/.gemini/antigravity-ide/brain/de025697-1c1d-4989-af52-51007e7b564b/.tempmediaStorage"
files = glob.glob(os.path.join(screenshot_dir, "*.png"))
print(f"Total files: {len(files)}")
files.sort(key=os.path.getmtime, reverse=True)
for f in files[:20]:
    print(f, os.path.getsize(f))
