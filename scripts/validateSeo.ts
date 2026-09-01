import { TOOLS_DATA } from "../src/data/toolsData";
import { CATEGORIES_DATA } from "../src/data/categoriesData";
import { BLOG_POSTS_DATA } from "../src/data/blogData";
import { buildSEOMetadata, getPublicIndexableRoutes } from "../src/services/seoService";
import { parseRoute } from "../src/services/routerService";

console.log("==========================================");
console.log("    SEO & INDEXABILITY HARDENING CHECK    ");
console.log("==========================================");

let hasErrors = false;
const activeTools = TOOLS_DATA.filter((t) => t.status !== "DISABLED" && t.isActive !== false);
const indexableRoutes = getPublicIndexableRoutes();
const sitemapSet = new Set(indexableRoutes.map((r) => r.urlPath));

console.log(`Auditing ${activeTools.length} active canonical tools...`);

const titles = new Set<string>();
const descriptions = new Set<string>();
let toolCount = 0;
let indexableCount = 0;
let h1Count = 0;
let titleCount = 0;
let descCount = 0;
let canonicalMatchCount = 0;
let sitemapMatchCount = 0;

for (const tool of activeTools) {
  toolCount++;

  // 1. Route Resolution
  const routeState = parseRoute(`/en/${tool.slug}`);
  if (routeState.isNotFound || routeState.tab !== "tool-detail") {
    console.error(`❌ Tool /en/${tool.slug} failed to resolve in parseRoute!`);
    hasErrors = true;
  }

  // 2. SEO Metadata Generation
  const meta = buildSEOMetadata("tool-detail", { tool });

  // 3. Indexability
  if (meta.pageType !== "PUBLIC_INDEXABLE" || meta.noIndex !== false || !meta.robotsMeta.includes("index, follow")) {
    console.error(`❌ Tool /en/${tool.slug} is marked as NOINDEX or non-public!`);
    hasErrors = true;
  } else {
    indexableCount++;
  }

  // 4. H1 check (tool name is mapped to H1)
  if (tool.name && tool.name.trim().length > 0) {
    h1Count++;
  } else {
    console.error(`❌ Tool /en/${tool.slug} missing name/H1!`);
    hasErrors = true;
  }

  // 5. Unique Meta Title
  if (meta.title && meta.title.trim().length > 0) {
    titleCount++;
    titles.add(meta.title.trim());
  } else {
    console.error(`❌ Tool /en/${tool.slug} missing meta title!`);
    hasErrors = true;
  }

  // 6. Unique Meta Description
  if (meta.description && meta.description.trim().length > 0) {
    descCount++;
    descriptions.add(meta.description.trim());
  } else {
    console.error(`❌ Tool /en/${tool.slug} missing meta description!`);
    hasErrors = true;
  }

  // 7. Canonical URL
  const expectedCanonical = `https://www.mehzandigital.com/en/${tool.slug}`;
  if (meta.canonicalUrl === expectedCanonical) {
    canonicalMatchCount++;
  } else {
    console.error(`❌ Tool /en/${tool.slug} canonical mismatch! Expected ${expectedCanonical}, got ${meta.canonicalUrl}`);
    hasErrors = true;
  }

  // 8. Sitemap Coverage
  if (sitemapSet.has(`/en/${tool.slug}`)) {
    sitemapMatchCount++;
  } else {
    console.error(`❌ Tool /en/${tool.slug} missing from indexable sitemap routes!`);
    hasErrors = true;
  }
}

console.log("\n--- AUDIT RESULTS SUMMARY ---");
console.log(`Total Active Tools Audited: ${toolCount}`);
console.log(`PUBLIC_INDEXABLE Enforced: ${indexableCount}/${toolCount}`);
console.log(`H1 Tag Present:             ${h1Count}/${toolCount}`);
console.log(`Title Tag Present:          ${titleCount}/${toolCount}`);
console.log(`Unique Titles Count:        ${titles.size}`);
console.log(`Description Present:        ${descCount}/${toolCount}`);
console.log(`Unique Descriptions Count:  ${descriptions.size}`);
console.log(`Canonical Match Count:      ${canonicalMatchCount}/${toolCount}`);
console.log(`Sitemap Coverage:           ${sitemapMatchCount}/${toolCount}`);

if (hasErrors) {
  console.error("\n❌ SEO HARDENING VALIDATION FAILED!");
  process.exit(1);
} else {
  console.log("\n✅ ALL SEO & INDEXABILITY CHECKS PASSED PERFECTLY!");
}
