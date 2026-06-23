with open("static/js/app.js", "r", encoding="utf-8") as f:
    content = f.read()

lines = content.splitlines()
keywords = ["reorder-point", "economic-order-quantity", "break-even-point"]
for kw in keywords:
    print(f"Occurrences of {kw}:")
    for i, line in enumerate(lines):
        if kw in line:
            print(f"  {i+1}: {line.strip()}")
