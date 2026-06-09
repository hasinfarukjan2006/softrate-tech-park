document.addEventListener("DOMContentLoaded", () => {
  // Listen for the custom route load event
  document.addEventListener("perDiemRouteLoaded", () => {
    initPerDiemPage();
  });

  // Comprehensive Rates Database for 2026 (A-Z USA Cities) - 168 Cities
  const cityDatabase = {
    "Albuquerque, New Mexico": { lodging: 121, meals: 59, incidentals: 5 },
    "Alexandria, Virginia": { lodging: 188, meals: 74, incidentals: 5 },
    "Allentown, Pennsylvania": { lodging: 118, meals: 59, incidentals: 5 },
    "Amarillo, Texas": { lodging: 110, meals: 54, incidentals: 5 },
    "Anaheim, California": { lodging: 169, meals: 69, incidentals: 5 },
    "Anchorage, Alaska": { lodging: 180, meals: 79, incidentals: 5 },
    "Ann Arbor, Michigan": { lodging: 129, meals: 64, incidentals: 5 },
    "Annapolis, Maryland": { lodging: 145, meals: 69, incidentals: 5 },
    "Arlington, Texas": { lodging: 125, meals: 59, incidentals: 5 },
    "Arlington, Virginia": { lodging: 188, meals: 74, incidentals: 5 },
    "Asheville, North Carolina": { lodging: 135, meals: 64, incidentals: 5 },
    "Aspen, Colorado": { lodging: 299, meals: 79, incidentals: 5 },
    "Atlanta, Georgia": { lodging: 163, meals: 69, incidentals: 5 },
    "Atlantic City, New Jersey": { lodging: 139, meals: 64, incidentals: 5 },
    "Augusta, Georgia": { lodging: 115, meals: 59, incidentals: 5 },
    "Austin, Texas": { lodging: 161, meals: 69, incidentals: 5 },
    "Bakersfield, California": { lodging: 119, meals: 59, incidentals: 5 },
    "Baltimore, Maryland": { lodging: 149, meals: 69, incidentals: 5 },
    "Baton Rouge, Louisiana": { lodging: 112, meals: 59, incidentals: 5 },
    "Bellevue, Washington": { lodging: 175, meals: 74, incidentals: 5 },
    "Berkeley, California": { lodging: 220, meals: 74, incidentals: 5 },
    "Billings, Montana": { lodging: 118, meals: 59, incidentals: 5 },
    "Birmingham, Alabama": { lodging: 122, meals: 59, incidentals: 5 },
    "Bismarck, North Dakota": { lodging: 110, meals: 54, incidentals: 5 },
    "Boise, Idaho": { lodging: 124, meals: 59, incidentals: 5 },
    "Boston, Massachusetts": { lodging: 256, meals: 74, incidentals: 5 },
    "Boulder, Colorado": { lodging: 154, meals: 69, incidentals: 5 },
    "Bozeman, Montana": { lodging: 128, meals: 59, incidentals: 5 },
    "Bridgeport, Connecticut": { lodging: 139, meals: 69, incidentals: 5 },
    "Buffalo, New York": { lodging: 122, meals: 59, incidentals: 5 },
    "Burlington, Vermont": { lodging: 149, meals: 69, incidentals: 5 },
    "Cambridge, Massachusetts": { lodging: 256, meals: 74, incidentals: 5 },
    "Cape May, New Jersey": { lodging: 175, meals: 69, incidentals: 5 },
    "Carmel, California": { lodging: 212, meals: 74, incidentals: 5 },
    "Cedar Rapids, Iowa": { lodging: 110, meals: 54, incidentals: 5 },
    "Charleston, South Carolina": { lodging: 179, meals: 69, incidentals: 5 },
    "Charleston, West Virginia": { lodging: 110, meals: 54, incidentals: 5 },
    "Charlotte, North Carolina": { lodging: 139, meals: 64, incidentals: 5 },
    "Charlottesville, Virginia": { lodging: 132, meals: 64, incidentals: 5 },
    "Chattanooga, Tennessee": { lodging: 119, meals: 59, incidentals: 5 },
    "Cheyenne, Wyoming": { lodging: 110, meals: 54, incidentals: 5 },
    "Chicago, Illinois": { lodging: 195, meals: 74, incidentals: 5 },
    "Cincinnati, Ohio": { lodging: 129, meals: 59, incidentals: 5 },
    "Clearwater, Florida": { lodging: 152, meals: 64, incidentals: 5 },
    "Cleveland, Ohio": { lodging: 135, meals: 64, incidentals: 5 },
    "Cocoa Beach, Florida": { lodging: 145, meals: 64, incidentals: 5 },
    "Cody, Wyoming": { lodging: 128, meals: 59, incidentals: 5 },
    "Colorado Springs, Colorado": { lodging: 135, meals: 64, incidentals: 5 },
    "Columbia, South Carolina": { lodging: 118, meals: 59, incidentals: 5 },
    "Columbus, Ohio": { lodging: 129, meals: 59, incidentals: 5 },
    "Concord, New Hampshire": { lodging: 118, meals: 59, incidentals: 5 },
    "Corpus Christi, Texas": { lodging: 115, meals: 59, incidentals: 5 },
    "Dallas, Texas": { lodging: 154, meals: 69, incidentals: 5 },
    "Dayton, Ohio": { lodging: 112, meals: 54, incidentals: 5 },
    "Daytona Beach, Florida": { lodging: 132, meals: 64, incidentals: 5 },
    "Dearborn, Michigan": { lodging: 122, meals: 59, incidentals: 5 },
    "Denver, Colorado": { lodging: 161, meals: 69, incidentals: 5 },
    "Des Moines, Iowa": { lodging: 118, meals: 59, incidentals: 5 },
    "Detroit, Michigan": { lodging: 135, meals: 64, incidentals: 5 },
    "Dover, Delaware": { lodging: 115, meals: 59, incidentals: 5 },
    "Duluth, Minnesota": { lodging: 119, meals: 59, incidentals: 5 },
    "Durham, North Carolina": { lodging: 125, meals: 64, incidentals: 5 },
    "El Paso, Texas": { lodging: 115, meals: 59, incidentals: 5 },
    "Erie, Pennsylvania": { lodging: 110, meals: 54, incidentals: 5 },
    "Eugene, Oregon": { lodging: 122, meals: 59, incidentals: 5 },
    "Evanston, Illinois": { lodging: 154, meals: 69, incidentals: 5 },
    "Evansville, Indiana": { lodging: 110, meals: 54, incidentals: 5 },
    "Fargo, North Dakota": { lodging: 110, meals: 54, incidentals: 5 },
    "Fayetteville, Arkansas": { lodging: 110, meals: 54, incidentals: 5 },
    "Flagstaff, Arizona": { lodging: 139, meals: 64, incidentals: 5 },
    "Fort Lauderdale, Florida": { lodging: 165, meals: 69, incidentals: 5 },
    "Fort Myers, Florida": { lodging: 145, meals: 64, incidentals: 5 },
    "Fort Wayne, Indiana": { lodging: 110, meals: 54, incidentals: 5 },
    "Fort Worth, Texas": { lodging: 129, meals: 59, incidentals: 5 },
    "Fresno, California": { lodging: 122, meals: 59, incidentals: 5 },
    "Galveston, Texas": { lodging: 145, meals: 64, incidentals: 5 },
    "Grand Rapids, Michigan": { lodging: 122, meals: 59, incidentals: 5 },
    "Green Bay, Wisconsin": { lodging: 115, meals: 59, incidentals: 5 },
    "Greensboro, North Carolina": { lodging: 115, meals: 59, incidentals: 5 },
    "Greenville, South Carolina": { lodging: 118, meals: 59, incidentals: 5 },
    "Gulfport, Mississippi": { lodging: 110, meals: 54, incidentals: 5 },
    "Harrisburg, Pennsylvania": { lodging: 118, meals: 59, incidentals: 5 },
    "Hartford, Connecticut": { lodging: 135, meals: 64, incidentals: 5 },
    "Helena, Montana": { lodging: 110, meals: 54, incidentals: 5 },
    "Hilo, Hawaii": { lodging: 154, meals: 69, incidentals: 5 },
    "Hilton Head Island, South Carolina": { lodging: 185, meals: 74, incidentals: 5 },
    "Honolulu, Hawaii": { lodging: 229, meals: 79, incidentals: 5 },
    "Houston, Texas": { lodging: 145, meals: 64, incidentals: 5 },
    "Huntsville, Alabama": { lodging: 119, meals: 59, incidentals: 5 },
    "Indianapolis, Indiana": { lodging: 129, meals: 59, incidentals: 5 },
    "Jackson, Mississippi": { lodging: 110, meals: 54, incidentals: 5 },
    "Jackson Hole, Wyoming": { lodging: 279, meals: 79, incidentals: 5 },
    "Jacksonville, Florida": { lodging: 119, meals: 59, incidentals: 5 },
    "Juneau, Alaska": { lodging: 154, meals: 69, incidentals: 5 },
    "Kansas City, Missouri": { lodging: 129, meals: 59, incidentals: 5 },
    "Key West, Florida": { lodging: 299, meals: 79, incidentals: 5 },
    "Knoxville, Tennessee": { lodging: 115, meals: 59, incidentals: 5 },
    "Lafayette, Louisiana": { lodging: 110, meals: 54, incidentals: 5 },
    "Lake Tahoe, California": { lodging: 185, meals: 74, incidentals: 5 },
    "Lansing, Michigan": { lodging: 118, meals: 59, incidentals: 5 },
    "Laredo, Texas": { lodging: 110, meals: 54, incidentals: 5 },
    "Las Vegas, Nevada": { lodging: 139, meals: 69, incidentals: 5 },
    "Lexington, Kentucky": { lodging: 119, meals: 59, incidentals: 5 },
    "Lincoln, Nebraska": { lodging: 110, meals: 54, incidentals: 5 },
    "Little Rock, Arkansas": { lodging: 115, meals: 59, incidentals: 5 },
    "Los Angeles, California": { lodging: 192, meals: 74, incidentals: 5 },
    "Louisville, Kentucky": { lodging: 125, meals: 59, incidentals: 5 },
    "Madison, Wisconsin": { lodging: 129, meals: 59, incidentals: 5 },
    "Manchester, New Hampshire": { lodging: 122, meals: 59, incidentals: 5 },
    "Memphis, Tennessee": { lodging: 122, meals: 59, incidentals: 5 },
    "Miami, Florida": { lodging: 185, meals: 74, incidentals: 5 },
    "Milwaukee, Wisconsin": { lodging: 129, meals: 59, incidentals: 5 },
    "Minneapolis, Minnesota": { lodging: 145, meals: 64, incidentals: 5 },
    "Mobile, Alabama": { lodging: 110, meals: 54, incidentals: 5 },
    "Monterey, California": { lodging: 185, meals: 74, incidentals: 5 },
    "Montgomery, Alabama": { lodging: 110, meals: 54, incidentals: 5 },
    "Montpelier, Vermont": { lodging: 122, meals: 59, incidentals: 5 },
    "Myrtle Beach, South Carolina": { lodging: 135, meals: 64, incidentals: 5 },
    "Nashville, Tennessee": { lodging: 169, meals: 69, incidentals: 5 },
    "New Haven, Connecticut": { lodging: 139, meals: 64, incidentals: 5 },
    "New Orleans, Louisiana": { lodging: 154, meals: 69, incidentals: 5 },
    "New York, New York": { lodging: 258, meals: 79, incidentals: 5 },
    "Newark, New Jersey": { lodging: 149, meals: 64, incidentals: 5 },
    "Oakland, California": { lodging: 169, meals: 69, incidentals: 5 },
    "Oklahoma City, Oklahoma": { lodging: 118, meals: 59, incidentals: 5 },
    "Omaha, Nebraska": { lodging: 119, meals: 59, incidentals: 5 },
    "Orlando, Florida": { lodging: 149, meals: 64, incidentals: 5 },
    "Palm Springs, California": { lodging: 154, meals: 69, incidentals: 5 },
    "Pasadena, California": { lodging: 169, meals: 69, incidentals: 5 },
    "Philadelphia, Pennsylvania": { lodging: 159, meals: 69, incidentals: 5 },
    "Phoenix, Arizona": { lodging: 145, meals: 64, incidentals: 5 },
    "Pittsburgh, Pennsylvania": { lodging: 129, meals: 59, incidentals: 5 },
    "Portland, Maine": { lodging: 145, meals: 69, incidentals: 5 },
    "Portland, Oregon": { lodging: 154, meals: 69, incidentals: 5 },
    "Providence, Rhode Island": { lodging: 145, meals: 69, incidentals: 5 },
    "Raleigh, North Carolina": { lodging: 122, meals: 59, incidentals: 5 },
    "Reno, Nevada": { lodging: 119, meals: 59, incidentals: 5 },
    "Richmond, Virginia": { lodging: 125, meals: 59, incidentals: 5 },
    "Rochester, New York": { lodging: 118, meals: 59, incidentals: 5 },
    "Sacramento, California": { lodging: 139, meals: 64, incidentals: 5 },
    "Salt Lake City, Utah": { lodging: 129, meals: 59, incidentals: 5 },
    "San Antonio, Texas": { lodging: 124, meals: 59, incidentals: 5 },
    "San Diego, California": { lodging: 185, meals: 74, incidentals: 5 },
    "San Francisco, California": { lodging: 220, meals: 79, incidentals: 5 },
    "San Jose, California": { lodging: 195, meals: 74, incidentals: 5 },
    "Santa Barbara, California": { lodging: 210, meals: 74, incidentals: 5 },
    "Santa Fe, New Mexico": { lodging: 139, meals: 64, incidentals: 5 },
    "Savannah, Georgia": { lodging: 135, meals: 64, incidentals: 5 },
    "Scottsdale, Arizona": { lodging: 145, meals: 64, incidentals: 5 },
    "Seattle, Washington": { lodging: 175, meals: 74, incidentals: 5 },
    "Shreveport, Louisiana": { lodging: 110, meals: 54, incidentals: 5 },
    "Sioux Falls, South Dakota": { lodging: 110, meals: 54, incidentals: 5 },
    "South Bend, Indiana": { lodging: 110, meals: 54, incidentals: 5 },
    "Spokane, Washington": { lodging: 118, meals: 59, incidentals: 5 },
    "Springfield, Illinois": { lodging: 110, meals: 54, incidentals: 5 },
    "St. Louis, Missouri": { lodging: 125, meals: 59, incidentals: 5 },
    "St. Paul, Minnesota": { lodging: 125, meals: 59, incidentals: 5 },
    "Syracuse, New York": { lodging: 115, meals: 59, incidentals: 5 },
    "Tacoma, Washington": { lodging: 122, meals: 59, incidentals: 5 },
    "Tallahassee, Florida": { lodging: 110, meals: 54, incidentals: 5 },
    "Tampa, Florida": { lodging: 129, meals: 59, incidentals: 5 },
    "Toledo, Ohio": { lodging: 110, meals: 54, incidentals: 5 },
    "Topeka, Kansas": { lodging: 110, meals: 54, incidentals: 5 },
    "Tucson, Arizona": { lodging: 118, meals: 59, incidentals: 5 },
    "Tulsa, Oklahoma": { lodging: 110, meals: 54, incidentals: 5 },
    "Virginia Beach, Virginia": { lodging: 135, meals: 64, incidentals: 5 },
    "Washington, District of Columbia": { lodging: 188, meals: 79, incidentals: 5 },
    "Wichita, Kansas": { lodging: 110, meals: 54, incidentals: 5 },
    "Wilmington, Delaware": { lodging: 125, meals: 59, incidentals: 5 },
    "Winston-Salem, North Carolina": { lodging: 110, meals: 54, incidentals: 5 },
    "Worcester, Massachusetts": { lodging: 122, meals: 59, incidentals: 5 },
    "Yellowstone, Wyoming": { lodging: 145, meals: 64, incidentals: 5 },
    "York, Pennsylvania": { lodging: 110, meals: 54, incidentals: 5 }
  };

  const sortedCityNames = Object.keys(cityDatabase).sort();
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
        <div class="pd-form-group pd-autocomplete-wrapper">
          <label>Destination City *</label>
          <input type="text" class="pd-city-input" placeholder="Search city (e.g. Austin, Texas)..." required autocomplete="off">
          <div class="pd-suggestions-dropdown hide"></div>
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

    // Bind Autocomplete suggestion logic
    bindAutocomplete(row);

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

  function bindAutocomplete(row) {
    const input = row.querySelector(".pd-city-input");
    const dropdown = row.querySelector(".pd-suggestions-dropdown");

    if (!input || !dropdown) return;

    let activeIndex = -1;

    // Focus handler
    input.addEventListener("focus", () => {
      renderSuggestions(input.value.trim());
      dropdown.classList.remove("hide");
      activeIndex = -1;
    });

    // Input/typing handler
    input.addEventListener("input", () => {
      renderSuggestions(input.value.trim());
      dropdown.classList.remove("hide");
      activeIndex = -1;
    });

    // Keydown arrow navigation & select handler
    input.addEventListener("keydown", (e) => {
      const items = dropdown.querySelectorAll(".pd-suggestion-item");
      if (items.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        activeIndex = (activeIndex + 1) % items.length;
        highlightItem(items, activeIndex);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        activeIndex = (activeIndex - 1 + items.length) % items.length;
        highlightItem(items, activeIndex);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (activeIndex >= 0 && items[activeIndex]) {
          items[activeIndex].click();
        } else if (items.length > 0) {
          // Select first suggestion if none highlighted and Enter is pressed
          items[0].click();
        }
      } else if (e.key === "Escape") {
        dropdown.classList.add("hide");
        input.blur();
      }
    });

    // Document click to close when clicking outside
    document.addEventListener("click", (e) => {
      if (!row.contains(e.target)) {
        dropdown.classList.add("hide");
      }
    });

    function highlightItem(items, index) {
      items.forEach(it => it.classList.remove("active"));
      if (items[index]) {
        items[index].classList.add("active");
        items[index].scrollIntoView({ block: "nearest" });
      }
    }

    function renderSuggestions(query) {
      dropdown.innerHTML = "";
      let matches = [];

      if (!query) {
        // Show first 8 popular cities as default suggestions
        matches = sortedCityNames.slice(0, 8);
      } else {
        const lowerQuery = query.toLowerCase();
        matches = sortedCityNames.filter(c => c.toLowerCase().includes(lowerQuery)).slice(0, 10);
      }

      if (matches.length > 0) {
        matches.forEach(cityName => {
          const item = document.createElement("div");
          item.className = "pd-suggestion-item";
          item.textContent = cityName;
          item.onclick = () => {
            input.value = cityName;
            dropdown.classList.add("hide");
            autoRecalculate();
          };
          dropdown.appendChild(item);
        });

        // Add custom text option if exact query is not in database
        if (query && !cityDatabase[query]) {
          const customItem = document.createElement("div");
          customItem.className = "pd-suggestion-item custom-item";
          customItem.textContent = `Use manual: "${query}"`;
          customItem.onclick = () => {
            input.value = query;
            dropdown.classList.add("hide");
            autoRecalculate();
          };
          dropdown.appendChild(customItem);
        }
      } else {
        // No matches at all
        const noResults = document.createElement("div");
        noResults.className = "pd-suggestion-no-results";
        noResults.textContent = "No standard US cities found.";
        dropdown.appendChild(noResults);

        if (query) {
          const customItem = document.createElement("div");
          customItem.className = "pd-suggestion-item custom-item";
          customItem.textContent = `Use manual: "${query}"`;
          customItem.onclick = () => {
            input.value = query;
            dropdown.classList.add("hide");
            autoRecalculate();
          };
          dropdown.appendChild(customItem);
        }
      }
    }

    function autoRecalculate() {
      const resultsBox = document.getElementById("perDiemResults");
      if (resultsBox && !resultsBox.classList.contains("hide")) {
        calculatePerDiem();
      }
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

      const cityInput = row.querySelector(".pd-city-input");
      const startDateInput = row.querySelector(".pd-start-date");
      const endDateInput = row.querySelector(".pd-end-date");

      const cityNameVal = cityInput.value.trim();
      
      if (!cityNameVal) {
        alert("Please enter or select a Destination City for all itinerary rows.");
        hasErrors = true;
        return;
      }

      // Check if city is in our database, otherwise fall back to standard rates
      const rates = cityDatabase[cityNameVal] || { lodging: 110, meals: 54, incidentals: 5 };

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
