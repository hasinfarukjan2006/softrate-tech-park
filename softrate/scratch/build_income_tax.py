#!/usr/bin/env python3
"""Build script for Income Tax Calculator — deploys to templates + dist."""
import os, re, shutil

# ============================================================
# HTML
# ============================================================
IT_HTML = r'''
      <!-- Section: Income Tax Calculator -->
      <section id="income-tax-section" class="content-section mt-8 hide">

        <!-- Hero (peach bg) -->
        <div class="it-hero">
          <h1>Income Tax Calculator</h1>
          <p>A comparative tool that helps you calculate income tax according to both the old and new tax regime. Use this online income tax calculator to know your tax liabilities.</p>
          <div class="it-fy-toggle">
            <button class="it-fy-btn" data-fy="prev" id="itFyPrev">PREVIOUS FY(2025-2026)</button>
            <button class="it-fy-btn active" data-fy="curr" id="itFyCurr">CURRENT FY(2026-2027)</button>
          </div>
        </div>

        <div class="it-wrapper">
          <div class="it-card">

            <!-- Income -->
            <div class="it-row">
              <label class="it-label it-orange">Yearly income from salary</label>
              <div class="it-input-right"><input type="number" id="itSalary" value="0" min="0"></div>
            </div>

            <div class="it-row">
              <label class="it-label">Age</label>
              <div class="it-input-right">
                <select id="itAge">
                  <option value="below60">Less than 60</option>
                  <option value="60to80">60 to 80</option>
                  <option value="above80">Above 80</option>
                </select>
              </div>
            </div>

            <div class="it-row">
              <a href="javascript:void(0)" class="it-expand-link" id="itOtherToggle">+Income from other sources <span class="it-hint">(interest on FD and let out property)</span></a>
            </div>
            <div class="it-other-sources hide" id="itOtherPanel">
              <div class="it-row">
                <label class="it-label">Interest on Fixed Deposits</label>
                <div class="it-input-right"><input type="number" id="itFdIncome" value="0" min="0"></div>
              </div>
              <div class="it-row">
                <label class="it-label">Rental Income</label>
                <div class="it-input-right"><input type="number" id="itRentalIncome" value="0" min="0"></div>
              </div>
              <div class="it-row">
                <label class="it-label">Other Income</label>
                <div class="it-input-right"><input type="number" id="itOtherIncome" value="0" min="0"></div>
              </div>
            </div>

            <!-- Exemption Details -->
            <h3 class="it-section-head">Exemption details <span class="it-info" title="Applicable under Old Tax Regime">&#9432;</span></h3>

            <div class="it-row">
              <label class="it-label">HRA and other exemptions</label>
              <div class="it-input-right"><input type="number" id="itHRA" value="0" min="0"></div>
            </div>

            <div class="it-row">
              <label class="it-label">Interest paid on housing loan</label>
              <div class="it-input-right">
                <input type="number" id="itHomeLoan" value="0" min="0">
                <span class="it-limit">Exemption Limit : &#8377;2,00,000</span>
              </div>
            </div>

            <div class="it-row">
              <label class="it-label"><strong>Section 123</strong> <span class="it-sub">(PF, PPF, Insurance premium)</span></label>
              <div class="it-input-right">
                <input type="number" id="it80C" value="0" min="0">
                <span class="it-limit">Exemption Limit : &#8377;1,50,000</span>
              </div>
            </div>

            <div class="it-row">
              <label class="it-label"><strong>Section 124</strong> <span class="it-sub">(Employer's contribution to NPS)</span></label>
              <div class="it-input-right">
                <input type="number" id="it80CCD1" value="0" min="0">
                <span class="it-limit">Exemption Limit : &#8377;1,50,000</span>
              </div>
            </div>

            <div class="it-row">
              <label class="it-label"><strong>Section 124(1B)</strong> <span class="it-sub">(Additional contribution to NPS)</span></label>
              <div class="it-input-right">
                <input type="number" id="it80CCD1B" value="0" min="0">
                <span class="it-limit">Exemption Limit : &#8377;50,000</span>
              </div>
            </div>

            <div class="it-row">
              <label class="it-label"><strong>Section 126</strong> <span class="it-sub">(Medical insurance premium)</span></label>
              <div class="it-input-right"><input type="number" id="it80D" value="0" min="0"></div>
            </div>

            <div class="it-row">
              <label class="it-label"><strong>Section 129</strong> <span class="it-sub">(Interest paid on education loan)</span></label>
              <div class="it-input-right"><input type="number" id="it80E" value="0" min="0"></div>
            </div>

            <div class="it-row">
              <label class="it-label"><strong>Section 131</strong> <span class="it-sub">(Interest paid on home loan for affordable housing)</span></label>
              <div class="it-input-right">
                <input type="number" id="it80EE" value="0" min="0">
                <span class="it-limit">Exemption Limit : &#8377;1,50,000</span>
              </div>
            </div>

            <div class="it-row">
              <label class="it-label"><strong>Section 132</strong> <span class="it-sub">(Interest paid on loan for purchase of electrical vehicle)</span></label>
              <div class="it-input-right">
                <input type="number" id="it80EEB" value="0" min="0">
                <span class="it-limit">Exemption Limit : &#8377;1,50,000</span>
              </div>
            </div>

            <div class="it-row">
              <label class="it-label"><strong>Section 133</strong> <span class="it-sub">(Donations to charity)</span></label>
              <div class="it-input-right"><input type="number" id="it80G" value="0" min="0"></div>
            </div>

            <!-- Calculate -->
            <div class="it-calc-wrap">
              <button type="button" class="it-calc-btn" id="itCalcBtn">Calculate income tax</button>
            </div>

          </div><!-- /.it-card -->

          <!-- Disclaimer -->
          <p class="it-disclaimer"><strong>Disclaimer:</strong> Softrate has taken great care and has made every attempt to ensure that the information obtained from the tool is accurate. However, Softrate is not responsible for any errors or omissions and provides no guarantee or warranty on the correctness of the results obtained from the tool. By using this tool you agree not to hold Softrate liable for any issues that arise from incorrect results obtained.</p>

          <!-- Results -->
          <div class="it-results hide" id="itResults"></div>

          <!-- FAQ -->
          <div class="it-faq">
            <h2>Frequently Asked Questions</h2>
            <div class="it-faq-item"><button class="it-faq-q">+ &nbsp;What is the Income Tax Calculator?</button><div class="it-faq-a hide"><p>The Income Tax Calculator is a free online tool that helps individuals estimate their tax liability based on the latest tax slabs and rules. It allows you to compare taxes under both the old and new tax regimes to make informed financial decisions.</p></div></div>
            <div class="it-faq-item"><button class="it-faq-q">+ &nbsp;Why have we come up with the Income Tax Calculator?</button><div class="it-faq-a hide"><p>We created this tool to simplify income tax calculation for salaried individuals and help them understand the impact of various deductions and exemptions available under the Indian tax system.</p></div></div>
            <div class="it-faq-item"><button class="it-faq-q">+ &nbsp;How the Income Tax Calculator can be used?</button><div class="it-faq-a hide"><p>Simply enter your annual salary, age, other income sources, and applicable deductions. Click "Calculate income tax" to see a detailed comparison of your tax liability under both the old and new tax regimes.</p></div></div>
            <div class="it-faq-item"><button class="it-faq-q">+ &nbsp;What are the salary slabs for old tax regime?</button><div class="it-faq-a hide"><p>Under the old tax regime: Up to &#8377;2.5 lakh — Nil; &#8377;2.5–5 lakh — 5%; &#8377;5–10 lakh — 20%; Above &#8377;10 lakh — 30%. Senior citizens (60-80) get a higher basic exemption of &#8377;3 lakh, and super senior citizens (80+) get &#8377;5 lakh.</p></div></div>
            <div class="it-faq-item"><button class="it-faq-q">+ &nbsp;What are the income tax slabs for the new regime announced in the Union Budget 2026-2027?</button><div class="it-faq-a hide"><p>Under the new tax regime for FY 2026-27: Up to &#8377;4 lakh — Nil; &#8377;4–8 lakh — 5%; &#8377;8–12 lakh — 10%; &#8377;12–16 lakh — 15%; &#8377;16–20 lakh — 20%; &#8377;20–24 lakh — 25%; Above &#8377;24 lakh — 30%. A standard deduction of &#8377;75,000 is available.</p></div></div>
            <div class="it-faq-item"><button class="it-faq-q">+ &nbsp;What was the standard deduction specified in the Union Budget of 2026?</button><div class="it-faq-a hide"><p>The standard deduction under the new tax regime has been set at &#8377;75,000 for salaried individuals and pensioners as per the Union Budget 2026.</p></div></div>
          </div>

        </div><!-- /.it-wrapper -->
      </section>
'''

# ============================================================
# CSS
# ============================================================
IT_CSS = r'''/* income_tax.css — Zoho reference match */

.it-hero{text-align:center;padding:2.5rem 1.5rem 1.5rem;background:#fff5f0;}
.dark .it-hero{background:var(--bg-color);}
.it-hero h1{font-size:2.2rem;font-weight:400;color:#333;margin:0 0 .75rem;}
.dark .it-hero h1{color:var(--text-color);}
.it-hero p{font-size:.88rem;color:#555;max-width:560px;margin:0 auto .75rem;line-height:1.5;}
.dark .it-hero p{color:var(--text-muted);}
.it-fy-toggle{display:inline-flex;border:1px solid #ddd;border-radius:4px;overflow:hidden;margin-top:.5rem;}
.it-fy-btn{background:#fff;border:none;padding:.45rem 1rem;font-size:.78rem;font-weight:600;color:#555;cursor:pointer;transition:all .2s;}
.it-fy-btn.active{background:#e8453c;color:#fff;}
.dark .it-fy-btn{background:var(--bg-surface);color:var(--text-muted);border-color:var(--border-color);}
.dark .it-fy-btn.active{background:#e8453c;color:#fff;}

.it-wrapper{max-width:720px;margin:0 auto;padding:0 1.5rem 3rem;}
.it-card{background:#fff;border:1px solid #e8e8e8;border-radius:6px;padding:2rem 2.25rem;box-shadow:0 1px 4px rgba(0,0,0,.06);margin-top:-1rem;}
.dark .it-card{background:var(--bg-surface);border-color:var(--border-color);}

.it-row{display:flex;align-items:flex-start;justify-content:space-between;padding:.7rem 0;border-bottom:1px solid #f3f3f3;gap:1rem;}
.dark .it-row{border-bottom-color:var(--border-color);}
.it-label{font-size:.85rem;color:#333;flex:1;padding-top:.35rem;}
.dark .it-label{color:var(--text-color);}
.it-label strong{color:#333;}
.dark .it-label strong{color:var(--text-color);}
.it-sub{font-size:.78rem;color:#888;font-weight:400;}
.dark .it-sub{color:var(--text-muted);}
.it-orange{color:#e8453c;font-weight:600;}
.it-input-right{display:flex;flex-direction:column;align-items:flex-end;min-width:160px;}
.it-input-right input,.it-input-right select{width:160px;padding:.4rem .55rem;font-size:.88rem;border:1px solid #ccc;border-radius:3px;background:#fff;color:#333;box-sizing:border-box;text-align:right;}
.dark .it-input-right input,.dark .it-input-right select{background:var(--bg-surface);color:var(--text-color);border-color:var(--border-color);}
.it-input-right input:focus,.it-input-right select:focus{outline:none;border-color:#4a90d9;box-shadow:0 0 0 2px rgba(74,144,217,.12);}
.it-limit{font-size:.7rem;color:#888;margin-top:.2rem;}
.dark .it-limit{color:var(--text-muted);}

.it-section-head{font-size:.95rem;font-weight:600;color:#e8453c;margin:1.5rem 0 .5rem;padding:0;}
.it-info{color:#bbb;cursor:help;font-size:.85rem;}
.it-expand-link{font-size:.82rem;color:#4a90d9;text-decoration:none;cursor:pointer;}
.it-expand-link:hover{text-decoration:underline;}
.it-hint{color:#aaa;font-size:.75rem;}
.it-other-sources{padding-left:1rem;border-left:2px solid #f0f0f0;margin-bottom:.5rem;}
.dark .it-other-sources{border-left-color:var(--border-color);}

.it-calc-wrap{text-align:left;margin-top:1.5rem;}
.it-calc-btn{background:#e8453c;color:#fff;border:none;border-radius:3px;padding:.55rem 1.75rem;font-size:.88rem;font-weight:600;cursor:pointer;transition:background .2s;}
.it-calc-btn:hover{background:#d13a32;}

.it-disclaimer{font-size:.72rem;color:#888;text-align:center;margin-top:1.25rem;line-height:1.5;max-width:680px;margin-left:auto;margin-right:auto;}
.dark .it-disclaimer{color:var(--text-muted);}

/* Results */
.it-results{background:#fff;border:1px solid #e8e8e8;border-radius:6px;padding:2rem;margin-top:1.5rem;box-shadow:0 1px 4px rgba(0,0,0,.06);animation:itSlide .35s ease-out;}
.dark .it-results{background:var(--bg-surface);border-color:var(--border-color);}
@keyframes itSlide{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}
.it-res-title{font-size:1.1rem;font-weight:600;color:#333;margin:0 0 1rem;text-align:center;}
.dark .it-res-title{color:var(--text-color);}
.it-compare{display:grid;grid-template-columns:2fr 1fr 1fr;gap:0;border:1px solid #e8e8e8;border-radius:4px;overflow:hidden;}
.dark .it-compare{border-color:var(--border-color);}
.it-compare .it-ch{background:#f9f9f9;font-size:.78rem;font-weight:600;color:#555;padding:.6rem .75rem;border-bottom:1px solid #e8e8e8;}
.dark .it-compare .it-ch{background:var(--bg-color);color:var(--text-muted);border-bottom-color:var(--border-color);}
.it-compare .it-cd{font-size:.82rem;color:#555;padding:.55rem .75rem;border-bottom:1px solid #f0f0f0;}
.dark .it-compare .it-cd{color:var(--text-muted);border-bottom-color:var(--border-color);}
.it-compare .it-cd:nth-child(3n+2){font-weight:500;}
.it-compare .it-cd:nth-child(3n){font-weight:500;}
.it-compare .it-highlight{background:#f0fdf4;font-weight:700;color:#10b981;}
.dark .it-compare .it-highlight{background:rgba(16,185,129,.1);}
.it-regime-rec{text-align:center;margin-top:1rem;font-size:.88rem;font-weight:600;color:#10b981;}
.it-res-actions{text-align:center;margin-top:1rem;}
.it-res-btn{background:#fff;color:#555;border:1px solid #ccc;border-radius:3px;padding:.4rem 1rem;font-size:.8rem;cursor:pointer;}
.dark .it-res-btn{background:var(--bg-surface);color:var(--text-color);border-color:var(--border-color);}
.it-res-btn:hover{background:#f5f5f5;}

/* FAQ */
.it-faq{margin-top:3rem;}
.it-faq h2{text-align:center;font-size:1.5rem;font-weight:400;color:#333;margin-bottom:1.5rem;}
.dark .it-faq h2{color:var(--text-color);}
.it-faq-item{border-bottom:1px solid #e8e8e8;}
.dark .it-faq-item{border-bottom-color:var(--border-color);}
.it-faq-q{background:none;border:none;width:100%;text-align:left;padding:.85rem 0;font-size:.88rem;color:#333;cursor:pointer;font-weight:400;}
.dark .it-faq-q{color:var(--text-color);}
.it-faq-q:hover{color:#e8453c;}
.it-faq-a{padding:0 0 .85rem 1.25rem;}
.it-faq-a p{font-size:.82rem;color:#666;line-height:1.6;margin:0;}
.dark .it-faq-a p{color:var(--text-muted);}

@media(max-width:640px){
  .it-row{flex-direction:column;gap:.4rem;}
  .it-input-right{align-items:stretch;min-width:100%;}
  .it-input-right input,.it-input-right select{width:100%;}
  .it-compare{grid-template-columns:1fr;}
  .it-wrapper{padding:0 .75rem 2rem;}
  .it-card{padding:1.25rem;}
}
'''

# ============================================================
# JS
# ============================================================
IT_JS = r'''/* income_tax.js — Income Tax Calculator */
document.addEventListener("DOMContentLoaded",function(){
  var fyPrev=document.getElementById("itFyPrev");
  var fyCurr=document.getElementById("itFyCurr");
  var otherToggle=document.getElementById("itOtherToggle");
  var otherPanel=document.getElementById("itOtherPanel");
  var calcBtn=document.getElementById("itCalcBtn");
  var resultsDiv=document.getElementById("itResults");

  // FY toggle
  if(fyPrev&&fyCurr){
    fyPrev.addEventListener("click",function(){fyPrev.classList.add("active");fyCurr.classList.remove("active");});
    fyCurr.addEventListener("click",function(){fyCurr.classList.add("active");fyPrev.classList.remove("active");});
  }

  // Other sources toggle
  if(otherToggle&&otherPanel){
    otherToggle.addEventListener("click",function(){otherPanel.classList.toggle("hide");});
  }

  // FAQ accordion
  document.querySelectorAll(".it-faq-q").forEach(function(btn){
    btn.addEventListener("click",function(){
      var ans=btn.nextElementSibling;
      if(ans){ans.classList.toggle("hide");btn.textContent=ans.classList.contains("hide")?"+ "+btn.textContent.substring(2):"− "+btn.textContent.substring(2);}
    });
  });

  function v(id){var e=document.getElementById(id);if(!e)return 0;var n=parseFloat(e.value);return isNaN(n)||n<0?0:n;}
  function fmt(n){return "₹"+n.toLocaleString("en-IN",{maximumFractionDigits:0});}

  if(calcBtn) calcBtn.addEventListener("click",function(){
    var salary=v("itSalary");
    var age=document.getElementById("itAge")?document.getElementById("itAge").value:"below60";
    var fdInc=v("itFdIncome"),rentalInc=v("itRentalIncome"),otherInc=v("itOtherIncome");
    var totalOther=fdInc+rentalInc+otherInc;
    var grossIncome=salary+totalOther;

    // Deductions (Old Regime)
    var hra=v("itHRA");
    var homeLoan=Math.min(v("itHomeLoan"),200000);
    var s80C=Math.min(v("it80C"),150000);
    var s80CCD1=Math.min(v("it80CCD1"),150000);
    var s80CCD1B=Math.min(v("it80CCD1B"),50000);
    var s80D=v("it80D");
    var s80E=v("it80E");
    var s80EE=Math.min(v("it80EE"),150000);
    var s80EEB=Math.min(v("it80EEB"),150000);
    var s80G=v("it80G");

    var totalDeductions=hra+homeLoan+s80C+s80CCD1+s80CCD1B+s80D+s80E+s80EE+s80EEB+s80G;

    // Standard deduction
    var stdDedOld=50000;
    var stdDedNew=75000;

    // OLD REGIME
    var taxableOld=Math.max(0,grossIncome-stdDedOld-totalDeductions);
    var taxOld=0;
    var exemptOld=age==="above80"?500000:age==="60to80"?300000:250000;
    if(taxableOld>exemptOld){
      if(age==="above80"){
        if(taxableOld>1000000)taxOld=(taxableOld-1000000)*.30+100000;
        else if(taxableOld>500000)taxOld=(taxableOld-500000)*.20;
      }else if(age==="60to80"){
        if(taxableOld>1000000)taxOld=(taxableOld-1000000)*.30+140000;
        else if(taxableOld>500000)taxOld=(taxableOld-500000)*.20+10000;
        else if(taxableOld>300000)taxOld=(taxableOld-300000)*.05;
      }else{
        if(taxableOld>1000000)taxOld=(taxableOld-1000000)*.30+112500;
        else if(taxableOld>500000)taxOld=(taxableOld-500000)*.20+12500;
        else if(taxableOld>250000)taxOld=(taxableOld-250000)*.05;
      }
    }
    // Rebate 87A old
    if(taxableOld<=500000)taxOld=0;
    var cessOld=taxOld*.04;
    var totalTaxOld=taxOld+cessOld;

    // NEW REGIME (FY 2026-27)
    var taxableNew=Math.max(0,grossIncome-stdDedNew);
    var taxNew=0;
    if(taxableNew>2400000)taxNew=(taxableNew-2400000)*.30+330000;
    else if(taxableNew>2000000)taxNew=(taxableNew-2000000)*.25+230000;
    else if(taxableNew>1600000)taxNew=(taxableNew-1600000)*.20+150000;
    else if(taxableNew>1200000)taxNew=(taxableNew-1200000)*.15+90000;
    else if(taxableNew>800000)taxNew=(taxableNew-800000)*.10+50000;
    else if(taxableNew>400000)taxNew=(taxableNew-400000)*.05;

    // Rebate 87A new — income up to 12 lakh (taxable up to 12,75,000 with std ded)
    if(grossIncome<=1200000)taxNew=0;
    var cessNew=taxNew*.04;
    var totalTaxNew=taxNew+cessNew;

    var savings=Math.abs(totalTaxOld-totalTaxNew);
    var recommended=totalTaxNew<=totalTaxOld?"New Regime":"Old Regime";

    resultsDiv.innerHTML='<h3 class="it-res-title">Tax Comparison — Old vs New Regime</h3>'
      +'<div class="it-compare">'
      +'<div class="it-ch">Particulars</div><div class="it-ch">Old Regime</div><div class="it-ch">New Regime</div>'
      +'<div class="it-cd">Gross Income</div><div class="it-cd">'+fmt(grossIncome)+'</div><div class="it-cd">'+fmt(grossIncome)+'</div>'
      +'<div class="it-cd">Standard Deduction</div><div class="it-cd">'+fmt(stdDedOld)+'</div><div class="it-cd">'+fmt(stdDedNew)+'</div>'
      +'<div class="it-cd">Other Deductions (80C, 80D, etc.)</div><div class="it-cd">'+fmt(totalDeductions)+'</div><div class="it-cd">'+fmt(0)+'</div>'
      +'<div class="it-cd"><strong>Taxable Income</strong></div><div class="it-cd"><strong>'+fmt(taxableOld)+'</strong></div><div class="it-cd"><strong>'+fmt(taxableNew)+'</strong></div>'
      +'<div class="it-cd">Income Tax</div><div class="it-cd">'+fmt(taxOld)+'</div><div class="it-cd">'+fmt(taxNew)+'</div>'
      +'<div class="it-cd">Cess (4%)</div><div class="it-cd">'+fmt(cessOld)+'</div><div class="it-cd">'+fmt(cessNew)+'</div>'
      +'<div class="it-cd"><strong>Total Tax</strong></div><div class="it-cd '+(totalTaxOld<=totalTaxNew?"it-highlight":"")+'"><strong>'+fmt(totalTaxOld)+'</strong></div><div class="it-cd '+(totalTaxNew<=totalTaxOld?"it-highlight":"")+'"><strong>'+fmt(totalTaxNew)+'</strong></div>'
      +'</div>'
      +'<p class="it-regime-rec">&#10003; Recommended: '+recommended+' (You save '+fmt(savings)+')</p>'
      +'<div class="it-res-actions"><button class="it-res-btn" onclick="window.print()">&#128424; Print</button></div>';
    resultsDiv.classList.remove("hide");
    resultsDiv.scrollIntoView({behavior:"smooth",block:"start"});
  });
});
'''


def patch_html(filepath, css_pref, js_pref):
    with open(filepath,'r',encoding='utf-8') as f: content=f.read()
    # Remove old section
    if 'id="income-tax-section"' in content:
        content=re.sub(r'\s*<!-- Section: Income Tax Calculator -->.*?</section>\s*','',content,flags=re.DOTALL)
    # Insert before Paycheck or Gratuity or Coming Soon
    for marker in ['<!-- Section: Paycheck Calculator -->','<!-- Section: Gratuity Calculator -->','id="coming-soon-section"']:
        if marker in content:
            content=content.replace(marker, IT_HTML+'\n      '+marker)
            break
    # CSS
    css_tag=f'<link rel="stylesheet" href="{css_pref}income_tax.css">'
    if css_tag not in content:
        for ref in [f'{css_pref}paycheck.css">',f'{css_pref}financial_report.css">']:
            if ref in content:
                content=content.replace(f'<link rel="stylesheet" href="{ref[:-1]}',f'<link rel="stylesheet" href="{ref[:-1]}\n  {css_tag}')
                break
        else:
            content=content.replace('</head>',f'  {css_tag}\n  </head>')
    # JS
    js_tag=f'<script src="{js_pref}income_tax.js"></script>'
    if js_tag not in content:
        for ref in [f'{js_pref}paycheck.js"></script>',f'{js_pref}financial_report.js"></script>']:
            if ref in content:
                content=content.replace(ref,ref+'\n  '+js_tag)
                break
        else:
            content=content.replace('</body>',f'  {js_tag}\n  </body>')
    with open(filepath,'w',encoding='utf-8') as f: f.write(content)
    print(f'  HTML: {filepath}')


def patch_appjs(filepath):
    with open(filepath,'r',encoding='utf-8') as f: content=f.read()
    if 'income-tax-section' in content:
        print(f'  Already patched: {filepath}'); return
    # Add section var
    if 'paycheckSection' in content:
        content=content.replace(
            'const paycheckSection = document.getElementById("paycheck-section");',
            'const paycheckSection = document.getElementById("paycheck-section");\n    const incomeTaxSection = document.getElementById("income-tax-section");')
        content=content.replace(
            'if (paycheckSection) paycheckSection.classList.add("hide");',
            'if (paycheckSection) paycheckSection.classList.add("hide");\n    if (incomeTaxSection) incomeTaxSection.classList.add("hide");')
    elif 'perDiemSection' in content:
        content=content.replace(
            'const perDiemSection = document.getElementById("per-diem-section");',
            'const perDiemSection = document.getElementById("per-diem-section");\n    const incomeTaxSection = document.getElementById("income-tax-section");')
        content=content.replace(
            'if (perDiemSection) perDiemSection.classList.add("hide");',
            'if (perDiemSection) perDiemSection.classList.add("hide");\n    if (incomeTaxSection) incomeTaxSection.classList.add("hide");')
    # Add route
    coming_soon='} else {\n      if (comingSoonSection) comingSoonSection.classList.remove("hide");'
    if coming_soon in content:
        content=content.replace(coming_soon,
            '} else if (route === "income-tax" || route === "income-tax-calculator") {\n      if (incomeTaxSection) incomeTaxSection.classList.remove("hide");\n      if (incomeTaxSection) incomeTaxSection.scrollIntoView({ behavior: "smooth" });\n    '+coming_soon)
    with open(filepath,'w',encoding='utf-8') as f: f.write(content)
    print(f'  Router: {filepath}')


def patch_source_appjs(filepath):
    with open(filepath,'r',encoding='utf-8') as f: content=f.read()
    if 'income-tax-section' in content:
        print(f'  Already patched: {filepath}'); return
    # Path resolution
    content=content.replace(
        'else if (path === "/in/payroll/paycheck-calculator/" || path === "/paycheck-calculator") activeRouteStr = "paycheck";',
        'else if (path === "/in/payroll/paycheck-calculator/" || path === "/paycheck-calculator") activeRouteStr = "paycheck";\n      else if (path === "/in/payroll/income-tax-calculator/" || path === "/income-tax-calculator") activeRouteStr = "income-tax";')
    # Route flag
    content=content.replace(
        'const isPaycheckRoute = (activeRouteStr === "paycheck" || activeRouteStr === "paycheck-calculator");',
        'const isPaycheckRoute = (activeRouteStr === "paycheck" || activeRouteStr === "paycheck-calculator");\n    const isIncomeTaxRoute = (activeRouteStr === "income-tax" || activeRouteStr === "income-tax-calculator");')
    # History push
    content=content.replace(
        '} else if (isPaycheckRoute) {\n      if (updateHistory) {\n        if (window.location.pathname !== "/in/payroll/paycheck-calculator/") {\n          window.history.pushState({ route: "paycheck" }, "", "/in/payroll/paycheck-calculator/");\n        }\n      }',
        '} else if (isPaycheckRoute) {\n      if (updateHistory) {\n        if (window.location.pathname !== "/in/payroll/paycheck-calculator/") {\n          window.history.pushState({ route: "paycheck" }, "", "/in/payroll/paycheck-calculator/");\n        }\n      }\n    } else if (isIncomeTaxRoute) {\n      if (updateHistory) {\n        if (window.location.pathname !== "/in/payroll/income-tax-calculator/") {\n          window.history.pushState({ route: "income-tax" }, "", "/in/payroll/income-tax-calculator/");\n        }\n      }')
    # Sidebar active
    content=content.replace(
        '} else if (isPaycheckRoute && (route === "paycheck" || route === "paycheck-calculator")) {\n        const paycheckLink = Array.from(links).find(l => l.getAttribute("data-route") === "paycheck");\n        if (paycheckLink) paycheckLink.classList.add("active");\n      } else {',
        '} else if (isPaycheckRoute && (route === "paycheck" || route === "paycheck-calculator")) {\n        const paycheckLink = Array.from(links).find(l => l.getAttribute("data-route") === "paycheck");\n        if (paycheckLink) paycheckLink.classList.add("active");\n      } else if (isIncomeTaxRoute && (route === "income-tax" || route === "income-tax-calculator")) {\n        const itLink = Array.from(links).find(l => l.getAttribute("data-route") === "income-tax");\n        if (itLink) itLink.classList.add("active");\n      } else {')
    # Title
    content=content.replace(
        '} else if (isPaycheckRoute) {\n      labelText = "Paycheck Calculator";\n    }',
        '} else if (isPaycheckRoute) {\n      labelText = "Paycheck Calculator";\n    } else if (isIncomeTaxRoute) {\n      labelText = "Income Tax Calculator";\n    }')
    # Section var + hide
    content=content.replace(
        'const paycheckSection = document.getElementById("paycheck-section");',
        'const paycheckSection = document.getElementById("paycheck-section");\n    const incomeTaxSection = document.getElementById("income-tax-section");')
    content=content.replace(
        'if (paycheckSection) paycheckSection.classList.add("hide");',
        'if (paycheckSection) paycheckSection.classList.add("hide");\n    if (incomeTaxSection) incomeTaxSection.classList.add("hide");')
    # Show route
    content=content.replace(
        '} else if (isPaycheckRoute && (route === "paycheck" || route === "paycheck-calculator")) {\n      if (paycheckSection) paycheckSection.classList.remove("hide");\n      if (paycheckSection) paycheckSection.scrollIntoView({ behavior: "smooth" });\n      document.dispatchEvent(new CustomEvent("paycheckRouteLoaded"));\n    } else if (route === "gst") {',
        '} else if (isPaycheckRoute && (route === "paycheck" || route === "paycheck-calculator")) {\n      if (paycheckSection) paycheckSection.classList.remove("hide");\n      if (paycheckSection) paycheckSection.scrollIntoView({ behavior: "smooth" });\n      document.dispatchEvent(new CustomEvent("paycheckRouteLoaded"));\n    } else if (isIncomeTaxRoute && (route === "income-tax" || route === "income-tax-calculator")) {\n      if (incomeTaxSection) incomeTaxSection.classList.remove("hide");\n      if (incomeTaxSection) incomeTaxSection.scrollIntoView({ behavior: "smooth" });\n    } else if (route === "gst") {')
    # localStorage exclusion
    content=content.replace(
        '&& !isPaycheckRoute) {',
        '&& !isPaycheckRoute && !isIncomeTaxRoute) {')
    with open(filepath,'w',encoding='utf-8') as f: f.write(content)
    print(f'  Source router: {filepath}')


def patch_backend(filepath):
    with open(filepath,'r',encoding='utf-8') as f: content=f.read()
    if 'income-tax-calculator' in content:
        print(f'  Already has route: {filepath}'); return
    content=content.replace(
        '# Paycheck Calculator page',
        '# Income Tax Calculator page\n@app.route("/income-tax-calculator")\n@app.route("/in/payroll/income-tax-calculator/")\ndef income_tax_calculator_page():\n    """Render the Income Tax Calculator page inside the main SPA."""\n    return render_template("index.html")\n\n# Paycheck Calculator page')
    with open(filepath,'w',encoding='utf-8') as f: f.write(content)
    print(f'  Backend: {filepath}')


def main():
    print('=== Building Income Tax Calculator ===\n')

    # CSS
    print('[1/7] CSS...')
    with open('static/css/income_tax.css','w',encoding='utf-8') as f: f.write(IT_CSS)
    shutil.copy2('static/css/income_tax.css','../dist/css/income_tax.css')
    print('  Done')

    # JS
    print('[2/7] JS...')
    with open('static/js/income_tax.js','w',encoding='utf-8') as f: f.write(IT_JS)
    shutil.copy2('static/js/income_tax.js','../dist/js/income_tax.js')
    print('  Done')

    # Backend
    print('[3/7] Backend route...')
    patch_backend('app.py')

    # Source app.js
    print('[4/7] Source router...')
    patch_source_appjs('static/js/app.js')

    # templates/index.html
    print('[5/7] templates/index.html...')
    patch_html('templates/index.html','/static/css/','/static/js/')

    # dist/index.html
    print('[6/7] dist/index.html...')
    patch_html('../dist/index.html','/css/','/js/')

    # dist/js/app.js
    print('[7/7] dist/js/app.js...')
    patch_appjs('../dist/js/app.js')

    # Verify
    print('\nVerification:')
    for p,l in [('../dist/index.html','dist HTML'),('../dist/css/income_tax.css','dist CSS'),('../dist/js/income_tax.js','dist JS'),('../dist/js/app.js','dist app.js')]:
        with open(p,'r',encoding='utf-8') as f: c=f.read()
        ok='income-tax-section' in c or 'it-hero' in c or 'itCalcBtn' in c
        print(f'  {l}: {"OK" if ok else "MISSING"}')

    print('\n=== BUILD COMPLETE ===')

if __name__=='__main__':
    main()
