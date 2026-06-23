with open("static/js/app.js", "r", encoding="utf-8") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "route" in line or "showSection" in line or "section" in line:
        if len(line.strip()) < 100:
            print(f"{i+1}: {line.strip()}")
