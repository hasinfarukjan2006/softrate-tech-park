import re

with open(r"scratch/zoho_full_live.html", "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

matches = [m.start() for m in re.finditer("fixed", content, re.IGNORECASE)]
for idx, pos in enumerate(matches):
    print(f"\n--- MATCH {idx} ---")
    chunk = content[pos-150:pos+250]
    # Replace non-ascii chars to prevent console print crashes
    clean_chunk = "".join([c if ord(c) < 128 else "?" for c in chunk])
    print(clean_chunk)
