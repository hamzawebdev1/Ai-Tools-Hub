export interface TrendingToolOpportunity {
  id: string;
  toolName: string;
  category: string;
  userProblem: string;
  searchIntent: "Transactional" | "Informational";
  trendEvidence: string;
  worksIndependently: boolean; // 100% Client-side JS/Wasm
  requiresExternalApi: boolean; // Must be false for inclusion
  seoOpportunity: string;
  difficulty: "Low" | "Medium" | "High";
  status: "Implemented" | "Planned" | "Under Evaluation";
  mappedSlug?: string;
}

export const TRENDING_TOOL_OPPORTUNITIES: TrendingToolOpportunity[] = [
  {
    id: "opp-1",
    toolName: "PDF Password Protector",
    category: "PDF Tools",
    userProblem: "Users need to encrypt sensitive PDF documents with AES-256 passwords before sharing over email or cloud storage.",
    searchIntent: "Transactional",
    trendEvidence: "High rising trend in financial and legal privacy document protection searches.",
    worksIndependently: true,
    requiresExternalApi: false,
    seoOpportunity: "High search demand for 'encrypt pdf online free', 'add password to pdf'.",
    difficulty: "Low",
    status: "Implemented",
    mappedSlug: "pdf-protect"
  },
  {
    id: "opp-2",
    toolName: "Markdown to PDF Converter",
    category: "PDF Tools",
    userProblem: "Developers and technical writers want to render Markdown files (.md) directly into styled PDF documents.",
    searchIntent: "Transactional",
    trendEvidence: "Rising demand among documentation authors and GitHub users.",
    worksIndependently: true,
    requiresExternalApi: false,
    seoOpportunity: "Moderate competition, high intent developer keyword.",
    difficulty: "Medium",
    status: "Implemented",
    mappedSlug: "markdown-to-pdf"
  },
  {
    id: "opp-3",
    toolName: "JSON Formatter & Validator",
    category: "Developer Tools",
    userProblem: "Developers need to format, beautify, inspect, and validate nested JSON API payloads locally.",
    searchIntent: "Transactional",
    trendEvidence: "High persistent global search volume across all developer demographics.",
    worksIndependently: true,
    requiresExternalApi: false,
    seoOpportunity: "Core developer cluster anchor keyword with huge backlink potential.",
    difficulty: "Low",
    status: "Implemented",
    mappedSlug: "json-formatter"
  },
  {
    id: "opp-4",
    toolName: "JWT Token Decoder",
    category: "Developer Tools",
    userProblem: "Security engineers and full-stack devs need to inspect JWT headers and claims safely in browser without sending tokens over wire.",
    searchIntent: "Transactional",
    trendEvidence: "Rapidly growing demand due to zero-trust security audits.",
    worksIndependently: true,
    requiresExternalApi: false,
    seoOpportunity: "High intent, security-conscious developer keyword.",
    difficulty: "Low",
    status: "Implemented",
    mappedSlug: "jwt-decoder"
  },
  {
    id: "opp-5",
    toolName: "WebP to JPG & PNG Converter",
    category: "Image Tools",
    userProblem: "Users downloading images from Google Chrome often get `.webp` files that legacy software or graphics apps cannot open.",
    searchIntent: "Transactional",
    trendEvidence: "Sharp upward trend correlated with Chrome's universal WebP image serving.",
    worksIndependently: true,
    requiresExternalApi: false,
    seoOpportunity: "Massive search volume with clear transactional intent.",
    difficulty: "Low",
    status: "Implemented",
    mappedSlug: "webp-to-jpg"
  },
  {
    id: "opp-6",
    toolName: "SVG to PNG Converter",
    category: "Image Tools",
    userProblem: "Designers and UI developers need to convert scalable vector graphics into high-DPI raster PNG images.",
    searchIntent: "Transactional",
    trendEvidence: "Steady high-volume search query from UI/UX and web development workflows.",
    worksIndependently: true,
    requiresExternalApi: false,
    seoOpportunity: "High volume, easy client-side canvas implementation.",
    difficulty: "Low",
    status: "Implemented",
    mappedSlug: "svg-to-png-converter"
  },
  {
    id: "opp-7",
    toolName: "Base64 Encoder & Decoder",
    category: "Developer Tools",
    userProblem: "Developers needing instant encoding/decoding of strings and binary assets into RFC-4648 Base64 strings.",
    searchIntent: "Transactional",
    trendEvidence: "Evergreen developer query with high daily repetition.",
    worksIndependently: true,
    requiresExternalApi: false,
    seoOpportunity: "High search volume, staple developer utility.",
    difficulty: "Low",
    status: "Implemented",
    mappedSlug: "base64-encoder-decoder"
  },
  {
    id: "opp-8",
    toolName: "Loan EMI Calculator",
    category: "Calculators",
    userProblem: "Home loan and personal loan applicants needing exact monthly installment schedules and total interest calculations.",
    searchIntent: "Transactional",
    trendEvidence: "Extremely high financial search volume across global markets.",
    worksIndependently: true,
    requiresExternalApi: false,
    seoOpportunity: "High financial CPC value and high query volume.",
    difficulty: "Low",
    status: "Implemented",
    mappedSlug: "loan-emi-calculator"
  }
];
