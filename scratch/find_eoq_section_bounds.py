with open(r"templates/index.html", "r", encoding="utf-8") as f:
    for i, line in enumerate(f):
        if "id=\"eoq-section\"" in line:
            print(f"Start: Line {i+1}")
        if "<!-- Section: Break-Even Point Calculator -->" in line:
            print(f"End: Line {i+1}")
            break
