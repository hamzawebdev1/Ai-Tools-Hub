import { TOOLS_DATA } from "../data/toolsData";

export function getRelatedTools(idOrCategory: string, limit: number = 4) {
  const currentTool = TOOLS_DATA.find((t) => t.id === idOrCategory);
  
  const related = TOOLS_DATA.filter((t) => {
    if (currentTool) {
      return t.category === currentTool.category && t.id !== currentTool.id;
    } else {
      return t.category === idOrCategory;
    }
  }).slice(0, limit);

  const baseUrl = ((import.meta as any).env?.VITE_APP_URL) || "https://www.mehzandigital.com";

  return related.map((t) => ({
    ...t,
    url: `${baseUrl}/en/${t.slug}`,
  }));
}
