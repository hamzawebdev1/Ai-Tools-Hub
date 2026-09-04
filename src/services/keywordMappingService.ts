import { FAQItem } from "../types";

export interface InternalLink {
  slug: string;
  anchorText: string;
}

export interface KeywordMapping {
  slugOrId: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  searchIntent: string;
  optimizedTitle: string;
  optimizedH1: string;
  metaDescription: string;
  introduction: string;
  semanticRelatedTerms: string[];
  faqs: FAQItem[];
  relatedToolLinks?: InternalLink[];
  estimatedImpressionsTier?: string;
  estimatedPositionTier?: string;
}

export const KEYWORD_MAPPINGS: Record<string, KeywordMapping> = {
  // 1. PDF to Word
  "pdf-to-word": {
    slugOrId: "pdf-to-word",
    primaryKeyword: "Convert PDF to Word DOCX Online Free",
    secondaryKeywords: [
      "PDF to Word converter",
      "convert PDF to editable DOCX",
      "free PDF to Word online",
      "turn PDF into Word document"
    ],
    searchIntent: "Transactional / Utility - Users need an instant, accurate way to transform non-editable PDF documents into editable Microsoft Word DOCX files without paying for subscriptions or software.",
    optimizedTitle: "Convert PDF to Word DOCX Online Free (Instant & Private)",
    optimizedH1: "Convert PDF to Word DOCX Online",
    metaDescription: "Convert PDF files into editable Microsoft Word (.docx) documents 100% free. Fast, in-browser WebAssembly conversion preserves layout with zero file uploads.",
    introduction: "Convert PDF documents into editable Microsoft Word DOCX files instantly with our free client-side converter. Engineered for professionals, students, and businesses across the US, UK, Canada, and Europe, this tool preserves document typography, tables, paragraphs, and layout structure while ensuring complete privacy through local browser processing.",
    semanticRelatedTerms: ["DOCX file conversion", "PDF layout parser", "editable text extraction", "document formatting preservation", "client-side document conversion"],
    estimatedImpressionsTier: "~1,800 monthly impressions",
    estimatedPositionTier: "Pos ~42 (Striking Distance)",
    relatedToolLinks: [
      { slug: "docx-to-pdf", anchorText: "Word DOCX to PDF Converter" },
      { slug: "pdf-editor", anchorText: "Online PDF Editor & Annotator" },
      { slug: "jpg-to-pdf", anchorText: "JPG Image to PDF Converter" },
      { slug: "pdf-to-jpg", anchorText: "PDF to High-Res JPG Converter" }
    ],
    faqs: [
      {
        question: "How do I convert a PDF to an editable Word document for free?",
        answer: "Upload or drag your PDF file into the converter box above. The tool processes your document in seconds and outputs a fully editable .docx file for instant download."
      },
      {
        question: "Will converting PDF to Word alter my original formatting?",
        answer: "Our advanced PDF layout engine reconstructs paragraphs, headings, bullet points, and embedded images to preserve your original document layout as closely as possible."
      },
      {
        question: "Are my uploaded PDF documents saved on external servers?",
        answer: "No. All conversion operations take place inside your browser memory using WebAssembly. Your files are never uploaded to, stored on, or shared with any external server."
      }
    ]
  },

  // 2. Word to PDF
  "docx-to-pdf": {
    slugOrId: "docx-to-pdf",
    primaryKeyword: "Convert Word DOCX to PDF Online Free",
    secondaryKeywords: [
      "Word to PDF converter",
      "save DOCX as PDF online",
      "free Word to PDF tool",
      "convert Microsoft Word to PDF"
    ],
    searchIntent: "Transactional / Utility - Users want to lock Word document layouts into standard, cross-platform PDF files for printing or distribution.",
    optimizedTitle: "Convert Word DOCX to PDF Online Free (No Registration)",
    optimizedH1: "Convert Word DOCX to PDF Online",
    metaDescription: "Convert Microsoft Word (.docx) documents into styled, printable PDF files for free. Fast, in-browser conversion with crisp formatting and zero registration.",
    introduction: "Turn your Microsoft Word documents into standardized PDF files instantly. Ideal for job applications, academic reports, and legal contracts, our online Word to PDF converter ensures your fonts, alignment, and formatting display identically across every operating system and device.",
    semanticRelatedTerms: ["DOCX to PDF compiler", "word document print layout", "vector PDF generation", "in-browser document converter"],
    estimatedImpressionsTier: "~1,500 monthly impressions",
    estimatedPositionTier: "Pos ~48 (Striking Distance)",
    relatedToolLinks: [
      { slug: "pdf-to-word", anchorText: "Convert PDF to Word DOCX" },
      { slug: "pdf-organizer", anchorText: "PDF Visual Page Organizer" },
      { slug: "pdf-editor", anchorText: "Free Online PDF Editor" }
    ],
    faqs: [
      {
        question: "How do I convert a Microsoft Word file to PDF online?",
        answer: "Drag and drop your .docx or .doc file into the dropzone above, click process, and download your newly compiled PDF document in under 200 milliseconds."
      },
      {
        question: "Can I convert Word to PDF on mobile devices?",
        answer: "Yes, our web utility works smoothly on Chrome, Safari, Firefox, and Edge across iOS, Android, macOS, and Windows devices."
      }
    ]
  },

  // 3. Image to Text (OCR)
  "image-to-text": {
    slugOrId: "image-to-text",
    primaryKeyword: "Image to Text Converter Free - Extract Text from Image OCR",
    secondaryKeywords: [
      "image to text OCR",
      "extract text from picture",
      "photo to text converter online",
      "copy text from image free"
    ],
    searchIntent: "Informational & Utility - Users want to extract plain, copyable text from photos, screenshots, receipts, or scanned documents using OCR.",
    optimizedTitle: "Image to Text Converter Free (OCR) - Extract Text from Image",
    optimizedH1: "Image to Text Converter (OCR)",
    metaDescription: "Extract text from images, screenshots, and photos with free online OCR. Copy text from JPG, PNG, and WEBP pictures instantly with 100% in-browser privacy.",
    introduction: "Extract readable, copyable text from photos, book pages, business cards, and screenshots with our free OCR Image to Text converter. Designed for researchers, students, and office workers worldwide, it analyzes picture pixels locally to convert image characters into plain text.",
    semanticRelatedTerms: ["optical character recognition", "OCR text engine", "screenshot text scanner", "picture to text copy"],
    estimatedImpressionsTier: "~1,600 monthly impressions",
    estimatedPositionTier: "Pos ~55",
    relatedToolLinks: [
      { slug: "pdf-ocr-extractor", anchorText: "PDF OCR Text Extractor" },
      { slug: "word-counter", anchorText: "Word Counter & Character Count" },
      { slug: "case-converter", anchorText: "Text Case Converter" }
    ],
    faqs: [
      {
        question: "How does the online Image to Text OCR converter work?",
        answer: "The tool uses client-side optical character recognition algorithms to scan letter shapes in your image and output editable plain text directly in your browser."
      },
      {
        question: "What image formats are supported for text extraction?",
        answer: "You can upload JPG, PNG, WEBP, BMP, and GIF images up to 50MB for instant text extraction."
      }
    ]
  },

  // 4. Background Remover
  "image-background-remover": {
    slugOrId: "image-background-remover",
    primaryKeyword: "Remove Background from Image Free - Background Remover",
    secondaryKeywords: [
      "remove image background online",
      "transparent PNG background maker",
      "free photo background remover",
      "photography background eraser"
    ],
    searchIntent: "Transactional / Utility - E-commerce sellers, graphic designers, and photographers looking for a quick background removal tool to create transparent PNGs.",
    optimizedTitle: "Remove Background from Image Free (Transparent PNG) - Online Tool",
    optimizedH1: "Remove Background from Image Online",
    metaDescription: "Remove image backgrounds for free in seconds. Create clean, high-resolution transparent PNG cutouts for e-commerce, photography, and graphics with zero signups.",
    introduction: "Isolate subjects and remove photo backgrounds effortlessly with our free online image background remover. Perfect for e-commerce product photos, marketing graphics, profile pictures, and photography projects across North America and Europe, creating clean transparent PNGs in seconds.",
    semanticRelatedTerms: ["transparent PNG exporter", "alpha channel mask", "photo cutout tool", "e-commerce product photography background eraser"],
    estimatedImpressionsTier: "~1,400 monthly impressions",
    estimatedPositionTier: "Pos ~61",
    relatedToolLinks: [
      { slug: "image-cropper", anchorText: "Free Image Cropper" },
      { slug: "image-resizer", anchorText: "Batch Image Resizer" },
      { slug: "image-compressor", anchorText: "Online Image Compressor" }
    ],
    faqs: [
      {
        question: "Is this photo background remover completely free?",
        answer: "Yes, you can erase photo backgrounds for unlimited images with no hidden costs or watermarks."
      },
      {
        question: "How do I download my image with a transparent background?",
        answer: "Once the background is isolated, click 'Download Transparent PNG' to save the cut-out image to your device."
      }
    ]
  },

  // 5. Image Compressor
  "image-compressor": {
    slugOrId: "image-compressor",
    primaryKeyword: "Free Image Compressor - Compress Image Size Online",
    secondaryKeywords: [
      "compress image size online",
      "reduce photo file size",
      "compress JPG PNG WEBP",
      "batch image size reducer"
    ],
    searchIntent: "Transactional / Utility - Website owners and developers needing to shrink image file sizes to improve site speed and Core Web Vitals.",
    optimizedTitle: "Compress Image File Size Online Free - Reduce JPG, PNG & WebP",
    optimizedH1: "Compress Image File Size Online",
    metaDescription: "Compress JPG, PNG, and WebP images by up to 80% without quality loss. Fast, free in-browser compression boosts website loading speeds and Web Vitals.",
    introduction: "Shrink image file sizes without sacrificing visual sharpness. Our free online image compressor optimizes JPG, PNG, and WEBP photos directly in client memory, helping web developers, bloggers, and e-commerce stores boost page load speeds and SEO rankings.",
    semanticRelatedTerms: ["lossy and lossless image compression", "WebP converter", "site speed optimization", "Core Web Vitals image reducer"],
    estimatedImpressionsTier: "~1,200 monthly impressions",
    estimatedPositionTier: "Pos ~52",
    relatedToolLinks: [
      { slug: "image-resizer", anchorText: "Image Resizer Tool" },
      { slug: "jpg-to-webp", anchorText: "JPG to WebP Converter" },
      { slug: "svg-optimizer", anchorText: "SVG Vector Code Optimizer" }
    ],
    faqs: [
      {
        question: "How much file size can I reduce with this image compressor?",
        answer: "Depending on image quality settings, file size reduction ranges from 30% up to 85% with virtually zero perceptible quality loss."
      },
      {
        question: "Does compressing images affect image dimensions?",
        answer: "No, compression optimizes pixel data and color tables without changing image width or height dimensions unless you explicitly choose to resize."
      }
    ]
  },

  // 6. JPG to PDF
  "jpg-to-pdf": {
    slugOrId: "jpg-to-pdf",
    primaryKeyword: "Convert JPG to PDF Online Free - JPG to PDF Converter",
    secondaryKeywords: [
      "JPG to PDF converter",
      "combine JPG images into PDF",
      "turn photo into PDF document",
      "free JPG to PDF tool"
    ],
    searchIntent: "Transactional / Utility - Users wanting to convert single or multiple JPG images into a single standardized PDF file.",
    optimizedTitle: "Convert JPG to PDF Online Free - Combine Photos into PDF",
    optimizedH1: "Convert JPG to PDF Online",
    metaDescription: "Convert JPG, PNG, and WebP images into clean PDF documents for free. Combine multiple photos into one formatted PDF file with custom page margins.",
    introduction: "Convert JPG photos, digital scans, and receipts into professional PDF documents. Adjust page orientation, margins, and layout geometry to compile your photos into a single downloadable PDF file.",
    semanticRelatedTerms: ["photo document compiler", "image grid to PDF", "scanned receipt to PDF", "client-side photo conversion"],
    estimatedImpressionsTier: "~950 monthly impressions",
    estimatedPositionTier: "Pos ~46",
    relatedToolLinks: [
      { slug: "pdf-to-jpg", anchorText: "PDF to JPG High-Res Converter" },
      { slug: "pdf-organizer", anchorText: "PDF Page Organizer & Reorder" }
    ],
    faqs: [
      {
        question: "Can I combine multiple JPG files into a single PDF document?",
        answer: "Yes, you can upload dozens of JPG photos at once, reorder them visually, and merge them into one single PDF."
      }
    ]
  },

  // 7. PDF to JPG
  "pdf-to-jpg": {
    slugOrId: "pdf-to-jpg",
    primaryKeyword: "Convert PDF to JPG Online Free - PDF to JPG Converter",
    secondaryKeywords: [
      "PDF to JPG converter",
      "extract PDF pages as JPG photos",
      "convert PDF document to image",
      "save PDF as JPG high quality"
    ],
    searchIntent: "Transactional / Utility - Extracting PDF pages as high-resolution JPG images for embedding in presentations or sharing on social media.",
    optimizedTitle: "Convert PDF to JPG Online Free - High-Res Image Extractor",
    optimizedH1: "Convert PDF to JPG Online",
    metaDescription: "Convert PDF document pages into high-resolution JPG images for free. Extract sharp photos in seconds with zero file limits or software installation.",
    introduction: "Turn PDF pages into sharp JPG images. Our online converter renders document vector streams into clean raster photos, making it easy to share pages on social media or embed them in slide decks.",
    semanticRelatedTerms: ["PDF page renderer", "high-DPI photo export", "document image extractor", "client-side vector rasterization"],
    estimatedImpressionsTier: "~880 monthly impressions",
    estimatedPositionTier: "Pos ~59",
    relatedToolLinks: [
      { slug: "jpg-to-pdf", anchorText: "JPG Image to PDF Converter" },
      { slug: "pdf-to-word", anchorText: "Convert PDF to Word DOCX" }
    ],
    faqs: [
      {
        question: "What resolution are the extracted JPG images?",
        answer: "Our converter renders PDF pages at full HD resolution (300 DPI equivalent) to ensure crisp text and sharp graphical details."
      }
    ]
  },

  // 8. SERP Preview & Checker Tool
  "serp-preview-tool": {
    slugOrId: "serp-preview-tool",
    primaryKeyword: "Google SERP Position Preview & Rank Tracker SEO Tool",
    secondaryKeywords: [
      "SERP checker tool",
      "free SERP check",
      "Google SERP position tool",
      "SEO ranking checker",
      "rank tracker SEO tool"
    ],
    searchIntent: "Informational & Commercial - SEO specialists and webmasters wanting to preview how titles and meta descriptions will appear in Google search engine result pages (SERPs).",
    optimizedTitle: "Google SERP Position Preview & Rank Tracker SEO Tool (Free)",
    optimizedH1: "Google SERP Position Preview & SERP Checker",
    metaDescription: "Test Google SERP position previews and snippet appearances for free. Verify title tag character & pixel width limits to prevent search snippet truncation.",
    introduction: "Optimize your organic search click-through rates (CTR) with our free Google SERP position preview tool. Test meta titles, meta descriptions, canonical URLs, and rich snippet badges in real time to prevent snippet truncation on Google, Bing, and Yahoo search results.",
    semanticRelatedTerms: ["SERP snippet simulator", "pixel width calculator", "title tag truncation checker", "CTR optimization tool", "organic search visibility"],
    estimatedImpressionsTier: "~1,100 monthly impressions",
    estimatedPositionTier: "Pos ~38 (Striking Distance)",
    relatedToolLinks: [
      { slug: "meta-tag-generator", anchorText: "Free Meta Tag Generator" },
      { slug: "keyword-density-analyzer", anchorText: "SEO Keyword Density Analyzer" },
      { slug: "word-counter", anchorText: "Word & Character Counter" }
    ],
    faqs: [
      {
        question: "What is a Google SERP simulator?",
        answer: "A Google SERP simulator displays a real-time preview of how your web page title tag, URL, and meta description will appear on Google's search result pages."
      },
      {
        question: "What is the recommended character and pixel limit for Google titles?",
        answer: "Google typically truncates titles exceeding 60 characters or ~600 pixels width, and meta descriptions exceeding 155-160 characters or ~960 pixels width."
      }
    ]
  },

  // 9. Meta Tag Generator
  "meta-tag-generator": {
    slugOrId: "meta-tag-generator",
    primaryKeyword: "Free Meta Tag Generator Tool - SEO Title & Description",
    secondaryKeywords: [
      "free SEO tool",
      "meta tag generator",
      "SEO title description generator",
      "HTML meta tag maker"
    ],
    searchIntent: "Transactional / Utility - Web developers and marketers generating compliant HTML meta tags for SEO and social media preview cards.",
    optimizedTitle: "Free Meta Tag Generator Tool - SEO & Open Graph Tags",
    optimizedH1: "Free SEO Meta Tag Generator",
    metaDescription: "Generate compliant HTML meta tags, Open Graph tags, and Twitter Cards for free. Improve search indexing and social sharing snippet previews instantly.",
    introduction: "Generate perfectly formatted HTML meta tags for your website. Simply enter your page title, description, keywords, author, and social media tags to produce clean code ready to paste into your site's <head> section.",
    semanticRelatedTerms: ["HTML head tags", "Open Graph meta protocol", "Twitter Card generator", "technical SEO markup"],
    estimatedImpressionsTier: "~780 monthly impressions",
    estimatedPositionTier: "Pos ~44",
    relatedToolLinks: [
      { slug: "serp-preview-tool", anchorText: "Google SERP Position Preview" },
      { slug: "keyword-density-analyzer", anchorText: "Keyword Density Analyzer" }
    ],
    faqs: [
      {
        question: "Why are meta tags important for SEO?",
        answer: "Meta tags provide search engine crawlers with vital context regarding page topic, indexing permissions, and how snippets should be rendered in search results."
      }
    ]
  },

  // 10. Keyword Density Analyzer
  "keyword-density-analyzer": {
    slugOrId: "keyword-density-analyzer",
    primaryKeyword: "Free SEO Keyword Density Analyzer & Keyword SEO Tool",
    secondaryKeywords: [
      "SEO keyword tool",
      "keyword SEO tool",
      "keyword frequency checker",
      "content keyword density counter"
    ],
    searchIntent: "Informational & Commercial - SEO writers analyzing keyword distribution in articles to avoid over-optimization while improving semantic search relevance.",
    optimizedTitle: "SEO Keyword Density Analyzer & Frequency Checker (Free)",
    optimizedH1: "SEO Keyword Density Analyzer & Frequency Checker",
    metaDescription: "Analyze keyword density, word frequency, and n-grams in your content for free. Prevent keyword stuffing and optimize semantic search relevance.",
    introduction: "Analyze keyword frequency and n-gram distribution across your content. Our free keyword SEO tool helps content creators and SEO strategists audit primary and secondary keyword occurrences to achieve balanced, natural keyword density.",
    semanticRelatedTerms: ["n-gram frequency counter", "semantic keyword distribution", "content audit tool", "keyword stuffing prevention"],
    estimatedImpressionsTier: "~850 monthly impressions",
    estimatedPositionTier: "Pos ~49",
    relatedToolLinks: [
      { slug: "word-counter", anchorText: "Word Counter & Reading Time" },
      { slug: "serp-preview-tool", anchorText: "Google SERP Snippet Preview" }
    ],
    faqs: [
      {
        question: "What is an ideal keyword density for SEO content?",
        answer: "An ideal keyword density is typically between 1% and 2.5% for your primary target keyword, supported by natural semantic variations."
      }
    ]
  },

  // 11. College & School GPA Calculator
  "gpa-calculator": {
    slugOrId: "gpa-calculator",
    primaryKeyword: "Free College & High School GPA Calculator - Student Portal Tool",
    secondaryKeywords: [
      "student tool",
      "student portal GPA calculator",
      "college GPA calculator",
      "cumulative GPA calculator school tool"
    ],
    searchIntent: "Transactional / Utility - High school and college students calculating semester and cumulative Grade Point Averages (GPA).",
    optimizedTitle: "College & High School GPA Calculator - Free Student Tool",
    optimizedH1: "College & High School GPA Calculator",
    metaDescription: "Calculate semester and cumulative GPA on 4.0, weighted AP/Honors, and ECTS scales for free. Instant grade calculations for college and high school students.",
    introduction: "Calculate your grade point average accurately with our student portal GPA calculator. Designed for high school, college, and university students across North America and Europe, this tool supports 4.0 scales, letter grades, and weighted AP/Honors course credits.",
    semanticRelatedTerms: ["cumulative grade point average", "4.0 GPA scale", "weighted vs unweighted GPA", "academic performance tracker"],
    estimatedImpressionsTier: "~920 monthly impressions",
    estimatedPositionTier: "Pos ~35 (Striking Distance)",
    relatedToolLinks: [
      { slug: "word-counter", anchorText: "Essay Word Counter & Reading Time" },
      { slug: "ai-writer", anchorText: "Free AI Writing Assistant" }
    ],
    faqs: [
      {
        question: "How is college GPA calculated?",
        answer: "GPA is calculated by multiplying each course's grade point value by its credit hours, summing the total quality points, and dividing by total attempted credits."
      }
    ]
  },

  // 12. Word Counter & Reading Time
  "word-counter": {
    slugOrId: "word-counter",
    primaryKeyword: "Free Word Counter & Reading Time Calculator - Student Tool",
    secondaryKeywords: [
      "word counter online",
      "reading time estimator",
      "character count student tool",
      "essay word count helper"
    ],
    searchIntent: "Transactional / Utility - Writers, students, and bloggers counting words, characters, sentences, and estimated reading duration for essays and articles.",
    optimizedTitle: "Free Word Counter & Reading Time Calculator | Student Tool",
    optimizedH1: "Word Counter & Reading Time Calculator",
    metaDescription: "Count words, characters, sentences, paragraphs, and reading time in real time. Perfect for essays, articles, social posts, and school assignments.",
    introduction: "Count words, characters, sentences, paragraphs, and estimated reading time in real time. Perfect for students submitting school assignments, authors tracking book chapters, and marketers managing social media character limits.",
    semanticRelatedTerms: ["essay length calculator", "character count tool", "reading speed metric", "content length auditor"],
    estimatedImpressionsTier: "~1,050 monthly impressions",
    estimatedPositionTier: "Pos ~41 (Striking Distance)",
    relatedToolLinks: [
      { slug: "case-converter", anchorText: "Text Case Converter" },
      { slug: "gpa-calculator", anchorText: "Student GPA Calculator" }
    ],
    faqs: [
      {
        question: "How is estimated reading time calculated?",
        answer: "Estimated reading time is calculated based on an average adult reading speed of 200 to 250 words per minute (WPM)."
      }
    ]
  },

  // 13. AI Writer
  "ai-writer": {
    slugOrId: "ai-writer",
    primaryKeyword: "AI Writer Free - AI Writing Assistant & Content Generator",
    secondaryKeywords: [
      "AI tool for writing",
      "free AI article generator",
      "online AI copywriting tool",
      "AI text writer for students and marketers"
    ],
    searchIntent: "Transactional / Utility - Users seeking an AI writing assistant to draft essays, blog intros, marketing emails, or product descriptions.",
    optimizedTitle: "Free AI Writer & Content Generator - AI Writing Assistant",
    optimizedH1: "Free AI Writer & Content Generator",
    metaDescription: "Generate paragraphs, blog outlines, marketing copy, and essays for free with our AI writer assistant. Fast, creative text generation with zero signups.",
    introduction: "Supercharge your writing with our free AI writer tool. Generate creative article outlines, persuasive marketing copy, and academic drafts using client-side AI algorithms designed to assist students, writers, and digital marketers.",
    semanticRelatedTerms: ["natural language generator", "AI copywriter", "content creation assistant", "in-browser language model"],
    estimatedImpressionsTier: "~1,300 monthly impressions",
    estimatedPositionTier: "Pos ~50",
    relatedToolLinks: [
      { slug: "word-counter", anchorText: "Word Counter & Character Count" },
      { slug: "image-to-text", anchorText: "Image to Text OCR Converter" }
    ],
    faqs: [
      {
        question: "Is this AI writing tool completely free to use?",
        answer: "Yes, our client-side AI writing helper allows you to generate text drafts for free with no credit card required."
      }
    ]
  }
};

export function getKeywordMappingForTool(toolIdOrSlug: string): KeywordMapping | null {
  return KEYWORD_MAPPINGS[toolIdOrSlug] || null;
}
