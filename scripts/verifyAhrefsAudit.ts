import fs from "fs";
import path from "path";
import { TOOLS_DATA } from "../src/data/toolsData";
import { CATEGORIES_DATA } from "../src/data/categoriesData";
import { BLOG_POSTS_DATA } from "../src/data/blogData";
import { injectSEOMetadataIntoHTML } from "../src/server/seoHtmlRenderer";

console.log("=== STARTING AHREFS SITE AUDIT VERIFICATION ===");

let totalErrors = 0;
let totalPassed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    totalPassed++;
  } else {
    totalErrors++;
    console.error(`❌ FAIL: ${message}`);
  }
}

// 1. Check Sitemap file existence & structure
const sitemapPath = path.join(process.cwd(), "public", "sitemap.xml");
assert(fs.existsSync(sitemapPath), "public/sitemap.xml exists");

const sitemapContent = fs.readFileSync(sitemapPath, "utf-8");
assert(sitemapContent.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'), "Sitemap has correct XML namespace");
assert(!sitemapContent.includes("/pricing"), "Sitemap excludes noindex /pricing URL");

// Check active tools in sitemap
const activeTools = TOOLS_DATA.filter((t) => t.status !== "DISABLED" && t.isActive !== false);
console.log(`Auditing ${activeTools.length} active tools for Ahrefs compliance...`);

let missingFromSitemap = 0;
let missingH1Count = 0;
let lowWordCount = 0;
let missingOgCount = 0;
let missingTwitterCount = 0;
let missingCanonicalCount = 0;
let noOutgoingLinksCount = 0;

// Read index.html template
const templateHtml = fs.existsSync(path.join(process.cwd(), "dist", "index.html"))
  ? fs.readFileSync(path.join(process.cwd(), "dist", "index.html"), "utf-8")
  : `<html lang="en"><head></head><body><div id="root"></div></body></html>`;

for (const tool of activeTools) {
  const toolUrl = `https://www.mehzandigital.com/en/${tool.slug}`;

  // Check 1: In Sitemap
  if (!sitemapContent.includes(`<loc>${toolUrl}</loc>`)) {
    missingFromSitemap++;
  }

  // Check 2: SSR HTML rendering
  const renderedHtml = injectSEOMetadataIntoHTML(templateHtml, `/en/${tool.slug}`, "", "www.mehzandigital.com", "https");

  // H1 Check
  const h1Match = renderedHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (!h1Match || !h1Match[1].trim()) {
    missingH1Count++;
  }

  // Word count check
  const textOnly = renderedHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const wordCount = textOnly.split(" ").filter(Boolean).length;
  if (wordCount < 200) {
    lowWordCount++;
  }

  // OG Tags check
  const hasOgTitle = renderedHtml.includes('<meta property="og:title"');
  const hasOgDesc = renderedHtml.includes('<meta property="og:description"');
  const hasOgUrl = renderedHtml.includes('<meta property="og:url"');
  const hasOgType = renderedHtml.includes('<meta property="og:type"');
  const hasOgSiteName = renderedHtml.includes('<meta property="og:site_name"');
  if (!hasOgTitle || !hasOgDesc || !hasOgUrl || !hasOgType || !hasOgSiteName) {
    missingOgCount++;
  }

  // Twitter Tags check
  const hasTwitterCard = renderedHtml.includes('<meta name="twitter:card"');
  const hasTwitterTitle = renderedHtml.includes('<meta name="twitter:title"');
  const hasTwitterDesc = renderedHtml.includes('<meta name="twitter:description"');
  if (!hasTwitterCard || !hasTwitterTitle || !hasTwitterDesc) {
    missingTwitterCount++;
  }

  // Canonical check
  const hasCanonical = renderedHtml.includes(`<link rel="canonical" href="${toolUrl}"`);
  if (!hasCanonical) {
    missingCanonicalCount++;
  }

  // Outgoing internal links check
  const hasInternalLinks = renderedHtml.includes('href="/category/') || renderedHtml.includes('href="/en/') || renderedHtml.includes('href="/tools"');
  if (!hasInternalLinks) {
    noOutgoingLinksCount++;
  }
}

assert(missingFromSitemap === 0, `All ${activeTools.length} tools present in sitemap (Missing: ${missingFromSitemap})`);
assert(missingH1Count === 0, `All tools have a valid H1 tag (Missing: ${missingH1Count})`);
assert(lowWordCount === 0, `All tools meet word count requirements (Low word count: ${lowWordCount})`);
assert(missingOgCount === 0, `All tools have complete Open Graph tags (Missing: ${missingOgCount})`);
assert(missingTwitterCount === 0, `All tools have complete Twitter Card tags (Missing: ${missingTwitterCount})`);
assert(missingCanonicalCount === 0, `All tools have exact self-referencing canonical tags (Missing: ${missingCanonicalCount})`);
assert(noOutgoingLinksCount === 0, `All tools have outgoing internal links (No links: ${noOutgoingLinksCount})`);

console.log("\n================ SUMMARY ================");
console.log(`Passed checks: ${totalPassed}`);
console.log(`Failed checks: ${totalErrors}`);

if (totalErrors === 0) {
  console.log("SUCCESS: All Ahrefs Site Audit requirements verified successfully!");
} else {
  console.error("FAILURE: Some requirements failed verification.");
  process.exit(1);
}
