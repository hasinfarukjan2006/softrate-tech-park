import re

html_path = r"c:\Users\dellc\OneDrive\Desktop\softrate\scratch\zoho_full_live.html"
with open(html_path, "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

# Let's search for "Fixed Cost" in the file and print some characters around it.
matches = [m.start() for m in re.finditer("Fixed Cost", content, re.IGNORECASE)]
print(f"Matches for 'Fixed Cost': {matches}")

for idx, pos in enumerate(matches):
    start = max(0, pos - 1500)
    end = min(len(content), pos + 1500)
    print(f"\n--- MATCH {idx} Context ---")
    print(content[start:end])
    print("-" * 30)

# Let's search for "Break-even" in the file and print some characters around it.
be_matches = [m.start() for m in re.finditer("break-even", content, re.IGNORECASE)]
print(f"Matches for 'break-even': {be_matches}")
if be_matches:
    start = max(0, be_matches[0] - 500)
    end = min(len(content), be_matches[0] + 1500)
    print("\n--- FIRST BREAK-EVEN MATCH Context ---")
    print(content[start:end])
    print("-" * 30)
