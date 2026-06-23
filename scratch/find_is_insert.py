with open("templates/index.html", "r", encoding="utf-8") as f:
    lines = f.readlines()

found_start = -1
found_end = -1
for idx, line in enumerate(lines):
    if "class=\"fr-balance-sheet-container" in line:
        found_start = idx
        print(f"fr-balance-sheet-container start: {idx+1}")
    elif found_start != -1 and "class=\"fr-main-container" in line:
        found_end = idx
        print(f"fr-main-container start: {idx+1}")
        break

if found_end != -1:
    for i in range(found_end - 10, found_end + 5):
        print(f"{i+1}: {repr(lines[i])}")
