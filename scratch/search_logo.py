with open("templates/index.html", "r", encoding="utf-8") as f:
    html = f.read()

import re
# Let's search for logos in the header or top bar
matches = re.findall(r'<div\s+[^>]*class=["\'][^"\']*logo[^"\']*["\'][^>]*>.*?</div>|<img\s+[^>]*logo[^>]*>', html, re.DOTALL)
print("Found logos:")
for m in matches:
    print("  ", m.strip())
