with open("templates/index.html", "r", encoding="utf-8") as f:
    html = f.read()

ids_needed = [
    'is_general_income', 'is_sales', 'is_gross_profit', 'is_gross_margin', 'lbl_is_total_operating_income',
    'is_capital_gain', 'lbl_is_total_non_operating_income',
    'is_business_insurance', 'is_telephone', 'is_shipping', 'is_travel_expenses', 'lbl_is_total_operating_expense',
    'is_lawsuit_settlement', 'is_damages', 'is_interest_expense', 'lbl_is_total_non_operating_expense',
    'is_manufacturing', 'is_labor_payment', 'lbl_is_total_cogs', 'lbl_is_net_profit_loss',
    'is_org_name', 'is_org_address', 'frBtnDownloadIS'
]

for name in ids_needed:
    if f'id="{name}"' not in html and f"id='{name}'" not in html and f"id={name}" not in html:
        print(f"Missing ID in HTML: {name}")
