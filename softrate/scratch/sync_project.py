import shutil
import os

def main():
    # Base paths
    current_dir = r"c:\Users\dellc\OneDrive\Desktop\softrate\softrate"
    parent_dir = r"c:\Users\dellc\OneDrive\Desktop\softrate"

    print("Synchronizing source files from softrate/ to parent/ ...")

    # Files to sync:
    # 1. templates/index.html -> ../templates/index.html
    src_index = os.path.join(current_dir, "templates", "index.html")
    dest_index = os.path.join(parent_dir, "templates", "index.html")
    shutil.copy2(src_index, dest_index)
    print(f"Copied index.html to {dest_index}")

    # 2. static/js/app.js -> ../static/js/app.js
    src_app_js = os.path.join(current_dir, "static", "js", "app.js")
    dest_app_js = os.path.join(parent_dir, "static", "js", "app.js")
    shutil.copy2(src_app_js, dest_app_js)
    print(f"Copied app.js to {dest_app_js}")

    # 3. static/css/billing.css -> ../static/css/billing.css
    src_billing_css = os.path.join(current_dir, "static", "css", "billing.css")
    dest_billing_css = os.path.join(parent_dir, "static", "css", "billing.css")
    shutil.copy2(src_billing_css, dest_billing_css)
    print(f"Copied billing.css to {dest_billing_css}")

    # 4. static/js/uae_vat.js -> ../static/js/uae_vat.js
    src_uae_js = os.path.join(current_dir, "static", "js", "uae_vat.js")
    dest_uae_js = os.path.join(parent_dir, "static", "js", "uae_vat.js")
    shutil.copy2(src_uae_js, dest_uae_js)
    print(f"Copied uae_vat.js to {dest_uae_js}")

    # 5. static/js/uk_flat.js -> ../static/js/uk_flat.js
    src_uk_js = os.path.join(current_dir, "static", "js", "uk_flat.js")
    dest_uk_js = os.path.join(parent_dir, "static", "js", "uk_flat.js")
    shutil.copy2(src_uk_js, dest_uk_js)
    print(f"Copied uk_flat.js to {dest_uk_js}")

    # 5b. static/css/style.css -> ../static/css/style.css
    src_style_css = os.path.join(current_dir, "static", "css", "style.css")
    dest_style_css = os.path.join(parent_dir, "static", "css", "style.css")
    shutil.copy2(src_style_css, dest_style_css)
    print(f"Copied style.css to {dest_style_css}")

    # 5c. static/js/invoice.js -> ../static/js/invoice.js
    src_invoice_js = os.path.join(current_dir, "static", "js", "invoice.js")
    dest_invoice_js = os.path.join(parent_dir, "static", "js", "invoice.js")
    shutil.copy2(src_invoice_js, dest_invoice_js)
    print(f"Copied invoice.js to {dest_invoice_js}")

    print("\nSynchronizing and building parent/dist/ files ...")

    # 6. Build dist/index.html from softrate/templates/index.html (with path replacements: /static/ -> /)
    dist_index = os.path.join(parent_dir, "dist", "index.html")
    with open(src_index, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Replace static asset paths
    content_replaced = content.replace('"/static/css/', '"/css/')
    content_replaced = content_replaced.replace('"/static/js/', '"/js/')
    content_replaced = content_replaced.replace('"/static/images/', '"/images/')
    content_replaced = content_replaced.replace('src="/static/', 'src="/')
    content_replaced = content_replaced.replace('href="/static/', 'href="/')
    
    # Write to dist/index.html
    with open(dist_index, "w", encoding="utf-8") as f:
        f.write(content_replaced)
    print(f"Built dist/index.html -> {dist_index}")

    # 7. Copy static/js/app.js to dist/js/app.js
    dist_app_js = os.path.join(parent_dir, "dist", "js", "app.js")
    shutil.copy2(src_app_js, dist_app_js)
    print(f"Copied app.js to {dist_app_js}")

    # 8. Copy static/css/billing.css to dist/css/billing.css
    dist_billing_css = os.path.join(parent_dir, "dist", "css", "billing.css")
    shutil.copy2(src_billing_css, dist_billing_css)
    print(f"Copied billing.css to {dist_billing_css}")

    # 9. Copy static/js/uae_vat.js to dist/js/uae_vat.js
    dist_uae_js = os.path.join(parent_dir, "dist", "js", "uae_vat.js")
    shutil.copy2(src_uae_js, dist_uae_js)
    print(f"Copied uae_vat.js to {dist_uae_js}")

    # 10. Copy static/js/uk_flat.js to dist/js/uk_flat.js
    dist_uk_js = os.path.join(parent_dir, "dist", "js", "uk_flat.js")
    shutil.copy2(src_uk_js, dist_uk_js)
    print(f"Copied uk_flat.js to {dist_uk_js}")

    # 11. Copy static/css/style.css to dist/css/style.css
    dist_style_css = os.path.join(parent_dir, "dist", "css", "style.css")
    shutil.copy2(src_style_css, dist_style_css)
    print(f"Copied style.css to {dist_style_css}")

    # 12. Copy static/js/invoice.js to dist/js/invoice.js
    dist_invoice_js = os.path.join(parent_dir, "dist", "js", "invoice.js")
    shutil.copy2(src_invoice_js, dist_invoice_js)
    print(f"Copied invoice.js to {dist_invoice_js}")

    print("\nSynchronisation complete!")

if __name__ == "__main__":
    main()
