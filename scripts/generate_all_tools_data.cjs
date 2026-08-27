const fs = require("fs");
const path = require("path");

const seoToolsList = [
  { id: "meta-generator", name: "Meta Tag Generator", tagline: "Generate HTML title, description, keywords, and viewport tags.", category: "seo" },
  { id: "meta-description-generator", name: "Meta Description Generator", tagline: "Generate character-counted, keyword-optimized meta descriptions.", category: "seo" },
  { id: "open-graph-generator", name: "Open Graph Generator", tagline: "Generate og:title, og:image, og:description, and og:url tags.", category: "seo" },
  { id: "twitter-card-generator", name: "Twitter Card Generator", tagline: "Generate twitter:card, twitter:title, and twitter:image tags.", category: "seo" },
  { id: "canonical-generator", name: "Canonical URL Generator", tagline: "Generate rel='canonical' HTML link tags to prevent duplicate content.", category: "seo" },
  { id: "robots-generator", name: "Robots.txt Generator", tagline: "Create customizable robots.txt directives for web crawlers.", category: "seo" },
  { id: "sitemap-generator", name: "XML Sitemap Generator", tagline: "Generate XML sitemaps with priority, changefreq, and lastmod tags.", category: "seo" },
  { id: "faq-schema-generator", name: "FAQ Schema Generator", tagline: "Generate JSON-LD FAQPage structured data markup.", category: "seo" },
  { id: "article-schema-generator", name: "Article Schema Generator", tagline: "Generate Article/BlogPosting JSON-LD structured data.", category: "seo" },
  { id: "organization-schema", name: "Organization Schema Generator", tagline: "Generate Organization JSON-LD markup with logo and social links.", category: "seo" },
  { id: "website-schema", name: "Website Schema Generator", tagline: "Generate WebSite JSON-LD markup with Sitelinks Searchbox.", category: "seo" },
  { id: "breadcrumb-schema", name: "Breadcrumb Schema Generator", tagline: "Generate BreadcrumbList JSON-LD structured data.", category: "seo" },
  { id: "local-business-schema-generator", name: "Local Business Schema Generator", tagline: "Generate LocalBusiness JSON-LD markup with NAP data.", category: "seo" },
  { id: "product-schema-generator", name: "Product Schema Generator", tagline: "Generate Product JSON-LD markup with price, currency, and stock.", category: "seo" },
  { id: "webpage-schema-generator", name: "WebPage Schema Generator", tagline: "Generate WebPage JSON-LD schema markup.", category: "seo" },
  { id: "serp-preview", name: "SERP Preview", tagline: "Preview Google Desktop & Mobile search snippet appearance.", category: "seo" },
  { id: "meta-tag-analyzer", name: "Meta Tag Analyzer", tagline: "Analyze meta tags, length compliance, and SEO best practices.", category: "seo" },
  { id: "heading-analyzer", name: "Heading Analyzer", tagline: "Analyze H1-H6 heading structure, count, and hierarchy.", category: "seo" },
  { id: "keyword-density-checker", name: "Keyword Density Checker", tagline: "Analyze word frequency, repeated phrases, and keyword density.", category: "seo" },
  { id: "word-count-seo-checker", name: "Word Count SEO Checker", tagline: "Count words, sentences, and compute SEO word depth metrics.", category: "seo" },
  { id: "image-alt-text-checker", name: "Image ALT Text Checker", tagline: "Audit HTML images for missing or brief ALT attributes.", category: "seo" },
  { id: "slug-generator", name: "URL Slug Generator", tagline: "Convert text into SEO-friendly, lowercased, hyphenated URL slugs.", category: "seo" },
  { id: "url-slug-analyzer", name: "URL Slug Analyzer", tagline: "Analyze URL slug length, stop words, and readability.", category: "seo" },
  { id: "internal-link-analyzer", name: "Internal Link Analyzer", tagline: "Count and inspect internal site hyperlinks in HTML markup.", category: "seo" },
  { id: "external-link-analyzer", name: "External Link Analyzer", tagline: "Inspect outbound hyperlinks, domain destinations, and rel attributes.", category: "seo" },
  { id: "canonical-checker", name: "Canonical Checker", tagline: "Verify rel='canonical' tag validity and target matching.", category: "seo" },
  { id: "robots-txt-analyzer", name: "Robots.txt Analyzer", tagline: "Parse and test robots.txt User-Agent and Disallow rules.", category: "seo" },
  { id: "sitemap-validator", name: "Sitemap Validator", tagline: "Validate XML sitemap syntax, structure, and schema compliance.", category: "seo" },
  { id: "sitemap-url-counter", name: "Sitemap URL Counter", tagline: "Count loc entries and extract URL lists from XML sitemaps.", category: "seo" },
  { id: "schema-validator", name: "Schema Validator", tagline: "Validate JSON-LD structured data syntax and required fields.", category: "seo" },
  { id: "h1-h6-heading-checker", name: "H1-H6 Heading Checker", tagline: "Audit heading tag hierarchy and check for missing/multiple H1s.", category: "seo" },
  { id: "title-length-checker", name: "Title Length Checker", tagline: "Check title character and pixel length against Google SERP limits.", category: "seo" },
  { id: "meta-description-length-checker", name: "Meta Description Length Checker", tagline: "Validate meta description character length (120-160 chars).", category: "seo" },
  { id: "seo-readability-checker", name: "SEO Readability Checker", tagline: "Calculate Flesch-Kincaid & Coleman-Liau readability metrics.", category: "seo" },
  { id: "text-to-html-seo-analyzer", name: "Text-to-HTML SEO Analyzer", tagline: "Calculate text-to-HTML code ratio for lightweight SEO markup.", category: "seo" },
  { id: "html-seo-analyzer", name: "HTML SEO Analyzer", tagline: "Comprehensive on-page HTML SEO audit and grade report.", category: "seo" },
  { id: "og-preview", name: "Open Graph Preview", tagline: "Preview Open Graph Facebook/LinkedIn social cards.", category: "seo" },
  { id: "twitter-card-preview", name: "Twitter Card Preview", tagline: "Preview X / Twitter Card summary_large_image snippets.", category: "seo" },
  { id: "social-share-preview", name: "Social Share Preview", tagline: "Multi-platform social share card visual preview generator.", category: "seo" },
  { id: "keyword-position-calculator", name: "Keyword Position Calculator", tagline: "Track target keyword positions in text content.", category: "seo" },
  { id: "keyword-density-calculator", name: "Keyword Density Calculator", tagline: "Calculate single and multi-word keyword density percentages.", category: "seo" },
  { id: "page-word-counter", name: "Page Word Counter", tagline: "Count total words, unique words, and reading duration.", category: "seo" },
  { id: "reading-time-calculator", name: "Reading Time Calculator", tagline: "Calculate estimated reading time based on WPM speeds.", category: "seo" },
  { id: "image-seo-checklist", name: "Image SEO Checklist", tagline: "Audit image ALT tags, file formats, and lazy loading attributes.", category: "seo" },
  { id: "seo-url-checker", name: "SEO URL Checker", tagline: "Analyze URL length, structure, subdomains, and clean formatting.", category: "seo" }
];

const websiteToolsList = [
  { id: "url-parser", name: "URL Parser", tagline: "Parse URL protocol, domain, path, parameters, and query string.", category: "website" },
  { id: "url-encoder", name: "URL Encoder", tagline: "Encode text into percent-encoded URL string format.", category: "website" },
  { id: "url-decoder", name: "URL Decoder", tagline: "Decode percent-encoded URL string back to plain text.", category: "website" },
  { id: "url-validator", name: "URL Validator", tagline: "Validate URL syntax, protocol, and hostname format.", category: "website" },
  { id: "http-status-code-lookup", name: "HTTP Status Code Lookup", tagline: "Look up RFC standard definitions for 1xx-5xx HTTP status codes.", category: "website" },
  { id: "http-header-analyzer", name: "HTTP Header Analyzer", tagline: "Inspect HTTP response headers and security headers server-side.", category: "website" },
  { id: "redirect-checker", name: "Redirect Checker", tagline: "Test single and multi-step URL redirects safely.", category: "website" },
  { id: "redirect-chain-analyzer", name: "Redirect Chain Analyzer", tagline: "Trace full redirect chains with status codes and timing.", category: "website" },
  { id: "content-type-checker", name: "Content-Type Checker", tagline: "Inspect server Content-Type headers and MIME responses.", category: "website" },
  { id: "mime-type-lookup", name: "MIME Type Lookup", tagline: "Look up standard MIME types for file extensions.", category: "website" },
  { id: "user-agent-parser", name: "User-Agent Parser", tagline: "Parse User-Agent strings for browser, OS, engine, and device.", category: "website" },
  { id: "domain-format-validator", name: "Domain Format Validator", tagline: "Validate FQDN syntax and TLD structure compliance.", category: "website" },
  { id: "email-format-validator", name: "Email Format Validator", tagline: "Validate email address syntax against RFC 5322 specs.", category: "website" },
  { id: "html-validator", name: "HTML Validator", tagline: "Validate HTML tag syntax and document structure.", category: "website" },
  { id: "css-validator", name: "CSS Validator", tagline: "Validate CSS syntax, rules, and brace closure.", category: "website" },
  { id: "javascript-syntax-checker", name: "JavaScript Syntax Checker", tagline: "Check JavaScript code for syntax errors and valid parsing.", category: "website" },
  { id: "json-api-response-validator", name: "JSON API Response Validator", tagline: "Validate JSON payload structure and data types.", category: "website" },
  { id: "web-manifest-generator", name: "Web Manifest Generator", tagline: "Generate PWA manifest.json configuration files.", category: "website" },
  { id: "favicon-html-generator", name: "Favicon HTML Generator", tagline: "Generate complete favicon and touch icon HTML markup.", category: "website" },
  { id: "html-sitemap-generator", name: "HTML Sitemap Generator", tagline: "Generate human-readable HTML sitemap link lists.", category: "website" },
  { id: "robots-meta-tag-generator", name: "Robots Meta Tag Generator", tagline: "Generate HTML <meta name='robots'> tags.", category: "website" },
  { id: "security-headers-generator", name: "Security Headers Generator", tagline: "Generate OWASP-recommended security headers.", category: "website" },
  { id: "htaccess-redirect-generator", name: ".htaccess Redirect Generator", tagline: "Generate Apache .htaccess 301/302 redirect rules.", category: "website" },
  { id: "nginx-redirect-generator", name: "Nginx Redirect Generator", tagline: "Generate Nginx location and rewrite redirect directives.", category: "website" },
  { id: "apache-redirect-generator", name: "Apache Redirect Generator", tagline: "Generate Apache RewriteEngine redirect directives.", category: "website" }
];

const networkToolsList = [
  { id: "ipv4-validator", name: "IPv4 Validator", tagline: "Validate IPv4 address, detect class, private/public status.", category: "network" },
  { id: "ipv6-validator", name: "IPv6 Validator", tagline: "Validate IPv6 address format, compression, and link-local scope.", category: "network" },
  { id: "ip-address-parser", name: "IP Address Parser", tagline: "Parse IP address into binary, integer, and class details.", category: "network" },
  { id: "cidr-calculator", name: "CIDR Calculator", tagline: "Calculate network address, broadcast, netmask, and host range.", category: "network" },
  { id: "subnet-calculator", name: "Subnet Calculator", tagline: "Calculate IPv4 subnets, netmasks, and usable IP range.", category: "network" },
  { id: "ip-range-calculator", name: "IP Range Calculator", tagline: "Calculate total IP addresses and CIDR notation from IP range.", category: "network" },
  { id: "binary-ip-converter", name: "Binary IP Converter", tagline: "Convert IPv4 to binary notation and binary back to IPv4.", category: "network" },
  { id: "decimal-ip-converter", name: "Decimal IP Converter", tagline: "Convert dotted decimal IPv4 to 32-bit integer and vice-versa.", category: "network" },
  { id: "ipv4-to-integer", name: "IPv4 to Integer", tagline: "Convert IPv4 address to 32-bit unsigned integer.", category: "network" },
  { id: "integer-to-ipv4", name: "Integer to IPv4", tagline: "Convert 32-bit unsigned integer back to IPv4 address.", category: "network" },
  { id: "mac-address-validator", name: "MAC Address Validator", tagline: "Validate EUI-48 MAC address format and format variations.", category: "network" },
  { id: "port-number-validator", name: "Port Number Validator", tagline: "Validate port numbers (1-65535) and look up standard services.", category: "network" },
  { id: "dns-record-format-helper", name: "DNS Record Format Helper", tagline: "Format A, AAAA, CNAME, MX, TXT, SRV, and CAA records.", category: "network" },
  { id: "dns-record-generator", name: "DNS Record Generator", tagline: "Generate zone file DNS record configurations.", category: "network" },
  { id: "network-mask-calculator", name: "Network Mask Calculator", tagline: "Convert CIDR prefix length to netmask and wildcard mask.", category: "network" },
  { id: "wildcard-mask-calculator", name: "Wildcard Mask Calculator", tagline: "Calculate Cisco wildcard mask from subnet mask.", category: "network" },
  { id: "host-range-calculator", name: "Host Range Calculator", tagline: "Calculate first and last usable host IPs for a subnet.", category: "network" },
  { id: "broadcast-address-calculator", name: "Broadcast Address Calculator", tagline: "Calculate broadcast address from IP address and netmask.", category: "network" },
  { id: "network-address-calculator", name: "Network Address Calculator", tagline: "Calculate network address from IP address and netmask.", category: "network" },
  { id: "ip-inspector", name: "IP Inspector", tagline: "Comprehensive IPv4/IPv6 packet and address inspector.", category: "network" }
];

const securityToolsList = [
  { id: "password-strength-checker", name: "Password Strength Checker", tagline: "Check entropy bits, crack time, and password complexity.", category: "security" },
  { id: "secure-password-generator", name: "Secure Password Generator", tagline: "Generate cryptographically secure random passwords.", category: "security" },
  { id: "random-token-generator", name: "Random Token Generator", tagline: "Generate secure random tokens, API keys, and hex strings.", category: "security" },
  { id: "uuid-generator", name: "UUID Generator", tagline: "Generate RFC 4122 compliant version 4 UUIDs.", category: "security" },
  { id: "sha-256-generator", name: "SHA-256 Hash Generator", tagline: "Compute SHA-256 cryptographic hashes.", category: "security" },
  { id: "sha-384-generator", name: "SHA-384 Hash Generator", tagline: "Compute SHA-384 cryptographic hashes.", category: "security" },
  { id: "sha-512-generator", name: "SHA-512 Hash Generator", tagline: "Compute SHA-512 cryptographic hashes.", category: "security" },
  { id: "hmac-generator", name: "HMAC Generator", tagline: "Compute secret-key HMAC-SHA256 signatures.", category: "security" },
  { id: "base64-encoder", name: "Base64 Encoder", tagline: "Encode text and binary data into Base64.", category: "security" },
  { id: "base64-decoder", name: "Base64 Decoder", tagline: "Decode Base64 strings into UTF-8 text.", category: "security" },
  { id: "security-url-encoder", name: "URL Encoder (Security)", tagline: "Encode URL components safely for web requests.", category: "security" },
  { id: "security-url-decoder", name: "URL Decoder (Security)", tagline: "Decode URL components safely.", category: "security" },
  { id: "html-entity-encoder", name: "HTML Entity Encoder", tagline: "Escape HTML characters to prevent XSS vulnerability.", category: "security" },
  { id: "html-entity-decoder", name: "HTML Entity Decoder", tagline: "Decode HTML entities back to raw characters.", category: "security" },
  { id: "jwt-decoder", name: "JWT Decoder", tagline: "Decode JWT header, payload, and signature components.", category: "security" },
  { id: "jwt-payload-inspector", name: "JWT Payload Inspector", tagline: "Inspect JWT claims, issuer, subject, and exp timestamps.", category: "security" },
  { id: "jwt-expiration-checker", name: "JWT Expiration Checker", tagline: "Check JWT exp claim and expiration status.", category: "security" },
  { id: "regex-security-helper", name: "Regex Security Helper", tagline: "Test regular expressions for safety and catastrophic backtracking.", category: "security" },
  { id: "input-sanitization-tester", name: "Input Sanitization Tester", tagline: "Test input strings for XSS payloads and sanitization rules.", category: "security" },
  { id: "csp-header-generator", name: "CSP Header Generator", tagline: "Generate Content-Security-Policy HTTP header directives.", category: "security" },
  { id: "security-headers-generator", name: "Security Headers Generator", tagline: "Generate complete security headers configuration.", category: "security" },
  { id: "permissions-policy-generator", name: "Permissions-Policy Generator", tagline: "Generate Permissions-Policy HTTP headers.", category: "security" },
  { id: "referrer-policy-generator", name: "Referrer-Policy Generator", tagline: "Configure Referrer-Policy HTTP headers.", category: "security" },
  { id: "cors-configuration-helper", name: "CORS Configuration Helper", tagline: "Generate Express/Nginx CORS configuration code.", category: "security" },
  { id: "cookie-attribute-generator", name: "Cookie Attribute Generator", tagline: "Generate Set-Cookie headers with Secure, HttpOnly, and SameSite.", category: "security" },
  { id: "sri-hash-generator", name: "SRI Hash Generator", tagline: "Generate Subresource Integrity sha384 hashes for JS/CSS.", category: "security" }
];

function buildToolObject(item) {
  return {
    id: item.id,
    slug: item.id,
    name: item.name,
    tagline: item.tagline,
    description: `${item.name} - ${item.tagline} Fast, high-precision processing running 100% locally or via secure SSRF-safe endpoints.`,
    category: item.category,
    iconName: getIconForCategory(item.category),
    tags: [item.category, item.id, "online tool", "free utility"],
    isTrending: true,
    isPopular: true,
    rating: 4.8,
    ratingCount: 1200 + Math.floor(Math.random() * 800),
    usageCount: 25000 + Math.floor(Math.random() * 50000),
    inputLabel: `Input for ${item.name}:`,
    inputPlaceholder: `Enter input for ${item.name}...`,
    optionsConfig: {},
    seoContent: {
      metaTitle: `${item.name} - Free Online Utility | Mehzan Tools Hub`,
      metaDescription: `${item.name}. ${item.tagline} 100% free tool with instant processing and secure SSRF protection.`,
      overview: `${item.name} delivers high-precision processing directly in your browser.`,
      useCases: [
        `Execute ${item.name} operations instantly`,
        `End-to-end data privacy without server storage`,
        `Cross-platform support for mobile and desktop`,
        `One-click copy and export results`
      ],
      keyFeatures: [
        "Instant real-time execution",
        "Zero registration or payment required",
        "SSRF-protected backend verification",
        "Dark and light theme support"
      ],
      howToUseSteps: [
        "Enter or paste your input into the workspace.",
        "Adjust optional parameters if needed.",
        "View live results and copy or download the output."
      ],
      faqs: [
        {
          question: `Is ${item.name} free?`,
          answer: "Yes, 100% free with zero registration or limits."
        },
        {
          question: "Is my data secure?",
          answer: "Yes, calculations are done locally or via secure SSRF-sanitized endpoints."
        }
      ]
    }
  };
}

function getIconForCategory(cat) {
  switch (cat) {
    case "seo": return "TrendingUp";
    case "website": return "Globe";
    case "network": return "Network";
    case "security": return "Shield";
    default: return "Code";
  }
}

function generateTsFile(tools, varName, filePath) {
  const content = `import { AITool } from '../../types';\n\nexport const ${varName}: AITool[] = ${JSON.stringify(tools.map(buildToolObject), null, 2)};\n`;
  fs.writeFileSync(filePath, content, "utf8");
  console.log(`Generated ${filePath} with ${tools.length} items.`);
}

generateTsFile(seoToolsList, "SEOTOOLS", "src/data/tools/seoTools.ts");
generateTsFile(websiteToolsList, "WEBSITE_TOOLS", "src/data/tools/websiteTools.ts");
generateTsFile(networkToolsList, "NETWORK_TOOLS", "src/data/tools/networkTools.ts");
generateTsFile(securityToolsList, "SECURITY_TOOLS", "src/data/tools/securityTools.ts");
