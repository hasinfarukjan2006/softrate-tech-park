with open("templates/index.html", "r", encoding="utf-8") as f:
    lines = f.readlines()

found_start = -1
found_end = -1
for idx, line in enumerate(lines):
    if "class=\"fr-income-statement-container" in line:
        found_start = idx
        break

if found_start != -1:
    print(f"fr-income-statement-container start: {found_start+1}")
    # Print the first 50 lines of this container
    for i in range(found_start, min(found_start + 50, len(lines))):
        print(f"{i+1}: {repr(lines[i])}")
else:
    print("Not found fr-income-statement-container!")
