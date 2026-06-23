/* quote.js — Client-side dynamic logic for Quote Generator */
document.addEventListener("DOMContentLoaded", function() {
  const container = document.getElementById("quote-section");
  if (!container) return;

  const itemRows = document.getElementById("qtItemRows");
  const addRowBtn = document.getElementById("qtAddRow");
  const subTotalVal = document.getElementById("qtSubTotal");
  const taxTotalVal = document.getElementById("qtTaxTotal");
  const discountInput = document.getElementById("qtDiscount");
  const totalDueVal = document.getElementById("qtTotalDue");
  
  const printBtn = document.getElementById("qtPrint");
  const pdfBtn = document.getElementById("qtPDF");
  const resetBtn = document.getElementById("qtReset");

  // Set today's date and expiry date (+30 days)
  const dt = new Date();
  const yr = dt.getFullYear();
  const mo = String(dt.getMonth() + 1).padStart(2, "0");
  const dy = String(dt.getDate()).padStart(2, "0");
  document.getElementById("qtDate").value = `${yr}-${mo}-${dy}`;

  const dueDt = new Date();
  dueDt.setDate(dueDt.getDate() + 30);
  const dueYr = dueDt.getFullYear();
  const dueMo = String(dueDt.getMonth() + 1).padStart(2, "0");
  const dueDy = String(dueDt.getDate()).padStart(2, "0");
  document.getElementById("qtExpiryDate").value = `${dueYr}-${dueMo}-${dueDy}`;

  function fmt(n) {
    return "\u00A3" + Math.abs(n).toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function calc() {
    let subtotal = 0;
    let taxTotal = 0;

    itemRows.querySelectorAll("tr").forEach(row => {
      const qtyInput = row.querySelector(".inv-item-qty");
      const rateInput = row.querySelector(".inv-item-rate");
      const taxInput = row.querySelector(".inv-item-tax");
      const totalEl = row.querySelector(".inv-item-total");

      if (!qtyInput || !rateInput) return;

      const qty = parseFloat(qtyInput.value) || 0;
      const rate = parseFloat(rateInput.value) || 0;
      const taxPercent = parseFloat(taxInput.value) || 0;

      const amt = qty * rate;
      const rowTax = amt * (taxPercent / 100);

      subtotal += amt;
      taxTotal += rowTax;

      if (totalEl) {
        totalEl.textContent = fmt(amt);
      }
    });

    const disc = parseFloat(discountInput.value) || 0;
    const grandTotal = subtotal + taxTotal - disc;

    subTotalVal.textContent = fmt(subtotal);
    taxTotalVal.textContent = fmt(taxTotal);
    totalDueVal.textContent = fmt(grandTotal);
  }

  // Row removal delegation
  itemRows.addEventListener("click", function(e) {
    if (e.target.classList.contains("inv-remove-row")) {
      const rows = itemRows.querySelectorAll("tr");
      if (rows.length > 1) {
        e.target.closest("tr").remove();
        calc();
      } else {
        alert("Estimate must have at least one line item.");
      }
    }
  });

  // Add line item
  addRowBtn.addEventListener("click", function() {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><input type="text" class="inv-item-desc" placeholder="Product or service description" value=""></td>
      <td><input type="number" class="inv-item-qty" placeholder="1" min="0" step="1" value="1"></td>
      <td><input type="number" class="inv-item-rate" placeholder="0.00" min="0" step="0.01" value="0.00"></td>
      <td><input type="number" class="inv-item-tax" placeholder="20" min="0" max="100" step="0.1" value="20"></td>
      <td class="inv-item-total text-right">&pound;0.00</td>
      <td><button type="button" class="inv-remove-row" title="Delete Row">&times;</button></td>
    `;
    itemRows.appendChild(tr);
    tr.querySelector(".inv-item-desc").focus();
    calc();
  });

  // Calculation on form input change
  container.addEventListener("input", calc);

  // Reset
  resetBtn.addEventListener("click", function() {
    document.getElementById("quoteForm").reset();
    itemRows.innerHTML = `
      <tr>
        <td><input type="text" class="inv-item-desc" placeholder="Product or service description" value="Cloud Hosting Implementation Setup"></td>
        <td><input type="number" class="inv-item-qty" placeholder="1" min="0" step="1" value="1"></td>
        <td><input type="number" class="inv-item-rate" placeholder="0.00" min="0" step="0.01" value="1200.00"></td>
        <td><input type="number" class="inv-item-tax" placeholder="20" min="0" max="100" step="0.1" value="20"></td>
        <td class="inv-item-total text-right">&pound;1200.00</td>
        <td><button type="button" class="inv-remove-row" title="Delete Row">&times;</button></td>
      </tr>
    `;
    discountInput.value = "0.00";
    calc();
  });

  // Print
  printBtn.addEventListener("click", function() {
    window.print();
  });

  // Client PDF Generation using jsPDF
  pdfBtn.addEventListener("click", function() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const primaryColor = "#1a3b6b";
    
    // Estimate Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(primaryColor);
    doc.text(document.getElementById("qtTitleText").value || "ESTIMATE", 140, 25, { align: "right" });
    
    // Metadata
    doc.setFontSize(9);
    doc.setTextColor("#555555");
    doc.text(`Estimate #: ${document.getElementById("qtNumber").value}`, 140, 32, { align: "right" });
    doc.text(`Date: ${document.getElementById("qtDate").value}`, 140, 37, { align: "right" });
    doc.text(`Valid Until: ${document.getElementById("qtExpiryDate").value}`, 140, 42, { align: "right" });
    const ref = document.getElementById("qtRef").value;
    if(ref) doc.text(`Reference: ${ref}`, 140, 47, { align: "right" });

    // Company / Client details
    doc.setFontSize(10);
    doc.setTextColor(primaryColor);
    doc.text("From:", 15, 20);
    doc.setFont("helvetica", "normal");
    doc.setTextColor("#333333");
    doc.text(document.getElementById("qtFromCompany").value, 15, 25);
    doc.text(document.getElementById("qtFromAddress").value, 15, 30);
    doc.text(document.getElementById("qtFromCity").value, 15, 35);
    doc.text(document.getElementById("qtFromCountry").value, 15, 40);
    doc.text(document.getElementById("qtFromPhone").value, 15, 45);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(primaryColor);
    doc.text("To:", 15, 58);
    doc.setFont("helvetica", "normal");
    doc.setTextColor("#333333");
    doc.text(document.getElementById("qtToClient").value, 15, 63);
    doc.text(document.getElementById("qtToAddress").value, 15, 68);
    doc.text(document.getElementById("qtToCity").value, 15, 73);
    doc.text(document.getElementById("qtToCountry").value, 15, 78);
    doc.text(document.getElementById("qtToEmail").value, 15, 83);

    // Build Table Body
    const headers = [["Item Description", "Qty", "Rate", "Tax (%)", "Amount"]];
    const data = [];
    itemRows.querySelectorAll("tr").forEach(row => {
      const desc = row.querySelector(".inv-item-desc").value;
      const qty = row.querySelector(".inv-item-qty").value;
      const rate = parseFloat(row.querySelector(".inv-item-rate").value).toFixed(2);
      const tax = row.querySelector(".inv-item-tax").value;
      const amt = row.querySelector(".inv-item-total").textContent;
      data.push([desc, qty, rate, tax, amt]);
    });

    doc.autoTable({
      startY: 95,
      head: headers,
      body: data,
      theme: "grid",
      headStyles: { fillColor: [26, 59, 107] },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 20, halign: "right" },
        2: { cellWidth: 25, halign: "right" },
        3: { cellWidth: 20, halign: "right" },
        4: { cellWidth: 35, halign: "right" }
      }
    });

    const finalY = doc.previousAutoTable.finalY + 15;
    
    // Notes
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("Terms & Conditions:", 15, finalY);
    doc.setFont("helvetica", "normal");
    const notesText = doc.splitTextToSize(document.getElementById("qtNotes").value, 100);
    doc.text(notesText, 15, finalY + 5);

    // Summary block on the right
    doc.setFontSize(10);
    doc.text(`Sub Total:`, 130, finalY);
    doc.text(subTotalVal.textContent, 190, finalY, { align: "right" });
    
    doc.text(`Tax Total:`, 130, finalY + 6);
    doc.text(taxTotalVal.textContent, 190, finalY + 6, { align: "right" });
    
    doc.text(`Discount:`, 130, finalY + 12);
    doc.text(`- £${parseFloat(discountInput.value).toFixed(2)}`, 190, finalY + 12, { align: "right" });

    doc.setFont("helvetica", "bold");
    doc.rect(125, finalY + 17, 70, 10);
    doc.text(`Total Estimate:`, 130, finalY + 23);
    doc.text(totalDueVal.textContent, 190, finalY + 23, { align: "right" });

    doc.save(`${document.getElementById("qtNumber").value || "estimate"}.pdf`);
  });

  calc();
});
