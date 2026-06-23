import re

def process_css():
    with open("scratch/sku_extracted_styles.css", "r", encoding="utf-8") as f:
        raw_css = f.read()

    # 1. Custom grid and spacing overrides scoped to #sku-section
    custom_styles = """
/* Scoped Grid and Spacing Styles for SKU Section */
#sku-section {
  background-color: #f8fafc;
  padding: 2rem 0;
}
#sku-section .row {
  display: flex;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;
}
#sku-section .col-md-6 {
  position: relative;
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
}
#sku-section .col-md-8 {
  position: relative;
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
}
#sku-section .col-md-4 {
  position: relative;
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
}
#sku-section .col-md-9 {
  position: relative;
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
}
#sku-section .col-md-offset-1 {
  margin-left: 8.33333333%;
}

@media (min-width: 992px) {
  #sku-section .col-md-6 {
    flex: 0 0 50%;
    max-width: 50%;
  }
  #sku-section .col-md-8 {
    flex: 0 0 66.666667%;
    max-width: 66.666667%;
  }
  #sku-section .col-md-4 {
    flex: 0 0 33.333333%;
    max-width: 33.333333%;
  }
  #sku-section .col-md-9 {
    flex: 0 0 75%;
    max-width: 75%;
  }
}

#sku-section input,
#sku-section select {
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
}

#sku-section input:focus,
#sku-section select:focus {
  border-color: #fa343e !important;
  box-shadow: 0 0 0 2px rgba(250, 52, 62, 0.1) !important;
}

#sku-section .sku-format-label {
  transition: all 0.2s ease;
}

#sku-section .sku-format-label:hover {
  background-color: #f8fafc;
  border-color: #cbd5e1 !important;
}

#sku-section .sku-format-label input[type="radio"]:checked + div {
  color: #fa343e;
}
"""
    output = [custom_styles]
    
    # Let's scope the rules in raw_css.
    blocks = raw_css.split("}")
    for block in blocks:
        if not block.strip():
            continue
        parts = block.split("{")
        if len(parts) != 2:
            output.append(block + "}")
            continue
        
        selectors_str, declarations = parts
        
        if "@media" in selectors_str or "@keyframes" in selectors_str:
            output.append(selectors_str + "{" + declarations + "}")
            continue
            
        selectors = selectors_str.split(",")
        scoped_selectors = []
        for sel in selectors:
            sel_trimmed = sel.strip()
            if not sel_trimmed:
                continue
            if sel_trimmed.startswith("body") or sel_trimmed.startswith("html"):
                scoped_selectors.append("#sku-section")
            else:
                scoped_selectors.append(f"#sku-section {sel_trimmed}")
                
        output.append(", ".join(scoped_selectors) + "{" + declarations + "}")
        
    final_css = "\n".join(output)
    
    with open("static/css/sku.css", "w", encoding="utf-8") as f:
        f.write(final_css)
        
    print("Processed and saved SKU CSS to static/css/sku.css")

if __name__ == "__main__":
    process_css()
