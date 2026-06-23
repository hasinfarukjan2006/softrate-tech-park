// nps.js - NPS Calculator logic for Softrate Tech Park

document.addEventListener('DOMContentLoaded', function () {
  // DOM Elements
  const inputForm = document.getElementById('nps-input-form');
  const resultsSection = document.getElementById('nps-results-section');

  // Input Elements
  const pInput = document.getElementById('investment');
  const rateInput = document.getElementById('rate');
  const investAgeInput = document.getElementById('investAge');
  const retireAgeInput = document.getElementById('retireAge');
  const apInput = document.getElementById('annuity_percent');
  const rpInput = document.getElementById('return_percent');

  // Error elements
  const errInvestment = document.getElementById('invalid-investment');
  const errInterest = document.getElementById('invalid-interest');
  const errStartYear = document.getElementById('invalid-start-year');
  const errEndYear = document.getElementById('invalid-end-year');
  const errAnnuity = document.getElementById('invalid-annuity');
  const errExpected = document.getElementById('invalid-expected');

  // Action Buttons
  const calculateBtn = document.getElementById('nps-calculate-btn');
  const resetBtn = document.getElementById('nps-reset-btn');
  const resultsResetBtn = document.getElementById('nps-results-reset-btn');
  const editBtn = document.getElementById('nps-edit-btn');

  // Result Text Placeholders
  const resTotalCorpus = document.getElementById('res-totalCorpus');
  const resTotalInvestment = document.getElementById('res-totalInvestment');
  const resInterestEarned = document.getElementById('res-interestEarned');
  const resMaturityAmount = document.getElementById('res-maturityAmount');
  const resLumpsum = document.getElementById('res-lumpsum');
  const resAnnuity = document.getElementById('res-annuity');
  const resPension = document.getElementById('res-pension');

  const chartContainer = document.getElementById('nps-chart-container');

  // Event Listeners for Buttons
  if (calculateBtn) {
    calculateBtn.addEventListener('click', handleCalculate);
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', resetForm);
  }

  if (resultsResetBtn) {
    resultsResetBtn.addEventListener('click', resetForm);
  }

  if (editBtn) {
    editBtn.addEventListener('click', showFormView);
  }

  // Live input validation listeners to clear errors on typing
  pInput.addEventListener('input', () => validateInvestment(true));
  rateInput.addEventListener('input', () => validateRate(true));
  investAgeInput.addEventListener('input', () => validateInvestAge(true));
  retireAgeInput.addEventListener('input', () => validateRetireAge(true));
  apInput.addEventListener('input', () => validateAnnuity(true));
  rpInput.addEventListener('input', () => validateExpected(true));

  // Initialize Lucide Icons on custom route load event just in case
  document.addEventListener('npsRouteLoaded', function() {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  });

  // Setup FAQ accordions
  initFaqAccordion();

  // Helper to format values in INR format
  function formatINR(value) {
    return '₹' + Math.round(value).toLocaleString('en-IN');
  }

  // Helper to check if string is numeric and positive
  function isNumericPositive(val) {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }

  // --- VALIDATION FUNCTIONS ---
  function validateInvestment(live = false) {
    const val = pInput.value.trim();
    if (!val) {
      if (!live) {
        pInput.style.borderColor = '#dc2626';
        errInvestment.style.display = 'block';
        errInvestment.innerText = 'Please enter your investment amount.';
      }
      return false;
    }
    const numVal = parseFloat(val);
    if (isNaN(numVal) || numVal <= 0) {
      if (!live) {
        pInput.style.borderColor = '#dc2626';
        errInvestment.style.display = 'block';
        errInvestment.innerText = 'Investment must be greater than 0.';
      }
      return false;
    }
    pInput.style.borderColor = '';
    errInvestment.style.display = 'none';
    return true;
  }

  function validateRate(live = false) {
    const val = rateInput.value.trim();
    if (!val || !isNumericPositive(val)) {
      if (!live) {
        rateInput.style.borderColor = '#dc2626';
        errInterest.style.display = 'block';
      }
      return false;
    }
    const numVal = parseFloat(val);
    if (numVal < 5 || numVal > 15) {
      if (!live) {
        rateInput.style.borderColor = '#dc2626';
        errInterest.style.display = 'block';
      }
      return false;
    }
    rateInput.style.borderColor = '';
    errInterest.style.display = 'none';
    return true;
  }

  function validateInvestAge(live = false) {
    const val = investAgeInput.value.trim();
    if (!val || !isNumericPositive(val)) {
      if (!live) {
        investAgeInput.style.borderColor = '#dc2626';
        errStartYear.style.display = 'block';
      }
      return false;
    }
    const numVal = parseInt(val, 10);
    if (numVal < 18 || numVal > 59) {
      if (!live) {
        investAgeInput.style.borderColor = '#dc2626';
        errStartYear.style.display = 'block';
      }
      return false;
    }
    investAgeInput.style.borderColor = '';
    errStartYear.style.display = 'none';
    return true;
  }

  function validateRetireAge(live = false) {
    const val = retireAgeInput.value.trim();
    const ageVal = parseInt(investAgeInput.value.trim(), 10);
    
    if (!val || !isNumericPositive(val)) {
      if (!live) {
        retireAgeInput.style.borderColor = '#dc2626';
        errEndYear.style.display = 'block';
        errEndYear.innerText = 'Your retirement age should be between 60 and 75 years.';
      }
      return false;
    }
    const numVal = parseInt(val, 10);
    if (numVal < 60 || numVal > 75) {
      if (!live) {
        retireAgeInput.style.borderColor = '#dc2626';
        errEndYear.style.display = 'block';
        errEndYear.innerText = 'Your retirement age should be between 60 and 75 years.';
      }
      return false;
    }
    if (!isNaN(ageVal) && numVal <= ageVal) {
      if (!live) {
        retireAgeInput.style.borderColor = '#dc2626';
        errEndYear.style.display = 'block';
        errEndYear.innerText = 'Retirement age must be greater than investment age.';
      }
      return false;
    }
    retireAgeInput.style.borderColor = '';
    errEndYear.style.display = 'none';
    return true;
  }

  function validateAnnuity(live = false) {
    const val = apInput.value.trim();
    if (!val || !isNumericPositive(val)) {
      if (!live) {
        apInput.style.borderColor = '#dc2626';
        errAnnuity.style.display = 'block';
      }
      return false;
    }
    const numVal = parseFloat(val);
    if (numVal < 40 || numVal > 100) {
      if (!live) {
        apInput.style.borderColor = '#dc2626';
        errAnnuity.style.display = 'block';
      }
      return false;
    }
    apInput.style.borderColor = '';
    errAnnuity.style.display = 'none';
    return true;
  }

  function validateExpected(live = false) {
    const val = rpInput.value.trim();
    if (!val || !isNumericPositive(val)) {
      if (!live) {
        rpInput.style.borderColor = '#dc2626';
        errExpected.style.display = 'block';
      }
      return false;
    }
    const numVal = parseFloat(val);
    if (numVal < 4 || numVal > 10) {
      if (!live) {
        rpInput.style.borderColor = '#dc2626';
        errExpected.style.display = 'block';
      }
      return false;
    }
    rpInput.style.borderColor = '';
    errExpected.style.display = 'none';
    return true;
  }

  function checkForm() {
    const isPValid = validateInvestment(false);
    const isRateValid = validateRate(false);
    const isInvestAgeValid = validateInvestAge(false);
    const isRetireAgeValid = validateRetireAge(false);
    const isApValid = validateAnnuity(false);
    const isRpValid = validateExpected(false);

    return isPValid && isRateValid && isInvestAgeValid && isRetireAgeValid && isApValid && isRpValid;
  }

  // --- ACTIONS ---
  function handleCalculate(e) {
    if (e) e.preventDefault();

    if (!checkForm()) {
      return;
    }

    // Parse values
    const P = parseFloat(pInput.value);
    const annualRate = parseFloat(rateInput.value);
    const investAge = parseInt(investAgeInput.value, 10);
    const retireAge = parseInt(retireAgeInput.value, 10);
    const annuityPercent = parseFloat(apInput.value);
    const annuityReturn = parseFloat(rpInput.value);

    // Compound Calculations
    const years = retireAge - investAge;
    const totalMonths = years * 12;
    const monthlyRate = annualRate / 12 / 100;

    // Maturity Amount (Future Value of Annuity Due)
    // Formula: P * (1 + r) * [((1 + r)^n - 1) / r]
    const maturityCorpus = Math.round(P * (monthlyRate + 1) * ((Math.pow(monthlyRate + 1, totalMonths) - 1) / monthlyRate));
    
    // Breakdown values
    const annuityValue = Math.round(maturityCorpus * (annuityPercent / 100));
    const lumpsumValue = maturityCorpus - annuityValue;
    const totalInvestment = P * totalMonths;
    const interestEarned = maturityCorpus - totalInvestment;

    // Monthly pension: (annuityValue * annuityReturn / 100) / 12
    const monthlyPension = Math.round(annuityValue * (annuityReturn / 100) / 12);

    // Update Results UI
    resTotalCorpus.innerText = formatINR(maturityCorpus);
    resTotalInvestment.innerText = formatINR(totalInvestment);
    resInterestEarned.innerText = formatINR(interestEarned);
    resMaturityAmount.innerText = formatINR(maturityCorpus);
    resLumpsum.innerText = formatINR(lumpsumValue);
    resAnnuity.innerText = formatINR(annuityValue);
    resPension.innerText = formatINR(monthlyPension);

    // Render Chart
    renderChart(maturityCorpus, lumpsumValue, annuityValue);

    // Hide input form and show results
    inputForm.classList.add('hide');
    resultsSection.classList.remove('hide');

    // Scroll container into view
    const container = document.querySelector('.nps-container');
    if (container) {
      container.scrollIntoView({ behavior: 'smooth' });
    }
  }

  function showFormView() {
    resultsSection.classList.add('hide');
    inputForm.classList.remove('hide');
  }

  function resetForm() {
    // Reset values to blank or default
    pInput.value = '';
    rateInput.value = '10';
    investAgeInput.value = '';
    retireAgeInput.value = '60';
    apInput.value = '40';
    rpInput.value = '6';

    // Clear styles and errors
    const inputs = [pInput, rateInput, investAgeInput, retireAgeInput, apInput, rpInput];
    inputs.forEach(input => {
      input.style.borderColor = '';
    });

    const errors = [errInvestment, errInterest, errStartYear, errEndYear, errAnnuity, errExpected];
    errors.forEach(err => {
      err.style.display = 'none';
    });

    // Reset views
    resultsSection.classList.add('hide');
    inputForm.classList.remove('hide');
  }

  // --- CHART RENDERING ---
  function getDonutSegmentPath(cx, cy, r_in, r_out, startAngle, endAngle) {
    const x1_out = cx + r_out * Math.cos(startAngle);
    const y1_out = cy + r_out * Math.sin(startAngle);
    const x2_out = cx + r_out * Math.cos(endAngle);
    const y2_out = cy + r_out * Math.sin(endAngle);
    
    const x1_in = cx + r_in * Math.cos(startAngle);
    const y1_in = cy + r_in * Math.sin(startAngle);
    const x2_in = cx + r_in * Math.cos(endAngle);
    const y2_in = cy + r_in * Math.sin(endAngle);
    
    const largeArc = (endAngle - startAngle) > Math.PI ? 1 : 0;
    
    return `M ${x1_out} ${y1_out} 
            A ${r_out} ${r_out} 0 ${largeArc} 1 ${x2_out} ${y2_out} 
            L ${x2_in} ${y2_in} 
            A ${r_in} ${r_in} 0 ${largeArc} 0 ${x1_in} ${y1_in} Z`;
  }

  function renderChart(total, lumpsum, annuity) {
    chartContainer.innerHTML = '';

    const width = 230;
    const height = 230;
    const cx = 0;
    const cy = 0;
    const r_out = 110;
    const r_in = 80;

    const startAngle = -Math.PI / 2;

    let slicesHtml = '';

    if (lumpsum > 0 && annuity > 0) {
      const lumpsumAngle = 2 * Math.PI * (lumpsum / total);
      const annuityAngle = 2 * Math.PI * (annuity / total);

      const endLumpsum = startAngle + lumpsumAngle;

      const pLump = getDonutSegmentPath(cx, cy, r_in, r_out, startAngle, endLumpsum);
      const pAnn = getDonutSegmentPath(cx, cy, r_in, r_out, endLumpsum, endLumpsum + annuityAngle - 0.0001);

      slicesHtml += `<path d="${pLump}" fill="#485de0" class="chart-slice" data-name="Lump sum value" data-value="${formatINR(lumpsum)}"></path>`;
      slicesHtml += `<path d="${pAnn}" fill="#47af43" class="chart-slice" data-name="Annuity Value" data-value="${formatINR(annuity)}"></path>`;
    } else if (lumpsum > 0) {
      const endAngle = startAngle + 2 * Math.PI - 0.0001;
      const pLump = getDonutSegmentPath(cx, cy, r_in, r_out, startAngle, endAngle);
      slicesHtml += `<path d="${pLump}" fill="#485de0" class="chart-slice" data-name="Lump sum value" data-value="${formatINR(lumpsum)}"></path>`;
    } else if (annuity > 0) {
      const endAngle = startAngle + 2 * Math.PI - 0.0001;
      const pAnn = getDonutSegmentPath(cx, cy, r_in, r_out, startAngle, endAngle);
      slicesHtml += `<path d="${pAnn}" fill="#47af43" class="chart-slice" data-name="Annuity Value" data-value="${formatINR(annuity)}"></path>`;
    }

    const svg = `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <g transform="translate(${width/2}, ${height/2})">
          ${slicesHtml}
          <g class="text-group" style="pointer-events: none;">
            <text class="name-text" text-anchor="middle" dy="-8" style="font-size: 13px; font-weight: 600; fill: #666666; font-family: inherit;">Maturity Amount</text>
            <text class="value-text" text-anchor="middle" dy="18" style="font-size: 18px; font-weight: 800; fill: #111111; font-family: inherit;">${formatINR(total)}</text>
          </g>
        </g>
      </svg>
    `;

    chartContainer.innerHTML = svg;

    // Add hover behaviors
    const slices = chartContainer.querySelectorAll('.chart-slice');
    const nameText = chartContainer.querySelector('.name-text');
    const valueText = chartContainer.querySelector('.value-text');

    slices.forEach(slice => {
      slice.style.cursor = 'pointer';
      
      slice.addEventListener('mouseover', function() {
        const name = this.getAttribute('data-name');
        const val = this.getAttribute('data-value');
        nameText.textContent = name;
        valueText.textContent = val;
        
        // Scale slice slightly on hover
        this.style.transform = 'scale(1.03)';
        this.style.opacity = '0.9';
      });

      slice.addEventListener('mouseout', function() {
        nameText.textContent = 'Maturity Amount';
        valueText.textContent = formatINR(total);
        
        // Reset transform
        this.style.transform = '';
        this.style.opacity = '';
      });
    });
  }

  // --- FAQs ACCORDION ---
  function initFaqAccordion() {
    const faqTriggers = document.querySelectorAll('.nps-faq-trigger');
    faqTriggers.forEach(trigger => {
      trigger.addEventListener('click', function() {
        const item = this.parentElement;
        const isActive = item.classList.contains('active');

        // Close all other items
        document.querySelectorAll('.nps-faq-item').forEach(el => {
          el.classList.remove('active');
        });

        // Toggle current item
        if (!isActive) {
          item.classList.add('active');
        }
      });
    });
  }
});
