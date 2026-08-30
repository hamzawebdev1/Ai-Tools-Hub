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
  const [visibleCount, setVisibleCount] = useState<number>(12);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const filteredTools =
    activeCategory === "all"
      ? tools
      : tools.filter((t) => t.category === activeCategory);

  const trendingTools = tools.filter((t) => t.isTrending);
  const popularTools = tools.filter((t) => t.isPopular);

  useEffect(() => {
    setVisibleCount(12);
  }, [activeCategory]);

  useEffect(() => {
    if (visibleCount >= filteredTools.length) return;
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 24, filteredTools.length));
        }
      },
      { rootMargin: "250px" }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, [visibleCount, filteredTools.length]);

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
              🔥 All Tools ({tools.length})
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

        {/* Tools Grid */}
        <section className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.slice(0, visibleCount).map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                onSelectTool={onSelectTool}
                isFavorite={favorites.includes(tool.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>

          {/* Sentinel & Load More trigger */}
          {visibleCount < filteredTools.length && (
            <div ref={sentinelRef} className="pt-6 text-center">
              <button
                onClick={() => setVisibleCount((prev) => Math.min(prev + 24, filteredTools.length))}
                className="px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer inline-flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-spin" />
                <span>Showing {visibleCount} of {filteredTools.length} tools — Load More</span>
              </button>
            </div>
          )}
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
                Privacy First & OWASP Safe
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                All processing executes in volatile cloud memory. Temporary inputs and generated results auto-purge completely after 24 hours.
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
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Everything you need to know about Mehzan Tools Hub
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {[
                {
                  q: "Are all utility tools on this website free?",
                  a: "Yes! Mehzan Tools Hub provides 100% free online browser utility tools with instant execution and zero paywalls.",
                },
                {
                  q: "Do I need to sign up or enter a credit card?",
                  a: "No registration or payment details are required to use our suite of web utilities.",
                },
                {
                  q: "Is my data and text kept private?",
                  a: "Absolutely. All conversions and calculations execute client-side or transiently in memory, ensuring complete data privacy.",
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
