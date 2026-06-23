with open(r"static/css/style.css", "r", encoding="utf-8") as f:
    style_content = f.read()

import re
matches = [m.start() for m in re.finditer("logo", style_content)]
print(f"Found {len(matches)} matches for 'logo'")
for pos in matches[:5]:
    print(style_content[pos-100:pos+300])
    print("-" * 30)
