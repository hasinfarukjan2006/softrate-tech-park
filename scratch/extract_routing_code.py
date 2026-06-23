with open("static/js/app.js", "r", encoding="utf-8") as f:
    content = f.read()

# Let's find the start line of window.showRoute
lines = content.splitlines()
start = -1
for i, line in enumerate(lines):
    if "window.showRoute = function" in line:
        start = i
        break

if start != -1:
    print(f"Found showRoute at line {start+1}")
    # Print 200 lines from start
    for j in range(start, min(start + 220, len(lines))):
        print(f"{j+1}: {lines[j]}")
else:
    print("showRoute not found")
