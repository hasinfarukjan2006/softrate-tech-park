import re

with open('templates/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

section = re.search(r'(<section id="purchase-order-section".*?</section>)', content, re.DOTALL)
if section:
    sec_html = section.group(1)
    tags = re.findall(r'(<(?:input|textarea|select|span class="amount)[^>]*>)', sec_html, re.IGNORECASE)
    for tag in tags:
        print(tag)
else:
    print("Purchase Order section not found!")
