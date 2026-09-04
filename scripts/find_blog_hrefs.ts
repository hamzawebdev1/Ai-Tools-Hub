import { BLOG_POSTS_DATA } from "../src/data/blogData.js";

const hrefRegex = /href=["']([^"']+)["']/g;

console.log("=== EXAMINING BLOG POST INTERNAL LINKS ===");

for (const post of BLOG_POSTS_DATA) {
  let match;
  const hrefs: string[] = [];
  while ((match = hrefRegex.exec(post.content)) !== null) {
    hrefs.push(match[1]);
  }
  if (hrefs.length > 0) {
    console.log(`Blog: ${post.slug}`);
    console.log(`  Hrefs:`, hrefs);
  } else {
    console.log(`Blog: ${post.slug} HAS NO IN-CONTENT LINKS!`);
  }
}
