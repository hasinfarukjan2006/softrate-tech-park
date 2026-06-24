"""
Remove the billing internal sidebar (inv-page-layout, inv-sidebar, inv-content-area)
from all 4 billing sections. The content inside inv-content-area is preserved and
placed directly inside the section — just like all other calculator pages.
"""
import re

with open('templates/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

original = content

def strip_billing_sidebar(section_id, content):
    """
    For a given section id, find the inv-page-layout wrapper and remove:
      - The outer <div class="inv-page-layout"> ... </div>
      - The entire <aside class="inv-sidebar"> ... </aside>
      - The <div class="inv-content-area"> opening tag
      - The corresponding </div><!-- end inv-content-area --> closing tag
      - The corresponding </div><!-- end inv-page-layout --> closing tag
    Preserving only the content that was inside inv-content-area.
    """
    # Find the section
    sec_start = content.find(f'id="{section_id}"')
    if sec_start == -1:
        print(f"SECTION NOT FOUND: {section_id}")
        return content
    
    # Find inv-page-layout start inside this section
    layout_start = content.find('<div class="inv-page-layout">', sec_start)
    if layout_start == -1:
        print(f"No inv-page-layout in {section_id} -- already clean")
        return content
    
    # Find content-area opening inside this section
    content_area_start = content.find('<div class="inv-content-area">', layout_start)
    if content_area_start == -1:
        print(f"No inv-content-area in {section_id}")
        return content
    
    # The content we want starts right after </div class="inv-content-area">
    content_area_open_end = content_area_start + len('<div class="inv-content-area">')
    
    # Find the closing markers (using the comment markers added by the script)
    close_content_area = content.find('</div><!-- end inv-content-area -->', content_area_open_end)
    close_page_layout = content.find('</div><!-- end inv-page-layout -->', content_area_open_end)
    
    if close_content_area == -1 or close_page_layout == -1:
        # Try alternate format without comments
        print(f"WARN: Using alt closing detection for {section_id}")
        # The content area and layout close are the last two </div> before next section
        # We'll just extract content between content-area open and its close
        # Count nested divs
        depth = 1
        pos = content_area_open_end
        while pos < len(content) and depth > 0:
            next_open = content.find('<div', pos)
            next_close = content.find('</div>', pos)
            if next_open == -1:
                next_open = len(content)
            if next_close == -1:
                next_close = len(content)
            if next_open < next_close:
                depth += 1
                pos = next_open + 4
            else:
                depth -= 1
                if depth == 0:
                    close_content_area = next_close
                else:
                    pos = next_close + 6
        # The next </div> after content area close would be the layout close
        close_page_layout_end = content.find('</div>', close_content_area + 6) + 6
        actual_content = content[content_area_open_end:close_content_area]
        new_content = content[:layout_start] + actual_content.strip('\r\n') + '\n' + content[close_page_layout_end:]
        print(f"OK {section_id}: stripped billing sidebar (alt method)")
        return new_content
    
    # Extract the content inside inv-content-area
    inner_content = content[content_area_open_end:close_content_area]
    
    # Figure out the end of inv-page-layout closing tag
    close_page_layout_end = close_page_layout + len('</div><!-- end inv-page-layout -->')
    # Skip any trailing newlines after the layout close
    while close_page_layout_end < len(content) and content[close_page_layout_end] in '\r\n':
        close_page_layout_end += 1
    
    # Build replacement: section open tag stays, then directly the inner content
    new_content = content[:layout_start] + inner_content.strip('\r\n') + '\n' + content[close_page_layout_end:]
    print(f"OK {section_id}: stripped billing sidebar (comment method)")
    return new_content

for section_id in ['invoice-section', 'quote-section', 'receipts-section', 'forecaster-section']:
    content = strip_billing_sidebar(section_id, content)

if content != original:
    with open('templates/index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("\nSAVED: templates/index.html updated - billing sidebars removed from all 4 sections.")
else:
    print("\nNO CHANGE: Content was already clean or no sections found.")
