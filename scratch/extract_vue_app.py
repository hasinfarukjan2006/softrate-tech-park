with open("scratch/skugenerator.js", "r", encoding="utf-8") as f:
    content = f.read()

vue_app = content[169000:]
with open("scratch/sku_vue_extracted.js", "w", encoding="utf-8") as f:
    f.write(vue_app)

print("Saved Vue app block (length:", len(vue_app), "bytes)")
print("First 2000 characters of Vue app block:")
print(vue_app[:2000].encode('ascii', errors='replace').decode())
