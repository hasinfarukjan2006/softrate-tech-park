import os

def main():
    html_path = 'templates/index.html'
    orig_sb_path = 'scratch/original_sidebar.html'
    pd_sb_path = 'scratch/per_diem_sidebar.html'
    
    if not os.path.exists(html_path):
        print(f"Error: {html_path} does not exist!")
        return
    if not os.path.exists(orig_sb_path) or not os.path.exists(pd_sb_path):
        print("Error: scratch sidebar files do not exist! Run extract scripts first.")
        return
        
    with open(html_path, 'r', encoding='utf-8') as f:
        html_content = f.read()
        
    with open(orig_sb_path, 'r', encoding='utf-8') as f:
        orig_sb = f.read()
        
    with open(pd_sb_path, 'r', encoding='utf-8') as f:
        pd_sb = f.read()
        
    # Find markers
    marker_start = '<!-- Left Sidebar Navigation -->'
    marker_end = '<!-- Main Content Area -->'
    
    idx_start = html_content.find(marker_start)
    if idx_start == -1:
        print("Error: start marker not found!")
        return
        
    idx_end = html_content.find(marker_end)
    if idx_end == -1:
        print("Error: end marker not found!")
        return
        
    # We want to keep the start marker and end marker
    # The replacement content should go in between
    # Let's inspect the current content in between
    current_between = html_content[idx_start + len(marker_start):idx_end]
    print("--- CURRENT BETWEEN CONTENT PREVIEW ---")
    print(current_between[:200])
    print("...")
    print(current_between[-200:])
    print("---------------------------------------")
    
    # Construct new content:
    # 1. Main sidebar html
    # 2. Comment for per diem sidebar
    # 3. Per diem sidebar html
    new_between = "\n    " + orig_sb.strip() + "\n\n    <!-- Left Sidebar Navigation for Per Diem Calculator (PerDiemSidebar) -->\n    " + pd_sb.strip() + "\n\n    "
    
    updated_html = html_content[:idx_start + len(marker_start)] + new_between + html_content[idx_end:]
    
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(updated_html)
        
    print("Successfully replaced sidebar block in templates/index.html!")

if __name__ == '__main__':
    main()
