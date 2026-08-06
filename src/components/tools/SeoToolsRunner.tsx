import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Search,
  Globe,
  Share2,
  Copy,
  Download,
  Check,
  Sparkles,
  Eye,
  FileCode,
  Tag,
  AlertCircle,
} from "lucide-react";
import { saveHistoryItem } from "../../services/storageService";
import { useAuth } from "../../context/AuthContext";
import { canGuestExecute, incrementGuestUsage } from "../../services/guestUsageService";
import { GuestLimitModal } from "../auth/GuestLimitModal";

interface SeoToolsRunnerProps {
  toolId: string;
  toolName: string;
  toolSlug: string;
}

export const SeoToolsRunner: React.FC<SeoToolsRunnerProps> = ({
  toolId,
  toolName,
  toolSlug,
}) => {
  const { currentUser } = useAuth();
  const [showGuestModal, setShowGuestModal] = useState(false);

  const [metaTitle, setMetaTitle] = useState("Free AI Tools & Online Converters - AI Tools Hub");
  const [metaDescription, setMetaDescription] = useState(
    "Access over 50+ free online productivity tools including PDF converters, image background removers, QR generators, and AI meta tag optimizers."
  );
  const [targetUrl, setTargetUrl] = useState("https://aitoolshub.com/tools");
  const [targetKeyword, setTargetKeyword] = useState("free ai tools");
  const [bodyText, setBodyText] = useState(
    "Welcome to AI Tools Hub. We offer free ai tools for developers, content creators, and businesses. Our free ai tools run instantly with end-to-end encryption."
  );

  const [schemaType, setSchemaType] = useState("SoftwareApplication");
  const [generatedOutput, setGeneratedOutput] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generateSeoData();
  }, [metaTitle, metaDescription, targetUrl, targetKeyword, bodyText, schemaType, toolId]);

  const generateSeoData = () => {
    if (toolId === "keyword-density-checker") {
      const words = bodyText.toLowerCase().match(/\b\w+\b/g) || [];
      const totalWords = words.length;
      const freq: Record<string, number> = {};

      words.forEach((w) => {
        if (w.length > 2) freq[w] = (freq[w] || 0) + 1;
      });

      const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 10);

      const densityReport = sorted
        .map(([w, count]) => `${w}: ${count} times (${((count / totalWords) * 100).toFixed(2)}%)`)
        .join("\n");

      setGeneratedOutput(
        `KEYWORD DENSITY ANALYSIS:\nTotal Words Analyzed: ${totalWords}\n\nTop Repeated Terms:\n${densityReport}`
      );
    } else if (toolId === "meta-generator" || toolId === "ai-meta-generator") {
      setGeneratedOutput(
        `<!-- HTML Meta Tags -->\n<title>${metaTitle}</title>\n<meta name="description" content="${metaDescription}">\n<meta name="keywords" content="${targetKeyword}">\n\n<!-- Google / Search Engine Tags -->\n<meta itemprop="name" content="${metaTitle}">\n<meta itemprop="description" content="${metaDescription}">`
      );
    } else if (toolId === "schema-generator") {
      const schemaObj = {
        "@context": "https://schema.org",
        "@type": schemaType,
        name: metaTitle,
        description: metaDescription,
        url: targetUrl,
        applicationCategory: "UtilityApplication",
        operatingSystem: "Web",
      };
      setGeneratedOutput(JSON.stringify(schemaObj, null, 2));
    } else if (toolId === "og-preview") {
      setGeneratedOutput(
        `<!-- Open Graph / Facebook -->\n<meta property="og:type" content="website">\n<meta property="og:url" content="${targetUrl}">\n<meta property="og:title" content="${metaTitle}">\n<meta property="og:description" content="${metaDescription}">\n\n<!-- Twitter Card -->\n<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:title" content="${metaTitle}">\n<meta name="twitter:description" content="${metaDescription}">`
      );
    } else {
      // SERP Preview
      setGeneratedOutput(
        `Google Search Preview:\nTitle: ${metaTitle.slice(0, 60)}${metaTitle.length > 60 ? "..." : ""}\nURL: ${targetUrl}\nDescription: ${metaDescription.slice(0, 155)}${metaDescription.length > 155 ? "..." : ""}`
      );
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Form Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 block mb-1">
              Page Meta Title ({metaTitle.length}/60 chars)
            </label>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 block mb-1">
              Target Page URL
            </label>
            <input
              type="text"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 block mb-1">
            Meta Description ({metaDescription.length}/160 chars)
          </label>
          <textarea
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            rows={3}
            className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs leading-relaxed"
          />
        </div>

        {toolId === "keyword-density-checker" && (
          <div>
            <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 block mb-1">
              Article Content Text Body
            </label>
            <textarea
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
              rows={4}
              className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
            />
          </div>
        )}
      </div>

      {/* Visual Snippet Preview (Google SERP or Social Card) */}
      {(toolId === "serp-preview" || toolId === "og-preview") && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Visual Search / Social Card Preview
          </span>

          <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono block truncate">
              {targetUrl}
            </span>
            <h3 className="text-base font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">
              {metaTitle || "Page Title Placeholder"}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {metaDescription || "Page description text snippet..."}
            </p>
          </div>
        </div>
      )}

      {/* Generated Code Output */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Generated SEO Code Markup
          </label>
          <button
            onClick={handleCopy}
            className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-semibold flex items-center gap-1 hover:bg-indigo-100"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy Code"}</span>
          </button>
        </div>

        <textarea
          readOnly
          value={generatedOutput}
          rows={8}
          className="w-full p-4 bg-slate-950 text-indigo-300 border border-slate-800 rounded-2xl text-xs font-mono leading-relaxed"
        />
      </div>

      <GuestLimitModal
        isOpen={showGuestModal}
        onClose={() => setShowGuestModal(false)}
        toolName={toolName}
      />
    </div>
  );
};
