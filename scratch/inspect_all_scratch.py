import os

scratch_dir = r"c:\Users\dellc\OneDrive\Desktop\softrate\scratch"
for name in os.listdir(scratch_dir):
    path = os.path.join(scratch_dir, name)
    if os.path.isfile(path) and name.endswith(".html"):
        try:
            with open(path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
                terms = ["selling price", "variable cost", "fixed cost"]
                found = [t for t in terms if t in content.lower()]
                if found:
                    print(f"File {name}: found terms {found}")
        except Exception as e:
            print(f"Error reading {name}: {e}")
