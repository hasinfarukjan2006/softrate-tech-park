with open("scratch/sku_full_live.html", "r", encoding="utf-8") as f:
    html = f.read()

import re
styles = re.findall(r'<style[^>]*>(.*?)</style>', html, re.DOTALL)

with open("scratch/sku_extracted_styles.css", "w", encoding="utf-8") as f:
    f.write("/* STYLE TAG 1 */\n")
    f.write(styles[0])
    f.write("\n\n/* STYLE TAG 2 */\n")
    f.write(styles[1])

print("Saved style tags to scratch/sku_extracted_styles.css")
