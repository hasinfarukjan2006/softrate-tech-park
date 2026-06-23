with open("scratch/po_body_extracted.html", "r", encoding="utf-8") as f:
    html = f.read()

# Let's check the first table block, which has address fields
# We can print the first 2500 characters
print(html[:2500])
