import { Router } from "express";
import { TOOLS_DATA } from "../data/toolsData";
import { CATEGORIES_DATA } from "../data/categoriesData";
import { BLOG_POSTS_DATA } from "../data/blogData";

const router = Router();

const getBaseHost = (req: any): string => {
  if (req.get("x-forwarded-host")) {
    const proto = req.get("x-forwarded-proto") || req.protocol || "https";
    return `${proto}://${req.get("x-forwarded-host")}`;
  }
  if (req.get("host")) {
    return `${req.protocol}://${req.get("host")}`;
  }
  return process.env.APP_URL || "";
};

/**
 * Main XML Sitemap (/sitemap.xml)
 */
router.get("/sitemap.xml", (req, res) => {
  const host = getBaseHost(req);
  const now = new Date().toISOString();

  // Core static pages
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

  // 1. Add static pages
  for (const page of staticPages) {
    xml += `  <url>\n`;
    xml += `    <loc>${host}${page.url}</loc>\n`;
    xml += `    <lastmod>${now}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += `  </url>\n`;
  }

  // 2. Add Direct Clean Tool URLs (e.g. /jpg-to-pdf, /pdf-merge)
  for (const tool of TOOLS_DATA) {
    xml += `  <url>\n`;
    xml += `    <loc>${host}/${tool.slug}</loc>\n`;
    xml += `    <lastmod>${now}</lastmod>\n`;
    xml += `    <changefreq>daily</changefreq>\n`;
    xml += `    <priority>0.9</priority>\n`;
    xml += `  </url>\n`;
  }

  // 3. Add Category pages (/category/:slug)
  for (const cat of CATEGORIES_DATA) {
    xml += `  <url>\n`;
    xml += `    <loc>${host}/category/${cat.slug}</loc>\n`;
    xml += `    <lastmod>${now}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
  }

  // 4. Add Blog posts (/blog/:slug)
  for (const post of BLOG_POSTS_DATA) {
    xml += `  <url>\n`;
    xml += `    <loc>${host}/blog/${post.slug}</loc>\n`;
    xml += `    <lastmod>${new Date(post.date).toISOString()}</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>`;

  res.header("Content-Type", "application/xml; charset=utf-8");
  res.send(xml);
});

/**
 * Image XML Sitemap (/image-sitemap.xml)
 */
router.get("/image-sitemap.xml", (req, res) => {
  const host = getBaseHost(req);

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

  // Add tool images
  for (const tool of TOOLS_DATA) {
    xml += `  <url>\n`;
    xml += `    <loc>${host}/${tool.slug}</loc>\n`;
    xml += `    <image:image>\n`;
    xml += `      <image:loc>https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&amp;fit=crop&amp;w=800&amp;q=80</image:loc>\n`;
    xml += `      <image:title>${escapeXml(tool.name)} - Online Tool</image:title>\n`;
    xml += `      <image:caption>${escapeXml(tool.tagline || tool.description)}</image:caption>\n`;
    xml += `    </image:image>\n`;
    xml += `  </url>\n`;
  }

  // Add blog images
  for (const post of BLOG_POSTS_DATA) {
    xml += `  <url>\n`;
    xml += `    <loc>${host}/blog/${post.slug}</loc>\n`;
    xml += `    <image:image>\n`;
    xml += `      <image:loc>${escapeXml(post.image)}</image:loc>\n`;
    xml += `      <image:title>${escapeXml(post.title)}</image:title>\n`;
    xml += `      <image:caption>${escapeXml(post.excerpt)}</image:caption>\n`;
    xml += `    </image:image>\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>`;

  res.header("Content-Type", "application/xml; charset=utf-8");
  res.send(xml);
});

/**
 * Google News XML Sitemap (/news-sitemap.xml)
 */
router.get("/news-sitemap.xml", (req, res) => {
  const host = getBaseHost(req);

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n`;

  for (const post of BLOG_POSTS_DATA) {
    xml += `  <url>\n`;
    xml += `    <loc>${host}/blog/${post.slug}</loc>\n`;
    xml += `    <news:news>\n`;
    xml += `      <news:publication>\n`;
    xml += `        <news:name>Mehzan Digital Tech News</news:name>\n`;
    xml += `        <news:language>en</news:language>\n`;
    xml += `      </news:publication>\n`;
    xml += `      <news:publication_date>${new Date(post.date).toISOString()}</news:publication_date>\n`;
    xml += `      <news:title>${escapeXml(post.title)}</news:title>\n`;
    xml += `    </news:news>\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>`;

  res.header("Content-Type", "application/xml; charset=utf-8");
  res.send(xml);
});

/**
 * SEO Robots File (/robots.txt)
 */
router.get("/robots.txt", (req, res) => {
  const host = getBaseHost(req);

  let txt = `User-agent: *\n`;
  txt += `Allow: /\n`;
  txt += `Disallow: /api/\n`;
  txt += `Disallow: /search\n`;
  txt += `Disallow: /profile\n`;
  txt += `Disallow: /dashboard\n`;
  txt += `Disallow: /history\n`;
  txt += `Disallow: /favorites\n\n`;

  txt += `# Googlebot & Bingbot specific settings\n`;
  txt += `User-agent: Googlebot\n`;
  txt += `Allow: /\n`;
  txt += `Crawl-delay: 1\n\n`;

  txt += `# Sitemap XML References\n`;
  txt += `Sitemap: ${host}/sitemap.xml\n`;
  txt += `Sitemap: ${host}/image-sitemap.xml\n`;
  txt += `Sitemap: ${host}/news-sitemap.xml\n`;

  res.header("Content-Type", "text/plain; charset=utf-8");
  res.send(txt);
});

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export default router;
