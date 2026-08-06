import React from "react";
import { AITool } from "../../types";
import { getAutoRelatedTools } from "../../services/seoService";
import { Star, ArrowRight, Sparkles, Heart } from "lucide-react";

interface RelatedToolsProps {
  currentTool: AITool;
  onSelectTool: (slug: string) => void;
  favorites: string[];
  onToggleFavorite: (toolId: string, e: React.MouseEvent) => void;
}

export const RelatedTools: React.FC<RelatedToolsProps> = ({
  currentTool,
  onSelectTool,
  favorites,
  onToggleFavorite,
}) => {
  const relatedTools = getAutoRelatedTools(currentTool, 3);

  if (!relatedTools || relatedTools.length === 0) return null;

  return (
    <section className="mt-16 pt-10 border-t border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SEO Internal Graph</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Related AI Tools & Alternatives
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Explore similar high-speed AI tools in <span className="font-semibold text-indigo-600 dark:text-indigo-400">{currentTool.category}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedTools.map((tool) => {
          const isFav = favorites.includes(tool.id);
          return (
            <article
              key={tool.id}
              onClick={() => onSelectTool(tool.slug)}
              className="group cursor-pointer flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-200 relative"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-5 h-5" />
                </div>
                <button
                  onClick={(e) => onToggleFavorite(tool.id, e)}
                  aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
                  className={`p-2 rounded-lg transition-colors ${
                    isFav
                      ? "text-rose-500 bg-rose-50 dark:bg-rose-950/40"
                      : "text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFav ? "fill-rose-500" : ""}`} />
                </button>
              </div>

              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                {tool.name}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 mb-4 line-clamp-2 leading-relaxed flex-1">
                {tool.description}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                <div className="flex items-center gap-1 font-medium text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{tool.rating.toFixed(1)}</span>
                  <span className="text-slate-400">({tool.ratingCount})</span>
                </div>

                <span className="flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                  Try Tool <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
