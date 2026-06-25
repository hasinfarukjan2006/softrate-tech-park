def find_forecaster():
    with open('templates/index.html', 'r', encoding='utf-8') as f:
        lines = f.readlines()
    for i, line in enumerate(lines):
        if 'id="forecaster-section"' in line:
            print(f"forecaster-section starts at line {i+1}")
            for offset in range(-2, 18):
                print(f"{i+1+offset}: {lines[i+offset].strip()}")

if __name__ == '__main__':
    find_forecaster()
