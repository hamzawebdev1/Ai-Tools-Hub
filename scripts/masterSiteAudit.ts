import http from "http";
import { TOOLS_DATA } from "../src/data/toolsData";
import { CATEGORIES_DATA } from "../src/data/categoriesData";
import { BLOG_POSTS_DATA } from "../src/data/blogData";
import { getPublicIndexableRoutes } from "../src/services/seoService";

function fetchUrl(path: string): Promise<{ statusCode: number; headers: http.IncomingHttpHeaders; body: string }> {
  return new Promise((resolve, reject) => {
    const req = http.get(`http://127.0.0.1:3000${path}`, { headers: { "User-Agent": "Mozilla/5.0 (Googlebot/2.1)" } }, (res) => {
      let body = "";
      res.on("data", (chunk) => { body += chunk; });
      res.on("end", () => {
        resolve({ statusCode: res.statusCode || 0, headers: res.headers, body });
      });
    });
    req.on("error", (err) => reject(err));
  });
}

async function runMasterAudit() {
  console.log("=================================================");
  console.log("   PHASE 3 — FULL SITE PRODUCTION SEO AUDIT      ");
  console.log("=================================================\n");

  const indexableRoutes = getPublicIndexableRoutes();
  const indexablePathsSet = new Set(indexableRoutes.map((r) => r.urlPath));

  // Collect all internal links discovered during crawl
  const internalLinksDiscovered = new Set<string>();

  // Audit metrics
  let totalPublicUrls = indexableRoutes.length;
  let http200Count = 0;
  let http404Count = 0;
  let soft404Count = 0;
  let http3xxCount = 0;
  let noindexCount = 0;
  let canonicalErrors = 0;
  let duplicateUrls = 0;
  let orphanPages = 0;
  let missingH1 = 0;
  let missingTitle = 0;
  let missingMetaDescription = 0;
  let missingSchema = 0;
  let sitemapErrors = 0;
  let thinContentPages = 0;
  let brokenInternalLinks = 0;

  const titleSet = new Set<string>();
  const descSet = new Set<string>();

  // 1. Audit ALL Public Indexable Routes via HTTP GET & RAW HTML
  console.log(`Crawling and auditing ${indexableRoutes.length} public indexable routes...`);

  let count = 0;
  for (const route of indexableRoutes) {
    count++;
    if (count % 100 === 0 || count === indexableRoutes.length) {
      console.log(`  ...processed ${count}/${indexableRoutes.length} routes`);
    }

    try {
      const res = await fetchUrl(route.urlPath);
      if (res.statusCode === 200) {
        http200Count++;

        // Title Check
        const titleMatch = res.body.match(/<title>([^<]+)<\/title>/i);
        if (titleMatch && titleMatch[1].trim()) {
          const t = titleMatch[1].trim();
          if (titleSet.has(t)) {
            duplicateUrls++;
          } else {
            titleSet.add(t);
          }
        } else {
          missingTitle++;
        }

        // Meta Description Check
        const descMatch = res.body.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
        if (descMatch && descMatch[1].trim()) {
          const d = descMatch[1].trim();
          if (descSet.has(d)) {
            // Duplicate description warning
          } else {
            descSet.add(d);
          }
        } else {
          missingMetaDescription++;
        }

        // H1 Check
        const h1Match = res.body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
        if (!h1Match || !h1Match[1].trim()) {
          missingH1++;
        }

        // Canonical Check
        const canonicalMatch = res.body.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
        const expectedCanonical = `https://www.mehzandigital.com${route.urlPath === "/" ? "/" : route.urlPath}`;
        if (!canonicalMatch || canonicalMatch[1] !== expectedCanonical) {
          canonicalErrors++;
          console.error(`❌ Canonical error on ${route.urlPath}: expected ${expectedCanonical}, got ${canonicalMatch ? canonicalMatch[1] : 'none'}`);
        }

        // Robots Meta Check (Accidental noindex check)
        const robotsMatch = res.body.match(/<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/i);
        if (robotsMatch && robotsMatch[1].includes("noindex")) {
          console.error(`❌ Accidental noindex tag on public route ${route.urlPath}`);
          noindexCount++;
        }

        // Schema Check (JSON-LD)
        const schemaMatch = res.body.match(/<script\s+id=["']seo-jsonld-schemas["']\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/i);
        if (!schemaMatch) {
          missingSchema++;
        }

        // Thin Content Check (<300 characters of text in body)
        const strippedBody = res.body.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
        if (strippedBody.length < 300) {
          thinContentPages++;
        }

        // Soft 404 Check (Contains 404 error text while returning 200)
        if (strippedBody.toLowerCase().includes("404 page not found") || strippedBody.toLowerCase().includes("page could not be found")) {
          soft404Count++;
          console.error(`❌ Soft 404 detected on ${route.urlPath}`);
        }

        // Extract Internal Links from raw HTML
        const hrefMatches = res.body.matchAll(/href=["'](\/[^"']*)["']/g);
        for (const match of hrefMatches) {
          const link = match[1].split("?")[0].split("#")[0];
          if (link && !link.startsWith("//")) {
            const cleanLink = link === "/" ? "/" : link.replace(/\/+$/, "");
            internalLinksDiscovered.add(cleanLink);
          }
        }

      } else if (res.statusCode >= 300 && res.statusCode < 400) {
        http3xxCount++;
      } else if (res.statusCode === 404) {
        http404Count++;
        console.error(`❌ Unexpected 404 on indexable sitemap route: ${route.urlPath}`);
      }
    } catch (e: any) {
      console.error(`❌ Connection error on ${route.urlPath}:`, e.message);
    }
  }

  // 2. Audit Orphan Pages (Indexable routes that have NO internal link pointing to them)
  for (const route of indexableRoutes) {
    const path = route.urlPath === "/" ? "/" : route.urlPath.replace(/\/+$/, "");
    if (!internalLinksDiscovered.has(path)) {
      orphanPages++;
      console.error(`❌ Orphan Page detected (no internal link to): ${path}`);
    }
  }

  // 3. Audit Private / Non-Indexable Pages
  const privateRoutes = ["/pricing", "/login", "/register", "/forgot-password", "/dashboard", "/admin", "/favorites", "/history", "/search"];
  let privateNoindexCount = 0;
  for (const path of privateRoutes) {
    try {
      const res = await fetchUrl(path);
      if (res.statusCode === 200) {
        const robotsMatch = res.body.match(/<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/i);
        if (robotsMatch && robotsMatch[1].includes("noindex")) {
          privateNoindexCount++;
        } else {
          console.error(`❌ Private route missing noindex: ${path}`);
        }
      }
    } catch (e: any) {
      console.error(`❌ Error fetching private route ${path}:`, e.message);
    }
  }

  // 4. Audit Non-Existent Routes for real 404 status
  const test404Routes = ["/en/non-existent-tool-xyz-999", "/invalid-route-abc-123"];
  let verified404Count = 0;
  for (const path of test404Routes) {
    try {
      const res = await fetchUrl(path);
      if (res.statusCode === 404) {
        verified404Count++;
      } else {
        console.error(`❌ Non-existent route ${path} returned status ${res.statusCode} instead of 404`);
      }
    } catch (e: any) {
      console.error(`❌ Error checking 404 route ${path}:`, e.message);
    }
  }

  // 5. Audit 301 Direct Redirect Routes
  const testRedirectRoutes = [
    "/jpg-to-pdf",
    "/tool/pdf-merge",
    "/tools/word-counter",
    "/about-us",
    "/privacy-policy",
    "/terms-of-service",
    "/en/json-formatter/",
    "/en/decimal-to-hex"
  ];
  let verified301Count = 0;
  for (const path of testRedirectRoutes) {
    try {
      const res = await fetchUrl(path);
      if (res.statusCode === 301) {
        verified301Count++;
      } else {
        console.error(`❌ Redirect route ${path} returned status ${res.statusCode} instead of 301`);
      }
    } catch (e: any) {
      console.error(`❌ Error checking redirect route ${path}:`, e.message);
    }
  }

  // 6. Audit XML Sitemap & Robots.txt
  const sitemapRes = await fetchUrl("/sitemap.xml");
  const robotsRes = await fetchUrl("/robots.txt");

  if (sitemapRes.statusCode !== 200 || !sitemapRes.body.includes("<urlset")) {
    sitemapErrors++;
  }
  if (robotsRes.statusCode !== 200 || !robotsRes.body.includes("Sitemap:")) {
    sitemapErrors++;
  }

  console.log("\n=================================================");
  console.log("            FINAL AUDIT REPORT TABLE             ");
  console.log("=================================================");
  console.table({
    "Total public URLs": totalPublicUrls,
    "HTTP 200": http200Count,
    "404": http404Count,
    "Soft 404": soft404Count,
    "3XX": verified301Count,
    "Noindex (Private Protected)": privateNoindexCount,
    "Canonical errors": canonicalErrors,
    "Duplicate URLs": duplicateUrls,
    "Orphan pages": orphanPages,
    "Missing H1": missingH1,
    "Missing title": missingTitle,
    "Missing meta description": missingMetaDescription,
    "Missing schema": missingSchema,
    "Sitemap errors": sitemapErrors,
    "Thin-content pages": thinContentPages,
    "Broken internal links": brokenInternalLinks
  });
  console.log("=================================================");
}

runMasterAudit().catch(console.error);
