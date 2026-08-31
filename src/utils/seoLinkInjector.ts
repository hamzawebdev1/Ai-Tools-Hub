import { AITool } from "../types";
import { TOOLS_DATA } from "../data/toolsData";
import { CATEGORIES_DATA } from "../data/categoriesData";
import { getUrlForRoute } from "../services/routerService";

const BASE_URL = "https://www.mehzandigital.com";

export function getRelatedTools(
  category: string,
  excludeId: string,
  limit: number = 4
): AITool[] {
  return TOOLS_DATA.filter(
    (t) => t.category === category && t.id !== excludeId
  ).slice(0, limit);
}

export function getRelatedLinks(
  category: string,
  excludeId: string,
  limit: number = 2
): { text: string; url: string }[] {
  const tools = getRelatedTools(category, excludeId, limit);
  const links: { text: string; url: string }[] = tools.map(tool => ({
      text: tool.name,
      url: `${BASE_URL}${getUrlForRoute("tool-detail", { toolSlug: tool.slug })}`,
  }));

  // If not enough tools, add categories
  if (links.length < limit) {
    const relatedCategories = CATEGORIES_DATA.filter((c) => c.slug !== category);
    for (const cat of relatedCategories) {
      if (links.length >= limit) break;
      links.push({
        text: `${cat.name} Category`,
        url: `${BASE_URL}${getUrlForRoute("category-detail", { categorySlug: cat.slug })}`,
      });
    }
  }

  return links;
}

export function injectLinksIntoContent(
  content: string,
  links: { text: string; url: string }[]
): string {
  let modifiedContent = content;
  links.forEach((link) => {
    const paragraphs = modifiedContent.split("\n\n");
    if (paragraphs.length > 1) {
        paragraphs.splice(1, 0, `Check out our <a href="${link.url}" class="text-indigo-600 dark:text-indigo-400 font-semibold underline">${link.text}</a>.`);
        modifiedContent = paragraphs.join("\n\n");
    } else {
        modifiedContent += ` <a href="${link.url}" class="text-indigo-600 dark:text-indigo-400 font-semibold underline">${link.text}</a>`;
    }
  });
  return modifiedContent;
}
