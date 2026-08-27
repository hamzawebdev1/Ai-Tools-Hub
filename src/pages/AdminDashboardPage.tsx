import React, { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  Users,
  Layers,
  Tag,
  BarChart3,
  FileText,
  MessageSquare,
  Mail,
  Image as ImageIcon,
  Settings,
  History,
  LogOut,
  ChevronDown,
  ChevronRight,
  Search,
  Bell,
  Plus,
  Globe,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  Shield,
  Activity,
  ArrowUpRight,
  TrendingUp,
  Download,
  Eye,
  Check,
  X,
  Menu,
  Moon,
  Sun,
  Laptop,
  Smartphone,
  Tablet,
  FolderOpen,
  Send,
  Lock,
  Cpu,
  UserPlus,
  HelpCircle,
} from "lucide-react";
import { SchemaHead } from "../components/layout/SchemaHead";
import { useAuth } from "../context/AuthContext";
import { UserManagementSection } from "../components/admin/UserManagementSection";
import { ToolManagementSection } from "../components/admin/ToolManagementSection";
import { CategoryManagementSection } from "../components/admin/CategoryManagementSection";
import { BlogManagementSection } from "../components/admin/BlogManagementSection";
import { InboxManagementSection } from "../components/admin/InboxManagementSection";
import { NewsletterManagementSection } from "../components/admin/NewsletterManagementSection";
import { MediaManagementSection } from "../components/admin/MediaManagementSection";
import { SiteSettingsSection } from "../components/admin/SiteSettingsSection";
import { AuditLogsSection } from "../components/admin/AuditLogsSection";
export type { Role, RoleConfig } from "../types/roles";
export { ROLE_CONFIGS } from "../types/roles";

interface AdminDashboardPageProps {
  theme?: "dark" | "light";
  toggleTheme?: () => void;
  onNavigate: (tab: string, params?: any) => void;
}

export type AdminMenuKey =
  | "dashboard"
  | "users"
  | "tools"
  | "categories"
  | "analytics"
  | "content"
  | "inbox"
  | "newsletter"
  | "media"
  | "settings"
  | "audit-logs";

export interface NavItemConfig {
  key: AdminMenuKey;
  label: string;
  icon: React.ReactNode;
  badge?: number | string;
  subItems?: { key: string; label: string }[];
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  theme = "dark",
  toggleTheme,
  onNavigate,
}) => {
  const { user, logout } = useAuth();
  const [activeMenu, setActiveMenu] = useState<AdminMenuKey>("dashboard");
  const [activeSubItem, setActiveSubItem] = useState<string>("all");
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    users: true,
    tools: true,
    content: true,
    analytics: true,
    newsletter: true,
  });

  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [metrics, setMetrics] = useState<any>(null);
  const [loadingMetrics, setLoadingMetrics] = useState(false);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // Global Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Notifications Popover State
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // User Profile Menu & Quick Add Menu
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  // Analytics View Range
  const [analyticsRange, setAnalyticsRange] = useState("today");

  const showNotification = (msg: string) => {
    setNotificationToast(msg);
    setTimeout(() => setNotificationToast(null), 4000);
  };

  const fetchMetrics = async () => {
    setLoadingMetrics(true);
    try {
      const res = await fetch(`/api/admin/metrics?range=${analyticsRange}`);
      const data = await res.json();
      if (data.success) {
        setMetrics(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch admin metrics:", err);
    } finally {
      setLoadingMetrics(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/admin/notifications");
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications || []);
        setUnreadNotifCount(data.totalUnread || 0);
      }
    } catch (e) {
      console.warn("Could not fetch notifications:", e);
    }
  };

  useEffect(() => {
    fetchMetrics();
    fetchNotifications();
  }, [analyticsRange]);

  // Handle Global Search lookup
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await fetch(`/api/admin/global-search?q=${encodeURIComponent(searchQuery.trim())}`);
        const data = await res.json();
        if (data.success) {
          setSearchResults(data.results || []);
        }
      } catch (e) {
        console.error("Search error:", e);
      } finally {
        setSearchLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const toggleSubMenu = (menuKey: string) => {
    setExpandedMenus((prev) => ({ ...prev, [menuKey]: !prev[menuKey] }));
  };

  const handleNavigateMenu = (menuKey: AdminMenuKey, subItem: string = "all") => {
    setActiveMenu(menuKey);
    setActiveSubItem(subItem);
    setMobileSidebarOpen(false);
  };

  const handleSearchResultClick = (result: any) => {
    if (result.targetTab === "users") {
      setActiveMenu("users");
      setActiveSubItem("all");
    } else if (result.targetTab === "tools") {
      setActiveMenu("tools");
      setActiveSubItem("all");
    } else if (result.targetTab === "categories") {
      setActiveMenu("categories");
      setActiveSubItem("all");
    } else if (result.targetTab === "content") {
      setActiveMenu("content");
      setActiveSubItem("articles");
    } else if (result.targetTab === "inbox") {
      setActiveMenu("inbox");
      setActiveSubItem("all");
    } else if (result.targetTab === "newsletter") {
      setActiveMenu("newsletter");
      setActiveSubItem("subscribers");
    } else if (result.targetTab === "media") {
      setActiveMenu("media");
      setActiveSubItem("all");
    }
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const navTree: NavItemConfig[] = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      key: "users",
      label: "Users",
      icon: <Users className="w-4 h-4" />,
      badge: metrics?.users?.total > 0 ? metrics.users.total : undefined,
      subItems: [
        { key: "all", label: "All Users" },
        { key: "add-new", label: "Add New" },
        { key: "activity", label: "User Activity" },
      ],
    },
    {
      key: "tools",
      label: "Tools",
      icon: <Layers className="w-4 h-4" />,
      badge: metrics?.tools?.total > 0 ? metrics.tools.total : undefined,
      subItems: [
        { key: "all", label: "All Tools" },
        { key: "add-new", label: "Add New" },
        { key: "usage", label: "Tool Usage" },
      ],
    },
    {
      key: "categories",
      label: "Categories",
      icon: <Tag className="w-4 h-4" />,
      badge: metrics?.categories?.total > 0 ? metrics.categories.total : undefined,
    },
    {
      key: "analytics",
      label: "Analytics",
      icon: <BarChart3 className="w-4 h-4" />,
      subItems: [
        { key: "overview", label: "Overview" },
        { key: "visitors", label: "Visitors" },
        { key: "tools", label: "Tools" },
        { key: "countries", label: "Countries" },
        { key: "devices", label: "Devices" },
      ],
    },
    {
      key: "content",
      label: "Content",
      icon: <FileText className="w-4 h-4" />,
      badge: metrics?.blog?.total > 0 ? metrics.blog.total : undefined,
      subItems: [
        { key: "articles", label: "All Articles" },
        { key: "add-new", label: "Add New" },
        { key: "categories", label: "Categories" },
      ],
    },
    {
      key: "inbox",
      label: "Contact Messages",
      icon: <MessageSquare className="w-4 h-4" />,
      badge: metrics?.contact?.unread > 0 ? metrics.contact.unread : undefined,
    },
    {
      key: "newsletter",
      label: "Newsletter",
      icon: <Mail className="w-4 h-4" />,
      badge: metrics?.newsletter?.totalSubscribers > 0 ? metrics.newsletter.totalSubscribers : undefined,
      subItems: [
        { key: "subscribers", label: "Subscribers" },
        { key: "campaigns", label: "Campaigns" },
        { key: "compose", label: "Compose" },
      ],
    },
    {
      key: "media",
      label: "Media",
      icon: <ImageIcon className="w-4 h-4" />,
    },
    {
      key: "settings",
      label: "Settings",
      icon: <Settings className="w-4 h-4" />,
    },
    {
      key: "audit-logs",
      label: "Activity Logs",
      icon: <History className="w-4 h-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white" id="wordpress-admin-app">
      <SchemaHead
        title="Admin Control Center | WordPress-Style CMS"
        description="Production WordPress-style Content & Tool Management System for Mehzan Digital Tools Hub."
        url="/admin"
      />

      {/* Floating Notification Toast */}
      {notificationToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xl border border-slate-700 dark:border-slate-300 animate-fade-in text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notificationToast}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. TOP WORDPRESS-STYLE ADMIN BAR                          */}
      {/* ========================================================= */}
      <header className="h-12 bg-slate-900 text-slate-200 border-b border-slate-800 flex items-center justify-between px-3 sm:px-4 z-40 sticky top-0 shrink-0 text-xs select-none">
        {/* Left Section: Brand / Site Link / Quick Add */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="md:hidden p-1.5 hover:bg-slate-800 rounded text-slate-300"
            title="Toggle Sidebar"
          >
            <Menu className="w-4 h-4" />
          </button>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden md:flex p-1.5 hover:bg-slate-800 rounded text-slate-300"
            title="Toggle Sidebar Width"
          >
            <Menu className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5 font-bold text-white tracking-wide">
            <div className="w-5 h-5 rounded bg-indigo-600 flex items-center justify-center text-white text-[11px] font-black">
              W
            </div>
            <span className="hidden sm:inline">Mehzan Digital Tools Hub</span>
          </div>

          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition"
            title="Open Public Site"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Visit Site</span>
          </button>

          {/* Quick Add Menu */}
          <div className="relative">
            <button
              onClick={() => setIsQuickAddOpen(!isQuickAddOpen)}
              className="flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition font-medium"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">New</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {isQuickAddOpen && (
              <div className="absolute left-0 top-full mt-1 w-44 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-1 z-50 animate-fade-in">
                <button
                  onClick={() => {
                    handleNavigateMenu("tools", "add-new");
                    setIsQuickAddOpen(false);
                  }}
                  className="w-full px-3 py-1.5 text-left text-xs text-slate-300 hover:bg-indigo-600 hover:text-white flex items-center gap-2"
                >
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Tool</span>
                </button>
                <button
                  onClick={() => {
                    handleNavigateMenu("content", "add-new");
                    setIsQuickAddOpen(false);
                  }}
                  className="w-full px-3 py-1.5 text-left text-xs text-slate-300 hover:bg-indigo-600 hover:text-white flex items-center gap-2"
                >
                  <FileText className="w-3.5 h-3.5 text-purple-400" />
                  <span>Article</span>
                </button>
                <button
                  onClick={() => {
                    handleNavigateMenu("users", "add-new");
                    setIsQuickAddOpen(false);
                  }}
                  className="w-full px-3 py-1.5 text-left text-xs text-slate-300 hover:bg-indigo-600 hover:text-white flex items-center gap-2"
                >
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  <span>User</span>
                </button>
                <button
                  onClick={() => {
                    handleNavigateMenu("media");
                    setIsQuickAddOpen(false);
                  }}
                  className="w-full px-3 py-1.5 text-left text-xs text-slate-300 hover:bg-indigo-600 hover:text-white flex items-center gap-2"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                  <span>Media</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Center: Global Admin Search */}
        <div className="relative max-w-xs sm:max-w-sm w-full mx-2 hidden sm:block">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Search users, tools, articles, messages..."
              className="w-full pl-8 pr-3 py-1 bg-slate-800/90 border border-slate-700 rounded-md text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSearchResults([]);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Search Dropdown Popup */}
          {isSearchOpen && searchQuery.trim().length >= 2 && (
            <div className="absolute left-0 top-full mt-1.5 w-full bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto">
              <div className="p-2 border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 flex items-center justify-between">
                <span>Global CMS Results</span>
                {searchLoading && <RefreshCw className="w-3 h-3 animate-spin text-indigo-400" />}
              </div>

              {searchLoading ? (
                <div className="p-4 text-center text-slate-400 text-xs">Searching database...</div>
              ) : searchResults.length === 0 ? (
                <div className="p-4 text-center text-slate-400 text-xs">No records found for "{searchQuery}".</div>
              ) : (
                <div className="divide-y divide-slate-800">
                  {searchResults.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSearchResultClick(item)}
                      className="w-full p-2.5 text-left hover:bg-slate-800 transition flex items-start gap-2.5"
                    >
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-slate-800 border border-slate-700 text-indigo-400 shrink-0">
                        {item.category}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-100 truncate">{item.title}</p>
                        <p className="text-[11px] text-slate-400 truncate">{item.subtitle}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Section: Notifications / Theme / Admin Profile */}
        <div className="flex items-center gap-2">
          {/* Real Notifications Button */}
          <div className="relative">
            <button
              onClick={() => {
                setIsNotifOpen(!isNotifOpen);
                fetchNotifications();
              }}
              className="p-1.5 hover:bg-slate-800 rounded text-slate-300 hover:text-white relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                  {unreadNotifCount > 9 ? "9+" : unreadNotifCount}
                </span>
              )}
            </button>

            {/* Notifications Popover */}
            {isNotifOpen && (
              <div className="absolute right-0 top-full mt-1 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in">
                <div className="p-3 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    <Bell className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Real-Time Notifications</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold">{unreadNotifCount} Unread</span>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/80">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500/40 mx-auto mb-1" />
                      All systems operating normally. No new alerts.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          if (n.targetTab === "inbox") handleNavigateMenu("inbox");
                          else if (n.targetTab === "newsletter") handleNavigateMenu("newsletter", "subscribers");
                          else if (n.targetTab === "users") handleNavigateMenu("users", "all");
                          else if (n.targetTab === "tools") handleNavigateMenu("tools", "all");
                          setIsNotifOpen(false);
                        }}
                        className="p-3 hover:bg-slate-800 transition cursor-pointer text-left"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-200">{n.title}</span>
                          <span className="text-[9px] text-slate-500">
                            {new Date(n.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5 truncate">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          {toggleTheme && (
            <button
              onClick={toggleTheme}
              className="p-1.5 hover:bg-slate-800 rounded text-slate-300 hover:text-white"
              title="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          )}

          {/* Admin User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 px-2 py-1 rounded hover:bg-slate-800 transition"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center text-[10px]">
                {user?.displayName ? user.displayName.charAt(0).toUpperCase() : "A"}
              </div>
              <span className="hidden sm:inline font-semibold text-slate-200">
                {user?.displayName || user?.email?.split("@")[0] || "Super Admin"}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-1 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 animate-fade-in">
                <div className="px-3 py-2 border-b border-slate-800">
                  <p className="text-xs font-bold text-white truncate">{user?.displayName || "Super Admin"}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user?.email || "admin@security.hub"}</p>
                  <span className="inline-block mt-1 px-1.5 py-0.5 bg-indigo-950 text-indigo-400 border border-indigo-800 rounded text-[9px] font-bold">
                    Super Admin Role
                  </span>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      handleNavigateMenu("settings");
                      setIsProfileOpen(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-xs text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    <span>Site Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      handleNavigateMenu("audit-logs");
                      setIsProfileOpen(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-xs text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                  >
                    <History className="w-3.5 h-3.5 text-slate-400" />
                    <span>Activity Log</span>
                  </button>
                </div>

                <div className="pt-1 border-t border-slate-800">
                  <button
                    onClick={async () => {
                      setIsProfileOpen(false);
                      await logout();
                      onNavigate("home");
                    }}
                    className="w-full px-3 py-1.5 text-left text-xs text-rose-400 hover:bg-rose-950/40 flex items-center gap-2 font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 2. BODY LAYOUT: SIDEBAR + MAIN CONTENT AREA               */}
      {/* ========================================================= */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT SIDEBAR (Desktop & Mobile Drawer) */}
        <aside
          className={`${
            sidebarOpen ? "w-60" : "w-16"
          } bg-slate-900 text-slate-300 border-r border-slate-800 transition-all duration-200 shrink-0 flex flex-col justify-between hidden md:flex z-30 select-none`}
        >
          {/* Main Navigation Menu Items */}
          <div className="p-2 space-y-1 overflow-y-auto">
            {navTree.map((item) => {
              const isActive = activeMenu === item.key;
              const isExpanded = !!expandedMenus[item.key];
              const hasSubItems = item.subItems && item.subItems.length > 0;

              return (
                <div key={item.key} className="space-y-0.5">
                  <button
                    onClick={() => {
                      if (hasSubItems && !sidebarOpen) {
                        setSidebarOpen(true);
                      }
                      if (hasSubItems) {
                        toggleSubMenu(item.key);
                      }
                      handleNavigateMenu(item.key, item.subItems ? item.subItems[0].key : "all");
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                    title={item.label}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={isActive ? "text-white" : "text-slate-400"}>{item.icon}</span>
                      {sidebarOpen && <span className="truncate">{item.label}</span>}
                    </div>

                    {sidebarOpen && (
                      <div className="flex items-center gap-1.5">
                        {item.badge !== undefined && (
                          <span
                            className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                              isActive ? "bg-white/20 text-white" : "bg-slate-800 text-indigo-400"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                        {hasSubItems && (
                          <ChevronDown
                            className={`w-3 h-3 opacity-60 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                          />
                        )}
                      </div>
                    )}
                  </button>

                  {/* WordPress-style Collapsible Sub-menu */}
                  {sidebarOpen && hasSubItems && isExpanded && (
                    <div className="pl-7 pr-2 py-0.5 space-y-0.5 border-l border-slate-800 ml-4">
                      {item.subItems!.map((sub) => {
                        const isSubActive = isActive && activeSubItem === sub.key;

                        return (
                          <button
                            key={sub.key}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNavigateMenu(item.key, sub.key);
                            }}
                            className={`w-full text-left px-2.5 py-1 rounded text-[11px] transition ${
                              isSubActive
                                ? "text-indigo-400 font-bold bg-indigo-950/40"
                                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                            }`}
                          >
                            {sub.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Footer Details */}
          {sidebarOpen && (
            <div className="p-3 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
              <span>CMS v4.2 Pro</span>
              <span className="text-emerald-500 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Online
              </span>
            </div>
          )}
        </aside>

        {/* Mobile Slide-Over Sidebar Drawer */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <div
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            />
            <div className="relative w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col justify-between p-3 z-10 overflow-y-auto">
              <div className="space-y-1">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="font-bold text-white text-sm">Navigation</span>
                  <button onClick={() => setMobileSidebarOpen(false)} className="p-1 text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {navTree.map((item) => (
                  <div key={item.key} className="space-y-0.5">
                    <button
                      onClick={() => handleNavigateMenu(item.key, item.subItems ? item.subItems[0].key : "all")}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold ${
                        activeMenu === item.key ? "bg-indigo-600 text-white" : "hover:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-slate-800 text-indigo-400">
                          {item.badge}
                        </span>
                      )}
                    </button>

                    {item.subItems && (
                      <div className="pl-6 space-y-0.5">
                        {item.subItems.map((sub) => (
                          <button
                            key={sub.key}
                            onClick={() => handleNavigateMenu(item.key, sub.key)}
                            className={`w-full text-left px-2 py-1 rounded text-xs ${
                              activeMenu === item.key && activeSubItem === sub.key
                                ? "text-indigo-400 font-bold"
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            {sub.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 3. MAIN WORKSPACE / CMS CONTENT PANE                      */}
        {/* ========================================================= */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-100 dark:bg-slate-950">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Top Section Breadcrumb & Page Title */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight capitalize flex items-center gap-2">
                  {activeMenu === "dashboard" && <LayoutDashboard className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />}
                  {activeMenu === "users" && <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />}
                  {activeMenu === "tools" && <Layers className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />}
                  {activeMenu === "categories" && <Tag className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />}
                  {activeMenu === "analytics" && <BarChart3 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />}
                  {activeMenu === "content" && <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />}
                  {activeMenu === "inbox" && <MessageSquare className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />}
                  {activeMenu === "newsletter" && <Mail className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />}
                  {activeMenu === "media" && <ImageIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />}
                  {activeMenu === "settings" && <Settings className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />}
                  {activeMenu === "audit-logs" && <History className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />}

                  <span>{activeMenu === "content" ? "Content & Articles" : activeMenu.replace("-", " ")}</span>

                  {activeSubItem !== "all" && (
                    <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
                      / {activeSubItem.replace("-", " ")}
                    </span>
                  )}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  WordPress-Style Administration Console • Real database synchronization
                </p>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center gap-2">
                {activeMenu === "dashboard" && (
                  <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1 shadow-xs">
                    {(["today", "yesterday", "7days", "30days"] as const).map((rng) => (
                      <button
                        key={rng}
                        onClick={() => setAnalyticsRange(rng)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition ${
                          analyticsRange === rng
                            ? "bg-indigo-600 text-white"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        {rng === "7days" ? "7 Days" : rng === "30days" ? "30 Days" : rng}
                      </button>
                    ))}
                  </div>
                )}

                <button
                  onClick={fetchMetrics}
                  disabled={loadingMetrics}
                  className="p-2 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 transition shadow-xs flex items-center gap-1.5 text-xs font-medium"
                  title="Refresh Data"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingMetrics ? "animate-spin text-indigo-500" : ""}`} />
                  <span className="hidden sm:inline">Sync</span>
                </button>
              </div>
            </div>

            {/* ========================================================= */}
            {/* VIEW 1: WORDPRESS-STYLE DASHBOARD OVERVIEW               */}
            {/* ========================================================= */}
            {activeMenu === "dashboard" && (
              <div className="space-y-6 animate-fade-in">
                {/* 10 Real Database Metrics Widget Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                  {/* Total Users */}
                  <div
                    onClick={() => handleNavigateMenu("users", "all")}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-indigo-500/40 transition cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider">Total Users</span>
                      <Users className="w-4 h-4 text-indigo-500" />
                    </div>
                    <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                      {metrics?.users?.total ?? 0}
                    </div>
                    <div className="text-[11px] text-emerald-500 font-semibold mt-1">
                      +{metrics?.users?.newToday ?? 0} today
                    </div>
                  </div>

                  {/* Visitors Today */}
                  <div
                    onClick={() => handleNavigateMenu("analytics", "visitors")}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-indigo-500/40 transition cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider">Visitors Today</span>
                      <Eye className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                      {metrics?.analytics?.totalVisitors ?? 0}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      {metrics?.analytics?.uniqueVisitors ?? 0} unique
                    </div>
                  </div>

                  {/* Tool Uses Today */}
                  <div
                    onClick={() => handleNavigateMenu("tools", "usage")}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-indigo-500/40 transition cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider">Tool Uses</span>
                      <Activity className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                      {metrics?.analytics?.toolExecutions ?? 0}
                    </div>
                    <div className="text-[11px] text-emerald-500 font-semibold mt-1">
                      {metrics?.analytics?.successfulToolUses ?? 0} success
                    </div>
                  </div>

                  {/* Downloads */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider">Downloads</span>
                      <Download className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                      {metrics?.analytics?.downloads ?? 0}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">Export files</div>
                  </div>

                  {/* Contact Messages */}
                  <div
                    onClick={() => handleNavigateMenu("inbox")}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-indigo-500/40 transition cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider">Messages</span>
                      <MessageSquare className="w-4 h-4 text-purple-500" />
                    </div>
                    <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                      {metrics?.contact?.total ?? 0}
                    </div>
                    <div className="text-[11px] text-rose-500 font-semibold mt-1">
                      {metrics?.contact?.unread ?? 0} unread
                    </div>
                  </div>

                  {/* Newsletter Subscribers */}
                  <div
                    onClick={() => handleNavigateMenu("newsletter", "subscribers")}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-indigo-500/40 transition cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider">Subscribers</span>
                      <Mail className="w-4 h-4 text-rose-500" />
                    </div>
                    <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                      {metrics?.newsletter?.totalSubscribers ?? 0}
                    </div>
                    <div className="text-[11px] text-emerald-500 font-semibold mt-1">Active audience</div>
                  </div>

                  {/* Published Articles */}
                  <div
                    onClick={() => handleNavigateMenu("content", "articles")}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-indigo-500/40 transition cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider">Articles</span>
                      <FileText className="w-4 h-4 text-indigo-500" />
                    </div>
                    <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                      {metrics?.blog?.total ?? 0}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      {metrics?.blog?.published ?? 0} published
                    </div>
                  </div>

                  {/* Active Tools */}
                  <div
                    onClick={() => handleNavigateMenu("tools", "all")}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-indigo-500/40 transition cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider">Active Tools</span>
                      <Layers className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                      {metrics?.tools?.active ?? 0}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      {metrics?.tools?.total ?? 0} in catalog
                    </div>
                  </div>

                  {/* Categories */}
                  <div
                    onClick={() => handleNavigateMenu("categories")}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-indigo-500/40 transition cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider">Categories</span>
                      <Tag className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                      {metrics?.categories?.total ?? 0}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">Taxonomies</div>
                  </div>

                  {/* Security Status */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider">Security</span>
                      <Shield className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                      Protected
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">RBAC & WAF Active</div>
                  </div>
                </div>

                {/* WordPress "At A Glance" & Quick Actions Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left 2 Cols: At A Glance & Real Telemetry */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        Traffic & Activity Overview ({analyticsRange.toUpperCase()})
                      </h3>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 mb-6">
                        <div>
                          <p className="text-[11px] font-semibold text-slate-400 uppercase">Pageviews</p>
                          <p className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
                            {metrics?.analytics?.totalVisitors ?? 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold text-slate-400 uppercase">Tool Completions</p>
                          <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                            {metrics?.analytics?.successfulToolUses ?? 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold text-slate-400 uppercase">Registered Users</p>
                          <p className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
                            {metrics?.users?.total ?? 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold text-slate-400 uppercase">System Errors</p>
                          <p className="text-lg font-extrabold text-rose-600 dark:text-rose-400 mt-0.5">
                            {metrics?.analytics?.errorEvents ?? 0}
                          </p>
                        </div>
                      </div>

                      {/* Top Device Breakdown */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                          Device Distribution
                        </h4>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                            <Laptop className="w-5 h-5 text-indigo-500" />
                            <div>
                              <p className="text-xs font-bold text-slate-900 dark:text-white">Desktop</p>
                              <p className="text-[11px] text-slate-500">
                                {metrics?.analytics?.devices?.Desktop ?? 0} sessions
                              </p>
                            </div>
                          </div>
                          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                            <Smartphone className="w-5 h-5 text-emerald-500" />
                            <div>
                              <p className="text-xs font-bold text-slate-900 dark:text-white">Mobile</p>
                              <p className="text-[11px] text-slate-500">
                                {metrics?.analytics?.devices?.Mobile ?? 0} sessions
                              </p>
                            </div>
                          </div>
                          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                            <Tablet className="w-5 h-5 text-purple-500" />
                            <div>
                              <p className="text-xs font-bold text-slate-900 dark:text-white">Tablet</p>
                              <p className="text-[11px] text-slate-500">
                                {metrics?.analytics?.devices?.Tablet ?? 0} sessions
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Col: Quick Draft & Admin Shortcuts */}
                  <div className="space-y-6">
                    {/* Quick Shortcuts */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Quick Navigation</h3>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <button
                          onClick={() => handleNavigateMenu("tools", "add-new")}
                          className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-700 text-left font-medium text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4 text-emerald-500" />
                          <span>Add New Tool</span>
                        </button>
                        <button
                          onClick={() => handleNavigateMenu("content", "add-new")}
                          className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-700 text-left font-medium text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition flex items-center gap-2"
                        >
                          <FileText className="w-4 h-4 text-purple-500" />
                          <span>New Article</span>
                        </button>
                        <button
                          onClick={() => handleNavigateMenu("newsletter", "compose")}
                          className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-700 text-left font-medium text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition flex items-center gap-2"
                        >
                          <Send className="w-4 h-4 text-indigo-500" />
                          <span>Broadcast Email</span>
                        </button>
                        <button
                          onClick={() => handleNavigateMenu("media")}
                          className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-700 text-left font-medium text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition flex items-center gap-2"
                        >
                          <ImageIcon className="w-4 h-4 text-amber-500" />
                          <span>Media Library</span>
                        </button>
                      </div>
                    </div>

                    {/* WordPress-style Quick Draft */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Quick Draft</h3>
                      <p className="text-[11px] text-slate-400 mb-3">Save an article idea directly to your drafts.</p>
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          const form = e.target as HTMLFormElement;
                          const title = (form.elements.namedItem("draftTitle") as HTMLInputElement).value;
                          const content = (form.elements.namedItem("draftContent") as HTMLTextAreaElement).value;
                          if (!title) return;

                          try {
                            const res = await fetch("/api/admin/blog", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                title,
                                content,
                                status: "draft",
                                excerpt: content.slice(0, 120),
                              }),
                            });
                            const data = await res.json();
                            if (data.success) {
                              showNotification(`Draft "${title}" saved successfully!`);
                              form.reset();
                              fetchMetrics();
                            }
                          } catch (err) {
                            console.error(err);
                          }
                        }}
                        className="space-y-3"
                      >
                        <input
                          name="draftTitle"
                          type="text"
                          required
                          placeholder="Title"
                          className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        <textarea
                          name="draftContent"
                          rows={3}
                          placeholder="What's on your mind?..."
                          className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                        ></textarea>
                        <button
                          type="submit"
                          className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition"
                        >
                          Save Draft
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* VIEW 2: USERS SECTION                                     */}
            {/* ========================================================= */}
            {activeMenu === "users" && (
              <div className="animate-fade-in">
                <UserManagementSection
                  onShowNotification={showNotification}
                  onNavigate={onNavigate}
                />
              </div>
            )}

            {/* ========================================================= */}
            {/* VIEW 3: TOOLS SECTION                                     */}
            {/* ========================================================= */}
            {activeMenu === "tools" && (
              <div className="animate-fade-in">
                <ToolManagementSection
                  onShowNotification={showNotification}
                  onNavigate={onNavigate}
                />
              </div>
            )}

            {/* ========================================================= */}
            {/* VIEW 4: CATEGORIES SECTION                                */}
            {/* ========================================================= */}
            {activeMenu === "categories" && (
              <div className="animate-fade-in">
                <CategoryManagementSection
                  onShowNotification={showNotification}
                />
              </div>
            )}

            {/* ========================================================= */}
            {/* VIEW 5: ANALYTICS SECTION                                 */}
            {/* ========================================================= */}
            {activeMenu === "analytics" && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        Live Traffic & Tool Telemetry
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Real-time visitor counts, geographic distribution, tool completion rates, and device metrics.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {(["today", "yesterday", "7days", "30days"] as const).map((rng) => (
                        <button
                          key={rng}
                          onClick={() => setAnalyticsRange(rng)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                            analyticsRange === rng
                              ? "bg-indigo-600 text-white shadow-xs"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                          }`}
                        >
                          {rng === "7days" ? "7 Days" : rng === "30days" ? "30 Days" : rng}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                      <p className="text-xs font-semibold text-slate-400 uppercase">Total Visitors</p>
                      <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                        {metrics?.analytics?.totalVisitors ?? 0}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                      <p className="text-xs font-semibold text-slate-400 uppercase">Unique Visitors</p>
                      <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                        {metrics?.analytics?.uniqueVisitors ?? 0}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                      <p className="text-xs font-semibold text-slate-400 uppercase">Tool Runs</p>
                      <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                        {metrics?.analytics?.toolExecutions ?? 0}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                      <p className="text-xs font-semibold text-slate-400 uppercase">Downloads</p>
                      <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
                        {metrics?.analytics?.downloads ?? 0}
                      </p>
                    </div>
                  </div>

                  {/* Country Breakdown */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Globe className="w-4 h-4 text-emerald-500" />
                      Geographic Traffic Distribution
                    </h3>

                    {metrics?.analytics?.topCountries && Object.keys(metrics.analytics.topCountries).length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {Object.entries(metrics.analytics.topCountries).map(([country, count]: any) => (
                          <div
                            key={country}
                            className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between"
                          >
                            <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">{country}</span>
                            <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
                              {count}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 py-2">No country telemetry recorded for this timeframe yet.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* VIEW 6: CONTENT & ARTICLES SECTION                        */}
            {/* ========================================================= */}
            {activeMenu === "content" && (
              <div className="animate-fade-in">
                <BlogManagementSection
                  onShowNotification={showNotification}
                  onNavigate={onNavigate}
                />
              </div>
            )}

            {/* ========================================================= */}
            {/* VIEW 7: INBOX SECTION                                     */}
            {/* ========================================================= */}
            {activeMenu === "inbox" && (
              <div className="animate-fade-in">
                <InboxManagementSection
                  onShowNotification={showNotification}
                />
              </div>
            )}

            {/* ========================================================= */}
            {/* VIEW 8: NEWSLETTER SECTION                                */}
            {/* ========================================================= */}
            {activeMenu === "newsletter" && (
              <div className="animate-fade-in">
                <NewsletterManagementSection
                  onShowNotification={showNotification}
                />
              </div>
            )}

            {/* ========================================================= */}
            {/* VIEW 9: MEDIA LIBRARY SECTION                             */}
            {/* ========================================================= */}
            {activeMenu === "media" && (
              <div className="animate-fade-in">
                <MediaManagementSection />
              </div>
            )}

            {/* ========================================================= */}
            {/* VIEW 10: SETTINGS SECTION                                 */}
            {/* ========================================================= */}
            {activeMenu === "settings" && (
              <div className="animate-fade-in">
                <SiteSettingsSection
                  onShowNotification={showNotification}
                />
              </div>
            )}

            {/* ========================================================= */}
            {/* VIEW 11: AUDIT LOGS SECTION                               */}
            {/* ========================================================= */}
            {activeMenu === "audit-logs" && (
              <div className="animate-fade-in">
                <AuditLogsSection
                  onShowNotification={showNotification}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
