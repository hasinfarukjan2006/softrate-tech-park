# check_dist_sections.py
with open("dist/index.html", "r", encoding="utf-8") as f:
    c = f.read().splitlines()

print("dist/index.html section declarations:")
for i, line in enumerate(c):
    if '<section id="' in line:
        print(f"Line {i+1}: {line}")
