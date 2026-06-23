import os

def main():
    workspace_dir = r"c:\Users\dellc\OneDrive\Desktop\softrate\softrate"
    parent_dir = r"c:\Users\dellc\OneDrive\Desktop\softrate"
    
    index_paths = [
        os.path.join(workspace_dir, "templates", "index.html"),
        os.path.join(parent_dir, "templates", "index.html")
    ]

    html_content = """
      <!-- Section: Free Project Cost Estimate Calculator -->
      <section id="project-estimate-section" class="content-section hide">
        
        <!-- ===== HERO SECTION ===== -->
        <div class="pe-hero">
          <h1>Free Project Cost Estimate Calculator</h1>
          <p class="pe-hero-desc">Estimate the total cost of your project by entering labor costs, material costs, overhead expenses, and expected profit margin. Generate accurate project estimates instantly.</p>
        </div>

        <!-- ===== TWO-COLUMN MAIN WORKSPACE ===== -->
        <div class="pe-container" id="pe-form-container">
          
          <!-- LEFT SIDE: Estimator Form -->
          <div class="pe-form-card">
            <h2 class="pe-form-title">Project Cost Estimator</h2>
            <form id="peForm" novalidate onsubmit="event.preventDefault();">
              
              <!-- Project Name -->
              <div class="form-group-pe">
                <label for="pe_project_name">Project Name*</label>
                <input type="text" id="pe_project_name" class="form-control-pe" placeholder="Enter project name" required>
                <small class="error-msg-pe hide" id="pe_project_name_err">Please enter the project name.</small>
              </div>

              <!-- Labor Cost -->
              <div class="form-group-pe">
                <label for="pe_labor_cost">Labor Cost (₹)*</label>
                <div class="input-addon-wrapper-pe">
                  <span class="addon-pe">₹</span>
                  <input type="text" id="pe_labor_cost" class="form-control-pe" placeholder="Enter labor cost" required>
                </div>
                <small class="error-msg-pe hide" id="pe_labor_cost_err">Please enter a valid positive labor cost.</small>
              </div>

              <!-- Material Cost -->
              <div class="form-group-pe">
                <label for="pe_material_cost">Material Cost (₹)*</label>
                <div class="input-addon-wrapper-pe">
                  <span class="addon-pe">₹</span>
                  <input type="text" id="pe_material_cost" class="form-control-pe" placeholder="Enter material cost" required>
                </div>
                <small class="error-msg-pe hide" id="pe_material_cost_err">Please enter a valid positive material cost.</small>
              </div>

              <!-- Equipment Cost -->
              <div class="form-group-pe">
                <label for="pe_equipment_cost">Equipment Cost (₹)*</label>
                <div class="input-addon-wrapper-pe">
                  <span class="addon-pe">₹</span>
                  <input type="text" id="pe_equipment_cost" class="form-control-pe" placeholder="Enter equipment cost" required>
                </div>
                <small class="error-msg-pe hide" id="pe_equipment_cost_err">Please enter a valid positive equipment cost.</small>
              </div>

              <!-- Other Expenses -->
              <div class="form-group-pe">
                <label for="pe_other_expenses">Other Expenses (₹)*</label>
                <div class="input-addon-wrapper-pe">
                  <span class="addon-pe">₹</span>
                  <input type="text" id="pe_other_expenses" class="form-control-pe" placeholder="Enter additional expenses" required>
                </div>
                <small class="error-msg-pe hide" id="pe_other_expenses_err">Please enter a valid positive value for other expenses.</small>
              </div>

              <!-- Overhead Percentage & Profit Margin -->
              <div class="form-row-pe">
                <div class="form-group-pe">
                  <label for="pe_overhead_pct">Overhead Percentage (%)*</label>
                  <div class="input-addon-wrapper-pe">
                    <input type="text" id="pe_overhead_pct" class="form-control-pe" placeholder="Enter overhead %" required>
                    <span class="addon-pe">%</span>
                  </div>
                  <small class="error-msg-pe hide" id="pe_overhead_pct_err">Please enter a valid percentage (0-100).</small>
                </div>
                <div class="form-group-pe">
                  <label for="pe_profit_pct">Profit Margin Percentage (%)*</label>
                  <div class="input-addon-wrapper-pe">
                    <input type="text" id="pe_profit_pct" class="form-control-pe" placeholder="Enter profit margin %" required>
                    <span class="addon-pe">%</span>
                  </div>
                  <small class="error-msg-pe hide" id="pe_profit_pct_err">Please enter a valid percentage (0-100).</small>
                </div>
              </div>

              <!-- Actions Button Row -->
              <div class="form-actions-pe">
                <button type="button" class="pe-btn pe-btn-reset" onclick="ProjectEstimateController.resetForm()">Reset</button>
                <button type="button" class="pe-btn pe-btn-submit" onclick="ProjectEstimateController.calculateEstimate()">Calculate Estimate</button>
              </div>

            </form>
          </div>

          <!-- RIGHT SIDE: Sticky Info Panel -->
          <div class="pe-info-card">
            <h2>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="vertical-align: middle; margin-right: 6px;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              KNOW MORE ABOUT PROJECT ESTIMATION
            </h2>

            <div class="info-item-pe">
              <h3>What is a Project Estimate?</h3>
              <p>A project estimate is an approximation of the total costs required to complete a project. It serves as a benchmark for budgeting and pricing decisions.</p>
            </div>

            <div class="info-item-pe">
              <h3>What is Overhead Cost?</h3>
              <p>Overhead costs are ongoing business expenses that are not directly tied to a specific project task, such as rent, utility bills, and administrative salaries.</p>
            </div>

            <div class="info-item-pe">
              <h3>How does Profit Margin affect pricing?</h3>
              <p>Adding a profit margin ensures the business gains a return on investment above total project expenses. It is calculated as a percentage of the total project cost.</p>
            </div>
          </div>

        </div>

        <!-- ===== RESULT & EXPORTS SECTION ===== -->
        <div class="pe-result-container hide" id="pe-result-container">
          
          <div class="pe-actions-bar">
            <h2>Estimated Project Cost</h2>
            <div class="pe-actions-buttons">
              <button class="pe-btn pe-btn-reset" onclick="ProjectEstimateController.editForm()">Go Back</button>
              <button class="pe-btn pe-btn-reset" onclick="ProjectEstimateController.printEstimate()">Print Estimate</button>
              <button class="pe-btn pe-btn-submit" style="background-color: #008080;" id="btnSaveEstimate" onclick="ProjectEstimateController.saveEstimate()">Save Estimate</button>
              <button class="pe-btn pe-btn-submit" onclick="ProjectEstimateController.downloadPDF()">Download Estimate PDF</button>
              <button class="pe-btn pe-btn-reset" style="border-color: #0F4C81; color: #0F4C81;" onclick="ProjectEstimateController.resetForm(); ProjectEstimateController.editForm()">Reset</button>
            </div>
          </div>

          <!-- Printable cost estimate sheet block -->
          <div class="pe-paper-sheet" id="pe-paper-sheet">
            <div class="pe-invoice-header">
              <div class="pe-brand-block">
                <span class="pe-brand-name">Softrate Tech Park Pvt. Ltd.</span><br>
                <span class="pe-brand-sub">Project Cost Estimation Details</span>
              </div>
              <div class="pe-date-block">
                <strong>Project Name:</strong> <span id="pdf_project_name">-</span><br>
                <strong>Date:</strong> <span id="pdf_estimate_date">-</span>
              </div>
            </div>

            <div class="pe-title-bar">Cost Breakdown Analysis</div>

            <table class="pe-breakdown-table">
              <thead>
                <tr>
                  <th>Cost Item</th>
                  <th class="text-right">Cost (INR)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Labor Cost</td>
                  <td class="text-right" id="pdf_labor_cost">₹0.00</td>
                </tr>
                <tr>
                  <td>Material Cost</td>
                  <td class="text-right" id="pdf_material_cost">₹0.00</td>
                </tr>
                <tr>
                  <td>Equipment Cost</td>
                  <td class="text-right" id="pdf_equipment_cost">₹0.00</td>
                </tr>
                <tr>
                  <td>Other Expenses</td>
                  <td class="text-right" id="pdf_other_expenses">₹0.00</td>
                </tr>
                <tr class="table-subtotal-row">
                  <td>Subtotal Cost</td>
                  <td class="text-right" id="pdf_subtotal">₹0.00</td>
                </tr>
                <tr>
                  <td>Overhead Cost (<span id="pdf_overhead_rate">0</span>%)</td>
                  <td class="text-right" id="pdf_overhead_cost">₹0.00</td>
                </tr>
                <tr class="table-total-row">
                  <td>Total Cost (Subtotal + Overhead)</td>
                  <td class="text-right" id="pdf_total_cost">₹0.00</td>
                </tr>
                <tr>
                  <td>Expected Profit Amount (<span id="pdf_profit_rate">0</span>%)</td>
                  <td class="text-right" id="pdf_profit_amount">₹0.00</td>
                </tr>
                <tr class="table-grand-row">
                  <td>Final Project Estimate</td>
                  <td class="text-right" id="pdf_grand_total">₹0.00</td>
                </tr>
              </tbody>
            </table>

            <div class="pe-disclaimer">
              This estimate is generated dynamically by Softrate Project Estimation Utility. The calculated values are approximations based on input figures and are subject to commercial and actual execution fluctuations.
            </div>
          </div>

        </div>

        <!-- ===== EDUCATIONAL ARTICLES SECTION ===== -->
        <div class="pe-articles-grid" style="margin-top: 50px;">
          <div class="pe-article-card">
            <h3>What is a Project Cost Estimate?</h3>
            <p>A project cost estimate is a forecast of the required financial resources to complete a project's tasks. Accurately estimating project costs helps project managers create budgets, submit competitive bids, and verify cash flows.</p>
          </div>
          <div class="pe-article-card">
            <h3>How Project Estimation Works</h3>
            <p>Project cost estimation is structured by gathering raw expenses (labor, materials, and equipment), determining overhead costs, and applying a profit margin percentage to establish the final client project quote price.</p>
          </div>
          <div class="pe-article-card">
            <h3>Project Cost Formula</h3>
            <p>The cost estimation formula used here is standard across business finance:
            <br><code>Subtotal = Labor + Materials + Equipment + Other Expenses</code>
            <br><code>Total Cost = Subtotal + (Subtotal × Overhead %)</code>
            <br><code>Estimate Quote = Total Cost + (Total Cost × Profit Margin %)</code></p>
          </div>
          <div class="pe-article-card">
            <h3>Benefits of Cost Estimation</h3>
            <p>Accurate quotes protect profit margins, prevent business losses on under-quoted projects, ensure transparent billing details for clients, and build trust in business operations.</p>
          </div>
        </div>

        <!-- ===== FAQ SECTION ===== -->
        <div class="pe-faq-section" style="margin-top: 50px; margin-bottom: 40px;">
          <h2>Frequently Asked Questions</h2>
          <div class="pe-faq-accordion">
            <!-- Q1 -->
            <div class="pe-faq-item">
              <button type="button" class="pe-faq-trigger">
                <span>What is a project estimate?</span>
                <i data-lucide="chevron-down"></i>
              </button>
              <div class="pe-faq-content">
                <p>A project estimate is an approximation of the costs of resources needed to complete a project. It is used as a foundation to establish contract prices and commercial agreements.</p>
              </div>
            </div>
            <!-- Q2 -->
            <div class="pe-faq-item">
              <button type="button" class="pe-faq-trigger">
                <span>Why is project estimation important?</span>
                <i data-lucide="chevron-down"></i>
              </button>
              <div class="pe-faq-content">
                <p>Estimation helps align client expectations with business overheads. It ensures you charge competitive rates while keeping the project profitable and covering labor, material, and ongoing operational costs.</p>
              </div>
            </div>
            <!-- Q3 -->
            <div class="pe-faq-item">
              <button type="button" class="pe-faq-trigger">
                <span>How do I calculate project cost?</span>
                <i data-lucide="chevron-down"></i>
              </button>
              <div class="pe-faq-content">
                <p>Sum your direct labor costs, direct materials, direct equipment costs, and direct other tasks. Add your overhead percentages to factor in administrative costs, and then apply your desired profit margin percentage.</p>
              </div>
            </div>
            <!-- Q4 -->
            <div class="pe-faq-item">
              <button type="button" class="pe-faq-trigger">
                <span>What expenses should be included?</span>
                <i data-lucide="chevron-down"></i>
              </button>
              <div class="pe-faq-content">
                <p>All direct costs (worker wages, raw physical components, machinery rentals, travel expenses) and indirect costs (office space leasing, internet, utilities, licensing software fees) must be factorized into overhead or base costs.</p>
              </div>
            </div>
            <!-- Q5 -->
            <div class="pe-faq-item">
              <button type="button" class="pe-faq-trigger">
                <span>How is profit margin calculated?</span>
                <i data-lucide="chevron-down"></i>
              </button>
              <div class="pe-faq-content">
                <p>Profit margin represents the surplus earned over total expenditures. It is calculated by taking the total project expenses (Subtotal + Overhead) and multiplying them by the profit percentage required (e.g. 15% margin).</p>
              </div>
            </div>
          </div>
        </div>

      </section>
"""

    for path in index_paths:
        if not os.path.exists(path):
            continue
        print(f"Processing index.html: {path}...")
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()

        if "project-estimate-section" in content:
            print("project-estimate-section is already present in this file!")
            continue

        # Let's locate the closing section tag for w9-section.
        # Since we know w9-section ends right before </section> representing the w9 block,
        # we find where w9-section is.
        lines = content.splitlines()
        w9_start_idx = -1
        for idx, line in enumerate(lines):
            if 'id="w9-section"' in line or "id='w9-section'" in line:
                w9_start_idx = idx
                break

        if w9_start_idx == -1:
            print("Could not find w9-section start!")
            continue

        section_depth = 0
        w9_end_idx = -1
        for idx in range(w9_start_idx, len(lines)):
            line = lines[idx]
            if '<section' in line:
                section_depth += 1
            if '</section>' in line:
                section_depth -= 1
                if section_depth == 0:
                    w9_end_idx = idx
                    break

        if w9_end_idx == -1:
            print("Could not find closing section tag for w9-section!")
            continue

        print(f"w9-section closing section tag is at line {w9_end_idx + 1}")

        # Insert project estimate section right after the w9 section ends
        new_lines = lines[:w9_end_idx + 1] + ["", ""] + html_content.splitlines() + lines[w9_end_idx + 1:]
        
        with open(path, "w", encoding="utf-8") as f:
            f.write("\n".join(new_lines))
        print("Successfully injected project-estimate-section HTML!")

if __name__ == "__main__":
    main()
