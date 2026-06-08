document.addEventListener("DOMContentLoaded", () => {
  // Listen for the custom route load event to make sure we set up or initialize correctly
  document.addEventListener("expenseRouteLoaded", () => {
    // If there are no rows, add a default row for a better initial UX
    const tbody = document.getElementById("expenseDocTableBody");
    if (tbody && tbody.children.length === 0) {
      addExpenseRow();
    }
  });

  // DOM Elements
  const btnAddExpenseRow = document.getElementById("btnAddExpenseRow");
  const expenseDocTableBody = document.getElementById("expenseDocTableBody");
  const grandTotalText = document.getElementById("grandTotalText");
  const btnSaveExpenseReport = document.getElementById("btnSaveExpenseReport");
  const btnExportExpenseReportPdf = document.getElementById("btnExportExpenseReportPdf");
  const btnPrintExpenseReport = document.getElementById("btnPrintExpenseReport");

  // Default Submitted Date to today
  const submittedDateInput = document.getElementById("submittedDate");
  if (submittedDateInput && !submittedDateInput.value) {
    const today = new Date().toISOString().split("T")[0];
    submittedDateInput.value = today;
  }

  // Row Index counter for unique element ids if needed
  let rowIndex = 0;

  // Add a new row to the table
  function addExpenseRow(dateVal = "", descVal = "", merchantVal = "", catVal = "Travel", amtVal = "") {
    if (!expenseDocTableBody) return;

    const row = document.createElement("tr");
    row.id = `expense-row-${rowIndex++}`;

    row.innerHTML = `
      <td>
        <input type="date" class="row-date" value="${dateVal}" required>
      </td>
      <td>
        <input type="text" class="row-desc" value="${descVal}" placeholder="e.g. Flight to Mumbai" required>
      </td>
      <td>
        <input type="text" class="row-merchant" value="${merchantVal}" placeholder="e.g. Air India" required>
      </td>
      <td>
        <select class="row-category">
          <option value="Travel" ${catVal === "Travel" ? "selected" : ""}>Travel</option>
          <option value="Meals" ${catVal === "Meals" ? "selected" : ""}>Meals</option>
          <option value="Lodging" ${catVal === "Lodging" ? "selected" : ""}>Lodging</option>
          <option value="Office Supplies" ${catVal === "Office Supplies" ? "selected" : ""}>Office Supplies</option>
          <option value="Software" ${catVal === "Software" ? "selected" : ""}>Software</option>
          <option value="Subscriptions" ${catVal === "Subscriptions" ? "selected" : ""}>Subscriptions</option>
          <option value="Utilities" ${catVal === "Utilities" ? "selected" : ""}>Utilities</option>
          <option value="Other" ${catVal === "Other" ? "selected" : ""}>Other</option>
        </select>
      </td>
      <td>
        <input type="number" class="row-amount" value="${amtVal}" placeholder="0.00" min="0" step="any" required>
      </td>
      <td>
        <button type="button" class="btn-delete-row-doc" title="Remove line item">
          <i data-lucide="trash-2" style="width:16px;height:16px;"></i>
        </button>
      </td>
    `;

    expenseDocTableBody.appendChild(row);
    lucide.createIcons();

    // Attach event listeners for real-time recalculation when editing values
    const amtInput = row.querySelector(".row-amount");
    amtInput.addEventListener("input", calculateGrandTotal);

    // Attach delete handler
    const deleteBtn = row.querySelector(".btn-delete-row-doc");
    deleteBtn.addEventListener("click", () => {
      row.remove();
      calculateGrandTotal();
      // Ensure at least one empty row remains
      if (expenseDocTableBody.children.length === 0) {
        addExpenseRow();
      }
    });

    calculateGrandTotal();
  }

  // Calculate grand total of all rows
  function calculateGrandTotal() {
    if (!expenseDocTableBody || !grandTotalText) return;

    let total = 0;
    const amountInputs = expenseDocTableBody.querySelectorAll(".row-amount");
    amountInputs.forEach(input => {
      const val = parseFloat(input.value);
      if (!isNaN(val) && val > 0) {
        total += val;
      }
    });

    grandTotalText.textContent = `₹${total.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    return total;
  }

  // Gather form data for submission
  function gatherReportData() {
    const companyName = document.getElementById("companyName").value.trim();
    const companyAddress = document.getElementById("companyAddress").value.trim();
    const reportTitle = document.getElementById("reportTitle").textContent.trim();
    const businessPurpose = document.getElementById("businessPurpose").value.trim();
    const submittedBy = document.getElementById("submittedBy").value.trim();
    const submittedDate = document.getElementById("submittedDate").value;
    const reportTo = document.getElementById("reportTo").value.trim();
    const reportingPeriod = document.getElementById("reportingPeriod").value.trim();

    // Validate main metadata
    if (!submittedBy) {
      alert("Please fill in the 'Submitted By' field.");
      document.getElementById("submittedBy").focus();
      return null;
    }

    const expenses = [];
    let isValid = true;

    const rows = expenseDocTableBody.querySelectorAll("tr");
    rows.forEach((row, idx) => {
      const date = row.querySelector(".row-date").value;
      const description = row.querySelector(".row-desc").value.trim();
      const merchant = row.querySelector(".row-merchant").value.trim();
      const category = row.querySelector(".row-category").value;
      const amountVal = row.querySelector(".row-amount").value.trim();

      // Skip row if completely empty, but if partially filled validate it
      if (!date && !description && !merchant && !amountVal) {
        return; 
      }

      const amount = parseFloat(amountVal);
      if (!date || !description || !merchant || isNaN(amount) || amount <= 0) {
        alert(`Please fill all fields with valid values on row ${idx + 1}.`);
        isValid = false;
        return;
      }

      expenses.push({
        date: date,
        description: description,
        merchant: merchant,
        category: category,
        amount: amount
      });
    });

    if (!isValid) return null;

    if (expenses.length === 0) {
      alert("Please add at least one valid expense line item.");
      return null;
    }

    const totalAmount = expenses.reduce((sum, item) => sum + item.amount, 0);

    return {
      company_name: companyName,
      company_address: companyAddress,
      report_title: reportTitle,
      business_purpose: businessPurpose,
      submitted_by: submittedBy,
      submitted_date: submittedDate,
      report_to: reportTo,
      reporting_period: reportingPeriod,
      expenses: expenses,
      total_amount: totalAmount,
      created_at: new Date().toISOString()
    };
  }

  // Save Expense Report to MongoDB Atlas
  if (btnSaveExpenseReport) {
    btnSaveExpenseReport.addEventListener("click", () => {
      const expenseData = gatherReportData();
      if (!expenseData) return;

      // Disable button
      btnSaveExpenseReport.disabled = true;
      btnSaveExpenseReport.innerHTML = '<i data-lucide="loader" class="animate-spin"></i> Saving...';
      lucide.createIcons();

      fetch("https://softrate-tech-park.onrender.com/save-expense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(expenseData)
      })
      .then(res => res.json())
      .then(resData => {
        btnSaveExpenseReport.disabled = false;
        btnSaveExpenseReport.innerHTML = '<i data-lucide="save"></i> Save Report';
        lucide.createIcons();

        if (resData.success) {
          alert("Expense report saved successfully");
        } else {
          alert("Failed to save report: " + resData.message);
        }
      })
      .catch(err => {
        console.error("Save error:", err);
        btnSaveExpenseReport.disabled = false;
        btnSaveExpenseReport.innerHTML = '<i data-lucide="save"></i> Save Report';
        lucide.createIcons();
        alert("A connection error occurred. Could not save report.");
      });
    });
  }

  // Export Report as PDF
  if (btnExportExpenseReportPdf) {
    btnExportExpenseReportPdf.addEventListener("click", () => {
      const payload = gatherReportData();
      if (!payload) return;

      try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
          orientation: "portrait",
          unit: "pt",
          format: "letter"
        });

        // Styles & Colors
        const primaryColor = "#0f4c81";
        const secondaryColor = "#00a8a8";
        const darkTextColor = "#1e293b";
        const lightTextColor = "#64748b";

        // Margins and positions
        let yPos = 50;
        const leftMargin = 40;
        const rightMargin = 572;

        // Title Header
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(22);
        doc.setTextColor(primaryColor);
        doc.text(payload.report_title.toUpperCase(), leftMargin, yPos);

        // Logo Header on Right
        doc.setFontSize(16);
        doc.setFont("Helvetica", "bold");
        
        const techStr = "TECH";
        const softrateStr = "SOFTRATE ";
        const techWidth = doc.getTextWidth(techStr);
        
        // Draw "SOFTRATE "
        doc.setTextColor(primaryColor);
        doc.text(softrateStr, rightMargin - techWidth, yPos, { align: "right" });
        
        // Draw "TECH"
        doc.setTextColor(secondaryColor);
        doc.text(techStr, rightMargin, yPos, { align: "right" });
        
        yPos += 15;
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(lightTextColor);
        doc.text("SOFTRATE TECH PARK PVT. LTD.", rightMargin, yPos, { align: "right" });

        yPos += 15;
        doc.setDrawColor(primaryColor);
        doc.setLineWidth(1.5);
        doc.line(leftMargin, yPos, rightMargin, yPos);

        // Metadata Fields
        yPos += 25;
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(primaryColor);
        doc.text("COMPANY DETAILS", leftMargin, yPos);
        doc.text("REPORT INFO", leftMargin + 260, yPos);

        yPos += 15;
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(darkTextColor);
        doc.text("Name:", leftMargin, yPos);
        doc.text("Submitted By:", leftMargin + 260, yPos);
        
        doc.setFont("Helvetica", "normal");
        doc.text(payload.company_name, leftMargin + 65, yPos);
        doc.text(payload.submitted_by, leftMargin + 350, yPos);

        yPos += 15;
        doc.setFont("Helvetica", "bold");
        doc.text("Address:", leftMargin, yPos);
        doc.text("Submitted Date:", leftMargin + 260, yPos);
        
        doc.setFont("Helvetica", "normal");
        const splitAddress = doc.splitTextToSize(payload.company_address, 180);
        doc.text(splitAddress, leftMargin + 65, yPos);
        doc.text(payload.submitted_date, leftMargin + 350, yPos);

        let addressHeight = splitAddress.length * 11;
        
        doc.setFont("Helvetica", "bold");
        doc.text("Purpose:", leftMargin + 260, yPos + 15);
        doc.setFont("Helvetica", "normal");
        doc.text(payload.business_purpose || "N/A", leftMargin + 350, yPos + 15);

        doc.setFont("Helvetica", "bold");
        doc.text("Report To:", leftMargin + 260, yPos + 30);
        doc.setFont("Helvetica", "normal");
        doc.text(payload.report_to || "N/A", leftMargin + 350, yPos + 30);

        doc.setFont("Helvetica", "bold");
        doc.text("Period:", leftMargin + 260, yPos + 45);
        doc.setFont("Helvetica", "normal");
        doc.text(payload.reporting_period || "N/A", leftMargin + 350, yPos + 45);

        yPos += Math.max(addressHeight + 15, 60);

        // Expense Table Section
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(primaryColor);
        doc.text("EXPENSE LINE ITEMS", leftMargin, yPos);
        yPos += 10;

        // AutoTable Generation
        const tableBody = payload.expenses.map(item => [
          item.date,
          item.description,
          item.merchant,
          item.category,
          `INR ${parseFloat(item.amount).toFixed(2)}`
        ]);

        doc.autoTable({
          startY: yPos,
          head: [["Date", "Description", "Merchant", "Category", "Amount"]],
          body: tableBody,
          theme: "striped",
          headStyles: {
            fillColor: primaryColor,
            textColor: "#ffffff",
            fontStyle: "bold",
            fontSize: 9
          },
          bodyStyles: {
            fontSize: 9,
            textColor: darkTextColor
          },
          alternateRowStyles: {
            fillColor: "#f8fafc"
          },
          columnStyles: {
            0: { cellWidth: 70 },
            1: { cellWidth: 200 },
            2: { cellWidth: 100 },
            3: { cellWidth: 80 },
            4: { cellWidth: 80, halign: "right" }
          },
          margin: { left: leftMargin, right: rightMargin },
          didDrawPage: (data) => {
            yPos = data.cursor.y;
          }
        });

        // Grand Total Summary
        yPos += 20;
        doc.setDrawColor("#e2e8f0");
        doc.setLineWidth(1);
        doc.line(leftMargin + 300, yPos, rightMargin, yPos);

        yPos += 15;
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(darkTextColor);
        doc.text("GRAND TOTAL:", leftMargin + 320, yPos);
        doc.setTextColor(primaryColor);
        doc.text(`INR ${parseFloat(payload.total_amount).toFixed(2)}`, rightMargin, yPos, { align: "right" });

        // Save PDF
        doc.save(`${payload.report_title.replace(/\s+/g, "_")}_${payload.submitted_date}.pdf`);

      } catch (err) {
        console.error("PDF generation failed:", err);
        alert("Failed to export PDF. Please check that all inputs are filled correctly.");
      }
    });
  }

  // Print Report Handler
  if (btnPrintExpenseReport) {
    btnPrintExpenseReport.addEventListener("click", () => {
      window.print();
    });
  }

  // Add event listener for adding new row
  if (btnAddExpenseRow) {
    btnAddExpenseRow.addEventListener("click", () => {
      addExpenseRow();
    });
  }

  // Initial row addition
  addExpenseRow();
});
