def check_dist():
    with open('../dist/index.html', 'r', encoding='utf-8') as f:
        content = f.read()
    idx = content.find('What is a Receipt?')
    if idx == -1:
        print("What is a Receipt? not found in dist/index.html!")
        return
    print(content[idx-100:idx+2500])

if __name__ == '__main__':
    check_dist()
