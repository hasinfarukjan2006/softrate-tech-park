# dump_body_html.py
import re

html_path = r"C:\Users\dellc\.gemini\antigravity\brain\971d487f-3740-4304-9f7b-55f641d339af\.system_generated\steps\361\content.md"

with open(html_path, "r", encoding="utf-8") as f:
    content = f.read()

# Let's find the main content div or the section under body
# Find the first occurrence of '<section' or '<div class="banner-section"'
start_idx = content.find("banner-section")
if start_idx == -1:
    start_idx = content.find("<body")

body_part = content[start_idx-100:]

# Format HTML: replace '<' with '\n<' to make it readable
formatted = body_part.replace("<", "\n<")

output_path = r"C:\Users\dellc\OneDrive\Desktop\softrate\scratch\zoho_body_formatted.html"
with open(output_path, "w", encoding="utf-8") as out:
    out.write(formatted)

print("Body formatted and dumped to scratch/zoho_body_formatted.html!")
