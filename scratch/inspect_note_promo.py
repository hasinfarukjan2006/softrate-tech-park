import re
import os

def main():
    if not os.path.exists('scratch/zoho_full_live.html'):
        print('zoho_full_live.html not found')
        return
        
    with open('scratch/zoho_full_live.html', 'r', encoding='utf-8') as f:
        html = f.read()
        
    # Search for the note section
    pos_note = html.find('The average retail price')
    if pos_note != -1:
        print('='*80)
        print('NOTE SECTION')
        print('='*80)
        print(html[pos_note - 200:pos_note + 1000])
        
    # Search for the promotion section
    pos_promo = html.find('promotion-heading')
    if pos_promo != -1:
        print('\n' + '='*80)
        print('PROMOTION SECTION')
        print('='*80)
        print(html[pos_promo - 300:pos_promo + 1500])

if __name__ == '__main__':
    main()
