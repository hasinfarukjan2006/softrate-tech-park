c = open('../dist/js/app.js','r',encoding='utf-8').read()
for r in ['hmrc-furlough','hmrc','project-cost','project-estimate','po','purchase-order','per-diem-calculator']:
    has = f'route === "{r}"' in c
    print(f"  {r}: {has}")

# Also check remaining "Coming Soon" routes with no HTML sections
html = open('../dist/index.html','r',encoding='utf-8').read()
print("\n=== Pages with NO HTML section (need to be CREATED) ===")
missing = ['invoice','quote','receipts','forecaster','uk-vat','uae-vat','uk-flat','uk-corp','mileage']
for r in missing:
    sid = r + "-section"
    print(f"  {r}: html_section={sid in html}")
