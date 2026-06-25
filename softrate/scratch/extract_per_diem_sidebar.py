import subprocess

def main():
    try:
        content = subprocess.check_output(['git', 'show', 'e2a4f86:templates/index.html']).decode('utf-8')
        start = content.find('id="perDiemSidebar"')
        if start == -1:
            print("perDiemSidebar not found by ID!")
            # Try searching with class or tag
            start = content.find('perDiemSidebar')
            if start == -1:
                return
        
        # Let's find the outer element starting from the '<' before `id="perDiemSidebar"` or similar
        # Since it's probably <aside id="perDiemSidebar" ...> or <div id="perDiemSidebar" ...>
        # Let's find the opening '<' before 'id="perDiemSidebar"'
        tag_start = content.rfind('<', 0, start)
        # Find closing tag matching this tag
        tag_name = content[tag_start+1:content.find(' ', tag_start)]
        print(f"Tag name: {tag_name}")
        
        # Simple tag matching
        depth = 0
        pos = tag_start
        while pos < len(content):
            if content.startswith(f'<{tag_name}', pos):
                depth += 1
                pos += len(tag_name) + 1
            elif content.startswith(f'</{tag_name}>', pos):
                depth -= 1
                pos += len(tag_name) + 3
                if depth == 0:
                    end = pos
                    break
            else:
                pos += 1
        
        sidebar_content = content[tag_start:end]
        with open('scratch/per_diem_sidebar.html', 'w', encoding='utf-8') as f:
            f.write(sidebar_content)
        print("Success! perDiemSidebar written to scratch/per_diem_sidebar.html")
    except Exception as e:
        print("Error occurred:", str(e))

if __name__ == '__main__':
    main()
