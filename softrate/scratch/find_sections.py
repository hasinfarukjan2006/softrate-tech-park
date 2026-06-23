import os

files = ["dist/js/app.js", "softrate/static/js/app.js", "static/js/app.js"]

for f in files:
    if os.path.exists(f):
        with open(f, "r", encoding="utf-8") as file:
            content = file.read()
        found = "isPayslipRoute" in content
        print(f"File '{f}': isPayslipRoute found = {found}")
    else:
        print(f"File '{f}': does not exist")
