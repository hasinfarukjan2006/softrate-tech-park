def count_divs():
    with open('templates/index.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We can use a simple state machine or parser to count divs
    import re
    # Remove comments
    content_clean = re.sub(r'<!--.*?-->', '', content, flags=re.DOTALL)
    
    opens = len(re.findall(r'<div\b', content_clean))
    closes = len(re.findall(r'</div\b', content_clean))
    print(f"Total <div tags: {opens}")
    print(f"Total </div tags: {closes}")
    print(f"Difference: {opens - closes}")

if __name__ == '__main__':
    count_divs()
