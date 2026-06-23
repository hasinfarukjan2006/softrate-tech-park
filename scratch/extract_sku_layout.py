with open("scratch/sku_full_live.html", "r", encoding="utf-8") as f:
    html = f.read()

# Let's extract from position 68000 to 73577
body = html[68000:73577]
with open("scratch/sku_body_extracted.html", "w", encoding="utf-8") as f:
    f.write(body)

print("Saved extracted SKU body HTML (length:", len(body), "bytes)")
print("First 2000 chars:")
print(body[:2000].encode('ascii', errors='replace').decode())
