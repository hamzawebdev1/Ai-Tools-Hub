import React from "react";
import { SEOHead } from "../components/seo/SEOHead";
import { ArrowLeft, Search, ShieldAlert, Sparkles } from "lucide-react";
import { navigateTo } from "../services/routerService";

interface Gone410PageProps {
  onNavigate?: (tab: string, slug?: string) => void;
}

export const Gone410Page: React.FC<Gone410PageProps> = ({ onNavigate }) => {
  const handleNav = (tab: string) => {
    if (onNavigate) {
      onNavigate(tab);
    } else {
      navigateTo(tab === "home" ? "/" : `/${tab}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col justify-center items-center px-4 py-16">
      <SEOHead
        title="410 Gone - Page Permanently Removed | Mehzan Tools Hub"
        description="This tool or page has been permanently removed as part of our website quality audit. Browse active high-value tools on Mehzan Tools Hub."
        canonicalUrl="https://www.mehzandigital.com/en/410"
        noIndex={true}
      />

      <div className="max-w-xl w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 text-center space-y-6">
        <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800">
            HTTP 410 Gone
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold mt-4">Page Permanently Removed</h1>
          <p className="text-slate-600 dark:text-slate-300 mt-2 text-sm sm:text-base leading-relaxed">
            This tool page has been permanently retired as part of our quality optimization process. We have streamlined Mehzan Tools Hub to maintain only high-value, fully functional tools.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => handleNav("tools")}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-colors shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            Explore All Tools
          </button>
          <button
            onClick={() => handleNav("home")}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
};
