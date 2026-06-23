/* ============================================================
   INVENTORY TURNOVER RATIO CALCULATOR — Specific JS Controller
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  let isInitialized = false;

  const currencySymbols = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥'
  };

  function initInventoryTurnover() {
    if (isInitialized) return;

    bindCalculatorEvents();
    initFaqAccordion();
    isInitialized = true;
  }

  function bindCalculatorEvents() {
    const itCurrency = document.getElementById('itCurrency');
    const itCOGS = document.getElementById('itCOGS');
    const itBeginning = document.getElementById('itBeginning');
    const itEnding = document.getElementById('itEnding');
    const itCalcBtn = document.getElementById('itCalcBtn');
    const itResetBtn = document.getElementById('itResetBtn');

    // Currency dropdown listener
    if (itCurrency) {
      itCurrency.addEventListener('change', () => {
        const currency = itCurrency.value;
        const symbol = currencySymbols[currency] || '₹';

        // Update prefix addons in the input wrappers
        const addons = document.querySelectorAll('#inventory-turnover-section .it-currency-addon');
        addons.forEach(addon => {
          addon.textContent = symbol;
        });

        // If results block is already visible, re-trigger calculate to update currency formatting
        const itResults = document.getElementById('itResults');
        if (itResults && !itResults.classList.contains('hide')) {
          calculateTurnover();
        }
      });
    }

    // Calculate click listener
    if (itCalcBtn) {
      itCalcBtn.addEventListener('click', () => {
        calculateTurnover();
      });
    }

    // Reset click listener
    if (itResetBtn) {
      itResetBtn.addEventListener('click', () => {
        resetCalculator();
      });
    }
  }

  function calculateTurnover() {
    const itCurrency = document.getElementById('itCurrency');
    const itCOGS = document.getElementById('itCOGS');
    const itBeginning = document.getElementById('itBeginning');
    const itEnding = document.getElementById('itEnding');
    const itResults = document.getElementById('itResults');
    const itResAverage = document.getElementById('itResAverage');
    const itResRatio = document.getElementById('itResRatio');
    const itInterpretation = document.getElementById('itInterpretation');

    if (!itCOGS || !itBeginning || !itEnding || !itResults) return;

    const cogsVal = parseFloat(itCOGS.value);
    const beginningVal = parseFloat(itBeginning.value);
    const endingVal = parseFloat(itEnding.value);

    // Form validation
    if (isNaN(cogsVal) || cogsVal < 0) {
      alert('Please enter a valid, positive Cost of Goods Sold (COGS) value.');
      itCOGS.focus();
      return;
    }
    if (isNaN(beginningVal) || beginningVal < 0) {
      alert('Please enter a valid, positive Beginning Inventory.');
      itBeginning.focus();
      return;
    }
    if (isNaN(endingVal) || endingVal < 0) {
      alert('Please enter a valid, positive Ending Inventory.');
      itEnding.focus();
      return;
    }

    // Math formulas
    const averageInventory = (beginningVal + endingVal) / 2;
    
    if (averageInventory <= 0) {
      alert('Average Inventory is calculated as 0. Please make sure either Beginning or Ending Inventory is greater than 0.');
      return;
    }

    const ratio = cogsVal / averageInventory;

    // Currency formatting
    const currency = itCurrency.value;
    const symbol = currencySymbols[currency] || '₹';

    const formattedAverage = symbol + averageInventory.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });

    // Populate UI outputs
    itResAverage.textContent = formattedAverage;
    itResRatio.textContent = ratio.toFixed(2) + 'x';

    // Set interpretation alerts
    itInterpretation.className = 'it-interpretation-alert'; // clear previous
    if (ratio < 4.0) {
      itInterpretation.classList.add('low');
      itInterpretation.innerHTML = `
        <strong>Interpretation: Low Turnover (< 4.0)</strong><br>
        Your inventory turned over <strong>${ratio.toFixed(2)} times</strong> during this period. 
        This is generally considered low and may indicate weak demand, sluggish sales, or excess stock levels. 
        Holding unsold inventory ties up your cash flow, increases carrying/storage costs, and risks product damage or obsolescence.
      `;
    } else if (ratio >= 4.0 && ratio <= 8.0) {
      itInterpretation.classList.add('healthy');
      itInterpretation.innerHTML = `
        <strong>Interpretation: Healthy Turnover (4.0 - 8.0)</strong><br>
        Your inventory turned over <strong>${ratio.toFixed(2)} times</strong> during this period. 
        This is a healthy, optimal range for most companies. It indicates a strong alignment between your purchasing team and customer demand. 
        Your cash flow is active, carrying overheads are minimized, and product freshness is maintained without running out of stock.
      `;
    } else {
      itInterpretation.classList.add('high');
      itInterpretation.innerHTML = `
        <strong>Interpretation: High Turnover (> 8.0)</strong><br>
        Your inventory turned over <strong>${ratio.toFixed(2)} times</strong> during this period. 
        This indicates extremely fast-moving stock and very strong sales volume. While highly efficient, be careful: 
        an exceptionally high ratio can indicate understocking or insufficient safety buffers. This risks potential stockouts, backorders, and losing sales to competitors.
      `;
    }

    // Display block
    itResults.classList.remove('hide');
    itResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function resetCalculator() {
    const itCurrency = document.getElementById('itCurrency');
    const itCOGS = document.getElementById('itCOGS');
    const itBeginning = document.getElementById('itBeginning');
    const itEnding = document.getElementById('itEnding');
    const itResults = document.getElementById('itResults');

    if (itCOGS) itCOGS.value = '';
    if (itBeginning) itBeginning.value = '';
    if (itEnding) itEnding.value = '';

    if (itCurrency) {
      itCurrency.value = 'INR';
      // Sync addons back to INR symbol
      const addons = document.querySelectorAll('#inventory-turnover-section .it-currency-addon');
      addons.forEach(addon => {
        addon.textContent = '₹';
      });
    }

    if (itResults) {
      itResults.classList.add('hide');
    }
  }

  // FAQ accordion toggle logic
  function initFaqAccordion() {
    const triggers = document.querySelectorAll('#inventory-turnover-section .bc-faq-trigger');
    triggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest('.it-faq-item');
        if (!item) return;

        const content = item.querySelector('.bc-faq-content');
        const isActive = item.classList.contains('active');

        // Close other accordion items inside this section
        document.querySelectorAll('#inventory-turnover-section .it-faq-item').forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherContent = otherItem.querySelector('.bc-faq-content');
            if (otherContent) otherContent.style.display = 'none';
          }
        });

        // Toggle current accordion item
        if (isActive) {
          item.classList.remove('active');
          if (content) content.style.display = 'none';
        } else {
          item.classList.add('active');
          if (content) content.style.display = 'block';
        }
      });
    });
  }

  // Initialize on script load
  initInventoryTurnover();

  // Listen to custom route load event in SPA router
  document.addEventListener('inventoryTurnoverRouteLoaded', () => {
    initInventoryTurnover();
  });
});
