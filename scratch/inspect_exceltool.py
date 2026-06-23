with open("scratch/sku_full_live.html", "r", encoding="utf-8") as f:
    html = f.read()

# Print from 70100 to 73600
chunk = html[70100:73600]
with open("scratch/sku_exceltool_chunk.html", "w", encoding="utf-8") as f:
    f.write(chunk)

print("Saved exceltool section chunk (length:", len(chunk), "bytes)")
print("First 1500 chars of chunk:")
print(chunk[:1500].encode('ascii', errors='replace').decode())
