import os

def main():
    if not os.path.exists('static/js/app.js'):
        print('app.js not found')
        return
        
    with open('static/js/app.js', 'r', encoding='utf-8') as f:
        js = f.read()
        
    lines = js.splitlines()
    print('Total lines in app.js:', len(lines))
    
    # Search for wholesale in app.js
    for idx, line in enumerate(lines):
        if 'wholesale' in line.lower() or 'route' in line.lower() and ('active' in line.lower() or 'show' in line.lower()):
            if 'wholesale' in line.lower():
                print(f'Line {idx+1}: {line}')
                # print context
                start = max(0, idx - 5)
                end = min(len(lines), idx + 10)
                print('--- Context ---')
                for c_idx in range(start, end):
                    print(f'  {c_idx+1}: {lines[c_idx]}')
                print('---------------')

if __name__ == '__main__':
    main()
