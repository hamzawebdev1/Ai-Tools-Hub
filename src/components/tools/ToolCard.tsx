import React from "react";
import {
  PenTool,
  RefreshCw,
  Code,
  FileText,
  CheckCircle,
  TrendingUp,
  Share2,
  Image as ImageIcon,
  Briefcase,
  Zap,
  Star,
  Bookmark,
  ArrowRight,
  Flame,
} from "lucide-react";
import { AITool } from "../../types";

interface ToolCardProps {
  tool: AITool;
  onSelectTool: (slug: string) => void;
  isFavorite: boolean;
  onToggleFavorite: (toolId: string, e: React.MouseEvent) => void;
  layout?: "grid" | "list";
}

export const getToolIcon = (iconName: string) => {
  switch (iconName) {
    case "PenTool":
      return <PenTool className="w-5 h-5" />;
    case "RefreshCw":
      return <RefreshCw className="w-5 h-5" />;
    case "Code":
      return <Code className="w-5 h-5" />;
    case "FileText":
      return <FileText className="w-5 h-5" />;
    case "CheckCircle":
      return <CheckCircle className="w-5 h-5" />;
    case "TrendingUp":
      return <TrendingUp className="w-5 h-5" />;
    case "Share2":
      return <Share2 className="w-5 h-5" />;
    case "Image":
      return <ImageIcon className="w-5 h-5" />;
    case "Briefcase":
      return <Briefcase className="w-5 h-5" />;
    default:
      return <Zap className="w-5 h-5" />;
  }
};

export const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  onSelectTool,
  isFavorite,
  onToggleFavorite,
  layout = "grid",
}) => {
  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button")) return;

    if (
      !e.defaultPrevented &&
      !e.ctrlKey &&
      !e.metaKey &&
      !e.shiftKey &&
      !e.altKey &&
      e.button === 0
    ) {
      e.preventDefault();
      onSelectTool(tool.slug);
    }
  };

  if (layout === "list") {
    return (
      <article
        onClick={handleCardClick}
        className="group relative rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md p-4 sm:p-5 shadow-xs hover:shadow-xl hover:border-indigo-500/40 transition-all duration-300 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="flex items-start gap-4 flex-1">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            {getToolIcon(tool.iconName)}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                <a href={`/${tool.slug}`} onClick={handleCardClick} className="focus:outline-hidden">
                  {tool.name}
                </a>
              </h3>
              {tool.isTrending && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-[10px] font-bold">
                  <Flame className="w-3 h-3" /> Trending
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
              {tool.description}
            </p>
            <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-amber-500 font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-500" /> {tool.rating} ({tool.ratingCount})
              </span>
              <span>•</span>
              <span>{(tool.usageCount / 1000).toFixed(0)}k uses</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-800">
          <button
            type="button"
            aria-label={isFavorite ? `Remove ${tool.name} from favorites` : `Save ${tool.name} to favorites`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite(tool.id, e);
            }}
            className={`p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl border transition-colors cursor-pointer ${
              isFavorite
                ? "bg-pink-500/10 border-pink-500/30 text-pink-500"
                : "border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isFavorite ? "fill-pink-500" : ""}`} />
          </button>
          <a
            href={`/${tool.slug}`}
            onClick={handleCardClick}
            className="px-4 py-2.5 min-h-[44px] rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
          >
            <span>Run Tool</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </article>
    );
  }

  return (
    <article
      onClick={handleCardClick}
      className="group relative rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md p-5 shadow-xs hover:shadow-2xl hover:border-indigo-500/40 transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      <div className="space-y-3">
        {/* Header Badges & Favorite */}
        <div className="flex items-start justify-between gap-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            {getToolIcon(tool.iconName)}
          </div>

          <div className="flex items-center gap-1.5">
            {tool.isTrending && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-[10px] font-bold">
                <Flame className="w-3 h-3" /> Trending
              </span>
            )}
            <button
              type="button"
              aria-label={isFavorite ? `Remove ${tool.name} from favorites` : `Save ${tool.name} to favorites`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleFavorite(tool.id, e);
              }}
              className={`p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl border transition-colors cursor-pointer ${
                isFavorite
                  ? "bg-pink-500/10 border-pink-500/30 text-pink-500"
                  : "border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isFavorite ? "fill-pink-500" : ""}`} />
            </button>
          </div>
        </div>

        {/* Name & Tagline */}
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            <a href={`/${tool.slug}`} onClick={handleCardClick} className="focus:outline-hidden">
              {tool.name}
            </a>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {tool.tagline}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {tool.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Metrics */}
      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-amber-500 font-semibold">
          <Star className="w-3.5 h-3.5 fill-amber-500" />
          <span>{tool.rating}</span>
          <span className="text-[10px] text-slate-400">({tool.ratingCount})</span>
        </div>

        <a
          href={`/${tool.slug}`}
          onClick={handleCardClick}
          className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
        >
          Try Now <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </article>
  );
};
