with open("templates/index.html", "r", encoding="utf-8") as f:
    html = f.read()

# Let's replace the links inside templates/index.html
# 1. Powered by logo link
html = html.replace(
    'href="/inventory/?utm_source=purchase%20order&utm_campaign=purchase%20order%20generator&utm_medium=landing%20page&utm_term=po%20generator"',
    'href="/"'
)

# 2. Try Softrate For Free buttons
html = html.replace(
    'href="/inventory/signup/?utm_source=po_generator&utm_medium=backlink&utm_campaign=free_tools"',
    'href="/signup"'
)

# 3. Mobile banner main link
html = html.replace(
    'href="/inventory/?utm_source=po_generator&utm_medium=backlink&utm_campaign=free_tools"',
    'href="/"'
)

# 4. Contact support link
html = html.replace(
    'href="/in/inventory/contact-support/"',
    'href="#contact-section"'
)

with open("templates/index.html", "w", encoding="utf-8") as f:
    f.write(html)

print("Successfully replaced links in templates/index.html!")
