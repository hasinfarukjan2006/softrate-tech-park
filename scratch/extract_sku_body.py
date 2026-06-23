with open("scratch/sku_full_live.html", "r", encoding="utf-8") as f:
    html = f.read()

hero_pos = html.find('Generate Product SKUs Instantly')
if hero_pos != -1:
    print("Hero title found at position:", hero_pos)
    print("Context around hero title:")
    # Print 2000 characters before and 2000 characters after
    print(html[max(0, hero_pos - 1000):hero_pos + 1500].encode('ascii', errors='replace').decode())
else:
    print("Hero title not found")
