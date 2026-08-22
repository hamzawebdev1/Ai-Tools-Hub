import React, { useEffect } from "react";
import { buildSEOMetadata } from "../../services/seoService";
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

export const SEOHead: React.FC<SEOHeadProps> = ({
  activeTab,
  tool,
  category,
  post,
  searchQuery,
  pagination,
}) => {
  const metadata = buildSEOMetadata(activeTab, { tool, category, post, searchQuery });

  useEffect(() => {
    // 1. Update Document Title
    document.title = metadata.title;

    // Helper to safely set or update <meta> tags
    const updateMetaTag = (attribute: "name" | "property", attrValue: string, contentValue: string) => {
      let element = document.querySelector(`meta[${attribute}="${attrValue}"]`) as HTMLMetaElement;
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute("content", contentValue);
    };

    // Helper to set or update <link> tags
    const updateLinkTag = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
      if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", rel);
        document.head.appendChild(element);
      }
      element.setAttribute("href", href);
    };

    // 2. Standard Meta Tags
    updateMetaTag("name", "description", metadata.description);
    updateMetaTag("name", "keywords", metadata.keywords.join(", "));
    updateMetaTag("name", "generator", "Utility Tools Hub v1.0 - Core Web Vitals & Google SEO Engine");
    updateMetaTag("name", "author", metadata.author || "Utility Tools Hub Team");
    updateMetaTag(
      "name",
      "robots",
      metadata.noIndex ? "noindex, follow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
    );

    // 3. Canonical URL
    updateLinkTag("canonical", metadata.canonicalUrl);

    // Pagination links (rel="prev" and rel="next")
    if (pagination) {
      if (pagination.currentPage > 1) {
        const prevUrl = `${pagination.baseUrl}?page=${pagination.currentPage - 1}`;
        updateLinkTag("prev", prevUrl);
      } else {
        const existingPrev = document.querySelector('link[rel="prev"]');
        if (existingPrev) existingPrev.remove();
      }

      if (pagination.currentPage < pagination.totalPages) {
        const nextUrl = `${pagination.baseUrl}?page=${pagination.currentPage + 1}`;
        updateLinkTag("next", nextUrl);
      } else {
        const existingNext = document.querySelector('link[rel="next"]');
        if (existingNext) existingNext.remove();
      }
    }

    // 4. Open Graph Tags
    updateMetaTag("property", "og:title", metadata.title);
    updateMetaTag("property", "og:description", metadata.description);
    updateMetaTag("property", "og:type", metadata.ogType);
    updateMetaTag("property", "og:url", metadata.canonicalUrl);
    updateMetaTag("property", "og:image", metadata.ogImage);
    updateMetaTag("property", "og:site_name", "Utility Tools Hub");

    if (metadata.publishedDate) {
      updateMetaTag("property", "article:published_time", new Date(metadata.publishedDate).toISOString());
    }

    // 5. Twitter Card Tags
    updateMetaTag("name", "twitter:card", "summary_large_image");
    updateMetaTag("name", "twitter:title", metadata.title);
    updateMetaTag("name", "twitter:description", metadata.description);
    updateMetaTag("name", "twitter:image", metadata.ogImage);
    updateMetaTag("name", "twitter:site", "@utilitytoolshub");

    // 6. JSON-LD Structured Data Injection
    const existingScript = document.getElementById("seo-jsonld-schemas");
    if (existingScript) {
      existingScript.remove();
    }

    if (metadata.schemas && metadata.schemas.length > 0) {
      const script = document.createElement("script");
      script.id = "seo-jsonld-schemas";
      script.type = "application/ld+json";
      // Merge all valid non-null schemas into a graph or multi-script payload
      const validSchemas = metadata.schemas.filter(Boolean);
      script.text = JSON.stringify(validSchemas.length === 1 ? validSchemas[0] : { "@context": "https://schema.org", "@graph": validSchemas });
      document.head.appendChild(script);
    }
  }, [metadata, pagination]);

  return null; // Head management component renders side effects into document.head
};
