import re

html_path = r"c:\Users\dellc\OneDrive\Desktop\softrate\scratch\test_fail.txt"
with open(html_path, "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

matches = [m.start() for m in re.finditer("break-even", content, re.IGNORECASE)]
print(f"Matches for 'break-even' in test_fail.txt: {matches}")

for idx, pos in enumerate(matches[:5]):
    start = max(0, pos - 200)
    end = min(len(content), pos + 1000)
    print(f"\n--- MATCH {idx} Context ---")
    print(content[start:end])
    print("-" * 30)
