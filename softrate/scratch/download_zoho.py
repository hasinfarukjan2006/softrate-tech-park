import urllib.request
import ssl

url = "https://www.zoho.com/in/payroll/free-payslip-generator/"
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
}

print("Fetching URL:", url)
req = urllib.request.Request(url, headers=headers)
context = ssl._create_unverified_context()

try:
    with urllib.request.urlopen(req, context=context) as response:
        html = response.read().decode('utf-8')
    print("Successfully downloaded. Length:", len(html))
    with open("scratch/zoho_full_live.html", "w", encoding="utf-8") as f:
        f.write(html)
    print("Saved to scratch/zoho_full_live.html")
except Exception as e:
    print("Error:", e)
