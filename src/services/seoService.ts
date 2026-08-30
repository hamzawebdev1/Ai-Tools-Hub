import { AITool, BlogPost, CategoryInfo, ToolCategory } from "../types";
import { TOOLS_DATA } from "../data/toolsData";
import { CATEGORIES_DATA } from "../data/categoriesData";
import { BLOG_POSTS_DATA } from "../data/blogData";

export interface SEOMetadata {
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
  noIndex?: boolean;
  schemas: Record<string, any>[];
  breadcrumbs?: { name: string; url: string }[];
}

const SITE_NAME = "Mehzan Tools Hub";
export function getDomain(): string {
  if (typeof window !== "undefined" && window.location.origin) {
    return window.location.origin.replace(/\/+$/, "");
  }
  // Try to use environment variable for SSR
  if (typeof process !== "undefined" && process.env?.APP_URL) {
    return process.env.APP_URL.replace(/\/+$/, "");
  }
  if (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_APP_URL) {
    return (import.meta as any).env.VITE_APP_URL.replace(/\/+$/, "");
  }
  return "https://mehzandigital.com";
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
 * Organization Schema (JSON-LD)
 */
export function getOrganizationSchema() {
  const domain = getDomain();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${domain}/#organization`,
    "name": SITE_NAME,
    "url": domain || "/",
    "logo": {
      "@type": "ImageObject",
      "url": `${domain}/icon.png`,
      "width": 512,
      "height": 512
    },
    "description": "Free web-native directory & execution suite of 500+ cutting-edge utility tools for PDF, images, text, and developers on Mehzan Tools Hub.",
    "sameAs": [
      "https://twitter.com/mehzandigital",
      "https://github.com/mehzandigital",
      "https://linkedin.com/company/mehzandigital"
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
    "url": domain || "/",
    "name": SITE_NAME,
    "description": "Discover and execute 500+ free online utility tools for PDF, image, text, and developer tasks on Mehzan Tools Hub.",
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
 * SoftwareApplication / Tool Schema
 */
export function getToolSoftwareSchema(tool: AITool) {
  const toolUrl = getCanonicalUrl(`/${tool.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${toolUrl}/#software`,
    "name": tool.name,
    "applicationCategory": getApplicationCategory(tool.category),
    "operatingSystem": "All Web Browsers (Client-side)",
    "description": tool.seoContent?.metaDescription || tool.description,
    "url": toolUrl,
    "image": DEFAULT_OG_IMAGE,
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": (tool.rating || 4.9).toString(),
      "ratingCount": (tool.ratingCount || 120).toString(),
      "bestRating": "5",
      "worstRating": "1"
    },
    "featureList": tool.seoContent?.keyFeatures?.join(", ") || tool.tags.join(", "),
    "author": {
      "@id": `${getDomain()}/#organization`
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

  const toolUrl = getCanonicalUrl(`/${tool.slug}`);
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
      "name": post.author.name,
      "jobTitle": post.author.role,
      "image": post.author.avatar,
      "description": post.author.bio
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
      return {
        title: "Mehzan Tools Hub - 50+ Free Online Web Utilities, PDF & Image Tools",
        description: "Access 50+ free online utility tools on Mehzan Tools Hub including PDF merger, image compressor, JSON formatter, word counter, and QR generator. Fast, private, and 100% in-browser.",
        keywords: ["Mehzan Tools Hub", "free online tools", "PDF tools", "image compressor", "JSON formatter", "text tools", "web utilities"],
        canonicalUrl,
        ogType: "website",
        ogImage: DEFAULT_OG_IMAGE,
        schemas: [
          orgSchema,
          websiteSchema,
          getFAQSchema([
            {
              question: "Are all online tools on Mehzan Tools Hub free?",
              answer: "Yes, all 500+ online utilities and converters are 100% free with no registration or hidden fees."
            },
            {
              question: "Are my files private and secure?",
              answer: "Yes! File processing happens entirely client-side inside your browser sandbox, ensuring your files are never uploaded or stored on any server."
            }
          ])!
        ],
        breadcrumbs: [{ name: "Home", url: "/" }]
      };
    }

    case "all-tools": {
      const canonicalUrl = getCanonicalUrl("/tools");
      const breadcrumbs = [
        { name: "Home", url: "/" },
        { name: "All Tools", url: "/tools" }
      ];
      return {
        title: "All Free Online Tools Directory | Mehzan Tools Hub",
        description: "Explore the comprehensive directory of 500+ free online tools categorized by PDF, Image, Text, Developer, SEO, Security, and Calculators on Mehzan Tools Hub.",
        keywords: ["tools directory", "free online utilities list", "web tools catalog", "Mehzan Tools Hub tools"],
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

    case "categories": {
      const canonicalUrl = getCanonicalUrl("/categories");
      const breadcrumbs = [
        { name: "Home", url: "/" },
        { name: "Categories", url: "/categories" }
      ];
      return {
        title: "Browse Tool Categories | Mehzan Tools Hub",
        description: "Filter tools by specialized categories including PDF Tools, Image Processing, Text Utilities, Developer Code, SEO & SERP, and Calculators on Mehzan Tools Hub.",
        keywords: ["tool categories", "PDF utilities", "image tools category", "developer tools"],
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

    case "category-detail": {
      const catObj = typeof data?.category === "object" ? data.category : CATEGORIES_DATA.find((c) => c.slug === data?.category);
      const catName = catObj ? catObj.name : "Category";
      const catSlug = catObj ? catObj.slug : "category";
      const canonicalUrl = getCanonicalUrl(`/category/${catSlug}`);
      const breadcrumbs = [
        { name: "Home", url: "/" },
        { name: "Categories", url: "/categories" },
        { name: catName, url: `/category/${catSlug}` }
      ];
      return {
        title: `${catName} - Free Online Utilities | Mehzan Tools Hub`,
        description: catObj?.description || `Explore top-rated free ${catName} on Mehzan Tools Hub. Fast, secure, browser-native processing.`,
        keywords: [catName, `${catName} tools`, `free ${catName} online`],
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

    case "tool-detail": {
      const tool = data?.tool || TOOLS_DATA[0];
      const canonicalUrl = getCanonicalUrl(`/${tool.slug}`);
      const breadcrumbs = [
        { name: "Home", url: "/" },
        { name: tool.category ? `${tool.category.toUpperCase()} Tools` : "Tools", url: `/category/${tool.category || "pdf-tools"}` },
        { name: tool.name, url: `/${tool.slug}` }
      ];

      const schemas: Record<string, any>[] = [
        orgSchema,
        getBreadcrumbSchema(breadcrumbs),
        getToolSoftwareSchema(tool)
      ];

      const howToSchema = getToolHowToSchema(tool);
      if (howToSchema) schemas.push(howToSchema);

      const faqSchema = getFAQSchema(tool.seoContent?.faqs || []);
      if (faqSchema) schemas.push(faqSchema);

      return {
        title: tool.seoContent?.metaTitle || `${tool.name} Online - Free Tool | Mehzan Tools Hub`,
        description: tool.seoContent?.metaDescription || `${tool.description} 100% free, private in-browser utility on Mehzan Tools Hub.`,
        keywords: [tool.name, ...tool.tags, tool.category, "free online tool", "Mehzan Tools Hub"],
        canonicalUrl,
        ogType: "product",
        ogImage: DEFAULT_OG_IMAGE,
        schemas,
        breadcrumbs
      };
    }

    case "blog": {
      const canonicalUrl = getCanonicalUrl("/blog");
      const breadcrumbs = [
        { name: "Home", url: "/" },
        { name: "Blog & Guides", url: "/blog" }
      ];
      return {
        title: "Tech Insights, Tutorials & Utility Guides | Mehzan Tools Hub Blog",
        description: "Read expert guides on client-side security, file processing, PDF workflows, image optimization, and web developer utilities on Mehzan Tools Hub.",
        keywords: ["web utilities blog", "PDF guides", "image compression tips", "developer tutorials", "Mehzan Tools Hub"],
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

    case "blog-post": {
      const post = data?.post || BLOG_POSTS_DATA[0];
      const canonicalUrl = getCanonicalUrl(`/blog/${post.slug}`);
      const breadcrumbs = [
        { name: "Home", url: "/" },
        { name: "Blog", url: "/blog" },
        { name: post.title, url: `/blog/${post.slug}` }
      ];

      const schemas: Record<string, any>[] = [
        orgSchema,
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
        title: post.seoTitle || `${post.title} | Mehzan Tools Hub`,
        description: post.metaDescription || post.excerpt,
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
      const breadcrumbs = [
        { name: "Home", url: "/" },
        { name: "About Us", url: "/about" }
      ];
      return {
        title: "About Mehzan Tools Hub - Free Web-Native Online Utilities Suite",
        description: "Learn about Mehzan Tools Hub, our mission for high-speed, private, client-side online tools for PDF, images, text, code, and calculation utilities.",
        keywords: ["About Mehzan Tools Hub", "free online utilities", "client-side privacy"],
        canonicalUrl,
        ogType: "website",
        ogImage: DEFAULT_OG_IMAGE,
        schemas: [
          orgSchema,
          getBreadcrumbSchema(breadcrumbs),
          {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": "About Mehzan Tools Hub",
            "url": canonicalUrl
          }
        ],
        breadcrumbs
      };
    }

    case "pricing": {
      const canonicalUrl = getCanonicalUrl("/pricing");
      const breadcrumbs = [
        { name: "Home", url: "/" },
        { name: "Pricing", url: "/pricing" }
      ];
      return {
        title: "100% Free Access | Mehzan Tools Hub",
        description: "Explore our 100% free online utility tools platform with zero paywalls, no subscriptions, and instant client-side execution.",
        keywords: ["Mehzan Tools Hub pricing", "free web utilities", "free developer tools"],
        canonicalUrl,
        ogType: "website",
        ogImage: DEFAULT_OG_IMAGE,
        schemas: [
          orgSchema,
          getBreadcrumbSchema(breadcrumbs),
          getFAQSchema([
            {
              question: "Can I use Mehzan Tools Hub tools for free?",
              answer: "Yes, all tools on Mehzan Tools Hub are 100% free to use online with zero registration or payment needed."
            },
            {
              question: "Are there any usage limits or paywalls?",
              answer: "No, all tools are freely accessible with instant browser execution and zero paywalls."
            }
          ])!
        ],
        breadcrumbs
      };
    }

    case "contact": {
      const canonicalUrl = getCanonicalUrl("/contact");
      const breadcrumbs = [
        { name: "Home", url: "/" },
        { name: "Contact", url: "/contact" }
      ];
      return {
        title: "Contact Support | Mehzan Tools Hub",
        description: "Get in touch with the Mehzan Tools Hub team for assistance, tool suggestions, bug reports, and feedback.",
        keywords: ["contact Mehzan Tools Hub", "support", "help"],
        canonicalUrl,
        ogType: "website",
        ogImage: DEFAULT_OG_IMAGE,
        schemas: [orgSchema, getBreadcrumbSchema(breadcrumbs)],
        breadcrumbs
      };
    }

    case "privacy": {
      const canonicalUrl = getCanonicalUrl("/privacy");
      const breadcrumbs = [
        { name: "Home", url: "/" },
        { name: "Privacy Policy", url: "/privacy" }
      ];
      return {
        title: "Privacy Policy | Mehzan Tools Hub",
        description: "Review Mehzan Tools Hub's privacy policy, detailing zero server-side file retention and client-side processing practices.",
        keywords: ["privacy policy", "data protection", "Mehzan Tools Hub privacy"],
        canonicalUrl,
        ogType: "website",
        ogImage: DEFAULT_OG_IMAGE,
        schemas: [orgSchema, getBreadcrumbSchema(breadcrumbs)],
        breadcrumbs
      };
    }

    case "terms": {
      const canonicalUrl = getCanonicalUrl("/terms");
      const breadcrumbs = [
        { name: "Home", url: "/" },
        { name: "Terms of Service", url: "/terms" }
      ];
      return {
        title: "Terms of Service | Mehzan Tools Hub",
        description: "Read the terms of service governing the usage of Mehzan Tools Hub's free web utility tools.",
        keywords: ["terms of service", "user agreement", "Mehzan Tools Hub terms"],
        canonicalUrl,
        ogType: "website",
        ogImage: DEFAULT_OG_IMAGE,
        schemas: [orgSchema, getBreadcrumbSchema(breadcrumbs)],
        breadcrumbs
      };
    }

    case "disclaimer": {
      const canonicalUrl = getCanonicalUrl("/disclaimer");
      const breadcrumbs = [
        { name: "Home", url: "/" },
        { name: "Disclaimer", url: "/disclaimer" }
      ];
      return {
        title: "Disclaimer & Advertising Disclosure | Mehzan Tools Hub",
        description: "Advertising disclosure and general disclaimer for Mehzan Tools Hub online utilities.",
        keywords: ["disclaimer", "advertising disclosure", "Mehzan Tools Hub"],
        canonicalUrl,
        ogType: "website",
        ogImage: DEFAULT_OG_IMAGE,
        schemas: [orgSchema, getBreadcrumbSchema(breadcrumbs)],
        breadcrumbs
      };
    }

    case "cookie-policy": {
      const canonicalUrl = getCanonicalUrl("/cookie-policy");
      const breadcrumbs = [
        { name: "Home", url: "/" },
        { name: "Cookie Policy", url: "/cookie-policy" }
      ];
      return {
        title: "Cookie Policy | Mehzan Tools Hub",
        description: "Learn how cookies and local storage are utilized on Mehzan Tools Hub for preferences and performance.",
        keywords: ["cookie policy", "cookies", "Mehzan Tools Hub"],
        canonicalUrl,
        ogType: "website",
        ogImage: DEFAULT_OG_IMAGE,
        schemas: [orgSchema, getBreadcrumbSchema(breadcrumbs)],
        breadcrumbs
      };
    }

    case "copyright": {
      const canonicalUrl = getCanonicalUrl("/copyright");
      const breadcrumbs = [
        { name: "Home", url: "/" },
        { name: "Copyright Policy", url: "/copyright" }
      ];
      return {
        title: "Copyright Policy & DMCA Notice | Mehzan Digital",
        description: "Read our Copyright Policy, IP protection statement, open-source distinctions, and DMCA takedown procedures.",
        keywords: ["copyright policy", "DMCA notice", "intellectual property", "Mehzan Digital"],
        canonicalUrl,
        ogType: "website",
        ogImage: DEFAULT_OG_IMAGE,
        schemas: [orgSchema, getBreadcrumbSchema(breadcrumbs)],
        breadcrumbs
      };
    }

    case "search": {
      const canonicalUrl = getCanonicalUrl("/search");
      return {
        title: data?.searchQuery ? `Search Results for "${data.searchQuery}" | Mehzan Tools Hub` : "Search Tools Directory | Mehzan Tools Hub",
        description: `Browse matching free tools and utilities on Mehzan Tools Hub.`,
        keywords: ["search tools", data?.searchQuery || "", "Mehzan Tools Hub"],
        canonicalUrl,
        ogType: "website",
        ogImage: DEFAULT_OG_IMAGE,
        schemas: [orgSchema],
        noIndex: true // Search result pages must not be indexed to prevent duplicate/thin content
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
    case "history":
    case "favorites":
    case "suggest-tool":
    case "feedback": {
      const canonicalUrl = getCanonicalUrl(`/${activeTab}`);
      return {
        title: `${activeTab.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())} | Mehzan Tools Hub`,
        description: "User dashboard and settings on Mehzan Tools Hub.",
        keywords: [activeTab, "Mehzan Tools Hub"],
        canonicalUrl,
        ogType: "website",
        ogImage: DEFAULT_OG_IMAGE,
        schemas: [orgSchema],
        noIndex: true // Private or authenticated pages must never be indexed
      };
    }

    case "404": {
      return {
        title: "404 - Page Not Found | Mehzan Tools Hub",
        description: "The page or tool you are looking for does not exist or has been moved on Mehzan Tools Hub.",
        keywords: ["404", "not found", "Mehzan Tools Hub"],
        canonicalUrl: getCanonicalUrl("/404"),
        ogType: "website",
        ogImage: DEFAULT_OG_IMAGE,
        schemas: [orgSchema],
        noIndex: true
      };
    }

    default: {
      if (activeTab.startsWith("author-")) {
        const authorSlug = activeTab.replace("author-", "");
        const canonicalUrl = getCanonicalUrl(`/author/${authorSlug}`);
        const authorName = authorSlug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
        const breadcrumbs = [
          { name: "Home", url: "/" },
          { name: "Authors", url: "/about" },
          { name: authorName, url: `/author/${authorSlug}` }
        ];
        return {
          title: `${authorName} - Editorial Board & Author | Mehzan Tools Hub`,
          description: `Read technical guides, optimization tutorials, and utility reviews by ${authorName} on Mehzan Tools Hub.`,
          keywords: [authorName, "editorial author", "Mehzan Tools Hub"],
          canonicalUrl,
          ogType: "website",
          ogImage: DEFAULT_OG_IMAGE,
          schemas: [orgSchema, getBreadcrumbSchema(breadcrumbs)],
          breadcrumbs
        };
      }

      const canonicalUrl = getCanonicalUrl(`/${activeTab}`);
      return {
        title: `${activeTab.replace("-", " ").toUpperCase()} | Mehzan Tools Hub`,
        description: "Mehzan Tools Hub - Discover 50+ free web-native online utilities.",
        keywords: ["Mehzan Tools Hub"],
        canonicalUrl,
        ogType: "website",
        ogImage: DEFAULT_OG_IMAGE,
        schemas: [orgSchema],
        breadcrumbs: [{ name: "Home", url: "/" }, { name: activeTab, url: `/${activeTab}` }]
      };
    }
  }
}
