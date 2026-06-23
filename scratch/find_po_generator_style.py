with open("scratch/purchaseordergenerator.css", "r", encoding="utf-8") as f:
    css = f.read()

pos = css.find(".po-generator")
if pos != -1:
    print("Found .po-generator at position:", pos)
    print("CSS around .po-generator:")
    print(css[pos - 500:pos + 1500])
else:
    print(".po-generator not found")
