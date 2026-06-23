/* forecaster.js — Client-side dynamic logic and charting for Revenue Forecaster */
document.addEventListener("DOMContentLoaded", function() {
  const container = document.getElementById("forecaster-section");
  if (!container) return;

  const startYearInput = document.getElementById("foreStartYear");
  const currencySelect = document.getElementById("foreCurrency");
  const histGrid = document.getElementById("foreHistGrid");
  const addYearBtn = document.getElementById("foreAddYear");
  const remYearBtn = document.getElementById("foreRemYear");

  const methodSelect = document.getElementById("foreMethod");
  const growthRateWrap = document.getElementById("foreGrowthRateWrap");
  const growthRateInput = document.getElementById("foreGrowthRate");
  const yearsCountInput = document.getElementById("foreYearsCount");

  const calcBtn = document.getElementById("foreCalculate");
  const resultsBlock = document.getElementById("foreResultsBlock");
  const cagrValEl = document.getElementById("foreCagrVal");
  const resultBody = document.getElementById("foreResultBody");
  const resetBtn = document.getElementById("foreReset");

  let chartInstance = null;

  // Sync year labels on start year change
  function syncYearLabels() {
    const startYr = parseInt(startYearInput.value) || 2021;
    histGrid.querySelectorAll(".fore-year-input").forEach((div, idx) => {
      const lbl = div.querySelector(".fore-year-lbl");
      if (lbl) lbl.textContent = startYr + idx;
    });
  }

  startYearInput.addEventListener("input", syncYearLabels);

  // Show/Hide Assumed Growth Rate field based on method
  methodSelect.addEventListener("change", function() {
    if (this.value === "straight") {
      growthRateWrap.classList.remove("hide");
    } else {
      growthRateWrap.classList.add("hide");
    }
  });

  // Add historical year input
  addYearBtn.addEventListener("click", function() {
    const count = histGrid.querySelectorAll(".fore-year-input").length;
    if (count >= 10) {
      alert("Maximum 10 historical years.");
      return;
    }
    const startYr = parseInt(startYearInput.value) || 2021;
    const div = document.createElement("div");
    div.className = "fore-year-input";
    div.innerHTML = `
      <span class="fore-year-lbl">${startYr + count}</span>
      <input type="number" class="fore-hist-val" placeholder="0.00" value="">
    `;
    histGrid.appendChild(div);
  });

  // Remove historical year input
  remYearBtn.addEventListener("click", function() {
    const inputs = histGrid.querySelectorAll(".fore-year-input");
    if (inputs.length <= 3) {
      alert("Must enter at least 3 historical years for trend analysis.");
      return;
    }
    inputs[inputs.length - 1].remove();
  });

  function calculateForecast() {
    const currency = currencySelect.value;
    const histInputs = histGrid.querySelectorAll(".fore-hist-val");
    const startYr = parseInt(startYearInput.value) || 2021;
    
    const histData = [];
    histInputs.forEach((inp, idx) => {
      histData.push({
        year: startYr + idx,
        revenue: parseFloat(inp.value) || 0
      });
    });

    if (histData.some(h => h.revenue <= 0)) {
      alert("Please fill in positive revenue values for all historical years.");
      return;
    }

    // 1. Calculate Historical CAGR
    const firstRev = histData[0].revenue;
    const lastRev = histData[histData.length - 1].revenue;
    const periods = histData.length - 1;
    const cagr = Math.pow(lastRev / firstRev, 1 / periods) - 1;
    cagrValEl.textContent = (cagr * 100).toFixed(1) + "%";

    // 2. Generate Projections
    const method = methodSelect.value;
    const forecastYears = parseInt(yearsCountInput.value) || 3;
    const projections = [];
    
    let lastKnownRev = lastRev;
    let growthRate = 0;

    if (method === "straight") {
      growthRate = (parseFloat(growthRateInput.value) || 0) / 100;
    } else if (method === "cagr") {
      growthRate = cagr;
    }

    // Regression calculations if selected
    let slope = 0, intercept = 0;
    if (method === "regression") {
      let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
      const n = histData.length;
      histData.forEach((d, idx) => {
        sumX += idx;
        sumY += d.revenue;
        sumXY += idx * d.revenue;
        sumXX += idx * idx;
      });
      slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
      intercept = (sumY - slope * sumX) / n;
    }

    for (let i = 1; i <= forecastYears; i++) {
      const projYear = histData[histData.length - 1].year + i;
      let projRev = 0;

      if (method === "straight" || method === "cagr") {
        projRev = lastKnownRev * Math.pow(1 + growthRate, i);
      } else if (method === "regression") {
        // Index is histData.length - 1 + i
        projRev = slope * (histData.length - 1 + i) + intercept;
      }

      projections.push({
        year: projYear,
        revenue: Math.max(0, projRev)
      });
    }

    // 3. Render Table
    resultBody.innerHTML = "";
    
    // Historical rows
    histData.forEach((d, idx) => {
      const tr = document.createElement("tr");
      let growthText = "-";
      if (idx > 0) {
        const prev = histData[idx - 1].revenue;
        const change = ((d.revenue - prev) / prev) * 100;
        growthText = (change >= 0 ? "+" : "") + change.toFixed(1) + "%";
      }
      tr.innerHTML = `
        <td><strong>${d.year}</strong></td>
        <td><span style="color:#64748b; font-weight:600;">Historical</span></td>
        <td class="text-right">${currency} ${d.revenue.toLocaleString()}</td>
        <td class="text-right" style="color:${growthText.startsWith("-") ? "#ef4444" : "#16a34a"}">${growthText}</td>
      `;
      resultBody.appendChild(tr);
    });

    // Projected rows
    projections.forEach((d, idx) => {
      const tr = document.createElement("tr");
      const prev = idx === 0 ? lastRev : projections[idx - 1].revenue;
      const change = ((d.revenue - prev) / prev) * 100;
      const growthText = (change >= 0 ? "+" : "") + change.toFixed(1) + "%";
      
      tr.innerHTML = `
        <td><strong>${d.year}</strong></td>
        <td><span style="color:#de7110; font-weight:600;">Projected</span></td>
        <td class="text-right" style="font-weight:bold;">${currency} ${Math.round(d.revenue).toLocaleString()}</td>
        <td class="text-right" style="color:${growthText.startsWith("-") ? "#ef4444" : "#16a34a"}; font-weight:bold;">${growthText}</td>
      `;
      resultBody.appendChild(tr);
    });

    resultsBlock.classList.remove("hide");
    resultsBlock.scrollIntoView({ behavior: "smooth" });

    // 4. Render Chart.js
    const chartLabels = [...histData.map(h => h.year), ...projections.map(p => p.year)];
    const histChartData = [...histData.map(h => h.revenue), ...projections.map(() => null)];
    const projChartData = [...histData.map(() => null)];
    
    // Connect the line: last historical point = first point of projections line
    projChartData[histData.length - 1] = lastRev;
    projections.forEach(p => projChartData.push(p.revenue));

    if (chartInstance) {
      chartInstance.destroy();
    }

    const ctx = document.getElementById("foreChart").getContext("2d");
    chartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels: chartLabels,
        datasets: [
          {
            label: "Historical Revenue",
            data: histChartData,
            borderColor: "#1a3b6b",
            backgroundColor: "rgba(26, 59, 107, 0.1)",
            tension: 0.2,
            fill: true
          },
          {
            label: "Forecast Projection",
            data: projChartData,
            borderColor: "#de7110",
            backgroundColor: "rgba(222, 113, 16, 0.1)",
            borderDash: [5, 5],
            tension: 0.2,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            labels: { color: document.body.classList.contains("dark") ? "#cbd5e1" : "#475569" }
          }
        },
        scales: {
          y: {
            ticks: {
              color: document.body.classList.contains("dark") ? "#cbd5e1" : "#475569",
              callback: function(value) { return currency + " " + value.toLocaleString(); }
            },
            grid: { color: document.body.classList.contains("dark") ? "#334155" : "#e2e8f0" }
          },
          x: {
            ticks: { color: document.body.classList.contains("dark") ? "#cbd5e1" : "#475569" },
            grid: { display: false }
          }
        }
      }
    });
  }

  calcBtn.addEventListener("click", calculateForecast);

  resetBtn.addEventListener("click", function() {
    startYearInput.value = "2021";
    currencySelect.value = "&pound;";
    methodSelect.value = "straight";
    growthRateInput.value = "15";
    yearsCountInput.value = "3";
    growthRateWrap.classList.remove("hide");
    
    histGrid.innerHTML = `
      <div class="fore-year-input">
        <span class="fore-year-lbl">2021</span>
        <input type="number" class="fore-hist-val" placeholder="0.00" value="120000">
      </div>
      <div class="fore-year-input">
        <span class="fore-year-lbl">2022</span>
        <input type="number" class="fore-hist-val" placeholder="0.00" value="145000">
      </div>
      <div class="fore-year-input">
        <span class="fore-year-lbl">2023</span>
        <input type="number" class="fore-hist-val" placeholder="0.00" value="180000">
      </div>
    `;

    resultsBlock.classList.add("hide");
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
  });
});
