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
    
    // Normalize path to route string if route is not explicitly passed
    let activeRouteStr = route;
    if (!activeRouteStr) {
      const path = window.location.pathname;
      if (path === "/per-diem-calculator") activeRouteStr = "per-diem";
      else if (path === "/wholesale-price") activeRouteStr = "wholesale";
      else if (path === "/shipping-label-generator") activeRouteStr = "shipping-label";
      else if (path === "/barcode-generator") activeRouteStr = "barcode";
      else if (path === "/packing-slip-generator") activeRouteStr = "packing-slip";
      else if (path === "/inventory-turnover") activeRouteStr = "inventory-turnover";
      else if (path === "/break-even-point") activeRouteStr = "break-even";
      else if (path === "/economic-order-quantity") activeRouteStr = "eoq";
      else if (path === "/reorder-point") activeRouteStr = "reorder";
      else if (path === "/purchase-order-generator") activeRouteStr = "po";
      else if (path === "/sku-generator") activeRouteStr = "sku";
      else if (path === "/hra-exemption-calculator") activeRouteStr = "hra";
      else if (path === "/statutory-bonus-calculator") activeRouteStr = "bonus";
      else if (path === "/in/payroll/gratuity-calculator/" || path === "/gratuity-calculator") activeRouteStr = "gratuity";
      else if (path === "/in/payroll/eps-pension-calculator/" || path === "/eps-pension-calculator") activeRouteStr = "eps";
      else if (path === "/in/payroll/nps-calculator/" || path === "/nps-calculator") activeRouteStr = "nps";
      else if (path === "/in/payroll/free-payslip-generator/" || path === "/free-payslip-generator") activeRouteStr = "payslip";
      else if (path === "/in/payroll/form-w9-generator/" || path === "/form-w9-generator") activeRouteStr = "w9";
      else if (path === "/in/payroll/free-project-estimate-calculator/" || path === "/free-project-estimate-calculator") activeRouteStr = "project-estimate";
      else if (path === "/in/payroll/financial-report-generator/" || path === "/financial-report-generator") activeRouteStr = "financial-report";
      else if (path === "/in/payroll/paycheck-calculator/" || path === "/paycheck-calculator") activeRouteStr = "paycheck";
      else if (path === "/in/payroll/income-tax-calculator/" || path === "/income-tax-calculator") activeRouteStr = "income-tax";
      else if (path === "/in/payroll/hmrc-furlough-calculator/" || path === "/hmrc-furlough-calculator") activeRouteStr = "hmrc";
      else if (path === "/in/payroll/uk-vat-calculator/" || path === "/uk-vat-calculator") activeRouteStr = "uk-vat";
      else if (path === "/in/payroll/uae-vat-calculator/" || path === "/uae-vat-calculator") activeRouteStr = "uae-vat";
      else if (path === "/in/payroll/uk-flat-rate-vat-calculator/" || path === "/uk-flat-rate-vat-calculator") activeRouteStr = "uk-flat";
      else if (path === "/in/payroll/uk-corp-tax-calculator/" || path === "/uk-corp-tax-calculator") activeRouteStr = "uk-corp";
      else if (path === "/in/payroll/invoice-generator/" || path === "/invoice-generator") activeRouteStr = "invoice";
      else if (path === "/in/payroll/quote-generator/" || path === "/quote-generator") activeRouteStr = "quote";
      else if (path === "/in/payroll/receipt-generator/" || path === "/receipt-generator") activeRouteStr = "receipts";
      else if (path === "/in/payroll/revenue-forecaster/" || path === "/revenue-forecaster") activeRouteStr = "forecaster";
      else activeRouteStr = "gst";
    }

    const isPerDiemRoute = (activeRouteStr === "per-diem" || activeRouteStr === "per-diem-calculator");
    const isWholesaleRoute = (activeRouteStr === "wholesale" || activeRouteStr === "wholesale-price");
    const isShippingLabelRoute = (activeRouteStr === "shipping-label" || activeRouteStr === "shipping-label-generator");
    const isBarcodeRoute = (activeRouteStr === "barcode" || activeRouteStr === "barcode-generator");
    const isPackingSlipRoute = (activeRouteStr === "packing-slip" || activeRouteStr === "packing-slip-generator");
    const isInventoryTurnoverRoute = (activeRouteStr === "inventory-turnover");
    const isBreakEvenRoute = (activeRouteStr === "break-even" || activeRouteStr === "break-even-point");
    const isEoqRoute = (activeRouteStr === "eoq" || activeRouteStr === "economic-order-quantity");
    const isReorderRoute = (activeRouteStr === "reorder" || activeRouteStr === "reorder-point");
    const isPurchaseOrderRoute = (activeRouteStr === "po" || activeRouteStr === "purchase-order-generator");
    const isSkuRoute = (activeRouteStr === "sku" || activeRouteStr === "sku-generator");
    const isHraRoute = (activeRouteStr === "hra" || activeRouteStr === "hra-exemption-calculator");
    const isBonusRoute = (activeRouteStr === "bonus" || activeRouteStr === "statutory-bonus-calculator");
    const isGratuityRoute = (activeRouteStr === "gratuity" || activeRouteStr === "gratuity-calculator");
    const isEpsRoute = (activeRouteStr === "eps" || activeRouteStr === "eps-pension-calculator");
    const isNpsRoute = (activeRouteStr === "nps" || activeRouteStr === "nps-calculator");
    const isPayslipRoute = (activeRouteStr === "payslip" || activeRouteStr === "free-payslip-generator");
    const isW9Route = (activeRouteStr === "w9" || activeRouteStr === "form-w9-generator");
    const isProjectEstimateRoute = (activeRouteStr === "project-estimate" || activeRouteStr === "free-project-estimate-calculator" || activeRouteStr === "project-cost");
    const isFinancialReportRoute = (activeRouteStr === "financial-report" || activeRouteStr === "financial-report-generator");
    const isPaycheckRoute = (activeRouteStr === "paycheck" || activeRouteStr === "paycheck-calculator");
    const isIncomeTaxRoute = (activeRouteStr === "income-tax" || activeRouteStr === "income-tax-calculator");
    const isHmrcRoute = (activeRouteStr === "hmrc" || activeRouteStr === "hmrc-furlough");
    const isUkVatRoute = (activeRouteStr === "uk-vat");
    const isUaeVatRoute = (activeRouteStr === "uae-vat");
    const isUkFlatRoute = (activeRouteStr === "uk-flat");
    const isUkCorpRoute = (activeRouteStr === "uk-corp");
    const isInvoiceRoute = (activeRouteStr === "invoice");
    const isQuoteRoute = (activeRouteStr === "quote");
    const isReceiptsRoute = (activeRouteStr === "receipts");
    const isForecasterRoute = (activeRouteStr === "forecaster");
    let activeSidebarId = isPerDiemRoute ? "perDiemSidebar" : "sidebar";

    if (isPerDiemRoute) {
      if (updateHistory) {
        if (window.location.pathname !== "/per-diem-calculator") {
          window.history.pushState({ route: "per-diem" }, "", "/per-diem-calculator");
        }
      }
    } else if (isWholesaleRoute) {
      if (updateHistory) {
        if (window.location.pathname !== "/wholesale-price") {
          window.history.pushState({ route: "wholesale" }, "", "/wholesale-price");
        }
      }
    } else if (isShippingLabelRoute) {
      if (updateHistory) {
        if (window.location.pathname !== "/shipping-label-generator") {
          window.history.pushState({ route: "shipping-label" }, "", "/shipping-label-generator");
        }
      }
    } else if (isBarcodeRoute) {
      if (updateHistory) {
        if (window.location.pathname !== "/barcode-generator") {
          window.history.pushState({ route: "barcode" }, "", "/barcode-generator");
        }
      }
    } else if (isPackingSlipRoute) {
      if (updateHistory) {
        if (window.location.pathname !== "/packing-slip-generator") {
          window.history.pushState({ route: "packing-slip" }, "", "/packing-slip-generator");
        }
      }
    } else if (isInventoryTurnoverRoute) {
      if (updateHistory) {
        if (window.location.pathname !== "/inventory-turnover") {
          window.history.pushState({ route: "inventory-turnover" }, "", "/inventory-turnover");
        }
      }
    } else if (isBreakEvenRoute) {
      if (updateHistory) {
        if (window.location.pathname !== "/break-even-point") {
          window.history.pushState({ route: "break-even" }, "", "/break-even-point");
        }
      }
    } else if (isEoqRoute) {
      if (updateHistory) {
        if (window.location.pathname !== "/economic-order-quantity") {
          window.history.pushState({ route: "eoq" }, "", "/economic-order-quantity");
        }
      }
    } else if (isSkuRoute) {
      if (updateHistory) {
        if (window.location.pathname !== "/sku-generator") {
          window.history.pushState({ route: "sku" }, "", "/sku-generator");
        }
      }
    } else if (isPurchaseOrderRoute) {
      if (updateHistory) {
        if (window.location.pathname !== "/purchase-order-generator") {
          window.history.pushState({ route: "po" }, "", "/purchase-order-generator");
        }
      }
    } else if (isReorderRoute) {
      if (updateHistory) {
        if (window.location.pathname !== "/reorder-point") {
          window.history.pushState({ route: "reorder" }, "", "/reorder-point");
        }
      }
    } else if (isHraRoute) {
      if (updateHistory) {
        if (window.location.pathname !== "/hra-exemption-calculator") {
          window.history.pushState({ route: "hra" }, "", "/hra-exemption-calculator");
        }
      }
    } else if (isBonusRoute) {
      if (updateHistory) {
        if (window.location.pathname !== "/statutory-bonus-calculator") {
          window.history.pushState({ route: "bonus" }, "", "/statutory-bonus-calculator");
        }
      }
    } else if (isGratuityRoute) {
      if (updateHistory) {
        if (window.location.pathname !== "/in/payroll/gratuity-calculator/") {
          window.history.pushState({ route: "gratuity" }, "", "/in/payroll/gratuity-calculator/");
        }
      }
    } else if (isEpsRoute) {
      if (updateHistory) {
        if (window.location.pathname !== "/in/payroll/eps-pension-calculator/") {
          window.history.pushState({ route: "eps" }, "", "/in/payroll/eps-pension-calculator/");
        }
      }
    } else if (isNpsRoute) {
      if (updateHistory) {
        if (window.location.pathname !== "/in/payroll/nps-calculator/") {
          window.history.pushState({ route: "nps" }, "", "/in/payroll/nps-calculator/");
        }
      }
    } else if (isPayslipRoute) {
      if (updateHistory) {
        if (window.location.pathname !== "/in/payroll/free-payslip-generator/") {
          window.history.pushState({ route: "payslip" }, "", "/in/payroll/free-payslip-generator/");
        }
      }
    } else if (isW9Route) {
      if (updateHistory) {
        if (window.location.pathname !== "/in/payroll/form-w9-generator/") {
          window.history.pushState({ route: "w9" }, "", "/in/payroll/form-w9-generator/");
        }
      }
    } else if (isProjectEstimateRoute) {
      if (updateHistory) {
        if (window.location.pathname !== "/in/payroll/free-project-estimate-calculator/") {
          window.history.pushState({ route: "project-estimate" }, "", "/in/payroll/free-project-estimate-calculator/");
        }
      }
    } else if (isFinancialReportRoute) {
      if (updateHistory) {
        if (window.location.pathname !== "/in/payroll/financial-report-generator/") {
          window.history.pushState({ route: "financial-report" }, "", "/in/payroll/financial-report-generator/");
        }
      }
    } else if (isPaycheckRoute) {
      if (updateHistory) {
        if (window.location.pathname !== "/in/payroll/paycheck-calculator/") {
          window.history.pushState({ route: "paycheck" }, "", "/in/payroll/paycheck-calculator/");
        }
      }
    } else if (isIncomeTaxRoute) {
      if (updateHistory) {
        if (window.location.pathname !== "/in/payroll/income-tax-calculator/") {
          window.history.pushState({ route: "income-tax" }, "", "/in/payroll/income-tax-calculator/");
        }
      }
    } else if (isHmrcRoute) {
      if (updateHistory) {
        if (window.location.pathname !== "/in/payroll/hmrc-furlough-calculator/") {
          window.history.pushState({ route: "hmrc" }, "", "/in/payroll/hmrc-furlough-calculator/");
        }
      }
    } else if (isUkVatRoute) {
      if (updateHistory) {
        if (window.location.pathname !== "/in/payroll/uk-vat-calculator/") {
          window.history.pushState({ route: "uk-vat" }, "", "/in/payroll/uk-vat-calculator/");
        }
      }
    } else if (isUaeVatRoute) {
      if (updateHistory) {
        if (window.location.pathname !== "/in/payroll/uae-vat-calculator/") {
          window.history.pushState({ route: "uae-vat" }, "", "/in/payroll/uae-vat-calculator/");
        }
      }
    } else if (isUkFlatRoute) {
      if (updateHistory) {
        if (window.location.pathname !== "/in/payroll/uk-flat-rate-vat-calculator/") {
          window.history.pushState({ route: "uk-flat" }, "", "/in/payroll/uk-flat-rate-vat-calculator/");
        }
      }
    } else if (isUkCorpRoute) {
      if (updateHistory) {
        if (window.location.pathname !== "/in/payroll/uk-corp-tax-calculator/") {
          window.history.pushState({ route: "uk-corp" }, "", "/in/payroll/uk-corp-tax-calculator/");
        }
      }
    } else if (isInvoiceRoute) {
      if (updateHistory) {
        if (window.location.pathname !== "/in/payroll/invoice-generator/") {
          window.history.pushState({ route: "invoice" }, "", "/in/payroll/invoice-generator/");
        }
      }
    } else if (isQuoteRoute) {
      if (updateHistory) {
        if (window.location.pathname !== "/in/payroll/quote-generator/") {
          window.history.pushState({ route: "quote" }, "", "/in/payroll/quote-generator/");
        }
      }
    } else if (isReceiptsRoute) {
      if (updateHistory) {
        if (window.location.pathname !== "/in/payroll/receipt-generator/") {
          window.history.pushState({ route: "receipts" }, "", "/in/payroll/receipt-generator/");
        }
      }
    } else if (isForecasterRoute) {
      if (updateHistory) {
        if (window.location.pathname !== "/in/payroll/revenue-forecaster/") {
          window.history.pushState({ route: "forecaster" }, "", "/in/payroll/revenue-forecaster/");
        }
      }
    } else {
      if (updateHistory) {
        if (window.location.pathname === "/per-diem-calculator" || window.location.pathname === "/wholesale-price" || window.location.pathname === "/shipping-label-generator" || window.location.pathname === "/barcode-generator" || window.location.pathname === "/packing-slip-generator" || window.location.pathname === "/inventory-turnover" || window.location.pathname === "/hra-exemption-calculator" || window.location.pathname === "/statutory-bonus-calculator" || shouldGoToMainPage) {
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
      } else if (isShippingLabelRoute && (route === "shipping-label" || route === "shipping-label-generator")) {
        const slLink = Array.from(links).find(l => l.getAttribute("data-route") === "shipping-label" || l.getAttribute("data-route") === "shipping-label-generator");
        if (slLink) slLink.classList.add("active");
      } else if (isBarcodeRoute && (route === "barcode" || route === "barcode-generator")) {
        const bcLink = Array.from(links).find(l => l.getAttribute("data-route") === "barcode" || l.getAttribute("data-route") === "barcode-generator");
        if (bcLink) bcLink.classList.add("active");
      } else if (isPackingSlipRoute && (route === "packing-slip" || route === "packing-slip-generator")) {
        const psLink = Array.from(links).find(l => l.getAttribute("data-route") === "packing-slip" || l.getAttribute("data-route") === "packing-slip-generator");
        if (psLink) psLink.classList.add("active");
      } else if (isInventoryTurnoverRoute && (route === "inventory-turnover")) {
        const itLink = Array.from(links).find(l => l.getAttribute("data-route") === "inventory-turnover");
        if (itLink) itLink.classList.add("active");
      } else if (isBreakEvenRoute && (route === "break-even" || route === "break-even-point")) {
        const beLink = Array.from(links).find(l => l.getAttribute("data-route") === "break-even" || l.getAttribute("data-route") === "break-even-point");
        if (beLink) beLink.classList.add("active");
      } else if (isEoqRoute && (route === "eoq" || route === "economic-order-quantity")) {
        const eoqLink = Array.from(links).find(l => l.getAttribute("data-route") === "eoq" || l.getAttribute("data-route") === "economic-order-quantity");
        if (eoqLink) eoqLink.classList.add("active");
      } else if (isSkuRoute && (route === "sku" || route === "sku-generator")) {
        const skuLink = Array.from(links).find(l => l.getAttribute("data-route") === "sku" || l.getAttribute("data-route") === "sku-generator");
        if (skuLink) skuLink.classList.add("active");
      } else if (isPurchaseOrderRoute && (route === "po" || route === "purchase-order-generator")) {
        const poLink = Array.from(links).find(l => l.getAttribute("data-route") === "po" || l.getAttribute("data-route") === "purchase-order-generator");
        if (poLink) poLink.classList.add("active");
      } else if (isReorderRoute && (route === "reorder" || route === "reorder-point")) {
        const reorderLink = Array.from(links).find(l => l.getAttribute("data-route") === "reorder" || l.getAttribute("data-route") === "reorder-point");
        if (reorderLink) reorderLink.classList.add("active");
      } else if (isHraRoute && (route === "hra" || route === "hra-exemption-calculator")) {
        const hraLink = Array.from(links).find(l => l.getAttribute("data-route") === "hra" || l.getAttribute("data-route") === "hra-exemption-calculator");
        if (hraLink) hraLink.classList.add("active");
      } else if (isBonusRoute && (route === "bonus" || route === "statutory-bonus-calculator")) {
        const bonusLink = Array.from(links).find(l => l.getAttribute("data-route") === "bonus");
        if (bonusLink) bonusLink.classList.add("active");
      } else if (isGratuityRoute && (route === "gratuity" || route === "gratuity-calculator")) {
        const gratuityLink = Array.from(links).find(l => l.getAttribute("data-route") === "gratuity");
        if (gratuityLink) gratuityLink.classList.add("active");
      } else if (isEpsRoute && (route === "eps" || route === "eps-pension-calculator")) {
        const epsLink = Array.from(links).find(l => l.getAttribute("data-route") === "eps");
        if (epsLink) epsLink.classList.add("active");
      } else if (isNpsRoute && (route === "nps" || route === "nps-calculator")) {
        const npsLink = Array.from(links).find(l => l.getAttribute("data-route") === "nps");
        if (npsLink) npsLink.classList.add("active");
      } else if (isPayslipRoute && (route === "payslip" || route === "free-payslip-generator")) {
        const payslipLink = Array.from(links).find(l => l.getAttribute("data-route") === "payslip");
        if (payslipLink) payslipLink.classList.add("active");
      } else if (isW9Route && (route === "w9" || route === "form-w9-generator")) {
        const w9Link = Array.from(links).find(l => l.getAttribute("data-route") === "w9");
        if (w9Link) w9Link.classList.add("active");
      } else if (isProjectEstimateRoute && (route === "project-estimate" || route === "free-project-estimate-calculator" || route === "project-cost")) {
        const peLink = Array.from(links).find(l => l.getAttribute("data-route") === "project-estimate" || l.getAttribute("data-route") === "project-cost");
        if (peLink) peLink.classList.add("active");
      } else if (isFinancialReportRoute && (route === "financial-report" || route === "financial-report-generator")) {
        const frLink = Array.from(links).find(l => l.getAttribute("data-route") === "financial-report");
        if (frLink) frLink.classList.add("active");
      } else if (isPaycheckRoute && (route === "paycheck" || route === "paycheck-calculator")) {
        const paycheckLink = Array.from(links).find(l => l.getAttribute("data-route") === "paycheck");
        if (paycheckLink) paycheckLink.classList.add("active");
      } else if (isIncomeTaxRoute && (route === "income-tax" || route === "income-tax-calculator")) {
        const itLink = Array.from(links).find(l => l.getAttribute("data-route") === "income-tax");
        if (itLink) itLink.classList.add("active");
      } else if (isHmrcRoute && (route === "hmrc" || route === "hmrc-furlough")) {
        const hmrcLink = Array.from(links).find(l => l.getAttribute("data-route") === "hmrc");
        if (hmrcLink) hmrcLink.classList.add("active");
      } else if (isUkVatRoute && route === "uk-vat") {
        const l = Array.from(links).find(link => link.getAttribute("data-route") === "uk-vat");
        if (l) l.classList.add("active");
      } else if (isUaeVatRoute && route === "uae-vat") {
        const l = Array.from(links).find(link => link.getAttribute("data-route") === "uae-vat");
        if (l) l.classList.add("active");
      } else if (isUkFlatRoute && route === "uk-flat") {
        const l = Array.from(links).find(link => link.getAttribute("data-route") === "uk-flat");
        if (l) l.classList.add("active");
      } else if (isUkCorpRoute && route === "uk-corp") {
        const l = Array.from(links).find(link => link.getAttribute("data-route") === "uk-corp");
        if (l) l.classList.add("active");
      } else if (isInvoiceRoute && route === "invoice") {
        const l = Array.from(links).find(link => link.getAttribute("data-route") === "invoice");
        if (l) l.classList.add("active");
      } else if (isQuoteRoute && route === "quote") {
        const l = Array.from(links).find(link => link.getAttribute("data-route") === "quote");
        if (l) l.classList.add("active");
      } else if (isReceiptsRoute && route === "receipts") {
        const l = Array.from(links).find(link => link.getAttribute("data-route") === "receipts");
        if (l) l.classList.add("active");
      } else if (isForecasterRoute && route === "forecaster") {
        const l = Array.from(links).find(link => link.getAttribute("data-route") === "forecaster");
        if (l) l.classList.add("active");
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

    if (isBreakEvenRoute) {
      labelText = "Break-Even Point Calculator";
    } else if (isEoqRoute) {
      labelText = "Economic Order Quantity Calculator";
    } else if (isSkuRoute) {
      labelText = "SKU Generator";
    } else if (isPurchaseOrderRoute) {
      labelText = "Purchase Order Generator";
    } else if (isReorderRoute) {
      labelText = "Reorder Point Calculator";
    } else if (isHraRoute) {
      labelText = "HRA Exemption Calculator";
    } else if (isBonusRoute) {
      labelText = "Statutory Bonus Calculator";
    } else if (isEpsRoute) {
      labelText = "EPS Pension Calculator";
    } else if (isPayslipRoute) {
      labelText = "Free Payslip Generator";
    } else if (isW9Route) {
      labelText = "Form W-9 Generator";
    } else if (isProjectEstimateRoute) {
      labelText = "Free Project Cost Estimate Calculator";
    } else if (isFinancialReportRoute) {
      labelText = "Financial Report Generator";
    } else if (isPaycheckRoute) {
      labelText = "Paycheck Calculator";
    } else if (isIncomeTaxRoute) {
      labelText = "Income Tax Calculator";
    } else if (isHmrcRoute) {
      labelText = "HMRC Furlough Claim Calculator";
    } else if (isUkVatRoute) {
      labelText = "UK VAT Calculator";
    } else if (isUaeVatRoute) {
      labelText = "UAE VAT Calculator";
    } else if (isUkFlatRoute) {
      labelText = "UK Flat Rate VAT Calculator";
    } else if (isUkCorpRoute) {
      labelText = "UK Corporation Tax Calculator";
    } else if (isInvoiceRoute) {
      labelText = "Invoice Generator";
    } else if (isQuoteRoute) {
      labelText = "Quote/Estimate Generator";
    } else if (isReceiptsRoute) {
      labelText = "Receipt Generator";
    } else if (isForecasterRoute) {
      labelText = "Revenue Forecaster";
    }

    const headerTitleEl = document.querySelector(".header-title");
    if (headerTitleEl) {
      headerTitleEl.textContent = labelText;
    }

    const headerSubtitleEl = document.querySelector(".header-subtitle");
    if (headerSubtitleEl) {
      if (isBreakEvenRoute || isEoqRoute || isReorderRoute) {
        headerSubtitleEl.textContent = "by Softrate";
      } else {
        headerSubtitleEl.textContent = "By Softrate";
      }
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
    const wholesaleSection = document.getElementById("wholesale-section");
    const shippingLabelSection = document.getElementById("shipping-label-section");
    const barcodeSection = document.getElementById("barcode-section");
    const packingSlipSection = document.getElementById("packing-slip-section");
    const inventoryTurnoverSection = document.getElementById("inventory-turnover-section");
    const breakEvenSection = document.getElementById("break-even-section");
    const eoqSection = document.getElementById("eoq-section");
    const reorderSection = document.getElementById("reorder-section");
    const purchaseOrderSection = document.getElementById("purchase-order-section");
    const skuSection = document.getElementById("sku-section");
    const hraSection = document.getElementById("hra-section");
    const bonusSection = document.getElementById("bonus-section");
    const gratuitySection = document.getElementById("gratuity-section");
    const epsSection = document.getElementById("eps-section");
    const npsSection = document.getElementById("nps-section");
    const payslipSection = document.getElementById("payslip-section");
    const w9Section = document.getElementById("w9-section");
    const projectEstimateSection = document.getElementById("project-estimate-section");
    const financialReportSection = document.getElementById("financial-report-section");
    const paycheckSection = document.getElementById("paycheck-section");
    const incomeTaxSection = document.getElementById("income-tax-section");
    const hmrcSection = document.getElementById("hmrc-section");
    const ukVatSection = document.getElementById("uk-vat-section");
    const uaeVatSection = document.getElementById("uae-vat-section");
    const ukFlatSection = document.getElementById("uk-flat-section");
    const ukCorpSection = document.getElementById("uk-corp-section");
    const invoiceSection = document.getElementById("invoice-section");
    const quoteSection = document.getElementById("quote-section");
    const receiptsSection = document.getElementById("receipts-section");
    const forecasterSection = document.getElementById("forecaster-section");
 
    if (calcSection) calcSection.classList.add("hide");
    if (ratesSection) ratesSection.classList.add("hide");
    if (faqSection) faqSection.classList.add("hide");
    if (aboutSection) aboutSection.classList.add("hide");
    if (contactSection) contactSection.classList.add("hide");
    if (comingSoonSection) comingSoonSection.classList.add("hide");
    if (expenseSection) expenseSection.classList.add("hide");
    if (perDiemSection) perDiemSection.classList.add("hide");
    if (wholesaleSection) wholesaleSection.classList.add("hide");
    if (shippingLabelSection) shippingLabelSection.classList.add("hide");
    if (barcodeSection) barcodeSection.classList.add("hide");
    if (packingSlipSection) packingSlipSection.classList.add("hide");
    if (inventoryTurnoverSection) inventoryTurnoverSection.classList.add("hide");
    if (breakEvenSection) breakEvenSection.classList.add("hide");
    if (eoqSection) eoqSection.classList.add("hide");
    if (reorderSection) reorderSection.classList.add("hide");
    if (purchaseOrderSection) purchaseOrderSection.classList.add("hide");
    if (skuSection) skuSection.classList.add("hide");
    if (hraSection) hraSection.classList.add("hide");
    if (bonusSection) bonusSection.classList.add("hide");
    if (gratuitySection) gratuitySection.classList.add("hide");
    if (epsSection) epsSection.classList.add("hide");
    if (npsSection) npsSection.classList.add("hide");
    if (payslipSection) payslipSection.classList.add("hide");
    if (w9Section) w9Section.classList.add("hide");
    if (projectEstimateSection) projectEstimateSection.classList.add("hide");
    if (financialReportSection) financialReportSection.classList.add("hide");
    if (paycheckSection) paycheckSection.classList.add("hide");
    if (incomeTaxSection) incomeTaxSection.classList.add("hide");
    if (hmrcSection) hmrcSection.classList.add("hide");
    if (ukVatSection) ukVatSection.classList.add("hide");
    if (uaeVatSection) uaeVatSection.classList.add("hide");
    if (ukFlatSection) ukFlatSection.classList.add("hide");
    if (ukCorpSection) ukCorpSection.classList.add("hide");
    if (invoiceSection) invoiceSection.classList.add("hide");
    if (quoteSection) quoteSection.classList.add("hide");
    if (receiptsSection) receiptsSection.classList.add("hide");
    if (forecasterSection) forecasterSection.classList.add("hide");
 
    if (isPerDiemRoute && (route === "per-diem" || route === "per-diem-calculator")) {
      if (perDiemSection) perDiemSection.classList.remove("hide");
      if (perDiemSection) perDiemSection.scrollIntoView({ behavior: "smooth" });
      document.dispatchEvent(new CustomEvent("perDiemRouteLoaded"));
    } else if (isWholesaleRoute && (route === "wholesale" || route === "wholesale-price")) {
      if (wholesaleSection) wholesaleSection.classList.remove("hide");
      if (wholesaleSection) wholesaleSection.scrollIntoView({ behavior: "smooth" });
      document.dispatchEvent(new CustomEvent("wholesaleRouteLoaded"));
    } else if (isShippingLabelRoute && (route === "shipping-label" || route === "shipping-label-generator")) {
      if (shippingLabelSection) shippingLabelSection.classList.remove("hide");
      if (shippingLabelSection) shippingLabelSection.scrollIntoView({ behavior: "smooth" });
      document.dispatchEvent(new CustomEvent("shippingLabelRouteLoaded"));
    } else if (isBarcodeRoute && (route === "barcode" || route === "barcode-generator")) {
      if (barcodeSection) barcodeSection.classList.remove("hide");
      if (barcodeSection) barcodeSection.scrollIntoView({ behavior: "smooth" });
      document.dispatchEvent(new CustomEvent("barcodeRouteLoaded"));
    } else if (isPackingSlipRoute && (route === "packing-slip" || route === "packing-slip-generator")) {
      if (packingSlipSection) packingSlipSection.classList.remove("hide");
      if (packingSlipSection) packingSlipSection.scrollIntoView({ behavior: "smooth" });
      document.dispatchEvent(new CustomEvent("packingSlipRouteLoaded"));
    } else if (isInventoryTurnoverRoute && (route === "inventory-turnover")) {
      if (inventoryTurnoverSection) inventoryTurnoverSection.classList.remove("hide");
      if (inventoryTurnoverSection) inventoryTurnoverSection.scrollIntoView({ behavior: "smooth" });
      document.dispatchEvent(new CustomEvent("inventoryTurnoverRouteLoaded"));
    } else if (isBreakEvenRoute && (route === "break-even" || route === "break-even-point")) {
      if (breakEvenSection) breakEvenSection.classList.remove("hide");
      if (breakEvenSection) breakEvenSection.scrollIntoView({ behavior: "smooth" });
      document.dispatchEvent(new CustomEvent("breakEvenRouteLoaded"));
    } else if (isEoqRoute && (route === "eoq" || route === "economic-order-quantity")) {
      if (eoqSection) eoqSection.classList.remove("hide");
      if (eoqSection) eoqSection.scrollIntoView({ behavior: "smooth" });
      document.dispatchEvent(new CustomEvent("eoqRouteLoaded"));
    } else if (isSkuRoute && (route === "sku" || route === "sku-generator")) {
      if (skuSection) skuSection.classList.remove("hide");
      if (skuSection) skuSection.scrollIntoView({ behavior: "smooth" });
      document.dispatchEvent(new CustomEvent("skuRouteLoaded"));
    } else if (isPurchaseOrderRoute && (route === "po" || route === "purchase-order-generator")) {
      if (purchaseOrderSection) purchaseOrderSection.classList.remove("hide");
      if (purchaseOrderSection) purchaseOrderSection.scrollIntoView({ behavior: "smooth" });
      document.dispatchEvent(new CustomEvent("purchaseOrderRouteLoaded"));
    } else if (isReorderRoute && (route === "reorder" || route === "reorder-point")) {
      if (reorderSection) reorderSection.classList.remove("hide");
      if (reorderSection) reorderSection.scrollIntoView({ behavior: "smooth" });
      document.dispatchEvent(new CustomEvent("reorderRouteLoaded"));
    } else if (isHraRoute && (route === "hra" || route === "hra-exemption-calculator")) {
      if (hraSection) hraSection.classList.remove("hide");
      if (hraSection) hraSection.scrollIntoView({ behavior: "smooth" });
      document.dispatchEvent(new CustomEvent("hraRouteLoaded"));
    } else if (isBonusRoute && (route === "bonus" || route === "statutory-bonus-calculator")) {
      if (bonusSection) bonusSection.classList.remove("hide");
      if (bonusSection) bonusSection.scrollIntoView({ behavior: "smooth" });
      document.dispatchEvent(new CustomEvent("bonusRouteLoaded"));
    } else if (isGratuityRoute && (route === "gratuity" || route === "gratuity-calculator")) {
      if (gratuitySection) gratuitySection.classList.remove("hide");
      if (gratuitySection) gratuitySection.scrollIntoView({ behavior: "smooth" });
      document.dispatchEvent(new CustomEvent("gratuityRouteLoaded"));
    } else if (isEpsRoute && (route === "eps" || route === "eps-pension-calculator")) {
      if (epsSection) epsSection.classList.remove("hide");
      if (epsSection) epsSection.scrollIntoView({ behavior: "smooth" });
      document.dispatchEvent(new CustomEvent("epsRouteLoaded"));
    } else if (isNpsRoute && (route === "nps" || route === "nps-calculator")) {
      if (npsSection) npsSection.classList.remove("hide");
      if (npsSection) npsSection.scrollIntoView({ behavior: "smooth" });
      document.dispatchEvent(new CustomEvent("npsRouteLoaded"));
    } else if (isPayslipRoute && (route === "payslip" || route === "free-payslip-generator")) {
      if (payslipSection) payslipSection.classList.remove("hide");
      if (payslipSection) payslipSection.scrollIntoView({ behavior: "smooth" });
      document.dispatchEvent(new CustomEvent("payslipRouteLoaded"));
    } else if (isW9Route && (route === "w9" || route === "form-w9-generator")) {
      if (w9Section) w9Section.classList.remove("hide");
      if (w9Section) w9Section.scrollIntoView({ behavior: "smooth" });
      document.dispatchEvent(new CustomEvent("w9RouteLoaded"));
    } else if (isProjectEstimateRoute && (route === "project-estimate" || route === "free-project-estimate-calculator" || route === "project-cost")) {
      if (projectEstimateSection) projectEstimateSection.classList.remove("hide");
      if (projectEstimateSection) projectEstimateSection.scrollIntoView({ behavior: "smooth" });
      document.dispatchEvent(new CustomEvent("projectEstimateRouteLoaded"));
    } else if (isFinancialReportRoute && (route === "financial-report" || route === "financial-report-generator")) {
      if (financialReportSection) financialReportSection.classList.remove("hide");
      if (financialReportSection) financialReportSection.scrollIntoView({ behavior: "smooth" });
      document.dispatchEvent(new CustomEvent("financialReportRouteLoaded"));
    } else if (isPaycheckRoute && (route === "paycheck" || route === "paycheck-calculator")) {
      if (paycheckSection) paycheckSection.classList.remove("hide");
      if (paycheckSection) paycheckSection.scrollIntoView({ behavior: "smooth" });
      document.dispatchEvent(new CustomEvent("paycheckRouteLoaded"));
    } else if (isIncomeTaxRoute && (route === "income-tax" || route === "income-tax-calculator")) {
      if (incomeTaxSection) incomeTaxSection.classList.remove("hide");
      if (incomeTaxSection) incomeTaxSection.scrollIntoView({ behavior: "smooth" });
    } else if (isHmrcRoute && (route === "hmrc" || route === "hmrc-furlough")) {
      if (hmrcSection) hmrcSection.classList.remove("hide");
      if (hmrcSection) hmrcSection.scrollIntoView({ behavior: "smooth" });
    } else if (isUkVatRoute && route === "uk-vat") {
      if (ukVatSection) ukVatSection.classList.remove("hide");
      if (ukVatSection) ukVatSection.scrollIntoView({ behavior: "smooth" });
    } else if (isUaeVatRoute && route === "uae-vat") {
      if (uaeVatSection) uaeVatSection.classList.remove("hide");
      if (uaeVatSection) uaeVatSection.scrollIntoView({ behavior: "smooth" });
    } else if (isUkFlatRoute && route === "uk-flat") {
      if (ukFlatSection) ukFlatSection.classList.remove("hide");
      if (ukFlatSection) ukFlatSection.scrollIntoView({ behavior: "smooth" });
    } else if (isUkCorpRoute && route === "uk-corp") {
      if (ukCorpSection) ukCorpSection.classList.remove("hide");
      if (ukCorpSection) ukCorpSection.scrollIntoView({ behavior: "smooth" });
    } else if (isInvoiceRoute && route === "invoice") {
      if (invoiceSection) invoiceSection.classList.remove("hide");
      if (invoiceSection) invoiceSection.scrollIntoView({ behavior: "smooth" });
    } else if (isQuoteRoute && route === "quote") {
      if (quoteSection) quoteSection.classList.remove("hide");
      if (quoteSection) quoteSection.scrollIntoView({ behavior: "smooth" });
    } else if (isReceiptsRoute && route === "receipts") {
      if (receiptsSection) receiptsSection.classList.remove("hide");
      if (receiptsSection) receiptsSection.scrollIntoView({ behavior: "smooth" });
    } else if (isForecasterRoute && route === "forecaster") {
      if (forecasterSection) forecasterSection.classList.remove("hide");
      if (forecasterSection) forecasterSection.scrollIntoView({ behavior: "smooth" });
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
    } else {
      if (comingSoonSection) comingSoonSection.classList.remove("hide");
      if (comingSoonTitle) comingSoonTitle.textContent = `${labelText} - Coming Soon`;
      if (comingSoonSection) comingSoonSection.scrollIntoView({ behavior: "smooth" });
    }
 
    if (!isPerDiemRoute && !isWholesaleRoute && !isShippingLabelRoute && !isBarcodeRoute && !isPackingSlipRoute && !isInventoryTurnoverRoute && !isBreakEvenRoute && !isEoqRoute && !isReorderRoute && !isHraRoute && !isBonusRoute && !isGratuityRoute && !isEpsRoute && !isNpsRoute && !isPayslipRoute && !isW9Route && !isProjectEstimateRoute && !isFinancialReportRoute && !isPaycheckRoute && !isIncomeTaxRoute && !isHmrcRoute) {
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
    gstRateSelect.value = "";
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
    } else if (window.location.pathname === "/wholesale-price") {
      showRoute("wholesale", false);
    } else if (window.location.pathname === "/shipping-label-generator") {
      showRoute("shipping-label", false);
    } else if (window.location.pathname === "/barcode-generator") {
      showRoute("barcode", false);
    } else if (window.location.pathname === "/packing-slip-generator") {
      showRoute("packing-slip", false);
    } else if (window.location.pathname === "/inventory-turnover") {
      showRoute("inventory-turnover", false);
    } else if (window.location.pathname === "/purchase-order-generator") {
      showRoute("po", false);
    } else if (window.location.pathname === "/sku-generator") {
      showRoute("sku", false);
    } else if (window.location.pathname === "/hra-exemption-calculator") {
      showRoute("hra", false);
    } else if (window.location.pathname === "/statutory-bonus-calculator") {
      showRoute("bonus", false);
    } else if (window.location.pathname === "/in/payroll/gratuity-calculator/" || window.location.pathname === "/gratuity-calculator") {
      showRoute("gratuity", false);
    } else if (window.location.pathname === "/in/payroll/eps-pension-calculator/" || window.location.pathname === "/eps-pension-calculator") {
      showRoute("eps", false);
    } else if (window.location.pathname === "/in/payroll/nps-calculator/" || window.location.pathname === "/nps-calculator") {
      showRoute("nps", false);
    } else if (window.location.pathname === "/in/payroll/free-payslip-generator/" || window.location.pathname === "/free-payslip-generator") {
      showRoute("payslip", false);
    } else if (window.location.pathname === "/in/payroll/form-w9-generator/" || window.location.pathname === "/form-w9-generator") {
      showRoute("w9", false);
    } else if (window.location.pathname === "/in/payroll/free-project-estimate-calculator/" || window.location.pathname === "/free-project-estimate-calculator" || window.location.pathname === "/project-cost") {
      showRoute("project-estimate", false);
    } else if (window.location.pathname === "/in/payroll/financial-report-generator/" || window.location.pathname === "/financial-report-generator") {
      showRoute("financial-report", false);
    } else {
      const savedRoute = window.location.hash.substring(1) || "gst";
      showRoute(savedRoute, false);
    }
  });

  // Restore page state on load
  const isPerDiemPath = (window.location.pathname === "/per-diem-calculator");
  const isWholesalePath = (window.location.pathname === "/wholesale-price");
  const isShippingLabelPath = (window.location.pathname === "/shipping-label-generator");
  const isBarcodePath = (window.location.pathname === "/barcode-generator");
  const isPackingSlipPath = (window.location.pathname === "/packing-slip-generator");
  const isInventoryTurnoverPath = (window.location.pathname === "/inventory-turnover");
  const isPurchaseOrderPath = (window.location.pathname === "/purchase-order-generator");
  const isSkuPath = (window.location.pathname === "/sku-generator");
  const isHraPath = (window.location.pathname === "/hra-exemption-calculator");
  const isBonusPath = (window.location.pathname === "/statutory-bonus-calculator");
  const isGratuityPath = (window.location.pathname === "/in/payroll/gratuity-calculator/" || window.location.pathname === "/gratuity-calculator");
  const isEpsPath = (window.location.pathname === "/in/payroll/eps-pension-calculator/" || window.location.pathname === "/eps-pension-calculator");
  const isNpsPath = (window.location.pathname === "/in/payroll/nps-calculator/" || window.location.pathname === "/nps-calculator");
  const isPayslipPath = (window.location.pathname === "/in/payroll/free-payslip-generator/" || window.location.pathname === "/free-payslip-generator");
  const isW9Path = (window.location.pathname === "/in/payroll/form-w9-generator/" || window.location.pathname === "/form-w9-generator");
  const isProjectEstimatePath = (window.location.pathname === "/in/payroll/free-project-estimate-calculator/" || window.location.pathname === "/free-project-estimate-calculator" || window.location.pathname === "/project-cost");
  const isFinancialReportPath = (window.location.pathname === "/in/payroll/financial-report-generator/" || window.location.pathname === "/financial-report-generator");
  if (isPerDiemPath) {
    showRoute("per-diem", false);
  } else if (isWholesalePath) {
    showRoute("wholesale", false);
  } else if (isShippingLabelPath) {
    showRoute("shipping-label", false);
  } else if (isBarcodePath) {
    showRoute("barcode", false);
  } else if (isPackingSlipPath) {
    showRoute("packing-slip", false);
  } else if (isInventoryTurnoverPath) {
    showRoute("inventory-turnover", false);
  } else if (isPurchaseOrderPath) {
    showRoute("po", false);
  } else if (isSkuPath) {
    showRoute("sku", false);
  } else if (isHraPath) {
    showRoute("hra", false);
  } else if (isBonusPath) {
    showRoute("bonus", false);
  } else if (isGratuityPath) {
    showRoute("gratuity", false);
  } else if (isEpsPath) {
    showRoute("eps", false);
  } else if (isNpsPath) {
    showRoute("nps", false);
  } else if (isPayslipPath) {
    showRoute("payslip", false);
  } else if (isW9Path) {
    showRoute("w9", false);
  } else if (isProjectEstimatePath) {
    showRoute("project-estimate", false);
  } else if (isFinancialReportPath) {
    showRoute("financial-report", false);
  } else {
    const savedRoute = window.location.hash.substring(1) || localStorage.getItem("activeRoute") || "gst";
    const initialRoute = (savedRoute === "per-diem" || savedRoute === "wholesale" || savedRoute === "shipping-label" || savedRoute === "barcode" || savedRoute === "packing-slip" || savedRoute === "inventory-turnover" || savedRoute === "po" || savedRoute === "sku" || savedRoute === "hra" || savedRoute === "bonus" || savedRoute === "gratuity" || savedRoute === "eps" || savedRoute === "nps" || savedRoute === "payslip" || savedRoute === "w9" || savedRoute === "project-estimate" || savedRoute === "financial-report") ? "gst" : savedRoute;
    showRoute(initialRoute, false);
  }
});
