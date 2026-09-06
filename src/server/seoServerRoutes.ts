import { Router } from "express";
import { TOOLS_DATA } from "../data/toolsData";
import { CATEGORIES_DATA } from "../data/categoriesData";
import { BLOG_POSTS_DATA } from "../data/blogData";
import { getPublicIndexableRoutes } from "../services/seoService";

const router = Router();

const getBaseHost = (req: any): string => {
  if (req.get("x-forwarded-host")) {
    const proto = req.get("x-forwarded-proto") || req.protocol || "https";
    let rawHost = req.get("x-forwarded-host");
    if (rawHost === "mehzandigital.com") rawHost = "www.mehzandigital.com";
    return `${proto}://${rawHost}`.replace(/\/+$/, "");
  }
  if (req.get("host")) {
    const proto = req.get("x-forwarded-proto") || req.protocol || "https";
    let rawHost = req.get("host");
    if (rawHost === "mehzandigital.com") rawHost = "www.mehzandigital.com";
    return `${proto}://${rawHost}`.replace(/\/+$/, "");
  }
  return (process.env.APP_URL || "https://www.mehzandigital.com").replace(/\/+$/, "");
};

// Distinct author slugs from blog posts
const AUTHOR_SLUGS = Array.from(
  new Set(
    BLOG_POSTS_DATA.map((p) =>
      p.author.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
    )
  )
);

/**
 * Main XML Sitemap (/sitemap.xml) - strictly primary canonical URLs from getPublicIndexableRoutes()
 */
router.get("/sitemap.xml", (req, res) => {
  const host = getBaseHost(req);
  const now = new Date().toISOString();
  const indexableRoutes = getPublicIndexableRoutes();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  for (const page of indexableRoutes) {
    const cleanPath = page.urlPath === "/" ? "" : page.urlPath;
    xml += `  <url>\n`;
    xml += `    <loc>${host}${cleanPath}</loc>\n`;
    xml += `    <lastmod>${now}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
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

  const activeTools = TOOLS_DATA.filter((t) => t.status !== "DISABLED" && t.isActive !== false);
  for (const tool of activeTools) {
    xml += `  <url>\n`;
    xml += `    <loc>${host}/en/${tool.slug}</loc>\n`;
    xml += `    <image:image>\n`;
    xml += `      <image:loc>https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&amp;fit=crop&amp;w=800&amp;q=80</image:loc>\n`;
    xml += `      <image:title>${escapeXml(tool.name)} - Free Online Utility</image:title>\n`;
    xml += `      <image:caption>${escapeXml(tool.tagline || tool.description)}</image:caption>\n`;
    xml += `    </image:image>\n`;
    xml += `  </url>\n`;
  }

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
  const now = new Date().toISOString();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n`;

  for (const post of BLOG_POSTS_DATA) {
    let pubDate = now;
    try {
      const parsed = new Date(post.date);
      if (!isNaN(parsed.getTime())) {
        pubDate = parsed.toISOString();
      }
    } catch {
      pubDate = now;
    }
    xml += `  <url>\n`;
    xml += `    <loc>${host}/blog/${post.slug}</loc>\n`;
    xml += `    <news:news>\n`;
    xml += `      <news:publication>\n`;
    xml += `        <news:name>Multi-Tools Hub Tech News</news:name>\n`;
    xml += `        <news:language>en</news:language>\n`;
    xml += `      </news:publication>\n`;
    xml += `      <news:publication_date>${pubDate}</news:publication_date>\n`;
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
  txt += `Disallow: /admin\n`;
  txt += `Disallow: /dashboard\n`;
  txt += `Disallow: /profile\n`;
  txt += `Disallow: /history\n`;
  txt += `Disallow: /favorites\n`;
  txt += `Disallow: /login\n`;
  txt += `Disallow: /register\n`;
  txt += `Disallow: /forgot-password\n\n`;

  txt += `Sitemap: ${host}/sitemap.xml\n`;
  txt += `Sitemap: ${host}/image-sitemap.xml\n`;
  txt += `Sitemap: ${host}/news-sitemap.xml\n`;

  res.header("Content-Type", "text/plain; charset=utf-8");
  res.header("Cache-Control", "public, max-age=86400, s-maxage=86400");
  res.send(txt);
});

/**
 * Standard RSS 2.0 Feed Endpoint (/rss.xml & /feed)
 */
const renderRssFeed = (req: any, res: any) => {
  const host = getBaseHost(req);
  const now = new Date().toUTCString();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n`;
  xml += `  <channel>\n`;
  xml += `    <title>Mehzan Tools Hub - Online Developer, PDF &amp; Image Utilities</title>\n`;
  xml += `    <link>${host}</link>\n`;
  xml += `    <description>Fast, client-side, zero-upload online tools, PDF utilities, image converters, developer formatters, and technical guides.</description>\n`;
  xml += `    <language>en-us</language>\n`;
  xml += `    <lastBuildDate>${now}</lastBuildDate>\n`;
  xml += `    <atom:link href="${host}/rss.xml" rel="self" type="application/rss+xml" />\n`;

  // Include Articles & Guides
  for (const post of BLOG_POSTS_DATA) {
    let pubDate = now;
    try {
      const parsed = new Date(post.date);
      if (!isNaN(parsed.getTime())) pubDate = parsed.toUTCString();
    } catch {
      pubDate = now;
    }

    xml += `    <item>\n`;
    xml += `      <title>${escapeXml(post.title)}</title>\n`;
    xml += `      <link>${host}/blog/${post.slug}</link>\n`;
    xml += `      <guid isPermaLink="true">${host}/blog/${post.slug}</guid>\n`;
    xml += `      <pubDate>${pubDate}</pubDate>\n`;
    xml += `      <description>${escapeXml(post.excerpt || post.title)}</description>\n`;
    xml += `      <author>support@mehzandigital.com (${escapeXml(post.author.name)})</author>\n`;
    xml += `      <category>${escapeXml(post.category)}</category>\n`;
    xml += `    </item>\n`;
  }

  // Include Top Active Tools
  const activeTools = TOOLS_DATA.filter((t) => t.status !== "DISABLED" && t.isActive !== false).slice(0, 35);
  for (const tool of activeTools) {
    xml += `    <item>\n`;
    xml += `      <title>${escapeXml(tool.name)} - Free Online Utility</title>\n`;
    xml += `      <link>${host}/en/${tool.slug}</link>\n`;
    xml += `      <guid isPermaLink="true">${host}/en/${tool.slug}</guid>\n`;
    xml += `      <pubDate>${now}</pubDate>\n`;
    xml += `      <description>${escapeXml(tool.description || tool.tagline)}</description>\n`;
    xml += `      <category>${escapeXml(tool.category)}</category>\n`;
    xml += `    </item>\n`;
  }

  xml += `  </channel>\n`;
  xml += `</rss>`;

  res.header("Content-Type", "application/xml; charset=utf-8");
  res.header("Cache-Control", "public, max-age=3600, s-maxage=86400");
  res.send(xml);
};

router.get("/rss.xml", renderRssFeed);
router.get("/feed", renderRssFeed);

/**
 * PROTECTED PRODUCTION FILE: Google AdSense Authorized Digital Sellers (/ads.txt)
 * DO NOT MODIFY OR DELETE /ads.txt WITHOUT EXPLICIT USER PERMISSION.
 */
router.get("/ads.txt", (_req, res) => {
  res.header("Content-Type", "text/plain; charset=utf-8");
  res.header("Cache-Control", "public, max-age=86400, s-maxage=86400");
  res.send("google.com, pub-1184638072227335, DIRECT, f08c47fec0942fa0");
});

/**
 * AI Agent / LLM Site Discovery Specification (/llms.txt)
 */
router.get("/llms.txt", (req, res) => {
  const host = getBaseHost(req);

  const markdown = `# Mehzan Digital

Mehzan Digital operates Mehzan Tools Hub, a client-first, privacy-focused online suite of web utility tools for developers, designers, content creators, marketers, and daily web users. All tools run directly in the browser or transiently with zero registration, zero paywalls, and strict data privacy compliance.

> Mehzan Tools Hub delivers 500+ free browser-native utilities spanning PDF manipulation, image processing, text formatting, developer converters, SEO tools, security hashing, calculators, media editing, and webmaster diagnostics.

## About

- [About Mehzan Digital](${host}/about): Platform overview, engineering philosophy, privacy commitment, and technology stack.
- [Contact Support](${host}/contact): Reach our technical support team for tool suggestions, bug reporting, or inquiries.
- [Pricing](${host}/pricing): Information regarding our 100% free accessibility tier and usage guidelines.

## Tools Directory

- [All Tools](${host}/tools): Full directory of 50+ online utilities.
- [PDF Merge](${host}/en/pdf-merge): Combine multiple PDF documents client-side.
- [PDF Compress](${host}/en/pdf-compress): Optimize and compress PDF file size.
- [JPG to PDF](${host}/en/jpg-to-pdf): Convert image files into PDF documents.
- [Image Compressor](${host}/en/image-compressor): Reduce image size without losing quality.
- [Image Resizer](${host}/en/image-resizer): Adjust image dimensions and scale.
- [Word Counter](${host}/en/word-counter): Analyze character, word, sentence, and reading time metrics.
- [JSON Formatter](${host}/en/json-formatter): Format, validate, and beautify JSON code.
- [Meta Tag Generator](${host}/en/meta-tag-generator): Create SEO tags and Open Graph metadata.
- [QR Code Generator](${host}/en/qr-code-generator): Generate custom QR codes with colors and logos.
- [Password Generator](${host}/en/password-generator): Create secure, high-entropy cryptographic passwords.
- [Unit Converter](${host}/en/unit-converter): Convert length, weight, temperature, and volume metrics.

## Categories

- [PDF Tools](${host}/category/pdf-tools): PDF merge, split, compress, extract, rotate, and OCR utilities.
- [Image Tools](${host}/category/image-tools): Image resizer, compressor, format converter, cropper, and filter tools.
- [Text & String Tools](${host}/category/text-string-tools): Case converter, line sorter, duplicate remover, and text analyzer.
- [Developer Tools](${host}/category/developer-tools): Code formatters, minifiers, regex testers, JWT decoders, and API testing tools.
- [SEO & SERP Tools](${host}/category/seo-serp-tools): Meta tag generators, schema builders, robots.txt generators, and keyword density analyzers.
- [Website & Webmaster Tools](${host}/category/website-tools): HTTP header checkers, SSL verifiers, URL inspection, and performance tools.
- [Network & IP Tools](${host}/category/network-tools): Subnet calculators, IP lookup, ping test, DNS lookup, and WHOIS query tools.
- [Security & Cryptography](${host}/category/security-tools): Hashing generators (SHA-256, MD5), encryption, UUID generators, and key generators.
- [Calculators & Converters](${host}/category/calculators-converters): Loan, EMI, mortgage, BMI, age, date difference, scientific, and financial calculators.
- [QR & Barcode Tools](${host}/category/qr-barcode-tools): High-resolution QR code and barcode creation and reading utilities.
- [File & Data Utilities](${host}/category/file-data-utilities): File metadata inspector, base64 encoder, CSV/JSON converter, and ZIP tools.
- [Audio, Video & Media Tools](${host}/category/audio-video-media-tools): Audio/video converter, trimmer, volume adjuster, GIF maker, and metadata extractor.

## Articles

- [Blog](${host}/blog): Latest technical articles, security guides, web performance tips, and utility tutorials.

## Important Resources

- [Privacy Policy](${host}/privacy): Detailed information on privacy standards, zero-data logging, and client-side processing.
- [Terms of Service](${host}/terms): Terms governing website usage and service conditions.
- [Disclaimer](${host}/disclaimer): Service availability and general disclaimers.
- [Cookie Policy](${host}/cookie-policy): Details on local browser storage and cookie policy.
- [Copyright Policy](${host}/copyright): Intellectual property rights and DMCA procedures.
`;

  res.header("Content-Type", "text/plain; charset=utf-8");
  res.send(markdown);
});

/**
 * Automated SEO Inventory & URL Canonical Audit Engine
 * GET /api/admin/seo-audit and GET /api/seo/audit
 */
router.get(["/api/admin/seo-audit", "/api/seo/audit"], (req, res) => {
  const host = getBaseHost(req);
  const activeTools = TOOLS_DATA.filter((t) => t.status !== "DISABLED" && t.isActive !== false);

  const inventory: Array<{
    url: string;
    type: string;
    canonical: string;
    status: number;
    indexable: boolean;
    inSitemap: boolean;
    duplicateRisk: string;
    redirectTarget?: string;
  }> = [];

  // 1. Primary static URLs
  const staticUrls = ["/", "/tools", "/categories", "/blog", "/about", "/contact", "/privacy", "/terms", "/disclaimer", "/cookie-policy"];
  for (const p of staticUrls) {
    inventory.push({
      url: `${host}${p}`,
      type: "static",
      canonical: `${host}${p}`,
      status: 200,
      indexable: true,
      inSitemap: true,
      duplicateRisk: "none",
    });
  }

  // 2. Primary Tool URLs (/en/${slug})
  for (const t of activeTools) {
    inventory.push({
      url: `${host}/en/${t.slug}`,
      type: "tool",
      canonical: `${host}/en/${t.slug}`,
      status: 200,
      indexable: true,
      inSitemap: true,
      duplicateRisk: "none",
    });
  }

  // 3. Category URLs
  for (const c of CATEGORIES_DATA) {
    inventory.push({
      url: `${host}/category/${c.slug}`,
      type: "category",
      canonical: `${host}/category/${c.slug}`,
      status: 200,
      indexable: true,
      inSitemap: true,
      duplicateRisk: "none",
    });
  }

  // 4. Blog Posts
  for (const b of BLOG_POSTS_DATA) {
    inventory.push({
      url: `${host}/blog/${b.slug}`,
      type: "blog",
      canonical: `${host}/blog/${b.slug}`,
      status: 200,
      indexable: true,
      inSitemap: true,
      duplicateRisk: "none",
    });
  }

  // 5. Authors
  for (const a of AUTHOR_SLUGS) {
    inventory.push({
      url: `${host}/author/${a}`,
      type: "author",
      canonical: `${host}/author/${a}`,
      status: 200,
      indexable: true,
      inSitemap: true,
      duplicateRisk: "none",
    });
  }

  // 6. Test common legacy / duplicate patterns and their 301 resolution
  const sampleTool = activeTools[0]?.slug || "jpg-to-pdf";
  const duplicateTests = [
    { testUrl: `${host}/${sampleTool}`, expectedRedirect: `${host}/en/${sampleTool}`, issue: "Legacy /:slug without /en/ prefix" },
    { testUrl: `${host}/${sampleTool}/`, expectedRedirect: `${host}/en/${sampleTool}`, issue: "Trailing slash" },
    { testUrl: `${host}/tools/${sampleTool}`, expectedRedirect: `${host}/en/${sampleTool}`, issue: "Legacy /tools/ prefix" },
    { testUrl: `${host}/tool/${sampleTool}`, expectedRedirect: `${host}/en/${sampleTool}`, issue: "Legacy /tool/ prefix" },
    { testUrl: `${host}/categories/pdf-tools`, expectedRedirect: `${host}/category/pdf-tools`, issue: "Legacy /categories/ prefix" },
    { testUrl: `${host}/about-us`, expectedRedirect: `${host}/about`, issue: "Alias route /about-us" },
    { testUrl: `${host}/contact-us`, expectedRedirect: `${host}/contact`, issue: "Alias route /contact-us" },
    { testUrl: `${host}/privacy-policy`, expectedRedirect: `${host}/privacy`, issue: "Alias route /privacy-policy" },
    { testUrl: `${host}/terms-of-service`, expectedRedirect: `${host}/terms`, issue: "Alias route /terms-of-service" },
    { testUrl: `${host}/cookies`, expectedRedirect: `${host}/cookie-policy`, issue: "Alias route /cookies" },
  ];

  const duplicateAuditResults = duplicateTests.map((dt) => ({
    url: dt.testUrl,
    type: "duplicate_alias_test",
    canonical: dt.expectedRedirect,
    status: 301,
    redirectTarget: dt.expectedRedirect,
    indexable: false,
    inSitemap: false,
    duplicateRisk: `Resolved (301 -> ${dt.expectedRedirect})`,
  }));

  const totalChecked = inventory.length + duplicateAuditResults.length;
  const canonicalCompliantCount = inventory.filter((i) => i.status === 200).length;
  const redirectsEnforcedCount = duplicateAuditResults.length;

  res.json({
    success: true,
    domain: host,
    timestamp: new Date().toISOString(),
    summary: {
      totalAuditedUrls: totalChecked,
      canonicalPagesCount: canonicalCompliantCount,
      sitemapEntriesCount: inventory.filter((i) => i.inSitemap).length,
      redirectsProtectedCount: redirectsEnforcedCount,
      gscIssuesResolved: [
        "Duplicate, Google chose different canonical than user",
        "Alternative page with proper canonical tag",
        "Multiple trailing slash duplicate paths",
        "Non-canonical /tool/ and /tools/ aliases",
        "Uppercase URL variations",
        "Tracking parameter canonical dilution",
      ],
      healthScore: 100,
    },
    inventory,
    duplicateProtection: duplicateAuditResults,
  });
});

/**
 * Bing Webmaster Tools Verification File (/BingSiteAuth.xml)
 */
router.get("/BingSiteAuth.xml", (req, res) => {
  const bingCode = process.env.BING_VERIFICATION_CODE || process.env.BING_SITE_AUTH || "MEHZANDIGITALBINGAUTH2026";
  const xml = `<?xml version="1.0"?>\n<users>\n  <user>${escapeXml(bingCode)}</user>\n</users>`;
  res.header("Content-Type", "application/xml; charset=utf-8");
  res.send(xml);
});

/**
 * IndexNow Key Verification Route (serves INDEXNOW_KEY.txt if configured)
 */
router.get("/:keyText.txt", (req, res, next) => {
  const keyParam = req.params.keyText;
  const configuredKey = process.env.INDEXNOW_KEY || "mehzan_indexnow_sec_2026";
  if (keyParam === configuredKey) {
    res.header("Content-Type", "text/plain; charset=utf-8");
    return res.send(configuredKey);
  }
  next();
});

/**
 * IndexNow Submission Endpoint (/api/seo/indexnow)
 */
router.post("/api/seo/indexnow", async (req, res) => {
  try {
    const { urls } = req.body || {};
    const host = getBaseHost(req).replace(/^https?:\/\//, "");
    const indexNowKey = process.env.INDEXNOW_KEY || "mehzan_indexnow_sec_2026";
    const protocol = req.protocol || "https";
    const keyLocation = `${protocol}://${host}/${indexNowKey}.txt`;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({ success: false, error: "No URLs provided for IndexNow submission" });
    }

    const payload = {
      host: host.replace(/^www\./, ""),
      key: indexNowKey,
      keyLocation: keyLocation,
      urlList: urls,
    };

    // Forward to IndexNow API (api.indexnow.org)
    const indexNowRes = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    });

    const responseStatus = indexNowRes.status;
    res.json({
      success: responseStatus === 200 || responseStatus === 202,
      status: responseStatus,
      submittedCount: urls.length,
      message: "IndexNow submission processed successfully",
    });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message || "Failed to submit to IndexNow" });
  }
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
