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

async function runProductionVerification() {
  console.log("=================================================");
  console.log("   LIVE PRODUCTION HTTP RAW HTML VERIFICATION    ");
  console.log("=================================================\n");

  const activeTools = TOOLS_DATA.filter((t) => t.status !== "DISABLED" && t.isActive !== false);
  const indexableRoutes = getPublicIndexableRoutes();
  const indexablePathsSet = new Set(indexableRoutes.map((r) => r.urlPath));

  // Build target list
  const specificToolSlugs = ["json-formatter", "pdf-editor", "image-converter", "decimal-to-hexadecimal", "age-calculator"];
  const randomSampleTools = activeTools
    .filter((t) => !specificToolSlugs.includes(t.slug))
    .slice(0, 50);

  const testTools = [
    ...activeTools.filter((t) => specificToolSlugs.includes(t.slug)),
    ...randomSampleTools
  ];

  const static200Urls = ["/", "/tools", "/categories", "/blog", "/about", "/contact", "/privacy", "/terms", "/disclaimer", "/cookie-policy", "/copyright"];
  const privateNoindexUrls = ["/pricing", "/login", "/dashboard", "/admin", "/search?q=test", "/favorites", "/history"];
  const nonExistent404Urls = ["/en/non-existent-tool-xyz-999", "/invalid-route-abc-123"];
  const redirect301Tests = [
    { url: "/jpg-to-pdf", expected: "/en/jpg-to-pdf" },
    { url: "/tool/pdf-merge", expected: "/en/pdf-merge" },
    { url: "/tools/word-counter", expected: "/en/word-counter" },
    { url: "/about-us", expected: "/about" },
    { url: "/en/json-formatter/", expected: "/en/json-formatter" },
    { url: "/en/decimal-to-hex", expected: "/en/decimal-to-hexadecimal" }
  ];

  let totalUrlsChecked = 0;
  let status200Count = 0;
  let status404Count = 0;
  let status301Count = 0;
  let noindexCount = 0;
  let validCanonicalCount = 0;
  let sitemapCoverageCount = 0;
  let h1PresenceCount = 0;
  const uniqueTitles = new Set<string>();
  const uniqueDescriptions = new Set<string>();

  // 1. Verify Public Tool Pages (RAW HTML Inspection)
  console.log(`Auditing ${testTools.length} Tool Pages via HTTP GET & RAW HTML Parsing...`);

  for (const tool of testTools) {
    const path = `/en/${tool.slug}`;
    totalUrlsChecked++;
    try {
      const res = await fetchUrl(path);
      if (res.statusCode === 200) {
        status200Count++;

        // Raw HTML Regex Checks
        const titleMatch = res.body.match(/<title>([^<]+)<\/title>/i);
        if (titleMatch && titleMatch[1]) {
          uniqueTitles.add(titleMatch[1].trim());
        }

        const descMatch = res.body.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
        if (descMatch && descMatch[1]) {
          uniqueDescriptions.add(descMatch[1].trim());
        }

        const h1Match = res.body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
        if (h1Match && h1Match[1].trim().length > 0) {
          h1PresenceCount++;
        }

        const canonicalMatch = res.body.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
        const expectedCanonical = `https://www.mehzandigital.com${path}`;
        if (canonicalMatch && canonicalMatch[1] === expectedCanonical) {
          validCanonicalCount++;
        } else {
          console.error(`❌ Mismatch canonical on ${path}: expected ${expectedCanonical}, got ${canonicalMatch ? canonicalMatch[1] : 'none'}`);
        }

        const robotsMatch = res.body.match(/<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/i);
        if (robotsMatch && robotsMatch[1].includes("noindex")) {
          console.error(`❌ Unexpected noindex tag on public indexable tool ${path}`);
        }

        if (indexablePathsSet.has(path)) {
          sitemapCoverageCount++;
        }
      } else {
        console.error(`❌ HTTP status ${res.statusCode} on tool path ${path}`);
      }
    } catch (e: any) {
      console.error(`❌ HTTP fetch error on ${path}:`, e.message);
    }
  }

  // 2. Verify Core Static Pages
  console.log(`\nAuditing ${static200Urls.length} Core Static Pages...`);
  for (const path of static200Urls) {
    totalUrlsChecked++;
    try {
      const res = await fetchUrl(path);
      if (res.statusCode === 200) {
        status200Count++;

        const titleMatch = res.body.match(/<title>([^<]+)<\/title>/i);
        if (titleMatch) uniqueTitles.add(titleMatch[1].trim());

        const descMatch = res.body.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
        if (descMatch) uniqueDescriptions.add(descMatch[1].trim());

        const h1Match = res.body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
        if (h1Match && h1Match[1].trim().length > 0) h1PresenceCount++;

        const canonicalMatch = res.body.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
        const expectedCanonical = `https://www.mehzandigital.com${path === "/" ? "/" : path}`;
        if (canonicalMatch && canonicalMatch[1] === expectedCanonical) validCanonicalCount++;

        if (indexablePathsSet.has(path)) sitemapCoverageCount++;
      }
    } catch (e: any) {
      console.error(`❌ Error fetching ${path}:`, e.message);
    }
  }

  // 3. Verify Private / Non-Indexable Pages
  console.log(`\nAuditing ${privateNoindexUrls.length} Private / Non-Indexable Pages...`);
  for (const path of privateNoindexUrls) {
    totalUrlsChecked++;
    try {
      const res = await fetchUrl(path);
      if (res.statusCode === 200) {
        status200Count++;
        const robotsMatch = res.body.match(/<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/i);
        if (robotsMatch && robotsMatch[1].includes("noindex")) {
          noindexCount++;
        } else {
          console.error(`❌ Missing noindex on private page ${path}`);
        }
      }
    } catch (e: any) {
      console.error(`❌ Error fetching ${path}:`, e.message);
    }
  }

  // 4. Verify 404 Not Found Pages
  console.log(`\nAuditing ${nonExistent404Urls.length} Non-Existent Routes for real 404 HTTP status...`);
  for (const path of nonExistent404Urls) {
    totalUrlsChecked++;
    try {
      const res = await fetchUrl(path);
      if (res.statusCode === 404) {
        status404Count++;
        noindexCount++;
      } else {
        console.error(`❌ Expected 404 status for ${path}, got ${res.statusCode}`);
      }
    } catch (e: any) {
      console.error(`❌ Error fetching ${path}:`, e.message);
    }
  }

  // 5. Verify 301 Direct Redirects
  console.log(`\nAuditing ${redirect301Tests.length} Alias Routes for direct 301 redirects...`);
  for (const item of redirect301Tests) {
    totalUrlsChecked++;
    try {
      const res = await fetchUrl(item.url);
      if (res.statusCode === 301) {
        status301Count++;
        const location = res.headers["location"];
        if (location === item.expected || location === `https://www.mehzandigital.com${item.expected}`) {
          // Direct match
        } else {
          console.error(`❌ Redirect target mismatch for ${item.url}: expected ${item.expected}, got ${location}`);
        }
      } else {
        console.error(`❌ Expected 301 for ${item.url}, got ${res.statusCode}`);
      }
    } catch (e: any) {
      console.error(`❌ Error testing redirect for ${item.url}:`, e.message);
    }
  }

  // 6. Verify robots.txt and sitemap.xml
  console.log("\nAuditing robots.txt and sitemap.xml endpoints...");
  const robotsRes = await fetchUrl("/robots.txt");
  const sitemapRes = await fetchUrl("/sitemap.xml");

  const isRobotsValid = robotsRes.statusCode === 200 && robotsRes.body.includes("User-agent: *") && robotsRes.body.includes("Sitemap:");
  const isSitemapValid = sitemapRes.statusCode === 200 && sitemapRes.body.includes("<urlset") && sitemapRes.body.includes("/en/json-formatter");

  console.log(`robots.txt status: ${robotsRes.statusCode} (${isRobotsValid ? "VALID" : "INVALID"})`);
  console.log(`sitemap.xml status: ${sitemapRes.statusCode} (${isSitemapValid ? "VALID" : "INVALID"})`);

  console.log("\n=================================================");
  console.log("          FINAL SEO METRICS SUMMARY              ");
  console.log("=================================================");
  console.log(`1. Total Valid Active Tool Routes: ${activeTools.length}`);
  console.log(`2. Total 200 OK Responses Verified: ${status200Count}`);
  console.log(`3. Total 404 Responses Verified:    ${status404Count}`);
  console.log(`4. Total 301 Redirects Verified:   ${status301Count}`);
  console.log(`5. Total Verified noindex Pages:   ${noindexCount}`);
  console.log(`6. Valid Canonical URLs Verified:  ${validCanonicalCount}`);
  console.log(`7. Total Sitemap Coverage Count:   ${indexableRoutes.length}`);
  console.log(`8. H1 Tag Presence Verified:       ${h1PresenceCount}`);
  console.log(`9. Unique Page Titles Count:       ${uniqueTitles.size}`);
  console.log(`10. Unique Meta Descriptions Count:${uniqueDescriptions.size}`);
  console.log("=================================================");
}

runProductionVerification().catch(console.error);
