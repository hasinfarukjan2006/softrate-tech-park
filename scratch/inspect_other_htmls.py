import os

scratch_dir = r"c:\Users\dellc\OneDrive\Desktop\softrate\scratch"
terms = ["demand", "holding", "ordering", "eoq", "square root"]

for name in os.listdir(scratch_dir):
    path = os.path.join(scratch_dir, name)
    if os.path.isfile(path):
        try:
            with open(path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read().lower()
                found = [t for t in terms if t in content]
                if found:
                    print(f"File {name}: found terms {found}")
        except Exception as e:
            pass
