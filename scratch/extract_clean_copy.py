# extract_clean_copy.py
import re

html_path = r"C:\Users\dellc\brain\971d487f-3740-4304-9f7b-55f641d339af\.system_generated\steps\361\content.md"
# Wait, correct path:
html_path = r"C:\Users\dellc\.gemini\antigravity\brain\971d487f-3740-4304-9f7b-55f641d339af\.system_generated\steps\361\content.md"

with open(html_path, "r", encoding="utf-8") as f:
    content = f.read()

# Remove CSS and Script tags completely
content = re.sub(r'(?i)<style.*?>.*?</style>', '', content, flags=re.DOTALL)
content = re.sub(r'(?i)<script.*?>.*?</script>', '', content, flags=re.DOTALL)

# Extract only elements inside body or elements with text
# Let's strip all HTML tags, but replace them with space or newline
text = re.sub(r'<[^>]+>', ' \n ', content)

# Clean up whitespace
lines = []
for line in text.split('\n'):
    line = line.strip()
    # Skip lines with style stuff
    if not line:
        continue
    if '{' in line or '}' in line or 'margin:' in line or 'padding:' in line or 'font-size:' in line or 'background-color:' in line:
        continue
    lines.append(line)

# Write output
output_path = r"C:\Users\dellc\OneDrive\Desktop\softrate\scratch\zoho_clean_copy.txt"
with open(output_path, "w", encoding="utf-8") as out:
    out.write("\n".join(lines))

print("Clean text copy written successfully!")
