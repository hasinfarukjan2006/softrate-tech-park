import os

SIDEBAR_HTML_START = """      <!-- Section: Invoice Generator -->
      <section id="invoice-section" class="content-section mt-8 hide">
        <div class="inv-page-layout">
          <!-- Internal Sidebar -->
          <aside class="inv-sidebar">
            <!-- Sidebar Top Section -->
            <div class="inv-sidebar-brand">
              <div class="inv-brand-logo-wrap">
                <div class="inv-zoho-logo">
                  <span class="logo-box blue"></span>
                  <span class="logo-box green"></span>
                  <span class="logo-box red"></span>
                  <span class="logo-box yellow"></span>
                </div>
                <span class="inv-brand-name">Finance Free Apps</span>
              </div>
              <div class="inv-country-badge">
                <span class="inv-flag">🇮🇳</span>
                <span class="inv-country-code">IN</span>
                <svg class="inv-chevron" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            </div>

            <!-- Menus List -->
            <div class="inv-sidebar-menu">
              <!-- Section 1: Billing -->
              <div class="inv-menu-group expanded" id="invGroupBilling">
                <div class="inv-group-header" onclick="toggleInvGroup('Billing')">
                  <div class="inv-group-title">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/></svg>
                    <span>Billing</span>
                  </div>
                  <svg class="inv-chevron" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>
                </div>
                <ul class="inv-group-items">
                  <li>
                    <a href="#" class="inv-menu-item active" onclick="showRoute('invoice')">
                      <span>Create Invoices</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" class="inv-menu-item" onclick="showRoute('quote')">
                      <span>Generate Estimates</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" class="inv-menu-item" onclick="showRoute('receipts')">
                      <span>Create Receipts</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" class="inv-menu-item" onclick="alert('Discount Calculator is coming soon!')">
                      <span>Discount Calculator</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" class="inv-menu-item" onclick="showRoute('forecaster')">
                      <span>Revenue Forecast</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" class="inv-menu-item" onclick="alert('Markup Calculator is coming soon!')">
                      <span>Markup Calculator</span>
                    </a>
                  </li>
                </ul>
              </div>

              <!-- Section 2: Accounting -->
              <div class="inv-menu-group" id="invGroupAccounting">
                <div class="inv-group-header" onclick="toggleInvGroup('Accounting')">
                  <div class="inv-group-title">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                    <span>Accounting</span>
                  </div>
                  <svg class="inv-chevron" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
                <ul class="inv-group-items collapsed">
                  <li><a href="#" class="inv-menu-item" onclick="alert('Chart of Accounts is coming soon!')"><span>Chart of Accounts</span></a></li>
                  <li><a href="#" class="inv-menu-item" onclick="alert('Bank Reconciliation is coming soon!')"><span>Bank Reconciliation</span></a></li>
                </ul>
              </div>

              <!-- Section 3: Expense -->
              <div class="inv-menu-group" id="invGroupExpense">
                <div class="inv-group-header" onclick="toggleInvGroup('Expense')">
                  <div class="inv-group-title">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                    <span>Expense</span>
                  </div>
                  <svg class="inv-chevron" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
                <ul class="inv-group-items collapsed">
                  <li><a href="#" class="inv-menu-item" onclick="alert('Expense Reports is coming soon!')"><span>Expense Reports</span></a></li>
                </ul>
              </div>

              <!-- Section 4: Inventory -->
              <div class="inv-menu-group" id="invGroupInventory">
                <div class="inv-group-header" onclick="toggleInvGroup('Inventory')">
                  <div class="inv-group-title">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                    <span>Inventory</span>
                  </div>
                  <svg class="inv-chevron" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
                <ul class="inv-group-items collapsed">
                  <li><a href="#" class="inv-menu-item" onclick="alert('Items list is coming soon!')"><span>Items</span></a></li>
                </ul>
              </div>

              <!-- Section 5: Payroll -->
              <div class="inv-menu-group" id="invGroupPayroll">
                <div class="inv-group-header" onclick="toggleInvGroup('Payroll')">
                  <div class="inv-group-title">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    <span>Payroll</span>
                  </div>
                  <svg class="inv-chevron" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
                <ul class="inv-group-items collapsed">
                  <li><a href="#" class="inv-menu-item" onclick="alert('Payruns is coming soon!')"><span>Payruns</span></a></li>
                </ul>
              </div>
            </div>

            <!-- Sidebar Footer -->
            <div class="inv-sidebar-footer">
              <div class="inv-footer-title">SPREAD THE WORD</div>
              <div class="inv-social-links">
                <a href="#" class="inv-social-icon" aria-label="Facebook">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
                <a href="#" class="inv-social-icon" aria-label="Twitter">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                </a>
              </div>
            </div>
          </aside>

          <!-- Right Content Area -->
          <div class="inv-content-area">
            <div class="inv-hero">"""

SIDEBAR_HTML_END = """            </form>
          </div>
        </div>
        </div> <!-- End .inv-content-area -->
        </div> <!-- End .inv-page-layout -->
        <script>
          function toggleInvGroup(groupId) {
            const group = document.getElementById('invGroup' + groupId);
            if (!group) return;
            const items = group.querySelector('.inv-group-items');
            const chevron = group.querySelector('.inv-chevron');
            const isExpanded = group.classList.contains('expanded');
            
            if (isExpanded) {
              group.classList.remove('expanded');
              items.classList.add('collapsed');
              chevron.innerHTML = '<polyline points="6 9 12 15 18 9"/>';
            } else {
              group.classList.add('expanded');
              items.classList.remove('collapsed');
              chevron.innerHTML = '<polyline points="18 15 12 9 6 15"/>';
            }
          }
        </script>
      </section>"""

def patch_file(file_path):
    print(f"Patching {file_path}...")
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Find start marker
    start_marker = '<!-- Section: Invoice Generator -->'
    start_pos = content.find(start_marker)
    if start_pos == -1:
        print(f"Error: {start_marker} not found in {file_path}")
        return

    # Find the next section marker after start_pos
    next_section_marker = '<!-- Section: Quote Generator -->'
    end_pos = content.find(next_section_marker, start_pos)
    if end_pos == -1:
        print(f"Error: {next_section_marker} not found in {file_path}")
        return

    # Extract original invoice section content
    invoice_block = content[start_pos:end_pos]
    
    # Locate original inner content starting with `<div class="inv-hero">`
    inner_start_marker = '<div class="inv-hero">'
    inner_start_pos = invoice_block.find(inner_start_marker)
    if inner_start_pos == -1:
        print("Error: inv-hero start not found inside invoice block")
        return
        
    # Locate original inner content ending before `</section>`
    # We find the last `</section>` in the invoice block
    inner_end_marker = '</section>'
    inner_end_pos = invoice_block.rfind(inner_end_marker)
    if inner_end_pos == -1:
        print("Error: section end not found in invoice block")
        return

    # Check if already patched
    if 'class="inv-page-layout"' in content:
        print(f"Warning: {file_path} appears to be already patched.")
        # We can still overwrite it since we do it based on original markers
        
    # Build new block
    # Get the raw original form & wrapper content
    raw_inner_content = invoice_block[inner_start_pos + len(inner_start_marker):inner_end_pos]
    
    new_invoice_block = SIDEBAR_HTML_START + raw_inner_content + SIDEBAR_HTML_END
    
    # Replace block in content
    new_content = content[:start_pos] + new_invoice_block + "\n\n      " + content[end_pos:]
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(new_content)
        
    print(f"Successfully patched {file_path}!")

def main():
    patch_file("softrate/templates/index.html")
    patch_file("dist/index.html")

if __name__ == "__main__":
    main()
