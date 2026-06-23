with open("static/js/app.js", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add isSkuRoute variable declaration
target_var = 'const isPurchaseOrderRoute = (route === "po" || route === "purchase-order-generator" || (window.location.pathname === "/purchase-order-generator" && !shouldGoToMainPage));'
insertion_var = '\n    const isSkuRoute = (route === "sku" || route === "sku-generator" || (window.location.pathname === "/sku-generator" && !shouldGoToMainPage));'

if target_var in content:
    content = content.replace(target_var, target_var + insertion_var)
    print("Injected isSkuRoute variable declaration.")
else:
    print("Error: target_var not found!")

# 2. Add pushState block
target_push = '    } else if (isPurchaseOrderRoute) {\n      if (updateHistory) {\n        if (window.location.pathname !== "/purchase-order-generator") {\n          window.history.pushState({ route: "po" }, "", "/purchase-order-generator");\n        }\n      }\n    } else if (isReorderRoute) {'
insertion_push = '    } else if (isSkuRoute) {\n      if (updateHistory) {\n        if (window.location.pathname !== "/sku-generator") {\n          window.history.pushState({ route: "sku" }, "", "/sku-generator");\n        }\n      }\n    } else if (isPurchaseOrderRoute) {\n      if (updateHistory) {\n        if (window.location.pathname !== "/purchase-order-generator") {\n          window.history.pushState({ route: "po" }, "", "/purchase-order-generator");\n        }\n      }\n    } else if (isReorderRoute) {'

if target_push in content:
    content = content.replace(target_push, insertion_push)
    print("Injected pushState block.")
else:
    print("Error: target_push not found!")

# 3. Add active link highlighter
target_highlight = '      } else if (isPurchaseOrderRoute && (route === "po" || route === "purchase-order-generator")) {\n        const poLink = Array.from(links).find(l => l.getAttribute("data-route") === "po" || l.getAttribute("data-route") === "purchase-order-generator");\n        if (poLink) poLink.classList.add("active");\n      } else if (isReorderRoute && (route === "reorder" || route === "reorder-point")) {'
insertion_highlight = '      } else if (isSkuRoute && (route === "sku" || route === "sku-generator")) {\n        const skuLink = Array.from(links).find(l => l.getAttribute("data-route") === "sku" || l.getAttribute("data-route") === "sku-generator");\n        if (skuLink) skuLink.classList.add("active");\n      } else if (isPurchaseOrderRoute && (route === "po" || route === "purchase-order-generator")) {\n        const poLink = Array.from(links).find(l => l.getAttribute("data-route") === "po" || l.getAttribute("data-route") === "purchase-order-generator");\n        if (poLink) poLink.classList.add("active");\n      } else if (isReorderRoute && (route === "reorder" || route === "reorder-point")) {'

if target_highlight in content:
    content = content.replace(target_highlight, insertion_highlight)
    print("Injected active link highlight block.")
else:
    print("Error: target_highlight not found!")

# 4. Add header page title
target_title = '    } else if (isPurchaseOrderRoute) {\n      labelText = "Purchase Order Generator";\n    }'
insertion_title = '    } else if (isSkuRoute) {\n      labelText = "SKU Generator";\n    } else if (isPurchaseOrderRoute) {\n      labelText = "Purchase Order Generator";\n    }'

if target_title in content:
    content = content.replace(target_title, insertion_title)
    print("Injected header page title block.")
else:
    print("Error: target_title not found!")

# 5. Add section hide declarations
target_hide = '    const purchaseOrderSection = document.getElementById("purchase-order-section");'
insertion_hide = '\n    const skuSection = document.getElementById("sku-section");'

if target_hide in content:
    content = content.replace(target_hide, target_hide + insertion_hide)
    print("Injected section hide variables.")
else:
    print("Error: target_hide not found!")

# Add show hide call:
target_hide_call = '    if (purchaseOrderSection) purchaseOrderSection.classList.add("hide");'
insertion_hide_call = '\n    if (skuSection) skuSection.classList.add("hide");'

if target_hide_call in content:
    content = content.replace(target_hide_call, target_hide_call + insertion_hide_call)
    print("Injected section hide class additions.")
else:
    print("Error: target_hide_call not found!")

# 6. Add section show declaration
target_show = '    } else if (isPurchaseOrderRoute && (route === "po" || route === "purchase-order-generator")) {\n      if (purchaseOrderSection) purchaseOrderSection.classList.remove("hide");\n      if (purchaseOrderSection) purchaseOrderSection.scrollIntoView({ behavior: "smooth" });\n      document.dispatchEvent(new CustomEvent("purchaseOrderRouteLoaded"));'
insertion_show = '    } else if (isSkuRoute && (route === "sku" || route === "sku-generator")) {\n      if (skuSection) skuSection.classList.remove("hide");\n      if (skuSection) skuSection.scrollIntoView({ behavior: "smooth" });\n      document.dispatchEvent(new CustomEvent("skuRouteLoaded"));\n    } else if (isPurchaseOrderRoute && (route === "po" || route === "purchase-order-generator")) {\n      if (purchaseOrderSection) purchaseOrderSection.classList.remove("hide");\n      if (purchaseOrderSection) purchaseOrderSection.scrollIntoView({ behavior: "smooth" });\n      document.dispatchEvent(new CustomEvent("purchaseOrderRouteLoaded"));'

if target_show in content:
    content = content.replace(target_show, insertion_show)
    print("Injected section show block.")
else:
    print("Error: target_show not found!")

# 7. Add popstate and restore state path checks
target_popstate = '    } else if (window.location.pathname === "/purchase-order-generator") {\n      showRoute("po", false);\n    } else {'
insertion_popstate = '    } else if (window.location.pathname === "/purchase-order-generator") {\n      showRoute("po", false);\n    } else if (window.location.pathname === "/sku-generator") {\n      showRoute("sku", false);\n    } else {'

if target_popstate in content:
    content = content.replace(target_popstate, insertion_popstate)
    print("Injected popstate route check.")
else:
    print("Error: target_popstate not found!")

# Add restore state checks:
target_restore = '  const isPurchaseOrderPath = (window.location.pathname === "/purchase-order-generator");'
insertion_restore = '\n  const isSkuPath = (window.location.pathname === "/sku-generator");'

if target_restore in content:
    content = content.replace(target_restore, target_restore + insertion_restore)
    print("Injected restore state path check.")
else:
    print("Error: target_restore not found!")

# Add restore state block:
target_restore_block = '  } else if (isPurchaseOrderPath) {\n    showRoute("po", false);\n  } else {'
insertion_restore_block = '  } else if (isPurchaseOrderPath) {\n    showRoute("po", false);\n  } else if (isSkuPath) {\n    showRoute("sku", false);\n  } else {'

if target_restore_block in content:
    content = content.replace(target_restore_block, insertion_restore_block)
    print("Injected restore state logic block.")
else:
    print("Error: target_restore_block not found!")

# Add 'sku' to initialRoute check:
target_initial_route = 'savedRoute === "inventory-turnover" || savedRoute === "po"'
replacement_initial_route = 'savedRoute === "inventory-turnover" || savedRoute === "po" || savedRoute === "sku"'

if target_initial_route in content:
    content = content.replace(target_initial_route, replacement_initial_route)
    print("Updated initialRoute condition.")
else:
    print("Error: target_initial_route not found!")

with open("static/js/app.js", "w", encoding="utf-8") as f:
    f.write(content)

print("Finished modifying static/js/app.js!")
