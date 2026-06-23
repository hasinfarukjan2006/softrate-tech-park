import urllib.request

url = "https://www.zoho.com/inventory/js/skugenerator.js"
dest = "scratch/skugenerator.js"

try:
    print(f"Downloading {url}...")
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as response:
        content = response.read()
    with open(dest, "wb") as f:
        f.write(content)
    print(f"Successfully downloaded to {dest} ({len(content)} bytes)")
except Exception as e:
    print(f"Error downloading: {e}")
