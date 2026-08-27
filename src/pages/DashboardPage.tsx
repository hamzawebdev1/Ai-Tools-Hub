import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  User,
  Shield,
  Key,
  Save,
  Moon,
  Sun,
  Trash2,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  Send,
  Zap,
  Clock,
  Bookmark,
  Sparkles,
  ArrowRight,
  History,
  TrendingUp,
  BarChart3,
  Download,
  Bug,
  MessageSquare,
  PlusCircle,
  Bell,
  Globe,
  RefreshCw,
  Copy,
  Search,
  Check,
  Lock,
  X,
  Star,
  Sliders,
  CheckSquare,
  ChevronRight,
  PieChart
} from "lucide-react";
import { UserProfile, HistoryItem, AITool } from "../types";
import { ToolCard } from "../components/tools/ToolCard";
import { Breadcrumb } from "../components/layout/Breadcrumb";
import { SchemaHead } from "../components/layout/SchemaHead";
import { useAuth } from "../context/AuthContext";

interface DashboardPageProps {
  profile: UserProfile;
  history: HistoryItem[];
  tools: AITool[];
  onSelectTool: (slug: string) => void;
  favorites: string[];
  onToggleFavorite: (toolId: string, e: React.MouseEvent) => void;
  setActiveTab: (tab: string) => void;
  theme?: "dark" | "light";
  toggleTheme?: () => void;
}

type DashboardSubTab =
  | "overview"
  | "analytics"
  | "tools"
  | "history"
  | "settings"
  | "feedback"
  | "notifications";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "info" | "success" | "warning";
  read: boolean;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  profile,
  history,
  tools,
  onSelectTool,
  favorites,
  onToggleFavorite,
  setActiveTab,
  theme = "dark",
  toggleTheme,
}) => {
  const {
    currentUser,
    userDoc,
    logout,
    sendVerificationEmail,
    sendResetEmail,
    updateUserProfileName,
    deleteAccount,
    updateSettings,
  } = useAuth();

  const [activeSubTab, setActiveSubTab] = useState<DashboardSubTab>("overview");

  // Profile Edit State
  const [displayName, setDisplayName] = useState(
    userDoc?.name || currentUser?.displayName || profile.name || ""
  );
  const [nameSaving, setNameSaving] = useState(false);
  const [nameSavedSuccess, setNameSavedSuccess] = useState(false);

  // Email Verification State
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  // Password Reset State
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  // Delete Account Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Language State
  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem("ai_tools_hub_lang") || "en"
  );

  // Search/Filter for History & Favorites
  const [historySearch, setHistorySearch] = useState("");
  const [favoritesSearch, setFavoritesSearch] = useState("");

  // Feedback Form State
  const [bugTitle, setBugTitle] = useState("");
  const [bugCategory, setBugCategory] = useState("general");
  const [bugSeverity, setBugSeverity] = useState("Medium");
  const [bugDescription, setBugDescription] = useState("");
  const [bugSubmitted, setBugSubmitted] = useState(false);

  const [toolReqName, setToolReqName] = useState("");
  const [toolReqCategory, setToolReqCategory] = useState("pdf");
  const [toolReqDesc, setToolReqDesc] = useState("");
  const [toolReqSubmitted, setToolReqSubmitted] = useState(false);

  const [rating, setRating] = useState(5);
  const [ratingComment, setRatingComment] = useState("");
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  // Notifications State
  const [notifPrefs, setNotifPrefs] = useState({
    systemAnnouncements: true,
    usageAlerts: true,
    securityAlerts: true,
    newToolsDigest: false,
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const [copiedHistoryId, setCopiedHistoryId] = useState<string | null>(null);

  // Live analytics fetched from backend database
  const [liveStats, setLiveStats] = useState<{
    totalExecutions: number;
    successfulConversions: number;
    failedOperations: number;
    downloadsCount: number;
    estimatedTimeSavedMinutes: number;
    recentActivity: any[];
    toolBreakdown: any[];
  } | null>(null);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const res = await fetch("/api/auth/user-analytics", {
          headers: currentUser?.uid ? { "x-user-id": currentUser.uid } : {},
        });
        const data = await res.json();
        if (data.success && data.stats) {
          setLiveStats(data.stats);
        }
      } catch (err) {
        console.warn("Failed to load user analytics:", err);
      }
    };
    fetchUserStats();
  }, [currentUser]);

  useEffect(() => {
    if (userDoc?.name) {
      setDisplayName(userDoc.name);
    } else if (currentUser?.displayName) {
      setDisplayName(currentUser.displayName);
    }
  }, [userDoc, currentUser]);

  // Greeting based on hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Language options
  const languages = [
    { code: "en", name: "English 🇺🇸" },
    { code: "es", name: "Spanish 🇪🇸" },
    { code: "fr", name: "French 🇫🇷" },
    { code: "de", name: "German 🇩🇪" },
    { code: "ja", name: "Japanese 🇯🇵" },
    { code: "zh", name: "Chinese 🇨🇳" },
    { code: "ar", name: "Arabic 🇸🇦" },
  ];

  const handleLanguageChange = (code: string) => {
    setSelectedLanguage(code);
    localStorage.setItem("ai_tools_hub_lang", code);
  };

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;
    setNameSaving(true);
    try {
      await updateUserProfileName(displayName.trim());
      setNameSavedSuccess(true);
      setTimeout(() => setNameSavedSuccess(false), 2500);
    } catch (err) {
      console.error("Failed to update display name:", err);
    } finally {
      setNameSaving(false);
    }
  };

  const handleSendVerification = async () => {
    setVerificationError(null);
    try {
      await sendVerificationEmail();
      setVerificationSent(true);
    } catch (err: any) {
      setVerificationError(err.message || "Failed to send verification email.");
    }
  };

  const handleSendPasswordReset = async () => {
    if (!currentUser?.email) return;
    setResetLoading(true);
    try {
      await sendResetEmail(currentUser.email);
      setResetEmailSent(true);
      setTimeout(() => setResetEmailSent(false), 5000);
    } catch (err) {
      console.error("Password reset error:", err);
    } finally {
      setResetLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText.trim().toUpperCase() !== "DELETE") return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await deleteAccount();
      setShowDeleteModal(false);
      setActiveTab("login");
    } catch (err: any) {
      setDeleteError(err.message || "Account deletion failed.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHistoryId(id);
    setTimeout(() => setCopiedHistoryId(null), 2000);
  };

  // Favorite Tools list
  const favoriteToolsList = tools.filter((t) => favorites.includes(t.id));
  const filteredFavorites = favoriteToolsList.filter((t) =>
    t.name.toLowerCase().includes(favoritesSearch.toLowerCase()) ||
    t.description.toLowerCase().includes(favoritesSearch.toLowerCase())
  );

  // Unique history tools (recently used)
  const recentlyUsedToolIds = Array.from(new Set(history.map((h) => h.toolId)));
  const recentlyUsedTools = tools.filter((t) => recentlyUsedToolIds.includes(t.id));

  // Category statistics for usage charts
  const categoryCounts: Record<string, number> = {};
  history.forEach((item) => {
    const tool = tools.find((t) => t.id === item.toolId);
    const cat = tool?.category || "utilities";
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const categoryStats = Object.entries(categoryCounts)
    .map(([cat, count]) => ({
      category: cat.toUpperCase(),
      count,
      percentage: Math.round((count / (history.length || 1)) * 100),
    }))
    .sort((a, b) => b.count - a.count);

  // Total words generated across history
  const totalWordsGenerated = history.reduce((acc, curr) => acc + (curr.wordCount || 0), 0);
  const avgLatencyMs = history.length
    ? Math.round(history.reduce((acc, curr) => acc + (curr.executionTimeMs || 0), 0) / history.length)
    : 0;

  // Filtered History
  const filteredHistory = history.filter(
    (h) =>
      h.toolName.toLowerCase().includes(historySearch.toLowerCase()) ||
      h.prompt.toLowerCase().includes(historySearch.toLowerCase()) ||
      h.output.toLowerCase().includes(historySearch.toLowerCase())
  );

  const markAllNotifsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <SchemaHead
        title="User Dashboard - Mehzan Digital Tools Hub Analytics & Settings"
        description="Manage your account profile, execution analytics, favorite tools, execution history, downloads, and workspace preferences."
      />

      <div className="space-y-8 pb-16">
        <Breadcrumb items={[{ label: "User Dashboard", active: true }]} />

        {/* Header / Welcome Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-gradient-to-r from-indigo-900/10 via-purple-900/10 to-slate-900/10 dark:from-indigo-950/40 dark:via-purple-950/40 dark:to-slate-950 p-6 sm:p-8 backdrop-blur-md shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-5">
              {currentUser?.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={displayName}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-indigo-500/30 shadow-lg shadow-indigo-500/20"
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 text-white font-black text-2xl sm:text-3xl flex items-center justify-center shadow-lg shadow-indigo-500/25 shrink-0">
                  {(displayName || "U").charAt(0).toUpperCase()}
                </div>
              )}

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-full">
                    {getGreeting()} 👋
                  </span>
                  {currentUser?.emailVerified ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> Verified Account
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                      <AlertTriangle className="w-3 h-3" /> Email Unverified
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {displayName || "Valued User"}
                </h1>

                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <span>{currentUser?.email || profile.email}</span>
                  <span>•</span>
                  <span className="capitalize font-medium">
                    Provider: {userDoc?.provider || currentUser?.providerData[0]?.providerId || "Email"}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-stretch md:self-auto justify-end">
              <button
                onClick={async () => {
                  await logout();
                  setActiveTab("login");
                }}
                className="px-4 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500/20 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shrink-0"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Email Unverified Warning Bar */}
          {currentUser && !currentUser.emailVerified && (
            <div className="mt-6 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Verify your email address to enable password recovery & Cloud Sync backup options.</span>
              </div>
              <button
                onClick={handleSendVerification}
                disabled={verificationSent}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{verificationSent ? "Verification Link Sent!" : "Send Verification Link"}</span>
              </button>
            </div>
          )}

          {verificationError && (
            <div className="mt-2 text-xs text-rose-500 font-medium">
              {verificationError}
            </div>
          )}
        </div>

        {/* Dashboard Navigation Sub-Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 scrollbar-none">
          <button
            onClick={() => setActiveSubTab("overview")}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeSubTab === "overview"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveSubTab("analytics")}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeSubTab === "analytics"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Usage Analytics</span>
          </button>

          <button
            onClick={() => setActiveSubTab("tools")}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeSubTab === "tools"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>My Tools ({favorites.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab("history")}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeSubTab === "history"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <History className="w-4 h-4" />
            <span>History ({history.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab("settings")}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeSubTab === "settings"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Settings & Security</span>
          </button>

          <button
            onClick={() => setActiveSubTab("feedback")}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeSubTab === "feedback"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Feedback & Bugs</span>
          </button>

          <button
            onClick={() => setActiveSubTab("notifications")}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shrink-0 relative ${
              activeSubTab === "notifications"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
            {unreadNotifCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
            )}
          </button>
        </div>

        {/* SUBTAB 1: OVERVIEW */}
        {activeSubTab === "overview" && (
          <div className="space-y-8 animate-fade-in">
            {/* KPI Metrics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 space-y-2 shadow-xs hover:border-indigo-500/40 transition-colors">
                <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 w-fit">
                  <Zap className="w-5 h-5" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {Math.max(currentUser && userDoc?.history ? userDoc.history.length : history.length, liveStats?.totalExecutions || 0)}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Total Tool Uses
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 space-y-2 shadow-xs hover:border-emerald-500/40 transition-colors">
                <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 w-fit">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {Math.max(Math.round((currentUser && userDoc?.history ? userDoc.history.length : history.length) * 5), liveStats?.estimatedTimeSavedMinutes || 0)} Mins
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Estimated Time Saved
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 space-y-2 shadow-xs hover:border-pink-500/40 transition-colors">
                <div className="p-2.5 rounded-2xl bg-pink-500/10 text-pink-600 dark:text-pink-400 w-fit">
                  <Bookmark className="w-5 h-5" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {favorites.length}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Bookmarked Shortcuts
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 space-y-2 shadow-xs hover:border-amber-500/40 transition-colors">
                <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 w-fit">
                  <Download className="w-5 h-5" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {liveStats?.downloadsCount || 0}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Files Downloaded
                </div>
              </div>
            </div>

            {/* Recently Used Tools Quick Launch */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-500" />
                  Recently Executed Tools
                </h2>
                <button
                  onClick={() => setActiveSubTab("tools")}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  View All Tools <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {recentlyUsedTools.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-2">
                  <p className="font-bold text-slate-700 dark:text-slate-300">No recently executed tools yet.</p>
                  <p>Select any tool from our 50+ collection to start converting files and generating content.</p>
                  <button
                    onClick={() => setActiveTab("all-tools")}
                    className="mt-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 transition-colors cursor-pointer"
                  >
                    Browse All Tools
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentlyUsedTools.slice(0, 3).map((tool) => (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                      onSelectTool={onSelectTool}
                      isFavorite={favorites.includes(tool.id)}
                      onToggleFavorite={onToggleFavorite}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Favorite Shortcuts Preview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-pink-500" />
                  Bookmarked Shortcuts
                </h2>
                <button
                  onClick={() => setActiveSubTab("tools")}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Manage Favorites ({favorites.length}) <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {favoriteToolsList.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
                  No bookmarked shortcuts yet. Click the bookmark icon on any tool card to save quick shortcuts here.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoriteToolsList.slice(0, 3).map((tool) => (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                      onSelectTool={onSelectTool}
                      isFavorite={favorites.includes(tool.id)}
                      onToggleFavorite={onToggleFavorite}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Recent Execution History Quick Preview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-indigo-500" />
                  Recent Execution Logs
                </h2>
                <button
                  onClick={() => setActiveSubTab("history")}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  Full History ({history.length})
                </button>
              </div>

              {history.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
                  No execution logs logged in this session yet. Run any tool to populate your log!
                </div>
              ) : (
                <div className="rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white/80 dark:bg-slate-900/80 shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="p-3.5">Tool Name</th>
                        <th className="p-3.5">Input Snippet</th>
                        <th className="p-3.5">Latency</th>
                        <th className="p-3.5">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                      {history.slice(0, 5).map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="p-3.5 font-bold text-indigo-600 dark:text-indigo-400">{item.toolName}</td>
                          <td className="p-3.5 max-w-xs truncate text-slate-500 dark:text-slate-400">{item.prompt}</td>
                          <td className="p-3.5 font-mono text-[11px] text-emerald-500">{item.executionTimeMs}ms</td>
                          <td className="p-3.5 text-slate-400">{item.timestamp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SUBTAB 2: USAGE ANALYTICS & CHARTS */}
        {activeSubTab === "analytics" && (
          <div className="space-y-8 animate-fade-in">
            <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-500" />
                Productivity & Category Usage Analytics
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Visual breakdown of your AI tool executions, words generated, and latency performance.
              </p>
            </div>

            {/* Performance Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 space-y-1">
                <span className="text-xs text-slate-400 font-medium">Average Processing Latency</span>
                <p className="text-2xl font-black text-emerald-500 font-mono">{avgLatencyMs} ms</p>
                <p className="text-[11px] text-slate-500">Fast client-side & edge execution</p>
              </div>

              <div className="p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 space-y-1">
                <span className="text-xs text-slate-400 font-medium">Total Words Generated</span>
                <p className="text-2xl font-black text-indigo-500">{totalWordsGenerated.toLocaleString()}</p>
                <p className="text-[11px] text-slate-500">Across writing & developer tools</p>
              </div>

              <div className="p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 space-y-1">
                <span className="text-xs text-slate-400 font-medium">Total Sessions Logged</span>
                <p className="text-2xl font-black text-purple-500">{history.length}</p>
                <p className="text-[11px] text-slate-500">Saved in cloud sync history</p>
              </div>
            </div>

            {/* Visual Category Distribution Bar Chart */}
            <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 space-y-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <PieChart className="w-4 h-4 text-indigo-500" />
                    Executions by Tool Category
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Distribution across tool suites</p>
                </div>
              </div>

              {categoryStats.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl">
                  Run tools to generate live category usage analytics!
                </div>
              ) : (
                <div className="space-y-4">
                  {categoryStats.map((stat, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                        <span>{stat.category}</span>
                        <span>{stat.count} runs ({stat.percentage}%)</span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                          style={{ width: `${Math.max(8, stat.percentage)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SUBTAB 3: MY TOOLS & FAVORITES */}
        {activeSubTab === "tools" && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-pink-500" />
                  Bookmarked & Favorite Tools
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Your custom quick-access launch shortcuts
                </p>
              </div>

              {/* Search Bar for Favorites */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={favoritesSearch}
                  onChange={(e) => setFavoritesSearch(e.target.value)}
                  placeholder="Filter shortcuts..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {filteredFavorites.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-3">
                <Bookmark className="w-10 h-10 text-slate-400 mx-auto opacity-50" />
                <p className="font-bold text-sm text-slate-700 dark:text-slate-300">No favorite tools match your search.</p>
                <p>Click the bookmark icon on any tool card to save shortcuts for one-click access.</p>
                <button
                  onClick={() => setActiveTab("all-tools")}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 transition-colors cursor-pointer"
                >
                  Explore All 50+ Tools
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFavorites.map((tool) => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    onSelectTool={onSelectTool}
                    isFavorite={true}
                    onToggleFavorite={onToggleFavorite}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* SUBTAB 4: HISTORY & LOGS */}
        {activeSubTab === "history" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-indigo-500" />
                  Full Execution History Logs
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Synchronized across browser session and cloud database
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  placeholder="Search prompts or outputs..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            {filteredHistory.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
                No matching execution history records found.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 space-y-3 shadow-xs hover:border-indigo-500/30 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-indigo-600 dark:text-indigo-400">
                        {item.toolName}
                      </span>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span className="font-mono text-emerald-500 font-semibold">{item.executionTimeMs}ms</span>
                        <span>•</span>
                        <span>{item.timestamp}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/60 dark:border-slate-800/60 text-xs space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Input Prompt / File</span>
                      <p className="text-slate-700 dark:text-slate-300 font-mono text-[11px] line-clamp-2">
                        {item.prompt}
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-900 text-slate-200 border border-slate-800 text-xs space-y-2 relative">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-indigo-400">Generated Output</span>
                        <button
                          onClick={() => handleCopyText(item.output, item.id)}
                          className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          {copiedHistoryId === item.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedHistoryId === item.id ? "Copied" : "Copy Output"}</span>
                        </button>
                      </div>
                      <p className="font-mono text-[11px] line-clamp-3 text-slate-300 whitespace-pre-wrap">
                        {item.output}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SUBTAB 5: SETTINGS & SECURITY */}
        {activeSubTab === "settings" && (
          <div className="space-y-8 animate-fade-in max-w-3xl">
            <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-500" />
                Account Settings & Security
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Customize profile details, interface theme, language, and security settings
              </p>
            </div>

            {/* Form 1: Profile Display Name Edit */}
            <form onSubmit={handleSaveName} className="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 space-y-4 shadow-xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-500" />
                Personal Profile Info
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Display Name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={currentUser?.email || profile.email}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                {nameSavedSuccess && <span className="text-xs font-bold text-emerald-500">Display name saved successfully!</span>}
                <button
                  type="submit"
                  disabled={nameSaving}
                  className="ml-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{nameSaving ? "Saving..." : "Save Profile"}</span>
                </button>
              </div>
            </form>

            {/* Form 2: Theme & Language Preferences */}
            <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 space-y-6 shadow-xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-500" />
                Appearance & Language
              </h3>

              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Interface Theme</h4>
                  <p className="text-[11px] text-slate-500">Toggle between light and dark mode styling</p>
                </div>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 cursor-pointer"
                >
                  {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
                  <span>{theme === "dark" ? "Light Theme" : "Dark Theme"}</span>
                </button>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Display Language</h4>
                  <p className="text-[11px] text-slate-500">Select preferred interface language</p>
                </div>

                <select
                  value={selectedLanguage}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
                >
                  {languages.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Security: Change Password & Connected Accounts */}
            <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 space-y-6 shadow-xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-500" />
                Security & Authentication
              </h3>

              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Change / Reset Password</h4>
                  <p className="text-[11px] text-slate-500">Send a secure password reset link to your email</p>
                </div>
                <button
                  type="button"
                  onClick={handleSendPasswordReset}
                  disabled={resetLoading || resetEmailSent}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Key className="w-4 h-4" />
                  <span>{resetEmailSent ? "Reset Email Sent!" : "Send Password Reset"}</span>
                </button>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Connected Login Provider</h4>
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">
                    {userDoc?.provider === "google.com" ? "G" : "@"}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {userDoc?.provider === "google.com" ? "Google Account OAuth" : "Email & Password Authentication"}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {userDoc?.provider === "google.com" ? "Connected via Google Workspace SSO" : "Secured with standard Firebase Password hash"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Danger Zone: Delete Account */}
            <div className="p-6 rounded-3xl border border-rose-500/30 bg-rose-500/5 space-y-4">
              <div className="flex items-center gap-2 text-rose-500 font-bold text-xs uppercase tracking-wider">
                <Trash2 className="w-4 h-4" />
                <span>Danger Zone</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Permanently delete your account, saved favorites, history logs, and Firestore profile. This action cannot be undone.
              </p>
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/20 cursor-pointer"
              >
                Delete My Account
              </button>
            </div>
          </div>
        )}

        {/* SUBTAB 6: FEEDBACK & BUG REPORTS */}
        {activeSubTab === "feedback" && (
          <div className="space-y-8 animate-fade-in max-w-3xl">
            <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-500" />
                Community Feedback & Tool Requests
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Help us improve Mehzan Digital Tools Hub by reporting issues or requesting new tools
              </p>
            </div>

            {/* Form A: Report Bug */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setBugSubmitted(true);
                setTimeout(() => setBugSubmitted(false), 4000);
                setBugTitle("");
                setBugDescription("");
              }}
              className="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 space-y-4 shadow-xl"
            >
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Bug className="w-4 h-4 text-rose-500" />
                Report a Bug / Issue
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Issue Title</label>
                  <input
                    type="text"
                    required
                    value={bugTitle}
                    onChange={(e) => setBugTitle(e.target.value)}
                    placeholder="e.g. PDF Compressor error on large files"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Severity</label>
                  <select
                    value={bugSeverity}
                    onChange={(e) => setBugSeverity(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium"
                  >
                    <option value="Low">Low (Visual glitch)</option>
                    <option value="Medium">Medium (Feature slow)</option>
                    <option value="High">High (Tool execution failed)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Detailed Description & Steps</label>
                <textarea
                  rows={3}
                  required
                  value={bugDescription}
                  onChange={(e) => setBugDescription(e.target.value)}
                  placeholder="Describe what happened and steps to reproduce..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium"
                ></textarea>
              </div>

              <div className="flex items-center justify-between">
                {bugSubmitted && (
                  <span className="text-xs font-bold text-emerald-500">Bug report submitted to dev team!</span>
                )}
                <button
                  type="submit"
                  className="ml-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 cursor-pointer"
                >
                  Submit Bug Report
                </button>
              </div>
            </form>

            {/* Form B: Request Tool */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setToolReqSubmitted(true);
                setTimeout(() => setToolReqSubmitted(false), 4000);
                setToolReqName("");
                setToolReqDesc("");
              }}
              className="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 space-y-4 shadow-xl"
            >
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-emerald-500" />
                Request a New AI Tool
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Proposed Tool Name</label>
                  <input
                    type="text"
                    required
                    value={toolReqName}
                    onChange={(e) => setToolReqName(e.target.value)}
                    placeholder="e.g. AI Audio Voiceover Generator"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Category</label>
                  <select
                    value={toolReqCategory}
                    onChange={(e) => setToolReqCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium capitalize"
                  >
                    <option value="pdf">PDF Tools</option>
                    <option value="image">Image Tools</option>
                    <option value="qr">QR & Barcode</option>
                    <option value="text">Text & AI Writing</option>
                    <option value="developer">Developer Tools</option>
                    <option value="seo">SEO & Webmaster</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Desired Capabilities</label>
                <textarea
                  rows={2}
                  required
                  value={toolReqDesc}
                  onChange={(e) => setToolReqDesc(e.target.value)}
                  placeholder="What functionality should this requested tool perform?"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium"
                ></textarea>
              </div>

              <div className="flex items-center justify-between">
                {toolReqSubmitted && (
                  <span className="text-xs font-bold text-emerald-500">Tool request added to backlog!</span>
                )}
                <button
                  type="submit"
                  className="ml-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 cursor-pointer"
                >
                  Submit Tool Request
                </button>
              </div>
            </form>
          </div>
        )}

        {/* SUBTAB 7: NOTIFICATIONS */}
        {activeSubTab === "notifications" && (
          <div className="space-y-6 animate-fade-in max-w-3xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-indigo-500" />
                  Notifications & Preferences
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  System announcements and email notification settings
                </p>
              </div>

              {unreadNotifCount > 0 && (
                <button
                  onClick={markAllNotifsRead}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {/* Notification Feed */}
            <div className="space-y-3">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-1">
                  <Bell className="w-6 h-6 mx-auto text-slate-400 opacity-60 mb-2" />
                  <p className="font-bold text-slate-700 dark:text-slate-300">No notifications right now.</p>
                  <p>System announcements and account security alerts will appear here in real-time.</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-4 rounded-2xl border transition-colors flex items-start gap-3 ${
                      n.read
                        ? "bg-white/60 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                        : "bg-indigo-500/5 border-indigo-500/30 text-slate-900 dark:text-slate-100"
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500 shrink-0">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">{n.title}</h4>
                        <span className="text-[10px] text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{n.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Preferences Toggles */}
            <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 space-y-4 shadow-xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Email Notification Preferences
              </h3>

              <div className="space-y-3">
                <label className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                  <span>System Announcements & Major Feature Releases</span>
                  <input
                    type="checkbox"
                    checked={notifPrefs.systemAnnouncements}
                    onChange={(e) => setNotifPrefs({ ...notifPrefs, systemAnnouncements: e.target.checked })}
                    className="w-4 h-4 rounded-md text-indigo-600 accent-indigo-600 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                  <span>Usage Limits & Quota Warnings</span>
                  <input
                    type="checkbox"
                    checked={notifPrefs.usageAlerts}
                    onChange={(e) => setNotifPrefs({ ...notifPrefs, usageAlerts: e.target.checked })}
                    className="w-4 h-4 rounded-md text-indigo-600 accent-indigo-600 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                  <span>Security & Sign-in Alerts</span>
                  <input
                    type="checkbox"
                    checked={notifPrefs.securityAlerts}
                    onChange={(e) => setNotifPrefs({ ...notifPrefs, securityAlerts: e.target.checked })}
                    className="w-4 h-4 rounded-md text-indigo-600 accent-indigo-600 cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Delete Account Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-md rounded-3xl border border-rose-500/30 bg-white dark:bg-slate-900 shadow-2xl p-6 space-y-5 text-center">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="inline-flex p-3 rounded-2xl bg-rose-500/10 text-rose-500">
                <Trash2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Delete Account Permanently?</h3>
                <p className="text-xs text-slate-500">
                  This will permanently delete your user profile, saved history, and favorites. Type <span className="font-bold text-rose-500">DELETE</span> below to confirm.
                </p>
              </div>

              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type DELETE"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center font-mono text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-rose-500"
              />

              {deleteError && (
                <div className="text-xs text-rose-500 font-medium">
                  {deleteError}
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText.trim().toUpperCase() !== "DELETE" || deleteLoading}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 disabled:opacity-50 cursor-pointer"
                >
                  {deleteLoading ? "Deleting..." : "Permanently Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
