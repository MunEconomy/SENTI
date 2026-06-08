import hashlib
import os

def check_file(path):
    if not os.path.exists(path):
        print(f"{path} does not exist!")
        return
    with open(path, "rb") as f:
        data = f.read()
        md5 = hashlib.md5(data).hexdigest()
        print(f"File: {path}, Size: {len(data)}, MD5: {md5}")

check_file("/Users/mungyeongjae/Documents/GitHub/SENTI/assets/perfume_dawn_forest.png")
check_file("/Users/mungyeongjae/Documents/GitHub/SENTI/assets/perfume_falling_petals.png")
