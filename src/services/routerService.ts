import { TOOLS_DATA } from "../data/toolsData";
import { CATEGORIES_DATA } from "../data/categoriesData";
import { BLOG_POSTS_DATA } from "../data/blogData";
import { AUTHORS_DATA } from "../data/authorsData";

export interface RouteState {
  tab: string;
  toolSlug?: string;
  categorySlug?: string;
  postSlug?: string;
  authorSlug?: string;
  adminSubMenu?: string;
  searchQuery?: string;
  isNotFound?: boolean;
}

/**
 * Primary Production Canonical Domain
 */
const rawEnvUrl = (
  (typeof process !== "undefined" && process.env?.APP_URL) ||
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_APP_URL) ||
  ""
);

export const CANONICAL_DOMAIN = (
  rawEnvUrl && !rawEnvUrl.includes("run.app") && !rawEnvUrl.includes("localhost")
    ? (rawEnvUrl.includes("mehzandigital.com") && !rawEnvUrl.includes("www.mehzandigital.com")
        ? rawEnvUrl.replace("mehzandigital.com", "www.mehzandigital.com")
        : rawEnvUrl)
    : "https://www.mehzandigital.com"
).replace(/\/+$/, "");

/**
 * Known Tool Slug Aliases mapped directly to their primary canonical slug
 */
export const TOOL_SLUG_ALIASES: Record<string, string> = {
  "pdf-split": "split-pdf-pages",
  "split-pdf": "split-pdf-pages",
  "pdf-to-docx": "pdf-to-word",
  "image-compress": "image-compressor",
  "image-resize": "image-resizer",
  "image-crop": "image-cropper",
  "image-rotate": "image-rotator",
  "pdf-password-protector": "pdf-protect",
  "pdf-password-remover": "pdf-unlock",
  "merge-pdf": "pdf-merge",
  "pdf-compressor": "pdf-compress",
  "jpg2pdf": "jpg-to-pdf",
  "pdf2jpg": "pdf-to-jpg",
  "pdf2word": "pdf-to-word",
  "wifi-qr-code": "qr-generator",
  "wifi-qr-code-maker": "qr-generator",
  "decimal-to-hex": "number-base-converter",
  "hex-to-decimal": "number-base-converter",
  "hexadecimal-to-decimal": "number-base-converter",
  "dec-to-hex": "number-base-converter",
  "hex-to-dec": "number-base-converter",

  // 301 Redirects for Removed Duplicate Tools
  "pdf-watermark-text": "pdf-watermark",
  "pdf-watermark-image": "pdf-watermark",
  "pdf-page-rotation-manager": "pdf-rotate",
  "pdf-orientation-detector": "pdf-metadata-viewer",
  "pdf-page-size-detector": "pdf-metadata-viewer",
  "pdf-duplicate-pages": "pdf-reorder-pages",
  "pdf-reverse-pages": "pdf-reorder-pages",
  "bmp-to-pdf": "images-to-pdf",
  "tiff-to-pdf": "images-to-pdf",

  "image-flip": "image-rotator",
  "image-mirror": "image-rotator",
  "jpg-to-avif": "image-converter",
  "png-to-avif": "image-converter",
  "avif-to-jpg": "image-converter",
  "avif-to-png": "image-converter",
  "bmp-to-png": "image-converter",
  "bmp-to-jpg": "image-converter",
  "tiff-to-png": "image-converter",
  "tiff-to-jpg": "image-converter",
  "gif-to-png": "image-converter",
  "png-to-ico": "favicon-generator",
  "image-to-ico": "favicon-generator",
  "favicon-pack-generator": "favicon-generator",
  "image-dimensions-checker": "image-resizer",
  "image-size-checker": "image-compressor",
  "image-brightness": "image-quality-adjuster",
  "image-contrast": "image-quality-adjuster",
  "image-saturation": "image-quality-adjuster",
  "text-watermark": "image-watermark",
  "logo-watermark": "image-watermark",
  "dominant-color-extractor": "palette-generator",
  "data-uri-generator": "image-to-base64",
  "youtube-thumbnail-resizer": "social-media-resizer",
  "instagram-resizer": "social-media-resizer",
  "facebook-resizer": "social-media-resizer",
  "twitter-resizer": "social-media-resizer",
  "linkedin-resizer": "social-media-resizer",
  "image-difference-checker": "image-comparison-tool",

  "character-counter-no-spaces": "word-counter",
  "sentence-counter": "word-counter",
  "paragraph-counter": "word-counter",
  "line-counter": "word-counter",
  "uppercase-converter": "case-converter",
  "lowercase-converter": "case-converter",
  "title-case-converter": "case-converter",
  "sentence-case-converter": "case-converter",
  "camelcase-converter": "case-converter",
  "pascalcase-converter": "case-converter",
  "snakecase-converter": "case-converter",
  "kebabcase-converter": "case-converter",
  "sort-lines-a-z": "sort-lines",
  "sort-lines-z-a": "sort-lines",
  "remove-empty-lines": "text-cleaner",
  "remove-extra-spaces": "text-cleaner",
  "remove-extra-line-breaks": "text-cleaner",
  "trim-text": "text-cleaner",
  "remove-special-characters": "text-cleaner",
  "remove-numbers": "text-cleaner",
  "text-difference-checker": "text-compare",
  "strong-password-generator": "password-generator",
  "unicode-decoder": "unicode-encoder",

  "json-validator": "json-formatter",
  "json-minifier": "json-formatter",
  "json-beautifier": "json-formatter",
  "json-sorter": "json-formatter",
  "json-escape": "json-formatter",
  "json-unescape": "json-formatter",
  "xml-validator": "xml-formatter",
  "xml-minifier": "xml-formatter",
  "yaml-validator": "yaml-formatter",
  "sql-minifier": "sql-formatter",
  "regex-generator-helper": "regex-tester",
  "regex-match-extractor": "regex-tester",
  "jwt-inspector": "jwt-decoder",
  "jwt-payload-viewer": "jwt-decoder",
  "jwt-payload-inspector": "jwt-decoder",
  "jwt-expiration-checker": "jwt-decoder",
  "uuid-v4-generator": "uuid-generator",
  "uuid-validator": "uuid-generator",
  "sha-1-hash-generator": "sha-generator",
  "sha-256-hash-generator": "sha-generator",
  "sha-384-hash-generator": "sha-generator",
  "sha-512-hash-generator": "sha-generator",
  "html-entity-decoder": "html-entity-encoder",

  "twitter-card-preview": "twitter-card-generator",
  "social-share-preview": "og-preview",
  "word-count-seo-checker": "word-counter",
  "page-word-counter": "word-counter",
  "h1-h6-heading-checker": "heading-analyzer",
  "title-length-checker": "meta-tag-analyzer",
  "meta-description-length-checker": "meta-tag-analyzer",
  "sitemap-url-counter": "sitemap-validator",
  "text-to-html-seo-analyzer": "html-seo-analyzer",
  "keyword-density-calculator": "keyword-density-checker",
  "seo-url-checker": "url-slug-analyzer",
  "redirect-chain-analyzer": "redirect-checker",
  "htaccess-redirect-generator": "redirect-checker",
  "nginx-redirect-generator": "redirect-checker",
  "apache-redirect-generator": "redirect-checker",

  "ipv4-validator": "ip-inspector",
  "ipv6-validator": "ip-inspector",
  "ip-address-parser": "ip-inspector",
  "mac-address-validator": "ip-inspector",
  "port-number-validator": "ip-inspector",
  "network-mask-calculator": "subnet-calculator",
  "wildcard-mask-calculator": "subnet-calculator",
  "host-range-calculator": "subnet-calculator",
  "broadcast-address-calculator": "subnet-calculator",
  "network-address-calculator": "subnet-calculator",
  "ip-subnet-cidr-calculator": "subnet-calculator",
  "base64-decoder": "base64-encoder",
  "permissions-policy-generator": "csp-header-generator",
  "referrer-policy-generator": "csp-header-generator",
  "cookie-attribute-generator": "csp-header-generator",

  "percentage-increase-calculator": "percentage-calculator",
  "percentage-decrease-calculator": "percentage-calculator",
  "mean-median-mode-calculator": "average-calculator",
  "standard-deviation-calculator": "average-calculator",
  "variance-calculator": "average-calculator",
  "range-calculator": "average-calculator",
  "prime-number-checker": "prime-number-generator",
  "gcd-calculator": "lcm-calculator",
  "profit-margin-calculator": "profit-calculator",
  "markup-calculator": "profit-calculator",
  "tax-percentage-calculator": "percentage-calculator",
  "date-of-birth-calculator": "age-calculator",
  "date-difference-calculator": "age-calculator",
  "add-days-to-date": "age-calculator",
  "subtract-days-from-date": "age-calculator",
  "add-months-to-date": "age-calculator",
  "time-difference-calculator": "time-duration-calculator",
  "date-format-converter": "date-to-unix-timestamp",
  "time-format-converter": "time-duration-calculator",
  "12-hour-24-hour-converter": "time-duration-calculator",
  "distance-converter": "length-converter",
  "mass-converter": "weight-converter",
  "bits-to-bytes": "data-storage-converter",
  "bytes-to-kb": "data-storage-converter",
  "kb-to-mb": "data-storage-converter",
  "mb-to-gb": "data-storage-converter",
  "gb-to-tb": "data-storage-converter",
  "binary-to-decimal": "number-base-converter",
  "binary-to-hexadecimal": "number-base-converter",
  "decimal-to-hexadecimal": "number-base-converter",
  "octal-to-decimal": "number-base-converter",
  "rgb-to-hex": "hex-to-rgb",
  "rgb-to-hsl": "hex-to-rgb",
  "hsl-to-rgb": "hex-to-rgb",
  "hsl-to-hex": "hex-to-rgb",
  "cmyk-converter": "hex-to-rgb",
  "hsv-converter": "hex-to-rgb",
  "css-color-generator": "hex-to-rgb",

  "qr-wifi": "qr-generator",
  "qr-vcard": "qr-generator",
  "qr-email": "qr-generator",
  "qr-sms": "qr-generator",
  "qr-phone": "qr-generator",
  "qr-geo": "qr-generator",
  "qr-crypto": "qr-generator",
  "qr-event": "qr-generator",
  "qr-text": "qr-generator",
  "qr-whatsapp": "qr-generator",
  "barcode-code128": "barcode-generator",
  "barcode-ean13": "barcode-generator",
  "barcode-upca": "barcode-generator",
  "barcode-code39": "barcode-generator",

  "file-base64-decoder": "file-base64-encoder",
  "zip-extractor": "zip-creator",
  "zip-contents-viewer": "zip-creator",
  "json-to-csv-converter": "csv-to-json-converter",
  "xml-to-json-converter": "xml-formatter",
  "json-to-xml-converter": "json-formatter",
  "yaml-to-json-converter": "yaml-formatter",
  "json-to-yaml-converter": "json-formatter",
  "audio-mp3-converter": "audio-converter",
  "audio-wav-converter": "audio-converter",
  "audio-ogg-converter": "audio-converter",
  "audio-m4a-converter": "audio-converter",
  "audio-flac-converter": "audio-converter",
  "audio-cutter": "audio-trimmer",
  "audio-fade-in": "audio-trimmer",
  "audio-fade-out": "audio-trimmer",
  "audio-speed-pitch-changer": "audio-speed-changer",
  "audio-pitch-adjuster": "audio-speed-changer",
  "audio-metadata-remover": "audio-metadata-viewer",
  "audio-duration-checker": "audio-metadata-viewer",
  "audio-file-size-checker": "audio-metadata-viewer",
  "audio-channel-info": "audio-metadata-viewer",
  "audio-sample-rate-info": "audio-metadata-viewer",
  "audio-bitrate-info": "audio-metadata-viewer",
  "base64-to-audio": "audio-to-base64",
  "video-cutter": "video-trimmer",
  "video-flipper": "video-rotator",
  "video-fps-info": "video-metadata-viewer",
  "video-resolution-checker": "video-metadata-viewer",
  "video-duration-checker": "video-metadata-viewer",
  "video-file-size-checker": "video-metadata-viewer",
  "video-metadata-remover": "video-metadata-viewer",
  "gif-resizer": "gif-compressor",
  "gif-speed-controller": "gif-compressor",
  "gif-reverse": "gif-compressor",
  "gif-loop-controller": "gif-compressor",
  "gif-to-jpg": "video-to-gif",
  "png-sequence-to-gif": "gif-maker-from-images",
  "media-duration-checker": "media-file-info",
  "media-resolution-checker": "media-file-info",
  "media-format-detector": "media-file-info",
  "media-mime-type-checker": "media-file-info",
  "media-file-size-analyzer": "media-file-info",

  "cgpa-calculator": "gpa-calculator",
  "gpa-to-percentage-converter": "gpa-calculator",
  "assignment-grade-calculator": "final-grade-calculator",
  "assignment-word-count-helper": "word-counter",
};

/**
 * Static route alias mapping to their single canonical equivalent
 */
export const STATIC_ROUTE_ALIASES: Record<string, string> = {
  "all-tools": "tools",
  "about-us": "about",
  "contact-us": "contact",
  "privacy-policy": "privacy",
  "terms-of-service": "terms",
  "terms-and-conditions": "terms",
  "cookies": "cookie-policy",
  "cookie": "cookie-policy",
  "disclaimers": "disclaimer",
  "copyright-policy": "copyright",
  "dmca": "copyright",
  "signup": "register",
  "signin": "login",
  "profile": "dashboard",
  "suggest": "suggest-tool",
  "write-for-us": "guest-post",
  "guest-posts": "guest-post",
  "guest-posting": "guest-post",
};

/**
 * Normalize any input path into a single canonical path
 */
export function normalizePath(rawPath: string = "/"): string {
  let clean = rawPath.trim();

  // Strip query string and hash if provided
  const queryIndex = clean.indexOf("?");
  if (queryIndex !== -1) {
    clean = clean.substring(0, queryIndex);
  }
  const hashIndex = clean.indexOf("#");
  if (hashIndex !== -1) {
    clean = clean.substring(0, hashIndex);
  }

  // Remove duplicate slashes and strip leading/trailing slashes
  clean = clean.replace(/\/+/g, "/").replace(/^\/+|\/+$/g, "").toLowerCase();

  if (!clean || clean === "home") {
    return "/";
  }

  // Check direct static aliases
  if (STATIC_ROUTE_ALIASES[clean]) {
    clean = STATIC_ROUTE_ALIASES[clean];
  }

  // Check prefix aliases: /tools/:slug, /tool/:slug, or /en/:slug
  if (clean.startsWith("tools/") || clean.startsWith("tool/") || clean.startsWith("en/")) {
    const slug = clean.replace(/^(tools|tool|en)\//, "");
    if (slug) {
      // Check if it's a category
      const isCat = CATEGORIES_DATA.some((c) => c.slug === slug || c.id === slug);
      if (isCat) {
        return `/category/${slug}`;
      }
      const canonicalSlug = TOOL_SLUG_ALIASES[slug] || slug;
      return `/en/${canonicalSlug}`;
    }
    return "/tools";
  }

  // /categories/:slug -> /category/:slug
  if (clean.startsWith("categories/")) {
    const slug = clean.replace(/^categories\//, "");
    return slug ? `/category/${slug}` : "/categories";
  }

  // Check direct tool slug or alias match
  let targetSlug = clean;
  if (TOOL_SLUG_ALIASES[targetSlug]) {
    targetSlug = TOOL_SLUG_ALIASES[targetSlug];
  }
  const isToolMatch = TOOLS_DATA.some((t) => t.slug === targetSlug || t.id === targetSlug);
  if (isToolMatch) {
    return `/en/${targetSlug}`;
  }

  // Static routes
  const staticRoutes = [
    "tools", "categories", "blog", "about", "contact", "privacy", "terms",
    "disclaimer", "cookie-policy", "copyright", "pricing", "search",
    "favorites", "history", "suggest-tool", "feedback", "login", "register",
    "forgot-password", "dashboard", "admin"
  ];

  if (staticRoutes.includes(clean) || clean.startsWith("category/") || clean.startsWith("blog/") || clean.startsWith("author/") || clean.startsWith("admin/")) {
    return `/${clean}`;
  }

  return `/${clean}`;
}

/**
 * Normalizes any pathname and search query into a clean, canonical route state
 */
export function parseRoute(pathname: string = "/", search: string = ""): RouteState {
  const searchParams = new URLSearchParams(search);

  // 1. Query parameter based routing resolution (e.g., /?tool=jpg-to-pdf, /tool?id=jpg-to-pdf)
  const queryTool = (searchParams.get("tool") || searchParams.get("id") || searchParams.get("slug"))?.toLowerCase().trim();
  if (queryTool) {
    const canonicalToolSlug = TOOL_SLUG_ALIASES[queryTool] || queryTool;
    const matchedTool = TOOLS_DATA.find((t) => t.slug === canonicalToolSlug || t.id === canonicalToolSlug);
    if (matchedTool) {
      return { tab: "tool-detail", toolSlug: matchedTool.slug };
    }
  }

  const queryCategory = searchParams.get("category")?.toLowerCase().trim();
  if (queryCategory) {
    const matchedCategory = CATEGORIES_DATA.find((c) => c.slug === queryCategory || c.id === queryCategory);
    if (matchedCategory) {
      return { tab: "category-detail", categorySlug: matchedCategory.slug };
    }
  }

  const queryPost = searchParams.get("post")?.toLowerCase().trim();
  if (queryPost) {
    const matchedPost = BLOG_POSTS_DATA.find((p) => p.slug === queryPost);
    if (matchedPost) {
      return { tab: "blog-post", postSlug: matchedPost.slug };
    }
  }

  // 2. Clean path: strip leading and trailing slashes & normalize
  let cleanPath = pathname.trim().replace(/^\/+|\/+$/g, "").toLowerCase();

  // Strip language prefix if present (e.g., /en/, /fr/, /de/)
  if (/^[a-z]{2}\//.test(cleanPath)) {
    cleanPath = cleanPath.substring(3);
  }

  if (!cleanPath || cleanPath === "home") {
    console.log(`[Router] Resolved to home`);
    return { tab: "home" };
  }

  // Resolve static aliases
  if (STATIC_ROUTE_ALIASES[cleanPath]) {
    console.log(`[Router] Resolved static alias: "${cleanPath}" -> "${STATIC_ROUTE_ALIASES[cleanPath]}"`);
    cleanPath = STATIC_ROUTE_ALIASES[cleanPath];
  }

  // Handle direct static routes
  switch (cleanPath) {
    case "tools":
      return { tab: "all-tools" };
    case "categories":
      return { tab: "categories" };
    case "blog":
      return { tab: "blog" };
    case "about":
      return { tab: "about" };
    case "contact":
      return { tab: "contact" };
    case "privacy":
      return { tab: "privacy" };
    case "terms":
      return { tab: "terms" };
    case "disclaimer":
      return { tab: "disclaimer" };
    case "cookie-policy":
      return { tab: "cookie-policy" };
    case "copyright":
      return { tab: "copyright" };
    case "pricing":
      return { tab: "pricing" };
    case "search":
      return {
        tab: "search",
        searchQuery: searchParams.get("q") || searchParams.get("query") || "",
      };
    case "favorites":
      return { tab: "favorites" };
    case "history":
      return { tab: "history" };
    case "suggest-tool":
      return { tab: "suggest-tool" };
    case "guest-post":
      return { tab: "guest-post" };
    case "feedback":
      return { tab: "feedback" };
    case "login":
      return { tab: "login" };
    case "register":
      return { tab: "register" };
    case "forgot-password":
      return { tab: "forgot-password" };
    case "dashboard":
      return { tab: "dashboard" };
    case "admin":
      return { tab: "admin", adminSubMenu: "dashboard" };
  }

  // Handle /admin and /admin/:subMenu
  if (cleanPath === "admin" || cleanPath.startsWith("admin/")) {
    const subMenu = cleanPath.split("/")[1]?.toLowerCase() || "dashboard";
    return { tab: "admin", adminSubMenu: subMenu };
  }

  // Handle /category/:slug or /categories/:slug
  if (cleanPath.startsWith("category/") || cleanPath.startsWith("categories/")) {
    const catSlug = cleanPath.split("/")[1]?.toLowerCase();
    const matchedCategory = CATEGORIES_DATA.find(
      (c) => c.slug === catSlug || c.id === catSlug
    );
    if (matchedCategory) {
      return { tab: "category-detail", categorySlug: matchedCategory.slug };
    }
  }

  // Handle /blog/:slug
  if (cleanPath.startsWith("blog/")) {
    const postSlug = cleanPath.split("/")[1]?.toLowerCase();
    const matchedPost = BLOG_POSTS_DATA.find((p) => p.slug === postSlug);
    if (matchedPost) {
      return { tab: "blog-post", postSlug: matchedPost.slug };
    }
  }

  // Handle /author/:slug
  if (cleanPath.startsWith("author/")) {
    const authorSlug = cleanPath.split("/")[1]?.toLowerCase();
    const isMatched = AUTHORS_DATA.some((a) => a.slug === authorSlug);
    if (authorSlug && isMatched) {
      return { tab: `author-${authorSlug}`, authorSlug };
    }
  }

  // Handle prefixed /tool/:slug or /tools/:slug
  if (cleanPath.startsWith("tool/") || cleanPath.startsWith("tools/")) {
    let toolSlug = cleanPath.split("/")[1]?.toLowerCase();
    if (TOOL_SLUG_ALIASES[toolSlug]) {
      toolSlug = TOOL_SLUG_ALIASES[toolSlug];
    }
    const matchedTool = TOOLS_DATA.find(
      (t) => t.slug === toolSlug || t.id === toolSlug
    );
    if (matchedTool) {
      return { tab: "tool-detail", toolSlug: matchedTool.slug };
    }
  }

  // Handle DIRECT tool slug: e.g. /split-pdf-pages, /jpg-to-pdf, /pdf-to-word, /image-compressor
  let directSlug = cleanPath.toLowerCase();
  if (TOOL_SLUG_ALIASES[directSlug]) {
    directSlug = TOOL_SLUG_ALIASES[directSlug];
  }
  const matchedTool = TOOLS_DATA.find(
    (t) => t.slug === directSlug || t.id === directSlug
  );

  if (matchedTool) {
    return { tab: "tool-detail", toolSlug: matchedTool.slug };
  }

  // Handle Category direct fallback if someone typed /pdf-tools
  const matchedCategory = CATEGORIES_DATA.find(
    (c) => c.slug === directSlug || c.id === directSlug
  );
  if (matchedCategory) {
    return { tab: "category-detail", categorySlug: matchedCategory.slug };
  }

  // If no match found, 404
  return { tab: "404", isNotFound: true };
}

/**
 * Converts a tab name and parameters back into a clean, canonical URL path
 */
export function getUrlForRoute(
  tab: string,
  params?: {
    toolSlug?: string;
    categorySlug?: string;
    postSlug?: string;
    authorSlug?: string;
    adminSubMenu?: string;
    search?: string;
  }
): string {
  switch (tab) {
    case "home":
      return "/";
    case "all-tools":
      return "/tools";
    case "categories":
      return "/categories";
    case "category-detail":
      return `/category/${params?.categorySlug || "pdf-tools"}`;
    case "tool-detail":
      return `/en/${params?.toolSlug || "jpg-to-pdf"}`;
    case "blog":
      return "/blog";
    case "blog-post":
      return `/blog/${params?.postSlug || ""}`;
    case "about":
      return "/about";
    case "contact":
      return "/contact";
    case "privacy":
      return "/privacy";
    case "terms":
      return "/terms";
    case "disclaimer":
      return "/disclaimer";
    case "cookie-policy":
      return "/cookie-policy";
    case "copyright":
      return "/copyright";
    case "pricing":
      return "/pricing";
    case "search":
      return params?.search ? `/search?q=${encodeURIComponent(params.search)}` : "/search";
    case "favorites":
      return "/favorites";
    case "history":
      return "/history";
    case "suggest-tool":
      return "/suggest-tool";
    case "feedback":
      return "/feedback";
    case "login":
      return "/login";
    case "register":
      return "/register";
    case "forgot-password":
      return "/forgot-password";
    case "dashboard":
    case "profile":
      return "/dashboard";
    case "admin":
      return params?.adminSubMenu && params.adminSubMenu !== "dashboard"
        ? `/admin/${params.adminSubMenu}`
        : "/admin";
    default:
      if (tab.startsWith("author-")) {
        const slug = params?.authorSlug || tab.replace("author-", "");
        return `/author/${slug}`;
      }
      return "/";
  }
}

/**
 * Generates the full absolute canonical HTTPS URL for any route
 */
export function getCanonicalUrl(
  tabOrPath: string,
  params?: {
    toolSlug?: string;
    categorySlug?: string;
    postSlug?: string;
    authorSlug?: string;
    search?: string;
  },
  domain: string = CANONICAL_DOMAIN
): string {
  const base = domain.replace(/\/+$/, "");
  if (tabOrPath.startsWith("/")) {
    const norm = normalizePath(tabOrPath);
    return norm === "/" ? `${base}/` : `${base}${norm}`;
  }
  const relativePath = getUrlForRoute(tabOrPath, params);
  return relativePath === "/" ? `${base}/` : `${base}${relativePath}`;
}

/**
 * Resolves any raw URL or current window location into its absolute canonical HTTPS URL
 * (enforces HTTPS, removes trailing slashes, and strips all query parameters & hashes).
 */
export function resolveCanonicalUrl(rawUrl?: string): string {
  if (typeof window === "undefined" && !rawUrl) {
    return CANONICAL_DOMAIN;
  }

  let urlObj: URL;
  try {
    if (rawUrl) {
      urlObj =
        rawUrl.startsWith("http://") || rawUrl.startsWith("https://")
          ? new URL(rawUrl)
          : new URL(rawUrl.startsWith("/") ? rawUrl : `/${rawUrl}`, CANONICAL_DOMAIN);
    } else {
      urlObj = new URL(window.location.href);
    }
  } catch {
    return CANONICAL_DOMAIN;
  }

  // 1. Enforce HTTPS in production
  const isLocalhost =
    urlObj.hostname === "localhost" ||
    urlObj.hostname === "127.0.0.1" ||
    urlObj.hostname.endsWith(".run.app");

  let protocol = "https:";
  if (isLocalhost && typeof window !== "undefined") {
    protocol = window.location.protocol;
  }

  // 2. Enforce WWW prefix on mehzandigital.com to match server 301 redirects & sitemap
  let hostname = urlObj.hostname;
  if (hostname === "mehzandigital.com") {
    hostname = "www.mehzandigital.com";
  }
  const port = urlObj.port ? `:${urlObj.port}` : "";

  // 3. Resolve canonical route path from pathname & query
  const route = parseRoute(urlObj.pathname, urlObj.search);
  let canonicalPath = "/";

  if (!route.isNotFound && route.tab !== "search") {
    canonicalPath = getUrlForRoute(route.tab, {
      toolSlug: route.toolSlug,
      categorySlug: route.categorySlug,
      postSlug: route.postSlug,
      authorSlug: route.authorSlug,
      adminSubMenu: route.adminSubMenu,
    });
  } else {
    canonicalPath = normalizePath(urlObj.pathname);
  }

  // 4. Return clean absolute canonical URL strictly without query parameters or hash
  return `${protocol}//${hostname}${port}${canonicalPath}`;
}

/**
 * Enforces canonical URL normalization on client-side (normalizing path, removing trailing slashes,
 * converting legacy alias routes to canonical format, and preserving valid search/pagination params).
 * Uses window.history.replaceState to update the browser address bar seamlessly without triggering full page reloads.
 */
export function enforceCanonicalRedirect(): void {
  if (typeof window === "undefined") return;

  try {
    const loc = window.location;
    const route = parseRoute(loc.pathname, loc.search);

    // 1. Determine canonical route path
    let canonicalPath = "/";
    if (!route.isNotFound && route.tab !== "search") {
      canonicalPath = getUrlForRoute(route.tab, {
        toolSlug: route.toolSlug,
        categorySlug: route.categorySlug,
        postSlug: route.postSlug,
        authorSlug: route.authorSlug,
        adminSubMenu: route.adminSubMenu,
      });
    } else if (route.tab === "search") {
      canonicalPath = "/search";
    } else {
      canonicalPath = normalizePath(loc.pathname);
    }

    // 2. Preserve valid functional query parameters (e.g., search query 'q' or pagination 'page')
    const searchParams = new URLSearchParams(loc.search);
    const cleanParams = new URLSearchParams();
    searchParams.forEach((val, key) => {
      const k = key.toLowerCase();
      if (k === "q" || k === "query" || k === "page") {
        cleanParams.append(key, val);
      }
    });

    const queryString = cleanParams.toString() ? `?${cleanParams.toString()}` : "";
    const canonicalFull = `${canonicalPath}${queryString}`;
    const currentFull = `${loc.pathname}${loc.search}`;

    // 3. Silently update address bar if non-canonical, without reloading the page
    if (currentFull !== canonicalFull) {
      window.history.replaceState(window.history.state || {}, "", canonicalFull);
    }
  } catch (err) {
    // Fail-safe: log silently to prevent breaking runtime execution
    console.debug("Canonical URL normalization error handled safely:", err);
  }
}

/**
 * Performs client-side navigation with History API and event dispatch
 */
export function navigateTo(url: string, replace: boolean = false): void {
  if (typeof window === "undefined") return;

  // Normalize path before navigating
  const cleanUrl = normalizePath(url);
  const currentPath = window.location.pathname + window.location.search;

  if (currentPath !== cleanUrl) {
    if (replace) {
      window.history.replaceState({}, "", cleanUrl);
    } else {
      window.history.pushState({}, "", cleanUrl);
    }
  }

  // Dispatch custom route change event
  window.dispatchEvent(new CustomEvent("mehzandigital_route_change", { detail: { url: cleanUrl } }));
  window.scrollTo({ top: 0, behavior: "smooth" });
}
