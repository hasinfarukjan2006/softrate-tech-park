/* ============================================================
   PACKING SLIP GENERATOR — Direct Document Editing & Logic
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // State tracking
  let isInitialized = false;

  // Initial defaults
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const defaultDetails = {
    sellerCompany: '',
    sellerAddress: '',
    sellerPhone: '',
    sellerEmail: '',
    sellerGstin: '',
    custName: '',
    custAddress: '',
    custPhone: '',
    custEmail: '',
    slipNum: '',
    orderNum: '',
    orderDate: '',
    shipDate: '',
    carrier: '',
    trackingNum: '',
    notes: ''
  };

  const defaultItems = [
    { name: '', sku: '', desc: '', qtyOrd: '', qtyPack: '', weight: '', remarks: '' }
  ];

  // Core setup function
  function initPackingSlip() {
    if (isInitialized) return;

    setDocumentDefaults();
    bindEvents();
    initFaqAccordion();
    isInitialized = true;
  }

  // Set document default content
  function setDocumentDefaults() {
    // FROM / Seller Details
    setSafeText('psSellerCompany', defaultDetails.sellerCompany);
    setSafeText('psSellerAddress', defaultDetails.sellerAddress);
    setSafeText('psSellerPhone', defaultDetails.sellerPhone);
    setSafeText('psSellerEmail', defaultDetails.sellerEmail);
    setSafeText('psSellerGstin', defaultDetails.sellerGstin);

    // SHIP TO / Customer Details
    setSafeText('psCustName', defaultDetails.custName);
    setSafeText('psCustAddress', defaultDetails.custAddress);
    setSafeText('psCustPhone', defaultDetails.custPhone);
    setSafeText('psCustEmail', defaultDetails.custEmail);

    // Order Metadata
    setSafeText('psSlipNum', defaultDetails.slipNum);
    setSafeText('psOrderNum', defaultDetails.orderNum);
    setSafeText('psOrderDate', defaultDetails.orderDate);
    setSafeText('psShipDate', defaultDetails.shipDate);
    setSafeText('psCarrier', defaultDetails.carrier);
    setSafeText('psTrackingNum', defaultDetails.trackingNum);

    // Footer & Signature
    setSafeText('psNotes', defaultDetails.notes);
    setSafeText('psSigCompany', defaultDetails.sellerCompany);

    // Clear and build initial item table rows
    const tbody = document.getElementById('psItemsBody');
    if (tbody) {
      tbody.innerHTML = '';
      defaultItems.forEach(item => {
        addItemRow(item.name, item.sku, item.desc, item.qtyOrd, item.qtyPack, item.weight, item.remarks);
      });
    }

    recalculateTotals();
  }

  // Set element text content safely if element exists
  function setSafeText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  // Bind key actions and listeners
  function bindEvents() {
    // Add item row button
    const addItemRowBtn = document.getElementById('psAddItemRowBtn');
    if (addItemRowBtn) {
      addItemRowBtn.addEventListener('click', () => {
        addItemRow();
      });
    }

    // Sync company name to signature company on typing
    const sellerCompanyEl = document.getElementById('psSellerCompany');
    if (sellerCompanyEl) {
      sellerCompanyEl.addEventListener('input', () => {
        setSafeText('psSigCompany', sellerCompanyEl.textContent);
      });
    }

    // Recalculate totals via event delegation on input changes in table body
    const tbody = document.getElementById('psItemsBody');
    if (tbody) {
      tbody.addEventListener('input', (e) => {
        if (e.target.classList.contains('ps-item-qty-pack-cell') || e.target.classList.contains('ps-item-weight-cell')) {
          recalculateTotals();
        }
      });
    }

    // Print button
    const printBtn = document.getElementById('psPrintBtn');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }

    // Get PDF button
    const getPdfBtn = document.getElementById('psGetPdfBtn');
    if (getPdfBtn) {
      getPdfBtn.addEventListener('click', exportPdf);
    }

    // Reset button
    const resetBtn = document.getElementById('psResetBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all document fields back to defaults?')) {
          setDocumentDefaults();
        }
      });
    }
  }

  // Add editable row to items table
  function addItemRow(name = '', sku = '', desc = '', qtyOrd = '0', qtyPack = '0', weight = '0.00', remarks = '') {
    const tbody = document.getElementById('psItemsBody');
    if (!tbody) return;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="ps-item-index" style="text-align: center; font-weight: bold;"></td>
      <td contenteditable="true" class="ps-item-name-cell">${name}</td>
      <td contenteditable="true" class="ps-item-sku-cell">${sku}</td>
      <td contenteditable="true" class="ps-item-desc-cell">${desc}</td>
      <td contenteditable="true" class="ps-item-qty-ord-cell text-right">${qtyOrd}</td>
      <td contenteditable="true" class="ps-item-qty-pack-cell text-right">${qtyPack}</td>
      <td contenteditable="true" class="ps-item-weight-cell text-right">${weight}</td>
      <td contenteditable="true" class="ps-item-remarks-cell">${remarks}</td>
      <td class="ps-no-print" style="text-align: center; vertical-align: middle;">
        <button type="button" class="ps-btn-delete-row" title="Delete Row">
          <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
        </button>
      </td>
    `;

    // Row delete event binding
    const deleteBtn = tr.querySelector('.ps-btn-delete-row');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        tr.remove();
        updateRowIndices();
        recalculateTotals();
        updateDeleteButtonsState();
      });
    }

    tbody.appendChild(tr);
    updateRowIndices();
    recalculateTotals();
    updateDeleteButtonsState();

    if (window.lucide) window.lucide.createIcons();
  }

  // Update indices for all rows
  function updateRowIndices() {
    const rows = document.querySelectorAll('#psItemsBody tr');
    rows.forEach((row, idx) => {
      const indexCell = row.querySelector('.ps-item-index');
      if (indexCell) indexCell.textContent = idx + 1;
    });
  }

  // Lock row deletion if there's only 1 row left
  function updateDeleteButtonsState() {
    const rows = document.querySelectorAll('#psItemsBody tr');
    rows.forEach(row => {
      const btn = row.querySelector('.ps-btn-delete-row');
      if (btn) {
        btn.disabled = (rows.length <= 1);
      }
    });
  }

  // Live calculation of quantities and weights
  function recalculateTotals() {
    const rows = document.querySelectorAll('#psItemsBody tr');
    let totalQty = 0;
    let totalWeight = 0;

    rows.forEach(row => {
      const qtyCell = row.querySelector('.ps-item-qty-pack-cell');
      const weightCell = row.querySelector('.ps-item-weight-cell');

      const qtyText = qtyCell ? qtyCell.textContent.trim() : '0';
      const weightText = weightCell ? weightCell.textContent.trim() : '0.00';

      // Parse safely, stripping non-numeric letters
      const qty = parseInt(qtyText.replace(/[^0-9-]/g, '')) || 0;
      const weight = parseFloat(weightText.replace(/[^0-9.-]/g, '')) || 0.0;

      totalQty += qty;
      totalWeight += weight;
    });

    setSafeText('psTotalQty', totalQty);
    setSafeText('psTotalWeight', totalWeight.toFixed(2) + ' kg');
  }

  // FAQ accordion logic
  function initFaqAccordion() {
    const triggers = document.querySelectorAll('#packing-slip-section .bc-faq-trigger');
    triggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest('.ps-faq-item');
        if (!item) return;

        const content = item.querySelector('.bc-faq-content');
        const isActive = item.classList.contains('active');

        // Close other accordion items in this section
        document.querySelectorAll('#packing-slip-section .ps-faq-item').forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherContent = otherItem.querySelector('.bc-faq-content');
            if (otherContent) otherContent.style.display = 'none';
          }
        });

        // Toggle current accordion item
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

  // Load html2canvas dynamically
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

  // Export packing slip to PDF
  function exportPdf() {
    const docSheet = document.getElementById('packingSlipDocument');
    if (!docSheet) return;

    const getPdfBtn = document.getElementById('psGetPdfBtn');
    const originalText = getPdfBtn ? getPdfBtn.innerHTML : 'Get PDF';
    
    if (getPdfBtn) {
      getPdfBtn.disabled = true;
      getPdfBtn.innerHTML = '<span class="loading-spinner" style="display:inline-block; width:12px; height:12px; border:2px solid #fff; border-top-color:transparent; border-radius:50%; animation:spin 1s linear infinite; margin-right:6px;"></span> Generating PDF...';
    }

    // Hide edit outlines and controls temporarily for capture
    docSheet.classList.add('ps-rendering-pdf');

    loadHtml2Canvas(() => {
      html2canvas(docSheet, {
        scale: 3, // Premium quality render scaling
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
      }).then(canvas => {
        try {
          const imgData = canvas.toDataURL('image/jpeg', 1.0);
          const { jsPDF } = window.jspdf;

          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'in',
            format: 'a4'
          });

          const pdfWidth = 8.27; // A4 standard width in inches
          const pdfHeight = 11.69; // A4 standard height in inches
          
          const imgWidth = pdfWidth;
          const imgHeight = (canvas.height * pdfWidth) / canvas.width;
          
          let finalHeight = imgHeight;
          let finalWidth = imgWidth;
          
          // Fit page constraint
          if (imgHeight > pdfHeight) {
            finalHeight = pdfHeight;
            finalWidth = (canvas.width * pdfHeight) / canvas.height;
          }

          const xOffset = (pdfWidth - finalWidth) / 2;
          const yOffset = (pdfHeight - finalHeight) / 2;

          pdf.addImage(imgData, 'JPEG', xOffset, yOffset, finalWidth, finalHeight);
          
          const slipNum = document.getElementById('psSlipNum')?.textContent?.trim() || 'PS-Document';
          pdf.save(`Packing_Slip_${slipNum}.pdf`);
        } catch (err) {
          console.error('PDF creation error:', err);
          alert('An error occurred during PDF generation. Triggering standard page print instead.');
          window.print();
        } finally {
          docSheet.classList.remove('ps-rendering-pdf');
          if (getPdfBtn) {
            getPdfBtn.disabled = false;
            getPdfBtn.innerHTML = originalText;
          }
        }
      }).catch(err => {
        console.error('html2canvas capture error:', err);
        alert('Could not capture document. Triggering standard page print instead.');
        window.print();
        docSheet.classList.remove('ps-rendering-pdf');
        if (getPdfBtn) {
          getPdfBtn.disabled = false;
          getPdfBtn.innerHTML = originalText;
        }
      });
    });
  }

  // Trigger initialization
  initPackingSlip();

  // Listen to custom route load event in SPA router
  document.addEventListener('packingSlipRouteLoaded', () => {
    initPackingSlip();
  });
});

// Inline keyframe helper for the loading spinner if not present
if (!document.getElementById('ps-spinner-style')) {
  const style = document.createElement('style');
  style.id = 'ps-spinner-style';
  style.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}
