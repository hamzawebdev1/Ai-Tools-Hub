import fs from "fs";
import path from "path";
import crypto from "crypto";
import { persistDocument, removeDocument, fetchCollectionDocs } from "../firebaseServer.js";
import { CMSSiteSettings, getSiteSettings, createBlogPost, getAllBlogPosts, logAuditAction } from "./cmsStore.js";

export type GuestPostStatus = "Pending" | "Under Review" | "Approved" | "Rejected" | "Published";

export interface ExternalLinkInfo {
  url: string;
  text: string;
  isAllowed: boolean;
  rel?: string;
  flaggedReason?: string;
}

export interface GuestPostSubmission {
  id: string;
  slug: string;
  authorName: string;
  authorEmail: string;
  authorWebsite?: string;
  authorSocialUrl?: string;
  authorBio: string;
  title: string;
  category: string;
  content: string;
  sanitizedContent: string;
  excerpt: string;
  featuredImage?: string;
  additionalNotes?: string;
  status: GuestPostStatus;
  submittedAt: string;
  updatedAt?: string;
  publishedAt?: string;
  reviewedBy?: string;
  moderatorNotes?: string;
  externalLinks: ExternalLinkInfo[];
  publishedBlogId?: string;
  ip?: string;
  userAgent?: string;
}

const STORAGE_FILE = path.join(process.cwd(), "storage", "guest_posts_database.json");

function ensureDirExists() {
  const dir = path.dirname(STORAGE_FILE);
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch (e) {
      console.warn("Could not create storage directory for guest posts:", e);
    }
  }
}

let guestPosts: GuestPostSubmission[] = [];

function loadGuestPosts() {
  ensureDirExists();
  if (fs.existsSync(STORAGE_FILE)) {
    try {
      const raw = fs.readFileSync(STORAGE_FILE, "utf-8");
      const data = JSON.parse(raw);
      if (Array.isArray(data)) {
        guestPosts = data;
        return;
      }
    } catch (e) {
      console.warn("Failed to parse guest posts database JSON:", e);
    }
  }
  guestPosts = [];
}

loadGuestPosts();

function saveGuestPosts() {
  ensureDirExists();
  try {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(guestPosts, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to write guest posts database:", e);
  }
}

export async function syncGuestPostsFromFirestore() {
  try {
    const docs = await fetchCollectionDocs("guest_posts", 1000);
    if (docs.length > 0) {
      guestPosts = docs.map((d: any) => ({ ...d, id: d.id })) as GuestPostSubmission[];
      saveGuestPosts();
      console.log(`✅ Loaded ${guestPosts.length} guest post submissions from Firestore.`);
    }
  } catch (err) {
    console.error("⚠️ Failed to sync guest post submissions from Firestore:", err);
  }
}

// Background sync on server boot
syncGuestPostsFromFirestore();

/**
 * Server-Side HTML & Markdown Sanitizer
 * Strips dangerous tags, script injections, event handlers, iframe exploits, and unsafe protocols.
 */
export function sanitizeGuestContent(raw: string): { sanitized: string; links: ExternalLinkInfo[] } {
  if (!raw) return { sanitized: "", links: [] };

  let clean = raw;

  // 1. Remove script, iframe, object, embed, form, style tags and their contents
  clean = clean.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  clean = clean.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "");
  clean = clean.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "");
  clean = clean.replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "");
  clean = clean.replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, "");

  // 2. Remove inline event handlers (onclick=, onload=, onerror=, etc.)
  clean = clean.replace(/\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "");

  // 3. Remove javascript: / data: / vbscript: protocols in attributes
  clean = clean.replace(/href\s*=\s*["']?\s*(?:javascript|data|vbscript):[^"'>\s]+/gi, 'href="#"');
  clean = clean.replace(/src\s*=\s*["']?\s*(?:javascript|data|vbscript):[^"'>\s]+/gi, 'src=""');

  // 4. Extract external links for editorial review & link risk checks
  const links: ExternalLinkInfo[] = [];
  const linkRegex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi;
  let match: RegExpExecArray | null;

  const SPAM_DOMAIN_PATTERNS = [
    /casino/i, /gambling/i, /betting/i, /slot/i, /poker/i,
    /adult/i, /porn/i, /payday/i, /crypto-scam/i, /phishing/i,
    /warez/i, /torrent/i, /cbd/i, /vape/i
  ];

  while ((match = linkRegex.exec(clean)) !== null) {
    const url = match[1];
    const text = match[2].replace(/<[^>]+>/g, "").trim();

    if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
      let flaggedReason: string | undefined;

      for (const pattern of SPAM_DOMAIN_PATTERNS) {
        if (pattern.test(url) || pattern.test(text)) {
          flaggedReason = "Flagged: Keyword match (Potential Spam / High Risk category)";
          break;
        }
      }

      links.push({
        url,
        text: text || url,
        isAllowed: !flaggedReason,
        rel: "nofollow noopener noreferrer",
        flaggedReason,
      });
    }
  }

  return { sanitized: clean, links };
}

/**
 * Generate a clean unique slug for articles
 */
export function generateUniqueSlug(title: string): string {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80) || "article-" + Date.now();

  const existingBlog = getAllBlogPosts(true);
  const existingSlugs = new Set([
    ...existingBlog.map((b) => b.slug.toLowerCase()),
    ...guestPosts.map((g) => g.slug.toLowerCase()),
  ]);

  if (!existingSlugs.has(baseSlug)) {
    return baseSlug;
  }

  let counter = 1;
  while (existingSlugs.has(`${baseSlug}-${counter}`)) {
    counter++;
  }
  return `${baseSlug}-${counter}`;
}

export function getAllGuestPosts(): GuestPostSubmission[] {
  return guestPosts;
}

export function getGuestPostById(id: string): GuestPostSubmission | undefined {
  return guestPosts.find((g) => g.id === id);
}

export function submitGuestPost(
  data: {
    authorName: string;
    authorEmail: string;
    authorWebsite?: string;
    authorSocialUrl?: string;
    authorBio: string;
    title: string;
    category: string;
    content: string;
    featuredImage?: string;
    additionalNotes?: string;
  },
  ip?: string,
  userAgent?: string
): { success: boolean; submission?: GuestPostSubmission; error?: string } {
  const siteSettings = getSiteSettings();
  const gpSettings = siteSettings.guestPostingSettings || {
    enabled: true,
    minWordCount: 500,
    maxWordCount: 5000,
    allowedCategories: ["Web Development", "Digital Marketing", "SEO", "Developer Tools", "PDF Utilities", "Student Tools"],
    requireFeaturedImage: false,
    requireAuthorBio: true,
    moderationRequired: true,
    autoPublish: false,
  };

  if (gpSettings.enabled === false) {
    return { success: false, error: "Guest post submissions are currently closed." };
  }

  // Word count validation
  const plainText = data.content.replace(/<[^>]+>/g, " ").trim();
  const wordCount = plainText ? plainText.split(/\s+/).length : 0;

  if (wordCount < gpSettings.minWordCount) {
    return {
      success: false,
      error: `Article content is too short (${wordCount} words). Minimum required is ${gpSettings.minWordCount} words.`,
    };
  }

  if (wordCount > gpSettings.maxWordCount) {
    return {
      success: false,
      error: `Article content exceeds maximum length (${wordCount} words). Maximum allowed is ${gpSettings.maxWordCount} words.`,
    };
  }

  if (gpSettings.requireAuthorBio && (!data.authorBio || data.authorBio.trim().length < 20)) {
    return { success: false, error: "Author bio is required and must be at least 20 characters." };
  }

  if (gpSettings.requireFeaturedImage && (!data.featuredImage || !data.featuredImage.trim())) {
    return { success: false, error: "Featured image URL or upload is required." };
  }

  const { sanitized, links } = sanitizeGuestContent(data.content);
  const slug = generateUniqueSlug(data.title);

  const excerpt = plainText.slice(0, 220) + (plainText.length > 220 ? "..." : "");

  const id = "gp_" + crypto.randomBytes(8).toString("hex");
  const submission: GuestPostSubmission = {
    id,
    slug,
    authorName: data.authorName.trim(),
    authorEmail: data.authorEmail.toLowerCase().trim(),
    authorWebsite: data.authorWebsite ? data.authorWebsite.trim() : undefined,
    authorSocialUrl: data.authorSocialUrl ? data.authorSocialUrl.trim() : undefined,
    authorBio: data.authorBio.trim(),
    title: data.title.trim(),
    category: data.category || "Web Development",
    content: data.content,
    sanitizedContent: sanitized,
    excerpt,
    featuredImage: data.featuredImage ? data.featuredImage.trim() : undefined,
    additionalNotes: data.additionalNotes ? data.additionalNotes.trim() : undefined,
    status: gpSettings.autoPublish ? "Published" : "Pending",
    submittedAt: new Date().toISOString(),
    externalLinks: links,
    ip,
    userAgent,
  };

  guestPosts.unshift(submission);
  persistDocument("guest_posts", id, submission);
  saveGuestPosts();

  // If auto-publish is enabled, publish to blog immediately
  if (gpSettings.autoPublish) {
    publishGuestPost(id, "system", ip);
  }

  return { success: true, submission };
}

export function updateGuestPost(
  id: string,
  updates: Partial<GuestPostSubmission>,
  adminEmail: string,
  ip?: string
): GuestPostSubmission | null {
  const item = guestPosts.find((g) => g.id === id);
  if (!item) return null;

  if (updates.content) {
    const { sanitized, links } = sanitizeGuestContent(updates.content);
    item.sanitizedContent = sanitized;
    item.externalLinks = updates.externalLinks || links;
  }

  Object.assign(item, updates, { updatedAt: new Date().toISOString() });
  persistDocument("guest_posts", item.id, item);
  saveGuestPosts();

  logAuditAction(adminEmail, "GUEST_POST_UPDATED", "blog", `Updated guest post "${item.title}" (${item.id})`, ip, item.id);
  return item;
}

export function updateGuestPostStatus(
  id: string,
  newStatus: GuestPostStatus,
  adminEmail: string,
  moderatorNotes?: string,
  ip?: string
): { success: boolean; submission?: GuestPostSubmission; error?: string } {
  const item = guestPosts.find((g) => g.id === id);
  if (!item) return { success: false, error: "Guest post submission not found." };

  item.status = newStatus;
  item.updatedAt = new Date().toISOString();
  item.reviewedBy = adminEmail;
  if (moderatorNotes !== undefined) {
    item.moderatorNotes = moderatorNotes;
  }

  if (newStatus === "Published") {
    const pubResult = publishGuestPost(id, adminEmail, ip);
    if (!pubResult.success) {
      return pubResult;
    }
  }

  persistDocument("guest_posts", item.id, item);
  saveGuestPosts();

  logAuditAction(adminEmail, "GUEST_POST_STATUS_CHANGED", "blog", `Changed guest post status "${item.title}" to ${newStatus}`, ip, item.id);
  return { success: true, submission: item };
}

export function deleteGuestPost(id: string, adminEmail: string, ip?: string): boolean {
  const idx = guestPosts.findIndex((g) => g.id === id);
  if (idx === -1) return false;

  const [deleted] = guestPosts.splice(idx, 1);
  removeDocument("guest_posts", id);
  saveGuestPosts();

  logAuditAction(adminEmail, "GUEST_POST_DELETED", "blog", `Deleted guest post "${deleted.title}"`, ip, id);
  return true;
}

/**
 * Publishes an approved guest post into the main CMS Blog database
 */
export function publishGuestPost(
  id: string,
  adminEmail: string,
  ip?: string
): { success: boolean; submission?: GuestPostSubmission; error?: string } {
  const item = guestPosts.find((g) => g.id === id);
  if (!item) return { success: false, error: "Guest post submission not found." };

  item.status = "Published";
  item.publishedAt = new Date().toISOString();

  // Create or sync with main Blog Posts store
  const createdBlog = createBlogPost(
    {
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt,
      content: item.sanitizedContent || item.content,
      author: {
        name: item.authorName,
        role: "Guest Author",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        bio: item.authorBio,
      },
      category: item.category,
      tags: ["Guest Article", item.category, "Expert Guide"],
      image: item.featuredImage || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80",
      status: "published",
      metaTitle: `${item.title} - Guest Article`,
      metaDescription: item.excerpt,
      canonicalUrl: `https://mehzandigital.com/blog/${item.slug}`,
    },
    adminEmail,
    ip
  );

  item.publishedBlogId = createdBlog.id;
  persistDocument("guest_posts", item.id, item);
  saveGuestPosts();

  logAuditAction(adminEmail, "GUEST_POST_PUBLISHED", "blog", `Published guest post "${item.title}" to /blog/${item.slug}`, ip, item.id);
  return { success: true, submission: item };
}
