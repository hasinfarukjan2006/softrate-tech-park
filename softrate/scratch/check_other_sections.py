def check_other_sections():
    with open('templates/index.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    sections = ['receipts-section', 'forecaster-section']
    for sec in sections:
        idx = content.find(f'id="{sec}"')
        if idx != -1:
            print(f"--- {sec} ---")
            print(content[idx:idx+800])
        else:
            print(f"--- {sec} NOT FOUND ---")

if __name__ == '__main__':
    check_other_sections()
