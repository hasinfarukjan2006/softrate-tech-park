#!/usr/bin/env python3
"""Deeper investigation of the 4 flagged pages + backend checks."""
import os, re

# Check actual file names
print("=== FILE NAME INVESTIGATION ===\n")

# GST
print("1. GST Calculator:")
for d in ['static/css','static/js','../dist/css','../dist/js']:
    files = [f for f in os.listdir(d) if 'gst' in f.lower()]
    print(f"   {d}: {files if files else 'NONE'}")

# Check GST section ID in HTML
html = open('../dist/index.html','r',encoding='utf-8').read()
for sid in ['gst-section','gst-calculator-section','gst_section']:
    print(f'   id="{sid}": {sid in html}')
# Check how GST is actually routed
m = re.search(r'route === "gst".*?(?=\} else)', open('../dist/js/app.js','r',encoding='utf-8').read(), re.DOTALL)
if m: print(f'   Dist route handler: {m.group()[:200]}')

# Expense
print("\n2. Expense Report Generator:")
for d in ['static/css','static/js','../dist/css','../dist/js']:
    files = [f for f in os.listdir(d) if 'expense' in f.lower()]
    print(f"   {d}: {files if files else 'NONE'}")

# Per Diem
print("\n3. Per Diem Calculator:")
for d in ['static/css','static/js','../dist/css','../dist/js']:
    files = [f for f in os.listdir(d) if 'per' in f.lower() or 'diem' in f.lower()]
    print(f"   {d}: {files if files else 'NONE'}")

# Wholesale
print("\n4. Wholesale Price Calculator:")
for d in ['static/css','static/js','../dist/css','../dist/js']:
    files = [f for f in os.listdir(d) if 'wholesale' in f.lower()]
    print(f"   {d}: {files if files else 'NONE'}")

# Backend - check actual function names
print("\n=== BACKEND FUNCTION CHECK ===")
app = open('app.py','r',encoding='utf-8').read()
funcs = re.findall(r'def (\w+)\(', app)
print(f"Total Flask functions: {len(funcs)}")
routes = re.findall(r'@app\.route\("([^"]+)"\)', app)
print(f"Total Flask routes: {len(routes)}")
# Check specific patterns
for keyword in ['gst','expense','payslip','hra','nps','flask','Flask','MongoClient']:
    count = app.lower().count(keyword.lower())
    print(f"  '{keyword}': {count} occurrences")

# Check Flask(__name__)
print(f"\n  'app = Flask' present: {'app = Flask' in app}")
print(f"  'create_app' present: {'create_app' in app}")
