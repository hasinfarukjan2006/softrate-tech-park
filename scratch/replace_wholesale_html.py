import os

def main():
    filepath = 'templates/index.html'
    if not os.path.exists(filepath):
        print(f'{filepath} not found')
        return
        
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()
        
    # We want to replace everything from "<!-- Section: Wholesale Price Calculator -->"
    # to the next "<!-- Coming Soon Section -->"
    
    start_tag = '<!-- Section: Wholesale Price Calculator -->'
    end_tag = '<!-- Coming Soon Section -->'
    
    start_idx = html.find(start_tag)
    if start_idx == -1:
        print('Could not find start tag')
        return
        
    end_idx = html.find(end_tag)
    if end_idx == -1:
        print('Could not find end tag')
        return
        
    new_section_content = """<!-- Section: Wholesale Price Calculator -->
      <section id="wholesale-section" class="content-section hide">
        <!-- Zoho-style Hero Section with Peach Background -->
        <div class="banner-section">
          <div class="banner-container">
            <div class="banner-desc">
              <h1><span>Wholesale price </span>calculator</h1>
              <p>Put your pricing strategy into action with Softrate Tech Park's free wholesale price calculator. Determine your wholesale price based on your desired profit margin.</p>
            </div>
            <div class="banner-tool-sec">
              <!-- Currency selector on top of the card -->
              <select id="currency-selection" class="currency-selection" onchange="switchCurrency()">
                <option value="INR" selected>INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
                <option value="EUR">EUR (€)</option>
              </select>
              
              <!-- Calculator Card Container -->
              <div class="banner-tool-container">
                <!-- Cost price per unit -->
                <div class="tool-form-grp">
                  <div class="tool-form-label">
                    <p>Cost price per unit</p>
                  </div>
                  <div class="tool-form-input-container">
                    <div class="tool-form currency-symbol">₹</div>
                    <input type="number" id="costPrice" class="cost-per-unit" placeholder="0.00" min="0" step="any">
                  </div>
                </div>
                
                <!-- Overhead expenses -->
                <div class="tool-form-grp">
                  <div class="tool-form-label">
                    <p>Overhead expenses</p>
                  </div>
                  <div class="tool-form-input-container">
                    <div class="tool-form currency-symbol">₹</div>
                    <input type="number" id="overhead" class="overhead-expense" placeholder="0.00" min="0" step="any">
                  </div>
                </div>
                
                <!-- Administrative cost -->
                <div class="tool-form-grp">
                  <div class="tool-form-label">
                    <p>Administrative cost</p>
                  </div>
                  <div class="tool-form-input-container">
                    <div class="tool-form currency-symbol">₹</div>
                    <input type="number" id="adminCost" class="administrative-cost" placeholder="0.00" min="0" step="any">
                  </div>
                </div>
                
                <!-- Number of units with - and + -->
                <div class="tool-form-grp">
                  <div class="tool-form-label">
                    <p>Number of units</p>
                  </div>
                  <div class="tool-form-input-container cart">
                    <div id="decreaseUnits" class="minus disabled">-</div>
                    <input type="number" id="units" class="no-of-units" value="1" min="1">
                    <div id="increaseUnits" class="add">+</div>
                  </div>
                </div>
                
                <!-- Total Cost Price -->
                <div class="total-cost-price">
                  <div class="total-cost-label">Total Cost Price</div>
                  <div class="total-cost-value">
                    <span class="currency-symbol">₹</span>
                    <span id="resTotalCost" class="total-value">0.00</span>
                  </div>
                </div>
                
                <!-- Profit margin -->
                <div class="tool-form-grp profit-margin">
                  <div class="tool-form-label">
                    <p>Profit margin</p>
                  </div>
                  <div class="tool-form-input-container">
                    <input type="number" id="profitMargin" class="profit-margin-input" placeholder="0" min="0" step="any">
                    <div class="percentage">%</div>
                  </div>
                </div>
                
                <!-- Save Calculation Button -->
                <div class="save-btn-wrapper" style="margin-top: 1.5rem; text-align: center;">
                  <button type="button" id="saveBtn" class="btn btn-prim" style="width: 100%; font-weight: 600; padding: 10px; border-radius: 8px;">
                    Save Calculation
                  </button>
                </div>
              </div>
              
              <!-- Bottom Result Bar -->
              <div class="tool-sec-whole-sale-price">
                <div class="tool-form-label">
                  <span>Wholesale price</span>
                </div>
                <div class="whole-sale-price-value">
                  <span class="currency-symbol">₹</span>
                  <span id="resWholesalePrice" class="price-total">0.00</span>
                </div>
              </div>
              
              <!-- Reset button/link below the card -->
              <div id="resetBtn" class="reset-btn" style="cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 15px; font-weight: 500;">
                <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M14.003 7.333a.667.667 0 00-.667.667 5.366 5.366 0 01-7.923 4.754 5.367 5.367 0 116.443-8.42h-1.6a.667.667 0 000 1.333h3.02A.667.667 0 0013.943 5V2a.667.667 0 00-1.333 0v1.18a6.669 6.669 0 00-10.74 7.439 6.667 6.667 0 0011.298 1.595A6.665 6.665 0 0014.67 8a.666.666 0 00-.667-.667z" fill="#000"/></svg>
                <span>Reset</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Red Section: What is wholesale price? -->
        <div class="what-is-wholesale-price">
          <div class="what-is-wholesale-container">
            <div class="what-is-wholesale-desc">
              <h2>What is <span>wholesale price?</span></h2>
              <p>A wholesale price is the price charged by businesses for products when sold in large volumes. Usually, businesses sell products to large trade or distributor groups at the wholesale price.</p>
              
              <div class="need-to-know">
                <h3>
                  <svg width="16" height="22" fill="none" viewBox="0 0 16 22"><path fill="#fff" d="M13.09 1.82A8 8 0 006.41.16 8 8 0 00.14 6.48a8.07 8.07 0 001.72 6.65A4.54 4.54 0 013 16v3a3 3 0 003 3h4a3 3 0 003-3v-2.81A5.17 5.17 0 0114.22 13a8 8 0 00-1.13-11.2v.02zM11 19a1 1 0 01-1 1H6a1 1 0 01-1-1v-1h6v1zm1.67-7.24A7.13 7.13 0 0011 16H9v-3a1 1 0 10-2 0v3H5a6.5 6.5 0 00-1.6-4.16 6 6 0 013.39-9.72A6 6 0 0114 8a5.89 5.89 0 01-1.33 3.76z"/></svg>
                  What you need to know?
                </h3>
                <ul class="features-list">
                  <li>
                    <svg viewBox="0 0 512 512" class="tick"><path fill="#f14444" d="M254.8 359.4L120.6 225.2l39.9-39.9 94.4 94.3 193-193C401 33.3 332.3-.4 255.6-.4c-141.4 0-256 114.6-256 256s114.6 256 256 256 256-114.6 256-256c0-44.2-11.2-85.8-30.9-122.1L254.8 359.4z"/><path fill="#FFF" d="M160.5 185.3l-39.9 39.9 134.3 134.2 225.9-225.8c-9.2-16.9-20.2-32.6-32.8-47l-193 193-94.5-94.3z"/></svg>
                    <span>The wholesale price is relatively lower than the retail price due to the lower operating costs involved.</span>
                  </li>
                  <li>
                    <svg viewBox="0 0 512 512" class="tick"><path fill="#f14444" d="M254.8 359.4L120.6 225.2l39.9-39.9 94.4 94.3 193-193C401 33.3 332.3-.4 255.6-.4c-141.4 0-256 114.6-256 256s114.6 256 256 256 256-114.6 256-256c0-44.2-11.2-85.8-30.9-122.1L254.8 359.4z"/><path fill="#FFF" d="M160.5 185.3l-39.9 39.9 134.3 134.2 225.9-225.8c-9.2-16.9-20.2-32.6-32.8-47l-193 193-94.5-94.3z"/></svg>
                    <span>Wholesale pricing is based on the principle of selling in bulk with a lower markup.</span>
                  </li>
                  <li>
                    <svg viewBox="0 0 512 512" class="tick"><path fill="#f14444" d="M254.8 359.4L120.6 225.2l39.9-39.9 94.4 94.3 193-193C401 33.3 332.3-.4 255.6-.4c-141.4 0-256 114.6-256 256s114.6 256 256 256 256-114.6 256-256c0-44.2-11.2-85.8-30.9-122.1L254.8 359.4z"/><path fill="#FFF" d="M160.5 185.3l-39.9 39.9 134.3 134.2 225.9-225.8c-9.2-16.9-20.2-32.6-32.8-47l-193 193-94.5-94.3z"/></svg>
                    <span>Wholesale pricing largely depends on key factors like suppliers, labor costs, and overhead expenses.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Formula Section: How's wholesale price calculated? -->
        <div class="how-price-calculated-section">
          <div class="how-price-container">
            <h2>How's wholesale price calculated?</h2>
            <p>Using the popular absorption pricing method, wholesale price is calculated based on the cost price and the necessary profit margin.</p>
            
            <div class="formula-section">
              <div class="total-cost-price">Total cost price&nbsp;&nbsp;=</div>
              <div class="total-cost-price-calculation">
                <div class="cost-price-unt">Cost price per unit&nbsp;&nbsp;&nbsp;&nbsp;+</div>
                <div class="rhs-bracket">{</div>
                <div class="total-cost-formula">
                  <p>Overhead expenses&nbsp;&nbsp;+&nbsp;&nbsp;Administrative cost</p>
                  <hr>
                  <p>Total number of units</p>
                </div>
                <div class="lhs-bracket">}</div>
              </div>
            </div>
            
            <div class="whole-sale-price-formula">
              <div class="whole-sale-price-equal-to">
                <span>Wholesale price&nbsp;&nbsp;=</span>
                <div>Total cost price<hr>( 1 - Profit margin )</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Comparison Section: What's the difference? -->
        <div class="whats-diff-section">
          <div class="whats-diff-container">
            <h2>What's the difference?</h2>
            <div class="what-diff-box-container">
              <!-- Wholesale Price Box -->
              <div class="whole-sale-price-box">
                <div class="diff-header">
                  <svg width="26" height="26" fill="none" class="diff-img" viewBox="0 0 26 26"><path stroke="#fff" stroke-linecap="round" stroke-miterlimit="10" stroke-width="1.5" d="M18.826 1H7.095a.116.116 0 00-.116.116v11.732c0 .064.052.116.116.116h11.731a.116.116 0 00.116-.116V1.116A.116.116 0 0018.826 1zm-7.16 3.97h2.593m-1.411 8.066H1.116a.116.116 0 00-.116.116v11.732c0 .064.052.116.116.116h11.732a.116.116 0 00.116-.116V13.152a.116.116 0 00-.116-.116zm-7.16 4.024H8.28"/><path stroke="#fff" stroke-linecap="round" stroke-miterlimit="10" stroke-width="1.5" d="M24.799 13.036H13.067a.116.116 0 00-.116.116v11.732c0 .064.052.116.116.116H24.8a.116.116 0 00.116-.116V13.152a.116.116 0 00-.116-.116zm-7.16 4.024h2.592"/></svg>
                  Wholesale price
                </div>
                <ul class="diff-points">
                  <li>
                    <svg width="18" height="18" fill="none" class="bullet-img" viewBox="0 0 18 18"><path fill="#FCF95B" d="M0 9.418l1.906.121a7.022 7.022 0 016.564 6.564l.12 1.906h.828l.121-1.906a7.021 7.021 0 016.564-6.564l1.906-.12V8.59l-1.906-.121A7.022 7.022 0 019.54 1.906L9.42 0h-.83l-.12 1.906A7.022 7.022 0 011.906 8.47L0 8.59v.828z"/></svg>
                    <p>A wholesale process involves movement of goods from manufacturing to distribution.</p>
                  </li>
                  <li>
                    <svg width="18" height="18" fill="none" class="bullet-img" viewBox="0 0 18 18"><path fill="#FCF95B" d="M0 9.418l1.906.121a7.022 7.022 0 016.564 6.564l.12 1.906h.828l.121-1.906a7.021 7.021 0 016.564-6.564l1.906-.12V8.59l-1.906-.121A7.022 7.022 0 019.54 1.906L9.42 0h-.83l-.12 1.906A7.022 7.022 0 011.906 8.47L0 8.59v.828z"/></svg>
                    <p>Distributors or producers charge retailers a wholesale price for products.</p>
                  </li>
                </ul>
              </div>
              
              <!-- Retail Price Box -->
              <div class="retail-price-box">
                <div class="diff-header">
                  <svg width="20" height="26" fill="none" class="diff-img" viewBox="0 0 20 26"><path stroke="#fff" stroke-linecap="round" stroke-miterlimit="10" stroke-width="1.5" d="M18.77 25H1.274A.267.267 0 011 24.718L2.334 8.004a.27.27 0 01.273-.243h14.83a.27.27 0 01.274.243l1.333 16.714a.267.267 0 01-.274.282h0z"/><path stroke="#fff" stroke-linecap="round" stroke-miterlimit="10" stroke-width="1.5" d="M7.154 10.65V4.08c0-1.694 1.29-3.08 2.868-3.08 1.577 0 2.868 1.386 2.868 3.08v6.57m-6.372 6.743h7.01"/></svg>
                  Retail Price
                </div>
                <ul class="diff-points">
                  <li>
                    <svg width="18" height="18" fill="none" class="bullet-img" viewBox="0 0 18 18"><path fill="#FCF95B" d="M0 9.418l1.906.121a7.022 7.022 0 016.564 6.564l.12 1.906h.828l.121-1.906a7.021 7.021 0 016.564-6.564l1.906-.12V8.59l-1.906-.121A7.022 7.022 0 019.54 1.906L9.42 0h-.83l-.12 1.906A7.022 7.022 0 011.906 8.47L0 8.59v.828z"/></svg>
                    <p>Contrastingly, a retail process involves acquiring goods and selling them to consumers.</p>
                  </li>
                  <li>
                    <svg width="18" height="18" fill="none" class="bullet-img" viewBox="0 0 18 18"><path fill="#FCF95B" d="M0 9.418l1.906.121a7.022 7.022 0 016.564 6.564l.12 1.906h.828l.121-1.906a7.021 7.021 0 016.564-6.564l1.906-.12V8.59l-1.906-.121A7.022 7.022 0 019.54 1.906L9.42 0h-.83l-.12 1.906A7.022 7.022 0 011.906 8.47L0 8.59v.828z"/></svg>
                    <p>Retailers charge consumers a retail price for products.</p>
                  </li>
                </ul>
              </div>
            </div>
            
            <!-- Note block -->
            <div class="note-section">
              <div class="note-section-container">
                <div class="note-img">
                  <svg width="80" height="80" fill="none" viewBox="0 0 80 80"><circle cx="40" cy="40" r="40" fill="#F6C64E"/><path fill="#000" d="M41.4 43.2H35a1.6 1.6 0 000 3.2h6.4a1.6 1.6 0 000-3.2zm6.4-16h-1.888A4.8 4.8 0 0041.4 24h-3.2a4.8 4.8 0 00-4.512 3.2H31.8A4.8 4.8 0 0027 32v19.2a4.8 4.8 0 004.8 4.8h16a4.8 4.8 0 004.8-4.8V32a4.8 4.8 0 00-4.8-4.8zm-11.2 1.6a1.6 1.6 0 011.6-1.6h3.2a1.6 1.6 0 011.6 1.6v1.6h-6.4v-1.6zm12.8 22.4a1.6 1.6 0 01-1.6 1.6h-16a1.6 1.6 0 01-1.6-1.6V32a1.6 1.6 0 011.6-1.6h1.6V32a1.6 1.6 0 001.6 1.6h9.6a1.6 1.6 0 001.6-1.6v-1.6h1.6a1.6 1.6 0 011.6 1.6v19.2zm-4.8-14.4H35a1.6 1.6 0 000 3.2h9.6a1.6 1.6 0 000-3.2z"/></svg>
                </div>
                <p>The average retail price is set to a minimum of 1.66 times the wholesale price as a standard. This minimum standard is to cover higher advertising expenses and elevated profit margins.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Softrate Promotion Section -->
        <div class="promotion-section">
          <div class="promotion-container">
            <h2 class="promotion-heading">Streamline, simplify, and systemize your inventory management</h2>
            <div class="promotion-features">
              Inventory Control <span>|</span> Warehouse Management <span>|</span> Multichannel Selling <span>|</span> Order Management <span>|</span> End-to-end tracking <span>|</span> Mobile app
            </div>
            <div style="align-self: center; margin-top: 20px;">
              <a class="btn-mains btns" href="/signup">SIGN UP FOR FREE TRIAL - IT'S FREE</a>
            </div>
          </div>
        </div>
      </section>
      """
      
    prefix = html[:start_idx]
    suffix = html[end_idx:]
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(prefix + new_section_content + suffix)
    print('HTML replaced successfully!')

if __name__ == '__main__':
    main()
