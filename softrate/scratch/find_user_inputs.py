def list_sections():
    with open('templates/index.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    import re
    sections = re.findall(r'<section\s+id="[^"]+"\s+class="[^"]+"', content)
    for sec in sections[:15]:
        print(sec)

if __name__ == '__main__':
    list_sections()
