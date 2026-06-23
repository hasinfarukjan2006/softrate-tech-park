with open("scratch/po_full_live.html", "r", encoding="utf-8") as f:
    html = f.read()

# Let's find where the body starts. It should be after toggleNavBar style or header
# The top navbar logo is: <div class="top-band-div align-items-center">...
# The main content row starts with: <div class="main-div row">
# Let's extract from <div class="main-div row"> up to <div class="mbl-po-link download-mobile-apps"> or the erp-promotion-banner

start_marker = '<div class="main-div row">'
end_marker = '<section class=erp-promotion-banner>'

# Since attributes may not have quotes:
start_pos = html.find(start_marker)
if start_pos == -1:
    start_marker = '<div class="main-div row">'
    # Let's search case insensitively or with different quotes
    for m in ['class="main-div row"', 'class=main-div row', 'class="main-div row"']:
        pos = html.find(m)
        if pos != -1:
            start_pos = pos - 5 # Approximate index for <div ...
            break

# If not found, let's look for <form name=poGenerator
if start_pos == -1:
    start_pos = html.find('<form name=poGenerator')

end_pos = html.find(end_marker)
if end_pos == -1:
    end_pos = html.find('class=faq-section')
    if end_pos == -1:
        end_pos = len(html)

if start_pos != -1:
    body = html[start_pos:end_pos]
    with open("scratch/po_body_extracted.html", "w", encoding="utf-8") as f:
        f.write(body)
    print("Extracted body length:", len(body))
    print("Saved to scratch/po_body_extracted.html")
else:
    print("Could not find start marker")
