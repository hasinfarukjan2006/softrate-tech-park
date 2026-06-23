import os

def main():
    workspace_dir = r"c:\Users\dellc\OneDrive\Desktop\softrate\softrate"
    index_paths = [
        os.path.join(workspace_dir, "templates", "index.html"),
        os.path.join(r"c:\Users\dellc\OneDrive\Desktop\softrate", "templates", "index.html")
    ]

    llc_group_html = """              <!-- LLC Tax Classification (shown dynamically if LLC is selected) -->
              <div class="form-group-w9 hide" id="w9_llc_classification_group">
                <label for="w9_llc_class">LLC Tax Classification (C=C Corp, S=S Corp, P=Partnership)*</label>
                <select id="w9_llc_class" class="form-control-w9 dropdown-style-w9">
                  <option value="" disabled selected>Select LLC Classification</option>
                  <option value="C">C Corporation (C)</option>
                  <option value="S">S Corporation (S)</option>
                  <option value="P">Partnership (P)</option>
                </select>
                <small class="error-msg-w9 hide" id="w9_llc_class_err">Please select a tax classification for your LLC.</small>
              </div>"""

    target_select = '<select id="w9_business_type" class="form-control-w9 dropdown-style-w9">'
    replacement_select = '<select id="w9_business_type" class="form-control-w9 dropdown-style-w9" onchange="W9Controller.toggleLlcClassification()">'

    for index_path in index_paths:
        if not os.path.exists(index_path):
            continue
        print(f"Processing index.html: {index_path}...")
        with open(index_path, "r", encoding="utf-8") as f:
            content = f.read()

        if "w9_llc_classification_group" in content:
            print("LLC classification group already present!")
            continue

        # Add onchange event
        if target_select in content:
            content = content.replace(target_select, replacement_select)
        
        # Insert LLC group right after the closing div of the business type section
        business_type_block_end = """                </select>
              </div>"""
        
        target_pos = content.find(business_type_block_end)
        if target_pos != -1:
            insert_pos = target_pos + len(business_type_block_end)
            new_content = content[:insert_pos] + "\n\n" + llc_group_html + content[insert_pos:]
            with open(index_path, "w", encoding="utf-8") as f:
                f.write(new_content)
            print("Successfully inserted LLC classification field!")
        else:
            print("Could not find insertion position!")

if __name__ == "__main__":
    main()
