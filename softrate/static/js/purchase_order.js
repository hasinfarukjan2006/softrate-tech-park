/**
 * Softrate Tech Park Pvt. Ltd.
 * Free Purchase Order Generator Controller
 */

"use strict";

var CreatePOUtil = function() {};
CreatePOUtil.TOTAL_LINE_ITEMS = 3;

// Initialize line item listeners and calculation bindings
document.addEventListener("DOMContentLoaded", function() {
  // Bind focus and blur events on the form for checklist interaction
  const poForm = document.forms["poGenerator"];
  if (!poForm) return;

  // Set up listeners for the default rows
  CreatePOUtil.rebindAllListeners();
  
  // Calculate initial totals
  CreatePOUtil.calculatePOTaxAndTotal();

  // Listen for changes in tax label to update totals
  const taxLabel = document.getElementById("taxLabel");
  if (taxLabel) {
    taxLabel.addEventListener("blur", function() {
      CreatePOUtil.calculatePOTaxAndTotal();
    });
  }

  // Currency Sym/Select toggle
  const currencySym = document.getElementById("currencySym");
  if (currencySym) {
    currencySym.addEventListener("click", function() {
      PurchaseOrderGenerator.showCurrencySelect("currencySym", "currencySelect");
    });
  }

  const currencySelect = document.getElementById("currencySelect");
  if (currencySelect) {
    currencySelect.addEventListener("change", function() {
      PurchaseOrderGenerator.showCurrencySelect("currencySelect", "currencySym");
    });
  }
});

// Re-bind change/focus/blur events for all current row inputs
CreatePOUtil.rebindAllListeners = function() {
  const rows = document.querySelectorAll(".lineItems tr.row-item");
  rows.forEach((row, index) => {
    // Skip template clone row
    if (row.classList.contains("trClone")) return;

    const qtyInput = row.querySelector('input[id^="itemQty."]');
    const rateInput = row.querySelector('input[id^="itemRate."]');
    const descTextarea = row.querySelector('textarea[id^="itemDesc."]');
    
    if (qtyInput) {
      qtyInput.removeEventListener("blur", CreatePOUtil.onQtyRateBlur);
      qtyInput.addEventListener("blur", CreatePOUtil.onQtyRateBlur);
    }
    if (rateInput) {
      rateInput.removeEventListener("blur", CreatePOUtil.onQtyRateBlur);
      rateInput.addEventListener("blur", CreatePOUtil.onQtyRateBlur);
    }
    if (descTextarea) {
      descTextarea.removeEventListener("keypress", CreatePOUtil.onDescKeypress);
      descTextarea.addEventListener("keypress", CreatePOUtil.onDescKeypress);
    }
  });
};

CreatePOUtil.onQtyRateBlur = function(e) {
  CreatePOUtil.calculateItemTotal(e.target);
  PurchaseOrderGenerator.strikeInfo("itemInfo", false);
};

CreatePOUtil.onDescKeypress = function(e) {
  CreatePOUtil.checkAndAddNewLineItem(e.target, e);
};

// Calculate line total for a row
CreatePOUtil.calculateItemTotal = function(element) {
  const idParts = element.id.split(".");
  if (idParts.length < 2) return;
  const index = idParts[1];

  const qtyEl = document.getElementById("itemQty." + index);
  const rateEl = document.getElementById("itemRate." + index);
  const totalEl = document.getElementById("itemTotal." + index);

  if (!qtyEl || !rateEl || !totalEl) return;

  if (qtyEl.value === "" && rateEl.value === "") {
    totalEl.value = "";
    CreatePOUtil.calculateSubTotal();
    return;
  }

  let qty = parseFloat(qtyEl.value);
  let rate = parseFloat(rateEl.value);

  if (isNaN(qty) || qty < 0) qty = 0;
  if (isNaN(rate) || rate < 0) rate = 0.00;

  // Format inputs
  qtyEl.value = qty;
  rateEl.value = rate.toFixed(2);

  const total = qty * rate;
  totalEl.value = total.toFixed(2);

  // Recalculate Subtotal & Grand Total
  CreatePOUtil.calculateSubTotal();
};

// Calculate Subtotal by summing all non-clone row totals
CreatePOUtil.calculateSubTotal = function() {
  let subTotal = 0;
  let hasItems = false;
  const rows = document.querySelectorAll(".lineItems tr.row-item");
  
  rows.forEach(row => {
    if (row.classList.contains("trClone")) return;
    const idParts = row.id.split(".");
    if (idParts.length < 2) return;
    const idx = idParts[1];
    
    const totalEl = document.getElementById("itemTotal." + idx);
    if (totalEl && totalEl.value !== "") {
      const val = parseFloat(totalEl.value);
      if (!isNaN(val)) {
        subTotal += val;
        hasItems = true;
      }
    }
  });

  const subTotalEl = document.getElementById("subTotal");
  if (subTotalEl) {
    subTotalEl.textContent = hasItems ? subTotal.toFixed(2) : "";
  }

  CreatePOUtil.calculatePOTaxAndTotal();
};

// Calculate Tax and Grand Total
CreatePOUtil.calculatePOTaxAndTotal = function() {
  const taxLabelEl = document.getElementById("taxLabel");
  const subTotalEl = document.getElementById("subTotal");
  const taxAmtEl = document.getElementById("taxAmt");
  const totalEl = document.getElementById("total");

  if (!subTotalEl || !taxAmtEl || !totalEl) return;

  if (subTotalEl.textContent === "") {
    taxAmtEl.textContent = "";
    totalEl.textContent = "";
    return;
  }

  const subTotal = parseFloat(subTotalEl.textContent) || 0;
  let taxRate = 0;

  if (taxLabelEl) {
    const match = taxLabelEl.value.match(/[\d\.]+/g);
    if (match && match.length > 0) {
      taxRate = parseFloat(match[0]) / 100;
    }
  }

  const taxAmt = subTotal * taxRate;
  taxAmtEl.textContent = taxAmt === 0 ? "0.00" : taxAmt.toFixed(2);

  const grandTotal = subTotal + taxAmt;
  totalEl.textContent = grandTotal.toFixed(2);
};

// Add new line item row
CreatePOUtil.addPOLineItem = function() {
  CreatePOUtil.TOTAL_LINE_ITEMS++;
  const nextIdx = CreatePOUtil.TOTAL_LINE_ITEMS;
  
  const lineItemsContainer = document.querySelector(".lineItems");
  if (!lineItemsContainer) return;

  // Clone row item 0 (which is the template row)
  const templateRow = document.getElementById("lineItem.0");
  if (!templateRow) return;

  const newRow = templateRow.cloneNode(true);
  newRow.id = "lineItem." + nextIdx;
  newRow.classList.remove("trClone", "hide");

  // Re-id all input fields inside the cloned row
  const textarea = newRow.querySelector("textarea");
  textarea.id = "itemDesc." + nextIdx;
  textarea.name = "itemDesc." + nextIdx;
  textarea.value = "";
  textarea.classList.remove("lastLineItem");

  const inputs = newRow.querySelectorAll("input");
    inputs.forEach(input => {
      const inputId = input.id;
      if (inputId.startsWith("itemQty.")) {
        input.id = "itemQty." + nextIdx;
        input.name = "itemQty." + nextIdx;
        input.value = "";
      } else if (inputId.startsWith("itemRate.")) {
        input.id = "itemRate." + nextIdx;
        input.name = "itemRate." + nextIdx;
        input.value = "";
      } else if (inputId.startsWith("itemTotal.")) {
        input.id = "itemTotal." + nextIdx;
        input.name = "itemTotal." + nextIdx;
        input.value = "";
      }
    });

  // Re-id delete icon
  const closeIcon = newRow.querySelector(".closeicon");
  if (closeIcon) {
    closeIcon.id = "itemClose." + nextIdx;
    closeIcon.classList.add("hide");
  }

  // Update rows event listeners for mouseover/mouseout close icon display
  newRow.setAttribute("onmouseover", "CreatePOUtil.showCloseIcon(this, true)");
  newRow.setAttribute("onmouseout", "CreatePOUtil.showCloseIcon(this, false)");
  
  // Append new row
  lineItemsContainer.appendChild(newRow);

  // Set this new row's textarea as last line item
  const allTextareas = lineItemsContainer.querySelectorAll("textarea");
  allTextareas.forEach(ta => ta.classList.remove("lastLineItem"));
  textarea.classList.add("lastLineItem");

  CreatePOUtil.rebindAllListeners();
};

// Check if description typing requires adding a new row
CreatePOUtil.checkAndAddNewLineItem = function(textarea, event) {
  if (event.keyCode !== 9 && textarea.classList.contains("lastLineItem") && textarea.value.length === 0) {
    CreatePOUtil.addPOLineItem();
    textarea.classList.remove("lastLineItem");
  }
};

// Remove line item row
CreatePOUtil.removeLineItem = function(element) {
  const idParts = element.id.split(".");
  if (idParts.length < 2) return;
  const index = idParts[1];

  const row = document.getElementById("lineItem." + index);
  if (!row) return;

  // Make sure at least one editable row remains (excluding the hidden clone row)
  const rows = document.querySelectorAll(".lineItems tr.row-item:not(.trClone)");
  if (rows.length <= 1) {
    alert("At least one line item is required.");
    return;
  }

  // If we delete the last item, mark the previous one as lastLineItem
  const wasLast = row.querySelector("textarea").classList.contains("lastLineItem");
  
  row.remove();

  if (wasLast) {
    const remainingRows = document.querySelectorAll(".lineItems tr.row-item:not(.trClone)");
    const lastRow = remainingRows[remainingRows.length - 1];
    if (lastRow) {
      const lastTextarea = lastRow.querySelector("textarea");
      if (lastTextarea) {
        lastTextarea.classList.add("lastLineItem");
      }
    }
  }

  CreatePOUtil.calculateSubTotal();
};

// Show/Hide delete row icon
CreatePOUtil.showCloseIcon = function(rowElement, show) {
  const idParts = rowElement.id.split(".");
  if (idParts.length < 2) return;
  const index = idParts[1];

  const closeIcon = document.getElementById("itemClose." + index);
  if (closeIcon) {
    if (show) {
      closeIcon.classList.remove("hide");
    } else {
      closeIcon.classList.add("hide");
    }
  }
};

// Global Controller Object matching Zoho signatures
var PurchaseOrderGenerator = {
  baseUrl: "",
  mandElements: {
    compAddInfo: "address1",
    clientAddInfo: "billingAddress1",
    poNumberInfo: "poNumber",
    itemInfo: "itemDesc.1"
  },
  
  // Highlight sidebar checklists on focus/blur or text contents changes
  strikeInfo: function(infoId, isFocused) {
    const infoEl = document.getElementById(infoId);
    const inputId = this.mandElements[infoId];
    const inputEl = document.getElementById(inputId);

    if (!infoEl) return;

    if (isFocused) {
      infoEl.classList.add("highlight-content");
    } else {
      infoEl.classList.remove("highlight-content");
      if (inputEl && inputEl.value.trim().length > 0) {
        infoEl.classList.add("rhs-strikethrough-info");
      } else {
        infoEl.classList.remove("rhs-strikethrough-info");
      }
    }
  },

  // Set outlines error borders on validation
  showHideErr: function(id, isError) {
    const inputEl = document.getElementById(id);
    const errEl = document.getElementById(id + "_err");
    
    if (!inputEl) return;
    
    if (isError) {
      inputEl.classList.add("error");
      if (errEl) errEl.classList.remove("hide");
    } else {
      inputEl.classList.remove("error");
      if (errEl) errEl.classList.add("hide");
    }
  },

  // Toggle currency text / dropdown selection
  showCurrencySelect: function(hideId, showId) {
    const hideEl = document.getElementById(hideId);
    const showEl = document.getElementById(showId);
    if (hideEl && showEl) {
      hideEl.classList.add("hide");
      showEl.classList.remove("hide");
      if (showId === "currencySelect") {
        // Populating common currencies
        if (showEl.options.length === 0) {
          const currencies = [
            { code: "USD", symbol: "$" },
            { code: "INR", symbol: "₹" },
            { code: "EUR", symbol: "€" },
            { code: "GBP", symbol: "£" },
            { code: "AUD", symbol: "A$" },
            { code: "CAD", symbol: "C$" }
          ];
          currencies.forEach(c => {
            const opt = document.createElement("option");
            opt.value = c.symbol;
            opt.textContent = `${c.code} (${c.symbol})`;
            showEl.appendChild(opt);
          });
        }
        showEl.focus();
      } else if (showId === "currencySym" && hideId === "currencySelect") {
        const selectEl = document.getElementById("currencySelect");
        const codeEl = document.getElementById("currencyCode");
        const symEl = document.getElementById("currencySym");
        if (selectEl && codeEl && symEl) {
          symEl.value = selectEl.value;
          const selectedText = selectEl.options[selectEl.selectedIndex].text;
          const codeMatch = selectedText.match(/^([A-Z]{3})/);
          if (codeMatch) {
            codeEl.value = codeMatch[1];
          }
        }
      }
    }
  },

  // Main Action PDF / Print Generation
  getPOPDF: function(form, isPrint) {
    // Form Validation: Company Name & Vendor Name are required
    const compNameEl = document.getElementById("address1");
    const vendorNameEl = document.getElementById("billingAddress1");
    let isValid = true;

    if (!compNameEl || compNameEl.value.trim().length === 0) {
      this.showHideErr("address1", true);
      isValid = false;
    } else {
      this.showHideErr("address1", false);
    }

    if (!vendorNameEl || vendorNameEl.value.trim().length === 0) {
      this.showHideErr("billingAddress1", true);
      isValid = false;
    } else {
      this.showHideErr("billingAddress1", false);
    }

    if (!isValid) {
      alert("Please fill in the required fields (marked in red).");
      return;
    }

    if (isPrint) {
      window.print();
    } else {
      // PDF Download via html2canvas & jsPDF
      this.exportToPDF();
    }
  },

  exportToPDF: function() {
    const docSheet = document.querySelector(".po-generator");
    if (!docSheet) return;

    const poNumEl = document.getElementById("poNumber");
    const poNum = poNumEl && poNumEl.value.trim() ? poNumEl.value.trim() : "New";

    // Setup visual loading state on actions panel links/buttons
    const pdfButtons = document.querySelectorAll(".actions-block span, .mbl-actions-block button");
    pdfButtons.forEach(btn => {
      if (btn.textContent.includes("PDF")) {
        btn.style.opacity = "0.5";
        btn.style.pointerEvents = "none";
      }
    });

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
        alert("Failed to load PDF generation engine. Falling back to standard print option.");
        window.print();
        resetLoadingState();
      };
      document.head.appendChild(script);
    };

    const resetLoadingState = function() {
      pdfButtons.forEach(btn => {
        btn.style.opacity = "";
        btn.style.pointerEvents = "";
      });
    };

    loadHtml2Canvas(function() {
      // Add custom print/rendering class
      docSheet.classList.add("po-rendering-pdf");

      window.html2canvas(docSheet, {
        scale: 2, // higher resolution
        useCORS: true,
        backgroundColor: "#ffffff"
      }).then(function(canvas) {
        docSheet.classList.remove("po-rendering-pdf");
        
        const { jsPDF } = window.jspdf;
        if (!jsPDF) {
          alert("PDF generator not found. Triggering page print instead.");
          window.print();
          resetLoadingState();
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
        pdf.save(`Purchase_Order_${poNum}.pdf`);
        
        resetLoadingState();
      }).catch(function(err) {
        console.error("PDF Creation error:", err);
        docSheet.classList.remove("po-rendering-pdf");
        alert("An error occurred during PDF generation. Triggering standard page print instead.");
        window.print();
        resetLoadingState();
      });
    });
  }
};
