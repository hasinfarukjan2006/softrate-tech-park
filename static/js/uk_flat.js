/* uk_flat.js — Step Wizard FRS Calculator */
document.addEventListener("DOMContentLoaded", function() {
  const container = document.getElementById("uk-flat-section");
  if (!container) return;

  const selectSector = document.getElementById("frsSelectSector");
  const btnGoStep2 = document.getElementById("frsBtnGoStep2");
  const chips = container.querySelectorAll(".frs-chip");

  const step1 = document.getElementById("frsStep1");
  const step2 = document.getElementById("frsStep2");
  const step3 = document.getElementById("frsStep3");

  const ind1 = document.getElementById("stepIndicator1");
  const ind2 = document.getElementById("stepIndicator2");
  const ind3 = document.getElementById("stepIndicator3");

  const btnGoStep3 = document.getElementById("frsBtnGoStep3");
  const btnRestart = document.getElementById("frsBtnRestart");

  // Inputs
  const inputTurnover = document.getElementById("frsTurnover");
  const inputVatCollected = document.getElementById("frsVatCollected");
  const inputCapExp = document.getElementById("frsCapExp");

  // Outputs
  const findStd = document.getElementById("frsFindStd");
  const findFlat = document.getElementById("frsFindFlat");
  const findSavings = document.getElementById("frsFindSavings");
  const findRec = document.getElementById("frsFindRec");
  const savingsBox = document.getElementById("frsSavingsBox");

  let selectedRate = 0;
  let currentStep = 1;

  function fmt(n) {
    if (n < 0) {
      return "-£" + Math.abs(n).toLocaleString("en-GB", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }
    return "£" + n.toLocaleString("en-GB", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  function goToStep(step) {
    if (step === 1) {
      step1.classList.remove("hide");
      step2.classList.add("hide");
      step3.classList.add("hide");
      
      ind1.className = "frs-step active";
      ind2.className = "frs-step";
      ind3.className = "frs-step";
      currentStep = 1;
    } else if (step === 2) {
      if (!selectedRate) return;
      step1.classList.add("hide");
      step2.classList.remove("hide");
      step3.classList.add("hide");
      
      ind1.className = "frs-step completed";
      ind2.className = "frs-step active";
      ind3.className = "frs-step";
      currentStep = 2;
    } else if (step === 3) {
      if (currentStep < 2) return;
      step1.classList.add("hide");
      step2.classList.add("hide");
      step3.classList.remove("hide");
      
      ind1.className = "frs-step completed";
      ind2.className = "frs-step completed";
      ind3.className = "frs-step completed";
      currentStep = 3;
    }
  }

  // Click on indicators to navigate
  ind1.addEventListener("click", function() {
    goToStep(1);
  });
  ind2.addEventListener("click", function() {
    if (selectedRate > 0) {
      goToStep(2);
    }
  });

  // Step 1 logic: select handler
  selectSector.addEventListener("change", function() {
    selectedRate = parseFloat(this.value) || 0;
    btnGoStep2.disabled = false;
    
    // Deactivate all chips
    chips.forEach(c => c.classList.remove("active"));
    
    // Highlight matching chip if any
    const matchingChip = Array.from(chips).find(c => parseFloat(c.getAttribute("data-value")) === selectedRate);
    if (matchingChip) matchingChip.classList.add("active");
  });

  // Chip click handler
  chips.forEach(chip => {
    chip.addEventListener("click", function() {
      const rate = parseFloat(this.getAttribute("data-value"));
      
      chips.forEach(c => c.classList.remove("active"));
      this.classList.add("active");
      
      // Update select value
      selectSector.value = rate;
      selectedRate = rate;
      btnGoStep2.disabled = false;
    });
  });

  // Go to step 2
  btnGoStep2.addEventListener("click", function() {
    goToStep(2);
  });

  // Calculate & Go to step 3 (Findings)
  btnGoStep3.addEventListener("click", function() {
    const turnover = parseFloat(inputTurnover.value) || 0;
    const vatPaidReclaimed = parseFloat(inputVatCollected.value) || 0;
    const vatReclaimedCap = parseFloat(inputCapExp.value) || 0;

    // Standard VAT = (Turnover * 20 / 120) - VAT paid or reclaimed
    const standardVat = (turnover * 20 / 120) - vatPaidReclaimed;

    // Flat Rate VAT = (Turnover * selectedRate / 100) - VAT reclaimed on Capital Assets
    const flatRateVat = (turnover * selectedRate / 100) - vatReclaimedCap;

    // Savings = Standard VAT - Flat Rate VAT
    const savings = standardVat - flatRateVat;

    // Render results
    findStd.textContent = fmt(standardVat);
    findFlat.textContent = fmt(flatRateVat);
    findSavings.textContent = fmt(savings);

    // Percentage Saved calculation
    let pctSaved = 0;
    if (standardVat > 0) {
      pctSaved = Math.round((savings / standardVat) * 100);
    }

    if (savings > 0) {
      findRec.textContent = `Using the Flat Rate Scheme you can reduce your taxes paid by ${pctSaved}%`;
      savingsBox.className = "frs-findings-badge-box";
    } else {
      let lossPct = 0;
      if (standardVat > 0) {
        lossPct = Math.round((Math.abs(savings) / standardVat) * 100);
      }
      findRec.textContent = `Using the Current Scheme you can reduce your taxes paid by ${lossPct}%`;
      savingsBox.className = "frs-findings-badge-box red-box";
    }

    goToStep(3);
  });

  // Restart wizard
  btnRestart.addEventListener("click", function() {
    // Reset inputs
    inputTurnover.value = "";
    inputVatCollected.value = "";
    inputCapExp.value = "";
    selectSector.value = "";
    btnGoStep2.disabled = true;
    selectedRate = 0;
    
    chips.forEach(c => c.classList.remove("active"));
    goToStep(1);
  });
});
