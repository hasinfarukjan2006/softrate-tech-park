with open(r"scratch/zoho_full_live.html", "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

terms = ["demand", "holding", "ordering", "eoq", "sqrt", "square"]
for t in terms:
    print(f"Term '{t}': count={content.lower().count(t)}")
