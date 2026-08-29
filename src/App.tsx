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
import { SEOAuditWidget } from "./components/seo/SEOAuditWidget";

// Security & Auth components
import { AuthModal } from "./components/auth/AuthModal";
import { SecurityStatusDashboard } from "./components/security/SecurityStatusDashboard";
import { AdminDashboard } from "./components/admin/AdminDashboard";

// Layout components
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { CookieBanner } from "./components/layout/CookieBanner";

// Page components
import { HomePage } from "./pages/HomePage";
import { AllToolsPage } from "./pages/AllToolsPage";
import { CategoriesPage } from "./pages/CategoriesPage";
import { CategoryDetailPage } from "./pages/CategoryDetailPage";
import { ToolDetailPage } from "./pages/ToolDetailPage";
import { BlogPage } from "./pages/BlogPage";
import { BlogPostPage } from "./pages/BlogPostPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import { TermsPage } from "./pages/TermsPage";
import { DisclaimerPage } from "./pages/DisclaimerPage";
import { CookiePolicyPage } from "./pages/CookiePolicyPage";
import { CopyrightPolicyPage } from "./pages/CopyrightPolicyPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { SearchResultsPage } from "./pages/SearchResultsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { DashboardPage } from "./pages/DashboardPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { HistoryPage } from "./pages/HistoryPage";
import { FavoritesPage } from "./pages/FavoritesPage";
import { FeedbackPage } from "./pages/FeedbackPage";
import { SuggestToolPage } from "./pages/SuggestToolPage";
import { PricingPage } from "./pages/PricingPage";
import { AuthorPage } from "./pages/AuthorPage";

// Auth Pages
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";

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
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* SEO & Core Web Vitals Live Audit Inspector */}
      <SEOAuditWidget activeTab={activeTab} />
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
