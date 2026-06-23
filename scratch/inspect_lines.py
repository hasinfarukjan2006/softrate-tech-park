# inspect_lines.py
html_path = r"C:\Users\dellc\brain\971d487f-3740-4304-9f7b-55f641d339af\.system_generated\steps\361\content.md"
# Wait, let's use the correct path. The path from the previous tool output was:
# C:\Users\dellc\.gemini\antigravity\brain\971d487f-3740-4304-9f7b-55f641d339af\.system_generated\steps\361\content.md
html_path = r"C:\Users\dellc\.gemini\antigravity\brain\971d487f-3740-4304-9f7b-55f641d339af\.system_generated\steps\361\content.md"

with open(html_path, "r", encoding="utf-8") as f:
    for i, line in enumerate(f):
        print(f"Line {i+1}: length={len(line)}, starts with: {line[:100].strip()}")
