import re

html_path = "templates/index.html"
payslip_html_path = "scratch/payslip_html.html"

print("Reading index.html...")
with open(html_path, "r", encoding="utf-8") as f:
    content = f.read()

print("Reading payslip_html.html...")
with open(payslip_html_path, "r", encoding="utf-8") as f:
    payslip_html = f.read()

# Let's find the start of the payslip section
start_tag = '<section id="payslip-section"'
start_idx = content.find(start_tag)

if start_idx == -1:
    print("Could not find payslip-section in index.html!")
    exit(1)

# Let's find the closing tag of this section
# We can track the depth of nested <section and </section> tags
depth = 0
end_idx = -1
lines = content[start_idx:].split('\n')
current_char_count = start_idx

for line in lines:
    if '<section' in line:
        depth += 1
    if '</section>' in line:
        depth -= 1
        if depth == 0:
            # We found the end of the section!
            end_idx = current_char_count + line.find('</section>') + len('</section>')
            break
    current_char_count += len(line) + 1 # +1 for newline character

if end_idx == -1:
    print("Could not find closing tag of payslip-section!")
    exit(1)

print(f"Replacing section from character {start_idx} to {end_idx}...")
new_content = content[:start_idx] + payslip_html + content[end_idx:]

with open(html_path, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Section replacement completed successfully!")
