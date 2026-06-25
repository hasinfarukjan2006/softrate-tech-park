/* receipts.js — Zoho-styled client-side dynamic logic for Receipt Generator */
document.addEventListener("DOMContentLoaded", function() {
  const container = document.getElementById("receipts-section");
  if (!container) return;

  const itemRows = document.getElementById("recItemRows");
  const addRowBtn = document.getElementById("recAddRow");
  
  const subTotalVal = document.getElementById("recSubTotal");
  const sgstTotalVal = document.getElementById("recSGST");
  const cgstTotalVal = document.getElementById("recCGST");
  const totalPaidVal = document.getElementById("recTotalVal");

  const recDownloadBtn = document.getElementById("recDownloadBtn");
  const recSaveBtn = document.getElementById("recSaveBtn");
  const recPrintBtn = document.getElementById("recPrintBtn");
  
  const logoInput = document.getElementById("recLogoInput");
  const logoPreview = document.getElementById("recLogoPreview");
  const logoPlaceholder = document.getElementById("recLogoPlaceholder");
  const removeLogoBtn = document.getElementById("recRemoveLogoBtn");

  const recCurrencySelect = document.getElementById("recCurrency");

  // State variables
  let selectedThemeColor = "#1e293b";
  let selectedTemplate = "standard";

  // Set today's date
  const dt = new Date();
  const yr = dt.getFullYear();
  const mo = String(dt.getMonth() + 1).padStart(2, "0");
  const dy = String(dt.getDate()).padStart(2, "0");
  const dateInput = document.getElementById("recDate");
  if (dateInput) dateInput.value = `${yr}-${mo}-${dy}`;

  // Currency config details
  const CURRENCIES = {
    INR: { symbol: "₹", locale: "en-IN" },
    USD: { symbol: "$", locale: "en-US" },
    EUR: { symbol: "€", locale: "de-DE" },
    GBP: { symbol: "£", locale: "en-GB" },
    AED: { symbol: "د.إ", locale: "en-AE", space: true },
    SGD: { symbol: "S$", locale: "en-SG" },
    CAD: { symbol: "C$", locale: "en-CA" },
    AUD: { symbol: "A$", locale: "en-AU" },
    JPY: { symbol: "¥", locale: "ja-JP" },
    CHF: { symbol: "Fr", locale: "de-CH", space: true }
  };

  // Helper to convert hex theme color to RGB for jsPDF
  function hexToRgb(hex) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 30, g: 41, b: 59 };
  }

  // Format helper for numbers to 2 decimal places with currency symbol & thousand separators
  function fmt(n, includeSymbol = false) {
    const curCode = recCurrencySelect ? recCurrencySelect.value : "GBP";
    const conf = CURRENCIES[curCode] || { symbol: "£", locale: "en-GB" };
    
    // Format the number part with 2 decimal places and proper locale separators
    let formattedNum = n.toLocaleString(conf.locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    if (includeSymbol) {
      if (conf.space) {
        return conf.symbol + " " + formattedNum;
      }
      return conf.symbol + " " + formattedNum; // Consistent layout spacing
    }
    return formattedNum;
  }

  // Calculate Receipt Values dynamically
  function calc() {
    let subtotal = 0;
    let sgstTotal = 0;
    let cgstTotal = 0;
    let cessTotal = 0;

    itemRows.querySelectorAll("tr").forEach(row => {
      const descInput = row.querySelector(".inv-item-desc");
      if (!descInput) return;

      const qtyInput = row.querySelector(".inv-item-qty");
      const rateInput = row.querySelector(".inv-item-rate");
      const sgstPctInput = row.querySelector(".inv-item-sgst-pct");
      const cgstPctInput = row.querySelector(".inv-item-cgst-pct");
      const cessPctInput = row.querySelector(".inv-item-cess-pct");

      const sgstValSpan = row.querySelector(".inv-item-sgst-val");
      const cgstValSpan = row.querySelector(".inv-item-cgst-val");
      const cessValSpan = row.querySelector(".inv-item-cess-val");
      const totalEl = row.querySelector(".inv-item-total");

      const qty = parseFloat(qtyInput ? qtyInput.value : 0) || 0;
      const rate = parseFloat(rateInput ? rateInput.value : 0) || 0;
      const sgstPct = parseFloat(sgstPctInput ? sgstPctInput.value : 0) || 0;
      const cgstPct = parseFloat(cgstPctInput ? cgstPctInput.value : 0) || 0;
      const cessPct = parseFloat(cessPctInput ? cessPctInput.value : 0) || 0;

      const amt = qty * rate;
      const sgstAmt = amt * (sgstPct / 100);
      const cgstAmt = amt * (cgstPct / 100);
      const cessAmt = amt * (cessPct / 100);

      subtotal += amt;
      sgstTotal += sgstAmt;
      cgstTotal += cgstAmt;
      cessTotal += cessAmt;

      if (sgstValSpan) sgstValSpan.textContent = fmt(sgstAmt);
      if (cgstValSpan) cgstValSpan.textContent = fmt(cgstAmt);
      if (cessValSpan) cessValSpan.textContent = fmt(cessAmt);
      if (totalEl) totalEl.textContent = fmt(amt);
    });

    // Render summary results
    if (subTotalVal) subTotalVal.textContent = fmt(subtotal);
    if (sgstTotalVal) sgstTotalVal.textContent = fmt(sgstTotal);
    if (cgstTotalVal) cgstTotalVal.textContent = fmt(cgstTotal);

    const grandTotal = subtotal + sgstTotal + cgstTotal + cessTotal;
    if (totalPaidVal) totalPaidVal.textContent = fmt(grandTotal, true);
  }

  // Recalculate on currency change
  if (recCurrencySelect) {
    recCurrencySelect.addEventListener("change", calc);
  }

  // Handle Logo Upload Preview
  if (logoInput) {
    logoInput.addEventListener("change", function() {
      if (this.files && this.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
          logoPreview.src = e.target.result;
          logoPreview.classList.remove("hide");
          logoPlaceholder.classList.add("hide");
          removeLogoBtn.classList.remove("hide");
        };
        reader.readAsDataURL(this.files[0]);
      }
    });
  }

  if (removeLogoBtn) {
    removeLogoBtn.addEventListener("click", function() {
      logoInput.value = "";
      logoPreview.src = "";
      logoPreview.classList.add("hide");
      logoPlaceholder.classList.remove("hide");
      removeLogoBtn.classList.add("hide");
    });
  }

  // Row removal delegation
  itemRows.addEventListener("click", function(e) {
    if (e.target.classList.contains("inv-remove-row")) {
      const rows = itemRows.querySelectorAll("tr");
      if (rows.length > 1) {
        e.target.closest("tr").remove();
        calc();
      } else {
        alert("Receipt must have at least one line item.");
      }
    }
  });

  // Add line item
  addRowBtn.addEventListener("click", function() {
    const tr = document.createElement("tr");
    tr.style.borderBottom = "1px solid #f1f5f9";
    tr.innerHTML = `
      <td style="padding: 12px 10px; vertical-align: top;">
        <textarea class="inv-item-desc" placeholder="Enter item name/description" style="width: 100% !important; border: 1px dashed transparent !important; background: transparent !important; padding: 4px !important; font-size: 0.9rem !important; resize: none; min-height: 38px; color: inherit;" rows="1"></textarea>
        <input type="text" class="inv-item-hsn" placeholder="HSN/SAC" value="" style="width: 100% !important; border: none !important; background: transparent !important; padding: 0 4px !important; font-size: 0.75rem !important; color: #94a3b8 !important; margin-top: 4px;">
      </td>
      <td style="padding: 12px 10px; vertical-align: top; text-align: right;">
        <input type="number" class="inv-item-qty" placeholder="1" min="0" step="1" value="1" style="width: 100% !important; border: 1px dashed transparent !important; background: transparent !important; padding: 4px !important; font-size: 0.9rem !important; text-align: right; color: inherit;">
      </td>
      <td style="padding: 12px 10px; vertical-align: top; text-align: right;">
        <input type="number" class="inv-item-rate" placeholder="0.00" min="0" step="0.01" value="0.00" style="width: 100% !important; border: 1px dashed transparent !important; background: transparent !important; padding: 4px !important; font-size: 0.9rem !important; text-align: right; color: inherit;">
      </td>
      <td style="padding: 12px 10px; vertical-align: top; text-align: right;">
        <div style="display: flex; flex-direction: column; align-items: flex-end;">
          <input type="number" class="inv-item-sgst-pct" placeholder="0" min="0" step="0.1" value="0" style="width: 48px !important; border: 1px dashed transparent !important; background: transparent !important; padding: 2px !important; font-size: 0.85rem !important; text-align: right; color: inherit;">
          <span class="inv-item-sgst-val" style="font-size: 0.75rem; color: #64748b; margin-top: 4px;">0.00</span>
        </div>
      </td>
      <td style="padding: 12px 10px; vertical-align: top; text-align: right;">
        <div style="display: flex; flex-direction: column; align-items: flex-end;">
          <input type="number" class="inv-item-cgst-pct" placeholder="0" min="0" step="0.1" value="0" style="width: 48px !important; border: 1px dashed transparent !important; background: transparent !important; padding: 2px !important; font-size: 0.85rem !important; text-align: right; color: inherit;">
          <span class="inv-item-cgst-val" style="font-size: 0.75rem; color: #64748b; margin-top: 4px;">0.00</span>
        </div>
      </td>
      <td style="padding: 12px 10px; vertical-align: top; text-align: right;">
        <div style="display: flex; flex-direction: column; align-items: flex-end;">
          <input type="number" class="inv-item-cess-pct" placeholder="0" min="0" step="0.1" value="0" style="width: 48px !important; border: 1px dashed transparent !important; background: transparent !important; padding: 2px !important; font-size: 0.85rem !important; text-align: right; color: inherit;">
          <span class="inv-item-cess-val" style="font-size: 0.75rem; color: #64748b; margin-top: 4px;">0.00</span>
        </div>
      </td>
      <td class="inv-item-total text-right" style="padding: 12px 10px; vertical-align: top; font-size: 0.9rem; font-weight: 500; color: inherit; text-align: right;">0.00</td>
      <td style="padding: 12px 2px; vertical-align: top; text-align: center;"><button type="button" class="inv-remove-row" title="Delete Row" style="background: transparent; border: none; color: #94a3b8; cursor: pointer; font-size: 1.25rem; line-height: 1;">&times;</button></td>
    `;
    itemRows.appendChild(tr);
    tr.querySelector(".inv-item-desc").focus();
    updateTemplateLayout(); // Apply template properties to the newly added row
    calc();
  });

  // Calculate automatically on change
  container.addEventListener("input", calc);
  container.addEventListener("change", calc);

  // Theme Swatches Color Selector
  const swatches = document.querySelectorAll("#recColorSwatches .color-swatch");
  swatches.forEach(swatch => {
    swatch.addEventListener("click", function() {
      swatches.forEach(s => {
        s.classList.remove("active");
        const ch = s.querySelector("i");
        if (ch) ch.remove();
      });
      this.classList.add("active");
      const checkIcon = document.createElement("i");
      checkIcon.setAttribute("data-lucide", "check");
      checkIcon.style.cssText = "width: 12px; height: 12px; color: #ffffff; position: absolute; top: 4px; left: 4px;";
      this.appendChild(checkIcon);
      if (window.lucide) {
        window.lucide.createIcons();
      }

      selectedThemeColor = this.getAttribute("data-color");
      updateThemeColor();
    });
  });

  function updateThemeColor() {
    // Title text
    const themeTitle = document.getElementById("recThemeTitle");
    if (themeTitle) themeTitle.style.color = selectedThemeColor;

    // Table headers background
    const ths = document.querySelectorAll("#recItemsTable th");
    ths.forEach(th => {
      th.style.backgroundColor = selectedThemeColor;
      th.style.color = "#ffffff";
    });

    // Add row button
    const addRowBtnEl = document.getElementById("recAddRow");
    if (addRowBtnEl) addRowBtnEl.style.color = selectedThemeColor;

    // Save button
    const saveBtnEl = document.getElementById("recSaveBtn");
    if (saveBtnEl) saveBtnEl.style.backgroundColor = selectedThemeColor;

    // Active Template Card borders
    const activeTemplateCard = document.querySelector("#receipts-section .template-card.active");
    if (activeTemplateCard) {
      activeTemplateCard.style.borderColor = selectedThemeColor;
      const span = activeTemplateCard.querySelector("span");
      if (span) span.style.color = selectedThemeColor;
    }
  }

  // Template Card Selection
  const templates = document.querySelectorAll("#receipts-section .template-card");
  templates.forEach(t => {
    t.addEventListener("click", function() {
      templates.forEach(card => {
        card.classList.remove("active");
        card.style.borderColor = "#e2e8f0";
        const titleSpan = card.querySelector("span");
        if (titleSpan) titleSpan.style.color = "#64748b";
      });
      this.classList.add("active");
      
      this.style.borderColor = selectedThemeColor;
      const titleSpan = this.querySelector("span");
      if (titleSpan) titleSpan.style.color = selectedThemeColor;

      selectedTemplate = this.getAttribute("data-template");
      updateTemplateLayout();
    });
  });

  function updateTemplateLayout() {
    const table = document.getElementById("recItemsTable");
    if (!table) return;

    const tds = table.querySelectorAll("td");
    const ths = table.querySelectorAll("th");

    if (selectedTemplate === "spreadsheet") {
      tds.forEach(td => {
        td.style.border = "1px solid #cbd5e1";
        td.style.padding = "10px";
      });
      ths.forEach(th => {
        th.style.border = "1px solid #cbd5e1";
        th.style.padding = "10px";
        th.style.backgroundColor = selectedThemeColor;
      });
    } else if (selectedTemplate === "compact") {
      tds.forEach(td => {
        td.style.border = "none";
        td.style.borderBottom = "1px solid #cbd5e1";
        td.style.padding = "6px 8px";
        td.style.fontSize = "0.8rem";
      });
      ths.forEach(th => {
        th.style.border = "none";
        th.style.borderBottom = "2px solid #cbd5e1";
        th.style.padding = "6px 8px";
        th.style.fontSize = "0.75rem";
        th.style.backgroundColor = selectedThemeColor;
      });
    } else { // standard
      tds.forEach(td => {
        td.style.border = "none";
        td.style.borderBottom = "1px solid #f1f5f9";
        td.style.padding = "12px 10px";
        td.style.fontSize = "0.9rem";
      });
      ths.forEach(th => {
        th.style.border = "none";
        th.style.borderBottom = "2px solid #cbd5e1";
        th.style.padding = "12px 10px";
        th.style.fontSize = "0.8rem";
        th.style.backgroundColor = selectedThemeColor;
      });
    }
  }

  // Save Receipt
  if (recSaveBtn) {
    recSaveBtn.addEventListener("click", function() {
      alert("Receipt saved successfully!");
    });
  }

  // Print Receipt
  if (recPrintBtn) {
    recPrintBtn.addEventListener("click", function() {
      window.print();
    });
  }

  // PDF Generation using jsPDF
  if (recDownloadBtn) {
    recDownloadBtn.addEventListener("click", function() {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF("p", "mm", "a4");

      const primaryRgb = hexToRgb(selectedThemeColor);
      const accentColor = [primaryRgb.r, primaryRgb.g, primaryRgb.b];

      // Draw Logo if exists
      if (logoPreview && !logoPreview.classList.contains("hide") && logoPreview.src) {
        try {
          doc.addImage(logoPreview.src, "PNG", 15, 12, 45, 24);
        } catch (e) {
          console.warn("Error adding image to PDF: ", e);
        }
      }

      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.text("PAYMENT RECEIPT", 195, 22, { align: "right" });

      // Company info
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(80, 80, 80);
      let companyY = 32;
      doc.text(document.getElementById("recByCompany").value || "", 15, companyY + 4);
      doc.text("GSTIN: " + (document.getElementById("recByGSTIN").value || ""), 15, companyY + 8);
      doc.text(document.getElementById("recByAddress").value || "", 15, companyY + 12);
      doc.text((document.getElementById("recByCity").value || "") + ", " + (document.getElementById("recByState").value || ""), 15, companyY + 16);

      // Receipt Meta information (right side)
      doc.setFont("helvetica", "bold");
      doc.setTextColor(40, 40, 40);
      doc.text("Receipt #:", 135, companyY + 4);
      doc.text("Payment Date:", 135, companyY + 8);
      doc.text("Payment Method:", 135, companyY + 12);
      doc.text("Transaction Ref:", 135, companyY + 16);
      doc.text("Place of Supply:", 135, companyY + 20);

      doc.setFont("helvetica", "normal");
      doc.text(document.getElementById("recNumber").value || "REC-10029", 195, companyY + 4, { align: "right" });
      doc.text(document.getElementById("recDate").value || "", 195, companyY + 8, { align: "right" });
      doc.text(document.getElementById("recMethod").value || "", 195, companyY + 12, { align: "right" });
      doc.text(document.getElementById("recRef").value || "", 195, companyY + 16, { align: "right" });
      doc.text(document.getElementById("recSupply").value || "", 195, companyY + 20, { align: "right" });

      // Client info (Received From)
      let clientY = 64;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.text("Received From:", 15, clientY);

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(80, 80, 80);
      doc.text(document.getElementById("recFromClient").value || "", 15, clientY + 5);
      doc.text("GSTIN: " + (document.getElementById("recFromGSTIN").value || ""), 15, clientY + 9);
      doc.text(document.getElementById("recFromAddress").value || "", 15, clientY + 13);
      doc.text((document.getElementById("recFromCity").value || "") + ", " + (document.getElementById("recFromState").value || ""), 15, clientY + 17);

      // Fetch items for table
      const headers = [["Item Description", "HSN/SAC", "Qty", "Rate", "SGST (%)", "CGST (%)", "Cess (%)", "Amount"]];
      const data = [];
      itemRows.querySelectorAll("tr").forEach(row => {
        const desc = row.querySelector(".inv-item-desc").value || "";
        const hsn = row.querySelector(".inv-item-hsn").value || "";
        const qty = row.querySelector(".inv-item-qty").value || "0";
        const rate = parseFloat(row.querySelector(".inv-item-rate").value || 0).toFixed(2);
        const sgst = row.querySelector(".inv-item-sgst-pct").value || "0";
        const cgst = row.querySelector(".inv-item-cgst-pct").value || "0";
        const cess = row.querySelector(".inv-item-cess-pct").value || "0";
        const total = row.querySelector(".inv-item-total").textContent;
        data.push([desc, hsn, qty, rate, sgst, cgst, cess, total]);
      });

      // Draw table using AutoTable
      doc.autoTable({
        startY: clientY + 26,
        head: headers,
        body: data,
        theme: selectedTemplate === "spreadsheet" ? "grid" : "striped",
        headStyles: { fillColor: accentColor },
        styles: { fontSize: 8.5, cellPadding: 3 },
        columnStyles: {
          0: { cellWidth: 50 },
          1: { cellWidth: 20 },
          2: { cellWidth: 15, halign: "right" },
          3: { cellWidth: 22, halign: "right" },
          4: { cellWidth: 18, halign: "right" },
          5: { cellWidth: 18, halign: "right" },
          6: { cellWidth: 18, halign: "right" },
          7: { cellWidth: 24, halign: "right" }
        }
      });

      let finalY = doc.previousAutoTable.finalY + 12;

      // Draw Notes & Terms
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.text("Notes:", 15, finalY);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(80, 80, 80);
      const notes = doc.splitTextToSize(document.getElementById("recNotes").value || "", 95);
      doc.text(notes, 15, finalY + 4);

      let termsY = finalY + Math.max(12, notes.length * 4.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.text("Terms & Conditions:", 15, termsY);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(80, 80, 80);
      const terms = doc.splitTextToSize(document.getElementById("recTerms").value || "", 95);
      doc.text(terms, 15, termsY + 4);

      // Summary on the right side
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);

      doc.text("Sub Total:", 135, finalY);
      doc.text(subTotalVal.textContent, 195, finalY, { align: "right" });

      doc.text("SGST:", 135, finalY + 5);
      doc.text(sgstTotalVal.textContent, 195, finalY + 5, { align: "right" });

      doc.text("CGST:", 135, finalY + 10);
      doc.text(cgstTotalVal.textContent, 195, finalY + 10, { align: "right" });

      // Grand Total Box
      doc.setFont("helvetica", "bold");
      doc.setTextColor(40, 40, 40);
      doc.setFillColor(254, 249, 195); // #fef9c3
      doc.rect(130, finalY + 15, 68, 10, "F");
      doc.text("TOTAL PAID:", 135, finalY + 21);
      
      doc.text(totalPaidVal.textContent, 195, finalY + 21, { align: "right" });

      // Footer branding watermark
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(150, 150, 150);
      doc.text("Crafted with ease using Softrate Receipt Generator", 105, pageHeight - 12, { align: "center" });

      doc.save((document.getElementById("recNumber").value || "receipt") + ".pdf");
    });
  }

  // FAQ Accordion Toggle Interaction for Receipts
  const recFaqAccordion = document.getElementById("recFaqAccordion");
  if (recFaqAccordion) {
    recFaqAccordion.addEventListener("click", function(e) {
      const header = e.target.closest(".faq-accordion-header");
      if (!header) return;

      const item = header.closest(".faq-accordion-item");
      const content = item.querySelector(".faq-accordion-content");
      const icon = header.querySelector(".faq-icon");

      const isOpen = item.classList.contains("open");

      // Close all other items
      recFaqAccordion.querySelectorAll(".faq-accordion-item").forEach(i => {
        i.classList.remove("open");
        const c = i.querySelector(".faq-accordion-content");
        if (c) c.style.maxHeight = null;
        const ic = i.querySelector(".faq-icon");
        if (ic) {
          ic.setAttribute("data-lucide", "plus");
        }
      });

      if (!isOpen) {
        item.classList.add("open");
        if (content) content.style.maxHeight = content.scrollHeight + "px";
        if (icon) {
          icon.setAttribute("data-lucide", "minus");
        }
      } else {
        item.classList.remove("open");
        if (content) content.style.maxHeight = null;
        if (icon) {
          icon.setAttribute("data-lucide", "plus");
        }
      }
      if (window.lucide) {
        window.lucide.createIcons();
      }
    });
  }

  // Run initial updates
  calc();
  updateThemeColor();
  updateTemplateLayout();
});
