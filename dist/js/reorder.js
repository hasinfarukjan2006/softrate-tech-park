/* ============================================================
   REORDER POINT (ROP) CALCULATOR — Scoped JS Controller
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  let isInitialized = false;

  function initReorder() {
    if (isInitialized) return;

    bindCalculatorEvents();
    initFaqAccordion();
    isInitialized = true;
  }

  function bindCalculatorEvents() {
    const maxInput = document.getElementById('maximum-daily-usage');
    const avgInput = document.getElementById('average-daily-usage');
    const leadInput = document.getElementById('lead-time');
    const calcBtn = document.getElementById('reorder-calc-btn');
    const resetBtn = document.getElementById('reorderResetBtn');
    const resultContainer = document.querySelector('.rop-result-container');

    if (!maxInput || !avgInput || !leadInput || !calcBtn) return;

    // Input listeners to clear errors on typing
    const inputs = [maxInput, avgInput, leadInput];
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        clearError(input.id);
        hideResults();
      });
      // Verification regex block (digits and optional single dot)
      input.addEventListener('keyup', () => {
        const val = input.value;
        if (val === '') {
          input.classList.remove('wrong-input');
          return;
        }
        if (!/^\d*\.?\d*$/.test(val)) {
          input.value = val.replace(/[^\d.]/g, '');
          // Keep only first dot
          const dots = input.value.split('.');
          if (dots.length > 2) {
            input.value = dots[0] + '.' + dots.slice(1).join('');
          }
        }
      });
    });

    calcBtn.addEventListener('click', () => {
      calculateROP();
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
    if (input) {
      input.style.borderColor = '#cbd5e1';
      input.classList.remove('wrong-input');
    }
    if (errEl) errEl.style.display = 'none';
  }

  function hideResults() {
    const resultContainer = document.querySelector('.rop-result-container');
    if (resultContainer) {
      resultContainer.style.display = 'none';
    }
  }

  function calculateROP() {
    const maxInput = document.getElementById('maximum-daily-usage');
    const avgInput = document.getElementById('average-daily-usage');
    const leadInput = document.getElementById('lead-time');

    const maxError = document.getElementById('maximum-daily-usageError');
    const avgError = document.getElementById('average-daily-usageError');
    const leadError = document.getElementById('lead-timeError');

    const resultContainer = document.querySelector('.rop-result-container');
    const safetyStockDisplay = document.getElementById('safety-stock');
    const resultDisplay = document.getElementById('result');
    const calculationDisplay = document.getElementById('calculation');

    if (!maxInput || !avgInput || !leadInput || !resultContainer) return;

    const maxVal = parseFloat(maxInput.value);
    const avgVal = parseFloat(avgInput.value);
    const leadVal = parseFloat(leadInput.value);

    let hasErrors = false;

    // Reset visual errors
    clearError('maximum-daily-usage');
    clearError('average-daily-usage');
    clearError('lead-time');

    // 1. Max Daily Usage Validation
    if (maxInput.value === '' || isNaN(maxVal) || maxVal < 0) {
      maxError.textContent = 'Please enter a valid Maximum Daily Usage.';
      maxError.style.display = 'block';
      maxInput.style.borderColor = '#ef4444';
      maxInput.classList.add('wrong-input');
      hasErrors = true;
    }

    // 2. Average Daily Usage Validation
    if (avgInput.value === '' || isNaN(avgVal) || avgVal < 0) {
      avgError.textContent = 'Please enter a valid Average Daily Usage.';
      avgError.style.display = 'block';
      avgInput.style.borderColor = '#ef4444';
      avgInput.classList.add('wrong-input');
      hasErrors = true;
    }

    // 3. Lead Time Validation
    if (leadInput.value === '' || isNaN(leadVal) || leadVal < 0) {
      leadError.textContent = 'Please enter a valid Lead Time in days.';
      leadError.style.display = 'block';
      leadInput.style.borderColor = '#ef4444';
      leadInput.classList.add('wrong-input');
      hasErrors = true;
    }

    // 4. Cross validation (Average cannot exceed Maximum)
    if (!hasErrors && avgVal > maxVal) {
      avgError.textContent = 'Average usage cannot exceed maximum daily usage.';
      avgError.style.display = 'block';
      avgInput.style.borderColor = '#ef4444';
      avgInput.classList.add('wrong-input');
      hasErrors = true;
    }

    if (hasErrors) {
      resultContainer.style.display = 'none';
      return;
    }

    // Mathematical calculations
    const safetyStockVal = (maxVal - avgVal) * leadVal;
    const reorderPointVal = safetyStockVal + (avgVal * leadVal);

    // Display Results
    resultContainer.style.display = 'block';
    
    if (safetyStockDisplay) {
      safetyStockDisplay.textContent = Math.round(safetyStockVal).toLocaleString('en-IN') + ' Units';
    }
    
    if (resultDisplay) {
      resultDisplay.textContent = Math.round(reorderPointVal).toLocaleString('en-IN') + ' Units';
    }

    if (calculationDisplay) {
      const line1 = `Safety Stock = (Maximum Daily Usage - Average Daily Usage) x Lead Time\n             = (${maxVal.toLocaleString('en-IN')} - ${avgVal.toLocaleString('en-IN')}) x ${leadVal.toLocaleString('en-IN')} = ${Math.round(safetyStockVal).toLocaleString('en-IN')}`;
      const line2 = `Reorder Point = Safety Stock + (Average Daily Usage x Lead Time)\n              = ${Math.round(safetyStockVal).toLocaleString('en-IN')} + (${avgVal.toLocaleString('en-IN')} x ${leadVal.toLocaleString('en-IN')}) = ${Math.round(reorderPointVal).toLocaleString('en-IN')}`;
      calculationDisplay.textContent = `${line1}\n\n${line2}`;
    }
  }

  function resetCalculator() {
    const maxInput = document.getElementById('maximum-daily-usage');
    const avgInput = document.getElementById('average-daily-usage');
    const leadInput = document.getElementById('lead-time');

    if (maxInput) maxInput.value = '';
    if (avgInput) avgInput.value = '';
    if (leadInput) leadInput.value = '';

    clearError('maximum-daily-usage');
    clearError('average-daily-usage');
    clearError('lead-time');
    hideResults();
  }

  function initFaqAccordion() {
    const triggers = document.querySelectorAll('#reorder-section .rop-faq-trigger');
    triggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest('.rop-faq-item');
        if (!item) return;

        const content = item.querySelector('.rop-faq-content');
        const icon = trigger.querySelector('i');
        const isActive = item.classList.contains('active');

        // Close other items
        document.querySelectorAll('#reorder-section .rop-faq-item').forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherContent = otherItem.querySelector('.rop-faq-content');
            if (otherContent) otherContent.style.display = 'none';
            const otherIcon = otherItem.querySelector('.rop-faq-trigger i');
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

  // Initialize immediately
  initReorder();

  // Listen to custom route event from router
  document.addEventListener('reorderRouteLoaded', () => {
    initReorder();
    resetCalculator();
  });
});
