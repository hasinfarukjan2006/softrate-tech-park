with open("static/css/reorder.css", "r", encoding="utf-8") as f:
    css = f.read()

import re
print("Grid/row/column classes in reorder.css:")
matches = re.findall(r'\.row\b|\.col-\b|\.grid\b|display:\s*flex|display:\s*grid', css)
print("  Matches:", list(set(matches)))

# Print first 50 lines of reorder.css to see its structure
lines = css.splitlines()
print("\nFirst 40 lines of reorder.css:")
for i in range(min(40, len(lines))):
    print(f"  {i+1}: {lines[i]}")
