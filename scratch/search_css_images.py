with open("scratch/po_extracted.css", "r", encoding="utf-8") as f:
    css = f.read()

import re
images = re.findall(r'url\([^)]+\)', css)
print("Images referenced in extracted CSS:")
for img in set(images):
    print("  ", img)
