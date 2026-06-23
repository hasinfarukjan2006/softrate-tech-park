with open("static/js/app.js", "r", encoding="utf-8") as f:
    content = f.read()

lines = content.splitlines()
start = -1
for i, line in enumerate(lines):
    if "window.showRoute = function" in line:
        start = i
        break

if start != -1:
    print(f"Found showRoute at line {start+1}")
    # Print the lines before the function definition
    for j in range(max(0, start - 50), start + 80):
        print(f"{j+1}: {lines[j]}")
else:
    print("showRoute not found")
