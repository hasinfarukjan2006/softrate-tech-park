import re

def inspect():
    with open("templates/index.html", "r", encoding="utf-8") as f:
        html = f.read()
    
    # Find all sections/main elements with IDs
    elements_with_id = re.findall(r'<(section|div|main)\s+[^>]*id=["\']([^"\']+)["\']', html)
    print("Found element IDs:")
    for tag, elem_id in elements_with_id:
        if "generator" in elem_id.lower() or "calculator" in elem_id.lower() or "section" in elem_id.lower() or "page" in elem_id.lower():
            print(f"  <{tag} id=\"{elem_id}\">")

    # Let's check for links in the navbar/menu to other calculators
    print("\nNavbar Links:")
    links = re.findall(r'<a\s+[^>]*href=["\']([^"\']+)["\']', html)
    for link in set(links):
        if "/" in link or "calculator" in link or "generator" in link:
            print(f"  {link}")

if __name__ == "__main__":
    inspect()
