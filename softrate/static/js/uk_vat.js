/* uk_vat.js — UK VAT Calculator logic */
document.addEventListener("DOMContentLoaded", function() {
  const container = document.getElementById("uk-vat-section");
  if (!container) return;

  const amtInput = document.getElementById("ukVatAmount");
  const custRateWrap = document.getElementById("ukVatCustomRateWrap");
  const custRateInput = document.getElementById("ukVatCustomRate");
  const netVal = document.getElementById("ukVatNet");
  const amtVal = document.getElementById("ukVatAmt");
  const grossVal = document.getElementById("ukVatGross");
  const resetBtn = document.getElementById("ukVatReset");

  function fmt(n) {
    return "\u00A3" + Math.abs(n).toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function getSelectedRate() {
    const checkedRateOpt = container.querySelector("input[name='ukVatRateOpt']:checked");
    if (!checkedRateOpt) return 20;
    if (checkedRateOpt.value === "custom") {
      return parseFloat(custRateInput.value) || 0;
    }
    return parseFloat(checkedRateOpt.value) || 0;
  }

  function calc() {
    const amt = parseFloat(amtInput.value) || 0;
    const rate = getSelectedRate();
    const action = container.querySelector("input[name='ukVatAction']:checked").value;

    let net = 0, vat = 0, gross = 0;

    if (action === "add") {
      net = amt;
      vat = net * (rate / 100);
      gross = net + vat;
    } else {
      gross = amt;
      net = gross / (1 + (rate / 100));
      vat = gross - net;
    }

    netVal.textContent = (net < 0 ? "- " : "") + fmt(net);
    amtVal.textContent = fmt(vat);
    grossVal.textContent = (gross < 0 ? "- " : "") + fmt(gross);
  }

  // Toggle custom rate input visibility
  container.querySelectorAll("input[name='ukVatRateOpt']").forEach(r => {
    r.addEventListener("change", function() {
      if (this.value === "custom") {
        custRateWrap.classList.remove("hide");
        custRateInput.focus();
      } else {
        custRateWrap.classList.add("hide");
      }
      calc();
    });
  });

  container.querySelectorAll("input[name='ukVatAction']").forEach(r => {
    r.addEventListener("change", calc);
  });

  amtInput.addEventListener("input", calc);
  custRateInput.addEventListener("input", calc);

  resetBtn.addEventListener("click", function() {
    amtInput.value = "";
    custRateInput.value = "";
    container.querySelector("#ukVatAdd").checked = true;
    container.querySelector("#ukRateStd").checked = true;
    custRateWrap.classList.add("hide");
    calc();
  });

  calc();
});
