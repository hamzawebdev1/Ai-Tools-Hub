import { AITool, CategoryInfo, BlogPost } from "../types";
import { TOOLS_DATA } from "../data/toolsData";
import { CATEGORIES_DATA } from "../data/categoriesData";
import { BLOG_POSTS_DATA } from "../data/blogData";

let dynamicTools: AITool[] = [...TOOLS_DATA];
let dynamicCategories: CategoryInfo[] = [...CATEGORIES_DATA];
let dynamicBlogPosts: BlogPost[] = [...BLOG_POSTS_DATA];
let listeners: Array<() => void> = [];

export async function fetchLiveCatalog(): Promise<{
  tools: AITool[];
  categories: CategoryInfo[];
  blog: BlogPost[];
}> {
  try {
    const res = await fetch("/api/admin/public/catalog");
    if (!res.ok) {
      const fallbackRes = await fetch("/api/public/catalog");
      if (!fallbackRes.ok) throw new Error("Catalog fetch failed");
      const fallbackData = await fallbackRes.json();
      if (fallbackData.success) {
        applyCatalogData(fallbackData);
      }
      return { tools: dynamicTools, categories: dynamicCategories, blog: dynamicBlogPosts };
    }
    const data = await res.json();
    if (data.success) {
      applyCatalogData(data);
    }
  } catch (err) {
    // console.warn("Using baseline catalog data:", err);
  }
  return { tools: dynamicTools, categories: dynamicCategories, blog: dynamicBlogPosts };
}

function applyCatalogData(data: any) {
  if (Array.isArray(data.tools) && data.tools.length > 0) {
    dynamicTools = data.tools.map((t: any) => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      category: t.category,
      description: t.description,
      iconName: t.iconName || "Tool",
      isPopular: !!t.isPopular,
      isNew: !!t.isNew,
      rateLimit: t.rateLimit || 30,
      tags: t.keywords || [],
    }));
  }
  if (Array.isArray(data.categories) && data.categories.length > 0) {
    dynamicCategories = data.categories.map((c: any) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      iconName: c.iconName || "Folder",
      count: c.count || 0,
      color: c.color || "from-indigo-500 to-purple-600",
    }));
  }
  if (Array.isArray(data.blog) && data.blog.length > 0) {
    dynamicBlogPosts = data.blog.map((b: any) => ({
      id: b.id,
      slug: b.slug,
      title: b.title,
      excerpt: b.excerpt,
      category: b.category,
      author: b.author,
      date: b.date,
      readTime: b.readTime || "5 min read",
      tags: b.tags || [],
      image: b.image,
      content: b.content,
    }));
  }
  notifyListeners();
}

export function getLiveTools(): AITool[] {
  return dynamicTools;
}

export function getLiveCategories(): CategoryInfo[] {
  return dynamicCategories;
}

export function getLiveBlogPosts(): BlogPost[] {
  return dynamicBlogPosts;
}

export function subscribeToCatalogUpdates(listener: () => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function notifyListeners() {
  listeners.forEach((l) => {
    try {
      l();
    } catch (e) {}
  });
}
