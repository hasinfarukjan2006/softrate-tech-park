#!/usr/bin/env python3
"""Patch dist/js/app.js to add ALL missing calculator routes."""

ROUTES = [
    ("financial-report", "financial-report-section"),
    ("project-estimate", "project-estimate-section"),
    ("project-cost", "project-estimate-section"),  # alias
    ("w9", "w9-section"),
    ("payslip", "payslip-section"),
    ("nps", "nps-section"),
    ("eps", "eps-section"),
    ("gratuity", "gratuity-section"),
    ("bonus", "bonus-section"),
    ("hra", "hra-section"),
    ("sku", "sku-section"),
    ("po", "purchase-order-section"),
    ("purchase-order", "purchase-order-section"),
    ("reorder", "reorder-section"),
    ("eoq", "eoq-section"),
    ("break-even", "break-even-section"),
    ("inventory-turnover", "inventory-turnover-section"),
    ("packing-slip", "packing-slip-section"),
    ("barcode", "barcode-section"),
    ("shipping-label", "shipping-label-section"),
    ("wholesale", "wholesale-section"),
    ("invoice", "invoice-section"),
    ("quote", "quote-section"),
    ("receipts", "receipts-section"),
    ("forecaster", "forecaster-section"),
    ("uk-vat", "uk-vat-section"),
    ("uae-vat", "uae-vat-section"),
    ("uk-flat", "uk-flat-section"),
    ("uk-corp", "uk-corp-section"),
    ("mileage", "mileage-section"),
]

def main():
    filepath = '../dist/js/app.js'
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Collect which section IDs are actually in the HTML
    with open('../dist/index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # 1. Build the list of section variable declarations to add
    existing_sections = set()
    for route, section_id in ROUTES:
        if section_id in content:
            existing_sections.add(section_id)

    new_sections = []
    for route, section_id in ROUTES:
        if section_id not in existing_sections and f'id="{section_id}"' in html:
            new_sections.append(section_id)
            existing_sections.add(section_id)

    # Find insertion point: after hmrcSection declaration
    insert_after = 'const hmrcSection = document.getElementById("hmrc-section");'
    if insert_after not in content:
        insert_after = 'const perDiemSection = document.getElementById("per-diem-section");'

    # Add variable declarations
    var_lines = ""
    for sid in new_sections:
        var_name = sid.replace("-section", "Section").replace("-", "")
        # camelCase conversion
        parts = sid.replace("-section", "").split("-")
        var_name = parts[0] + "".join(p.capitalize() for p in parts[1:]) + "Section"
        var_lines += f'\n    const {var_name} = document.getElementById("{sid}");'

    if var_lines:
        content = content.replace(insert_after, insert_after + var_lines)

    # 2. Add hide calls
    hide_after = 'if (hmrcSection) hmrcSection.classList.add("hide");'
    if hide_after not in content:
        hide_after = 'if (perDiemSection) perDiemSection.classList.add("hide");'

    hide_lines = ""
    for sid in new_sections:
        parts = sid.replace("-section", "").split("-")
        var_name = parts[0] + "".join(p.capitalize() for p in parts[1:]) + "Section"
        hide_lines += f'\n    if ({var_name}) {var_name}.classList.add("hide");'

    if hide_lines:
        content = content.replace(hide_after, hide_after + hide_lines)

    # 3. Add route show logic — before the "else { comingSoonSection }" block
    coming_soon_block = '    } else {\n      if (comingSoonSection) comingSoonSection.classList.remove("hide");'

    route_blocks = ""
    added_routes = set()
    for route, section_id in ROUTES:
        if section_id in added_routes:
            continue
        if f'id="{section_id}"' not in html:
            continue  # section doesn't exist in HTML
        if f'route === "{route}"' in content and section_id in content:
            continue  # already handled

        parts = section_id.replace("-section", "").split("-")
        var_name = parts[0] + "".join(p.capitalize() for p in parts[1:]) + "Section"

        # Collect all route aliases for this section
        aliases = [r for r, s in ROUTES if s == section_id]
        conditions = " || ".join(f'route === "{a}"' for a in aliases)

        route_blocks += f'    }} else if ({conditions}) {{\n'
        route_blocks += f'      if ({var_name}) {var_name}.classList.remove("hide");\n'
        route_blocks += f'      if ({var_name}) {var_name}.scrollIntoView({{ behavior: "smooth" }});\n'

        added_routes.add(section_id)

    if route_blocks:
        content = content.replace(coming_soon_block, route_blocks + coming_soon_block)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    # Verify
    print("=== ROUTE PATCH COMPLETE ===\n")
    for route, section_id in ROUTES:
        has_route = f'route === "{route}"' in content
        has_section = f'getElementById("{section_id}")' in content
        has_html = f'id="{section_id}"' in html
        status = "OK" if (has_route and has_section) or not has_html else ("NO HTML" if not has_html else "MISSING")
        print(f"  {route:25s} section={section_id:30s} route={'Y' if has_route else 'N'} js={'Y' if has_section else 'N'} html={'Y' if has_html else 'N'} => {status}")

if __name__ == '__main__':
    main()
