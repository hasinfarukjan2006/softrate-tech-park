import.meta.env = {
  VITE_API_URL: window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://127.0.0.1:5000"
    : "https://softrate-tech-park-backend.onrender.com"
};

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide Icons
  lucide.createIcons();

  // Check user session
  const trialBtn = document.querySelector(".trial-btn");
  const sessionUserName = localStorage.getItem("sessionUserName");
  if (sessionUserName && trialBtn) {
    trialBtn.textContent = `Welcome, ${sessionUserName}`;
    trialBtn.href = "#";
    trialBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (confirm("Would you like to log out of your trial account?")) {
        localStorage.removeItem("sessionUserName");
        localStorage.removeItem("sessionUserEmail");
        window.location.reload();
      }
    });
    const promoText = document.querySelector(".promo-text");
    if (promoText) {
      promoText.textContent = "Active Trial";
    }
  }

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
  const modeRadios = document.querySelectorAll('[name="gstMode"]');
  const transRadios = document.querySelectorAll('[name="transType"]');
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
  let lastSavedState = {
    amount: null,
    rate: null,
    mode: null,
    tax_type: null
  };

  /* ==========================================================================
     1. Theme Management (Dark / Light Mode)
     ========================================================================== */
  const savedTheme = localStorage.getItem("theme") || "light";
  if (savedTheme === "dark") {
    body.classList.add("dark");
  } else {
    body.classList.remove("dark");
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      body.classList.toggle("dark");
      const currentTheme = body.classList.contains("dark") ? "dark" : "light";
      localStorage.setItem("theme", currentTheme);
    });
  }

  /* ==========================================================================
     2. Responsive Navigation & Sidebar Handling
     ========================================================================== */
  // Toggle mobile navigation menu
  if (mobileNavToggle) {
    mobileNavToggle.addEventListener("click", () => {
      navMenu.classList.toggle("mobile-open");
      const isOpened = navMenu.classList.contains("mobile-open");
      mobileNavToggle.innerHTML = isOpened ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
      lucide.createIcons();
    });
  }

  // Sidebar Collapse / Expand Toggle
  const sidebarCollapseBtn = document.getElementById("sidebarCollapseBtn");
  const mainSidebar = document.getElementById("sidebar");
  const pdSidebar = document.getElementById("perDiemSidebar");
  
  // Collapse sidebar by default on mobile load
  if (window.innerWidth <= 768) {
    if (mainSidebar) mainSidebar.classList.add("collapsed");
    if (pdSidebar) pdSidebar.classList.add("collapsed");
  }

  if (sidebarCollapseBtn) {
    sidebarCollapseBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (mainSidebar && pdSidebar) {
        const isCollapsed = mainSidebar.classList.contains("collapsed") || pdSidebar.classList.contains("collapsed");
        if (isCollapsed) {
          mainSidebar.classList.remove("collapsed");
          pdSidebar.classList.remove("collapsed");
        } else {
          mainSidebar.classList.add("collapsed");
          pdSidebar.classList.add("collapsed");
        }
      } else if (mainSidebar) {
        mainSidebar.classList.toggle("collapsed");
      }
    });
  }

  // Close sidebar on mobile when clicking main content
  const mainContent = document.querySelector(".main-content");
  if (mainContent) {
    mainContent.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        if (mainSidebar) mainSidebar.classList.add("collapsed");
        if (pdSidebar) pdSidebar.classList.add("collapsed");
      }
    });
  }

  // Define routing function
  window.showRoute = function(route, updateHistory = true) {
    const shouldGoToMainPage = (route === "gst" || route === "expense" || route === "invoice");
    const isPerDiemRoute = (route === "per-diem" || route === "per-diem-calculator" || (window.location.pathname === "/per-diem-calculator" && !shouldGoToMainPage));
    let activeSidebarId = isPerDiemRoute ? "perDiemSidebar" : "sidebar";

    if (isPerDiemRoute) {
      if (updateHistory) {
        if (window.location.pathname !== "/per-diem-calculator") {
          window.history.pushState({ route: "per-diem" }, "", "/per-diem-calculator");
        }
      }
    } else {
      if (updateHistory) {
        if (window.location.pathname === "/per-diem-calculator" || shouldGoToMainPage) {
          window.history.pushState({ route: route }, "", "/" + (route === "gst" ? "" : "#" + route));
        } else {
          window.location.hash = route;
        }
      }
    }

    // Hide/Show Sidebars
    if (mainSidebar && pdSidebar) {
      if (activeSidebarId === "perDiemSidebar") {
        mainSidebar.classList.add("hide");
        pdSidebar.classList.remove("hide");
      } else {
        pdSidebar.classList.add("hide");
        mainSidebar.classList.remove("hide");
      }
    }

    // Highlight active link in the active sidebar
    const activeSidebar = document.getElementById(activeSidebarId);
    if (activeSidebar) {
      const links = activeSidebar.querySelectorAll(".sidebar-link");
      links.forEach(l => l.classList.remove("active"));
      
      let searchRoute = route;
      if (isPerDiemRoute && (route === "per-diem" || route === "per-diem-calculator")) {
        const pdLink = Array.from(links).find(l => l.getAttribute("data-route") === "per-diem" || l.getAttribute("data-route") === "per-diem-calculator");
        if (pdLink) pdLink.classList.add("active");
      } else {
        const matchingLink = Array.from(links).find(l => l.getAttribute("data-route") === route);
        if (matchingLink) matchingLink.classList.add("active");
      }
    }

    // Update title
    let labelText = "Utility";
    if (activeSidebar) {
      const activeLink = activeSidebar.querySelector(".sidebar-link.active");
      if (activeLink && activeLink.querySelector("span")) {
        labelText = activeLink.querySelector("span").textContent;
      }
    }

    const headerTitleEl = document.querySelector(".header-title");
    if (headerTitleEl) {
      headerTitleEl.textContent = labelText;
    }
    document.title = `${labelText} | Softrate Tech Park Pvt. Ltd.`;

    // Views
    const calcSection = document.getElementById("calculator-section");
    const ratesSection = document.getElementById("rates-section");
    const faqSection = document.getElementById("faq-section");
    const aboutSection = document.getElementById("about-section");
    const contactSection = document.getElementById("contact-section");
    const comingSoonSection = document.getElementById("coming-soon-section");
    const comingSoonTitle = document.getElementById("comingSoonTitle");
    const expenseSection = document.getElementById("expense-section");
    const perDiemSection = document.getElementById("per-diem-section");
    const paycheckSection = document.getElementById("paycheck-section");
    const incomeTaxSection = document.getElementById("income-tax-section");
    const hmrcSection = document.getElementById("hmrc-section");
    const invoiceSection = document.getElementById("invoice-section");
    const quoteSection = document.getElementById("quote-section");
    const receiptsSection = document.getElementById("receipts-section");
    const forecasterSection = document.getElementById("forecaster-section");
    const ukVatSection = document.getElementById("uk-vat-section");
    const uaeVatSection = document.getElementById("uae-vat-section");
    const ukFlatSection = document.getElementById("uk-flat-section");
    const ukCorpSection = document.getElementById("uk-corp-section");
    const financialReportSection = document.getElementById("financial-report-section");
    const projectEstimateSection = document.getElementById("project-estimate-section");
    const w9Section = document.getElementById("w9-section");
    const payslipSection = document.getElementById("payslip-section");
    const npsSection = document.getElementById("nps-section");
    const epsSection = document.getElementById("eps-section");
    const gratuitySection = document.getElementById("gratuity-section");
    const bonusSection = document.getElementById("bonus-section");
    const hraSection = document.getElementById("hra-section");
    const skuSection = document.getElementById("sku-section");
    const purchaseOrderSection = document.getElementById("purchase-order-section");
    const reorderSection = document.getElementById("reorder-section");
    const eoqSection = document.getElementById("eoq-section");
    const breakEvenSection = document.getElementById("break-even-section");
    const inventoryTurnoverSection = document.getElementById("inventory-turnover-section");
    const packingSlipSection = document.getElementById("packing-slip-section");
    const barcodeSection = document.getElementById("barcode-section");
    const shippingLabelSection = document.getElementById("shipping-label-section");
    const wholesaleSection = document.getElementById("wholesale-section");

    if (calcSection) calcSection.classList.add("hide");
    if (ratesSection) ratesSection.classList.add("hide");
    if (faqSection) faqSection.classList.add("hide");
    if (aboutSection) aboutSection.classList.add("hide");
    if (contactSection) contactSection.classList.add("hide");
    if (comingSoonSection) comingSoonSection.classList.add("hide");
    if (expenseSection) expenseSection.classList.add("hide");
    if (perDiemSection) perDiemSection.classList.add("hide");
    if (paycheckSection) paycheckSection.classList.add("hide");
    if (incomeTaxSection) incomeTaxSection.classList.add("hide");
    if (hmrcSection) hmrcSection.classList.add("hide");
    if (invoiceSection) invoiceSection.classList.add("hide");
    if (quoteSection) quoteSection.classList.add("hide");
    if (receiptsSection) receiptsSection.classList.add("hide");
    if (forecasterSection) forecasterSection.classList.add("hide");
    if (ukVatSection) ukVatSection.classList.add("hide");
    if (uaeVatSection) uaeVatSection.classList.add("hide");
    if (ukFlatSection) ukFlatSection.classList.add("hide");
    if (ukCorpSection) ukCorpSection.classList.add("hide");
    if (financialReportSection) financialReportSection.classList.add("hide");
    if (projectEstimateSection) projectEstimateSection.classList.add("hide");
    if (w9Section) w9Section.classList.add("hide");
    if (payslipSection) payslipSection.classList.add("hide");
    if (npsSection) npsSection.classList.add("hide");
    if (epsSection) epsSection.classList.add("hide");
    if (gratuitySection) gratuitySection.classList.add("hide");
    if (bonusSection) bonusSection.classList.add("hide");
    if (hraSection) hraSection.classList.add("hide");
    if (skuSection) skuSection.classList.add("hide");
    if (purchaseOrderSection) purchaseOrderSection.classList.add("hide");
    if (reorderSection) reorderSection.classList.add("hide");
    if (eoqSection) eoqSection.classList.add("hide");
    if (breakEvenSection) breakEvenSection.classList.add("hide");
    if (inventoryTurnoverSection) inventoryTurnoverSection.classList.add("hide");
    if (packingSlipSection) packingSlipSection.classList.add("hide");
    if (barcodeSection) barcodeSection.classList.add("hide");
    if (shippingLabelSection) shippingLabelSection.classList.add("hide");
    if (wholesaleSection) wholesaleSection.classList.add("hide");

    if (isPerDiemRoute && (route === "per-diem" || route === "per-diem-calculator")) {
      if (perDiemSection) perDiemSection.classList.remove("hide");
      if (perDiemSection) perDiemSection.scrollIntoView({ behavior: "smooth" });
      document.dispatchEvent(new CustomEvent("perDiemRouteLoaded"));
    } else if (route === "gst") {
      if (calcSection) calcSection.classList.remove("hide");
      if (ratesSection) ratesSection.classList.remove("hide");
      if (faqSection) faqSection.classList.remove("hide");
      if (aboutSection) aboutSection.classList.remove("hide");
      if (contactSection) contactSection.classList.remove("hide");
      if (calcSection) calcSection.scrollIntoView({ behavior: "smooth" });
    } else if (route === "expense") {
      if (expenseSection) expenseSection.classList.remove("hide");
      if (expenseSection) expenseSection.scrollIntoView({ behavior: "smooth" });
      document.dispatchEvent(new CustomEvent("expenseRouteLoaded"));
    } else if (route === "paycheck" || route === "paycheck-calculator") {
      if (paycheckSection) paycheckSection.classList.remove("hide");
      if (paycheckSection) paycheckSection.scrollIntoView({ behavior: "smooth" });
    } else if (route === "income-tax" || route === "income-tax-calculator") {
      if (incomeTaxSection) incomeTaxSection.classList.remove("hide");
      if (incomeTaxSection) incomeTaxSection.scrollIntoView({ behavior: "smooth" });
    } else if (route === "hmrc" || route === "hmrc-furlough") {
      if (hmrcSection) hmrcSection.classList.remove("hide");
      if (hmrcSection) hmrcSection.scrollIntoView({ behavior: "smooth" });
    } else if (route === "financial-report") {
      if (financialReportSection) financialReportSection.classList.remove("hide");
      if (financialReportSection) financialReportSection.scrollIntoView({ behavior: "smooth" });
    } else if (route === "project-estimate" || route === "project-cost") {
      if (projectEstimateSection) projectEstimateSection.classList.remove("hide");
      if (projectEstimateSection) projectEstimateSection.scrollIntoView({ behavior: "smooth" });
    } else if (route === "w9") {
      if (w9Section) w9Section.classList.remove("hide");
      if (w9Section) w9Section.scrollIntoView({ behavior: "smooth" });
    } else if (route === "payslip") {
      if (payslipSection) payslipSection.classList.remove("hide");
      if (payslipSection) payslipSection.scrollIntoView({ behavior: "smooth" });
    } else if (route === "nps") {
      if (npsSection) npsSection.classList.remove("hide");
      if (npsSection) npsSection.scrollIntoView({ behavior: "smooth" });
    } else if (route === "eps") {
      if (epsSection) epsSection.classList.remove("hide");
      if (epsSection) epsSection.scrollIntoView({ behavior: "smooth" });
    } else if (route === "gratuity") {
      if (gratuitySection) gratuitySection.classList.remove("hide");
      if (gratuitySection) gratuitySection.scrollIntoView({ behavior: "smooth" });
    } else if (route === "bonus") {
      if (bonusSection) bonusSection.classList.remove("hide");
      if (bonusSection) bonusSection.scrollIntoView({ behavior: "smooth" });
    } else if (route === "hra") {
      if (hraSection) hraSection.classList.remove("hide");
      if (hraSection) hraSection.scrollIntoView({ behavior: "smooth" });
    } else if (route === "sku") {
      if (skuSection) skuSection.classList.remove("hide");
      if (skuSection) skuSection.scrollIntoView({ behavior: "smooth" });
    } else if (route === "po" || route === "purchase-order") {
      if (purchaseOrderSection) purchaseOrderSection.classList.remove("hide");
      if (purchaseOrderSection) purchaseOrderSection.scrollIntoView({ behavior: "smooth" });
    } else if (route === "reorder") {
      if (reorderSection) reorderSection.classList.remove("hide");
      if (reorderSection) reorderSection.scrollIntoView({ behavior: "smooth" });
    } else if (route === "eoq") {
      if (eoqSection) eoqSection.classList.remove("hide");
      if (eoqSection) eoqSection.scrollIntoView({ behavior: "smooth" });
    } else if (route === "break-even") {
      if (breakEvenSection) breakEvenSection.classList.remove("hide");
      if (breakEvenSection) breakEvenSection.scrollIntoView({ behavior: "smooth" });
    } else if (route === "inventory-turnover") {
      if (inventoryTurnoverSection) inventoryTurnoverSection.classList.remove("hide");
      if (inventoryTurnoverSection) inventoryTurnoverSection.scrollIntoView({ behavior: "smooth" });
    } else if (route === "packing-slip") {
      if (packingSlipSection) packingSlipSection.classList.remove("hide");
      if (packingSlipSection) packingSlipSection.scrollIntoView({ behavior: "smooth" });
    } else if (route === "barcode") {
      if (barcodeSection) barcodeSection.classList.remove("hide");
      if (barcodeSection) barcodeSection.scrollIntoView({ behavior: "smooth" });
    } else if (route === "shipping-label") {
      if (shippingLabelSection) shippingLabelSection.classList.remove("hide");
      if (shippingLabelSection) shippingLabelSection.scrollIntoView({ behavior: "smooth" });
    } else if (route === "wholesale") {
      if (wholesaleSection) wholesaleSection.classList.remove("hide");
      if (wholesaleSection) wholesaleSection.scrollIntoView({ behavior: "smooth" });
    } else if (route === "uk-corp") {
      if (ukCorpSection) ukCorpSection.classList.remove("hide");
      if (ukCorpSection) ukCorpSection.scrollIntoView({ behavior: "smooth" });
    } else if (route === "uk-vat") {
      if (ukVatSection) ukVatSection.classList.remove("hide");
      if (ukVatSection) ukVatSection.scrollIntoView({ behavior: "smooth" });
    } else if (route === "uae-vat") {
      if (uaeVatSection) uaeVatSection.classList.remove("hide");
      if (uaeVatSection) uaeVatSection.scrollIntoView({ behavior: "smooth" });
    } else if (route === "uk-flat") {
      if (ukFlatSection) ukFlatSection.classList.remove("hide");
      if (ukFlatSection) ukFlatSection.scrollIntoView({ behavior: "smooth" });
    } else if (route === "quote") {
      if (quoteSection) quoteSection.classList.remove("hide");
      if (quoteSection) quoteSection.scrollIntoView({ behavior: "smooth" });
    } else if (route === "receipts") {
      if (receiptsSection) receiptsSection.classList.remove("hide");
      if (receiptsSection) receiptsSection.scrollIntoView({ behavior: "smooth" });
    } else if (route === "forecaster") {
      if (forecasterSection) forecasterSection.classList.remove("hide");
      if (forecasterSection) forecasterSection.scrollIntoView({ behavior: "smooth" });
    } else {
      if (comingSoonSection) comingSoonSection.classList.remove("hide");
      if (comingSoonTitle) comingSoonTitle.textContent = `${labelText} - Coming Soon`;
      if (comingSoonSection) comingSoonSection.scrollIntoView({ behavior: "smooth" });
    }

    if (!isPerDiemRoute) {
      localStorage.setItem("activeRoute", route);
    }
  };

  // Bind Sidebar Mode Selection Handling for all links
  const allSidebarLinks = document.querySelectorAll(".sidebar-link");
  allSidebarLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      const route = link.getAttribute("data-route");
      if (!route) return;

      e.preventDefault();
      showRoute(route);

      // Close active sidebar on mobile after selection
      if (window.innerWidth <= 768) {
        if (mainSidebar) mainSidebar.classList.add("collapsed");
        if (pdSidebar) pdSidebar.classList.add("collapsed");
      }
    });
  });

  // Custom bindings for specific back button links
  const btnSidebarBackToGst = document.getElementById("btnSidebarBackToGst");
  if (btnSidebarBackToGst) {
    btnSidebarBackToGst.addEventListener("click", (e) => {
      e.preventDefault();
      showRoute("gst");
    });
  }

  // Handle Back to GST Calculator button inside coming-soon placeholder
  const btnBackToGst = document.getElementById("btnBackToGst");
  if (btnBackToGst) {
    btnBackToGst.addEventListener("click", () => {
      showRoute("gst");
    });
  }

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
    
    // Sync toggles state and auto-calculate
    syncTogglesState();
    calculateLocal();
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

      // Check if calculator section is currently hidden
      const calcSection = document.getElementById("calculator-section");
      if (calcSection && calcSection.classList.contains("hide")) {
        const ratesSection = document.getElementById("rates-section");
        const faqSection = document.getElementById("faq-section");
        const aboutSection = document.getElementById("about-section");
        const contactSection = document.getElementById("contact-section");
        const comingSoonSection = document.getElementById("coming-soon-section");
        const expenseSection = document.getElementById("expense-section");
        
        calcSection.classList.remove("hide");
        if (ratesSection) ratesSection.classList.remove("hide");
        if (faqSection) faqSection.classList.remove("hide");
        if (aboutSection) aboutSection.classList.remove("hide");
        if (contactSection) contactSection.classList.remove("hide");
        if (comingSoonSection) comingSoonSection.classList.add("hide");
        if (expenseSection) expenseSection.classList.add("hide");

        // Highlight India GST Calculator in sidebar as active
        sidebarLinks.forEach(l => l.classList.remove("active"));
        const gstLink = Array.from(sidebarLinks).find(l => l.getAttribute("data-route") === "gst");
        if (gstLink) {
          gstLink.classList.add("active");
        }
      }

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
  
  // Local calculations for a responsive user interface
  function calculateLocal() {
    const rawVal = gstAmountInput.value.trim();
    if (!rawVal || isNaN(rawVal) || parseFloat(rawVal) <= 0) {
      resOriginal.textContent = "₹0.00";
      resRate.textContent = "18%";
      resCGST.textContent = "₹0.00";
      resSGST.textContent = "₹0.00";
      resIGST.textContent = "₹0.00";
      resGST.textContent = "₹0.00";
      resTotal.textContent = "₹0.00";
      return;
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

    const cgst = isInterstate ? 0 : gstAmount / 2;
    const sgst = isInterstate ? 0 : gstAmount / 2;
    const igst = isInterstate ? gstAmount : 0;

    resOriginal.textContent = `₹${originalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    resRate.textContent = `${rate}%`;
    resCGST.textContent = `₹${cgst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    resSGST.textContent = `₹${sgst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    resIGST.textContent = `₹${igst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    resGST.textContent = `₹${gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    resTotal.textContent = `₹${totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  // Database logger triggered automatically or on form submit
  function triggerServerSave() {
    const amountVal = gstAmountInput.value.trim();
    if (!amountVal || isNaN(amountVal) || parseFloat(amountVal) <= 0) {
      amountError.style.display = "block";
      gstAmountInput.classList.add("border-danger");
      return;
    } else {
      amountError.style.display = "none";
      gstAmountInput.classList.remove("border-danger");
    }

    const amount = parseFloat(amountVal);
    const rate = parseFloat(gstRateSelect.value);
    const mode = document.getElementById("modeInclusive").checked ? "inclusive" : "exclusive";
    const tax_type = document.getElementById("transInter").checked ? "inter" : "intra";

    // Prevent duplicate saving of same unchanged calculation
    if (
      lastSavedState.amount === amount &&
      lastSavedState.rate === rate &&
      lastSavedState.mode === mode &&
      lastSavedState.tax_type === tax_type
    ) {
      return;
    }

    // Calculate result
    let gst_amount = 0;
    let final_amount = 0;
    if (mode === "inclusive") {
      const original = amount / (1 + (rate / 100));
      gst_amount = amount - original;
      final_amount = amount;
    } else {
      gst_amount = amount * (rate / 100);
      final_amount = amount + gst_amount;
    }

    gst_amount = parseFloat(gst_amount.toFixed(2));
    final_amount = parseFloat(final_amount.toFixed(2));

    const cgst = tax_type === "inter" ? 0 : parseFloat((gst_amount / 2).toFixed(2));
    const sgst = tax_type === "inter" ? 0 : parseFloat((gst_amount / 2).toFixed(2));
    const igst = tax_type === "inter" ? gst_amount : 0;

    // Update last saved state immediately before network call to prevent duplicate saves in flight
    lastSavedState = {
      amount: amount,
      rate: rate,
      mode: mode,
      tax_type: tax_type
    };

    // Save actual calculated result to MongoDB Atlas
    fetch("https://softrate-tech-park.onrender.com/save-gst", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount: amount,
        gstRate: rate,
        gstAmount: gst_amount,
        grandTotal: final_amount,
        created_at: new Date().toISOString()
      })
    })
    .then(res => res.json())
    .then(saveRes => {
      if (saveRes.success) {
        alert("Saved to database");
        loadHistory();
      } else {
        alert("Failed to save to MongoDB Atlas.");
      }
    })
    .catch(err => {
      console.error("MongoDB save error:", err);
      alert("Error: Connection to database failed.");
    });
  }

  let saveTimeout = null;

  function debounceSave() {
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(triggerServerSave, 1000);
  }

  // Bind inputs for auto-calculation and database logging
  gstAmountInput.addEventListener("input", () => {
    calculateLocal();
    debounceSave();
  });
  gstRateSelect.addEventListener("change", () => {
    calculateLocal();
    debounceSave();
  });
  document.querySelectorAll('input[name="gstMode"]').forEach(radio => {
    radio.addEventListener("change", () => {
      calculateLocal();
      debounceSave();
    });
  });
  document.querySelectorAll('input[name="transType"]').forEach(radio => {
    radio.addEventListener("change", () => {
      calculateLocal();
      syncTogglesState();
      debounceSave();
    });
  });

  // Save/Calculate on form submit
  gstForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (saveTimeout) clearTimeout(saveTimeout);
    calculateLocal();
    triggerServerSave();
  });

  // Reset calculator values
  btnReset.addEventListener("click", () => {
    if (saveTimeout) clearTimeout(saveTimeout);
    lastSavedState = {
      amount: null,
      rate: null,
      mode: null,
      tax_type: null
    };

    gstForm.reset();
    gstAmountInput.value = "";
    gstRateSelect.value = "18";
    document.getElementById("modeExclusive").checked = true;
    document.getElementById("transIntra").checked = true;
    
    amountError.style.display = "none";
    gstAmountInput.classList.remove("border-danger");
    
    // Reset sidebar and calculator mode
    sidebarLinks.forEach(l => l.classList.remove("active"));
    const gstLink = Array.from(sidebarLinks).find(l => l.getAttribute("data-route") === "gst");
    if (gstLink) {
      gstLink.classList.add("active");
    }
    
    activeMode = "standard";
    const titleEl = document.getElementById("calculatorModeTitle");
    const badgeEl = document.getElementById("calculatorModeBadge");
    titleEl.innerHTML = '<i data-lucide="sliders" class="header-icon"></i>GST Settings';
    badgeEl.textContent = "Standard";

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
    if (!historyBody) return;
    fetch(`${import.meta.env.VITE_API_URL}/api/gst-history`)
    .then(res => res.json())
    .then(resData => {
      console.log(resData);
      renderHistoryRows(resData);
    })
    .catch(err => {
      console.error("Error loading history:", err);
      updateDbStatusBanner(true);
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
      const rateVal = item.gst_rate !== undefined ? item.gst_rate : (item.rate !== undefined ? item.rate : 0);
      const typeVal = item.gst_type !== undefined ? item.gst_type : (item.type !== undefined ? item.type : "exclusive");
      const gstAmtVal = item.gst_amount !== undefined ? item.gst_amount : 0;
      const finalAmtVal = item.final_amount !== undefined ? item.final_amount : (item.total !== undefined ? item.total : 0);
      const itemId = item.id || item._id;

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

      const modeBadge = typeVal === "inclusive" 
        ? '<span class="badge" style="background-color:rgba(0, 168, 168, 0.15); color:#00A8A8;">Inclusive</span>'
        : '<span class="badge" style="background-color:rgba(15, 76, 129, 0.15); color:#0F4C81;">Exclusive</span>';

      rowsHTML += `
        <tr>
          <td>${timeStr}</td>
          <td>₹${item.amount.toFixed(2)}</td>
          <td>${rateVal}%</td>
          <td>${modeBadge}</td>
          <td>₹${gstAmtVal.toFixed(2)}</td>
          <td class="font-bold text-primary">₹${finalAmtVal.toFixed(2)}</td>
          <td>
            <button class="btn-delete-row" data-id="${itemId}" title="Remove entry">
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
    fetch(`${import.meta.env.VITE_API_URL}/api/history`, {
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

  if (btnClearHistory) {
    btnClearHistory.addEventListener("click", () => {
      if (confirm("Are you sure you want to delete all calculation logs?")) {
        clearAllHistory();
      }
    });
  }

  // Fetch official GST Slabs
  function loadGstRates() {
    fetch(`${import.meta.env.VITE_API_URL}/api/gst-rates`)
    .then(res => res.json())
    .then(resData => {
      if (resData.status === "success") {
        updateDbStatusBanner(resData.using_fallback);
        renderRatesTable(resData.rates);
      }
    })
    .catch(err => {
      console.error("Error loading GST rates:", err);
      updateDbStatusBanner(true);
    });
  }

  function renderRatesTable(rates) {
    const tableHeader = document.querySelector("#ratesSlabTable thead");
    if (tableHeader) {
      tableHeader.innerHTML = `
        <tr>
          <th>GST Rate</th>
          <th>Applicable Examples</th>
        </tr>`;
    }

    const examplesMap = {
      0: "Essential goods",
      5: "Household necessities",
      12: "Processed products",
      18: "Standard business goods and services",
      28: "Luxury and premium products"
    };

    let rowsHTML = "";
    const targetRates = [0, 5, 12, 18, 28];
    targetRates.forEach(rateVal => {
      rowsHTML += `
        <tr>
          <td><strong>${rateVal}%</strong></td>
          <td>${examplesMap[rateVal]}</td>
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
  if (contactForm) {
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

      fetch(`${import.meta.env.VITE_API_URL}/api/contact`, {
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
  }

  // Initial Data Load
  loadHistory();
  loadGstRates();

  // Handle popstate for history navigation
  window.addEventListener("popstate", () => {
    if (window.location.pathname === "/per-diem-calculator") {
      showRoute("per-diem", false);
    } else {
      const savedRoute = window.location.hash.substring(1) || "gst";
      showRoute(savedRoute, false);
    }
  });

  // Restore page state on load
  const isPerDiemPath = (window.location.pathname === "/per-diem-calculator");
  if (isPerDiemPath) {
    showRoute("per-diem", false);
  } else {
    const savedRoute = window.location.hash.substring(1) || localStorage.getItem("activeRoute") || "gst";
    const initialRoute = savedRoute === "per-diem" ? "gst" : savedRoute;
    showRoute(initialRoute, false);
  }
});
