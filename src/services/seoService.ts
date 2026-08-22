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

const SITE_NAME = "UtilityTools Hub";
const DEFAULT_DOMAIN = typeof window !== "undefined" ? window.location.origin : "https://utilitytoolshub.com";
const DEFAULT_OG_IMAGE = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=630&q=80";

/**
 * Generate full domain canonical URL
 */
export function getCanonicalUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  if (typeof window !== "undefined") {
    return `${window.location.origin}${cleanPath}`;
  }
  return `${DEFAULT_DOMAIN}${cleanPath}`;
}

/**
 * Auto-generate SEO Title if missing
 */
export function generateAutoTitle(topic: string, category?: string): string {
  if (category) {
    return `${topic} - Free Online ${category.toUpperCase()} Utility | ${SITE_NAME}`;
  }
  return `${topic} | Free Online Utility Tool | ${SITE_NAME}`;
}

/**
 * Auto-generate Meta Description if missing
 */
export function generateAutoDescription(text: string, fallbackSubject: string): string {
  if (!text) {
    return `Access our free online ${fallbackSubject} tool. Fast, reliable, no registration required on ${SITE_NAME}.`;
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
  const desc = item.tagline || item.category || "UtilityTools Hub";
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
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${DEFAULT_DOMAIN}/#organization`,
    "name": SITE_NAME,
    "url": DEFAULT_DOMAIN,
    "logo": {
      "@type": "ImageObject",
      "url": `${DEFAULT_DOMAIN}/icon.png`,
      "width": 512,
      "height": 512
    },
    "description": "Free web-native directory & execution suite of 150+ cutting-edge utility tools for PDF, images, text, and developers.",
    "sameAs": [
      "https://twitter.com/utilitytoolshub",
      "https://github.com/utilitytoolshub",
      "https://linkedin.com/company/utilitytoolshub"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "email": "support@utilitytoolshub.com",
      "availableLanguage": ["English"]
    }
  };
}

/**
 * Website Schema + Search Action Schema for Sitelinks Searchbox
 */
export function getWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${DEFAULT_DOMAIN}/#website`,
    "url": DEFAULT_DOMAIN,
    "name": SITE_NAME,
    "description": "Discover and execute 150+ free online utility tools for PDF, image, text, and developer tasks.",
    "publisher": {
      "@id": `${DEFAULT_DOMAIN}/#organization`
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${DEFAULT_DOMAIN}/?s={search_term_string}`
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
  const toolUrl = getCanonicalUrl(`/tool/${tool.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${toolUrl}/#software`,
    "name": tool.name,
    "applicationCategory": getApplicationCategory(tool.category),
    "operatingSystem": "All Web Browsers (Cloud-based)",
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
      "ratingValue": tool.rating.toString(),
      "ratingCount": tool.ratingCount.toString(),
      "bestRating": "5",
      "worstRating": "1"
    },
    "featureList": tool.seoContent?.keyFeatures?.join(", ") || tool.tags.join(", "),
    "author": {
      "@id": `${DEFAULT_DOMAIN}/#organization`
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

  const toolUrl = getCanonicalUrl(`/tool/${tool.slug}`);
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
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${postUrl}/#article`,
    "headline": post.title,
    "description": post.excerpt,
    "image": [post.image],
    "datePublished": new Date(post.date).toISOString(),
    "dateModified": new Date(post.date).toISOString(),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": postUrl
    },
    "author": {
      "@type": "Person",
      "name": post.author.name,
      "jobTitle": post.author.role,
      "image": post.author.avatar
    },
    "publisher": {
      "@id": `${DEFAULT_DOMAIN}/#organization`
    },
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
        title: "UtilityTools Hub - Free Online Utility Tools for Text, PDF, Images & Developers",
        description: "Access 150+ free online utility tools including PDF merger, image compressor, JSON formatter, word counter, and QR generator. Fast, private, and 100% browser-based.",
        keywords: ["utility tools", "free online tools", "PDF tools", "image compressor", "JSON formatter", "text tools"],
        canonicalUrl,
        ogType: "website",
        ogImage: DEFAULT_OG_IMAGE,
        schemas: [
          orgSchema,
          websiteSchema,
          getFAQSchema([
            {
              question: "Are all utility tools on UtilityTools Hub free?",
              answer: "Yes, all 150+ utility tools are 100% free to use online with no registration required."
            },
            {
              question: "Are my files secure and private?",
              answer: "Yes! Most file processing (PDF and image manipulation) happens entirely client-side in your browser, ensuring your files are never uploaded to any server."
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
        { name: "All AI Tools", url: "/tools" }
      ];
      return {
        title: "All Free AI Tools Directory - Browse 50+ Online Generators | Utility Tools Hub",
        description: "Explore our comprehensive directory of 50+ free AI tools categorized by writing, coding, SEO, social media, media, and productivity utilities.",
        keywords: ["AI directory", "free AI tools list", "AI text tools", "AI coding tools"],
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
        title: "Browse AI Tool Categories - Writing, Coding, SEO, Media & More",
        description: "Filter top-rated AI tools by specialized categories including Writing & Content, Coding & Dev, SEO & Marketing, and Media Production.",
        keywords: ["AI categories", "writing tools", "coding tools", "SEO tools category"],
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
      const catName = catObj ? catObj.name : "AI Category";
      const catSlug = catObj ? catObj.slug : "category";
      const canonicalUrl = getCanonicalUrl(`/category/${catSlug}`);
      const breadcrumbs = [
        { name: "Home", url: "/" },
        { name: "Categories", url: "/categories" },
        { name: catName, url: `/category/${catSlug}` }
      ];
      return {
        title: `${catName} AI Tools - Free Online Generators & Assistants`,
        description: catObj?.description || `Explore top-rated free AI tools in ${catName}. Boost speed and quality with AI automation.`,
        keywords: [catName, `${catName} AI tools`, `free ${catName} generator`],
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
      const canonicalUrl = getCanonicalUrl(`/tool/${tool.slug}`);
      const breadcrumbs = [
        { name: "Home", url: "/" },
        { name: "Tools", url: "/tools" },
        { name: tool.name, url: `/tool/${tool.slug}` }
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
        title: tool.seoContent?.metaTitle || generateAutoTitle(tool.name, tool.category),
        description: tool.seoContent?.metaDescription || generateAutoDescription(tool.description, tool.name),
        keywords: [tool.name, ...tool.tags, tool.category, "free AI tool"],
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
        title: "AI Insights, Tutorials & Prompt Engineering Guides | Utility Tools Hub Blog",
        description: "Read expert guides on prompt engineering, workflow automation, AI content strategies, and tool reviews written by leading engineers.",
        keywords: ["AI blog", "prompt engineering guides", "AI tutorials 2026", "AI tool reviews"],
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

      return {
        title: `${post.title} | Utility Tools Hub`,
        description: post.excerpt,
        keywords: post.tags,
        canonicalUrl,
        ogType: "article",
        ogImage: post.image,
        author: post.author.name,
        publishedDate: post.date,
        schemas: [
          orgSchema,
          getBreadcrumbSchema(breadcrumbs),
          getArticleSchema(post)
        ],
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
        title: "About Utility Tools Hub - Our Mission & Web-Native AI Ecosystem",
        description: "Learn about Utility Tools Hub, our vision for democratizing high-speed AI utilities, and how we empower creators, developers, and marketers worldwide.",
        keywords: ["About Utility Tools Hub", "AI mission", "free AI ecosystem"],
        canonicalUrl,
        ogType: "website",
        ogImage: DEFAULT_OG_IMAGE,
        schemas: [
          orgSchema,
          getBreadcrumbSchema(breadcrumbs),
          {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": "About Utility Tools Hub",
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
        title: "Simple, Transparent Utility Tools Hub Plans - 100% Free Access",
        description: "Explore our 100% free online utility tools platform with zero paywalls and sub-100ms execution.",
        keywords: ["Utility Tools Hub pricing", "free web utilities", "free developer tools"],
        canonicalUrl,
        ogType: "website",
        ogImage: DEFAULT_OG_IMAGE,
        schemas: [
          orgSchema,
          getBreadcrumbSchema(breadcrumbs),
          getFAQSchema([
            {
              question: "Can I use Utility Tools Hub for free without a credit card?",
              answer: "Yes, our Free Access model provides 100% free usage across all 50+ web utility tools with zero registration or payment needed."
            },
            {
              question: "Are there any usage limits or paywalls?",
              answer: "No, all web tools are freely accessible with instant browser execution and zero paywalls."
            }
          ])!
        ],
        breadcrumbs
      };
    }

    case "search": {
      const query = data?.searchQuery || "";
      const canonicalUrl = getCanonicalUrl(`/search${query ? `?q=${encodeURIComponent(query)}` : ""}`);
      return {
        title: query ? `Search Results for "${query}" - Utility Tools Hub` : "Search AI Tools Directory",
        description: `Browse matching free AI tools, categories, and articles for "${query}" on Utility Tools Hub.`,
        keywords: ["search AI tools", query],
        canonicalUrl,
        ogType: "website",
        ogImage: DEFAULT_OG_IMAGE,
        schemas: [orgSchema],
        noIndex: true // prevent duplicate search result pages indexing in search engines
      };
    }

    default: {
      const canonicalUrl = getCanonicalUrl(`/${activeTab}`);
      return {
        title: `${activeTab.replace("-", " ").toUpperCase()} - Utility Tools Hub`,
        description: "Utility Tools Hub - Discover free web-native AI utilities.",
        keywords: ["Utility Tools Hub"],
        canonicalUrl,
        ogType: "website",
        ogImage: DEFAULT_OG_IMAGE,
        schemas: [orgSchema],
        breadcrumbs: [{ name: "Home", url: "/" }, { name: activeTab, url: `/${activeTab}` }]
      };
    }
  }
}
