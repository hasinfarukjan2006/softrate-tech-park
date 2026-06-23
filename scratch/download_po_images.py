import urllib.request
import os

images = {
    "po-generator.png": "https://www.zoho.com/inventory/images/po-generator.png",
    "arrow-sprite-1x.png": "https://www.zoho.com/inventory/images/arrow-sprite-1x.png",
    "arrow-sprite-2x.png": "https://www.zoho.com/inventory/images/arrow-sprite-2x.png"
}

os.makedirs("static/images", exist_ok=True)

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

for filename, url in images.items():
    dest = os.path.join("static/images", filename)
    try:
        print(f"Downloading {url} to {dest}...")
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as response:
            content = response.read()
        with open(dest, "wb") as f:
            f.write(content)
        print(f"Successfully saved {filename} ({len(content)} bytes)")
    except Exception as e:
        print(f"Error downloading {filename}: {e}")
