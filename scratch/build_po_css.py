import re

def process_css():
    with open("scratch/po_extracted.css", "r", encoding="utf-8") as f:
        raw_css = f.read()

    # 1. Replace image paths
    raw_css = raw_css.replace('url("/inventory/images/po-generator.png")', 'url("../images/po-generator.png")')
    raw_css = raw_css.replace('url("/inventory/images/arrow-sprite-1x.png")', 'url("../images/arrow-sprite-1x.png")')
    raw_css = raw_css.replace('url("/inventory/images/arrow-sprite-2x.png")', 'url("../images/arrow-sprite-2x.png")')
    
    # 2. Scope the CSS rules to #purchase-order-section
    # We can split by media queries first, or do a general regex replacement.
    # To keep it simple, we can write a parser that handles media queries.
    
    # Let's write a parser
    output = []
    
    # Add custom grid layout styles for #purchase-order-section first
    grid_css = """
/* Scoped Grid Styles for Purchase Order Section */
#purchase-order-section {
  background-color: #f8fafc;
  padding: 2rem 0;
}
#purchase-order-section .row {
  display: flex;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;
}
#purchase-order-section .col-md-8 {
  position: relative;
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
}
#purchase-order-section .col-md-4 {
  position: relative;
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
}
#purchase-order-section .col-md-9 {
  position: relative;
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
}
#purchase-order-section .col-md-offset-1 {
  margin-left: 8.33333333%;
}

@media (min-width: 992px) {
  #purchase-order-section .col-md-8 {
    flex: 0 0 66.666667%;
    max-width: 66.666667%;
  }
  #purchase-order-section .col-md-4 {
    flex: 0 0 33.333333%;
    max-width: 33.333333%;
  }
  #purchase-order-section .col-md-9 {
    flex: 0 0 75%;
    max-width: 75%;
  }
}

/* Hide navigation, headers, footers when printing */
@media print {
  body * {
    visibility: hidden;
  }
  #purchase-order-section, #purchase-order-section * {
    visibility: visible;
  }
  #purchase-order-section {
    position: absolute;
    left: 0;
    top: 0;
    width: 100% !important;
    background: #fff !important;
  }
  #purchase-order-section .rgt-main-div,
  #purchase-order-section .mbl-actions-block,
  #purchase-order-section .top-two-band,
  #purchase-order-section .free-tool-navbar,
  #purchase-order-section .close-btn,
  #purchase-order-section .mbl-po-link,
  #purchase-order-section .faq-section,
  #purchase-order-section .erp-promotion-banner,
  #purchase-order-section .check-zoho-inventory,
  #purchase-order-section .signupnow-buttons,
  #purchase-order-section .del,
  #purchase-order-section .add,
  #purchase-order-section .dele-icon,
  #purchase-order-section .closeicon,
  #purchase-order-section .powered-by-link {
    display: none !important;
  }
  #purchase-order-section .po-generator {
    box-shadow: none !important;
    border: none !important;
    padding: 0 !important;
    margin: 0 !important;
    width: 100% !important;
  }
  #purchase-order-section .lft-main-div {
    width: 100% !important;
    flex: 0 0 100% !important;
    max-width: 100% !important;
  }
  #purchase-order-section input,
  #purchase-order-section textarea {
    border: none !important;
    background: transparent !important;
    box-shadow: none !important;
    outline: none !important;
  }
}
"""
    output.append(grid_css)
    
    # We want to scope selector rules in raw_css.
    # To do this safely, we will find selectors and wrap them. Since po_extracted.css is small,
    # let's replace some key selectors to scope them under #purchase-order-section.
    
    # Let's prefix each style block.
    # We can split by } and parse rules.
    blocks = raw_css.split("}")
    for block in blocks:
        if not block.strip():
            continue
        # Split selector and declarations
        parts = block.split("{")
        if len(parts) != 2:
            output.append(block + "}")
            continue
        
        selectors_str, declarations = parts
        
        # If it's a media query start, e.g. @media ...
        if "@media" in selectors_str:
            output.append(selectors_str + "{" + declarations + "}")
            continue
            
        # Split selectors by comma
        selectors = selectors_str.split(",")
        scoped_selectors = []
        for sel in selectors:
            sel_trimmed = sel.strip()
            if not sel_trimmed:
                continue
            # If selector starts with body, html or is a general element, replace or prefix
            if sel_trimmed.startswith("body"):
                scoped_selectors.append("#purchase-order-section")
            elif sel_trimmed.startswith("html"):
                scoped_selectors.append("#purchase-order-section")
            else:
                scoped_selectors.append(f"#purchase-order-section {sel_trimmed}")
                
        output.append(", ".join(scoped_selectors) + "{" + declarations + "}")
        
    final_css = "\n".join(output)
    
    with open("static/css/purchase_order.css", "w", encoding="utf-8") as f:
        f.write(final_css)
        
    print("Processed and saved CSS to static/css/purchase_order.css")

if __name__ == "__main__":
    process_css()
