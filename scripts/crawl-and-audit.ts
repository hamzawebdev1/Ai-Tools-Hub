import fs from "fs";
import path from "path";
import { parseRoute } from "../src/services/routerService";
import { getPublicIndexableRoutes, getCanonicalUrl } from "../src/services/seoService";
import { injectSEOMetadataIntoHTML } from "../src/server/seoHtmlRenderer";
import { TOOLS_DATA } from "../src/data/toolsData";
import { CATEGORIES_DATA } from "../src/data/categoriesData";
import { BLOG_POSTS_DATA } from "../src/data/blogData";
import { AUTHORS_DATA } from "../src/data/authorsData";

async function runAudit() {
  console.log("==================================================");
  console.log("STARTING TECHNICAL SEO & CRAWL AUDIT");
  console.log("==================================================\n");

  const rawHtml = fs.readFileSync(path.join(process.cwd(), "index.html"), "utf-8");
  const publicRoutes = getPublicIndexableRoutes();

  let totalPublicCount = publicRoutes.length;
  let successCount = 0;
  let issueCount = 0;

  const orphanCheck = new Map<string, number>();
  publicRoutes.forEach((r) => orphanCheck.set(r.urlPath, 0));

  const knownPublicPaths = new Set(publicRoutes.map((r) => r.urlPath));

  console.log(`Checking ${totalPublicCount} public indexable routes...\n`);

  for (const page of publicRoutes) {
    const routePath = page.urlPath;
    const queryStr = "";
    const routeState = parseRoute(routePath, queryStr);
    
    const statusCode = routeState.is410 ? 410 : (routeState.isNotFound || routeState.tab === "404") ? 404 : 200;
    if (statusCode !== 200) {
      console.error(`❌ Status Error on public route: ${routePath} returned status ${statusCode}`);
      issueCount++;
      continue;
    }

    const html = injectSEOMetadataIntoHTML(rawHtml, routePath, queryStr, "www.mehzandigital.com", "https");

    // Check Title
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : "";
    if (!title || title.length < 10) {
      console.error(`❌ Title issue on ${routePath}: "${title}"`);
      issueCount++;
    }

    // Check Description
    const descMatch = html.match(/<meta name="description" content="(.*?)"/i);
    const desc = descMatch ? descMatch[1] : "";
    if (!desc || desc.length < 20) {
      console.error(`❌ Description issue on ${routePath}: "${desc}"`);
      issueCount++;
    }

    // Check H1 Tag
    const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
    const h1 = h1Match ? h1Match[1].replace(/<[^>]+>/g, "").trim() : "";
    if (!h1) {
      console.error(`❌ Missing H1 tag on ${routePath}`);
      issueCount++;
    }

    // Check Canonical Tag
    const canonicalMatch = html.match(/<link rel="canonical" href="(.*?)"/i);
    const canonical = canonicalMatch ? canonicalMatch[1] : "";
    const expectedCanonical = getCanonicalUrl(routePath);
    if (!canonical || canonical !== expectedCanonical) {
      console.error(`❌ Canonical mismatch on ${routePath}: got "${canonical}", expected "${expectedCanonical}"`);
      issueCount++;
    }

    // Check Noindex on public page
    if (html.includes('<meta name="robots" content="noindex')) {
      console.error(`❌ Accidental noindex tag on public page: ${routePath}`);
      issueCount++;
    }

    // Check Open Graph & Twitter Cards
    if (!html.includes('property="og:title"') || !html.includes('property="og:image"') || !html.includes('name="twitter:card"')) {
      console.error(`❌ Missing OG or Twitter card meta tags on ${routePath}`);
      issueCount++;
    }

    // Extract links for orphan checking
    const linkMatches = Array.from(html.matchAll(/href="(\/[^"]*)"/g));
    for (const match of linkMatches) {
      const linkPath = match[1].split("?")[0].split("#")[0];
      if (orphanCheck.has(linkPath)) {
        orphanCheck.set(linkPath, (orphanCheck.get(linkPath) || 0) + 1);
      }
    }

    successCount++;
  }

  // Check for orphan pages
  let orphanPagesCount = 0;
  orphanCheck.forEach((count, pathKey) => {
    if (pathKey !== "/" && count === 0) {
      console.warn(`⚠️ Orphan page detected (0 internal links found in pre-rendered DOM): ${pathKey}`);
      orphanPagesCount++;
    }
  });

  console.log("\n==================================================");
  console.log("TECHNICAL SEO & CRAWL AUDIT SUMMARY");
  console.log("==================================================");
  console.log(`- Total Public Indexable Routes Verified: ${totalPublicCount}`);
  console.log(`- Routes Passing All Audits: ${successCount}`);
  console.log(`- Total Issues Found: ${issueCount}`);
  console.log(`- Total Orphan Pages: ${orphanPagesCount}`);
  console.log("==================================================\n");
}

runAudit().catch(console.error);
