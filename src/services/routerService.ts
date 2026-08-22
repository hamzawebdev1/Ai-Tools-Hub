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
 * Normalizes any path into a clean route state
 */
export function parseRoute(pathname: string = "/", search: string = ""): RouteState {
  // Clean path: strip leading and trailing slashes
  let cleanPath = pathname.trim().replace(/^\/+|\/+$/g, "");
  const searchParams = new URLSearchParams(search);

  if (!cleanPath || cleanPath === "home") {
    return { tab: "home" };
  }

  // Handle direct static routes
  switch (cleanPath) {
    case "tools":
    case "all-tools":
      return { tab: "all-tools" };
    case "categories":
      return { tab: "categories" };
    case "blog":
      return { tab: "blog" };
    case "about":
    case "about-us":
      return { tab: "about" };
    case "contact":
    case "contact-us":
      return { tab: "contact" };
    case "privacy":
    case "privacy-policy":
      return { tab: "privacy" };
    case "terms":
    case "terms-of-service":
      return { tab: "terms" };
    case "disclaimer":
      return { tab: "disclaimer" };
    case "cookie-policy":
    case "cookies":
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
    case "suggest":
      return { tab: "suggest-tool" };
    case "feedback":
      return { tab: "feedback" };
    case "login":
    case "signin":
      return { tab: "login" };
    case "register":
    case "signup":
      return { tab: "register" };
    case "forgot-password":
      return { tab: "forgot-password" };
    case "dashboard":
    case "profile":
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
    const toolSlug = cleanPath.split("/")[1]?.toLowerCase();
    const matchedTool = TOOLS_DATA.find(
      (t) => t.slug === toolSlug || t.id === toolSlug
    );
    if (matchedTool) {
      return { tab: "tool-detail", toolSlug: matchedTool.slug };
    }
  }

  // Handle DIRECT tool slug: e.g. /jpg-to-pdf, /pdf-merge, /image-compressor
  const directSlug = cleanPath.toLowerCase();
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
 * Converts a tab name and parameters back into a clean URL
 */
export function getUrlForRoute(tab: string, params?: { toolSlug?: string; categorySlug?: string; postSlug?: string; authorSlug?: string; search?: string }): string {
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
        const slug = tab.replace("author-", "");
        return `/author/${slug}`;
      }
      return "/";
  }
}

/**
 * Performs client-side navigation with History API and event dispatch
 */
export function navigateTo(url: string, replace: boolean = false): void {
  if (typeof window === "undefined") return;

  const currentPath = window.location.pathname + window.location.search;
  if (currentPath !== url) {
    if (replace) {
      window.history.replaceState({}, "", url);
    } else {
      window.history.pushState({}, "", url);
    }
  }

  // Dispatch custom route change event
  window.dispatchEvent(new CustomEvent("mehzandigital_route_change", { detail: { url } }));
  window.scrollTo({ top: 0, behavior: "smooth" });
}
