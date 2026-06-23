import os

scratch_dir = r"c:\Users\dellc\OneDrive\Desktop\softrate\scratch"
for name in os.listdir(scratch_dir):
    path = os.path.join(scratch_dir, name)
    if os.path.isfile(path) and name.endswith(".html") or name.endswith(".txt"):
        try:
            with open(path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
                if "break-even" in content.lower() or "fixed cost" in content.lower():
                    print(f"File {name}: len={len(content)}")
        except Exception as e:
            print(f"Error reading {name}: {e}")
