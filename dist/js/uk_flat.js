/* uk_flat.js — UK Flat Rate VAT Calculator logic */
document.addEventListener("DOMContentLoaded", function() {
  const container = document.getElementById("uk-flat-section");
  if (!container) return;

  const sectorSelect = document.getElementById("frsSector");
  const customRateWrap = document.getElementById("frsCustomRateWrap");
  const customRateInput = document.getElementById("frsCustomRate");
  const firstYearCheckbox = document.getElementById("frsFirstYear");
  const turnoverInput = document.getElementById("frsTurnover");
  const goodsCostInput = document.getElementById("frsGoodsCost");

  const appliedRateVal = document.getElementById("frsAppliedRate");
  const limCostRow = document.getElementById("frsLimCostRow");
  const vatToPayVal = document.getElementById("frsVatToPay");
  const stdEstVal = document.getElementById("frsStdEst");
  const flatEstVal = document.getElementById("frsFlatEst");
  const savingsBox = document.getElementById("frsSavingsBox");
  const savingsAmt = document.getElementById("frsSavingsAmt");
  const resetBtn = document.getElementById("frsReset");

  function fmt(n) {
    return "\u00A3" + Math.abs(n).toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function getBaseFlatRate() {
    const val = sectorSelect.value;
    if (val === "custom") {
      return parseFloat(customRateInput.value) || 0;
    }
    return parseFloat(val) || 0;
  }

  function calc() {
    const turnover = parseFloat(turnoverInput.value) || 0;
    const goodsCost = parseFloat(goodsCostInput.value) || 0;
    let baseRate = getBaseFlatRate();

    // 1. Check for Limited Cost Trader status
    // Rule: Relevant goods must be at least 2% of turnover, AND at least £250 per quarter (£1000 per year)
    // We assume the entered turnover/costs are for a full year (if they represent a quarter, the £250 threshold applies. Let's use 2% and min £1000 per year / £250 per quarter. To be helpful, we'll check if goodsCost is less than 2% of turnover OR less than £1000 per year / £250 per quarter. Let's do the standard check:
    const thresholdPercentage = 0.02 * turnover;
    const thresholdValue = 250.0; // standard quarter threshold, or £1000 year. Let's write a simple smart check:
    const isLimitedCost = turnover > 0 && (goodsCost < thresholdPercentage || goodsCost < 250);

    let finalRate = baseRate;
    if (isLimitedCost) {
      finalRate = 16.5;
      limCostRow.style.display = "flex";
    } else {
      limCostRow.style.display = "none";
      // Apply 1st year registration discount (1% off the rate)
      if (firstYearCheckbox.checked && finalRate > 0) {
        finalRate = Math.max(0, finalRate - 1);
      }
    }

    appliedRateVal.textContent = finalRate.toFixed(1) + "%";

    // 2. FRS VAT Calculation
    // Under FRS, the VAT is turnover (including VAT) multiplied by the FRS rate
    const vatToPay = turnover * (finalRate / 100);
    vatToPayVal.textContent = fmt(vatToPay);

    // 3. Comparison with Standard VAT
    // Standard VAT estimates: Assume 20% standard rate on turnover (gross, so we extract Net first)
    // Standard Sales VAT = Gross - (Gross / 1.20)
    // Assume average input tax reclaim is 2% of turnover, or 20% of goodsCost
    const stdGrossSales = turnover;
    const stdNetSales = stdGrossSales / 1.20;
    const stdOutputTax = stdGrossSales - stdNetSales;
    
    // Standard input tax credit: Assume 20% of relevant goods cost
    const stdInputTax = goodsCost * 0.20;
    const stdVatEst = Math.max(0, stdOutputTax - stdInputTax);
    
    stdEstVal.textContent = fmt(stdVatEst);
    flatEstVal.textContent = fmt(vatToPay);

    const savings = stdVatEst - vatToPay;
    if (savings >= 0) {
      savingsBox.style.color = "#16a34a";
      savingsBox.innerHTML = 'VAT Savings: <span id="frsSavingsAmt">' + fmt(savings) + '</span>';
    } else {
      savingsBox.style.color = "#de7110";
      savingsBox.innerHTML = 'Scheme Cost: <span id="frsSavingsAmt">' + fmt(Math.abs(savings)) + '</span>';
    }
  }

  sectorSelect.addEventListener("change", function() {
    if (this.value === "custom") {
      customRateWrap.classList.remove("hide");
      customRateInput.focus();
    } else {
      customRateWrap.classList.add("hide");
    }
    calc();
  });

  customRateInput.addEventListener("input", calc);
  firstYearCheckbox.addEventListener("change", calc);
  turnoverInput.addEventListener("input", calc);
  goodsCostInput.addEventListener("input", calc);

  resetBtn.addEventListener("click", function() {
    sectorSelect.value = "14.5";
    customRateWrap.classList.add("hide");
    customRateInput.value = "";
    firstYearCheckbox.checked = false;
    turnoverInput.value = "";
    goodsCostInput.value = "";
    calc();
  });

  calc();
});
