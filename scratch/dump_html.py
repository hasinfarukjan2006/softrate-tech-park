# dump_html.py
html_path = r"C:\Users\dellc\.gemini\antigravity\brain\971d487f-3740-4304-9f7b-55f641d339af\.system_generated\steps\361\content.md"

with open(html_path, "r", encoding="utf-8") as f:
    content = f.read()

# Format HTML: replace '<' with '\n<' to make it readable
formatted = content.replace("<", "\n<")

output_path = r"C:\Users\dellc\OneDrive\Desktop\softrate\scratch\zoho_html_dump.html"
with open(output_path, "w", encoding="utf-8") as out:
    out.write(formatted)

print("HTML formatted and dumped to scratch/zoho_html_dump.html!")
