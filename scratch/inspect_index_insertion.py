with open("templates/index.html", "r", encoding="utf-8") as f:
    html = f.read()

import re
matches = list(re.finditer(r'<section id="reorder-section"', html))
if matches:
    pos = matches[0].start()
    print("reorder-section found at position:", pos)
    print(html[pos - 500:pos + 1500])
else:
    print("reorder-section not found")
