with open("static/js/packing_slip.js", "r", encoding="utf-8") as f:
    content = f.read()

import re
print("Occurrences of print or pdf in packing_slip.js:")
lines = content.splitlines()
for i, line in enumerate(lines):
    if "print" in line.lower() or "pdf" in line.lower() or "download" in line.lower():
        print(f"  {i+1}: {line.strip()}")
