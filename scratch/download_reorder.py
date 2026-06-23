import urllib.request
import os

def main():
    url = 'https://www.zoho.com/in/inventory/reorder-point-calculator/'
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'}
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as response:
            html = response.read().decode('utf-8')
        print('Downloaded HTML length:', len(html))
        
        # Write to file
        os.makedirs('scratch', exist_ok=True)
        with open('scratch/reorder_full_live.html', 'w', encoding='utf-8') as f:
            f.write(html)
        print('Successfully wrote HTML to scratch/reorder_full_live.html')
    except Exception as e:
        print('Error:', e)

if __name__ == '__main__':
    main()
