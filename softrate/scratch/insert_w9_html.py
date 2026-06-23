import os

def main():
    workspace_dir = r"c:\Users\dellc\OneDrive\Desktop\softrate\softrate"
    index_paths = [
        os.path.join(workspace_dir, "templates", "index.html"),
        os.path.join(r"c:\Users\dellc\OneDrive\Desktop\softrate", "templates", "index.html")
    ]
    w9_html_path = os.path.join(r"c:\Users\dellc\OneDrive\Desktop\softrate", "scratch", "w9_html.html")

    print(f"Reading w9_html.html from {w9_html_path}...")
    with open(w9_html_path, "r", encoding="utf-8") as f:
        w9_html = f.read()

    for index_path in index_paths:
        print(f"Processing index.html: {index_path}...")
        with open(index_path, "r", encoding="utf-8") as f:
            index_content = f.read()

        # Check if w9-section is already there
        if "w9-section" in index_content:
            print(f"w9-section is already present in {index_path}!")
            continue

        lines = index_content.splitlines()
        payslip_start_idx = -1
        for i, line in enumerate(lines):
            if 'id="payslip-section"' in line or "id='payslip-section'" in line:
                payslip_start_idx = i
                break

        if payslip_start_idx == -1:
            print(f"Could not find payslip-section in {index_path}!")
            continue

        # Trace matching closing </section>
        section_depth = 0
        payslip_end_idx = -1
        for i in range(payslip_start_idx, len(lines)):
            line = lines[i]
            if '<section' in line:
                section_depth += 1
            if '</section>' in line:
                section_depth -= 1
                if section_depth == 0:
                    payslip_end_idx = i
                    break

        if payslip_end_idx == -1:
            print(f"Could not find matching </section> for payslip-section in {index_path}!")
            continue

        # Insert W-9 section after the payslip section
        new_lines = lines[:payslip_end_idx + 1] + ["", ""] + w9_html.splitlines() + lines[payslip_end_idx + 1:]
        
        with open(index_path, "w", encoding="utf-8") as f:
            f.write("\n".join(new_lines))

        print(f"Successfully injected w9-section into {index_path}!")

if __name__ == "__main__":
    main()
