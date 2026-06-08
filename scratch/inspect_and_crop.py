from PIL import Image
import os

screenshot_dir = "/Users/mungyeongjae/.gemini/antigravity-ide/brain/de025697-1c1d-4989-af52-51007e7b564b/.tempmediaStorage"
output_dir = "/Users/mungyeongjae/Documents/GitHub/SENTI/assets"

# For dawn_forest: design coordinates x=815, y=309, w=445, h=557
# For falling_petals: design coordinates x=1202, y=78, w=445, h=557
# Screenshot scale is 1.5

crops = {
    "media_de025697-1c1d-4989-af52-51007e7b564b_1780837214839.png": (
        int(815 * 1.5), int(309 * 1.5), int((815 + 445) * 1.5), int((309 + 557) * 1.5), "perfume_dawn_forest.png"
    ),
    "media_de025697-1c1d-4989-af52-51007e7b564b_1780837228707.png": (
        int(1202 * 1.5), int(78 * 1.5), int((1202 + 445) * 1.5), int((78 + 557) * 1.5), "perfume_falling_petals.png"
    )
}

for filename, (left, top, right, bottom, out_name) in crops.items():
    path = os.path.join(screenshot_dir, filename)
    if not os.path.exists(path):
        print(f"File {path} does not exist!")
        continue
    img = Image.open(path)
    cropped = img.crop((left, top, right, bottom))
    out_path = os.path.join(output_dir, out_name)
    # Resize to exactly 445x557 so it is clean and matches design layout exactly
    cropped_resized = cropped.resize((445, 557), Image.Resampling.LANCZOS)
    cropped_resized.save(out_path)
    print(f"Saved cropped image to {out_path} (size: {cropped_resized.size})")
