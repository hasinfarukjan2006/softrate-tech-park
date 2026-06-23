import os
import shutil

def sync_files():
    print("Starting synchronization...")
    
    # 1. Copy index.html to dist/index.html with modified paths
    with open("templates/index.html", "r", encoding="utf-8") as f:
        html = f.read()
    
    # Replace /static/ paths with root-relative paths
    html_dist = html.replace("/static/", "/")
    
    with open("dist/index.html", "w", encoding="utf-8") as f:
      f.write(html_dist)
    print("Synced templates/index.html -> dist/index.html (paths adjusted)")

    # 2. Copy signup.html to dist/signup.html with modified paths
    with open("templates/signup.html", "r", encoding="utf-8") as f:
        signup_html = f.read()
        
    signup_html_dist = signup_html.replace("/static/", "/")
    with open("dist/signup.html", "w", encoding="utf-8") as f:
        f.write(signup_html_dist)
    print("Synced templates/signup.html -> dist/signup.html (paths adjusted)")

    # 3. Copy css/js files to dist/
    os.makedirs("dist/css", exist_ok=True)
    os.makedirs("dist/js", exist_ok=True)
    os.makedirs("dist/images", exist_ok=True)
    
    shutil.copy2("static/css/style.css", "dist/css/style.css")
    shutil.copy2("static/css/wholesale.css", "dist/css/wholesale.css")
    shutil.copy2("static/css/shipping_label.css", "dist/css/shipping_label.css")
    shutil.copy2("static/css/barcode.css", "dist/css/barcode.css")
    shutil.copy2("static/css/packing_slip.css", "dist/css/packing_slip.css")
    shutil.copy2("static/css/inventory_turnover.css", "dist/css/inventory_turnover.css")
    shutil.copy2("static/css/break_even.css", "dist/css/break_even.css")
    shutil.copy2("static/css/eoq.css", "dist/css/eoq.css")
    shutil.copy2("static/css/reorder.css", "dist/css/reorder.css")
    shutil.copy2("static/css/purchase_order.css", "dist/css/purchase_order.css")
    shutil.copy2("static/css/sku.css", "dist/css/sku.css")
    shutil.copy2("static/css/hra.css", "dist/css/hra.css")
    shutil.copy2("static/css/bonus.css", "dist/css/bonus.css")
    shutil.copy2("static/css/gratuity.css", "dist/css/gratuity.css")
    shutil.copy2("static/css/eps.css", "dist/css/eps.css")
    shutil.copy2("static/css/nps.css", "dist/css/nps.css")
    shutil.copy2("static/css/payslip.css", "dist/css/payslip.css")
    shutil.copy2("static/css/w9.css", "dist/css/w9.css")
    shutil.copy2("static/css/project_estimate.css", "dist/css/project_estimate.css")
    shutil.copy2("static/css/financial_report.css", "dist/css/financial_report.css")
    shutil.copy2("static/js/app.js", "dist/js/app.js")
    shutil.copy2("static/js/expense.js", "dist/js/expense.js")
    shutil.copy2("static/js/per_diem.js", "dist/js/per_diem.js")
    shutil.copy2("static/js/wholesale_price.js", "dist/js/wholesale_price.js")
    shutil.copy2("static/js/shipping_label.js", "dist/js/shipping_label.js")
    shutil.copy2("static/js/barcode.js", "dist/js/barcode.js")
    shutil.copy2("static/js/packing_slip.js", "dist/js/packing_slip.js")
    shutil.copy2("static/js/inventory_turnover.js", "dist/js/inventory_turnover.js")
    shutil.copy2("static/js/break_even.js", "dist/js/break_even.js")
    shutil.copy2("static/js/eoq.js", "dist/js/eoq.js")
    shutil.copy2("static/js/reorder.js", "dist/js/reorder.js")
    shutil.copy2("static/js/purchase_order.js", "dist/js/purchase_order.js")
    shutil.copy2("static/js/sku.js", "dist/js/sku.js")
    shutil.copy2("static/js/hra.js", "dist/js/hra.js")
    shutil.copy2("static/js/bonus.js", "dist/js/bonus.js")
    shutil.copy2("static/js/gratuity.js", "dist/js/gratuity.js")
    shutil.copy2("static/js/eps.js", "dist/js/eps.js")
    shutil.copy2("static/js/nps.js", "dist/js/nps.js")
    shutil.copy2("static/js/payslip.js", "dist/js/payslip.js")
    shutil.copy2("static/js/w9.js", "dist/js/w9.js")
    shutil.copy2("static/js/project_estimate.js", "dist/js/project_estimate.js")
    shutil.copy2("static/js/financial_report.js", "dist/js/financial_report.js")
    print("Synced static files -> dist/")

    # 4. Copy images to dist/images/
    for item in os.listdir("static/images"):
        s = os.path.join("static/images", item)
        d = os.path.join("dist/images", item)
        if os.path.isfile(s):
            shutil.copy2(s, d)
    print("Synced static/images -> dist/images/")

    # 5. Copy templates/static files to softrate/
    os.makedirs("softrate/templates", exist_ok=True)
    os.makedirs("softrate/static/css", exist_ok=True)
    os.makedirs("softrate/static/js", exist_ok=True)
    os.makedirs("softrate/static/images", exist_ok=True)

    shutil.copy2("templates/index.html", "softrate/templates/index.html")
    shutil.copy2("templates/signup.html", "softrate/templates/signup.html")
    shutil.copy2("static/css/style.css", "softrate/static/css/style.css")
    shutil.copy2("static/css/wholesale.css", "softrate/static/css/wholesale.css")
    shutil.copy2("static/css/shipping_label.css", "softrate/static/css/shipping_label.css")
    shutil.copy2("static/css/barcode.css", "softrate/static/css/barcode.css")
    shutil.copy2("static/css/packing_slip.css", "softrate/static/css/packing_slip.css")
    shutil.copy2("static/css/inventory_turnover.css", "softrate/static/css/inventory_turnover.css")
    shutil.copy2("static/css/break_even.css", "softrate/static/css/break_even.css")
    shutil.copy2("static/css/eoq.css", "softrate/static/css/eoq.css")
    shutil.copy2("static/css/reorder.css", "softrate/static/css/reorder.css")
    shutil.copy2("static/css/purchase_order.css", "softrate/static/css/purchase_order.css")
    shutil.copy2("static/css/sku.css", "softrate/static/css/sku.css")
    shutil.copy2("static/css/hra.css", "softrate/static/css/hra.css")
    shutil.copy2("static/css/bonus.css", "softrate/static/css/bonus.css")
    shutil.copy2("static/css/gratuity.css", "softrate/static/css/gratuity.css")
    shutil.copy2("static/css/eps.css", "softrate/static/css/eps.css")
    shutil.copy2("static/css/nps.css", "softrate/static/css/nps.css")
    shutil.copy2("static/css/payslip.css", "softrate/static/css/payslip.css")
    shutil.copy2("static/css/w9.css", "softrate/static/css/w9.css")
    shutil.copy2("static/css/project_estimate.css", "softrate/static/css/project_estimate.css")
    shutil.copy2("static/css/financial_report.css", "softrate/static/css/financial_report.css")
    shutil.copy2("static/js/app.js", "softrate/static/js/app.js")
    shutil.copy2("static/js/expense.js", "softrate/static/js/expense.js")
    shutil.copy2("static/js/per_diem.js", "softrate/static/js/per_diem.js")
    shutil.copy2("static/js/wholesale_price.js", "softrate/static/js/wholesale_price.js")
    shutil.copy2("static/js/shipping_label.js", "softrate/static/js/shipping_label.js")
    shutil.copy2("static/js/barcode.js", "softrate/static/js/barcode.js")
    shutil.copy2("static/js/packing_slip.js", "softrate/static/js/packing_slip.js")
    shutil.copy2("static/js/inventory_turnover.js", "softrate/static/js/inventory_turnover.js")
    shutil.copy2("static/js/break_even.js", "softrate/static/js/break_even.js")
    shutil.copy2("static/js/eoq.js", "softrate/static/js/eoq.js")
    shutil.copy2("static/js/reorder.js", "softrate/static/js/reorder.js")
    shutil.copy2("static/js/purchase_order.js", "softrate/static/js/purchase_order.js")
    shutil.copy2("static/js/sku.js", "softrate/static/js/sku.js")
    shutil.copy2("static/js/hra.js", "softrate/static/js/hra.js")
    shutil.copy2("static/js/bonus.js", "softrate/static/js/bonus.js")
    shutil.copy2("static/js/gratuity.js", "softrate/static/js/gratuity.js")
    shutil.copy2("static/js/eps.js", "softrate/static/js/eps.js")
    shutil.copy2("static/js/nps.js", "softrate/static/js/nps.js")
    shutil.copy2("static/js/payslip.js", "softrate/static/js/payslip.js")
    shutil.copy2("static/js/w9.js", "softrate/static/js/w9.js")
    shutil.copy2("static/js/project_estimate.js", "softrate/static/js/project_estimate.js")
    shutil.copy2("static/js/financial_report.js", "softrate/static/js/financial_report.js")
    
    for item in os.listdir("static/images"):
        s = os.path.join("static/images", item)
        d = os.path.join("softrate/static/images", item)
        if os.path.isfile(s):
            shutil.copy2(s, d)
            
    shutil.copy2("app.py", "softrate/app.py")
    shutil.copy2("config.py", "softrate/config.py")
    shutil.copy2("database.py", "softrate/database.py")
    shutil.copy2("test_app.py", "softrate/test_app.py")
    print("Synced templates/static files -> softrate/")
    print("Sync complete!")

if __name__ == "__main__":
    sync_files()
