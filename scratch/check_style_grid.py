with open("static/css/style.css", "r", encoding="utf-8") as f:
    css = f.read()

import re
print("Occurrences of row or col-md-8 in style.css:")
matches = re.findall(r'\.row\b|\.col-md-\d+\b', css)
print("  Matches:", list(set(matches)))
