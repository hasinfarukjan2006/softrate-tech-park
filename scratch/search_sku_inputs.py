with open("scratch/sku_full_live.html", "r", encoding="utf-8") as f:
    html = f.read()

import re

# Let's search for "Product Name" or "Category" or "Brand"
terms = ["Product Name", "Product Category", "Brand", "Color", "Size", "Variant", "Generate SKU"]
for t in terms:
    pos = html.find(t)
    if pos != -1:
        print(f"Term '{t}' found at position {pos}:")
        print("  context:", html[pos - 50:pos + 150].encode('ascii', errors='replace').decode())
        print("-" * 50)
    else:
        print(f"Term '{t}' NOT found")
