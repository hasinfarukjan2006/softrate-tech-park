with open("scratch/purchaseordergenerator.js", "r", encoding="utf-8") as f:
    content = f.read()

pos = content.find("calculatePOTaxAndTotal")
if pos != -1:
    print("Found calculatePOTaxAndTotal at position:", pos)
    print(content[pos - 100:pos + 1200])
else:
    print("calculatePOTaxAndTotal NOT found")
