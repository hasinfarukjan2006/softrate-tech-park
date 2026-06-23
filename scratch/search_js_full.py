with open("scratch/purchaseordergenerator.js", "r", encoding="utf-8") as f:
    content = f.read()

import re

# Let's search for keywords in the entire text and print their surroundings
keywords = ["getPOPDF", "PurchaseOrderGenerator", "CreatePOUtil", "pdf", "print"]
for kw in keywords:
    pos = content.find(kw)
    if pos != -1:
        print(f"Keyword '{kw}' found at position {pos}:")
        print(content[pos - 50:pos + 150])
        print("-" * 50)
    else:
        print(f"Keyword '{kw}' NOT found")
