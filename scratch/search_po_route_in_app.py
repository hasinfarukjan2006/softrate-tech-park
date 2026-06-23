with open("static/js/app.js", "r", encoding="utf-8") as f:
    content = f.read()

lines = content.splitlines()
print("Occurrences of '\"po\"' or 'route === \"po\"' in app.js:")
for i, line in enumerate(lines):
    if '"po"' in line or 'route === "po"' in line or 'route === \'po\'' in line:
        print(f"  {i+1}: {line.strip()}")
