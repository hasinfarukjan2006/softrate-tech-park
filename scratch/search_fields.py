with open("scratch/po_full_live.html", "r", encoding="utf-8") as f:
    html = f.read()

import re
# Find all <input ...> and <textarea ...> tags and print their attributes
tags = re.findall(r'<(input|textarea)\s+([^>]+)>', html)
print(f"Found {len(tags)} input/textarea tags:")
for tag_type, attrs in tags:
    # Find name attribute
    name_match = re.search(r'\bname=([^\s>]+)', attrs)
    placeholder_match = re.search(r'\bplaceholder=["\']?([^"\'>]+)["\']?', attrs)
    name_val = name_match.group(1) if name_match else "None"
    place_val = placeholder_match.group(1) if placeholder_match else "None"
    print(f"  <{tag_type} name={name_val} placeholder=\"{place_val}\">")
