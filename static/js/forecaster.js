/* forecaster.js — Zoho-style Subscription MRR Projections & Live Charting */
document.addEventListener("DOMContentLoaded", function() {
  const container = document.getElementById("forecaster-section");
  if (!container) return;

  // DOM Elements
  const currentMRRInput = document.getElementById("foreCurrentMRR");
  const growthInput = document.getElementById("foreRevenueGrowth");
  const churnInput = document.getElementById("foreRevenueChurn");
  const compareChurnInput = document.getElementById("foreCompareChurn");
  const compareChurnWrap = document.getElementById("foreCompareChurnWrap");
  const projectionMonthsInput = document.getElementById("foreProjectionMonths");
  const linkCompare = document.getElementById("foreLinkCompare");

  const btnChart = document.getElementById("foreBtnChart");
  const btnTable = document.getElementById("foreBtnTable");
  const chartWrap = document.getElementById("foreChartWrap");
  const tableWrap = document.getElementById("foreTableWrap");
  const tableBody = document.getElementById("foreTableBody");
  const tableHeadComp = document.getElementById("foreTableHeadComp");

  let chartInstance = null;
  let isCompareActive = false;

  // Sync compare churn panel toggle
  if (linkCompare) {
    linkCompare.addEventListener("click", function() {
      isCompareActive = !isCompareActive;
      if (isCompareActive) {
        compareChurnWrap.classList.remove("hide");
        linkCompare.textContent = "- REMOVE COMPARE";
        if (tableHeadComp) tableHeadComp.classList.remove("hide");
      } else {
        compareChurnWrap.classList.add("hide");
        linkCompare.textContent = "+ COMPARE";
        if (tableHeadComp) tableHeadComp.classList.add("hide");
      }
      updateProjections();
    });
  }

  // Toggle between Chart & Table views
  if (btnChart && btnTable) {
    btnChart.addEventListener("click", function() {
      btnChart.classList.add("active");
      btnChart.style.background = "#2563eb";
      btnChart.style.color = "#ffffff";
      btnChart.style.borderColor = "#2563eb";

      btnTable.classList.remove("active");
      btnTable.style.background = "#ffffff";
      btnTable.style.color = "#475569";
      btnTable.style.borderColor = "#cbd5e1";

      chartWrap.classList.remove("hide");
      tableWrap.classList.add("hide");
    });

    btnTable.addEventListener("click", function() {
      btnTable.classList.add("active");
      btnTable.style.background = "#2563eb";
      btnTable.style.color = "#ffffff";
      btnTable.style.borderColor = "#2563eb";

      btnChart.classList.remove("active");
      btnChart.style.background = "#ffffff";
      btnChart.style.color = "#475569";
      btnChart.style.borderColor = "#cbd5e1";

      tableWrap.classList.remove("hide");
      chartWrap.classList.add("hide");
    });
  }

  // Helper: Generate month labels starting from current month
  function getMonthLabels(monthsCount) {
    const labels = [];
    const start = new Date();
    for (let i = 0; i <= monthsCount; i++) {
      const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
      const monthName = d.toLocaleString("default", { month: "short" });
      labels.push(monthName + " " + d.getFullYear());
    }
    return labels;
  }

  // Update Projections Logic
  function updateProjections() {
    const currentMRR = parseFloat(currentMRRInput.value) || 0;
    const growth = parseFloat(growthInput.value) || 0;
    const churn = parseFloat(churnInput.value) || 0;
    const compareChurn = parseFloat(compareChurnInput.value) || 0;
    const months = parseInt(projectionMonthsInput.value) || 12;

    const baseData = [currentMRR];
    const compData = [currentMRR];

    // Compute month-by-month projections
    for (let m = 1; m <= months; m++) {
      const prevBase = baseData[m - 1];
      const baseChurnAmount = prevBase * (churn / 100);
      const nextBase = prevBase + growth - baseChurnAmount;
      baseData.push(Math.max(0, nextBase));

      const prevComp = compData[m - 1];
      const compChurnAmount = prevComp * (compareChurn / 100);
      const nextComp = prevComp + growth - compChurnAmount;
      compData.push(Math.max(0, nextComp));
    }

    const labels = getMonthLabels(months);

    // Update Table rows
    tableBody.innerHTML = "";
    labels.forEach((label, idx) => {
      const tr = document.createElement("tr");
      tr.style.borderBottom = "1px solid #e2e8f0";
      
      let compColHtml = "";
      if (isCompareActive) {
        compColHtml = `<td style="padding: 10px; text-align: right; font-weight: 600; color: #de7110;">$${Math.round(compData[idx]).toLocaleString()}</td>`;
      }
      
      tr.innerHTML = `
        <td style="padding: 10px; color: #1e293b; font-weight: 500;">${label}</td>
        <td style="padding: 10px; text-align: right; font-weight: 600; color: #2563eb;">$${Math.round(baseData[idx]).toLocaleString()}</td>
        ${compColHtml}
      `;
      tableBody.appendChild(tr);
    });

    // Update Chart.js
    const ctx = document.getElementById("foreChart").getContext("2d");
    
    // Create gradients
    const gradientBase = ctx.createLinearGradient(0, 0, 0, 300);
    gradientBase.addColorStop(0, "rgba(37, 99, 235, 0.4)");
    gradientBase.addColorStop(1, "rgba(37, 99, 235, 0)");

    const gradientCompare = ctx.createLinearGradient(0, 0, 0, 300);
    gradientCompare.addColorStop(0, "rgba(222, 113, 16, 0.4)");
    gradientCompare.addColorStop(1, "rgba(222, 113, 16, 0)");

    const datasets = [
      {
        label: "MRR (Base Churn)",
        data: baseData,
        borderColor: "#2563eb",
        backgroundColor: gradientBase,
        borderWidth: 2,
        tension: 0.1,
        fill: true,
        pointBackgroundColor: "#2563eb",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ];

    if (isCompareActive) {
      datasets.push({
        label: "MRR (Compare Churn)",
        data: compData,
        borderColor: "#de7110",
        backgroundColor: gradientCompare,
        borderWidth: 2,
        borderDash: [5, 5],
        tension: 0.1,
        fill: true,
        pointBackgroundColor: "#de7110",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      });
    }

    if (chartInstance) {
      chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "top",
            labels: {
              boxWidth: 12,
              font: { family: "'Outfit', sans-serif", size: 12 },
              color: document.body.classList.contains("dark") ? "#cbd5e1" : "#475569"
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.dataset.label + ": $" + Math.round(context.raw).toLocaleString();
              }
            }
          }
        },
        scales: {
          y: {
            ticks: {
              color: document.body.classList.contains("dark") ? "#cbd5e1" : "#475569",
              font: { family: "'Outfit', sans-serif" },
              callback: function(value) {
                if (value >= 1000) {
                  return "$" + (value / 1000).toFixed(0) + "k";
                }
                return "$" + value;
              }
            },
            grid: {
              color: document.body.classList.contains("dark") ? "#334155" : "#f1f5f9"
            }
          },
          x: {
            ticks: {
              color: document.body.classList.contains("dark") ? "#cbd5e1" : "#475569",
              font: { family: "'Outfit', sans-serif" }
            },
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  // Bind input change listeners for real-time calculations
  [currentMRRInput, growthInput, churnInput, compareChurnInput, projectionMonthsInput].forEach(inp => {
    if (inp) {
      inp.addEventListener("input", updateProjections);
      inp.addEventListener("change", updateProjections);
    }
  });

  // Run initial projections
  updateProjections();

  // FAQ Accordion Toggle Interaction for Revenue Forecaster
  const foreFaqAccordion = document.getElementById("foreFaqAccordion");
  if (foreFaqAccordion) {
    foreFaqAccordion.addEventListener("click", function(e) {
      const header = e.target.closest(".faq-accordion-header");
      if (!header) return;

      const item = header.closest(".faq-accordion-item");
      const content = item.querySelector(".faq-accordion-content");
      const icon = header.querySelector(".faq-icon");

      const isOpen = item.classList.contains("open");

      // Close all other items
      foreFaqAccordion.querySelectorAll(".faq-accordion-item").forEach(i => {
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
});
