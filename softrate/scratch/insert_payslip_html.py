import os

html_path = "templates/index.html"
payslip_html_path = "scratch/payslip_html.html"

print("Reading index.html...")
with open(html_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

print("Reading payslip_html.html...")
with open(payslip_html_path, "r", encoding="utf-8") as f:
    payslip_html = f.read()

new_lines = []
css_inserted = False
js_inserted = False
section_inserted = False

# We will scan line-by-line
for idx, line in enumerate(lines):
    new_lines.append(line)
    
    # 1. Insert CSS link
    if 'href="/static/css/nps.css"' in line and not css_inserted:
        indent = line[:line.find('<')]
        new_lines.append(indent + '<link rel="stylesheet" href="/static/css/payslip.css">\n')
        css_inserted = True
        print(f"CSS link injected after line {idx+1}")
        
    # 2. Insert JS script
    if 'src="/static/js/nps.js"' in line and not js_inserted:
        indent = line[:line.find('<')]
        new_lines.append(indent + '<script src="/static/js/payslip.js"></script>\n')
        js_inserted = True
        print(f"JS script injected after line {idx+1}")

    # 3. Insert Section HTML at line 4338 (0-indexed line 4337)
    if idx == 4337 and not section_inserted:
        new_lines.append("\n" + payslip_html + "\n")
        section_inserted = True
        print(f"Payslip section HTML injected after line {idx+1}")

print("Writing back to index.html...")
with open(html_path, "w", encoding="utf-8") as f:
    f.writelines(new_lines)

print("Insertion complete successfully!")
