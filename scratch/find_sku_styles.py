with open("scratch/sku_full_live.html", "r", encoding="utf-8") as f:
    html = f.read()

import re
# Find all style tags or link tags with css
styles = re.findall(r'<style[^>]*>.*?</style>', html, re.DOTALL)
print(f"Found {len(styles)} style tags in sku_full_live.html.")
for i, s in enumerate(styles):
    print(f"  Style tag {i+1} length: {len(s)} bytes")
    # print first 150 chars of s
    print(f"  Snippet: {s[:150]}")
    print("-" * 40)

# Check all stylesheets
links = re.findall(r'<link[^>]*href=["\']?([^"\'>\s]+)["\']?[^>]*rel=["\']?stylesheet["\']?', html)
print("\nLinked stylesheets:")
for l in links:
    print("  ", l)
