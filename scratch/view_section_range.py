with open("templates/index.html", "r", encoding="utf-8") as f:
    lines = f.readlines()

found_start = -1
found_end = -1
for idx, line in enumerate(lines):
    if 'id="financial-report-section"' in line:
        found_start = idx
        print(f"Start found at line {idx+1}")
    elif found_start != -1 and '<section id=' in line:
        found_end = idx
        print(f"Next section starts at line {idx+1}")
        break

if found_start != -1:
    if found_end == -1:
        found_end = len(lines)
    print(f"Section range: {found_start+1} to {found_end+1}")
    section_lines = lines[found_start:found_end]
    with open("scratch/extracted_report_html.html", "w", encoding="utf-8") as out:
        out.writelines(section_lines)
    print("Successfully wrote range to scratch/extracted_report_html.html")
