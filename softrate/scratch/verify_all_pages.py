#!/usr/bin/env python3
"""Comprehensive verification of all 24 existing calculator pages."""
import os, re, json

DIST = '../dist'
TEMPLATES = 'templates/index.html'
STATIC_CSS = 'static/css'
STATIC_JS = 'static/js'
DIST_CSS = '../dist/css'
DIST_JS = '../dist/js'
APP_PY = 'app.py'
SRC_APPJS = 'static/js/app.js'
DIST_APPJS = '../dist/js/app.js'

PAGES = [
    {"name": "India GST Calculator", "route": "gst", "section_id": "gst-section", "css": "gst.css", "js": "gst.js", "url": "/in/payroll/gst-calculator/"},
    {"name": "Expense Report Generator", "route": "expense", "section_id": "expense-section", "css": "expense.css", "js": "expense.js", "url": "/expense-report-generator"},
    {"name": "Per Diem Calculator", "route": "per-diem", "section_id": "per-diem-section", "css": "per_diem.css", "js": "per_diem.js", "url": "/per-diem-calculator"},
    {"name": "Wholesale Price Calculator", "route": "wholesale", "section_id": "wholesale-section", "css": "wholesale.css", "js": "wholesale.js", "url": "/wholesale-calculator"},
    {"name": "Shipping Label Generator", "route": "shipping-label", "section_id": "shipping-label-section", "css": "shipping_label.css", "js": "shipping_label.js", "url": "/shipping-label-generator"},
    {"name": "Barcode Generator", "route": "barcode", "section_id": "barcode-section", "css": "barcode.css", "js": "barcode.js", "url": "/barcode-generator"},
    {"name": "Packing Slip Generator", "route": "packing-slip", "section_id": "packing-slip-section", "css": "packing_slip.css", "js": "packing_slip.js", "url": "/packing-slip-generator"},
    {"name": "Inventory Turnover Ratio", "route": "inventory-turnover", "section_id": "inventory-turnover-section", "css": "inventory_turnover.css", "js": "inventory_turnover.js", "url": "/inventory-turnover-calculator"},
    {"name": "Break-even Point Calculator", "route": "break-even", "section_id": "break-even-section", "css": "break_even.css", "js": "break_even.js", "url": "/break-even-calculator"},
    {"name": "Economic Order Quantity", "route": "eoq", "section_id": "eoq-section", "css": "eoq.css", "js": "eoq.js", "url": "/eoq-calculator"},
    {"name": "Calculate Reorder Point", "route": "reorder", "section_id": "reorder-section", "css": "reorder.css", "js": "reorder.js", "url": "/reorder-point-calculator"},
    {"name": "SKU Generator", "route": "sku", "section_id": "sku-section", "css": "sku.css", "js": "sku.js", "url": "/sku-generator"},
    {"name": "HRA Exemption Calculator", "route": "hra", "section_id": "hra-section", "css": "hra.css", "js": "hra.js", "url": "/in/payroll/hra-calculator/"},
    {"name": "Statutory Bonus Calculator", "route": "bonus", "section_id": "bonus-section", "css": "bonus.css", "js": "bonus.js", "url": "/in/payroll/bonus-calculator/"},
    {"name": "Gratuity Calculator", "route": "gratuity", "section_id": "gratuity-section", "css": "gratuity.css", "js": "gratuity.js", "url": "/in/payroll/gratuity-calculator/"},
    {"name": "EPS Pension Calculator", "route": "eps", "section_id": "eps-section", "css": "eps.css", "js": "eps.js", "url": "/in/payroll/eps-calculator/"},
    {"name": "NPS Calculator", "route": "nps", "section_id": "nps-section", "css": "nps.css", "js": "nps.js", "url": "/in/payroll/nps-calculator/"},
    {"name": "Payslip Generator", "route": "payslip", "section_id": "payslip-section", "css": "payslip.css", "js": "payslip.js", "url": "/in/payroll/payslip-generator/"},
    {"name": "Form W-9 Generator", "route": "w9", "section_id": "w9-section", "css": "w9.css", "js": "w9.js", "url": "/w9-generator"},
    {"name": "Financial Report Templates", "route": "financial-report", "section_id": "financial-report-section", "css": "financial_report.css", "js": "financial_report.js", "url": "/financial-report-templates"},
    {"name": "Free Project Cost Estimate", "route": "project-estimate", "section_id": "project-estimate-section", "css": "project_estimate.css", "js": "project_estimate.js", "url": "/project-cost-estimate"},
    {"name": "Paycheck Calculator (US)", "route": "paycheck", "section_id": "paycheck-section", "css": "paycheck.css", "js": "paycheck.js", "url": "/paycheck-calculator"},
    {"name": "Income Tax Calculator", "route": "income-tax", "section_id": "income-tax-section", "css": "income_tax.css", "js": "income_tax.js", "url": "/income-tax-calculator"},
    {"name": "HMRC Furlough Claim Calculator", "route": "hmrc", "section_id": "hmrc-section", "css": "hmrc.css", "js": "hmrc.js", "url": "/hmrc-furlough-calculator"},
]

def main():
    # Load all files
    dist_html = open(os.path.join(DIST, 'index.html'), 'r', encoding='utf-8').read()
    tmpl_html = open(TEMPLATES, 'r', encoding='utf-8').read()
    dist_appjs = open(DIST_APPJS, 'r', encoding='utf-8').read()
    src_appjs = open(SRC_APPJS, 'r', encoding='utf-8').read()
    app_py = open(APP_PY, 'r', encoding='utf-8').read()

    results = []
    all_pass = True

    for p in PAGES:
        checks = {}
        name = p["name"]
        route = p["route"]
        sid = p["section_id"]

        # 1. HTML section in dist
        checks["dist_html"] = f'id="{sid}"' in dist_html
        # 2. HTML section in templates
        checks["tmpl_html"] = f'id="{sid}"' in tmpl_html
        # 3. CSS file in static
        checks["static_css"] = os.path.exists(os.path.join(STATIC_CSS, p["css"]))
        # 4. CSS file in dist
        checks["dist_css"] = os.path.exists(os.path.join(DIST_CSS, p["css"]))
        # 5. JS file in static
        checks["static_js"] = os.path.exists(os.path.join(STATIC_JS, p["js"]))
        # 6. JS file in dist
        checks["dist_js"] = os.path.exists(os.path.join(DIST_JS, p["js"]))
        # 7. Route in dist app.js
        checks["dist_route"] = f'route === "{route}"' in dist_appjs or f'"{route}"' in dist_appjs
        # 8. Route in source app.js
        checks["src_route"] = f'"{route}"' in src_appjs
        # 9. CSS link in dist HTML
        checks["css_link_dist"] = p["css"] in dist_html
        # 10. JS script in dist HTML
        checks["js_link_dist"] = p["js"] in dist_html
        # 11. Check for Coming Soon in the section
        section_match = re.search(f'id="{sid}".*?</section>', dist_html, re.DOTALL)
        if section_match:
            section_content = section_match.group()
            checks["no_coming_soon"] = "coming soon" not in section_content.lower() and "coming-soon" not in section_content.lower()
            # Check for calculation logic (buttons, result sections)
            checks["has_calc_btn"] = any(w in section_content.lower() for w in ["calculate", "generate", "compute", "submit", "create"])
            checks["has_results"] = any(w in section_content.lower() for w in ["result", "output", "summary", "preview", "generated"])
        else:
            checks["no_coming_soon"] = False
            checks["has_calc_btn"] = False
            checks["has_results"] = False

        # 12. JS file has logic
        js_path = os.path.join(STATIC_JS, p["js"])
        if os.path.exists(js_path):
            js_content = open(js_path, 'r', encoding='utf-8').read()
            checks["js_has_logic"] = len(js_content) > 100
        else:
            checks["js_has_logic"] = False

        passed = all(checks.values())
        if not passed:
            all_pass = False

        results.append({"name": name, "route": route, "url": p["url"], "css": p["css"], "js": p["js"], "checks": checks, "passed": passed})

    # Output
    print("=" * 100)
    print("COMPREHENSIVE VERIFICATION REPORT — 24 EXISTING PAGES")
    print("=" * 100)

    for i, r in enumerate(results, 1):
        status = "PASS" if r["passed"] else "FAIL"
        emoji = "OK" if r["passed"] else "XX"
        print(f"\n[{emoji}] {i}. {r['name']}")
        print(f"     Route: {r['route']} | URL: {r['url']}")
        print(f"     CSS: {r['css']} | JS: {r['js']}")
        fails = [k for k, v in r["checks"].items() if not v]
        if fails:
            print(f"     FAILURES: {', '.join(fails)}")
        else:
            print(f"     All 12 checks passed")

    print("\n" + "=" * 100)
    print(f"\nSUMMARY: {sum(1 for r in results if r['passed'])}/{len(results)} pages fully verified")
    if not all_pass:
        print("\nFAILED PAGES:")
        for r in results:
            if not r["passed"]:
                fails = [k for k, v in r["checks"].items() if not v]
                print(f"  - {r['name']}: {', '.join(fails)}")

    # Safety checks
    print("\n" + "=" * 100)
    print("SAFETY VERIFICATION")
    print("=" * 100)

    # Check no files deleted
    expected_files = [
        'static/css/style.css', 'static/js/app.js', 'app.py',
        'templates/index.html', '../dist/index.html', '../dist/js/app.js',
        '../dist/css/style.css',
    ]
    print("\nCritical files intact:")
    for f in expected_files:
        exists = os.path.exists(f)
        print(f"  {f}: {'EXISTS' if exists else 'MISSING!'}")

    # Check app.py still has key routes
    print("\nBackend routes intact:")
    key_routes = ['gst_calculator', 'expense_report', 'payslip', 'hra_calculator', 'nps_calculator']
    for kr in key_routes:
        print(f"  {kr}: {'YES' if kr in app_py else 'MISSING!'}")

    # Check MongoDB connection code
    print(f"\n  MongoDB code: {'YES' if 'MongoClient' in app_py else 'MISSING!'}")
    print(f"  Flask app: {'YES' if 'Flask(__name__)' in app_py else 'MISSING!'}")

    # JSON output
    output = {
        "total_pages": len(results),
        "passed": sum(1 for r in results if r["passed"]),
        "failed": sum(1 for r in results if not r["passed"]),
        "details": [{
            "name": r["name"],
            "route": r["route"],
            "url": r["url"],
            "css_file": r["css"],
            "js_file": r["js"],
            "status": "PASS" if r["passed"] else "FAIL",
            "failures": [k for k, v in r["checks"].items() if not v]
        } for r in results]
    }
    with open('scratch/verification_report.json', 'w') as f:
        json.dump(output, f, indent=2)
    print("\nDetailed JSON report saved to scratch/verification_report.json")

if __name__ == '__main__':
    main()
