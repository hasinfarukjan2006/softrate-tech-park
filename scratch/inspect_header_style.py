with open(r"static/css/style.css", "r", encoding="utf-8") as f:
    style_content = f.read()

import re
matches = [m.start() for m in re.finditer("top-header-bar", style_content)]
for pos in matches:
    print(style_content[pos:pos+600])
    print("-" * 30)
