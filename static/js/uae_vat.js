/* uae_vat.js — UAE VAT Live Calculation Engine */
document.addEventListener("DOMContentLoaded", function() {
  const container = document.getElementById("uae-vat-section");
  if (!container) return;

  const inputAmount = document.getElementById("uaeAmount");
  const selectVatRate = document.getElementById("uaeVatRate");
  const selectTaxType = document.getElementById("uaeTaxType");

  const outActual = document.getElementById("uaeOutActual");
  const outVat = document.getElementById("uaeOutVat");
  const outTotal = document.getElementById("uaeOutTotal");

  function formatValue(val) {
    // Standard format matching screenshots (whole numbers where possible, or fixed decimal)
    if (val === 0) return "0";
    if (val % 1 === 0) {
      return val.toLocaleString("en-US");
    }
    return val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function calculate() {
    const amount = parseFloat(inputAmount.value) || 0;
    const vatRate = (parseFloat(selectVatRate.value) || 0) / 100.0;
    const taxType = selectTaxType.value;

    let actualAmount = 0;
    let vatAmount = 0;
    let totalAmount = 0;

    if (taxType === "exclusive") {
      actualAmount = amount;
      vatAmount = amount * vatRate;
      totalAmount = amount + vatAmount;
    } else {
      // inclusive
      actualAmount = amount / (1.0 + vatRate);
      vatAmount = amount - actualAmount;
      totalAmount = amount;
    }

    // Render results
    outActual.textContent = formatValue(actualAmount);
    outVat.textContent = formatValue(vatAmount);
    outTotal.textContent = formatValue(totalAmount);
  }

  // Bind keyup, change, input events
  inputAmount.addEventListener("input", calculate);
  selectVatRate.addEventListener("change", calculate);
  selectTaxType.addEventListener("change", calculate);

  // Initial run
  calculate();
});
