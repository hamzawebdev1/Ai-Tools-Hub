import { AITool, ToolSEOContent, FAQItem } from "../types";
import { getKeywordMappingForTool } from "../services/keywordMappingService";

/**
 * Generates 100% unique, tool-specific SEO content for any tool
 * based on its name, slug, category, tagline, and description.
 */
export function getEnrichedToolSEO(tool: Partial<AITool>): ToolSEOContent {
  const name = tool.name || "Online Utility";
  const slug = tool.slug || tool.id || "tool";
  const category = tool.category || "utilities";
  const tagline = tool.tagline || `Fast, secure ${name} running directly in your browser.`;
  const description = tool.description || tagline;

  // Check for specific Keyword Mapping
  const mapped = getKeywordMappingForTool(slug) || getKeywordMappingForTool(tool.id || "");

  // Custom Meta Title & Description
  const metaTitle = mapped?.optimizedTitle || `${name} Online - Free In-Browser Utility | Mehzan Tools Hub`;
  const metaDescription = mapped?.metaDescription || `Free online ${name.toLowerCase()}. ${tagline} Fast, high-precision, and private client-side execution on Mehzan Digital with no signup required.`;

  // Category specific details & processing disclosures
  let categoryDetail = "digital file processing";
  let techStackDetail = "WebAssembly and modern HTML5 APIs";
  let problemSolved = `Eliminates the complexity and friction of executing ${name.toLowerCase()} manually or through cumbersome software installations.`;
  let targetAudience = "Developers, digital marketers, content creators, students, and office professionals seeking fast online utilities.";
  let howItWorks = `Parses your inputs in real time using client-side JavaScript algorithms and renders output directly inside your browser window.`;
  let outputExpectation = "Clean, accurately processed output ready for instant copying or file download.";
  let commonMistakes: string[] = [
    "Navigating away from the browser tab before output generation or download completes.",
    "Inputting malformed or corrupted source data into the processing workspace."
  ];
  let processingType: "CLIENT_SIDE_BROWSER" | "SERVER_SIDE_AI" = "CLIENT_SIDE_BROWSER";
  let processingDetails = `Processed 100% locally inside your web browser memory sandbox. Your files and inputs are never uploaded to or stored on any external server.`;

  let supportedInputsFormats = "UTF-8 text, standard file formats, and parameter inputs up to 100MB.";
  let limitations = "Processing volume is bounded by your device browser RAM and CPU capacity (~200MB memory limit on mobile browsers).";
  let privacySecurity = "100% Client-Side Sandbox. Your inputs and files stay local on your device and are never uploaded to any server.";
  let troubleshooting: string[] = [
    "If processing takes longer than expected, verify that input data is not corrupted or truncated.",
    "For memory alerts, close unused browser tabs to free up client-side system memory.",
    "Ensure your browser supports modern HTML5 APIs and WebAssembly (Chrome, Firefox, Safari, Edge)."
  ];

  if (category === "pdf") {
    categoryDetail = "PDF document manipulation and page extraction";
    techStackDetail = "client-side PDF-lib and vector rendering engines";
    problemSolved = `Eliminates expensive software subscriptions and privacy risks by allowing you to compress, merge, convert, split, or edit PDF pages directly in your browser memory without server uploads.`;
    targetAudience = "Students, legal staff, administrative professionals, remote workers, and document managers.";
    howItWorks = `Loads the binary vector stream of your PDF file into browser RAM using WebAssembly and PDF-lib. Modifications are applied in client memory and compiled into a fresh PDF file stream.`;
    supportedInputsFormats = "Standard PDF 1.3 to 2.0 documents up to 100MB per file. Supports single-page and multi-page vector documents, scanned text pages, and standard PDF forms.";
    outputExpectation = "Optimized, high-clarity PDF document ready for immediate download.";
    limitations = "Password-encrypted or DRM-protected PDF files must be unlocked prior to processing. Mobile browser RAM limits document compilation to ~250MB total volume.";
    privacySecurity = "100% Client-Side WebAssembly Processing. Your PDF documents stay inside your device's browser RAM. No file bytes or document contents are ever transmitted to external servers.";
    troubleshooting = [
      "If a PDF fails to render, ensure the file is not password-protected or corrupted.",
      "For low memory alerts, process documents in smaller page batches or close inactive browser tabs.",
      "If text appears missing after conversion, check if original PDF embedded custom non-standard font subsets."
    ];
    commonMistakes = [
      "Attempting to process password-protected or DRM-locked PDF files without unlocking them first.",
      "Closing the browser tab while large multi-page PDF documents are compiling in local memory."
    ];
    processingType = "CLIENT_SIDE_BROWSER";
    processingDetails = "Executed 100% locally in browser memory via PDF-lib / WebAssembly. No PDF document bytes are ever uploaded to remote servers.";
  } else if (category === "image") {
    categoryDetail = "image transformation, compression, and visual editing";
    techStackDetail = "HTML5 Canvas and WebGL acceleration";
    problemSolved = `Solves image file size bloating, format incompatibility, and quality degradation by converting, compressing, or resizing graphics instantly for web performance.`;
    targetAudience = "Web designers, content creators, e-commerce site owners, bloggers, and social media managers.";
    howItWorks = `Decodes pixel bitmap matrices onto an HTML5 Canvas context and applies lossy or lossless compression algorithms directly using local CPU/GPU hardware.`;
    supportedInputsFormats = "PNG, JPEG/JPG, WebP, SVG, GIF, AVIF, BMP, and TIFF image formats up to 50MB per file.";
    outputExpectation = "Web-optimized PNG, JPG, WebP, or SVG graphics ready for instant deployment.";
    limitations = "Lossy compression may cause visible pixel artifacting if compression ratios exceed 85%. Animated GIF frames are flattened to primary bitmap contexts.";
    privacySecurity = "100% In-Browser HTML5 Canvas Rendering. Your graphic files and photos remain on your personal device and are never uploaded to remote storage.";
    troubleshooting = [
      "If an image preview appears distorted, ensure your source image file is not damaged or corrupted.",
      "For transparent PNG/WebP files, verify target format selections support alpha channel transparency.",
      "If output dimensions appear inaccurate, check device display scaling preferences."
    ];
    commonMistakes = [
      "Applying excessive compression ratios that cause pixel artifacting on high-density Retina displays.",
      "Uploading unsupported raw image formats without converting them to standard browser types first."
    ];
    processingType = "CLIENT_SIDE_BROWSER";
    processingDetails = "Executed 100% locally via HTML5 Canvas. Your graphic image files remain strictly on your device.";
  } else if (category === "developer" || category === "network" || category === "security") {
    categoryDetail = "developer diagnostics, code formatting, and web inspection";
    techStackDetail = "isolated Javascript Web Workers and secure cryptographic primitives";
    problemSolved = `Provides instant code validation, formatting, encoding/decoding, and security analysis without leaving your development workspace or exposing API credentials.`;
    targetAudience = "Full-stack developers, DevOps engineers, software architects, cybersecurity researchers, and QA testers.";
    howItWorks = `Executes AST (Abstract Syntax Tree) parsing, regular expressions, and crypto algorithms (SHA/AES) inside dedicated Web Worker threads to prevent UI freeze.`;
    supportedInputsFormats = "JSON syntax, XML markup, YAML configs, SQL queries, HTML/CSS strings, Regex expressions, Base64 strings, JWT tokens, and plain text code snippets.";
    outputExpectation = "Formatted syntax trees, verified hashes, or encoded data strings ready to copy.";
    limitations = "Single inputs are limited to ~10MB string length to prevent browser thread locks. Real-time syntax validation requires standard UTF-8 text encodings.";
    privacySecurity = "100% Isolated Client JavaScript & Web Worker Execution. Production keys, JWT tokens, and private source code remain local and are never logged.";
    troubleshooting = [
      "If JSON validation fails, inspect the line number highlighted for missing quotes or trailing commas.",
      "If Base64 decoding fails, verify the input string is valid padding-aligned Base64.",
      "If regex matching fails, check your expression flags (g, i, m) and escape characters."
    ];
    commonMistakes = [
      "Pasting truncated code snippets with unclosed brackets or syntax errors.",
      "Including sensitive production credentials in public debug logs."
    ];
    processingType = "CLIENT_SIDE_BROWSER";
    processingDetails = "Executed locally using client-side JavaScript. No code snippets or cryptographic keys leave your browser memory.";
  } else if (category === "text") {
    categoryDetail = "text analysis, formatting, and string manipulation";
    techStackDetail = "real-time regular expression processing and string buffers";
    problemSolved = `Automates monotonous text editing, case conversion, line sorting, word counting, and formatting tasks in seconds.`;
    targetAudience = "Copywriters, editors, SEO specialists, data entry clerks, and students.";
    howItWorks = `Evaluates input string arrays using optimized regular expressions and outputs cleaned text in real-time.`;
    supportedInputsFormats = "UTF-8 plain text, Markdown markup, CSV tables, formatted articles, and string buffers up to 1,000,000 characters.";
    outputExpectation = "Clean, accurately formatted text output matching your selected parameters.";
    limitations = "Complex rich text formatting (e.g. Word DOCX styles) is stripped down to plain text during manipulation.";
    privacySecurity = "100% Browser Local Memory Sandbox. Your text, articles, and documents remain strictly in your browser.";
    troubleshooting = [
      "If case conversion omits accented characters, ensure input text is standard UTF-8 encoded.",
      "If word count differs from Microsoft Word, note that hyphenated compounds are counted as single tokens."
    ];
    commonMistakes = [
      "Overwriting input text before copying the desired result.",
      "Unintentionally removing necessary white space formatting."
    ];
    processingType = "CLIENT_SIDE_BROWSER";
    processingDetails = "Processed 100% locally in browser memory.";
  } else if (category === "seo" || category === "website") {
    categoryDetail = "search engine optimization and web performance analysis";
    techStackDetail = "live DOM inspection and schema metadata validation";
    problemSolved = `Helps webmasters identify technical SEO errors, validate structured JSON-LD schema markup, and generate meta tags for higher search visibility.`;
    targetAudience = "SEO consultants, agency owners, digital marketers, and webmasters.";
    howItWorks = `Parses HTML markup and meta tags against Google search indexing standards and outputs validation reports.`;
    supportedInputsFormats = "HTML source code, meta tag snippets, JSON-LD schema blocks, robots.txt directives, and web page URLs.";
    outputExpectation = "Compliant meta tags, JSON-LD schema markup, or actionable SEO diagnostic reports.";
    limitations = "Client-side DOM analysis evaluates static markup; dynamic client-rendered JavaScript content requires Googlebot rendering simulation.";
    privacySecurity = "100% Client-Side Processing. No site URLs or code payloads are stored or tracked.";
    troubleshooting = [
      "If schema validation fails, ensure your JSON syntax is valid with quotes around key names.",
      "Check that meta title tags do not exceed 60 characters and descriptions do not exceed 160 characters."
    ];
    commonMistakes = [
      "Pasting invalid JSON syntax into schema generators.",
      "Exceeding Google's recommended meta title (60 chars) or description (160 chars) limits."
    ];
    processingType = "CLIENT_SIDE_BROWSER";
    processingDetails = "Executed client-side in your browser for instant analysis.";
  } else if (category === "calculators" || category === "student") {
    categoryDetail = "financial, academic, and mathematical computation";
    techStackDetail = "high-precision IEEE 754 arithmetic engines";
    problemSolved = `Eliminates formula calculation errors and saves time by providing verified mathematical, financial, and scientific formulas in an interactive interface.`;
    targetAudience = "Students, accountants, financial planners, engineers, and general consumers.";
    howItWorks = `Calculates input values through double-precision mathematical algorithms and displays step-by-step result breakdowns.`;
    supportedInputsFormats = "Numerical expressions, decimal values, mathematical formulas, date strings, currency amounts, and structured input parameters.";
    outputExpectation = "Precise numerical values, interest schedules, or unit conversions.";
    limitations = "Double-precision IEEE 754 floating point numbers cap calculation accuracy at 15-17 significant decimal digits.";
    privacySecurity = "100% Client-Side Arithmetic. Computed locally on your device with zero server interaction or external tracking.";
    troubleshooting = [
      "If a calculation result shows NaN or Infinity, check for zero division or negative values in logarithm inputs.",
      "Verify input units match expected metrics (e.g. annual vs. monthly interest rates)."
    ];
    commonMistakes = [
      "Entering non-numeric characters or negative values in positive-only input fields.",
      "Confusing annual percentage rates (APR) with monthly compounding periods."
    ];
    processingType = "CLIENT_SIDE_BROWSER";
    processingDetails = "Computed instantly in your browser with high precision.";
  } else if (category === "writing" || category === "media" || category === "coding") {
    categoryDetail = "generative content, creative writing, and AI code assistance";
    techStackDetail = "secure HTTPS proxy connections and advanced generative AI models";
    problemSolved = `Helps overcome writer's block, generates structured draft copy, creates code boilerplates, or summarizes lengthy text streams in seconds.`;
    targetAudience = "Writers, marketers, creators, students, and software developers.";
    howItWorks = `Transmits your prompt text securely via TLS encryption to our server AI proxy, returning structured responses formatted for immediate use.`;
    supportedInputsFormats = "Natural language text prompts, topic summaries, code boilerplates, and structured parameters.";
    outputExpectation = "Cohesive draft copy, structured outlines, or functional code blocks tailored to your specifications.";
    limitations = "Generative AI outputs should be reviewed for accuracy before deployment in critical production environments.";
    privacySecurity = "Encrypted TLS Transmission. Prompts are processed transiently and are never saved or used for model training.";
    troubleshooting = [
      "If output generation stops, ensure your prompt is clear and does not exceed token limits.",
      "Re-run the generator with adjusted tone or style parameters for alternate draft variations."
    ];
    commonMistakes = [
      "Providing vague or one-word prompts without specifying desired tone, length, or target output structure.",
      "Including personal passwords or confidential financial credentials in AI prompts."
    ];
    processingType = "SERVER_SIDE_AI";
    processingDetails = "Prompts are securely processed via encrypted server connections. Output logs are stored in your device's transient local storage only.";
  }

  // 1. Overview
  const overview = `${name} is a free online tool created to simplify ${categoryDetail}. Designed for speed, convenience, and privacy, ${name} allows you to process your data instantly without downloading third-party software or waiting for server queue delays. Whether you are working on a desktop, tablet, or smartphone, ${name} offers a seamless, clutter-free workspace optimized for daily tasks.

Powered by ${techStackDetail}, ${name} guarantees fast and reliable execution. Experience high-precision performance on Mehzan Digital with zero registration requirements or hidden fees.`;

  // 2. Key Features
  const keyFeatures: string[] = [
    `High-Speed Execution: ${name} processes data in milliseconds using optimized ${techStackDetail}.`,
    `Privacy-First Architecture: ${processingDetails}`,
    `Cross-Platform Compatibility: Fully responsive across Windows, macOS, Linux, iOS, and Android.`,
    `100% Free Access: Enjoy unrestricted utility usage without account signups, subscriptions, or hidden charges.`
  ];

  // 3. Use Cases
  const useCases: string[] = [
    `Accelerating daily workflows by using ${name} for error-free processing.`,
    `Handling sensitive files or data securely without exposing confidential information to unknown servers.`,
    `Working on mobile devices or remote workstations where heavy desktop software is unavailable.`,
    `Integrating fast ${categoryDetail} into professional, academic, or personal routines.`
  ];

  // 4. How to Use Steps
  const howToUseSteps: string[] = [
    `Step 1: Input your data, upload your document, or configure your options in the ${name} panel.`,
    `Step 2: Adjust setting preferences, formats, or parameters to fit your requirements.`,
    `Step 3: Click the primary action button to run ${name} and generate immediate results.`,
    `Step 4: Review your processed output and copy the text or download your file directly to your device.`
  ];

  // 5. Tool-Specific FAQs
  const defaultFaqs: FAQItem[] = [
    {
      question: `Is ${name} completely free to use?`,
      answer: `Yes, ${name} is 100% free with unlimited usage. There are no paywalls, hidden fees, or daily execution quotas.`,
    },
    {
      question: `Does processing happen in my browser or on a remote server?`,
      answer: processingType === "CLIENT_SIDE_BROWSER"
        ? `${name} runs 100% client-side inside your browser memory sandbox. Your files and inputs are processed locally on your device and are never uploaded or stored on any server.`
        : `${name} sends your prompt securely via encrypted HTTPS to our AI processing endpoint to generate a response. Inputs are processed transiently and are not stored permanently.`,
    },
    {
      question: `Do I need to create an account or install browser extensions to use ${name}?`,
      answer: `No account registration or software installation is required. ${name} works directly inside modern web browsers like Chrome, Safari, Firefox, Edge, and Opera.`,
    },
    {
      question: `Does ${name} support international standards (US, Canada, UK, Europe, Mexico)?`,
      answer: `Yes! ${name} is fully compatible with global paper sizes (US Letter & European A4), international grading scales (US 4.0, UK/European ECTS, Mexican 10-point), and multi-language character encodings.`,
    },
    {
      question: `Can I use ${name} on mobile phones and tablets?`,
      answer: `Yes, ${name} is fully responsive and optimized for touch interfaces on iPhone, iPad, and Android devices.`,
    },
  ];

  const combinedFaqs: FAQItem[] = mapped?.faqs && mapped.faqs.length > 0
    ? [...mapped.faqs, ...defaultFaqs]
    : defaultFaqs;

  const finalOverview = mapped?.introduction
    ? `${mapped.introduction}\n\n${overview}`
    : overview;

  return {
    metaTitle,
    metaDescription,
    primaryKeyword: mapped?.primaryKeyword || `${name} Online`,
    secondaryKeywords: mapped?.secondaryKeywords || [name.toLowerCase(), `${name.toLowerCase()} tool`, `free ${name.toLowerCase()}`],
    searchIntent: mapped?.searchIntent || `Transactional / Utility - Execute ${name.toLowerCase()} instantly in browser.`,
    semanticRelatedTerms: mapped?.semanticRelatedTerms || [categoryDetail, techStackDetail, "client-side processing"],
    overview: finalOverview,
    problemSolved,
    targetAudience,
    howItWorks,
    supportedInputsFormats,
    outputExpectation,
    limitations,
    privacySecurity,
    troubleshooting,
    commonMistakes,
    processingType,
    processingDetails,
    useCases,
    keyFeatures,
    howToUseSteps,
    faqs: combinedFaqs,
  };
}

