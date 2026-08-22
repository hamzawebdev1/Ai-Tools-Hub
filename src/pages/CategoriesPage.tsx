import React from "react";
import { Grid, ArrowRight, Sparkles } from "lucide-react";
import { CATEGORIES_DATA } from "../data/categoriesData";
import { Breadcrumb } from "../components/layout/Breadcrumb";
import { AdBanner } from "../components/layout/AdBanner";
import { SchemaHead } from "../components/layout/SchemaHead";

interface CategoriesPageProps {
  onSelectCategory: (slug: string) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({ onSelectCategory }) => {
  return (
    <>
      <SchemaHead
        title="AI Tool Categories - Browse by Specialty"
        description="Explore AI tools organized by category: Writing, Software Engineering, SEO Marketing, Social Media, Productive Summaries, and Business."
      />

      <div className="space-y-6 pb-12">
        <Breadcrumb items={[{ label: "Categories", active: true }]} />

        <div className="pb-4 border-b border-slate-200/80 dark:border-slate-800">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Grid className="w-7 h-7 text-indigo-500" />
            AI Tool Categories
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Discover specialized artificial intelligence utilities curated for your exact use case
          </p>
        </div>

        <AdBanner placement="header" slotId="categories-header-ad" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES_DATA.map((category) => (
            <a
              key={category.id}
              href={`/category/${category.slug}`}
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
                  onSelectCategory(category.slug);
                }
              }}
              className="group relative rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md p-6 shadow-xs hover:shadow-2xl hover:border-indigo-500/40 transition-all duration-300 cursor-pointer flex flex-col justify-between block"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${category.color} text-white flex items-center justify-center font-bold shadow-md`}>
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {category.count} Tools
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {category.name}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {category.description}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <span>Browse Category</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </>
  );
};
