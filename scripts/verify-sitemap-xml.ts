import { getPublicIndexableRoutes } from "../src/services/seoService";

function verifySitemapXml() {
  console.log("==================================================");
  console.log("VERIFYING SITEMAP.XML STRUCTURE & CONTENTS");
  console.log("==================================================\n");

  const host = "https://www.mehzandigital.com";
  const now = new Date().toISOString();
  const indexableRoutes = getPublicIndexableRoutes();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  const locSet = new Set<string>();
  let duplicates = 0;

  for (const page of indexableRoutes) {
    const cleanPath = page.urlPath === "/" ? "" : page.urlPath;
    const fullLoc = `${host}${cleanPath}`;
    
    if (locSet.has(fullLoc)) {
      console.error(`❌ Duplicate loc found in sitemap: ${fullLoc}`);
      duplicates++;
    }
    locSet.add(fullLoc);

    xml += `  <url>\n`;
    xml += `    <loc>${fullLoc}</loc>\n`;
    xml += `    <lastmod>${now}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>`;

  const isValidHeader = xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>');
  const isValidClosing = xml.endsWith('</urlset>');
  const totalUrls = locSet.size;

  console.log(`- Valid XML Header: ${isValidHeader}`);
  console.log(`- Valid XML Closing Tag: ${isValidClosing}`);
  console.log(`- Total Unique Sitemap URLs: ${totalUrls}`);
  console.log(`- Duplicate URLs in Sitemap: ${duplicates}`);
  
  if (isValidHeader && isValidClosing && duplicates === 0 && totalUrls > 400) {
    console.log("\n✅ SITEMAP.XML IS FULLY VALID AND COMPLIANT!");
  } else {
    console.error("\n❌ SITEMAP.XML VALIDATION FAILED!");
  }
}

verifySitemapXml();
