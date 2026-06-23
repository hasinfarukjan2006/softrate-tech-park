/**
 * Softrate Tech Park Pvt. Ltd.
 * Free Payslip Generator Controller
 */

"use strict";

// Number to Words Converter in Indian Rupee format
function numberToWords(num) {
  if (num === 0) return "Zero Rupees Only";
  
  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", 
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
  ];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  function numToWordsUnderThousand(n) {
    let str = "";
    if (n >= 100) {
      str += a[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
    }
    if (n >= 20) {
      str += b[Math.floor(n / 10)] + " ";
      n %= 10;
    }
    if (n > 0) {
      str += a[n] + " ";
    }
    return str.trim();
  }

  let word = "";
  let crore = Math.floor(num / 10000000);
  num %= 10000000;
  let lakh = Math.floor(num / 100000);
  num %= 100000;
  let thousand = Math.floor(num / 1000);
  num %= 1000;
  let remaining = num;

  if (crore > 0) {
    word += numToWordsUnderThousand(crore) + " Crore ";
  }
  if (lakh > 0) {
    word += numToWordsUnderThousand(lakh) + " Lakh ";
  }
  if (thousand > 0) {
    word += numToWordsUnderThousand(thousand) + " Thousand ";
  }
  if (remaining > 0) {
    word += numToWordsUnderThousand(remaining) + " ";
  }

  return word.trim() + " Rupees Only";
}

// Global Payslip Controller Namespace
var PayslipController = {
  // Perform automatic calculations based on form inputs
  calculateSalary: function() {
    const basic = parseFloat(document.getElementById("basic_salary").value) || 0;
    const hra = parseFloat(document.getElementById("hra_allowance").value) || 0;
    const conveyance = parseFloat(document.getElementById("conveyance_allowance").value) || 0;
    const medical = parseFloat(document.getElementById("medical_allowance").value) || 0;
    const otherAllow = parseFloat(document.getElementById("other_allowance").value) || 0;

    const pf = parseFloat(document.getElementById("pf_deduction").value) || 0;
    const profTax = parseFloat(document.getElementById("prof_tax_deduction").value) || 0;
    const tds = parseFloat(document.getElementById("tds_deduction").value) || 0;
    const otherDeduct = parseFloat(document.getElementById("other_deduction").value) || 0;

    // Gross Salary = Basic + All Allowances
    const grossSalary = basic + hra + conveyance + medical + otherAllow;
    
    // Total Deductions = PF + Prof Tax + TDS + Other Deductions
    const totalDeductions = pf + profTax + tds + otherDeduct;

    // Net Salary = Gross Salary - Total Deductions
    const netSalary = Math.max(0, grossSalary - totalDeductions);

    // Format & Update Form UI
    document.getElementById("form_gross_salary").textContent = grossSalary.toFixed(2);
    document.getElementById("form_total_deductions").textContent = totalDeductions.toFixed(2);
    
    const formNetPay = document.getElementById("form_net_salary");
    formNetPay.textContent = netSalary.toFixed(2);

    const netWords = numberToWords(Math.round(netSalary));
    document.getElementById("form_net_in_words").textContent = "Amount in words: " + netWords;
  },

  // Reset all form inputs to default values
  resetForm: function() {
    const inputs = document.querySelectorAll("#payslip-form-container input");
    inputs.forEach(input => {
      // Don't reset company details to empty since they are company wide defaults
      if (input.id && input.id.startsWith("company_")) return;
      
      if (input.id === "employee_lop_days") {
        input.value = "0";
      } else if (input.id === "employee_pay_date") {
        input.value = "Jun 01 2026";
      } else if (input.id === "pay_period" || input.id === "employee_pay_period") {
        input.value = "June 2026";
      } else {
        input.value = "";
      }
      input.classList.remove("error");
    });

    // Reset logo uploader UI
    const placeholder = document.getElementById("logo-upload-box");
    if (placeholder) {
      placeholder.innerHTML = `
        <div class="upload-icon-zoho">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 16V8M12 8L9 11M12 8L15 11" stroke="#508eff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M3 15C3 17.8284 3 19.2426 3.87868 20.1213C4.75736 21 6.17157 21 9 21H15C17.8284 21 19.2426 21 20.1213 20.1213C21 19.2426 21 17.8284 21 15" stroke="#508eff" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="upload-label-text">Upload</div>
      `;
    }
    const logoInput = document.getElementById("logo_file_input");
    if (logoInput) logoInput.value = "";
    
    const previewImg = document.getElementById("preview_logo_img");
    const previewContainer = document.getElementById("preview_logo_container");
    if (previewImg && previewContainer) {
      previewImg.src = "";
      previewContainer.style.display = "none";
    }

    // Hide error messages
    const errors = document.querySelectorAll(".text-danger");
    errors.forEach(err => err.classList.add("hide"));

    this.calculateSalary();
  },

  // Handle company logo file selection and display
  handleLogoUpload: function(input) {
    const file = input.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert("Logo file size must be less than 1MB.");
        input.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onload = function(e) {
        // Update uploader placeholder to show logo
        const placeholder = document.getElementById("logo-upload-box");
        if (placeholder) {
          placeholder.innerHTML = `<img src="${e.target.result}" style="width:100%; height:100%; object-fit:contain; border-radius:6px;">`;
        }
        
        // Update preview logo
        const previewImg = document.getElementById("preview_logo_img");
        const previewContainer = document.getElementById("preview_logo_container");
        if (previewImg && previewContainer) {
          previewImg.src = e.target.result;
          previewContainer.style.display = "block";
        }
      };
      reader.readAsDataURL(file);
    }
  },

  // Validate form before generation
  validateForm: function() {
    let isValid = true;

    const fields = [
      { id: "employee_name", errId: "employee_name_err" },
      { id: "employee_id", errId: "employee_id_err" },
      { id: "employee_dept", errId: "employee_dept_err" },
      { id: "employee_designation", errId: "employee_designation_err" },
      { id: "pay_period", errId: "pay_period_err" },
      { id: "employee_paid_days", errId: "employee_paid_days_err" },
      { id: "employee_lop_days", errId: "employee_lop_days_err" },
      { id: "employee_pay_date", errId: "employee_pay_date_err" }
    ];

    fields.forEach(field => {
      const inputEl = document.getElementById(field.id);
      const errEl = document.getElementById(field.errId);
      if (!inputEl) return;
      
      let isFieldValid = true;
      if (inputEl.type === "number") {
        const val = parseFloat(inputEl.value);
        if (isNaN(val) || val < 0 || (inputEl.max && val > parseFloat(inputEl.max))) {
          isFieldValid = false;
        }
      } else {
        if (inputEl.value.trim().length === 0) {
          isFieldValid = false;
        }
      }

      if (!isFieldValid) {
        inputEl.classList.add("error");
        if (errEl) errEl.classList.remove("hide");
        isValid = false;
      } else {
        inputEl.classList.remove("error");
        if (errEl) errEl.classList.add("hide");
      }
    });

    const basicSalary = parseFloat(document.getElementById("basic_salary").value) || 0;
    const basicErr = document.getElementById("basic_salary_err");
    if (basicSalary <= 0) {
      document.getElementById("basic_salary").classList.add("error");
      if (basicErr) basicErr.classList.remove("hide");
      isValid = false;
    } else {
      document.getElementById("basic_salary").classList.remove("error");
      if (basicErr) basicErr.classList.add("hide");
    }

    return isValid;
  },

  // Generate Payslip and display Preview
  generatePayslip: function() {
    if (!this.validateForm()) {
      alert("Please fill in all required fields.");
      return;
    }

    // Populate Company details in Preview
    const compName = document.getElementById("company_name_input").value;
    const compAddress = document.getElementById("company_address_input").value;
    const compCity = document.getElementById("company_city_input").value;
    const compCountry = document.getElementById("company_country_input").value;

    document.getElementById("preview_comp_name").textContent = compName || "Softrate Tech Park Pvt. Ltd.";
    document.getElementById("preview_comp_address").textContent = compAddress || "Block A, Tech City, Sector 5";
    document.getElementById("preview_comp_city").textContent = compCity || "Kolkata, West Bengal - 700091";
    document.getElementById("preview_comp_country").textContent = compCountry || "India";

    // Populate Employee details in Preview
    document.getElementById("preview_emp_name").textContent = document.getElementById("employee_name").value;
    document.getElementById("preview_emp_id").textContent = document.getElementById("employee_id").value;
    document.getElementById("preview_emp_dept").textContent = document.getElementById("employee_dept").value;
    document.getElementById("preview_emp_designation").textContent = document.getElementById("employee_designation").value;
    
    const payPeriod = document.getElementById("pay_period").value;
    document.getElementById("preview_pay_period").textContent = payPeriod;
    document.getElementById("preview_title_period").textContent = "For " + payPeriod;

    // Additional summary fields in preview
    document.getElementById("preview_paid_days").textContent = document.getElementById("employee_paid_days").value || "0";
    document.getElementById("preview_lop_days").textContent = document.getElementById("employee_lop_days").value || "0";
    document.getElementById("preview_pay_date").textContent = document.getElementById("employee_pay_date").value || "-";

    // Fetch values
    const basic = parseFloat(document.getElementById("basic_salary").value) || 0;
    const hra = parseFloat(document.getElementById("hra_allowance").value) || 0;
    const conveyance = parseFloat(document.getElementById("conveyance_allowance").value) || 0;
    const medical = parseFloat(document.getElementById("medical_allowance").value) || 0;
    const otherAllow = parseFloat(document.getElementById("other_allowance").value) || 0;

    const pf = parseFloat(document.getElementById("pf_deduction").value) || 0;
    const profTax = parseFloat(document.getElementById("prof_tax_deduction").value) || 0;
    const tds = parseFloat(document.getElementById("tds_deduction").value) || 0;
    const otherDeduct = parseFloat(document.getElementById("other_deduction").value) || 0;

    const grossSalary = basic + hra + conveyance + medical + otherAllow;
    const totalDeductions = pf + profTax + tds + otherDeduct;
    const netSalary = Math.max(0, grossSalary - totalDeductions);

    // Populate Earnings Preview
    document.getElementById("preview_basic_salary").textContent = basic.toFixed(2);
    document.getElementById("preview_hra").textContent = hra.toFixed(2);
    document.getElementById("preview_conveyance").textContent = conveyance.toFixed(2);
    document.getElementById("preview_medical").textContent = medical.toFixed(2);
    document.getElementById("preview_other_allowances").textContent = otherAllow.toFixed(2);
    document.getElementById("preview_gross_salary").textContent = grossSalary.toFixed(2);

    // Populate Deductions Preview
    document.getElementById("preview_pf").textContent = pf.toFixed(2);
    document.getElementById("preview_prof_tax").textContent = profTax.toFixed(2);
    document.getElementById("preview_tds").textContent = tds.toFixed(2);
    document.getElementById("preview_other_deductions").textContent = otherDeduct.toFixed(2);
    document.getElementById("preview_total_deductions").textContent = totalDeductions.toFixed(2);

    // Populate Net Summary
    document.getElementById("preview_net_salary").textContent = netSalary.toFixed(2);
    document.getElementById("preview_net_pay_large").textContent = "₹" + netSalary.toLocaleString('en-IN', {minimumFractionDigits: 2});
    
    const netWords = numberToWords(Math.round(netSalary));
    document.getElementById("preview_net_words").textContent = netWords;

    // Toggle container views
    document.getElementById("payslip-form-container").classList.add("hide");
    document.getElementById("payslip-preview-container").classList.remove("hide");
    
    // Scroll to top of preview section
    document.getElementById("payslip-preview-container").scrollIntoView({ behavior: "smooth" });
  },

  // Return to Form from Preview
  editPayslip: function() {
    document.getElementById("payslip-preview-container").classList.add("hide");
    document.getElementById("payslip-form-container").classList.remove("hide");
    document.getElementById("payslip-form-container").scrollIntoView({ behavior: "smooth" });
  },

  // Native Browser Print Dialog
  printPayslip: function() {
    window.print();
  },

  // Export payslip to PDF using html2canvas & jsPDF
  downloadPDF: function() {
    const docSheet = document.getElementById("payslip-preview-paper");
    if (!docSheet) return;

    const empName = document.getElementById("employee_name").value.trim().replace(/\s+/g, '_');
    const payPeriod = document.getElementById("pay_period").value.trim().replace(/\s+/g, '_');

    // Dynamic library loader helper for html2canvas
    const loadHtml2Canvas = function(callback) {
      if (window.html2canvas) {
        callback();
        return;
      }
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
      script.onload = callback;
      script.onerror = function() {
        alert("Failed to load PDF generation engine. Falling back to print option.");
        window.print();
      };
      document.head.appendChild(script);
    };

    loadHtml2Canvas(function() {
      // Capture canvas
      window.html2canvas(docSheet, {
        scale: 2, // high resolution
        useCORS: true,
        backgroundColor: "#ffffff"
      }).then(function(canvas) {
        const { jsPDF } = window.jspdf;
        if (!jsPDF) {
          alert("PDF generator not found. Triggering page print instead.");
          window.print();
          return;
        }

        const imgData = canvas.toDataURL("image/jpeg", 0.95);
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "in",
          format: "a4"
        });

        // A4 Dimensions: 8.27 in x 11.69 in
        const pdfWidth = 8.27;
        const pdfHeight = 11.69;
        
        // Calculate image aspect ratio fitting
        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;
        
        let finalHeight = imgHeight;
        let finalWidth = imgWidth;

        if (imgHeight > pdfHeight) {
          finalHeight = pdfHeight;
          finalWidth = (canvas.width * pdfHeight) / canvas.height;
        }

        const xOffset = (pdfWidth - finalWidth) / 2;
        const yOffset = (pdfHeight - finalHeight) / 2;

        pdf.addImage(imgData, "JPEG", xOffset, yOffset, finalWidth, finalHeight);
        pdf.save(`Payslip_${empName}_${payPeriod}.pdf`);
      }).catch(function(err) {
        console.error("PDF Creation error:", err);
        alert("An error occurred during PDF generation. Triggering standard page print instead.");
        window.print();
      });
    });
  },

  // Accordion toggle helper
  toggleFaq: function(item) {
    const isActive = item.classList.contains("active");
    
    // Deactivate all FAQ items
    const allItems = document.querySelectorAll(".faq-item");
    allItems.forEach(i => {
      i.classList.remove("active");
      const panel = i.querySelector(".faq-answer-panel");
      if (panel) panel.style.maxHeight = null;
    });

    if (!isActive) {
      item.classList.add("active");
      const panel = item.querySelector(".faq-answer-panel");
      if (panel) {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    }
  },

  // Toggle educational tabs (Earnings vs Deductions)
  switchComponentTab: function(tabName) {
    // Update active tab button style
    document.querySelectorAll(".tab-btn-payslip").forEach(btn => btn.classList.remove("active"));
    const activeBtn = document.querySelector(`.tab-btn-payslip[onclick*="${tabName}"]`);
    if (activeBtn) activeBtn.classList.add("active");

    // Show appropriate details list
    const earningsList = document.getElementById("tab-earnings-list");
    const deductionsList = document.getElementById("tab-deductions-list");

    if (tabName === 'earnings') {
      deductionsList.classList.add("hide");
      earningsList.classList.remove("hide");
    } else {
      earningsList.classList.add("hide");
      deductionsList.classList.remove("hide");
    }
  }
};

// Event registration
document.addEventListener("DOMContentLoaded", () => {
  // Custom event listener for when the payslip generator route is loaded/shown
  document.addEventListener("payslipRouteLoaded", () => {
    // Perform initial calculations
    PayslipController.calculateSalary();
  });

  // Calculate salary details as user types
  const numericInputs = document.querySelectorAll("#payslip-form-container input[type='number']");
  numericInputs.forEach(input => {
    input.addEventListener("input", () => {
      PayslipController.calculateSalary();
    });
  });

  // Sync Pay Period inputs
  const payPeriodTop = document.getElementById("pay_period");
  const payPeriodGrid = document.getElementById("employee_pay_period");
  if (payPeriodTop && payPeriodGrid) {
    payPeriodTop.addEventListener("input", () => {
      payPeriodGrid.value = payPeriodTop.value;
    });
    payPeriodGrid.addEventListener("input", () => {
      payPeriodTop.value = payPeriodGrid.value;
    });
  }
});
