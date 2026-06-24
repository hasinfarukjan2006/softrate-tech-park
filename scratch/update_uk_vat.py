import os
import shutil

# ==============================================================================
# HTML Content with Zoho Branding and SVGs
# ==============================================================================
HTML = """      <!-- Section: UK VAT Calculator -->
      <section id="uk-vat-section" class="content-section mt-8 hide">
        <!-- Hero Section -->
        <div class="uk-hero">
          <div class="uk-hero-inner">
            <div class="uk-hero-illust uk-hero-left">
              <svg viewBox="0 0 160 160" width="160" height="160" fill="none" stroke="#2F3FC7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <!-- Calculator base -->
                <rect x="45" y="30" width="70" height="100" rx="8" fill="white" stroke="#2F3FC7" stroke-width="2"/>
                <!-- Screen -->
                <rect x="55" y="40" width="50" height="20" rx="3" fill="#f1f5f9" stroke="#2F3FC7" stroke-width="1.5"/>
                <!-- Buttons -->
                <rect x="57" y="70" width="10" height="10" rx="2" fill="#e2e8f0"/>
                <rect x="75" y="70" width="10" height="10" rx="2" fill="#e2e8f0"/>
                <rect x="93" y="70" width="10" height="10" rx="2" fill="#e2e8f0"/>
                <rect x="57" y="85" width="10" height="10" rx="2" fill="#e2e8f0"/>
                <rect x="75" y="85" width="10" height="10" rx="2" fill="#e2e8f0"/>
                <rect x="93" y="85" width="10" height="10" rx="2" fill="#e2e8f0"/>
                <rect x="57" y="100" width="10" height="10" rx="2" fill="#e2e8f0"/>
                <rect x="75" y="100" width="10" height="10" rx="2" fill="#e2e8f0"/>
                <rect x="93" y="100" width="10" height="10" rx="2" fill="#e2e8f0"/>
                <!-- Hand outline -->
                <path d="M15,140 C35,110 40,80 50,75 C55,80 53,95 48,105 C58,95 62,90 67,95 C70,98 65,108 55,115 C68,108 75,105 78,110 C80,113 73,123 60,128 C70,123 78,123 80,128 C80,132 70,138 55,140 C45,142 35,148 25,160" stroke="#2F3FC7" stroke-width="2" fill="white"/>
                <!-- Decorative lines -->
                <path d="M20,60 C25,50 35,45 40,55" stroke="rgba(47,63,199,0.3)" stroke-width="1.5" stroke-dasharray="3 3"/>
                <path d="M110,140 C125,135 135,145 145,140" stroke="rgba(47,63,199,0.3)" stroke-width="1.5"/>
              </svg>
            </div>
            <div class="uk-hero-text">
              <h1>VAT Calculator</h1>
              <p>Follow the three simple steps stated below to figure out your VAT amount in a matter of seconds.</p>
            </div>
            <div class="uk-hero-illust uk-hero-right">
              <svg viewBox="0 0 160 160" width="160" height="160" fill="none" stroke="#2F3FC7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <!-- Dotted main circle -->
                <circle cx="80" cy="80" r="45" stroke="rgba(47,63,199,0.3)" stroke-width="1.5" stroke-dasharray="4 4"/>
                <!-- Percent symbol inside circle -->
                <circle cx="68" cy="68" r="8" stroke="#2F3FC7" stroke-width="2"/>
                <circle cx="92" cy="92" r="8" stroke="#2F3FC7" stroke-width="2"/>
                <line x1="95" y1="65" x2="65" y2="95" stroke="#2F3FC7" stroke-width="2.5"/>
                <!-- Floating elements -->
                <!-- Pound symbol -->
                <path d="M125,45 C125,40 135,35 135,42 C135,45 130,48 128,52 L138,52 M124,55 L136,55" stroke="rgba(47,63,199,0.5)" stroke-width="1.5"/>
                <!-- Plus symbol -->
                <path d="M25,85 L35,85 M30,80 L30,90" stroke="rgba(47,63,199,0.5)" stroke-width="1.5"/>
                <!-- Wavy lines -->
                <path d="M20,110 Q40,100 60,115 T100,105" stroke="rgba(47,63,199,0.2)" stroke-width="1.5"/>
                <path d="M70,30 Q90,20 110,35" stroke="rgba(47,63,199,0.2)" stroke-width="1.5"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="uk-wrapper">
          <!-- Calculator Card -->
          <div class="uk-card">
            <div class="uk-form-grid">
              <div class="uk-field">
                <label for="ukVatAmount">Enter Amount (£)</label>
                <div class="uk-input-wrap">
                  <input type="number" id="ukVatAmount" placeholder="0.00" min="0" step="0.01">
                </div>
              </div>
              
              <div class="uk-field">
                <label for="ukVatRate">VAT Rate (%)</label>
                <div class="uk-input-wrap">
                  <input type="number" id="ukVatRate" value="0" min="0" max="100" step="0.1">
                </div>
              </div>

              <div class="uk-field">
                <label>Choose to</label>
                <div class="uk-toggle-group">
                  <button type="button" class="uk-toggle-btn active" id="ukBtnAddVat">Add VAT</button>
                  <button type="button" class="uk-toggle-btn" id="ukBtnRemoveVat">Remove VAT</button>
                </div>
              </div>
            </div>

            <!-- Live Calculation Block -->
            <div class="uk-calc-output-row">
              <div class="uk-output-block">
                <div class="uk-output-val"><span class="uk-curr">£</span><span id="ukOutVat">0.00</span></div>
                <div class="uk-output-lbl" id="ukLblVat">VAT Amount</div>
              </div>
              <div class="uk-divider"></div>
              <div class="uk-output-block">
                <div class="uk-output-val"><span class="uk-curr">£</span><span id="ukOutTotal">0.00</span></div>
                <div class="uk-output-lbl" id="ukLblTotal">Inclusive Amount</div>
              </div>
            </div>
          </div>

          <!-- Information Sections -->
          <div class="uk-info">
            <h2>Introducing Zoho's VAT calculator</h2>
            <p>VAT, or Value Added Tax, is a type of consumption tax levied on the sale of goods and services in the UK since 1973. Since businesses collect VAT on behalf of the government, it is considered an indirect tax. Zoho brings you a free VAT calculator that helps you calculate VAT accurately regardless of the VAT rates.</p>

            <h2>How can you calculate VAT with this tool?</h2>
            <div class="uk-grey-box">
              <p class="uk-box-lead">With the free VAT calculator, you can calculate the tax amount in three simple steps. The tool provides you with fields that have to be filled, and it calculates VAT automatically based on what you fill in.</p>
              
              <!-- Vertical Timeline -->
              <div class="uk-timeline">
                <div class="uk-timeline-item">
                  <div class="uk-timeline-num">1</div>
                  <div class="uk-timeline-txt">Enter the price of the goods or services in the <strong>Enter Amount</strong> field.</div>
                </div>
                <div class="uk-timeline-item">
                  <div class="uk-timeline-num">2</div>
                  <div class="uk-timeline-txt">Select the tax rate from the tax rate section. You can also provide a custom tax rate if the goods or service doesn't fall under the 5% or 20% tax slab.</div>
                </div>
                <div class="uk-timeline-item">
                  <div class="uk-timeline-num">3</div>
                  <div class="uk-timeline-txt">Choose if the price that you entered is <strong>inclusive</strong> or <strong>exclusive</strong> of tax.</div>
                </div>
                <div class="uk-timeline-item dot-connector">
                  <div class="uk-timeline-dot"></div>
                  <div class="uk-timeline-txt">If the price you've entered is tax inclusive, the tool automatically calculates, and displays the net amount of the goods or service after subtracting the VAT.</div>
                </div>
                <div class="uk-timeline-item dot-connector">
                  <div class="uk-timeline-dot"></div>
                  <div class="uk-timeline-txt">If the price you've entered is tax exclusive, the tool automatically calculates, and displays the gross amount after adding the VAT.</div>
                </div>
              </div>
            </div>

            <h2>More on VAT</h2>
            <p>Any business that buys and sells products or services in the UK market and has a taxable annual turnover of more than £85,000 must register for VAT with HMRC. Other businesses can register voluntarily, but are not required to do so. There are three different VAT rates in the UK.</p>

            <div class="uk-white-card">
              <ul>
                <li>The standard rate of VAT is currently 20% and is charged on most goods and services.</li>
                <li>A reduced VAT rate of 5% is charged for children's car seats, sanitary products, and domestic fuel or power.</li>
                <li>Zero-rated goods are still VAT-taxable, but the VAT for them is 0%. You still have to record these goods in your VAT accounts and report them on your VAT return. Zero-rated goods include most food, books, newspapers and children's clothes.</li>
              </ul>
            </div>

            <p style="margin-top: 1.5rem; margin-bottom: 1.5rem;">Exempt items, like postage stamps and financial and property transactions, carry a zero rate for VAT and need not be reported in your taxable turnover. Read more about the different VAT rates imposed on various goods and services.</p>
            <p style="margin-bottom: 2rem;">It is important for each business to file an accurate VAT return and repay the VAT it has collected to HMRC. Learn more about VAT.</p>

            <!-- Zoho Books Promotional Card -->
            <div class="uk-promo-card">
              <h2>Zoho Books does more than just calculating VAT</h2>
              <p>Zoho Books, a VAT compliant accounting platform, helps businesses create VAT invoices, manage their finances, file tax returns directly, generate detailed reports, and much more. Learn how Zoho Books can be the right fit for your business.</p>

              <h3>More of Zoho Books' features for business</h3>
              <div class="uk-features-grid">
                <div class="uk-feature-item">
                  <div class="uk-feat-icon">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#2F3FC7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="17 11 21 7 17 3"></polyline>
                      <line x1="21" y1="7" x2="9" y2="7"></line>
                      <polyline points="7 13 3 17 7 21"></polyline>
                      <line x1="3" y1="17" x2="15" y2="17"></line>
                    </svg>
                  </div>
                  <div class="uk-feat-text">Manage receivables and payables effortlessly</div>
                </div>
                <div class="uk-feature-item">
                  <div class="uk-feat-icon">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#2F3FC7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                      <line x1="12" y1="22.08" x2="12" y2="12"></line>
                    </svg>
                  </div>
                  <div class="uk-feat-text">Create items and track inventory</div>
                </div>
                <div class="uk-feature-item">
                  <div class="uk-feat-icon">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#2F3FC7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="3" y1="22" x2="21" y2="22"></line>
                      <line x1="6" y1="18" x2="6" y2="11"></line>
                      <line x1="10" y1="18" x2="10" y2="11"></line>
                      <line x1="14" y1="18" x2="14" y2="11"></line>
                      <line x1="18" y1="18" x2="18" y2="11"></line>
                      <polygon points="12 2 2 7 22 7"></polygon>
                    </svg>
                  </div>
                  <div class="uk-feat-text">Reconcile bank accounts easily</div>
                </div>
                <div class="uk-feature-item">
                  <div class="uk-feat-icon">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#2F3FC7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10"></path>
                      <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                      <path d="M10.4 12.6a2 2 0 1 0-3 3L10 18l5.6-5.6a2 2 0 1 0-3-3L10 12z"></path>
                    </svg>
                  </div>
                  <div class="uk-feat-text">Create and manage multiple projects</div>
                </div>
                <div class="uk-feature-item">
                  <div class="uk-feat-icon">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#2F3FC7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="18" y1="20" x2="18" y2="10"></line>
                      <line x1="12" y1="20" x2="12" y2="4"></line>
                      <line x1="6" y1="20" x2="6" y2="14"></line>
                    </svg>
                  </div>
                  <div class="uk-feat-text">Get brilliant insights with 50+ reports</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
"""

# ==============================================================================
# CSS Stylesheet (Pixel-Perfect Alignment)
# ==============================================================================
CSS = """/* uk_vat_calculator.css — UK VAT Calculator Stylesheet */

#uk-vat-section {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
  color: #333 !important;
}

#uk-vat-section .uk-hero {
  background: #eef3ff !important;
  padding: 4rem 2rem 5rem !important;
  overflow: hidden;
  position: relative;
}

.uk-hero-inner {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  position: relative;
}

.uk-hero-text {
  flex: 1;
  text-align: center;
  z-index: 2;
}

.uk-hero-text h1 {
  font-size: 3rem !important;
  font-weight: 700 !important;
  color: #03254c !important;
  margin-bottom: 1rem !important;
  border: none !important;
  line-height: 1.2 !important;
}

.uk-hero-text p {
  font-size: 1.15rem !important;
  color: #475569 !important;
  max-width: 600px;
  margin: 0 auto !important;
  line-height: 1.6 !important;
}

.uk-hero-illust {
  flex-shrink: 0;
  width: 160px;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

@media (max-width: 768px) {
  .uk-hero-illust {
    display: none;
  }
  .uk-hero-text h1 {
    font-size: 2.25rem !important;
  }
  .uk-hero-text p {
    font-size: 1rem !important;
  }
}

/* Wrapper */
.uk-wrapper {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 2rem 5rem;
}

/* Card */
.uk-card {
  background: #ffffff !important;
  border: 1px solid #e2e8f0 !important;
  border-radius: 12px !important;
  padding: 3rem 2.5rem !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05) !important;
  margin-top: -3.5rem;
  position: relative;
  z-index: 10;
  max-width: 840px;
  margin-left: auto;
  margin-right: auto;
}

.uk-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1.2fr;
  gap: 2rem;
  margin-bottom: 2.5rem;
}

@media (max-width: 768px) {
  .uk-form-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

.uk-field {
  display: flex;
  flex-direction: column;
}

.uk-field label {
  font-size: 0.95rem !important;
  font-weight: 600 !important;
  color: #03254c !important;
  margin-bottom: 0.75rem !important;
}

.uk-input-wrap {
  border: 1px solid #cbd5e1 !important;
  border-radius: 4px !important;
  background: #fff !important;
  display: flex;
  align-items: center;
  transition: border-color 0.2s;
}

.uk-input-wrap:focus-within {
  border-color: #2F3FC7 !important;
}

.uk-input-wrap input {
  border: none !important;
  outline: none !important;
  width: 100%;
  padding: 12px 16px !important;
  font-size: 1.05rem !important;
  color: #1e293b !important;
  background: transparent !important;
}

/* Toggle buttons */
.uk-toggle-group {
  display: flex;
  border: 1px solid #cbd5e1 !important;
  border-radius: 4px !important;
  overflow: hidden;
}

.uk-toggle-btn {
  flex: 1;
  border: none !important;
  background: #fff !important;
  color: #03254c !important;
  padding: 12px 8px !important;
  font-size: 0.95rem !important;
  font-weight: 600 !important;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  outline: none !important;
}

.uk-toggle-btn.active {
  background: #03254c !important;
  color: #fff !important;
}

/* Output Row */
.uk-calc-output-row {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-top: 2rem;
  padding-top: 2.5rem;
  border-top: 1px solid #f1f5f9;
}

@media (max-width: 600px) {
  .uk-calc-output-row {
    flex-direction: column;
    gap: 2rem;
  }
}

.uk-output-block {
  text-align: center;
  flex: 1;
}

.uk-output-val {
  font-size: 2.5rem;
  font-weight: 700;
  color: #03254c;
  line-height: 1.2;
}

.uk-curr {
  font-size: 1.75rem;
  font-weight: 600;
  color: #03254c;
  margin-right: 2px;
}

.uk-output-lbl {
  font-size: 1rem;
  font-weight: 600;
  margin-top: 8px;
}

/* Green output label for VAT Amount */
#ukLblVat {
  color: #00be70 !important;
}

/* Blue output label for Inclusive/Exclusive Amount */
#ukLblTotal {
  color: #007aff !important;
}

.uk-divider {
  width: 1px;
  height: 64px;
  background: #e2e8f0;
}

@media (max-width: 600px) {
  .uk-divider {
    display: none;
  }
}

/* Information section */
.uk-info {
  margin-top: 4rem;
  max-width: 840px;
  margin-left: auto;
  margin-right: auto;
}

.uk-info h2 {
  font-size: 1.85rem !important;
  font-weight: 700 !important;
  color: #03254c !important;
  margin: 4rem 0 1.5rem !important;
  border: none !important;
}

.uk-info p {
  font-size: 1.05rem !important;
  line-height: 1.7 !important;
  color: #475569 !important;
  margin-bottom: 1.5rem !important;
}

/* Grey Information Box */
.uk-grey-box {
  background: #f8fafc !important;
  border: 1px solid #e2e8f0 !important;
  border-radius: 8px !important;
  padding: 2.5rem !important;
  margin-bottom: 3rem !important;
}

.uk-box-lead {
  font-size: 1.05rem !important;
  font-weight: 600 !important;
  color: #1e293b !important;
  margin-bottom: 2rem !important;
}

/* Timeline */
.uk-timeline {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  position: relative;
  padding-left: 0.5rem;
}

.uk-timeline::before {
  content: "";
  position: absolute;
  left: 17px;
  top: 14px;
  bottom: 14px;
  width: 1px;
  background: #03254c;
  z-index: 0;
}

.uk-timeline-item {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  position: relative;
  z-index: 1;
}

.uk-timeline-num {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #03254c;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
  font-weight: bold;
  flex-shrink: 0;
  box-shadow: 0 0 0 4px #f8fafc;
}

.uk-timeline-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #fff;
  border: 3px solid #03254c;
  margin: 11px;
  flex-shrink: 0;
  box-shadow: 0 0 0 4px #f8fafc;
}

.uk-timeline-item.dot-connector::before {
  content: "";
  position: absolute;
  left: 17px;
  top: -1.75rem;
  bottom: 100%;
  width: 1px;
  border-left: 1px dashed #03254c;
}

.uk-timeline-txt {
  font-size: 1rem;
  line-height: 1.6;
  color: #334155;
  padding-top: 6px;
}

/* White card details */
.uk-white-card {
  border: 1px solid #e2e8f0 !important;
  border-radius: 8px !important;
  padding: 2.25rem !important;
  background: #fff !important;
  margin-bottom: 2rem !important;
  box-shadow: 0 4px 12px rgba(0,0,0,0.02) !important;
}

.uk-white-card ul {
  padding-left: 1.5rem !important;
  margin: 0 !important;
  list-style-type: disc !important;
}

.uk-white-card li {
  font-size: 1.02rem !important;
  line-height: 1.7 !important;
  color: #475569 !important;
  margin-bottom: 1.25rem !important;
}

.uk-white-card li:last-child {
  margin-bottom: 0 !important;
}

/* Promo Card & Features */
.uk-promo-card {
  background: #f8fafc !important;
  border: 1px solid #e2e8f0 !important;
  border-radius: 12px !important;
  padding: 3.5rem !important;
  margin-top: 5rem !important;
}

.uk-promo-card h2 {
  font-size: 2rem !important;
  font-weight: 700 !important;
  color: #03254c !important;
  margin: 0 0 1.25rem !important;
  border: none !important;
}

.uk-promo-card p {
  font-size: 1.05rem !important;
  line-height: 1.7 !important;
  color: #475569 !important;
  margin-bottom: 3rem !important;
}

.uk-promo-card h3 {
  font-size: 1.45rem !important;
  font-weight: 700 !important;
  color: #03254c !important;
  margin: 3rem 0 2rem !important;
  border: none !important;
  text-align: center !important;
}

.uk-features-grid {
  display: flex !important;
  flex-wrap: wrap !important;
  justify-content: center !important;
  gap: 3rem 2rem !important;
}

.uk-feature-item {
  flex: 0 0 30% !important;
  max-width: 30% !important;
  text-align: center !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
}

@media (max-width: 768px) {
  .uk-feature-item {
    flex: 0 0 100% !important;
    max-width: 100% !important;
  }
}

.uk-feat-icon {
  margin-bottom: 1.25rem !important;
  width: 48px !important;
  height: 48px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  background: #eef3ff !important;
  border-radius: 50% !important;
}

.uk-feat-text {
  font-size: 1.02rem !important;
  font-weight: 600 !important;
  color: #03254c !important;
  line-height: 1.5 !important;
}
"""

# ==============================================================================
# JavaScript Logic
# ==============================================================================
JS = """/* uk_vat_calculator.js — UK VAT Calculator Logic */
document.addEventListener("DOMContentLoaded", function() {
  const container = document.getElementById("uk-vat-section");
  if (!container) return;

  const inputAmount = document.getElementById("ukVatAmount");
  const inputRate = document.getElementById("ukVatRate");
  const btnAddVat = document.getElementById("ukBtnAddVat");
  const btnRemoveVat = document.getElementById("ukBtnRemoveVat");

  const outVat = document.getElementById("ukOutVat");
  const outTotal = document.getElementById("ukOutTotal");
  const lblVat = document.getElementById("ukLblVat");
  const lblTotal = document.getElementById("ukLblTotal");

  let action = "add"; // "add" | "remove"

  function formatValue(val) {
    if (val === 0) return "0.00";
    return val.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function calculate() {
    const amount = parseFloat(inputAmount.value) || 0;
    const rate = parseFloat(inputRate.value) || 0;

    let vatAmount = 0;
    let totalAmount = 0;

    if (action === "add") {
      vatAmount = amount * rate / 100.0;
      totalAmount = amount + vatAmount;
      lblVat.textContent = "VAT Amount";
      lblTotal.textContent = "Inclusive Amount";
    } else {
      // Remove VAT
      const netAmount = amount / (1.0 + rate / 100.0);
      vatAmount = amount - netAmount;
      totalAmount = netAmount; // net amount is exclusive amount
      lblVat.textContent = "VAT Amount";
      lblTotal.textContent = "Exclusive Amount";
    }

    outVat.textContent = formatValue(vatAmount);
    outTotal.textContent = formatValue(totalAmount);
  }

  btnAddVat.addEventListener("click", function() {
    btnAddVat.classList.add("active");
    btnRemoveVat.classList.remove("active");
    action = "add";
    calculate();
  });

  btnRemoveVat.addEventListener("click", function() {
    btnRemoveVat.classList.add("active");
    btnAddVat.classList.remove("active");
    action = "remove";
    calculate();
  });

  inputAmount.addEventListener("input", calculate);
  inputRate.addEventListener("input", calculate);

  // Initial Calculation
  calculate();
});
"""

def process_file(fp, is_dist):
    print(f"Processing {fp}...")
    with open(fp, "r", encoding="utf-8") as f:
        content = f.read()

    # Locate starting of <section id="uk-vat-section"
    start_tag = '<section id="uk-vat-section"'
    start_idx = content.find(start_tag)
    if start_idx == -1:
        print(f"Error: {start_tag} not found in {fp}")
        return

    # Find the closing </section> after start_idx
    end_tag = '</section>'
    end_idx = content.find(end_tag, start_idx)
    if end_idx == -1:
        print(f"Error: {end_tag} not found after start tag in {fp}")
        return
    end_idx += len(end_tag)

    # Perform precise replacement
    new_content = content[:start_idx] + HTML + content[end_idx:]

    # Inject CSS stylesheet if not present
    css_name = "uk_vat_calculator.css"
    css_path = f"/css/{css_name}" if is_dist else f"/static/css/{css_name}"
    css_tag = f'<link rel="stylesheet" href="{css_path}">'
    
    if css_tag not in new_content:
        # Search for <!-- Top Header Bar --> as </head> is missing
        marker = "<!-- Top Header Bar -->"
        pos = new_content.find(marker)
        if pos != -1:
            new_content = new_content[:pos] + f"{css_tag}\n  " + new_content[pos:]
        else:
            head_end = new_content.find("</head>")
            if head_end != -1:
                new_content = new_content[:head_end] + f"  {css_tag}\n" + new_content[head_end:]

    # Inject JS script if not present
    js_name = "uk_vat_calculator.js"
    js_path = f"/js/{js_name}" if is_dist else f"/static/js/{js_name}"
    js_tag = f'<script src="{js_path}"></script>'
    
    if js_tag not in new_content:
        body_end = new_content.find("</body>")
        if body_end != -1:
            new_content = new_content[:body_end] + f"  {js_tag}\n" + new_content[body_end:]

    with open(fp, "w", encoding="utf-8") as f:
        f.write(new_content)
    print(f"Successfully processed {fp}")

def main():
    # Create templates/uk_vat_calculator.html
    print("Writing templates/uk_vat_calculator.html...")
    with open("softrate/templates/uk_vat_calculator.html", "w", encoding="utf-8") as f:
        f.write(HTML)

    # Write CSS file
    print("Writing CSS...")
    with open("softrate/static/css/uk_vat_calculator.css", "w", encoding="utf-8") as f:
        f.write(CSS)
    shutil.copy2("softrate/static/css/uk_vat_calculator.css", "dist/css/uk_vat_calculator.css")
    print("  Created softrate/static/css/uk_vat_calculator.css and dist/css/uk_vat_calculator.css")

    # Write JS file
    print("Writing JS...")
    with open("softrate/static/js/uk_vat_calculator.js", "w", encoding="utf-8") as f:
        f.write(JS)
    shutil.copy2("softrate/static/js/uk_vat_calculator.js", "dist/js/uk_vat_calculator.js")
    print("  Created softrate/static/js/uk_vat_calculator.js and dist/js/uk_vat_calculator.js")

    # Inject HTML
    process_file("softrate/templates/index.html", is_dist=False)
    process_file("dist/index.html", is_dist=True)
    print("HTML replacement complete.")

if __name__ == "__main__":
    main()
