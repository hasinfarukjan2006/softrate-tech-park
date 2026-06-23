import re

html_path = r"c:\Users\dellc\OneDrive\Desktop\softrate\scratch\zoho_full_live.html"
with open(html_path, "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

# Let's search for header tag or header class
matches = [m.start() for m in re.finditer("<header", content, re.IGNORECASE)]
print(f"Header tag matches: {matches}")
for idx, pos in enumerate(matches):
    print(content[pos:pos+1000])

# If no header tag, search for logo class or "by zoho" or logo images
logo_matches = [m.start() for m in re.finditer("logo", content, re.IGNORECASE)]
print(f"Logo matches: {len(logo_matches)}")
for idx, pos in enumerate(logo_matches[:3]):
    print(content[pos-100:pos+200])
