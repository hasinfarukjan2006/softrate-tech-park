import re

def process_html():
    with open("scratch/po_body_extracted.html", "r", encoding="utf-8") as f:
        html = f.read()

    # Replace Zoho/zoho with Softrate/softrate
    html = re.sub(r'Try Zoho Inventory For Free', 'Try Softrate For Free', html)
    html = re.sub(r'Check out Zoho Inventory', 'Check out Softrate', html)
    html = re.sub(r'Zoho Inventory App', 'Softrate App', html)
    html = re.sub(r'Zoho Inventory', 'Softrate', html)
    html = re.sub(r'Zoho', 'Softrate', html)
    html = re.sub(r'zoho', 'softrate', html)
    
    # Replace logo image in powered-by section
    # <span class=powered-by-logo><img src=/inventory/images/inventory-logo-new.svg style=width:122px alt="Zoho Inventory App"></span>
    html = re.sub(
        r'<img\s+src=/inventory/images/inventory-logo-new\.svg\s+style=width:122px\s+alt="Softrate App">', 
        '<img src="/static/images/logo.png" style="width:120px;" alt="Softrate App">', 
        html
    )

    # Let's adjust input fields in Company Info:
    # We want to add company phone and email.
    # The Country input block:
    # <input type=text class=adr tabindex=4 id=address4 placeholder=Country onfocus='PurchaseOrderGenerator.strikeInfo("compAddInfo",!0)' onblur='PurchaseOrderGenerator.strikeInfo("compAddInfo",!1)' name=company_country data-json-node=company_country data-is-array=false><br>
    
    country_pattern = r'(<input\s+type=text\s+class=adr\s+tabindex=4\s+id=address4\s+placeholder=Country\s+onfocus=\'PurchaseOrderGenerator\.strikeInfo\("compAddInfo",!0\)\'\s+onblur=\'PurchaseOrderGenerator\.strikeInfo\("compAddInfo",!1\)\'\s+name=company_country\s+data-json-node=company_country\s+data-is-array=false><br>)'
    
    phone_email_html = r'\1<input type=text class=adr tabindex=4 id=compPhone placeholder="Phone Number" onfocus=\'PurchaseOrderGenerator.strikeInfo("compAddInfo",!0)\' onblur=\'PurchaseOrderGenerator.strikeInfo("compAddInfo",!1)\' name=company_phone data-json-node=company_phone data-is-array=false><br><input type=text class=adr tabindex=4 id=compEmail placeholder="Email" onfocus=\'PurchaseOrderGenerator.strikeInfo("compAddInfo",!0)\' onblur=\'PurchaseOrderGenerator.strikeInfo("compAddInfo",!1)\' name=company_email data-json-node=company_email data-is-array=false><br>'
    
    html = re.sub(country_pattern, phone_email_html, html)

    # Let's adjust Vendor Info:
    # We want to split Your Vendor's Company into Vendor Name and Vendor Company.
    # Zoho vendor company input:
    # <input type=text id=billingAddress1 class=adr tabindex=6 placeholder="Your Vendor’s Company" onfocus='PurchaseOrderGenerator.strikeInfo("clientAddInfo",!0),PurchaseOrderGenerator.showHideErr("billingAddress1",!1)' onblur='PurchaseOrderGenerator.strikeInfo("clientAddInfo",!1)' name=vendor_name data-json-node=vendor_name data-is-array=false>
    # <small id=billingAddress1_err class="text-danger hide">Please fill in your vendor's name or their company name</small><br>
    
    vendor_pattern = r'(<input\s+type=text\s+id=billingAddress1\s+class=adr\s+tabindex=6\s+placeholder="Your Vendor’s Company"\s+onfocus=\'PurchaseOrderGenerator\.strikeInfo\("clientAddInfo",!0\),PurchaseOrderGenerator\.showHideErr\("billingAddress1",!1\)\'\s+onblur=\'PurchaseOrderGenerator\.strikeInfo\("clientAddInfo",!1\)\'\s+name=vendor_name\s+data-json-node=vendor_name\s+data-is-array=false>.*?<small\s+id=billingAddress1_err\s+class="text-danger\s+hide">Please fill in your vendor\'s name or their company name</small><br>)'
    
    # We replace it with Vendor Name and Vendor Company
    vendor_replacement = (
        '<input type=text id=billingAddress1 class=adr tabindex=6 placeholder="Vendor Name" '
        'onfocus=\'PurchaseOrderGenerator.strikeInfo("clientAddInfo",!0),PurchaseOrderGenerator.showHideErr("billingAddress1",!1)\' '
        'onblur=\'PurchaseOrderGenerator.strikeInfo("clientAddInfo",!1)\' name=vendor_name data-json-node=vendor_name data-is-array=false>\n'
        '<small id=billingAddress1_err class="text-danger hide">Please fill in your vendor\'s name</small><br>\n'
        '<input type=text id=vendorCompany class=adr tabindex=6 placeholder="Vendor Company" '
        'onfocus=\'PurchaseOrderGenerator.strikeInfo("clientAddInfo",!0)\' '
        'onblur=\'PurchaseOrderGenerator.strikeInfo("clientAddInfo",!1)\' name=vendor_company data-json-node=vendor_company data-is-array=false><br>'
    )
    
    html = re.sub(vendor_pattern, vendor_replacement, html, flags=re.DOTALL)

    # Let's verify and write out the final HTML block
    # We will wrap it in a proper <section id="purchase-order-section" class="content-section mt-8 hide">
    final_html = f"""<!-- Section: Free Purchase Order Generator -->
<section id="purchase-order-section" class="content-section mt-8 hide">
  {html}
</section>
"""
    with open("scratch/po_html_final.html", "w", encoding="utf-8") as f:
        f.write(final_html)
        
    print("Processed HTML successfully!")

if __name__ == "__main__":
    process_html()
