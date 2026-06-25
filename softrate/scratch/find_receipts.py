def find_receipts_section():
    with open('templates/index.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    start_idx = content.find('id="receipts-section"')
    if start_idx == -1:
        print("receipts-section not found!")
        return
        
    # Find next section tag or closing section tag to locate the end
    # Let's search for next <section tag
    next_sec = content.find('<section', start_idx + 1)
    
    # Let's count line numbers
    lines = content.splitlines()
    start_line = 0
    end_line = 0
    char_count = 0
    for i, line in enumerate(lines):
        char_count += len(line) + 1
        if char_count > start_idx and start_line == 0:
            start_line = i + 1
        if char_count > next_sec and end_line == 0:
            end_line = i + 1
            break
            
    print(f"receipts-section starts at line {start_line} and goes up to next section at line {end_line}")

if __name__ == '__main__':
    find_receipts_section()
