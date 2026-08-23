import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  Users,
  Server,
  Database,
  FileText,
  Settings,
  BarChart3,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Download,
  Plus,
  Lock,
  Key,
  Bell,
  MessageSquare,
  Globe,
  FileCode,
  Layers,
  Activity,
  Shield,
  Eye,
  Send,
  HelpCircle,
  Tag,
  Clock,
  TrendingUp,
  Radio,
  History,
  Mail,
  Zap,
} from "lucide-react";
import { Breadcrumb } from "../components/layout/Breadcrumb";
import { SchemaHead } from "../components/layout/SchemaHead";
import { useAuth } from "../context/AuthContext";
import { UserManagementSection } from "../components/admin/UserManagementSection";
import { ToolManagementSection } from "../components/admin/ToolManagementSection";
import { CategoryManagementSection } from "../components/admin/CategoryManagementSection";
import { BlogManagementSection } from "../components/admin/BlogManagementSection";
import { InboxManagementSection } from "../components/admin/InboxManagementSection";
import { NewsletterManagementSection } from "../components/admin/NewsletterManagementSection";
import { SiteSettingsSection } from "../components/admin/SiteSettingsSection";
import { AuditLogsSection } from "../components/admin/AuditLogsSection";
export type { Role, RoleConfig } from "../types/roles";
export { ROLE_CONFIGS } from "../types/roles";

interface AdminDashboardPageProps {
  theme?: "dark" | "light";
  toggleTheme?: () => void;
  onNavigate: (tab: string) => void;
}

export type AdminTab =
  | "overview"
  | "analytics"
  | "users"
  | "tools"
  | "categories"
  | "blog"
  | "inbox"
  | "newsletter"
  | "settings"
  | "audit-logs";

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  theme,
  toggleTheme,
  onNavigate,
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Analytics Range
  const [analyticsRange, setAnalyticsRange] = useState("today");

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/metrics?range=${analyticsRange}`);
      const data = await res.json();
      if (data.success) {
        setMetrics(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch admin metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [analyticsRange]);

  const navItems: { id: AdminTab; label: string; icon: React.ReactNode; badge?: number | string }[] = [
    { id: "overview", label: "Dashboard Overview", icon: <BarChart3 className="w-4 h-4" /> },
    { id: "analytics", label: "Real-Time Analytics", icon: <Activity className="w-4 h-4" /> },
    {
      id: "users",
      label: "User Management",
      icon: <Users className="w-4 h-4" />,
      badge: metrics?.users?.total,
    },
    {
      id: "tools",
      label: "Tool Management",
      icon: <Layers className="w-4 h-4" />,
      badge: metrics?.tools?.total,
    },
    {
      id: "categories",
      label: "Category Management",
      icon: <Tag className="w-4 h-4" />,
      badge: metrics?.categories?.total,
    },
    {
      id: "blog",
      label: "Blog & Articles CMS",
      icon: <FileText className="w-4 h-4" />,
      badge: metrics?.blog?.total,
    },
    {
      id: "inbox",
      label: "Support Inbox",
      icon: <MessageSquare className="w-4 h-4" />,
      badge: metrics?.contact?.unread > 0 ? metrics.contact.unread : undefined,
    },
    {
      id: "newsletter",
      label: "Subscribers & Campaigns",
      icon: <Mail className="w-4 h-4" />,
      badge: metrics?.newsletter?.totalSubscribers,
    },
    { id: "settings", label: "Site Settings & SEO", icon: <Settings className="w-4 h-4" /> },
    { id: "audit-logs", label: "Audit Activity Logs", icon: <History className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors pb-20">
      <SchemaHead
        title="Admin Control Center | Utility Tools Hub"
        description="Production Admin Console for managing tools, categories, articles, support messages, users, and real-time business metrics."
        url="/admin"
      />

      {/* Floating Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xl animate-fade-in text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header Container */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Utility Tools Hub
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                  LIVE PROD
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Enterprise Administration & CMS</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate("home")}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-slate-600 dark:text-slate-300 flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Public Site</span>
            </button>

            <button
              onClick={fetchMetrics}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              title="Refresh Metrics"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-indigo-500" : ""}`} />
            </button>
          </div>
        </div>

        {/* Horizontal Navigation Scroll Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1 py-1.5 min-w-max">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === item.id
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      activeTab === item.id
                        ? "bg-white/20 text-white"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-fade-in">
            {/* Quick Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Users Metric */}
              <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">Total Users</span>
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    {metrics?.users?.total ?? 0}
                  </span>
                  <span className="text-xs font-semibold text-emerald-500">
                    +{metrics?.users?.newToday ?? 0} today
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span>Active: {metrics?.users?.active ?? 0}</span>
                  <span>This Week: +{metrics?.users?.newThisWeek ?? 0}</span>
                </div>
              </div>

              {/* Tools Metric */}
              <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">Platform Tools</span>
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    {metrics?.tools?.total ?? 0}
                  </span>
                  <span className="text-xs font-semibold text-purple-500">
                    {metrics?.tools?.active ?? 0} active
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span>Categories: {metrics?.categories?.total ?? 0}</span>
                  <span>Disabled: {metrics?.tools?.disabled ?? 0}</span>
                </div>
              </div>

              {/* Blog & Articles Metric */}
              <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">Articles & Guides</span>
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    {metrics?.blog?.total ?? 0}
                  </span>
                  <span className="text-xs font-semibold text-blue-500">
                    {metrics?.blog?.published ?? 0} published
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span>Drafts: {metrics?.blog?.draft ?? 0}</span>
                  <span>Subscribers: {metrics?.newsletter?.totalSubscribers ?? 0}</span>
                </div>
              </div>

              {/* Support & Inbox Metric */}
              <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">Support Inbox</span>
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    {metrics?.contact?.total ?? 0}
                  </span>
                  {metrics?.contact?.unread > 0 ? (
                    <span className="text-xs font-semibold text-amber-500">
                      {metrics.contact.unread} unread
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-emerald-500">All caught up</span>
                  )}
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span>Bug Reports: {metrics?.reports?.openBugReports ?? 0}</span>
                  <span>Threats Blocked: {metrics?.security?.threatsBlocked ?? 0}</span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" /> Admin Quick Actions
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                <button
                  onClick={() => setActiveTab("tools")}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 flex flex-col items-center gap-2 text-center transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Add New Tool
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("categories")}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 flex flex-col items-center gap-2 text-center transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                    <Tag className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Add Category
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("blog")}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 flex flex-col items-center gap-2 text-center transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Write Article
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("newsletter")}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 flex flex-col items-center gap-2 text-center transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-500 flex items-center justify-center">
                    <Send className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Send Campaign
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("inbox")}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 flex flex-col items-center gap-2 text-center transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    View Inbox
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("settings")}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 flex flex-col items-center gap-2 text-center transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                    <Settings className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Site Settings
                  </span>
                </button>
              </div>
            </div>

            {/* Top Performing Tools & Live Recent Activity */}
            {metrics?.analytics && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Tools by Volume */}
                <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-indigo-500" /> Top Performing Tools
                  </h3>
                  <div className="space-y-3">
                    {metrics.analytics.topTools?.slice(0, 5).map((tool: any) => (
                      <div
                        key={tool.toolId}
                        className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 text-xs"
                      >
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {tool.toolName}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            Views: {tool.views} | Starts: {tool.starts}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            {tool.completionRate}%
                          </span>
                          <span className="block text-[10px] text-slate-400">Completion</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live Activity Stream */}
                <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-indigo-500" /> Live Visitor Activity Stream
                  </h3>
                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {metrics.analytics.liveActivity?.slice(0, 6).map((item: any) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                          <div className="truncate">
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                              {item.action}
                            </span>{" "}
                            <span className="text-slate-400">({item.tool})</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap font-mono">
                          {item.country} • {new Date(item.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* REAL-TIME ANALYTICS TAB */}
        {activeTab === "analytics" && metrics?.analytics && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-500" /> Production Analytics & Traffic Intelligence
                </h2>
                <p className="text-xs text-slate-500">
                  Real visitor telemetry, tool completion rates, device breakdown, and geo distribution.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {(["today", "7days", "30days"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setAnalyticsRange(r)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize cursor-pointer transition-all ${
                      analyticsRange === r
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {r === "7days" ? "7 Days" : r === "30days" ? "30 Days" : "Today"}
                  </button>
                ))}
              </div>
            </div>

            {/* Metrics Overview Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-[10px] font-bold text-slate-400 block">UNIQUE VISITORS</span>
                <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {metrics.analytics.overview.uniqueVisitors}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-[10px] font-bold text-slate-400 block">TOTAL PAGEVIEWS</span>
                <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
                  {metrics.analytics.overview.pageViews}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-[10px] font-bold text-slate-400 block">TOOL USES</span>
                <span className="text-xl font-extrabold text-purple-600 dark:text-purple-400">
                  {metrics.analytics.overview.toolUses}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-[10px] font-bold text-slate-400 block">SUCCESSFUL</span>
                <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  {metrics.analytics.overview.successfulToolUses}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-[10px] font-bold text-slate-400 block">DOWNLOADS</span>
                <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400">
                  {metrics.analytics.overview.downloads}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-[10px] font-bold text-slate-400 block">AVG DURATION</span>
                <span className="text-xl font-extrabold text-amber-600 dark:text-amber-400">
                  {metrics.analytics.overview.avgDurationSec}s
                </span>
              </div>
            </div>

            {/* Countries & Devices Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Countries */}
              <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-indigo-500" /> Geographic Visitor Distribution
                </h3>
                <div className="space-y-2">
                  {metrics.analytics.countryAnalytics?.map((c: any) => (
                    <div
                      key={c.country}
                      className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 text-xs"
                    >
                      <span className="font-bold text-slate-900 dark:text-white">{c.country}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400 font-mono">{c.visitors} visitors</span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">{c.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Devices & Browsers */}
              <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Server className="w-4 h-4 text-indigo-500" /> Device & Browser Intelligence
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold text-slate-400 uppercase">Device Types</p>
                    {metrics.analytics.deviceAnalytics?.devices?.map((d: any) => (
                      <div
                        key={d.device}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs"
                      >
                        <span className="font-medium text-slate-800 dark:text-slate-200">{d.device}</span>
                        <span className="font-bold text-indigo-500">{d.percentage}%</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <p className="text-[11px] font-bold text-slate-400 uppercase">Browsers</p>
                    {metrics.analytics.deviceAnalytics?.browsers?.map((b: any) => (
                      <div
                        key={b.browser}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs"
                      >
                        <span className="font-medium text-slate-800 dark:text-slate-200">{b.browser}</span>
                        <span className="font-bold text-indigo-500">{b.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === "users" && (
          <UserManagementSection
            onShowNotification={showNotification}
            currentUserRole={(user as any)?.role || "super_admin"}
          />
        )}

        {/* TOOLS TAB */}
        {activeTab === "tools" && (
          <ToolManagementSection onShowNotification={showNotification} onNavigate={onNavigate} />
        )}

        {/* CATEGORIES TAB */}
        {activeTab === "categories" && (
          <CategoryManagementSection onShowNotification={showNotification} />
        )}

        {/* BLOG CMS TAB */}
        {activeTab === "blog" && (
          <BlogManagementSection onShowNotification={showNotification} onNavigate={onNavigate} />
        )}

        {/* INBOX & SUPPORT TAB */}
        {activeTab === "inbox" && (
          <InboxManagementSection onShowNotification={showNotification} />
        )}

        {/* NEWSLETTER TAB */}
        {activeTab === "newsletter" && (
          <NewsletterManagementSection onShowNotification={showNotification} />
        )}

        {/* SITE SETTINGS TAB */}
        {activeTab === "settings" && (
          <SiteSettingsSection onShowNotification={showNotification} />
        )}

        {/* AUDIT LOGS TAB */}
        {activeTab === "audit-logs" && (
          <AuditLogsSection onShowNotification={showNotification} />
        )}
      </div>
    </div>
  );
};
