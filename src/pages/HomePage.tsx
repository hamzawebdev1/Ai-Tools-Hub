import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Search,
  Zap,
  ShieldCheck,
  Flame,
  ArrowRight,
  CheckCircle,
  Star,
  Cpu,
  Layers,
  Lock,
} from "lucide-react";
import { AITool } from "../types";
import { CATEGORIES_DATA } from "../data/categoriesData";
import { ToolCard } from "../components/tools/ToolCard";
import { AdBanner } from "../components/layout/AdBanner";
import { Newsletter } from "../components/layout/Newsletter";
import { SchemaHead } from "../components/layout/SchemaHead";
import { LazySection } from "../components/common/LazySection";
import { DirectoryBadgesMarquee } from "../components/common/DirectoryBadgesMarquee";

interface HomePageProps {
  tools: AITool[];
  onSelectTool: (slug: string) => void;
  onSelectCategory: (slug: string) => void;
  favorites: string[];
  onToggleFavorite: (toolId: string, e: React.MouseEvent) => void;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  tools,
  onSelectTool,
  onSelectCategory,
  favorites,
  onToggleFavorite,
  setActiveTab,
  searchQuery,
  setSearchQuery,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const popularAndTrendingTools = tools.filter((t) => t.isPopular || t.isTrending);

  const displayedTools =
    activeCategory === "all"
      ? popularAndTrendingTools.slice(0, 12)
      : tools.filter((t) => t.category === activeCategory).slice(0, 12);

  const trendingTools = tools.filter((t) => t.isTrending);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveTab("search");
    }
  };

  return (
    <>
      <SchemaHead
        title="Mehzan Tools Hub - Free Online Utility Tools for Text, PDF, Images & Developers"
        description="Access 150+ free online utility tools including PDF merger, image compressor, JSON formatter, word counter, and QR generator. Fast, private, and 100% browser-based."
      />

      <div className="space-y-12 pb-16">
        {/* Hero Section */}
        <section className="relative pt-8 md:pt-12 pb-12 overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-10 md:p-16 border border-slate-800 shadow-2xl">
          {/* Background Ambient Glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-indigo-600/20 blur-3xl pointer-events-none rounded-full" />
          <div className="absolute top-1/3 -right-20 w-80 h-80 bg-purple-500/15 blur-3xl pointer-events-none rounded-full" />

          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <img
                src="/hero-icon.svg"
                alt="Mehzan Tools Hub Emblem"
                width={56}
                height={56}
                loading="eager"
                fetchPriority="high"
                className="w-14 h-14 rounded-2xl shadow-lg border border-indigo-400/30 shrink-0"
              />
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold tracking-wide">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Browser-First Privacy & Speed</span>
              </div>
            </div>

            {/* Directory Badges Marquee */}
            <div className="pt-2 w-full max-w-2xl mx-auto">
              <DirectoryBadgesMarquee />
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight sm:leading-none">
              Free Online Tools That{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                Just Work
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Convert, compress, calculate, format, and generate instantly with fast, secure browser-based online tools. Zero sign-up wall, zero file uploads required for local utilities.
            </p>

            {/* Hero Search Box */}
            <form
              onSubmit={handleSearchSubmit}
              className="relative max-w-2xl mx-auto mt-6"
            >
              <div className="relative flex items-center">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 150+ tools (e.g. PDF Compressor, JSON Formatter, Word Counter)..."
                  aria-label="Search all online tools"
                  className="w-full pl-12 pr-32 py-4 rounded-2xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 shadow-xl"
                />
                <button
                  type="submit"
                  className="absolute right-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-md transition-colors cursor-pointer"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Quick Keyword Pills */}
            <div className="flex items-center justify-center gap-2 flex-wrap text-xs text-slate-400 pt-2">
              <span>Popular:</span>
              {["Image Compressor", "PDF Merger", "JSON Formatter", "Word Counter", "QR Code Generator"].map((kw, i) => (
                <button
                  key={i}
                  onClick={() => {
                    const tool = tools.find((t) => t.name.toLowerCase().includes(kw.toLowerCase()));
                    if (tool) onSelectTool(tool.slug);
                    else {
                      setSearchQuery(kw);
                      setActiveTab("search");
                    }
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors cursor-pointer"
                >
                  {kw}
                </button>
              ))}
            </div>

            {/* Feature Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-slate-800/80 text-left">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg font-bold text-white">&lt; 350ms</div>
                  <div className="text-[11px] text-slate-400">Execution Speed</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg font-bold text-white">100% Free</div>
                  <div className="text-[11px] text-slate-400">No Credit Card</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg font-bold text-white">24h Purge</div>
                  <div className="text-[11px] text-slate-400">Private & Secure</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg font-bold text-white">Sub-100ms</div>
                  <div className="text-[11px] text-slate-400">Fast Execution Engine</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AdSense Top Header Banner Placement */}
        <AdBanner placement="header" slotId="home-top-header-ad" />

        {/* Category Filters bar */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Explore Tool Categories
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pick a category to find specialized online utilities
              </p>
            </div>
            <button
              onClick={() => setActiveTab("categories")}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              View All Categories <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
                activeCategory === "all"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              🔥 Popular Tools
            </button>
            {CATEGORIES_DATA.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                {cat.name} ({cat.count})
              </button>
            ))}
          </div>
        </section>

        {/* Popular Tools Grid */}
        <section className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                onSelectTool={onSelectTool}
                isFavorite={favorites.includes(tool.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>

          {/* Explore All Tools Banner CTA */}
          <div className="pt-2 text-center">
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900/50 to-purple-950/40 border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div className="text-left space-y-1">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-500 shrink-0" />
                  {activeCategory === "all"
                    ? "Looking for all 500+ free tools?"
                    : `Explore all ${CATEGORIES_DATA.find((c) => c.id === activeCategory)?.name || activeCategory} utilities`}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  {activeCategory === "all"
                    ? "Browse our complete directory of 500+ online tools or use the search bar above."
                    : `Access the complete list of tools in the ${CATEGORIES_DATA.find((c) => c.id === activeCategory)?.name || activeCategory} category.`}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto shrink-0 justify-end">
                {activeCategory !== "all" && (
                  <button
                    onClick={() => onSelectCategory(activeCategory)}
                    className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors border border-slate-700 cursor-pointer"
                  >
                    View Category Page
                  </button>
                )}
                <button
                  onClick={() => setActiveTab("all-tools")}
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-indigo-600/30 flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 cursor-pointer hover:scale-105"
                >
                  <span>Browse All 500+ Tools</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* AdSense In-Content Banner Placement */}
        <AdBanner placement="in-content" slotId="home-middle-ad" />

        {/* Featured Trending Section */}
        <LazySection placeholderHeight="220px">
          <section className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    Trending & High Volume Tools
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Most requested utilities by developers, writers, and marketers
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trendingTools.slice(0, 4).map((tool) => (
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
        </LazySection>

        {/* Trust & Performance Features */}
        <LazySection placeholderHeight="180px">
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white">
                Core Web Vitals Optimized
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Designed with minimal DOM footprint, fast static SSR rendering, zero cumulative layout shifts, and sub-300ms time to interactive.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white">
                100% In-Browser Privacy
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Local PDF, image, developer, text, and calculator conversions process entirely in client RAM. Your files never touch remote servers.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white">
                Google AdSense Compliant
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Strictly adheres to publisher guidelines with valuable content structures, clear disclosure labels, and zero invasive popups.
              </p>
            </div>
          </section>
        </LazySection>

        {/* About Mehzan Tools Hub & Comprehensive Overview */}
        <LazySection placeholderHeight="300px">
          <section className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-10 space-y-6 shadow-sm">
            <div className="max-w-3xl space-y-3">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                Independent Utility Platform
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                About Mehzan Tools Hub
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong>Mehzan Tools Hub</strong> (operated by <em>Mehzan Digital</em>) is a comprehensive online directory and suite of 330+ high-precision web utilities. Built for software engineers, digital marketers, content creators, students, and administrative staff across the US, UK, Canada, Europe, and globally, our platform eliminates the hassle of installing heavy desktop applications, enduring subscription paywalls, or uploading sensitive files to unknown remote servers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  What You Can Do on Mehzan Tools Hub
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  <li>• <strong>PDF Utilities:</strong> Merge, split, compress, unlock, convert, and OCR PDF documents client-side.</li>
                  <li>• <strong>Image Editing:</strong> Compress PNG/JPG/WebP, crop photos, convert graphic formats, and make favicons.</li>
                  <li>• <strong>Developer Utilities:</strong> Format JSON, decode JWTs, test Regex, minify code, and beautify SQL queries.</li>
                  <li>• <strong>Text & String Tools:</strong> Live word count, case conversion, diff checking, and character limits.</li>
                  <li>• <strong>Calculators:</strong> High-precision loan EMI, age difference, BMI, percentage, and unit converters.</li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-indigo-500" />
                  Why Choose Our Browser-First Architecture?
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  <li>• <strong>Client-Side Processing:</strong> Local file converters run in WebAssembly and browser RAM.</li>
                  <li>• <strong>Zero Account Wall:</strong> Instant access to all 330+ tools without mandatory registration.</li>
                  <li>• <strong>Sub-300ms Speed:</strong> Optimized algorithms execute calculations and conversions in milliseconds.</li>
                  <li>• <strong>Global Standards Compliant:</strong> Supports US/EU paper formats, multi-currency metrics, and character sets.</li>
                  <li>• <strong>Clean Publisher Standards:</strong> Ad-safe layout with transparent disclosures and zero malware popups.</li>
                </ul>
              </div>
            </div>
          </section>
        </LazySection>

        {/* Category Navigation Directory */}
        <LazySection placeholderHeight="250px">
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Browse Tool Hubs by Category
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Explore specialized category hubs designed for specific technical workflows
                </p>
              </div>
              <button
                onClick={() => setActiveTab("categories")}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                View All Categories <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {CATEGORIES_DATA.map((cat) => (
                <a
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  onClick={(e) => {
                    if (e.metaKey || e.ctrlKey) return;
                    e.preventDefault();
                    onSelectCategory(cat.id);
                  }}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all shadow-xs hover:shadow-md group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {cat.name}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {cat.count} tools
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </a>
              ))}
            </div>
          </section>
        </LazySection>

        {/* Newsletter Section */}
        <LazySection placeholderHeight="200px">
          <Newsletter />
        </LazySection>

        {/* FAQ Section with SEO Schema */}
        <LazySection placeholderHeight="300px">
          <section className="space-y-6 pt-4">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Frequently Asked Questions
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Everything you need to know about Mehzan Tools Hub
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {[
                {
                  q: "Are all 330+ utility tools on this website completely free?",
                  a: "Yes! Mehzan Tools Hub provides 100% free online browser utility tools with instant execution and zero subscription paywalls.",
                },
                {
                  q: "Do I need to create an account or provide payment details?",
                  a: "No registration or payment details are required. All tools are immediately accessible to all site visitors.",
                },
                {
                  q: "Is my document and text data kept private?",
                  a: "Absolutely. All local PDF, image, text, developer, and calculator conversions run client-side in your browser RAM sandbox. Your data is never uploaded to remote servers.",
                },
                {
                  q: "Can I use Mehzan Tools Hub on mobile devices?",
                  a: "Yes! The platform is fully responsive and optimized for mobile screens on Chrome, Safari, Firefox, and Edge across iOS and Android.",
                },
                {
                  q: "Who operates Mehzan Tools Hub?",
                  a: "Mehzan Tools Hub is owned and maintained by Mehzan Digital, an independent software publisher dedicated to fast, private, accessible web software.",
                },
              ].map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 p-5 space-y-2"
                >
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-indigo-500 shrink-0" />
                    {faq.q}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 pl-6 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </LazySection>
      </div>
    </>
  );
};
