# parse_html_regex.py
import re

html_path = r"C:\Users\dellc\.gemini\antigravity\brain\971d487f-3740-4304-9f7b-55f641d339af\.system_generated\steps\361\content.md"

with open(html_path, "r", encoding="utf-8") as f:
    content = f.read()

# Extract just the HTML body/content
html_content = content.split("---", 1)[-1]

# Remove style blocks
html_content = re.sub(r'<style[^>]*>.*?</style>', '', html_content, flags=re.DOTALL | re.IGNORECASE)

# Remove script blocks
html_content = re.sub(r'<script[^>]*>.*?</script>', '', html_content, flags=re.DOTALL | re.IGNORECASE)

# Replace HTML tags with newlines
text = re.sub(r'<[^>]+>', '\n', html_content)

# Clean up multiple newlines
text = re.sub(r'\n\s*\n', '\n', text)

# Write to output file
output_path = r"C:\Users\dellc\OneDrive\Desktop\softrate\scratch\zoho_clean_text.txt"
with open(output_path, "w", encoding="utf-8") as out:
    out.write(text.strip())

print("Clean text extracted using regex!")
