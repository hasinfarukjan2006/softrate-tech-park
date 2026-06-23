with open("templates/index.html", "r", encoding="utf-8") as f:
    html = f.read()

# Let's read the final PO HTML block
with open("scratch/po_html_final.html", "r", encoding="utf-8") as f:
    po_html = f.read()

# Let's insert po_html right before <!-- Coming Soon Section -->
pos = html.find('<!-- Coming Soon Section -->')
if pos == -1:
    pos = html.find('<section id="coming-soon-section"')

if pos != -1:
    new_html = html[:pos] + po_html + "\n      " + html[pos:]
    with open("templates/index.html", "w", encoding="utf-8") as f:
        f.write(new_html)
    print("Successfully inserted PO HTML into templates/index.html!")
else:
    print("Could not find insertion point in templates/index.html")
