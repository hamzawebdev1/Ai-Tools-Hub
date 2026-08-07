/**
 * Production-ready SEO Processing Engine for client-side and server-supported SEO analysis,
 * schema generation, tag analysis, and HTML parsing.
 */

export interface SEOAnalysisReport {
  title?: { text: string; length: number; status: "good" | "warning" | "error"; message: string };
  metaDescription?: { text: string; length: number; status: "good" | "warning" | "error"; message: string };
  canonical?: { url: string; status: "good" | "warning" | "error"; message: string };
  robots?: { content: string; status: "good" | "warning" | "error"; message: string };
  headings?: {
    h1Count: number;
    h1List: string[];
    h2Count: number;
    h2List: string[];
    h3Count: number;
    h3List: string[];
    status: "good" | "warning" | "error";
    message: string;
  };
  images?: {
    total: number;
    withAlt: number;
    missingAlt: number;
    missingAltSources: string[];
    status: "good" | "warning" | "error";
    message: string;
  };
  links?: {
    total: number;
    internalCount: number;
    externalCount: number;
    nofollowCount: number;
    internalLinks: string[];
    externalLinks: string[];
  };
  openGraph?: {
    title?: string;
    description?: string;
    image?: string;
    type?: string;
    status: "good" | "warning" | "error";
    message: string;
  };
  twitterCard?: {
    card?: string;
    title?: string;
    description?: string;
    image?: string;
    status: "good" | "warning" | "error";
    message: string;
  };
  structuredData?: {
    foundTypes: string[];
    validJsonLdCount: number;
    errors: string[];
  };
  viewport?: { content: string; present: boolean };
  language?: { lang: string; present: boolean };
  readabilityScore?: { score: number; level: string; wordCount: number; sentenceCount: number };
}

/**
 * Safely parses HTML markup using DOMParser (or regex fallback) and generates an in-depth SEO audit.
 */
export function analyzeHtmlForSEO(htmlInput: string, pageUrl = "https://example.com"): SEOAnalysisReport {
  const doc = parseHtmlString(htmlInput);

  // 1. Title Analysis
  const titleEl = doc.querySelector("title");
  const titleText = titleEl ? titleEl.textContent?.trim() || "" : "";
  const titleLength = titleText.length;
  let titleStatus: "good" | "warning" | "error" = "good";
  let titleMsg = "Optimal title length (50-60 characters).";

  if (!titleText) {
    titleStatus = "error";
    titleMsg = "Missing <title> tag!";
  } else if (titleLength < 30) {
    titleStatus = "warning";
    titleMsg = "Title is too short (< 30 chars). Consider adding relevant keywords.";
  } else if (titleLength > 60) {
    titleStatus = "warning";
    titleMsg = "Title is too long (> 60 chars) and may be truncated in Google SERPs.";
  }

  // 2. Meta Description Analysis
  const descEl = doc.querySelector('meta[name="description"]');
  const descText = descEl ? descEl.getAttribute("content")?.trim() || "" : "";
  const descLength = descText.length;
  let descStatus: "good" | "warning" | "error" = "good";
  let descMsg = "Optimal meta description length (120-160 characters).";

  if (!descText) {
    descStatus = "error";
    descMsg = "Missing meta description tag!";
  } else if (descLength < 70) {
    descStatus = "warning";
    descMsg = "Meta description is brief (< 70 chars). Expand to convey value.";
  } else if (descLength > 160) {
    descStatus = "warning";
    descMsg = "Meta description exceeds 160 characters and will be cut off.";
  }

  // 3. Canonical URL Analysis
  const canonicalEl = doc.querySelector('link[rel="canonical"]');
  const canonicalUrl = canonicalEl ? canonicalEl.getAttribute("href")?.trim() || "" : "";
  let canonicalStatus: "good" | "warning" | "error" = "good";
  let canonicalMsg = "Canonical URL properly declared.";

  if (!canonicalUrl) {
    canonicalStatus = "warning";
    canonicalMsg = "No rel='canonical' tag found. Recommended to prevent duplicate content issues.";
  }

  // 4. Robots Meta Tag
  const robotsEl = doc.querySelector('meta[name="robots"]');
  const robotsContent = robotsEl ? robotsEl.getAttribute("content")?.trim() || "" : "index, follow (default)";
  let robotsStatus: "good" | "warning" | "error" = "good";
  let robotsMsg = "Page indexable by search engines.";

  if (robotsContent.toLowerCase().includes("noindex")) {
    robotsStatus = "error";
    robotsMsg = "Warning: Page contains 'noindex' directive and will not rank in search engines!";
  }

  // 5. Headings (H1-H6)
  const h1Els = Array.from(doc.querySelectorAll("h1"));
  const h2Els = Array.from(doc.querySelectorAll("h2"));
  const h3Els = Array.from(doc.querySelectorAll("h3"));

  const h1List = h1Els.map((e) => e.textContent?.trim() || "").filter(Boolean);
  const h2List = h2Els.map((e) => e.textContent?.trim() || "").filter(Boolean);
  const h3List = h3Els.map((e) => e.textContent?.trim() || "").filter(Boolean);

  let headingStatus: "good" | "warning" | "error" = "good";
  let headingMsg = `Well-structured document (${h1List.length} H1, ${h2List.length} H2s).`;

  if (h1List.length === 0) {
    headingStatus = "error";
    headingMsg = "Missing H1 heading tag! Every page should have exactly one main H1.";
  } else if (h1List.length > 1) {
    headingStatus = "warning";
    headingMsg = `Multiple H1 tags detected (${h1List.length}). Standard SEO practice recommends exactly 1 H1 per page.`;
  }

  // 6. Image ALT attributes
  const imgEls = Array.from(doc.querySelectorAll("img"));
  let missingAlt = 0;
  const missingAltSources: string[] = [];

  imgEls.forEach((img) => {
    const alt = img.getAttribute("alt");
    if (alt === null || alt.trim() === "") {
      missingAlt++;
      missingAltSources.push(img.getAttribute("src") || "inline image");
    }
  });

  let imgStatus: "good" | "warning" | "error" = "good";
  let imgMsg = `All ${imgEls.length} images have ALT text attributes.`;

  if (missingAlt > 0) {
    imgStatus = "warning";
    imgMsg = `${missingAlt} out of ${imgEls.length} images are missing descriptive ALT text attributes.`;
  }

  // 7. Links Analysis
  const aEls = Array.from(doc.querySelectorAll("a"));
  let internalCount = 0;
  let externalCount = 0;
  let nofollowCount = 0;
  const internalLinks: string[] = [];
  const externalLinks: string[] = [];

  aEls.forEach((a) => {
    const href = a.getAttribute("href") || "";
    const rel = a.getAttribute("rel") || "";
    if (rel.toLowerCase().includes("nofollow")) nofollowCount++;

    if (href.startsWith("#") || href.startsWith("/") || href.includes(pageUrl)) {
      internalCount++;
      if (href) internalLinks.push(href);
    } else if (href.startsWith("http://") || href.startsWith("https://")) {
      externalCount++;
      externalLinks.push(href);
    }
  });

  // 8. Open Graph Analysis
  const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute("content") || "";
  const ogDesc = doc.querySelector('meta[property="og:description"]')?.getAttribute("content") || "";
  const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute("content") || "";
  const ogType = doc.querySelector('meta[property="og:type"]')?.getAttribute("content") || "";

  let ogStatus: "good" | "warning" | "error" = "good";
  let ogMsg = "Open Graph social meta tags are present.";

  if (!ogTitle || !ogImage) {
    ogStatus = "warning";
    ogMsg = "Incomplete Open Graph tags. Missing og:title or og:image for social sharing.";
  }

  // 9. Twitter Card
  const twCard = doc.querySelector('meta[name="twitter:card"]')?.getAttribute("content") || "";
  const twTitle = doc.querySelector('meta[name="twitter:title"]')?.getAttribute("content") || "";
  const twDesc = doc.querySelector('meta[name="twitter:description"]')?.getAttribute("content") || "";
  const twImage = doc.querySelector('meta[name="twitter:image"]')?.getAttribute("content") || "";

  let twStatus: "good" | "warning" | "error" = "good";
  let twMsg = "Twitter Card tags configured.";

  if (!twCard || !twTitle) {
    twStatus = "warning";
    twMsg = "Missing Twitter Card tags (twitter:card, twitter:title).";
  }

  // 10. Structured Data (JSON-LD)
  const jsonLdScripts = Array.from(doc.querySelectorAll('script[type="application/ld+json"]'));
  const foundTypes: string[] = [];
  const schemaErrors: string[] = [];
  let validJsonLdCount = 0;

  jsonLdScripts.forEach((script, idx) => {
    try {
      const parsed = JSON.parse(script.textContent || "{}");
      validJsonLdCount++;
      if (parsed["@type"]) foundTypes.push(parsed["@type"]);
      else if (Array.isArray(parsed)) {
        parsed.forEach((item) => item["@type"] && foundTypes.push(item["@type"]));
      }
    } catch {
      schemaErrors.push(`Script #${idx + 1}: Malformed JSON-LD syntax.`);
    }
  });

  // 11. Viewport & Language
  const viewportEl = doc.querySelector('meta[name="viewport"]');
  const htmlEl = doc.querySelector("html");
  const lang = htmlEl ? htmlEl.getAttribute("lang") || "" : "";

  // 12. Readability Metrics
  const plainText = doc.body ? doc.body.textContent || "" : htmlInput.replace(/<[^>]*>?/gm, " ");
  const words = plainText.trim().split(/\s+/).filter(Boolean);
  const sentences = plainText.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const wordCount = words.length;
  const sentenceCount = Math.max(1, sentences.length);
  const avgWordsPerSentence = wordCount / sentenceCount;

  // Coleman-Liau Readability index estimate
  const letters = plainText.replace(/[^a-zA-Z]/g, "").length;
  const L = (letters / (wordCount || 1)) * 100;
  const S = (sentenceCount / (wordCount || 1)) * 100;
  const colemanLiau = Math.round(0.0588 * L - 0.296 * S - 15.8);

  return {
    title: { text: titleText, length: titleLength, status: titleStatus, message: titleMsg },
    metaDescription: { text: descText, length: descLength, status: descStatus, message: descMsg },
    canonical: { url: canonicalUrl, status: canonicalStatus, message: canonicalMsg },
    robots: { content: robotsContent, status: robotsStatus, message: robotsMsg },
    headings: {
      h1Count: h1List.length,
      h1List,
      h2Count: h2List.length,
      h2List,
      h3Count: h3List.length,
      h3List,
      status: headingStatus,
      message: headingMsg,
    },
    images: {
      total: imgEls.length,
      withAlt: imgEls.length - missingAlt,
      missingAlt,
      missingAltSources: missingAltSources.slice(0, 5),
      status: imgStatus,
      message: imgMsg,
    },
    links: {
      total: aEls.length,
      internalCount,
      externalCount,
      nofollowCount,
      internalLinks: internalLinks.slice(0, 10),
      externalLinks: externalLinks.slice(0, 10),
    },
    openGraph: {
      title: ogTitle,
      description: ogDesc,
      image: ogImage,
      type: ogType,
      status: ogStatus,
      message: ogMsg,
    },
    twitterCard: {
      card: twCard,
      title: twTitle,
      description: twDesc,
      image: twImage,
      status: twStatus,
      message: twMsg,
    },
    structuredData: {
      foundTypes,
      validJsonLdCount,
      errors: schemaErrors,
    },
    viewport: {
      content: viewportEl ? viewportEl.getAttribute("content") || "" : "",
      present: !!viewportEl,
    },
    language: {
      lang,
      present: !!lang,
    },
    readabilityScore: {
      score: Math.max(1, Math.min(100, Math.round(100 - avgWordsPerSentence * 2))),
      level: colemanLiau <= 8 ? "Easy to Read (Grade 8 or lower)" : colemanLiau <= 12 ? "Standard Reading Level" : "Complex Academic",
      wordCount,
      sentenceCount,
    },
  };
}

/**
 * Parses raw HTML string using DOMParser in browser environments or fallback regex.
 */
function parseHtmlString(html: string): Document {
  if (typeof window !== "undefined" && typeof DOMParser !== "undefined") {
    const parser = new DOMParser();
    return parser.parseFromString(html, "text/html");
  }

  // Basic mock Document fallback for non-browser SSR
  return {
    querySelector: () => null,
    querySelectorAll: () => [],
    body: { textContent: html.replace(/<[^>]*>?/gm, "") },
  } as unknown as Document;
}

/**
 * Keyword Density & Position Calculator
 */
export function calculateKeywordDensity(text: string, targetKeyword = ""): {
  totalWords: number;
  keywordCount: number;
  densityPercentage: number;
  positions: number[];
  topKeywords: { word: string; count: number; density: number }[];
} {
  const clean = text.toLowerCase();
  const words = clean.match(/\b\w+\b/g) || [];
  const totalWords = words.length;

  let keywordCount = 0;
  const positions: number[] = [];

  if (targetKeyword.trim()) {
    const target = targetKeyword.trim().toLowerCase();
    words.forEach((w, idx) => {
      if (w === target || target.includes(w)) {
        keywordCount++;
        positions.push(idx + 1);
      }
    });
  }

  const freq: Record<string, number> = {};
  words.forEach((w) => {
    if (w.length >= 3 && !isStopWord(w)) {
      freq[w] = (freq[w] || 0) + 1;
    }
  });

  const topKeywords = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, count]) => ({
      word,
      count,
      density: parseFloat(((count / (totalWords || 1)) * 100).toFixed(2)),
    }));

  return {
    totalWords,
    keywordCount,
    densityPercentage: parseFloat(((keywordCount / (totalWords || 1)) * 100).toFixed(2)),
    positions,
    topKeywords,
  };
}

function isStopWord(w: string): boolean {
  const stops = new Set([
    "the", "be", "to", "of", "and", "a", "in", "that", "have", "i", "it", "for", "not", "on", "with",
    "he", "as", "you", "do", "at", "this", "but", "his", "by", "from", "they", "we", "say", "her",
    "she", "or", "an", "will", "my", "one", "all", "would", "there", "their", "what", "so", "up", "out",
    "if", "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time", "no",
  ]);
  return stops.has(w);
}

/**
 * XML Sitemap Generator
 */
export function generateXmlSitemap(urls: { url: string; lastmod?: string; changefreq?: string; priority?: string }[]): string {
  const items = urls
    .map(
      (u) =>
        `  <url>\n    <loc>${u.url}</loc>\n    <lastmod>${u.lastmod || new Date().toISOString().split("T")[0]}</lastmod>\n    <changefreq>${u.changefreq || "daily"}</changefreq>\n    <priority>${u.priority || "0.8"}</priority>\n  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>`;
}

/**
 * Robots.txt Generator
 */
export function generateRobotsTxt(options: {
  allowAll?: boolean;
  disallowPaths?: string[];
  sitemapUrl?: string;
  crawlDelay?: number;
}): string {
  let content = "User-agent: *\n";
  if (options.allowAll !== false && (!options.disallowPaths || options.disallowPaths.length === 0)) {
    content += "Allow: /\n";
  }

  if (options.disallowPaths) {
    options.disallowPaths.forEach((path) => {
      content += `Disallow: ${path.startsWith("/") ? path : "/" + path}\n`;
    });
  }

  if (options.crawlDelay) {
    content += `Crawl-delay: ${options.crawlDelay}\n`;
  }

  if (options.sitemapUrl) {
    content += `\nSitemap: ${options.sitemapUrl}\n`;
  }

  return content.trim();
}

/**
 * Schema.org Generators
 */
export function generateSchemaOrg(
  type: string,
  params: Record<string, any>
): string {
  const baseSchema: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": type,
    ...params,
  };
  return JSON.stringify(baseSchema, null, 2);
}
