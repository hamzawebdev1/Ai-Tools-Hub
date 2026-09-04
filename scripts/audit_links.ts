import fs from "fs";
import path from "path";
import { TOOL_SLUG_ALIASES, STATIC_ROUTE_ALIASES } from "../src/services/routerService";
import { TOOLS_DATA } from "../src/data/toolsData";
import { CATEGORIES_DATA } from "../src/data/categoriesData";
import { BLOG_POSTS_DATA } from "../src/data/blogData";

const toolSlugs = new Set(TOOLS_DATA.map((t) => t.slug));
const catSlugs = new Set(CATEGORIES_DATA.map((c) => c.slug));
const blogSlugs = new Set(BLOG_POSTS_DATA.map((p) => p.slug));

function getAllFiles(dir: string): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (!file.includes("node_modules") && !file.includes(".git") && !file.includes("dist")) {
        results = results.concat(getAllFiles(fullPath));
      }
    } else if (file.endsWith(".ts") || file.endsWith(".tsx")) {
      results.push(fullPath);
    }
  });
  return results;
}

const files = getAllFiles("./src");
console.log(`Scanning ${files.length} TypeScript files for internal link issues...`);

const linkRegex = /["']\/(en\/[a-z0-9-]+|category\/[a-z0-9-]+|blog\/[a-z0-9-]+|[a-z0-9-]+)["']/g;

const aliasedLinks: Array<{ file: string; match: string; replacement: string }> = [];
const deadLinks: Array<{ file: string; match: string }> = [];

files.forEach((filePath) => {
  const content = fs.readFileSync(filePath, "utf8");
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    const rawUrl = match[1];
    if (rawUrl.startsWith("en/")) {
      const slug = rawUrl.replace("en/", "");
      if (TOOL_SLUG_ALIASES[slug]) {
        aliasedLinks.push({ file: filePath, match: match[0], replacement: `"/en/${TOOL_SLUG_ALIASES[slug]}"` });
      } else if (!toolSlugs.has(slug)) {
        deadLinks.push({ file: filePath, match: match[0] });
      }
    } else if (rawUrl.startsWith("category/")) {
      const slug = rawUrl.replace("category/", "");
      if (!catSlugs.has(slug)) {
        deadLinks.push({ file: filePath, match: match[0] });
      }
    } else if (rawUrl.startsWith("blog/")) {
      const slug = rawUrl.replace("blog/", "");
      if (!blogSlugs.has(slug)) {
        deadLinks.push({ file: filePath, match: match[0] });
      }
    } else if (STATIC_ROUTE_ALIASES[rawUrl]) {
      aliasedLinks.push({ file: filePath, match: match[0], replacement: `"/${STATIC_ROUTE_ALIASES[rawUrl]}"` });
    }
  }
});

console.log("=== ALIASED INTERNAL LINKS FOUND ===");
aliasedLinks.forEach((item) => console.log(`${item.file}: ${item.match} -> ${item.replacement}`));

console.log("=== DEAD INTERNAL LINKS FOUND ===");
deadLinks.forEach((item) => console.log(`${item.file}: ${item.match}`));
