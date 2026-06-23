import os

HTML_CONTENT = """
      <!-- Section: Paycheck Calculator -->
      <section id="paycheck-section" class="content-section mt-8 hide">
        <div class="paycheck-hero">
          <h1>Paycheck Calculator</h1>
          <p class="paycheck-hero-desc">Calculate net pay, taxes, and deductions for both salaried and hourly employees.</p>
        </div>

        <div class="paycheck-container">
          <!-- Form Section -->
          <div class="paycheck-calc-card">
            
            <div class="paycheck-section-block">
              <div class="paycheck-form-group">
                <label>Select your state</label>
                <select id="paycheckState">
                  <option value="CA">California</option>
                  <option value="NY">New York</option>
                  <option value="TX">Texas</option>
                  <option value="FL">Florida</option>
                </select>
              </div>
            </div>

            <div class="paycheck-section-block">
              <h3 class="paycheck-section-title">General Details</h3>
              <div class="paycheck-grid-2">
                <div class="paycheck-form-group">
                  <label>Employee Name *</label>
                  <input type="text" id="paycheckEmpName" placeholder="e.g. John Doe">
                </div>
                <div class="paycheck-form-group">
                  <label>Employee Type *</label>
                  <select id="paycheckEmpType">
                    <option value="non_exempt">Non Exempted</option>
                    <option value="exempt">Exempted</option>
                  </select>
                </div>
                <div class="paycheck-form-group">
                  <label>Wages (USD) *</label>
                  <div class="paycheck-input-wrap">
                    <span class="paycheck-input-prefix">$</span>
                    <input type="number" id="paycheckWages" placeholder="0.00" min="0" step="0.01">
                    <span class="paycheck-input-suffix" id="paycheckWageSuffix">Per Hour</span>
                  </div>
                </div>
                <div class="paycheck-form-group">
                  <label>Pay Frequency *</label>
                  <select id="paycheckPayFreq">
                    <option value="weekly">Every week</option>
                    <option value="biweekly">Every two weeks</option>
                    <option value="semimonthly">Semi-monthly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div class="paycheck-form-group">
                  <label>Regular Hours <span class="opt-label">(optional)</span></label>
                  <input type="number" id="paycheckRegHours" placeholder="0" min="0" value="40">
                </div>
                <div class="paycheck-form-group">
                  <label>Overtime Hours <span class="opt-label">(optional)</span></label>
                  <input type="number" id="paycheckOtHours" placeholder="0" min="0" value="0">
                </div>
                <div class="paycheck-form-group">
                  <label>Pay Date *</label>
                  <input type="date" id="paycheckPayDate">
                </div>
              </div>
            </div>

            <div class="paycheck-section-block">
              <h3 class="paycheck-section-title">Federal Tax Information</h3>
              <div class="paycheck-grid-2">
                <div class="paycheck-form-group">
                  <label>Form W-4 Version *</label>
                  <select id="paycheckW4Version">
                    <option value="2020">2020 or later</option>
                    <option value="2019">2019 or earlier</option>
                  </select>
                </div>
                <div class="paycheck-form-group">
                  <label>Filing Status *</label>
                  <select id="paycheckFedFiling">
                    <option value="" disabled selected>Select filing status</option>
                    <option value="single">Single</option>
                    <option value="married_jointly">Married filing jointly</option>
                    <option value="married_separately">Married filing separately</option>
                    <option value="head_household">Head of household</option>
                  </select>
                </div>
                <div class="paycheck-form-group">
                  <label>Is Holding Multiple Jobs? *</label>
                  <select id="paycheckMultipleJobs">
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
                <div class="paycheck-form-group">
                  <label>Dependent Amount *</label>
                  <div class="paycheck-input-wrap">
                    <span class="paycheck-input-prefix">$</span>
                    <input type="number" id="paycheckDependentAmt" placeholder="0.00" min="0" step="0.01">
                  </div>
                </div>
                <div class="paycheck-form-group">
                  <label>Other Income</label>
                  <div class="paycheck-input-wrap">
                    <span class="paycheck-input-prefix">$</span>
                    <input type="number" id="paycheckOtherIncome" placeholder="0.00" min="0" step="0.01">
                  </div>
                </div>
                <div class="paycheck-form-group">
                  <label>Deductions</label>
                  <div class="paycheck-input-wrap">
                    <span class="paycheck-input-prefix">$</span>
                    <input type="number" id="paycheckFedDeductions" placeholder="0.00" min="0" step="0.01">
                  </div>
                </div>
                <div class="paycheck-form-group">
                  <label>Additional Withholding Amount</label>
                  <div class="paycheck-input-wrap">
                    <span class="paycheck-input-prefix">$</span>
                    <input type="number" id="paycheckFedAddtWithhold" placeholder="0.00" min="0" step="0.01">
                  </div>
                </div>
              </div>
            </div>

            <div class="paycheck-section-block">
              <h3 class="paycheck-section-title">State Tax Information</h3>
              <div class="paycheck-grid-2">
                <div class="paycheck-form-group">
                  <label>Filing Status *</label>
                  <select id="paycheckStateFiling">
                    <option value="" disabled selected>Select filing status</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="head_household">Head of household</option>
                  </select>
                </div>
                <div class="paycheck-form-group">
                  <label>Withholding Allowances</label>
                  <input type="number" id="paycheckStateAllowances" placeholder="0" min="0">
                </div>
                <div class="paycheck-form-group">
                  <label>Additional Withholding Allowances</label>
                  <input type="number" id="paycheckStateAddtAllowances" placeholder="0" min="0">
                </div>
                <div class="paycheck-form-group">
                  <label>Additional Withholding Amount</label>
                  <div class="paycheck-input-wrap">
                    <span class="paycheck-input-prefix">$</span>
                    <input type="number" id="paycheckStateAddtWithhold" placeholder="0.00" min="0" step="0.01">
                  </div>
                </div>
              </div>
            </div>

            <div class="paycheck-section-block">
              <h3 class="paycheck-section-title">Deductions</h3>
              <div class="paycheck-deductions-grid">
                <div class="paycheck-deductions-header">
                  <div>Type</div>
                  <div>Employee Contribution (USD)</div>
                  <div>Employer Contribution (USD)</div>
                  <div></div>
                </div>
                <div id="paycheckDeductionsRows">
                </div>
                <button type="button" class="paycheck-btn-link" id="paycheckAddDeductionBtn">
                  <i data-lucide="plus" style="width: 16px; height: 16px;"></i> Add Deduction
                </button>
              </div>
            </div>

            <div class="paycheck-actions">
              <button type="button" class="paycheck-btn-primary" id="paycheckCalculateBtn">CALCULATE</button>
            </div>
            
          </div>

          <!-- Results Section (Pay Stub) -->
          <div class="paycheck-result-card hide" id="paycheckResultCard">
          </div>

        </div>
      </section>
"""

def main():
    filepath = '../dist/index.html'
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Insert CSS link (dist uses /css/ not /static/css/)
    if '<link rel="stylesheet" href="/css/paycheck.css">' not in content:
        content = content.replace(
            '<link rel="stylesheet" href="/css/financial_report.css">',
            '<link rel="stylesheet" href="/css/financial_report.css">\n  <link rel="stylesheet" href="/css/paycheck.css">'
        )

    # 2. Insert JS script (dist uses /js/ not /static/js/)
    if '<script src="/js/paycheck.js"></script>' not in content:
        content = content.replace(
            '<script src="/js/financial_report.js"></script>',
            '<script src="/js/financial_report.js"></script>\n  <script src="/js/paycheck.js"></script>'
        )

    # 3. Insert Paycheck Section before Gratuity Section
    if 'id="paycheck-section"' not in content:
        content = content.replace(
            '<!-- Section: Gratuity Calculator -->',
            HTML_CONTENT + '\n      <!-- Section: Gratuity Calculator -->'
        )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    print("Successfully updated dist/index.html")

if __name__ == '__main__':
    main()
