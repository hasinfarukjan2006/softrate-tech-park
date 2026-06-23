with open("scratch/purchaseordergenerator.js", "r", encoding="utf-8") as f:
    content = f.read()

print("File length:", len(content))
lines = content.splitlines()
print("Number of lines:", len(lines))
if len(lines) > 0:
    print("First line length:", len(lines[0]))
    print("First 200 chars of line 1:", lines[0][:200])
