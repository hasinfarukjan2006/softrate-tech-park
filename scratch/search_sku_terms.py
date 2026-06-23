with open("scratch/sku_full_live.html", "r", encoding="utf-8") as f:
    html = f.read()

pos = html.find("SKU Generator")
while pos != -1:
    print("Found 'SKU Generator' at position:", pos)
    print("  context:", html[pos - 50:pos + 150].encode('ascii', errors='replace').decode())
    pos = html.find("SKU Generator", pos + 1)
