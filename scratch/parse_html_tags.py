# parse_html_tags.py
import re

html_path = r"C:\Users\dellc\.gemini\antigravity\brain\971d487f-3740-4304-9f7b-55f641d339af\.system_generated\steps\361\content.md"

with open(html_path, "r", encoding="utf-8") as f:
    content = f.read()

# Let's find all tags like <h1>...</h1>, <h2>...</h2>, <h3>...</h3>, <p>...</p>, <li>...</li>
pattern = re.compile(r'<h[1-6][^>]*>(.*?)</h[1-6]>|<p[^>]*>(.*?)</p>|<li[^>]*>(.*?)</li[^>]*>', re.DOTALL | re.IGNORECASE)

matches = pattern.findall(content)

output_path = r"C:\Users\dellc\OneDrive\Desktop\softrate\scratch\zoho_tags_text.txt"
with open(output_path, "w", encoding="utf-8") as out:
    for match in matches:
        # Each match is a tuple (h, p, li)
        text_segment = next((item for item in match if item), "").strip()
        if text_segment:
            # Strip inner HTML tags
            clean_segment = re.sub(r'<[^>]+>', '', text_segment).strip()
            # Replace newlines with spaces
            clean_segment = re.sub(r'\s+', ' ', clean_segment)
            if clean_segment:
                out.write(clean_segment + "\n")

print(f"Extracted {len(matches)} tag matches successfully!")
