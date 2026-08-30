import React, { useState, useEffect } from "react";
import { TOOLS_DATA } from "./data/toolsData";
import { CATEGORIES_DATA } from "./data/categoriesData";
import { BLOG_POSTS_DATA } from "./data/blogData";
import {
  getStoredTheme,
  getStoredProfile,
  getStoredFavorites,
  getStoredHistory,
  toggleStoredFavorite,
} from "./services/storageService";
import { UserProfile, HistoryItem } from "./types";

// Auth & Firebase Context
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AdminProtectedRoute } from "./components/auth/AdminProtectedRoute";

// SEO & Meta components
import { SEOHead } from "./components/seo/SEOHead";

// Layout components
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { CookieBanner } from "./components/layout/CookieBanner";

// Core Page component (Eager loaded for instant homepage render)
import { HomePage } from "./pages/HomePage";

// Lazy-loaded secondary pages & heavy modules for bundle code splitting
const AllToolsPage = React.lazy(() => import("./pages/AllToolsPage").then(m => ({ default: m.AllToolsPage })));
const CategoriesPage = React.lazy(() => import("./pages/CategoriesPage").then(m => ({ default: m.CategoriesPage })));
const CategoryDetailPage = React.lazy(() => import("./pages/CategoryDetailPage").then(m => ({ default: m.CategoryDetailPage })));
const ToolDetailPage = React.lazy(() => import("./pages/ToolDetailPage").then(m => ({ default: m.ToolDetailPage })));
const BlogPage = React.lazy(() => import("./pages/BlogPage").then(m => ({ default: m.BlogPage })));
const BlogPostPage = React.lazy(() => import("./pages/BlogPostPage").then(m => ({ default: m.BlogPostPage })));
const AboutPage = React.lazy(() => import("./pages/AboutPage").then(m => ({ default: m.AboutPage })));
const ContactPage = React.lazy(() => import("./pages/ContactPage").then(m => ({ default: m.ContactPage })));
const PrivacyPolicyPage = React.lazy(() => import("./pages/PrivacyPolicyPage").then(m => ({ default: m.PrivacyPolicyPage })));
const TermsPage = React.lazy(() => import("./pages/TermsPage").then(m => ({ default: m.TermsPage })));
const DisclaimerPage = React.lazy(() => import("./pages/DisclaimerPage").then(m => ({ default: m.DisclaimerPage })));
const CookiePolicyPage = React.lazy(() => import("./pages/CookiePolicyPage").then(m => ({ default: m.CookiePolicyPage })));
const CopyrightPolicyPage = React.lazy(() => import("./pages/CopyrightPolicyPage").then(m => ({ default: m.CopyrightPolicyPage })));
const NotFoundPage = React.lazy(() => import("./pages/NotFoundPage").then(m => ({ default: m.NotFoundPage })));
const SearchResultsPage = React.lazy(() => import("./pages/SearchResultsPage").then(m => ({ default: m.SearchResultsPage })));
const DashboardPage = React.lazy(() => import("./pages/DashboardPage").then(m => ({ default: m.DashboardPage })));
const AdminDashboardPage = React.lazy(() => import("./pages/AdminDashboardPage").then(m => ({ default: m.AdminDashboardPage })));
const HistoryPage = React.lazy(() => import("./pages/HistoryPage").then(m => ({ default: m.HistoryPage })));
const FavoritesPage = React.lazy(() => import("./pages/FavoritesPage").then(m => ({ default: m.FavoritesPage })));
const FeedbackPage = React.lazy(() => import("./pages/FeedbackPage").then(m => ({ default: m.FeedbackPage })));
const SuggestToolPage = React.lazy(() => import("./pages/SuggestToolPage").then(m => ({ default: m.SuggestToolPage })));
const PricingPage = React.lazy(() => import("./pages/PricingPage").then(m => ({ default: m.PricingPage })));
const AuthorPage = React.lazy(() => import("./pages/AuthorPage").then(m => ({ default: m.AuthorPage })));

// Auth Pages
const LoginPage = React.lazy(() => import("./pages/LoginPage").then(m => ({ default: m.LoginPage })));
const SignupPage = React.lazy(() => import("./pages/SignupPage").then(m => ({ default: m.SignupPage })));
const ForgotPasswordPage = React.lazy(() => import("./pages/ForgotPasswordPage").then(m => ({ default: m.ForgotPasswordPage })));

// Heavy Modals & Dashboards
const AuthModal = React.lazy(() => import("./components/auth/AuthModal").then(m => ({ default: m.AuthModal })));
const SecurityStatusDashboard = React.lazy(() => import("./components/security/SecurityStatusDashboard").then(m => ({ default: m.SecurityStatusDashboard })));
const SEOAuditWidget = React.lazy(() => import("./components/seo/SEOAuditWidget").then(m => ({ default: m.SEOAuditWidget })));

// Router Service
import { parseRoute, getUrlForRoute, navigateTo, enforceCanonicalRedirect } from "./services/routerService";

function AppContent() {
  const initialRoute = typeof window !== "undefined"
    ? parseRoute(window.location.pathname, window.location.search)
    : { tab: "home" };

  const [theme, setTheme] = useState<"dark" | "light">(getStoredTheme());
  const [activeTab, setActiveTab] = useState<string>(initialRoute.tab || "home");
  const [adminSubMenu, setAdminSubMenu] = useState<string>(initialRoute.adminSubMenu || "dashboard");
  const [selectedToolSlug, setSelectedToolSlug] = useState<string>(initialRoute.toolSlug || TOOLS_DATA[0].slug);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>(initialRoute.categorySlug || CATEGORIES_DATA[0].slug);
  const [selectedPostSlug, setSelectedPostSlug] = useState<string>(initialRoute.postSlug || "");
  const [searchQuery, setSearchQuery] = useState<string>(initialRoute.searchQuery || "");
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const [profile, setProfile] = useState<UserProfile>(getStoredProfile());
  const [favorites, setFavorites] = useState<string[]>(getStoredFavorites());
  const [history, setHistory] = useState<HistoryItem[]>(getStoredHistory());

  const { userDoc, toggleFavorite: firebaseToggleFavorite } = useAuth();

  // Sync favorites with Firestore if logged in
  useEffect(() => {
    if (userDoc?.favorites) {
      setFavorites(userDoc.favorites);
    }
  }, [userDoc]);

  // Sync state with URL location & normalize non-canonical URL in browser history
  const syncRouteFromLocation = () => {
    if (typeof window === "undefined") return;
    enforceCanonicalRedirect();

    const route = parseRoute(window.location.pathname, window.location.search);
    setActiveTab(route.tab);
    if (route.adminSubMenu) setAdminSubMenu(route.adminSubMenu);
    if (route.toolSlug) setSelectedToolSlug(route.toolSlug);
    if (route.categorySlug) setSelectedCategorySlug(route.categorySlug);
    if (route.postSlug) setSelectedPostSlug(route.postSlug);
    if (route.searchQuery !== undefined) setSearchQuery(route.searchQuery);
  };

  useEffect(() => {
    syncRouteFromLocation();

    const handlePopState = () => syncRouteFromLocation();
    const handleCustomRoute = () => syncRouteFromLocation();

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("mehzandigital_route_change", handleCustomRoute);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("mehzandigital_route_change", handleCustomRoute);
    };
  }, []);

  // Apply Theme class to HTML document element
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("mehzandigital_theme", nextTheme);
  };

  const handleToggleFavorite = async (toolId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Local storage toggle
    const updated = toggleStoredFavorite(toolId);
    setFavorites(updated);
    // Firestore toggle
    await firebaseToggleFavorite(toolId);
  };

  const handleNavigate = (tab: string, params?: { toolSlug?: string; categorySlug?: string; postSlug?: string; search?: string; adminSubMenu?: string }) => {
    setActiveTab(tab);
    if (params?.toolSlug) setSelectedToolSlug(params.toolSlug);
    if (params?.categorySlug) setSelectedCategorySlug(params.categorySlug);
    if (params?.postSlug) setSelectedPostSlug(params.postSlug);
    if (params?.adminSubMenu) setAdminSubMenu(params.adminSubMenu);
    if (params?.search !== undefined) setSearchQuery(params.search);

    const url = getUrlForRoute(tab, params);
    navigateTo(url);
  };

  const handleSelectTool = (slug: string) => {
    setSelectedToolSlug(slug);
    setActiveTab("tool-detail");
    navigateTo(`/${slug}`);
  };

  const handleSelectCategory = (slug: string) => {
    setSelectedCategorySlug(slug);
    setActiveTab("category-detail");
    navigateTo(`/category/${slug}`);
  };

  const handleSelectPost = (slug: string) => {
    setSelectedPostSlug(slug);
    setActiveTab("blog-post");
    navigateTo(`/blog/${slug}`);
  };

  const currentTool = TOOLS_DATA.find((t) => t.slug === selectedToolSlug) || TOOLS_DATA[0];
  const currentCategory = CATEGORIES_DATA.find((c) => c.slug === selectedCategorySlug) || CATEGORIES_DATA[0];
  const currentPost = BLOG_POSTS_DATA.find((p) => p.slug === selectedPostSlug) || BLOG_POSTS_DATA[0];

  // Dedicated Full-Screen Admin Route Layout (Bypasses public Navbar, Footer, and container bounds)
  if (activeTab === "admin" || activeTab.startsWith("admin")) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-200">
        <SEOHead
          activeTab="admin"
          tool={currentTool}
          category={currentCategory}
          post={currentPost}
          searchQuery={searchQuery}
        />
        <AdminProtectedRoute
          onOpenAuthModal={() => setAuthModalOpen(true)}
          onNavigateHome={() => handleNavigate("home")}
        >
          <AdminDashboardPage
            theme={theme}
            toggleTheme={toggleTheme}
            onNavigate={handleNavigate}
            initialSubMenu={adminSubMenu}
          />
        </AdminProtectedRoute>
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {/* Dynamic SEO Meta Tags & Schema Engine */}
      <SEOHead
        activeTab={activeTab}
        tool={currentTool}
        category={currentCategory}
        post={currentPost}
        searchQuery={searchQuery}
      />

      {/* Sticky Header Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleNavigate}
        theme={theme}
        toggleTheme={toggleTheme}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        favoritesCount={favorites.length}
        onOpenAuthModal={() => setAuthModalOpen(true)}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <React.Suspense fallback={
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin mx-auto" />
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Loading requested view...</p>
          </div>
        }>
          {activeTab === "home" && (
          <HomePage
            tools={TOOLS_DATA}
            onSelectTool={handleSelectTool}
            onSelectCategory={handleSelectCategory}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            setActiveTab={handleNavigate}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        {activeTab === "all-tools" && (
          <AllToolsPage
            tools={TOOLS_DATA}
            onSelectTool={handleSelectTool}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            setActiveTab={handleNavigate}
          />
        )}

        {activeTab === "categories" && (
          <CategoriesPage onSelectCategory={handleSelectCategory} />
        )}

        {activeTab === "category-detail" && (
          <CategoryDetailPage
            categorySlug={selectedCategorySlug}
            tools={TOOLS_DATA}
            onSelectTool={handleSelectTool}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            setActiveTab={handleNavigate}
          />
        )}

        {activeTab === "tool-detail" && (
          <ToolDetailPage
            tool={currentTool}
            allTools={TOOLS_DATA}
            onSelectTool={handleSelectTool}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            setActiveTab={handleNavigate}
          />
        )}

        {activeTab === "blog" && <BlogPage onSelectPost={handleSelectPost} />}

        {activeTab === "blog-post" && (
          <BlogPostPage postSlug={selectedPostSlug} setActiveTab={handleNavigate} />
        )}

        {activeTab === "about" && <AboutPage setActiveTab={handleNavigate} />}

        {activeTab.startsWith("author-") && (
          <AuthorPage
            authorSlug={activeTab.replace("author-", "")}
            setActiveTab={handleNavigate}
            onSelectPost={handleSelectPost}
          />
        )}

        {activeTab === "contact" && <ContactPage />}

        {activeTab === "privacy" && <PrivacyPolicyPage />}

        {activeTab === "terms" && <TermsPage />}

        {activeTab === "disclaimer" && <DisclaimerPage />}

        {activeTab === "cookie-policy" && <CookiePolicyPage />}

        {activeTab === "copyright" && <CopyrightPolicyPage />}

        {activeTab === "search" && (
          <SearchResultsPage
            query={searchQuery}
            tools={TOOLS_DATA}
            onSelectTool={handleSelectTool}
            onSelectCategory={handleSelectCategory}
            onSelectPost={handleSelectPost}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            setActiveTab={handleNavigate}
          />
        )}

        {/* Dedicated Auth Pages */}
        {activeTab === "login" && <LoginPage onNavigate={handleNavigate} />}
        {activeTab === "register" && <SignupPage onNavigate={handleNavigate} />}
        {activeTab === "forgot-password" && <ForgotPasswordPage onNavigate={handleNavigate} />}

        {/* Profile / Dashboard Page */}
        {(activeTab === "profile" || activeTab === "dashboard") && (
          <ProtectedRoute onOpenAuthModal={() => setAuthModalOpen(true)}>
            <DashboardPage
              profile={profile}
              history={history}
              tools={TOOLS_DATA}
              onSelectTool={handleSelectTool}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              setActiveTab={handleNavigate}
              theme={theme}
              toggleTheme={toggleTheme}
            />
            <SecurityStatusDashboard />
          </ProtectedRoute>
        )}

        {activeTab === "history" && (
          <HistoryPage
            history={history}
            setHistory={setHistory}
            setActiveTab={handleNavigate}
          />
        )}

        {activeTab === "favorites" && (
          <FavoritesPage
            tools={TOOLS_DATA}
            onSelectTool={handleSelectTool}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            setActiveTab={handleNavigate}
          />
        )}

        {activeTab === "feedback" && <FeedbackPage />}

        {activeTab === "suggest-tool" && <SuggestToolPage />}

        {activeTab === "pricing" && <PricingPage setActiveTab={handleNavigate} />}

        {activeTab === "404" && <NotFoundPage setActiveTab={handleNavigate} />}
        </React.Suspense>
      </main>

      {/* Footer */}
      <Footer
        setActiveTab={handleNavigate}
        onSelectCategory={handleSelectCategory}
        onSelectTool={handleSelectTool}
      />

      {/* Cookie Consent Banner */}
      <CookieBanner />

      {/* Auth & Security Modal */}
      <React.Suspense fallback={null}>
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
        />
        <SEOAuditWidget activeTab={activeTab} />
      </React.Suspense>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
