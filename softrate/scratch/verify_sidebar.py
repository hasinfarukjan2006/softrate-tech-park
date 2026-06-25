import urllib.request

# Test that the app.js loads correctly
r = urllib.request.urlopen('http://127.0.0.1:5000/static/js/app.js')
print('app.js status:', r.status)
print('app.js size:', len(r.read()))

# Test index page
r2 = urllib.request.urlopen('http://127.0.0.1:5000/')
html = r2.read().decode('utf-8')
print('Index status:', r2.status)

# Check key elements
checks = [
    'billingToolsSidebar',
    'billing-tools-sidebar',
    'data-route="invoice"',
    'data-route="quote"',
    'data-route="receipts"',
    'data-route="forecaster"',
    'Billing Tools',
    'Billing Operations',
]
for check in checks:
    found = check in html
    print(f'  {check}: {"FOUND" if found else "MISSING"}')
