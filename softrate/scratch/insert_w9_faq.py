import os

def main():
    workspace_dir = r"c:\Users\dellc\OneDrive\Desktop\softrate\softrate"
    parent_dir = r"c:\Users\dellc\OneDrive\Desktop\softrate"
    
    paths = [
        os.path.join(workspace_dir, "templates", "index.html"),
        os.path.join(parent_dir, "templates", "index.html"),
        os.path.join(parent_dir, "scratch", "w9_html.html")
    ]

    faq_html = """        <!-- ===== FAQ SECTION ===== -->
        <div class="w9-faq-section" style="margin-top: 50px; margin-bottom: 30px;">
          <h2 style="font-size: 1.85rem !important; font-weight: 800 !important; text-align: center; margin-bottom: 2rem; color: var(--text-main);">Frequently Asked Questions</h2>
          <div class="w9-faq-accordion">
            <!-- Q1 -->
            <div class="w9-faq-item">
              <button type="button" class="w9-faq-trigger">
                <span>Can I use Softrate to manage my business's income and expenses?</span>
                <i data-lucide="chevron-down"></i>
              </button>
              <div class="w9-faq-content">
                <p>Yes! Softrate provides comprehensive tools to track your income and expenses, manage accounts, generate financial statements, and keep your business finances organized.</p>
              </div>
            </div>
            <!-- Q2 -->
            <div class="w9-faq-item">
              <button type="button" class="w9-faq-trigger">
                <span>Can I track the time spent on a job and bill my client using Softrate?</span>
                <i data-lucide="chevron-down"></i>
              </button>
              <div class="w9-faq-content">
                <p>Yes! Softrate lets you log billable hours for projects, track time spent on specific tasks, and seamlessly convert logged time into invoices for your clients.</p>
              </div>
            </div>
            <!-- Q3 -->
            <div class="w9-faq-item">
              <button type="button" class="w9-faq-trigger">
                <span>Can I track 1099 payments using Softrate?</span>
                <i data-lucide="chevron-down"></i>
              </button>
              <div class="w9-faq-content">
                <p>Yes, Softrate makes it easy to track payments made to independent contractors, collect W-9 details, and generate the necessary 1099 forms for tax filing.</p>
              </div>
            </div>
            <!-- Q4 -->
            <div class="w9-faq-item">
              <button type="button" class="w9-faq-trigger">
                <span>Can Softrate help me determine the profitability of a project?</span>
                <i data-lucide="chevron-down"></i>
              </button>
              <div class="w9-faq-content">
                <p>Yes! Softrate provides project-level reporting and analytics, allowing you to track project expenses, billable hours, and revenue to calculate net profitability.</p>
              </div>
            </div>
            <!-- Q5 -->
            <div class="w9-faq-item">
              <button type="button" class="w9-faq-trigger">
                <span>Is there a free plan available with Softrate?</span>
                <i data-lucide="chevron-down"></i>
              </button>
              <div class="w9-faq-content">
                <p>Yes, Softrate offers a free trial plan with basic features, and you can upgrade to premium tiers for advanced automation, payroll calculations, and multi-user access.</p>
              </div>
            </div>
          </div>
        </div>"""

    for path in paths:
        if not os.path.exists(path):
            continue
        print(f"Processing: {path}...")
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()

        if "w9-faq-section" in content:
            print("W-9 FAQ Section already exists in this file!")
            continue

        # Find the end of w9-section. Since w9-section contains several </section> tags inside it (none actually, let's verify if there are any nested sections).
        # Actually, let's look for the main </section> tag closing #w9-section.
        # We know w9-section starts with `<section id="w9-section"` and ends with its closing `</section>`.
        # Let's search from the beginning of `<section id="w9-section"` to its end.
        section_start_str = 'id="w9-section"'
        pos = content.find(section_start_str)
        if pos == -1:
            print("Could not find w9-section start!")
            continue
        
        # Locate the closing </section> tag of this section
        section_depth = 0
        section_end_pos = -1
        # Let's read lines or look at positions. It is safer to split by lines
        lines = content.splitlines()
        w9_start_idx = -1
        for idx, line in enumerate(lines):
            if 'id="w9-section"' in line or "id='w9-section'" in line:
                w9_start_idx = idx
                break
                
        if w9_start_idx == -1:
            print("Could not find line for w9-section!")
            continue
            
        for idx in range(w9_start_idx, len(lines)):
            line = lines[idx]
            if '<section' in line:
                section_depth += 1
            if '</section>' in line:
                section_depth -= 1
                if section_depth == 0:
                    section_end_pos = idx
                    break
                    
        if section_end_pos == -1:
            print("Could not find closing section tag!")
            continue
            
        print(f"Found closing section tag at line {section_end_pos + 1}")
        
        # Insert FAQ HTML right before the closing </section> tag
        new_lines = lines[:section_end_pos] + ["", ""] + faq_html.splitlines() + lines[section_end_pos:]
        
        with open(path, "w", encoding="utf-8") as f:
            f.write("\n".join(new_lines))
        print("Successfully inserted W-9 FAQ section!")

if __name__ == "__main__":
    main()
