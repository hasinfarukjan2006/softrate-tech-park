import re
import os

def extract_between_classes(html, start_class, end_class_or_tag):
    # Find start position
    start_pos = html.find(start_class)
    if start_pos == -1:
        return None
    # Adjust start position to capture the tag opening
    open_tag_pos = html.rfind('<', 0, start_pos)
    if open_tag_pos == -1:
        open_tag_pos = start_pos
        
    # Find end position
    end_pos = html.find(end_class_or_tag, start_pos + len(start_class))
    if end_pos == -1:
        return html[open_tag_pos:open_tag_pos+3000] # Fallback to block of size 3000
    
    # Adjust end position to capture the closing tag if possible
    # We want to find the next closing tag after the end_class_or_tag
    close_tag_pos = html.find('>', end_pos)
    if close_tag_pos != -1:
        end_idx = close_tag_pos + 1
    else:
        end_idx = end_pos
        
    return html[open_tag_pos:end_idx]

def main():
    if not os.path.exists('scratch/zoho_full_live.html'):
        print('zoho_full_live.html not found')
        return
        
    with open('scratch/zoho_full_live.html', 'r', encoding='utf-8') as f:
        html = f.read()
        
    # 1. Hero Section: class="banner-section"
    # Find banner-section
    hero_section = extract_between_classes(html, 'class=banner-section', 'class=what-is-wholesale-price')
    if hero_section:
        with open('scratch/section_hero.html', 'w', encoding='utf-8') as f:
            f.write(hero_section)
        print('Saved hero section')
        
    # 2. Red Section: class="what-is-wholesale-price"
    red_section = extract_between_classes(html, 'class=what-is-wholesale-price', 'class=how-price-calculated-section')
    if red_section:
        with open('scratch/section_red.html', 'w', encoding='utf-8') as f:
            f.write(red_section)
        print('Saved red section')
        
    # 3. Formula Section: class="how-price-calculated-section"
    formula_section = extract_between_classes(html, 'class=how-price-calculated-section', 'class=whats-diff-section')
    if formula_section:
        with open('scratch/section_formula.html', 'w', encoding='utf-8') as f:
            f.write(formula_section)
        print('Saved formula section')
        
    # 4. Diff Section: class="whats-diff-section"
    # Wait, what comes after diff section? Let's check the next major block. In the headings we saw H2 for "Streamline, simplify..."
    # The promotion section class might be "promotion-section" or similar, or "zom-prd-screenshot"
    diff_section = extract_between_classes(html, 'class=whats-diff-section', 'zom-prd-screenshot')
    if diff_section:
        with open('scratch/section_diff.html', 'w', encoding='utf-8') as f:
            f.write(diff_section)
        print('Saved diff section')
        
    # Let's inspect what is in the diff section to make sure it includes the retail box
    # Let's find out how the retail box is structured by extracting a larger portion if needed
    pos_diff = html.find('class=whats-diff-section')
    if pos_diff != -1:
        # Save a large chunk of diff section
        chunk = html[pos_diff:pos_diff + 5000]
        # Let's find the closing tag for whats-diff-section or see where it ends
        # It probably ends before class="zom-prd-screenshot" or contains the retail price box.
        with open('scratch/section_diff_full.html', 'w', encoding='utf-8') as f:
            f.write(html[pos_diff - 40 : pos_diff + 4000])
        print('Saved full diff chunk')

if __name__ == '__main__':
    main()
