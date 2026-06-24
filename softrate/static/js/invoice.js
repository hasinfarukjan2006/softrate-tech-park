/* invoice.js — Zoho-styled dynamic calculator logic for Free GST Invoice Generator */
document.addEventListener("DOMContentLoaded", function() {
  const container = document.getElementById("invoice-section");
  if (!container) return;

  const itemRows = document.getElementById("invItemRows");
  const addRowBtn = document.getElementById("invAddRow");
  
  const subTotalVal = document.getElementById("invSubTotal");
  const cgstVal = document.getElementById("invCGST");
  const sgstVal = document.getElementById("invSGST");
  const igstVal = document.getElementById("invIGST");
  const totalDueVal = document.getElementById("invTotalDue");

  const cgstRowWrap = document.getElementById("cgstRowWrap");
  const sgstRowWrap = document.getElementById("sgstRowWrap");
  const igstRowWrap = document.getElementById("igstRowWrap");

  const invDownloadBtn = document.getElementById("invDownloadBtn");
  const invSaveBtn = document.getElementById("invSaveBtn");
  
  const logoInput = document.getElementById("invLogoInput");
  const logoPreview = document.getElementById("invLogoPreview");
  const logoPlaceholder = document.getElementById("invLogoPlaceholder");

  const invCurrencySelect = document.getElementById("invCurrency");

  // Currency config details
  const CURRENCIES = {
    INR: { symbol: "₹", locale: "en-IN" },
    USD: { symbol: "$", locale: "en-US" },
    EUR: { symbol: "€", locale: "de-DE" },
    GBP: { symbol: "£", locale: "en-GB" },
    AED: { symbol: "AED", locale: "en-AE", space: true },
    SAR: { symbol: "SAR", locale: "ar-SA", space: true },
    QAR: { symbol: "QAR", locale: "ar-QA", space: true },
    OMR: { symbol: "OMR", locale: "ar-OM", space: true },
    KWD: { symbol: "KWD", locale: "ar-KW", space: true },
    BHD: { symbol: "BHD", locale: "ar-BH", space: true },
    JOD: { symbol: "JD", locale: "ar-JO", space: true },
    EGP: { symbol: "E£", locale: "ar-EG", space: true },
    TRY: { symbol: "₺", locale: "tr-TR" },
    ZAR: { symbol: "R", locale: "en-ZA" },
    CAD: { symbol: "C$", locale: "en-CA" },
    AUD: { symbol: "A$", locale: "en-AU" },
    NZD: { symbol: "NZ$", locale: "en-NZ" },
    SGD: { symbol: "S$", locale: "en-SG" },
    MYR: { symbol: "RM", locale: "ms-MY" },
    THB: { symbol: "฿", locale: "th-TH" },
    IDR: { symbol: "Rp", locale: "id-ID" },
    PHP: { symbol: "₱", locale: "en-PH" },
    VND: { symbol: "₫", locale: "vi-VN" },
    CNY: { symbol: "¥", locale: "zh-CN" },
    JPY: { symbol: "¥", locale: "ja-JP" },
    KRW: { symbol: "₩", locale: "ko-KR" },
    HKD: { symbol: "HK$", locale: "en-HK" },
    CHF: { symbol: "CHF", locale: "de-CH", space: true },
    SEK: { symbol: "kr", locale: "sv-SE", space: true },
    NOK: { symbol: "kr", locale: "nb-NO", space: true },
    DKK: { symbol: "kr", locale: "da-DK", space: true },
    PLN: { symbol: "zł", locale: "pl-PL", space: true },
    RUB: { symbol: "₽", locale: "ru-RU" },
    BRL: { symbol: "R$", locale: "pt-BR" },
    MXN: { symbol: "$", locale: "es-MX" }
  };

  // Format helper for numbers to 2 decimal places with currency symbol & thousand separators
  function fmt(n, includeSymbol = false) {
    const curCode = invCurrencySelect ? invCurrencySelect.value : "INR";
    const conf = CURRENCIES[curCode] || { symbol: "₹", locale: "en-IN" };
    
    // Format the number part with 2 decimal places and proper locale separators
    let formattedNum = n.toLocaleString(conf.locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    if (includeSymbol) {
      if (conf.space) {
        return conf.symbol + " " + formattedNum;
      }
      return conf.symbol + formattedNum;
    }
    return formattedNum;
  }

  // Calculate Invoice Values dynamically
  function calc() {
    let subtotal = 0;
    let cgstTotal = 0;
    let sgstTotal = 0;
    let igstTotal = 0;

    // Check Place of Supply to determine GST split
    const supplyStateInput = document.getElementById("invSupply");
    const supplyState = (supplyStateInput ? supplyStateInput.value.trim().toLowerCase() : "");
    const fromStateInput = document.getElementById("invFromState");
    const fromState = (fromStateInput ? fromStateInput.value.trim().toLowerCase() : "");
    
    // Default to intrastate split if they match, or if interstate is not clearly set
    const isInterstate = supplyState !== "" && fromState !== "" && supplyState !== fromState;

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
      const rowTotal = amt + sgstAmt + cgstAmt + cessAmt;

      subtotal += amt;
      cgstTotal += cgstAmt;
      sgstTotal += sgstAmt;
      igstTotal += (sgstAmt + cgstAmt); // If interstate, combine CGST + SGST into IGST equivalent representation

      if (sgstValSpan) sgstValSpan.textContent = fmt(sgstAmt);
      if (cgstValSpan) cgstValSpan.textContent = fmt(cgstAmt);
      if (cessValSpan) cessValSpan.textContent = fmt(cessAmt);
      if (totalEl) totalEl.textContent = fmt(rowTotal);
    });

    // Render summary results
    if (subTotalVal) subTotalVal.textContent = fmt(subtotal);

    if (isInterstate) {
      if (igstRowWrap) igstRowWrap.classList.remove("hide");
      if (cgstRowWrap) cgstRowWrap.classList.add("hide");
      if (sgstRowWrap) sgstRowWrap.classList.add("hide");
      if (igstVal) igstVal.textContent = fmt(igstTotal);
    } else {
      if (igstRowWrap) igstRowWrap.classList.add("hide");
      if (cgstRowWrap) cgstRowWrap.classList.remove("hide");
      if (sgstRowWrap) sgstRowWrap.classList.remove("hide");
      if (cgstVal) cgstVal.textContent = fmt(cgstTotal);
      if (sgstVal) sgstVal.textContent = fmt(sgstTotal);
    }

    const totalTax = cgstTotal + sgstTotal;
    const grandTotal = subtotal + totalTax;
    if (totalDueVal) totalDueVal.textContent = fmt(grandTotal, true);
  }

  // Recalculate on currency change
  if (invCurrencySelect) {
    invCurrencySelect.addEventListener("change", calc);
  }

  // Handle Logo Upload Preview
  window.InvoiceController = {
    handleLogo: function(input) {
      if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
          logoPreview.src = e.target.result;
          logoPreview.classList.remove("hide");
          logoPlaceholder.classList.add("hide");
        };
        reader.readAsDataURL(input.files[0]);
      }
    }
  };

  if (logoInput) {
    logoInput.addEventListener("change", function() {
      InvoiceController.handleLogo(this);
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
        alert("Invoice must have at least one line item.");
      }
    }
  });

  // Add line item
  addRowBtn.addEventListener("click", function() {
    const tr = document.createElement("tr");
    tr.style.borderBottom = "1px solid #f1f5f9";
    tr.innerHTML = `
      <td style="padding: 12px 16px; vertical-align: top;">
        <textarea class="inv-item-desc" placeholder="Enter item name/description" style="width: 100% !important; border: 1px dashed transparent !important; background: transparent !important; padding: 4px !important; font-size: 0.9rem !important; resize: none; min-height: 38px; color: #1e293b !important;" rows="1"></textarea>
        <input type="text" class="inv-item-hsn" placeholder="HSN/SAC" value="HSN/SAC" style="width: 100% !important; border: none !important; background: transparent !important; padding: 0 4px !important; font-size: 0.75rem !important; color: #94a3b8 !important; margin-top: 4px;">
      </td>
      <td style="padding: 12px 16px; vertical-align: top; text-align: right;">
        <input type="number" class="inv-item-qty" placeholder="1" min="0" step="1" value="1" style="width: 100% !important; border: 1px dashed transparent !important; background: transparent !important; padding: 4px !important; font-size: 0.9rem !important; text-align: right; color: #1e293b !important;">
      </td>
      <td style="padding: 12px 16px; vertical-align: top; text-align: right;">
        <input type="number" class="inv-item-rate" placeholder="0.00" min="0" step="0.01" value="0.00" style="width: 100% !important; border: 1px dashed transparent !important; background: transparent !important; padding: 4px !important; font-size: 0.9rem !important; text-align: right; color: #1e293b !important;">
      </td>
      <td style="padding: 12px 16px; vertical-align: top; text-align: right;">
        <div style="display: flex; flex-direction: column; align-items: flex-end;">
          <input type="number" class="inv-item-sgst-pct" placeholder="0" min="0" step="0.1" value="0" style="width: 48px !important; border: 1px dashed transparent !important; background: transparent !important; padding: 2px !important; font-size: 0.85rem !important; text-align: right; color: #1e293b !important;">
          <span class="inv-item-sgst-val" style="font-size: 0.75rem; color: #64748b; margin-top: 4px;">0.00</span>
        </div>
      </td>
      <td style="padding: 12px 16px; vertical-align: top; text-align: right;">
        <div style="display: flex; flex-direction: column; align-items: flex-end;">
          <input type="number" class="inv-item-cgst-pct" placeholder="0" min="0" step="0.1" value="0" style="width: 48px !important; border: 1px dashed transparent !important; background: transparent !important; padding: 2px !important; font-size: 0.85rem !important; text-align: right; color: #1e293b !important;">
          <span class="inv-item-cgst-val" style="font-size: 0.75rem; color: #64748b; margin-top: 4px;">0.00</span>
        </div>
      </td>
      <td style="padding: 12px 16px; vertical-align: top; text-align: right;">
        <div style="display: flex; flex-direction: column; align-items: flex-end;">
          <input type="number" class="inv-item-cess-pct" placeholder="0" min="0" step="0.1" value="0" style="width: 48px !important; border: 1px dashed transparent !important; background: transparent !important; padding: 2px !important; font-size: 0.85rem !important; text-align: right; color: #1e293b !important;">
          <span class="inv-item-cess-val" style="font-size: 0.75rem; color: #64748b; margin-top: 4px;">0.00</span>
        </div>
      </td>
      <td class="inv-item-total text-right" style="padding: 12px 16px; vertical-align: top; font-size: 0.9rem; font-weight: 400; color: #1e293b; text-align: right;">0.00</td>
      <td style="padding: 12px 6px; vertical-align: top; text-align: center;"><button type="button" class="inv-remove-row" title="Delete Row" style="background: transparent; border: none; color: #94a3b8; cursor: pointer; font-size: 1.25rem; line-height: 1;">&times;</button></td>
    `;
    itemRows.appendChild(tr);
    tr.querySelector(".inv-item-desc").focus();
    calc();
  });

  // Calculate automatically on change
  container.addEventListener("input", calc);
  container.addEventListener("change", calc);

  // Theme Swatches Color Selector
  const swatches = document.querySelectorAll(".color-swatch");
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
      lucide.createIcons();

      const themeColor = this.getAttribute("data-color");
      document.documentElement.style.setProperty("--inv-primary-color", themeColor);
      
      const standardTemplateCard = document.querySelector(".template-card[data-template='standard']");
      if (standardTemplateCard) {
        standardTemplateCard.style.borderColor = themeColor;
      }
    });
  });

  // Template Card Selection
  const templates = document.querySelectorAll(".template-card");
  const invoiceCard = document.getElementById("invoiceCard");
  templates.forEach(t => {
    t.addEventListener("click", function() {
      templates.forEach(card => {
        card.classList.remove("active");
        card.style.borderColor = "#e2e8f0";
        const titleSpan = card.querySelector("span");
        if (titleSpan) titleSpan.style.color = "#64748b";
      });
      this.classList.add("active");
      const activeColor = document.querySelector(".color-swatch.active")?.getAttribute("data-color") || "#1e293b";
      this.style.borderColor = activeColor;
      const titleSpan = this.querySelector("span");
      if (titleSpan) titleSpan.style.color = activeColor;

      const templateName = this.getAttribute("data-template");
      // Update template layout class on form wrapper
      if (invoiceCard) {
        invoiceCard.className = "inv-card select-template-" + templateName;
      }
    });
  });

  // Print & PDF Download Handler
  if (invDownloadBtn) {
    invDownloadBtn.addEventListener("click", function() {
      window.print();
    });
  }

  if (invSaveBtn) {
    invSaveBtn.addEventListener("click", function() {
      alert("Invoice saved successfully!");
    });
  }

  // FAQ Accordion interactions
  const faqHeaders = document.querySelectorAll(".faq-accordion-header");
  faqHeaders.forEach(header => {
    header.addEventListener("click", function() {
      const item = this.parentElement;
      const isOpen = item.classList.contains("open");

      // Close all other accordion items
      document.querySelectorAll(".faq-accordion-item").forEach(i => {
        i.classList.remove("open");
        const content = i.querySelector(".faq-accordion-content");
        if (content) content.style.maxHeight = null;
        const icon = i.querySelector(".faq-icon");
        if (icon) {
          icon.setAttribute("data-lucide", "plus");
        }
      });

      if (!isOpen) {
        item.classList.add("open");
        const content = item.querySelector(".faq-accordion-content");
        if (content) content.style.maxHeight = content.scrollHeight + "px";
        const icon = item.querySelector(".faq-icon");
        if (icon) {
          icon.setAttribute("data-lucide", "minus");
        }
      }
      lucide.createIcons();
    });
  });

  // Run initial calculations
  calc();
});
