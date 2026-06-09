import re

def analyze(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Failed to read {filepath}: {e}")
        return

    # Extract the cityDatabase object
    match = re.search(r'const cityDatabase = ({.*?});', content, re.DOTALL)
    if not match:
        print(f"Could not find cityDatabase in {filepath}")
        return
        
    db_str = match.group(1)
    keys = re.findall(r'^\s*"([^"]+)"\s*:\s*\{', db_str, re.MULTILINE)
    print(f"{filepath} contains {len(keys)} cities.")

analyze('static/js/per_diem.js')
analyze('dist/js/per_diem.js')
analyze('softrate/static/js/per_diem.js')
