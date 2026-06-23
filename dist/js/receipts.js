/* receipts.js — Client-side dynamic logic for Receipt Generator */
document.addEventListener("DOMContentLoaded", function() {
  const container = document.getElementById("receipts-section");
  if (!container) return;

  const amtInput = document.getElementById("recAmount");
  const totalVal = document.getElementById("recTotalVal");
  const printBtn = document.getElementById("recPrint");
  const pdfBtn = document.getElementById("recPDF");
  const resetBtn = document.getElementById("recReset");

  // Set today's date
  const dt = new Date();
  const yr = dt.getFullYear();
  const mo = String(dt.getMonth() + 1).padStart(2, "0");
  const dy = String(dt.getDate()).padStart(2, "0");
  document.getElementById("recDate").value = `${yr}-${mo}-${dy}`;

  function fmt(n) {
    return "\u00A3" + Math.abs(n).toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function calc() {
    const amt = parseFloat(amtInput.value) || 0;
    totalVal.textContent = fmt(amt);
  }

  amtInput.addEventListener("input", calc);

  printBtn.addEventListener("click", function() {
    window.print();
  });

  resetBtn.addEventListener("click", function() {
    document.getElementById("receiptForm").reset();
    document.getElementById("recDate").value = `${yr}-${mo}-${dy}`;
    calc();
  });

  pdfBtn.addEventListener("click", function() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const primaryColor = "#1a3b6b";

    // Border around receipt
    doc.rect(10, 10, 190, 130);

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(primaryColor);
    doc.text("PAYMENT RECEIPT", 105, 25, { align: "center" });

    // Meta details
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor("#444");
    doc.text(`Receipt #: ${document.getElementById("recNumber").value}`, 15, 40);
    doc.text(`Date: ${document.getElementById("recDate").value}`, 15, 46);
    doc.text(`Payment Method: ${document.getElementById("recMethod").value}`, 15, 52);
    doc.text(`Ref Number: ${document.getElementById("recRef").value}`, 15, 58);

    // Billing Parties
    doc.setFont("helvetica", "bold");
    doc.setTextColor(primaryColor);
    doc.text("Received From:", 15, 72);
    doc.text("Received By (Paid to):", 110, 72);

    doc.setFont("helvetica", "normal");
    doc.setTextColor("#333333");
    doc.text(document.getElementById("recFromClient").value, 15, 77);
    const fromAddr = doc.splitTextToSize(document.getElementById("recFromAddress").value, 80);
    doc.text(fromAddr, 15, 82);

    doc.text(document.getElementById("recByCompany").value, 110, 77);
    const byAddr = doc.splitTextToSize(document.getElementById("recByAddress").value, 80);
    doc.text(byAddr, 110, 82);

    // Description & Amount
    doc.line(15, 102, 195, 102);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(primaryColor);
    doc.text("Description of Goods / Services:", 15, 108);
    
    doc.setFont("helvetica", "normal");
    doc.setTextColor("#333333");
    const descText = doc.splitTextToSize(document.getElementById("recDesc").value, 120);
    doc.text(descText, 15, 114);

    // Right aligned Amount
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("TOTAL PAID:", 145, 112);
    doc.setFontSize(16);
    doc.setTextColor("#de7110");
    doc.text(totalVal.textContent, 145, 120);

    // Footer note
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor("#666");
    doc.text(document.getElementById("recNotes").value, 15, 134);

    doc.save(`${document.getElementById("recNumber").value || "receipt"}.pdf`);
  });

  calc();
});
