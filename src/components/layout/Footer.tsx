import React from "react";
import { Sparkles, ShieldCheck, Zap, Lock } from "lucide-react";
import { CATEGORIES_DATA } from "../../data/categoriesData";
import { TOOLS_DATA } from "../../data/toolsData";

interface FooterProps {
  setActiveTab: (tab: string) => void;
  onSelectCategory?: (slug: string) => void;
  onSelectTool?: (slug: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  setActiveTab,
  onSelectCategory,
  onSelectTool,
}) => {
  const popularTools = TOOLS_DATA.slice(0, 6);

  const handleToolClick = (slug: string) => {
    if (onSelectTool) onSelectTool(slug);
    setActiveTab("tool-detail");
  };

  const handleCatClick = (slug: string) => {
    if (onSelectCategory) onSelectCategory(slug);
    setActiveTab("category-detail");
  };

  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 text-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div
              onClick={() => setActiveTab("home")}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 p-0.5 shadow-md text-white flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg text-slate-900 dark:text-white">
                UtilityTools <span className="text-indigo-600 dark:text-indigo-400">Hub</span>
              </span>
            </div>

            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed max-w-sm">
              The premier free suite of web-native utility tools for PDF manipulation, image processing, text formatting, and developer tasks. Built for performance, privacy, and speed.
            </p>

            <div className="flex items-center gap-3 pt-2 text-[11px] font-medium text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 100% Secure Client-Side
              </span>
              <span className="inline-flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500" /> Core Web Vitals Ready
              </span>
              <span className="inline-flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-indigo-500" /> Zero Upload Privacy
              </span>
            </div>
          </div>

          {/* Popular Tools Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Popular Utilities
            </h4>
            <ul className="space-y-2">
              {popularTools.map((tool) => (
                <li key={tool.id}>
                  <button
                    onClick={() => handleToolClick(tool.slug)}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left cursor-pointer"
                  >
                    {tool.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Categories
            </h4>
            <ul className="space-y-2">
              {CATEGORIES_DATA.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => handleCatClick(cat.slug)}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left cursor-pointer"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Legal Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Resources & Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setActiveTab("blog")} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">
                  Blog & AI Guides
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab("about")} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab("author-alex-rivera")} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">
                  Editorial Board & Authors
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab("admin")} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-bold text-indigo-500 cursor-pointer flex items-center gap-1">
                  Admin Control Panel
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab("contact")} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">
                  Contact Support
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab("feedback")} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">
                  Community Feedback
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab("suggest-tool")} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">
                  Suggest a Tool
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab("privacy")} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab("terms")} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab("disclaimer")} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">
                  Disclaimer & Ad Disclosure
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab("cookie-policy")} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">
                  Cookie Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 dark:text-slate-500 text-[11px]">
          <p>© 2026 Utility Tools Hub. All rights reserved. Powered by high-performance browser engines & Cloud Run edge containers.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer" onClick={() => setActiveTab("privacy")}>
              GDPR Compliant
            </span>
            <span>•</span>
            <span className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer" onClick={() => setActiveTab("disclaimer")}>
              AdSense Certified
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
