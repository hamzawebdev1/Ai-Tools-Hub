import { Router } from "express";
import { getAllBlogPosts } from "./admin/cmsStore.js";

const router = Router();

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

router.get("/rss.xml", async (req, res) => {
  try {
    const allPosts = await getAllBlogPosts();
    const publishedPosts = allPosts.filter(p => p.status === "published");
    const baseUrl = "https://www.mehzandigital.com";

    const items = publishedPosts.map(post => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${baseUrl}/en/blog/${post.slug}</link>
      <description>${escapeXml(post.excerpt)}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <author>${escapeXml(post.author.name)}</author>
      <category>${escapeXml(post.category)}</category>
      <guid>${baseUrl}/en/blog/${post.slug}</guid>
    </item>`).join("");

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Mehzan Digital RSS Feed</title>
    <link>${baseUrl}</link>
    <description>Latest articles and tools update from Mehzan Digital</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

    res.header("Content-Type", "application/rss+xml; charset=utf-8");
    res.send(rss);
  } catch (error) {
    console.error("RSS Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
