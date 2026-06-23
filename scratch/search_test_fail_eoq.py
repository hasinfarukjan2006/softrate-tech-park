with open(r"scratch/test_fail.txt", "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

import re
matches = [m.start() for m in re.finditer("demand|holding|ordering", content, re.IGNORECASE)]
print(f"Found {len(matches)} matches in test_fail.txt")
for idx, pos in enumerate(matches[:5]):
    chunk = content[pos-200:pos+300]
    clean_chunk = "".join([c if ord(c) < 128 else "?" for c in chunk])
    print(f"\n--- MATCH {idx} ---")
    print(clean_chunk)
