import { TOOLS_DATA } from "../data/toolsData";
import { CATEGORIES_DATA } from "../data/categoriesData";
import { BLOG_POSTS_DATA } from "../data/blogData";

export interface RouteState {
  tab: string;
  toolSlug?: string;
  categorySlug?: string;
  postSlug?: string;
  authorSlug?: string;
  searchQuery?: string;
  isNotFound?: boolean;
}

/**
 * Primary Production Canonical Domain
 */
export const CANONICAL_DOMAIN = (
  (typeof process !== "undefined" && process.env?.APP_URL) ||
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_APP_URL) ||
  "https://utilitytoolshub.com"
).replace(/\/+$/, "");

/**
 * Known Tool Slug Aliases mapped directly to their primary canonical slug
 */
export const TOOL_SLUG_ALIASES: Record<string, string> = {
  "pdf-split": "split-pdf-pages",
  "pdf-to-docx": "pdf-to-word",
  "image-compress": "image-compressor",
  "image-resize": "image-resizer",
  "image-crop": "image-cropper",
  "image-rotate": "image-rotator",
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
  "signup": "register",
  "signin": "login",
  "profile": "dashboard",
  "suggest": "suggest-tool",
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

  // Check prefix aliases: /tools/:slug or /tool/:slug -> /:slug
  if (clean.startsWith("tools/") || clean.startsWith("tool/")) {
    const slug = clean.replace(/^(tools|tool)\//, "");
    if (slug) {
      // Check if it's a category
      const isCat = CATEGORIES_DATA.some((c) => c.slug === slug || c.id === slug);
      if (isCat) {
        return `/category/${slug}`;
      }
      const canonicalSlug = TOOL_SLUG_ALIASES[slug] || slug;
      return `/${canonicalSlug}`;
    }
    return "/tools";
  }

  // /categories/:slug -> /category/:slug
  if (clean.startsWith("categories/")) {
    const slug = clean.replace(/^categories\//, "");
    return slug ? `/category/${slug}` : "/categories";
  }

  // Check tool slug aliases
  if (TOOL_SLUG_ALIASES[clean]) {
    return `/${TOOL_SLUG_ALIASES[clean]}`;
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

  if (!cleanPath || cleanPath === "home") {
    return { tab: "home" };
  }

  // Resolve static aliases
  if (STATIC_ROUTE_ALIASES[cleanPath]) {
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
      return { tab: "admin" };
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
    return { tab: `author-${authorSlug}`, authorSlug };
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
      return `/${params?.toolSlug || "jpg-to-pdf"}`;
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
      return "/admin";
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
  tab: string,
  params?: {
    toolSlug?: string;
    categorySlug?: string;
    postSlug?: string;
    authorSlug?: string;
    search?: string;
  },
  domain: string = CANONICAL_DOMAIN
): string {
  const relativePath = getUrlForRoute(tab, params);
  const base = domain.replace(/\/+$/, "");
  return `${base}${relativePath}`;
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

  // 2. Enforce non-WWW apex domain
  const hostname = urlObj.hostname.replace(/^www\./i, "");
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
    });
  } else {
    canonicalPath = normalizePath(urlObj.pathname);
  }

  // 4. Return clean absolute canonical URL strictly without query parameters or hash
  return `${protocol}//${hostname}${port}${canonicalPath}`;
}

/**
 * Enforces canonical URL redirect on client-side (enforcing HTTPS, non-WWW apex domain,
 * removing trailing slashes, and stripping all query parameters)
 * using window.location.replace to redirect every request to its normalized canonical URL.
 */
export function enforceCanonicalRedirect(): boolean {
  if (typeof window === "undefined") return false;

  const loc = window.location;
  const isLocalhost =
    loc.hostname === "localhost" ||
    loc.hostname === "127.0.0.1" ||
    loc.hostname.endsWith(".run.app");

  // 1. Check if protocol needs upgrade to HTTPS (in non-local environment)
  const needsHttps = !isLocalhost && loc.protocol === "http:";

  // 2. Check if www prefix exists
  const hasWww = loc.hostname.startsWith("www.");

  // 3. Check if pathname has trailing slash (except root "/")
  const hasTrailingSlash = loc.pathname.length > 1 && loc.pathname.endsWith("/");

  // 4. Check uppercase letters in pathname
  const hasUppercase = /[A-Z]/.test(loc.pathname);

  // 5. Check if query parameters exist (must be stripped for canonical URL)
  const hasQueryParams = Boolean(loc.search && loc.search.length > 1);

  // 6. Check if hash exists
  const hasHash = Boolean(loc.hash && loc.hash.length > 1);

  // 7. Resolve canonical path
  const route = parseRoute(loc.pathname, loc.search);
  let canonicalPath = loc.pathname;
  if (!route.isNotFound && route.tab !== "search") {
    canonicalPath = getUrlForRoute(route.tab, {
      toolSlug: route.toolSlug,
      categorySlug: route.categorySlug,
      postSlug: route.postSlug,
      authorSlug: route.authorSlug,
    });
  } else if (hasTrailingSlash) {
    canonicalPath = loc.pathname.replace(/\/+$/, "");
  }

  const isPathNonCanonical = loc.pathname !== canonicalPath;

  if (
    needsHttps ||
    hasWww ||
    hasTrailingSlash ||
    hasUppercase ||
    hasQueryParams ||
    hasHash ||
    isPathNonCanonical
  ) {
    const targetUrl = resolveCanonicalUrl();
    const currentUrl = `${loc.protocol}//${loc.host}${loc.pathname}${loc.search}${loc.hash}`;
    if (targetUrl && targetUrl !== currentUrl) {
      window.location.replace(targetUrl);
      return true;
    }
  }

  return false;
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
