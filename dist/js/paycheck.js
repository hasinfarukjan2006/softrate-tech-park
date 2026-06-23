/* paycheck.js — Zoho-style Paycheck Calculator */
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
