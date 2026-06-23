with open("templates/index.html", "r", encoding="utf-8") as f:
    html = f.read()

target_ref = 'href="/static/css/purchase_order.css"'
pos = html.find(target_ref)
if pos != -1:
    end_pos = html.find('>', pos)
    if end_pos != -1:
        insertion = '\n  <link rel="stylesheet" href="/static/css/sku.css">'
        new_html = html[:end_pos + 1] + insertion + html[end_pos + 1:]
        with open("templates/index.html", "w", encoding="utf-8") as f:
            f.write(new_html)
        print("Successfully added sku.css link to index.html!")
    else:
        print("Could not find end of purchase_order.css link tag")
else:
    print("Could not find purchase_order.css reference in index.html")
