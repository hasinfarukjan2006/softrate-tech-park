/* Form W-9 Generator Interactive JavaScript Engine */

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
const W9Controller = {
  
  // Format TIN inputs as user types (SSN mask: 000-00-0000, EIN mask: 00-0000000)
  formatTIN: function(value, type) {
    const digits = value.replace(/\D/g, '').substring(0, 9);
    if (type === 'SSN') {
      if (digits.length > 5) {
        return digits.substring(0, 3) + '-' + digits.substring(3, 5) + '-' + digits.substring(5);
      } else if (digits.length > 3) {
        return digits.substring(0, 3) + '-' + digits.substring(3);
      }
      return digits;
    } else { // EIN
      if (digits.length > 2) {
        return digits.substring(0, 2) + '-' + digits.substring(2);
      }
      return digits;
    }
  },

  // Toggle Exemption codes visibility based on toggle state
  toggleExemptions: function() {
    const toggle = document.getElementById('w9_exempt_toggle');
    const block = document.getElementById('w9_exempt_codes_block');
    if (toggle && block) {
      if (toggle.checked) {
        block.classList.remove('hide');
      } else {
        block.classList.add('hide');
        document.getElementById('w9_exempt_payee_code').value = '';
        document.getElementById('w9_fatca_code').value = '';
      }
    }
  },

  // Toggle LLC classification field visibility based on business type selection
  toggleLlcClassification: function() {
    const bizType = document.getElementById('w9_business_type').value;
    const block = document.getElementById('w9_llc_classification_group');
    if (block) {
      if (bizType === 'Limited Liability Company (LLC)') {
        block.classList.remove('hide');
      } else {
        block.classList.add('hide');
        document.getElementById('w9_llc_class').value = '';
      }
    }
  },

  // Validate form fields, TIN formats, and certifications
  validateForm: function() {
    let isValid = true;

    // Reset error styling
    document.querySelectorAll('.error-msg-w9').forEach(el => el.classList.add('hide'));

    // Name Validation
    const legalName = document.getElementById('w9_legal_name').value.trim();
    if (!legalName) {
      document.getElementById('w9_legal_name_err').classList.remove('hide');
      isValid = false;
    }

    // Street Address Validation
    const street = document.getElementById('w9_street').value.trim();
    if (!street) {
      document.getElementById('w9_street_err').classList.remove('hide');
      isValid = false;
    }

    // City Validation
    const city = document.getElementById('w9_city').value.trim();
    if (!city) {
      document.getElementById('w9_city_err').classList.remove('hide');
      isValid = false;
    }

    // State Validation
    const state = document.getElementById('w9_state').value;
    if (!state) {
      document.getElementById('w9_state_err').classList.remove('hide');
      isValid = false;
    }

    // ZIP Validation
    const zip = document.getElementById('w9_zip').value.trim();
    const zipRegex = /^\d{5}(-\d{4})?$/;
    if (!zip || !zipRegex.test(zip)) {
      document.getElementById('w9_zip_err').classList.remove('hide');
      isValid = false;
    }

    // TIN Validation
    const tinType = document.getElementById('w9_tin_type').value;
    const tinVal = document.getElementById('w9_tin_val').value.trim();
    const ssnRegex = /^\d{3}-\d{2}-\d{4}$/;
    const einRegex = /^\d{2}-\d{7}$/;

    if (tinType === 'SSN') {
      if (!ssnRegex.test(tinVal)) {
        const errEl = document.getElementById('w9_tin_val_err');
        errEl.textContent = "Please enter a valid SSN (format: 000-00-0000).";
        errEl.classList.remove('hide');
        isValid = false;
      }
    } else {
      if (!einRegex.test(tinVal)) {
        const errEl = document.getElementById('w9_tin_val_err');
        errEl.textContent = "Please enter a valid EIN (format: 00-0000000).";
        errEl.classList.remove('hide');
        isValid = false;
      }
    }

    // LLC Classification code Validation
    const bizType = document.getElementById('w9_business_type').value;
    if (bizType === 'Limited Liability Company (LLC)') {
      const llcClass = document.getElementById('w9_llc_class').value;
      if (!llcClass) {
        document.getElementById('w9_llc_class_err').classList.remove('hide');
        isValid = false;
      }
    }

    // Certifications Validation
    const cert1 = document.getElementById('w9_cert1').checked;
    const cert2 = document.getElementById('w9_cert2').checked;
    const cert3 = document.getElementById('w9_cert3').checked;
    if (!cert1 || !cert2 || !cert3) {
      document.getElementById('w9_certifications_err').classList.remove('hide');
      isValid = false;
    }

    return isValid;
  },

  // Process form, render data to W-9 preview sheet, and display preview
  generateW9: function() {
    if (!this.validateForm()) {
      // Scroll to first error
      const firstErr = document.querySelector('.error-msg-w9:not(.hide)');
      if (firstErr) {
        firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Populate lines on paper sheet
    const legalName = document.getElementById('w9_legal_name').value.trim();
    const businessName = document.getElementById('w9_business_name').value.trim();
    const street = document.getElementById('w9_street').value.trim();
    const city = document.getElementById('w9_city').value.trim();
    const state = document.getElementById('w9_state').value;
    const zip = document.getElementById('w9_zip').value.trim();
    const tinType = document.getElementById('w9_tin_type').value;
    const tinVal = document.getElementById('w9_tin_val').value.trim();
    const bizType = document.getElementById('w9_business_type').value;

    document.getElementById('pdf_legal_name').textContent = legalName;
    document.getElementById('pdf_business_name').textContent = businessName || '';
    document.getElementById('pdf_street').textContent = street;
    document.getElementById('pdf_city_state_zip').textContent = `${city}, ${state} ${zip}`;

    // Reset classification boxes
    const checkBoxes = ['pdf_box_individual', 'pdf_box_ccorp', 'pdf_box_scorp', 'pdf_box_partnership', 'pdf_box_trust', 'pdf_box_llc', 'pdf_box_other'];
    checkBoxes.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('checked');
    });
    document.getElementById('pdf_llc_code').innerHTML = '&nbsp;';

    // Check correct classification
    if (bizType === 'Individual / Sole Proprietor') {
      document.getElementById('pdf_box_individual').classList.add('checked');
    } else if (bizType === 'C Corporation') {
      document.getElementById('pdf_box_ccorp').classList.add('checked');
    } else if (bizType === 'S Corporation') {
      document.getElementById('pdf_box_scorp').classList.add('checked');
    } else if (bizType === 'Partnership') {
      document.getElementById('pdf_box_partnership').classList.add('checked');
    } else if (bizType === 'Trust / Estate') {
      document.getElementById('pdf_box_trust').classList.add('checked');
    } else if (bizType === 'Limited Liability Company (LLC)') {
      document.getElementById('pdf_box_llc').classList.add('checked');
      document.getElementById('pdf_llc_code').textContent = document.getElementById('w9_llc_class').value;
    } else {
      document.getElementById('pdf_box_other').classList.add('checked');
    }

    // Exemption codes
    const exemptToggle = document.getElementById('w9_exempt_toggle').checked;
    if (exemptToggle) {
      document.getElementById('pdf_exempt_payee').textContent = document.getElementById('w9_exempt_payee_code').value || '-';
      document.getElementById('pdf_exempt_fatca').textContent = document.getElementById('w9_fatca_code').value || '-';
    } else {
      document.getElementById('pdf_exempt_payee').textContent = '-';
      document.getElementById('pdf_exempt_fatca').textContent = '-';
    }

    // TIN Display
    const ssnBoxes = document.getElementById('pdf_ssn_boxes');
    const einBoxes = document.getElementById('pdf_ein_boxes');
    const digits = tinVal.replace(/\D/g, '');

    if (tinType === 'SSN') {
      einBoxes.style.display = 'none';
      ssnBoxes.style.display = 'flex';
      const boxes = ssnBoxes.querySelectorAll('.tin-box');
      for (let i = 0; i < boxes.length; i++) {
        boxes[i].textContent = digits[i] || '';
      }
    } else {
      ssnBoxes.style.display = 'none';
      einBoxes.style.display = 'flex';
      const boxes = einBoxes.querySelectorAll('.tin-box');
      for (let i = 0; i < boxes.length; i++) {
        boxes[i].textContent = digits[i] || '';
      }
    }

    // Signature and Date Display
    document.getElementById('pdf_sig_display').textContent = legalName;
    
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const yyyy = today.getFullYear();
    document.getElementById('pdf_date_display').textContent = `${mm}/${dd}/${yyyy}`;

    // Show preview panel and hide form panels
    document.getElementById('w9-form-container').classList.add('hide');
    document.getElementById('w9-preview-container').classList.remove('hide');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  // Return to editing panel
  editForm: function() {
    document.getElementById('w9-preview-container').classList.add('hide');
    document.getElementById('w9-form-container').classList.remove('hide');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  // Print Form
  printForm: function() {
    window.print();
  },

  // Reset form inputs and clear values
  resetForm: function() {
    document.getElementById('w9Form').reset();
    this.toggleExemptions();
    this.toggleLlcClassification();
    document.querySelectorAll('.error-msg-w9').forEach(el => el.classList.add('hide'));
  },

  // Export filled document to PDF
  downloadPDF: function() {
    const docSheet = document.getElementById('w9-paper-sheet');
    if (!docSheet) return;

    const downloadBtn = document.querySelector('#w9-preview-container button[onclick*="downloadPDF"]');
    const originalText = downloadBtn.textContent;
    downloadBtn.textContent = 'Generating PDF...';
    downloadBtn.disabled = true;

    loadHtml2Canvas(() => {
      html2canvas(docSheet, {
        scale: 2, // 2x quality render scaling
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
      }).then(canvas => {
        try {
          const imgData = canvas.toDataURL('image/jpeg', 1.0);
          const { jsPDF } = window.jspdf;

          // IRS standard Form W-9 is US Letter Size
          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'in',
            format: 'letter'
          });

          const pdfWidth = 8.5;  // US Letter width in inches
          const pdfHeight = 11.0; // US Letter height in inches

          pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

          const legalName = document.getElementById('w9_legal_name').value.trim();
          const safeName = legalName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
          pdf.save(`w9_form_${safeName}.pdf`);
        } catch (err) {
          console.error('PDF Conversion error:', err);
          alert('Could not export PDF automatically. Please use the Print Form button and choose Save as PDF instead.');
        } finally {
          downloadBtn.textContent = originalText;
          downloadBtn.disabled = false;
        }
      });
    });
  }
};

// Bind elements and dynamic events on load
document.addEventListener('DOMContentLoaded', () => {
  const tinType = document.getElementById('w9_tin_type');
  const tinInput = document.getElementById('w9_tin_val');

  if (tinType && tinInput) {
    // Dynamic placeholder change
    tinType.addEventListener('change', () => {
      const type = tinType.value;
      tinInput.placeholder = type === 'SSN' ? 'Enter the SSN' : 'Enter the EIN';
      tinInput.value = W9Controller.formatTIN(tinInput.value, type);
    });

    // Dynamic masking as typing
    tinInput.addEventListener('input', (e) => {
      const type = tinType.value;
      const cursor = e.target.selectionStart;
      const prevLen = e.target.value.length;
      
      e.target.value = W9Controller.formatTIN(e.target.value, type);
      
      // Auto-jump cursors if formatting dashes are injected
      const nextLen = e.target.value.length;
      if (cursor && nextLen > prevLen && e.target.value[cursor - 1] === '-') {
        e.target.setSelectionRange(cursor + 1, cursor + 1);
      } else if (cursor) {
        e.target.setSelectionRange(cursor, cursor);
      }
    });
  }

  // Clear single validation error states as user modifies inputs
  const inputs = document.querySelectorAll('#w9Form input, #w9Form select');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      const errId = input.id + '_err';
      const errEl = document.getElementById(errId);
      if (errEl) errEl.classList.add('hide');

      if (input.type === 'checkbox' && input.id.startsWith('w9_cert')) {
        document.getElementById('w9_certifications_err').classList.add('hide');
      }
    });

    input.addEventListener('change', () => {
      const errId = input.id + '_err';
      const errEl = document.getElementById(errId);
      if (errEl) errEl.classList.add('hide');

      if (input.id === 'w9_llc_class') {
        document.getElementById('w9_llc_class_err').classList.add('hide');
      }
    });
  });

  // FAQ Accordion click handlers
  const faqTriggers = document.querySelectorAll('.w9-faq-trigger');
  faqTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.w9-faq-item');
      const content = item.querySelector('.w9-faq-content');
      const isActive = item.classList.contains('active');

      // Close other items
      document.querySelectorAll('.w9-faq-item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherContent = otherItem.querySelector('.w9-faq-content');
          if (otherContent) otherContent.style.display = 'none';
        }
      });

      // Toggle current item
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
window.W9Controller = W9Controller;
