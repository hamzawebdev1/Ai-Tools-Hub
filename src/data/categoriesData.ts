import { CategoryInfo, FAQItem } from "../types";
import { getCategoryCounts } from "../services/toolRegistryService";

export interface CategoryGuide {
  id: string;
  longDescription: string;
  technicalOverview: string;
  privacyGuarantee: string;
  commonWorkflows: string[];
  keyTools: { name: string; slug: string; description: string }[];
  faqs: FAQItem[];
}

export const RAW_CATEGORIES: CategoryInfo[] = [
  {
    id: "pdf",
    name: "PDF Tools",
    slug: "pdf-tools",
    description: "Merge, split, compress, convert, unlock, protect, rotate, crop, and OCR PDF documents client-side.",
    iconName: "FileText",
    count: 40,
    color: "from-red-500 to-rose-600",
  },
  {
    id: "image",
    name: "Image Tools",
    slug: "image-tools",
    description: "Resize, compress, crop, rotate, flip, filter, watermark, convert formats, pick colors, and generate icons.",
    iconName: "Image",
    count: 70,
    color: "from-purple-500 to-indigo-600",
  },
  {
    id: "text",
    name: "Text & String Tools",
    slug: "text-string-tools",
    description: "Count words, convert case, generate lorem ipsum, clean formatting, hash, encode/decode, and analyze text.",
    iconName: "Type",
    count: 67,
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: "developer",
    name: "Developer Tools",
    slug: "developer-tools",
    description: "Format JSON, XML, SQL, YAML, minify code, test Regex, decode JWTs, convert timestamps, and test APIs.",
    iconName: "Code",
    count: 75,
    color: "from-amber-500 to-orange-600",
  },
  {
    id: "seo",
    name: "SEO & SERP Tools",
    slug: "seo-serp-tools",
    description: "Generate meta tags, Open Graph cards, Schema.org markup, robots.txt, sitemaps, analyze keyword density.",
    iconName: "TrendingUp",
    count: 43,
    color: "from-violet-500 to-purple-600",
  },
  {
    id: "website",
    name: "Website & Webmaster Tools",
    slug: "website-tools",
    description: "Inspect website status, validate URLs, check SSL certificates, test HTTP headers, analyze performance.",
    iconName: "Globe",
    count: 21,
    color: "from-indigo-500 to-blue-600",
  },
  {
    id: "network",
    name: "Network & IP Tools",
    slug: "network-tools",
    description: "Subnet calculator, IP address inspector, ping test, DNS lookup, WHOIS query, port checker.",
    iconName: "Wifi",
    count: 18,
    color: "from-teal-500 to-emerald-600",
  },
  {
    id: "security",
    name: "Security & Cryptography",
    slug: "security-tools",
    description: "Generate hashes (SHA-256/512, MD5, HMAC), encrypt/decrypt, test passwords, generate UUIDs & keys.",
    iconName: "Shield",
    count: 16,
    color: "from-rose-500 to-red-600",
  },
  {
    id: "calculators",
    name: "Calculators & Converters",
    slug: "calculators-converters",
    description: "Age, BMI, EMI loan, mortgage, financial, unit conversion, scientific, date difference, tax, and fuel calculators.",
    iconName: "Calculator",
    count: 129,
    color: "from-blue-500 to-cyan-600",
  },
  {
    id: "qr",
    name: "QR & Barcode Tools",
    slug: "qr-barcode-tools",
    description: "Generate and scan custom high-resolution QR codes, WiFi credentials, vCards, and barcodes instantly.",
    iconName: "QrCode",
    count: 17,
    color: "from-pink-500 to-rose-600",
  },
  {
    id: "utilities",
    name: "File & Data Utilities",
    slug: "file-data-utilities",
    description: "Inspect file metadata, checksums, base64 encoding, ZIP archives, CSV/JSON/XML converters, and document utilities.",
    iconName: "Archive",
    count: 19,
    color: "from-cyan-500 to-blue-600",
  },
  {
    id: "media",
    name: "Audio, Video & Media Tools",
    slug: "audio-video-media-tools",
    description: "Convert, trim, cut, merge, compress, adjust volume, extract frames, create GIFs, analyze metadata & waveforms browser-side.",
    iconName: "Video",
    count: 68,
    color: "from-fuchsia-500 to-rose-600",
  },
  {
    id: "student",
    name: "Student Tools",
    slug: "student-tools",
    description: "Free GPA, CGPA, grade, final grade, attendance, study schedule, Pomodoro timer, citation generators, and academic calculators for students.",
    iconName: "GraduationCap",
    count: 15,
    color: "from-emerald-500 to-teal-600",
  },
];

export const CATEGORY_GUIDES: Record<string, CategoryGuide> = {
  pdf: {
    id: "pdf",
    longDescription: "Our PDF Tools category offers a high-performance suite of client-side document processing utilities. From merging scattered PDF invoices and splitting contract chapters to compressing large file sizes and extracting text via local OCR, every tool runs directly inside your browser memory using WebAssembly technology.",
    technicalOverview: "Powered by PDF-lib and WebAssembly binary modules, PDF manipulations occur directly within your client browser RAM sandbox. Your PDF bytes are parsed locally into structured page trees without remote server uploads.",
    privacyGuarantee: "100% Client-Side Memory Guarantee. Your documents never touch remote servers or external storage buckets.",
    commonWorkflows: [
      "Combining separate PDF reports and cover pages into a single merged document.",
      "Compressing heavy PDF attachments to meet 2MB email or portal upload limits.",
      "Extracting specific page ranges or splitting multi-page contract bundles."
    ],
    keyTools: [
      { name: "PDF Merger", slug: "pdf-merger", description: "Combine multiple PDF files into one ordered document." },
      { name: "PDF Compressor", slug: "pdf-compressor", description: "Reduce PDF file sizes while retaining crisp vector typography." },
      { name: "PDF Splitter", slug: "pdf-splitter", description: "Extract pages or split documents into individual PDF files." },
      { name: "PDF to Word Converter", slug: "pdf-to-word", description: "Transform PDF documents into editable Word DOCX files." }
    ],
    faqs: [
      { question: "Are my uploaded PDF files uploaded to your servers?", answer: "No! All PDF conversions and edits run locally in your browser RAM using WebAssembly. Files never leave your device." },
      { question: "Is there a file size limit for PDF processing?", answer: "Because processing uses your device RAM, most modern computers and phones can easily process PDF files up to 100MB." },
      { question: "Can I use these PDF tools on mobile phones?", answer: "Yes, our PDF utilities are fully responsive and work on iPhone, iPad, and Android devices." }
    ]
  },
  image: {
    id: "image",
    longDescription: "The Image Tools suite provides graphic manipulation utilities for web developers, designers, and social media creators. Convert formats between PNG, JPG, WebP, and AVIF, crop photos to exact aspect ratios, compress pixel density, and generate favicon icons instantly.",
    technicalOverview: "Graphic operations use HTML5 Canvas, WebGL rendering context, and GPU acceleration in your local browser to re-encode image pixel matrices with ultra-low execution latency.",
    privacyGuarantee: "100% In-Browser Rendering. Graphic files remain strictly inside local client memory.",
    commonWorkflows: [
      "Compressing product catalog photos for eCommerce store speed optimization.",
      "Cropping photos into 1:1 squares or 16:9 widescreen ratios for social media.",
      "Converting heavy PNG graphics into lightweight WebP format for web publishing."
    ],
    keyTools: [
      { name: "Image Compressor", slug: "image-compressor", description: "Shrink PNG, JPG, and WebP file sizes with real-time quality preview." },
      { name: "Image Cropper", slug: "image-cropper", description: "Crop photos to preset aspect ratios or custom pixel dimensions." },
      { name: "Image Converter", slug: "image-converter", description: "Convert between PNG, JPG, WebP, AVIF, and BMP image formats." },
      { name: "Favicon Generator", slug: "favicon-generator", description: "Generate ICO, PNG, and SVG favicon packages for websites." }
    ],
    faqs: [
      { question: "Does image compression reduce photo quality?", answer: "Our smart compression engine balances pixel density and file size savings with a live side-by-side quality comparison." },
      { question: "Which image formats are supported?", answer: "We support PNG, JPEG/JPG, WebP, AVIF, GIF, SVG, and BMP image formats." }
    ]
  },
  text: {
    id: "text",
    longDescription: "Text & String Tools simplify textual analysis, case conversions, string cleanup, encoding, and word counting. Perfect for copywriters, bloggers, SEO specialists, and software developers working with raw text buffers.",
    technicalOverview: "Text string operations execute instantly in JavaScript memory using high-speed regular expression tokenizers and Unicode string handlers.",
    privacyGuarantee: "100% Local String Memory. Text snippets and draft copy are never stored or logged.",
    commonWorkflows: [
      "Checking word counts and character limits for SEO meta titles and social posts.",
      "Converting UPPERCASE, lowercase, Title Case, and camelCase string formats.",
      "Generating Lorem Ipsum placeholder paragraphs for web design layouts."
    ],
    keyTools: [
      { name: "Word Counter", slug: "word-counter", description: "Calculate word, character, sentence, and paragraph counts in real time." },
      { name: "Case Converter", slug: "case-converter", description: "Convert text between UPPERCASE, lowercase, Title Case, and CamelCase." },
      { name: "Text Diff Checker", slug: "diff-checker", description: "Compare two text snippets side-by-side to highlight line additions and deletions." }
    ],
    faqs: [
      { question: "Is there a word limit for text tools?", answer: "Our text tools easily handle document buffers up to 1,000,000 characters." }
    ]
  },
  developer: {
    id: "developer",
    longDescription: "Developer Tools empower software engineers, QA testers, and web developers with essential formatting, minification, decoding, and syntax validation utilities. Format JSON, SQL, XML, and YAML, test Regular Expressions, decode JWT tokens, and convert Unix timestamps.",
    technicalOverview: "Code utilities parse source strings into Abstract Syntax Trees (AST) in local browser memory to format syntax and catch structure errors instantly.",
    privacyGuarantee: "100% Private API Key & Payload Inspection. Production secrets and credentials remain unlogged.",
    commonWorkflows: [
      "Formatting messy API JSON responses into readable indented structures.",
      "Decoding JWT tokens to inspect header claims and expiration timestamps.",
      "Testing regular expression patterns against sample text strings."
    ],
    keyTools: [
      { name: "JSON Formatter", slug: "json-formatter", description: "Format, validate, and beautify JSON payloads with syntax error detection." },
      { name: "JWT Decoder", slug: "jwt-decoder", description: "Decode and inspect JSON Web Token headers, payloads, and signatures." },
      { name: "SQL Formatter", slug: "sql-formatter", description: "Beautify complex SQL queries for improved code readability." }
    ],
    faqs: [
      { question: "Are my API keys or JWT tokens sent to a remote server?", answer: "No! All decoding and formatting happen locally in your browser memory." }
    ]
  },
  calculators: {
    id: "calculators",
    longDescription: "Calculators & Converters provide verified, high-precision mathematical, financial, scientific, health, and unit computation tools. Calculate loan EMIs, age differences, body mass index (BMI), percentages, and unit equivalents.",
    technicalOverview: "Calculations run on double-precision IEEE 754 arithmetic engines built into JavaScript for instant, accurate numerical outputs.",
    privacyGuarantee: "100% Local Arithmetic. Financial and health numbers remain strictly private on your device.",
    commonWorkflows: [
      "Calculating monthly loan EMI payments and interest schedules.",
      "Evaluating Body Mass Index (BMI) and daily calorie intake metrics.",
      "Converting length, weight, temperature, and currency units."
    ],
    keyTools: [
      { name: "BMI Calculator", slug: "bmi-calculator", description: "Calculate Body Mass Index and healthy weight ranges." },
      { name: "Age Calculator", slug: "age-calculator", description: "Determine exact age in years, months, weeks, days, and hours." },
      { name: "Loan EMI Calculator", slug: "loan-emi-calculator", description: "Calculate monthly installment payments and total interest schedules." }
    ],
    faqs: [
      { question: "Are calculations verified?", answer: "Yes! All calculations use verified standard financial, scientific, and health formulas." }
    ]
  },
  seo: {
    id: "seo",
    longDescription: "SEO & SERP Tools empower digital marketers, content strategists, and webmasters with essentials for search engine optimization. Generate meta tags, Open Graph cards, Schema.org JSON-LD markup, robots.txt files, XML sitemaps, and analyze keyword density to improve Google rankings and search click-through rates (CTR).",
    technicalOverview: "SEO algorithms parse HTML tags, string structures, and schema protocols in browser RAM to evaluate snippet character lengths, Open Graph preview cards, and technical crawlability.",
    privacyGuarantee: "100% In-Browser Analysis. Site URLs and keyword strategies remain private to your session.",
    commonWorkflows: [
      "Generating structured JSON-LD Schema markup for articles, tools, products, and FAQs.",
      "Building error-free robots.txt rules and XML sitemaps for Googlebot indexing.",
      "Simulating SERP snippets to optimize page titles and meta descriptions for higher CTR."
    ],
    keyTools: [
      { name: "Meta Tag Generator", slug: "meta-tag-generator", description: "Generate SEO-optimized meta titles, descriptions, and Open Graph tags." },
      { name: "Schema Generator", slug: "schema-generator", description: "Create valid JSON-LD structured data for articles, FAQs, and software." },
      { name: "Robots.txt Generator", slug: "robotstxt-generator", description: "Generate clean robots.txt rules for search engine crawlers." },
      { name: "XML Sitemap Generator", slug: "xml-sitemap-generator", description: "Build valid sitemap.xml files for Google and Bing indexing." }
    ],
    faqs: [
      { question: "Why are structured JSON-LD schemas important for SEO?", answer: "JSON-LD schema markup helps search engines understand page content, enabling rich snippets, star ratings, and FAQ accordions in Google SERPs." },
      { question: "Are generated meta tags compatible with Google guidelines?", answer: "Yes! All generated meta tags adhere strictly to Google, Open Graph, and Twitter Card specifications." }
    ]
  },
  website: {
    id: "website",
    longDescription: "Website & Webmaster Tools provide vital diagnostics for web developers and domain administrators. Test site availability, check HTTP response headers, validate SSL/TLS certificate validity, evaluate site performance, and inspect DOM performance metrics.",
    technicalOverview: "Webmaster utilities utilize modern fetch APIs, CORS proxies, and client-side HTTP analyzers to evaluate headers, status codes, and SSL handshake certificates.",
    privacyGuarantee: "100% Confidential Telemetry. Domain queries and header checks are never logged.",
    commonWorkflows: [
      "Inspecting HTTP response headers and security directives (CSP, HSTS, X-Frame-Options).",
      "Validating SSL certificate expiration dates and trust chain issuers.",
      "Checking domain redirect chains and HTTP status codes (200, 301, 302, 404, 410)."
    ],
    keyTools: [
      { name: "HTTP Header Checker", slug: "http-header-checker", description: "Inspect HTTP response headers, status codes, and security headers." },
      { name: "SSL Certificate Checker", slug: "ssl-checker", description: "Verify SSL/TLS certificate validity, issuer, and expiry date." },
      { name: "Redirect Checker", slug: "redirect-checker", description: "Trace 301/302 URL redirect chains and HTTP status responses." }
    ],
    faqs: [
      { question: "Does inspecting a website affect server performance?", answer: "No, diagnostic tools issue lightweight standard HTTP GET or HEAD requests that consume negligible bandwidth." }
    ]
  },
  network: {
    id: "network",
    longDescription: "Network & IP Tools assist system administrators, devops engineers, and cybersecurity specialists with IP calculations, subnet planning, DNS lookups, WHOIS domain research, and ping latency testing.",
    technicalOverview: "Network utilities execute IPv4/IPv6 bitwise calculations and query DNS record databases locally via Web APIs.",
    privacyGuarantee: "100% Private Network Calculations. IP subnets and internal addresses remain strictly client-side.",
    commonWorkflows: [
      "Calculating IPv4 subnets, network masks, CIDR ranges, and host capacities.",
      "Performing DNS record lookups (A, AAAA, MX, TXT, CNAME, NS records).",
      "Analyzing IP addresses to identify ISP, country, and ASN details."
    ],
    keyTools: [
      { name: "IP Subnet Calculator", slug: "ip-subnet-calculator", description: "Calculate CIDR subnet masks, network IDs, and broadcast ranges." },
      { name: "DNS Lookup Tool", slug: "dns-lookup", description: "Query domain DNS records including A, MX, CNAME, and TXT entries." },
      { name: "IP Location Finder", slug: "ip-location-finder", description: "Lookup IP address geolocation, ISP, and ASN metadata." }
    ],
    faqs: [
      { question: "Are subnet calculations accurate for both IPv4 and IPv6?", answer: "Yes, our bitwise engines calculate exact CIDR ranges, network boundaries, and host capacities." }
    ]
  },
  security: {
    id: "security",
    longDescription: "Security & Cryptography Tools deliver robust client-side encryption, hashing, password generation, and key generation utilities. Generate SHA-256/512, MD5, and HMAC hashes, encrypt text with AES-256, create cryptographic passwords, and generate v4 UUIDs.",
    technicalOverview: "Cryptographic functions rely on the native browser Web Crypto API (`window.crypto.subtle`) providing hardware-accelerated, zero-leakage hash calculation and AES cipher operations.",
    privacyGuarantee: "Zero Transmission Security Guarantee. Plaintext strings and generated secret keys never leave your browser RAM.",
    commonWorkflows: [
      "Generating cryptographic SHA-256 checksums to verify file download integrity.",
      "Creating strong random passwords with custom length and special character sets.",
      "Encrypting sensitive notes or credentials locally using AES-256 password encryption."
    ],
    keyTools: [
      { name: "Hash Generator", slug: "hash-generator", description: "Compute MD5, SHA-1, SHA-256, SHA-512, and HMAC hashes instantly." },
      { name: "AES Encryption Tool", slug: "aes-encryption", description: "Encrypt and decrypt text messages with AES-256 password keys." },
      { name: "Password Generator", slug: "password-generator", description: "Generate secure, uncrackable random passwords with high entropy." }
    ],
    faqs: [
      { question: "Is Web Crypto API secure for generating passwords and hashes?", answer: "Yes! Web Crypto API uses cryptographically secure pseudo-random number generators (CSPRNG) backed by OS hardware entropy." }
    ]
  },
  qr: {
    id: "qr",
    longDescription: "QR & Barcode Tools allow business owners, event organizers, marketers, and individuals to create high-resolution custom QR codes and barcodes instantly. Generate QR codes for URLs, WiFi networks, vCard contact cards, email messages, WhatsApp links, and produce barcode formats including CODE128, EAN-13, and UPC-A.",
    technicalOverview: "QR codes and barcodes are rendered using HTML5 Canvas and SVG vector engines, producing crisp vector graphics ready for print or digital media without pixelation.",
    privacyGuarantee: "100% In-Browser Code Generation. Credentials (such as WiFi passwords or contact details) remain strictly inside local browser memory.",
    commonWorkflows: [
      "Generating WiFi QR codes so guests can scan and connect without typing passwords.",
      "Creating custom vector QR codes with embedded brand logos for printed marketing collateral.",
      "Producing product barcodes for retail inventory management and shipping labels."
    ],
    keyTools: [
      { name: "QR Code Generator", slug: "qr-code-generator", description: "Generate custom high-resolution QR codes with logos and colors." },
      { name: "Barcode Generator", slug: "barcode-generator", description: "Create CODE128, EAN-13, and UPC barcodes for products and labels." },
      { name: "WiFi QR Code Generator", slug: "wifi-qr-code-generator", description: "Generate instant WiFi access QR codes for seamless smartphone connection." }
    ],
    faqs: [
      { question: "Do generated QR codes ever expire?", answer: "No! All QR codes generated on Mehzan Tools Hub are static and permanent with zero expiration dates or scan caps." },
      { question: "Can I download QR codes in high-resolution vector formats?", answer: "Yes! You can download QR codes in high-res PNG or vector SVG formats for print publishing." }
    ]
  },
  utilities: {
    id: "utilities",
    longDescription: "File & Data Utilities streamline data format conversions, archive extraction, and file metadata analysis. Convert between CSV, JSON, and XML formats, encode/decode Base64 buffers, inspect file checksums, and extract ZIP archives directly in your web browser.",
    technicalOverview: "Data utilities execute local file parsing using FileReader APIs and WebAssembly array buffers, enabling high-speed processing without remote file uploads.",
    privacyGuarantee: "100% Local File Sandbox. Your files and structured datasets are never uploaded or stored.",
    commonWorkflows: [
      "Converting CSV spreadsheet exports into structured JSON arrays for API usage.",
      "Encoding binary image buffers into Base64 data URIs for inline CSS or HTML.",
      "Inspecting file MIME types, byte sizes, and MD5/SHA-256 file checksums."
    ],
    keyTools: [
      { name: "CSV to JSON Converter", slug: "csv-to-json", description: "Convert CSV spreadsheet files into clean JSON arrays." },
      { name: "Base64 Encoder / Decoder", slug: "base64-converter", description: "Encode text or binary files to Base64 data strings." },
      { name: "JSON to CSV Converter", slug: "json-to-csv", description: "Convert JSON data objects into downloadable CSV spreadsheet tables." }
    ],
    faqs: [
      { question: "Is there a row limit when converting CSV to JSON?", answer: "Our browser memory engine efficiently processes CSV files containing up to 100,000 rows." }
    ]
  },
  media: {
    id: "media",
    longDescription: "Audio, Video & Media Tools provide lightweight browser-based processing for video and audio content creators. Trim MP3 audio files, convert MP4 videos to MP3 audio tracks, record voice notes, adjust audio volume, create animated GIFs, and inspect media metadata.",
    technicalOverview: "Media utilities utilize Web Audio API, HTML5 MediaRecorder, and WebAssembly compiled FFmpeg modules to edit audio waveforms and encode video frames locally.",
    privacyGuarantee: "100% In-Browser Media Processing. Your personal voice recordings and video files never leave your device.",
    commonWorkflows: [
      "Extracting MP3 audio tracks from MP4 video recordings for podcast editing.",
      "Trimming and cutting MP3 audio files to create custom phone ringtones.",
      "Recording quick voice notes directly from your microphone into downloadable WAV audio."
    ],
    keyTools: [
      { name: "MP4 to MP3 Converter", slug: "mp4-to-mp3", description: "Extract clear MP3 audio tracks from MP4 video files." },
      { name: "Audio Cutter & Trimmer", slug: "audio-cutter", description: "Trim and cut MP3, WAV, and AAC audio files with visual waveform editing." },
      { name: "Voice Recorder", slug: "voice-recorder", description: "Record voice audio with your microphone and download clean WAV files." }
    ],
    faqs: [
      { question: "Do audio conversions happen on a remote server?", answer: "No! All audio extraction and cutting execute in your browser using modern Web Audio APIs." }
    ]
  },
  student: {
    id: "student",
    longDescription: "Student Tools deliver free academic calculators and study management utilities to help high school and university students boost academic performance. Calculate cumulative GPA and CGPA on a 4.0 scale, determine required final exam grades, track course attendance, generate academic citations, and manage study time with a Pomodoro timer.",
    technicalOverview: "Academic calculators run verified weighting algorithms locally in JavaScript to calculate GPA, semester grades, and attendance percentages instantly.",
    privacyGuarantee: "100% Private Academic Record. Your grades, course names, and attendance logs are strictly stored on your local browser device.",
    commonWorkflows: [
      "Calculating cumulative GPA and semester CGPA on a weighted or unweighted 4.0 scale.",
      "Determining exact marks needed on final exams to achieve a target letter grade.",
      "Tracking course attendance percentages to prevent falling below mandatory thresholds."
    ],
    keyTools: [
      { name: "GPA Calculator", slug: "gpa-calculator", description: "Calculate semester and cumulative GPA on 4.0 weighted/unweighted scales." },
      { name: "CGPA Calculator", slug: "cgpa-calculator", description: "Compute cumulative GPA across multiple college semesters." },
      { name: "Final Grade Calculator", slug: "final-grade-calculator", description: "Calculate the exact grade needed on your final exam to pass or reach an A." },
      { name: "Attendance Calculator", slug: "attendance-calculator", description: "Track class attendance percentage and calculate allowable absences." }
    ],
    faqs: [
      { question: "Does the GPA calculator support both 4.0 and 5.0 grading scales?", answer: "Yes! You can toggle between standard 4.0 scales, 5.0 scales, and percentage-to-letter grade conversion charts." },
      { question: "Are my grade inputs saved?", answer: "Your inputs remain saved locally in your browser session so you can return and update your courses anytime." }
    ]
  }
};

// Returns dynamically counted category list
export function getDynamicCategories(): CategoryInfo[] {
  const liveCounts = getCategoryCounts();
  return RAW_CATEGORIES.map((cat) => ({
    ...cat,
    count: liveCounts[cat.id] || 0,
  }));
}

export const CATEGORIES_DATA: CategoryInfo[] = getDynamicCategories();
