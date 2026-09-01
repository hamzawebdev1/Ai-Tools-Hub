import React, { useEffect } from "react";
import { getCanonicalUrl } from "../../services/seoService";

interface SchemaHeadProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  schemaType?: "WebSite" | "SoftwareApplication" | "Article" | "FAQPage" | "BreadcrumbList";
  schemaData?: Record<string, any>;
}

export const SchemaHead: React.FC<SchemaHeadProps> = ({
  title,
  description,
  canonicalUrl,
  schemaType = "WebSite",
  schemaData,
}) => {
  const safeCanonical = getCanonicalUrl(canonicalUrl || (typeof window !== "undefined" ? window.location.pathname : "/"));

  useEffect(() => {
    // Update Document Title
    const fullTitle = `${title} | Mehzan Tools Hub`;
    document.title = fullTitle;

    // Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", description);

    // Update Canonical Link - ensure exactly one
    const existingCanonicals = document.querySelectorAll('link[rel="canonical"]');
    if (existingCanonicals.length > 1) {
      existingCanonicals.forEach((el, idx) => {
        if (idx > 0) el.remove();
      });
    }
    let canonicalTag = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalTag) {
      canonicalTag = document.createElement("link");
      canonicalTag.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute("href", safeCanonical);

    // Update Open Graph and Twitter Meta Tags
    const setMetaTag = (property: string, content: string, isName = false) => {
      const attr = isName ? "name" : "property";
      let el = document.querySelector(`meta[${attr}="${property}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, property);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMetaTag("og:title", fullTitle);
    setMetaTag("og:description", description);
    setMetaTag("og:url", safeCanonical);
    setMetaTag("og:type", schemaType === "Article" ? "article" : "website");
    setMetaTag("og:site_name", "Mehzan Tools Hub");
    setMetaTag("twitter:card", "summary_large_image", true);
    setMetaTag("twitter:title", fullTitle, true);
    setMetaTag("twitter:description", description, true);

    // Inject Structured Data JSON-LD
    let script = document.getElementById("json-ld-schema") as HTMLScriptElement;
    if (!script) {
      script = document.createElement("script");
      script.id = "json-ld-schema";
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }

    const graph: any[] = [];

    if (schemaType === "SoftwareApplication" && schemaData) {
      graph.push({
        "@type": "SoftwareApplication",
        "name": schemaData.name,
        "operatingSystem": "All (Web Browser)",
        "applicationCategory": "UtilitiesApplication",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "aggregateRating": schemaData.rating ? {
          "@type": "AggregateRating",
          "ratingValue": schemaData.rating,
          "ratingCount": schemaData.ratingCount || 12
        } : undefined
      });
    }

    if (schemaData?.faqs && Array.isArray(schemaData.faqs) && schemaData.faqs.length > 0) {
      graph.push({
        "@type": "FAQPage",
        "mainEntity": schemaData.faqs.map((faq: any) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      });
    }

    if (graph.length > 0) {
      script.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@graph": graph
      });
    } else {
      script.remove();
    }
  }, [title, description, safeCanonical, schemaType, schemaData]);

  return null;
};
