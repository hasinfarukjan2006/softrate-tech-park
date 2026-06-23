with open("scratch/sku_full_live.html", "r", encoding="utf-8") as f:
    html = f.read()

import re
scripts = re.findall(r'<script[^>]*src=["\']?([^"\'>\s]+)["\']?[^>]*>', html)
print("Scripts loaded:")
for s in scripts:
    print("  ", s)

# Let's search for inline scripts
inline_scripts = re.findall(r'<script\b[^>]*>(.*?)</script>', html, re.DOTALL)
print(f"\nFound {len(inline_scripts)} inline script blocks.")
for i, sc in enumerate(inline_scripts):
    if len(sc.strip()) > 0:
        print(f"  Inline block {i+1} length: {len(sc)} bytes")
        # Print first 200 chars
        print(f"  Snippet: {sc.strip()[:200]}")
        print("-" * 40)
