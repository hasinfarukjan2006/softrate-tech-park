// bonus.js - Statutory Bonus Calculator logic for Softrate Tech Park

document.addEventListener('DOMContentLoaded', function () {
  // DOM Elements
  const formSection = document.getElementById('bonusFormSection');
  const resultCard = document.getElementById('bonusResultCard');

  const monthlySalaryInput = document.getElementById('bonusMonthlySalary');
  const bonusPercentageInput = document.getElementById('bonusPercentage');
  const minimumWageInput = document.getElementById('bonusMinimumWage');

  const calculateBtn = document.getElementById('bonusCalculateBtn');
  const resetBtn = document.getElementById('bonusResetBtn');
  const recalculateBtn = document.getElementById('bonusRecalculateBtn');

  // Error Message Elements
  const salaryError = document.getElementById('bonusSalaryError');
  const percentageError = document.getElementById('bonusPercentageError');
  const wageError = document.getElementById('bonusWageError');

  // Result Placeholders
  const resBonusAmountBig = document.getElementById('resBonusAmountBig');
  const resMonthlyBonus = document.getElementById('resMonthlyBonus');
  const resAnnualBonus = document.getElementById('resAnnualBonus');
  const resSalaryUsed = document.getElementById('resSalaryUsed');
  const resBonusPercent = document.getElementById('resBonusPercent');

  // Input bindings
  if (calculateBtn) {
    calculateBtn.addEventListener('click', calculateBonus);
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
  if (monthlySalaryInput) {
    monthlySalaryInput.addEventListener('input', function() {
      validateSalary(this);
    });
  }

  if (bonusPercentageInput) {
    bonusPercentageInput.addEventListener('input', function() {
      validatePercentage(this);
    });
  }

  if (minimumWageInput) {
    minimumWageInput.addEventListener('input', function() {
      validateWage(this);
    });
  }

  // Validation functions
  function validateSalary(element) {
    const val = parseFloat(element.value);
    if (isNaN(val) || val < 100 || val > 21000) {
      element.style.borderColor = '#dc2626';
      if (salaryError) salaryError.style.display = 'block';
      return false;
    } else {
      element.style.borderColor = '#cccccc';
      if (salaryError) salaryError.style.display = 'none';
      return true;
    }
  }

  function validatePercentage(element) {
    const val = parseFloat(element.value);
    if (isNaN(val) || val < 8.33 || val > 20) {
      element.style.borderColor = '#dc2626';
      if (percentageError) percentageError.style.display = 'block';
      return false;
    } else {
      element.style.borderColor = '#cccccc';
      if (percentageError) percentageError.style.display = 'none';
      return true;
    }
  }

  function validateWage(element) {
    const val = parseFloat(element.value);
    if (isNaN(val) || val < 0 || val >= 21000) {
      element.style.borderColor = '#dc2626';
      if (wageError) wageError.style.display = 'block';
      return false;
    } else {
      element.style.borderColor = '#cccccc';
      if (wageError) wageError.style.display = 'none';
      return true;
    }
  }

  // Calculation handler
  function calculateBonus(e) {
    if (e) e.preventDefault();

    // Validate inputs
    const isSalaryValid = validateSalary(monthlySalaryInput);
    const isPercentValid = validatePercentage(bonusPercentageInput);
    const isWageValid = validateWage(minimumWageInput);

    if (!isSalaryValid || !isPercentValid || !isWageValid) {
      alert('Please correct all invalid inputs before calculating.');
      return;
    }

    // Fetch numeric values
    const monthlySalary = parseFloat(monthlySalaryInput.value) || 0;
    const bonusPercentage = parseFloat(bonusPercentageInput.value) || 0;
    const minimumWage = parseFloat(minimumWageInput.value) || 0;

    // Calculate Eligible Salary considered
    let eligibleSalary = 0;
    if (monthlySalary <= 7000) {
      eligibleSalary = monthlySalary;
    } else {
      eligibleSalary = Math.max(7000, minimumWage);
    }

    // Calculate Bonus Amounts
    const monthlyBonus = eligibleSalary * (bonusPercentage / 100.0);
    const annualBonus = monthlyBonus * 12;

    // Populate Results Screen
    if (resBonusAmountBig) {
      resBonusAmountBig.textContent = formatINR(annualBonus);
    }
    if (resMonthlyBonus) {
      resMonthlyBonus.textContent = formatINR(monthlyBonus);
    }
    if (resAnnualBonus) {
      resAnnualBonus.textContent = formatINR(annualBonus);
    }
    if (resSalaryUsed) {
      resSalaryUsed.textContent = formatINR(eligibleSalary);
    }
    if (resBonusPercent) {
      resBonusPercent.textContent = `${bonusPercentage}%`;
    }

    // Transition View (hide form, show results)
    if (formSection) {
      formSection.style.display = 'none';
    }
    if (resultCard) {
      resultCard.style.display = 'block';
      resultCard.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Start Over reset
  function resetCalculator(e) {
    if (e) e.preventDefault();

    // Reset default values
    if (monthlySalaryInput) monthlySalaryInput.value = '';
    if (bonusPercentageInput) bonusPercentageInput.value = '';
    if (minimumWageInput) minimumWageInput.value = '';

    // Clear styling and errors
    const inputs = [monthlySalaryInput, bonusPercentageInput, minimumWageInput];
    inputs.forEach(input => {
      if (input) input.style.borderColor = '#cccccc';
    });

    const errors = [salaryError, percentageError, wageError];
    errors.forEach(err => {
      if (err) err.style.display = 'none';
    });
  }

  // Recalculate - show form section again
  function showFormSection(e) {
    if (e) e.preventDefault();

    if (resultCard) {
      resultCard.style.display = 'none';
    }
    if (formSection) {
      formSection.style.display = 'block';
      formSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Interactive accordion FAQ toggle handling
  function initFaqAccordion() {
    const faqItems = document.querySelectorAll('#bonus-section .bonus-faq-item');
    faqItems.forEach(item => {
      const trigger = item.querySelector('.bonus-faq-trigger');
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
