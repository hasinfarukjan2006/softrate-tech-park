#!/usr/bin/env python3
"""Build UK Corporation Tax Calculator — exact Zoho reference clone."""
import os, re, shutil

# ============================================================
# HTML
# ============================================================
HTML = r'''
      <!-- Section: UK Corporation Tax Calculator -->
      <section id="uk-corp-section" class="content-section mt-8 hide">

        <!-- Hero -->
        <div class="ct-hero">
          <div class="ct-hero-inner">
            <div class="ct-hero-illust ct-hero-left">
              <svg viewBox="0 0 120 120" width="100" height="100"><rect x="20" y="30" width="40" height="55" rx="4" fill="#c5ddf6" stroke="#4a7fd4" stroke-width="1.5"/><rect x="28" y="42" width="24" height="4" rx="1" fill="#4a7fd4" opacity=".5"/><rect x="28" y="50" width="24" height="4" rx="1" fill="#4a7fd4" opacity=".3"/><rect x="28" y="58" width="16" height="4" rx="1" fill="#4a7fd4" opacity=".3"/><circle cx="80" cy="50" r="18" fill="none" stroke="#4a7fd4" stroke-width="1.5" stroke-dasharray="4 3"/><text x="80" y="54" text-anchor="middle" font-size="12" fill="#4a7fd4" font-weight="600">£</text></svg>
            </div>
            <div class="ct-hero-text">
              <h1><em>Corporation</em>Tax Calculator</h1>
              <p>Get a quick insight into the amount of Corporation Tax your business is liable for in a few simple clicks.</p>
            </div>
            <div class="ct-hero-illust ct-hero-right">
              <svg viewBox="0 0 120 120" width="100" height="100"><circle cx="60" cy="60" r="30" fill="none" stroke="#4a7fd4" stroke-width="1.5"/><text x="60" y="56" text-anchor="middle" font-size="16" fill="#4a7fd4" font-weight="600">£</text><text x="60" y="70" text-anchor="middle" font-size="8" fill="#4a7fd4">%</text><line x1="85" y1="35" x2="100" y2="20" stroke="#4a7fd4" stroke-width="1.5"/><line x1="100" y1="20" x2="110" y2="25" stroke="#4a7fd4" stroke-width="1.5"/><circle cx="30" cy="100" r="6" fill="#c5ddf6"/><rect x="90" y="85" width="15" height="15" rx="3" fill="#c5ddf6"/></svg>
            </div>
          </div>
        </div>

        <div class="ct-wrapper">
          <!-- Calculator Card -->
          <div class="ct-card">

            <!-- Net Profit -->
            <h2 class="ct-section-title ct-blue">Net profit</h2>
            <p class="ct-section-sub">Profit/Loss incorporated by the company before expense</p>

            <div class="ct-expense-row">
              <span class="ct-label">Business Turnover</span>
              <div class="ct-input-wrap"><input type="number" id="ctTurnover" placeholder="" min="0" step="0.01" value=""></div>
            </div>

            <!-- Allowed Expenses -->
            <div class="ct-section-header">
              <h3 class="ct-section-title2">Allowed Expenses</h3>
              <a href="javascript:void(0)" class="ct-view-link" id="ctViewAllowed">View all allowed expenses</a>
            </div>
            <p class="ct-section-sub">Expenses that helps to keep a business running</p>

            <div id="ctAllowedRows">
              <div class="ct-expense-row" data-default="1">
                <span class="ct-label">Salary</span>
                <div class="ct-input-wrap"><input type="number" class="ct-allowed" placeholder="" min="0" step="0.01" value=""></div>
                <button class="ct-row-menu" title="Remove">&#8943;</button>
              </div>
              <div class="ct-expense-row" data-default="1">
                <span class="ct-label">Travel</span>
                <div class="ct-input-wrap"><input type="number" class="ct-allowed" placeholder="" min="0" step="0.01" value=""></div>
                <button class="ct-row-menu" title="Remove">&#8943;</button>
              </div>
              <div class="ct-expense-row" data-default="1">
                <span class="ct-label">Accounting Fees</span>
                <div class="ct-input-wrap"><input type="number" class="ct-allowed" placeholder="" min="0" step="0.01" value=""></div>
                <button class="ct-row-menu" title="Remove">&#8943;</button>
              </div>
            </div>
            <button class="ct-add-btn" id="ctAddAllowed"><span class="ct-add-icon">&#x2295;</span> Add New</button>

            <!-- Add Back Expenses -->
            <div class="ct-section-header">
              <h3 class="ct-section-title2">Add back Expenses</h3>
              <a href="javascript:void(0)" class="ct-view-link" id="ctViewAddBack">View all add back expenses</a>
            </div>
            <p class="ct-section-sub">Expenses which has the primary motive of obtaining profit</p>

            <div id="ctAddBackRows">
              <div class="ct-expense-row" data-default="1">
                <span class="ct-label">Business Entertainment</span>
                <div class="ct-input-wrap"><input type="number" class="ct-addback" placeholder="" min="0" step="0.01" value=""></div>
                <button class="ct-row-menu" title="Remove">&#8943;</button>
              </div>
              <div class="ct-expense-row" data-default="1">
                <span class="ct-label">Depreciation</span>
                <div class="ct-input-wrap"><input type="number" class="ct-addback" placeholder="" min="0" step="0.01" value=""></div>
                <button class="ct-row-menu" title="Remove">&#8943;</button>
              </div>
              <div class="ct-expense-row" data-default="1">
                <span class="ct-label">Repayment of Loan</span>
                <div class="ct-input-wrap"><input type="number" class="ct-addback" placeholder="" min="0" step="0.01" value=""></div>
                <button class="ct-row-menu" title="Remove">&#8943;</button>
              </div>
            </div>
            <button class="ct-add-btn" id="ctAddAddBack"><span class="ct-add-icon">&#x2295;</span> Add New</button>

            <!-- Results -->
            <div class="ct-results">
              <div class="ct-result-row">
                <span><strong>Profit Before Corporation Tax</strong></span>
                <span class="ct-result-val" id="ctProfitBefore">&pound; 0.00</span>
              </div>
              <div class="ct-result-row">
                <span><strong>Corporation Tax (19%)</strong></span>
                <span class="ct-result-val" id="ctTaxAmount">&pound; 0.00</span>
              </div>
            </div>

          </div><!-- /.ct-card -->

          <!-- Info Sections -->
          <div class="ct-info">

            <h2>What is Corporation Tax?</h2>
            <p>Corporation Tax is a tax that is payable on all taxable profits of any company that is based in the UK, no matter where in the world the profit is generated. Corporation Tax is paid annually based on your Corporation Tax accounting period, which is usually the same as your company's financial year.</p>

            <h2>How to calculate Corporation Tax with this tool</h2>
            <p>This calculator generates your tax due amount by adding back any depreciation and client entertaining costs to the profit before tax, then subtracting any capital allowances to arrive at the profit value that is liable for Corporation Tax.</p>
            <p>For the current tax year, tax is due at a rate of 19% on profits, so the calculator divides your liable profit by 100 then multiplies the resulting sum by 19 to arrive at your Corporation Tax due.</p>
            <p>All you have to do is enter your net profit and your add-back expenses and other allowed expenses (such as salaries and other staff costs, cost of stock or raw materials, office costs, travel, and accommodation) to generate your Corporation Tax due.</p>

            <h2>Add back expenses</h2>
            <p>An add back expense is an expense that will not be included in the buyer's future P&amp;Ls for the company. Understanding and applying add backs and other kinds of adjustments helps normalize a business's earnings on a go-forward basis.</p>
            <p class="ct-list-title">List of add back expense</p>
            <ul class="ct-bullet-list">
              <li>Business entertainment</li>
              <li>The repayment of loans taken out personally to help run the business</li>
              <li>The depreciation of assets</li>
              <li>Drawings including payments for tax and National Insurance Contributions (NIC)</li>
              <li>Fines and costs resulting from breaking the law such as car parking fines, if incurred by proprietors or directors</li>
              <li>Charitable donations, including subscriptions, with the exceptions of small charities and political donations</li>
            </ul>

            <h2>Allowed Expenses</h2>
            <p>Allowable business expenses are purchased products or services that help keep a business running. Examples include stationery, phone bills, and travel costs to name a few. They are deducted from income when calculating taxable profit which means you don't pay tax on these items.</p>
            <p class="ct-list-title">List of allowed expense</p>
            <ul class="ct-bullet-list">
              <li>Rent</li>
              <li>Insurance</li>
              <li>Heating</li>
              <li>Repairs and maintenance</li>
              <li>Wages, salaries and related staff costs</li>
            </ul>
          </div>

          <!-- Promo Card -->
          <div class="ct-promo">
            <h2>Looking for a modernized VAT accounting tool for your business?</h2>
            <p>Look no further than Softrate. Softrate will help your business create VAT-compliant invoices, manage your finances, file tax returns directly, generate detailed reports, and much more.</p>
          </div>

          <div class="ct-features">
            <h3>More of Softrate's features for business</h3>
            <div class="ct-features-grid">
              <div class="ct-feat-item"><div class="ct-feat-icon">&#128203;</div><span>Manage receivables and payables effortlessly</span></div>
              <div class="ct-feat-item"><div class="ct-feat-icon">&#128230;</div><span>Create items and track inventory</span></div>
              <div class="ct-feat-item"><div class="ct-feat-icon">&#128179;</div><span>Reconcile bank accounts easily</span></div>
              <div class="ct-feat-item"><div class="ct-feat-icon">&#128196;</div><span>Create and manage multiple projects</span></div>
              <div class="ct-feat-item"><div class="ct-feat-icon">&#128200;</div><span>Get brilliant insights with 50+ reports</span></div>
            </div>
          </div>

        </div><!-- /.ct-wrapper -->
      </section>
'''

# ============================================================
# CSS
# ============================================================
CSS = r'''/* uk_corp.css — Zoho Corporation Tax reference match */

/* Hero */
#uk-corp-section .ct-hero{background:#e8f0fe !important;padding:2.5rem 1.5rem 2rem;overflow:hidden;}
.dark #uk-corp-section .ct-hero{background:var(--bg-color) !important;}
#uk-corp-section .ct-hero-inner{display:flex;align-items:center;justify-content:center;max-width:800px;margin:0 auto;gap:1.5rem;}
#uk-corp-section .ct-hero-illust{flex-shrink:0;opacity:.7;}
#uk-corp-section .ct-hero-text{text-align:center;flex:1;}
#uk-corp-section .ct-hero-text h1{font-size:2rem;font-weight:400;color:#1a3b6b;margin:0 0 .5rem;}
#uk-corp-section .ct-hero-text h1 em{font-style:italic;}
.dark #uk-corp-section .ct-hero-text h1{color:var(--text-color);}
#uk-corp-section .ct-hero-text p{font-size:.88rem;color:#555;max-width:440px;margin:0 auto;line-height:1.5;}
.dark #uk-corp-section .ct-hero-text p{color:var(--text-muted);}

/* Wrapper */
#uk-corp-section .ct-wrapper{max-width:720px;margin:0 auto;padding:0 1.5rem 3rem;}

/* Card */
#uk-corp-section .ct-card{background:#fff !important;border:1px solid #e0e0e0 !important;border-radius:8px;padding:2rem 2.25rem;box-shadow:0 2px 8px rgba(0,0,0,.06) !important;margin-top:-1rem;position:relative;z-index:1;}
.dark #uk-corp-section .ct-card{background:var(--bg-surface) !important;border-color:var(--border-color) !important;}

/* Section titles */
#uk-corp-section .ct-section-title{font-size:1.25rem;font-weight:700;margin:0 0 .25rem;color:#1a3b6b !important;border:none !important;}
#uk-corp-section .ct-blue{color:#1a3b6b !important;}
.dark #uk-corp-section .ct-section-title{color:var(--text-color) !important;}
#uk-corp-section .ct-section-sub{font-size:.8rem;color:#888;margin:0 0 1rem;}
#uk-corp-section .ct-section-header{display:flex;justify-content:space-between;align-items:baseline;margin-top:1.75rem;}
#uk-corp-section .ct-section-title2{font-size:.95rem;font-weight:700;color:#333 !important;margin:0;border:none !important;}
.dark #uk-corp-section .ct-section-title2{color:var(--text-color) !important;}
#uk-corp-section .ct-view-link{font-size:.78rem;color:#4a7fd4;text-decoration:none;}
#uk-corp-section .ct-view-link:hover{text-decoration:underline;}

/* Expense rows */
#uk-corp-section .ct-expense-row{display:flex;align-items:center;justify-content:space-between;padding:.6rem 0;border-bottom:1px solid #f3f3f3;gap:1rem;}
.dark #uk-corp-section .ct-expense-row{border-bottom-color:var(--border-color);}
#uk-corp-section .ct-label{font-size:.85rem;color:#333;flex:1;font-weight:500;}
.dark #uk-corp-section .ct-label{color:var(--text-color);}
#uk-corp-section .ct-input-wrap{flex-shrink:0;width:160px;}
#uk-corp-section .ct-input-wrap input[type="number"]{width:160px !important;max-width:160px !important;min-width:160px !important;padding:.4rem .55rem !important;font-size:.88rem !important;border:1px solid #ccc !important;border-radius:3px !important;background:#fff !important;color:#333 !important;box-sizing:border-box !important;text-align:right !important;height:auto !important;}
.dark #uk-corp-section .ct-input-wrap input[type="number"]{background:var(--bg-surface) !important;color:var(--text-color) !important;border-color:var(--border-color) !important;}
#uk-corp-section .ct-input-wrap input:focus{outline:none !important;border-color:#4a7fd4 !important;box-shadow:0 0 0 2px rgba(74,127,212,.12) !important;}
#uk-corp-section .ct-row-menu{background:none !important;border:none !important;color:#bbb;font-size:1.2rem;cursor:pointer;padding:2px 6px !important;box-shadow:none !important;width:auto !important;min-width:auto !important;line-height:1;}
#uk-corp-section .ct-row-menu:hover{color:#e8453c;}

/* Add button */
#uk-corp-section .ct-add-btn{background:none !important;border:none !important;color:#4a7fd4;font-size:.82rem;font-weight:500;cursor:pointer;padding:.5rem 0 !important;display:inline-flex;align-items:center;gap:.3rem;box-shadow:none !important;width:auto !important;}
#uk-corp-section .ct-add-btn:hover{text-decoration:underline;}
#uk-corp-section .ct-add-icon{font-size:1rem;color:#4a7fd4;}

/* Results */
#uk-corp-section .ct-results{margin-top:1.5rem;border-top:2px solid #e8e8e8;padding-top:1rem;}
.dark #uk-corp-section .ct-results{border-top-color:var(--border-color);}
#uk-corp-section .ct-result-row{display:flex;justify-content:space-between;align-items:center;padding:.65rem 0;border-bottom:1px solid #f3f3f3;font-size:.88rem;color:#333;}
.dark #uk-corp-section .ct-result-row{color:var(--text-color);border-bottom-color:var(--border-color);}
#uk-corp-section .ct-result-val{font-size:1rem;font-weight:600;color:#1a3b6b;white-space:nowrap;}

/* Info */
#uk-corp-section .ct-info{margin-top:3rem;padding:0 .5rem;}
#uk-corp-section .ct-info h2{font-size:1.3rem;font-weight:700;color:#1a3b6b;margin:2rem 0 .75rem;}
.dark #uk-corp-section .ct-info h2{color:var(--text-color);}
#uk-corp-section .ct-info p{font-size:.85rem;color:#555;line-height:1.7;margin:0 0 .75rem;}
.dark #uk-corp-section .ct-info p{color:var(--text-muted);}
#uk-corp-section .ct-list-title{font-size:.85rem;color:#4a7fd4;font-weight:600;text-decoration:underline;margin-bottom:.5rem;}
#uk-corp-section .ct-bullet-list{padding-left:1.25rem;margin:0 0 1rem;}
#uk-corp-section .ct-bullet-list li{font-size:.85rem;color:#4a7fd4;line-height:1.8;}

/* Promo */
#uk-corp-section .ct-promo{background:#f5f8ff;border-radius:8px;padding:2rem 2.25rem;margin-top:3rem;text-align:center;}
.dark #uk-corp-section .ct-promo{background:var(--bg-surface);}
#uk-corp-section .ct-promo h2{font-size:1.15rem;font-weight:700;color:#1a3b6b;margin:0 0 .75rem;}
.dark #uk-corp-section .ct-promo h2{color:var(--text-color);}
#uk-corp-section .ct-promo p{font-size:.82rem;color:#555;line-height:1.6;max-width:560px;margin:0 auto;}

/* Features */
#uk-corp-section .ct-features{margin-top:2rem;text-align:center;}
#uk-corp-section .ct-features h3{font-size:1.1rem;font-weight:700;color:#333;margin:0 0 1.5rem;}
.dark #uk-corp-section .ct-features h3{color:var(--text-color);}
#uk-corp-section .ct-features-grid{display:flex;flex-wrap:wrap;justify-content:center;gap:2rem 3rem;}
#uk-corp-section .ct-feat-item{display:flex;flex-direction:column;align-items:center;gap:.5rem;max-width:160px;}
#uk-corp-section .ct-feat-icon{font-size:2rem;color:#4a7fd4;background:#eef3fb;width:56px;height:56px;border-radius:12px;display:flex;align-items:center;justify-content:center;}
#uk-corp-section .ct-feat-item span{font-size:.78rem;color:#555;text-align:center;line-height:1.4;}

/* Responsive */
@media(max-width:640px){
  #uk-corp-section .ct-hero-illust{display:none;}
  #uk-corp-section .ct-expense-row{flex-wrap:wrap;gap:.4rem;}
  #uk-corp-section .ct-input-wrap{width:100%;}
  #uk-corp-section .ct-input-wrap input[type="number"]{width:100% !important;max-width:100% !important;min-width:100% !important;}
  #uk-corp-section .ct-wrapper{padding:0 .75rem 2rem;}
  #uk-corp-section .ct-card{padding:1.25rem;}
  #uk-corp-section .ct-features-grid{gap:1.5rem;}
}
'''

# ============================================================
# JS
# ============================================================
JS = r'''/* uk_corp.js — UK Corporation Tax Calculator */
document.addEventListener("DOMContentLoaded",function(){
  var turnover=document.getElementById("ctTurnover");
  var profitEl=document.getElementById("ctProfitBefore");
  var taxEl=document.getElementById("ctTaxAmount");
  var allowedRows=document.getElementById("ctAllowedRows");
  var addBackRows=document.getElementById("ctAddBackRows");
  var addAllowedBtn=document.getElementById("ctAddAllowed");
  var addAddBackBtn=document.getElementById("ctAddAddBack");

  function fmt(n){return"\u00A3 "+Math.abs(n).toLocaleString("en-GB",{minimumFractionDigits:2,maximumFractionDigits:2});}

  function calc(){
    var t=parseFloat(turnover?turnover.value:0)||0;
    var ae=0,ab=0;
    document.querySelectorAll(".ct-allowed").forEach(function(i){ae+=parseFloat(i.value)||0;});
    document.querySelectorAll(".ct-addback").forEach(function(i){ab+=parseFloat(i.value)||0;});
    var profit=t-ae+ab;
    var tax=profit>0?profit*0.19:0;
    if(profitEl)profitEl.textContent=(profit<0?"- ":"")+fmt(profit);
    if(taxEl)taxEl.textContent=fmt(tax);
  }

  // Live calc on any input change
  document.querySelector("#uk-corp-section").addEventListener("input",calc);

  var allowedExamples=["Rent","Insurance","Utilities","Marketing","Software","Equipment","Professional Services","Heating","Repairs","Stationery"];
  var addBackExamples=["Personal Expenses","Non-Business Costs","Capital Expenditure","Legal Fines","Charitable Donations"];
  var aeIdx=0,abIdx=0;

  function createRow(container,cls,name){
    var row=document.createElement("div");
    row.className="ct-expense-row";
    row.innerHTML='<span class="ct-label">'+name+'</span><div class="ct-input-wrap"><input type="number" class="'+cls+'" placeholder="" min="0" step="0.01" value=""></div><button class="ct-row-menu" title="Remove">&#8943;</button>';
    container.appendChild(row);
    row.querySelector(".ct-row-menu").addEventListener("click",function(){row.remove();calc();});
    row.querySelector("input").focus();
  }

  // Wire up default remove buttons
  document.querySelectorAll("#ctAllowedRows .ct-row-menu").forEach(function(b){
    b.addEventListener("click",function(){b.closest(".ct-expense-row").remove();calc();});
  });
  document.querySelectorAll("#ctAddBackRows .ct-row-menu").forEach(function(b){
    b.addEventListener("click",function(){b.closest(".ct-expense-row").remove();calc();});
  });

  if(addAllowedBtn) addAllowedBtn.addEventListener("click",function(){
    var name=allowedExamples[aeIdx%allowedExamples.length];aeIdx++;
    createRow(allowedRows,"ct-allowed",name);
  });
  if(addAddBackBtn) addAddBackBtn.addEventListener("click",function(){
    var name=addBackExamples[abIdx%addBackExamples.length];abIdx++;
    createRow(addBackRows,"ct-addback",name);
  });

  calc();
});
'''


def inject_html(fp, css_prefix, js_prefix):
    with open(fp, 'r', encoding='utf-8') as f:
        c = f.read()
    if 'id="uk-corp-section"' in c:
        c = re.sub(r'\s*<!-- Section: UK Corporation Tax Calculator -->.*?</section>', '', c, flags=re.DOTALL)
    # Insert before coming-soon or at end of sections
    for marker in ['<!-- Section: HMRC Furlough', '<!-- Section: Income Tax', '<!-- Section: Paycheck', 'id="coming-soon-section"']:
        if marker in c:
            c = c.replace(marker, HTML + '\n      ' + marker)
            break
    # CSS link
    css_tag = f'<link rel="stylesheet" href="{css_prefix}uk_corp.css">'
    if css_tag not in c:
        c = c.replace('</head>', f'  {css_tag}\n  </head>')
    # JS tag
    js_tag = f'<script src="{js_prefix}uk_corp.js"></script>'
    if js_tag not in c:
        c = c.replace('</body>', f'  {js_tag}\n  </body>')
    with open(fp, 'w', encoding='utf-8') as f:
        f.write(c)
    print(f'  HTML: {fp}')


def add_backend_route(fp):
    with open(fp, 'r', encoding='utf-8') as f:
        c = f.read()
    if 'uk-corp-tax' in c or 'uk_corp' in c:
        print(f'  Backend route already exists: {fp}')
        return
    c = c.replace(
        '# HMRC Furlough Claim Calculator page',
        '# UK Corporation Tax Calculator page\n@app.route("/uk-corp-tax-calculator")\n@app.route("/in/payroll/uk-corp-tax-calculator/")\ndef uk_corp_tax_page():\n    return render_template("index.html")\n\n# HMRC Furlough Claim Calculator page'
    )
    with open(fp, 'w', encoding='utf-8') as f:
        f.write(c)
    print(f'  Backend: {fp}')


def main():
    print('=== Building UK Corporation Tax Calculator ===\n')

    # CSS
    print('[1/5] CSS...')
    with open('static/css/uk_corp.css', 'w', encoding='utf-8') as f:
        f.write(CSS)
    shutil.copy2('static/css/uk_corp.css', '../dist/css/uk_corp.css')
    print('  Done')

    # JS
    print('[2/5] JS...')
    with open('static/js/uk_corp.js', 'w', encoding='utf-8') as f:
        f.write(JS)
    shutil.copy2('static/js/uk_corp.js', '../dist/js/uk_corp.js')
    print('  Done')

    # Backend
    print('[3/5] Backend route...')
    add_backend_route('app.py')

    # Templates HTML
    print('[4/5] templates/index.html...')
    inject_html('templates/index.html', '/static/css/', '/static/js/')

    # Dist HTML
    print('[5/5] dist/index.html...')
    inject_html('../dist/index.html', '/css/', '/js/')

    # Verify
    print('\nVerification:')
    for p, l in [('../dist/index.html', 'HTML'), ('../dist/css/uk_corp.css', 'CSS'), ('../dist/js/uk_corp.js', 'JS')]:
        with open(p, 'r', encoding='utf-8') as f:
            ok = 'uk-corp-section' in f.read() or 'ct-hero' in f.read() or 'ctTurnover' in open(p,'r',encoding='utf-8').read()
        print(f'  {l}: {"OK" if ok else "MISSING"}')

    # Check dist router
    with open('../dist/js/app.js', 'r', encoding='utf-8') as f:
        c = f.read()
    print(f'  Dist router: {"OK" if "uk-corp" in c else "NEEDS PATCH"}')

    print('\n=== BUILD COMPLETE ===')
    print('\nFiles created:')
    print('  static/css/uk_corp.css')
    print('  static/js/uk_corp.js')
    print('  ../dist/css/uk_corp.css')
    print('  ../dist/js/uk_corp.js')
    print('\nFiles modified:')
    print('  templates/index.html (added section + links)')
    print('  ../dist/index.html (added section + links)')
    print('  app.py (added Flask route)')

if __name__ == '__main__':
    main()
