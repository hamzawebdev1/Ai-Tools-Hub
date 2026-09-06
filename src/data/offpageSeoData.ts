export interface OutreachTemplate {
  platform: "Reddit" | "Quora" | "Medium" | "GitHub" | "Directory & Resource Pages" | "Developer Communities" | "Educational Resources" | "Web Dev Blogs" | "Productivity Blogs" | "PDF & Doc Resources" | "Open-Source Tool Lists";
  title: string;
  targetAudience: string;
  guidelines: string;
  content: string;
}

export interface CompetitorLinkGapItem {
  competitor: string;
  targetTopic: string;
  backlinkType: string;
  sourceRelevance: string;
  outreachAngle: string;
  targetMehzanUrl: string;
}

export interface CommunityPostItem {
  platform: string;
  targetCommunity: string;
  topicTitle: string;
  valueFirstAnswer: string;
  contextualMehzanReference: string;
}

export const OUTREACH_TEMPLATES: OutreachTemplate[] = [
  {
    platform: "Educational Resources",
    title: "University & Student Productivity Resource Outreach",
    targetAudience: "University tech resource pages, academic writing hubs, student tool portals",
    guidelines: "Polite, value-first pitch offering a free, registration-free PDF compression tool recommendation for students submitting thesis files under canvas portal MB caps.",
    content: `Subject: Free privacy-first PDF utility recommendation for [University / Department Name] students

Hi [Name/Editorial Team],

I was reviewing your student resource guide at [Target URL] and noticed your helpful section on academic productivity software.

I wanted to share Mehzan Tools Hub (https://www.mehzandigital.com/en/pdf-compress), a 100% free online PDF compressor engineered specifically for students needing to reduce assignment and thesis file sizes before portal submission.

Why it is uniquely suited for students:
- Privacy-First: PDF processing happens 100% inside the browser using WebAssembly. Sensitive research papers and academic records are never uploaded to remote servers.
- Zero Registration Barriers: Students can compress or merge documents instantly without creating accounts or entering credit cards.
- No Daily Quotas: Unlimited document conversions without artificial hourly caps.

If you believe this would be a helpful resource for [University / Department Name] students, feel free to include it on your guide.

Warm regards,
Alex Rivera
Lead Systems Engineer, Mehzan Tools Hub`
  },
  {
    platform: "Developer Communities",
    title: "Developer Community & Web Engineering Blog Pitch",
    targetAudience: "Frontend engineering blogs, Hashnode, Dev.to curators, JavaScript newsletters",
    guidelines: "Technical, peer-to-peer pitch highlighting client-side WebAssembly architecture and zero-latency browser debugging.",
    content: `Subject: Client-side developer tools suite (JSON validator & CSV converter running on Wasm)

Hi [Name],

I enjoyed your recent article on [Article Topic / Blog Name], particularly your insights on web performance and client-side computing.

We recently launched an open developer utilities hub on Mehzan Digital (https://www.mehzandigital.com/en/json-validator) featuring browser-native JSON validators, formatters, and CSV converters.

Unlike traditional web API tools that proxy payload strings to backend Linux daemons, our tools run 100% in local browser memory via WebAssembly and client JavaScript. This eliminates server network latency and guarantees total API payload confidentiality.

If you are putting together a roundup of browser-based developer tools or frontend productivity utilities, we would be honored if you checked it out.

Best regards,
Marcus Vance
Senior Full-Stack Engineer, Mehzan Tools Hub`
  },
  {
    platform: "Productivity Blogs",
    title: "Productivity & Remote Work Resource Pitch",
    targetAudience: "Freelancer portals, remote work blogs, Notion/Productivity newsletters",
    guidelines: "Focus on workflow efficiency, zero paywalls, and eliminating account registration friction for remote freelancers.",
    content: `Subject: Free PDF merger utility for remote teams & freelancers on [Blog Name]

Hi [Name],

I've been following [Blog Name] for remote work productivity tips and loved your recent list on [Recent Post Title].

If you are updating your list of essential free tools for remote freelancers and digital nomads, I wanted to introduce Mehzan PDF Merger (https://www.mehzandigital.com/en/pdf-merge).

It allows users to merge contracts, client invoices, and project reports directly in their browser without signing up, installing desktop software, or paying subscription fees.

Key highlights for your readers:
- Instant drag-and-drop page reordering
- Zero file size restrictions and no daily usage caps
- 100% private execution inside browser memory

Thanks for curating such great content for the remote community!

Best regards,
Elena Rostova
Productivity & UX Lead, Mehzan Tools Hub`
  },
  {
    platform: "PDF & Doc Resources",
    title: "PDF & Document Management Directory Pitch",
    targetAudience: "Legaltech portals, document management blogs, office administrative guides",
    guidelines: "Highlight strict compliance (GDPR/HIPAA compatibility via client-side processing) and zero server uploads.",
    content: `Subject: Private, serverless PDF tools suite for [Resource Portal Name]

Hi [Name],

While reading your document management guide at [Target URL], I noticed your discussion on cloud document security and file conversion risks.

We developed Mehzan PDF Tools (https://www.mehzandigital.com/category/pdf-tools) to solve the security concerns associated with uploading confidential legal contracts and tax documents to remote cloud servers.

Our tools use WebAssembly to perform PDF merging, compression, page extraction, and password encryption directly inside the client's web browser. The original document binary never travels over the network.

If you maintain a list of privacy-conscious document utilities, feel free to review our suite for inclusion.

Sincerely,
Alex Rivera
Lead Systems Engineer, Mehzan Tools Hub`
  },
  {
    platform: "Open-Source Tool Lists",
    title: "GitHub Awesome Lists & Privacy Tool Directory Submission",
    targetAudience: "Awesome-web-tools, awesome-privacy, open-source web utility curators",
    guidelines: "Concise, Markdown-formatted entry adhering strictly to GitHub repository pull request contribution guidelines.",
    content: `### Privacy-First Web Utilities & Developer Tools

- [Mehzan Tools Hub](https://www.mehzandigital.com/) - A client-side collection of 330+ free web utilities, including WebAssembly-powered PDF processors (merge, compress, split), developer data tools (JSON validator, CSV converter), image editors, and technical SEO generators. Operates 100% in browser memory with zero server file uploads.

#### Suggested PR Placement:
- \`awesome-developer-tools\` -> Browser-Native Utilities
- \`awesome-pdf-tools\` -> Private Online Processors
- \`awesome-privacy\` -> Serverless Document Utilities`
  },
  {
    platform: "Web Dev Blogs",
    title: "Web Development & Technical SEO Resource Pitch",
    targetAudience: "Webmaster blogs, SEO tool lists, web design resource portals",
    guidelines: "Pitch technical SEO tools (Robots.txt, XML Sitemap, UTM Builder) as fast, clean, ad-light utilities for webmasters.",
    content: `Subject: Technical SEO utilities for webmasters on [Website Name]

Hi [Name],

I came across your web development guide on [Target URL] and really appreciated your practical approach to technical site audits.

I wanted to share our suite of free technical SEO utilities on Mehzan Digital (https://www.mehzandigital.com/category/seo-tools), including our Robots.txt Generator, XML Sitemap Builder, and GA4 UTM Tracking Builder.

All tools are lightweight, instantly responsive, and require no account registration.

If you think your webmaster readers would benefit from these free generators, we'd love to be listed on your resource page.

Best regards,
Elena Rostova
SEO Architect, Mehzan Tools Hub`
  },
  {
    platform: "Reddit",
    title: "How We Built 330+ Client-Side Web Utilities That Run 100% in Browser Memory",
    targetAudience: "r/WebDev, r/Programming, r/Privacy, r/DeveloperTools",
    guidelines: "Discussion-first post focusing on WebAssembly, browser sandboxing, performance tradeoffs, and privacy.",
    content: `When handling sensitive financial records, API keys, or private document scans, uploading files to remote third-party cloud servers creates unnecessary security and compliance risks.

Over the past few months, we engineered a suite of web tools that run entirely client-side using WebAssembly, PDF-Lib, and HTML5 Canvas APIs inside browser memory:

1. Client-Side PDF Engine: PDF merging, splitting, and compression happen directly in the browser thread using WebAssembly. No byte ever touches a backend server.
2. Local Image & OCR Pipeline: Image compression, background isolation, and text extraction (OCR) execute locally in the client DOM.
3. Fast JSON & Dev Formatting: Real-time syntax validation, minification, and conversion without latency or network overhead.

We made the platform completely free with zero registration barriers or file size limits: https://www.mehzandigital.com/

What are your thoughts on browser memory constraints when processing large 100MB+ documents client-side vs traditional cloud conversion pipelines?`
  }
];

export const COMMUNITY_POSTS_DATA: CommunityPostItem[] = [
  {
    platform: "Reddit (r/webdev)",
    targetCommunity: "r/webdev & r/privacy",
    topicTitle: "Best approach for merging sensitive PDF files without uploading to third-party servers?",
    valueFirstAnswer: `If you have sensitive documents (e.g. tax returns, bank statements, client NDAs), uploading them to cloud converters like Smallpdf or iLovePDF means sending raw document bytes over HTTP to remote servers where they are stored temporarily.

The safest alternative is to use **client-side WebAssembly tools**. Modern browsers can execute WebAssembly binaries directly in client memory.

When you use a browser-native tool:
1. JavaScript loads the WebAssembly binary into your browser's local sandbox.
2. The PDF-Lib or PDF.js engine parses the binary PDF stream locally.
3. Merging and page reordering happen entirely within your local device RAM.
4. The merged PDF file is generated locally and downloaded directly to your hard drive.

Zero bytes travel over the internet, making it compliant with strict privacy regulations.`,
    contextualMehzanReference: `You can test this architecture using Mehzan Tools Hub (https://www.mehzandigital.com/en/pdf-merge). Open your Network tab in Chrome DevTools while merging a PDF—you'll see zero file POST requests to any server.`
  },
  {
    platform: "Quora",
    targetCommunity: "Quora Web Development & PDF Tools Space",
    topicTitle: "How can I validate and fix broken JSON formatting online for free?",
    valueFirstAnswer: `To validate and fix broken JSON formatting online:

1. Look for syntax errors like unquoted keys (e.g. { name: "John" } instead of { "name": "John" }).
2. Check for trailing commas in arrays or objects (e.g. [1, 2, 3,]).
3. Ensure all strings use double quotes, not single quotes.
4. Verify that brackets and curly braces match symmetrically.

Using a client-side JSON validator allows you to catch line-number syntax errors instantly without sending internal API payloads across the internet.`,
    contextualMehzanReference: `A fast, private tool for this is the Mehzan JSON Validator (https://www.mehzandigital.com/en/json-validator). It highlights exact error line numbers and automatically formats JSON objects in browser memory.`
  },
  {
    platform: "Dev.to / Hashnode",
    targetCommunity: "Frontend Engineering & Web Utilities",
    topicTitle: "Building Zero-Latency Web Utilities with WebAssembly and HTML5 Canvas",
    valueFirstAnswer: `Client-side computing has reached a point where heavy image manipulation, PDF parsing, and syntax linting no longer require round-trip server requests.

By combining WebAssembly for binary document parsing and HTML5 Canvas for hardware-accelerated image scaling, developers can build web applications that achieve 60fps local processing speed with zero server infrastructure overhead.

Benefits of serverless client architecture:
- Infinite scalability (each user brings their own client CPU)
- Absolute privacy (zero data ingress/egress to remote storage)
- Offline availability via Service Workers`,
    contextualMehzanReference: `We implemented this architecture across 330+ tools on Mehzan Tools Hub (https://www.mehzandigital.com/free-developer-utilities-and-web-tools-resource-guide).`
  }
];

export const COMPETITOR_LINK_GAP_DATA: CompetitorLinkGapItem[] = [
  {
    competitor: "Smallpdf",
    targetTopic: "PDF Compression & University Resource Pages",
    backlinkType: "Educational / University Student Resource List",
    sourceRelevance: "Universities recommend PDF tools to students for submitting thesis assignments under strict MB limits.",
    outreachAngle: "Pitch Mehzan PDF Compressor as a privacy-first, 100% free alternative with zero server uploads and no account creation required.",
    targetMehzanUrl: "https://www.mehzandigital.com/en/pdf-compress"
  },
  {
    competitor: "iLovePDF",
    targetTopic: "PDF Merging & Remote Work Tool Roundups",
    backlinkType: "Remote Work & Digital Nomad Resource Directory",
    sourceRelevance: "Blogs listing essential free productivity tools for freelancers and remote office workers.",
    outreachAngle: "Highlight Mehzan PDF Merger for combining contracts and invoices without daily file quotas or registration caps.",
    targetMehzanUrl: "https://www.mehzandigital.com/en/pdf-merge"
  },
  {
    competitor: "Adobe Acrobat Online",
    targetTopic: "PDF to Word & JPG Conversion Guides",
    backlinkType: "Tech Magazine & Office Productivity Blog",
    sourceRelevance: "Articles comparing paid vs free PDF converters.",
    outreachAngle: "Feature Mehzan JPG to PDF as a instant client-side converter that works without Adobe Creative Cloud subscriptions.",
    targetMehzanUrl: "https://www.mehzandigital.com/en/jpg-to-pdf"
  },
  {
    competitor: "PDF24",
    targetTopic: "Privacy-Focused Document Security",
    backlinkType: "Cybersecurity & Data Privacy Blogs",
    sourceRelevance: "Security sites recommending local document utilities that safeguard sensitive legal/financial records.",
    outreachAngle: "Explain how WebAssembly enables 100% in-browser PDF processing without network upload vectors.",
    targetMehzanUrl: "https://www.mehzandigital.com/category/pdf-tools"
  },
  {
    competitor: "Convertio",
    targetTopic: "Developer Data Utilities & CSV/JSON Formatting",
    backlinkType: "Developer Newsletters & Engineering Roundups",
    sourceRelevance: "Weekly dev newsletters sharing API utilities, JSON linters, and formatters.",
    outreachAngle: "Introduce Mehzan Developer Utilities (JSON Validator, CSV to JSON) as fast, zero-latency browser tools.",
    targetMehzanUrl: "https://www.mehzandigital.com/en/json-validator"
  },
  {
    competitor: "CloudConvert",
    targetTopic: "Image Optimization & Web Performance",
    backlinkType: "Web Design & WordPress Optimization Resource Pages",
    sourceRelevance: "Sites advising webmasters how to compress images and convert formats for Core Web Vitals.",
    outreachAngle: "Promote Mehzan Image Compressor & Resizer as instant browser tools that don't transmit user images across external APIs.",
    targetMehzanUrl: "https://www.mehzandigital.com/en/image-compressor"
  }
];
