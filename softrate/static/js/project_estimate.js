/* Free Project Cost Estimate Calculator Interactive JavaScript Engine */

// Load html2canvas dynamically if not already present
function loadHtml2Canvas(callback) {
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

// Controller Namespace
const ProjectEstimateController = {
  rowCounter: 0,
  activeStep: 1,

  // Tooltip descriptions matching walkthrough steps
  stepTooltips: {
    1: {
      text: "Estimation ID: A unique identifier for tracking this specific project estimate.",
      indicatorId: "mockupIndicator1",
      pos: "bottom"
    },
    2: {
      text: "Project Name: The name of the project or job for which the estimate is being created.",
      indicatorId: "mockupIndicator2",
      pos: "bottom"
    },
    3: {
      text: "Client Name: The name of the customer or organization requesting the estimate.",
      indicatorId: "mockupIndicator3",
      pos: "bottom"
    },
    4: {
      text: "Project Duration: The start and end date range planned for this project.",
      indicatorId: "mockupIndicator4",
      pos: "bottom"
    },
    5: {
      text: "Task Name: The description of the work item or deliverable.",
      indicatorId: "mockupIndicator5",
      pos: "right"
    },
    6: {
      text: "Billing Method: Choose how this task will be billed: by day, by hour, or a fixed price.",
      indicatorId: "mockupIndicator6",
      pos: "right"
    },
    7: {
      text: "Cost Price: The rate per day/hour, or the total flat rate for fixed price tasks.",
      indicatorId: "mockupIndicator7",
      pos: "top"
    },
    8: {
      text: "Estimated Duration: The number of days or hours required to complete this task.",
      indicatorId: "mockupIndicator8",
      pos: "top"
    },
    9: {
      text: "Estimated Cost: The calculated cost for this task (Cost Price × Duration for rates, or Cost Price for fixed).",
      indicatorId: "mockupIndicator9",
      pos: "top"
    },
    10: {
      text: "Total Estimation Cost: The sum total of all estimated task costs.",
      indicatorId: "mockupIndicator10",
      pos: "top"
    }
  },

  // Format currency value helper
  formatNumber: function(val) {
    return parseFloat(val).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  },

  // Initialize with default rows
  init: function() {
    this.rowCounter = 0;
    const tableBody = document.getElementById('peTaskTableBody');
    if (tableBody) {
      tableBody.innerHTML = '';
      // Add a single empty task row matching Zoho default
      this.addTaskRow('', 'This is a sample note for a task. Max text char will be 80.', 'day', 0, 0);
    }
    this.updateTotal();
    this.setupWalkthrough();
  },

  // Add task row to table
  addTaskRow: function(name = '', desc = '', method = 'day', price = 0, duration = 0) {
    const tableBody = document.getElementById('peTaskTableBody');
    if (!tableBody) return;

    const id = this.rowCounter++;
    const rowHTML = `
      <tr class="pe-task-row" data-row-id="${id}" id="pe-row-${id}">
        <td>
          <input type="text" class="pe-table-input pe-row-task-name" placeholder="Enter task name" value="${name}">
          <input type="text" class="pe-table-desc-input pe-row-task-desc" placeholder="Add task description" value="${desc}">
        </td>
        <td>
          <select class="pe-table-select pe-row-billing-method" onchange="ProjectEstimateController.handleMethodChange(${id})">
            <option value="day" ${method === 'day' ? 'selected' : ''}>Cost per Day</option>
            <option value="hour" ${method === 'hour' ? 'selected' : ''}>Cost per Hour</option>
            <option value="fixed" ${method === 'fixed' ? 'selected' : ''}>Fixed Cost price</option>
          </select>
        </td>
        <td>
          <input type="number" class="pe-table-input pe-row-cost-price" value="${price}" min="0" oninput="ProjectEstimateController.calculateRow(${id})">
        </td>
        <td>
          <div class="pe-duration-wrap" id="pe-duration-wrap-${id}">
            <input type="number" class="pe-table-input pe-row-duration" value="${duration}" min="0" oninput="ProjectEstimateController.calculateRow(${id})">
            <span class="pe-duration-unit" id="pe-duration-unit-${id}">${method === 'hour' ? 'Hours' : 'Days'}</span>
          </div>
        </td>
        <td>
          <span class="pe-row-cost-val" id="pe-row-cost-val-${id}">0.00</span>
        </td>
        <td>
          <button type="button" class="pe-delete-row-btn" onclick="ProjectEstimateController.deleteTaskRow(${id})" title="Delete Task">&times;</button>
        </td>
      </tr>
    `;
    tableBody.insertAdjacentHTML('beforeend', rowHTML);
    this.handleMethodChange(id);
  },

  // Delete task row
  deleteTaskRow: function(id) {
    const row = document.getElementById(`pe-row-${id}`);
    if (row) {
      row.remove();
      this.updateTotal();
    }
  },

  // Billing method change handler
  handleMethodChange: function(id) {
    const row = document.getElementById(`pe-row-${id}`);
    if (!row) return;

    const methodSelect = row.querySelector('.pe-row-billing-method');
    const durationWrap = document.getElementById(`pe-duration-wrap-${id}`);
    const durationUnit = document.getElementById(`pe-duration-unit-${id}`);

    if (methodSelect && durationWrap && durationUnit) {
      const val = methodSelect.value;
      if (val === 'fixed') {
        durationWrap.style.display = 'none';
      } else {
        durationWrap.style.display = 'flex';
        durationUnit.textContent = val === 'hour' ? 'Hours' : 'Days';
      }
    }
    this.calculateRow(id);
  },

  // Calculate single row cost
  calculateRow: function(id) {
    const row = document.getElementById(`pe-row-${id}`);
    if (!row) return;

    const priceInput = row.querySelector('.pe-row-cost-price');
    const durationInput = row.querySelector('.pe-row-duration');
    const methodSelect = row.querySelector('.pe-row-billing-method');
    const costSpan = document.getElementById(`pe-row-cost-val-${id}`);

    if (priceInput && durationInput && methodSelect && costSpan) {
      const price = parseFloat(priceInput.value) || 0;
      const duration = parseFloat(durationInput.value) || 0;
      const method = methodSelect.value;

      let rowCost = 0;
      if (method === 'fixed') {
        rowCost = price;
      } else {
        rowCost = price * duration;
      }

      costSpan.textContent = this.formatNumber(rowCost);
    }
    this.updateTotal();
  },

  // Recalculate total cost
  updateTotal: function() {
    const rows = document.querySelectorAll('.pe-task-row');
    let total = 0;

    rows.forEach(row => {
      const priceInput = row.querySelector('.pe-row-cost-price');
      const durationInput = row.querySelector('.pe-row-duration');
      const methodSelect = row.querySelector('.pe-row-billing-method');

      if (priceInput && durationInput && methodSelect) {
        const price = parseFloat(priceInput.value) || 0;
        const duration = parseFloat(durationInput.value) || 0;
        const method = methodSelect.value;

        if (method === 'fixed') {
          total += price;
        } else {
          total += price * duration;
        }
      }
    });

    const currencySelector = document.getElementById('pe_currency_selector');
    const grandTotalSpan = document.getElementById('pe_grand_total');

    if (grandTotalSpan) {
      grandTotalSpan.textContent = this.formatNumber(total);
    }
  },

  // Validate estimation inputs before pdf export
  validateForm: function() {
    let isValid = true;
    const estimationId = document.getElementById('pe_estimation_id');
    const projectName = document.getElementById('pe_project_name');
    const clientName = document.getElementById('pe_client_name');
    const projectDuration = document.getElementById('pe_project_duration');

    // ID
    if (estimationId && !estimationId.value.trim()) {
      document.getElementById('pe_estimation_id_err').classList.remove('hide');
      isValid = false;
    } else if (estimationId) {
      document.getElementById('pe_estimation_id_err').classList.add('hide');
    }

    // Project Name
    if (projectName && !projectName.value.trim()) {
      document.getElementById('pe_project_name_err').classList.remove('hide');
      isValid = false;
    } else if (projectName) {
      document.getElementById('pe_project_name_err').classList.add('hide');
    }

    // Client Name
    if (clientName && !clientName.value.trim()) {
      document.getElementById('pe_client_name_err').classList.remove('hide');
      isValid = false;
    } else if (clientName) {
      document.getElementById('pe_client_name_err').classList.add('hide');
    }

    // Duration
    if (projectDuration && !projectDuration.value.trim()) {
      document.getElementById('pe_project_duration_err').classList.remove('hide');
      isValid = false;
    } else if (projectDuration) {
      document.getElementById('pe_project_duration_err').classList.add('hide');
    }

    return isValid;
  },

  // Setup walkthrough events & triggers
  setupWalkthrough: function() {
    const self = this;
    const stepItems = document.querySelectorAll('.pe-step-item');
    const circleIndicators = document.querySelectorAll('.pe-circle-indicator');

    stepItems.forEach(item => {
      item.addEventListener('click', () => {
        const stepNum = parseInt(item.getAttribute('data-step'));
        self.activateStep(stepNum);
      });
    });

    circleIndicators.forEach(circle => {
      circle.addEventListener('click', (e) => {
        e.stopPropagation();
        const stepNum = parseInt(circle.getAttribute('data-step'));
        self.activateStep(stepNum);
      });
    });

    // Initial load active tooltip
    this.activateStep(7);
  },

  // Trigger active state in walkthrough guides
  activateStep: function(stepNum) {
    this.activeStep = stepNum;

    // Reset active states
    document.querySelectorAll('.pe-step-item').forEach(item => item.classList.remove('active'));
    document.querySelectorAll('.pe-circle-indicator').forEach(c => c.classList.remove('active'));

    // Set new active state
    const activeItem = document.querySelector(`.pe-step-item[data-step="${stepNum}"]`);
    if (activeItem) activeItem.classList.add('active');

    const activeIndicator = document.getElementById(`mockupIndicator${stepNum}`);
    if (activeIndicator) activeIndicator.classList.add('active');

    // Show tooltip next to the indicator
    this.showTooltip(stepNum);
  },

  // Display tooltip element positioned near indicators
  showTooltip: function(stepNum) {
    const tooltipBox = document.getElementById('peTooltipBox');
    const tooltipText = document.getElementById('peTooltipText');
    const indicator = document.getElementById(`mockupIndicator${stepNum}`);
    const mockupCard = document.getElementById('peMockupCard');

    if (!tooltipBox || !tooltipText || !indicator || !mockupCard) return;

    const config = this.stepTooltips[stepNum];
    tooltipText.textContent = config.text;

    // Show box to get dimensions
    tooltipBox.classList.remove('hide');

    // Reset layout classes
    tooltipBox.className = 'pe-tooltip-box';

    // Position calculations relative to parent (mockupCard)
    const indTop = indicator.offsetTop;
    const indLeft = indicator.offsetLeft;
    const indWidth = indicator.offsetWidth;
    const indHeight = indicator.offsetHeight;

    const boxWidth = tooltipBox.offsetWidth;
    const boxHeight = tooltipBox.offsetHeight;

    let targetTop = 0;
    let targetLeft = 0;

    switch (config.pos) {
      case 'bottom':
        targetTop = indTop + indHeight + 10;
        targetLeft = indLeft + (indWidth / 2) - (boxWidth / 2);
        tooltipBox.classList.add('pe-tooltip-pos-bottom');
        break;
      case 'top':
        targetTop = indTop - boxHeight - 10;
        targetLeft = indLeft + (indWidth / 2) - (boxWidth / 2);
        tooltipBox.classList.add('pe-tooltip-pos-top');
        break;
      case 'right':
        targetTop = indTop + (indHeight / 2) - (boxHeight / 2);
        targetLeft = indLeft + indWidth + 10;
        tooltipBox.classList.add('pe-tooltip-pos-right');
        break;
      case 'left':
        targetTop = indTop + (indHeight / 2) - (boxHeight / 2);
        targetLeft = indLeft - boxWidth - 10;
        tooltipBox.classList.add('pe-tooltip-pos-left');
        break;
    }

    // Bounds checking inside card to prevent overflowing card dimensions
    if (targetLeft < 10) targetLeft = 10;
    if (targetLeft + boxWidth > mockupCard.offsetWidth - 10) {
      targetLeft = mockupCard.offsetWidth - boxWidth - 10;
    }

    tooltipBox.style.top = `${targetTop}px`;
    tooltipBox.style.left = `${targetLeft}px`;
  },

  // Close tooltip helper
  closeTooltip: function() {
    const tooltipBox = document.getElementById('peTooltipBox');
    if (tooltipBox) tooltipBox.classList.add('hide');
  },

  // Reset inputs
  resetForm: function() {
    document.getElementById('peForm').reset();
    this.init();
  },

  // Generate and download calculator workspace card as PDF
  downloadPDF: function() {
    if (!this.validateForm()) return;

    const docSheet = document.getElementById('peCalculatorCardForPrint');
    if (!docSheet) return;

    const self = this;
    const downloadBtn = document.querySelector('.pe-btn-download');
    const originalText = downloadBtn ? downloadBtn.innerHTML : 'Download as PDF';

    if (downloadBtn) {
      downloadBtn.innerHTML = 'Generating PDF...';
      downloadBtn.disabled = true;
    }

    loadHtml2Canvas(() => {
      html2canvas(docSheet, {
        scale: 2, // Crisp high-DPI scaling
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
      }).then(canvas => {
        try {
          const imgData = canvas.toDataURL('image/jpeg', 1.0);
          const { jsPDF } = window.jspdf;

          // Create Letter sized PDF landscape or portrait
          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'in',
            format: 'letter'
          });

          const pdfWidth = 8.5;
          const pdfHeight = 11.0;

          // Scale and margin calculation
          pdf.addImage(imgData, 'JPEG', 0.25, 0.25, pdfWidth - 0.5, pdfHeight - 0.5);

          const projName = document.getElementById('pe_project_name').value.trim();
          const safeName = projName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
          pdf.save(`project_estimation_${safeName || 'quote'}.pdf`);
        } catch (err) {
          console.error('PDF Conversion error:', err);
          alert('Could not export PDF automatically. Please use Ctrl+P (Print) and select Save as PDF.');
        } finally {
          if (downloadBtn) {
            downloadBtn.innerHTML = originalText;
            downloadBtn.disabled = false;
          }
        }
      });
    });
  }
};

// Bind dynamic event listeners
document.addEventListener('DOMContentLoaded', () => {
  ProjectEstimateController.init();

  // Bind FAQ accordion trigger events
  const faqTriggers = document.querySelectorAll('.pe-faq-trigger');
  faqTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.pe-faq-item');
      const content = item.querySelector('.pe-faq-content');
      const isActive = item.classList.contains('active');

      // Collapse other accordion items
      document.querySelectorAll('.pe-faq-item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherContent = otherItem.querySelector('.pe-faq-content');
          if (otherContent) otherContent.style.display = 'none';
        }
      });

      // Toggle current panel
      if (isActive) {
        item.classList.remove('active');
        if (content) content.style.display = 'none';
      } else {
        item.classList.add('active');
        if (content) content.style.display = 'block';
      }
    });
  });
});

// Expose globally
window.ProjectEstimateController = ProjectEstimateController;
