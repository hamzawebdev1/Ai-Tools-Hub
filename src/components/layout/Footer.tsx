import React from "react";
import { Sparkles, ShieldCheck, Zap, Lock } from "lucide-react";
import { CATEGORIES_DATA } from "../../data/categoriesData";
import { TOOLS_DATA } from "../../data/toolsData";
import { navigateTo } from "../../services/routerService";
import { DirectoryBadgesMarquee } from "../common/DirectoryBadgesMarquee";

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
  const popularTools = TOOLS_DATA.filter((t) => t.isPopular || t.isFeatured || t.isTrending).slice(0, 14);

  const handleToolClick = (slug: string, e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    if (onSelectTool) onSelectTool(slug);
    setActiveTab("tool-detail");
    navigateTo(`/en/${slug}`);
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

            <div className="flex items-center gap-3 pt-2 text-[11px] font-medium text-slate-500 dark:text-slate-400 flex-wrap">
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

            {/* Social Links */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://twitter.com/mehzandigital"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Mehzan Digital on Twitter"
                className="w-8 h-8 rounded-lg bg-slate-200/80 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a
                href="https://github.com/mehzandigital"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Mehzan Digital on GitHub"
                className="w-8 h-8 rounded-lg bg-slate-200/80 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              </a>
              <a
                href="https://linkedin.com/company/mehzandigital"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Mehzan Digital on LinkedIn"
                className="w-8 h-8 rounded-lg bg-slate-200/80 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
            </div>

            {/* Directory Badges Marquee */}
            <div className="pt-2 w-full">
              <DirectoryBadgesMarquee />
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
                    href={`/en/${tool.slug}`}
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
              Tool Categories
            </h4>
            <ul className="space-y-2">
              {CATEGORIES_DATA.map((cat) => (
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
              <li className="pt-1 font-bold text-indigo-600 dark:text-indigo-400">
                <a
                  href="/categories"
                  onClick={(e) => handlePageClick("categories", "/categories", e)}
                  className="hover:underline cursor-pointer"
                >
                  All Categories Hub →
                </a>
              </li>
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
                  href="/author/hamza"
                  onClick={(e) => handlePageClick("author-hamza", "/author/hamza", e)}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer inline-block"
                >
                  Hamza (Founder & Author)
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
        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-600 dark:text-slate-400 text-xs">
          <div>
            <p className="font-medium text-slate-700 dark:text-slate-300">© {new Date().getFullYear()} Mehzan Digital. All Rights Reserved.</p>
            <p className="text-slate-600 dark:text-slate-400 font-semibold mt-0.5">Powered by Mehzan Digital Team</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <a
              href="/privacy"
              onClick={(e) => handlePageClick("privacy", "/privacy", e)}
              className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer py-1 min-h-[44px] flex items-center"
            >
              Privacy Policy
            </a>
            <span>•</span>
            <a
              href="/terms"
              onClick={(e) => handlePageClick("terms", "/terms", e)}
              className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer py-1 min-h-[44px] flex items-center"
            >
              Terms of Service
            </a>
            <span>•</span>
            <a
              href="/disclaimer"
              onClick={(e) => handlePageClick("disclaimer", "/disclaimer", e)}
              className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer py-1 min-h-[44px] flex items-center"
            >
              Disclaimer
            </a>
            <span>•</span>
            <a
              href="/copyright"
              onClick={(e) => handlePageClick("copyright", "/copyright", e)}
              className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer py-1 min-h-[44px] flex items-center"
            >
              Copyright Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
