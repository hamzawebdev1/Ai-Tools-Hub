import fs from "fs";
import path from "path";
import { getPublicIndexableRoutes } from "../src/services/seoService";

const DOMAIN = (process.env.PRODUCTION_DOMAIN || "https://www.mehzandigital.com").replace(/\/+$/, "");

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
    console.warn(`[Sitemap Warning] Base domain (${DOMAIN}) is missing or malformed.`);
  }

  const indexableRoutes = getPublicIndexableRoutes();
  console.log(`Generating sitemap for ${indexableRoutes.length} PUBLIC_INDEXABLE routes...`);

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  for (const page of indexableRoutes) {
    const cleanPath = page.urlPath === "/" ? "" : page.urlPath;
    const canonical = `${DOMAIN}${cleanPath}`;
    if (!isValidUrl(canonical)) {
      console.warn(`[Sitemap Warning] Malformed canonical URL: ${canonical}`);
    }
    xml += `  <url>\n`;
    xml += `    <loc>${canonical}</loc>\n`;
    xml += `    <lastmod>${now}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>`;

  const publicDir = path.join(process.cwd(), "public");
  const distDir = path.join(process.cwd(), "dist");

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(path.join(publicDir, "sitemap.xml"), xml, "utf-8");
  console.log(`Successfully generated public/sitemap.xml with ${indexableRoutes.length} total canonical URLs.`);

  // Ensure protected ads.txt exists in public & dist
  const adsTxtContent = "google.com, pub-1184638072227335, DIRECT, f08c47fec0942fa0\n";
  const publicAdsPath = path.join(publicDir, "ads.txt");
  fs.writeFileSync(publicAdsPath, adsTxtContent, "utf-8");

  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, "sitemap.xml"), xml, "utf-8");
    fs.writeFileSync(path.join(distDir, "ads.txt"), adsTxtContent, "utf-8");
    console.log(`Successfully generated dist/sitemap.xml and verified dist/ads.txt.`);
  }
}

generateSitemapXml();
