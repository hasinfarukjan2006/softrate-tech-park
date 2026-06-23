// gratuity.js - Gratuity Calculator logic for Softrate Tech Park

document.addEventListener('DOMContentLoaded', function () {
  // DOM Elements
  const formSection = document.getElementById('gratuityFormSection');
  const resultCard = document.getElementById('gratuityResultCard');

  const salaryInput = document.getElementById('gratuitySalary');
  const yearsInput = document.getElementById('gratuityYears');
  const monthsInput = document.getElementById('gratuityMonths');

  const calculateBtn = document.getElementById('gratuityCalculateBtn');
  const resetBtn = document.getElementById('gratuityResetBtn');
  const recalculateBtn = document.getElementById('gratuityRecalculateBtn');

  // Error Message Elements
  const salaryError = document.getElementById('gratuitySalaryError');
  const yearsError = document.getElementById('gratuityYearsError');
  const monthsError = document.getElementById('gratuityMonthsError');

  // Result Placeholders
  const resGratuityAmountBig = document.getElementById('resGratuityAmountBig');
  const resMonthlySalary = document.getElementById('resMonthlySalary');
  const resYearsConsidered = document.getElementById('resYearsConsidered');
  const resFormulaUsed = document.getElementById('resFormulaUsed');
  const resGratuityAmount = document.getElementById('resGratuityAmount');

  // Input bindings
  if (calculateBtn) {
    calculateBtn.addEventListener('click', calculateGratuity);
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', resetCalculator);
  }

  if (recalculateBtn) {
    recalculateBtn.addEventListener('click', showFormSection);
  }

  // Setup FAQ Toggles
  initFaqAccordion();

  // Helper to format currency as Indian Rupees (₹)
  function formatINR(value) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(value);
  }

  // Live validations
  if (salaryInput) {
    salaryInput.addEventListener('input', function() {
      validateSalary(this);
    });
  }

  if (yearsInput) {
    yearsInput.addEventListener('input', function() {
      validateYears(this);
    });
  }

  if (monthsInput) {
    monthsInput.addEventListener('input', function() {
      validateMonths(this);
    });
  }

  // Validation functions
  function validateSalary(element) {
    const val = parseFloat(element.value);
    if (isNaN(val) || val <= 0) {
      element.style.borderColor = '#dc2626';
      if (salaryError) salaryError.style.display = 'block';
      return false;
    } else {
      element.style.borderColor = '#cccccc';
      if (salaryError) salaryError.style.display = 'none';
      return true;
    }
  }

  function validateYears(element) {
    const val = parseInt(element.value);
    if (isNaN(val) || val < 0) {
      element.style.borderColor = '#dc2626';
      if (yearsError) yearsError.style.display = 'block';
      return false;
    } else {
      element.style.borderColor = '#cccccc';
      if (yearsError) yearsError.style.display = 'none';
      return true;
    }
  }

  function validateMonths(element) {
    const val = parseInt(element.value);
    if (isNaN(val) || val < 0 || val > 11) {
      element.style.borderColor = '#dc2626';
      if (monthsError) monthsError.style.display = 'block';
      return false;
    } else {
      element.style.borderColor = '#cccccc';
      if (monthsError) monthsError.style.display = 'none';
      return true;
    }
  }

  // Calculation handler
  function calculateGratuity(e) {
    if (e) e.preventDefault();

    // Validate inputs
    const isSalaryValid = validateSalary(salaryInput);
    const isYearsValid = validateYears(yearsInput);
    const isMonthsValid = validateMonths(monthsInput);

    if (!isSalaryValid || !isYearsValid || !isMonthsValid) {
      alert('Please fill out all input fields with valid positive values.');
      return;
    }

    // Fetch values
    const monthlySalary = parseFloat(salaryInput.value) || 0;
    const completedYears = parseInt(yearsInput.value) || 0;
    const additionalMonths = parseInt(monthsInput.value) || 0;

    // Apply rule: If additional months > 6, increase service years by 1
    let yearsConsidered = completedYears;
    if (additionalMonths > 6) {
      yearsConsidered += 1;
    }

    // Calculate Gratuity: (Last Drawn Salary * 15 * Years Considered) / 26
    const gratuityVal = (monthlySalary * 15 * yearsConsidered) / 26;

    // Populate Results Screen
    if (resGratuityAmountBig) resGratuityAmountBig.textContent = formatINR(gratuityVal);
    if (resMonthlySalary) resMonthlySalary.textContent = formatINR(monthlySalary);
    if (resYearsConsidered) resYearsConsidered.textContent = `${yearsConsidered} Years (Completed: ${completedYears} Y, ${additionalMonths} M)`;
    if (resFormulaUsed) resFormulaUsed.textContent = `(${formatINR(monthlySalary)} × 15 × ${yearsConsidered}) ÷ 26`;
    if (resGratuityAmount) resGratuityAmount.textContent = formatINR(gratuityVal);

    // Transition View (hide form, show results)
    if (formSection) formSection.style.display = 'none';
    if (resultCard) {
      resultCard.style.display = 'block';
      resultCard.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Start Over reset
  function resetCalculator(e) {
    if (e) e.preventDefault();

    // Reset inputs to completely empty strings
    if (salaryInput) salaryInput.value = '';
    if (yearsInput) yearsInput.value = '';
    if (monthsInput) monthsInput.value = '';

    // Clear border styling and error messages
    const inputs = [salaryInput, yearsInput, monthsInput];
    inputs.forEach(input => {
      if (input) input.style.borderColor = '#cccccc';
    });

    const errors = [salaryError, yearsError, monthsError];
    errors.forEach(err => {
      if (err) err.style.display = 'none';
    });
  }

  // Recalculate - show form section again
  function showFormSection(e) {
    if (e) e.preventDefault();

    if (resultCard) resultCard.style.display = 'none';
    if (formSection) {
      formSection.style.display = 'block';
      formSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Interactive accordion FAQ toggle handling
  function initFaqAccordion() {
    const faqItems = document.querySelectorAll('#gratuity-section .gratuity-faq-item');
    faqItems.forEach(item => {
      const trigger = item.querySelector('.gratuity-faq-trigger');
      if (trigger) {
        trigger.addEventListener('click', function () {
          const isActive = item.classList.contains('active');
          
          faqItems.forEach(otherItem => {
            otherItem.classList.remove('active');
          });

          if (!isActive) {
            item.classList.add('active');
          }
        });
      }
    });
  }
});
