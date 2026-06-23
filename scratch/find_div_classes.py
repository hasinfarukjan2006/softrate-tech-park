with open("scratch/sku_full_live.html", "r", encoding="utf-8") as f:
    html = f.read()

import re
matches = re.finditer(r'<div\s+class=([^\s>]+)', html)
for m in matches:
    print(f"Position {m.start()}: class={m.group(1)}")
