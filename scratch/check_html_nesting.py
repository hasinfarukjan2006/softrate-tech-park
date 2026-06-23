from html.parser import HTMLParser

class NestingParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack = []
        self.errors = []

    def handle_starttag(self, tag, attrs):
        if tag in ["div", "section", "table", "tbody", "tr", "td"]:
            self.stack.append((tag, self.getpos()))

    def handle_endtag(self, tag):
        if tag in ["div", "section", "table", "tbody", "tr", "td"]:
            if not self.stack:
                self.errors.append(f"Unexpected end tag </{tag}> at line {self.getpos()[0]}")
            else:
                start_tag, pos = self.stack.pop()
                if start_tag != tag:
                    self.errors.append(f"Mismatched end tag </{tag}> at line {self.getpos()[0]} (expected </{start_tag}> matching start tag at line {pos[0]})")

    def print_status(self, start_line):
        if self.stack:
            print("Unclosed tags remaining on stack:")
            for tag, pos in self.stack:
                print(f"  <{tag}> at line {pos[0] + start_line}")
        else:
            print("No unclosed tags!")
        if self.errors:
            print("Errors found:")
            for err in self.errors:
                print(f"  {err}")
        else:
            print("No nesting errors!")

with open("templates/index.html", "r", encoding="utf-8") as f:
    lines = f.readlines()

# We only extract lines for financial-report-section
# Line 5844 to 6371 (0-indexed lines 5843 to 6370)
section_lines = lines[5843:6380]
section_html = "".join(section_lines)

parser = NestingParser()
parser.feed(section_html)
parser.print_status(5844)
