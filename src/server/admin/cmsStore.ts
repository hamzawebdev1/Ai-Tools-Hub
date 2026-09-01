import fs from "fs";
import path from "path";
import crypto from "crypto";
import { BASE_CANONICAL_TOOLS } from "../../services/toolRegistryService.js";
import { RAW_CATEGORIES } from "../../data/categoriesData.js";
import { BLOG_POSTS_DATA } from "../../data/blogData.js";
import { persistDocument, removeDocument, fetchCollectionDocs } from "../firebaseServer.js";

export interface CMSTool {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  iconName: string;
  rateLimit: number;
  status: "active" | "disabled";
  order: number;
  isPopular?: boolean;
  isNew?: boolean;
  views: number;
  starts: number;
  completions: number;
  downloads: number;
  errors: number;
  updatedAt: string;
}

export interface CMSCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  status: "active" | "disabled";
  order: number;
  color: string;
  count: number;
  updatedAt: string;
}

export interface CMSBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    role: string;
    email?: string;
    bio?: string;
    website?: string;
  };
  category: string;
  tags: string[];
  image: string;
  status: "published" | "draft";
  date: string;
  readTime: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface CMSNewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  status: "active" | "unsubscribed";
  source: string;
  subscribedAt: string;
}

export type CMSSubscriber = CMSNewsletterSubscriber;

export interface CMSCampaign {
  id: string;
  subject: string;
  htmlContent: string;
  recipientsCount: number;
  testEmail?: string;
  sentAt: string;
  status: "sent" | "failed";
}

export interface CMSAuditLog {
  id: string;
  timestamp: string;
  adminEmail: string;
  action: string;
  entityType: "tool" | "category" | "blog" | "user" | "setting" | "newsletter" | "message" | "security" | "media";
  entityId?: string;
  details: string;
  ip: string;
}

export interface CMSMediaItem {
  id: string;
  name: string;
  originalName: string;
  url: string;
  sizeBytes: number;
  mimeType: string;
  category: "image" | "document" | "logo" | "favicon" | "icon" | "other";
  width?: number;
  height?: number;
  uploadedBy: string;
  createdAt: string;
}

export interface CMSSiteSettings {
  siteName: string;
  tagline: string;
  copyrightText?: string;
  poweredByText?: string;
  contactEmail: string;
  logoUrl: string;
  faviconUrl: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  googleAnalyticsId: string;
  googleAdsenseId: string;
  adsEnabled: boolean;
  announcementBarText: string;
  announcementBarActive: boolean;
  socialLinks: {
    twitter: string;
    github: string;
    linkedin: string;
    facebook: string;
    discord: string;
    youtube: string;
  };
  defaultSeo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  robotsTxt: string;
  guestPostingSettings?: any;
}

export interface CMSDatabase {
  tools: CMSTool[];
  categories: CMSCategory[];
  blogPosts: CMSBlogPost[];
  subscribers: CMSNewsletterSubscriber[];
  campaigns: CMSCampaign[];
  media: CMSMediaItem[];
  settings: CMSSiteSettings;
  auditLogs: CMSAuditLog[];
}

const STORAGE_FILE = path.join(process.cwd(), "storage", "cms_database.json");

function ensureDirectoryExists() {
  const dir = path.dirname(STORAGE_FILE);
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch (e) {
      console.warn("Failed to create storage directory:", e);
    }
  }
}

// Initial state builder
function buildInitialDatabase(): CMSDatabase {
  const tools: CMSTool[] = BASE_CANONICAL_TOOLS.map((t, idx) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    category: t.category,
    description: t.description,
    metaTitle: `${t.name} - Free Online Tool`,
    metaDescription: t.description,
    keywords: [t.category, t.slug, "online tool", "free tool"],
    iconName: t.iconName || "Tool",
    rateLimit: 30,
    status: "active",
    order: idx + 1,
    isPopular: !!t.isPopular,
    isNew: !!t.isNew,
    views: 0,
    starts: 0,
    completions: 0,
    downloads: 0,
    errors: 0,
    updatedAt: new Date().toISOString(),
  }));

  const categories: CMSCategory[] = RAW_CATEGORIES.map((c, idx) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    iconName: c.iconName,
    status: "active",
    order: idx + 1,
    color: c.color,
    count: tools.filter((t) => t.category.toLowerCase() === c.id.toLowerCase()).length,
    updatedAt: new Date().toISOString(),
  }));

  const blogPosts: CMSBlogPost[] = BLOG_POSTS_DATA.map((b) => ({
    id: b.id,
    title: b.title,
    slug: b.slug,
    excerpt: b.excerpt,
    content: b.content,
    author: {
      name: b.author?.name || "Editorial Team",
      avatar: b.author?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      role: b.author?.role || "Lead Editor",
    },
    category: b.category,
    tags: b.tags || ["Tools", "Productivity"],
    image: b.image || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    status: "published",
    date: b.date,
    readTime: b.readTime || "5 min read",
    metaTitle: `${b.title} | Mehzan Tools Hub`,
    metaDescription: b.excerpt,
    canonicalUrl: `https://www.mehzandigital.com/blog/${b.slug}`,
    views: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  const subscribers: CMSNewsletterSubscriber[] = [];

  const settings: CMSSiteSettings = {
    siteName: "Mehzan Tools Hub",
    tagline: "50+ Free Professional Developer, PDF & Image Utilities",
    copyrightText: `© ${new Date().getFullYear()} Mehzan Digital. All Rights Reserved.`,
    poweredByText: "Powered by Mehzan Digital Team",
    contactEmail: "support@mehzandigital.com",
    logoUrl: "/icon.png",
    faviconUrl: "/favicon.ico",
    maintenanceMode: false,
    maintenanceMessage: "Mehzan Tools Hub is currently undergoing scheduled maintenance. We will be back online shortly.",
    googleAnalyticsId: "G-MEHZANDIGITAL99",
    googleAdsenseId: "ca-pub-9843219082341234",
    adsEnabled: true,
    announcementBarText: "🚀 Fast Browser-Side Processing & OWASP Top 10 Security Active!",
    announcementBarActive: true,
    socialLinks: {
      twitter: "https://twitter.com/mehzandigital",
      github: "https://github.com/mehzandigital",
      linkedin: "https://linkedin.com/company/mehzandigital",
      facebook: "https://facebook.com/mehzandigital",
      discord: "https://discord.gg/mehzandigital",
      youtube: "https://youtube.com/@mehzandigital",
    },
    defaultSeo: {
      metaTitle: "Mehzan Tools Hub - 50+ Free Client-Side Developer & Media Tools",
      metaDescription: "Fast, privacy-focused online utilities for PDF editing, image conversion, developer formatters, and SEO optimization. 100% free and client-side.",
      keywords: ["free online tools", "pdf editor", "image converter", "json formatter", "developer tools"],
    },
    robotsTxt: `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /admin/\nSitemap: https://mehzandigital.com/sitemap.xml`,
  };

  const auditLogs: CMSAuditLog[] = [
    {
      id: "log_init_001",
      timestamp: new Date().toISOString(),
      adminEmail: "admin@security.hub",
      action: "SYSTEM_INITIALIZED",
      entityType: "setting",
      details: "CMS database initialized with standard canonical tools, categories, and settings.",
      ip: "127.0.0.1",
    },
  ];

  const media: CMSMediaItem[] = [
    {
      id: "med_logo_01",
      name: "Site Logo",
      originalName: "icon.png",
      url: "/icon.png",
      sizeBytes: 14200,
      mimeType: "image/png",
      category: "logo",
      uploadedBy: "system",
      createdAt: new Date().toISOString(),
    },
    {
      id: "med_favicon_01",
      name: "Site Favicon",
      originalName: "favicon.ico",
      url: "/favicon.ico",
      sizeBytes: 4280,
      mimeType: "image/x-icon",
      category: "favicon",
      uploadedBy: "system",
      createdAt: new Date().toISOString(),
    },
  ];

  return {
    tools,
    categories,
    blogPosts,
    subscribers,
    campaigns: [],
    media,
    settings,
    auditLogs,
  };
}

let cmsDb: CMSDatabase = (() => {
  ensureDirectoryExists();
  if (fs.existsSync(STORAGE_FILE)) {
    try {
      const content = fs.readFileSync(STORAGE_FILE, "utf-8");
      const parsed = JSON.parse(content);
      if (parsed && Array.isArray(parsed.tools) && Array.isArray(parsed.categories)) {
        return parsed;
      }
    } catch (e) {
      console.warn("Error loading existing CMS database, reinitializing:", e);
    }
  }
  const initial = buildInitialDatabase();
  try {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(initial, null, 2), "utf-8");
  } catch (e) {}
  return initial;
})();

export async function syncCMSFromFirestore() {
  try {
    const toolsDocs = await fetchCollectionDocs("tools", 1000);
    const catDocs = await fetchCollectionDocs("categories", 500);
    const blogDocs = await fetchCollectionDocs("blog", 500);
    const subDocs = await fetchCollectionDocs("newsletter", 1000);
    const campaignDocs = await fetchCollectionDocs("campaigns", 500);
    const mediaDocs = await fetchCollectionDocs("media", 500);
    const settingsDocs = await fetchCollectionDocs("settings", 50);
    const auditDocs = await fetchCollectionDocs("audit_logs", 500);

    if (toolsDocs.length > 0) {
      cmsDb.tools = toolsDocs.map((t) => ({ ...t, id: t.id })) as CMSTool[];
    } else {
      const initialDb = buildInitialDatabase();
      for (const t of initialDb.tools) {
        await persistDocument("tools", t.id, t);
      }
      cmsDb.tools = initialDb.tools;
    }

    if (catDocs.length > 0) {
      cmsDb.categories = catDocs.map((c) => ({ ...c, id: c.id })) as CMSCategory[];
    } else {
      const initialDb = buildInitialDatabase();
      for (const c of initialDb.categories) {
        await persistDocument("categories", c.id, c);
      }
      cmsDb.categories = initialDb.categories;
    }

    if (blogDocs.length > 0) {
      cmsDb.blogPosts = blogDocs.map((b) => ({ ...b, id: b.id })) as CMSBlogPost[];
    } else {
      const initialDb = buildInitialDatabase();
      for (const b of initialDb.blogPosts) {
        await persistDocument("blog", b.id, b);
      }
      cmsDb.blogPosts = initialDb.blogPosts;
    }

    if (subDocs.length > 0) {
      cmsDb.subscribers = subDocs.map((s) => ({ ...s, id: s.id })) as CMSNewsletterSubscriber[];
    }

    if (campaignDocs.length > 0) {
      cmsDb.campaigns = campaignDocs.map((c) => ({ ...c, id: c.id })) as CMSCampaign[];
    }

    if (mediaDocs.length > 0) {
      cmsDb.media = mediaDocs.map((m) => ({ ...m, id: m.id })) as CMSMediaItem[];
    }

    if (settingsDocs.length > 0) {
      const siteSettingDoc = settingsDocs.find((s) => s.id === "site_settings") || settingsDocs[0];
      if (siteSettingDoc) {
        const { id, ...data } = siteSettingDoc;
        cmsDb.settings = { ...cmsDb.settings, ...data };
      }
    } else {
      await persistDocument("settings", "site_settings", cmsDb.settings);
    }

    if (auditDocs.length > 0) {
      cmsDb.auditLogs = auditDocs.map((a) => ({ ...a, id: a.id })) as CMSAuditLog[];
    }

    recalcCategoryCounts();
    saveCMSDatabase();
    console.log(`✅ CMS database successfully loaded from Firestore (${cmsDb.tools.length} tools, ${cmsDb.categories.length} categories, ${cmsDb.blogPosts.length} articles).`);
  } catch (err) {
    console.error("⚠️ Failed to sync CMS database from Firestore:", err);
  }
}

// Kick off initial background sync
syncCMSFromFirestore();

export function saveCMSDatabase() {
  try {
    ensureDirectoryExists();
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(cmsDb, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write CMS database to disk:", err);
  }
}

export function logAuditAction(
  adminEmail: string,
  action: string,
  entityType: CMSAuditLog["entityType"],
  details: string,
  ip: string = "127.0.0.1",
  entityId?: string
) {
  const newLog: CMSAuditLog = {
    id: "log_" + crypto.randomBytes(8).toString("hex"),
    timestamp: new Date().toISOString(),
    adminEmail: adminEmail || "admin@security.hub",
    action,
    entityType,
    entityId,
    details,
    ip,
  };
  cmsDb.auditLogs.unshift(newLog);
  if (cmsDb.auditLogs.length > 500) {
    cmsDb.auditLogs.pop();
  }
  persistDocument("audit_logs", newLog.id, newLog);
  saveCMSDatabase();
  return newLog;
}

// -------------------------------------------------------------
// TOOLS CRUD
// -------------------------------------------------------------
export function getAllTools(includeDisabled: boolean = true): CMSTool[] {
  if (includeDisabled) return cmsDb.tools;
  return cmsDb.tools.filter((t) => t.status === "active");
}

export function getToolByIdOrSlug(idOrSlug: string): CMSTool | undefined {
  return cmsDb.tools.find((t) => t.id === idOrSlug || t.slug === idOrSlug);
}

export function createTool(toolData: Partial<CMSTool>, adminEmail: string, ip?: string): CMSTool {
  const id = toolData.id || "tool_" + crypto.randomBytes(6).toString("hex");
  const slug = toolData.slug || toolData.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || id;
  
  const newTool: CMSTool = {
    id,
    name: toolData.name || "Untitled Tool",
    slug,
    category: toolData.category || "general",
    description: toolData.description || "",
    metaTitle: toolData.metaTitle || `${toolData.name} - Free Online Tool`,
    metaDescription: toolData.metaDescription || toolData.description || "",
    keywords: Array.isArray(toolData.keywords) ? toolData.keywords : ["online tool", slug],
    iconName: toolData.iconName || "Tool",
    rateLimit: toolData.rateLimit || 30,
    status: toolData.status || "active",
    order: toolData.order || cmsDb.tools.length + 1,
    isPopular: !!toolData.isPopular,
    isNew: toolData.isNew !== undefined ? toolData.isNew : true,
    views: 0,
    starts: 0,
    completions: 0,
    downloads: 0,
    errors: 0,
    updatedAt: new Date().toISOString(),
  };

  cmsDb.tools.push(newTool);
  persistDocument("tools", newTool.id, newTool);
  recalcCategoryCounts();
  logAuditAction(adminEmail, "TOOL_CREATED", "tool", `Created new tool "${newTool.name}" (${newTool.slug})`, ip, newTool.id);
  saveCMSDatabase();
  return newTool;
}

export function updateTool(id: string, updates: Partial<CMSTool>, adminEmail: string, ip?: string): CMSTool | null {
  const tool = cmsDb.tools.find((t) => t.id === id);
  if (!tool) return null;

  Object.assign(tool, updates, { updatedAt: new Date().toISOString() });
  persistDocument("tools", tool.id, tool);
  recalcCategoryCounts();
  logAuditAction(adminEmail, "TOOL_UPDATED", "tool", `Updated tool "${tool.name}" (${tool.id})`, ip, tool.id);
  saveCMSDatabase();
  return tool;
}

export function deleteTool(id: string, adminEmail: string, ip?: string): boolean {
  const idx = cmsDb.tools.findIndex((t) => t.id === id);
  if (idx === -1) return false;

  const [deleted] = cmsDb.tools.splice(idx, 1);
  removeDocument("tools", id);
  recalcCategoryCounts();
  logAuditAction(adminEmail, "TOOL_DELETED", "tool", `Deleted tool "${deleted.name}" (${deleted.slug})`, ip, id);
  saveCMSDatabase();
  return true;
}

export function reorderTools(orderedIds: string[], adminEmail: string, ip?: string) {
  orderedIds.forEach((id, index) => {
    const t = cmsDb.tools.find((tool) => tool.id === id);
    if (t) {
      t.order = index + 1;
      persistDocument("tools", t.id, t);
    }
  });
  cmsDb.tools.sort((a, b) => a.order - b.order);
  logAuditAction(adminEmail, "TOOLS_REORDERED", "tool", `Reordered ${orderedIds.length} tools.`, ip);
  saveCMSDatabase();
  return cmsDb.tools;
}

// -------------------------------------------------------------
// CATEGORIES CRUD
// -------------------------------------------------------------
export function getAllCategories(includeDisabled: boolean = true): CMSCategory[] {
  recalcCategoryCounts();
  if (includeDisabled) return cmsDb.categories;
  return cmsDb.categories.filter((c) => c.status === "active");
}

export function createCategory(catData: Partial<CMSCategory>, adminEmail: string, ip?: string): CMSCategory {
  const id = catData.id || catData.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "cat_" + Date.now();
  const slug = catData.slug || id + "-tools";

  const newCat: CMSCategory = {
    id,
    name: catData.name || "Untitled Category",
    slug,
    description: catData.description || "",
    iconName: catData.iconName || "Folder",
    status: catData.status || "active",
    order: catData.order || cmsDb.categories.length + 1,
    color: catData.color || "from-indigo-500 to-purple-600",
    count: 0,
    updatedAt: new Date().toISOString(),
  };

  cmsDb.categories.push(newCat);
  persistDocument("categories", newCat.id, newCat);
  recalcCategoryCounts();
  logAuditAction(adminEmail, "CATEGORY_CREATED", "category", `Created category "${newCat.name}"`, ip, newCat.id);
  saveCMSDatabase();
  return newCat;
}

export function updateCategory(id: string, updates: Partial<CMSCategory>, adminEmail: string, ip?: string): CMSCategory | null {
  const cat = cmsDb.categories.find((c) => c.id === id);
  if (!cat) return null;

  Object.assign(cat, updates, { updatedAt: new Date().toISOString() });
  persistDocument("categories", cat.id, cat);
  recalcCategoryCounts();
  logAuditAction(adminEmail, "CATEGORY_UPDATED", "category", `Updated category "${cat.name}"`, ip, cat.id);
  saveCMSDatabase();
  return cat;
}

export function deleteCategory(id: string, adminEmail: string, ip?: string): { success: boolean; error?: string } {
  const assignedTools = cmsDb.tools.filter((t) => t.category.toLowerCase() === id.toLowerCase());
  if (assignedTools.length > 0) {
    return {
      success: false,
      error: `Cannot delete category "${id}" because ${assignedTools.length} tools are still assigned to it. Reassign or delete these tools first.`,
    };
  }

  const idx = cmsDb.categories.findIndex((c) => c.id === id);
  if (idx === -1) return { success: false, error: "Category not found." };

  const [deleted] = cmsDb.categories.splice(idx, 1);
  removeDocument("categories", id);
  logAuditAction(adminEmail, "CATEGORY_DELETED", "category", `Deleted category "${deleted.name}"`, ip, id);
  saveCMSDatabase();
  return { success: true };
}

export function reorderCategories(orderedIds: string[], adminEmail: string, ip?: string) {
  orderedIds.forEach((id, index) => {
    const c = cmsDb.categories.find((cat) => cat.id === id);
    if (c) {
      c.order = index + 1;
      persistDocument("categories", c.id, c);
    }
  });
  cmsDb.categories.sort((a, b) => a.order - b.order);
  logAuditAction(adminEmail, "CATEGORIES_REORDERED", "category", `Reordered ${orderedIds.length} categories.`, ip);
  saveCMSDatabase();
  return cmsDb.categories;
}

function recalcCategoryCounts() {
  cmsDb.categories.forEach((cat) => {
    cat.count = cmsDb.tools.filter(
      (t) => t.category.toLowerCase() === cat.id.toLowerCase() && t.status === "active"
    ).length;
    persistDocument("categories", cat.id, cat);
  });
}

// -------------------------------------------------------------
// BLOG / ARTICLE CMS CRUD
// -------------------------------------------------------------
export function getAllBlogPosts(includeDrafts: boolean = true): CMSBlogPost[] {
  if (includeDrafts) return cmsDb.blogPosts;
  return cmsDb.blogPosts.filter((b) => b.status === "published");
}

export function getBlogPostBySlug(slug: string): CMSBlogPost | undefined {
  return cmsDb.blogPosts.find((b) => b.slug === slug);
}

export function createBlogPost(postData: Partial<CMSBlogPost>, adminEmail: string, ip?: string): CMSBlogPost {
  const id = postData.id || "post_" + Date.now();
  const slug = postData.slug || postData.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || id;

  const newPost: CMSBlogPost = {
    id,
    title: postData.title || "Untitled Article",
    slug,
    excerpt: postData.excerpt || "",
    content: postData.content || "",
    author: {
      name: postData.author?.name || "Admin",
      avatar: postData.author?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      role: postData.author?.role || "Editor",
      email: postData.author?.email || adminEmail,
    },
    category: postData.category || "General",
    tags: Array.isArray(postData.tags) ? postData.tags : ["Tools"],
    image: postData.image || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    status: postData.status || "published",
    date: postData.date || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    readTime: postData.readTime || "5 min read",
    metaTitle: postData.metaTitle || `${postData.title} | Mehzan Tools Hub`,
    metaDescription: postData.metaDescription || postData.excerpt || "",
    canonicalUrl: postData.canonicalUrl || `https://mehzandigital.com/blog/${slug}`,
    views: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  cmsDb.blogPosts.unshift(newPost);
  persistDocument("blog", newPost.id, newPost);
  logAuditAction(adminEmail, "BLOG_CREATED", "blog", `Created article "${newPost.title}" (${newPost.slug})`, ip, newPost.id);
  saveCMSDatabase();
  return newPost;
}

export function updateBlogPost(id: string, updates: Partial<CMSBlogPost>, adminEmail: string, ip?: string): CMSBlogPost | null {
  const post = cmsDb.blogPosts.find((b) => b.id === id);
  if (!post) return null;

  Object.assign(post, updates, { updatedAt: new Date().toISOString() });
  persistDocument("blog", post.id, post);
  logAuditAction(adminEmail, "BLOG_UPDATED", "blog", `Updated article "${post.title}" (${post.id})`, ip, post.id);
  saveCMSDatabase();
  return post;
}

export function deleteBlogPost(id: string, adminEmail: string, ip?: string): boolean {
  const idx = cmsDb.blogPosts.findIndex((b) => b.id === id);
  if (idx === -1) return false;

  const [deleted] = cmsDb.blogPosts.splice(idx, 1);
  removeDocument("blog", id);
  logAuditAction(adminEmail, "BLOG_DELETED", "blog", `Deleted article "${deleted.title}"`, ip, id);
  saveCMSDatabase();
  return true;
}

// -------------------------------------------------------------
// NEWSLETTER SUBSCRIBERS & CAMPAIGNS
// -------------------------------------------------------------
export function getAllSubscribers(): CMSNewsletterSubscriber[] {
  return cmsDb.subscribers;
}

export function addSubscriber(
  email: string,
  source: string = "site_footer",
  name?: string
): { success: boolean; subscriber?: CMSNewsletterSubscriber; error?: string; alreadySubscribed?: boolean } {
  const cleanEmail = email.toLowerCase().trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!cleanEmail || !emailRegex.test(cleanEmail)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  const cleanName = name ? name.trim() : undefined;
  const existing = cmsDb.subscribers.find((s) => s.email.toLowerCase() === cleanEmail);

  if (existing) {
    if (existing.status === "unsubscribed") {
      existing.status = "active";
      if (cleanName) existing.name = cleanName;
      persistDocument("newsletter", existing.id, existing);
      saveCMSDatabase();
      return { success: true, subscriber: existing };
    }
    if (cleanName && !existing.name) {
      existing.name = cleanName;
      persistDocument("newsletter", existing.id, existing);
      saveCMSDatabase();
    }
    return { success: true, subscriber: existing, alreadySubscribed: true };
  }

  const newSub: CMSNewsletterSubscriber = {
    id: "sub_" + crypto.randomBytes(6).toString("hex"),
    email: cleanEmail,
    name: cleanName,
    status: "active",
    source,
    subscribedAt: new Date().toISOString(),
  };

  cmsDb.subscribers.unshift(newSub);
  persistDocument("newsletter", newSub.id, newSub);
  saveCMSDatabase();
  return { success: true, subscriber: newSub };
}

export function updateSubscriber(
  idOrEmail: string,
  updates: Partial<Pick<CMSNewsletterSubscriber, "name" | "email" | "status" | "source">>,
  adminEmail: string,
  ip?: string
): CMSNewsletterSubscriber | null {
  const target = cmsDb.subscribers.find(
    (s) => s.id === idOrEmail || s.email.toLowerCase() === idOrEmail.toLowerCase()
  );
  if (!target) return null;

  if (updates.email && updates.email !== target.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(updates.email.trim())) {
      throw new Error("Invalid email format.");
    }
    target.email = updates.email.toLowerCase().trim();
  }
  if (updates.name !== undefined) target.name = updates.name.trim();
  if (updates.status) target.status = updates.status;
  if (updates.source) target.source = updates.source;

  persistDocument("newsletter", target.id, target);
  logAuditAction(adminEmail, "SUBSCRIBER_UPDATED", "newsletter", `Updated subscriber ${target.email}`, ip, target.id);
  saveCMSDatabase();
  return target;
}

export function toggleSubscriberStatus(
  idOrEmail: string,
  adminEmail: string,
  ip?: string
): CMSNewsletterSubscriber | null {
  const target = cmsDb.subscribers.find(
    (s) => s.id === idOrEmail || s.email.toLowerCase() === idOrEmail.toLowerCase()
  );
  if (!target) return null;

  target.status = target.status === "active" ? "unsubscribed" : "active";
  persistDocument("newsletter", target.id, target);
  logAuditAction(
    adminEmail,
    "SUBSCRIBER_STATUS_TOGGLED",
    "newsletter",
    `Toggled subscriber ${target.email} to ${target.status}`,
    ip,
    target.id
  );
  saveCMSDatabase();
  return target;
}

export function deleteSubscriber(emailOrId: string, adminEmail: string, ip?: string): boolean {
  const query = emailOrId.toLowerCase().trim();
  const idx = cmsDb.subscribers.findIndex(
    (s) => s.id === query || s.email.toLowerCase() === query
  );
  if (idx === -1) return false;

  const [sub] = cmsDb.subscribers.splice(idx, 1);
  removeDocument("newsletter", sub.id);
  logAuditAction(adminEmail, "SUBSCRIBER_DELETED", "newsletter", `Deleted subscriber ${sub.email}`, ip, sub.id);
  saveCMSDatabase();
  return true;
}

export function recordCampaign(campaign: CMSCampaign, adminEmail: string, ip?: string) {
  cmsDb.campaigns.unshift(campaign);
  persistDocument("campaigns", campaign.id, campaign);
  logAuditAction(adminEmail, "CAMPAIGN_DISPATCHED", "newsletter", `Dispatched campaign "${campaign.subject}" to ${campaign.recipientsCount} recipients`, ip, campaign.id);
  saveCMSDatabase();
}

export function getAllCampaigns(): CMSCampaign[] {
  return cmsDb.campaigns;
}

export function getAllMedia(): CMSMediaItem[] {
  if (!cmsDb.media) {
    cmsDb.media = [];
  }
  return cmsDb.media;
}

export function addMediaItem(item: Omit<CMSMediaItem, "id" | "createdAt">, adminEmail: string, ip?: string): CMSMediaItem {
  if (!cmsDb.media) {
    cmsDb.media = [];
  }
  const newMedia: CMSMediaItem = {
    ...item,
    id: "med_" + crypto.randomBytes(6).toString("hex"),
    createdAt: new Date().toISOString(),
  };
  cmsDb.media.unshift(newMedia);
  persistDocument("media", newMedia.id, newMedia);
  logAuditAction(adminEmail, "MEDIA_UPLOADED", "media", `Uploaded media file "${newMedia.name}" (${newMedia.mimeType}, ${Math.round(newMedia.sizeBytes / 1024)} KB)`, ip, newMedia.id);
  saveCMSDatabase();
  return newMedia;
}

export function deleteMediaItem(id: string, adminEmail: string, ip?: string): boolean {
  if (!cmsDb.media) return false;
  const idx = cmsDb.media.findIndex((m) => m.id === id);
  if (idx === -1) return false;
  const [deleted] = cmsDb.media.splice(idx, 1);
  removeDocument("media", id);
  logAuditAction(adminEmail, "MEDIA_DELETED", "media", `Deleted media file "${deleted.name}"`, ip, id);
  saveCMSDatabase();
  return true;
}

// -------------------------------------------------------------
// SITE SETTINGS
// -------------------------------------------------------------
export function getSiteSettings(): CMSSiteSettings {
  return cmsDb.settings;
}

export function updateSiteSettings(updates: Partial<CMSSiteSettings>, adminEmail: string, ip?: string): CMSSiteSettings {
  cmsDb.settings = { ...cmsDb.settings, ...updates };
  persistDocument("settings", "site_settings", cmsDb.settings);
  logAuditAction(adminEmail, "SETTINGS_UPDATED", "setting", "Updated sitewide configuration settings.", ip);
  saveCMSDatabase();
  return cmsDb.settings;
}

// -------------------------------------------------------------
// AUDIT LOGS & BACKUP
// -------------------------------------------------------------
export function getAuditLogs(filterType?: string, limit: number = 100): CMSAuditLog[] {
  if (filterType && filterType !== "all") {
    return cmsDb.auditLogs.filter((l) => l.entityType === filterType).slice(0, limit);
  }
  return cmsDb.auditLogs.slice(0, limit);
}

export function exportFullBackup(): any {
  return {
    version: "3.0.0-ProductionCMS",
    exportedAt: new Date().toISOString(),
    database: cmsDb,
  };
}

export function importFullBackup(backupData: any, adminEmail: string, ip?: string): { success: boolean; error?: string } {
  if (!backupData || !backupData.database || !Array.isArray(backupData.database.tools)) {
    return { success: false, error: "Invalid backup JSON structure." };
  }

  cmsDb = backupData.database;
  logAuditAction(adminEmail, "DATABASE_RESTORED", "setting", `Restored database backup from ${backupData.exportedAt || "file"}.`, ip);
  saveCMSDatabase();
  return { success: true };
}
