import os
import shutil

def sync_files():
    print("Starting synchronization...")
    
    # 1. Copy index.html to dist/index.html with modified paths
    with open("templates/index.html", "r", encoding="utf-8") as f:
        html = f.read()
    
    # Replace /static/ paths with relative paths
    html_dist = html.replace("/static/", "")
    
    with open("dist/index.html", "w", encoding="utf-8") as f:
        f.write(html_dist)
    print("Synced templates/index.html -> dist/index.html (paths adjusted)")

    # 2. Copy signup.html to dist/signup.html with modified paths
    with open("templates/signup.html", "r", encoding="utf-8") as f:
        signup_html = f.read()
        
    signup_html_dist = signup_html.replace("/static/", "")
    with open("dist/signup.html", "w", encoding="utf-8") as f:
        f.write(signup_html_dist)
    print("Synced templates/signup.html -> dist/signup.html (paths adjusted)")

    # 3. Copy css/js files to dist/
    os.makedirs("dist/css", exist_ok=True)
    os.makedirs("dist/js", exist_ok=True)
    os.makedirs("dist/images", exist_ok=True)
    
    shutil.copy2("static/css/style.css", "dist/css/style.css")
    shutil.copy2("static/js/app.js", "dist/js/app.js")
    shutil.copy2("static/js/expense.js", "dist/js/expense.js")
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
    shutil.copy2("static/js/app.js", "softrate/static/js/app.js")
    shutil.copy2("static/js/expense.js", "softrate/static/js/expense.js")
    
    for item in os.listdir("static/images"):
        s = os.path.join("static/images", item)
        d = os.path.join("softrate/static/images", item)
        if os.path.isfile(s):
            shutil.copy2(s, d)
            
    print("Synced templates/static files -> softrate/")
    print("Sync complete!")

if __name__ == "__main__":
    sync_files()
