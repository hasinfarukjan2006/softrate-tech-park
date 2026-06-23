with open("templates/index.html", "r", encoding="utf-8") as f:
    html = f.read()

import re
print("Bootstrap/CSS links in index.html:")
links = re.findall(r'<link\s+[^>]*href=["\']([^"\']+)["\'][^>]*>', html)
for l in links:
    print("  ", l)
