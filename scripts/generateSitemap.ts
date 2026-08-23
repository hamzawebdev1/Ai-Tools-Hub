import fs from "fs";
import path from "path";
import { TOOLS_DATA } from "../src/data/toolsData";
import { CATEGORIES_DATA } from "../src/data/categoriesData";
import { BLOG_POSTS_DATA } from "../src/data/blogData";

const DOMAIN = process.env.APP_URL || "https://mehzandigital.com";

function isValidUrl(urlString: string): boolean {
  try {
    const parsed = new URL(urlString);
    return Boolean(parsed.protocol && parsed.host);
  } catch (e) {
    return false;
  }
}

function generateSitemapXml() {
  const now = new Date().toISOString();

  if (!DOMAIN || !isValidUrl(DOMAIN)) {
    console.warn(`[Sitemap Warning] Base domain APP_URL (${DOMAIN}) is missing or malformed.`);
  }

  const staticPages = [
    { url: "", priority: "1.0", changefreq: "daily" },
    { url: "/tools", priority: "0.9", changefreq: "daily" },
    { url: "/categories", priority: "0.8", changefreq: "weekly" },
    { url: "/blog", priority: "0.8", changefreq: "daily" },
    { url: "/about", priority: "0.5", changefreq: "monthly" },
    { url: "/pricing", priority: "0.7", changefreq: "weekly" },
    { url: "/contact", priority: "0.5", changefreq: "monthly" },
    { url: "/privacy", priority: "0.3", changefreq: "yearly" },
    { url: "/terms", priority: "0.3", changefreq: "yearly" },
    { url: "/disclaimer", priority: "0.3", changefreq: "yearly" },
    { url: "/cookie-policy", priority: "0.3", changefreq: "yearly" },
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Static pages
  for (const page of staticPages) {
    const canonical = `${DOMAIN}${page.url}`;
    if (!isValidUrl(canonical)) {
      console.warn(`[Sitemap Warning] Malformed static canonical URL: ${canonical}`);
    }
    xml += `  <url>\n`;
    xml += `    <loc>${canonical}</loc>\n`;
    xml += `    <lastmod>${now}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += `  </url>\n`;
  }

  // Tools Data (Active tools only)
  const activeTools = TOOLS_DATA.filter((t) => t.status !== "DISABLED" && t.isActive !== false);
  console.log(`Parsing ${activeTools.length} active tools for sitemap...`);
  for (const tool of activeTools) {
    if (!tool.slug || typeof tool.slug !== "string" || tool.slug.trim() === "") {
      console.warn(`[Sitemap Warning] Tool missing or invalid slug:`, tool);
      continue;
    }
    const canonical = `${DOMAIN}/${tool.slug.trim()}`;
    if (!isValidUrl(canonical)) {
      console.warn(`[Sitemap Warning] Malformed tool canonical URL: ${canonical}`);
    }
    xml += `  <url>\n`;
    xml += `    <loc>${canonical}</loc>\n`;
    xml += `    <lastmod>${now}</lastmod>\n`;
    xml += `    <changefreq>daily</changefreq>\n`;
    xml += `    <priority>0.9</priority>\n`;
    xml += `  </url>\n`;
  }

  // Categories Data
  console.log(`Parsing ${CATEGORIES_DATA.length} categories for sitemap...`);
  for (const cat of CATEGORIES_DATA) {
    if (!cat.slug || typeof cat.slug !== "string" || cat.slug.trim() === "") {
      console.warn(`[Sitemap Warning] Category missing or invalid slug:`, cat);
      continue;
    }
    const canonical = `${DOMAIN}/category/${cat.slug.trim()}`;
    if (!isValidUrl(canonical)) {
      console.warn(`[Sitemap Warning] Malformed category canonical URL: ${canonical}`);
    }
    xml += `  <url>\n`;
    xml += `    <loc>${canonical}</loc>\n`;
    xml += `    <lastmod>${now}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
  }

  // Blog Posts Data
  console.log(`Parsing ${BLOG_POSTS_DATA.length} blog posts for sitemap...`);
  for (const post of BLOG_POSTS_DATA) {
    if (!post.slug || typeof post.slug !== "string" || post.slug.trim() === "") {
      console.warn(`[Sitemap Warning] Blog post missing or invalid slug:`, post);
      continue;
    }
    const canonical = `${DOMAIN}/blog/${post.slug.trim()}`;
    if (!isValidUrl(canonical)) {
      console.warn(`[Sitemap Warning] Malformed blog post canonical URL: ${canonical}`);
    }
    const postDate = post.date ? new Date(post.date).toISOString() : now;
    xml += `  <url>\n`;
    xml += `    <loc>${canonical}</loc>\n`;
    xml += `    <lastmod>${postDate}</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
  }

  // Authors Data
  const authorSlugs = Array.from(
    new Set(
      BLOG_POSTS_DATA.map((p) =>
        p.author.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      )
    )
  );
  for (const authorSlug of authorSlugs) {
    const canonical = `${DOMAIN}/author/${authorSlug}`;
    xml += `  <url>\n`;
    xml += `    <loc>${canonical}</loc>\n`;
    xml += `    <lastmod>${now}</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>0.6</priority>\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>`;

  const publicDir = path.join(process.cwd(), "public");
  const distDir = path.join(process.cwd(), "dist");

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(path.join(publicDir, "sitemap.xml"), xml, "utf-8");
  console.log(`Successfully generated public/sitemap.xml with ${staticPages.length + activeTools.length + CATEGORIES_DATA.length + BLOG_POSTS_DATA.length + authorSlugs.length} total canonical URLs.`);

  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, "sitemap.xml"), xml, "utf-8");
    console.log(`Successfully generated dist/sitemap.xml.`);
  }
}

generateSitemapXml();
