with open(r"templates/index.html", "r", encoding="utf-8") as f:
    for i, line in enumerate(f):
        if "eoq" in line.lower():
            print(f"Line {i+1}: {line.strip()}")
