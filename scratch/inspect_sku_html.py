with open("scratch/sku_full_live.html", "r", encoding="utf-8") as f:
    html = f.read()

import re
print("Matches for link tags:")
links = re.findall(r'<link\s+[^>]*href=([^\s>]+)', html)
for l in links:
    print("  ", l)

# Let's search for some text elements that must exist, e.g. headings or main layout
print("\nHeading / Title tags:")
headings = re.findall(r'<h[1-6]\b[^>]*>.*?</h[1-6]>', html, re.DOTALL)
for h in headings[:15]:
    # clean tag text
    txt = re.sub('<[^>]+>', '', h).strip()
    print("  ", txt)
