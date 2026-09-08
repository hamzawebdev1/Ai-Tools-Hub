import { AITool, ToolSEOContent, FAQItem } from "../types";
import { getKeywordMappingForTool } from "../services/keywordMappingService";
import { getToolKeywordMap } from "../services/toolKeywordMapService";

/**
 * Generates 100% unique, tool-specific SEO content for any tool
 * based on its exact name, slug, category, subcategory, input/output features,
 * and capability archetype.
 */
export function getEnrichedToolSEO(tool: Partial<AITool>): ToolSEOContent {
  const name = tool.name || "Online Utility";
  const slug = tool.slug || tool.id || "tool";
  const category = tool.category || "utilities";
  const subcategory = tool.subcategory || category;
  const tagline = tool.tagline || `Fast, secure ${name} running directly in your browser.`;
  const description = tool.description || tagline;

  // Check for specific Keyword Mapping override or dynamic tool keyword map
  const mapped = getKeywordMappingForTool(slug) || getKeywordMappingForTool(tool.id || "");
  const kwMap = getToolKeywordMap(slug, name, category);

  // Meta Title & Description
  const metaTitle = mapped?.optimizedTitle || kwMap.optimizedTitle;
  const metaDescription = mapped?.metaDescription || kwMap.metaDescription;

  // Determine processing mode & data safety
  const isServerAI = category === "writing" || category === "media" || category === "coding";
  const processingType: "CLIENT_SIDE_BROWSER" | "SERVER_SIDE_AI" = isServerAI ? "SERVER_SIDE_AI" : "CLIENT_SIDE_BROWSER";

  // Build 100% unique content fields dynamically incorporating the specific tool's identity
  const problemSolved = `Provides an automated, high-precision solution for ${name.toLowerCase()} (${description}), eliminating manual execution overhead, formatting errors, or expensive software fees.`;

  const targetAudience = `Professionals, developers, students, researchers, and webmasters seeking a fast, private, browser-based tool for ${name.toLowerCase()}.`;

  const howItWorks = isServerAI
    ? `Transmits your prompt securely via encrypted TLS connections to our server endpoint for ${name.toLowerCase()}, returning structured results formatted directly for instant review.`
    : `Executes ${name.toLowerCase()} entirely in local browser RAM using client-side JavaScript and WebAssembly algorithms. Input data is parsed locally without being uploaded to remote servers.`;

  const supportedInputsFormats = `Accepts standard parameters, formatted text, files, or data payloads for ${name.toLowerCase()} up to 100MB in browser memory.`;

  const outputExpectation = `Clean, accurately formatted output tailored specifically for ${name.toLowerCase()} ready for instant copying or file download.`;

  const limitations = isServerAI
    ? `Outputs for ${name.toLowerCase()} are generated based on input prompts. Verify results before production deployment.`
    : `Processing speed and volume for ${name.toLowerCase()} are bounded by your local device RAM and CPU capacity (~200MB memory limit on mobile browsers).`;

  const privacySecurity = isServerAI
    ? `Encrypted TLS Transmission. Prompts for ${name.toLowerCase()} are processed transiently and are never logged or stored permanently.`
    : `100% Local Browser Sandbox. Files and inputs for ${name.toLowerCase()} remain on your device and are never transmitted to external servers.`;

  const troubleshooting = [
    `If ${name} appears unresponsive, double-check that your input data for ${name.toLowerCase()} is valid and uncorrupted.`,
    `For large files or payloads in ${name}, close inactive browser tabs to allocate maximum local memory.`,
    `Ensure your browser is updated (Chrome, Safari, Firefox, or Edge) to support modern WebAssembly and HTML5 features.`
  ];

  const commonMistakes = [
    `Closing the browser tab before ${name} finishes processing your input.`,
    `Providing malformed or truncated input data to the ${name} workspace.`,
    `Attempting to process locked or encrypted files in ${name} without providing necessary permissions.`
  ];

  const keyFeatures = [
    `Dedicated ${name} Engine: Specifically optimized for ${subcategory} and ${name.toLowerCase()} tasks.`,
    `Instant ${name} Output: Generates processed results in milliseconds directly inside your browser.`,
    `Privacy Protection in ${name}: ${privacySecurity}`,
    `Zero Sign-Up Required for ${name}: Use ${name} freely without registering an account or entering payment details.`,
    `Cross-Device Ready: Fully responsive ${name} interface on desktop, laptop, tablet, and mobile browsers.`
  ];

  const useCases = [
    `Streamlining daily ${subcategory} workflows by using ${name} for accurate ${name.toLowerCase()}.`,
    `Executing ${name.toLowerCase()} securely on confidential files without third-party server exposure.`,
    `Working on mobile devices or remote workstations where dedicated desktop software for ${name.toLowerCase()} is unavailable.`,
    `Enhancing productivity across academic, professional, and personal ${category} tasks with ${name}.`
  ];

  const howToUseSteps = [
    `Step 1: Enter your input data, upload your file, or set parameters in the ${name} workspace.`,
    `Step 2: Customize any preferences, options, or target settings specific to ${name.toLowerCase()}.`,
    `Step 3: Click the primary execute button to run ${name} and process your data.`,
    `Step 4: Review your generated ${name.toLowerCase()} result and copy text or download your file directly.`
  ];

  const defaultFaqs: FAQItem[] = mapped?.faqs && mapped.faqs.length > 0
    ? mapped.faqs
    : kwMap.faqs;

  // Build unique overview paragraphs
  const customIntro = mapped?.introduction || kwMap.detailedOverview;
  const overview = `${name} is a free online utility specifically built for ${subcategory} tasks. ${customIntro} Designed for speed, privacy, and convenience, ${name} allows you to perform ${name.toLowerCase()} instantly in your browser without downloading heavy software packages or waiting for server processing queues.

Whether you are working from a desktop, laptop, tablet, or smartphone, ${name} provides an intuitive, high-speed workspace tailored for daily productivity. ${privacySecurity}`;

  return {
    metaTitle,
    metaDescription,
    primaryKeyword: mapped?.primaryKeyword || kwMap.primaryKeyword,
    secondaryKeywords: mapped?.secondaryKeywords || kwMap.secondaryKeywords,
    searchIntent: mapped?.searchIntent || kwMap.searchIntent,
    semanticRelatedTerms: mapped?.semanticRelatedTerms || kwMap.semanticEntities,
    overview,
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
    processingDetails: privacySecurity,
    useCases,
    keyFeatures,
    howToUseSteps,
    faqs: defaultFaqs,
  };
}

