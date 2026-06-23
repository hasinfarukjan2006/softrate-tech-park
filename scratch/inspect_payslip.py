with open('templates/index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()
start = -1
for idx, line in enumerate(lines):
    if 'id="payslip-section"' in line or 'id=\'payslip-section\'' in line:
        start = idx
        break
if start != -1:
    print(f"Found payslip-section starting at line {start+1}")
    for j in range(start, min(start+40, len(lines))):
        print(f"{j+1}: {lines[j]}", end='')
else:
    print("Could not find payslip-section")
