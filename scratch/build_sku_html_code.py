html_content = """<!-- Section: Free SKU Generator -->
<section id="sku-section" class="content-section mt-8 hide">
  <div class="rop-background-pattern"></div>
  
  <div class="rop-page-container">
    <!-- 1. Hero Section -->
    <div class="rop-hero">
      <h1>Generate Product <span class="rop-highlight">SKUs Instantly</span></h1>
      <p class="rop-hero-desc">
        Generate unique Stock Keeping Units (SKU) for products automatically. Create organized, searchable, and scalable product codes for inventory management.
      </p>
    </div>

    <!-- 2. Two-Column Calculator & Action Layout -->
    <div class="main-div row" style="padding-top: 20px;">
      <!-- Left Column: Generator Form -->
      <div class="col-md-8 lft-main-div">
        <div class="po-generator" style="min-height: auto; padding: 30px; margin-bottom: 30px; border-radius: 8px;">
          <h3 style="font-weight: 600; margin-bottom: 20px; color: #1e293b; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px;">SKU Generator Form</h3>
          
          <div class="row">
            <!-- Product Name -->
            <div class="col-md-6" style="margin-bottom: 15px;">
              <label style="display: block; font-weight: 600; margin-bottom: 5px; color: #475569;">Product Name <span style="color: #dc2626;">*</span></label>
              <input type="text" id="skuProductName" class="adr" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 4px; padding: 8px;" placeholder="Ex: Wireless Mouse" onfocus="PurchaseOrderGenerator.strikeInfo('compAddInfo',true)" onblur="PurchaseOrderGenerator.strikeInfo('compAddInfo',false)">
              <small id="skuProductName_err" style="color: #dc2626; display: none;">Product Name is required</small>
            </div>
            <!-- Product Category -->
            <div class="col-md-6" style="margin-bottom: 15px;">
              <label style="display: block; font-weight: 600; margin-bottom: 5px; color: #475569;">Product Category <span style="color: #dc2626;">*</span></label>
              <select id="skuProductCategory" class="adr" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 4px; padding: 8px; background: white;" onfocus="PurchaseOrderGenerator.strikeInfo('clientAddInfo',true)" onblur="PurchaseOrderGenerator.strikeInfo('clientAddInfo',false)">
                <option value="">Select Category</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Furniture">Furniture</option>
                <option value="Grocery">Grocery</option>
                <option value="Beauty">Beauty</option>
                <option value="Sports">Sports</option>
              </select>
              <small id="skuProductCategory_err" style="color: #dc2626; display: none;">Product Category is required</small>
            </div>
          </div>

          <div class="row">
            <!-- Brand -->
            <div class="col-md-6" style="margin-bottom: 15px;">
              <label style="display: block; font-weight: 600; margin-bottom: 5px; color: #475569;">Brand <span style="color: #dc2626;">*</span></label>
              <input type="text" id="skuBrand" class="adr" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 4px; padding: 8px;" placeholder="Ex: Softrate" onfocus="PurchaseOrderGenerator.strikeInfo('poNumberInfo',true)" onblur="PurchaseOrderGenerator.strikeInfo('poNumberInfo',false)">
              <small id="skuBrand_err" style="color: #dc2626; display: none;">Brand is required</small>
            </div>
            <!-- Color -->
            <div class="col-md-6" style="margin-bottom: 15px;">
              <label style="display: block; font-weight: 600; margin-bottom: 5px; color: #475569;">Color</label>
              <input type="text" id="skuColor" class="adr" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 4px; padding: 8px;" placeholder="Ex: Black" onfocus="PurchaseOrderGenerator.strikeInfo('itemInfo',true)" onblur="PurchaseOrderGenerator.strikeInfo('itemInfo',false)">
            </div>
          </div>

          <div class="row">
            <!-- Size -->
            <div class="col-md-6" style="margin-bottom: 15px;">
              <label style="display: block; font-weight: 600; margin-bottom: 5px; color: #475569;">Size</label>
              <select id="skuSize" class="adr" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 4px; padding: 8px; background: white;">
                <option value="">Select Size</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>
            </div>
            <!-- Variant -->
            <div class="col-md-6" style="margin-bottom: 15px;">
              <label style="display: block; font-weight: 600; margin-bottom: 5px; color: #475569;">Variant</label>
              <input type="text" id="skuVariant" class="adr" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 4px; padding: 8px;" placeholder="Ex: Premium">
            </div>
          </div>

          <!-- Divider -->
          <div style="margin: 25px 0; border-bottom: 1px solid #f1f5f9;"></div>

          <!-- SKU Format Options -->
          <h4 style="font-weight: 600; margin-bottom: 15px; color: #1e293b;">Choose SKU Format</h4>
          <div class="row" style="margin-bottom: 20px;">
            <div class="col-md-12">
              <!-- Format 1 -->
              <label class="sku-format-label" style="display: flex; align-items: center; padding: 10px; border: 1px solid #e2e8f0; border-radius: 4px; margin-bottom: 10px; cursor: pointer;">
                <input type="radio" name="skuFormat" value="F1" checked style="margin-right: 12px; width: 18px; height: 18px;">
                <div>
                  <span style="font-weight: 600; color: #334155;">Format 1:</span> <code style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px; color: #0f172a;">CAT-BRAND-COLOR-SIZE-001</code>
                </div>
              </label>

              <!-- Format 2 -->
              <label class="sku-format-label" style="display: flex; align-items: center; padding: 10px; border: 1px solid #e2e8f0; border-radius: 4px; margin-bottom: 10px; cursor: pointer;">
                <input type="radio" name="skuFormat" value="F2" style="margin-right: 12px; width: 18px; height: 18px;">
                <div>
                  <span style="font-weight: 600; color: #334155;">Format 2:</span> <code style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px; color: #0f172a;">BRAND-PRODUCT-001</code>
                </div>
              </label>

              <!-- Format 3 (Custom Format) -->
              <label class="sku-format-label" style="display: flex; align-items: center; padding: 10px; border: 1px solid #e2e8f0; border-radius: 4px; cursor: pointer;">
                <input type="radio" name="skuFormat" value="F3" style="margin-right: 12px; width: 18px; height: 18px;">
                <div>
                  <span style="font-weight: 600; color: #334155;">Format 3:</span> <code style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px; color: #0f172a;">CUSTOM FORMAT</code>
                </div>
              </label>
              
              <!-- Custom Format Fields (shows only when Custom is chosen) -->
              <div id="customSkuBuilder" style="margin-top: 15px; padding: 15px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; display: none;">
                <label style="display: block; font-weight: 600; margin-bottom: 5px; color: #475569;">Define Custom Pattern</label>
                <input type="text" id="skuCustomPattern" class="adr" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 4px; padding: 8px; font-family: monospace;" placeholder="Ex: {BRAND}-{CAT}-{COLOR}-{NUM}" value="{BRAND}-{CAT}-{COLOR}-{NUM}">
                <small style="color: #64748b; margin-top: 4px; display: block;">Placeholders: {PROD}, {CAT}, {BRAND}, {COLOR}, {SIZE}, {VAR}, {NUM}</small>
              </div>
            </div>
          </div>

          <!-- Separator & Abbreviation Configuration -->
          <div class="row" style="margin-bottom: 25px;">
            <div class="col-md-6">
              <label style="display: block; font-weight: 600; margin-bottom: 5px; color: #475569;">Separator</label>
              <select id="skuSeparator" class="adr" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 4px; padding: 8px; background: white;">
                <option value="-">- (Hyphen)</option>
                <option value="_">_ (Underscore)</option>
                <option value="/">/ (Slash)</option>
                <option value=":">: (Colon)</option>
              </select>
            </div>
            <div class="col-md-6">
              <label style="display: block; font-weight: 600; margin-bottom: 5px; color: #475569;">Abbreviation Length</label>
              <select id="skuAttrLen" class="adr" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 4px; padding: 8px; background: white;">
                <option value="3">3 Characters</option>
                <option value="4">4 Characters</option>
                <option value="2">2 Characters</option>
              </select>
            </div>
          </div>

          <!-- Generate Button -->
          <div style="text-align: center; margin-bottom: 25px;">
            <button id="btnGenerateSku" class="btn-main btn" style="padding: 12px 35px; font-weight: 600; letter-spacing: 0.5px; border: none; cursor: pointer; display: inline-block;">Generate SKU</button>
          </div>

          <!-- Result Section (Shown after generation) -->
          <div id="skuResultContainer" style="display: none; padding: 20px; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 6px; text-align: center; margin-bottom: 20px;">
            <h4 style="font-weight: 600; color: #065f46; margin-bottom: 10px;">Generated SKU</h4>
            <div id="skuResultOutput" style="font-size: 24px; font-weight: bold; font-family: monospace; color: #047857; letter-spacing: 1px; margin-bottom: 15px;"></div>
            <div>
              <button id="btnCopySku" class="btn-main btn" style="background-color: #059669; padding: 8px 20px; font-size: 14px; margin-right: 10px; border: none;">Copy SKU</button>
              <button id="btnResetSku" class="btn-plain" style="display: inline-block; width: auto; padding: 7px 20px; font-size: 14px; margin-top: 0; vertical-align: middle;">Generate Another</button>
            </div>
          </div>

          <!-- Bulk SKU Generator Section -->
          <div style="margin: 30px 0; border-bottom: 2px solid #f1f5f9;"></div>
          <h3 style="font-weight: 600; margin-bottom: 20px; color: #1e293b;">Generate Multiple SKUs (Bulk)</h3>
          
          <div class="row">
            <!-- Starting Number -->
            <div class="col-md-6" style="margin-bottom: 15px;">
              <label style="display: block; font-weight: 600; margin-bottom: 5px; color: #475569;">Starting Number</label>
              <input type="number" id="skuBulkStartNum" class="adr" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 4px; padding: 8px;" value="1" min="1">
            </div>
            <!-- Quantity -->
            <div class="col-md-6" style="margin-bottom: 15px;">
              <label style="display: block; font-weight: 600; margin-bottom: 5px; color: #475569;">Quantity</label>
              <input type="number" id="skuBulkQty" class="adr" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 4px; padding: 8px;" value="10" min="1" max="100">
            </div>
          </div>

          <!-- Bulk Generate Button -->
          <div style="text-align: center; margin-bottom: 20px;">
            <button id="btnGenerateBulkSku" class="btn-plain" style="display: inline-block; width: auto; padding: 10px 30px; font-weight: 600; cursor: pointer;">Generate Multiple SKUs</button>
          </div>

          <!-- Bulk Output Box -->
          <div id="skuBulkResultContainer" style="display: none; margin-top: 20px;">
            <label style="display: block; font-weight: 600; margin-bottom: 5px; color: #475569;">Bulk Generated SKUs</label>
            <textarea id="skuBulkOutput" class="note" style="width: 100%; height: 150px; font-family: monospace; font-size: 14px; padding: 10px; background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 4px;" readonly></textarea>
            <div style="text-align: right; margin-top: 8px;">
              <button id="btnCopyBulkSku" class="btn-main btn" style="background-color: #0284c7; padding: 6px 15px; font-size: 13px; border: none;">Copy All SKUs</button>
            </div>
          </div>

        </div>
      </div>

      <!-- Right Column: Sidebar Checklist / Info -->
      <div class="col-md-4 rgt-main-div">
        <div class="actions-block" style="margin-top: 1px;">
          <h3 style="font-weight: 300; margin-bottom: 3px;">Dynamic SKU Checklist</h3>
          <p style="font-weight: 200; font-size: 12px; margin-bottom: 25px;">Follow the steps to construct product codes.</p>
          <p class="rhs-info" id="compAddInfo">✓ Enter Product Name</p>
          <p class="rhs-info" id="clientAddInfo">✓ Select Product Category</p>
          <p class="rhs-info" id="poNumberInfo">✓ Specify Brand Name</p>
          <p class="rhs-info" id="itemInfo">✓ Add optional details (Color, Size)</p>
        </div>

        <div class="actions-block">
          <h3>What is an SKU?</h3>
          <div class="select-action-txt" style="line-height: 1.6; margin-bottom: 15px; color: #475569;">
            A Stock Keeping Unit (SKU) is a unique identifier used by businesses to track products and inventory. It represents item traits like type, color, size, and variant.
          </div>
          <h4 style="font-weight: 600; margin-bottom: 10px; color: #1e293b;">Benefits:</h4>
          <ul style="list-style: disc; padding-left: 20px; float: none; width: 100%;">
            <li style="float: none; margin-bottom: 8px; color: #475569;">Faster inventory tracking</li>
            <li style="float: none; margin-bottom: 8px; color: #475569;">Better product organization</li>
            <li style="float: none; margin-bottom: 8px; color: #475569;">Easier stock level management</li>
            <li style="float: none; margin-bottom: 8px; color: #475569;">Improved operational reporting</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 3. Informational & FAQ accordion section -->
    <div class="faq-section" style="padding-top: 60px; margin-top: 40px; border-top: 1px solid #e2e8f0;">
      <div class="faq">
        <div class="faq-lft-main-div col-md-10 col-md-offset-1" style="width: 100%; margin-left: 0;">
          <h1 style="font-size: 28px; font-weight: 600; text-align: center; margin-bottom: 40px;">Frequently Asked Questions</h1>
          
          <div class="faq-container">
            <div class="faq-qa">
              <h2>What is a Stock Keeping Unit (SKU)?</h2>
              <div>
                <p>An SKU is an internal product code composed of letters and numbers that identifies a product's specific characteristics (like brand, model, size, color). Unlike UPC barcodes, SKUs are unique to your business and are designed to be easily read by humans.</p>
              </div>
            </div>
            
            <div class="faq-qa">
              <h2>How should I structure my SKU codes?</h2>
              <div>
                <p>A good SKU structure flows from broad to specific characteristics. For example, start with the category abbreviation (e.g. ELEC), followed by brand (SOF), product attributes (BLK-M), and finally a sequential item number (001). This forms ELEC-SOF-BLK-M-001.</p>
              </div>
            </div>

            <div class="faq-qa">
              <h2>What are the best practices for SKU management?</h2>
              <div>
                <p>1. Keep codes short (typically 8-12 characters).<br>
                2. Avoid using spaces, slashes, or special symbols that can break database queries (hyphens or underscores are best).<br>
                3. Do not start SKUs with zero, as spreadsheet software may delete it.<br>
                4. Avoid using letters that look like numbers (such as O, I, or L).</p>
              </div>
            </div>

            <div class="faq-qa">
              <h2>Are SKUs and UPC barcodes the same?</h2>
              <div>
                <p>No. SKUs are internal codes unique to each business, while UPC (Universal Product Code) barcodes are external, standardized 12-digit numbers issued by GS1 that remain identical across all retail stores globally.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
"""

with open("scratch/sku_html_final.html", "w", encoding="utf-8") as f:
    f.write(html_content)

print("Saved SKU HTML to scratch/sku_html_final.html")
