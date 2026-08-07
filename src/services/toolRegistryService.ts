import { AITool, ToolCategory, ToolStatus } from "../types";
import { PDFTOOLS } from "../data/tools/pdfTools";
import { IMAGETOOLS } from "../data/tools/imageTools";
import { TEXTTOOLS } from "../data/tools/textTools";
import { DEVELOPERTOOLS } from "../data/tools/developerTools";
import { SEOTOOLS } from "../data/tools/seoTools";
import { WEBSITE_TOOLS } from "../data/tools/websiteTools";
import { NETWORK_TOOLS } from "../data/tools/networkTools";
import { SECURITY_TOOLS } from "../data/tools/securityTools";
import { CALCULATORTOOLS } from "../data/tools/calculatorTools";
import { QRTOOLS } from "../data/tools/qrTools";
import { FILE_TOOLS } from "../data/tools/fileTools";
import { MEDIA_TOOLS } from "../data/tools/mediaTools";

export interface ToolAdminOverride {
  status?: ToolStatus;
  isActive?: boolean;
  isFeatured?: boolean;
  isPopular?: boolean;
  isNew?: boolean;
  category?: ToolCategory;
  subcategory?: string;
  name?: string;
  description?: string;
  searchKeywords?: string[];
  seoTitle?: string;
  seoDescription?: string;
  iconName?: string;
}

const STORAGE_KEY_OVERRIDES = "aitoolshub_admin_tool_overrides";

// Build canonical list from raw tools
function buildCanonicalTools(): AITool[] {
  const rawList: AITool[] = [
    ...PDFTOOLS,
    ...IMAGETOOLS,
    ...TEXTTOOLS,
    ...DEVELOPERTOOLS,
    ...SEOTOOLS,
    ...WEBSITE_TOOLS,
    ...NETWORK_TOOLS,
    ...SECURITY_TOOLS,
    ...CALCULATORTOOLS,
    ...QRTOOLS,
    ...FILE_TOOLS,
    ...MEDIA_TOOLS,
  ];

  const seenIds = new Set<string>();
  const seenSlugs = new Set<string>();
  const canonicalList: AITool[] = [];

  for (const raw of rawList) {
    const id = raw.id;
    const slug = raw.slug || id;

    // Skip duplicate IDs or Slugs
    if (seenIds.has(id) || seenSlugs.has(slug)) {
      continue;
    }

    seenIds.add(id);
    seenSlugs.add(slug);

    // Normalize and enrich missing properties
    const tool: AITool = {
      ...raw,
      slug,
      route: raw.route || `/tools/${slug}`,
      status: raw.status || "ACTIVE",
      isActive: raw.isActive !== undefined ? raw.isActive : true,
      isFeatured: raw.isFeatured !== undefined ? raw.isFeatured : !!raw.isTrending,
      isPopular: raw.isPopular !== undefined ? raw.isPopular : !!raw.isPopular,
      isNew: raw.isNew !== undefined ? raw.isNew : false,
      subcategory: raw.subcategory || raw.category,
      searchKeywords: raw.searchKeywords || raw.tags || [],
      seoTitle: raw.seoContent?.metaTitle || `${raw.name} - Free Online Tool`,
      seoDescription: raw.seoContent?.metaDescription || raw.description,
      createdAt: raw.createdAt || "2025-01-01",
    };

    canonicalList.push(tool);
  }

  return canonicalList;
}

// Base canonical list of tools
export const BASE_CANONICAL_TOOLS: AITool[] = buildCanonicalTools();

// Helper to get admin overrides from localStorage
export function getAdminOverrides(): Record<string, ToolAdminOverride> {
  if (typeof window === "undefined") return {};
  try {
    const data = localStorage.getItem(STORAGE_KEY_OVERRIDES);
    return data ? JSON.parse(data) : {};
  } catch (err) {
    console.error("Failed to load admin overrides:", err);
    return {};
  }
}

// Save admin override
export function saveToolAdminOverride(toolId: string, override: ToolAdminOverride): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getAdminOverrides();
    existing[toolId] = { ...(existing[toolId] || {}), ...override };
    localStorage.setItem(STORAGE_KEY_OVERRIDES, JSON.stringify(existing));
    // Dispatch custom event for real-time reactive UI updates
    window.dispatchEvent(new CustomEvent("aitoolshub_tools_updated"));
  } catch (err) {
    console.error("Failed to save admin override:", err);
  }
}

// Clear all admin overrides
export function resetAdminOverrides(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY_OVERRIDES);
    window.dispatchEvent(new CustomEvent("aitoolshub_tools_updated"));
  } catch (err) {
    console.error("Failed to reset admin overrides:", err);
  }
}

// Get all tools with admin overrides applied
export function getAllRegisteredTools(): AITool[] {
  const overrides = getAdminOverrides();
  if (Object.keys(overrides).length === 0) {
    return BASE_CANONICAL_TOOLS;
  }

  return BASE_CANONICAL_TOOLS.map((tool) => {
    const ov = overrides[tool.id];
    if (!ov) return tool;
    return {
      ...tool,
      ...ov,
      isActive: ov.isActive !== undefined ? ov.isActive : tool.isActive,
      status: ov.status !== undefined ? ov.status : tool.status,
    };
  });
}

// Get active tools only
export function getActiveTools(): AITool[] {
  return getAllRegisteredTools().filter(
    (t) => t.isActive !== false && t.status !== "DISABLED" && t.status !== "BROKEN"
  );
}

// Get tool by ID or Slug
export function getToolByIdOrSlug(idOrSlug: string): AITool | undefined {
  const all = getAllRegisteredTools();
  return all.find((t) => t.id === idOrSlug || t.slug === idOrSlug);
}

// Get tools by category
export function getToolsByCategory(category: ToolCategory): AITool[] {
  return getActiveTools().filter((t) => t.category === category);
}

// Calculate active counts per category
export function getCategoryCounts(): Record<string, number> {
  const active = getActiveTools();
  const counts: Record<string, number> = {};

  active.forEach((tool) => {
    counts[tool.category] = (counts[tool.category] || 0) + 1;
  });

  return counts;
}

// Calculate total active tools count
export function getActiveToolsCount(): number {
  return getActiveTools().length;
}

// Calculate total registered tools count
export function getTotalToolsCount(): number {
  return getAllRegisteredTools().length;
}

// Levenshtein distance for fuzzy matching
function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

export interface SearchOptions {
  category?: string;
  subcategory?: string;
  featuredOnly?: boolean;
  popularOnly?: boolean;
  newOnly?: boolean;
  sortBy?: "relevance" | "name_asc" | "name_desc" | "popularity" | "rating";
}

// Advanced Typo-Tolerant Fuzzy Search
export function searchTools(query: string, options: SearchOptions = {}): AITool[] {
  let candidates = getActiveTools();

  // Apply filters first
  if (options.category && options.category !== "all") {
    candidates = candidates.filter((t) => t.category === options.category);
  }
  if (options.subcategory) {
    candidates = candidates.filter((t) => t.subcategory === options.subcategory);
  }
  if (options.featuredOnly) {
    candidates = candidates.filter((t) => t.isFeatured);
  }
  if (options.popularOnly) {
    candidates = candidates.filter((t) => t.isPopular);
  }
  if (options.newOnly) {
    candidates = candidates.filter((t) => t.isNew);
  }

  const q = query.toLowerCase().trim();
  if (!q) {
    return sortTools(candidates, options.sortBy || "popularity");
  }

  const qTokens = q.split(/\s+/).filter(Boolean);

  // Score each candidate
  const scored = candidates
    .map((tool) => {
      let score = 0;
      const nameLower = tool.name.toLowerCase();
      const descLower = tool.description.toLowerCase();
      const catLower = tool.category.toLowerCase();
      const subcatLower = (tool.subcategory || "").toLowerCase();
      const keywordsLower = (tool.searchKeywords || []).map((k) => k.toLowerCase()).join(" ");
      const tagsLower = tool.tags.map((t) => t.toLowerCase()).join(" ");
      const slugLower = tool.slug.toLowerCase();

      // Exact name match
      if (nameLower === q) score += 100;
      else if (nameLower.startsWith(q)) score += 60;
      else if (nameLower.includes(q)) score += 40;

      // Exact slug match
      if (slugLower === q) score += 80;

      // Token matches
      let matchedTokens = 0;
      for (const tok of qTokens) {
        let tokenMatched = false;

        if (nameLower.includes(tok)) {
          score += 25;
          tokenMatched = true;
        } else if (keywordsLower.includes(tok)) {
          score += 18;
          tokenMatched = true;
        } else if (tagsLower.includes(tok)) {
          score += 15;
          tokenMatched = true;
        } else if (descLower.includes(tok)) {
          score += 10;
          tokenMatched = true;
        } else if (catLower.includes(tok) || subcatLower.includes(tok)) {
          score += 12;
          tokenMatched = true;
        }

        // Fuzzy match if token not directly matched
        if (!tokenMatched && tok.length >= 3) {
          const words = `${nameLower} ${keywordsLower} ${tagsLower}`.split(/\W+/);
          const maxDist = tok.length > 5 ? 2 : 1;
          for (const w of words) {
            if (w.length >= 3 && levenshteinDistance(tok, w) <= maxDist) {
              score += 8;
              tokenMatched = true;
              break;
            }
          }
        }

        if (tokenMatched) matchedTokens++;
      }

      // If not all tokens matched at all, penalize heavy
      if (matchedTokens < qTokens.length) {
        score = Math.floor(score * (matchedTokens / qTokens.length));
      }

      return { tool, score };
    })
    .filter((item) => item.score > 0);

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  return scored.map((item) => item.tool);
}

// Sorting helper
function sortTools(tools: AITool[], sortBy: SearchOptions["sortBy"] = "popularity"): AITool[] {
  const copy = [...tools];
  switch (sortBy) {
    case "name_asc":
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    case "name_desc":
      return copy.sort((a, b) => b.name.localeCompare(a.name));
    case "rating":
      return copy.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case "popularity":
    default:
      return copy.sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0));
  }
}
