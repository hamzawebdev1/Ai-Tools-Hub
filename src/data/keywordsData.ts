export type KeywordIntent = "Transactional" | "Informational" | "Commercial" | "Navigational";
export type KeywordType = "Primary" | "Secondary" | "Long-tail" | "Question" | "Tool-intent";
export type TrendStatus = "TRENDING" | "RISING" | "STABLE" | "UNKNOWN";
export type KeywordPriority = "High" | "Medium" | "Low";
export type KeywordItemStatus = "Active" | "Pending" | "Inactive";

export interface KeywordItem {
  id: string;
  keyword: string;
  category: string;
  searchIntent: KeywordIntent;
  keywordType: KeywordType;
  trendStatus: TrendStatus;
  searchVolumeNote: string;
  contentOpportunity: string;
  priority: KeywordPriority;
  status: KeywordItemStatus;
  mappedToolSlug?: string;
  mappedArticleSlug?: string;
  suggestedPage?: string;
  updatedAt?: string;
}

export const SEO_KEYWORDS_DATA: KeywordItem[] = [
  // PDF Tools Cluster
  {
    id: "kw-1",
    keyword: "compress pdf to 200kb online",
    category: "PDF Tools",
    searchIntent: "Transactional",
    keywordType: "Long-tail",
    trendStatus: "RISING",
    searchVolumeNote: "High demand for online job application portals with 200KB limits.",
    contentOpportunity: "Target job applicants needing fast, client-side PDF compression down to 200KB.",
    priority: "High",
    status: "Active",
    mappedToolSlug: "pdf-compress",
    mappedArticleSlug: "how-to-compress-pdf-without-losing-quality",
    suggestedPage: "/pdf-compress"
  },
  {
    id: "kw-2",
    keyword: "split pdf pages free without registration",
    category: "PDF Tools",
    searchIntent: "Transactional",
    keywordType: "Long-tail",
    trendStatus: "STABLE",
    searchVolumeNote: "Consistent search queries for free browser PDF page extraction.",
    contentOpportunity: "Provide single-page and range extraction without watermarks or file limits.",
    priority: "High",
    status: "Active",
    mappedToolSlug: "split-pdf-pages",
    mappedArticleSlug: "how-to-split-and-extract-pdf-pages",
    suggestedPage: "/split-pdf-pages"
  },
  {
    id: "kw-3",
    keyword: "encrypt pdf with password offline",
    category: "PDF Tools",
    searchIntent: "Transactional",
    keywordType: "Tool-intent",
    trendStatus: "TRENDING",
    searchVolumeNote: "Growing interest in browser AES-256 PDF encryption for data privacy.",
    contentOpportunity: "Highlight zero-server document privacy for sensitive financial and legal files.",
    priority: "High",
    status: "Active",
    mappedToolSlug: "pdf-protect",
    suggestedPage: "/pdf-protect"
  },
  {
    id: "kw-4",
    keyword: "remove pdf password online",
    category: "PDF Tools",
    searchIntent: "Transactional",
    keywordType: "Tool-intent",
    trendStatus: "STABLE",
    searchVolumeNote: "Frequent search queries for unlocking owner-restricted PDF files.",
    contentOpportunity: "Help users unlock PDF permissions for editing and printing.",
    priority: "High",
    status: "Active",
    mappedToolSlug: "pdf-unlock",
    suggestedPage: "/pdf-unlock"
  },
  {
    id: "kw-5",
    keyword: "merge pdf files free",
    category: "PDF Tools",
    searchIntent: "Transactional",
    keywordType: "Primary",
    trendStatus: "STABLE",
    searchVolumeNote: "High search volume across all regions.",
    contentOpportunity: "Combine multiple PDF chapters, invoices, or scanned receipts into one file.",
    priority: "High",
    status: "Active",
    mappedToolSlug: "pdf-merge",
    mappedArticleSlug: "how-to-merge-pdf-files-into-one",
    suggestedPage: "/pdf-merge"
  },
  {
    id: "kw-6",
    keyword: "how to compress pdf without losing quality",
    category: "PDF Tools",
    searchIntent: "Informational",
    keywordType: "Question",
    trendStatus: "RISING",
    searchVolumeNote: "Search volume verified via educational article searches.",
    contentOpportunity: "Comprehensive guide explaining vector compression vs raster downsampling.",
    priority: "High",
    status: "Active",
    mappedToolSlug: "pdf-compress",
    mappedArticleSlug: "how-to-compress-pdf-without-losing-quality",
    suggestedPage: "/blog/how-to-compress-pdf-without-losing-quality"
  },

  // Developer Tools Cluster
  {
    id: "kw-7",
    keyword: "json formatter and validator online",
    category: "Developer Tools",
    searchIntent: "Transactional",
    keywordType: "Primary",
    trendStatus: "TRENDING",
    searchVolumeNote: "High search interest among web and backend software developers.",
    contentOpportunity: "Format, beautify, and validate complex nested JSON payloads with syntax checking.",
    priority: "High",
    status: "Active",
    mappedToolSlug: "json-formatter",
    mappedArticleSlug: "how-to-format-and-validate-json-online",
    suggestedPage: "/json-formatter"
  },
  {
    id: "kw-8",
    keyword: "what is base64 encoding",
    category: "Developer Tools",
    searchIntent: "Informational",
    keywordType: "Question",
    trendStatus: "STABLE",
    searchVolumeNote: "Steady educational search query for computer science and web dev topics.",
    contentOpportunity: "Explain binary-to-text encoding and security considerations in depth.",
    priority: "High",
    status: "Active",
    mappedToolSlug: "base64-encoder-decoder",
    mappedArticleSlug: "what-is-base64-encoding-how-it-works",
    suggestedPage: "/blog/what-is-base64-encoding-how-it-works"
  },
  {
    id: "kw-9",
    keyword: "base64 encoder decoder online",
    category: "Developer Tools",
    searchIntent: "Transactional",
    keywordType: "Tool-intent",
    trendStatus: "STABLE",
    searchVolumeNote: "High daily developer tool usage.",
    contentOpportunity: "Instant client-side Base64 string and file encoding/decoding.",
    priority: "High",
    status: "Active",
    mappedToolSlug: "base64-encoder-decoder",
    suggestedPage: "/base64-encoder-decoder"
  },
  {
    id: "kw-10",
    keyword: "jwt token decoder online",
    category: "Developer Tools",
    searchIntent: "Transactional",
    keywordType: "Tool-intent",
    trendStatus: "RISING",
    searchVolumeNote: "Surging demand for secure, local JWT header and payload decoding.",
    contentOpportunity: "Decode JSON Web Tokens securely without sending sensitive tokens to remote servers.",
    priority: "High",
    status: "Active",
    mappedToolSlug: "jwt-decoder",
    suggestedPage: "/jwt-decoder"
  },
  {
    id: "kw-11",
    keyword: "generate random uuid v4",
    category: "Developer Tools",
    searchIntent: "Transactional",
    keywordType: "Tool-intent",
    trendStatus: "STABLE",
    searchVolumeNote: "Search volume verified via developer API key generation tasks.",
    contentOpportunity: "Bulk RFC 4122 compliant UUID v4 string generator.",
    priority: "High",
    status: "Active",
    mappedToolSlug: "uuid-generator",
    suggestedPage: "/uuid-generator"
  },
  {
    id: "kw-12",
    keyword: "sha256 hash generator online",
    category: "Developer Tools",
    searchIntent: "Transactional",
    keywordType: "Tool-intent",
    trendStatus: "STABLE",
    searchVolumeNote: "Regular cryptographic verification searches.",
    contentOpportunity: "Generate MD5, SHA-1, SHA-256, and SHA-512 hashes instantly.",
    priority: "High",
    status: "Active",
    mappedToolSlug: "hash-generator",
    suggestedPage: "/hash-generator"
  },

  // Image Tools Cluster
  {
    id: "kw-13",
    keyword: "compress image to 20kb online",
    category: "Image Tools",
    searchIntent: "Transactional",
    keywordType: "Long-tail",
    trendStatus: "RISING",
    searchVolumeNote: "High seasonal demand for online candidate photo uploads under 20KB.",
    contentOpportunity: "Assist job & entrance exam applicants needing precise image compression.",
    priority: "High",
    status: "Active",
    mappedToolSlug: "image-compressor",
    mappedArticleSlug: "how-to-compress-images-to-20kb-100kb",
    suggestedPage: "/image-compressor"
  },
  {
    id: "kw-14",
    keyword: "convert webp to jpg online",
    category: "Image Tools",
    searchIntent: "Transactional",
    keywordType: "Primary",
    trendStatus: "RISING",
    searchVolumeNote: "Search volume verified due to widespread Google WebP image format adoption.",
    contentOpportunity: "Fast batch conversion of saved WebP images into standard JPG/PNG formats.",
    priority: "High",
    status: "Active",
    mappedToolSlug: "webp-to-jpg",
    mappedArticleSlug: "how-to-convert-webp-to-jpg-and-png",
    suggestedPage: "/webp-to-jpg"
  },
  {
    id: "kw-15",
    keyword: "crop image to circle online",
    category: "Image Tools",
    searchIntent: "Transactional",
    keywordType: "Secondary",
    trendStatus: "STABLE",
    searchVolumeNote: "Consistent demand for circular social media avatar cropping.",
    contentOpportunity: "Crop images into circular profile photos for LinkedIn, X, and resumes.",
    priority: "Medium",
    status: "Active",
    mappedToolSlug: "image-cropper",
    suggestedPage: "/image-cropper"
  },

  // Calculators Cluster
  {
    id: "kw-16",
    keyword: "loan emi calculator online",
    category: "Calculators",
    searchIntent: "Transactional",
    keywordType: "Primary",
    trendStatus: "STABLE",
    searchVolumeNote: "Extremely high search volume across banking and mortgage queries.",
    contentOpportunity: "Calculate monthly installment payments with detailed principal/interest tables.",
    priority: "High",
    status: "Active",
    mappedToolSlug: "loan-emi-calculator",
    suggestedPage: "/loan-emi-calculator"
  },
  {
    id: "kw-17",
    keyword: "how to calculate percentage increase decrease",
    category: "Calculators",
    searchIntent: "Informational",
    keywordType: "Question",
    trendStatus: "STABLE",
    searchVolumeNote: "High academic and business interest in percentage growth math formulas.",
    contentOpportunity: "Step-by-step mathematical guide and calculator tool integration.",
    priority: "High",
    status: "Active",
    mappedToolSlug: "percentage-calculator",
    mappedArticleSlug: "how-to-calculate-percentage-increase-decrease",
    suggestedPage: "/blog/how-to-calculate-percentage-increase-decrease"
  },
  {
    id: "kw-18",
    keyword: "bmi calculator healthy weight range",
    category: "Calculators",
    searchIntent: "Informational",
    keywordType: "Long-tail",
    trendStatus: "STABLE",
    searchVolumeNote: "Popular wellness search topic.",
    contentOpportunity: "Compute body mass index and display official WHO health categories.",
    priority: "High",
    status: "Active",
    mappedToolSlug: "bmi-calculator",
    mappedArticleSlug: "how-to-calculate-bmi-healthy-weight-ranges",
    suggestedPage: "/bmi-calculator"
  },

  // Text Tools Cluster
  {
    id: "kw-19",
    keyword: "word count and character counter online",
    category: "Text Tools",
    searchIntent: "Transactional",
    keywordType: "Primary",
    trendStatus: "STABLE",
    searchVolumeNote: "High search volume among students, writers, and SEO marketers.",
    contentOpportunity: "Real-time word, sentence, and character counter with estimated reading time.",
    priority: "High",
    status: "Active",
    mappedToolSlug: "word-counter",
    mappedArticleSlug: "how-to-count-words-characters-reading-time",
    suggestedPage: "/word-counter"
  },

  // SEO Tools Cluster
  {
    id: "kw-20",
    keyword: "xml sitemap generator free",
    category: "SEO Tools",
    searchIntent: "Transactional",
    keywordType: "Tool-intent",
    trendStatus: "STABLE",
    searchVolumeNote: "Search volume not verified directly via Google API, research-backed demand.",
    contentOpportunity: "Generate valid Google-compliant XML sitemaps for blogs and web applications.",
    priority: "High",
    status: "Active",
    mappedToolSlug: "xml-sitemap-generator",
    suggestedPage: "/xml-sitemap-generator"
  },
  {
    id: "kw-21",
    keyword: "robots txt generator for website",
    category: "SEO Tools",
    searchIntent: "Transactional",
    keywordType: "Tool-intent",
    trendStatus: "STABLE",
    searchVolumeNote: "Search volume not verified directly via Google API, research-backed demand.",
    contentOpportunity: "Build robots.txt crawl rules and sitemap directives.",
    priority: "Medium",
    status: "Active",
    mappedToolSlug: "robots-txt-generator",
    suggestedPage: "/robots-txt-generator"
  }
];
