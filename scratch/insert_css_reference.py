with open("templates/index.html", "r", encoding="utf-8") as f:
    html = f.read()

target_ref = 'href="/static/css/reorder.css"'
pos = html.find(target_ref)
if pos != -1:
    # Find the end of the link tag
    end_pos = html.find('>', pos)
    if end_pos != -1:
        insertion = '\n  <link rel="stylesheet" href="/static/css/purchase_order.css">'
        new_html = html[:end_pos + 1] + insertion + html[end_pos + 1:]
        with open("templates/index.html", "w", encoding="utf-8") as f:
            f.write(new_html)
        print("Successfully added purchase_order.css link to index.html!")
    else:
        print("Could not find end of reorder.css link tag")
else:
    print("Could not find reorder.css reference in index.html")
