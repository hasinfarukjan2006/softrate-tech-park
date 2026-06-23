with open("templates/index.html", "r", encoding="utf-8") as f:
    html = f.read()

for lib in ["html2canvas", "jspdf", "pdf"]:
    print(f"Occurrences of {lib} in index.html:")
    for i, line in enumerate(html.splitlines()):
        if lib in line:
            print(f"  {i+1}: {line.strip()}")
