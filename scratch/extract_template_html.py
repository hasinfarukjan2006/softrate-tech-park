with open("scratch/sku_vue_extracted.js", "r", encoding="utf-8") as f:
    js = f.read()

# Let's extract the template string. It is inside template:'...'
import re
match = re.search(r"template:\s*'(.*?)'\s*,\s*(data|methods|computed)", js, re.DOTALL)
if match:
    template_content = match.group(1)
    # clean up escaped characters like \n and \+
    template_content = template_content.replace("\\n", "\n").replace("\\'", "'").replace('\\"', '"')
    with open("scratch/sku_template_extracted.html", "w", encoding="utf-8") as f:
        f.write(template_content)
    print("Extracted template (length:", len(template_content), "bytes)")
    print("First 2000 characters:")
    print(template_content[:2000])
else:
    # Try searching with another regex
    match2 = re.search(r"template:\s*'(.*?)'", js, re.DOTALL)
    if match2:
        template_content = match2.group(1)
        template_content = template_content.replace("\\n", "\n").replace("\\'", "'").replace('\\"', '"')
        with open("scratch/sku_template_extracted.html", "w", encoding="utf-8") as f:
            f.write(template_content)
        print("Extracted template matching simple regex (length:", len(template_content), "bytes)")
    else:
        print("Template not found")
