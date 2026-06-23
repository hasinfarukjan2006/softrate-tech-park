/* ============================================================
   SHIPPING LABEL GENERATOR — Interactive Logic
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Bind FAQ Accordion toggle
  initFaqAccordion();

  // Bind Get PDF button export
  const getPdfBtn = document.getElementById('slGetPdfBtn');
  if (getPdfBtn) {
    getPdfBtn.addEventListener('click', exportLabelToPdf);
  }
});

/**
 * FAQ Accordion logic
 */
function initFaqAccordion() {
  const triggers = document.querySelectorAll('.sl-faq-trigger');
  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.sl-faq-item');
      if (!item) return;

      const content = item.querySelector('.sl-faq-content');
      const isActive = item.classList.contains('active');

      // Close all other items
      document.querySelectorAll('.sl-faq-item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherContent = otherItem.querySelector('.sl-faq-content');
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
}

/**
 * Load html2canvas library dynamically at runtime
 */
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

/**
 * Export Shipping Label Card as a 4x6 pdf using jsPDF and html2canvas
 */
function exportLabelToPdf() {
  const getPdfBtn = document.getElementById('slGetPdfBtn');
  const labelCard = document.getElementById('shippingLabelCard');
  if (!labelCard || !getPdfBtn) return;

  // Show loading state
  const originalText = getPdfBtn.innerHTML;
  getPdfBtn.disabled = true;
  getPdfBtn.innerHTML = 'Generating PDF...';

  loadHtml2Canvas(() => {
    // Standard 4x6 inches aspect ratio
    // Use html2canvas to capture the card
    html2canvas(labelCard, {
      scale: 3, // high print quality
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false
    }).then(canvas => {
      try {
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const { jsPDF } = window.jspdf;
        
        // Create 4x6 inches PDF
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'in',
          format: [4, 6]
        });

        // Add captured image spanning the full page
        pdf.addImage(imgData, 'JPEG', 0, 0, 4, 6);
        
        // Save PDF
        const trackingId = document.getElementById('slTrackingId')?.textContent?.trim() || 'Label';
        pdf.save(`Shipping_Label_${trackingId}.pdf`);
      } catch (err) {
        console.error('PDF creation error:', err);
        alert('An error occurred during PDF generation. Triggering standard page print instead.');
        window.print();
      } finally {
        getPdfBtn.disabled = false;
        getPdfBtn.innerHTML = originalText;
      }
    }).catch(err => {
      console.error('html2canvas capture error:', err);
      alert('Could not capture shipping label. Triggering standard page print instead.');
      window.print();
      getPdfBtn.disabled = false;
      getPdfBtn.innerHTML = originalText;
    });
  });
}
