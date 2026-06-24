"""
Fix billing sidebar: add the same inv-sidebar to quote, receipts, and forecaster sections.
Each section gets the sidebar with the correct active menu item.
"""
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

SIDEBAR_TEMPLATE = '''      <div class="inv-page-layout">
          <!-- Internal Billing Sidebar -->
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
                <span class="inv-flag">&#127470;&#127475;</span>
                <span class="inv-country-code">IN</span>
                <svg class="inv-chevron" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            </div>

            <!-- Menus List -->
            <div class="inv-sidebar-menu">
              <!-- Section 1: Billing -->
              <div class="inv-menu-group expanded" id="GROUPID_invGroupBilling">
                <div class="inv-group-header" onclick="toggleInvGroup('GROUPID_Billing')">
                  <div class="inv-group-title">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/></svg>
                    <span>Billing</span>
                  </div>
                  <svg class="inv-chevron" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>
                </div>
                <ul class="inv-group-items">
                  <li>
                    <a href="#" class="inv-menu-item ACTIVE_INVOICE" onclick="showRoute('invoice')">
                      <span>Create Invoices</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" class="inv-menu-item ACTIVE_QUOTE" onclick="showRoute('quote')">
                      <span>Generate Estimates</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" class="inv-menu-item ACTIVE_RECEIPTS" onclick="showRoute('receipts')">
                      <span>Create Receipts</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" class="inv-menu-item" onclick="alert('Discount Calculator is coming soon!')">
                      <span>Discount Calculator</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" class="inv-menu-item ACTIVE_FORECASTER" onclick="showRoute('forecaster')">
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
              <div class="inv-menu-group" id="GROUPID_invGroupAccounting">
                <div class="inv-group-header" onclick="toggleInvGroup('GROUPID_Accounting')">
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
              <div class="inv-menu-group" id="GROUPID_invGroupExpense">
                <div class="inv-group-header" onclick="toggleInvGroup('GROUPID_Expense')">
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
              <div class="inv-menu-group" id="GROUPID_invGroupInventory">
                <div class="inv-group-header" onclick="toggleInvGroup('GROUPID_Inventory')">
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
              <div class="inv-menu-group" id="GROUPID_invGroupPayroll">
                <div class="inv-group-header" onclick="toggleInvGroup('GROUPID_Payroll')">
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
'''

def make_sidebar(group_prefix, active_key):
    """Generate sidebar HTML with unique IDs and correct active item."""
    sidebar = SIDEBAR_TEMPLATE
    sidebar = sidebar.replace('GROUPID_', group_prefix)
    # Set active state
    for placeholder in ['ACTIVE_INVOICE', 'ACTIVE_QUOTE', 'ACTIVE_RECEIPTS', 'ACTIVE_FORECASTER']:
        if placeholder == active_key:
            sidebar = sidebar.replace(placeholder, 'active')
        else:
            sidebar = sidebar.replace(placeholder, '')
    # Clean up double spaces from empty replacements
    sidebar = sidebar.replace('class="inv-menu-item  "', 'class="inv-menu-item"')
    return sidebar


with open('templates/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

original_content = content

# ================================================================
# 1. QUOTE section: wrap content in inv-page-layout
# ================================================================
quote_old = '      <!-- Section: Quote Generator -->\n      <section id="quote-section" class="content-section mt-8 hide">\n        <div class="inv-hero">'
quote_new = '      <!-- Section: Quote Generator -->\n      <section id="quote-section" class="content-section mt-8 hide">\n' + make_sidebar('qt_', 'ACTIVE_QUOTE') + '        <div class="inv-hero">'

if quote_old in content:
    content = content.replace(quote_old, quote_new, 1)
    print("OK Quote sidebar injected")
else:
    print("FAIL Quote section marker NOT found")

# Close quote
quote_close_old = '          </div>\n        </div>\n      </section>\n\n      \n      <!-- Section: Receipt Generator -->'
quote_close_new = '          </div>\n        </div>\n          </div><!-- end inv-content-area -->\n        </div><!-- end inv-page-layout -->\n      </section>\n\n      \n      <!-- Section: Receipt Generator -->'

if quote_close_old in content:
    content = content.replace(quote_close_old, quote_close_new, 1)
    print("OK Quote section closed correctly")
else:
    print("FAIL Quote close marker NOT found - trying alternate")
    # Try alternate marker
    import re
    # Find the quote section end
    m = re.search(r'</form>\s*\n\s*</div>\s*\n\s*</div>\s*\n\s*</section>\s*\n\s*\n\s*<!-- Section: Receipt', content)
    if m:
        old_frag = m.group(0)
        new_frag = old_frag.replace(
            '</section>',
            '          </div><!-- end inv-content-area -->\n        </div><!-- end inv-page-layout -->\n      </section>'
        )
        content = content[:m.start()] + new_frag + content[m.end():]
        print("OK Quote section closed via regex")
    else:
        print("FAIL could not close quote section")


# ================================================================
# 2. RECEIPTS section: wrap in inv-page-layout
# ================================================================
receipts_old = '      <!-- Section: Receipt Generator -->\n      <section id="receipts-section" class="content-section mt-8 hide">\n        <div class="rec-hero">'
receipts_new = '      <!-- Section: Receipt Generator -->\n      <section id="receipts-section" class="content-section mt-8 hide">\n' + make_sidebar('rec_', 'ACTIVE_RECEIPTS') + '        <div class="rec-hero">'

if receipts_old in content:
    content = content.replace(receipts_old, receipts_new, 1)
    print("OK Receipts sidebar injected")
else:
    print("FAIL Receipts section marker NOT found")

# Close receipts
receipts_close_old = '            </form>\n          </div>\n        </div>\n      </section>\n\n      \n      <!-- Section: Revenue Forecaster -->'
receipts_close_new = '            </form>\n          </div>\n        </div>\n          </div><!-- end inv-content-area -->\n        </div><!-- end inv-page-layout -->\n      </section>\n\n      \n      <!-- Section: Revenue Forecaster -->'

if receipts_close_old in content:
    content = content.replace(receipts_close_old, receipts_close_new, 1)
    print("OK Receipts section closed correctly")
else:
    print("FAIL Receipts close marker NOT found")


# ================================================================
# 3. FORECASTER section: wrap in inv-page-layout
# ================================================================
forecaster_old = '      <!-- Section: Revenue Forecaster -->\n      <section id="forecaster-section" class="content-section mt-8 hide">\n        <div class="fore-hero">'
forecaster_new = '      <!-- Section: Revenue Forecaster -->\n      <section id="forecaster-section" class="content-section mt-8 hide">\n' + make_sidebar('fore_', 'ACTIVE_FORECASTER') + '        <div class="fore-hero">'

if forecaster_old in content:
    content = content.replace(forecaster_old, forecaster_new, 1)
    print("OK Forecaster sidebar injected")
else:
    print("FAIL Forecaster section marker NOT found")

# Close forecaster
forecaster_close_old = '            <button type="button" class="vat-reset-btn" id="foreReset" style="margin-top:1.5rem;">Reset Calculator</button>\n          </div>\n        </div>\n      </section>\n\n      <!-- Coming Soon Section -->'
forecaster_close_new = '            <button type="button" class="vat-reset-btn" id="foreReset" style="margin-top:1.5rem;">Reset Calculator</button>\n          </div>\n        </div>\n          </div><!-- end inv-content-area -->\n        </div><!-- end inv-page-layout -->\n      </section>\n\n      <!-- Coming Soon Section -->'

if forecaster_close_old in content:
    content = content.replace(forecaster_close_old, forecaster_close_new, 1)
    print("OK Forecaster section closed correctly")
else:
    print("FAIL Forecaster close marker NOT found")

if content != original_content:
    with open('templates/index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("templates/index.html updated successfully!")
else:
    print("WARNING: No changes made to index.html")
