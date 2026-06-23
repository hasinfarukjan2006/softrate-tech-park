with open(r"scratch/zoho_full_live.html", "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

print(f"File length: {len(content)}")
for term in ["fixed", "selling", "variable", "break-even", "calculator"]:
    count = content.lower().count(term)
    print(f"Term '{term}': count={count}")
