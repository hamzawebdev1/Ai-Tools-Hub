import React, { useEffect, useMemo } from "react";
import { buildSEOMetadata } from "../../services/seoService";
import { getUrlForRoute, normalizePath, CANONICAL_DOMAIN } from "../../services/routerService";
import { AITool, BlogPost, CategoryInfo } from "../../types";

interface SEOHeadProps {
  activeTab: string;
  tool?: AITool;
  category?: CategoryInfo | string;
  post?: BlogPost;
  searchQuery?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    baseUrl: string;
  };
}

/**
 * Resolves the active base domain dynamically without any hardcoded domain strings.
 */
function getDynamicBaseDomain(): string {
  if (typeof window !== "undefined" && window.location?.origin) {
    const isLocalOrPreview =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname.endsWith(".run.app");

    if (isLocalOrPreview) {
      return window.location.origin.replace(/\/+$/, "");
    }

    // In production, enforce HTTPS and apex non-WWW host
    const cleanHost = window.location.host.replace(/^www\./i, "");
    return `https://${cleanHost}`;
  }

  return CANONICAL_DOMAIN.replace(/\/+$/, "");
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  activeTab,
  tool,
  category,
  post,
  searchQuery,
  pagination,
}) => {
  // 1. Build initial metadata object from seoService
  const baseMetadata = buildSEOMetadata(activeTab, { tool, category, post, searchQuery });

  // 2. Resolve dynamic, clean normalized path from routerService
  const cleanNormalizedPath = useMemo(() => {
    const toolSlug = tool?.slug || tool?.id;
    const categorySlug = typeof category === "object" ? category.slug : category;
    const postSlug = post?.slug;
    const authorSlug = activeTab.startsWith("author-") ? activeTab.replace("author-", "") : undefined;

    return getUrlForRoute(activeTab, {
      toolSlug,
      categorySlug,
      postSlug,
      authorSlug,
      search: searchQuery,
    });
  }, [activeTab, tool, category, post, searchQuery]);

  // 3. Compute absolute dynamic canonical and Open Graph URL
  const dynamicCanonicalUrl = useMemo(() => {
    const baseDomain = getDynamicBaseDomain();
    const normalized = normalizePath(cleanNormalizedPath);
    if (normalized === "/") {
      return `${baseDomain}/`;
    }
    return `${baseDomain}${normalized}`;
  }, [cleanNormalizedPath]);

  // 4. Normalize OG Image URL dynamically
  const dynamicOgImage = useMemo(() => {
    const baseDomain = getDynamicBaseDomain();
    const rawImage = baseMetadata.ogImage || "/icon.png";
    if (rawImage.startsWith("http://") || rawImage.startsWith("https://")) {
      return rawImage;
    }
    return `${baseDomain}${rawImage.startsWith("/") ? rawImage : `/${rawImage}`}`;
  }, [baseMetadata.ogImage]);

  useEffect(() => {
    // 1. Update Document Title
    document.title = baseMetadata.title;

    // Helper to safely set or update <meta> tags
    const updateMetaTag = (attribute: "name" | "property", attrValue: string, contentValue: string) => {
      let elements = document.querySelectorAll(`meta[${attribute}="${attrValue}"]`);
      if (elements.length > 1) {
        elements.forEach((el, idx) => {
          if (idx > 0) el.remove();
        });
      }
      let element = document.querySelector(`meta[${attribute}="${attrValue}"]`) as HTMLMetaElement;
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute("content", contentValue);
    };

    // Helper to set or update <link> tags ensuring EXACTLY ONE exists
    const updateLinkTag = (rel: string, href: string) => {
      const existing = document.querySelectorAll(`link[rel="${rel}"]`);
      if (existing.length > 1) {
        existing.forEach((el, idx) => {
          if (idx > 0) el.remove();
        });
      }
      let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
      if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", rel);
        document.head.appendChild(element);
      }
      element.setAttribute("href", href);
    };

    // 2. Standard Meta Tags
    updateMetaTag("name", "description", baseMetadata.description);
    updateMetaTag("name", "keywords", baseMetadata.keywords.join(", "));
    updateMetaTag("name", "generator", "Mehzan Digital Tools Hub & Productivity Suite");
    updateMetaTag("name", "author", baseMetadata.author || "Mehzan Digital Tools Hub Team");
    updateMetaTag(
      "name",
      "robots",
      baseMetadata.noIndex
        ? "noindex, nofollow"
        : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
    );

    // 3. EXACT ONE Canonical URL (Dynamically built from routerService normalized path)
    updateLinkTag("canonical", dynamicCanonicalUrl);

    // Pagination links (rel="prev" and rel="next")
    if (pagination) {
      const baseDomain = getDynamicBaseDomain();
      const normBasePath = normalizePath(pagination.baseUrl);

      if (pagination.currentPage > 1) {
        const prevUrl = `${baseDomain}${normBasePath}?page=${pagination.currentPage - 1}`;
        updateLinkTag("prev", prevUrl);
      } else {
        const existingPrev = document.querySelector('link[rel="prev"]');
        if (existingPrev) existingPrev.remove();
      }

      if (pagination.currentPage < pagination.totalPages) {
        const nextUrl = `${baseDomain}${normBasePath}?page=${pagination.currentPage + 1}`;
        updateLinkTag("next", nextUrl);
      } else {
        const existingNext = document.querySelector('link[rel="next"]');
        if (existingNext) existingNext.remove();
      }
    }

    // 4. Open Graph Tags (og:url MUST match the dynamic canonical URL)
    updateMetaTag("property", "og:title", baseMetadata.title);
    updateMetaTag("property", "og:description", baseMetadata.description);
    updateMetaTag("property", "og:type", baseMetadata.ogType);
    updateMetaTag("property", "og:url", dynamicCanonicalUrl);
    updateMetaTag("property", "og:image", dynamicOgImage);
    updateMetaTag("property", "og:site_name", "Mehzan Digital Tools Hub");

    if (baseMetadata.publishedDate) {
      updateMetaTag("property", "article:published_time", new Date(baseMetadata.publishedDate).toISOString());
    }

    // 5. Twitter Card Tags
    updateMetaTag("name", "twitter:card", "summary_large_image");
    updateMetaTag("name", "twitter:title", baseMetadata.title);
    updateMetaTag("name", "twitter:description", baseMetadata.description);
    updateMetaTag("name", "twitter:image", dynamicOgImage);
    updateMetaTag("name", "twitter:site", "@utilitytoolshub");

    // 6. JSON-LD Structured Data Injection
    const existingScript = document.getElementById("seo-jsonld-schemas");
    if (existingScript) {
      existingScript.remove();
    }
    const legacyScript = document.getElementById("json-ld-schema");
    if (legacyScript) {
      legacyScript.remove();
    }

    if (baseMetadata.schemas && baseMetadata.schemas.length > 0) {
      const script = document.createElement("script");
      script.id = "seo-jsonld-schemas";
      script.type = "application/ld+json";
      const validSchemas = baseMetadata.schemas.filter(Boolean);
      script.text = JSON.stringify(
        validSchemas.length === 1
          ? validSchemas[0]
          : { "@context": "https://schema.org", "@graph": validSchemas }
      );
      document.head.appendChild(script);
    }
  }, [baseMetadata, dynamicCanonicalUrl, dynamicOgImage, pagination]);

  return null;
};
