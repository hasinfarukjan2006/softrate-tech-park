from html.parser import HTMLParser

class SectionDivTracker(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack = []
        self.current_section = None
        self.section_line = None
        
    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        if tag == 'section':
            self.current_section = attrs_dict.get('id', 'unknown')
            self.section_line = self.getpos()[0]
            print(f"ENTER <section id='{self.current_section}'> at line {self.section_line}. Current open divs: {len(self.stack)}")
        elif tag == 'div':
            self.stack.append(self.getpos())
            
    def handle_endtag(self, tag):
        if tag == 'section':
            print(f"EXIT </section id='{self.current_section}'> at line {self.getpos()[0]}. Current open divs: {len(self.stack)}")
            self.current_section = None
        elif tag == 'div':
            if self.stack:
                self.stack.pop()
            else:
                print(f"WARNING: Extra closing </div> at line {self.getpos()[0]}")

def main():
    with open('templates/index.html', 'r', encoding='utf-8') as f:
        html_content = f.read()
        
    tracker = SectionDivTracker()
    tracker.feed(html_content)
    print(f"\nFinal stack size (unclosed divs): {len(tracker.stack)}")

if __name__ == '__main__':
    main()
