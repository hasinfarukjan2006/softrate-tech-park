with open("templates/index.html", "r", encoding="utf-8") as f:
    html = f.read()

with open("scratch/sku_html_final.html", "r", encoding="utf-8") as f:
    sku_html = f.read()

pos = html.find('<section id="purchase-order-section"')
if pos != -1:
    new_html = html[:pos] + sku_html + "\n      " + html[pos:]
    with open("templates/index.html", "w", encoding="utf-8") as f:
        f.write(new_html)
    print("Successfully inserted SKU HTML into templates/index.html!")
else:
    print("Could not find purchase-order-section in templates/index.html")
