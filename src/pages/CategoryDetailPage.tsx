import React from "react";
import { AITool } from "../types";
import { CATEGORIES_DATA, CATEGORY_GUIDES } from "../data/categoriesData";
import { getUrlForRoute } from "../services/routerService";
import { ToolCard } from "../components/tools/ToolCard";
import { Breadcrumb } from "../components/layout/Breadcrumb";
import { AdBanner } from "../components/layout/AdBanner";
import { SchemaHead } from "../components/layout/SchemaHead";
import { ReviewCTA } from "../components/common/ReviewCTA";
import { CheckCircle, Shield, Zap, Sparkles, HelpCircle, Layers } from "lucide-react";

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
  const guide = CATEGORY_GUIDES[category.id];

  const longDesc = guide?.longDescription || category.description;
  const techOverview = guide?.technicalOverview || "Executed high-speed client-side or transient secure processing in modern browser RAM.";
  const privacyGuarantee = guide?.privacyGuarantee || "100% Client-Side Private Processing. Your files and data remain strictly on your device.";
  const workflows = guide?.commonWorkflows || [
    "Accelerating daily work tasks with zero software installation requirements.",
    "Processing data privately inside modern web browsers with instantaneous response.",
    "Exporting formatted files and results directly to your local device memory."
  ];
  const faqs = guide?.faqs || [
    {
      question: `Are tools in ${category.name} completely free?`,
      answer: `Yes, all ${category.name} on Mehzan Tools Hub are 100% free with unlimited usage and zero paywalls.`
    },
    {
      question: `How does privacy work for ${category.name}?`,
      answer: privacyGuarantee
    }
  ];

  return (
    <>
      <SchemaHead
        title={`${category.name} Online Suite - Free Browser Utilities | Mehzan Tools Hub`}
        description={longDesc.slice(0, 160)}
      />

      <div className="space-y-8 pb-12">
        <Breadcrumb
          items={[
            { label: "Categories", href: getUrlForRoute("categories"), onClick: () => setActiveTab("categories") },
            { label: category.name, href: getUrlForRoute("category-detail", { categorySlug: category.slug }), active: true },
          ]}
        />

        {/* Category Hero Header */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-6 sm:p-10 text-white space-y-4 shadow-xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>{category.count} Verified Utilities</span>
            </span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Browser Private</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">{category.name}</h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            {longDesc}
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-400 border-t border-slate-800/80">
            <span className="flex items-center gap-1 text-slate-300">
              <Zap className="w-3.5 h-3.5 text-indigo-400" /> Fast Execution
            </span>
            <span className="flex items-center gap-1 text-slate-300">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Zero Sign-Up Wall
            </span>
            <span className="flex items-center gap-1 text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Updated Daily
            </span>
          </div>
        </div>

        <AdBanner placement="header" slotId="category-detail-ad" />

        {/* Category Technical Overview & Workflows */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-500" />
              Category Overview & Technical Architecture
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {techOverview}
            </p>

            <div className="pt-3 space-y-2 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Common Professional Workflows
              </h3>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {workflows.map((wf, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{wf}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-500" />
              Privacy & Security Guarantee
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {privacyGuarantee}
            </p>
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs">
              <strong>OWASP & GDPR Compliant:</strong> Zero persistent server logs, zero file retained storage, and zero behavioral ad tracking.
            </div>
          </div>
        </div>

        {/* All Tools Grid in Category */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              All {category.name} ({categoryTools.length})
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Click any tool to launch instantly
            </span>
          </div>

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
        </div>

        {/* Category FAQs */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-500" />
            Frequently Asked Questions about {category.name}
          </h2>
          <div className="space-y-3 pt-2">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">{faq.question}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related Category Hubs */}
        <div className="pt-6 space-y-4 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
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
