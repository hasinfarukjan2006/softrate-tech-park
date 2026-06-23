with open(r"static/css/style.css", "r", encoding="utf-8") as f:
    for i, line in enumerate(f):
        if "top-header-bar {" in line:
            print(f"Line {i+1}: {line.strip()}")
