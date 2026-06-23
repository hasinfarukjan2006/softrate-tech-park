with open("static/js/app.js", "r", encoding="utf-8") as f:
    content = f.read()

lines = content.splitlines()
start = -1
for i, line in enumerate(lines):
    if "window.addEventListener(\"popstate\"" in line:
        start = i
        break

if start != -1:
    print(f"Found popstate listener at line {start+1}")
    for j in range(start, min(start + 80, len(lines))):
        print(f"{j+1}: {lines[j]}")
else:
    print("popstate listener not found")
