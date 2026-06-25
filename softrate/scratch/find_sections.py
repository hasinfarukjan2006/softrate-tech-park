def find_markers():
    with open('templates/index.html', 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    for i, line in enumerate(lines):
        if 'id="quote-section"' in line:
            print(f"quote-section starts at line {i+1}: {line.strip()}")
        if 'id="invoice-section"' in line:
            print(f"invoice-section starts at line {i+1}: {line.strip()}")

if __name__ == '__main__':
    find_markers()
