#!/usr/bin/env python3
"""Master build script for Paycheck Calculator - deploys to both templates and dist."""
import os, shutil

# ============================================================
# 1. NEW HTML SECTION (matches Zoho reference exactly)
# ============================================================
PAYCHECK_HTML = r'''
      <!-- Section: Paycheck Calculator -->
      <section id="paycheck-section" class="content-section mt-8 hide">

        <!-- Hero -->
        <div class="pc-hero">
          <h1>Paycheck <span class="pc-red">Calculator</span></h1>
          <p>Calculate net pay, taxes, and deductions for both salaried and hourly employees</p>
        </div>

        <!-- Main white container -->
        <div class="pc-wrapper">
          <div class="pc-card">

            <!-- State -->
            <div class="pc-field-row">
              <div class="pc-field pc-w40">
                <label>Select your state</label>
                <select id="pcState">
                  <option value="AL">Alabama</option><option value="AK">Alaska</option><option value="AZ">Arizona</option>
                  <option value="AR">Arkansas</option><option value="CA" selected>California</option><option value="CO">Colorado</option>
                  <option value="CT">Connecticut</option><option value="DE">Delaware</option><option value="FL">Florida</option>
                  <option value="GA">Georgia</option><option value="HI">Hawaii</option><option value="ID">Idaho</option>
                  <option value="IL">Illinois</option><option value="IN">Indiana</option><option value="IA">Iowa</option>
                  <option value="KS">Kansas</option><option value="KY">Kentucky</option><option value="LA">Louisiana</option>
                  <option value="ME">Maine</option><option value="MD">Maryland</option><option value="MA">Massachusetts</option>
                  <option value="MI">Michigan</option><option value="MN">Minnesota</option><option value="MS">Mississippi</option>
                  <option value="MO">Missouri</option><option value="MT">Montana</option><option value="NE">Nebraska</option>
                  <option value="NV">Nevada</option><option value="NH">New Hampshire</option><option value="NJ">New Jersey</option>
                  <option value="NM">New Mexico</option><option value="NY">New York</option><option value="NC">North Carolina</option>
                  <option value="ND">North Dakota</option><option value="OH">Ohio</option><option value="OK">Oklahoma</option>
                  <option value="OR">Oregon</option><option value="PA">Pennsylvania</option><option value="RI">Rhode Island</option>
                  <option value="SC">South Carolina</option><option value="SD">South Dakota</option><option value="TN">Tennessee</option>
                  <option value="TX">Texas</option><option value="UT">Utah</option><option value="VT">Vermont</option>
                  <option value="VA">Virginia</option><option value="WA">Washington</option><option value="WV">West Virginia</option>
                  <option value="WI">Wisconsin</option><option value="WY">Wyoming</option>
                </select>
              </div>
            </div>

            <!-- Employee Info -->
            <div class="pc-field-row pc-cols-2">
              <div class="pc-field">
                <label>Employee Name *</label>
                <input type="text" id="pcEmpName" placeholder="">
              </div>
              <div class="pc-field">
                <label>Employee Type *</label>
                <select id="pcEmpType">
                  <option value="non_exempt">Non Exempted</option>
                  <option value="exempt">Exempted</option>
                </select>
              </div>
            </div>

            <div class="pc-field-row pc-cols-3">
              <div class="pc-field">
                <label>Wages (USD) *</label>
                <div class="pc-input-suffix-wrap">
                  <input type="number" id="pcWages" placeholder="" min="0" step="0.01">
                  <span class="pc-suffix" id="pcWageSuffix">Per Hour</span>
                </div>
              </div>
              <div class="pc-field">
                <label>Regular Hours *</label>
                <input type="number" id="pcRegHours" value="0" min="0">
              </div>
              <div class="pc-field">
                <label>Overtime Hours</label>
                <input type="number" id="pcOtHours" value="0" min="0">
              </div>
            </div>

            <div class="pc-field-row pc-cols-2">
              <div class="pc-field">
                <label>Pay Frequency *</label>
                <select id="pcPayFreq">
                  <option value="weekly">Every week</option>
                  <option value="biweekly">Every 2 weeks</option>
                  <option value="semimonthly">Twice a month</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div class="pc-field">
                <label>Pay Date *</label>
                <input type="date" id="pcPayDate">
              </div>
            </div>

            <!-- Federal Tax Information -->
            <fieldset class="pc-fieldset">
              <legend>Federal Tax Information</legend>

              <div class="pc-field-row">
                <div class="pc-field pc-w40">
                  <label>Form W-4 Version *</label>
                  <select id="pcW4Version">
                    <option value="2020">2020 or later</option>
                    <option value="2019">Before 2020</option>
                  </select>
                </div>
              </div>

              <div class="pc-field-row pc-cols-3">
                <div class="pc-field">
                  <label>Filing Status *</label>
                  <select id="pcFedFiling">
                    <option value="" disabled selected>Select filing status</option>
                    <option value="single">Single</option>
                    <option value="married_jointly">Married Filing Jointly</option>
                    <option value="married_separately">Married Filing Separately</option>
                    <option value="head_household">Head of Household</option>
                  </select>
                </div>
                <div class="pc-field">
                  <label>Is Holding Multiple Jobs? *</label>
                  <select id="pcMultiJobs">
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
                <div class="pc-field">
                  <label>Dependent Amount *</label>
                  <input type="number" id="pcDepAmt" placeholder="" min="0" step="0.01">
                </div>
              </div>

              <div class="pc-field-row pc-cols-3">
                <div class="pc-field">
                  <label>Other Income</label>
                  <input type="number" id="pcOtherIncome" placeholder="" min="0" step="0.01">
                </div>
                <div class="pc-field">
                  <label>Deductions</label>
                  <input type="number" id="pcFedDeductions" placeholder="" min="0" step="0.01">
                </div>
                <div class="pc-field">
                  <label>Additional Withholding Amount</label>
                  <input type="number" id="pcFedAddtl" placeholder="" min="0" step="0.01">
                </div>
              </div>
            </fieldset>

            <!-- State Tax Information -->
            <fieldset class="pc-fieldset">
              <legend>State Tax Information</legend>

              <div class="pc-field-row pc-cols-3">
                <div class="pc-field">
                  <label>Filing Status</label>
                  <select id="pcStateFiling">
                    <option value="" disabled selected>Select filing status</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="head_household">Head of Household</option>
                  </select>
                </div>
                <div class="pc-field">
                  <label>Withholding Allowances</label>
                  <input type="number" id="pcStateAllow" placeholder="" min="0">
                </div>
                <div class="pc-field">
                  <label>Additional Withholding Allowances</label>
                  <input type="number" id="pcStateAddtlAllow" placeholder="" min="0">
                </div>
              </div>

              <div class="pc-field-row">
                <div class="pc-field pc-w40">
                  <label>Additional Withholding Amount</label>
                  <input type="number" id="pcStateAddtl" placeholder="" min="0" step="0.01">
                </div>
              </div>
            </fieldset>

            <!-- Deductions -->
            <fieldset class="pc-fieldset">
              <legend>Deductions</legend>

              <div class="pc-ded-header">
                <div>Type</div>
                <div>Employee Contribution (USD)</div>
                <div>Employer Contribution (USD)</div>
                <div></div>
              </div>

              <div id="pcDedRows">
                <!-- Default row added by JS -->
              </div>

              <button type="button" class="pc-add-ded" id="pcAddDedBtn">
                <span class="pc-add-icon">&#x2295;</span> Add Deduction
              </button>
            </fieldset>

            <!-- Calculate -->
            <div class="pc-calc-btn-wrap">
              <button type="button" class="pc-calc-btn" id="pcCalcBtn">CALCULATE</button>
            </div>

          </div><!-- /.pc-card -->

          <!-- Results -->
          <div class="pc-results hide" id="pcResults">
            <!-- Populated by JS -->
          </div>

        </div><!-- /.pc-wrapper -->
      </section>
'''

# ============================================================
# 2. CSS (matches Zoho reference exactly)
# ============================================================
PAYCHECK_CSS = r'''/* paycheck.css — Zoho Payroll reference match */

/* Hero */
.pc-hero{text-align:center;padding:2.5rem 1rem 1rem;background:#fff;}
.dark .pc-hero{background:var(--bg-color);}
.pc-hero h1{font-size:1.85rem;font-weight:400;color:#333;margin:0 0 .35rem;}
.dark .pc-hero h1{color:var(--text-color);}
.pc-hero .pc-red{color:#e8453c;font-weight:700;}
.pc-hero p{font-size:.88rem;color:#666;margin:0;font-style:italic;}
.dark .pc-hero p{color:var(--text-muted);}

/* Wrapper */
.pc-wrapper{max-width:720px;margin:0 auto;padding:0 1.5rem 3rem;}

/* Card */
.pc-card{background:#fff;border:1px solid #e8e8e8;border-radius:6px;padding:2rem 2.25rem;box-shadow:0 1px 4px rgba(0,0,0,.06);}
.dark .pc-card{background:var(--bg-surface);border-color:var(--border-color);}

/* Fieldset */
.pc-fieldset{border:none;border-top:1px solid #ddd;margin:1.75rem 0 0;padding:1.25rem 0 0;}
.pc-fieldset legend{font-size:1rem;font-weight:700;color:#333;padding:0 .5rem 0 0;}
.dark .pc-fieldset{border-top-color:var(--border-color);}
.dark .pc-fieldset legend{color:var(--text-color);}

/* Field rows */
.pc-field-row{display:flex;gap:1.25rem;margin-bottom:1.25rem;flex-wrap:wrap;}
.pc-cols-2>.pc-field{flex:1 1 45%;}
.pc-cols-3>.pc-field{flex:1 1 30%;}
.pc-w40{max-width:40%;min-width:200px;}

/* Field */
.pc-field{display:flex;flex-direction:column;gap:.3rem;}
.pc-field label{font-size:.78rem;font-weight:600;color:#555;}
.dark .pc-field label{color:var(--text-muted);}
.pc-field input,.pc-field select{width:100%;padding:.5rem .6rem;font-size:.88rem;border:1px solid #ccc;border-radius:3px;background:#fff;color:#333;box-sizing:border-box;}
.dark .pc-field input,.dark .pc-field select{background:var(--bg-surface);color:var(--text-color);border-color:var(--border-color);}
.pc-field input:focus,.pc-field select:focus{outline:none;border-color:#4a90d9;box-shadow:0 0 0 2px rgba(74,144,217,.12);}

/* Input with suffix */
.pc-input-suffix-wrap{display:flex;}
.pc-input-suffix-wrap input{border-radius:3px 0 0 3px;flex:1;}
.pc-suffix{display:flex;align-items:center;padding:0 .6rem;background:#f5f5f5;border:1px solid #ccc;border-left:none;border-radius:0 3px 3px 0;font-size:.78rem;color:#888;white-space:nowrap;}
.dark .pc-suffix{background:var(--bg-color);border-color:var(--border-color);color:var(--text-muted);}

/* Deductions */
.pc-ded-header{display:grid;grid-template-columns:2fr 1.5fr 1.5fr 28px;gap:.75rem;font-size:.78rem;font-weight:600;color:#555;margin-bottom:.5rem;}
.dark .pc-ded-header{color:var(--text-muted);}
.pc-ded-row{display:grid;grid-template-columns:2fr 1.5fr 1.5fr 28px;gap:.75rem;align-items:center;margin-bottom:.5rem;}
.pc-ded-row select,.pc-ded-row input{width:100%;padding:.45rem .55rem;font-size:.85rem;border:1px solid #ccc;border-radius:3px;background:#fff;color:#333;box-sizing:border-box;}
.dark .pc-ded-row select,.dark .pc-ded-row input{background:var(--bg-surface);color:var(--text-color);border-color:var(--border-color);}
.pc-del-btn{background:none;border:none;color:#ccc;cursor:pointer;font-size:1.1rem;padding:2px;border-radius:50%;line-height:1;}
.pc-del-btn:hover{color:#e8453c;}
.pc-add-ded{background:none;border:none;color:#4a90d9;font-size:.82rem;font-weight:500;cursor:pointer;padding:.3rem 0;display:inline-flex;align-items:center;gap:.3rem;}
.pc-add-ded:hover{text-decoration:underline;}
.pc-add-icon{font-size:1rem;}

/* Calculate button */
.pc-calc-btn-wrap{text-align:center;margin-top:1.75rem;}
.pc-calc-btn{background:#e8453c;color:#fff;border:none;border-radius:3px;padding:.55rem 2.5rem;font-size:.88rem;font-weight:600;letter-spacing:.04em;cursor:pointer;transition:background .2s;}
.pc-calc-btn:hover{background:#d13a32;}

/* Results */
.pc-results{background:#fff;border:1px solid #e8e8e8;border-radius:6px;padding:2rem 2.25rem;margin-top:1.5rem;box-shadow:0 1px 4px rgba(0,0,0,.06);animation:pcSlide .35s ease-out;}
.dark .pc-results{background:var(--bg-surface);border-color:var(--border-color);}
@keyframes pcSlide{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}
.pc-res-title{text-align:center;font-size:1.15rem;font-weight:600;color:#333;margin:0 0 .25rem;}
.dark .pc-res-title{color:var(--text-color);}
.pc-res-sub{text-align:center;font-size:.82rem;color:#888;margin:0 0 1rem;}
.pc-res-net{text-align:center;font-size:2.25rem;font-weight:700;color:#10b981;margin:.5rem 0;}
.pc-res-net-label{text-align:center;font-size:.85rem;font-weight:500;color:#555;margin:0 0 1.25rem;}
.dark .pc-res-net-label{color:var(--text-muted);}
.pc-res-table{width:100%;border-collapse:collapse;margin-bottom:1rem;}
.pc-res-table th{text-align:left;padding:.55rem 0;font-size:.78rem;font-weight:600;color:#555;border-bottom:2px solid #e8e8e8;}
.dark .pc-res-table th{color:var(--text-muted);border-bottom-color:var(--border-color);}
.pc-res-table td{padding:.55rem 0;font-size:.84rem;color:#555;border-bottom:1px solid #f0f0f0;}
.dark .pc-res-table td{color:var(--text-muted);border-bottom-color:var(--border-color);}
.pc-res-table td:last-child{text-align:right;font-weight:500;color:#333;}
.dark .pc-res-table td:last-child{color:var(--text-color);}
.pc-res-table tr.pc-total td{font-weight:700;color:#333;border-top:2px solid #e8e8e8;border-bottom:none;}
.dark .pc-res-table tr.pc-total td{color:var(--text-color);border-top-color:var(--border-color);}
.pc-res-table tr.pc-total td:last-child{color:#10b981;}
.pc-res-actions{text-align:center;margin-top:1rem;}
.pc-res-btn{background:#fff;color:#555;border:1px solid #ccc;border-radius:3px;padding:.4rem 1rem;font-size:.8rem;cursor:pointer;transition:background .2s;}
.dark .pc-res-btn{background:var(--bg-surface);color:var(--text-color);border-color:var(--border-color);}
.pc-res-btn:hover{background:#f5f5f5;}
.dark .pc-res-btn:hover{background:rgba(255,255,255,.08);}

/* Responsive */
@media(max-width:640px){
  .pc-field-row{flex-direction:column;gap:.75rem;}
  .pc-w40{max-width:100%;}
  .pc-cols-2>.pc-field,.pc-cols-3>.pc-field{flex:1 1 100%;}
  .pc-ded-header{display:none;}
  .pc-ded-row{grid-template-columns:1fr;gap:.4rem;padding:.75rem;border:1px solid #e8e8e8;border-radius:4px;position:relative;}
  .dark .pc-ded-row{border-color:var(--border-color);}
  .pc-del-btn{position:absolute;top:.3rem;right:.3rem;}
  .pc-wrapper{padding:0 .75rem 2rem;}
  .pc-card{padding:1.25rem;}
}
'''

# ============================================================
# 3. JS (calculation logic + deduction rows)
# ============================================================
PAYCHECK_JS = r'''/* paycheck.js — Zoho-style Paycheck Calculator */
document.addEventListener("DOMContentLoaded", function(){

  var addBtn = document.getElementById("pcAddDedBtn");
  var dedRows = document.getElementById("pcDedRows");
  var calcBtn = document.getElementById("pcCalcBtn");
  var resultsDiv = document.getElementById("pcResults");
  var empType = document.getElementById("pcEmpType");
  var wageSuffix = document.getElementById("pcWageSuffix");
  var payDate = document.getElementById("pcPayDate");

  if(payDate){var d=new Date();payDate.value=d.toISOString().split("T")[0];}

  function createDedRow(){
    var row=document.createElement("div");
    row.className="pc-ded-row";
    row.innerHTML='<select class="ded-type"><option value="401k">401(k)</option><option value="health">Health Insurance</option><option value="dental">Dental Insurance</option><option value="vision">Vision Insurance</option><option value="retirement">Retirement Plan</option><option value="other">Other</option></select>'
      +'<input type="number" class="ded-ee" value="0" min="0" step="0.01">'
      +'<input type="number" class="ded-er" value="0" min="0" step="0.01">'
      +'<button type="button" class="pc-del-btn" title="Remove">&otimes;</button>';
    dedRows.appendChild(row);
    row.querySelector(".pc-del-btn").addEventListener("click",function(){row.remove();});
  }

  // Add default row
  if(dedRows) createDedRow();
  if(addBtn) addBtn.addEventListener("click",createDedRow);

  // Toggle wage suffix
  if(empType) empType.addEventListener("change",function(){
    if(wageSuffix) wageSuffix.textContent = empType.value==="exempt"?"Per Year":"Per Hour";
  });

  function val(id,def){var e=document.getElementById(id);if(!e||!e.value)return def||0;var v=parseFloat(e.value);return isNaN(v)?def||0:v;}
  function fmt(n){return "$"+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});}

  if(calcBtn) calcBtn.addEventListener("click",function(){
    var state=document.getElementById("pcState").value;
    var empName=document.getElementById("pcEmpName").value||"Employee";
    var type=document.getElementById("pcEmpType").value;
    var wages=val("pcWages");
    var freq=document.getElementById("pcPayFreq").value;
    var regH=val("pcRegHours");
    var otH=val("pcOtHours");
    var pd=document.getElementById("pcPayDate").value;

    var fedFiling=document.getElementById("pcFedFiling").value||"single";
    var depAmt=val("pcDepAmt");
    var otherInc=val("pcOtherIncome");
    var fedDed=val("pcFedDeductions");
    var fedAddtl=val("pcFedAddtl");
    var stateAddtl=val("pcStateAddtl");
    var stateAllow=val("pcStateAllow");
    var stateAddtlAllow=val("pcStateAddtlAllow");

    // Pay periods
    var pp=26;
    if(freq==="weekly")pp=52;if(freq==="semimonthly")pp=24;if(freq==="monthly")pp=12;

    // Gross
    var gross=0;
    if(type==="exempt"){gross=wages/pp;}
    else{gross=(regH*wages)+(otH*wages*1.5);}

    // Pre-tax deductions
    var preTax=0,postTax=0,erTotal=0;
    var rows=dedRows?dedRows.querySelectorAll(".pc-ded-row"):[];
    rows.forEach(function(r){
      var t=r.querySelector(".ded-type");var tp=t?t.value:"";
      var ee=parseFloat(r.querySelector(".ded-ee").value)||0;
      var er=parseFloat(r.querySelector(".ded-er").value)||0;
      if(["401k","health","dental","vision","retirement"].indexOf(tp)>=0) preTax+=ee; else postTax+=ee;
      erTotal+=er;
    });

    // Taxable
    var taxableGross=Math.max(0,gross-preTax);
    var annualized=taxableGross*pp;

    // Federal tax
    var stdDed=fedFiling==="married_jointly"?29200:fedFiling==="head_household"?21900:14600;
    var adjInc=annualized+(otherInc*pp)-(fedDed*pp)-stdDed;
    if(adjInc<0)adjInc=0;
    var fedTaxAnn=0;
    if(fedFiling==="married_jointly"){
      if(adjInc>731200)fedTaxAnn=(adjInc-731200)*.37+186601.5;
      else if(adjInc>487450)fedTaxAnn=(adjInc-487450)*.35+101289;
      else if(adjInc>383900)fedTaxAnn=(adjInc-383900)*.32+68153;
      else if(adjInc>201050)fedTaxAnn=(adjInc-201050)*.24+24269;
      else if(adjInc>94300)fedTaxAnn=(adjInc-94300)*.22+10784;
      else if(adjInc>23200)fedTaxAnn=(adjInc-23200)*.12+2320;
      else fedTaxAnn=adjInc*.10;
    }else{
      if(adjInc>609350)fedTaxAnn=(adjInc-609350)*.37+183647.25;
      else if(adjInc>243725)fedTaxAnn=(adjInc-243725)*.35+55678.5;
      else if(adjInc>191950)fedTaxAnn=(adjInc-191950)*.32+39110.5;
      else if(adjInc>100525)fedTaxAnn=(adjInc-100525)*.24+17168.5;
      else if(adjInc>47150)fedTaxAnn=(adjInc-47150)*.22+5426;
      else if(adjInc>11600)fedTaxAnn=(adjInc-11600)*.12+1160;
      else fedTaxAnn=adjInc*.10;
    }
    var fedTax=fedTaxAnn/pp-depAmt;if(fedTax<0)fedTax=0;fedTax+=fedAddtl;

    // FICA
    var ss=gross*.062;
    var med=gross*.0145;if(annualized>200000)med+=gross*.009;

    // State tax (simplified)
    var noIncomeTax=["AK","FL","NV","NH","SD","TN","TX","WA","WY"];
    var stateTax=0;
    if(noIncomeTax.indexOf(state)<0){
      var stateStdDed=fedFiling==="married_jointly"?10726:5363;
      var stateAdj=annualized-stateStdDed-((stateAllow+stateAddtlAllow)*154);
      if(stateAdj>0){
        if(stateAdj>1000000)stateTax=stateAdj*.133;
        else if(stateAdj>677275)stateTax=stateAdj*.123;
        else if(stateAdj>400000)stateTax=stateAdj*.113;
        else if(stateAdj>68000)stateTax=stateAdj*.093;
        else if(stateAdj>53000)stateTax=stateAdj*.08;
        else if(stateAdj>38000)stateTax=stateAdj*.06;
        else if(stateAdj>24000)stateTax=stateAdj*.04;
        else if(stateAdj>10000)stateTax=stateAdj*.02;
        else stateTax=stateAdj*.01;
      }
      stateTax=stateTax/pp+stateAddtl;if(stateTax<0)stateTax=0;
    }

    var totalTax=fedTax+ss+med+stateTax;
    var net=gross-totalTax-preTax-postTax;

    // Render results
    resultsDiv.innerHTML='<h2 class="pc-res-title">Payroll Summary</h2>'
      +'<p class="pc-res-sub">'+empName+' &bull; Pay Date: '+(pd||"N/A")+'</p>'
      +'<div class="pc-res-net">'+fmt(net)+'</div>'
      +'<p class="pc-res-net-label">Net (Take Home) Pay</p>'
      +'<table class="pc-res-table"><thead><tr><th>Description</th><th style="text-align:right">Amount</th></tr></thead><tbody>'
      +'<tr><td>Gross Pay</td><td>'+fmt(gross)+'</td></tr>'
      +'<tr><td>Federal Income Tax</td><td>-'+fmt(fedTax)+'</td></tr>'
      +'<tr><td>State Income Tax ('+state+')</td><td>-'+fmt(stateTax)+'</td></tr>'
      +'<tr><td>Social Security (6.2%)</td><td>-'+fmt(ss)+'</td></tr>'
      +'<tr><td>Medicare (1.45%)</td><td>-'+fmt(med)+'</td></tr>'
      +(preTax>0?'<tr><td>Pre-Tax Deductions</td><td>-'+fmt(preTax)+'</td></tr>':'')
      +(postTax>0?'<tr><td>Post-Tax Deductions</td><td>-'+fmt(postTax)+'</td></tr>':'')
      +'<tr class="pc-total"><td>Net Pay</td><td>'+fmt(net)+'</td></tr>'
      +'</tbody></table>'
      +'<div class="pc-res-actions"><button class="pc-res-btn" onclick="window.print()">&#128424; Print</button></div>';
    resultsDiv.classList.remove("hide");
    resultsDiv.scrollIntoView({behavior:"smooth",block:"start"});
  });
});
'''


def patch_html(filepath, css_prefix):
    """Insert/replace paycheck section, CSS link, JS script in an HTML file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove old paycheck section if exists
    if 'id="paycheck-section"' in content:
        import re
        content = re.sub(
            r'\s*<!-- Section: Paycheck Calculator -->.*?</section>',
            '',
            content,
            flags=re.DOTALL
        )

    # Insert new paycheck section before Gratuity section
    if '<!-- Section: Gratuity Calculator -->' in content:
        content = content.replace(
            '<!-- Section: Gratuity Calculator -->',
            PAYCHECK_HTML + '\n      <!-- Section: Gratuity Calculator -->'
        )
    else:
        # Fallback: insert before coming-soon
        content = content.replace(
            'id="coming-soon-section"',
            'id="paycheck-section" class="content-section mt-8 hide">' + PAYCHECK_HTML + '</section>\n      <section id="coming-soon-section"'
        )

    # CSS link
    css_tag = f'<link rel="stylesheet" href="{css_prefix}paycheck.css">'
    if css_tag not in content:
        fr_css = f'{css_prefix}financial_report.css">'
        if fr_css in content:
            content = content.replace(
                f'<link rel="stylesheet" href="{css_prefix}financial_report.css">',
                f'<link rel="stylesheet" href="{css_prefix}financial_report.css">\n  {css_tag}'
            )
        else:
            # Insert before </head>
            content = content.replace('</head>', f'  {css_tag}\n  </head>')

    # JS script
    js_tag = f'<script src="{css_prefix}paycheck.js"></script>'
    if js_tag not in content:
        fr_js = f'{css_prefix}financial_report.js"></script>'
        if fr_js in content:
            content = content.replace(
                f'<script src="{css_prefix}financial_report.js"></script>',
                f'<script src="{css_prefix}financial_report.js"></script>\n  {js_tag}'
            )
        else:
            content = content.replace('</body>', f'  {js_tag}\n  </body>')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'  Updated: {filepath}')


def patch_dist_appjs(filepath):
    """Add paycheck route to the dist ES-module app.js."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'paycheck-section' in content:
        print(f'  Already patched: {filepath}')
        return

    # Add paycheckSection variable
    content = content.replace(
        'const perDiemSection = document.getElementById("per-diem-section");',
        'const perDiemSection = document.getElementById("per-diem-section");\n    const paycheckSection = document.getElementById("paycheck-section");'
    )

    # Add hide
    content = content.replace(
        'if (perDiemSection) perDiemSection.classList.add("hide");',
        'if (perDiemSection) perDiemSection.classList.add("hide");\n    if (paycheckSection) paycheckSection.classList.add("hide");'
    )

    # Add show route before the else (coming soon)
    content = content.replace(
        '    } else {\n      if (comingSoonSection) comingSoonSection.classList.remove("hide");',
        '    } else if (route === "paycheck" || route === "paycheck-calculator") {\n      if (paycheckSection) paycheckSection.classList.remove("hide");\n      if (paycheckSection) paycheckSection.scrollIntoView({ behavior: "smooth" });\n    } else {\n      if (comingSoonSection) comingSoonSection.classList.remove("hide");'
    )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'  Patched router: {filepath}')


def main():
    # Paths
    templates_html = 'templates/index.html'
    static_css = 'static/css/paycheck.css'
    static_js = 'static/js/paycheck.js'
    dist_html = '../dist/index.html'
    dist_css = '../dist/css/paycheck.css'
    dist_js = '../dist/js/paycheck.js'
    dist_appjs = '../dist/js/app.js'

    print('=== Building Paycheck Calculator ===\n')

    # 1. Write CSS
    print('[1/6] Writing CSS...')
    with open(static_css, 'w', encoding='utf-8') as f:
        f.write(PAYCHECK_CSS)
    shutil.copy2(static_css, dist_css)
    print(f'  Wrote: {static_css} + {dist_css}')

    # 2. Write JS
    print('[2/6] Writing JS...')
    with open(static_js, 'w', encoding='utf-8') as f:
        f.write(PAYCHECK_JS)
    shutil.copy2(static_js, dist_js)
    print(f'  Wrote: {static_js} + {dist_js}')

    # 3. Patch templates/index.html
    print('[3/6] Patching templates/index.html...')
    patch_html(templates_html, '/static/css/')

    # 4. Patch dist/index.html
    print('[4/6] Patching dist/index.html...')
    patch_html(dist_html, '/css/')

    # 5. Restore & patch dist/js/app.js
    print('[5/6] Patching dist/js/app.js router...')
    # First restore from git
    os.system('git restore ../dist/js/app.js')
    patch_dist_appjs(dist_appjs)

    # 6. Verify
    print('\n[6/6] Verification...')
    for path, label in [(dist_html, 'dist HTML'), (dist_css, 'dist CSS'), (dist_js, 'dist JS'), (dist_appjs, 'dist app.js')]:
        with open(path, 'r', encoding='utf-8') as f:
            c = f.read()
        has_section = 'paycheck-section' in c or 'pc-hero' in c or 'pcCalcBtn' in c
        print(f'  {label}: {"OK" if has_section else "MISSING"}')

    print('\n=== BUILD COMPLETE ===')
    print('Hard-refresh (Ctrl+Shift+R) the browser to see the Paycheck Calculator.')

if __name__ == '__main__':
    main()
