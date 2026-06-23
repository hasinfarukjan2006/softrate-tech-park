with open("templates/index.html", "r", encoding="utf-8") as f:
    html = f.read()

pos = html.find('<section id="coming-soon-section"')
if pos != -1:
    print("Found coming-soon-section at position:", pos)
    print(html[pos - 500:pos + 500])
else:
    print("coming-soon-section not found")
