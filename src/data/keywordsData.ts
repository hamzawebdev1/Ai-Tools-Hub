export interface KeywordItem {
  id: string;
  keyword: string;
  searchIntent: "Transactional" | "Informational" | "Commercial" | "Navigational";
  relatedCategory: string;
  suggestedPage: string;
  contentOpportunity: string;
  priority: "High" | "Medium";
  mappedToolSlug?: string;
  mappedArticleSlug?: string;
}

export const SEO_KEYWORDS_DATA: KeywordItem[] = [
  {
    id: "kw-1",
    keyword: "compress pdf to 200kb",
    searchIntent: "Transactional",
    relatedCategory: "PDF Tools",
    suggestedPage: "/pdf-compress",
    contentOpportunity: "Target users uploading resumes and government job application forms with strict 200KB limits.",
    priority: "High",
    mappedToolSlug: "pdf-compress",
    mappedArticleSlug: "how-to-compress-pdf-without-losing-quality"
  },
  {
    id: "kw-2",
    keyword: "split pdf pages free",
    searchIntent: "Transactional",
    relatedCategory: "PDF Tools",
    suggestedPage: "/split-pdf-pages",
    contentOpportunity: "Provide single-page and range extraction without watermarks or file limits.",
    priority: "High",
    mappedToolSlug: "split-pdf-pages",
    mappedArticleSlug: "how-to-split-and-extract-pdf-pages"
  },
  {
    id: "kw-3",
    keyword: "encrypt pdf with password",
    searchIntent: "Transactional",
    relatedCategory: "PDF Tools",
    suggestedPage: "/pdf-protect",
    contentOpportunity: "Guide users on client-side AES-256 password protection for sensitive legal/financial files.",
    priority: "High",
    mappedToolSlug: "pdf-protect"
  },
  {
    id: "kw-4",
    keyword: "remove pdf password online",
    searchIntent: "Transactional",
    relatedCategory: "PDF Tools",
    suggestedPage: "/pdf-unlock",
    contentOpportunity: "Help users unlock owner passwords for editing and printing restricted documents.",
    priority: "High",
    mappedToolSlug: "pdf-unlock"
  },
  {
    id: "kw-5",
    keyword: "merge pdf files free",
    searchIntent: "Transactional",
    relatedCategory: "PDF Tools",
    suggestedPage: "/pdf-merge",
    contentOpportunity: "Combine multiple PDF chapters, invoices, or scanned receipts into one file.",
    priority: "High",
    mappedToolSlug: "pdf-merge",
    mappedArticleSlug: "how-to-merge-pdf-files-into-one"
  },
  {
    id: "kw-6",
    keyword: "convert jpg to pdf online",
    searchIntent: "Transactional",
    relatedCategory: "PDF Tools",
    suggestedPage: "/jpg-to-pdf",
    contentOpportunity: "Pack multiple smartphone photos and scans into a single PDF document.",
    priority: "High",
    mappedToolSlug: "jpg-to-pdf"
  },
  {
    id: "kw-7",
    keyword: "convert pdf to word docx",
    searchIntent: "Transactional",
    relatedCategory: "PDF Tools",
    suggestedPage: "/pdf-to-word",
    contentOpportunity: "Convert non-editable PDF files into editable Microsoft Word (.docx) formats.",
    priority: "High",
    mappedToolSlug: "pdf-to-word"
  },
  {
    id: "kw-8",
    keyword: "compress image to 20kb",
    searchIntent: "Transactional",
    relatedCategory: "Image Tools",
    suggestedPage: "/image-compressor",
    contentOpportunity: "Assist candidate portal applicants needing photos under 20KB or 50KB.",
    priority: "High",
    mappedToolSlug: "image-compressor",
    mappedArticleSlug: "how-to-compress-images-to-20kb-100kb"
  },
  {
    id: "kw-9",
    keyword: "crop image to circle online",
    searchIntent: "Transactional",
    relatedCategory: "Image Tools",
    suggestedPage: "/image-cropper",
    contentOpportunity: "Create circular profile avatars for LinkedIn, Twitter, and resume templates.",
    priority: "Medium",
    mappedToolSlug: "image-cropper"
  },
  {
    id: "kw-10",
    keyword: "convert webp to jpg online",
    searchIntent: "Transactional",
    relatedCategory: "Image Tools",
    suggestedPage: "/webp-to-jpg",
    contentOpportunity: "Help users convert saved Google WebP images into standard JPG/PNG photos.",
    priority: "High",
    mappedToolSlug: "webp-to-jpg",
    mappedArticleSlug: "how-to-convert-webp-to-jpg-and-png"
  },
  {
    id: "kw-11",
    keyword: "json formatter and validator",
    searchIntent: "Transactional",
    relatedCategory: "Developer Tools",
    suggestedPage: "/json-formatter",
    contentOpportunity: "Format, beautify, and validate complex nested JSON payloads for API debugging.",
    priority: "High",
    mappedToolSlug: "json-formatter"
  },
  {
    id: "kw-12",
    keyword: "convert csv to json online",
    searchIntent: "Transactional",
    relatedCategory: "Developer Tools",
    suggestedPage: "/csv-to-json-converter",
    contentOpportunity: "Convert spreadsheet CSV exports into clean JSON array objects for frontend apps.",
    priority: "High",
    mappedToolSlug: "csv-to-json-converter"
  },
  {
    id: "kw-13",
    keyword: "sql query formatter online",
    searchIntent: "Transactional",
    relatedCategory: "Developer Tools",
    suggestedPage: "/sql-formatter",
    contentOpportunity: "Format messy SQL queries with syntax highlighting and uppercase keyword formatting.",
    priority: "Medium",
    mappedToolSlug: "sql-formatter"
  },
  {
    id: "kw-14",
    keyword: "word count and character counter",
    searchIntent: "Transactional",
    relatedCategory: "Text Tools",
    suggestedPage: "/word-counter",
    contentOpportunity: "Real-time word, sentence, and character count with reading time estimates for essays.",
    priority: "High",
    mappedToolSlug: "word-counter",
    mappedArticleSlug: "how-to-count-words-characters-reading-time"
  },
  {
    id: "kw-15",
    keyword: "generate qr code for wifi",
    searchIntent: "Transactional",
    relatedCategory: "QR & Barcode",
    suggestedPage: "/wifi-qr-code-generator",
    contentOpportunity: "Allow guests to instantly scan and connect to home/office WiFi networks.",
    priority: "High",
    mappedToolSlug: "wifi-qr-code-generator"
  },
  {
    id: "kw-16",
    keyword: "percentage calculator increase decrease",
    searchIntent: "Informational",
    relatedCategory: "Calculators",
    suggestedPage: "/percentage-calculator",
    contentOpportunity: "Calculate percentage change, growth rate, and discount margins with math formulas.",
    priority: "High",
    mappedToolSlug: "percentage-calculator",
    mappedArticleSlug: "how-to-calculate-percentage-increase-decrease"
  },
  {
    id: "kw-17",
    keyword: "bmi calculator healthy weight range",
    searchIntent: "Informational",
    relatedCategory: "Calculators",
    suggestedPage: "/bmi-calculator",
    contentOpportunity: "Calculate Body Mass Index and view WHO health range categories.",
    priority: "High",
    mappedToolSlug: "bmi-calculator",
    mappedArticleSlug: "how-to-calculate-bmi-healthy-weight-ranges"
  },
  {
    id: "kw-18",
    keyword: "loan emi calculator online",
    searchIntent: "Transactional",
    relatedCategory: "Calculators",
    suggestedPage: "/loan-emi-calculator",
    contentOpportunity: "Calculate monthly EMI payments, total interest payable, and amortization schedules.",
    priority: "High",
    mappedToolSlug: "loan-emi-calculator"
  },
  {
    id: "kw-19",
    keyword: "extract text from pdf ocr",
    searchIntent: "Transactional",
    relatedCategory: "PDF Tools",
    suggestedPage: "/pdf-ocr-extractor",
    contentOpportunity: "Perform browser-based OCR text recognition on scanned PDF documents.",
    priority: "High",
    mappedToolSlug: "pdf-ocr-extractor"
  },
  {
    id: "kw-20",
    keyword: "add text watermark to pdf",
    searchIntent: "Transactional",
    relatedCategory: "PDF Tools",
    suggestedPage: "/pdf-watermark-text",
    contentOpportunity: "Overlay draft, confidential, or custom text stamps onto PDF pages.",
    priority: "Medium",
    mappedToolSlug: "pdf-watermark-text"
  },
  {
    id: "kw-21",
    keyword: "extract images from pdf file",
    searchIntent: "Transactional",
    relatedCategory: "PDF Tools",
    suggestedPage: "/pdf-extract-images",
    contentOpportunity: "Extract high-resolution embedded image assets from PDF files into JPGs.",
    priority: "High",
    mappedToolSlug: "pdf-extract-images"
  },
  {
    id: "kw-22",
    keyword: "convert mp4 to mp3 online",
    searchIntent: "Transactional",
    relatedCategory: "Media Tools",
    suggestedPage: "/audio-mp3-converter",
    contentOpportunity: "Extract 320kbps audio tracks from MP4 video lectures, podcasts, and videos.",
    priority: "High",
    mappedToolSlug: "audio-mp3-converter",
    mappedArticleSlug: "how-to-convert-mp4-to-mp3-extract-audio"
  },
  {
    id: "kw-23",
    keyword: "generate xml sitemap free",
    searchIntent: "Transactional",
    relatedCategory: "SEO Tools",
    suggestedPage: "/xml-sitemap-generator",
    contentOpportunity: "Build Google-compliant XML sitemaps for blogs and web apps.",
    priority: "High",
    mappedToolSlug: "xml-sitemap-generator"
  },
  {
    id: "kw-24",
    keyword: "generate robots txt file",
    searchIntent: "Transactional",
    relatedCategory: "SEO Tools",
    suggestedPage: "/robots-txt-generator",
    contentOpportunity: "Generate robots.txt crawl rules and sitemap directives for search engines.",
    priority: "Medium",
    mappedToolSlug: "robots-txt-generator"
  },
  {
    id: "kw-25",
    keyword: "jwt token decoder online",
    searchIntent: "Transactional",
    relatedCategory: "Developer Tools",
    suggestedPage: "/jwt-decoder",
    contentOpportunity: "Decode JSON Web Tokens (JWT) payload headers and claims without sending tokens online.",
    priority: "High",
    mappedToolSlug: "jwt-decoder"
  },
  {
    id: "kw-26",
    keyword: "cidr subnet mask calculator",
    searchIntent: "Transactional",
    relatedCategory: "Developer Tools",
    suggestedPage: "/subnet-calculator",
    contentOpportunity: "Calculate usable host IP ranges, netmasks, and broadcast addresses.",
    priority: "Medium",
    mappedToolSlug: "subnet-calculator"
  },
  {
    id: "kw-27",
    keyword: "text diff compare two files",
    searchIntent: "Transactional",
    relatedCategory: "Text Tools",
    suggestedPage: "/text-diff-checker",
    contentOpportunity: "Compare side-by-side text or code snippets with highlighted line diffs.",
    priority: "High",
    mappedToolSlug: "text-diff-checker"
  },
  {
    id: "kw-28",
    keyword: "convert markdown to html online",
    searchIntent: "Transactional",
    relatedCategory: "File Tools",
    suggestedPage: "/markdown-to-html",
    contentOpportunity: "Convert Markdown syntax (.md) into sanitized HTML code ready for publishing.",
    priority: "Medium",
    mappedToolSlug: "markdown-to-html"
  },
  {
    id: "kw-29",
    keyword: "generate secure random password",
    searchIntent: "Transactional",
    relatedCategory: "Security Tools",
    suggestedPage: "/password-generator",
    contentOpportunity: "Generate strong passwords with custom length, symbols, numbers, and entropy calculation.",
    priority: "High",
    mappedToolSlug: "password-generator"
  },
  {
    id: "kw-30",
    keyword: "base64 encode decode online",
    searchIntent: "Transactional",
    relatedCategory: "Developer Tools",
    suggestedPage: "/base64-encoder-decoder",
    contentOpportunity: "Encode text or binary data to Base64 and decode Base64 back to raw strings.",
    priority: "High",
    mappedToolSlug: "base64-encoder-decoder"
  },
  {
    id: "kw-31",
    keyword: "unit converter length mass temp",
    searchIntent: "Transactional",
    relatedCategory: "Converters",
    suggestedPage: "/unit-converter",
    contentOpportunity: "Convert units across length, mass, volume, temperature, and data storage.",
    priority: "High",
    mappedToolSlug: "unit-converter"
  },
  {
    id: "kw-32",
    keyword: "convert pdf to transparent png",
    searchIntent: "Transactional",
    relatedCategory: "PDF Tools",
    suggestedPage: "/pdf-to-png",
    contentOpportunity: "Convert vector PDF graphics into high-resolution transparent PNG images.",
    priority: "High",
    mappedToolSlug: "pdf-to-png"
  },
  {
    id: "kw-33",
    keyword: "create zip archive online",
    searchIntent: "Transactional",
    relatedCategory: "File Tools",
    suggestedPage: "/zip-archive-creator",
    contentOpportunity: "Compress multiple files into a single downloadable .zip archive in your browser.",
    priority: "High",
    mappedToolSlug: "zip-archive-creator"
  },
  {
    id: "kw-34",
    keyword: "schema org markup generator",
    searchIntent: "Transactional",
    relatedCategory: "SEO Tools",
    suggestedPage: "/schema-generator",
    contentOpportunity: "Generate JSON-LD structured data for Articles, Products, Organizations, and FAQs.",
    priority: "Medium",
    mappedToolSlug: "schema-generator"
  },
  {
    id: "kw-35",
    keyword: "rotate pdf pages online free",
    searchIntent: "Transactional",
    relatedCategory: "PDF Tools",
    suggestedPage: "/pdf-rotate",
    contentOpportunity: "Rotate upside-down or sideways PDF pages by 90, 180, or 270 degrees.",
    priority: "High",
    mappedToolSlug: "pdf-rotate"
  },
  {
    id: "kw-36",
    keyword: "color palette sampler hex rgb",
    searchIntent: "Transactional",
    relatedCategory: "Image Tools",
    suggestedPage: "/color-palette-generator",
    contentOpportunity: "Extract dominant color palettes from uploaded images into HEX and RGB codes.",
    priority: "Medium",
    mappedToolSlug: "color-palette-generator"
  }
];
