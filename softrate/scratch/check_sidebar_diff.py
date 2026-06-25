import subprocess

def main():
    try:
        # Get current templates/index.html
        with open('templates/index.html', 'r', encoding='utf-8') as f:
            current_content = f.read()
            
        # Get original templates/index.html from e2a4f86
        orig_content = subprocess.check_output(['git', 'show', 'e2a4f86:templates/index.html']).decode('utf-8')
        
        # Locate sidebar tags in current content
        curr_start = current_content.find('<aside class="sidebar" id="sidebar">')
        curr_end = current_content.find('</aside>', current_content.find('id="perDiemSidebar"')) + len('</aside>')
        
        # Locate sidebar tags in original content
        orig_start = orig_content.find('<aside class="sidebar" id="sidebar">')
        orig_end = orig_content.find('</aside>', orig_content.find('id="perDiemSidebar"')) + len('</aside>')
        
        curr_sidebar = current_content[curr_start:curr_end].strip()
        orig_sidebar = orig_content[orig_start:orig_end].strip()
        
        if curr_sidebar == orig_sidebar:
            print("Verify Success: The sidebar block in templates/index.html matches commit e2a4f86 exactly!")
        else:
            print("Verify Warning: Differences found between current and original sidebar block.")
            # Print length differences or lines
            print(f"Current length: {len(curr_sidebar)}, Original length: {len(orig_sidebar)}")
            
            # Let's save both to compare
            with open('scratch/temp_curr.html', 'w', encoding='utf-8') as f:
                f.write(curr_sidebar)
            with open('scratch/temp_orig.html', 'w', encoding='utf-8') as f:
                f.write(orig_sidebar)
            print("Wrote sidebars to scratch/temp_curr.html and scratch/temp_orig.html for comparison.")
    except Exception as e:
        print("Error during verification:", str(e))

if __name__ == '__main__':
    main()
