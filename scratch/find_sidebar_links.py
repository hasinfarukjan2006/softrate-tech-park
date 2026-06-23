with open("templates/index.html", "r", encoding="utf-8") as f:
    html = f.read()

import re
sidebar_links = re.findall(r'<a\s+[^>]*class=["\'][^"\']*sidebar-link[^"\']*["\'][^>]*>', html)
print("Sidebar links:")
for link in sidebar_links:
    print("  ", link)
