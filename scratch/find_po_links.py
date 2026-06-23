with open("templates/index.html", "r", encoding="utf-8") as f:
    html = f.read()

# Find purchase-order-section content
import re
section_match = re.search(r'<section id="purchase-order-section".*?</section>', html, re.DOTALL)
if section_match:
    section_content = section_match.group(0)
    hrefs = re.findall(r'href=["\']?([^"\'>\s]+)["\']?', section_content)
    print("Found hrefs in purchase-order-section:")
    for href in set(hrefs):
        print("  ", href)
else:
    print("purchase-order-section not found in index.html")
