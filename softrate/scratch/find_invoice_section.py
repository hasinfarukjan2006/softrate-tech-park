with open('templates/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

idx = content.find('id="invoice-section"')
if idx != -1:
    print(content[idx:idx+1500].encode('ascii', errors='replace').decode('ascii'))
else:
    print("Not found")
