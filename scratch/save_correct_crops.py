from PIL import Image
import os

screenshot_dir = "/Users/mungyeongjae/.gemini/antigravity-ide/brain/de025697-1c1d-4989-af52-51007e7b564b/.tempmediaStorage"
output_dir = "/Users/mungyeongjae/Documents/GitHub/SENTI/assets"

# 1. Dawn Forest: from 1780841130608.png (which is the selected image 56 screenshot, size 735x919)
df_src = os.path.join(screenshot_dir, "media_de025697-1c1d-4989-af52-51007e7b564b_1780841130608.png")
if os.path.exists(df_src):
    img_df = Image.open(df_src)
    df_resized = img_df.resize((445, 557), Image.Resampling.LANCZOS)
    df_resized.save(os.path.join(output_dir, "perfume_dawn_forest.png"))
    print("Saved perfume_dawn_forest.png successfully from 1780841130608.png!")
else:
    print(f"Error: {df_src} not found!")

# 2. Falling Petals: crop from 1780841115697.png (size 2880x1826)
# Coordinates: x=1202, y=78, w=445, h=557. Scale = 1.5
fp_src = os.path.join(screenshot_dir, "media_de025697-1c1d-4989-af52-51007e7b564b_1780841115697.png")
if os.path.exists(fp_src):
    img_fp = Image.open(fp_src)
    crop_fp = img_fp.crop((int(1202 * 1.5), int(78 * 1.5), int((1202 + 445) * 1.5), int((78 + 557) * 1.5)))
    fp_resized = crop_fp.resize((445, 557), Image.Resampling.LANCZOS)
    fp_resized.save(os.path.join(output_dir, "perfume_falling_petals.png"))
    print("Saved perfume_falling_petals.png successfully from 1780841115697.png!")
else:
    print(f"Error: {fp_src} not found!")
