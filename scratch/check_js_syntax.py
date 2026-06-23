with open("static/js/financial_report.js", "r", encoding="utf-8") as f:
    js = f.read()

# Let's count open/close braces
open_braces = js.count("{")
close_braces = js.count("}")
print(f"Open braces: {open_braces}, Close braces: {close_braces}")

# Let's try parsing basic structure
# A simple check for commas between functions in the object
# We can look for syntax errors by compiling JS using node if installed
import subprocess
try:
    res = subprocess.run(["node", "-c", "static/js/financial_report.js"], capture_output=True, text=True)
    if res.returncode == 0:
        print("Node validation: JS syntax is valid!")
    else:
        print("Node validation failed:")
        print(res.stderr)
except FileNotFoundError:
    print("Node not found, skipping node check.")
