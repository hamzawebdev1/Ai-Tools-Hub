import React from "react";
import { Search, Sparkles } from "lucide-react";
import { AITool } from "../types";
import { BLOG_POSTS_DATA } from "../data/blogData";
import { CATEGORIES_DATA } from "../data/categoriesData";
import { ToolCard } from "../components/tools/ToolCard";
import { Breadcrumb } from "../components/layout/Breadcrumb";
import { SchemaHead } from "../components/layout/SchemaHead";

interface SearchResultsPageProps {
  query: string;
  tools: AITool[];
  onSelectTool: (slug: string) => void;
  onSelectCategory: (slug: string) => void;
  onSelectPost: (slug: string) => void;
  favorites: string[];
  onToggleFavorite: (toolId: string, e: React.MouseEvent) => void;
  setActiveTab: (tab: string) => void;
}

export const SearchResultsPage: React.FC<SearchResultsPageProps> = ({
  query,
  tools,
  onSelectTool,
  onSelectCategory,
  onSelectPost,
  favorites,
  onToggleFavorite,
  setActiveTab,
}) => {
  const matchingTools = tools.filter(
    (t) =>
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.description.toLowerCase().includes(query.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
  );

  const matchingPosts = BLOG_POSTS_DATA.filter(
    (p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(query.toLowerCase())
  );

  const matchingCategories = CATEGORIES_DATA.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.description.toLowerCase().includes(query.toLowerCase())
  );

  const totalResults = matchingTools.length + matchingPosts.length + matchingCategories.length;

  return (
    <>
      <SchemaHead
        title={`Search Results for "${query}" - Mehzan Tools Hub`}
        description={`Find matching AI tools, articles, and categories for query: ${query}`}
      />

      <div className="space-y-6 pb-16">
        <Breadcrumb items={[{ label: `Search: "${query}"`, active: true }]} />

        <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Search className="w-6 h-6 text-indigo-500" />
            Search Results for <span className="text-indigo-600 dark:text-indigo-400">"{query}"</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Found {totalResults} matching item(s)
          </p>
        </div>

        {/* Matching Categories */}
        {matchingCategories.length > 0 && (
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Matching Categories ({matchingCategories.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {matchingCategories.map((cat) => (
                <a
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  onClick={(e) => {
                    if (
                      !e.defaultPrevented &&
                      !e.ctrlKey &&
                      !e.metaKey &&
                      !e.shiftKey &&
                      !e.altKey &&
                      e.button === 0
                    ) {
                      e.preventDefault();
                      onSelectCategory(cat.slug);
                      setActiveTab("category-detail");
                    }
                  }}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 hover:border-indigo-500 cursor-pointer transition-colors block"
                >
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{cat.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{cat.description}</p>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Matching Tools */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Matching Tools ({matchingTools.length})
          </h3>
          {matchingTools.length === 0 ? (
            <p className="text-xs text-slate-500 py-4">No direct tool matches found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchingTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  onSelectTool={onSelectTool}
                  isFavorite={favorites.includes(tool.id)}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>
          )}
        </section>

        {/* Matching Posts */}
        {matchingPosts.length > 0 && (
          <section className="space-y-3 pt-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Matching Blog Articles ({matchingPosts.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matchingPosts.map((post) => (
                <a
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  onClick={(e) => {
                    if (
                      !e.defaultPrevented &&
                      !e.ctrlKey &&
                      !e.metaKey &&
                      !e.shiftKey &&
                      !e.altKey &&
                      e.button === 0
                    ) {
                      e.preventDefault();
                      onSelectPost(post.slug);
                      setActiveTab("blog-post");
                    }
                  }}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 hover:border-indigo-500 cursor-pointer transition-colors space-y-2 block"
                >
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{post.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{post.excerpt}</p>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
};
