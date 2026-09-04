import http from "http";
import { getPublicIndexableRoutes } from "../src/services/seoService.js";
import { parseRoute } from "../src/services/routerService.js";

interface RouteAuditResult {
  path: string;
  statusCode: number;
  title: string;
  description: string;
  h1: string;
  canonical: string;
  robots: string;
  bodyLength: number;
  hasJsonLd: boolean;
  internalLinkCount: number;
  issues: string[];
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

function extractTag(html: string, regex: RegExp): string {
  const match = regex.exec(html);
  return match ? match[1].trim() : "";
}

function extractAll(html: string, regex: RegExp): string[] {
  const matches: string[] = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    matches.push(match[1]);
  }
  return matches;
}

async function runAudit() {
  console.log("=================================================");
  console.log("⚡ MEHZAN DIGITAL - AUTOMATED PUBLIC ROUTE AUDIT");
  console.log("=================================================\n");

  const indexableRoutes = getPublicIndexableRoutes();
  console.log(`📋 Total Indexable Routes to Audit: ${indexableRoutes.length}\n`);

  const results: RouteAuditResult[] = [];
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  const duplicateTitles: string[] = [];
  const duplicateDescriptions: string[] = [];

  let passedCount = 0;
  let failedCount = 0;

  for (const routeObj of indexableRoutes) {
    const path = routeObj.urlPath;
    const issues: string[] = [];

    try {
      const res = await fetchRoute(path);

      // 1. Status Code
      if (res.statusCode !== 200) {
        issues.push(`Expected HTTP 200, got ${res.statusCode}`);
      }

      const html = res.body;

      // 2. Title
      const title = extractTag(html, /<title>([\s\S]*?)<\/title>/i);
      if (!title) {
        issues.push("Missing <title> tag");
      } else {
        if (titles.has(title)) {
          duplicateTitles.push(`${path} shares title: "${title}"`);
        }
        titles.add(title);
      }

      // 3. Description
      const description = extractTag(html, /<meta\s+name="description"\s+content="([\s\S]*?)"\s*\/?>/i);
      if (!description) {
        issues.push("Missing meta description");
      } else {
        if (descriptions.has(description)) {
          duplicateDescriptions.push(`${path} shares description: "${description.substring(0, 40)}..."`);
        }
        descriptions.add(description);
      }

      // 4. H1
      const h1 = extractTag(html, /<h1[\s\S]*?>([\s\S]*?)<\/h1>/i).replace(/<[^>]+>/g, "").trim();
      if (!h1) {
        issues.push("Missing <h1> tag in initial HTML");
      }

      // 5. Canonical
      const canonical = extractTag(html, /<link\s+rel="canonical"\s+href="([\s\S]*?)"\s*\/?>/i);
      if (!canonical) {
        issues.push("Missing canonical link");
      } else if (!canonical.startsWith("https://www.mehzandigital.com")) {
        issues.push(`Canonical is not www.mehzandigital.com: ${canonical}`);
      }

      // 6. Robots
      const robots = extractTag(html, /<meta\s+name="robots"\s+content="([\s\S]*?)"\s*\/?>/i);
      if (!robots) {
        issues.push("Missing robots meta tag");
      } else if (robots.includes("noindex")) {
        issues.push(`Indexable route has noindex: ${robots}`);
      }

      // 7. Initial Body HTML Content
      const bodyMatch = /<body[\s\S]*?>([\s\S]*?)<\/body>/i.exec(html);
      const bodyInner = bodyMatch ? bodyMatch[1] : html;
      const textContent = bodyInner.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      if (textContent.length < 100) {
        issues.push(`Very thin initial HTML body content: ${textContent.length} chars`);
      }

      // 8. Structured Data
      const hasJsonLd = html.includes('type="application/ld+json"');

      // 9. Internal Links Count
      const internalLinks = extractAll(html, /<a\s+[^>]*href="(\/[^"]*)"/gi);

      const result: RouteAuditResult = {
        path,
        statusCode: res.statusCode,
        title,
        description,
        h1,
        canonical,
        robots,
        bodyLength: textContent.length,
        hasJsonLd,
        internalLinkCount: internalLinks.length,
        issues,
      };

      results.push(result);

      if (issues.length === 0) {
        passedCount++;
      } else {
        failedCount++;
        console.log(`❌ ISSUE on ${path}: ${issues.join("; ")}`);
      }
    } catch (err: any) {
      failedCount++;
      console.log(`💥 ERROR fetching ${path}: ${err.message}`);
    }
  }

  // Also audit 301 Redirects and 404 Error handling
  console.log("\n-------------------------------------------------");
  console.log("🔄 AUDITING REDIRECTS & 404 HANDLING");
  console.log("-------------------------------------------------");

  const redirectTests = [
    { path: "/pdf-merge", expectedTarget: "/en/pdf-merge" },
    { path: "/tools/pdf-merge", expectedTarget: "/en/pdf-merge" },
    { path: "/?tool=jpg-to-pdf", expectedTarget: "/en/jpg-to-pdf" },
    { path: "/all-tools", expectedTarget: "/tools" },
    { path: "/privacy-policy", expectedTarget: "/privacy" },
  ];

  for (const test of redirectTests) {
    const res = await fetchRoute(test.path);
    if (res.statusCode === 301 && res.headers.location === test.expectedTarget) {
      console.log(`✅ 301 Redirect Passed: ${test.path} -> ${res.headers.location}`);
    } else {
      console.log(`❌ 301 Redirect Failed: ${test.path} got ${res.statusCode}, location: ${res.headers.location} (expected ${test.expectedTarget})`);
    }
  }

  const notFoundTests = ["/404", "/non-existent-tool-page-xyz", "/en/invalid-tool-slug-123"];
  for (const testPath of notFoundTests) {
    const res = await fetchRoute(testPath);
    if (res.statusCode === 404) {
      console.log(`✅ 404 Status Passed: ${testPath} returned HTTP 404`);
    } else {
      console.log(`❌ 404 Status Failed: ${testPath} returned HTTP ${res.statusCode} (Expected 404)`);
    }
  }

  console.log("\n=================================================");
  console.log("📊 AUDIT SUMMARY REPORT");
  console.log("=================================================");
  console.log(`Total Public Indexable Routes Verified: ${indexableRoutes.length}`);
  console.log(`Passed Routes (10/10 criteria): ${passedCount}`);
  console.log(`Failed Routes: ${failedCount}`);
  console.log(`Unique Titles: ${titles.size}`);
  console.log(`Duplicate Title Warnings: ${duplicateTitles.length}`);
  if (duplicateTitles.length > 0) {
    console.log("  " + duplicateTitles.slice(0, 5).join("\n  "));
  }
  console.log(`Unique Meta Descriptions: ${descriptions.size}`);
  console.log(`Duplicate Description Warnings: ${duplicateDescriptions.length}`);
  if (duplicateDescriptions.length > 0) {
    console.log("  " + duplicateDescriptions.slice(0, 5).join("\n  "));
  }
  console.log("=================================================\n");
}

runAudit();
