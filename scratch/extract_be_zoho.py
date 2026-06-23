from bs4 import BeautifulSoup

html_path = r"c:\Users\dellc\OneDrive\Desktop\softrate\scratch\zoho_full_live.html"
with open(html_path, "r", encoding="utf-8", errors="ignore") as f:
    soup = BeautifulSoup(f.read(), "html.parser")

# Find elements containing "Fixed Cost" or related terms
elements = []
for label in soup.find_all(text=lambda t: t and ("fixed cost" in t.lower() or "selling price" in t.lower())):
    parent = label.parent
    # Go up a few levels to find the form/card container
    for _ in range(5):
        if parent:
            if parent not in elements:
                elements.append(parent)
            parent = parent.parent

print(f"Found {len(elements)} matching parent elements.")

# Let's search for divs with classes like "calculator", "card", etc.
# Or just search for the specific text "Break-even Point Calculator"
be_headers = soup.find_all(text=lambda t: t and "break-even" in t.lower())
print(f"Found {len(be_headers)} headers/elements matching 'break-even'.")

# Let's save the body or find a container that looks like the hero and calculator card
# Let's dump all sections or elements with class names containing "calculator" or "hero"
with open(r"c:\Users\dellc\OneDrive\Desktop\softrate\scratch\zoho_be_extracted.html", "w", encoding="utf-8") as out:
    for i, el in enumerate(elements[:10]):
        out.write(f"<!-- Match {i} -->\n")
        out.write(str(el))
        out.write("\n\n")

# Let's also look for any form tag or inputs with id
inputs = soup.find_all("input")
print("Inputs found:")
for inp in inputs:
    print(f"  Input: name={inp.get('name')}, id={inp.get('id')}, class={inp.get('class')}")
