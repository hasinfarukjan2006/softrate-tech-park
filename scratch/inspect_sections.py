import re
import os

def main():
    if not os.path.exists('scratch/zoho_full_live.html'):
        print('zoho_full_live.html does not exist')
        return
        
    with open('scratch/zoho_full_live.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # Let's extract blocks starting around specific heading texts and up to the next sections or closing divs
    headings = [
        "What is wholesale price?",
        "How's wholesale price calculated?",
        "What's the difference?",
        "Streamline, simplify, and systemize"
    ]
    
    for heading in headings:
        pos = html.lower().find(heading.lower())
        if pos != -1:
            print('=' * 80)
            print(f'HEADING: {heading}')
            print('=' * 80)
            # Find matching context - print 1500 characters
            print(html[pos - 100:pos + 1800])
            print('\n\n')
        else:
            print(f'Could not find heading: {heading}')

if __name__ == '__main__':
    main()
