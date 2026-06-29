import shutil
import os

def sync_dir(src, dest):
    if not os.path.exists(src):
        print(f"Source dir {src} does not exist, skipping.")
        return
    os.makedirs(dest, exist_ok=True)
    for item in os.listdir(src):
        src_item = os.path.join(src, item)
        dest_item = os.path.join(dest, item)
        if os.path.isdir(src_item):
            sync_dir(src_item, dest_item)
        else:
            shutil.copy2(src_item, dest_item)
    print(f"Synced files in {src} -> {dest}")

def main():
    # Base paths
    current_dir = r"c:\Users\dellc\OneDrive\Desktop\softrate\softrate"
    parent_dir = r"c:\Users\dellc\OneDrive\Desktop\softrate"

    print("Synchronizing project directories from softrate/ to parent/ ...")

    # 1. Sync templates/index.html
    src_index = os.path.join(current_dir, "templates", "index.html")
    dest_index = os.path.join(parent_dir, "templates", "index.html")
    os.makedirs(os.path.dirname(dest_index), exist_ok=True)
    shutil.copy(src_index, dest_index)
    print(f"Copied index.html to {dest_index}")

    # 2. Sync templates/signup.html
    src_signup = os.path.join(current_dir, "templates", "signup.html")
    dest_signup = os.path.join(parent_dir, "templates", "signup.html")
    shutil.copy(src_signup, dest_signup)
    print(f"Copied signup.html to {dest_signup}")

    # 3. Sync static directories to parent
    sync_dir(os.path.join(current_dir, "static", "css"), os.path.join(parent_dir, "static", "css"))
    sync_dir(os.path.join(current_dir, "static", "js"), os.path.join(parent_dir, "static", "js"))
    sync_dir(os.path.join(current_dir, "static", "images"), os.path.join(parent_dir, "static", "images"))

    # 4. Sync app.py
    src_app_py = os.path.join(current_dir, "app.py")
    dest_app_py = os.path.join(parent_dir, "app.py")
    shutil.copy(src_app_py, dest_app_py)
    print(f"Copied app.py to {dest_app_py}")

    print("\nBuilding parent/dist/ files ...")

    # 5. Build dist/index.html with path replacements
    dist_index = os.path.join(parent_dir, "dist", "index.html")
    os.makedirs(os.path.dirname(dist_index), exist_ok=True)
    with open(src_index, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Replace static asset paths
    content_replaced = content.replace('"/static/css/', '"/css/')
    content_replaced = content_replaced.replace('"/static/js/', '"/js/')
    content_replaced = content_replaced.replace('"/static/images/', '"/images/')
    content_replaced = content_replaced.replace('src="/static/', 'src="/')
    content_replaced = content_replaced.replace('href="/static/', 'href="/')
    
    with open(dist_index, "w", encoding="utf-8") as f:
        f.write(content_replaced)
    print(f"Built dist/index.html -> {dist_index}")

    # 6. Copy templates/signup.html to dist/signup.html (as netlify serves signup.html directly)
    dist_signup = os.path.join(parent_dir, "dist", "signup.html")
    shutil.copy(src_signup, dist_signup)
    print(f"Copied dist/signup.html -> {dist_signup}")

    # 7. Sync static directories to dist
    sync_dir(os.path.join(current_dir, "static", "css"), os.path.join(parent_dir, "dist", "css"))
    sync_dir(os.path.join(current_dir, "static", "js"), os.path.join(parent_dir, "dist", "js"))
    sync_dir(os.path.join(current_dir, "static", "images"), os.path.join(parent_dir, "dist", "images"))

    # 8. Export sitemap.xml and robots.txt statically for Netlify
    print("\nExporting static sitemap.xml and robots.txt for Netlify...")
    import urllib.request
    try:
        # Fetch sitemap.xml
        with urllib.request.urlopen("http://127.0.0.1:5000/sitemap.xml", timeout=5) as response:
            sitemap_content = response.read().decode('utf-8')
        
        # Save to dist/sitemap.xml
        dist_sitemap = os.path.join(parent_dir, "dist", "sitemap.xml")
        with open(dist_sitemap, "w", encoding="utf-8") as f:
            f.write(sitemap_content)
        print(f"Exported static sitemap.xml -> {dist_sitemap}")
        
        # Fetch robots.txt
        with urllib.request.urlopen("http://127.0.0.1:5000/robots.txt", timeout=5) as response:
            robots_content = response.read().decode('utf-8')
            
        # Save to dist/robots.txt
        dist_robots = os.path.join(parent_dir, "dist", "robots.txt")
        with open(dist_robots, "w", encoding="utf-8") as f:
            f.write(robots_content)
        print(f"Exported static robots.txt -> {dist_robots}")
    except Exception as e:
        print(f"Failed to fetch dynamic sitemap/robots from local Flask app: {e}")
        print("Falling back to writing standard robots.txt.")
        # Fallback robots.txt
        dist_robots = os.path.join(parent_dir, "dist", "robots.txt")
        with open(dist_robots, "w", encoding="utf-8") as f:
            f.write("User-agent: *\nAllow: /\nSitemap: https://softrate-tech-park.netlify.app/sitemap.xml")

    print("\nSynchronisation complete!")

if __name__ == "__main__":
    main()
