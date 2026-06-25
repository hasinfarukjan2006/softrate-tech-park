def main():
    with open('app.py', 'r', encoding='utf-8') as f:
        lines = f.readlines()
    for i, line in enumerate(lines):
        if 'render_template("index.html")' in line:
            start = max(0, i-6)
            print(f"=== Line {i+1} ===")
            for j in range(start, i+1):
                print(f"{j+1}: {lines[j]}", end="")

if __name__ == '__main__':
    main()
