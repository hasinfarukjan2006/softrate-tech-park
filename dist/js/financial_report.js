/* Financial Report Generator Interactive JavaScript Engine */

// Dynamic script loader for html2canvas
function loadHtml2CanvasForFR(callback) {
  if (window.html2canvas) {
    callback();
    return;
  }
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
  script.onload = callback;
  script.onerror = () => {
    alert('Failed to load PDF generation engine. Please check your internet connection.');
  };
  document.head.appendChild(script);
}

const FinancialReportController = {
  // Chart instances
  charts: {
    revenueExpense: null,
    profitability: null,
    assetsLiabilities: null
  },

  // Currency symbols map
  currencySymbols: {
    'INR': '₹',
    'USD': '$',
    'EUR': '€',
    'GBP': '£'
  },

  // Format currency value helper
  formatCurrency: function(value, currencyCode) {
    const symbol = this.currencySymbols[currencyCode] || '$';
    const isNegative = value < 0;
    const absValue = Math.abs(value).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return isNegative ? `(${symbol}${absValue})` : `${symbol}${absValue}`;
  },

  initialized: false,

  // Initialize event listeners
  init: function() {
    // Setup dates default (from start of year to current date)
    const today = new Date();
    const currentYear = today.getFullYear();
    const fromDateInput = document.getElementById('fr_date_from');
    const toDateInput = document.getElementById('fr_date_to');

    if (fromDateInput && !fromDateInput.value) {
      fromDateInput.value = `${currentYear}-01-01`;
    }
    if (toDateInput && !toDateInput.value) {
      const dd = String(today.getDate()).padStart(2, '0');
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      toDateInput.value = `${currentYear}-${mm}-${dd}`;
    }

    if (this.initialized) {
      this.showLanding();
      return;
    }

    const generateBtn = document.getElementById('frGenerateReportBtn');
    const resetBtn = document.getElementById('frResetBtn');
    const reportTypeSelect = document.getElementById('fr_report_type');

    if (generateBtn) {
      generateBtn.addEventListener('click', () => this.generateReport());
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetFields());
    }

    if (reportTypeSelect) {
      reportTypeSelect.addEventListener('change', () => this.toggleInputSections());
    }

    // Export buttons
    const pdfBtn = document.getElementById('frExportPdfBtn');
    const csvBtn = document.getElementById('frExportCsvBtn');
    const printBtn = document.getElementById('frPrintBtn');
    const saveBtn = document.getElementById('frSaveDbBtn');

    if (pdfBtn) pdfBtn.addEventListener('click', () => this.exportPdf());
    if (csvBtn) csvBtn.addEventListener('click', () => this.exportCsv());
    if (printBtn) printBtn.addEventListener('click', () => window.print());
    if (saveBtn) saveBtn.addEventListener('click', () => this.saveToDatabase());

    // Landing page selections
    const selectBsBtn = document.getElementById('frBtnSelectBalanceSheet');
    const selectPlBtn = document.getElementById('frBtnSelectProfitLoss');
    const backBtn = document.getElementById('frBackToTemplatesBtn');

    if (selectBsBtn) {
      selectBsBtn.addEventListener('click', () => this.showGenerator('balance-sheet'));
    }
    if (selectPlBtn) {
      selectPlBtn.addEventListener('click', () => this.showGenerator('profit-loss'));
    }
    if (backBtn) {
      backBtn.addEventListener('click', () => this.showLanding());
    }

    this.setupFAQ();
    this.toggleInputSections();
    this.initBalanceSheet();
    this.initIncomeStatement();
    this.showLanding();
    this.initialized = true;
  },

  // Transition controller: Show Landing page
  showLanding: function() {
    const landingHero = document.querySelector('.fr-hero-landing');
    const landingPromo = document.querySelector('.fr-promo-beyond');
    const landingCaps = document.querySelector('.fr-capabilities-section');
    const landingSmart = document.querySelector('.fr-smart-accounting-banner');
    const landingFaq = document.querySelector('.fr-faq-container');
    const generatorContainer = document.querySelector('.fr-main-container');
    const bsContainer = document.querySelector('.fr-balance-sheet-container');
    const isContainer = document.querySelector('.fr-income-statement-container');

    if (landingHero) landingHero.classList.remove('hide');
    if (landingPromo) landingPromo.classList.remove('hide');
    if (landingCaps) landingCaps.classList.remove('hide');
    if (landingSmart) landingSmart.classList.remove('hide');
    if (landingFaq) landingFaq.classList.remove('hide');

    if (generatorContainer) {
      generatorContainer.classList.add('hide');
    }
    if (bsContainer) {
      bsContainer.classList.add('hide');
    }
    if (isContainer) {
      isContainer.classList.add('hide');
    }
    
    // Hide report preview card when returning to landing page
    const previewCard = document.getElementById('frReportPreviewCard');
    if (previewCard) previewCard.classList.add('hide');

    const headerTitleEl = document.querySelector('.header-title');
    if (headerTitleEl) {
      headerTitleEl.textContent = 'Financial Report Templates';
    }

    // Scroll to section
    const section = document.getElementById('financial-report-section');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  },

  // Transition controller: Show Generator Form
  showGenerator: function(reportType) {
    const landingHero = document.querySelector('.fr-hero-landing');
    const landingPromo = document.querySelector('.fr-promo-beyond');
    const landingCaps = document.querySelector('.fr-capabilities-section');
    const landingSmart = document.querySelector('.fr-smart-accounting-banner');
    const landingFaq = document.querySelector('.fr-faq-container');
    const generatorContainer = document.querySelector('.fr-main-container');
    const bsContainer = document.querySelector('.fr-balance-sheet-container');
    const isContainer = document.querySelector('.fr-income-statement-container');

    const headerTitleEl = document.querySelector('.header-title');

    if (reportType === 'balance-sheet') {
      if (landingHero) landingHero.classList.add('hide');
      
      // Keep promotional blocks visible for balance sheet as shown in Zoho page
      if (landingPromo) landingPromo.classList.remove('hide');
      if (landingCaps) landingCaps.classList.remove('hide');
      if (landingSmart) landingSmart.classList.remove('hide');
      if (landingFaq) landingFaq.classList.remove('hide');

      if (generatorContainer) {
        generatorContainer.classList.add('hide');
      }
      if (isContainer) {
        isContainer.classList.add('hide');
      }
      if (bsContainer) {
        bsContainer.classList.remove('hide');
      }

      if (headerTitleEl) {
        headerTitleEl.textContent = 'Balance Sheet Template';
      }

      // Scroll to sheet card
      const bsSheetCard = document.getElementById('frBsSheetCard');
      if (bsSheetCard) bsSheetCard.scrollIntoView({ behavior: 'smooth' });

    } else if (reportType === 'profit-loss') {
      if (landingHero) landingHero.classList.add('hide');
      
      // Keep promotional blocks visible for income statement as shown in Zoho page
      if (landingPromo) landingPromo.classList.remove('hide');
      if (landingCaps) landingCaps.classList.remove('hide');
      if (landingSmart) landingSmart.classList.remove('hide');
      if (landingFaq) landingFaq.classList.remove('hide');

      if (generatorContainer) {
        generatorContainer.classList.add('hide');
      }
      if (bsContainer) {
        bsContainer.classList.add('hide');
      }
      if (isContainer) {
        isContainer.classList.remove('hide');
      }

      if (headerTitleEl) {
        headerTitleEl.textContent = 'Income Statement Template';
      }

      // Scroll to sheet card
      const isSheetCard = document.getElementById('frIsSheetCard');
      if (isSheetCard) isSheetCard.scrollIntoView({ behavior: 'smooth' });

    } else {
      // generic default
      if (landingHero) landingHero.classList.add('hide');
      if (landingPromo) landingPromo.classList.add('hide');
      if (landingCaps) landingCaps.classList.add('hide');
      if (landingSmart) landingSmart.classList.add('hide');
      if (landingFaq) landingFaq.classList.add('hide');

      if (bsContainer) {
        bsContainer.classList.add('hide');
      }
      if (isContainer) {
        isContainer.classList.add('hide');
      }
      if (generatorContainer) {
        generatorContainer.classList.remove('hide');
      }

      if (headerTitleEl) {
        headerTitleEl.textContent = 'Income Statement Template';
      }

      if (reportType) {
        const select = document.getElementById('fr_report_type');
        if (select) {
          select.value = reportType;
          this.toggleInputSections();
        }
      }

      // Scroll to form card
      const formCard = document.getElementById('frGeneratorFormCard');
      if (formCard) formCard.scrollIntoView({ behavior: 'smooth' });
    }
  },

  // Toggle input borders/visibility based on selected report type
  toggleInputSections: function() {
    const reportType = document.getElementById('fr_report_type').value;
    const plInputs = document.querySelectorAll('#frGeneratorForm div:nth-of-type(2) input');
    const bsInputs = document.querySelectorAll('#frGeneratorForm div:nth-of-type(3) input');

    // Highlight the active section fields visually
    if (reportType === 'profit-loss') {
      plInputs.forEach(i => i.style.borderColor = '');
      bsInputs.forEach(i => i.style.borderColor = '#cbd5e1');
    } else {
      bsInputs.forEach(i => i.style.borderColor = '');
      plInputs.forEach(i => i.style.borderColor = '#cbd5e1');
    }
  },

  // Reset fields to default
  resetFields: function() {
    document.getElementById('frGeneratorForm').reset();
    const previewCard = document.getElementById('frReportPreviewCard');
    if (previewCard) previewCard.classList.add('hide');

    // Reset dates
    const today = new Date();
    const currentYear = today.getFullYear();
    const fromDateInput = document.getElementById('fr_date_from');
    const toDateInput = document.getElementById('fr_date_to');
    if (fromDateInput) fromDateInput.value = `${currentYear}-01-01`;
    if (toDateInput) {
      const dd = String(today.getDate()).padStart(2, '0');
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      toDateInput.value = `${currentYear}-${mm}-${dd}`;
    }

    // Destroy existing charts
    Object.keys(this.charts).forEach(key => {
      if (this.charts[key]) {
        this.charts[key].destroy();
        this.charts[key] = null;
      }
    });

    this.toggleInputSections();
  },

  // Calculation and preview render
  generateReport: function() {
    const reportType = document.getElementById('fr_report_type').value;
    const companyName = document.getElementById('fr_company_name').value.trim() || 'Softrate Technologies';
    const dateFrom = document.getElementById('fr_date_from').value;
    const dateTo = document.getElementById('fr_date_to').value;
    const currency = document.getElementById('fr_currency').value;

    if (!dateFrom || !dateTo) {
      alert('Please select the reporting period start and end dates.');
      return;
    }

    // Retrieve numeric values
    const revenue = parseFloat(document.getElementById('fr_revenue').value) || 0;
    const cogs = parseFloat(document.getElementById('fr_cogs').value) || 0;
    const operatingExpenses = parseFloat(document.getElementById('fr_operating_expenses').value) || 0;
    const otherIncome = parseFloat(document.getElementById('fr_other_income').value) || 0;
    const taxes = parseFloat(document.getElementById('fr_taxes').value) || 0;

    const assets = parseFloat(document.getElementById('fr_assets').value) || 0;
    const liabilities = parseFloat(document.getElementById('fr_liabilities').value) || 0;
    
    // Auto-calculate equity if empty or use the user value
    let equityInput = document.getElementById('fr_equity');
    let equity = parseFloat(equityInput.value);
    if (isNaN(equity)) {
      equity = assets - liabilities;
      equityInput.value = equity;
    }

    // Calculations
    const grossProfit = revenue - cogs;
    const netProfit = grossProfit - operatingExpenses - taxes + otherIncome;
    const totalLiabilitiesAndEquity = liabilities + equity;

    // Show Preview Card
    const previewCard = document.getElementById('frReportPreviewCard');
    if (previewCard) previewCard.classList.remove('hide');

    // Update Header fields
    document.getElementById('frSheetCompanyName').textContent = companyName;
    document.getElementById('frSheetPeriod').textContent = `For the period from ${this.formatDateString(dateFrom)} to ${this.formatDateString(dateTo)}`;

    if (reportType === 'profit-loss') {
      document.getElementById('frSheetReportTitle').textContent = 'Profit & Loss Statement';
      document.getElementById('frProfitLossTableWrapper').classList.remove('hide');
      document.getElementById('frBalanceSheetTableWrapper').classList.add('hide');

      // Update P&L table values
      document.getElementById('lbl_revenue').textContent = this.formatCurrency(revenue, currency);
      document.getElementById('lbl_cogs').textContent = this.formatCurrency(-cogs, currency);
      document.getElementById('lbl_gross_profit').textContent = this.formatCurrency(grossProfit, currency);
      document.getElementById('lbl_operating_expenses').textContent = this.formatCurrency(-operatingExpenses, currency);
      document.getElementById('lbl_taxes').textContent = this.formatCurrency(-taxes, currency);
      document.getElementById('lbl_other_income').textContent = this.formatCurrency(otherIncome, currency);
      document.getElementById('lbl_net_profit').textContent = this.formatCurrency(netProfit, currency);
    } else {
      document.getElementById('frSheetReportTitle').textContent = 'Balance Sheet';
      document.getElementById('frBalanceSheetTableWrapper').classList.remove('hide');
      document.getElementById('frProfitLossTableWrapper').classList.add('hide');

      // Update Balance Sheet values
      document.getElementById('lbl_assets').textContent = this.formatCurrency(assets, currency);
      document.getElementById('lbl_total_assets').textContent = this.formatCurrency(assets, currency);
      document.getElementById('lbl_liabilities').textContent = this.formatCurrency(-liabilities, currency);
      document.getElementById('lbl_total_liabilities').textContent = this.formatCurrency(liabilities, currency);
      document.getElementById('lbl_equity').textContent = this.formatCurrency(equity, currency);
      document.getElementById('lbl_liabilities_equity').textContent = this.formatCurrency(totalLiabilitiesAndEquity, currency);
    }

    // Render Charts
    this.renderCharts(revenue, cogs, operatingExpenses, otherIncome, taxes, assets, liabilities, equity, grossProfit, netProfit);

    // Scroll to preview
    previewCard.scrollIntoView({ behavior: 'smooth' });
  },

  // Format date to MM/DD/YYYY
  formatDateString: function(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[1]}/${parts[2]}/${parts[0]}`;
    }
    return dateStr;
  },

  // Setup FAQ collapses
  setupFAQ: function() {
    const items = document.querySelectorAll('.fr-faq-item');
    items.forEach(item => {
      const trigger = item.querySelector('.fr-faq-trigger');
      const content = item.querySelector('.fr-faq-content');

      if (trigger && content) {
        trigger.addEventListener('click', () => {
          const isActive = item.classList.contains('active');

          // Close all FAQ items
          items.forEach(other => {
            other.classList.remove('active');
            const otherContent = other.querySelector('.fr-faq-content');
            if (otherContent) otherContent.style.display = 'none';
          });

          // Toggle current
          if (!isActive) {
            item.classList.add('active');
            content.style.display = 'block';
          }
        });
      }
    });
  },

  // Render dynamic Chart.js canvases
  renderCharts: function(revenue, cogs, operatingExpenses, otherIncome, taxes, assets, liabilities, equity, grossProfit, netProfit) {
    const isDark = document.body.classList.contains('dark-mode');
    const textColor = isDark ? '#e2e8f0' : '#475569';
    const gridColor = isDark ? '#334155' : '#cbd5e1';

    // 1. Revenue vs Expense Chart
    const ctx1 = document.getElementById('frChartRevenueExpense').getContext('2d');
    if (this.charts.revenueExpense) this.charts.revenueExpense.destroy();
    
    this.charts.revenueExpense = new Chart(ctx1, {
      type: 'bar',
      data: {
        labels: ['Revenue', 'COGS', 'Expenses', 'Taxes'],
        datasets: [{
          label: 'Financial Items',
          data: [revenue, cogs, operatingExpenses, taxes],
          backgroundColor: ['#0284c7', '#f43f5e', '#f59e0b', '#10b981'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true }
        },
        scales: {
          x: { ticks: { color: textColor }, grid: { display: false } },
          y: { ticks: { color: textColor }, grid: { color: gridColor } }
        }
      }
    });

    // 2. Profitability Analysis Doughnut
    const ctx2 = document.getElementById('frChartProfitability').getContext('2d');
    if (this.charts.profitability) this.charts.profitability.destroy();

    const totalCosts = cogs + operatingExpenses + taxes;
    this.charts.profitability = new Chart(ctx2, {
      type: 'doughnut',
      data: {
        labels: ['Net Profit', 'Total Costs', 'Other Income'],
        datasets: [{
          data: [Math.max(0, netProfit), totalCosts, otherIncome],
          backgroundColor: ['#10b981', '#f43f5e', '#3b82f6'],
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: textColor, boxWidth: 12 }
          }
        }
      }
    });

    // 3. Asset vs Liability Stacked Bar
    const ctx3 = document.getElementById('frChartAssetsLiabilities').getContext('2d');
    if (this.charts.assetsLiabilities) this.charts.assetsLiabilities.destroy();

    this.charts.assetsLiabilities = new Chart(ctx3, {
      type: 'bar',
      data: {
        labels: ['Balance Sheet Breakdown'],
        datasets: [
          {
            label: 'Assets',
            data: [assets],
            backgroundColor: '#0284c7',
            stack: 'Stack 0'
          },
          {
            label: 'Liabilities',
            data: [liabilities],
            backgroundColor: '#f43f5e',
            stack: 'Stack 1'
          },
          {
            label: 'Equity',
            data: [equity],
            backgroundColor: '#10b981',
            stack: 'Stack 1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: textColor, boxWidth: 12 }
          }
        },
        scales: {
          x: { ticks: { color: textColor }, grid: { display: false } },
          y: { stacked: true, ticks: { color: textColor }, grid: { color: gridColor } }
        }
      }
    });
  },

  // Export PDF functionality
  exportPdf: function() {
    const docSheet = document.getElementById('frReportSheet');
    const downloadBtn = document.getElementById('frExportPdfBtn');
    const originalText = downloadBtn.innerHTML;

    downloadBtn.innerHTML = 'Generating PDF...';
    downloadBtn.disabled = true;

    loadHtml2CanvasForFR(() => {
      html2canvas(docSheet, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
      }).then(canvas => {
        try {
          const imgData = canvas.toDataURL('image/jpeg', 1.0);
          const { jsPDF } = window.jspdf;

          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'in',
            format: 'letter'
          });

          const pdfWidth = 8.5;
          const pdfHeight = 11.0;

          // Scale and margin calculation
          pdf.addImage(imgData, 'JPEG', 0.25, 0.25, pdfWidth - 0.5, pdfHeight - 0.5);

          const compName = document.getElementById('fr_company_name').value.trim() || 'softrate';
          const safeName = compName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
          const reportType = document.getElementById('fr_report_type').value;
          pdf.save(`financial_report_${reportType}_${safeName}.pdf`);
        } catch (err) {
          console.error('PDF Conversion error:', err);
          alert('Could not export PDF automatically. Please use Ctrl+P (Print) and select Save as PDF.');
        } finally {
          downloadBtn.innerHTML = originalText;
          downloadBtn.disabled = false;
        }
      });
    });
  },

  // Export CSV functionality
  exportCsv: function() {
    const reportType = document.getElementById('fr_report_type').value;
    const companyName = document.getElementById('fr_company_name').value.trim() || 'Softrate Technologies';
    const dateFrom = document.getElementById('fr_date_from').value;
    const dateTo = document.getElementById('fr_date_to').value;

    let csvContent = `Company Name,${companyName}\n`;
    csvContent += `Report Type,${reportType === 'profit-loss' ? 'Profit & Loss' : 'Balance Sheet'}\n`;
    csvContent += `Period,${dateFrom} to ${dateTo}\n\n`;

    if (reportType === 'profit-loss') {
      csvContent += "Account Description,Amount\n";
      csvContent += `Total Revenue,${document.getElementById('fr_revenue').value}\n`;
      csvContent += `Cost of Goods Sold (COGS),-${document.getElementById('fr_cogs').value}\n`;
      csvContent += `Gross Profit,${parseFloat(document.getElementById('fr_revenue').value) - parseFloat(document.getElementById('fr_cogs').value)}\n`;
      csvContent += `Operating Expenses,-${document.getElementById('fr_operating_expenses').value}\n`;
      csvContent += `Taxes,-${document.getElementById('fr_taxes').value}\n`;
      csvContent += `Other Income,${document.getElementById('fr_other_income').value}\n`;
      
      const net = (parseFloat(document.getElementById('fr_revenue').value) - parseFloat(document.getElementById('fr_cogs').value)) 
                  - parseFloat(document.getElementById('fr_operating_expenses').value) - parseFloat(document.getElementById('fr_taxes').value)
                  + parseFloat(document.getElementById('fr_other_income').value);
      csvContent += `Net Profit,${net}\n`;
    } else {
      csvContent += "Account Description,Amount\n";
      csvContent += `Total Fixed & Current Assets,${document.getElementById('fr_assets').value}\n`;
      csvContent += `Total Assets,${document.getElementById('fr_assets').value}\n`;
      csvContent += `Total Current & Long-term Liabilities,-${document.getElementById('fr_liabilities').value}\n`;
      csvContent += `Total Liabilities,${document.getElementById('fr_liabilities').value}\n`;
      csvContent += `Owner Capital / Retained Earnings,${document.getElementById('fr_equity').value}\n`;
      csvContent += `Total Liabilities and Equity,${parseFloat(document.getElementById('fr_liabilities').value) + parseFloat(document.getElementById('fr_equity').value)}\n`;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `financial_report_${reportType}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // Save calculations to Flask database backend
  saveToDatabase: function() {
    const reportType = document.getElementById('fr_report_type').value;
    const companyName = document.getElementById('fr_company_name').value.trim();
    const dateFrom = document.getElementById('fr_date_from').value;
    const dateTo = document.getElementById('fr_date_to').value;
    const currency = document.getElementById('fr_currency').value;

    const revenue = parseFloat(document.getElementById('fr_revenue').value) || 0;
    const cogs = parseFloat(document.getElementById('fr_cogs').value) || 0;
    const operatingExpenses = parseFloat(document.getElementById('fr_operating_expenses').value) || 0;
    const otherIncome = parseFloat(document.getElementById('fr_other_income').value) || 0;
    const taxes = parseFloat(document.getElementById('fr_taxes').value) || 0;
    const assets = parseFloat(document.getElementById('fr_assets').value) || 0;
    const liabilities = parseFloat(document.getElementById('fr_liabilities').value) || 0;
    const equity = parseFloat(document.getElementById('fr_equity').value) || 0;

    const grossProfit = revenue - cogs;
    const netProfit = grossProfit - operatingExpenses - taxes + otherIncome;

    const payload = {
      report_type: reportType,
      company_name: companyName,
      date_from: dateFrom,
      date_to: dateTo,
      currency: currency,
      revenue: revenue,
      cogs: cogs,
      operating_expenses: operatingExpenses,
      other_income: otherIncome,
      taxes: taxes,
      assets: assets,
      liabilities: liabilities,
      equity: equity,
      gross_profit: grossProfit,
      net_profit: netProfit,
      timestamp: new Date().toISOString()
    };

    const saveBtn = document.getElementById('frSaveDbBtn');
    const originalText = saveBtn.innerHTML;
    saveBtn.innerHTML = 'Saving...';
    saveBtn.disabled = true;

    fetch('/api/save-financial-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        alert('Financial report calculation saved successfully!');
      } else {
        alert('Failed to save calculation: ' + (data.message || 'Unknown error'));
      }
    })
    .catch(err => {
      console.error('Error saving calculations:', err);
      alert('Network error. Failed to save calculation to the database.');
    })
    .finally(() => {
      saveBtn.innerHTML = originalText;
      saveBtn.disabled = false;
    });
  },

  // Balance sheet template implementation
  initBalanceSheet: function() {
    const bsInputs = document.querySelectorAll('.fr-bs-cell-input');
    bsInputs.forEach(input => {
      input.addEventListener('input', () => this.calculateBalanceSheet());
      input.addEventListener('focus', () => {
        if (input.value === '0') {
          input.value = '';
        }
      });
      input.addEventListener('blur', () => {
        if (input.value.trim() === '') {
          input.value = '0';
        }
        this.calculateBalanceSheet();
      });
    });

    const downloadBsBtn = document.getElementById('frBtnDownloadBS');
    if (downloadBsBtn) {
      downloadBsBtn.addEventListener('click', () => this.downloadBalanceSheetPDF());
    }

    const bsBackBtns = document.querySelectorAll('.fr-bs-back-btn');
    bsBackBtns.forEach(btn => {
      btn.addEventListener('click', () => this.showLanding());
    });

    this.calculateBalanceSheet();
  },

  calculateBalanceSheet: function() {
    const pettyCash = parseFloat(document.getElementById('bs_petty_cash').value) || 0;
    const bankAccounts = parseFloat(document.getElementById('bs_bank_accounts').value) || 0;
    const accountsReceivable = parseFloat(document.getElementById('bs_accounts_receivable').value) || 0;
    const inventory = parseFloat(document.getElementById('bs_inventory').value) || 0;

    const furniture = parseFloat(document.getElementById('bs_furniture').value) || 0;
    const vehicles = parseFloat(document.getElementById('bs_vehicles').value) || 0;
    const machinery = parseFloat(document.getElementById('bs_machinery').value) || 0;

    const totalAssets = pettyCash + bankAccounts + accountsReceivable + inventory + furniture + vehicles + machinery;

    const accountsPayable = parseFloat(document.getElementById('bs_accounts_payable').value) || 0;
    const shortTermDebits = parseFloat(document.getElementById('bs_short_term_debits').value) || 0;

    const loans = parseFloat(document.getElementById('bs_loans').value) || 0;
    const mortgage = parseFloat(document.getElementById('bs_mortgage').value) || 0;

    const totalLiabilities = accountsPayable + shortTermDebits + loans + mortgage;

    const currentEarnings = parseFloat(document.getElementById('bs_current_earnings').value) || 0;
    const investments = parseFloat(document.getElementById('bs_investments').value) || 0;
    const retainedEarnings = parseFloat(document.getElementById('bs_retained_earnings').value) || 0;

    const totalEquity = currentEarnings + investments + retainedEarnings;

    const totalLiabilitiesEquity = totalLiabilities + totalEquity;

    document.getElementById('lbl_bs_total_assets').textContent = totalAssets.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById('lbl_bs_total_liabilities').textContent = totalLiabilities.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById('lbl_bs_total_equity').textContent = totalEquity.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById('lbl_bs_total_liabilities_equity').textContent = totalLiabilitiesEquity.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  },

  downloadBalanceSheetPDF: function() {
    const bsSheet = document.getElementById('frBsSheet');
    const downloadBtn = document.getElementById('frBtnDownloadBS');
    const originalText = downloadBtn.innerHTML;

    downloadBtn.innerHTML = 'Generating PDF...';
    downloadBtn.disabled = true;
    bsSheet.classList.add('fr-exporting');

    loadHtml2CanvasForFR(() => {
      html2canvas(bsSheet, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
      }).then(canvas => {
        try {
          const imgData = canvas.toDataURL('image/jpeg', 1.0);
          const { jsPDF } = window.jspdf;

          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'in',
            format: 'letter'
          });

          const pdfWidth = 8.5;
          const pdfHeight = 11.0;

          pdf.addImage(imgData, 'JPEG', 0.25, 0.25, pdfWidth - 0.5, pdfHeight - 0.5);

          const compName = (document.getElementById('bs_org_name').value.trim() || 'softrate_org');
          const safeName = compName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
          pdf.save(`balance_sheet_${safeName}.pdf`);
        } catch (err) {
          console.error('PDF Conversion error:', err);
          alert('Could not export PDF automatically. Please use Ctrl+P (Print) and select Save as PDF.');
        } finally {
          bsSheet.classList.remove('fr-exporting');
          downloadBtn.innerHTML = originalText;
          downloadBtn.disabled = false;
        }
      });
    });
  },

  // Income statement template implementation
  initIncomeStatement: function() {
    const isInputs = document.querySelectorAll('.fr-income-statement-container .fr-bs-cell-input');
    isInputs.forEach(input => {
      input.addEventListener('input', () => this.calculateIncomeStatement());
      input.addEventListener('focus', () => {
        if (input.value === '0') {
          input.value = '';
        }
      });
      input.addEventListener('blur', () => {
        if (input.value.trim() === '') {
          input.value = '0';
        }
        this.calculateIncomeStatement();
      });
    });

    const downloadIsBtn = document.getElementById('frBtnDownloadIS');
    if (downloadIsBtn) {
      downloadIsBtn.addEventListener('click', () => this.downloadIncomeStatementPDF());
    }

    const isBackBtns = document.querySelectorAll('.fr-is-back-btn');
    isBackBtns.forEach(btn => {
      btn.addEventListener('click', () => this.showLanding());
    });

    this.calculateIncomeStatement();
  },

  calculateIncomeStatement: function() {
    const generalIncome = parseFloat(document.getElementById('is_general_income').value) || 0;
    const sales = parseFloat(document.getElementById('is_sales').value) || 0;
    const grossProfit = parseFloat(document.getElementById('is_gross_profit').value) || 0;
    const grossMargin = parseFloat(document.getElementById('is_gross_margin').value) || 0;
    const totalOperatingIncome = generalIncome + sales + grossProfit + grossMargin;

    const capitalGain = parseFloat(document.getElementById('is_capital_gain').value) || 0;
    const totalNonOperatingIncome = capitalGain;

    const businessInsurance = parseFloat(document.getElementById('is_business_insurance').value) || 0;
    const telephone = parseFloat(document.getElementById('is_telephone').value) || 0;
    const shipping = parseFloat(document.getElementById('is_shipping').value) || 0;
    const travelExpenses = parseFloat(document.getElementById('is_travel_expenses').value) || 0;
    const totalOperatingExpense = businessInsurance + telephone + shipping + travelExpenses;

    const lawsuitSettlement = parseFloat(document.getElementById('is_lawsuit_settlement').value) || 0;
    const damages = parseFloat(document.getElementById('is_damages').value) || 0;
    const interestExpense = parseFloat(document.getElementById('is_interest_expense').value) || 0;
    const totalNonOperatingExpense = lawsuitSettlement + damages + interestExpense;

    const manufacturing = parseFloat(document.getElementById('is_manufacturing').value) || 0;
    const laborPayment = parseFloat(document.getElementById('is_labor_payment').value) || 0;
    const totalCogs = manufacturing + laborPayment;

    const netProfitLoss = (totalOperatingIncome + totalNonOperatingIncome) - (totalOperatingExpense + totalNonOperatingExpense + totalCogs);

    document.getElementById('lbl_is_total_operating_income').textContent = totalOperatingIncome.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById('lbl_is_total_non_operating_income').textContent = totalNonOperatingIncome.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById('lbl_is_total_operating_expense').textContent = totalOperatingExpense.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById('lbl_is_total_non_operating_expense').textContent = totalNonOperatingExpense.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById('lbl_is_total_cogs').textContent = totalCogs.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById('lbl_is_net_profit_loss').textContent = netProfitLoss.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  },

  downloadIncomeStatementPDF: function() {
    const isSheet = document.getElementById('frIsSheet');
    const downloadBtn = document.getElementById('frBtnDownloadIS');
    const originalText = downloadBtn.innerHTML;

    downloadBtn.innerHTML = 'Generating PDF...';
    downloadBtn.disabled = true;
    isSheet.classList.add('fr-exporting');

    loadHtml2CanvasForFR(() => {
      html2canvas(isSheet, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
      }).then(canvas => {
        try {
          const imgData = canvas.toDataURL('image/jpeg', 1.0);
          const { jsPDF } = window.jspdf;

          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'in',
            format: 'letter'
          });

          const pdfWidth = 8.5;
          const pdfHeight = 11.0;

          pdf.addImage(imgData, 'JPEG', 0.25, 0.25, pdfWidth - 0.5, pdfHeight - 0.5);

          const compName = (document.getElementById('is_org_name').value.trim() || 'softrate_org');
          const safeName = compName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
          pdf.save(`income_statement_${safeName}.pdf`);
        } catch (err) {
          console.error('PDF Conversion error:', err);
          alert('Could not export PDF automatically. Please use Ctrl+P (Print) and select Save as PDF.');
        } finally {
          isSheet.classList.remove('fr-exporting');
          downloadBtn.innerHTML = originalText;
          downloadBtn.disabled = false;
        }
      });
    });
  }
};

// Bind DOM loaded listeners
document.addEventListener('DOMContentLoaded', () => {
  FinancialReportController.init();
});

// Bind SPA route loaded events
document.addEventListener('financialReportRouteLoaded', () => {
  FinancialReportController.init();
});

// Expose globally
window.FinancialReportController = FinancialReportController;
