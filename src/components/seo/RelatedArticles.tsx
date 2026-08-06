import React from "react";
import { getAutoRelatedArticles } from "../../services/seoService";
import { SeoImage } from "./SeoImage";
import { BookOpen, Clock, ArrowRight } from "lucide-react";

interface RelatedArticlesProps {
  categorySlug?: string;
  toolTags?: string[];
  onSelectPost: (slug: string) => void;
}

export const RelatedArticles: React.FC<RelatedArticlesProps> = ({
  categorySlug,
  toolTags,
  onSelectPost,
}) => {
  const articles = getAutoRelatedArticles(categorySlug, toolTags, 2);

  if (!articles || articles.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Recommended Guides & Tutorials
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((post) => (
          <article
            key={post.id}
            onClick={() => onSelectPost(post.slug)}
            className="group cursor-pointer flex flex-col sm:flex-row bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:border-indigo-500/50 hover:shadow-md transition-all duration-200"
          >
            <div className="sm:w-2/5 shrink-0">
              <SeoImage
                src={post.image}
                alt={post.title}
                aspectRatio="16/9"
                className="h-full min-h-[140px]"
              />
            </div>

            <div className="p-4 flex flex-col justify-between flex-1">
              <div>
                <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 mb-2">
                  {post.category}
                </span>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">
                  {post.title}
                </h3>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {post.readTime}
                </span>
                <span className="flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                  Read <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
