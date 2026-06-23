with open("scratch/purchaseordergenerator.css", "r", encoding="utf-8") as f:
    css = f.read()

po_css = css[161500:]
with open("scratch/po_extracted.css", "w", encoding="utf-8") as f:
    f.write(po_css)

print("Extracted CSS length:", len(po_css))
print("First 1000 chars of extracted CSS:")
print(po_css[:1000])
