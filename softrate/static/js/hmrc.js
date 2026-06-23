/* hmrc.js — HMRC Furlough Claim Calculator */
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
