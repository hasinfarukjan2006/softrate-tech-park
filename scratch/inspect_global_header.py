with open("templates/index.html", "r", encoding="utf-8") as f:
    html = f.read()

pos = html.find('<header')
if pos != -1:
    print("Found <header at position:", pos)
    chunk = html[pos:pos + 1200]
    print(chunk.encode('ascii', errors='replace').decode())
else:
    print("<header not found")
