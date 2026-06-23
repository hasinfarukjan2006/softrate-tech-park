// eps.js - EPF/EPS comparative pension calculation logic for Softrate Tech Park

document.addEventListener('DOMContentLoaded', function () {
  const employeeContribution = document.getElementById("employee-contribution");
  const employerContribution = document.getElementById("employer-contribution");
  const epsContribution = document.getElementById("eps-contribution");
  const currentSalary = document.getElementById("current-salary");
  const yearlySalaryGrowth = document.getElementById("yearly-salary-growth");
  const DOJ = document.getElementById("date-of-join");
  const DOR = document.getElementById("date-of-retirement");
  const yearsOfServiceInput = document.getElementById("years-of-service");
  
  let experience = 0;
  let autoCalculate = false;
  let is_result_page = false;
  
  let higherPension = {
    employerPFShare: 0,
    empContribution: 0,
    avgSalary: 0,
    pension: 7500,
    totalemployerPFShare: 0,
    epsLatterContribution: 0,
    epsMovedfromEPF: 0,
    initialEPSContr: 0,
    epsShareContr: 0,
    totalepsShare: 0,
    expectedMonthlyPension: 0
  };
  
  let capped15kPension = {
    employerPFShare: 0,
    empContribution: 0,
    pension: 0,
    totalemployerPFShare: 0,
    epsShareContr: 0,
    initialEPSContr: 0,
    epsLatterContribution: 0,
    totalepsShare: 0
  };

  const modal = document.getElementById("img-modal");
  const image = document.getElementById("passbook-img");

  function resetPensionObjects() {
    higherPension = {
      employerPFShare: 0,
      empContribution: 0,
      avgSalary: 0,
      pension: 7500,
      totalemployerPFShare: 0,
      epsLatterContribution: 0,
      epsMovedfromEPF: 0,
      initialEPSContr: 0,
      epsShareContr: 0,
      totalepsShare: 0,
      expectedMonthlyPension: 0
    };
    capped15kPension = {
      employerPFShare: 0,
      empContribution: 0,
      pension: 0,
      totalemployerPFShare: 0,
      epsShareContr: 0,
      initialEPSContr: 0,
      epsLatterContribution: 0,
      totalepsShare: 0
    };
  }

  window.view = function(e) {
    if (image && modal) {
      image.src = "https://www.zohowebstatic.com/payroll/images/free-eps-pension-calculator/passbook-" + e + ".png";
      modal.style.display = "block";
    }
  };

  window.closeImg = function() {
    if (modal) {
      modal.style.display = "none";
    }
  };

  window.checkDOJ = function() {
    if (!DOJ.value || !DOR.value) return;
    
    var partsJoin = DOJ.value.split('-');
    var joinYear = parseInt(partsJoin[0], 10);
    var joinMonth = parseInt(partsJoin[1], 10) - 1;
    var joinDate = new Date(joinYear, joinMonth, 1);
    
    var partsRetire = DOR.value.split('-');
    var retireYear = parseInt(partsRetire[0], 10);
    var retireMonth = parseInt(partsRetire[1], 10) - 1;
    var retireDate = new Date(retireYear, retireMonth, 1);

    if (joinDate > retireDate) {
      DOR.value = DOJ.value;
      retireDate = new Date(joinYear, joinMonth, 1);
    }
    
    DOR.min = DOJ.value;
    getMonthDifference(joinDate, retireDate);
  };

  function getMonthDifference(e, t) {
    experience = t.getMonth() - e.getMonth() + 12 * (t.getFullYear() - e.getFullYear());
    var n = getWords(experience);
    if (yearsOfServiceInput) {
      yearsOfServiceInput.value = n;
    }
  }

  function getWords(e) {
    function t(e, t) { return 1 === e ? t.one : t.other; }
    var n = e % 12,
        o = Math.floor(e / 12),
        r = [];
    if (o) r.push(o + " " + t(o, { one: "year", other: "years" }));
    if (n) r.push(n + " " + t(n, { one: "month", other: "months" }));
    return r.join(" and ") || "0 months";
  }

  function checkException() {
    var e = true;
    document.querySelectorAll("#eps-section .invalid-feedback").forEach(el => {
      el.style.display = "none";
    });

    if (!employeeContribution.value) {
      const err = document.querySelector("#invalid-emp-contr");
      if (err) err.style.display = "block";
      e = false;
    }
    if (!employerContribution.value) {
      const err = document.querySelector("#invalid-emplyr-contr");
      if (err) err.style.display = "block";
      e = false;
    }
    if (!epsContribution.value) {
      const err = document.querySelector("#invalid-eps-contr");
      if (err) err.style.display = "block";
      e = false;
    }
    if (!currentSalary.value) {
      const err = document.querySelector("#invalid-salary");
      if (err) err.style.display = "block";
      e = false;
    }
    if (!yearlySalaryGrowth.value) {
      const err = document.querySelector("#invalid-salary-growth");
      if (err) err.style.display = "block";
      e = false;
    }
    if (!DOJ.value) {
      const err = document.querySelector("#invalid-joining-date");
      if (err) err.style.display = "block";
      e = false;
    }
    if (!DOR.value) {
      const err = document.querySelector("#invalid-retirement-date");
      if (err) err.style.display = "block";
      e = false;
    }
    return e;
  }

  window.onResetvalue = function() {
    autoCalculate = false;
    
    const calcDiv = document.querySelector("#calc");
    if (calcDiv) calcDiv.style.display = "block";
    
    const resetcalDiv = document.querySelector("#resetcal");
    if (resetcalDiv) resetcalDiv.style.display = "none";
    
    const resultsSec = document.querySelector("#results-section");
    if (resultsSec) resultsSec.style.display = "none";
    
    document.querySelectorAll("#eps-section .invalid-feedback").forEach(el => {
      el.style.display = "none";
    });

    employeeContribution.value = "";
    employerContribution.value = "";
    epsContribution.value = "";
    currentSalary.value = "";
    yearlySalaryGrowth.value = "";
    
    DOJ.value = "2014-08";
    
    var today = new Date();
    var yyyy = today.getFullYear();
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    DOR.value = yyyy + "-" + mm;
    
    window.checkDOJ();
  };

  window.epsCalculation = function() {
    is_result_page = true;
    if (checkException()) {
      calculate();
      printData();
      showResults();
    }
  };

  function calculate() {
    resetPensionObjects();
    
    var e = Number(employerContribution.value) + Number(epsContribution.value);
    var m = Number(employeeContribution.value);
    var u = Number(currentSalary.value);
    var c = Number(yearlySalaryGrowth.value);
    
    var r = new Date();
    
    var partsJoin = DOJ.value.split('-');
    var a = new Date(parseInt(partsJoin[0], 10), parseInt(partsJoin[1], 10) - 1, 1);
    
    var partsRetire = DOR.value.split('-');
    var l = new Date(parseInt(partsRetire[0], 10), parseInt(partsRetire[1], 10) - 1, 1);
    
    var i = l.getMonth() - r.getMonth() + 12 * (l.getFullYear() - r.getFullYear());
    
    var h = l.getFullYear() - a.getFullYear();
    if (h > 20) {
      h += 2;
    }
    if (h >= 35) {
      h = 35;
    }
    
    var f = Math.round(e / 12 * 8.33);
    var S = Math.abs(f - Number(epsContribution.value));
    S += Math.round(S / 8.33 * 1.16);
    
    var D = a.getFullYear();
    if (D < 2000) S *= 0.65;
    else if (D < 2002) S *= 0.7;
    else if (D < 2004) S *= 0.75;
    else if (D < 2006) S *= 0.8;
    else if (D < 2008) S *= 0.85;
    else if (D < 2010) S *= 0.9;
    else if (D < 2012) S *= 0.95;
    
    higherPension.epsMovedfromEPF = Math.round(S);
    
    const hikeEl = document.querySelector("#hike-percent");
    if (hikeEl) hikeEl.innerText = c;
    const hikeElMob = document.querySelector("#hike-percent-mob");
    if (hikeElMob) hikeElMob.innerText = c;
    
    var d = 0;
    var y = 0;
    var b = 0;
    var t = Number(employerContribution.value);
    var n = Number(epsContribution.value);
    var p = Number(employerContribution.value);
    var g = Number(epsContribution.value);
    var o = n;
    
    higherPension.initialEPSContr = n;
    capped15kPension.initialEPSContr = n;
    
    var v = r.getMonth() + 1;
    var s = v - 10;
    if (s < 0) s += 12;
    
    for (var q = 0, M = 1; M < i; M++) {
      if (s >= 12) {
        s = 0;
        u += Math.round(u * c / 100);
      }
      if (M >= i - 60) {
        d += u;
        y++;
      }
      s++;
      q = u;
      if (u > 15000) {
        b = Math.round(0.0116 * (u - 15000));
        q = 15000;
      } else {
        b = 0;
      }
      
      o = Math.round(0.0833 * u) + o + b;
      g = Math.round(0.0833 * q) + g;
      
      var k = Math.round(0.0367 * u) + t - b;
      t = Math.round(k + 0.00625 * k);
      
      var N = Math.round(0.12 * u) - Math.round(0.0833 * q) + p;
      p = N + Math.round(0.00625 * N);
      
      var F = Math.round(0.12 * u) + m;
      m = F + Math.round(0.00625 * F);
    }
    
    higherPension.epsLatterContribution = o - n;
    higherPension.epsShareContr = higherPension.initialEPSContr + higherPension.epsLatterContribution;
    
    if (d && y) {
      higherPension.avgSalary = Math.round(d / y);
      higherPension.pension = Math.round(Number(higherPension.avgSalary) * h / 70);
    } else {
      higherPension.avgSalary = Number(currentSalary.value);
      higherPension.pension = Math.round(higherPension.avgSalary * h / 70);
    }
    
    higherPension.empContribution = m;
    higherPension.employerPFShare = t;
    higherPension.totalemployerPFShare = t + m;
    
    capped15kPension.pension = Number(higherPension.pension) < 7500 ? Number(higherPension.pension) : 7500;
    capped15kPension.epsShareContr = g;
    capped15kPension.epsLatterContribution = g - n;
    capped15kPension.empContribution = m;
    capped15kPension.employerPFShare = p;
    capped15kPension.totalemployerPFShare = p + m;
  }

  function printData() {
    for (var e in capped15kPension) {
      writeDataOnClass("capped15kPension." + e, changeToFormattedValue(capped15kPension[e]));
    }
    for (var e in higherPension) {
      writeDataOnClass("higherPension." + e, changeToFormattedValue(higherPension[e]));
    }
  }

  function changeToFormattedValue(e) {
    return e.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
  }

  function writeDataOnClass(e, t) {
    Array.from(document.getElementsByClassName(e)).forEach(function(el) {
      el.innerText = t;
    });
  }

  function showResults() {
    const inputSec = document.querySelector("#input-section");
    if (inputSec) inputSec.classList.add("hide");
    
    const resultsSec = document.querySelector("#results-section");
    if (resultsSec) resultsSec.classList.remove("hide");
    
    window.scrollTo({ top: 30, behavior: "smooth" });
  }

  window.backToEdit = function() {
    const inputSec = document.querySelector("#input-section");
    if (inputSec) inputSec.classList.remove("hide");
    
    const resultsSec = document.querySelector("#results-section");
    if (resultsSec) resultsSec.classList.add("hide");
  };

  window.resetPage = function() {
    window.onResetvalue();
    window.backToEdit();
  };

  if (DOJ) DOJ.addEventListener('change', window.checkDOJ);
  if (DOR) DOR.addEventListener('change', window.checkDOJ);

  window.onResetvalue();

  const faqItems = document.querySelectorAll('#eps-section .eps-faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.eps-faq-trigger');
    if (trigger) {
      trigger.addEventListener('click', function () {
        const isActive = item.classList.contains('active');
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
        });
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });
});
