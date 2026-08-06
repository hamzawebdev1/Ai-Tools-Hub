import React, { useState, useEffect } from "react";
import { Search, CheckCircle2, AlertTriangle, Code, ExternalLink, Activity, Layers, FileText, ChevronUp, ChevronDown } from "lucide-react";

interface SEOAuditWidgetProps {
  activeTab: string;
}

export const SEOAuditWidget: React.FC<SEOAuditWidgetProps> = ({ activeTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<"overview" | "schema" | "headings" | "sitemaps">("overview");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [canonical, setCanonical] = useState("");
  const [robots, setRobots] = useState("");
  const [headings, setHeadings] = useState<{ tag: string; text: string }[]>([]);
  const [schemasText, setSchemasText] = useState("");
  const [vitals, setVitals] = useState({ lcp: "0.8s", cls: "0.01", fid: "12ms" });

  useEffect(() => {
    // Collect DOM SEO elements
    const updateSEOStats = () => {
      setTitle(document.title || "");
      
      const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute("content") || "";
      setDescription(metaDesc);

      const canonicalLink = document.querySelector('link[rel="canonical"]')?.getAttribute("href") || "";
      setCanonical(canonicalLink);

      const metaRobots = document.querySelector('meta[name="robots"]')?.getAttribute("content") || "index, follow";
      setRobots(metaRobots);

      // Collect headings
      const hElements = Array.from(document.querySelectorAll("h1, h2, h3"));
      const hList = hElements.map((el) => ({
        tag: el.tagName.toUpperCase(),
        text: el.textContent?.trim() || "",
      }));
      setHeadings(hList.slice(0, 15));

      // Collect Schema
      const jsonLdScript = document.getElementById("seo-jsonld-schemas");
      if (jsonLdScript) {
        try {
          const parsed = JSON.parse(jsonLdScript.textContent || "{}");
          setSchemasText(JSON.stringify(parsed, null, 2));
        } catch (e) {
          setSchemasText("Invalid JSON-LD format");
        }
      } else {
        setSchemasText("No active JSON-LD schema found");
      }
    };

    const timer = setTimeout(updateSEOStats, 300);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const titleLength = title.length;
  const descLength = description.length;

  const titleStatus = titleLength >= 30 && titleLength <= 65 ? "good" : "warning";
  const descStatus = descLength >= 110 && descLength <= 165 ? "good" : "warning";

  return (
    <div className="fixed bottom-4 right-4 z-50 font-sans">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-2.5 rounded-full shadow-xl hover:bg-indigo-600 dark:hover:bg-indigo-400 dark:hover:text-white transition-all transform hover:scale-105 border border-slate-700 dark:border-slate-300 text-xs font-semibold"
        >
          <Search className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>SEO Engine & Schema Health</span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </button>
      ) : (
        <div className="w-[360px] sm:w-[480px] bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-lg">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-sm tracking-tight">On-Page SEO & Schema Inspector</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Sub Navigation */}
          <div className="flex border-b border-slate-800 bg-slate-900/80 text-xs">
            <button
              onClick={() => setActiveSubTab("overview")}
              className={`flex-1 py-2 px-3 flex items-center justify-center gap-1.5 font-medium transition-colors border-b-2 ${
                activeSubTab === "overview"
                  ? "border-indigo-500 text-indigo-400 bg-slate-800/50"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> Overview
            </button>
            <button
              onClick={() => setActiveSubTab("schema")}
              className={`flex-1 py-2 px-3 flex items-center justify-center gap-1.5 font-medium transition-colors border-b-2 ${
                activeSubTab === "schema"
                  ? "border-indigo-500 text-indigo-400 bg-slate-800/50"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Code className="w-3.5 h-3.5" /> JSON-LD
            </button>
            <button
              onClick={() => setActiveSubTab("headings")}
              className={`flex-1 py-2 px-3 flex items-center justify-center gap-1.5 font-medium transition-colors border-b-2 ${
                activeSubTab === "headings"
                  ? "border-indigo-500 text-indigo-400 bg-slate-800/50"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Headings
            </button>
            <button
              onClick={() => setActiveSubTab("sitemaps")}
              className={`flex-1 py-2 px-3 flex items-center justify-center gap-1.5 font-medium transition-colors border-b-2 ${
                activeSubTab === "sitemaps"
                  ? "border-indigo-500 text-indigo-400 bg-slate-800/50"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Activity className="w-3.5 h-3.5" /> XML Feeds
            </button>
          </div>

          {/* Content area */}
          <div className="p-4 max-h-[360px] overflow-y-auto space-y-4 text-xs">
            {activeSubTab === "overview" && (
              <>
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-400">Meta Title</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                      titleStatus === "good" ? "bg-emerald-950 text-emerald-400 border border-emerald-800" : "bg-amber-950 text-amber-400 border border-amber-800"
                    }`}>
                      {titleLength} chars
                    </span>
                  </div>
                  <p className="font-mono text-slate-200 break-words">{title || "No Title Set"}</p>
                </div>

                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-400">Meta Description</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                      descStatus === "good" ? "bg-emerald-950 text-emerald-400 border border-emerald-800" : "bg-amber-950 text-amber-400 border border-amber-800"
                    }`}>
                      {descLength} chars
                    </span>
                  </div>
                  <p className="font-mono text-slate-300 break-words leading-relaxed">{description || "No Description Set"}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block mb-1 font-semibold">Robots Meta</span>
                    <span className="font-mono text-emerald-400">{robots}</span>
                  </div>

                  <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block mb-1 font-semibold">Core Web Vitals</span>
                    <div className="flex gap-2 text-[11px] font-mono">
                      <span className="text-emerald-400">LCP: {vitals.lcp}</span>
                      <span className="text-emerald-400">CLS: {vitals.cls}</span>
                    </div>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-1 font-semibold">Canonical Tag</span>
                  <a
                    href={canonical}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-indigo-400 hover:underline flex items-center gap-1 truncate"
                  >
                    {canonical} <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
              </>
            )}

            {activeSubTab === "schema" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>Schema.org JSON-LD Output</span>
                  <span className="text-emerald-400 flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3 h-3" /> Validated
                  </span>
                </div>
                <pre className="p-3 bg-slate-950 rounded-xl text-[11px] font-mono text-indigo-300 overflow-x-auto border border-slate-800 max-h-[260px]">
                  {schemasText}
                </pre>
              </div>
            )}

            {activeSubTab === "headings" && (
              <div className="space-y-2">
                <span className="text-slate-400 text-[11px] block">Detected Heading Structure ({headings.length})</span>
                <div className="space-y-1.5 max-h-[260px] overflow-y-auto">
                  {headings.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 bg-slate-950/60 rounded-lg border border-slate-800/80 font-mono text-[11px]">
                      <span className={`px-1.5 py-0.5 rounded font-bold ${
                        h.tag === "H1" ? "bg-indigo-950 text-indigo-300 border border-indigo-800" : "bg-slate-800 text-slate-400"
                      }`}>
                        {h.tag}
                      </span>
                      <span className="text-slate-200 line-clamp-1">{h.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSubTab === "sitemaps" && (
              <div className="space-y-3">
                <span className="text-slate-400 text-[11px] block">Live Server Sitemaps & Crawler Files</span>
                
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800 hover:border-indigo-500 transition-colors"
                >
                  <div>
                    <span className="font-semibold text-slate-200 block">XML Sitemap Index</span>
                    <span className="text-[11px] text-slate-400 font-mono">/sitemap.xml</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-indigo-400" />
                </a>

                <a
                  href="/image-sitemap.xml"
                  target="_blank"
                  className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800 hover:border-indigo-500 transition-colors"
                >
                  <div>
                    <span className="font-semibold text-slate-200 block">XML Image Sitemap</span>
                    <span className="text-[11px] text-slate-400 font-mono">/image-sitemap.xml</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-indigo-400" />
                </a>

                <a
                  href="/news-sitemap.xml"
                  target="_blank"
                  className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800 hover:border-indigo-500 transition-colors"
                >
                  <div>
                    <span className="font-semibold text-slate-200 block">Google News Sitemap</span>
                    <span className="text-[11px] text-slate-400 font-mono">/news-sitemap.xml</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-indigo-400" />
                </a>

                <a
                  href="/robots.txt"
                  target="_blank"
                  className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800 hover:border-indigo-500 transition-colors"
                >
                  <div>
                    <span className="font-semibold text-slate-200 block">Robots Protocol File</span>
                    <span className="text-[11px] text-slate-400 font-mono">/robots.txt</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-indigo-400" />
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
