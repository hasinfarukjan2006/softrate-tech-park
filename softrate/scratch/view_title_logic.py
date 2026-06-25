def main():
    with open('static/js/app.js', 'r', encoding='utf-8') as f:
        lines = f.readlines()
    for i, line in enumerate(lines):
        if 'document.title' in line:
            start = max(0, i-10)
            end = min(len(lines), i+15)
            print(f"=== Line {i+1} ===")
            for j in range(start, end):
                print(f"{j+1}: {lines[j]}", end="")

if __name__ == '__main__':
    main()
