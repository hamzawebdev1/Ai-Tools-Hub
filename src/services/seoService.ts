import { AITool, BlogPost, CategoryInfo, ToolCategory, SEOPageType } from "../types";
import { TOOLS_DATA } from "../data/toolsData";
import { CATEGORIES_DATA } from "../data/categoriesData";
import { BLOG_POSTS_DATA } from "../data/blogData";

export interface SEOMetadata {
  pageType: SEOPageType;
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  ogType: "website" | "article" | "product";
  ogImage: string;
  ogImageAlt?: string;
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
  noIndex: boolean;
  robotsMeta: string;
  schemas: Record<string, any>[];
  breadcrumbs?: { name: string; url: string }[];
}

const SITE_NAME = "Mehzan Tools Hub";

export function getDomain(): string {
  if (typeof window !== "undefined" && window.location.origin) {
    const origin = window.location.origin.replace(/\/+$/, "");
    if (!origin.includes("run.app") && !origin.includes("localhost") && !origin.includes("127.0.0.1")) {
      return origin.includes("mehzandigital.com") && !origin.includes("www.mehzandigital.com")
        ? origin.replace("mehzandigital.com", "www.mehzandigital.com")
        : origin;
    }
  }
  const rawEnv = (typeof process !== "undefined" && (process.env?.PRODUCTION_DOMAIN || process.env?.APP_URL)) ||
                 (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_APP_URL) || "";
  if (rawEnv && !rawEnv.includes("run.app") && !rawEnv.includes("localhost") && !rawEnv.includes("127.0.0.1")) {
    let clean = rawEnv.replace(/\/+$/, "");
    if (clean.includes("mehzandigital.com") && !clean.includes("www.mehzandigital.com")) {
      clean = clean.replace("mehzandigital.com", "www.mehzandigital.com");
    }
    return clean;
  }
  return "https://www.mehzandigital.com";
}

/**
 * Generate robots directive string based on page type
 */
export function getRobotsMeta(pageType: SEOPageType): string {
  switch (pageType) {
    case "PUBLIC_INDEXABLE":
      return "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
    case "PUBLIC_NON_INDEXABLE":
      return "noindex, follow";
    case "PRIVATE":
    case "NOT_FOUND":
    case "REDIRECT":
    default:
      return "noindex, nofollow";
  }
}

/**
 * Single Source of Truth for Indexable Sitemap Routes
 * Extracted directly from central tool, category, and blog registries.
 */
export function getPublicIndexableRoutes(): Array<{ urlPath: string; priority: string; changefreq: string }> {
  const routes: Array<{ urlPath: string; priority: string; changefreq: string }> = [
    { urlPath: "/", priority: "1.0", changefreq: "daily" },
    { urlPath: "/tools", priority: "0.9", changefreq: "daily" },
    { urlPath: "/categories", priority: "0.8", changefreq: "weekly" },
    { urlPath: "/blog", priority: "0.8", changefreq: "daily" },
    { urlPath: "/about", priority: "0.5", changefreq: "monthly" },
    { urlPath: "/contact", priority: "0.5", changefreq: "monthly" },
    { urlPath: "/privacy", priority: "0.3", changefreq: "yearly" },
    { urlPath: "/terms", priority: "0.3", changefreq: "yearly" },
    { urlPath: "/disclaimer", priority: "0.3", changefreq: "yearly" },
    { urlPath: "/cookie-policy", priority: "0.3", changefreq: "yearly" },
    { urlPath: "/copyright", priority: "0.3", changefreq: "yearly" },
  ];

  // 1. Active Tools (Strictly /en/${slug})
  const activeTools = TOOLS_DATA.filter((t) => t.status !== "DISABLED" && t.isActive !== false);
  for (const tool of activeTools) {
    routes.push({ urlPath: `/en/${tool.slug}`, priority: "0.9", changefreq: "daily" });
  }

  // 2. Categories (/category/${slug})
  for (const cat of CATEGORIES_DATA) {
    routes.push({ urlPath: `/category/${cat.slug}`, priority: "0.8", changefreq: "weekly" });
  }

  // 3. Blog Posts (/blog/${slug})
  for (const post of BLOG_POSTS_DATA) {
    routes.push({ urlPath: `/blog/${post.slug}`, priority: "0.8", changefreq: "monthly" });
  }

  // 4. Authors (/author/${slug})
  const authorSlugs = Array.from(
    new Set(
      BLOG_POSTS_DATA.map((p) =>
        p.author.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      )
    )
  );
  for (const author of authorSlugs) {
    routes.push({ urlPath: `/author/${author}`, priority: "0.6", changefreq: "monthly" });
  }

  return routes;
}
const DEFAULT_OG_IMAGE = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=630&q=80";

/**
 * Generate full domain canonical URL.
 * Automatically strips tracking query params, hashes, and trailing slashes.
 */
export function getCanonicalUrl(path: string = "/"): string {
  // Strip query params and hash
  let clean = (path || "/").split("?")[0].split("#")[0].trim();
  
  // Normalize root path
  if (!clean || clean === "/" || clean === "") {
    const domain = getDomain();
    return domain ? `${domain}/` : "/";
  }

  // Remove leading and trailing slashes for standardization
  clean = clean.replace(/^\/+|\/+$/g, "");
  const origin = getDomain();
  return origin ? `${origin}/${clean}` : `/${clean}`;
}

/**
 * Auto-generate SEO Title if missing
 */
export function generateAutoTitle(topic: string, category?: string): string {
  if (category) {
    return `${topic} Online - Free ${category.toUpperCase()} Tool | ${SITE_NAME}`;
  }
  return `${topic} Online - Free Utility Tool | ${SITE_NAME}`;
}

/**
 * Auto-generate Meta Description if missing
 */
export function generateAutoDescription(text: string, fallbackSubject: string): string {
  if (!text) {
    return `Access our free online ${fallbackSubject} tool. Fast, private, 100% in-browser with no registration required on ${SITE_NAME}.`;
  }
  const cleanText = text.replace(/<[^>]*>?/gm, "").trim();
  if (cleanText.length <= 155) return cleanText;
  return `${cleanText.substring(0, 152)}...`;
}

/**
 * Image Alt Text Generator
 */
export function generateSeoAltText(item: { name?: string; title?: string; category?: string; tagline?: string }): string {
  const label = item.name || item.title || "Utility Tool";
  const desc = item.tagline || item.category || "Mehzan Tools Hub";
  return `${label} - ${desc} Preview Graphic`;
}

/**
 * Auto Related Tools algorithm: computes similarity score based on category, tags, and popularity
 */
export function getAutoRelatedTools(currentTool: AITool, limit: number = 3): AITool[] {
  const otherTools = TOOLS_DATA.filter((t) => t.id !== currentTool.id);
  
  const scored = otherTools.map((tool) => {
    let score = 0;
    // Category match
    if (tool.category === currentTool.category) {
      score += 10;
    }
    // Tag overlap
    const sharedTags = tool.tags.filter((tag) => currentTool.tags.includes(tag));
    score += sharedTags.length * 4;
    // Popularity / Rating bonus
    score += tool.rating;
    
    return { tool, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.tool);
}

/**
 * Auto Related Articles algorithm for a tool or category
 */
export function getAutoRelatedArticles(categorySlug?: string, toolTags?: string[], limit: number = 3): BlogPost[] {
  return BLOG_POSTS_DATA.filter((post) => {
    if (categorySlug && post.category.toLowerCase().includes(categorySlug.toLowerCase())) {
      return true;
    }
    if (toolTags && toolTags.some((tag) => post.tags.some((pt) => pt.toLowerCase().includes(tag.toLowerCase())))) {
      return true;
    }
    return true; // fallback to include post
  }).slice(0, limit);
}

/**
 * Person Schema (JSON-LD) for Founder & Lead Author
 */
export function getPersonSchema() {
  const domain = getDomain();
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${domain}/#hamza`,
    "name": "Hamza",
    "jobTitle": "Founder, Web Developer & Digital Marketing Expert",
    "description": "Hamza is the Founder of Mehzan Digital and a Web Developer and Digital Marketing Expert with 5+ years of experience in web development and digital marketing. He operates his own agency specializing in custom web applications, search engine optimization, and client-side web utility architectures.",
    "image": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    "worksFor": {
      "@type": "Organization",
      "@id": `${domain}/#organization`,
      "name": "Mehzan Digital",
      "url": domain || "https://www.mehzandigital.com"
    },
    "knowsAbout": [
      "Web Development",
      "Digital Marketing",
      "Technical SEO",
      "Client-Side Engineering",
      "Online Tools"
    ]
  };
}

/**
 * Organization Schema (JSON-LD)
 */
export function getOrganizationSchema() {
  const domain = getDomain();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${domain}/#organization`,
    "name": "Mehzan Digital",
    "alternateName": "Mehzan Tools Hub",
    "url": domain || "https://www.mehzandigital.com",
    "logo": {
      "@type": "ImageObject",
      "url": `${domain}/icon.png`,
      "width": 512,
      "height": 512
    },
    "description": "Mehzan Digital is a web development and digital marketing agency and provider of Mehzan Tools Hub, a free browser-native execution suite of online tools for PDF, image, text, developer, and calculation tasks.",
    "founder": {
      "@type": "Person",
      "@id": `${domain}/#hamza`,
      "name": "Hamza",
      "jobTitle": "Founder, Web Developer & Digital Marketing Expert"
    },
    "sameAs": [
      "https://twitter.com/mehzandigital",
      "https://github.com/mehzandigital",
      "https://linkedin.com/company/mehzandigital"
    ],
    "knowsAbout": [
      "Web Development",
      "Digital Marketing",
      "Technical SEO",
      "Client-Side Engineering",
      "Online Tools"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "email": "support@mehzandigital.com",
      "availableLanguage": ["English"]
    }
  };
}

/**
 * Website Schema + Search Action Schema for Sitelinks Searchbox
 */
export function getWebsiteSchema() {
  const domain = getDomain();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${domain}/#website`,
    "url": domain || "https://www.mehzandigital.com",
    "name": "Mehzan Digital Tools Hub",
    "description": "Discover and execute 150+ free online utility tools for PDF, image, text, developer, and calculation tasks on Mehzan Tools Hub.",
    "publisher": {
      "@id": `${domain}/#organization`
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${domain}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };
}

/**
 * Generic WebPage Schema generator
 */
export function getWebPageSchema(url: string, name: string, description: string, pageType: string = "WebPage") {
  const domain = getDomain();
  const pageUrl = url.startsWith("http") ? url : getCanonicalUrl(url);
  return {
    "@context": "https://schema.org",
    "@type": pageType,
    "@id": `${pageUrl}/#webpage`,
    "url": pageUrl,
    "name": name,
    "description": description,
    "isPartOf": {
      "@id": `${domain}/#website`
    },
    "publisher": {
      "@id": `${domain}/#organization`
    }
  };
}

/**
 * BreadcrumbList Schema generator
 */
export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url.startsWith("http") ? item.url : getCanonicalUrl(item.url)
    }))
  };
}

/**
 * SoftwareApplication / Tool Schema (No fabricated ratings/reviews)
 */
export function getToolSoftwareSchema(tool: AITool) {
  const toolUrl = getCanonicalUrl(`/en/${tool.slug}`);
  const domain = getDomain();
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${toolUrl}/#software`,
    "name": tool.name,
    "applicationCategory": getApplicationCategory(tool.category),
    "operatingSystem": "All Web Browsers (Client-side / Web-native)",
    "description": tool.seoContent?.metaDescription || tool.description,
    "url": toolUrl,
    "image": DEFAULT_OG_IMAGE,
    "isPartOf": {
      "@id": `${toolUrl}/#webpage`
    },
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "featureList": tool.seoContent?.keyFeatures?.join(", ") || tool.tags.join(", "),
    "author": {
      "@id": `${domain}/#organization`
    },
    "publisher": {
      "@id": `${domain}/#organization`
    }
  };
}

function getApplicationCategory(category: ToolCategory): string {
  switch (category) {
    case "writing": return "BusinessApplication";
    case "coding": return "DeveloperApplication";
    case "seo": return "BusinessApplication";
    case "media": return "MultimediaApplication";
    case "social": return "SocialNetworkingApplication";
    case "productivity": return "UtilitiesApplication";
    case "business": return "BusinessApplication";
    default: return "UtilitiesApplication";
  }
}

/**
 * HowTo Schema for Tool Execution Steps
 */
export function getToolHowToSchema(tool: AITool) {
  if (!tool.seoContent?.howToUseSteps || tool.seoContent.howToUseSteps.length === 0) {
    return null;
  }

  const toolUrl = getCanonicalUrl(`/en/${tool.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": `How to use ${tool.name}`,
    "description": `Step-by-step instructions to generate output using the ${tool.name}.`,
    "url": toolUrl,
    "totalTime": "PT1M",
    "step": tool.seoContent.howToUseSteps.map((stepText, idx) => ({
      "@type": "HowToStep",
      "position": idx + 1,
      "name": `Step ${idx + 1}`,
      "text": stepText,
      "url": `${toolUrl}#step-${idx + 1}`
    }))
  };
}

/**
 * FAQPage Schema
 */
export function getFAQSchema(faqs: { question: string; answer: string }[]) {
  if (!faqs || faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

/**
 * Article Schema for Blog Posts
 */
export function getArticleSchema(post: BlogPost) {
  const postUrl = getCanonicalUrl(`/blog/${post.slug}`);
  let publishedDate = new Date().toISOString();
  let modifiedDate = new Date().toISOString();
  try {
    const pParsed = new Date(post.date);
    if (!isNaN(pParsed.getTime())) publishedDate = pParsed.toISOString();
  } catch {}
  try {
    const mParsed = new Date(post.updatedDate || post.date);
    if (!isNaN(mParsed.getTime())) modifiedDate = mParsed.toISOString();
  } catch {}

  return {
    "@context": "https://schema.org",
    "@type": ["BlogPosting", "Article"],
    "@id": `${postUrl}/#article`,
    "headline": post.title,
    "description": post.excerpt,
    "image": [post.image],
    "datePublished": publishedDate,
    "dateModified": modifiedDate,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": postUrl
    },
    "author": {
      "@type": "Person",
      "@id": post.author.name.toLowerCase().includes("hamza") ? `${getDomain()}/#hamza` : undefined,
      "name": post.author.name,
      "jobTitle": post.author.role,
      "image": post.author.avatar,
      "description": post.author.bio,
      "worksFor": {
        "@id": `${getDomain()}/#organization`
      }
    },
    "publisher": {
      "@id": `${getDomain()}/#organization`
    },
    "articleSection": post.category,
    "keywords": post.tags.join(", ")
  };
}

/**
 * Main Metadata Aggregator function for active view
 */
export function buildSEOMetadata(
  activeTab: string,
  data?: {
    tool?: AITool;
    category?: CategoryInfo | string;
    post?: BlogPost;
    searchQuery?: string;
  }
): SEOMetadata {
  const orgSchema = getOrganizationSchema();
  const websiteSchema = getWebsiteSchema();

  switch (activeTab) {
    case "home": {
      const canonicalUrl = getCanonicalUrl("/");
      const pageType: SEOPageType = "PUBLIC_INDEXABLE";
      const title = "Mehzan Digital Tools Hub - Free Online Web Utilities, PDF & Image Tools";
      const description = "Access 150+ free online utility tools on Mehzan Tools Hub including PDF merger, image compressor, JSON formatter, word counter, and QR generator. Fast, private, and 100% in-browser.";
      return {
        pageType,
        noIndex: false,
        robotsMeta: getRobotsMeta(pageType),
        title,
        description,
        keywords: ["Mehzan Digital", "Mehzan Tools Hub", "Hamza web developer", "free online tools", "PDF tools", "image compressor", "JSON formatter", "text tools", "web utilities"],
        canonicalUrl,
        ogType: "website",
        ogImage: DEFAULT_OG_IMAGE,
        schemas: [
          orgSchema,
          getPersonSchema(),
          websiteSchema,
          getWebPageSchema(canonicalUrl, title, description),
          getBreadcrumbSchema([{ name: "Home", url: "/" }]),
          getFAQSchema([
            {
              question: "Are all utility tools on this website free?",
              answer: "Yes! Mehzan Tools Hub provides 100% free online browser utility tools with instant execution and zero paywalls."
            },
            {
              question: "Do I need to sign up or enter a credit card?",
              answer: "No registration or payment details are required to use our suite of web utilities."
            },
            {
              question: "Is my data and text kept private?",
              answer: "Absolutely. All conversions and calculations execute client-side or transiently in memory, ensuring complete data privacy."
            }
          ])!
        ],
        breadcrumbs: [{ name: "Home", url: "/" }]
      };
    }

    case "all-tools": {
      const canonicalUrl = getCanonicalUrl("/tools");
      const pageType: SEOPageType = "PUBLIC_INDEXABLE";
      const title = "All Free Online Tools Directory | Mehzan Tools Hub";
      const description = "Explore the comprehensive directory of 150+ free online tools categorized by PDF, Image, Text, Developer, SEO, Security, and Calculators on Mehzan Tools Hub.";
      const breadcrumbs = [
        { name: "Home", url: "/" },
        { name: "All Tools", url: "/tools" }
      ];
      return {
        pageType,
        noIndex: false,
        robotsMeta: getRobotsMeta(pageType),
        title,
        description,
        keywords: ["tools directory", "free online utilities list", "web tools catalog", "Mehzan Digital tools"],
        canonicalUrl,
        ogType: "website",
        ogImage: DEFAULT_OG_IMAGE,
        schemas: [
          orgSchema,
          getWebPageSchema(canonicalUrl, title, description),
          getBreadcrumbSchema(breadcrumbs)
        ],
        breadcrumbs
      };
    }

    case "categories": {
      const canonicalUrl = getCanonicalUrl("/categories");
      const pageType: SEOPageType = "PUBLIC_INDEXABLE";
      const title = "Browse Tool Categories | Mehzan Tools Hub";
      const description = "Filter tools by specialized categories including PDF Tools, Image Processing, Text Utilities, Developer Code, SEO & SERP, and Calculators on Mehzan Tools Hub.";
      const breadcrumbs = [
        { name: "Home", url: "/" },
        { name: "Categories", url: "/categories" }
      ];
      return {
        pageType,
        noIndex: false,
        robotsMeta: getRobotsMeta(pageType),
        title,
        description,
        keywords: ["tool categories", "PDF utilities", "image tools category", "developer tools"],
        canonicalUrl,
        ogType: "website",
        ogImage: DEFAULT_OG_IMAGE,
        schemas: [
          orgSchema,
          getWebPageSchema(canonicalUrl, title, description),
          getBreadcrumbSchema(breadcrumbs)
        ],
        breadcrumbs
      };
    }

    case "category-detail": {
      const catObj = typeof data?.category === "object" ? data.category : CATEGORIES_DATA.find((c) => c.slug === data?.category);
      const catName = catObj ? catObj.name : "Category";
      const catSlug = catObj ? catObj.slug : "category";
      const canonicalUrl = getCanonicalUrl(`/category/${catSlug}`);
      const pageType: SEOPageType = "PUBLIC_INDEXABLE";
      const title = `${catName} - Free Online Utilities | Mehzan Tools Hub`;
      const description = catObj?.description || `Explore top-rated free ${catName} on Mehzan Tools Hub. Fast, secure, browser-native processing.`;
      const breadcrumbs = [
        { name: "Home", url: "/" },
        { name: "Categories", url: "/categories" },
        { name: catName, url: `/category/${catSlug}` }
      ];
      return {
        pageType,
        noIndex: false,
        robotsMeta: getRobotsMeta(pageType),
        title,
        description,
        keywords: [catName, `${catName} tools`, `free ${catName} online`],
        canonicalUrl,
        ogType: "website",
        ogImage: DEFAULT_OG_IMAGE,
        schemas: [
          orgSchema,
          getWebPageSchema(canonicalUrl, title, description),
          getBreadcrumbSchema(breadcrumbs)
        ],
        breadcrumbs
      };
    }

    case "tool-detail": {
      const tool = data?.tool || TOOLS_DATA[0];
      const canonicalUrl = getCanonicalUrl(`/en/${tool.slug}`);
      const pageType: SEOPageType = "PUBLIC_INDEXABLE";
      const title = tool.seoContent?.metaTitle || `${tool.name} Online - Free Tool | Mehzan Tools Hub`;
      const description = tool.seoContent?.metaDescription || `${tool.description} 100% free, private in-browser utility on Mehzan Tools Hub.`;
      const breadcrumbs = [
        { name: "Home", url: "/" },
        { name: tool.category ? `${tool.category.toUpperCase()} Tools` : "Tools", url: `/category/${tool.category || "pdf-tools"}` },
        { name: tool.name, url: `/en/${tool.slug}` }
      ];

      const schemas: Record<string, any>[] = [
        orgSchema,
        getWebPageSchema(canonicalUrl, title, description),
        getBreadcrumbSchema(breadcrumbs),
        getToolSoftwareSchema(tool)
      ];

      const howToSchema = getToolHowToSchema(tool);
      if (howToSchema) schemas.push(howToSchema);

      const faqSchema = getFAQSchema(tool.seoContent?.faqs || []);
      if (faqSchema) schemas.push(faqSchema);

      return {
        pageType,
        noIndex: false,
        robotsMeta: getRobotsMeta(pageType),
        title,
        description,
        keywords: [tool.name, ...tool.tags, tool.category, "free online tool", "Mehzan Digital"],
        canonicalUrl,
        ogType: "product",
        ogImage: DEFAULT_OG_IMAGE,
        schemas,
        breadcrumbs
      };
    }

    case "blog": {
      const canonicalUrl = getCanonicalUrl("/blog");
      const pageType: SEOPageType = "PUBLIC_INDEXABLE";
      const title = "Tech Insights, Tutorials & Utility Guides | Mehzan Tools Hub Blog";
      const description = "Read expert guides on client-side security, file processing, PDF workflows, image optimization, and web developer utilities on Mehzan Tools Hub.";
      const breadcrumbs = [
        { name: "Home", url: "/" },
        { name: "Blog & Guides", url: "/blog" }
      ];
      return {
        pageType,
        noIndex: false,
        robotsMeta: getRobotsMeta(pageType),
        title,
        description,
        keywords: ["web utilities blog", "PDF guides", "image compression tips", "developer tutorials", "Mehzan Digital"],
        canonicalUrl,
        ogType: "website",
        ogImage: DEFAULT_OG_IMAGE,
        schemas: [
          orgSchema,
          getWebPageSchema(canonicalUrl, title, description),
          getBreadcrumbSchema(breadcrumbs)
        ],
        breadcrumbs
      };
    }

    case "blog-post": {
      const post = data?.post || BLOG_POSTS_DATA[0];
      const canonicalUrl = getCanonicalUrl(`/blog/${post.slug}`);
      const pageType: SEOPageType = "PUBLIC_INDEXABLE";
      const title = post.seoTitle || `${post.title} | Mehzan Tools Hub`;
      const description = post.metaDescription || post.excerpt;
      const breadcrumbs = [
        { name: "Home", url: "/" },
        { name: "Blog", url: "/blog" },
        { name: post.title, url: `/blog/${post.slug}` }
      ];

      const schemas: Record<string, any>[] = [
        orgSchema,
        getPersonSchema(),
        getWebPageSchema(canonicalUrl, title, description),
        getBreadcrumbSchema(breadcrumbs),
        getArticleSchema(post)
      ];

      if (post.faqs && post.faqs.length > 0) {
        const faqSchema = getFAQSchema(post.faqs);
        if (faqSchema) {
          schemas.push(faqSchema);
        }
      }

      return {
        pageType,
        noIndex: false,
        robotsMeta: getRobotsMeta(pageType),
        title,
        description,
        keywords: post.tags,
        canonicalUrl,
        ogType: "article",
        ogImage: post.image,
        author: post.author.name,
        publishedDate: post.date,
        schemas,
        breadcrumbs
      };
    }

    case "about": {
      const canonicalUrl = getCanonicalUrl("/about");
      const pageType: SEOPageType = "PUBLIC_INDEXABLE";
      const title = "About Mehzan Digital - Web Development & Digital Marketing Agency";
      const description = "Learn about Mehzan Digital, founded by Hamza with 5+ years of experience in web development and digital marketing, operating Mehzan Tools Hub.";
      const breadcrumbs = [
        { name: "Home", url: "/" },
        { name: "About Us", url: "/about" }
      ];
      return {
        pageType,
        noIndex: false,
        robotsMeta: getRobotsMeta(pageType),
        title,
        description,
        keywords: ["About Mehzan Digital", "Hamza founder", "web development agency", "digital marketing expert"],
        canonicalUrl,
        ogType: "website",
        ogImage: DEFAULT_OG_IMAGE,
        schemas: [
          orgSchema,
          getPersonSchema(),
          getWebPageSchema(canonicalUrl, title, description, "AboutPage"),
          getBreadcrumbSchema(breadcrumbs)
        ],
        breadcrumbs
      };
    }

    case "pricing": {
      const canonicalUrl = getCanonicalUrl("/pricing");
      const pageType: SEOPageType = "PRIVATE";
      const breadcrumbs = [
        { name: "Home", url: "/" },
        { name: "Pricing", url: "/pricing" }
      ];
      return {
        pageType,
        noIndex: true,
        robotsMeta: getRobotsMeta(pageType),
        title: "100% Free Access | Mehzan Tools Hub",
        description: "Explore our 100% free online utility tools platform with zero paywalls, no subscriptions, and instant client-side execution.",
        keywords: ["Mehzan Tools Hub pricing", "free web utilities", "free developer tools"],
        canonicalUrl,
        ogType: "website",
        ogImage: DEFAULT_OG_IMAGE,
        schemas: [
          orgSchema,
          getBreadcrumbSchema(breadcrumbs)
        ],
        breadcrumbs
      };
    }

    case "contact": {
      const canonicalUrl = getCanonicalUrl("/contact");
      const pageType: SEOPageType = "PUBLIC_INDEXABLE";
      const title = "Contact Support | Mehzan Tools Hub";
      const description = "Get in touch with the Mehzan Tools Hub team for assistance, tool suggestions, bug reports, and feedback.";
      const breadcrumbs = [
        { name: "Home", url: "/" },
        { name: "Contact", url: "/contact" }
      ];
      return {
        pageType,
        noIndex: false,
        robotsMeta: getRobotsMeta(pageType),
        title,
        description,
        keywords: ["contact Mehzan Tools Hub", "support", "help"],
        canonicalUrl,
        ogType: "website",
        ogImage: DEFAULT_OG_IMAGE,
        schemas: [
          orgSchema,
          getWebPageSchema(canonicalUrl, title, description, "ContactPage"),
          getBreadcrumbSchema(breadcrumbs)
        ],
        breadcrumbs
      };
    }

    case "privacy": {
      const canonicalUrl = getCanonicalUrl("/privacy");
      const pageType: SEOPageType = "PUBLIC_INDEXABLE";
      const title = "Privacy Policy | Mehzan Tools Hub";
      const description = "Review Mehzan Tools Hub's privacy policy, detailing zero server-side file retention and client-side processing practices.";
      const breadcrumbs = [
        { name: "Home", url: "/" },
        { name: "Privacy Policy", url: "/privacy" }
      ];
      return {
        pageType,
        noIndex: false,
        robotsMeta: getRobotsMeta(pageType),
        title,
        description,
        keywords: ["privacy policy", "data protection", "Mehzan Tools Hub privacy"],
        canonicalUrl,
        ogType: "website",
        ogImage: DEFAULT_OG_IMAGE,
        schemas: [
          orgSchema,
          getWebPageSchema(canonicalUrl, title, description),
          getBreadcrumbSchema(breadcrumbs)
        ],
        breadcrumbs
      };
    }

    case "terms": {
      const canonicalUrl = getCanonicalUrl("/terms");
      const pageType: SEOPageType = "PUBLIC_INDEXABLE";
      const title = "Terms of Service | Mehzan Tools Hub";
      const description = "Read the terms of service governing the usage of Mehzan Tools Hub's free web utility tools.";
      const breadcrumbs = [
        { name: "Home", url: "/" },
        { name: "Terms of Service", url: "/terms" }
      ];
      return {
        pageType,
        noIndex: false,
        robotsMeta: getRobotsMeta(pageType),
        title,
        description,
        keywords: ["terms of service", "user agreement", "Mehzan Tools Hub terms"],
        canonicalUrl,
        ogType: "website",
        ogImage: DEFAULT_OG_IMAGE,
        schemas: [
          orgSchema,
          getWebPageSchema(canonicalUrl, title, description),
          getBreadcrumbSchema(breadcrumbs)
        ],
        breadcrumbs
      };
    }

    case "disclaimer": {
      const canonicalUrl = getCanonicalUrl("/disclaimer");
      const pageType: SEOPageType = "PUBLIC_INDEXABLE";
      const title = "Disclaimer & Advertising Disclosure | Mehzan Tools Hub";
      const description = "Advertising disclosure and general disclaimer for Mehzan Tools Hub online utilities.";
      const breadcrumbs = [
        { name: "Home", url: "/" },
        { name: "Disclaimer", url: "/disclaimer" }
      ];
      return {
        pageType,
        noIndex: false,
        robotsMeta: getRobotsMeta(pageType),
        title,
        description,
        keywords: ["disclaimer", "advertising disclosure", "Mehzan Tools Hub"],
        canonicalUrl,
        ogType: "website",
        ogImage: DEFAULT_OG_IMAGE,
        schemas: [
          orgSchema,
          getWebPageSchema(canonicalUrl, title, description),
          getBreadcrumbSchema(breadcrumbs)
        ],
        breadcrumbs
      };
    }

    case "cookie-policy": {
      const canonicalUrl = getCanonicalUrl("/cookie-policy");
      const pageType: SEOPageType = "PUBLIC_INDEXABLE";
      const title = "Cookie Policy | Mehzan Tools Hub";
      const description = "Learn how cookies and local storage are utilized on Mehzan Tools Hub for preferences and performance.";
      const breadcrumbs = [
        { name: "Home", url: "/" },
        { name: "Cookie Policy", url: "/cookie-policy" }
      ];
      return {
        pageType,
        noIndex: false,
        robotsMeta: getRobotsMeta(pageType),
        title,
        description,
        keywords: ["cookie policy", "cookies", "Mehzan Tools Hub"],
        canonicalUrl,
        ogType: "website",
        ogImage: DEFAULT_OG_IMAGE,
        schemas: [
          orgSchema,
          getWebPageSchema(canonicalUrl, title, description),
          getBreadcrumbSchema(breadcrumbs)
        ],
        breadcrumbs
      };
    }

    case "copyright": {
      const canonicalUrl = getCanonicalUrl("/copyright");
      const pageType: SEOPageType = "PUBLIC_INDEXABLE";
      const title = "Copyright Policy & DMCA Notice | Mehzan Digital";
      const description = "Read our Copyright Policy, IP protection statement, open-source distinctions, and DMCA takedown procedures.";
      const breadcrumbs = [
        { name: "Home", url: "/" },
        { name: "Copyright Policy", url: "/copyright" }
      ];
      return {
        pageType,
        noIndex: false,
        robotsMeta: getRobotsMeta(pageType),
        title,
        description,
        keywords: ["copyright policy", "DMCA notice", "intellectual property", "Mehzan Digital"],
        canonicalUrl,
        ogType: "website",
        ogImage: DEFAULT_OG_IMAGE,
        schemas: [
          orgSchema,
          getWebPageSchema(canonicalUrl, title, description),
          getBreadcrumbSchema(breadcrumbs)
        ],
        breadcrumbs
      };
    }

    case "search": {
      const canonicalUrl = getCanonicalUrl("/search");
      const pageType: SEOPageType = "PUBLIC_NON_INDEXABLE";
      return {
        pageType,
        noIndex: true,
        robotsMeta: getRobotsMeta(pageType),
        title: data?.searchQuery ? `Search Results for "${data.searchQuery}" | Mehzan Tools Hub` : "Search Tools Directory | Mehzan Tools Hub",
        description: `Browse matching free tools and utilities on Mehzan Tools Hub.`,
        keywords: ["search tools", data?.searchQuery || "", "Mehzan Tools Hub"],
        canonicalUrl,
        ogType: "website",
        ogImage: DEFAULT_OG_IMAGE,
        schemas: [orgSchema],
      };
    }

    case "favorites":
    case "history": {
      const canonicalUrl = getCanonicalUrl(`/${activeTab}`);
      const pageType: SEOPageType = "PUBLIC_NON_INDEXABLE";
      return {
        pageType,
        noIndex: true,
        robotsMeta: getRobotsMeta(pageType),
        title: `${activeTab.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())} | Mehzan Tools Hub`,
        description: "User history and favorites on Mehzan Tools Hub.",
        keywords: [activeTab, "Mehzan Tools Hub"],
        canonicalUrl,
        ogType: "website",
        ogImage: DEFAULT_OG_IMAGE,
        schemas: [orgSchema],
      };
    }

    case "dashboard":
    case "profile":
    case "admin":
    case "login":
    case "register":
    case "signup":
    case "signin":
    case "forgot-password":
    case "suggest-tool":
    case "feedback": {
      const canonicalUrl = getCanonicalUrl(`/${activeTab}`);
      const pageType: SEOPageType = "PRIVATE";
      return {
        pageType,
        noIndex: true,
        robotsMeta: getRobotsMeta(pageType),
        title: `${activeTab.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())} | Mehzan Tools Hub`,
        description: "User account management and settings on Mehzan Tools Hub.",
        keywords: [activeTab, "Mehzan Tools Hub"],
        canonicalUrl,
        ogType: "website",
        ogImage: DEFAULT_OG_IMAGE,
        schemas: [orgSchema],
      };
    }

    case "404": {
      const pageType: SEOPageType = "NOT_FOUND";
      return {
        pageType,
        noIndex: true,
        robotsMeta: getRobotsMeta(pageType),
        title: "404 - Page Not Found | Mehzan Tools Hub",
        description: "The page or tool you are looking for does not exist or has been moved on Mehzan Tools Hub.",
        keywords: ["404", "not found", "Mehzan Tools Hub"],
        canonicalUrl: getCanonicalUrl("/404"),
        ogType: "website",
        ogImage: DEFAULT_OG_IMAGE,
        schemas: [orgSchema],
      };
    }

    default: {
      if (activeTab.startsWith("author-")) {
        const authorSlug = activeTab.replace("author-", "");
        const canonicalUrl = getCanonicalUrl(`/author/${authorSlug}`);
        const authorName = authorSlug === "hamza" ? "Hamza" : authorSlug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
        const pageType: SEOPageType = "PUBLIC_INDEXABLE";
        const title = `${authorName} - Author & Founder | Mehzan Digital`;
        const description = `Read articles, technical guides, and tutorials written by ${authorName}, Founder of Mehzan Digital and Web Developer / Digital Marketing Expert.`;
        const breadcrumbs = [
          { name: "Home", url: "/" },
          { name: "Authors", url: "/about" },
          { name: authorName, url: `/author/${authorSlug}` }
        ];
        return {
          pageType,
          noIndex: false,
          robotsMeta: getRobotsMeta(pageType),
          title,
          description,
          keywords: [authorName, "Founder Mehzan Digital", "web developer author", "Mehzan Tools Hub"],
          canonicalUrl,
          ogType: "website",
          ogImage: DEFAULT_OG_IMAGE,
          schemas: authorSlug === "hamza" 
            ? [orgSchema, getPersonSchema(), getWebPageSchema(canonicalUrl, title, description, "ProfilePage"), getBreadcrumbSchema(breadcrumbs)]
            : [orgSchema, getWebPageSchema(canonicalUrl, title, description, "ProfilePage"), getBreadcrumbSchema(breadcrumbs)],
          breadcrumbs
        };
      }

      const canonicalUrl = getCanonicalUrl(`/${activeTab}`);
      const pageType: SEOPageType = "PUBLIC_INDEXABLE";
      return {
        pageType,
        noIndex: false,
        robotsMeta: getRobotsMeta(pageType),
        title: `${activeTab.replace("-", " ").toUpperCase()} | Mehzan Tools Hub`,
        description: "Mehzan Tools Hub - Discover 50+ free web-native online utilities.",
        keywords: ["Mehzan Tools Hub"],
        canonicalUrl,
        ogType: "website",
        ogImage: DEFAULT_OG_IMAGE,
        schemas: [orgSchema],
        breadcrumbs: [{ name: "Home", url: "/" }, { name: activeTab, url: `/${activeTab}` }],
      };
    }
  }
}
