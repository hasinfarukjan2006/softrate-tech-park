with open(r"static/css/break_even.css", "r", encoding="utf-8") as f:
    for i, line in enumerate(f):
        if "active" in line.lower():
            print(f"Line {i+1}: {line.strip()}")
