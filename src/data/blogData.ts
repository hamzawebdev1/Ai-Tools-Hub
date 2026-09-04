import { BlogPost } from "../types";
import { PDF_ARTICLES } from "./blog/pdfArticles";
import { IMAGE_ARTICLES } from "./blog/imageArticles";
import { CALCULATOR_ARTICLES } from "./blog/calculatorArticles";
import { CONVERTER_ARTICLES } from "./blog/converterArticles";
import { TRUSTPILOT_HOSTINGER_ARTICLES } from "./blog/trustpilotHostingerArticles";
import { SEO_AND_STUDENT_ARTICLES } from "./blog/seoAndStudentArticles";

export const BLOG_POSTS_DATA: BlogPost[] = [
  ...PDF_ARTICLES,
  ...IMAGE_ARTICLES,
  ...CALCULATOR_ARTICLES,
  ...CONVERTER_ARTICLES,
  ...TRUSTPILOT_HOSTINGER_ARTICLES,
  ...SEO_AND_STUDENT_ARTICLES,
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS_DATA.find((post) => post.slug === slug);
}

export function getRelatedBlogPosts(currentPost: BlogPost, limit = 3): BlogPost[] {
  if (currentPost.relatedArticleSlugs && currentPost.relatedArticleSlugs.length > 0) {
    const explicitRelated = BLOG_POSTS_DATA.filter((p) =>
      currentPost.relatedArticleSlugs?.includes(p.slug)
    );
    if (explicitRelated.length >= limit) return explicitRelated.slice(0, limit);
  }

  return BLOG_POSTS_DATA.filter(
    (post) => post.slug !== currentPost.slug && post.category === currentPost.category
  ).slice(0, limit);
}
