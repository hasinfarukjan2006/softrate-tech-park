with open("templates/index.html", "r", encoding="utf-8") as f:
    html = f.read()

import re
pos = html.find('static/js/reorder.js')
if pos != -1:
    print("Found reorder.js script reference at position:", pos)
    print(html[pos - 300:pos + 300])
else:
    print("reorder.js script reference not found")
