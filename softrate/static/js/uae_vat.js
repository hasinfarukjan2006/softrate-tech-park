/* uae_vat.js — UAE VAT Calculator logic */
document.addEventListener("DOMContentLoaded", function() {
  const container = document.getElementById("uae-vat-section");
  if (!container) return;

  const amtInput = document.getElementById("uaeVatAmount");
  const custRateWrap = document.getElementById("uaeVatCustomRateWrap");
  const custRateInput = document.getElementById("uaeVatCustomRate");
  const netVal = document.getElementById("uaeVatNet");
  const amtVal = document.getElementById("uaeVatAmt");
  const grossVal = document.getElementById("uaeVatGross");
  const resetBtn = document.getElementById("uaeVatReset");

  function fmt(n) {
    return "AED " + Math.abs(n).toLocaleString("en-AE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function getSelectedRate() {
    const checkedRateOpt = container.querySelector("input[name='uaeVatRateOpt']:checked");
    if (!checkedRateOpt) return 5;
    if (checkedRateOpt.value === "custom") {
      return parseFloat(custRateInput.value) || 0;
    }
    return parseFloat(checkedRateOpt.value) || 0;
  }

  function calc() {
    const amt = parseFloat(amtInput.value) || 0;
    const rate = getSelectedRate();
    const action = container.querySelector("input[name='uaeVatAction']:checked").value;

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
  container.querySelectorAll("input[name='uaeVatRateOpt']").forEach(r => {
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

  container.querySelectorAll("input[name='uaeVatAction']").forEach(r => {
    r.addEventListener("change", calc);
  });

  amtInput.addEventListener("input", calc);
  custRateInput.addEventListener("input", calc);

  resetBtn.addEventListener("click", function() {
    amtInput.value = "";
    custRateInput.value = "";
    container.querySelector("#uaeVatAdd").checked = true;
    container.querySelector("#uaeRateStd").checked = true;
    custRateWrap.classList.add("hide");
    calc();
  });

  calc();
});
