import subprocess

def main():
    try:
        content = subprocess.check_output(['git', 'show', 'e2a4f86:templates/index.html']).decode('utf-8')
        start = content.find('<aside class="sidebar"')
        if start == -1:
            print("Sidebar start not found!")
            return
        end = content.find('</aside>', start) + len('</aside>')
        sidebar_content = content[start:end]
        
        with open('scratch/original_sidebar.html', 'w', encoding='utf-8') as f:
            f.write(sidebar_content)
        print("Success! Original sidebar written to scratch/original_sidebar.html")
    except Exception as e:
        print("Error occurred:", str(e))

if __name__ == '__main__':
    main()
