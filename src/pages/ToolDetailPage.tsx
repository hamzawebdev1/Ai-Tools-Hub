import React, { useState } from "react";
import {
  Sparkles,
  Copy,
  Check,
  Download,
  Share2,
  Star,
  Bookmark,
  Zap,
  Clock,
  RotateCcw,
  CheckCircle,
  HelpCircle,
  Flame,
  MessageSquare,
  AlertTriangle,
  PlusCircle,
  Upload,
  ShieldCheck,
  User,
  AlertCircle,
  Lock,
} from "lucide-react";
import { AITool } from "../types";
import { CATEGORIES_DATA } from "../data/categoriesData";
import { getUrlForRoute } from "../services/routerService";
import { getToolIcon } from "../components/tools/ToolCard";
import { Breadcrumb } from "../components/layout/Breadcrumb";
import { AdBanner } from "../components/layout/AdBanner";
import { SchemaHead } from "../components/layout/SchemaHead";
import { RelatedTools } from "../components/tools/RelatedTools";
import { RelatedArticles } from "../components/seo/RelatedArticles";
import { saveHistoryItem } from "../services/storageService";
import { useAuth } from "../context/AuthContext";
import { canGuestExecute, incrementGuestUsage } from "../services/guestUsageService";
import { GuestLimitModal } from "../components/auth/GuestLimitModal";
import { trackToolAction } from "../services/toolTrackingService";
import { getRelatedTools } from "../utils/linkBuilder";
import { injectLinksIntoContent } from "../utils/seoLinkInjector";
import { getEnrichedToolSEO } from "../utils/toolSeoHelper";
import { ReviewCTA } from "../components/common/ReviewCTA";

const PdfToolsRunner = React.lazy(() => import("../components/tools/PdfToolsRunner").then(m => ({ default: m.PdfToolsRunner })));
const ImageToolsRunner = React.lazy(() => import("../components/tools/ImageToolsRunner").then(m => ({ default: m.ImageToolsRunner })));
const QrBarcodeToolsRunner = React.lazy(() => import("../components/tools/QrBarcodeToolsRunner").then(m => ({ default: m.QrBarcodeToolsRunner })));
const TextToolsRunner = React.lazy(() => import("../components/tools/TextToolsRunner").then(m => ({ default: m.TextToolsRunner })));
const DeveloperToolsRunner = React.lazy(() => import("../components/tools/DeveloperToolsRunner").then(m => ({ default: m.DeveloperToolsRunner })));
const SeoToolsRunner = React.lazy(() => import("../components/tools/SeoToolsRunner").then(m => ({ default: m.SeoToolsRunner })));
const CalculatorsRunner = React.lazy(() => import("../components/tools/CalculatorsRunner").then(m => ({ default: m.CalculatorsRunner })));
const FileToolsRunner = React.lazy(() => import("../components/tools/FileToolsRunner").then(m => ({ default: m.FileToolsRunner })));
const MediaToolsRunner = React.lazy(() => import("../components/tools/MediaToolsRunner").then(m => ({ default: m.MediaToolsRunner })));
const StudentToolsRunner = React.lazy(() => import("../components/tools/StudentToolsRunner").then(m => ({ default: m.StudentToolsRunner })));
const StorageStatusDashboard = React.lazy(() => import("../components/storage/StorageStatusDashboard").then(m => ({ default: m.StorageStatusDashboard })));

interface ToolDetailPageProps {
  tool: AITool;
  allTools: AITool[];
  onSelectTool: (slug: string) => void;
  favorites: string[];
  onToggleFavorite: (toolId: string, e: React.MouseEvent) => void;
  setActiveTab: (tab: string) => void;
}

export const ToolDetailPage: React.FC<ToolDetailPageProps> = ({
  tool,
  allTools,
  onSelectTool,
  favorites,
  onToggleFavorite,
  setActiveTab,
}) => {
  const { currentUser } = useAuth();
  const [showGuestLimitModal, setShowGuestLimitModal] = useState(false);

  // Report Modal State
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportIssueType, setReportIssueType] = useState<any>("Tool Not Working");
  const [reportDescription, setReportDescription] = useState("");
  const [reportEmail, setReportEmail] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportRefId, setReportRefId] = useState<string | null>(null);

  // Feature Request Modal State
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [featureName, setFeatureName] = useState(tool.name);
  const [featureDesc, setFeatureDesc] = useState("");
  const [featurePriority, setFeaturePriority] = useState<any>("Medium");
  const [featureEmail, setFeatureEmail] = useState("");
  const [featureSubmitting, setFeatureSubmitting] = useState(false);
  const [featureRefId, setFeatureRefId] = useState<string | null>(null);

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportDescription.trim()) return;
    setReportSubmitting(true);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolName: tool.name,
          pageUrl: window.location.pathname,
          userEmail: reportEmail || currentUser?.email || "guest@mehzandigital.com",
          issueType: reportIssueType,
          description: reportDescription,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setReportRefId(data.referenceId);
      }
    } catch {
      setReportRefId("REP-" + Math.floor(10000 + Math.random() * 90000));
    } finally {
      setReportSubmitting(false);
    }
  };

  const handleFeatureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!featureName.trim() || !featureDesc.trim()) return;
    setFeatureSubmitting(true);
    try {
      const res = await fetch("/api/feature-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolName: featureName,
          description: featureDesc,
          category: tool.category,
          priority: featurePriority,
          userEmail: featureEmail || currentUser?.email || "guest@mehzandigital.com",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFeatureRefId(data.referenceId);
      }
    } catch {
      setFeatureRefId("REQ-" + Math.floor(10000 + Math.random() * 90000));
    } finally {
      setFeatureSubmitting(false);
    }
  };

  const [promptInput, setPromptInput] = useState(tool.defaultPrompt || "");
  const [outputResult, setOutputResult] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [execTime, setExecTime] = useState<number | null>(null);
  const [execWords, setExecWords] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Options State
  const [selectedTone, setSelectedTone] = useState("Professional");
  const [selectedLength, setSelectedLength] = useState("Balanced");
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [customOptionValues, setCustomOptionValues] = useState<Record<string, string>>({});

  const isFavorite = favorites.includes(tool.id);

  // Track tool view
  React.useEffect(() => {
    trackToolAction({
      toolId: tool.id,
      toolSlug: tool.slug,
      toolName: tool.name,
      category: tool.category,
      action: "VIEW",
    });
  }, [tool.id, tool.slug, tool.name, tool.category]);

  const handleExecute = async () => {
    if (!promptInput.trim()) {
      setErrorMessage("Please enter text or instructions before generating.");
      return;
    }

    if (!canGuestExecute(tool.id, !!currentUser)) {
      setShowGuestLimitModal(true);
      return;
    }

    setErrorMessage("");
    setIsExecuting(true);
    setOutputResult("");

    const startTime = Date.now();

    trackToolAction({
      toolId: tool.id,
      toolSlug: tool.slug,
      toolName: tool.name,
      category: tool.category,
      action: "START",
    });

    const optionsPayload = {
      tone: tool.optionsConfig.hasTone ? selectedTone : undefined,
      length: tool.optionsConfig.hasLength ? selectedLength : undefined,
      language: tool.optionsConfig.hasLanguage ? selectedLanguage : undefined,
      ...customOptionValues,
    };

    try {
      const response = await fetch("/api/tools/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolId: tool.id,
          toolName: tool.name,
          prompt: promptInput,
          options: optionsPayload,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setOutputResult(data.output);
        setExecTime(data.executionTimeMs);
        setExecWords(data.wordsCount);

        incrementGuestUsage(tool.id, !!currentUser);

        const duration = data.executionTimeMs || Date.now() - startTime;

        trackToolAction({
          toolId: tool.id,
          toolSlug: tool.slug,
          toolName: tool.name,
          category: tool.category,
          action: "SUCCESS",
          durationMs: duration,
        });

        // Save to History Log
        saveHistoryItem({
          id: "h_" + Date.now(),
          toolId: tool.id,
          toolName: tool.name,
          prompt: promptInput,
          output: data.output,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          wordCount: data.wordsCount,
          executionTimeMs: duration,
          options: optionsPayload,
        });
      } else {
        const errText = data.error || "Execution failed. Please try again.";
        setErrorMessage(errText);
        trackToolAction({
          toolId: tool.id,
          toolSlug: tool.slug,
          toolName: tool.name,
          category: tool.category,
          action: "ERROR",
          errorMessage: errText,
        });
      }
    } catch (err: any) {
      const errText = err.message || "Network request failed.";
      setErrorMessage(errText);
      trackToolAction({
        toolId: tool.id,
        toolSlug: tool.slug,
        toolName: tool.name,
        category: tool.category,
        action: "ERROR",
        errorMessage: errText,
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCopy = () => {
    if (!outputResult) return;
    navigator.clipboard.writeText(outputResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!outputResult) return;
    const blob = new Blob([outputResult], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tool.slug}-result.txt`;
    a.click();
    URL.revokeObjectURL(url);

    trackToolAction({
      toolId: tool.id,
      toolSlug: tool.slug,
      toolName: tool.name,
      category: tool.category,
      action: "DOWNLOAD",
      fileName: `${tool.slug}-result.txt`,
    });
  };

  const categoryInfo = CATEGORIES_DATA.find(
    (c) => c.slug === tool.category || c.id === tool.category || c.name === tool.category
  );

  // Compute rich SEO content merging tool overrides with fallback defaults
  const enrichedSeo = {
    ...getEnrichedToolSEO(tool),
    ...(tool.seoContent || {}),
  };

  return (
    <>
      <SchemaHead
        title={enrichedSeo.metaTitle}
        description={enrichedSeo.metaDescription}
        schemaType="SoftwareApplication"
        schemaData={{
          name: tool.name,
          rating: tool.rating,
          ratingCount: tool.ratingCount,
          faqs: enrichedSeo.faqs,
        }}
      />

      <div className="space-y-6 pb-16">
        <Breadcrumb
          items={[
            { label: "All Tools", href: getUrlForRoute("all-tools"), onClick: () => setActiveTab("all-tools") },
            ...(categoryInfo
              ? [
                  {
                    label: categoryInfo.name,
                    href: getUrlForRoute("category-detail", { categorySlug: categoryInfo.slug }),
                    onClick: () => setActiveTab("category-detail", { categorySlug: categoryInfo.slug }),
                  },
                ]
              : []),
            { label: tool.name, href: getUrlForRoute("tool-detail", { toolSlug: tool.slug }), active: true },
          ]}
        />

        {/* Tool Header Card */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
              {getToolIcon(tool.iconName)}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  {tool.name}
                </h1>
                {tool.isTrending && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold">
                    <Flame className="w-3.5 h-3.5" /> Trending Tool
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
                {tool.tagline}
              </p>
              <div className="flex items-center gap-3 pt-2 text-xs text-slate-400">
                <span className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-4 h-4 fill-amber-500" /> {tool.rating} ({tool.ratingCount} reviews)
                </span>
                <span>•</span>
                <span>{(tool.usageCount / 1000).toFixed(0)}k executions</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowReportModal(true)}
              className="px-3 py-2.5 rounded-xl border border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/10 text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Report Issue</span>
            </button>
            <button
              onClick={() => setShowFeatureModal(true)}
              className="px-3 py-2.5 rounded-xl border border-indigo-500/30 bg-indigo-500/5 hover:bg-indigo-500/10 text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Request Feature</span>
            </button>
            <button
              onClick={(e) => onToggleFavorite(tool.id, e)}
              className={`px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                isFavorite
                  ? "bg-pink-500/10 border-pink-500/40 text-pink-500"
                  : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isFavorite ? "fill-pink-500" : ""}`} />
              <span>{isFavorite ? "Saved" : "Favorite"}</span>
            </button>
          </div>
        </div>

        {/* Top AdSense Banner */}
        <AdBanner placement="header" slotId={`tool-${tool.id}-top-ad`} />

        {/* Interactive Workspace Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Input & Controls Box (8 Cols) */}
          <div className="lg:col-span-12 space-y-4">
            <React.Suspense fallback={
              <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-8 text-center text-xs text-slate-500 font-medium animate-pulse flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500 animate-spin" />
                <span>Loading tool workspace...</span>
              </div>
            }>
              {tool.category === "pdf" ? (
                <>
                  <PdfToolsRunner toolId={tool.id} toolName={tool.name} toolSlug={tool.slug} />
                  <StorageStatusDashboard />
                </>
              ) : tool.category === "image" ? (
                <>
                  <ImageToolsRunner toolId={tool.id} toolName={tool.name} toolSlug={tool.slug} />
                  <StorageStatusDashboard />
                </>
              ) : tool.category === "qr" ? (
                <QrBarcodeToolsRunner toolId={tool.id} toolName={tool.name} toolSlug={tool.slug} />
              ) : tool.category === "text" ? (
                <TextToolsRunner toolId={tool.id} toolName={tool.name} toolSlug={tool.slug} />
              ) : tool.category === "developer" || tool.category === "network" || tool.category === "security" ? (
                <DeveloperToolsRunner toolId={tool.id} toolName={tool.name} toolSlug={tool.slug} />
              ) : tool.category === "seo" || tool.category === "website" ? (
                <SeoToolsRunner toolId={tool.id} toolName={tool.name} toolSlug={tool.slug} />
              ) : tool.category === "calculators" ? (
                <CalculatorsRunner toolId={tool.id} toolName={tool.name} toolSlug={tool.slug} />
              ) : tool.category === "utilities" ? (
                <FileToolsRunner toolId={tool.id} toolName={tool.name} toolSlug={tool.slug} />
              ) : tool.category === "media" ? (
                <MediaToolsRunner tool={tool} />
              ) : tool.category === "student" ? (
                <StudentToolsRunner toolId={tool.id} toolName={tool.name} toolSlug={tool.slug} />
              ) : (
                <>
                <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 shadow-xl space-y-5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-indigo-500" />
                      {tool.inputLabel}
                    </label>
                    <div className="text-[11px] text-slate-400 font-medium">
                      {promptInput.length} chars | {promptInput.trim().split(/\s+/).filter(Boolean).length} words
                    </div>
                  </div>

                  <textarea
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    placeholder={tool.inputPlaceholder}
                    rows={6}
                    className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs sm:text-sm leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
                  />

                  {/* Options Selectors Bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                    {tool.optionsConfig.hasTone && (
                      <div>
                        <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                          Tone Style
                        </label>
                        <select
                          value={selectedTone}
                          onChange={(e) => setSelectedTone(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 font-medium cursor-pointer"
                        >
                          <option value="Professional">Professional</option>
                          <option value="Casual">Casual & Friendly</option>
                          <option value="Academic">Academic & Formal</option>
                          <option value="Creative">Creative & Engaging</option>
                          <option value="Concise">Concise & Direct</option>
                        </select>
                      </div>
                    )}

                    {tool.optionsConfig.hasLength && (
                      <div>
                        <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                          Target Length
                        </label>
                        <select
                          value={selectedLength}
                          onChange={(e) => setSelectedLength(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 font-medium cursor-pointer"
                        >
                          <option value="Short">Short & Brief</option>
                          <option value="Balanced">Balanced Standard</option>
                          <option value="Detailed">Comprehensive & Detailed</option>
                        </select>
                      </div>
                    )}

                    {tool.optionsConfig.hasLanguage && (
                      <div>
                        <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                          Output Language
                        </label>
                        <select
                          value={selectedLanguage}
                          onChange={(e) => setSelectedLanguage(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 font-medium cursor-pointer"
                        >
                          <option value="English">English (US)</option>
                          <option value="Spanish">Spanish (Español)</option>
                          <option value="French">French (Français)</option>
                          <option value="German">German (Deutsch)</option>
                          <option value="Japanese">Japanese (日本語)</option>
                        </select>
                      </div>
                    )}

                    {/* Render Custom Fields */}
                    {tool.optionsConfig.customFields?.map((field) => (
                      <div key={field.id}>
                        <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                          {field.label}
                        </label>
                        {field.type === "select" ? (
                          <select
                            value={customOptionValues[field.id] || field.defaultValue || ""}
                            onChange={(e) =>
                              setCustomOptionValues({ ...customOptionValues, [field.id]: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 font-medium cursor-pointer"
                          >
                            {field.options?.map((opt, i) => (
                              <option key={i} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={customOptionValues[field.id] || ""}
                            onChange={(e) =>
                              setCustomOptionValues({ ...customOptionValues, [field.id]: e.target.value })
                            }
                            placeholder={field.placeholder}
                            className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200"
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  {errorMessage && (
                    <p className="text-xs text-rose-500 font-medium bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
                      {errorMessage}
                    </p>
                  )}

                  {/* Action Button */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => setPromptInput("")}
                      className="px-3 py-2 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Clear Text
                    </button>

                    <button
                      onClick={handleExecute}
                      disabled={isExecuting}
                      className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Sparkles className={`w-4 h-4 ${isExecuting ? "animate-spin" : ""}`} />
                      <span>{isExecuting ? "Processing AI..." : "Generate AI Output"}</span>
                    </button>
                  </div>
                </div>

                {/* Output Box */}
                {(outputResult || isExecuting) && (
                  <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 shadow-2xl space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                          Generated Result
                        </span>
                      </div>

                      {outputResult && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleCopy}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            {copied ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                                <span className="text-emerald-500">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={handleDownload}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download TXT</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {isExecuting ? (
                      <div className="py-12 text-center space-y-3">
                        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          Processing utility request...
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-mono text-xs sm:text-sm whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto">
                        {outputResult}
                      </div>
                    )}

                    {execTime && execWords && (
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-indigo-400" /> Processed in {execTime}ms
                        </span>
                        <span>{execWords} Words Output</span>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
            </React.Suspense>
          </div>
        </div>

        {/* AdSense In-Content Banner */}
        <AdBanner placement="in-content" slotId={`tool-${tool.id}-middle-ad`} />

        {/* SEO Educational Article Content */}
        <article className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-6 sm:p-10 space-y-8 text-slate-800 dark:text-slate-200">
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              About {tool.name}
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300" dangerouslySetInnerHTML={{ __html: (() => {
                const tools = getRelatedTools(tool.id);
                const links = tools.map(t => ({ text: t.name, url: t.url }));
                return injectLinksIntoContent(enrichedSeo.overview, links);
            })() }}>
            </p>
          </section>

          {/* Problem Solved & Target Audience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enrichedSeo.problemSolved && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-500" /> What Problem Does It Solve?
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {enrichedSeo.problemSolved}
                </p>
              </div>
            )}

            {enrichedSeo.targetAudience && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                  <User className="w-4 h-4 text-emerald-500" /> Who Can Use It?
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {enrichedSeo.targetAudience}
                </p>
              </div>
            )}
          </div>

          {/* Technical Architecture & Processing Disclosure */}
          <section className="p-4 sm:p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 space-y-2 text-xs">
            <h3 className="font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> How It Works & Data Privacy Architecture
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {enrichedSeo.howItWorks}
            </p>
            {enrichedSeo.processingDetails && (
              <div className="pt-2 border-t border-indigo-100 dark:border-indigo-900/40 font-medium text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span><strong>Privacy Guarantee:</strong> {enrichedSeo.processingDetails}</span>
              </div>
            )}
          </section>

          {/* Key Features & Common Use Cases */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Key Features
              </h3>
              <div className="space-y-2">
                {enrichedSeo.keyFeatures.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">{feat}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Common Use Cases
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {enrichedSeo.useCases.map((uc, idx) => (
                  <li key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                    <span>{uc}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Step-by-Step Guide & Common Mistakes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <section className="md:col-span-2 space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                How to Use {tool.name} Step-by-Step
              </h3>
              <ol className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {enrichedSeo.howToUseSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 shrink-0">{idx + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </section>

            {enrichedSeo.commonMistakes && enrichedSeo.commonMistakes.length > 0 && (
              <section className="space-y-3">
                <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-500" /> Common Mistakes to Avoid
                </h3>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  {enrichedSeo.commonMistakes.map((m, idx) => (
                    <li key={idx} className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 leading-relaxed">
                      • {m}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* FAQs */}
          <section className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-500" />
              Frequently Asked Questions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {enrichedSeo.faqs.map((faq, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800 space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {faq.question}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Related Tools Section */}
          <section className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Related Mehzan Digital Tools
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {getRelatedTools(tool.category, tool.id).map((t) => (
                <a
                  key={t.id}
                  href={getUrlForRoute("tool-detail", { toolSlug: t.slug })}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-colors"
                >
                  <h4 className="font-semibold text-xs text-slate-900 dark:text-white">{t.name}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{t.tagline}</p>
                </a>
              ))}
            </div>
          </section>

          <ReviewCTA />
        </article>

        {/* Related & Trending Tools Section */}
        <RelatedTools
          currentToolId={tool.id}
          category={tool.category}
          tools={allTools}
          onSelectTool={onSelectTool}
          favorites={favorites}
          onToggleFavorite={onToggleFavorite}
        />

        {/* Auto Related Guides for SEO Graph */}
        <RelatedArticles
          categorySlug={tool.category}
          toolTags={tool.tags}
          onSelectPost={(slug) => {
            setActiveTab("blog-post");
          }}
        />

        {/* Guest Limit Modal */}
        <GuestLimitModal
          isOpen={showGuestLimitModal}
          onClose={() => setShowGuestLimitModal(false)}
          toolName={tool.name}
          onSelectEmailSignUp={() => setActiveTab("register")}
        />

        {/* Report Problem Modal */}
        {showReportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-500" /> Report a Problem with {tool.name}
                </h3>
                <button
                  onClick={() => {
                    setShowReportModal(false);
                    setReportRefId(null);
                  }}
                  className="p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {reportRefId ? (
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                  <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Report Submitted Successfully</h4>
                  <p className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">Reference ID: {reportRefId}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300">Our engineering team has received your report and is investigating. You can track this ID in your admin dashboard.</p>
                  <button
                    onClick={() => {
                      setShowReportModal(false);
                      setReportRefId(null);
                      setReportDescription("");
                    }}
                    className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold cursor-pointer"
                  >
                    Close Window
                  </button>
                </div>
              ) : (
                <form onSubmit={handleReportSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Issue Type</label>
                    <select
                      value={reportIssueType}
                      onChange={(e) => setReportIssueType(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
                    >
                      <option value="Tool Not Working">Tool Not Working</option>
                      <option value="Wrong Output">Wrong Output</option>
                      <option value="Download Failed">Download Failed</option>
                      <option value="Upload Failed">Upload Failed</option>
                      <option value="Bug">Bug / Error</option>
                      <option value="Suggestion">Suggestion</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Description</label>
                    <textarea
                      required
                      rows={4}
                      value={reportDescription}
                      onChange={(e) => setReportDescription(e.target.value)}
                      placeholder="Please describe what went wrong, steps to reproduce, or expected behavior..."
                      className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Your Email (optional)</label>
                    <input
                      type="email"
                      value={reportEmail}
                      onChange={(e) => setReportEmail(e.target.value)}
                      placeholder={currentUser?.email || "you@example.com"}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowReportModal(false)}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={reportSubmitting}
                      className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {reportSubmitting ? "Submitting..." : "Submit Report"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Feature Request Modal */}
        {showFeatureModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-indigo-500" /> Request New Tool or Feature
                </h3>
                <button
                  onClick={() => {
                    setShowFeatureModal(false);
                    setFeatureRefId(null);
                  }}
                  className="p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {featureRefId ? (
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                  <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Feature Request Submitted</h4>
                  <p className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">Reference ID: {featureRefId}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300">Thank you! Our product team reviews feature suggestions weekly and prioritizes popular requests.</p>
                  <button
                    onClick={() => {
                      setShowFeatureModal(false);
                      setFeatureRefId(null);
                      setFeatureDesc("");
                    }}
                    className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold cursor-pointer"
                  >
                    Close Window
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFeatureSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Tool / Feature Name</label>
                    <input
                      type="text"
                      required
                      value={featureName}
                      onChange={(e) => setFeatureName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Priority</label>
                      <select
                        value={featurePriority}
                        onChange={(e) => setFeaturePriority(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Your Email</label>
                      <input
                        type="email"
                        value={featureEmail}
                        onChange={(e) => setFeatureEmail(e.target.value)}
                        placeholder={currentUser?.email || "you@example.com"}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Description & Use Case</label>
                    <textarea
                      required
                      rows={4}
                      value={featureDesc}
                      onChange={(e) => setFeatureDesc(e.target.value)}
                      placeholder="Explain how this tool or feature should work and what value it brings..."
                      className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowFeatureModal(false)}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={featureSubmitting}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {featureSubmitting ? "Submitting..." : "Submit Request"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
