import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Search,
  Globe,
  Copy,
  Check,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Loader2,
} from "lucide-react";
import {
  analyzeHtmlForSEO,
  calculateKeywordDensity,
  generateXmlSitemap,
  generateRobotsTxt,
  generateSchemaOrg,
  SEOAnalysisReport,
} from "../../services/seoEngine";
import { parseUrlDetails, lookupHttpStatusCode, lookupMimeType, parseUserAgentString, generateWebManifest, generateRedirectRules } from "../../services/websiteEngine";

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
  const [metaTitle, setMetaTitle] = useState("Free AI Tools & Online Converters - Utility Tools Hub");
  const [metaDescription, setMetaDescription] = useState(
    "Access over 100+ free online developer, SEO, and security tools. Fast, high-precision processing running 100% in browser or SSRF-protected server."
  );
  const [targetUrl, setTargetUrl] = useState("https://utilitytoolshub.com/tools");
  const [targetKeyword, setTargetKeyword] = useState("free ai tools");
  const [bodyText, setBodyText] = useState(
    "Welcome to Utility Tools Hub. We offer free online tools for developers, content creators, SEO specialists, and businesses. Our tools run instantly with zero limits."
  );

  const [schemaType, setSchemaType] = useState("SoftwareApplication");
  const [generatedOutput, setGeneratedOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [loadingServer, setLoadingServer] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // SEO HTML Analysis State
  const [htmlInput, setHtmlInput] = useState(`<!DOCTYPE html>
<html lang="en">
<head>
  <title>Sample SEO Web Page Title - Utility Tools Hub</title>
  <meta name="description" content="This is a sample meta description tag for testing on-page SEO analyzer tools." />
  <link rel="canonical" href="https://utilitytoolshub.com/sample" />
</head>
<body>
  <h1>Main Page Heading H1</h1>
  <p>Welcome to our online platform offering developer and SEO analysis utilities.</p>
  <h2>Section Heading H2</h2>
  <img src="/sample.png" alt="Sample Graphic" />
</body>
</html>`);

  const [seoReport, setSeoReport] = useState<SEOAnalysisReport | null>(null);
  const [serverFetchResult, setServerFetchResult] = useState<any>(null);

  useEffect(() => {
    executeToolLogic();
  }, [metaTitle, metaDescription, targetUrl, targetKeyword, bodyText, schemaType, toolId, htmlInput]);

  const executeToolLogic = () => {
    setServerError(null);

    if (toolId.includes("keyword-density") || toolId === "keyword-position-calculator") {
      const res = calculateKeywordDensity(bodyText, targetKeyword);
      setGeneratedOutput(
        `KEYWORD DENSITY REPORT:\nTotal Words: ${res.totalWords}\nTarget Term: '${targetKeyword}'\nCount: ${res.keywordCount}\nDensity: ${res.densityPercentage}%\nPositions in text: ${res.positions.join(", ") || "None"}\n\nTOP REPEATED KEYWORDS:\n` +
          res.topKeywords.map((k) => `- ${k.word}: ${k.count} times (${k.density}%)`).join("\n")
      );
    } else if (toolId.includes("robots")) {
      const txt = generateRobotsTxt({
        allowAll: true,
        disallowPaths: ["/admin/", "/private/", "/api/"],
        sitemapUrl: `${targetUrl.replace(/\/$/, "")}/sitemap.xml`,
        crawlDelay: 2,
      });
      setGeneratedOutput(txt);
    } else if (toolId.includes("sitemap")) {
      const xml = generateXmlSitemap([
        { url: targetUrl, priority: "1.0", changefreq: "daily" },
        { url: `${targetUrl}/about`, priority: "0.8", changefreq: "weekly" },
        { url: `${targetUrl}/tools`, priority: "0.9", changefreq: "daily" },
      ]);
      setGeneratedOutput(xml);
    } else if (toolId.includes("schema")) {
      const json = generateSchemaOrg(schemaType, {
        name: metaTitle,
        description: metaDescription,
        url: targetUrl,
      });
      setGeneratedOutput(json);
    } else if (toolId.includes("html-seo-analyzer") || toolId.includes("meta-tag-analyzer") || toolId.includes("heading-analyzer")) {
      const report = analyzeHtmlForSEO(htmlInput, targetUrl);
      setSeoReport(report);
      setGeneratedOutput(JSON.stringify(report, null, 2));
    } else if (toolId === "url-parser") {
      const parsed = parseUrlDetails(targetUrl);
      setGeneratedOutput(JSON.stringify(parsed, null, 2));
    } else if (toolId === "http-status-code-lookup") {
      const codeNum = parseInt(targetKeyword) || 200;
      const lookup = lookupHttpStatusCode(codeNum);
      setGeneratedOutput(JSON.stringify(lookup, null, 2));
    } else if (toolId === "mime-type-lookup") {
      const lookup = lookupMimeType(targetKeyword || "json");
      setGeneratedOutput(JSON.stringify(lookup, null, 2));
    } else if (toolId === "user-agent-parser") {
      const ua = bodyText || (typeof navigator !== "undefined" ? navigator.userAgent : "Mozilla/5.0");
      const parsed = parseUserAgentString(ua);
      setGeneratedOutput(JSON.stringify(parsed, null, 2));
    } else if (toolId === "web-manifest-generator") {
      const manifest = generateWebManifest({ name: metaTitle, shortName: "App", startUrl: targetUrl });
      setGeneratedOutput(manifest);
    } else if (toolId.includes("redirect-generator")) {
      const rules = generateRedirectRules("htaccess", "/old-page", targetUrl);
      setGeneratedOutput(rules);
    } else {
      // Default Meta & OpenGraph Snippet output
      setGeneratedOutput(
        `<!-- HTML Meta & Social Tags -->\n<title>${metaTitle}</title>\n<meta name="description" content="${metaDescription}">\n<meta name="keywords" content="${targetKeyword}">\n<link rel="canonical" href="${targetUrl}">\n\n<!-- Open Graph / Facebook -->\n<meta property="og:type" content="website">\n<meta property="og:url" content="${targetUrl}">\n<meta property="og:title" content="${metaTitle}">\n<meta property="og:description" content="${metaDescription}">\n\n<!-- Twitter Card -->\n<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:title" content="${metaTitle}">\n<meta name="twitter:description" content="${metaDescription}">`
      );
    }
  };

  const handleServerFetch = async () => {
    if (!targetUrl) return;
    setLoadingServer(true);
    setServerError(null);

    try {
      const res = await fetch("/api/analysis/fetch-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
      });

      const data = await res.json();
      if (!data.success) {
        setServerError(data.error || "Failed to inspect URL.");
      } else {
        setServerFetchResult(data);
        if (data.bodyHtml) {
          setHtmlInput(data.bodyHtml);
        }
      }
    } catch (err: any) {
      setServerError(`Server connection error: ${err.message}`);
    } finally {
      setLoadingServer(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Inputs Form Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-500" />
            {toolName} Workspace
          </span>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Client & SSRF Protected
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 block mb-1">
              Title / Label ({metaTitle.length} chars)
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
              Target URL / Domain
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium"
              />
              {(toolId.includes("checker") || toolId.includes("analyzer") || toolId.includes("redirect")) && (
                <button
                  onClick={handleServerFetch}
                  disabled={loadingServer}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0"
                >
                  {loadingServer ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                  <span>Inspect Live URL</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {serverError && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/50 rounded-xl text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
            <XCircle className="w-4 h-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <div>
          <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 block mb-1">
            Meta Description / Abstract ({metaDescription.length} chars)
          </label>
          <textarea
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            rows={2}
            className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs leading-relaxed"
          />
        </div>

        {(toolId.includes("analyzer") || toolId.includes("density") || toolId.includes("word-count")) && (
          <div>
            <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 block mb-1">
              Content / Markup Body Text
            </label>
            <textarea
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
              rows={4}
              className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono"
            />
          </div>
        )}

        {toolId.includes("html") && (
          <div>
            <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 block mb-1">
              Raw HTML Code Workspace
            </label>
            <textarea
              value={htmlInput}
              onChange={(e) => setHtmlInput(e.target.value)}
              rows={6}
              className="w-full p-3 bg-slate-950 text-indigo-300 border border-slate-800 rounded-xl text-xs font-mono leading-relaxed"
            />
          </div>
        )}
      </div>

      {/* SERP / Social Visual Card Preview */}
      {(toolId === "serp-preview" || toolId.includes("og") || toolId.includes("twitter") || toolId.includes("social")) && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Visual SERP & Social Snippet Preview
          </span>

          <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1.5">
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono block truncate">
              {targetUrl}
            </span>
            <h3 className="text-base font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">
              {metaTitle || "Page Title"}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {metaDescription || "Meta description preview text..."}
            </p>
          </div>
        </div>
      )}

      {/* SEO On-Page Report Visual Cards */}
      {seoReport && (toolId.includes("analyzer") || toolId.includes("checker")) && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            SEO Audit Summary Report
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Title Tag</span>
                {seoReport.title?.status === "good" ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertTriangle className="w-4 h-4 text-amber-500" />}
              </div>
              <p className="text-xs font-medium text-slate-800 dark:text-slate-200">{seoReport.title?.length} chars</p>
              <p className="text-[11px] text-slate-500">{seoReport.title?.message}</p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Meta Description</span>
                {seoReport.metaDescription?.status === "good" ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertTriangle className="w-4 h-4 text-amber-500" />}
              </div>
              <p className="text-xs font-medium text-slate-800 dark:text-slate-200">{seoReport.metaDescription?.length} chars</p>
              <p className="text-[11px] text-slate-500">{seoReport.metaDescription?.message}</p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Headings Structure</span>
                {seoReport.headings?.status === "good" ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertTriangle className="w-4 h-4 text-amber-500" />}
              </div>
              <p className="text-xs font-medium text-slate-800 dark:text-slate-200">{seoReport.headings?.h1Count} H1, {seoReport.headings?.h2Count} H2s</p>
              <p className="text-[11px] text-slate-500">{seoReport.headings?.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Output Code Workspace */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Generated Code / Report Output
          </label>
          <button
            onClick={handleCopy}
            className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-semibold flex items-center gap-1 hover:bg-indigo-100 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy Output"}</span>
          </button>
        </div>

        <textarea
          readOnly
          value={generatedOutput}
          rows={8}
          className="w-full p-4 bg-slate-950 text-indigo-300 border border-slate-800 rounded-2xl text-xs font-mono leading-relaxed"
        />
      </div>
    </div>
  );
};
