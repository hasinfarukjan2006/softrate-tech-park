with open("static/js/app.js", "r", encoding="utf-8") as f:
    content = f.read()

# Let's search for navigation or showSection or route or similar keywords
import re
print("Matches for section show/hide:")
for line in content.splitlines():
    if "showSection" in line or "showPage" in line or "navigate" in line or "route" in line or "pathname" in line or "popstate" in line:
        if len(line.strip()) < 120:
            print("  ", line.strip())
