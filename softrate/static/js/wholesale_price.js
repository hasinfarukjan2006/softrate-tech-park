// wholesale_price.js

document.addEventListener('DOMContentLoaded', function () {
  const costInput = document.getElementById('costPrice');
  const overheadInput = document.getElementById('overhead');
  const adminInput = document.getElementById('adminCost');
  const unitsInput = document.getElementById('units');
  const profitInput = document.getElementById('profitMargin');
  const saveBtn = document.getElementById('saveBtn');
  const decreaseBtn = document.getElementById('decreaseUnits');
  const increaseBtn = document.getElementById('increaseUnits');
  const resetBtn = document.getElementById('resetBtn');

  // Currency symbols map – all required currencies
  const currencySymbols = {
    INR: '₹', USD: '$', EUR: '€', GBP: '£', AED: 'د.إ', SAR: '﷼', QAR: '﷼', KWD: 'د.ك', OMR: '﷼', BHD: 'ب.د', SGD: '$', MYR: 'RM', THB: '฿', IDR: 'Rp', PHP: '₱', VND: '₫', CNY: '¥', JPY: '¥', KRW: '₩', AUD: '$', NZD: '$', CAD: '$', CHF: 'CHF', SEK: 'kr', NOK: 'kr', DKK: 'kr', RUB: '₽', ZAR: 'R', TRY: '₺', BRL: 'R$', MXN: '$', ARS: '$', CLP: '$', COP: '$', PLN: 'zł', CZK: 'Kč', HUF: 'Ft', RON: 'lei'
  };

  initCurrencyDropdown();
  switchCurrency();

  // Currency switching — update all currency-symbol spans
  function switchCurrency() {
    const sel = document.getElementById('currency-selection');
    if (!sel) return;
    const sym = currencySymbols[sel.value] || '₹';
    const section = document.getElementById('wholesale-section');
    if (section) {
      section.querySelectorAll('.currency-symbol').forEach(el => {
        el.textContent = sym;
      });
    }
  }
  // Variables are already defined earlier; duplicate removed

// Duplicate currencySymbols definition removed

function initCurrencyDropdown() {
  const currencies = [
    {code: 'INR', name: 'Indian Rupee', symbol: '₹'},
    {code: 'USD', name: 'US Dollar', symbol: '$'},
    {code: 'EUR', name: 'Euro', symbol: '€'},
    {code: 'GBP', name: 'British Pound', symbol: '£'},
    {code: 'AED', name: 'UAE Dirham', symbol: 'د.إ'},
    {code: 'SAR', name: 'Saudi Riyal', symbol: '﷼'},
    {code: 'QAR', name: 'Qatar Riyal', symbol: '﷼'},
    {code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'د.ك'},
    {code: 'OMR', name: 'Omani Rial', symbol: '﷼'},
    {code: 'BHD', name: 'Bahraini Dinar', symbol: 'ب.د'},
    {code: 'SGD', name: 'Singapore Dollar', symbol: '$'},
    {code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM'},
    {code: 'THB', name: 'Thai Baht', symbol: '฿'},
    {code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp'},
    {code: 'PHP', name: 'Philippine Peso', symbol: '₱'},
    {code: 'VND', name: 'Vietnamese Dong', symbol: '₫'},
    {code: 'CNY', name: 'Chinese Yuan', symbol: '¥'},
    {code: 'JPY', name: 'Japanese Yen', symbol: '¥'},
    {code: 'KRW', name: 'South Korean Won', symbol: '₩'},
    {code: 'AUD', name: 'Australian Dollar', symbol: '$'},
    {code: 'NZD', name: 'New Zealand Dollar', symbol: '$'},
    {code: 'CAD', name: 'Canadian Dollar', symbol: '$'},
    {code: 'CHF', name: 'Swiss Franc', symbol: 'CHF'},
    {code: 'SEK', name: 'Swedish Krona', symbol: 'kr'},
    {code: 'NOK', name: 'Norwegian Krone', symbol: 'kr'},
    {code: 'DKK', name: 'Danish Krone', symbol: 'kr'},
    {code: 'RUB', name: 'Russian Ruble', symbol: '₽'},
    {code: 'ZAR', name: 'South African Rand', symbol: 'R'},
    {code: 'TRY', name: 'Turkish Lira', symbol: '₺'},
    {code: 'BRL', name: 'Brazilian Real', symbol: 'R$'},
    {code: 'MXN', name: 'Mexican Peso', symbol: '$'},
    {code: 'ARS', name: 'Argentine Peso', symbol: '$'},
    {code: 'CLP', name: 'Chilean Peso', symbol: '$'},
    {code: 'COP', name: 'Colombian Peso', symbol: '$'},
    {code: 'PLN', name: 'Polish Zloty', symbol: 'zł'},
    {code: 'CZK', name: 'Czech Koruna', symbol: 'Kč'},
    {code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft'},
    {code: 'RON', name: 'Romanian Leu', symbol: 'lei'}
  ];

  const trigger = document.getElementById('currencyTrigger');
  const panel = document.getElementById('currencyPanel');
  const searchInput = document.getElementById('currencySearch');
  const listEl = document.getElementById('currencyList');

  function renderList(filter = '') {
    listEl.innerHTML = '';
    const filtered = currencies.filter(c =>
      c.code.toLowerCase().includes(filter) ||
      c.name.toLowerCase().includes(filter)
    );
    if (filtered.length === 0) {
      const li = document.createElement('li');
      li.className = 'ws-no-match';
      li.textContent = 'No matches';
      listEl.appendChild(li);
      return;
    }
    filtered.forEach(c => {
      const li = document.createElement('li');
      li.dataset.code = c.code;
      li.innerHTML = `<span class="ws-curr-symbol">${c.symbol}</span><span class="ws-curr-code">${c.code}</span><span class="ws-curr-name">${c.name}</span>`;
      li.addEventListener('click', () => {
        document.getElementById('currencyLabel').textContent = c.code;
        document.getElementById('currencyFlag').textContent = c.symbol;
        const hidden = document.getElementById('currency-selection');
        if (hidden) hidden.value = c.code;
        switchCurrency();
        closePanel();
      });
      listEl.appendChild(li);
    });
  }

  function openPanel() {
    panel.classList.add('ws-open');
    trigger.setAttribute('aria-expanded', 'true');
    searchInput.focus();
  }
  function closePanel() {
    panel.classList.remove('ws-open');
    trigger.setAttribute('aria-expanded', 'false');
  }

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    if (panel.classList.contains('ws-open')) closePanel(); else openPanel();
  });

  document.addEventListener('click', (e) => {
    if (!panel.contains(e.target) && e.target !== trigger) {
      closePanel();
    }
  });

  searchInput.addEventListener('input', () => {
    const val = searchInput.value.trim().toLowerCase();
    renderList(val);
  });

  // Initial render
  renderList();
}


  function getCurrencySymbol() {
    const sel = document.getElementById('currency-selection');
    return sel ? currencySymbols[sel.value] || '₹' : '₹';
  }

  function formatCurrency(value) {
    const sym = getCurrencySymbol();
    return sym + value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function recalc() {
    if (costInput.value === '' && overheadInput.value === '' && adminInput.value === '' && profitInput.value === '') {
      const resTotalCost = document.getElementById('resTotalCost');
      const resWholesalePrice = document.getElementById('resWholesalePrice');
      if (resTotalCost) resTotalCost.textContent = '';
      if (resWholesalePrice) resWholesalePrice.textContent = '';
      return;
    }

    const cost = parseFloat(costInput.value) || 0;
    const overhead = parseFloat(overheadInput.value) || 0;
    const admin = parseFloat(adminInput.value) || 0;
    const units = parseInt(unitsInput.value) || 1;
    const profit = parseFloat(profitInput.value) || 0;

    // Correct formulas per user spec:
    // Total Cost Price = Cost price per unit + ((Overhead + Admin) / Units)
    const totalCost = cost + ((overhead + admin) / units);

    // Wholesale Price = Total Cost Price / (1 - Profit Margin)
    // Guard: if margin >= 100%, show 0 to avoid division by zero / negative
    let wholesalePrice = 0;
    if (profit < 100) {
      wholesalePrice = totalCost / (1 - profit / 100);
    }

    // Update display elements
    const resTotalCost = document.getElementById('resTotalCost');
    const resWholesalePrice = document.getElementById('resWholesalePrice');

    if (resTotalCost) resTotalCost.textContent = totalCost.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (resWholesalePrice) resWholesalePrice.textContent = wholesalePrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  // Attach input listeners for live calculation
  [costInput, overheadInput, adminInput, unitsInput, profitInput].forEach(el => {
    if (el) {
      el.addEventListener('input', recalc);
    }
  });

  // Unit decrease
  if (decreaseBtn) {
    decreaseBtn.addEventListener('click', function () {
      let val = parseInt(unitsInput.value) || 1;
      if (val > 1) unitsInput.value = val - 1;
      recalc();
    });
  }

  // Unit increase
  if (increaseBtn) {
    increaseBtn.addEventListener('click', function () {
      let val = parseInt(unitsInput.value) || 1;
      unitsInput.value = val + 1;
      recalc();
    });
  }

  // Reset button
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      [costInput, overheadInput, adminInput, profitInput, unitsInput].forEach(el => {
        if (el) el.value = '';
      });
      recalc();
    });
  }

  // Initial calc
  recalc();

  // Save button — POST to backend
  if (saveBtn) {
    saveBtn.addEventListener('click', function () {
      if (!costInput.value || parseFloat(costInput.value) < 0) {
        alert("Please enter a valid cost price per unit.");
        return;
      }
      if (!overheadInput.value || parseFloat(overheadInput.value) < 0) {
        alert("Please enter valid overhead expenses.");
        return;
      }
      if (!adminInput.value || parseFloat(adminInput.value) < 0) {
        alert("Please enter a valid administrative cost.");
        return;
      }
      if (!unitsInput.value || parseInt(unitsInput.value) < 1) {
        alert("Number of units must be at least 1.");
        return;
      }
      if (!profitInput.value || parseFloat(profitInput.value) < 0) {
        alert("Please enter a valid profit margin.");
        return;
      }

      const payload = {
        cost_price_per_unit: parseFloat(costInput.value) || 0,
        overhead_expenses: parseFloat(overheadInput.value) || 0,
        administrative_cost: parseFloat(adminInput.value) || 0,
        number_of_units: parseInt(unitsInput.value) || 1,
        profit_margin: parseFloat(profitInput.value) || 0
      };

      fetch('/api/wholesale-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            alert('Saved successfully!');
          } else {
            alert('Error saving: ' + (data.message || 'unknown'));
          }
        })
        .catch(err => {
          console.error(err);
          alert('Network error while saving');
        });
    });
  }
});

// Currency switching — update all currency-symbol spans
function switchCurrency() {
  const sel = document.getElementById('currency-selection');
  if (!sel) return;
  const sym = currencySymbols[sel.value] || '₹';

  // Update all .currency-symbol elements inside #wholesale-section
  const section = document.getElementById('wholesale-section');
  if (section) {
    section.querySelectorAll('.currency-symbol').forEach(el => {
      el.textContent = sym;
    });
  }
}
