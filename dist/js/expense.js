import.meta.env = {
  VITE_API_URL: window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://127.0.0.1:5000"
    : "https://softrate-tech-park-backend.onrender.com"
};

/**
 * Softrate Expense Report Generator - Client-Side Controller
 * Handles calculations, state, validation, receipt previews,
 * Chart.js analytics, exports, and backend API integration.
 */

document.addEventListener("DOMContentLoaded", () => {
  // --- State Variables ---
  let currentItems = [];
  let tempReceiptBase64 = null;
  let tempReceiptFileName = "";
  let activeReportId = "";
  
  // Chart.js Instances
  let categoryChartInstance = null;
  let monthlyChartInstance = null;

  // --- DOM Element Cache ---
  // Form Metadata
  const expEmployeeName = document.getElementById("expEmployeeName");
  const expEmployeeEmail = document.getElementById("expEmployeeEmail");
  const expDepartment = document.getElementById("expDepartment");
  const expProjectName = document.getElementById("expProjectName");
  const expTravelPurpose = document.getElementById("expTravelPurpose");
  const expReportPeriod = document.getElementById("expReportPeriod");
  const expenseReportIdText = document.getElementById("expenseReportIdText");
  const workflowStatusBadge = document.getElementById("workflowStatusBadge");

  // Budget Tracker
  const budgetLimitInput = document.getElementById("budgetLimitInput");
  const displayBudget = document.getElementById("displayBudget");
  const displaySpent = document.getElementById("displaySpent");
  const budgetProgressBar = document.getElementById("budgetProgressBar");
  const budgetExceededWarning = document.getElementById("budgetExceededWarning");

  // Active Report Workflow Actions Card
  const workflowActionsPanel = document.getElementById("workflowActionsPanel");
  const btnApproveActiveReport = document.getElementById("btnApproveActiveReport");
  const btnRejectActiveReport = document.getElementById("btnRejectActiveReport");

  // Item Builder Inputs
  const itemDate = document.getElementById("itemDate");
  const itemCategory = document.getElementById("itemCategory");
  const itemMerchant = document.getElementById("itemMerchant");
  const itemPaymentMode = document.getElementById("itemPaymentMode");
  const itemDescription = document.getElementById("itemDescription");
  const itemGst = document.getElementById("itemGst");
  const itemAmount = document.getElementById("itemAmount");
  
  // Receipt Upload Elements
  const itemReceipt = document.getElementById("itemReceipt");
  const btnUploadTrigger = document.getElementById("btnUploadTrigger");
  const uploadFileName = document.getElementById("uploadFileName");
  const receiptPreviewContainer = document.getElementById("receiptPreviewContainer");
  const receiptPreviewImg = document.getElementById("receiptPreviewImg");
  const btnRemoveReceipt = document.getElementById("btnRemoveReceipt");

  // Actions & Layout
  const btnAppendItem = document.getElementById("btnAppendItem");
  const expenseItemsBody = document.getElementById("expenseItemsBody");
  const emptyTablePlaceholder = document.getElementById("emptyTablePlaceholder");
  
  // Calculations
  const expSubtotal = document.getElementById("expSubtotal");
  const expGstTotal = document.getElementById("expGstTotal");
  const expGrandTotal = document.getElementById("expGrandTotal");

  // Action Buttons
  const btnSaveExpense = document.getElementById("btnSaveExpense");
  const btnExportExcel = document.getElementById("btnExportExcel");
  const btnExportPdf = document.getElementById("btnExportPdf");
  const btnPrintReport = document.getElementById("btnPrintReport");
  const btnResetExpense = document.getElementById("btnResetExpense");
  const expenseSubmitStatus = document.getElementById("expenseSubmitStatus");

  // History Grid
  const savedExpensesBody = document.getElementById("savedExpensesBody");

  // --- Initialization ---
  function init() {
    generateNewReportId();
    setDefaultDate();
    setupEventListeners();
    loadSavedReports();
    updateCalculations();
    renderCharts();
  }

  // Generate Report ID: EXP-YYYYMMDD-XXXX
  function generateNewReportId() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const dateStr = `${yyyy}${mm}${dd}`;
    const rand = Math.floor(1000 + Math.random() * 9000);
    activeReportId = `EXP-${dateStr}-${rand}`;
    if (expenseReportIdText) {
      expenseReportIdText.textContent = activeReportId;
    }
  }

  // Set default date picker value to today
  function setDefaultDate() {
    if (itemDate) {
      const today = new Date().toISOString().split("T")[0];
      itemDate.value = today;
    }
  }

  // --- Event Listeners Setup ---
  function setupEventListeners() {
    // Budget limit input change
    if (budgetLimitInput) {
      budgetLimitInput.addEventListener("input", () => {
        const val = parseFloat(budgetLimitInput.value) || 0;
        if (displayBudget) {
          displayBudget.textContent = `₹${val.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }
        updateCalculations();
      });
    }

    // Custom receipt upload button trigger
    if (btnUploadTrigger && itemReceipt) {
      btnUploadTrigger.addEventListener("click", () => {
        itemReceipt.click();
      });
    }

    // Receipt file selection
    if (itemReceipt) {
      itemReceipt.addEventListener("change", handleReceiptUpload);
    }

    // Receipt remove button
    if (btnRemoveReceipt) {
      btnRemoveReceipt.addEventListener("click", clearReceiptTemp);
    }

    // Append Item
    if (btnAppendItem) {
      btnAppendItem.addEventListener("click", appendItem);
    }

    // Save & Submit Report
    if (btnSaveExpense) {
      btnSaveExpense.addEventListener("click", submitReport);
    }

    // Reset Form
    if (btnResetExpense) {
      btnResetExpense.addEventListener("click", resetReportForm);
    }

    // Active card Approve/Reject clicks
    if (btnApproveActiveReport) {
      btnApproveActiveReport.addEventListener("click", () => {
        approveActiveReport();
      });
    }

    if (btnRejectActiveReport) {
      btnRejectActiveReport.addEventListener("click", () => {
        rejectActiveReport();
      });
    }

    // Exports & Print
    if (btnExportExcel) {
      btnExportExcel.addEventListener("click", downloadExcelReport);
    }
    if (btnExportPdf) {
      btnExportPdf.addEventListener("click", downloadPdfReport);
    }
    if (btnPrintReport) {
      btnPrintReport.addEventListener("click", triggerPrint);
    }

    // Listen for tab routing trigger to refresh Lucide icons & charts
    document.addEventListener("expenseRouteLoaded", () => {
      loadSavedReports();
      setTimeout(() => {
        if (typeof lucide !== "undefined") {
          lucide.createIcons();
        }
        renderCharts();
      }, 100);
    });
  }

  // --- Receipt File Upload Reader ---
  function handleReceiptUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    tempReceiptFileName = file.name;
    if (uploadFileName) {
      uploadFileName.textContent = file.name.length > 15 ? file.name.substring(0, 12) + "..." : file.name;
    }

    // Check size limit: 5MB
    if (file.size > 5 * 1024 * 1024) {
      showStatusMessage("Receipt file size cannot exceed 5MB.", "danger");
      clearReceiptTemp();
      return;
    }

    const reader = new FileReader();
    reader.onload = function(evt) {
      tempReceiptBase64 = evt.target.result;
      
      // Update image preview if it's an image
      if (file.type.startsWith("image/")) {
        if (receiptPreviewImg) receiptPreviewImg.src = tempReceiptBase64;
        if (receiptPreviewContainer) receiptPreviewContainer.classList.remove("hide");
      } else {
        // For PDFs or other files, show PDF symbol
        if (receiptPreviewImg) receiptPreviewImg.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%23ef5350' stroke-width='2'><path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'/><polyline points='14 2 14 8 20 8'/><line x1='16' y1='13' x2='8' y2='13'/><line x1='16' y1='17' x2='8' y2='17'/><polyline points='10 9 9 9 8 9'/></svg>";
        if (receiptPreviewContainer) receiptPreviewContainer.classList.remove("hide");
      }
    };
    reader.readAsDataURL(file);
  }

  function clearReceiptTemp() {
    tempReceiptBase64 = null;
    tempReceiptFileName = "";
    if (itemReceipt) itemReceipt.value = "";
    if (uploadFileName) uploadFileName.textContent = "No file";
    if (receiptPreviewContainer) receiptPreviewContainer.classList.add("hide");
    if (receiptPreviewImg) receiptPreviewImg.src = "";
  }

  // --- Add Line Item to Form State ---
  function appendItem() {
    // Validate inputs
    const dateVal = itemDate.value;
    const categoryVal = itemCategory.value;
    const merchantVal = itemMerchant.value.trim();
    const modeVal = itemPaymentMode.value;
    const descVal = itemDescription.value.trim();
    const gstVal = parseInt(itemGst.value) || 0;
    const amountVal = parseFloat(itemAmount.value) || 0;

    if (!dateVal || !merchantVal || !descVal || amountVal <= 0) {
      showStatusMessage("Please fill in all active line item fields with valid values.", "danger");
      return;
    }

    // Calculations for this line item (Amount is exclusive of GST)
    const gstAmt = amountVal * (gstVal / 100);
    const totalAmt = amountVal + gstAmt;

    const newItem = {
      date: dateVal,
      category: categoryVal,
      merchant: merchantVal,
      payment_mode: modeVal,
      description: descVal,
      gst_percentage: gstVal,
      amount: amountVal,
      gst_amount: gstAmt,
      total: totalAmt,
      receipt_base64: tempReceiptBase64,
      receipt_name: tempReceiptFileName
    };

    currentItems.push(newItem);

    // Render Table and Recalculate
    renderItemsTable();
    updateCalculations();
    renderCharts();
    
    // Reset builder form fields
    itemMerchant.value = "";
    itemDescription.value = "";
    itemAmount.value = "";
    clearReceiptTemp();
    
    // Success feedback
    showStatusMessage("Line item appended successfully.", "success", 2000);
  }

  // Remove Item
  window.removeExpenseItem = function(index) {
    currentItems.splice(index, 1);
    renderItemsTable();
    updateCalculations();
    renderCharts();
  };

  // --- Render Items Table ---
  function renderItemsTable() {
    if (!expenseItemsBody) return;

    if (currentItems.length === 0) {
      if (emptyTablePlaceholder) emptyTablePlaceholder.classList.remove("hide");
      expenseItemsBody.innerHTML = "";
      expenseItemsBody.appendChild(emptyTablePlaceholder);
      return;
    }

    if (emptyTablePlaceholder) emptyTablePlaceholder.classList.add("hide");
    
    let html = "";
    currentItems.forEach((item, index) => {
      const formattedAmount = item.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 });
      const formattedTotal = item.total.toLocaleString("en-IN", { minimumFractionDigits: 2 });
      
      let receiptHtml = `<span class="badge badge-workflow text-xs bg-light text-muted">No Receipt</span>`;
      if (item.receipt_base64) {
        receiptHtml = `
          <div class="receipt-table-preview">
            <i data-lucide="image" class="text-teal cursor-pointer hover-zoom" onclick="window.viewReceipt(${index})"></i>
            <span class="tooltip text-xs">View</span>
          </div>
        `;
      }

      html += `
        <tr>
          <td>${item.date}</td>
          <td><strong>${item.category}</strong></td>
          <td>${item.description}</td>
          <td>${item.merchant}</td>
          <td>${item.payment_mode}</td>
          <td>${item.gst_percentage}%</td>
          <td>₹${formattedAmount}</td>
          <td>${receiptHtml}</td>
          <td>
            <button type="button" class="btn btn-danger-link text-xs py-1" onclick="window.removeExpenseItem(${index})">
              <i data-lucide="trash-2"></i> Remove
            </button>
          </td>
        </tr>
      `;
    });

    expenseItemsBody.innerHTML = html;
    
    // Refresh Lucide icons in table
    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }
  };

  // View Receipt Modal/Lightbox Popup
  window.viewReceipt = function(index) {
    const item = currentItems[index];
    if (!item || !item.receipt_base64) return;
    
    // Simple popup modal
    const overlay = document.createElement("div");
    overlay.className = "receipt-lightbox-overlay";
    overlay.onclick = () => document.body.removeChild(overlay);
    
    const container = document.createElement("div");
    container.className = "receipt-lightbox-content";
    container.onclick = (e) => e.stopPropagation();
    
    const closeBtn = document.createElement("button");
    closeBtn.className = "btn-close-lightbox";
    closeBtn.innerHTML = "&times;";
    closeBtn.onclick = () => document.body.removeChild(overlay);
    
    let element;
    if (item.receipt_base64.startsWith("data:application/pdf")) {
      element = document.createElement("embed");
      element.src = item.receipt_base64;
      element.type = "application/pdf";
      element.style.width = "100%";
      element.style.height = "70vh";
    } else {
      element = document.createElement("img");
      element.src = item.receipt_base64;
      element.alt = "Receipt Zoom Preview";
    }
    
    container.appendChild(closeBtn);
    container.appendChild(element);
    overlay.appendChild(container);
    document.body.appendChild(overlay);
  };

  // --- Auto Calculations & Budget Checker ---
  function updateCalculations() {
    let subtotal = 0;
    let gstTotal = 0;
    let grandTotal = 0;

    currentItems.forEach(item => {
      subtotal += item.amount;
      gstTotal += item.gst_amount;
      grandTotal += item.total;
    });

    // Update Totals UI
    if (expSubtotal) expSubtotal.textContent = `₹${subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (expGstTotal) expGstTotal.textContent = `₹${gstTotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (expGrandTotal) expGrandTotal.textContent = `₹${grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // Budget Progress Tracker
    const limit = parseFloat(budgetLimitInput.value) || 0;
    if (displaySpent) displaySpent.textContent = `₹${grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    
    let percent = 0;
    if (limit > 0) {
      percent = Math.min((grandTotal / limit) * 100, 100);
    }
    
    if (budgetProgressBar) {
      budgetProgressBar.style.width = `${percent}%`;
      
      // Update progress bar color based on usage
      if (percent >= 100) {
        budgetProgressBar.style.backgroundColor = "var(--accent-red)";
      } else if (percent >= 80) {
        budgetProgressBar.style.backgroundColor = "var(--accent-yellow)";
      } else {
        budgetProgressBar.style.backgroundColor = "var(--primary-teal)";
      }
    }

    if (grandTotal > limit) {
      if (budgetExceededWarning) budgetExceededWarning.classList.remove("hide");
    } else {
      if (budgetExceededWarning) budgetExceededWarning.classList.add("hide");
    }
  }

  // --- Analytics Charts Layout (Chart.js) ---
  function renderCharts() {
    // 1. Category Spending Pie Chart
    const pieCtx = document.getElementById("categoryChart");
    if (pieCtx) {
      const categories = ["Travel", "Meals", "Lodging", "Office Supplies", "Software", "Subscriptions", "Utilities", "Other"];
      const categoryData = categories.map(cat => {
        return currentItems.filter(item => item.category === cat).reduce((sum, item) => sum + item.total, 0);
      });
      
      const hasData = categoryData.some(v => v > 0);
      
      if (categoryChartInstance) {
        categoryChartInstance.destroy();
      }

      categoryChartInstance = new Chart(pieCtx, {
        type: "pie",
        data: {
          labels: categories,
          datasets: [{
            data: hasData ? categoryData : [1, 1, 1, 1, 1, 1, 1, 1], // Neutral colors if empty
            backgroundColor: hasData ? [
              "#3a86c8", // Travel (Blue)
              "#ff9f43", // Meals (Orange)
              "#10ac84", // Lodging (Teal)
              "#5f27cd", // Office Supplies (Purple)
              "#0abde3", // Software (Cyan)
              "#ee5253", // Subscriptions (Red)
              "#feca57", // Utilities (Yellow)
              "#8395a7"  // Other (Gray)
            ] : Array(8).fill("#f4f7f6"),
            borderColor: "#ffffff",
            borderWidth: 1.5
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: hasData ? "Expenses by Category (Total)" : "No Expense Data Registered",
              color: "#0F4C81",
              font: { weight: "bold", size: 12 }
            },
            legend: {
              display: hasData,
              position: "bottom",
              labels: { boxWidth: 10, font: { size: 9 } }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  if (!hasData) return "No transactions logged";
                  const label = context.label || '';
                  const value = context.raw || 0;
                  return ` ${label}: ₹${value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
                }
              }
            }
          }
        }
      });
    }

    // 2. Monthly Expense Bar Chart
    const barCtx = document.getElementById("monthlyChart");
    if (barCtx) {
      const monthsMap = {
        "Jan": 0, "Feb": 0, "Mar": 0, "Apr": 0, "May": 0, "Jun": 0,
        "Jul": 0, "Aug": 0, "Sep": 0, "Oct": 0, "Nov": 0, "Dec": 0
      };

      // Populate currentItems
      currentItems.forEach(item => {
        const d = new Date(item.date);
        if (!isNaN(d.getTime())) {
          const monthName = d.toLocaleString("en-US", { month: "short" });
          if (monthsMap[monthName] !== undefined) {
            monthsMap[monthName] += item.total;
          }
        }
      });

      // Layer in historical saved reports
      const currentYear = new Date().getFullYear();
      window.savedExpensesList = window.savedExpensesList || [];
      window.savedExpensesList.forEach(report => {
        if (report.report_id !== activeReportId) {
          const d = new Date(report.timestamp || report.submission_date);
          if (!isNaN(d.getTime()) && d.getFullYear() === currentYear) {
            const monthName = d.toLocaleString("en-US", { month: "short" });
            if (monthsMap[monthName] !== undefined) {
              monthsMap[monthName] += report.grand_total;
            }
          }
        }
      });

      const months = Object.keys(monthsMap);
      const monthlyData = Object.values(monthsMap);

      if (monthlyChartInstance) {
        monthlyChartInstance.destroy();
      }

      monthlyChartInstance = new Chart(barCtx, {
        type: "bar",
        data: {
          labels: months,
          datasets: [{
            label: "Total Expenses (₹)",
            data: monthlyData,
            backgroundColor: "#0F4C81",
            borderRadius: 4,
            hoverBackgroundColor: "#008080"
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: `Annual Expense Projection (${currentYear})`,
              color: "#0F4C81",
              font: { weight: "bold", size: 12 }
            },
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                font: { size: 9 },
                callback: function(value) {
                  return "₹" + value.toLocaleString("en-IN", { maximumFractionDigits: 0 });
                }
              }
            },
            x: {
              ticks: { font: { size: 9 } }
            }
          }
        }
      });
    }
  }

  // --- Reset/Clear Active Form and Grid Items ---
  function resetReportForm() {
    // Clear state
    currentItems = [];
    clearReceiptTemp();
    generateNewReportId();
    
    // Clear HTML inputs
    expEmployeeName.value = "";
    expEmployeeEmail.value = "";
    expProjectName.value = "";
    expTravelPurpose.value = "";
    expReportPeriod.value = "";
    budgetLimitInput.value = "50000";
    
    if (workflowStatusBadge) {
      workflowStatusBadge.textContent = "Draft";
      workflowStatusBadge.className = "badge badge-workflow";
    }

    if (workflowActionsPanel) {
      workflowActionsPanel.classList.remove("hide");
    }

    // Reset step badges
    document.querySelectorAll(".step-node").forEach(node => {
      node.classList.remove("active");
    });
    const draftNode = document.getElementById("stepNodeDraft");
    if (draftNode) draftNode.classList.add("active");

    renderItemsTable();
    updateCalculations();
    renderCharts();
    
    showStatusMessage("Expense generator form reset.", "success", 2000);
  }

  // --- Save & Submit Report to API ---
  function submitReport() {
    const empName = expEmployeeName.value.trim();
    const empEmail = expEmployeeEmail.value.trim();
    const dept = expDepartment.value;
    const projName = expProjectName.value.trim();
    const purpose = expTravelPurpose.value.trim();
    const period = expReportPeriod.value.trim();
    const limit = parseFloat(budgetLimitInput.value) || 0;

    if (!empName || !empEmail || !projName || !purpose || !period) {
      showStatusMessage("Please fill in employee information and report details.", "danger");
      expEmployeeName.reportValidity();
      return;
    }

    if (currentItems.length === 0) {
      showStatusMessage("Please log at least one expense line item before submitting.", "danger");
      return;
    }

    // Calculate totals
    let subtotal = 0;
    let gstTotal = 0;
    let grandTotal = 0;
    currentItems.forEach(item => {
      subtotal += item.amount;
      gstTotal += item.gst_amount;
      grandTotal += item.total;
    });

    const payload = {
      report_id: activeReportId,
      employee_name: empName,
      employee_email: empEmail,
      department: dept,
      project_name: projName,
      travel_purpose: purpose,
      report_period: period,
      budget_limit: limit,
      items: currentItems,
      subtotal: subtotal,
      gst_total: gstTotal,
      grand_total: grandTotal,
      status: "Submitted"
    };

    btnSaveExpense.disabled = true;
    btnSaveExpense.innerHTML = `<i data-lucide="loader" class="animate-spin"></i> Saving...`;
    if (typeof lucide !== "undefined") lucide.createIcons();

    fetch("https://softrate-tech-park.onrender.com/save-expense", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        report_id: activeReportId,
        employee: empName,
        department: dept,
        period: period,
        grand_total: grandTotal,
        status: "SUBMITTED",
        submission_date: new Date().toLocaleString(),
        workflow_action: "Pending Approval"
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log("Expense saved:", data);
      btnSaveExpense.disabled = false;
      btnSaveExpense.innerHTML = `<i data-lucide="save"></i> Save & Submit Report`;
      if (typeof lucide !== "undefined") lucide.createIcons();

      alert("Report saved to database successfully!");

      // Update workflow status badge
      if (workflowStatusBadge) {
        workflowStatusBadge.textContent = "SUBMITTED";
        workflowStatusBadge.className = "badge badge-workflow badge-submitted";
      }
      
      const draftNode = document.getElementById("stepNodeDraft");
      const subNode = document.getElementById("stepNodeSubmitted");
      const appNode = document.getElementById("stepNodeApproved");
      if (draftNode) draftNode.classList.add("active");
      if (subNode) subNode.classList.add("active");
      if (appNode) appNode.classList.remove("active");

      // Make Approve/Reject panel visible for the saved report
      if (workflowActionsPanel) {
        workflowActionsPanel.classList.remove("hide");
      }

      // Refresh database feed
      loadSavedReports();
    })
    .catch(err => {
      btnSaveExpense.disabled = false;
      btnSaveExpense.innerHTML = `<i data-lucide="save"></i> Save & Submit Report`;
      if (typeof lucide !== "undefined") lucide.createIcons();
      console.error("Expense save error:", err);
    });
  }

  // --- Approve / Reject Active Report ---
  function approveActiveReport() {
    if (!activeReportId) {
      showStatusMessage("No active report loaded to approve.", "danger");
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/expense-report/approve/${activeReportId}`, {
      method: "POST"
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === "success") {
        showStatusMessage(`Report ${activeReportId} updated to APPROVED.`, "success");
        if (workflowStatusBadge) {
          workflowStatusBadge.textContent = "APPROVED";
          workflowStatusBadge.className = "badge badge-workflow badge-approved";
        }
        const appNode = document.getElementById("stepNodeApproved");
        if (appNode) appNode.classList.add("active");
        
        // Keep the panel accessible after approval for review or correction.
        if (workflowActionsPanel) workflowActionsPanel.classList.remove("hide");
        
        loadSavedReports();
      } else {
        showStatusMessage(data.message || "Failed to approve report.", "danger");
      }
    })
    .catch(err => {
      console.error("Approval error:", err);
      showStatusMessage("Network error during approval request.", "danger");
    });
  }

  function rejectActiveReport() {
    if (!activeReportId) {
      showStatusMessage("No active report loaded to reject.", "danger");
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/expense-report/reject/${activeReportId}`, {
      method: "POST"
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === "success") {
        showStatusMessage(`Report ${activeReportId} updated to REJECTED.`, "success");
        if (workflowStatusBadge) {
          workflowStatusBadge.textContent = "REJECTED";
          workflowStatusBadge.className = "badge badge-workflow badge-rejected";
        }
        const appNode = document.getElementById("stepNodeApproved");
        if (appNode) appNode.classList.remove("active");
        
        // Keep the panel accessible after rejection for review or correction.
        if (workflowActionsPanel) workflowActionsPanel.classList.remove("hide");
        
        loadSavedReports();
      } else {
        showStatusMessage(data.message || "Failed to reject report.", "danger");
      }
    })
    .catch(err => {
      console.error("Rejection error:", err);
      showStatusMessage("Network error during rejection request.", "danger");
    });
  }

  // --- Load Saved Reports & Manage Approval Feeds ---
  function loadSavedReports() {
    if (!savedExpensesBody) return;

    fetch("https://softrate-tech-park.onrender.com/api/expense-reports")
      .then(res => res.json())
      .then(data => {
        console.log(data);
        window.savedExpensesList = data; // Cache for bar chart
        renderSavedReportsTable(data);
        renderCharts(); // Sync monthly chart totals
      })
      .catch(err => {
        console.error("Fetch reports error:", err);
        savedExpensesBody.innerHTML = `
          <tr>
            <td colspan="8" class="text-center text-danger py-4">
              Error fetching logs. Check server status.
            </td>
          </tr>
        `;
      });
  }

  function loadExpenseReports() {
    loadSavedReports();
  }

  function renderSavedReportsTable(reports) {
    if (reports.length === 0) {
      savedExpensesBody.innerHTML = `
        <tr>
          <td colspan="8" class="text-center py-6 text-gray-400">
            <p>No submitted expense reports logged in database.</p>
          </td>
        </tr>
      `;
      return;
    }

    let html = "";
    reports.forEach(rep => {
      const reportId = rep.report_id || rep._id || "EXP-UNKNOWN";
      const empName = rep.employee_name || rep.employee || "N/A";
      const dept = rep.department || "General";
      const period = rep.report_period || rep.period || "N/A";
      const grandTotal = rep.grand_total !== undefined ? rep.grand_total : (rep.amount !== undefined ? rep.amount : 0);
      const status = rep.status || "Submitted";
      
      const statusUpper = (status || "").toUpperCase();
      let statusClass = "badge-draft";
      if (statusUpper === "SUBMITTED") statusClass = "badge-submitted";
      else if (statusUpper === "APPROVED") statusClass = "badge-approved";
      else if (statusUpper === "REJECTED") statusClass = "badge-rejected";

      const formattedTotal = grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 });
      
      let dateString = "N/A";
      if (rep.timestamp || rep.submission_date) {
        const dateRaw = rep.timestamp || rep.submission_date;
        const d = new Date(dateRaw);
        if (!isNaN(d.getTime())) {
          dateString = d.toLocaleDateString("en-IN") + " " + d.toLocaleTimeString("en-IN", { hour: '2-digit', minute:'2-digit' });
        } else {
          dateString = dateRaw;
        }
      }

      let actions = "";
      if (statusUpper === "SUBMITTED") {
        actions = `
          <button type="button" class="btn btn-primary text-xs py-1 px-2 mr-1" onclick="approveReport('${reportId}')">Approve</button>
          <button type="button" class="btn btn-danger text-xs py-1 px-2" onclick="rejectReport('${reportId}')">Reject</button>
        `;
      } else {
        actions = `
          <span class="text-xs text-muted">Archived (${status})</span>
        `;
      }

      html += `
        <tr>
          <td><a href="#" class="report-link font-bold text-primary" onclick="window.viewReportDetails('${reportId}')">${reportId}</a></td>
          <td>${empName}</td>
          <td>${dept}</td>
          <td>${period}</td>
          <td><strong>₹${formattedTotal}</strong></td>
          <td><span class="badge ${statusClass}">${status}</span></td>
          <td>${dateString}</td>
          <td>${actions}</td>
        </tr>
      `;
    });

    savedExpensesBody.innerHTML = html;
  }

  async function approveReport(reportId) {
    const response = await fetch(
      `https://softrate-tech-park.onrender.com/expense-report/approve/${reportId}`,
      {
        method: "POST"
      }
    );

    const data = await response.json();
    alert(data.message);
    loadExpenseReports();
  }

  async function rejectReport(reportId) {
    const response = await fetch(
      `https://softrate-tech-park.onrender.com/expense-report/reject/${reportId}`,
      {
        method: "POST"
      }
    );

    const data = await response.json();
    alert(data.message);
    loadExpenseReports();
  }

  window.approveReport = approveReport;
  window.rejectReport = rejectReport;
  window.updateStatus = function(reportId, newStatus) {
    if ((newStatus || "").toUpperCase() === "APPROVED") {
      return approveReport(reportId);
    }
    return rejectReport(reportId);
  };

  // Inspect and load saved report detail items
  window.viewReportDetails = function(reportId) {
    if (!window.savedExpensesList) return;
    const rep = window.savedExpensesList.find(r => (r.report_id === reportId || r._id === reportId));
    if (!rep) return;

    // Load metadata
    expEmployeeName.value = rep.employee_name || rep.employee || "N/A";
    expEmployeeEmail.value = rep.employee_email || "N/A";
    expDepartment.value = rep.department || "General";
    expProjectName.value = rep.project_name || "N/A";
    expTravelPurpose.value = rep.travel_purpose || rep.description || "N/A";
    expReportPeriod.value = rep.report_period || rep.period || "N/A";
    budgetLimitInput.value = rep.budget_limit || 50000;
    activeReportId = rep.report_id || rep._id;
    if (expenseReportIdText) {
      expenseReportIdText.textContent = rep.report_id;
    }

    const statusUpper = (rep.status || "").toUpperCase();
    if (workflowStatusBadge) {
      let badgeClass = "badge badge-workflow";
      if (statusUpper === "SUBMITTED") badgeClass += " badge-submitted";
      else if (statusUpper === "APPROVED") badgeClass += " badge-approved";
      else if (statusUpper === "REJECTED") badgeClass += " badge-rejected";
      workflowStatusBadge.textContent = rep.status;
      workflowStatusBadge.className = badgeClass;
    }

    // Keep the action panel visible so approvers can act on the report.
    if (workflowActionsPanel) workflowActionsPanel.classList.remove("hide");

    // Sync workflow nodes
    document.querySelectorAll(".step-node").forEach(node => node.classList.remove("active"));
    const draftNode = document.getElementById("stepNodeDraft");
    const subNode = document.getElementById("stepNodeSubmitted");
    const appNode = document.getElementById("stepNodeApproved");

    if (draftNode) draftNode.classList.add("active");
    if (statusUpper === "SUBMITTED" || statusUpper === "APPROVED") {
      if (subNode) subNode.classList.add("active");
    }
    if (statusUpper === "APPROVED") {
      if (appNode) appNode.classList.add("active");
    }

    // Load items list
    currentItems = JSON.parse(JSON.stringify(rep.items || []));
    renderItemsTable();
    updateCalculations();
    renderCharts();

    // Scroll to form card
    const formSection = document.querySelector(".form-card");
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth" });
    }

    showStatusMessage(`Loaded items for report ${reportId}.`, "success", 2000);
  };

  // --- Export Excel (Fetches CSV from backend endpoint) ---
  function downloadExcelReport() {
    if (currentItems.length === 0) {
      showStatusMessage("No expense items exist. Please log items before exporting.", "danger");
      alert("Error: No expense items exist in the report!");
      return;
    }

    const empName = expEmployeeName.value.trim() || "N/A";
    const empEmail = expEmployeeEmail.value.trim() || "N/A";
    const dept = expDepartment.value || "N/A";
    const projName = expProjectName.value.trim() || "N/A";
    const purpose = expTravelPurpose.value.trim() || "N/A";
    const period = expReportPeriod.value.trim() || "N/A";
    const limit = parseFloat(budgetLimitInput.value) || 0;
    const currentStatus = workflowStatusBadge ? workflowStatusBadge.textContent : "Draft";

    try {
      const data = [
        ["SOFTRATE EXPENSE CLAIM REPORT"],
        [],
        ["Report ID", activeReportId],
        ["Employee Name", empName],
        ["Employee Email", empEmail],
        ["Department", dept],
        ["Project Name", projName],
        ["Travel Purpose", purpose],
        ["Report Period", period],
        ["Budget Limit", limit],
        ["Status", currentStatus],
        [],
        ["Date", "Category", "Description", "Merchant", "Payment Mode", "GST %", "Amount", "GST Amount", "Total"]
      ];

      let subtotal = 0;
      let gstTotal = 0;
      let grandTotal = 0;

      currentItems.forEach(item => {
        data.push([
          item.date,
          item.category,
          item.description,
          item.merchant,
          item.payment_mode,
          item.gst_percentage + "%",
          item.amount,
          item.gst_amount,
          item.total
        ]);
        subtotal += item.amount;
        gstTotal += item.gst_amount;
        grandTotal += item.total;
      });

      data.push([]);
      data.push(["", "", "", "", "", "", "Subtotal", "", subtotal]);
      data.push(["", "", "", "", "", "", "GST Total", "", gstTotal]);
      data.push(["", "", "", "", "", "", "Grand Total", "", grandTotal]);

      const ws = XLSX.utils.aoa_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Expense Report");

      XLSX.writeFile(wb, `Softrate_Expense_Report_${activeReportId}.xlsx`);
      showStatusMessage("Excel workbook exported successfully.", "success", 3000);
    } catch (err) {
      console.error("Excel generation failed:", err);
      showStatusMessage(`Excel compilation failed: ${err.message}`, "danger");
    }
  }

  // --- Export PDF (Fetches PDF binary from backend endpoint) ---
  function downloadPdfReport() {
    if (currentItems.length === 0) {
      showStatusMessage("No expense items exist. Please log items before exporting.", "danger");
      alert("Error: No expense items exist in the report!");
      return;
    }

    const empName = expEmployeeName.value.trim() || "N/A";
    const empEmail = expEmployeeEmail.value.trim() || "N/A";
    const dept = expDepartment.value || "N/A";
    const projName = expProjectName.value.trim() || "N/A";
    const purpose = expTravelPurpose.value.trim() || "N/A";
    const period = expReportPeriod.value.trim() || "N/A";
    const limit = parseFloat(budgetLimitInput.value) || 0;
    const currentStatus = workflowStatusBadge ? workflowStatusBadge.textContent : "Draft";

    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "letter"
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(15, 76, 129); // Primary Blue #0F4C81
      doc.text("SOFTRATE EXPENSE CLAIM REPORT", pageWidth / 2, 45, { align: "center" });

      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(1);
      doc.line(36, 60, pageWidth - 36, 60);

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(100, 100, 100);
      
      const leftColX = 36;
      const midColX = pageWidth / 2 + 10;
      
      doc.text("Report ID:", leftColX, 80);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 51, 51);
      doc.text(activeReportId || "N/A", leftColX + 90, 80);

      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "bold");
      doc.text("Employee Name:", leftColX, 98);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 51, 51);
      doc.text(empName, leftColX + 90, 98);

      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "bold");
      doc.text("Employee Email:", leftColX, 116);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 51, 51);
      doc.text(empEmail, leftColX + 90, 116);

      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "bold");
      doc.text("Department:", leftColX, 134);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 51, 51);
      doc.text(dept, leftColX + 90, 134);

      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "bold");
      doc.text("Report Period:", leftColX, 152);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 51, 51);
      doc.text(period, leftColX + 90, 152);

      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "bold");
      doc.text("Status:", midColX, 80);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(currentStatus.toUpperCase() === "APPROVED" ? 0 : (currentStatus.toUpperCase() === "REJECTED" ? 220 : 15), currentStatus.toUpperCase() === "APPROVED" ? 128 : 76, currentStatus.toUpperCase() === "APPROVED" ? 0 : 129);
      doc.text(currentStatus.toUpperCase(), midColX + 80, 80);

      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "bold");
      doc.text("Project Name:", midColX, 98);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 51, 51);
      doc.text(projName, midColX + 80, 98);

      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "bold");
      doc.text("Travel Purpose:", midColX, 116);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 51, 51);
      doc.text(purpose, midColX + 80, 116);

      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "bold");
      doc.text("Budget Limit:", midColX, 134);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 51, 51);
      doc.text(`INR ${limit.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`, midColX + 80, 134);

      let subtotal = 0;
      let gstTotal = 0;
      let grandTotal = 0;
      currentItems.forEach(item => {
        subtotal += item.amount;
        gstTotal += item.gst_amount;
        grandTotal += item.total;
      });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(0, 128, 128); // Teal
      doc.text("Expense Line Items", 36, 185);

      doc.autoTable({
        startY: 195,
        margin: { left: 36, right: 36 },
        head: [['Date', 'Category', 'Description', 'Merchant', 'Payment Mode', 'GST %', 'Amount', 'GST Amount', 'Total']],
        body: currentItems.map(item => [
          item.date,
          item.category,
          item.description,
          item.merchant,
          item.payment_mode,
          item.gst_percentage + '%',
          `INR ${item.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
          `INR ${item.gst_amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
          `INR ${item.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
        ]),
        styles: {
          fontSize: 9,
          font: "helvetica",
          cellPadding: 6
        },
        headStyles: {
          fillColor: [15, 76, 129], // #0F4C81
          textColor: 255,
          fontStyle: "bold"
        },
        columnStyles: {
          2: { cellWidth: 100 }
        },
        theme: "grid"
      });

      let finalY = doc.lastAutoTable.finalY + 15;
      
      if (finalY + 80 > pageHeight) {
        doc.addPage();
        finalY = 40;
      }

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(51, 51, 51);
      
      const rightAlignX = pageWidth - 36;
      doc.text(`Subtotal:`, rightAlignX - 160, finalY);
      doc.text(`INR ${subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`, rightAlignX, finalY, { align: "right" });
      
      doc.text(`Total GST Portion:`, rightAlignX - 160, finalY + 18);
      doc.text(`INR ${gstTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`, rightAlignX, finalY + 18, { align: "right" });

      doc.setDrawColor(200, 200, 200);
      doc.line(rightAlignX - 180, finalY + 28, rightAlignX, finalY + 28);
      
      doc.setFont("helvetica", "bold");
      doc.text(`Grand Total Claim:`, rightAlignX - 160, finalY + 42);
      doc.text(`INR ${grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`, rightAlignX, finalY + 42, { align: "right" });

      doc.save(`Softrate_Expense_Report_${activeReportId}.pdf`);
      showStatusMessage("PDF report exported successfully.", "success", 3000);
    } catch (err) {
      console.error("PDF generation failed:", err);
      showStatusMessage(`PDF compilation failed: ${err.message}`, "danger");
    }
  }

  // --- Print/PDF Layout Trigger ---
  function triggerPrint() {
    if (currentItems.length === 0) {
      showStatusMessage("Cannot print an empty report.", "danger");
      return;
    }
    window.print();
  }

  // --- Status Banner Helper ---
  let statusTimeout = null;
  function showStatusMessage(message, type, duration = 5000) {
    if (!expenseSubmitStatus) return;
    
    clearTimeout(statusTimeout);
    expenseSubmitStatus.className = `alert-box ${type}`;
    expenseSubmitStatus.innerHTML = message;
    expenseSubmitStatus.classList.remove("hide");

    if (duration > 0) {
      statusTimeout = setTimeout(() => {
        expenseSubmitStatus.classList.add("hide");
      }, duration);
    }
  }

  // Run initial setups
  init();
});
