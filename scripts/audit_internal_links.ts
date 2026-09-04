import http from "http";
import { getPublicIndexableRoutes } from "../src/services/seoService.js";
import { BLOG_POSTS_DATA } from "../src/data/blogData.js";
import { BASE_CANONICAL_TOOLS } from "../src/services/toolRegistryService.js";
import { CATEGORIES_DATA } from "../src/data/categoriesData.js";

interface PageLinkData {
  url: string;
  statusCode: number;
  outgoingLinks: string[];
  incomingLinks: string[];
  redirectLinksFound: { href: string; target: string }[];
  brokenLinksFound: { href: string; status: number }[];
}

function fetchRoute(path: string): Promise<{ statusCode: number; headers: any; body: string }> {
  return new Promise((resolve, reject) => {
    const req = http.get(`http://127.0.0.1:3000${path}`, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        resolve({
          statusCode: res.statusCode || 0,
          headers: res.headers,
          body: data,
        });
      });
    });
    req.on("error", (err) => reject(err));
  });
}

function extractHrefs(html: string): string[] {
  const hrefs: string[] = [];
  const regex = /<a\s+[^>]*href=["']([^"']+)["']/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    let href = match[1];
    // Strip domain if absolute
    if (href.startsWith("https://www.mehzandigital.com") || href.startsWith("http://www.mehzandigital.com")) {
      href = href.replace(/https?:\/\/www\.mehzandigital\.com/, "");
    }
    if (href.startsWith("/")) {
      hrefs.push(href);
    }
  }
  return hrefs;
}

async function analyzeLinks() {
  console.log("=================================================");
  console.log("🔗 MEHZAN DIGITAL - INTERNAL LINKING ARCHITECTURE AUDIT");
  console.log("=================================================\n");

  const indexableRoutes = getPublicIndexableRoutes();
  const allTargetUrls = new Set<string>();

  indexableRoutes.forEach((r) => allTargetUrls.add(r.urlPath));
  BLOG_POSTS_DATA.forEach((b) => allTargetUrls.add(`/blog/${b.slug}`));

  const pagesMap = new Map<string, PageLinkData>();

  for (const targetUrl of allTargetUrls) {
    pagesMap.set(targetUrl, {
      url: targetUrl,
      statusCode: 0,
      outgoingLinks: [],
      incomingLinks: [],
      redirectLinksFound: [],
      brokenLinksFound: [],
    });
  }

  console.log(`Analyzing ${allTargetUrls.size} total indexable routes for incoming/outgoing links...`);

  for (const pageUrl of allTargetUrls) {
    try {
      const res = await fetchRoute(pageUrl);
      const pageData = pagesMap.get(pageUrl)!;
      pageData.statusCode = res.statusCode;

      if (res.statusCode === 200) {
        const hrefs = extractHrefs(res.body);
        const uniqueOutgoing = Array.from(new Set(hrefs));
        pageData.outgoingLinks = uniqueOutgoing;

        for (const href of uniqueOutgoing) {
          if (pagesMap.has(href)) {
            pagesMap.get(href)!.incomingLinks.push(pageUrl);
          }
        }
      }
    } catch (e) {
      console.error(`Failed to fetch ${pageUrl}:`, e);
    }
  }

  // Identify issues
  const orphanPages: string[] = [];
  const noOutgoingPages: string[] = [];
  const brokenLinks: { source: string; target: string; status: number }[] = [];

  for (const [url, data] of pagesMap.entries()) {
    if (data.incomingLinks.length === 0 && url !== "/") {
      orphanPages.push(url);
    }
    if (data.outgoingLinks.length === 0) {
      noOutgoingPages.push(url);
    }
  }

  console.log("\n📊 AUDIT RESULTS:");
  console.log(`- Total Pages Audited: ${pagesMap.size}`);
  console.log(`- Orphan Pages (0 Incoming Links): ${orphanPages.length}`);
  if (orphanPages.length > 0) {
    console.log("  Sample Orphans:", orphanPages.slice(0, 10));
  }
  console.log(`- Pages with No Outgoing Links: ${noOutgoingPages.length}`);
  if (noOutgoingPages.length > 0) {
    console.log("  Sample No Outgoing:", noOutgoingPages.slice(0, 10));
  }

  // Print sample incoming link counts
  let lowIncomingCount = 0;
  for (const [url, data] of pagesMap.entries()) {
    if (data.incomingLinks.length < 3 && url !== "/") {
      lowIncomingCount++;
    }
  }
  console.log(`- Pages with fewer than 3 incoming links: ${lowIncomingCount}`);
}

analyzeLinks();
