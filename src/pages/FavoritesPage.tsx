import React from "react";
import { Bookmark, Sparkles } from "lucide-react";
import { AITool } from "../types";
import { ToolCard } from "../components/tools/ToolCard";
import { Breadcrumb } from "../components/layout/Breadcrumb";
import { AdBanner } from "../components/layout/AdBanner";
import { SchemaHead } from "../components/layout/SchemaHead";

interface FavoritesPageProps {
  tools: AITool[];
  onSelectTool: (slug: string) => void;
  favorites: string[];
  onToggleFavorite: (toolId: string, e: React.MouseEvent) => void;
  setActiveTab: (tab: string) => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({
  tools,
  onSelectTool,
  favorites,
  onToggleFavorite,
  setActiveTab,
}) => {
  const favoriteTools = tools.filter((t) => favorites.includes(t.id));

  return (
    <>
      <SchemaHead
        title="Bookmarked Favorites - Mehzan Tools Hub"
        description="Access your saved favorite AI utilities instantly in one clean dashboard layout."
      />

      <div className="space-y-6 pb-16">
        <Breadcrumb items={[{ label: "Saved Favorites", active: true }]} />

        <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-pink-500 fill-pink-500" />
            Bookmarked Tools
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Quick launcher for your saved tools ({favoriteTools.length} bookmarked)
          </p>
        </div>

        <AdBanner placement="header" slotId="favorites-top-ad" />

        {favoriteTools.length === 0 ? (
          <div className="py-16 text-center space-y-3 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
            <Bookmark className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
              No Favorite Tools Saved Yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Click the bookmark icon on any tool card in the catalog to pin it directly to this workspace.
            </p>
            <button
              onClick={() => setActiveTab("all-tools")}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs cursor-pointer shadow-md"
            >
              Browse All Tools
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteTools.map((tool) => (
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
      </div>
    </>
  );
};
