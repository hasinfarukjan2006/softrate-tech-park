document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide Icons
  lucide.createIcons();

  // DOM Elements
  const body = document.body;
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const mobileNavToggle = document.getElementById("mobileNavToggle");
  const navMenu = document.getElementById("navMenu");
  const sidebarLinks = document.querySelectorAll(".sidebar-link");
  const scrollLinks = document.querySelectorAll(".scroll-link, .nav-link");
  
  // Calculator Elements
  const gstForm = document.getElementById("gstForm");
  const gstAmountInput = document.getElementById("gstAmount");
  const gstRateSelect = document.getElementById("gstRate");
  const modeRadios = document.querySelectorAll('name="gstMode"');
  const transRadios = document.querySelectorAll('name="transType"');
  const amountError = document.getElementById("amountError");
  
  // Results Elements
  const resOriginal = document.getElementById("resOriginal");
  const resRate = document.getElementById("resRate");
  const resCGST = document.getElementById("resCGST");
  const resSGST = document.getElementById("resSGST");
  const resIGST = document.getElementById("resIGST");
  const resGST = document.getElementById("resGST");
  const resTotal = document.getElementById("resTotal");
  const cgstRow = document.getElementById("cgstRow");
  const sgstRow = document.getElementById("sgstRow");
  const igstRow = document.getElementById("igstRow");
  
  // Action Buttons
  const btnCalculate = document.getElementById("btnCalculate");
  const btnReset = document.getElementById("btnReset");
  const btnCopy = document.getElementById("btnCopy");
  const copyTooltip = document.getElementById("copyTooltip");
  const copyIcon = document.getElementById("copyIcon");
  const btnClearHistory = document.getElementById("btnClearHistory");
  
  // History and Slabs Elements
  const historyBody = document.getElementById("historyBody");
  const ratesTableBody = document.getElementById("ratesTableBody");
  const dbStatusBanner = document.getElementById("dbStatusBanner");
  const dbStatusText = document.getElementById("dbStatusText");

  // Contact Form Elements
  const contactForm = document.getElementById("contactForm");
  const contactStatusBox = document.getElementById("contactStatusBox");

  // State Management
  let activeMode = "standard";

  /* ==========================================================================
     1. Theme Management (Dark / Light Mode)
     ========================================================================== */
  const savedTheme = localStorage.getItem("theme") || "light";
  if (savedTheme === "dark") {
    body.classList.add("dark");
  } else {
    body.classList.remove("dark");
  }

  themeToggleBtn.addEventListener("click", () => {
    body.classList.toggle("dark");
    const currentTheme = body.classList.contains("dark") ? "dark" : "light";
    localStorage.setItem("theme", currentTheme);
  });

  /* ==========================================================================
     2. Responsive Navigation & Sidebar Handling
     ========================================================================== */
  // Toggle mobile navigation menu
  mobileNavToggle.addEventListener("click", () => {
    navMenu.classList.toggle("mobile-open");
    const isOpened = navMenu.classList.contains("mobile-open");
    mobileNavToggle.innerHTML = isOpened ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
    lucide.createIcons();
  });

  // Sidebar Mode Selection Handling
  sidebarLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      const mode = link.getAttribute("data-mode");
      if (!mode) return; // Allow normal scrolling for resource links

      e.preventDefault();
      
      // Update sidebar active classes
      sidebarLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
      
      activeMode = mode;
      updateCalculatorForMode(mode);

      // Scroll smoothly back to calculator top on mobile
      document.getElementById("calculator-section").scrollIntoView({ behavior: "smooth" });
    });
  });

  // Helper to sync UI configuration based on sidebar selection
  function updateCalculatorForMode(mode) {
    const titleEl = document.getElementById("calculatorModeTitle");
    const badgeEl = document.getElementById("calculatorModeBadge");
    
    // Reset any custom highlighting or styling
    document.querySelectorAll(".result-row").forEach(r => r.classList.remove("border-primary", "border-secondary"));
    
    switch(mode) {
      case "inclusive":
        document.getElementById("modeInclusive").checked = true;
        titleEl.innerHTML = '<i data-lucide="arrow-down-left" class="header-icon"></i>Inclusive GST';
        badgeEl.textContent = "Inclusive";
        break;
      case "exclusive":
        document.getElementById("modeExclusive").checked = true;
        titleEl.innerHTML = '<i data-lucide="arrow-up-right" class="header-icon"></i>Exclusive GST';
        badgeEl.textContent = "Exclusive";
        break;
      case "split":
        titleEl.innerHTML = '<i data-lucide="git-fork" class="header-icon"></i>GST Split';
        badgeEl.textContent = "Split Breakdown";
        break;
      case "cgst-sgst":
        document.getElementById("transIntra").checked = true;
        titleEl.innerHTML = '<i data-lucide="coins" class="header-icon"></i>CGST & SGST Split';
        badgeEl.textContent = "Intra-State";
        // Highlight Central/State rows in result
        break;
      case "igst":
        document.getElementById("transInter").checked = true;
        titleEl.innerHTML = '<i data-lucide="globe" class="header-icon"></i>IGST Valuation';
        badgeEl.textContent = "Inter-State";
        break;
      default: // standard
        titleEl.innerHTML = '<i data-lucide="sliders" class="header-icon"></i>GST Settings';
        badgeEl.textContent = "Standard";
        break;
    }
    
    // Recalculate instantly
    calculateLocal();
    syncTogglesState();
  }

  // Sync state between radios and visibility classes
  function syncTogglesState() {
    const isInterstate = document.getElementById("transInter").checked;
    if (isInterstate) {
      cgstRow.classList.add("hide");
      sgstRow.classList.add("hide");
      igstRow.classList.remove("hide");
    } else {
      cgstRow.classList.remove("hide");
      sgstRow.classList.remove("hide");
      igstRow.classList.add("hide");
    }
  }

  // Smooth scroll links closing mobile nav menu
  scrollLinks.forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("mobile-open");
      mobileNavToggle.innerHTML = '<i data-lucide="menu"></i>';
      lucide.createIcons();

      // Highlight active nav item
      if (link.classList.contains("nav-link")) {
        document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
        link.classList.add("active");
      }
    });
  });

  /* ==========================================================================
     3. Accordion (FAQs)
     ========================================================================== */
  const faqTriggers = document.querySelectorAll(".faq-trigger");
  faqTriggers.forEach(trigger => {
    trigger.addEventListener("click", () => {
      const faqItem = trigger.parentElement;
      const isActive = faqItem.classList.contains("active");
      
      // Close other FAQs
      document.querySelectorAll(".faq-item").forEach(item => {
        item.classList.remove("active");
      });
      
      if (!isActive) {
        faqItem.classList.add("active");
      }
    });
  });

  /* ==========================================================================
     4. Mathematical Calculation Engine
     ========================================================================== */
  
  // Real-time local calculations for a responsive user interface
  function calculateLocal() {
    const rawVal = gstAmountInput.value.trim();
    if (!rawVal || isNaN(rawVal) || parseFloat(rawVal) <= 0) {
      return; // Validation handles this on click
    }

    const amount = parseFloat(rawVal);
    const rate = parseFloat(gstRateSelect.value);
    const isInclusive = document.getElementById("modeInclusive").checked;
    const isInterstate = document.getElementById("transInter").checked;

    let originalAmount = 0;
    let gstAmount = 0;
    let totalAmount = 0;

    if (isInclusive) {
      totalAmount = amount;
      originalAmount = totalAmount / (1 + (rate / 100));
      gstAmount = totalAmount - originalAmount;
    } else {
      originalAmount = amount;
      gstAmount = originalAmount * (rate / 100);
      totalAmount = originalAmount + gstAmount;
    }

    const cgst = gstAmount / 2;
    const sgst = gstAmount / 2;
    const igst = gstAmount;

    // Render results
    resOriginal.textContent = `₹${originalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    resRate.textContent = `${rate}%`;
    resCGST.textContent = `₹${cgst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    resSGST.textContent = `₹${sgst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    resIGST.textContent = `₹${igst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    resGST.textContent = `₹${gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    resTotal.textContent = `₹${totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    
    syncTogglesState();
  }

  // Bind inputs for real-time responsiveness
  gstAmountInput.addEventListener("input", calculateLocal);
  gstRateSelect.addEventListener("change", calculateLocal);
  document.querySelectorAll('input[name="gstMode"]').forEach(radio => {
    radio.addEventListener("change", () => {
      calculateLocal();
    });
  });
  document.querySelectorAll('input[name="transType"]').forEach(radio => {
    radio.addEventListener("change", () => {
      calculateLocal();
      syncTogglesState();
    });
  });

  // Server-side submission (POST /api/calculate) to log calculations in DB
  gstForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const amountVal = gstAmountInput.value.trim();
    if (!amountVal || isNaN(amountVal) || parseFloat(amountVal) <= 0) {
      amountError.style.display = "block";
      gstAmountInput.classList.add("border-danger");
      return;
    } else {
      amountError.style.display = "none";
      gstAmountInput.classList.remove("border-danger");
    }

    const payload = {
      amount: parseFloat(amountVal),
      rate: parseFloat(gstRateSelect.value),
      type: document.getElementById("modeInclusive").checked ? "inclusive" : "exclusive"
    };

    btnCalculate.disabled = true;
    btnCalculate.innerHTML = '<i data-lucide="loader" class="animate-spin"></i> Calculating...';
    lucide.createIcons();

    fetch("/api/calculate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(resData => {
      btnCalculate.disabled = false;
      btnCalculate.innerHTML = '<i data-lucide="play-circle"></i> Calculate Tax';
      lucide.createIcons();

      if (resData.status === "success") {
        const data = resData.data;
        
        // Update results card with final server math
        resOriginal.textContent = `₹${data.original_amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        resRate.textContent = `${data.gst_rate}%`;
        resCGST.textContent = `₹${data.cgst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        resSGST.textContent = `₹${data.sgst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        resIGST.textContent = `₹${data.igst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        resGST.textContent = `₹${data.gst_amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        resTotal.textContent = `₹${data.total_amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        
        updateDbStatusBanner(resData.using_fallback);
        loadHistory(); // Reload history logs
      } else {
        alert("Calculation error: " + resData.message);
      }
    })
    .catch(err => {
      btnCalculate.disabled = false;
      btnCalculate.innerHTML = '<i data-lucide="play-circle"></i> Calculate Tax';
      lucide.createIcons();
      console.error("Calculate API error:", err);
      // Fail-safe: Local calculation was already rendered
    });
  });

  // Reset calculator values
  btnReset.addEventListener("click", () => {
    gstForm.reset();
    gstAmountInput.value = "";
    gstRateSelect.value = "18";
    document.getElementById("modeExclusive").checked = true;
    document.getElementById("transIntra").checked = true;
    
    amountError.style.display = "none";
    gstAmountInput.classList.remove("border-danger");
    
    resOriginal.textContent = "₹0.00";
    resRate.textContent = "18%";
    resCGST.textContent = "₹0.00";
    resSGST.textContent = "₹0.00";
    resIGST.textContent = "₹0.00";
    resGST.textContent = "₹0.00";
    resTotal.textContent = "₹0.00";
    
    syncTogglesState();
  });

  /* ==========================================================================
     5. Clipboard Utility
     ========================================================================== */
  btnCopy.addEventListener("click", () => {
    const rateText = resRate.textContent;
    const isInter = document.getElementById("transInter").checked;
    
    let textToCopy = `SOFTRATE GST CALCULATOR REPORT
-----------------------------------
Valuation Mode  : ${document.getElementById("modeInclusive").checked ? "Inclusive" : "Exclusive"}
Base Amount     : ${resOriginal.textContent}
GST Rate Slabs  : ${rateText}
Total GST Tax   : ${resGST.textContent}\n`;

    if (isInter) {
      textToCopy += `IGST Tax (Inter): ${resIGST.textContent}\n`;
    } else {
      textToCopy += `CGST Tax (Intra): ${resCGST.textContent}
SGST Tax (Intra): ${resSGST.textContent}\n`;
    }

    textToCopy += `-----------------------------------
Grand Total     : ${resTotal.textContent}
Report generated by Softrate Tech Park Pvt. Ltd.`;

    navigator.clipboard.writeText(textToCopy).then(() => {
      // Toggle Copied status badge
      copyTooltip.textContent = "Copied!";
      btnCopy.classList.add("border-success");
      copyIcon.innerHTML = '<i data-lucide="check" class="text-success"></i>';
      lucide.createIcons();
      
      setTimeout(() => {
        copyTooltip.textContent = "Copy Result";
        btnCopy.classList.remove("border-success");
        copyIcon.innerHTML = '<i data-lucide="copy"></i>';
        lucide.createIcons();
      }, 1500);
    }).catch(err => {
      console.error("Clipboard failed:", err);
    });
  });

  /* ==========================================================================
     6. History & Rates Loaders (API GET /history & /gst-rates)
     ========================================================================== */
  function loadHistory() {
    fetch("/api/history")
    .then(res => res.json())
    .then(resData => {
      if (resData.status === "success") {
        updateDbStatusBanner(resData.using_fallback);
        renderHistoryRows(resData.history);
      }
    })
    .catch(err => {
      console.error("Error loading history:", err);
    });
  }

  function renderHistoryRows(history) {
    if (!history || history.length === 0) {
      historyBody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center py-6 text-gray-400">
            <i data-lucide="inbox" class="empty-icon"></i>
            <p>No recent calculation logs found</p>
          </td>
        </tr>`;
      lucide.createIcons();
      return;
    }

    let rowsHTML = "";
    history.forEach(item => {
      // Formatting time
      let timeStr = "Just now";
      if (item.timestamp) {
        try {
          const dateObj = new Date(item.timestamp);
          timeStr = dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + 
                    " " + dateObj.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
        } catch(e) {
          timeStr = item.timestamp;
        }
      }

      const modeBadge = item.gst_type === "inclusive" 
        ? '<span class="badge" style="background-color:rgba(0, 168, 168, 0.15); color:#00A8A8;">Inclusive</span>'
        : '<span class="badge" style="background-color:rgba(15, 76, 129, 0.15); color:#0F4C81;">Exclusive</span>';

      rowsHTML += `
        <tr>
          <td>${timeStr}</td>
          <td>₹${item.amount.toFixed(2)}</td>
          <td>${item.gst_rate}%</td>
          <td>${modeBadge}</td>
          <td>₹${item.gst_amount.toFixed(2)}</td>
          <td class="font-bold text-primary">₹${item.final_amount.toFixed(2)}</td>
          <td>
            <button class="btn-delete-row" data-id="${item.id}" title="Remove entry">
              <i data-lucide="trash-2" style="width:16px;height:16px;"></i>
            </button>
          </td>
        </tr>`;
    });

    historyBody.innerHTML = rowsHTML;
    lucide.createIcons();

    // Bind row delete buttons (future scalability)
    // For single delete support, but since user requested general delete:
    document.querySelectorAll(".btn-delete-row").forEach(btn => {
      btn.addEventListener("click", () => {
        // Simple delete confirmation could go here, but for smooth feel just clear or delete
        // Note: DELETE /api/history clears all as requested. Let's delete this individual log if needed, or trigger full clear.
        // For individual delete we don't have an endpoint specified, so let's just alert or clear history
        if(confirm("Would you like to clear the entire calculation log?")) {
          clearAllHistory();
        }
      });
    });
  }

  function clearAllHistory() {
    fetch("/api/history", {
      method: "DELETE"
    })
    .then(res => res.json())
    .then(resData => {
      if (resData.status === "success") {
        updateDbStatusBanner(resData.using_fallback);
        loadHistory();
      }
    })
    .catch(err => {
      console.error("Error clearing history:", err);
    });
  }

  btnClearHistory.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete all calculation logs?")) {
      clearAllHistory();
    }
  });

  // Fetch official GST Slabs
  function loadGstRates() {
    fetch("/api/gst-rates")
    .then(res => res.json())
    .then(resData => {
      if (resData.status === "success") {
        updateDbStatusBanner(resData.using_fallback);
        renderRatesTable(resData.rates);
      }
    })
    .catch(err => {
      console.error("Error loading GST rates:", err);
    });
  }

  function renderRatesTable(rates) {
    if (!rates || rates.length === 0) {
      ratesTableBody.innerHTML = "<tr><td colspan='3'>No GST rates found.</td></tr>";
      return;
    }

    let rowsHTML = "";
    rates.forEach(item => {
      rowsHTML += `
        <tr>
          <td><strong>${item.rate}%</strong></td>
          <td>${item.name}</td>
          <td>${item.description}</td>
        </tr>`;
    });
    ratesTableBody.innerHTML = rowsHTML;
  }

  // Update Database Connection Status Banner
  function updateDbStatusBanner(usingFallback) {
    if (!dbStatusBanner || !dbStatusText) return;
    dbStatusBanner.classList.add("hide");
  }

  /* ==========================================================================
     7. Contact Form Handling (POST /api/contact)
     ========================================================================== */
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    // Inputs
    const nameInput = document.getElementById("contactName");
    const emailInput = document.getElementById("contactEmail");
    const subjectInput = document.getElementById("contactSubject");
    const messageInput = document.getElementById("contactMessage");
    
    // Errors
    const nameErr = document.getElementById("contactNameError");
    const emailErr = document.getElementById("contactEmailError");
    const subjectErr = document.getElementById("contactSubjectError");
    const messageErr = document.getElementById("contactMessageError");
    
    let isValid = true;
    
    // Name validation
    if (!nameInput.value.trim()) {
      nameErr.style.display = "block";
      nameInput.classList.add("border-danger");
      isValid = false;
    } else {
      nameErr.style.display = "none";
      nameInput.classList.remove("border-danger");
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      emailErr.style.display = "block";
      emailInput.classList.add("border-danger");
      isValid = false;
    } else {
      emailErr.style.display = "none";
      emailInput.classList.remove("border-danger");
    }
    
    // Subject validation
    if (!subjectInput.value.trim()) {
      subjectErr.style.display = "block";
      subjectInput.classList.add("border-danger");
      isValid = false;
    } else {
      subjectErr.style.display = "none";
      subjectInput.classList.remove("border-danger");
    }
    
    // Message validation
    if (!messageInput.value.trim()) {
      messageErr.style.display = "block";
      messageInput.classList.add("border-danger");
      isValid = false;
    } else {
      messageErr.style.display = "none";
      messageInput.classList.remove("border-danger");
    }
    
    if (!isValid) return;

    // Submit API
    const payload = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      subject: subjectInput.value.trim(),
      message: messageInput.value.trim()
    };

    const submitBtn = document.getElementById("btnContactSubmit");
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i data-lucide="loader" class="animate-spin"></i> Submitting...';
    lucide.createIcons();

    fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(resData => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i data-lucide="send"></i> Send Inquiry';
      lucide.createIcons();
      
      contactStatusBox.classList.remove("hide", "success", "danger");
      
      if (resData.status === "success") {
        contactStatusBox.classList.add("success");
        contactStatusBox.textContent = resData.message;
        contactForm.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          contactStatusBox.classList.add("hide");
        }, 5000);
      } else {
        contactStatusBox.classList.add("danger");
        contactStatusBox.textContent = "Failed: " + resData.message;
      }
    })
    .catch(err => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i data-lucide="send"></i> Send Inquiry';
      lucide.createIcons();
      
      contactStatusBox.classList.remove("hide", "success", "danger");
      contactStatusBox.classList.add("danger");
      contactStatusBox.textContent = "A network error occurred. Please try again later.";
      console.error("Contact Form submission error:", err);
    });
  });

  // Initial Data Load
  loadHistory();
  loadGstRates();
});
