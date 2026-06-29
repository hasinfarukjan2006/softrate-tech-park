/* uk_vat_calculator.js — UK VAT Calculator Logic */
document.addEventListener("DOMContentLoaded", function() {
  const container = document.getElementById("uk-vat-section");
  if (!container) return;

  const inputAmount = document.getElementById("ukVatAmount");
  const inputRate = document.getElementById("ukVatRate");
  const btnAddVat = document.getElementById("ukBtnAddVat");
  const btnRemoveVat = document.getElementById("ukBtnRemoveVat");

  const outVat = document.getElementById("ukOutVat");
  const outTotal = document.getElementById("ukOutTotal");
  const lblVat = document.getElementById("ukLblVat");
  const lblTotal = document.getElementById("ukLblTotal");

  let action = "add"; // "add" | "remove"

  function formatValue(val) {
    if (val === 0) return "0.00";
    return val.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function calculate() {
    const amount = parseFloat(inputAmount.value) || 0;
    const rate = parseFloat(inputRate.value) || 0;

    let vatAmount = 0;
    let totalAmount = 0;

    if (action === "add") {
      vatAmount = amount * rate / 100.0;
      totalAmount = amount + vatAmount;
      lblVat.textContent = "VAT Amount";
      lblTotal.textContent = "Inclusive Amount";
    } else {
      // Remove VAT
      const netAmount = amount / (1.0 + rate / 100.0);
      vatAmount = amount - netAmount;
      totalAmount = netAmount; // net amount is exclusive amount
      lblVat.textContent = "VAT Amount";
      lblTotal.textContent = "Exclusive Amount";
    }

    outVat.textContent = formatValue(vatAmount);
    outTotal.textContent = formatValue(totalAmount);
  }

  btnAddVat.addEventListener("click", function() {
    btnAddVat.classList.add("active");
    btnRemoveVat.classList.remove("active");
    action = "add";
    calculate();
  });

  btnRemoveVat.addEventListener("click", function() {
    btnRemoveVat.classList.add("active");
    btnAddVat.classList.remove("active");
    action = "remove";
    calculate();
  });

  inputAmount.addEventListener("input", calculate);
  inputRate.addEventListener("input", calculate);

  // Initial Calculation
  calculate();
});
