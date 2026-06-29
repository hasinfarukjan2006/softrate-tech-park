/* uk_corp.js — UK Corporation Tax Calculator */
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
