# extract_zoho_text.py
import re
from html.parser import HTMLParser

class HTMLTextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.text_content = []
        self.in_style = False
        self.in_script = False

    def handle_starttag(self, tag, attrs):
        if tag == 'style':
            self.in_style = True
        elif tag == 'script':
            self.in_script = True

    def handle_endtag(self, tag):
        if tag == 'style':
            self.in_style = False
        elif tag == 'script':
            self.in_script = False

    def handle_data(self, data):
        if not self.in_style and not self.in_script:
            cleaned = data.strip()
            if cleaned:
                self.text_content.append(cleaned)

# Read HTML file
html_path = r"C:\Users\dellc\.gemini\antigravity\brain\971d487f-3740-4304-9f7b-55f641d339af\.system_generated\steps\361\content.md"
with open(html_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

# Find the HTML line (usually line 10 or starts with <!doctype)
html_content = ""
for line in lines:
    if line.strip().startswith("<!doctype") or line.strip().startswith("<!DOCTYPE") or "<html" in line:
        html_content = line
        break

if not html_content:
    # fallback to joining lines after the frontmatter
    html_content = "".join(lines[8:])

# Parse HTML content
parser = HTMLTextExtractor()
parser.feed(html_content)

# Save output to text file
output_path = r"C:\Users\dellc\OneDrive\Desktop\softrate\scratch\zoho_text.txt"
with open(output_path, "w", encoding="utf-8") as out:
    for line in parser.text_content:
        out.write(line + "\n")

print(f"Extracted {len(parser.text_content)} text segments successfully!")
