with open("templates/index.html", "r", encoding="utf-8") as f:
    html = f.read()

ids = [
    "is_general_income",
    "is_sales",
    "is_gross_profit",
    "is_gross_margin",
    "lbl_is_total_operating_income",
    "is_capital_gain",
    "lbl_is_total_non_operating_income",
    "is_business_insurance",
    "is_telephone",
    "is_shipping",
    "is_travel_expenses",
    "lbl_is_total_operating_expense",
    "is_lawsuit_settlement",
    "is_damages",
    "is_interest_expense",
    "lbl_is_total_non_operating_expense",
    "is_manufacturing",
    "is_labor_payment",
    "lbl_is_total_cogs",
    "lbl_is_net_profit_loss"
]

for name in ids:
    found = False
    for i, line in enumerate(html.splitlines()):
        if f'id="{name}"' in line or f"id='{name}'" in line:
            print(f"Found {name} at line {i+1}")
            found = True
            break
    if not found:
        print(f"MISSING ID: {name}")
