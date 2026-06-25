import re

def main():
    with open('templates/index.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Search for all image tags
    img_tags = re.findall(r'<img[^>]*?>', content)
    print("Found img tags:")
    for tag in img_tags:
        print(tag)

if __name__ == '__main__':
    main()
