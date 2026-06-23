#!/usr/bin/env python3
"""Build script for HMRC Furlough Claim Calculator."""
import os, re, shutil

HMRC_HTML = r'''
      <!-- Section: HMRC Furlough Claim Calculator -->
      <section id="hmrc-section" class="content-section mt-8 hide">
        <div class="hm-hero">
          <h1><em>Coronavirus</em> Furlough Claim Calculator</h1>
          <p>Quote how much you can claim from HMRC through the Coronavirus Job Retention Scheme for employees on furlough.</p>
        </div>
        <div class="hm-wrapper">
          <div class="hm-card">
            <div class="hm-card-header">
              <h2>Input details of Employee on Furlough</h2>
              <button type="button" class="hm-start-over" id="hmReset">&#x21bb; Start Over</button>
            </div>
            <div class="hm-form-grid">
              <div class="hm-field">
                <label>Pay Period * <span class="hm-tip" title="Select pay frequency">&#9432;</span></label>
                <select id="hmPayPeriod"><option value="" disabled selected>Select your Pay Period</option><option value="weekly">Weekly</option><option value="fortnightly">Fortnightly</option><option value="monthly">Monthly</option></select>
              </div>
              <div class="hm-field">
                <label>Gross Pay * <span class="hm-tip" title="Monthly or weekly gross pay">&#9432;</span></label>
                <input type="number" id="hmGrossPay" placeholder="0.00" min="0" step="0.01">
              </div>
              <div class="hm-field">
                <label>Claim Period * <span class="hm-tip" title="Start and end dates">&#9432;</span></label>
                <div class="hm-date-range"><input type="date" id="hmClaimStart"><span>–</span><input type="date" id="hmClaimEnd"></div>
              </div>
              <div class="hm-field">
                <label><span class="hm-blue-link">First pay day falling within the claim period</span>*</label>
                <input type="date" id="hmFirstPayDay">
              </div>
            </div>
            <div class="hm-checks">
              <label class="hm-check"><input type="checkbox" id="hmNIC"> <strong>Include National Insurance Contribution (NIC)?</strong></label>
              <label class="hm-check"><input type="checkbox" id="hmPension"> <strong>Include Pension Contributions?</strong></label>
            </div>
            <div class="hm-result-row">
              <div class="hm-result-left">
                <h3>FULL CLAIM AMOUNT</h3>
                <div class="hm-claim-amount" id="hmClaimTotal">&pound; 0.00</div>
                <a href="javascript:void(0)" class="hm-breakup-link" id="hmBreakupLink">View Breakup Details</a>
              </div>
              <div class="hm-result-right">
                <h3>To Claim from HMRC</h3>
                <div class="hm-summary-row"><span>Furloughed Days</span><span id="hmDays">0 Days</span></div>
                <div class="hm-summary-row"><span>Furloughed Wage</span><span id="hmWage">&pound; 0.00</span></div>
                <div class="hm-summary-row"><span>Employer NI Claims</span><span id="hmNI">&pound; 0.00</span></div>
                <div class="hm-summary-row"><span>Employer Pension Contributions</span><span id="hmPensionAmt">&pound; 0.00</span></div>
              </div>
            </div>
          </div>
          <p class="hm-disclaimer"><strong>Disclaimer:</strong> Softrate has taken great care and has made every attempt to ensure that the information obtained from the tool is accurate. However, Softrate is not responsible for any errors or omissions and provides no guarantee or warranty on the correctness of the results obtained from the tool. By using this tool you agree not to hold Softrate liable for any issues that arise from incorrect results obtained.</p>
          <div class="hm-accordion">
            <button class="hm-acc-toggle" id="hmAccToggle">How are we doing this calculation? <span class="hm-acc-arrow" id="hmAccArrow">&#9660;</span></button>
            <div class="hm-acc-body" id="hmAccBody">
              <ul>
                <li>The amount is calculated for the entire claim period. Based on the chosen pay period (weekly or monthly), any subsequent pay days are calculated from the first pay day.</li>
                <li><strong>Example 1:</strong> If the chosen claim period is between 1 April 2020 and 10 May 2020, and the first pay day is 30 April with a monthly pay period, the furlough is calculated for the entire month of April plus the allowed grant per day for 1-10 May.</li>
                <li><strong>Example 2:</strong> If the chosen claim period is between 1 April 2020 and 17 April 2020, and the first pay day is 3 April with a weekly pay period, the furlough is calculated for the full weeks between 4 April and 17 April, plus the allowed grant per day for 1-3 April.</li>
                <li>The maximum grant amount is <strong>&pound;2,500 per month</strong> if the pay period is monthly, or <strong>&pound;576 per week</strong> if the pay period is weekly. If 80% of the gross pay that you enter is greater than the maximum for your pay period, the maximum grant amount will be used.</li>
                <li>Starting <strong>September</strong>, the government will pay 70% of wages up to a cap of <strong>&pound;2,187.50</strong> for the hours the employee is on furlough. And from <strong>October</strong>, the government will pay 60% of wages up to a cap of <strong>&pound;1,875</strong> for the hours the employee is on furlough.</li>
                <li>The National Insurance Contribution is calculated from the grant by subtracting the relevant Secondary Threshold, and multiplying by <strong>13.8%</strong>.
                  <ul><li>Threshold value</li><li>2019 to 2020 (&pound;166 per week, &pound;719 per month)</li><li>2020 to 2021 (&pound;169 per week, &pound;732 per month)</li></ul>
                </li>
                <li>The employer pension contribution is calculated at <strong>3%</strong> of the earnings over the minimum qualified earnings, which was <strong>&pound;512 before 6th April 2020</strong> and <strong>&pound;520 after 6th April 2020</strong>.</li>
                <li>If the claim start date and end date falls in the middle of a pay period, then the NIC and Pension contribution are calculated on a prorated basis.</li>
                <li>Starting <strong>August</strong>, the Employer should pay for the National Insurance and Pension Contribution.</li>
              </ul>
            </div>
          </div>
          <div class="hm-faq">
            <h2>Frequently Asked Questions</h2>
            <div class="hm-faq-item"><button class="hm-faq-q">+ &nbsp;What are the eligibility criteria for an employer to apply for the furlough claim?</button><div class="hm-faq-a hide"><p>Any UK employer with a PAYE scheme that was operational on or before 19 March 2020, with a UK bank account, and who had enrolled for PAYE online is eligible to apply.</p></div></div>
            <div class="hm-faq-item"><button class="hm-faq-q">+ &nbsp;As an employer, how much can I claim from HMRC through the JRS scheme?</button><div class="hm-faq-a hide"><p>You can claim 80% of the employee's regular wages up to a cap of &pound;2,500 per month. The government may also cover employer National Insurance and pension contributions.</p></div></div>
            <div class="hm-faq-item"><button class="hm-faq-q">+ &nbsp;How long is this scheme available?</button><div class="hm-faq-a hide"><p>The scheme was initially available from 1 March 2020 and has been extended multiple times. Please check HMRC's latest guidance for current availability.</p></div></div>
            <div class="hm-faq-item"><button class="hm-faq-q">+ &nbsp;What categories of employees are eligible for this grant?</button><div class="hm-faq-a hide"><p>Full-time, part-time, agency workers, and employees on flexible or zero-hour contracts are eligible, provided they were on the employer's PAYE payroll.</p></div></div>
            <div class="hm-faq-item"><button class="hm-faq-q">+ &nbsp;How long must employees have been on payroll to be eligible?</button><div class="hm-faq-a hide"><p>Employees must have been on the employer's PAYE payroll on or before 19 March 2020, and the employer must have made an RTI submission to HMRC on or before that date.</p></div></div>
            <div class="hm-faq-item"><button class="hm-faq-q">+ &nbsp;Is there a minimum furlough period to apply for the grant?</button><div class="hm-faq-a hide"><p>Yes, the minimum furlough period is 3 consecutive weeks (21 calendar days).</p></div></div>
            <div class="hm-faq-item"><button class="hm-faq-q">+ &nbsp;As an employer, when can I apply for the claim?</button><div class="hm-faq-a hide"><p>You can submit a claim after the employee has been furloughed for the minimum period. Claims can be made in advance of payday.</p></div></div>
            <div class="hm-faq-item"><button class="hm-faq-q">+ &nbsp;Can I make multiple claims during a claim period?</button><div class="hm-faq-a hide"><p>Yes, you can make multiple claims for different employees or different periods within the same claim window.</p></div></div>
            <div class="hm-faq-item"><button class="hm-faq-q">+ &nbsp;Who decides the claim period?</button><div class="hm-faq-a hide"><p>The employer selects the claim period, which can be any length but must be at least 7 days. The claim period must align with the dates the employee was furloughed.</p></div></div>
          </div>
        </div>
      </section>
'''

HMRC_CSS = r'''/* hmrc.css — Zoho Furlough reference match */
#hmrc-section .hm-hero{text-align:center;padding:2.5rem 1.5rem 1.5rem;background:#e8f3ff !important;}
.dark #hmrc-section .hm-hero{background:var(--bg-color) !important;}
#hmrc-section .hm-hero h1{font-size:1.9rem;font-weight:400;color:#333;margin:0 0 .65rem;}
#hmrc-section .hm-hero h1 em{font-style:italic;}
.dark #hmrc-section .hm-hero h1{color:var(--text-color);}
#hmrc-section .hm-hero p{font-size:.88rem;color:#555;max-width:520px;margin:0 auto;line-height:1.55;}
#hmrc-section .hm-wrapper{max-width:780px;margin:0 auto;padding:0 1.5rem 3rem;}
#hmrc-section .hm-card{background:#fff !important;border:1px solid #e0e0e0 !important;border-radius:6px;padding:2rem 2.25rem;box-shadow:0 1px 4px rgba(0,0,0,.06) !important;margin-top:-1rem;position:relative;z-index:1;}
.dark #hmrc-section .hm-card{background:var(--bg-surface) !important;border-color:var(--border-color) !important;}
#hmrc-section .hm-card-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;}
#hmrc-section .hm-card-header h2{font-size:1rem;font-weight:700;color:#333;margin:0;}
.dark #hmrc-section .hm-card-header h2{color:var(--text-color);}
#hmrc-section .hm-start-over{background:none !important;border:none !important;color:#4a90d9;font-size:.82rem;cursor:pointer;font-weight:500;box-shadow:none !important;width:auto !important;padding:0 !important;}
#hmrc-section .hm-start-over:hover{text-decoration:underline;}
#hmrc-section .hm-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:1.25rem 2rem;margin-bottom:1.25rem;}
#hmrc-section .hm-field{display:flex;flex-direction:column;gap:.3rem;}
#hmrc-section .hm-field label{font-size:.8rem;font-weight:600;color:#333;}
.dark #hmrc-section .hm-field label{color:var(--text-muted);}
#hmrc-section .hm-tip{color:#bbb;cursor:help;font-size:.8rem;}
#hmrc-section .hm-blue-link{color:#1a73e8;font-weight:600;font-size:.8rem;}
#hmrc-section .hm-field input[type="number"],#hmrc-section .hm-field input[type="date"],#hmrc-section .hm-field select{width:100% !important;max-width:100% !important;padding:.45rem .6rem !important;font-size:.88rem !important;border:1px solid #ccc !important;border-radius:3px !important;background:#fff !important;color:#333 !important;box-sizing:border-box !important;height:auto !important;}
.dark #hmrc-section .hm-field input,.dark #hmrc-section .hm-field select{background:var(--bg-surface) !important;color:var(--text-color) !important;border-color:var(--border-color) !important;}
#hmrc-section .hm-field input:focus,#hmrc-section .hm-field select:focus{outline:none !important;border-color:#4a90d9 !important;box-shadow:0 0 0 2px rgba(74,144,217,.12) !important;}
#hmrc-section .hm-date-range{display:flex;align-items:center;gap:.5rem;}
#hmrc-section .hm-date-range input[type="date"]{flex:1;}
#hmrc-section .hm-date-range span{color:#888;font-size:.85rem;}
#hmrc-section .hm-checks{margin-bottom:1.5rem;display:flex;flex-direction:column;gap:.6rem;}
#hmrc-section .hm-check{font-size:.82rem;color:#333;display:flex;align-items:center;gap:.5rem;cursor:pointer;}
#hmrc-section .hm-check input[type="checkbox"]{width:16px !important;min-width:16px !important;max-width:16px !important;height:16px;accent-color:#4a90d9;cursor:pointer;padding:0 !important;}
.dark #hmrc-section .hm-check{color:var(--text-color);}
/* Result row */
#hmrc-section .hm-result-row{display:flex;gap:2rem;border-top:1px solid #eee;padding-top:1.5rem;}
.dark #hmrc-section .hm-result-row{border-top-color:var(--border-color);}
#hmrc-section .hm-result-left{flex:0 0 42%;background:#f9fbfd;border:1px dashed #d0d8e0;border-radius:8px;padding:1.5rem;text-align:center;}
.dark #hmrc-section .hm-result-left{background:var(--bg-color);border-color:var(--border-color);}
#hmrc-section .hm-result-left h3{font-size:.75rem;font-weight:700;color:#333;letter-spacing:.05em;margin:0 0 .5rem;}
.dark #hmrc-section .hm-result-left h3{color:var(--text-color);}
#hmrc-section .hm-claim-amount{font-size:2rem;font-weight:700;color:#10b981;margin-bottom:.5rem;}
#hmrc-section .hm-breakup-link{font-size:.8rem;color:#4a90d9;text-decoration:none;}
#hmrc-section .hm-breakup-link:hover{text-decoration:underline;}
#hmrc-section .hm-result-right{flex:1;}
#hmrc-section .hm-result-right h3{font-size:.88rem;font-weight:700;color:#333;margin:0 0 .75rem;}
.dark #hmrc-section .hm-result-right h3{color:var(--text-color);}
#hmrc-section .hm-summary-row{display:flex;justify-content:space-between;padding:.45rem 0;border-bottom:1px solid #f0f0f0;font-size:.82rem;color:#555;}
.dark #hmrc-section .hm-summary-row{color:var(--text-muted);border-bottom-color:var(--border-color);}
#hmrc-section .hm-summary-row span:last-child{font-weight:600;color:#333;}
.dark #hmrc-section .hm-summary-row span:last-child{color:var(--text-color);}
/* Disclaimer */
#hmrc-section .hm-disclaimer{font-size:.7rem;color:#888;margin-top:1.25rem;line-height:1.5;text-align:left;background:#f9f9f9;padding:.75rem 1rem;border-radius:4px;}
.dark #hmrc-section .hm-disclaimer{background:var(--bg-color);color:var(--text-muted);}
/* Accordion */
#hmrc-section .hm-accordion{margin-top:1.5rem;border:1px solid #1a73e8;border-radius:6px;overflow:hidden;}
#hmrc-section .hm-acc-toggle{width:100% !important;text-align:left;background:#eef5ff !important;border:none !important;padding:.85rem 1.25rem !important;font-size:.9rem;font-weight:600;color:#1a73e8 !important;cursor:pointer;display:flex;justify-content:space-between;align-items:center;box-shadow:none !important;}
#hmrc-section .hm-acc-arrow{font-size:.7rem;transition:transform .2s;}
#hmrc-section .hm-acc-body{padding:1rem 1.5rem;background:#fff;font-size:.82rem;color:#333;line-height:1.7;}
.dark #hmrc-section .hm-acc-body{background:var(--bg-surface);color:var(--text-color);}
#hmrc-section .hm-acc-body ul{margin:0;padding-left:1.25rem;}
#hmrc-section .hm-acc-body li{margin-bottom:.5rem;}
#hmrc-section .hm-acc-body ul ul{margin-top:.3rem;}
/* FAQ */
#hmrc-section .hm-faq{margin-top:3rem;}
#hmrc-section .hm-faq h2{text-align:center;font-size:1.5rem;font-weight:400;color:#333;margin-bottom:1.5rem;}
.dark #hmrc-section .hm-faq h2{color:var(--text-color);}
#hmrc-section .hm-faq-item{border-bottom:1px solid #e8e8e8;}
#hmrc-section .hm-faq-q{background:none !important;border:none !important;width:100% !important;text-align:left;padding:.85rem 0;font-size:.88rem;color:#333;cursor:pointer;font-weight:400;box-shadow:none !important;}
.dark #hmrc-section .hm-faq-q{color:var(--text-color);}
#hmrc-section .hm-faq-q:hover{color:#1a73e8;}
#hmrc-section .hm-faq-a{padding:0 0 .85rem 1.25rem;}
#hmrc-section .hm-faq-a p{font-size:.82rem;color:#666;line-height:1.6;margin:0;}
@media(max-width:640px){
  #hmrc-section .hm-form-grid{grid-template-columns:1fr;}
  #hmrc-section .hm-result-row{flex-direction:column;}
  #hmrc-section .hm-result-left{flex:none;}
  #hmrc-section .hm-wrapper{padding:0 .75rem 2rem;}
  #hmrc-section .hm-card{padding:1.25rem;}
}
'''

HMRC_JS = r'''/* hmrc.js — HMRC Furlough Claim Calculator */
document.addEventListener("DOMContentLoaded",function(){
  var resetBtn=document.getElementById("hmReset");
  var accToggle=document.getElementById("hmAccToggle");
  var accBody=document.getElementById("hmAccBody");
  var accArrow=document.getElementById("hmAccArrow");
  function fmt(n){return"\u00A3 "+n.toLocaleString("en-GB",{minimumFractionDigits:2,maximumFractionDigits:2});}
  // Accordion
  if(accToggle&&accBody){accToggle.addEventListener("click",function(){accBody.classList.toggle("hide");accArrow.textContent=accBody.classList.contains("hide")?"\u25BC":"\u25B2";});}
  // FAQ
  document.querySelectorAll(".hm-faq-q").forEach(function(b){b.addEventListener("click",function(){var a=b.nextElementSibling;if(a)a.classList.toggle("hide");});});
  // Reset
  if(resetBtn) resetBtn.addEventListener("click",function(){
    ["hmPayPeriod","hmGrossPay","hmClaimStart","hmClaimEnd","hmFirstPayDay"].forEach(function(id){var e=document.getElementById(id);if(e){e.value=e.tagName==="SELECT"?"":"";}});
    document.getElementById("hmNIC").checked=false;document.getElementById("hmPension").checked=false;
    document.getElementById("hmClaimTotal").innerHTML="\u00A3 0.00";
    document.getElementById("hmDays").textContent="0 Days";document.getElementById("hmWage").innerHTML="\u00A3 0.00";
    document.getElementById("hmNI").innerHTML="\u00A3 0.00";document.getElementById("hmPensionAmt").innerHTML="\u00A3 0.00";
  });
  // Auto-calc on any change
  var inputs=document.querySelectorAll("#hmrc-section input, #hmrc-section select");
  inputs.forEach(function(el){el.addEventListener("change",calc);el.addEventListener("input",calc);});
  function calc(){
    var period=document.getElementById("hmPayPeriod").value;
    var gross=parseFloat(document.getElementById("hmGrossPay").value)||0;
    var start=document.getElementById("hmClaimStart").value;
    var end=document.getElementById("hmClaimEnd").value;
    var incNIC=document.getElementById("hmNIC").checked;
    var incPen=document.getElementById("hmPension").checked;
    if(!period||!gross||!start||!end)return;
    var d1=new Date(start),d2=new Date(end);if(d2<=d1)return;
    var days=Math.round((d2-d1)/(86400000))+1;
    // Cap
    var cap80=gross*.8;
    var weekCap=576,monthCap=2500;
    var dailyGrant=0;
    if(period==="monthly"){dailyGrant=Math.min(cap80,monthCap)/30.44;}
    else if(period==="fortnightly"){dailyGrant=Math.min(cap80/2,weekCap)/7;}
    else{dailyGrant=Math.min(cap80,weekCap)/7;}
    var furloughWage=dailyGrant*days;
    // NIC
    var ni=0;
    if(incNIC){
      var threshold=period==="monthly"?732:169;
      var perPeriodGrant=period==="monthly"?furloughWage/(days/30.44):furloughWage/(days/7);
      var niBase=Math.max(0,perPeriodGrant-threshold);
      var periods=period==="monthly"?days/30.44:days/7;
      ni=niBase*0.138*periods;if(ni<0)ni=0;
    }
    // Pension
    var pen=0;
    if(incPen){
      var qualEarnings=period==="monthly"?520:120;
      var perPeriodGrant2=period==="monthly"?furloughWage/(days/30.44):furloughWage/(days/7);
      var penBase=Math.max(0,perPeriodGrant2-qualEarnings);
      var periods2=period==="monthly"?days/30.44:days/7;
      pen=penBase*0.03*periods2;if(pen<0)pen=0;
    }
    var total=furloughWage+ni+pen;
    document.getElementById("hmClaimTotal").innerHTML=fmt(total);
    document.getElementById("hmDays").textContent=days+" Days";
    document.getElementById("hmWage").innerHTML=fmt(furloughWage);
    document.getElementById("hmNI").innerHTML=fmt(ni);
    document.getElementById("hmPensionAmt").innerHTML=fmt(pen);
  }
});
'''

def patch_html(fp,cpre,jpre):
    with open(fp,'r',encoding='utf-8') as f: c=f.read()
    if 'id="hmrc-section"' in c:
        c=re.sub(r'\s*<!-- Section: HMRC Furlough Claim Calculator -->.*?</section>\s*','',c,flags=re.DOTALL)
    for m in ['<!-- Section: Income Tax Calculator -->','<!-- Section: Paycheck Calculator -->','<!-- Section: Gratuity Calculator -->','id="coming-soon-section"']:
        if m in c: c=c.replace(m,HMRC_HTML+'\n      '+m); break
    ct=f'<link rel="stylesheet" href="{cpre}hmrc.css">'
    if ct not in c:
        c=c.replace(f'<link rel="stylesheet" href="{cpre}income_tax.css">',f'<link rel="stylesheet" href="{cpre}income_tax.css">\n  {ct}')
    jt=f'<script src="{jpre}hmrc.js"></script>'
    if jt not in c:
        c=c.replace(f'<script src="{jpre}income_tax.js"></script>',f'<script src="{jpre}income_tax.js"></script>\n  {jt}')
    with open(fp,'w',encoding='utf-8') as f: f.write(c)
    print(f'  HTML: {fp}')

def patch_dist_appjs(fp):
    with open(fp,'r',encoding='utf-8') as f: c=f.read()
    if 'hmrc-section' in c: print(f'  Already patched: {fp}'); return
    c=c.replace('const incomeTaxSection = document.getElementById("income-tax-section");','const incomeTaxSection = document.getElementById("income-tax-section");\n    const hmrcSection = document.getElementById("hmrc-section");')
    c=c.replace('if (incomeTaxSection) incomeTaxSection.classList.add("hide");','if (incomeTaxSection) incomeTaxSection.classList.add("hide");\n    if (hmrcSection) hmrcSection.classList.add("hide");')
    c=c.replace('} else {\n      if (comingSoonSection) comingSoonSection.classList.remove("hide");','} else if (route === "hmrc" || route === "hmrc-furlough") {\n      if (hmrcSection) hmrcSection.classList.remove("hide");\n      if (hmrcSection) hmrcSection.scrollIntoView({ behavior: "smooth" });\n    } else {\n      if (comingSoonSection) comingSoonSection.classList.remove("hide");')
    with open(fp,'w',encoding='utf-8') as f: f.write(c)
    print(f'  Router: {fp}')

def patch_src_appjs(fp):
    with open(fp,'r',encoding='utf-8') as f: c=f.read()
    if 'hmrc-section' in c: print(f'  Already patched: {fp}'); return
    c=c.replace('else if (path === "/in/payroll/income-tax-calculator/" || path === "/income-tax-calculator") activeRouteStr = "income-tax";','else if (path === "/in/payroll/income-tax-calculator/" || path === "/income-tax-calculator") activeRouteStr = "income-tax";\n      else if (path === "/in/payroll/hmrc-furlough-calculator/" || path === "/hmrc-furlough-calculator") activeRouteStr = "hmrc";')
    c=c.replace('const isIncomeTaxRoute = (activeRouteStr === "income-tax" || activeRouteStr === "income-tax-calculator");','const isIncomeTaxRoute = (activeRouteStr === "income-tax" || activeRouteStr === "income-tax-calculator");\n    const isHmrcRoute = (activeRouteStr === "hmrc" || activeRouteStr === "hmrc-furlough");')
    # History
    c=c.replace('} else if (isIncomeTaxRoute) {\n      if (updateHistory) {\n        if (window.location.pathname !== "/in/payroll/income-tax-calculator/") {\n          window.history.pushState({ route: "income-tax" }, "", "/in/payroll/income-tax-calculator/");\n        }\n      }','} else if (isIncomeTaxRoute) {\n      if (updateHistory) {\n        if (window.location.pathname !== "/in/payroll/income-tax-calculator/") {\n          window.history.pushState({ route: "income-tax" }, "", "/in/payroll/income-tax-calculator/");\n        }\n      }\n    } else if (isHmrcRoute) {\n      if (updateHistory) {\n        if (window.location.pathname !== "/in/payroll/hmrc-furlough-calculator/") {\n          window.history.pushState({ route: "hmrc" }, "", "/in/payroll/hmrc-furlough-calculator/");\n        }\n      }')
    # Sidebar
    c=c.replace('} else if (isIncomeTaxRoute && (route === "income-tax" || route === "income-tax-calculator")) {\n        const itLink = Array.from(links).find(l => l.getAttribute("data-route") === "income-tax");\n        if (itLink) itLink.classList.add("active");\n      } else {','} else if (isIncomeTaxRoute && (route === "income-tax" || route === "income-tax-calculator")) {\n        const itLink = Array.from(links).find(l => l.getAttribute("data-route") === "income-tax");\n        if (itLink) itLink.classList.add("active");\n      } else if (isHmrcRoute && (route === "hmrc" || route === "hmrc-furlough")) {\n        const hmrcLink = Array.from(links).find(l => l.getAttribute("data-route") === "hmrc");\n        if (hmrcLink) hmrcLink.classList.add("active");\n      } else {')
    # Title
    c=c.replace('} else if (isIncomeTaxRoute) {\n      labelText = "Income Tax Calculator";\n    }','} else if (isIncomeTaxRoute) {\n      labelText = "Income Tax Calculator";\n    } else if (isHmrcRoute) {\n      labelText = "HMRC Furlough Claim Calculator";\n    }')
    # Section var + hide
    c=c.replace('const incomeTaxSection = document.getElementById("income-tax-section");','const incomeTaxSection = document.getElementById("income-tax-section");\n    const hmrcSection = document.getElementById("hmrc-section");')
    c=c.replace('if (incomeTaxSection) incomeTaxSection.classList.add("hide");','if (incomeTaxSection) incomeTaxSection.classList.add("hide");\n    if (hmrcSection) hmrcSection.classList.add("hide");')
    # Show
    c=c.replace('} else if (isIncomeTaxRoute && (route === "income-tax" || route === "income-tax-calculator")) {\n      if (incomeTaxSection) incomeTaxSection.classList.remove("hide");\n      if (incomeTaxSection) incomeTaxSection.scrollIntoView({ behavior: "smooth" });\n    } else if (route === "gst") {','} else if (isIncomeTaxRoute && (route === "income-tax" || route === "income-tax-calculator")) {\n      if (incomeTaxSection) incomeTaxSection.classList.remove("hide");\n      if (incomeTaxSection) incomeTaxSection.scrollIntoView({ behavior: "smooth" });\n    } else if (isHmrcRoute && (route === "hmrc" || route === "hmrc-furlough")) {\n      if (hmrcSection) hmrcSection.classList.remove("hide");\n      if (hmrcSection) hmrcSection.scrollIntoView({ behavior: "smooth" });\n    } else if (route === "gst") {')
    c=c.replace('&& !isIncomeTaxRoute) {','&& !isIncomeTaxRoute && !isHmrcRoute) {')
    with open(fp,'w',encoding='utf-8') as f: f.write(c)
    print(f'  Source router: {fp}')

def patch_backend(fp):
    with open(fp,'r',encoding='utf-8') as f: c=f.read()
    if 'hmrc-furlough' in c: print(f'  Already has route: {fp}'); return
    c=c.replace('# Income Tax Calculator page','# HMRC Furlough Claim Calculator page\n@app.route("/hmrc-furlough-calculator")\n@app.route("/in/payroll/hmrc-furlough-calculator/")\ndef hmrc_furlough_page():\n    return render_template("index.html")\n\n# Income Tax Calculator page')
    with open(fp,'w',encoding='utf-8') as f: f.write(c)
    print(f'  Backend: {fp}')

def main():
    print('=== Building HMRC Furlough Calculator ===\n')
    print('[1/7] CSS...'); open('static/css/hmrc.css','w',encoding='utf-8').write(HMRC_CSS); shutil.copy2('static/css/hmrc.css','../dist/css/hmrc.css'); print('  Done')
    print('[2/7] JS...'); open('static/js/hmrc.js','w',encoding='utf-8').write(HMRC_JS); shutil.copy2('static/js/hmrc.js','../dist/js/hmrc.js'); print('  Done')
    print('[3/7] Backend...'); patch_backend('app.py')
    print('[4/7] Source router...'); patch_src_appjs('static/js/app.js')
    print('[5/7] templates/index.html...'); patch_html('templates/index.html','/static/css/','/static/js/')
    print('[6/7] dist/index.html...'); patch_html('../dist/index.html','/css/','/js/')
    print('[7/7] dist/js/app.js...'); patch_dist_appjs('../dist/js/app.js')
    print('\nVerification:')
    for p,l in [('../dist/index.html','HTML'),('../dist/css/hmrc.css','CSS'),('../dist/js/hmrc.js','JS'),('../dist/js/app.js','Router')]:
        with open(p,'r',encoding='utf-8') as f: ok='hmrc' in f.read().lower()
        print(f'  {l}: {"OK" if ok else "MISSING"}')
    print('\n=== BUILD COMPLETE ===')

if __name__=='__main__': main()
