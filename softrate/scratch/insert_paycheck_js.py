import os

JS_CONTENT = """// static/js/paycheck.js

document.addEventListener("DOMContentLoaded", () => {
  const addDeductionBtn = document.getElementById("paycheckAddDeductionBtn");
  const deductionsRowsContainer = document.getElementById("paycheckDeductionsRows");
  const calculateBtn = document.getElementById("paycheckCalculateBtn");
  const resultCard = document.getElementById("paycheckResultCard");
  const empTypeSelect = document.getElementById("paycheckEmpType");
  const wageSuffix = document.getElementById("paycheckWageSuffix");
  const payDateInput = document.getElementById("paycheckPayDate");

  // Set default pay date to today
  if (payDateInput) {
    payDateInput.valueAsDate = new Date();
  }

  // Handle Employee Type Change -> update wage suffix
  if (empTypeSelect) {
    empTypeSelect.addEventListener("change", (e) => {
      if (e.target.value === "exempt") {
        wageSuffix.textContent = "Per Year";
      } else {
        wageSuffix.textContent = "Per Hour";
      }
    });
  }

  // Handle Add Deduction
  if (addDeductionBtn) {
    addDeductionBtn.addEventListener("click", () => {
      const row = document.createElement("div");
      row.className = "paycheck-deduction-row";
      row.innerHTML = `
        <select class="deduction-type">
          <option value="401k">401(k) (Pre-tax)</option>
          <option value="medical">Medical (Pre-tax)</option>
          <option value="dental">Dental (Pre-tax)</option>
          <option value="vision">Vision (Pre-tax)</option>
          <option value="hsa">HSA (Pre-tax)</option>
          <option value="roth401k">Roth 401(k) (Post-tax)</option>
          <option value="other">Other (Post-tax)</option>
        </select>
        <div class="paycheck-input-wrap">
          <span class="paycheck-input-prefix">$</span>
          <input type="number" class="deduction-ee" placeholder="0.00" min="0" step="0.01">
        </div>
        <div class="paycheck-input-wrap">
          <span class="paycheck-input-prefix">$</span>
          <input type="number" class="deduction-er" placeholder="0.00" min="0" step="0.01">
        </div>
        <button type="button" class="paycheck-delete-btn" title="Remove deduction">
          <i data-lucide="x" style="width: 16px; height: 16px;"></i>
        </button>
      `;
      deductionsRowsContainer.appendChild(row);
      // Initialize lucide icon for the new row
      if (window.lucide) {
        window.lucide.createIcons({ root: row });
      }

      // Add delete listener
      const deleteBtn = row.querySelector(".paycheck-delete-btn");
      deleteBtn.addEventListener("click", () => {
        row.remove();
      });
    });
  }

  function getNumericValue(id, def = 0) {
    const el = document.getElementById(id);
    if (!el || !el.value) return def;
    const val = parseFloat(el.value);
    return isNaN(val) ? def : val;
  }

  // Calculate Paycheck
  if (calculateBtn) {
    calculateBtn.addEventListener("click", () => {
      const state = document.getElementById("paycheckState").value || "CA";
      const empName = document.getElementById("paycheckEmpName").value || "Employee";
      const empType = document.getElementById("paycheckEmpType").value || "non_exempt";
      const wages = getNumericValue("paycheckWages");
      const payFreq = document.getElementById("paycheckPayFreq").value || "biweekly";
      const regHours = getNumericValue("paycheckRegHours", 40);
      const otHours = getNumericValue("paycheckOtHours", 0);
      const payDate = document.getElementById("paycheckPayDate").value;

      // Federal Info
      const fedFiling = document.getElementById("paycheckFedFiling").value || "single";
      const multipleJobs = document.getElementById("paycheckMultipleJobs").value === "yes";
      const dependentAmt = getNumericValue("paycheckDependentAmt");
      const otherIncome = getNumericValue("paycheckOtherIncome");
      const fedDeductions = getNumericValue("paycheckFedDeductions");
      const fedAddtWithhold = getNumericValue("paycheckFedAddtWithhold");

      // State Info
      const stateAllowances = getNumericValue("paycheckStateAllowances");
      const stateAddtAllowances = getNumericValue("paycheckStateAddtAllowances");
      const stateAddtWithhold = getNumericValue("paycheckStateAddtWithhold");

      // Calculate Pay Periods
      let periodsPerYear = 26;
      if (payFreq === "weekly") periodsPerYear = 52;
      if (payFreq === "semimonthly") periodsPerYear = 24;
      if (payFreq === "monthly") periodsPerYear = 12;

      // Gross Pay Calculation
      let grossPay = 0;
      if (empType === "exempt") {
        // Wages is annual
        grossPay = wages / periodsPerYear;
      } else {
        // Wages is hourly
        grossPay = (regHours * wages) + (otHours * wages * 1.5);
      }

      // Read Deductions
      let preTaxDeductions = 0;
      let postTaxDeductions = 0;
      let erContributions = 0;
      
      const deductionsRows = deductionsRowsContainer.querySelectorAll(".paycheck-deduction-row");
      const deductionsList = [];

      deductionsRows.forEach(row => {
        const typeSelect = row.querySelector(".deduction-type");
        const type = typeSelect ? typeSelect.value : "";
        const typeLabel = typeSelect ? typeSelect.options[typeSelect.selectedIndex].text : "Deduction";
        
        const eeInput = row.querySelector(".deduction-ee");
        const eeVal = eeInput && eeInput.value ? parseFloat(eeInput.value) : 0;
        
        const erInput = row.querySelector(".deduction-er");
        const erVal = erInput && erInput.value ? parseFloat(erInput.value) : 0;

        if (eeVal > 0 || erVal > 0) {
          deductionsList.push({ type: typeLabel, ee: eeVal, er: erVal });
          if (["401k", "medical", "dental", "vision", "hsa"].includes(type)) {
            preTaxDeductions += eeVal;
          } else {
            postTaxDeductions += eeVal;
          }
          erContributions += erVal;
        }
      });

      // Taxable Income for Federal/State
      const fedTaxableGross = Math.max(0, grossPay - preTaxDeductions);
      const annualizedGross = fedTaxableGross * periodsPerYear;

      // --- Federal Income Tax Withholding (Simplified 2024 approximation) ---
      let standardDeduction = fedFiling === "single" || fedFiling === "married_separately" ? 14600 :
                              fedFiling === "married_jointly" ? 29200 : 21900; // Head of household
      
      // Adjusted Annual Income
      let adjustedIncome = annualizedGross + (otherIncome * periodsPerYear) - (fedDeductions * periodsPerYear) - standardDeduction;
      if (adjustedIncome < 0) adjustedIncome = 0;

      // Brackets Approx (Single)
      // 10% up to $11,600, 12% to $47,150, 22% to $100,525, 24% to $191,950, 32% to $243,725...
      let annualFedTax = 0;
      if (fedFiling === "married_jointly") {
        if (adjustedIncome > 731200) annualFedTax += (adjustedIncome - 731200) * 0.37 + 186601.5;
        else if (adjustedIncome > 487450) annualFedTax += (adjustedIncome - 487450) * 0.35 + 101289;
        else if (adjustedIncome > 383900) annualFedTax += (adjustedIncome - 383900) * 0.32 + 68153;
        else if (adjustedIncome > 201050) annualFedTax += (adjustedIncome - 201050) * 0.24 + 24269;
        else if (adjustedIncome > 94300) annualFedTax += (adjustedIncome - 94300) * 0.22 + 10784;
        else if (adjustedIncome > 23200) annualFedTax += (adjustedIncome - 23200) * 0.12 + 2320;
        else annualFedTax += adjustedIncome * 0.10;
      } else {
        if (adjustedIncome > 609350) annualFedTax += (adjustedIncome - 609350) * 0.37 + 183647.25;
        else if (adjustedIncome > 243725) annualFedTax += (adjustedIncome - 243725) * 0.35 + 55678.5;
        else if (adjustedIncome > 191950) annualFedTax += (adjustedIncome - 191950) * 0.32 + 39110.5;
        else if (adjustedIncome > 100525) annualFedTax += (adjustedIncome - 100525) * 0.24 + 17168.5;
        else if (adjustedIncome > 47150) annualFedTax += (adjustedIncome - 47150) * 0.22 + 5426;
        else if (adjustedIncome > 11600) annualFedTax += (adjustedIncome - 11600) * 0.12 + 1160;
        else annualFedTax += adjustedIncome * 0.10;
      }
      
      let periodFedTax = annualFedTax / periodsPerYear;
      // Dependent Credit
      periodFedTax -= dependentAmt;
      if (periodFedTax < 0) periodFedTax = 0;
      periodFedTax += fedAddtWithhold;

      // --- FICA ---
      // FICA is calculated on gross minus certain pre-tax benefits like medical/401k depending on section 125, but standardly 401k is subject to FICA.
      // We will approximate FICA on Gross Pay for simplicity.
      const socialSecurity = grossPay * 0.062; // capped at wage base, assuming not capped here
      let medicare = grossPay * 0.0145;
      if (annualizedGross > 200000) {
        medicare += grossPay * 0.009; // Additional Medicare Tax
      }
      const erSocialSecurity = socialSecurity;
      const erMedicare = grossPay * 0.0145;

      // --- State Tax (CA Approximation) ---
      let annualStateTax = 0;
      let stateStandardDed = 5363;
      if (fedFiling === "married_jointly") stateStandardDed = 10726;
      let stateAdjIncome = annualizedGross - stateStandardDed - ((stateAllowances + stateAddtAllowances) * 154);
      if (stateAdjIncome > 0) {
        // Simplified CA Bracket
        if (stateAdjIncome > 1000000) annualStateTax += (stateAdjIncome) * 0.133;
        else if (stateAdjIncome > 677275) annualStateTax += (stateAdjIncome) * 0.123;
        else if (stateAdjIncome > 400000) annualStateTax += (stateAdjIncome) * 0.113;
        else if (stateAdjIncome > 68000) annualStateTax += (stateAdjIncome) * 0.093;
        else if (stateAdjIncome > 53000) annualStateTax += (stateAdjIncome) * 0.08;
        else if (stateAdjIncome > 38000) annualStateTax += (stateAdjIncome) * 0.06;
        else if (stateAdjIncome > 24000) annualStateTax += (stateAdjIncome) * 0.04;
        else if (stateAdjIncome > 10000) annualStateTax += (stateAdjIncome) * 0.02;
        else annualStateTax += stateAdjIncome * 0.01;
      }
      let periodStateTax = (annualStateTax / periodsPerYear) + stateAddtWithhold;
      if (periodStateTax < 0) periodStateTax = 0;

      // --- Totals ---
      const totalTaxes = periodFedTax + socialSecurity + medicare + periodStateTax;
      const netPay = grossPay - totalTaxes - preTaxDeductions - postTaxDeductions;
      const totalEmployerTaxes = erSocialSecurity + erMedicare + erContributions;

      const fmt = (num) => "$" + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

      // Build Result HTML
      let dedHtml = "";
      deductionsList.forEach(d => {
        dedHtml += `
          <tr>
            <td>${d.type}</td>
            <td class="amount">-${fmt(d.ee)}</td>
            <td class="amount">${fmt(d.er)}</td>
          </tr>
        `;
      });

      resultCard.innerHTML = `
        <div class="paycheck-result-header">
          <h2>Pay Stub Estimate</h2>
          <p class="text-muted">For ${empName} | ${payDate ? `Pay Date: ${payDate}` : `Frequency: ${payFreq}`}</p>
          <div class="paycheck-takehome">${fmt(netPay)}</div>
          <p style="font-weight: 500;">Take Home Pay</p>
        </div>

        <div class="paycheck-summary-grid">
          <div>
            <h3 class="paycheck-section-title" style="margin-bottom: 1rem;">Earnings & Deductions</h3>
            <table class="paycheck-result-table">
              <tr>
                <th>Item</th>
                <th class="amount">Employee</th>
                <th class="amount">Employer</th>
              </tr>
              <tr>
                <td>Gross Pay</td>
                <td class="amount" style="color: #10b981;">+${fmt(grossPay)}</td>
                <td class="amount">-</td>
              </tr>
              <tr>
                <td>Pre-Tax Deductions</td>
                <td class="amount">-${fmt(preTaxDeductions)}</td>
                <td class="amount">-</td>
              </tr>
              <tr>
                <td>Federal Income Tax</td>
                <td class="amount">-${fmt(periodFedTax)}</td>
                <td class="amount">-</td>
              </tr>
              <tr>
                <td>Social Security</td>
                <td class="amount">-${fmt(socialSecurity)}</td>
                <td class="amount">${fmt(erSocialSecurity)}</td>
              </tr>
              <tr>
                <td>Medicare</td>
                <td class="amount">-${fmt(medicare)}</td>
                <td class="amount">${fmt(erMedicare)}</td>
              </tr>
              <tr>
                <td>State Income Tax (${state})</td>
                <td class="amount">-${fmt(periodStateTax)}</td>
                <td class="amount">-</td>
              </tr>
              <tr>
                <td>Post-Tax Deductions</td>
                <td class="amount">-${fmt(postTaxDeductions)}</td>
                <td class="amount">-</td>
              </tr>
              ${dedHtml}
              <tr class="paycheck-subtotal-row">
                <td style="padding-top: 1rem;">Total Taxes & Deductions</td>
                <td class="amount" style="padding-top: 1rem; color: #ef4444;">-${fmt(totalTaxes + preTaxDeductions + postTaxDeductions)}</td>
                <td class="amount" style="padding-top: 1rem;">${fmt(totalEmployerTaxes)}</td>
              </tr>
              <tr class="paycheck-subtotal-row" style="border-top: 2px solid var(--border-color); font-size: 1.1rem;">
                <td style="padding-top: 1rem;">Take Home (Net Pay)</td>
                <td class="amount" style="padding-top: 1rem; color: #10b981;">${fmt(netPay)}</td>
                <td class="amount" style="padding-top: 1rem;">-</td>
              </tr>
            </table>
          </div>
          <div>
            <h3 class="paycheck-section-title" style="margin-bottom: 1rem;">Employer Cost Summary</h3>
            <div style="background: rgba(37, 99, 235, 0.05); padding: 1.5rem; border-radius: 8px; border: 1px solid rgba(37, 99, 235, 0.1);">
              <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
                <span>Gross Pay</span>
                <span class="amount" style="font-weight: 500;">${fmt(grossPay)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
                <span>Employer Taxes (FICA)</span>
                <span class="amount" style="font-weight: 500;">${fmt(erSocialSecurity + erMedicare)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
                <span>Employer Benefits Contributions</span>
                <span class="amount" style="font-weight: 500;">${fmt(erContributions)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid rgba(37, 99, 235, 0.2); font-weight: 600; font-size: 1.1rem;">
                <span>Total Employer Cost</span>
                <span class="amount">${fmt(grossPay + erSocialSecurity + erMedicare + erContributions)}</span>
              </div>
            </div>
            
            <div class="paycheck-result-actions">
              <button type="button" class="paycheck-btn-secondary" onclick="window.print()">
                <i data-lucide="printer" style="width: 16px; height: 16px;"></i> Print Pay Stub
              </button>
            </div>
          </div>
        </div>
      `;

      if (window.lucide) {
        window.lucide.createIcons({ root: resultCard });
      }

      resultCard.classList.remove("hide");
      resultCard.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
});
"""

def main():
    filepath = 'static/js/paycheck.js'
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(JS_CONTENT)
    print("Successfully created paycheck.js")

if __name__ == '__main__':
    main()
