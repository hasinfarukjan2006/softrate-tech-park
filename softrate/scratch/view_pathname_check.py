def main():
    with open('static/js/app.js', 'r', encoding='utf-8') as f:
        lines = f.readlines()
    for i in range(145, 185):
        print(f"{i+1}: {lines[i]}", end="")

if __name__ == '__main__':
    main()
