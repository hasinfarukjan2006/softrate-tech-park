import urllib.request
import os

def main():
    url = 'https://www.zoho.com/in/inventory/free-wholesale-price-calculator/'
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as response:
            html = response.read().decode('utf-8')
        print('Downloaded HTML length:', len(html))
        
        # Check for various sections
        for q in ['Wholesale Price vs Retail Price', 'Promote your inventory', 'What is wholesale price', 'Formula']:
            pos = html.lower().find(q.lower())
            print(f'Search term "{q}": {"FOUND at " + str(pos) if pos != -1 else "NOT FOUND"}')
            if pos != -1:
                # Print a small excerpt
                print(f'  Excerpt: {html[pos:pos+300]}...\n')
                
        # Write to file
        os.makedirs('scratch', exist_ok=True)
        with open('scratch/zoho_full_live.html', 'w', encoding='utf-8') as f:
            f.write(html)
        print('Successfully wrote HTML to scratch/zoho_full_live.html')
    except Exception as e:
        print('Error:', e)

if __name__ == '__main__':
    main()
