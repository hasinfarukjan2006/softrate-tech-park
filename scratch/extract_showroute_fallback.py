with open("static/js/app.js", "r", encoding="utf-8") as f:
    content = f.read()

lines = content.splitlines()
start = 370
end = 450
for idx in range(start, min(end, len(lines))):
    print(f"{idx+1}: {lines[idx]}")
