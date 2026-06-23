/* ============================================================
   ECONOMIC ORDER QUANTITY (EOQ) CALCULATOR — Scoped JS Controller
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

  function initEoq() {
    if (isInitialized) return;

    bindCalculatorEvents();
    initFaqAccordion();
    isInitialized = true;
  }

  function bindCalculatorEvents() {
    const demandInput = document.getElementById('eoqDemand');
    const orderCostInput = document.getElementById('eoqOrderCost');
    const holdingCostInput = document.getElementById('eoqHoldingCost');
    const currencySelect = document.getElementById('eoqCurrencySelect');
    const calcBtn = document.getElementById('eoqCalcBtn');
    const resetBtn = document.getElementById('eoqResetBtn');
    
    // Radios
    const toggleUnits = document.getElementById('eoqToggleUnits');
    const toggleCost = document.getElementById('eoqToggleCost');

    if (!demandInput || !orderCostInput || !holdingCostInput || !calcBtn) return;

    // Listen to changes in inputs to clear errors and hide previous results
    const inputs = [demandInput, orderCostInput, holdingCostInput];
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        clearError(input.id);
        hideResults();
      });
    });

    if (currencySelect) {
      currencySelect.addEventListener('change', () => {
        updateCurrencyAddons();
        // If results are already shown, recalculate to update currency symbols
        const resultsBlock = document.getElementById('eoqResults');
        if (resultsBlock && resultsBlock.style.display === 'block') {
          calculateEoq();
        }
      });
    }

    if (toggleUnits && toggleCost) {
      toggleUnits.addEventListener('change', () => {
        const resultsBlock = document.getElementById('eoqResults');
        if (resultsBlock && resultsBlock.style.display === 'block') {
          calculateEoq();
        }
      });
      toggleCost.addEventListener('change', () => {
        const resultsBlock = document.getElementById('eoqResults');
        if (resultsBlock && resultsBlock.style.display === 'block') {
          calculateEoq();
        }
      });
    }

    calcBtn.addEventListener('click', () => {
      calculateEoq();
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        resetCalculator();
      });
    }
  }

  function clearError(inputId) {
    const input = document.getElementById(inputId);
    const errEl = document.getElementById(inputId + 'Error');
    if (input) input.style.borderColor = '#cbd5e1';
    if (errEl) errEl.style.display = 'none';
  }

  function hideResults() {
    const resultsBlock = document.getElementById('eoqResults');
    if (resultsBlock) {
      resultsBlock.style.display = 'none';
    }
  }

  function updateCurrencyAddons() {
    const currencySelect = document.getElementById('eoqCurrencySelect');
    const symbol = currencySymbols[currencySelect.value] || '₹';
    
    const orderAddon = document.getElementById('eoqOrderAddon');
    const holdingAddon = document.getElementById('eoqHoldingAddon');

    if (orderAddon) orderAddon.textContent = symbol;
    if (holdingAddon) holdingAddon.textContent = symbol;
  }

  function calculateEoq() {
    const demandInput = document.getElementById('eoqDemand');
    const orderCostInput = document.getElementById('eoqOrderCost');
    const holdingCostInput = document.getElementById('eoqHoldingCost');
    const currencySelect = document.getElementById('eoqCurrencySelect');
    const toggleUnits = document.getElementById('eoqToggleUnits');

    const demandError = document.getElementById('eoqDemandError');
    const orderCostError = document.getElementById('eoqOrderCostError');
    const holdingCostError = document.getElementById('eoqHoldingCostError');

    const resultsBlock = document.getElementById('eoqResults');
    const resLabel = document.getElementById('eoqResultLabel');
    const resValue = document.getElementById('eoqResUnitsValue');
    const resDesc = document.getElementById('eoqResultCostDesc');

    if (!demandInput || !orderCostInput || !holdingCostInput || !resultsBlock) return;

    const demandVal = parseFloat(demandInput.value);
    const orderCostVal = parseFloat(orderCostInput.value);
    const holdingCostVal = parseFloat(holdingCostInput.value);
    const symbol = currencySelect ? currencySymbols[currencySelect.value] : '₹';

    let hasErrors = false;

    // Reset visual error states
    clearError('eoqDemand');
    clearError('eoqOrderCost');
    clearError('eoqHoldingCost');

    // Demand Validation
    if (demandInput.value === '' || isNaN(demandVal) || demandVal < 0) {
      demandError.textContent = 'Please enter a valid Annual Demand.';
      demandError.style.display = 'block';
      demandInput.style.borderColor = '#dc2626';
      hasErrors = true;
    }

    // Ordering Cost Validation
    if (orderCostInput.value === '' || isNaN(orderCostVal) || orderCostVal < 0) {
      orderCostError.textContent = 'Please enter a valid Ordering Cost.';
      orderCostError.style.display = 'block';
      orderCostInput.style.borderColor = '#dc2626';
      hasErrors = true;
    }

    // Holding Cost Validation
    if (holdingCostInput.value === '' || isNaN(holdingCostVal) || holdingCostVal <= 0) {
      holdingCostError.textContent = 'Holding cost must be greater than zero.';
      holdingCostError.style.display = 'block';
      holdingCostInput.style.borderColor = '#dc2626';
      hasErrors = true;
    }

    if (hasErrors) {
      resultsBlock.style.display = 'none';
      return;
    }

    // Calculations
    const eoqVal = Math.sqrt((2 * demandVal * orderCostVal) / holdingCostVal);
    
    let totalCost = 0;
    if (eoqVal > 0) {
      const totalOrderingCost = (demandVal / eoqVal) * orderCostVal;
      const totalHoldingCost = (eoqVal / 2) * holdingCostVal;
      totalCost = totalOrderingCost + totalHoldingCost;
    }

    // Display Results
    resultsBlock.style.display = 'block';

    if (toggleUnits && toggleUnits.checked) {
      resLabel.textContent = 'Economic Order Quantity (EOQ)';
      resValue.textContent = Math.round(eoqVal).toLocaleString('en-IN') + ' units';
      resDesc.innerHTML = `Total Annual Cost: <strong>${symbol}${totalCost.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}</strong>`;
    } else {
      resLabel.textContent = 'Total Annual Cost';
      resValue.textContent = symbol + totalCost.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      resDesc.innerHTML = `Economic Order Quantity (EOQ): <strong>${Math.round(eoqVal).toLocaleString('en-IN')} units</strong>`;
    }
  }

  function resetCalculator() {
    const demandInput = document.getElementById('eoqDemand');
    const orderCostInput = document.getElementById('eoqOrderCost');
    const holdingCostInput = document.getElementById('eoqHoldingCost');
    const currencySelect = document.getElementById('eoqCurrencySelect');
    const toggleUnits = document.getElementById('eoqToggleUnits');

    if (demandInput) demandInput.value = '';
    if (orderCostInput) orderCostInput.value = '';
    if (holdingCostInput) holdingCostInput.value = '';

    if (currencySelect) currencySelect.value = 'INR';
    if (toggleUnits) toggleUnits.checked = true;

    clearError('eoqDemand');
    clearError('eoqOrderCost');
    clearError('eoqHoldingCost');
    updateCurrencyAddons();
    hideResults();
  }

  function initFaqAccordion() {
    const triggers = document.querySelectorAll('#eoq-section .be-faq-trigger');
    triggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest('.be-faq-item');
        if (!item) return;

        const content = item.querySelector('.be-faq-content');
        const icon = trigger.querySelector('i');
        const isActive = item.classList.contains('active');

        // Close other items
        document.querySelectorAll('#eoq-section .be-faq-item').forEach(otherItem => {
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
  initEoq();

  // Listen to custom load event
  document.addEventListener('eoqRouteLoaded', () => {
    initEoq();
    resetCalculator();
  });
});
