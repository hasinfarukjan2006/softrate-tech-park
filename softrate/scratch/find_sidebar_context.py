import subprocess

def main():
    try:
        content = subprocess.check_output(['git', 'show', 'e2a4f86:templates/index.html']).decode('utf-8')
        # Find sidebar
        sb_start = content.find('<aside class="sidebar" id="sidebar">')
        sb_end = content.find('</aside>', sb_start) + len('</aside>')
        
        print("AFTER MAIN SIDEBAR:")
        print(content[sb_end:sb_end+200])
        
        pd_start = content.find('<aside class="sidebar hide" id="perDiemSidebar">')
        pd_end = content.find('</aside>', pd_start) + len('</aside>')
        print("AFTER PER DIEM SIDEBAR:")
        print(content[pd_end:pd_end+200])
        
    except Exception as e:
        print("Error occurred:", str(e))

if __name__ == '__main__':
    main()
