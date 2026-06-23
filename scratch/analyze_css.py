with open("scratch/purchaseordergenerator.css", "r", encoding="utf-8") as f:
    css = f.read()

print("CSS length:", len(css))
import re

# Let's find specific selector occurrences
selectors = [
    r"\.lft-main-div", r"\.rgt-main-div", r"\.po-generator", r"\.adr", 
    r"\.lineItemDIV", r"\.column", r"\.sav-amo", r"\.row-item", 
    r"\.column\s*thead\s*\.hd", r"@media\s+print"
]

for sel in selectors:
    matches = list(re.finditer(sel, css))
    print(f"Selector {sel}: found {len(matches)} matches")
    if matches:
        # Print around the first match
        pos = matches[0].start()
        start_idx = max(0, pos - 50)
        end_idx = min(len(css), pos + 150)
        print(f"  Snippet: {css[start_idx:end_idx]}")
        print("  " + "-"*40)
