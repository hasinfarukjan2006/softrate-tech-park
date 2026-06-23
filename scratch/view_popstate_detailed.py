with open("static/js/app.js", "r", encoding="utf-8") as f:
    content = f.read()

lines = content.splitlines()
start = 1105
end = 1160
for idx in range(start, min(end, len(lines))):
    print(f"{idx+1}: {lines[idx]}")
