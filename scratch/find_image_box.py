from PIL import Image

def find_image_bbox(image_path):
    img = Image.open(image_path)
    w, h = img.size
    print(f"Image: {image_path}, Size: {w}x{h}")
    
    # We want to find the bounding box of the photograph.
    # The photo contains colored/varying pixels.
    # Text is mostly black or light gray. Background is solid white (255, 255, 255).
    # Let's iterate over pixels and find the ones that are not white/gray.
    
    xmin = w
    xmax = 0
    ymin = h
    ymax = 0
    
    pixels = img.convert("RGB").load()
    for y in range(h):
        for x in range(w):
            r, g, b = pixels[x, y]
            # Is it white/very light background?
            if r > 240 and g > 240 and b > 240:
                continue
            # Is it gray (like text or background lines)?
            if abs(r - g) < 20 and abs(r - b) < 20 and abs(g - b) < 20:
                # If it is gray but not very dark (text is very dark, near 0; light gray is > 200)
                if r > 150 or r < 40:
                    continue
            
            # This is a likely image pixel!
            if x < xmin: xmin = x
            if x > xmax: xmax = x
            if y < ymin: ymin = y
            if y > ymax: ymax = y
            
    if xmin >= xmax or ymin >= ymax:
        print("No image found!")
        return None
        
    print(f"Bounding Box: xmin={xmin}, ymin={ymin}, xmax={xmax}, ymax={ymax}")
    print(f"Width={xmax-xmin}, Height={ymax-ymin}, Aspect Ratio={(xmax-xmin)/(ymax-ymin):.4f}")
    return xmin, ymin, xmax, ymax

find_image_bbox("/Users/mungyeongjae/.gemini/antigravity-ide/brain/de025697-1c1d-4989-af52-51007e7b564b/.tempmediaStorage/media_de025697-1c1d-4989-af52-51007e7b564b_1780842677155.png")
find_image_bbox("/Users/mungyeongjae/.gemini/antigravity-ide/brain/de025697-1c1d-4989-af52-51007e7b564b/.tempmediaStorage/media_de025697-1c1d-4989-af52-51007e7b564b_1780842409378.png")
find_image_bbox("/Users/mungyeongjae/.gemini/antigravity-ide/brain/de025697-1c1d-4989-af52-51007e7b564b/.tempmediaStorage/media_de025697-1c1d-4989-af52-51007e7b564b_1780842401034.png")
