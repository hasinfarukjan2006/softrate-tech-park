with open("templates/index.html", "r", encoding="utf-8") as f:
    html = f.read()

target_ref = 'src="/static/js/reorder.js"></script>'
pos = html.find(target_ref)
if pos != -1:
    insertion = '\n  <script src="/static/js/purchase_order.js"></script>'
    new_html = html[:pos + len(target_ref)] + insertion + html[pos + len(target_ref):]
    with open("templates/index.html", "w", encoding="utf-8") as f:
        f.write(new_html)
    print("Successfully added purchase_order.js script reference to index.html!")
else:
    print("Could not find reorder.js script reference in index.html")
