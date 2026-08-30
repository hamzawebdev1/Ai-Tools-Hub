import { parseRoute, normalizePath } from "../services/routerService";
import { buildSEOMetadata } from "../services/seoService";
import { TOOLS_DATA } from "../data/toolsData";
import { CATEGORIES_DATA } from "../data/categoriesData";
import { BLOG_POSTS_DATA } from "../data/blogData";

/**
 * Escapes HTML characters for safe injection into meta attributes.
 */
function escapeHtml(unsafe: string = ""): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Constructs clean, pre-rendered semantic HTML body content for search crawlers & initial load
 */
function renderPrerenderedBodyContent(
  routeState: any,
  tool?: any,
  category?: any,
  post?: any,
  domain: string = "https://mehzandigital.com"
): string {
  // Navigation header HTML
  const navHtml = `
    <header style="background-color: #0f172a; color: #ffffff; padding: 1rem 1.5rem; border-bottom: 1px solid #1e293b;">
      <div style="max-width: 80rem; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
        <a href="/" style="color: #ffffff; font-weight: 800; font-size: 1.25rem; text-decoration: none; display: flex; align-items: center; gap: 0.5rem;">
          <span style="color: #6366f1;">⚡</span> Mehzan Tools Hub
        </a>
        <nav style="display: flex; align-items: center; gap: 1.25rem; font-size: 0.875rem; font-weight: 600;">
          <a href="/tools" style="color: #cbd5e1; text-decoration: none;">All Tools</a>
          <a href="/categories" style="color: #cbd5e1; text-decoration: none;">Categories</a>
          <a href="/blog" style="color: #cbd5e1; text-decoration: none;">Guides &amp; Articles</a>
          <a href="/about" style="color: #cbd5e1; text-decoration: none;">About</a>
          <a href="/contact" style="color: #cbd5e1; text-decoration: none;">Contact</a>
        </nav>
      </div>
    </header>
  `;

  // Footer HTML with crawlable internal links
  const topCategories = CATEGORIES_DATA.slice(0, 6);
  const featuredTools = TOOLS_DATA.filter((t) => t.isFeatured || t.isPopular).slice(0, 8);
  const latestPosts = BLOG_POSTS_DATA.slice(0, 5);

  const footerHtml = `
    <footer style="background-color: #0f172a; color: #94a3b8; padding: 3rem 1.5rem; border-top: 1px solid #1e293b; font-size: 0.875rem; margin-top: 4rem;">
      <div style="max-width: 80rem; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 2rem;">
        <div>
          <h4 style="color: #ffffff; font-weight: 700; margin-bottom: 0.75rem;">Mehzan Tools Hub</h4>
          <p style="line-height: 1.6; margin-bottom: 1rem;">Free, privacy-focused online web utilities, PDF converters, image editors, developer formatters, and calculators executed 100% inside your browser.</p>
          <p>&copy; ${new Date().getFullYear()} Mehzan Digital. All Rights Reserved.</p>
          <p style="color: #94a3b8; font-weight: 600; margin-top: 0.25rem;">Powered by Mehzan Digital Team</p>
        </div>
        <div>
          <h4 style="color: #ffffff; font-weight: 700; margin-bottom: 0.75rem;">Tool Categories</h4>
          <ul style="list-style: none; padding: 0; margin: 0; line-height: 2;">
            ${topCategories.map((c) => `<li><a href="/category/${c.slug}" style="color: #cbd5e1; text-decoration: none;">${escapeHtml(c.name)}</a></li>`).join("\n")}
            <li><a href="/categories" style="color: #818cf8; text-decoration: none; font-weight: 600;">View All Categories &rarr;</a></li>
          </ul>
        </div>
        <div>
          <h4 style="color: #ffffff; font-weight: 700; margin-bottom: 0.75rem;">Popular Tools</h4>
          <ul style="list-style: none; padding: 0; margin: 0; line-height: 2;">
            ${featuredTools.map((t) => `<li><a href="/${t.slug}" style="color: #cbd5e1; text-decoration: none;">${escapeHtml(t.name)}</a></li>`).join("\n")}
            <li><a href="/tools" style="color: #818cf8; text-decoration: none; font-weight: 600;">View All 50+ Tools &rarr;</a></li>
          </ul>
        </div>
        <div>
          <h4 style="color: #ffffff; font-weight: 700; margin-bottom: 0.75rem;">Guides &amp; Legal</h4>
          <ul style="list-style: none; padding: 0; margin: 0; line-height: 2;">
            ${latestPosts.slice(0, 3).map((p) => `<li><a href="/blog/${p.slug}" style="color: #cbd5e1; text-decoration: none;">${escapeHtml(p.title)}</a></li>`).join("\n")}
            <li><a href="/privacy" style="color: #cbd5e1; text-decoration: none;">Privacy Policy</a> • <a href="/terms" style="color: #cbd5e1; text-decoration: none;">Terms of Service</a></li>
            <li><a href="/disclaimer" style="color: #cbd5e1; text-decoration: none;">Disclaimer</a> • <a href="/copyright" style="color: #cbd5e1; text-decoration: none;">Copyright Policy</a></li>
          </ul>
        </div>
      </div>
    </footer>
  `;

  let mainHtml = "";

  // 1. Tool Detail Page
  if (routeState.tab === "tool-detail" && tool) {
    const categoryInfo = CATEGORIES_DATA.find((c) => c.slug === tool.category || c.id === tool.category || c.name === tool.category);
    const categoryName = categoryInfo ? categoryInfo.name : tool.category;
    const categorySlug = categoryInfo ? categoryInfo.slug : "pdf-tools";

    // Related tools in same category
    const relatedTools = TOOLS_DATA.filter((t) => (t.category === tool.category || t.subcategory === tool.subcategory) && t.id !== tool.id).slice(0, 6);
    // Related articles
    const relatedArticles = BLOG_POSTS_DATA.filter((p) => p.relatedToolIds?.includes(tool.id) || p.category.toLowerCase().includes(String(tool.category).toLowerCase())).slice(0, 3);

    mainHtml = `
      <main style="max-width: 64rem; margin: 0 auto; padding: 2rem 1.5rem; font-family: system-ui, -apple-system, sans-serif;">
        <!-- Breadcrumbs -->
        <nav aria-label="Breadcrumb" style="font-size: 0.875rem; color: #64748b; margin-bottom: 1.5rem;">
          <a href="/" style="color: #6366f1; text-decoration: none;">Home</a> &gt;
          <a href="/category/${categorySlug}" style="color: #6366f1; text-decoration: none;">${escapeHtml(categoryName)}</a> &gt;
          <span style="color: #0f172a; font-weight: 600;">${escapeHtml(tool.name)}</span>
        </nav>

        <!-- Main H1 Header -->
        <header style="margin-bottom: 2rem;">
          <h1 style="font-size: 2.25rem; font-weight: 800; color: #0f172a; line-height: 1.2; margin-bottom: 0.75rem;">${escapeHtml(tool.name)}</h1>
          <p style="font-size: 1.125rem; color: #475569; line-height: 1.6;">${escapeHtml(tool.description)}</p>
        </header>

        <!-- Tool App Execution Banner Placeholder -->
        <section style="background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%); color: #ffffff; padding: 2rem; border-radius: 1rem; margin-bottom: 3rem; text-align: center;">
          <h2 style="font-size: 1.25rem; font-weight: 700; color: #a5b4fc; margin-bottom: 0.5rem;">Interactive Tool Engine Ready</h2>
          <p style="font-size: 0.95rem; color: #e0e7ff; max-width: 36rem; margin: 0 auto 1.5rem auto;">Select or drop your input files to execute ${escapeHtml(tool.name)} instantly in your browser sandbox.</p>
        </section>

        <!-- How To Use Section -->
        <section style="margin-bottom: 3rem;">
          <h2 style="font-size: 1.5rem; font-weight: 700; color: #0f172a; margin-bottom: 1rem;">How to Use ${escapeHtml(tool.name)}</h2>
          <ol style="padding-left: 1.5rem; line-height: 1.8; color: #334155; font-size: 1rem;">
            ${(tool.seoContent?.howToUseSteps || [
              `Select or drag and drop your input files or text into the ${tool.name} interface above.`,
              `Configure any optional parameters, quality settings, or formatting options.`,
              `Click the primary execution button to process your data locally in under 300 milliseconds.`,
              `Download, copy, or export your processed output file or text directly.`
            ]).map((step: string) => `<li style="margin-bottom: 0.5rem;">${escapeHtml(step)}</li>`).join("")}
          </ol>
        </section>

        <!-- Key Features Section -->
        <section style="margin-bottom: 3rem; background-color: #f8fafc; padding: 1.5rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
          <h2 style="font-size: 1.5rem; font-weight: 700; color: #0f172a; margin-bottom: 1rem;">Key Features &amp; Technical Capabilities</h2>
          <ul style="padding-left: 1.5rem; line-height: 1.8; color: #334155; font-size: 0.95rem;">
            ${(tool.seoContent?.keyFeatures || [
              "100% Private Client-Side Sandbox: Data is processed locally inside your web browser.",
              "Sub-300ms High Performance: Powered by WebAssembly and optimized JavaScript APIs.",
              "Zero Registration Required: No login, subscription, or software installation required.",
              "Universal Platform Compatibility: Works seamlessly on Chrome, Safari, Firefox, Edge, and mobile devices."
            ]).map((feat: string) => `<li style="margin-bottom: 0.5rem;">${escapeHtml(feat)}</li>`).join("")}
          </ul>
        </section>

        <!-- FAQs Section -->
        ${tool.seoContent?.faqs && tool.seoContent.faqs.length > 0 ? `
          <section style="margin-bottom: 3rem;">
            <h2 style="font-size: 1.5rem; font-weight: 700; color: #0f172a; margin-bottom: 1rem;">Frequently Asked Questions</h2>
            <div style="display: flex; flex-direction: column; gap: 1rem;">
              ${tool.seoContent.faqs.map((faq: any) => `
                <details style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 0.5rem; padding: 1rem;">
                  <summary style="font-weight: 700; color: #0f172a; cursor: pointer;">${escapeHtml(faq.question)}</summary>
                  <p style="margin-top: 0.5rem; color: #475569; line-height: 1.6; font-size: 0.95rem;">${escapeHtml(faq.answer)}</p>
                </details>
              `).join("")}
            </div>
          </section>
        ` : ""}

        <!-- Related Tools Navigation Grid -->
        <section style="margin-bottom: 3rem;">
          <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 1rem;">Related ${escapeHtml(categoryName)}</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1rem;">
            ${relatedTools.map((rt) => `
              <a href="/${rt.slug}" style="display: block; padding: 1rem; border: 1px solid #e2e8f0; border-radius: 0.5rem; text-decoration: none; background-color: #ffffff;">
                <h3 style="font-size: 1rem; font-weight: 700; color: #4f46e5; margin: 0 0 0.25rem 0;">${escapeHtml(rt.name)}</h3>
                <p style="font-size: 0.85rem; color: #64748b; margin: 0; line-height: 1.4;">${escapeHtml(rt.description)}</p>
              </a>
            `).join("")}
          </div>
        </section>

        <!-- Related Guides & Articles -->
        ${relatedArticles.length > 0 ? `
          <section style="margin-bottom: 2rem; background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 1.5rem; border-radius: 0.75rem;">
            <h2 style="font-size: 1.125rem; font-weight: 700; color: #166534; margin-bottom: 0.75rem;">Related Guides &amp; Tutorials</h2>
            <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem;">
              ${relatedArticles.map((ra) => `
                <li>
                  <a href="/blog/${ra.slug}" style="color: #15803d; font-weight: 600; text-decoration: none;">📖 ${escapeHtml(ra.title)} &rarr;</a>
                </li>
              `).join("")}
            </ul>
          </section>
        ` : ""}
      </main>
    `;
  }
  // 2. Category Detail Page
  else if (routeState.tab === "category-detail" && category) {
    const categoryTools = TOOLS_DATA.filter((t) => t.category === category.name || t.category === category.slug || t.category === category.id);

    mainHtml = `
      <main style="max-width: 64rem; margin: 0 auto; padding: 2rem 1.5rem; font-family: system-ui, -apple-system, sans-serif;">
        <nav aria-label="Breadcrumb" style="font-size: 0.875rem; color: #64748b; margin-bottom: 1.5rem;">
          <a href="/" style="color: #6366f1; text-decoration: none;">Home</a> &gt;
          <a href="/categories" style="color: #6366f1; text-decoration: none;">Categories</a> &gt;
          <span style="color: #0f172a; font-weight: 600;">${escapeHtml(category.name)}</span>
        </nav>

        <header style="margin-bottom: 2.5rem;">
          <h1 style="font-size: 2.25rem; font-weight: 800; color: #0f172a; margin-bottom: 0.75rem;">${escapeHtml(category.name)}</h1>
          <p style="font-size: 1.125rem; color: #475569; line-height: 1.6;">${escapeHtml(category.description)}</p>
        </header>

        <section style="margin-bottom: 3rem;">
          <h2 style="font-size: 1.5rem; font-weight: 700; color: #0f172a; margin-bottom: 1.25rem;">Available ${escapeHtml(category.name)} (${categoryTools.length} Tools)</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem;">
            ${categoryTools.map((t) => `
              <a href="/${t.slug}" style="display: flex; flex-direction: column; padding: 1.25rem; border: 1px solid #e2e8f0; border-radius: 0.75rem; text-decoration: none; background-color: #ffffff;">
                <h3 style="font-size: 1.125rem; font-weight: 700; color: #4f46e5; margin: 0 0 0.5rem 0;">${escapeHtml(t.name)}</h3>
                <p style="font-size: 0.875rem; color: #64748b; margin: 0; line-height: 1.5;">${escapeHtml(t.description)}</p>
              </a>
            `).join("")}
          </div>
        </section>
      </main>
    `;
  }
  // 3. Blog Post / Article Detail Page
  else if (routeState.tab === "blog-post" && post) {
    mainHtml = `
      <main style="max-width: 52rem; margin: 0 auto; padding: 2rem 1.5rem; font-family: system-ui, -apple-system, sans-serif;">
        <nav aria-label="Breadcrumb" style="font-size: 0.875rem; color: #64748b; margin-bottom: 1.5rem;">
          <a href="/" style="color: #6366f1; text-decoration: none;">Home</a> &gt;
          <a href="/blog" style="color: #6366f1; text-decoration: none;">Blog</a> &gt;
          <span style="color: #0f172a; font-weight: 600;">${escapeHtml(post.title)}</span>
        </nav>

        <article>
          <header style="margin-bottom: 2rem;">
            <div style="font-size: 0.875rem; font-weight: 700; color: #6366f1; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">${escapeHtml(post.category)}</div>
            <h1 style="font-size: 2.25rem; font-weight: 800; color: #0f172a; line-height: 1.25; margin-bottom: 1rem;">${escapeHtml(post.title)}</h1>
            <div style="display: flex; align-items: center; gap: 1rem; color: #64748b; font-size: 0.875rem;">
              <span>By <strong>${escapeHtml(post.author.name)}</strong> (${escapeHtml(post.author.role)})</span>
              <span>•</span>
              <time datetime="${post.date}">${post.date}</time>
              <span>•</span>
              <span>${post.readTime}</span>
            </div>
          </header>

          <p style="font-size: 1.125rem; font-weight: 500; color: #334155; line-height: 1.7; margin-bottom: 2rem;">${escapeHtml(post.excerpt)}</p>

          <div style="line-height: 1.8; color: #1e293b; font-size: 1.05rem;" class="prose">
            ${post.content}
          </div>

          ${post.faqs && post.faqs.length > 0 ? `
            <section style="margin-top: 3rem; padding-top: 2rem; border-top: 1px solid #e2e8f0;">
              <h2 style="font-size: 1.5rem; font-weight: 700; color: #0f172a; margin-bottom: 1rem;">Frequently Asked Questions</h2>
              ${post.faqs.map((f: any) => `
                <div style="margin-bottom: 1.25rem;">
                  <h3 style="font-size: 1.1rem; font-weight: 700; color: #0f172a; margin-bottom: 0.25rem;">${escapeHtml(f.question)}</h3>
                  <p style="color: #475569; margin: 0; font-size: 0.95rem; line-height: 1.6;">${escapeHtml(f.answer)}</p>
                </div>
              `).join("")}
            </section>
          ` : ""}
        </article>
      </main>
    `;
  }
  // 4. Privacy Policy Page
  else if (routeState.tab === "privacy" || routeState.tab === "cookie-policy") {
    mainHtml = `
      <main style="max-width: 56rem; margin: 0 auto; padding: 2.5rem 1.5rem; font-family: system-ui, -apple-system, sans-serif; line-height: 1.7; color: #334155;">
        <nav aria-label="Breadcrumb" style="font-size: 0.875rem; color: #64748b; margin-bottom: 1.5rem;">
          <a href="/" style="color: #6366f1; text-decoration: none;">Home</a> &gt;
          <span style="color: #0f172a; font-weight: 600;">Privacy Policy</span>
        </nav>

        <article>
          <header style="margin-bottom: 2.5rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 1.5rem;">
            <h1 style="font-size: 2.25rem; font-weight: 800; color: #0f172a; margin-bottom: 0.75rem;">Privacy Policy &amp; Data Protection Notice</h1>
            <p style="font-size: 0.875rem; color: #64748b;">Effective Date: August 2026 | Compliant with GDPR, CCPA/CPRA, and Google Publishing Guidelines</p>
          </header>

          <section style="margin-bottom: 2rem;">
            <h2 style="font-size: 1.35rem; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem;">1. Overview &amp; Privacy Commitment</h2>
            <p>Mehzan Digital ("we", "our", or "us") operates <strong>Mehzan Tools Hub</strong> (https://mehzandigital.com). We respect your privacy and are committed to protecting any information collected through your interaction with our online utility tools, web applications, and editorial guides. This Privacy Policy details our data collection practices, security standards, and your privacy rights.</p>
          </section>

          <section style="margin-bottom: 2rem;">
            <h2 style="font-size: 1.35rem; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem;">2. Information We Collect</h2>
            <p>We collect information only as necessary to deliver fast, functional, and secure web services:</p>
            <ul style="padding-left: 1.5rem;">
              <li><strong>Account Credentials:</strong> Optional account registration uses secure Firebase Authentication for saved favorites and settings.</li>
              <li><strong>Contact &amp; Support Messages:</strong> Inquiries sent via our contact forms or support email are logged to assist you.</li>
              <li><strong>Technical Telemetry:</strong> Standard web server logs collect IP addresses, user agents, and endpoint timestamps for security auditing and rate limiting.</li>
            </ul>
          </section>

          <section style="margin-bottom: 2rem;">
            <h2 style="font-size: 1.35rem; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem;">3. Uploaded Files &amp; Client-Side Processing</h2>
            <p>Our utility tools (PDF compressors, image converters, formatters, calculators) execute <strong>100% locally inside your browser sandbox</strong> using WebAssembly and HTML5 Canvas APIs.</p>
            <ul style="padding-left: 1.5rem;">
              <li><strong>Zero Permanent Server Storage:</strong> Uploaded documents, PDF files, images, and text inputs are never stored on remote servers.</li>
              <li><strong>Transient Memory Buffer:</strong> Data is held temporarily in RAM and cleared automatically when you close your browser tab.</li>
              <li><strong>Confidentiality Guarantee:</strong> We never inspect, index, sell, or share your document contents.</li>
            </ul>
          </section>

          <section style="margin-bottom: 2rem;">
            <h2 style="font-size: 1.35rem; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem;">4. Cookies &amp; Third-Party Advertising</h2>
            <p>We use essential functional cookies and optional Google AdSense advertising cookies:</p>
            <ul style="padding-left: 1.5rem;">
              <li><strong>Google AdSense Advertising:</strong> Google and third-party vendors use cookies (such as DoubleClick) to serve personalized ads based on previous web visits.</li>
              <li><strong>Opt-Out Options:</strong> Users can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style="color: #4f46e5;">Google Ad Settings</a> or <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" style="color: #4f46e5;">AboutAds.info</a>.</li>
            </ul>
          </section>

          <section style="margin-bottom: 2rem;">
            <h2 style="font-size: 1.35rem; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem;">5. Contact Our Privacy Officer</h2>
            <p>For any questions or privacy rights inquiries under GDPR or CCPA, please contact our compliance officer:</p>
            <p style="background-color: #f8fafc; padding: 1rem; border-radius: 0.5rem; border: 1px solid #e2e8f0; font-family: monospace;">
              <strong>Entity:</strong> Mehzan Digital - Privacy Office<br/>
              <strong>Email:</strong> <a href="mailto:privacy@mehzandigital.com" style="color: #4f46e5;">privacy@mehzandigital.com</a><br/>
              <strong>Contact Form:</strong> <a href="/contact" style="color: #4f46e5;">https://mehzandigital.com/contact</a>
            </p>
          </section>
        </article>
      </main>
    `;
  }
  // 5. About Us Page
  else if (routeState.tab === "about") {
    mainHtml = `
      <main style="max-width: 56rem; margin: 0 auto; padding: 2.5rem 1.5rem; font-family: system-ui, -apple-system, sans-serif; line-height: 1.7; color: #334155;">
        <nav aria-label="Breadcrumb" style="font-size: 0.875rem; color: #64748b; margin-bottom: 1.5rem;">
          <a href="/" style="color: #6366f1; text-decoration: none;">Home</a> &gt;
          <span style="color: #0f172a; font-weight: 600;">About Us</span>
        </nav>

        <article>
          <header style="margin-bottom: 2.5rem; text-align: center;">
            <h1 style="font-size: 2.5rem; font-weight: 800; color: #0f172a; margin-bottom: 0.75rem;">About Mehzan Digital &amp; Tools Hub</h1>
            <p style="font-size: 1.125rem; color: #475569; max-width: 38rem; margin: 0 auto;">Building free, privacy-first, web-native utility software for developers, digital marketers, students, and creators worldwide.</p>
          </header>

          <section style="margin-bottom: 2.5rem; background-color: #f8fafc; padding: 1.5rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h2 style="font-size: 1.35rem; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem;">Our Mission &amp; Core Values</h2>
            <p>Mehzan Tools Hub was established to eliminate paywalls, aggressive popups, and invasive data tracking in everyday digital tools. We believe that converting a PDF, compressing an image, formatting JSON, or calculating math formulas should be fast, private, and 100% free.</p>
          </section>

          <section style="margin-bottom: 2.5rem;">
            <h2 style="font-size: 1.35rem; font-weight: 700; color: #0f172a; margin-bottom: 1rem;">Editorial Team &amp; Engineering Leadership</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem;">
              <div style="padding: 1.25rem; border: 1px solid #e2e8f0; border-radius: 0.5rem; background: #ffffff;">
                <h3 style="font-size: 1.1rem; font-weight: 700; color: #0f172a; margin: 0 0 0.25rem 0;">Alex Rivera</h3>
                <p style="font-size: 0.85rem; color: #6366f1; font-weight: 600; margin: 0 0 0.5rem 0;">Lead Systems Engineer</p>
                <p style="font-size: 0.875rem; color: #64748b; margin: 0;">Specializes in client-side WebAssembly compilation, document sandbox security, and high-performance algorithms.</p>
              </div>
              <div style="padding: 1.25rem; border: 1px solid #e2e8f0; border-radius: 0.5rem; background: #ffffff;">
                <h3 style="font-size: 1.1rem; font-weight: 700; color: #0f172a; margin: 0 0 0.25rem 0;">Sophia Chen</h3>
                <p style="font-size: 0.85rem; color: #6366f1; font-weight: 600; margin: 0 0 0.5rem 0;">UX Architect &amp; Media Codecs Lead</p>
                <p style="font-size: 0.875rem; color: #64748b; margin: 0;">Expert in browser image optimization codecs, responsive canvas rendering, and visual accessibility.</p>
              </div>
              <div style="padding: 1.25rem; border: 1px solid #e2e8f0; border-radius: 0.5rem; background: #ffffff;">
                <h3 style="font-size: 1.1rem; font-weight: 700; color: #0f172a; margin: 0 0 0.25rem 0;">Dr. Priya Sharma</h3>
                <p style="font-size: 0.85rem; color: #6366f1; font-weight: 600; margin: 0 0 0.5rem 0;">Senior Quantitative Researcher</p>
                <p style="font-size: 0.875rem; color: #64748b; margin: 0;">Ph.D. in Applied Mathematics focusing on algorithmic precision and financial calculator models.</p>
              </div>
            </div>
          </section>

          <section style="text-align: center; margin-top: 3rem;">
            <a href="/contact" style="display: inline-block; padding: 0.75rem 1.75rem; background-color: #4f46e5; color: #ffffff; text-decoration: none; border-radius: 0.5rem; font-weight: 600;">Contact Our Team &rarr;</a>
          </section>
        </article>
      </main>
    `;
  }
  // 6. Contact Us Page
  else if (routeState.tab === "contact") {
    mainHtml = `
      <main style="max-width: 52rem; margin: 0 auto; padding: 2.5rem 1.5rem; font-family: system-ui, -apple-system, sans-serif; line-height: 1.7; color: #334155;">
        <nav aria-label="Breadcrumb" style="font-size: 0.875rem; color: #64748b; margin-bottom: 1.5rem;">
          <a href="/" style="color: #6366f1; text-decoration: none;">Home</a> &gt;
          <span style="color: #0f172a; font-weight: 600;">Contact Us</span>
        </nav>

        <article>
          <header style="margin-bottom: 2rem;">
            <h1 style="font-size: 2.25rem; font-weight: 800; color: #0f172a; margin-bottom: 0.5rem;">Contact Mehzan Tools Hub Support</h1>
            <p style="font-size: 1rem; color: #64748b;">Have a question, feedback, API partnership request, or bug report? Get in touch with our engineering team directly.</p>
          </header>

          <section style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; margin-bottom: 2.5rem;">
            <div style="padding: 1.25rem; border: 1px solid #e2e8f0; border-radius: 0.75rem; background-color: #f8fafc;">
              <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin: 0 0 0.5rem 0;">Direct Email Support</h3>
              <p style="font-size: 0.875rem; margin: 0;"><a href="mailto:contact@mehzandigital.com" style="color: #4f46e5; font-weight: 600;">contact@mehzandigital.com</a></p>
              <p style="font-size: 0.75rem; color: #64748b; margin-top: 0.25rem;">Response commitment: Within 24 hours</p>
            </div>
            <div style="padding: 1.25rem; border: 1px solid #e2e8f0; border-radius: 0.75rem; background-color: #f8fafc;">
              <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin: 0 0 0.5rem 0;">Entity Location &amp; Headquarters</h3>
              <p style="font-size: 0.875rem; margin: 0; color: #334155;">Mehzan Digital HQ<br/>Tech Hub Plaza, Silicon Sector<br/>United States</p>
            </div>
          </section>

          <section style="padding: 1.75rem; border: 1px solid #e2e8f0; border-radius: 0.75rem; background-color: #ffffff;">
            <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 1rem;">Send Us a Message</h2>
            <form action="/api/contact" method="POST" style="display: flex; flex-direction: column; gap: 1rem;">
              <div>
                <label style="font-size: 0.85rem; font-weight: 600; color: #334155; display: block; margin-bottom: 0.25rem;">Full Name *</label>
                <input type="text" name="name" required style="width: 100%; padding: 0.6rem; border: 1px solid #cbd5e1; border-radius: 0.375rem; box-sizing: border-box;" placeholder="Your Name" />
              </div>
              <div>
                <label style="font-size: 0.85rem; font-weight: 600; color: #334155; display: block; margin-bottom: 0.25rem;">Email Address *</label>
                <input type="email" name="email" required style="width: 100%; padding: 0.6rem; border: 1px solid #cbd5e1; border-radius: 0.375rem; box-sizing: border-box;" placeholder="your.email@example.com" />
              </div>
              <div>
                <label style="font-size: 0.85rem; font-weight: 600; color: #334155; display: block; margin-bottom: 0.25rem;">Subject *</label>
                <input type="text" name="subject" required style="width: 100%; padding: 0.6rem; border: 1px solid #cbd5e1; border-radius: 0.375rem; box-sizing: border-box;" placeholder="Inquiry subject" />
              </div>
              <div>
                <label style="font-size: 0.85rem; font-weight: 600; color: #334155; display: block; margin-bottom: 0.25rem;">Message *</label>
                <textarea name="message" required rows="4" style="width: 100%; padding: 0.6rem; border: 1px solid #cbd5e1; border-radius: 0.375rem; box-sizing: border-box;" placeholder="Write your message here..."></textarea>
              </div>
              <button type="submit" style="padding: 0.75rem 1.5rem; background-color: #4f46e5; color: #ffffff; border: none; border-radius: 0.375rem; font-weight: 600; cursor: pointer; width: fit-content;">Submit Inquiry</button>
            </form>
          </section>
        </article>
      </main>
    `;
  }
  // 7. Blog Listing Page
  else if (routeState.tab === "blog") {
    mainHtml = `
      <main style="max-width: 64rem; margin: 0 auto; padding: 2.5rem 1.5rem; font-family: system-ui, -apple-system, sans-serif;">
        <nav aria-label="Breadcrumb" style="font-size: 0.875rem; color: #64748b; margin-bottom: 1.5rem;">
          <a href="/" style="color: #6366f1; text-decoration: none;">Home</a> &gt;
          <span style="color: #0f172a; font-weight: 600;">Blog &amp; Tech Guides</span>
        </nav>

        <header style="margin-bottom: 3rem; text-align: center;">
          <h1 style="font-size: 2.25rem; font-weight: 800; color: #0f172a; margin-bottom: 0.75rem;">Guides, Tutorials &amp; Technical Articles</h1>
          <p style="font-size: 1.125rem; color: #475569; max-width: 38rem; margin: 0 auto;">In-depth technical guides, document optimization tips, developer tools benchmarks, and privacy tutorials authored by our engineering team.</p>
        </header>

        <section style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem;">
          ${BLOG_POSTS_DATA.map((p) => `
            <article style="border: 1px solid #e2e8f0; border-radius: 0.75rem; overflow: hidden; background-color: #ffffff; display: flex; flex-direction: column;">
              <div style="padding: 1.25rem; flex: 1; display: flex; flex-direction: column;">
                <div style="font-size: 0.75rem; font-weight: 700; color: #4f46e5; text-transform: uppercase; margin-bottom: 0.5rem;">${escapeHtml(p.category)}</div>
                <h2 style="font-size: 1.125rem; font-weight: 700; color: #0f172a; margin: 0 0 0.5rem 0; line-height: 1.3;">
                  <a href="/blog/${p.slug}" style="color: inherit; text-decoration: none;">${escapeHtml(p.title)}</a>
                </h2>
                <p style="font-size: 0.875rem; color: #64748b; margin: 0 0 1rem 0; line-height: 1.5; flex: 1;">${escapeHtml(p.excerpt)}</p>
                <div style="font-size: 0.75rem; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 0.75rem; display: flex; justify-content: space-between;">
                  <span>By ${escapeHtml(p.author.name)}</span>
                  <span>${p.readTime}</span>
                </div>
              </div>
            </article>
          `).join("")}
        </section>
      </main>
    `;
  }
  // 8. Terms, Disclaimer, Copyright
  else if (routeState.tab === "terms") {
    mainHtml = `
      <main style="max-width: 56rem; margin: 0 auto; padding: 2.5rem 1.5rem; font-family: system-ui, -apple-system, sans-serif; line-height: 1.7; color: #334155;">
        <nav aria-label="Breadcrumb" style="font-size: 0.875rem; color: #64748b; margin-bottom: 1.5rem;">
          <a href="/" style="color: #6366f1; text-decoration: none;">Home</a> &gt;
          <span style="color: #0f172a; font-weight: 600;">Terms of Service</span>
        </nav>
        <article>
          <header style="margin-bottom: 2rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 1rem;">
            <h1 style="font-size: 2.25rem; font-weight: 800; color: #0f172a;">Terms of Service &amp; User Agreement</h1>
            <p style="font-size: 0.875rem; color: #64748b;">Effective Date: August 2026</p>
          </header>
          <section style="margin-bottom: 1.5rem;">
            <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a;">1. Acceptance of Terms</h2>
            <p>By accessing Mehzan Tools Hub (https://mehzandigital.com), you agree to comply with these Terms of Service. If you disagree with any part, please discontinue using our web applications.</p>
          </section>
          <section style="margin-bottom: 1.5rem;">
            <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a;">2. Permitted Use</h2>
            <p>All online utilities, PDF converters, image tools, formatters, and calculators are provided for lawful personal and commercial use. You may not attempt to reverse engineer backend infrastructure or launch DDoS attacks against our servers.</p>
          </section>
        </article>
      </main>
    `;
  }
  else if (routeState.tab === "disclaimer") {
    mainHtml = `
      <main style="max-width: 56rem; margin: 0 auto; padding: 2.5rem 1.5rem; font-family: system-ui, -apple-system, sans-serif; line-height: 1.7; color: #334155;">
        <nav aria-label="Breadcrumb" style="font-size: 0.875rem; color: #64748b; margin-bottom: 1.5rem;">
          <a href="/" style="color: #6366f1; text-decoration: none;">Home</a> &gt;
          <span style="color: #0f172a; font-weight: 600;">Disclaimer</span>
        </nav>
        <article>
          <header style="margin-bottom: 2rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 1rem;">
            <h1 style="font-size: 2.25rem; font-weight: 800; color: #0f172a;">Website Disclaimer &amp; Tool Limitations</h1>
          </header>
          <section style="margin-bottom: 1.5rem;">
            <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a;">1. Technical Accuracy</h2>
            <p>While our algorithms and client-side conversion engines undergo rigorous testing, Mehzan Digital provides tools "as is" without implied warranties regarding uninterrupted operation or error-free outputs.</p>
          </section>
        </article>
      </main>
    `;
  }
  // 9. Categories & Tools & Default
  else if (routeState.tab === "categories") {
    mainHtml = `
      <main style="max-width: 64rem; margin: 0 auto; padding: 2.5rem 1.5rem; font-family: system-ui, -apple-system, sans-serif;">
        <header style="text-align: center; margin-bottom: 3rem;">
          <h1 style="font-size: 2.25rem; font-weight: 800; color: #0f172a;">Browse All Tool Categories</h1>
          <p style="font-size: 1.125rem; color: #475569;">Explore 50+ web-native utilities organized by function.</p>
        </header>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem;">
          ${CATEGORIES_DATA.map((c) => `
            <a href="/category/${c.slug}" style="display: block; padding: 1.25rem; border: 1px solid #e2e8f0; border-radius: 0.75rem; text-decoration: none; background-color: #ffffff;">
              <h2 style="font-size: 1.125rem; font-weight: 700; color: #4f46e5; margin: 0 0 0.5rem 0;">${escapeHtml(c.name)}</h2>
              <p style="font-size: 0.875rem; color: #64748b; margin: 0; line-height: 1.5;">${escapeHtml(c.description)}</p>
            </a>
          `).join("")}
        </div>
      </main>
    `;
  }
  else if (routeState.tab === "tools" || routeState.tab === "all-tools") {
    mainHtml = `
      <main style="max-width: 64rem; margin: 0 auto; padding: 2.5rem 1.5rem; font-family: system-ui, -apple-system, sans-serif;">
        <header style="text-align: center; margin-bottom: 3rem;">
          <h1 style="font-size: 2.25rem; font-weight: 800; color: #0f172a;">All 50+ Online Web Utilities &amp; Converters</h1>
          <p style="font-size: 1.125rem; color: #475569;">Instant browser execution without software downloads or fees.</p>
        </header>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem;">
          ${TOOLS_DATA.map((t) => `
            <a href="/${t.slug}" style="display: block; padding: 1.25rem; border: 1px solid #e2e8f0; border-radius: 0.75rem; text-decoration: none; background-color: #ffffff;">
              <h2 style="font-size: 1.125rem; font-weight: 700; color: #0f172a; margin: 0 0 0.5rem 0;">${escapeHtml(t.name)}</h2>
              <p style="font-size: 0.875rem; color: #64748b; margin: 0; line-height: 1.5;">${escapeHtml(t.description)}</p>
            </a>
          `).join("")}
        </div>
      </main>
    `;
  }
  // 10. 404 Not Found Page
  else if (routeState.tab === "404" || routeState.isNotFound) {
    mainHtml = `
      <main style="max-width: 48rem; margin: 0 auto; padding: 4rem 1.5rem; text-align: center; font-family: system-ui, -apple-system, sans-serif;">
        <nav aria-label="Breadcrumb" style="font-size: 0.875rem; color: #64748b; margin-bottom: 2rem;">
          <a href="/" style="color: #6366f1; text-decoration: none;">Home</a> &gt;
          <span style="color: #0f172a; font-weight: 600;">404 Not Found</span>
        </nav>
        <div style="font-size: 4rem; font-weight: 900; color: #4f46e5; line-height: 1; margin-bottom: 1rem;">404</div>
        <h1 style="font-size: 2.25rem; font-weight: 800; color: #0f172a; margin-bottom: 1rem;">Page Not Found</h1>
        <p style="font-size: 1.125rem; color: #475569; margin-bottom: 2.5rem; line-height: 1.6;">
          The requested tool or page could not be found. It may have been moved, renamed, or is temporarily unavailable.
        </p>
        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-bottom: 3rem;">
          <a href="/tools" style="display: inline-block; padding: 0.875rem 1.75rem; background-color: #4f46e5; color: #ffffff; font-weight: 700; border-radius: 0.5rem; text-decoration: none;">Browse All 50+ Tools</a>
          <a href="/" style="display: inline-block; padding: 0.875rem 1.75rem; background-color: #f1f5f9; color: #0f172a; font-weight: 700; border-radius: 0.5rem; text-decoration: none;">Back to Homepage</a>
        </div>
      </main>
    `;
  }
  // 11. Default / Homepage
  else {
    const featuredList = TOOLS_DATA.filter((t) => t.isFeatured || t.isPopular).slice(0, 12);

    mainHtml = `
      <main style="max-width: 64rem; margin: 0 auto; padding: 2.5rem 1.5rem; font-family: system-ui, -apple-system, sans-serif;">
        <header style="text-align: center; margin-bottom: 3.5rem;">
          <h1 style="font-size: 2.5rem; font-weight: 800; color: #0f172a; line-height: 1.2; margin-bottom: 1rem;">Mehzan Tools Hub - 50+ Free Online Web Utilities &amp; Converters</h1>
          <p style="font-size: 1.25rem; color: #475569; max-width: 42rem; margin: 0 auto; line-height: 1.6;">Access 50+ fast, 100% independent client-side PDF processors, image converters, developer formatters, and calculators.</p>
        </header>

        <section style="margin-bottom: 3.5rem;">
          <h2 style="font-size: 1.5rem; font-weight: 700; color: #0f172a; margin-bottom: 1.25rem;">Explore Tool Categories</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.25rem;">
            ${CATEGORIES_DATA.map((c) => `
              <a href="/category/${c.slug}" style="display: block; padding: 1.25rem; border: 1px solid #e2e8f0; border-radius: 0.75rem; text-decoration: none; background-color: #ffffff;">
                <h3 style="font-size: 1.125rem; font-weight: 700; color: #4f46e5; margin: 0 0 0.5rem 0;">${escapeHtml(c.name)}</h3>
                <p style="font-size: 0.875rem; color: #64748b; margin: 0; line-height: 1.5;">${escapeHtml(c.description)}</p>
              </a>
            `).join("")}
          </div>
        </section>

        <section style="margin-bottom: 3.5rem;">
          <h2 style="font-size: 1.5rem; font-weight: 700; color: #0f172a; margin-bottom: 1.25rem;">Featured Online Utilities</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem;">
            ${featuredList.map((t) => `
              <a href="/${t.slug}" style="display: block; padding: 1.25rem; border: 1px solid #e2e8f0; border-radius: 0.75rem; text-decoration: none; background-color: #ffffff;">
                <h3 style="font-size: 1.125rem; font-weight: 700; color: #0f172a; margin: 0 0 0.5rem 0;">${escapeHtml(t.name)}</h3>
                <p style="font-size: 0.875rem; color: #64748b; margin: 0; line-height: 1.5;">${escapeHtml(t.description)}</p>
              </a>
            `).join("")}
          </div>
        </section>

        <section style="margin-bottom: 3rem;">
          <h2 style="font-size: 1.5rem; font-weight: 700; color: #0f172a; margin-bottom: 1.25rem;">Latest Guides &amp; Tutorials</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem;">
            ${BLOG_POSTS_DATA.slice(0, 4).map((p) => `
              <a href="/blog/${p.slug}" style="display: block; padding: 1.25rem; border: 1px solid #e2e8f0; border-radius: 0.75rem; text-decoration: none; background-color: #ffffff;">
                <h3 style="font-size: 1rem; font-weight: 700; color: #1e1b4b; margin: 0 0 0.5rem 0;">${escapeHtml(p.title)}</h3>
                <p style="font-size: 0.85rem; color: #64748b; margin: 0; line-height: 1.5;">${escapeHtml(p.excerpt)}</p>
              </a>
            `).join("")}
          </div>
        </section>
      </main>
    `;
  }

  return `${navHtml}${mainHtml}${footerHtml}`;
}

/**
 * Injects pre-rendered SEO metadata, Open Graph, Canonical tags, JSON-LD schemas,
 * AND pre-rendered semantic HTML body directly into the index.html template string.
 */
export function injectSEOMetadataIntoHTML(
  htmlTemplate: string,
  reqPath: string,
  reqQuery: string,
  reqHost: string,
  reqProto: string = "https"
): string {
  try {
    const routeState = parseRoute(reqPath, reqQuery);

    // Resolve matching entities
    const tool = routeState.toolSlug
      ? TOOLS_DATA.find((t) => t.slug === routeState.toolSlug || t.id === routeState.toolSlug)
      : undefined;

    const category = routeState.categorySlug
      ? CATEGORIES_DATA.find((c) => c.slug === routeState.categorySlug || c.id === routeState.categorySlug)
      : undefined;

    const post = routeState.postSlug
      ? BLOG_POSTS_DATA.find((p) => p.slug === routeState.postSlug)
      : undefined;

    // Check if page is private/admin or 404
    const isPrivate =
      routeState.tab === "admin" ||
      routeState.tab === "dashboard" ||
      routeState.tab === "login" ||
      routeState.tab === "register" ||
      routeState.tab === "forgot-password" ||
      routeState.tab === "history" ||
      routeState.tab === "favorites" ||
      routeState.tab === "404" ||
      routeState.isNotFound;

    const metadata = buildSEOMetadata(routeState.tab, {
      tool,
      category,
      post,
      searchQuery: routeState.searchQuery,
    });

    if (isPrivate) {
      metadata.noIndex = true;
    }

    // Determine clean canonical URL
    const cleanPath = normalizePath(reqPath);
    const domain = reqHost
      ? `${reqProto}://${reqHost.replace(/^www\./i, "")}`
      : "https://mehzandigital.com";

    const canonicalUrl = cleanPath === "/" ? `${domain}/` : `${domain}${cleanPath}`;
    const ogImage = metadata.ogImage.startsWith("http")
      ? metadata.ogImage
      : `${domain}${metadata.ogImage.startsWith("/") ? metadata.ogImage : `/${metadata.ogImage}`}`;

    // Construct Head Elements
    let headInjects = "";

    // 1. Title
    headInjects += `    <title>${escapeHtml(metadata.title)}</title>\n`;

    // 2. Meta Description
    headInjects += `    <meta name="description" content="${escapeHtml(metadata.description)}" />\n`;

    // 3. Meta Robots
    const robotsContent = metadata.noIndex
      ? "noindex, nofollow"
      : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
    headInjects += `    <!-- DEBUG: routeTab=${routeState.tab}, isPrivate=${isPrivate}, noIndex=${metadata.noIndex} -->\n    <meta name="robots" content="${robotsContent}" />\n`;

    // 4. Canonical Tag & CSP Meta
    headInjects += `    <link rel="canonical" href="${canonicalUrl}" />\n`;
    headInjects += `    <meta http-equiv="Content-Security-Policy" content="default-src 'self' https: data: blob: 'unsafe-inline' 'unsafe-eval'; frame-ancestors *;" />\n`;

    // 5. Open Graph Meta Tags
    headInjects += `    <meta property="og:title" content="${escapeHtml(metadata.title)}" />\n`;
    headInjects += `    <meta property="og:description" content="${escapeHtml(metadata.description)}" />\n`;
    headInjects += `    <meta property="og:type" content="${metadata.ogType || "website"}" />\n`;
    headInjects += `    <meta property="og:url" content="${canonicalUrl}" />\n`;
    headInjects += `    <meta property="og:image" content="${escapeHtml(ogImage)}" />\n`;
    headInjects += `    <meta property="og:site_name" content="Mehzan Tools Hub" />\n`;

    if (metadata.publishedDate) {
      headInjects += `    <meta property="article:published_time" content="${new Date(metadata.publishedDate).toISOString()}" />\n`;
    }

    // 6. Twitter Card Tags
    headInjects += `    <meta name="twitter:card" content="summary_large_image" />\n`;
    headInjects += `    <meta name="twitter:title" content="${escapeHtml(metadata.title)}" />\n`;
    headInjects += `    <meta name="twitter:description" content="${escapeHtml(metadata.description)}" />\n`;
    headInjects += `    <meta name="twitter:image" content="${escapeHtml(ogImage)}" />\n`;
    headInjects += `    <meta name="twitter:site" content="@mehzandigital" />\n`;

    // 7. JSON-LD Schemas
    if (metadata.schemas && metadata.schemas.length > 0) {
      const validSchemas = metadata.schemas.filter(Boolean);
      const schemaJson = JSON.stringify(
        validSchemas.length === 1
          ? validSchemas[0]
          : { "@context": "https://schema.org", "@graph": validSchemas }
      );
      headInjects += `    <script id="seo-jsonld-schemas" type="application/ld+json">${schemaJson}</script>\n`;
    }

    // Replace existing title or inject into <head>
    let result = htmlTemplate;

    // Remove existing title, meta description, robots, canonical, OG, and Twitter tags from index.html template
    result = result.replace(/<title>[\s\S]*?<\/title>/gi, "");
    result = result.replace(/<meta\s+name="description"[\s\S]*?>/gi, "");
    result = result.replace(/<meta\s+name="robots"[\s\S]*?>/gi, "");
    result = result.replace(/<link\s+rel="canonical"[\s\S]*?>/gi, "");
    result = result.replace(/<meta\s+property="og:[\s\S]*?>/gi, "");
    result = result.replace(/<meta\s+name="twitter:[\s\S]*?>/gi, "");
    result = result.replace(/<script\s+id="seo-jsonld-schemas"[\s\S]*?<\/script>/gi, "");

    // Inject head tags
    if (result.includes("</head>")) {
      result = result.replace("</head>", `${headInjects}  </head>`);
    } else {
      result = headInjects + result;
    }

    // Pre-rendered visible HTML body content for crawlers and users
    const isInternalAuthTab =
      routeState.tab === "admin" ||
      routeState.tab === "dashboard" ||
      routeState.tab === "login" ||
      routeState.tab === "register" ||
      routeState.tab === "forgot-password" ||
      routeState.tab === "history" ||
      routeState.tab === "favorites";

    if (!isInternalAuthTab) {
      const bodyHtml = renderPrerenderedBodyContent(routeState, tool, category, post, domain);
      if (result.includes('<div id="root"></div>')) {
        result = result.replace('<div id="root"></div>', `<div id="root">${bodyHtml}</div>`);
      } else if (result.includes('<div id="root">')) {
        result = result.replace('<div id="root">', `<div id="root">${bodyHtml}`);
      }
    }

    return result;
  } catch (err) {
    console.error("⚠️ Error in injectSEOMetadataIntoHTML:", err);
    return htmlTemplate;
  }
}
