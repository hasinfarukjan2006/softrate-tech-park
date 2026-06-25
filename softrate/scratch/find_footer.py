def main():
    with open('templates/index.html', 'r', encoding='utf-8') as f:
        for i, line in enumerate(f):
            if '<footer' in line.lower() or 'class="footer"' in line.lower() or 'footer-logo' in line.lower():
                print(f"Line {i+1}: {line.strip()}")

if __name__ == '__main__':
    main()
