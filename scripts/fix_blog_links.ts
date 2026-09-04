import fs from "fs";
import path from "path";
import { TOOL_SLUG_ALIASES } from "../src/services/routerService.js";
import { BASE_CANONICAL_TOOLS } from "../src/services/toolRegistryService.js";
import { CATEGORIES_DATA } from "../src/data/categoriesData.js";

const blogFiles = [
  "src/data/blog/pdfArticles.ts",
  "src/data/blog/imageArticles.ts",
  "src/data/blog/calculatorArticles.ts",
  "src/data/blog/converterArticles.ts",
  "src/data/blog/trustpilotHostingerArticles.ts",
];

const validSlugs = new Set(BASE_CANONICAL_TOOLS.map((t) => t.slug));

function getCanonicalToolPath(rawSlug: string): string {
  const clean = rawSlug.replace(/^\/+/, "").toLowerCase();
  const canonical = TOOL_SLUG_ALIASES[clean] || clean;
  if (validSlugs.has(canonical)) {
    return `/en/${canonical}`;
  }
  const isCat = CATEGORIES_DATA.some((c) => c.slug === clean || c.id === clean);
  if (isCat) {
    return `/category/${clean}`;
  }
  return `/en/${canonical}`;
}

let totalReplacements = 0;

for (const fileRel of blogFiles) {
  const fullPath = path.join(process.cwd(), fileRel);
  if (!fs.existsSync(fullPath)) continue;

  let content = fs.readFileSync(fullPath, "utf-8");

  // Replace href="/slug" or href="/tools/slug" with href="/en/canonicalSlug"
  const hrefRegex = /href=["'](\/([a-z0-9-]+))["']/gi;

  let fileReplacements = 0;
  content = content.replace(hrefRegex, (match, fullHref, slug) => {
    // Skip blog, category, categories, tools, about, contact, etc.
    if (
      slug.startsWith("blog") ||
      slug.startsWith("category") ||
      slug === "categories" ||
      slug === "tools" ||
      slug === "about" ||
      slug === "contact" ||
      slug === "privacy" ||
      slug === "terms" ||
      slug === "disclaimer" ||
      slug === "cookie-policy" ||
      slug === "copyright" ||
      slug === "en"
    ) {
      return match;
    }

    const canonicalPath = getCanonicalToolPath(slug);
    fileReplacements++;
    return `href="${canonicalPath}"`;
  });

  if (fileReplacements > 0) {
    fs.writeFileSync(fullPath, content, "utf-8");
    console.log(`Updated ${fileRel}: ${fileReplacements} hrefs updated to canonical /en/... paths.`);
    totalReplacements += fileReplacements;
  }
}

console.log(`\nTotal href replacements across all blog files: ${totalReplacements}`);
