import React, { useState } from "react";
import {
  Sparkles,
  Search,
  Moon,
  Sun,
  Menu,
  X,
  Bookmark,
  History,
  LayoutDashboard,
  Grid,
  ChevronDown,
  User,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  ShieldAlert
} from "lucide-react";
import { CATEGORIES_DATA } from "../../data/categoriesData";
import { useAuth } from "../../context/AuthContext";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSelectCategory?: (categorySlug: string) => void;
  onSelectTool?: (toolSlug: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  theme: "dark" | "light";
  toggleTheme: () => void;
  favoritesCount: number;
  onOpenAuthModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onSelectCategory,
  searchQuery,
  setSearchQuery,
  theme,
  toggleTheme,
  favoritesCount,
  onOpenAuthModal,
}) => {
  const { currentUser, userDoc, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveTab("search");
    }
  };

  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    setCategoriesOpen(false);
    setUserDropdownOpen(false);
  };

  const handleCategoryClick = (slug: string) => {
    if (onSelectCategory) {
      onSelectCategory(slug);
    }
    setActiveTab("category-detail");
    setCategoriesOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <a
            href="/"
            onClick={(e) => {
              if (!e.defaultPrevented && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey && e.button === 0) {
                e.preventDefault();
                handleNavClick("home");
              }
            }}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 p-0.5 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center text-indigo-400">
                <Sparkles className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                Mehzan <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">Digital</span>
              </span>
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 tracking-wider uppercase -mt-1">
                500+ Online Tools
              </span>
            </div>
          </a>

          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden lg:flex items-center flex-1 max-w-md mx-4 relative"
          >
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 500+ free tools (PDF, Image, QR, Code)..."
              className="w-full pl-10 pr-12 py-2 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs md:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 px-2 py-1 rounded-md bg-slate-200 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1 text-xs lg:text-sm font-medium">
            <a
              href="/tools"
              onClick={(e) => {
                if (!e.defaultPrevented && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey && e.button === 0) {
                  e.preventDefault();
                  handleNavClick("all-tools");
                }
              }}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                activeTab === "all-tools"
                  ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold"
                  : "text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400"
              }`}
            >
              All Tools
            </a>

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
              >
                <Grid className="w-4 h-4" />
                <span>Categories</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {categoriesOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-2xl z-50 animate-fade-in">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Browse Categories
                  </div>
                  {CATEGORIES_DATA.map((cat) => (
                    <a
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      onClick={(e) => {
                        if (!e.defaultPrevented && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey && e.button === 0) {
                          e.preventDefault();
                          handleCategoryClick(cat.slug);
                        }
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer block"
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                        {cat.count}
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            <a
              href="/blog"
              onClick={(e) => {
                if (!e.defaultPrevented && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey && e.button === 0) {
                  e.preventDefault();
                  handleNavClick("blog");
                }
              }}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                activeTab === "blog"
                  ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold"
                  : "text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400"
              }`}
            >
              Blog
            </a>

            <a
              href="/dashboard"
              onClick={(e) => {
                if (!e.defaultPrevented && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey && e.button === 0) {
                  e.preventDefault();
                  handleNavClick("dashboard");
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                activeTab === "dashboard"
                  ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold"
                  : "text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </a>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleNavClick("favorites")}
              title="Favorites"
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
            >
              <Bookmark className="w-4 h-4" />
              {(userDoc?.favorites?.length || favoritesCount) > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {userDoc?.favorites?.length || favoritesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => handleNavClick("history")}
              title="Execution History"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
            >
              <History className="w-4 h-4" />
            </button>

            <button
              onClick={toggleTheme}
              title="Toggle Theme"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            {/* Auth Dropdown or Sign In Button */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2.5 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:border-indigo-500/50 transition-all cursor-pointer"
                >
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 hidden sm:inline max-w-[100px] truncate">
                    {userDoc?.name || currentUser.displayName || "Account"}
                  </span>
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt="User Avatar"
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                      {(userDoc?.name || currentUser.email || "U").charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-2xl z-50 animate-fade-in space-y-1">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {userDoc?.name || currentUser.displayName || "User"}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        {currentUser.email}
                      </p>
                    </div>

                    <button
                      onClick={() => handleNavClick("profile")}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      <User className="w-4 h-4 text-indigo-500" />
                      <span>Account Profile</span>
                    </button>

                    <button
                      onClick={() => handleNavClick("admin")}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10 cursor-pointer"
                    >
                      <ShieldAlert className="w-4 h-4" />
                      <span>Admin Portal</span>
                    </button>

                    <button
                      onClick={async () => {
                        await logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs font-medium text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  onClick={() => handleNavClick("login")}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleNavClick("register")}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 space-y-3 animate-slide-down">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-100"
            />
          </form>

          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <button
              onClick={() => handleNavClick("all-tools")}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-left cursor-pointer"
            >
              🚀 All Utility Tools
            </button>
            <button
              onClick={() => handleNavClick("categories")}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-left cursor-pointer"
            >
              📂 Categories
            </button>
            <button
              onClick={() => handleNavClick("blog")}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-left cursor-pointer"
            >
              📰 Blog Articles
            </button>
            <button
              onClick={() => handleNavClick("dashboard")}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-left cursor-pointer"
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => handleNavClick("history")}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-left cursor-pointer"
            >
              🕒 History Log
            </button>
            <button
              onClick={() => handleNavClick("favorites")}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-left cursor-pointer"
            >
              ⭐ Favorites
            </button>
            {!currentUser ? (
              <>
                <button
                  onClick={() => handleNavClick("login")}
                  className="p-2.5 rounded-xl bg-indigo-600 text-white font-bold text-left cursor-pointer"
                >
                  🔑 Sign In
                </button>
                <button
                  onClick={() => handleNavClick("register")}
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-indigo-500 font-bold text-left cursor-pointer"
                >
                  ✨ Create Account
                </button>
              </>
            ) : (
              <button
                onClick={() => handleNavClick("profile")}
                className="p-2.5 rounded-xl bg-indigo-600 text-white font-bold text-left cursor-pointer"
              >
                👤 Profile Settings
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
