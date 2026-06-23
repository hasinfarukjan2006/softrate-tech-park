import re
import os

def main():
    if not os.path.exists('scratch/zoho_full_live.html'):
        print('zoho_full_live.html does not exist')
        return
        
    with open('scratch/zoho_full_live.html', 'r', encoding='utf-8') as f:
        html = f.read()
        
    print('HTML total length:', len(html))
    
    # Simple regex to extract headings
    headings = re.findall(r'<(h[1-4])[^>]*>(.*?)</\1>', html, re.DOTALL | re.IGNORECASE)
    print('\nFound Headings:')
    for tag, content in headings:
        clean_content = re.sub(r'<[^>]+>', '', content).strip()
        print(f'  {tag.upper()}: {clean_content}')
        
    # Let's search for some other keywords in a case-insensitive way
    keywords = ['wholesale', 'retail', 'formula', 'promote', 'margin', 'inventory']
    print('\nKeyword occurrences:')
    for kw in keywords:
        matches = list(re.finditer(kw, html, re.IGNORECASE))
        print(f'  "{kw}": {len(matches)} matches')
        if matches:
            # print first match context
            idx = matches[0].start()
            start = max(0, idx - 40)
            end = min(len(html), idx + 150)
            context = html[start:end].replace('\n', ' ')
            print(f'    First match context: ...{context}...')

if __name__ == '__main__':
    main()
