with open("scratch/skugenerator.js", "r", encoding="utf-8") as f:
    content = f.read()

import re

# Let's search for keywords in the entire text and print their surroundings
keywords = ["Product Name", "Product Category", "Brand", "Color", "Size", "Variant", "Format", "Starting Number", "exceltool-section", "sheet-section"]
for kw in keywords:
    pos = content.lower().find(kw.lower())
    if pos != -1:
        print(f"Keyword '{kw}' found at position {pos}:")
        print(content[pos - 50:pos + 150].encode('ascii', errors='replace').decode())
        print("-" * 50)
    else:
        print(f"Keyword '{kw}' NOT found")
