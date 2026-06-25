from html.parser import HTMLParser

class DivTracker(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack = []
        self.errors = []
        
    def handle_starttag(self, tag, attrs):
        if tag == 'div':
            self.stack.append(self.getpos())
            
    def handle_endtag(self, tag):
        if tag == 'div':
            if self.stack:
                self.stack.pop()
            else:
                self.errors.append(("Unopened closing div", self.getpos()))

def main():
    with open('templates/index.html', 'r', encoding='utf-8') as f:
        html_content = f.read()
        
    tracker = DivTracker()
    tracker.feed(html_content)
    
    print(f"Parsing complete. Unclosed open divs left in stack: {len(tracker.stack)}")
    for pos in tracker.stack:
        print(f"  Unclosed <div> starts at line {pos[0]}, col {pos[1]}")
        
    print(f"Unopened closing divs found: {len(tracker.errors)}")
    for err in tracker.errors:
        print(f"  {err[0]} at line {err[1][0]}, col {err[1][1]}")

if __name__ == '__main__':
    main()
