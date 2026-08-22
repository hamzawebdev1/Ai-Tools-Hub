import React, { useEffect } from "react";

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
  canonicalUrl = typeof window !== "undefined" ? window.location.href : "https://utilitytoolshub.com",
  schemaType = "WebSite",
  schemaData,
}) => {
  useEffect(() => {
    // Update Document Title
    const fullTitle = `${title} | Utility Tools Hub - Free Production AI Suite`;
    document.title = fullTitle;

    // Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", description);

    // Update Canonical Link
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement("link");
      canonicalTag.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute("href", canonicalUrl);

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

    setMetaTag("og:title", title);
    setMetaTag("og:description", description);
    setMetaTag("og:url", canonicalUrl);
    setMetaTag("og:type", schemaType === "Article" ? "article" : "website");
    setMetaTag("og:image", "https://utilitytoolshub.com/og-image.png");
    setMetaTag("twitter:card", "summary_large_image", true);
    setMetaTag("twitter:title", title, true);
    setMetaTag("twitter:description", description, true);
    setMetaTag("twitter:image", "https://utilitytoolshub.com/og-image.png", true);

    // Default WebSite Schema JSON-LD
    let ldJsonObject: any = {
      "@context": "https://schema.org",
      "@type": schemaType,
      name: title,
      description: description,
      url: canonicalUrl,
    };

    if (schemaType === "WebSite") {
      ldJsonObject = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Utility Tools Hub",
        url: canonicalUrl,
        potentialAction: {
          "@type": "SearchAction",
          target: "https://utilitytoolshub.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      };
    } else if (schemaType === "SoftwareApplication" && schemaData) {
      ldJsonObject = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: schemaData.name || title,
        operatingSystem: "Web",
        applicationCategory: "UtilitiesApplication",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: schemaData.rating || "4.9",
          ratingCount: schemaData.ratingCount || "1200",
        },
      };
    }

    if (schemaData && schemaType !== "SoftwareApplication") {
      ldJsonObject = { ...ldJsonObject, ...schemaData };
    }

    // Inject Script Tag
    let scriptTag = document.getElementById("json-ld-schema") as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement("script");
      scriptTag.id = "json-ld-schema";
      scriptTag.type = "application/ld+json";
      document.head.appendChild(scriptTag);
    }
    scriptTag.text = JSON.stringify(ldJsonObject);
  }, [title, description, canonicalUrl, schemaType, schemaData]);

  return null;
};
