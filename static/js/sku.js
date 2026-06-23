/**
 * Softrate Tech Park Pvt. Ltd.
 * Free SKU Generator Controller
 */

"use strict";

document.addEventListener("DOMContentLoaded", function() {
  const btnGenerate = document.getElementById("btnGenerateSku");
  const btnGenerateBulk = document.getElementById("btnGenerateBulkSku");
  const btnCopy = document.getElementById("btnCopySku");
  const btnCopyBulk = document.getElementById("btnCopyBulkSku");
  const btnReset = document.getElementById("btnResetSku");

  const nameInput = document.getElementById("skuProductName");
  const catInput = document.getElementById("skuProductCategory");
  const brandInput = document.getElementById("skuBrand");
  const colorInput = document.getElementById("skuColor");
  const sizeInput = document.getElementById("skuSize");
  const variantInput = document.getElementById("skuVariant");

  const separatorSelect = document.getElementById("skuSeparator");
  const attrLenSelect = document.getElementById("skuAttrLen");

  // Format selectors
  const formatRadios = document.getElementsByName("skuFormat");
  const customBuilder = document.getElementById("customSkuBuilder");

  if (!btnGenerate) return;

  // Toggle custom pattern builder on radio choice
  formatRadios.forEach(radio => {
    radio.addEventListener("change", function() {
      if (this.value === "F3" && this.checked) {
        customBuilder.style.display = "block";
      } else {
        customBuilder.style.display = "none";
      }
    });
  });

  // Focus/blur handlers for RHS Checklist strikes
  if (nameInput) {
    nameInput.addEventListener("focus", () => strikeInfo("compAddInfo", true));
    nameInput.addEventListener("blur", () => strikeInfo("compAddInfo", false));
  }
  if (catInput) {
    catInput.addEventListener("focus", () => strikeInfo("clientAddInfo", true));
    catInput.addEventListener("blur", () => strikeInfo("clientAddInfo", false));
  }
  if (brandInput) {
    brandInput.addEventListener("focus", () => strikeInfo("poNumberInfo", true));
    brandInput.addEventListener("blur", () => strikeInfo("poNumberInfo", false));
  }
  if (colorInput) {
    colorInput.addEventListener("focus", () => strikeInfo("itemInfo", true));
    colorInput.addEventListener("blur", () => strikeInfo("itemInfo", false));
  }
  if (sizeInput) {
    sizeInput.addEventListener("focus", () => strikeInfo("itemInfo", true));
    sizeInput.addEventListener("blur", () => strikeInfo("itemInfo", false));
  }

  // Generate SKU click
  btnGenerate.addEventListener("click", function() {
    let isValid = validateInputs();
    if (!isValid) return;

    const sku = computeSKU("001");
    
    const resultContainer = document.getElementById("skuResultContainer");
    const resultOutput = document.getElementById("skuResultOutput");
    if (resultContainer && resultOutput) {
      resultOutput.textContent = sku;
      resultContainer.style.display = "block";
      resultContainer.scrollIntoView({ behavior: "smooth" });
    }
  });

  // Reset/Generate another SKU click
  btnReset.addEventListener("click", function() {
    const resultContainer = document.getElementById("skuResultContainer");
    if (resultContainer) resultContainer.style.display = "none";
    
    // Clear inputs
    if (nameInput) nameInput.value = "";
    if (catInput) catInput.value = "";
    if (brandInput) brandInput.value = "";
    if (colorInput) colorInput.value = "";
    if (sizeInput) sizeInput.value = "";
    if (variantInput) variantInput.value = "";

    // Reset checklist highlights
    strikeInfo("compAddInfo", false);
    strikeInfo("clientAddInfo", false);
    strikeInfo("poNumberInfo", false);
    strikeInfo("itemInfo", false);
  });

  // Copy Single SKU click
  btnCopy.addEventListener("click", function() {
    const resultOutput = document.getElementById("skuResultOutput");
    if (resultOutput && resultOutput.textContent) {
      copyToClipboard(resultOutput.textContent, "SKU Copied to Clipboard!");
    }
  });

  // Generate Bulk SKUs click
  btnGenerateBulk.addEventListener("click", function() {
    let isValid = validateInputs();
    if (!isValid) return;

    const startNumEl = document.getElementById("skuBulkStartNum");
    const qtyEl = document.getElementById("skuBulkQty");
    if (!startNumEl || !qtyEl) return;

    let startNum = parseInt(startNumEl.value);
    let qty = parseInt(qtyEl.value);

    if (isNaN(startNum) || startNum < 1) startNum = 1;
    if (isNaN(qty) || qty < 1) qty = 10;
    if (qty > 100) qty = 100; // Cap at 100 for safety

    let results = [];
    for (let i = 0; i < qty; i++) {
      let currentNum = startNum + i;
      let padNum = String(currentNum).padStart(3, "0");
      results.push(computeSKU(padNum));
    }

    const bulkContainer = document.getElementById("skuBulkResultContainer");
    const bulkOutput = document.getElementById("skuBulkOutput");
    if (bulkContainer && bulkOutput) {
      bulkOutput.value = results.join("\\n");
      bulkContainer.style.display = "block";
      bulkContainer.scrollIntoView({ behavior: "smooth" });
    }
  });

  // Copy Bulk SKUs click
  btnCopyBulk.addEventListener("click", function() {
    const bulkOutput = document.getElementById("skuBulkOutput");
    if (bulkOutput && bulkOutput.value) {
      copyToClipboard(bulkOutput.value, "Bulk SKUs Copied!");
    }
  });

  // Helper Abbreviation Function
  function abbreviate(str, len) {
    if (!str) return "";
    let clean = str.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    if (clean.length === 0) return "";
    return clean.substring(0, len);
  }

  // Compute SKU base code
  function computeSKU(serialNum) {
    const name = nameInput.value.trim();
    const cat = catInput.value;
    const brand = brandInput.value.trim();
    const color = colorInput.value.trim();
    const size = sizeInput.value;
    const variant = variantInput.value.trim();
    
    const sep = separatorSelect.value;
    const len = parseInt(attrLenSelect.value) || 3;

    // Get selected format radio
    let formatVal = "F1";
    formatRadios.forEach(radio => {
      if (radio.checked) formatVal = radio.value;
    });

    let sku = "";
    const nameAbbr = abbreviate(name, len);
    const catAbbr = abbreviate(cat, len);
    const brandAbbr = abbreviate(brand, len);
    const colorAbbr = abbreviate(color, len);
    const variantAbbr = abbreviate(variant, len);

    if (formatVal === "F1") {
      // CAT-BRAND-COLOR-SIZE-001
      const tokens = [catAbbr, brandAbbr, colorAbbr, size, serialNum];
      sku = tokens.filter(t => t && t.length > 0).join(sep);
    } else if (formatVal === "F2") {
      // BRAND-PRODUCT-001
      const tokens = [brandAbbr, nameAbbr, serialNum];
      sku = tokens.filter(t => t && t.length > 0).join(sep);
    } else {
      // CUSTOM FORMAT
      const patternEl = document.getElementById("skuCustomPattern");
      let pattern = patternEl ? patternEl.value.trim() : "{BRAND}-{CAT}-{COLOR}-{NUM}";
      
      sku = pattern
        .replace(/{PROD}/g, nameAbbr)
        .replace(/{CAT}/g, catAbbr)
        .replace(/{BRAND}/g, brandAbbr)
        .replace(/{COLOR}/g, colorAbbr)
        .replace(/{SIZE}/g, size)
        .replace(/{VAR}/g, variantAbbr)
        .replace(/{NUM}/g, serialNum);

      // Apply chosen separator (replace standard hyphens with chosen sep in custom format)
      if (sep !== "-") {
        sku = sku.replace(/-/g, sep);
      }
    }

    // Clean double separators and edge separators
    const doubleSepRegex = new RegExp(escapeRegExp(sep) + "+", "g");
    const edgeSepRegex = new RegExp("^" + escapeRegExp(sep) + "|" + escapeRegExp(sep) + "$", "g");
    sku = sku.replace(doubleSepRegex, sep).replace(edgeSepRegex, "");

    return sku;
  }

  // Regex escape helper
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');
  }

  // Form Validation
  function validateInputs() {
    let isValid = true;
    
    if (nameInput.value.trim().length === 0) {
      showHideErr("skuProductName", true);
      isValid = false;
    } else {
      showHideErr("skuProductName", false);
    }

    if (catInput.value === "") {
      showHideErr("skuProductCategory", true);
      isValid = false;
    } else {
      showHideErr("skuProductCategory", false);
    }

    if (brandInput.value.trim().length === 0) {
      showHideErr("skuBrand", true);
      isValid = false;
    } else {
      showHideErr("skuBrand", false);
    }

    if (!isValid) {
      alert("Please fill in all required fields (marked in red).");
    }

    return isValid;
  }

  // Show error states
  function showHideErr(id, isError) {
    const el = document.getElementById(id);
    const errEl = document.getElementById(id + "_err");
    if (!el) return;

    if (isError) {
      el.classList.add("error");
      if (errEl) errEl.style.display = "block";
    } else {
      el.classList.remove("error");
      if (errEl) errEl.style.display = "none";
    }
  }

  // Right Info Panel checklist highlights
  function strikeInfo(infoId, isFocused) {
    const infoEl = document.getElementById(infoId);
    let inputId = "";
    if (infoId === "compAddInfo") inputId = "skuProductName";
    else if (infoId === "clientAddInfo") inputId = "skuProductCategory";
    else if (infoId === "poNumberInfo") inputId = "skuBrand";
    else if (infoId === "itemInfo") inputId = "skuColor";

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
  }

  // Copy to clipboard with UI alert fallback
  function copyToClipboard(text, successMsg) {
    navigator.clipboard.writeText(text).then(() => {
      alert(successMsg);
    }).catch(err => {
      console.error("Clipboard copy failed:", err);
      // Fallback display
      alert("Copy failed. Please manually select and copy the code.");
    });
  }
});
