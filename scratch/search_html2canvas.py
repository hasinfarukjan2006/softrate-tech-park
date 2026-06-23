with open("static/js/packing_slip.js", "r", encoding="utf-8") as f:
    content = f.read()

import re
print("Occurrences of html2canvas or cdnjs in packing_slip.js:")
lines = content.splitlines()
for i, line in enumerate(lines):
    if "html2canvas" in line or "cdnjs" in line or "script" in line:
        print(f"  {i+1}: {line.strip()}")
