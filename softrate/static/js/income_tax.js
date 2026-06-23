/* income_tax.js — Income Tax Calculator */
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
