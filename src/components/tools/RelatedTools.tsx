import React from "react";
import { Sparkles, Flame, Star, Zap } from "lucide-react";
import { AITool } from "../../types";
import { ToolCard } from "./ToolCard";

interface RelatedToolsProps {
  currentToolId?: string;
  category?: string;
  tools: AITool[];
  onSelectTool: (slug: string) => void;
  favorites: string[];
  onToggleFavorite: (toolId: string, e: React.MouseEvent) => void;
}

export const RelatedTools: React.FC<RelatedToolsProps> = ({
  currentToolId,
  category,
  tools,
  onSelectTool,
  favorites,
  onToggleFavorite,
}) => {
  const filtered = tools.filter((t) => t.id !== currentToolId);

  const related = category
    ? filtered.filter((t) => t.category === category).slice(0, 3)
    : filtered.slice(0, 3);

  const trending = filtered.filter((t) => t.isTrending).slice(0, 3);
  const popular = filtered.filter((t) => t.isPopular).slice(0, 3);

  return (
    <div className="space-y-12 my-12">
      {/* Related Tools Section */}
      {related.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Related AI Tools
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {related.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                onSelectTool={onSelectTool}
                isFavorite={favorites.includes(tool.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        </section>
      )}

      {/* Trending & Popular Tools Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Flame className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Trending Right Now
            </h3>
          </div>
          <div className="space-y-3">
            {trending.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                onSelectTool={onSelectTool}
                isFavorite={favorites.includes(tool.id)}
                onToggleFavorite={onToggleFavorite}
                layout="list"
              />
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Star className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Most Popular Tools
            </h3>
          </div>
          <div className="space-y-3">
            {popular.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                onSelectTool={onSelectTool}
                isFavorite={favorites.includes(tool.id)}
                onToggleFavorite={onToggleFavorite}
                layout="list"
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
