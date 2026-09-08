import { FAQItem } from "../types";

export interface ToolKeywordMap {
  toolSlug: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  longTailKeywords: string[];
  questionKeywords: string[];
  brandedKeywords: string[];
  semanticEntities: string[];
  searchIntent: string;
  optimizedTitle: string;
  optimizedH1: string;
  metaDescription: string;
  shortDescription: string;
  detailedOverview: string;
  faqs: FAQItem[];
}

/**
  * Generates structured keyword mapping and rich SEO metadata for every canonical tool slug.
  */
export function getToolKeywordMap(toolSlug: string, toolName: string = "Online Tool", category: string = "utilities"): ToolKeywordMap {
  const cleanName = toolName.replace(/\(.*?\)/g, "").trim();
  const lowerName = cleanName.toLowerCase();
  
  // Category-specific keyword sets & brand defaults
  let primaryKw = `${cleanName} Online Free`;
  let categoryKeyword = "online tools";
  
  if (category === "pdf") {
    primaryKw = `${cleanName} Free Online - Mehzan PDF Tools`;
    categoryKeyword = "PDF converter & editor";
  } else if (category === "image") {
    primaryKw = `${cleanName} Free Online - Mehzan Image Tools`;
    categoryKeyword = "image editor & converter";
  } else if (category === "qr") {
    primaryKw = `${cleanName} - Free Generator & Reader`;
    categoryKeyword = "QR code & barcode tools";
  } else if (category === "calculators") {
    primaryKw = `${cleanName} - Free Online Calculator`;
    categoryKeyword = "online calculator tool";
  } else if (category === "student") {
    primaryKw = `${cleanName} - Free Student Tool`;
    categoryKeyword = "academic & study tools";
  } else if (category === "media") {
    primaryKw = `${cleanName} - Free Media Processing Tool`;
    categoryKeyword = "audio & video utility";
  } else if (category === "developer" || category === "text") {
    primaryKw = `${cleanName} Online Free - Developer Utility`;
    categoryKeyword = "developer & text formatting utility";
  }

  const brandedKeywords = [
    `Mehzan ${cleanName}`,
    `Mehzan ${cleanName} online`,
    `Mehzan ${cleanName} free`,
    `Mehzan ${categoryKeyword}`,
    `Mehzan Tools Hub ${lowerName}`,
    `Mehzan free online tools`,
    `Mehzan Digital ${lowerName}`
  ];

  const secondaryKeywords = [
    `${lowerName} online`,
    `free ${lowerName}`,
    `${lowerName} tool`,
    `best ${lowerName} online`,
    `${lowerName} without registration`,
    `instant ${lowerName}`,
    `browser-based ${lowerName}`
  ];

  const longTailKeywords = [
    `how to use ${lowerName} online for free`,
    `fast client-side ${lowerName} in browser`,
    `secure ${lowerName} with zero server upload`,
    `free ${lowerName} for desktop and mobile`
  ];

  const questionKeywords = [
    `How do I use ${cleanName} online?`,
    `Is ${cleanName} completely free to use?`,
    `Are my files safe when using ${cleanName}?`,
    `Does ${cleanName} work on mobile devices?`
  ];

  const semanticEntities = [
    cleanName,
    categoryKeyword,
    "Mehzan Digital",
    "Mehzan Tools Hub",
    "WebAssembly",
    "Client-Side Execution",
    "Privacy First",
    "Zero Upload Latency",
    "HTML5 Canvas Engine"
  ];

  const searchIntent = `Transactional & Utility - Users seeking a fast, private, free browser tool to perform ${lowerName} tasks instantly without registering or downloading software.`;

  const optimizedTitle = `${cleanName} - Free Online Tool | Mehzan Tools Hub`;
  const optimizedH1 = `${cleanName} Online`;
  const metaDescription = `Use ${cleanName} online for free on Mehzan Tools Hub. ${cleanName} provides fast, private client-side processing with zero file uploads and no account needed.`;

  const shortDescription = `Perform ${lowerName} tasks instantly in your browser with 100% privacy and zero installation.`;

  const detailedOverview = `${cleanName} is a high-performance, browser-native utility built for ${categoryKeyword} tasks. Designed by Mehzan Digital, this tool allows you to perform ${lowerName} instantly inside your browser memory using modern WebAssembly and HTML5 client-side engines. Your data remains strictly on your device and is never uploaded to remote servers.`;

  const faqs: FAQItem[] = [
    {
      question: `Is ${cleanName} completely free on Mehzan Tools Hub?`,
      answer: `Yes, ${cleanName} is 100% free to use with no usage caps, zero subscription fees, and no account registration required.`
    },
    {
      question: `How does ${cleanName} handle data privacy and security?`,
      answer: `${cleanName} processes all data directly inside your local browser memory using client-side execution. Your files or text inputs are never sent to external servers.`
    },
    {
      question: `Can I access ${cleanName} on mobile devices?`,
      answer: `Yes! ${cleanName} is fully responsive and optimized for touchscreens across iPhone, Android, tablets, laptops, and desktop computers.`
    },
    {
      question: `Do I need to install any software or extensions for ${cleanName}?`,
      answer: `No installation is required. ${cleanName} works instantly in any web browser, including Google Chrome, Apple Safari, Mozilla Firefox, and Microsoft Edge.`
    }
  ];

  return {
    toolSlug,
    primaryKeyword: primaryKw,
    secondaryKeywords,
    longTailKeywords,
    questionKeywords,
    brandedKeywords,
    semanticEntities,
    searchIntent,
    optimizedTitle,
    optimizedH1,
    metaDescription,
    shortDescription,
    detailedOverview,
    faqs
  };
}
