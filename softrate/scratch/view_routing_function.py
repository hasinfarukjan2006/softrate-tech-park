def main():
    with open('static/js/app.js', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Let's find lines around document.title =
    lines = content.splitlines()
    target_idx = -1
    for i, line in enumerate(lines):
        if 'document.title =' in line:
            target_idx = i
            break
            
    if target_idx != -1:
        # Print lines from target_idx - 60 to target_idx + 10
        start = max(0, target_idx - 60)
        end = min(len(lines), target_idx + 10)
        print("=== ROUTING FUNCTION CONTEXT ===")
        for idx in range(start, end):
            print(f"{idx+1}: {lines[idx]}")

if __name__ == '__main__':
    main()
