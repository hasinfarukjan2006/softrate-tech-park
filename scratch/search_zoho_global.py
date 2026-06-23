import os

dirs = ["static", "templates"]
found_any = False
for d in dirs:
    for root, _, files in os.walk(d):
        for file in files:
            path = os.path.join(root, file)
            try:
                with open(path, "r", encoding="utf-8", errors="ignore") as f:
                    for i, line in enumerate(f):
                        if "zoho" in line.lower():
                            print(f"{path}:{i+1}: {line.strip()[:120]}")
                            found_any = True
            except Exception as e:
                pass
if not found_any:
    print("No 'zoho' matches found in static or templates.")
