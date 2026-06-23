with open("scratch/purchaseordergenerator.js", "r", encoding="utf-8") as f:
    content = f.read()

import re
print("Matches for print/pdf/download in js:")
for line in content.splitlines():
    if "getPOPDF" in line or "window.print" in line or "pdf" in line.lower() or "print" in line.lower():
        if len(line.strip()) < 150:
            print("  ", line.strip())
