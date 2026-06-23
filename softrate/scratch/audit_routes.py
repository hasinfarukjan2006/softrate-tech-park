import re
html = open('../dist/index.html','r',encoding='utf-8').read()
appjs = open('../dist/js/app.js','r',encoding='utf-8').read()

routes = re.findall(r'data-route="([^"]+)"', html)
unique = list(dict.fromkeys(routes))

print("=== SIDEBAR ROUTE AUDIT ===\n")
handled = []
coming_soon = []
for r in unique:
    section_id = r + "-section"
    is_handled = section_id in appjs or section_id in html
    if r in ["gst", "expense"]:
        is_handled = True
    status = "OK" if is_handled else "COMING SOON"
    print(f"  [{status:11s}] {r}")
    if is_handled:
        handled.append(r)
    else:
        coming_soon.append(r)

print(f"\n  Handled: {len(handled)}")
print(f"  Coming Soon: {len(coming_soon)}")
print(f"\n=== COMING SOON LIST ===")
for r in coming_soon:
    print(f"  - {r}")
