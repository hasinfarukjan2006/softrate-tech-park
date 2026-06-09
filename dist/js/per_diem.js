document.addEventListener("DOMContentLoaded", () => {
  // Listen for the custom route load event
  document.addEventListener("perDiemRouteLoaded", () => {
    initPerDiemPage();
  });

  // Rates Database for 2026 (CONUS - USA)
  const cityRates = {
    standard: { name: "Standard Rate (CONUS)", lodging: 110, meals: 54, incidentals: 5 },
    nyc: { name: "New York City, NY", lodging: 258, meals: 74, incidentals: 5 },
    sfo: { name: "San Francisco, CA", lodging: 220, meals: 74, incidentals: 5 },
    lax: { name: "Los Angeles, CA", lodging: 192, meals: 69, incidentals: 5 },
    chi: { name: "Chicago, IL", lodging: 154, meals: 69, incidentals: 5 },
    was: { name: "Washington, DC", lodging: 188, meals: 74, incidentals: 5 },
    bos: { name: "Boston, MA", lodging: 185, meals: 74, incidentals: 5 },
    sea: { name: "Seattle, WA", lodging: 175, meals: 69, incidentals: 5 },
    mia: { name: "Miami, FL", lodging: 165, meals: 64, incidentals: 5 }
  };

  let rowCounter = 1;

  function initPerDiemPage() {
    const itineraryRows = document.getElementById("itineraryRows");
    const btnAddItinerary = document.getElementById("btnAddItinerary");
    const btnCalculate = document.getElementById("btnCalculatePerDiem");

    if (!itineraryRows) return;

    // Reset rows to default single row
    itineraryRows.innerHTML = "";
    rowCounter = 0;
    addItineraryRow();

    // Bind Add button
    if (btnAddItinerary) {
      btnAddItinerary.onclick = (e) => {
        e.preventDefault();
        addItineraryRow();
      };
    }

    // Bind Calculate button
    if (btnCalculate) {
      btnCalculate.onclick = (e) => {
        e.preventDefault();
        calculatePerDiem();
      };
    }

    // Initialize lucide icons
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  function addItineraryRow() {
    const itineraryRows = document.getElementById("itineraryRows");
    if (!itineraryRows) return;

    const rowId = rowCounter++;
    const row = document.createElement("div");
    row.className = "itinerary-row";
    row.dataset.rowId = rowId;

    // Default dates: Today and 3 days later
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    const threeDaysLater = new Date();
    threeDaysLater.setDate(today.getDate() + 3);
    const threeDaysLaterStr = threeDaysLater.toISOString().split("T")[0];

    row.innerHTML = `
      <div class="pd-form-grid">
        <div class="pd-form-group">
          <label>Destination City *</label>
          <select class="pd-city-select">
            <option value="standard">Standard Rate (Continental US)</option>
            <option value="nyc">New York City, NY</option>
            <option value="sfo">San Francisco, CA</option>
            <option value="lax">Los Angeles, CA</option>
            <option value="chi">Chicago, IL</option>
            <option value="was">Washington, DC</option>
            <option value="bos">Boston, MA</option>
            <option value="sea">Seattle, WA</option>
            <option value="mia">Miami, FL</option>
          </select>
        </div>
        <div class="pd-form-group">
          <label>Start Date *</label>
          <input type="date" class="pd-start-date" value="${todayStr}" required>
        </div>
        <div class="pd-form-group">
          <label>End Date *</label>
          <input type="date" class="pd-end-date" value="${threeDaysLaterStr}" required>
        </div>
        <div class="pd-action-col">
          <button type="button" class="btn-delete-itinerary" title="Remove Itinerary">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
      </div>
    `;

    itineraryRows.appendChild(row);

    // Bind delete button
    const deleteBtn = row.querySelector(".btn-delete-itinerary");
    deleteBtn.onclick = () => {
      row.remove();
      updateDeleteButtons();
      // Auto-recalculate if results are currently shown
      const resultsBox = document.getElementById("perDiemResults");
      if (resultsBox && !resultsBox.classList.contains("hide")) {
        calculatePerDiem();
      }
    };

    updateDeleteButtons();

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  function updateDeleteButtons() {
    const rows = document.querySelectorAll(".itinerary-row");
    rows.forEach(r => {
      const btn = r.querySelector(".btn-delete-itinerary");
      if (rows.length === 1) {
        btn.disabled = true;
      } else {
        btn.disabled = false;
      }
    });
  }

  function calculatePerDiem() {
    const rows = document.querySelectorAll(".itinerary-row");
    let totalLodging = 0;
    let totalMeals = 0;
    let totalIncidentals = 0;
    let totalDaysAll = 0;
    let totalNightsAll = 0;

    let hasErrors = false;

    rows.forEach(row => {
      if (hasErrors) return;

      const citySelect = row.querySelector(".pd-city-select");
      const startDateInput = row.querySelector(".pd-start-date");
      const endDateInput = row.querySelector(".pd-end-date");

      const cityKey = citySelect.value;
      const rates = cityRates[cityKey] || cityRates.standard;

      const startDateVal = startDateInput.value;
      const endDateVal = endDateInput.value;

      if (!startDateVal || !endDateVal) {
        alert("Please fill in start and end dates for all itinerary rows.");
        hasErrors = true;
        return;
      }

      const start = new Date(startDateVal);
      const end = new Date(endDateVal);

      if (end < start) {
        alert(`Invalid date range: End Date cannot be before Start Date.`);
        hasErrors = true;
        return;
      }

      // Calculate travel days (inclusive)
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      // Lodging nights = days - 1 (nights spent at hotel)
      const nights = diffDays > 1 ? diffDays - 1 : 0;

      // Lodging Total
      const lodgingTotal = nights * rates.lodging;

      // M&IE (Meals and Incidentals) calculation with GSA 75% rule on first/last day
      const mieRateTotal = rates.meals + rates.incidentals;
      let mieTotal = 0;

      if (diffDays === 1) {
        mieTotal = 1 * mieRateTotal * 0.75;
      } else if (diffDays === 2) {
        mieTotal = 2 * mieRateTotal * 0.75;
      } else {
        // First/last day at 75%, middle days at 100%
        mieTotal = (2 * mieRateTotal * 0.75) + ((diffDays - 2) * mieRateTotal);
      }

      // Proportional division of M&IE total
      const mealProportion = rates.meals / mieRateTotal;
      const incidentalProportion = rates.incidentals / mieRateTotal;

      const mealsTotal = mieTotal * mealProportion;
      const incidentalsTotal = mieTotal * incidentalProportion;

      totalLodging += lodgingTotal;
      totalMeals += mealsTotal;
      totalIncidentals += incidentalsTotal;
      totalDaysAll += diffDays;
      totalNightsAll += nights;
    });

    if (hasErrors) return;

    // Update Result Labels and Display Box
    const resPdLodging = document.getElementById("resPdLodging");
    const resPdMeals = document.getElementById("resPdMeals");
    const resPdIncidentals = document.getElementById("resPdIncidentals");
    const resPdGrandTotal = document.getElementById("resPdGrandTotal");

    const resPdLodgingRate = document.getElementById("resPdLodgingRate");
    const resPdMealsRate = document.getElementById("resPdMealsRate");
    const resPdIncidentalsRate = document.getElementById("resPdIncidentalsRate");

    const resultsBox = document.getElementById("perDiemResults");

    if (resultsBox) {
      // Format USD
      const formatUSD = (val) => "$" + val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      
      resPdLodging.textContent = formatUSD(totalLodging);
      resPdMeals.textContent = formatUSD(totalMeals);
      resPdIncidentals.textContent = formatUSD(totalIncidentals);
      
      const grandTotal = totalLodging + totalMeals + totalIncidentals;
      resPdGrandTotal.textContent = formatUSD(grandTotal);

      // Detail rates strings
      resPdLodgingRate.textContent = `${totalNightsAll} night(s) of lodging calculated.`;
      resPdMealsRate.textContent = `${totalDaysAll} travel day(s) calculated.`;
      resPdIncidentalsRate.textContent = `Incidental cap: $5.00/day.`;

      resultsBox.classList.remove("hide");
      resultsBox.scrollIntoView({ behavior: "smooth" });
    }
  }

  // Auto initialize if per diem section is already visible on startup
  const perDiemSection = document.getElementById("per-diem-section");
  if (perDiemSection && !perDiemSection.classList.contains("hide")) {
    initPerDiemPage();
  }
});
