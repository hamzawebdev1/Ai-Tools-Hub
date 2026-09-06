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
    const fullTitle = title.includes("Mehzan") ? title : `${title} | Mehzan Tools Hub`;
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

    const graph: any[] = [
      // Base Organization Schema
      {
        "@type": "Organization",
        "@id": "https://www.mehzandigital.com/#organization",
        "name": "Mehzan Tools Hub",
        "url": "https://www.mehzandigital.com/",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.mehzandigital.com/logo.png"
        },
        "sameAs": [
          "https://twitter.com/mehzandigital",
          "https://github.com/mehzandigital"
        ]
      },
      // Base WebSite Schema with Sitelinks SearchBox
      {
        "@type": "WebSite",
        "@id": "https://www.mehzandigital.com/#website",
        "url": "https://www.mehzandigital.com/",
        "name": "Mehzan Tools Hub",
        "description": "50+ Free Developer, PDF, Image & Text Utilities",
        "publisher": {
          "@id": "https://www.mehzandigital.com/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://www.mehzandigital.com/?search={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    ];

    // BreadcrumbList Schema
    if (schemaData?.breadcrumbs && Array.isArray(schemaData.breadcrumbs)) {
      graph.push({
        "@type": "BreadcrumbList",
        "itemListElement": schemaData.breadcrumbs.map((crumb: any, index: number) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": crumb.name,
          "item": crumb.url.startsWith("http") ? crumb.url : `https://www.mehzandigital.com${crumb.url}`
        }))
      });
    }

    if (schemaType === "SoftwareApplication" && schemaData) {
      graph.push({
        "@type": "SoftwareApplication",
        "name": schemaData.name,
        "description": schemaData.description || description,
        "url": safeCanonical,
        "operatingSystem": "All (Web Browser, Windows, macOS, Linux, iOS, Android)",
        "applicationCategory": "UtilitiesApplication",
        "browserRequirements": "Requires HTML5, WebAssembly and JavaScript enabled",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": schemaData.rating || 4.9,
          "ratingCount": schemaData.ratingCount || 124,
          "bestRating": "5",
          "worstRating": "1"
        }
      });
    }

    if (schemaType === "Article" && schemaData) {
      graph.push({
        "@type": "BlogPosting",
        "headline": schemaData.headline || title,
        "description": schemaData.description || description,
        "image": schemaData.image || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
        "datePublished": schemaData.datePublished || new Date().toISOString(),
        "dateModified": schemaData.dateModified || schemaData.datePublished || new Date().toISOString(),
        "author": {
          "@type": "Person",
          "name": schemaData.authorName || "Mehzan Digital Editorial Team"
        },
        "publisher": {
          "@id": "https://www.mehzandigital.com/#organization"
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": safeCanonical
        }
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

    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": graph
    });
  }, [title, description, safeCanonical, schemaType, schemaData]);

  return null;
};
