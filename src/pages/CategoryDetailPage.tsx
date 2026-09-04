import React from "react";
import { AITool } from "../types";
import { CATEGORIES_DATA } from "../data/categoriesData";
import { getUrlForRoute } from "../services/routerService";
import { ToolCard } from "../components/tools/ToolCard";
import { Breadcrumb } from "../components/layout/Breadcrumb";
import { AdBanner } from "../components/layout/AdBanner";
import { SchemaHead } from "../components/layout/SchemaHead";
import { ReviewCTA } from "../components/common/ReviewCTA";

interface CategoryDetailPageProps {
  categorySlug: string;
  tools: AITool[];
  onSelectTool: (slug: string) => void;
  favorites: string[];
  onToggleFavorite: (toolId: string, e: React.MouseEvent) => void;
  setActiveTab: (tab: string) => void;
}

export const CategoryDetailPage: React.FC<CategoryDetailPageProps> = ({
  categorySlug,
  tools,
  onSelectTool,
  favorites,
  onToggleFavorite,
  setActiveTab,
}) => {
  const category = CATEGORIES_DATA.find((c) => c.slug === categorySlug) || CATEGORIES_DATA[0];
  const categoryTools = tools.filter((t) => t.category === category.id);

  return (
    <>
      <SchemaHead
        title={`${category.name} AI Tools - Free Online Suite`}
        description={category.description}
      />

      <div className="space-y-6 pb-12">
        <Breadcrumb
          items={[
            { label: "Categories", href: getUrlForRoute("categories"), onClick: () => setActiveTab("categories") },
            { label: category.name, href: getUrlForRoute("category-detail", { categorySlug: category.slug }), active: true },
          ]}
        />

        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 p-6 sm:p-10 text-white space-y-3">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300">
            Category Overview
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold">{category.name}</h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            {category.description}
          </p>
        </div>

        <AdBanner placement="header" slotId="category-detail-ad" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryTools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              onSelectTool={onSelectTool}
              isFavorite={favorites.includes(tool.id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>

        {/* Related Category Hubs */}
        <div className="pt-8 space-y-4 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Explore Other Tool Categories
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {CATEGORIES_DATA.filter((c) => c.slug !== category.slug).map((cat) => (
              <a
                key={cat.id}
                href={`/category/${cat.slug}`}
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey) return;
                  e.preventDefault();
                  setActiveTab("category-detail");
                  window.history.pushState({}, "", `/category/${cat.slug}`);
                }}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-colors"
              >
                <div className="font-bold text-xs text-slate-900 dark:text-white">{cat.name}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">{cat.description}</div>
              </a>
            ))}
          </div>
        </div>

        <ReviewCTA />
      </div>
    </>
  );
};
