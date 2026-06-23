/* ============================================================
   BREAK-EVEN POINT CALCULATOR — Scoped JS Controller
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  let isInitialized = false;

  const currencySymbols = {
    'INR': '₹',
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'AED': 'Dh'
  };

  function initBreakEven() {
    if (isInitialized) return;

    bindCalculatorEvents();
    initFaqAccordion();
    isInitialized = true;
  }

  function bindCalculatorEvents() {
    const fcInput = document.getElementById('beFixedCosts');
    const spInput = document.getElementById('beSellingPrice');
    const vcInput = document.getElementById('beVariableCost');
    const currencySelect = document.getElementById('beCurrencySelect');
    const resetBtn = document.getElementById('beResetBtn');
    
    // Radios
    const toggleUnits = document.getElementById('beToggleUnits');
    const toggleRevenue = document.getElementById('beToggleRevenue');

    if (!fcInput || !spInput || !vcInput) return;

    // Instant calculation listeners
    const inputs = [fcInput, spInput, vcInput];
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        clearError(input.id);
        calculateBreakEven();
      });
    });

    if (currencySelect) {
      currencySelect.addEventListener('change', () => {
        updateCurrencyAddons();
        calculateBreakEven();
      });
    }

    if (toggleUnits && toggleRevenue) {
      toggleUnits.addEventListener('change', () => {
        updateActiveResultHighlight();
      });
      toggleRevenue.addEventListener('change', () => {
        updateActiveResultHighlight();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        resetCalculator();
      });
    }

    // Set initial layout highlights
    updateActiveResultHighlight();
  }

  function clearError(inputId) {
    const input = document.getElementById(inputId);
    const errEl = document.getElementById(inputId + 'Error');
    if (input) input.style.borderColor = '#cbd5e1';
    if (errEl) errEl.style.display = 'none';
  }

  function updateCurrencyAddons() {
    const currencySelect = document.getElementById('beCurrencySelect');
    const symbol = currencySymbols[currencySelect.value] || '₹';
    
    const fixedAddon = document.getElementById('beFixedAddon');
    const sellingAddon = document.getElementById('beSellingAddon');
    const variableAddon = document.getElementById('beVariableAddon');

    if (fixedAddon) fixedAddon.textContent = symbol;
    if (sellingAddon) sellingAddon.textContent = symbol;
    if (variableAddon) variableAddon.textContent = symbol;
  }

  function updateActiveResultHighlight() {
    const toggleUnits = document.getElementById('beToggleUnits');
    const resUnitsItem = document.getElementById('beResUnitsItem');
    const resRevenueItem = document.getElementById('beResRevenueItem');

    if (!resUnitsItem || !resRevenueItem) return;

    if (toggleUnits && toggleUnits.checked) {
      resUnitsItem.style.opacity = '1';
      resUnitsItem.style.transform = 'scale(1.03)';
      resUnitsItem.style.transition = 'all 0.2s ease';
      
      resRevenueItem.style.opacity = '0.5';
      resRevenueItem.style.transform = 'scale(1)';
    } else {
      resUnitsItem.style.opacity = '0.5';
      resUnitsItem.style.transform = 'scale(1)';
      
      resRevenueItem.style.opacity = '1';
      resRevenueItem.style.transform = 'scale(1.03)';
      resRevenueItem.style.transition = 'all 0.2s ease';
    }
  }

  function calculateBreakEven() {
    const fcInput = document.getElementById('beFixedCosts');
    const spInput = document.getElementById('beSellingPrice');
    const vcInput = document.getElementById('beVariableCost');
    const currencySelect = document.getElementById('beCurrencySelect');

    const fcError = document.getElementById('beFixedCostsError');
    const spError = document.getElementById('beSellingPriceError');
    const vcError = document.getElementById('beVariableCostError');

    const resUnitsValue = document.getElementById('beResUnitsValue');
    const resRevenueValue = document.getElementById('beResRevenueValue');

    if (!fcInput || !spInput || !vcInput) return;

    const fcVal = parseFloat(fcInput.value);
    const spVal = parseFloat(spInput.value);
    const vcVal = parseFloat(vcInput.value);
    const symbol = currencySelect ? currencySymbols[currencySelect.value] : '₹';

    let hasErrors = false;

    // Reset styles
    clearError('beFixedCosts');
    clearError('beSellingPrice');
    clearError('beVariableCost');

    // If inputs are empty, don't show error yet (just keep outputs at 0)
    if (fcInput.value === '' && spInput.value === '' && vcInput.value === '') {
      resUnitsValue.textContent = '0';
      resRevenueValue.textContent = symbol + '0.00';
      return;
    }

    // Fixed Cost validation
    if (fcInput.value !== '' && (isNaN(fcVal) || fcVal < 0)) {
      fcError.style.display = 'block';
      fcInput.style.borderColor = '#dc2626';
      hasErrors = true;
    }

    // Selling Price validation
    if (spInput.value !== '' && (isNaN(spVal) || spVal <= 0)) {
      spError.textContent = 'Selling price must be greater than 0.';
      spError.style.display = 'block';
      spInput.style.borderColor = '#dc2626';
      hasErrors = true;
    }

    // Variable Cost validation
    if (vcInput.value !== '' && (isNaN(vcVal) || vcVal < 0)) {
      vcError.textContent = 'Variable cost cannot be negative.';
      vcError.style.display = 'block';
      vcInput.style.borderColor = '#dc2626';
      hasErrors = true;
    } else if (spInput.value !== '' && vcInput.value !== '' && vcVal >= spVal) {
      vcError.textContent = 'Variable cost must be less than selling price.';
      vcError.style.display = 'block';
      vcInput.style.borderColor = '#dc2626';
      hasErrors = true;
    }

    if (hasErrors || isNaN(fcVal) || isNaN(spVal) || isNaN(vcVal)) {
      resUnitsValue.textContent = '--';
      resRevenueValue.textContent = symbol + '--';
      return;
    }

    // Math
    const contribMargin = spVal - vcVal;
    if (contribMargin <= 0) {
      resUnitsValue.textContent = '--';
      resRevenueValue.textContent = symbol + '--';
      return;
    }

    const breakEvenUnits = fcVal / contribMargin;
    const breakEvenRevenue = breakEvenUnits * spVal;

    // Format outputs
    resUnitsValue.textContent = Math.ceil(breakEvenUnits).toLocaleString('en-IN');
    resRevenueValue.textContent = symbol + breakEvenRevenue.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function resetCalculator() {
    const fcInput = document.getElementById('beFixedCosts');
    const spInput = document.getElementById('beSellingPrice');
    const vcInput = document.getElementById('beVariableCost');
    const currencySelect = document.getElementById('beCurrencySelect');
    const toggleUnits = document.getElementById('beToggleUnits');

    if (fcInput) fcInput.value = '';
    if (spInput) spInput.value = '';
    if (vcInput) vcInput.value = '';

    if (currencySelect) currencySelect.value = 'INR';
    if (toggleUnits) toggleUnits.checked = true;

    clearError('beFixedCosts');
    clearError('beSellingPrice');
    clearError('beVariableCost');
    updateCurrencyAddons();
    updateActiveResultHighlight();

    const resUnitsValue = document.getElementById('beResUnitsValue');
    const resRevenueValue = document.getElementById('beResRevenueValue');

    if (resUnitsValue) resUnitsValue.textContent = '0';
    if (resRevenueValue) resRevenueValue.textContent = '₹0.00';
  }

  function initFaqAccordion() {
    const triggers = document.querySelectorAll('#break-even-section .be-faq-trigger');
    triggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest('.be-faq-item');
        if (!item) return;

        const content = item.querySelector('.be-faq-content');
        const icon = trigger.querySelector('i');
        const isActive = item.classList.contains('active');

        // Close other items
        document.querySelectorAll('#break-even-section .be-faq-item').forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherContent = otherItem.querySelector('.be-faq-content');
            if (otherContent) otherContent.style.display = 'none';
            const otherIcon = otherItem.querySelector('.be-faq-trigger i');
            if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
          }
        });

        // Toggle current
        if (isActive) {
          item.classList.remove('active');
          if (content) content.style.display = 'none';
          if (icon) icon.style.transform = 'rotate(0deg)';
        } else {
          item.classList.add('active');
          if (content) content.style.display = 'block';
          if (icon) icon.style.transform = 'rotate(180deg)';
        }
      });
    });
  }

  // Initialize on script load
  initBreakEven();

  // Listen to custom route load event in SPA router
  document.addEventListener('breakEvenRouteLoaded', () => {
    initBreakEven();
    resetCalculator();
  });
});
