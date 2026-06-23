with open("static/js/app.js", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add isPurchaseOrderRoute in showRoute variables definition
target_var = 'const isReorderRoute = (route === "reorder" || route === "reorder-point" || (window.location.pathname === "/reorder-point" && !shouldGoToMainPage));'
insertion_var = '\n    const isPurchaseOrderRoute = (route === "po" || route === "purchase-order-generator" || (window.location.pathname === "/purchase-order-generator" && !shouldGoToMainPage));'

if target_var in content:
    content = content.replace(target_var, target_var + insertion_var)
    print("Injected isPurchaseOrderRoute variable declaration.")
else:
    print("Error: target_var not found!")

# 2. Add pushState block for purchase-order
target_push = '    } else if (isReorderRoute) {\n      if (updateHistory) {\n        if (window.location.pathname !== "/reorder-point") {\n          window.history.pushState({ route: "reorder" }, "", "/reorder-point");\n        }\n      }\n    } else {'
insertion_push = '    } else if (isPurchaseOrderRoute) {\n      if (updateHistory) {\n        if (window.location.pathname !== "/purchase-order-generator") {\n          window.history.pushState({ route: "po" }, "", "/purchase-order-generator");\n        }\n      }\n    } else if (isReorderRoute) {\n      if (updateHistory) {\n        if (window.location.pathname !== "/reorder-point") {\n          window.history.pushState({ route: "reorder" }, "", "/reorder-point");\n        }\n      }\n    } else {'

if target_push in content:
    content = content.replace(target_push, insertion_push)
    print("Injected pushState block.")
else:
    # Try finding with different indent or format
    print("Error: target_push not found!")

# 3. Add sidebar active link highlighter block
target_highlight = '      } else if (isReorderRoute && (route === "reorder" || route === "reorder-point")) {\n        const reorderLink = Array.from(links).find(l => l.getAttribute("data-route") === "reorder" || l.getAttribute("data-route") === "reorder-point");\n        if (reorderLink) reorderLink.classList.add("active");\n      } else {'
insertion_highlight = '      } else if (isPurchaseOrderRoute && (route === "po" || route === "purchase-order-generator")) {\n        const poLink = Array.from(links).find(l => l.getAttribute("data-route") === "po" || l.getAttribute("data-route") === "purchase-order-generator");\n        if (poLink) poLink.classList.add("active");\n      } else if (isReorderRoute && (route === "reorder" || route === "reorder-point")) {\n        const reorderLink = Array.from(links).find(l => l.getAttribute("data-route") === "reorder" || l.getAttribute("data-route") === "reorder-point");\n        if (reorderLink) reorderLink.classList.add("active");\n      } else {'

if target_highlight in content:
    content = content.replace(target_highlight, insertion_highlight)
    print("Injected active link highlight block.")
else:
    print("Error: target_highlight not found!")

# 4. Add header page title block
target_title = '    } else if (isReorderRoute) {\n      labelText = "Reorder Point Calculator";\n    }'
insertion_title = '    } else if (isPurchaseOrderRoute) {\n      labelText = "Purchase Order Generator";\n    } else if (isReorderRoute) {\n      labelText = "Reorder Point Calculator";\n    }'

if target_title in content:
    content = content.replace(target_title, insertion_title)
    print("Injected header page title block.")
else:
    print("Error: target_title not found!")

# 5. Add section hide declarations
target_hide = '    const reorderSection = document.getElementById("reorder-section");'
insertion_hide = '\n    const purchaseOrderSection = document.getElementById("purchase-order-section");'

if target_hide in content:
    content = content.replace(target_hide, target_hide + insertion_hide)
    print("Injected section hide variables.")
else:
    print("Error: target_hide not found!")

# Add the actual hide call:
target_hide_call = '    if (reorderSection) reorderSection.classList.add("hide");'
insertion_hide_call = '\n    if (purchaseOrderSection) purchaseOrderSection.classList.add("hide");'

if target_hide_call in content:
    content = content.replace(target_hide_call, target_hide_call + insertion_hide_call)
    print("Injected section hide class additions.")
else:
    print("Error: target_hide_call not found!")

# 6. Add section show declaration
target_show = '    } else if (isReorderRoute && (route === "reorder" || route === "reorder-point")) {\n      if (reorderSection) reorderSection.classList.remove("hide");\n      if (reorderSection) reorderSection.scrollIntoView({ behavior: "smooth" });\n      document.dispatchEvent(new CustomEvent("reorderRouteLoaded"));'
insertion_show = '    } else if (isPurchaseOrderRoute && (route === "po" || route === "purchase-order-generator")) {\n      if (purchaseOrderSection) purchaseOrderSection.classList.remove("hide");\n      if (purchaseOrderSection) purchaseOrderSection.scrollIntoView({ behavior: "smooth" });\n      document.dispatchEvent(new CustomEvent("purchaseOrderRouteLoaded"));\n    } else if (isReorderRoute && (route === "reorder" || route === "reorder-point")) {\n      if (reorderSection) reorderSection.classList.remove("hide");\n      if (reorderSection) reorderSection.scrollIntoView({ behavior: "smooth" });\n      document.dispatchEvent(new CustomEvent("reorderRouteLoaded"));'

if target_show in content:
    content = content.replace(target_show, insertion_show)
    print("Injected section show block.")
else:
    print("Error: target_show not found!")

# 7. Add popstate and restore state path checks
target_popstate = '    } else if (window.location.pathname === "/inventory-turnover") {\n      showRoute("inventory-turnover", false);\n    } else {'
insertion_popstate = '    } else if (window.location.pathname === "/inventory-turnover") {\n      showRoute("inventory-turnover", false);\n    } else if (window.location.pathname === "/purchase-order-generator") {\n      showRoute("po", false);\n    } else {'

if target_popstate in content:
    content = content.replace(target_popstate, insertion_popstate)
    print("Injected popstate route check.")
else:
    print("Error: target_popstate not found!")

# Add restore state checks:
target_restore = '  const isInventoryTurnoverPath = (window.location.pathname === "/inventory-turnover");'
insertion_restore = '\n  const isPurchaseOrderPath = (window.location.pathname === "/purchase-order-generator");'

if target_restore in content:
    content = content.replace(target_restore, target_restore + insertion_restore)
    print("Injected restore state path check.")
else:
    print("Error: target_restore not found!")

# Add restore state block:
target_restore_block = '  } else if (isInventoryTurnoverPath) {\n    showRoute("inventory-turnover", false);\n  } else {'
insertion_restore_block = '  } else if (isInventoryTurnoverPath) {\n    showRoute("inventory-turnover", false);\n  } else if (isPurchaseOrderPath) {\n    showRoute("po", false);\n  } else {'

if target_restore_block in content:
    content = content.replace(target_restore_block, insertion_restore_block)
    print("Injected restore state logic block.")
else:
    print("Error: target_restore_block not found!")

# Add 'po' to initialRoute check:
target_initial_route = 'savedRoute === "inventory-turnover"'
replacement_initial_route = 'savedRoute === "inventory-turnover" || savedRoute === "po"'

if target_initial_route in content:
    content = content.replace(target_initial_route, replacement_initial_route)
    print("Updated initialRoute condition.")
else:
    print("Error: target_initial_route not found!")

with open("static/js/app.js", "w", encoding="utf-8") as f:
    f.write(content)

print("Finished modifying static/js/app.js!")
