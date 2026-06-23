with open("templates/index.html", "r", encoding="utf-8") as f:
    html = f.read()

import re
matches = list(re.finditer(r'</section>\s*<!-- Section: Reorder Point Calculator -->', html))
if not matches:
    # Let's search for </section> after <section id="reorder-section"
    pos = html.find('<section id="reorder-section"')
    if pos != -1:
        # Find closing </section> matching this section
        # reorder-section is large, let's find reorder-section closing tags
        # We can just search for "coming-soon-section" or "per-diem-section"
        pos2 = html.find('<section id="coming-soon-section"')
        if pos2 != -1:
            print("coming-soon-section found at position:", pos2)
            print(html[pos2 - 400:pos2 + 400])
else:
    pos = matches[0].start()
    print("Found exact end match at position:", pos)
    print(html[pos:pos+1000])
