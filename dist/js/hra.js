// hra.js - HRA Exemption Calculator logic for Softrate Tech Park

document.addEventListener('DOMContentLoaded', function () {
  // DOM Elements
  const basicSalaryInput = document.getElementById('hraBasicSalary');
  const hraReceivedInput = document.getElementById('hraReceived');
  const rentPaidInput = document.getElementById('hraRentPaid');
  const cityTypeSelect = document.getElementById('hraCityType');
  const calculateBtn = document.getElementById('hraCalculateBtn');
  const resetBtn = document.getElementById('hraResetBtn');
  
  // Results panel container
  const resultCard = document.getElementById('hraResultCard');
  
  // Result value placeholders
  const resExemptionAmount = document.getElementById('resExemptionAmount');
  const resTaxableHra = document.getElementById('resTaxableHra');
  const resActualHra = document.getElementById('resActualHra');
  const resRentPaid = document.getElementById('resRentPaid');
  const resExemptionPercent = document.getElementById('resExemptionPercent');
  
  // Breakdown text placeholders
  const breakdownSalaryTenPercent = document.getElementById('breakdownSalaryTenPercent');
  const breakdownRentLessTen = document.getElementById('breakdownRentLessTen');
  const breakdownCityPercent = document.getElementById('breakdownCityPercent');
  const breakdownCityAmount = document.getElementById('breakdownCityAmount');

  // Input validation state indicators
  const inputs = [basicSalaryInput, hraReceivedInput, rentPaidInput];

  // Initialize event listeners
  if (calculateBtn) {
    calculateBtn.addEventListener('click', calculateHRA);
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', resetCalculator);
  }

  // Live validation triggers
  inputs.forEach(input => {
    if (input) {
      input.addEventListener('input', function() {
        validateInput(this);
      });
    }
  });

  // Setup FAQ Toggles
  initFaqAccordion();

  // Helper function to format currency as Indian Rupees (₹)
  function formatINR(value) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  }

  // Validate positive numeric inputs (> 0)
  function validateInput(element) {
    if (!element) return false;
    const val = parseFloat(element.value);
    if (isNaN(val) || val <= 0) {
      element.style.borderColor = '#dc2626'; // red warning border
      return false;
    } else {
      element.style.borderColor = '#d1d5db'; // default gray border
      return true;
    }
  }

  // Helper to safely set element text content
  function setElementText(element, text) {
    if (element) {
      element.textContent = text;
    }
  }

  // Core HRA Exemption Calculator logic
  function calculateHRA(e) {
    if (e) e.preventDefault();

    // 1. Validate all input fields
    let isValid = true;
    inputs.forEach(input => {
      if (!validateInput(input) || input.value === '') {
        if (input) input.style.borderColor = '#dc2626';
        isValid = false;
      }
    });

    if (!isValid) {
      alert('Please fill out all numeric inputs with valid positive values (greater than 0).');
      return;
    }

    // 2. Fetch input values
    const basicSalary = parseFloat(basicSalaryInput ? basicSalaryInput.value : 0) || 0;
    const hraReceived = parseFloat(hraReceivedInput ? hraReceivedInput.value : 0) || 0;
    const rentPaid = parseFloat(rentPaidInput ? rentPaidInput.value : 0) || 0;
    const isMetro = cityTypeSelect ? cityTypeSelect.value === 'metro' : true;

    // 3. Compute HRA rules
    // Rule 1: Actual HRA received
    const actualHraRule = hraReceived;

    // Rule 2: Rent Paid minus 10% of basic salary
    const tenPercentSalary = basicSalary * 0.10;
    const rentLessTenPercentSalary = Math.max(0, rentPaid - tenPercentSalary);

    // Rule 3: 50% of basic salary (Metro) or 40% (Non-Metro)
    const cityPercentage = isMetro ? 0.50 : 0.40;
    const citySalaryRule = basicSalary * cityPercentage;

    // Rule 4: Exemption is the minimum of all three rules
    const hraExemption = Math.min(actualHraRule, rentLessTenPercentSalary, citySalaryRule);
    const taxableHra = Math.max(0, hraReceived - hraExemption);
    
    // Percentage display
    const exemptionPercentage = hraReceived > 0 ? Math.round((hraExemption / hraReceived) * 100) : 0;

    // 4. Update UI results card
    setElementText(resExemptionAmount, formatINR(hraExemption));
    setElementText(resTaxableHra, formatINR(taxableHra));
    setElementText(resActualHra, formatINR(hraReceived));
    setElementText(resRentPaid, formatINR(rentPaid));
    setElementText(resExemptionPercent, `${exemptionPercentage}%`);

    // 5. Update Calculation Breakdown Card details
    setElementText(breakdownSalaryTenPercent, formatINR(tenPercentSalary));
    setElementText(breakdownRentLessTen, formatINR(rentLessTenPercentSalary));
    setElementText(breakdownCityPercent, isMetro ? '50%' : '40%');
    setElementText(breakdownCityAmount, formatINR(citySalaryRule));

    // Show Results Panel
    if (resultCard) {
      resultCard.style.display = 'block';
      resultCard.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Reset Calculator values
  function resetCalculator(e) {
    if (e) e.preventDefault();

    // Reset inputs
    basicSalaryInput.value = '';
    hraReceivedInput.value = '';
    rentPaidInput.value = '';
    cityTypeSelect.value = '';

    // Reset border styling
    inputs.forEach(input => {
      input.style.borderColor = '#d1d5db';
    });

    // Hide result card
    if (resultCard) {
      resultCard.style.display = 'none';
    }
  }

  // Interactive accordion FAQ toggle handling
  function initFaqAccordion() {
    const faqItems = document.querySelectorAll('#hra-section .hra-faq-item');
    faqItems.forEach(item => {
      const trigger = item.querySelector('.hra-faq-trigger');
      if (trigger) {
        trigger.addEventListener('click', function () {
          // Toggle current active state
          const isActive = item.classList.contains('active');
          
          // Close other opened accordion entries (optional accordion behavior)
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
