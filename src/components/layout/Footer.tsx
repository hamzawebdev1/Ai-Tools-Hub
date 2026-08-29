import React from "react";
import { Sparkles, ShieldCheck, Zap, Lock } from "lucide-react";
import { CATEGORIES_DATA } from "../../data/categoriesData";
import { TOOLS_DATA } from "../../data/toolsData";
import { navigateTo } from "../../services/routerService";

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

  const handleToolClick = (slug: string, e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    if (onSelectTool) onSelectTool(slug);
    setActiveTab("tool-detail");
    navigateTo(`/${slug}`);
  };

  const handleCatClick = (slug: string, e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    if (onSelectCategory) onSelectCategory(slug);
    setActiveTab("category-detail");
    navigateTo(`/category/${slug}`);
  };

  const handlePageClick = (tab: string, path: string, e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    setActiveTab(tab);
    navigateTo(path);
  };

  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 text-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <a
              href="/"
              onClick={(e) => handlePageClick("home", "/", e)}
              className="flex items-center gap-2.5 cursor-pointer group inline-flex"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 p-0.5 shadow-md text-white flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg text-slate-900 dark:text-white">
                Mehzan <span className="text-indigo-600 dark:text-indigo-400">Tools Hub</span>
              </span>
            </a>

            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed max-w-sm">
              The premier free suite of web-native utility tools for PDF manipulation, image processing, text formatting, and developer tasks. Built for speed, security, and privacy on Mehzan Tools Hub.
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
                  <a
                    href={`/${tool.slug}`}
                    onClick={(e) => handleToolClick(tool.slug, e)}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left cursor-pointer inline-block"
                  >
                    {tool.name}
                  </a>
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
                  <a
                    href={`/category/${cat.slug}`}
                    onClick={(e) => handleCatClick(cat.slug, e)}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left cursor-pointer inline-block"
                  >
                    {cat.name}
                  </a>
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
                <a
                  href="/blog"
                  onClick={(e) => handlePageClick("blog", "/blog", e)}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer inline-block"
                >
                  Blog & AI Guides
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  onClick={(e) => handlePageClick("about", "/about", e)}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer inline-block"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/author/alex-rivera"
                  onClick={(e) => handlePageClick("author-alex-rivera", "/author/alex-rivera", e)}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer inline-block"
                >
                  Editorial Board & Authors
                </a>
              </li>
              <li>
                <a
                  href="/admin"
                  onClick={(e) => handlePageClick("admin", "/admin", e)}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-bold text-indigo-500 cursor-pointer inline-flex items-center gap-1"
                >
                  Admin Control Panel
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  onClick={(e) => handlePageClick("contact", "/contact", e)}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer inline-block"
                >
                  Contact Support
                </a>
              </li>
              <li>
                <a
                  href="/feedback"
                  onClick={(e) => handlePageClick("feedback", "/feedback", e)}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer inline-block"
                >
                  Community Feedback
                </a>
              </li>
              <li>
                <a
                  href="/suggest-tool"
                  onClick={(e) => handlePageClick("suggest-tool", "/suggest-tool", e)}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer inline-block"
                >
                  Suggest a Tool
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  onClick={(e) => handlePageClick("privacy", "/privacy", e)}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer inline-block"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  onClick={(e) => handlePageClick("terms", "/terms", e)}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer inline-block"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="/disclaimer"
                  onClick={(e) => handlePageClick("disclaimer", "/disclaimer", e)}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer inline-block"
                >
                  Disclaimer & Ad Disclosure
                </a>
              </li>
              <li>
                <a
                  href="/cookie-policy"
                  onClick={(e) => handlePageClick("cookie-policy", "/cookie-policy", e)}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer inline-block"
                >
                  Cookie Policy
                </a>
              </li>
              <li>
                <a
                  href="/copyright"
                  onClick={(e) => handlePageClick("copyright", "/copyright", e)}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer inline-block"
                >
                  Copyright Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 dark:text-slate-500 text-[11px]">
          <div>
            <p className="font-medium text-slate-600 dark:text-slate-400">© {new Date().getFullYear()} Mehzan Digital. All Rights Reserved.</p>
            <p className="text-slate-500 dark:text-slate-400 font-semibold mt-0.5">Powered by Mehzan Digital Team</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <a
              href="/privacy"
              onClick={(e) => handlePageClick("privacy", "/privacy", e)}
              className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
            >
              Privacy Policy
            </a>
            <span>•</span>
            <a
              href="/terms"
              onClick={(e) => handlePageClick("terms", "/terms", e)}
              className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
            >
              Terms of Service
            </a>
            <span>•</span>
            <a
              href="/disclaimer"
              onClick={(e) => handlePageClick("disclaimer", "/disclaimer", e)}
              className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
            >
              Disclaimer
            </a>
            <span>•</span>
            <a
              href="/copyright"
              onClick={(e) => handlePageClick("copyright", "/copyright", e)}
              className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
            >
              Copyright Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
