with open("templates/index.html", "r", encoding="utf-8") as f:
    html = f.read()

lines = html.splitlines()
for i, line in enumerate(lines):
    if 'data-route="po"' in line:
        print(f"Line {i+1}: {line.strip()}")
        # print surrounding 5 lines
        for j in range(max(0, i-5), min(len(lines), i+6)):
            print(f"  {j+1}: {lines[j]}")
        print("-" * 50)
