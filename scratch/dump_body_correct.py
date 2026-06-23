# dump_body_correct.py
import re

html_path = r"C:\Users\dellc\.gemini\antigravity\brain\971d487f-3740-4304-9f7b-55f641d339af\.system_generated\steps\361\content.md"

with open(html_path, "r", encoding="utf-8") as f:
    content = f.read()

# Let's find the <body> start tag or where the actual markup begins (usually after </style> or </head>)
body_start = content.find("</style>")
if body_start == -1:
    body_start = content.find("</head>")

if body_start != -1:
    body_content = content[body_start + 8:]
else:
    body_content = content

# Replace tags to format them with newlines
formatted = body_content.replace("<", "\n<")

output_path = r"C:\Users\dellc\OneDrive\Desktop\softrate\scratch\zoho_body_clean.html"
with open(output_path, "w", encoding="utf-8") as out:
    out.write(formatted)

print(f"Dumped formatted HTML of size {len(formatted)} to scratch/zoho_body_clean.html!")
