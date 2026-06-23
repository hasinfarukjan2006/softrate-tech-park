/* ============================================================
   BARCODE GENERATOR — Interactive Logic
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Bind FAQ Accordion
  initFaqAccordion();

  // Input elements
  const prodNameInput = document.getElementById('bcProductName');
  const skuInput = document.getElementById('bcSku');
  const priceInput = document.getElementById('bcPrice');
  const valueInput = document.getElementById('bcValue');
  const typeSelect = document.getElementById('bcType');
  const qtyInput = document.getElementById('bcQuantity');
  const companyInput = document.getElementById('bcCompany');
  const notesTextarea = document.getElementById('bcNotes');

  // Error elements
  const errorMsg = document.getElementById('bcErrorMsg');
  const errorText = document.getElementById('bcErrorText');

  // Action Buttons
  const generateBtn = document.getElementById('bcGenerateBtn');
  const resetBtn = document.getElementById('bcResetBtn');
  const downloadPngBtn = document.getElementById('bcDownloadPngBtn');
  const downloadSvgBtn = document.getElementById('bcDownloadSvgBtn');
  const printBtn = document.getElementById('bcPrintBtn');
  const copyValBtn = document.getElementById('bcCopyValBtn');

  // 1. Initial State
  const defaultValues = {
    productName: '',
    sku: '',
    price: '',
    barcodeValue: '',
    barcodeType: '',
    quantity: '',
    companyName: '',
    notes: ''
  };

  function setFormDefaults() {
    prodNameInput.value = defaultValues.productName;
    skuInput.value = defaultValues.sku;
    priceInput.value = defaultValues.price;
    valueInput.value = defaultValues.barcodeValue;
    typeSelect.value = defaultValues.barcodeType;
    qtyInput.value = defaultValues.quantity;
    companyInput.value = defaultValues.companyName;
    notesTextarea.value = defaultValues.notes;
    hideError();
  }

  // 2. Setup Events
  setFormDefaults();

  // Real-time synchronization on input
  const liveInputs = [prodNameInput, skuInput, priceInput, companyInput, notesTextarea, qtyInput];
  liveInputs.forEach(input => {
    input.addEventListener('input', () => {
      generateBarcodes(false); // Update preview without screaming validation errors
    });
  });

  // For barcode value and type, we validate on input/change
  valueInput.addEventListener('input', () => {
    // Auto-uppercase if CODE39
    if (typeSelect.value === 'CODE39') {
      valueInput.value = valueInput.value.toUpperCase();
    }
    // Live update preview if valid
    const validation = validateValue(valueInput.value, typeSelect.value);
    if (validation.isValid) {
      hideError();
      generateBarcodes(false);
    }
  });

  valueInput.addEventListener('blur', () => {
    // Show validation error on blur
    const validation = validateValue(valueInput.value, typeSelect.value);
    if (!validation.isValid) {
      showError(validation.message);
    }
  });

  typeSelect.addEventListener('change', () => {
    // Change help text
    updateHelpText(typeSelect.value);
    
    // Auto-uppercase if CODE39
    if (typeSelect.value === 'CODE39') {
      valueInput.value = valueInput.value.toUpperCase();
    }

    // Force validation immediately on type change
    const validation = validateValue(valueInput.value, typeSelect.value);
    if (!validation.isValid) {
      showError(validation.message);
    } else {
      hideError();
      generateBarcodes(false);
    }
  });

  // Button actions
  generateBtn.addEventListener('click', () => {
    generateBarcodes(true); // Scream errors on manual click
  });

  resetBtn.addEventListener('click', () => {
    setFormDefaults();
    generateBarcodes(true);
  });

  downloadSvgBtn.addEventListener('click', exportSvg);
  downloadPngBtn.addEventListener('click', exportPng);
  printBtn.addEventListener('click', () => {
    window.print();
  });

  copyValBtn.addEventListener('click', () => {
    const val = valueInput.value.trim();
    if (!val) return;
    navigator.clipboard.writeText(val).then(() => {
      const originalText = copyValBtn.innerHTML;
      copyValBtn.innerHTML = '<i data-lucide="check"></i> Copied!';
      if (window.lucide) window.lucide.createIcons();
      setTimeout(() => {
        copyValBtn.innerHTML = originalText;
        if (window.lucide) window.lucide.createIcons();
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  });

  // 3. Validation Rules
  function validateValue(value, type) {
    if (!value) {
      return { isValid: false, message: 'Barcode value is required.' };
    }

    switch (type) {
      case 'CODE128':
        // Standard ASCII
        if (!/^[\x00-\x7F]+$/.test(value)) {
          return { isValid: false, message: 'CODE128 accepts standard alphanumeric characters and symbols.' };
        }
        break;
      case 'EAN13':
        // 12 or 13 digits
        if (!/^\d{12,13}$/.test(value)) {
          return { isValid: false, message: 'EAN13 requires exactly 12 or 13 numeric digits.' };
        }
        break;
      case 'UPC':
        // 11 or 12 digits
        if (!/^\d{11,12}$/.test(value)) {
          return { isValid: false, message: 'UPC requires exactly 11 or 12 numeric digits.' };
        }
        break;
      case 'CODE39':
        // uppercase alphanumeric + symbols: space, -, ., $, /, +, %
        if (!/^[0-9A-Z\-.\s$/+%]*$/.test(value)) {
          return { isValid: false, message: 'CODE39 accepts uppercase letters, numbers, and symbols (- . $ / + % space).' };
        }
        break;
      case 'ITF':
        // Numeric digits only, even length
        if (!/^\d+$/.test(value)) {
          return { isValid: false, message: 'ITF requires numeric digits only.' };
        }
        if (value.length % 2 !== 0) {
          return { isValid: false, message: 'ITF requires an even number of digits.' };
        }
        break;
      default:
        break;
    }

    return { isValid: true, message: '' };
  }

  function updateHelpText(type) {
    const help = document.getElementById('bcValueHelp');
    if (!help) return;
    switch (type) {
      case 'CODE128':
        help.textContent = 'Accepts all standard letters, numbers, and symbols.';
        break;
      case 'EAN13':
        help.textContent = 'Enter 12 digits (generator will compute 13th checksum digit) or all 13 digits.';
        break;
      case 'UPC':
        help.textContent = 'Enter 11 digits (generator will compute 12th checksum digit) or all 12 digits.';
        break;
      case 'CODE39':
        help.textContent = 'Accepts uppercase letters, numbers, space, and symbols: - . $ / + %';
        break;
      case 'ITF':
        help.textContent = 'Requires an even number of numeric digits (digits only).';
        break;
      default:
        help.textContent = '';
        break;
    }
  }

  // 4. Generation Core
  function generateBarcodes(showValidationError = true) {
    const prodName = prodNameInput.value.trim() || 'Product Name';
    const sku = skuInput.value.trim() || 'SKU';
    const price = priceInput.value.trim();
    const barcodeVal = valueInput.value.trim();
    const barcodeType = typeSelect.value;
    const qty = parseInt(qtyInput.value) || 1;
    const company = companyInput.value.trim() || 'SOFTRATE TECH PARK';
    const notes = notesTextarea.value.trim();

    if (!barcodeType) {
      if (showValidationError) {
        showError('Barcode type is required.');
      }
      return;
    }

    // Validate
    const validation = validateValue(barcodeVal, barcodeType);
    if (!validation.isValid) {
      if (showValidationError) {
        showError(validation.message);
      }
      return;
    }
    hideError();

    const wrapper = document.getElementById('bcLabelsWrapper');
    if (!wrapper) return;
    wrapper.innerHTML = '';

    // Generate Label Cards
    for (let i = 0; i < qty; i++) {
      const labelCard = document.createElement('div');
      labelCard.className = 'bc-label-item';

      const compDiv = document.createElement('div');
      compDiv.className = 'bc-label-company';
      compDiv.textContent = company.toUpperCase();
      labelCard.appendChild(compDiv);

      const titleDiv = document.createElement('div');
      titleDiv.className = 'bc-label-prod-name';
      titleDiv.textContent = prodName;
      labelCard.appendChild(titleDiv);

      const svgContainer = document.createElement('div');
      svgContainer.className = 'bc-svg-container';
      
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.className = 'bc-barcode-svg';
      svgContainer.appendChild(svg);
      labelCard.appendChild(svgContainer);

      const skuDiv = document.createElement('div');
      skuDiv.className = 'bc-label-sku';
      skuDiv.textContent = `SKU: ${sku}`;
      labelCard.appendChild(skuDiv);

      if (price) {
        const priceDiv = document.createElement('div');
        priceDiv.className = 'bc-label-price';
        priceDiv.textContent = `Price: ${price}`;
        labelCard.appendChild(priceDiv);
      }

      if (notes) {
        const notesDiv = document.createElement('div');
        notesDiv.className = 'bc-label-notes';
        notesDiv.style.fontSize = '0.75rem';
        notesDiv.style.color = '#6b7280';
        notesDiv.style.marginTop = '4px';
        notesDiv.textContent = notes;
        labelCard.appendChild(notesDiv);
      }

      wrapper.appendChild(labelCard);

      // Render barcode on SVG element
      try {
        window.JsBarcode(svg, barcodeVal, {
          format: barcodeType,
          displayValue: false, // label text displayed cleanly via HTML
          width: 2,
          height: 60,
          margin: 10,
          background: '#ffffff',
          lineColor: '#000000'
        });
      } catch (err) {
        console.error('JsBarcode render error:', err);
        if (showValidationError) {
          showError(`Render Error: ${err.message || 'Invalid format check'}`);
        }
        return;
      }
    }
  }

  function showError(msg) {
    errorText.textContent = msg;
    errorMsg.classList.remove('hide');
  }

  function hideError() {
    errorMsg.classList.add('hide');
  }

  // 5. Exports (PNG/SVG)
  function exportSvg() {
    const svgElement = document.querySelector('#bcLabelsWrapper .bc-barcode-svg');
    if (!svgElement) {
      alert('Generate a valid barcode before downloading.');
      return;
    }
    const val = valueInput.value.trim();
    
    try {
      const serializer = new XMLSerializer();
      let source = serializer.serializeToString(svgElement);
      
      if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
      }
      if (!source.match(/^<svg[^>]+xml/)) {
        source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
      }
      
      const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `Barcode_${val}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert('Could not export SVG file.');
    }
  }

  function exportPng() {
    const svgElement = document.querySelector('#bcLabelsWrapper .bc-barcode-svg');
    if (!svgElement) {
      alert('Generate a valid barcode before downloading.');
      return;
    }
    const val = valueInput.value.trim();

    try {
      const serializer = new XMLSerializer();
      let source = serializer.serializeToString(svgElement);
      if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
      }

      const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const bbox = svgElement.getBoundingClientRect();
        
        // Use a scale multiplier for clear high-res render
        const scale = 3;
        canvas.width = (bbox.width || 300) * scale;
        canvas.height = (bbox.height || 100) * scale;

        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0, bbox.width || 300, bbox.height || 100);

        const pngUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = pngUrl;
        a.download = `Barcode_${val}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      };
      img.src = url;
    } catch (e) {
      console.error(e);
      alert('Could not export PNG file.');
    }
  }

  // FAQ Accordion Toggle
  function initFaqAccordion() {
    const triggers = document.querySelectorAll('.bc-faq-trigger');
    triggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest('.bc-faq-item');
        if (!item) return;

        const content = item.querySelector('.bc-faq-content');
        const isActive = item.classList.contains('active');

        // Close all other FAQ items
        document.querySelectorAll('.bc-faq-item').forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherContent = otherItem.querySelector('.bc-faq-content');
            if (otherContent) otherContent.style.display = 'none';
          }
        });

        // Toggle clicked item
        if (isActive) {
          item.classList.remove('active');
          if (content) content.style.display = 'none';
        } else {
          item.classList.add('active');
          if (content) content.style.display = 'block';
        }
      });
    });
  }
});
