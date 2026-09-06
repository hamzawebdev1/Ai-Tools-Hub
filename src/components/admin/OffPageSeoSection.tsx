import React, { useState } from "react";
import {
  Share2,
  Copy,
  Check,
  Globe,
  Link2,
  FileText,
  Target,
  ExternalLink,
  Shield,
  MessageSquare,
  Github,
  BookOpen,
  Download
} from "lucide-react";
import { OUTREACH_TEMPLATES, COMPETITOR_LINK_GAP_DATA } from "../../data/offpageSeoData";

export const OffPageSeoSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"outreach" | "linkgap">("outreach");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("Reddit");
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [copiedLinkGapIdx, setCopiedLinkGapIdx] = useState<number | null>(null);

  const activeTemplate = OUTREACH_TEMPLATES.find((t) => t.platform === selectedPlatform) || OUTREACH_TEMPLATES[0];

  const copyToClipboard = (text: string, idx: number, isLinkGap = false) => {
    navigator.clipboard.writeText(text);
    if (isLinkGap) {
      setCopiedLinkGapIdx(idx);
      setTimeout(() => setCopiedLinkGapIdx(null), 2000);
    } else {
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-950 text-white shadow-xl space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Off-Page SEO & Authority Building Hub</h2>
            <p className="text-xs text-indigo-200/80">
              White-hat outreach assets, discussion-first community templates, and competitor backlink-gap strategy.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
          <button
            onClick={() => setActiveTab("outreach")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "outreach"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "bg-white/10 text-white/80 hover:bg-white/20"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Outreach & Community Templates ({OUTREACH_TEMPLATES.length})
          </button>
          <button
            onClick={() => setActiveTab("linkgap")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "linkgap"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "bg-white/10 text-white/80 hover:bg-white/20"
            }`}
          >
            <Target className="w-4 h-4" />
            Competitor Link Gap Worksheet ({COMPETITOR_LINK_GAP_DATA.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Outreach Templates */}
      {activeTab === "outreach" && (
        <div className="space-y-6">
          {/* Platform Filter Buttons */}
          <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            {OUTREACH_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.platform}
                onClick={() => setSelectedPlatform(tmpl.platform)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedPlatform === tmpl.platform
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
                }`}
              >
                {tmpl.platform}
              </button>
            ))}
          </div>

          {/* Active Template View */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-2">
                  <Globe className="w-3.5 h-3.5" /> Platform: {activeTemplate.platform}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {activeTemplate.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <strong>Target Audience / Venues:</strong> {activeTemplate.targetAudience}
                </p>
              </div>

              <button
                onClick={() => copyToClipboard(activeTemplate.content, 999)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 shadow-md shadow-indigo-600/20"
              >
                {copiedIdx === 999 ? (
                  <>
                    <Check className="w-4 h-4" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> Copy Content
                  </>
                )}
              </button>
            </div>

            {/* Editorial Guidelines */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
              <strong>Strategy & Safety Directive:</strong> {activeTemplate.guidelines}
            </div>

            {/* Content Display Box */}
            <div className="relative p-5 rounded-2xl bg-slate-950 text-slate-200 font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap border border-slate-800">
              {activeTemplate.content}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Competitor Link Gap Worksheet */}
      {activeTab === "linkgap" && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-500" />
                Competitor Link Gap Worksheet
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Strategic target topics, relevance rationale, and proposed outreach angles derived from competitor backlink footprints.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white">
                  <th className="p-3 border border-slate-200 dark:border-slate-700 font-bold">Competitor</th>
                  <th className="p-3 border border-slate-200 dark:border-slate-700 font-bold">Target Topic</th>
                  <th className="p-3 border border-slate-200 dark:border-slate-700 font-bold">Backlink Type</th>
                  <th className="p-3 border border-slate-200 dark:border-slate-700 font-bold">Source Relevance</th>
                  <th className="p-3 border border-slate-200 dark:border-slate-700 font-bold">Outreach Angle</th>
                  <th className="p-3 border border-slate-200 dark:border-slate-700 font-bold">Mehzan Target URL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {COMPETITOR_LINK_GAP_DATA.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-bold text-indigo-600 dark:text-indigo-400">
                      {item.competitor}
                    </td>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">
                      {item.targetTopic}
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">
                      <span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[11px]">
                        {item.backlinkType}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs">
                      {item.sourceRelevance}
                    </td>
                    <td className="p-3 text-slate-700 dark:text-slate-300 leading-relaxed max-w-xs">
                      {item.outreachAngle}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        <a
                          href={item.targetMehzanUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 dark:text-indigo-400 hover:underline font-mono text-[11px] truncate max-w-[160px]"
                        >
                          {item.targetMehzanUrl.replace("https://www.mehzandigital.com", "")}
                        </a>
                        <button
                          onClick={() => copyToClipboard(item.targetMehzanUrl, idx, true)}
                          className="p-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-slate-600 dark:text-slate-300 transition-colors"
                          title="Copy Link"
                        >
                          {copiedLinkGapIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
