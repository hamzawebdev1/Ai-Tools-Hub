import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  TrendingUp,
  Link,
  BookOpen,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  Download,
  Upload,
  Sparkles,
  ArrowUpRight,
  ShieldAlert,
  HelpCircle,
  RefreshCw,
  Database,
} from "lucide-react";
import {
  KeywordItem,
  KeywordIntent,
  KeywordType,
  TrendStatus,
  KeywordPriority,
  KeywordItemStatus,
} from "../../data/keywordsData";
import {
  fetchKeywordsFromDB,
  subscribeToKeywordsDB,
  addKeywordItem,
  updateKeywordItem,
  deleteKeywordItem,
  bulkImportKeywords,
  getKeywordAnalyticsStats,
  getKeywordsFromStorage,
} from "../../services/keywordService";
import { TOOLS_DATA } from "../../data/toolsData";
import { BLOG_POSTS_DATA } from "../../data/blogData";
import { CATEGORIES_DATA } from "../../data/categoriesData";

export const KeywordManagementSection: React.FC = () => {
  const [keywords, setKeywords] = useState<KeywordItem[]>(() => getKeywordsFromStorage());
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState<"connecting" | "connected" | "offline">("connecting");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedTrend, setSelectedTrend] = useState<string>("All");
  const [selectedPriority, setSelectedPriority] = useState<string>("All");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<KeywordItem>>({
    keyword: "",
    category: "PDF Tools",
    searchIntent: "Transactional",
    keywordType: "Primary",
    trendStatus: "STABLE",
    searchVolumeNote: "Search volume not verified",
    contentOpportunity: "",
    priority: "Medium",
    status: "Active",
    mappedToolSlug: "",
    mappedArticleSlug: "",
    suggestedPage: "",
  });

  // Import JSON Modal
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  // Load and Subscribe to Firestore Database
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initDb = async () => {
      setLoading(true);
      try {
        const initialList = await fetchKeywordsFromDB();
        setKeywords(initialList);
        setDbStatus("connected");
      } catch (err) {
        console.warn("Initial DB fetch error, falling back to local cache:", err);
        setDbStatus("offline");
      } finally {
        setLoading(false);
      }

      // Realtime subscription
      unsubscribe = subscribeToKeywordsDB(
        (updatedList) => {
          setKeywords(updatedList);
          setDbStatus("connected");
          setLoading(false);
        },
        (err) => {
          console.warn("Realtime subscription error:", err);
          setDbStatus("offline");
        }
      );
    };

    initDb();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const stats = getKeywordAnalyticsStats(keywords);

  const filteredKeywords = keywords.filter((k) => {
    const matchesSearch =
      k.keyword.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (k.contentOpportunity && k.contentOpportunity.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === "All" || k.category === selectedCategory;
    const matchesTrend = selectedTrend === "All" || k.trendStatus === selectedTrend;
    const matchesPriority = selectedPriority === "All" || k.priority === selectedPriority;

    return matchesSearch && matchesCategory && matchesTrend && matchesPriority;
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      keyword: "",
      category: "PDF Tools",
      searchIntent: "Transactional",
      keywordType: "Primary",
      trendStatus: "STABLE",
      searchVolumeNote: "Search volume not verified",
      contentOpportunity: "",
      priority: "Medium",
      status: "Active",
      mappedToolSlug: "",
      mappedArticleSlug: "",
      suggestedPage: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: KeywordItem) => {
    setEditingId(item.id);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete keyword "${name}" from the database?`)) {
      try {
        await deleteKeywordItem(id);
        setKeywords((prev) => prev.filter((k) => k.id !== id));
      } catch (err) {
        alert(`Failed to delete keyword: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.keyword?.trim()) return;

    setIsSaving(true);
    try {
      if (editingId) {
        const updated = await updateKeywordItem(editingId, formData);
        if (updated) {
          setKeywords((prev) => prev.map((k) => (k.id === editingId ? updated : k)));
        }
      } else {
        const created = await addKeywordItem(formData as any);
        setKeywords((prev) => [created, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(`Error saving keyword: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBulkImport = async () => {
    if (!importJsonText.trim()) return;
    setIsImporting(true);
    try {
      const parsed = JSON.parse(importJsonText);
      if (Array.isArray(parsed)) {
        const count = await bulkImportKeywords(parsed);
        alert(`Successfully imported ${count} new keywords to Firestore database.`);
        setIsImportModalOpen(false);
        setImportJsonText("");
        const fresh = await fetchKeywordsFromDB();
        setKeywords(fresh);
      } else {
        alert("JSON must be an array of keyword objects.");
      }
    } catch (err: any) {
      alert(`Invalid JSON format or DB import error: ${err.message}`);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Stats Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-800/60 p-5 rounded-2xl border border-slate-700/60 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-indigo-400" />
              SEO Keyword & Opportunity Intelligence
            </h2>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                dbStatus === "connected"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : dbStatus === "connecting"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
              }`}
            >
              <Database className="w-3 h-3" />
              {dbStatus === "connected" ? "Firestore Live" : dbStatus === "connecting" ? "Syncing..." : "Offline Cache"}
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Connected database for SEO search intent, tool/article assignments, priority, and trend monitoring.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium rounded-xl border border-slate-600 transition flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Import Keywords
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition flex items-center gap-2 shadow-lg shadow-indigo-600/30"
          >
            <Plus className="w-4 h-4" />
            Add Keyword
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
          <span className="text-xs text-slate-400 uppercase font-semibold">Total Keywords</span>
          <div className="text-2xl font-bold text-white mt-1">{stats.total}</div>
        </div>
        <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
          <span className="text-xs text-indigo-400 uppercase font-semibold">Trending Now</span>
          <div className="text-2xl font-bold text-indigo-400 mt-1">{stats.trending}</div>
        </div>
        <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
          <span className="text-xs text-emerald-400 uppercase font-semibold">Rising Demand</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{stats.rising}</div>
        </div>
        <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
          <span className="text-xs text-sky-400 uppercase font-semibold">Mapped to Tools</span>
          <div className="text-2xl font-bold text-sky-400 mt-1">{stats.mappedToTools}</div>
        </div>
        <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
          <span className="text-xs text-purple-400 uppercase font-semibold">Mapped to Articles</span>
          <div className="text-2xl font-bold text-purple-400 mt-1">{stats.mappedToArticles}</div>
        </div>
        <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
          <span className="text-xs text-amber-400 uppercase font-semibold">Unverified Search</span>
          <div className="text-2xl font-bold text-amber-400 mt-1">{stats.unverified}</div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-800/30 p-4 rounded-xl border border-slate-700/40">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search keyword or opportunity..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/60 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Categories</option>
            {CATEGORIES_DATA.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Trend Filter */}
          <select
            value={selectedTrend}
            onChange={(e) => setSelectedTrend(e.target.value)}
            className="bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Trend Statuses</option>
            <option value="TRENDING">Trending</option>
            <option value="RISING">Rising</option>
            <option value="STABLE">Stable</option>
            <option value="UNKNOWN">Unknown</option>
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-900/60 border-b border-slate-700/60 text-xs font-semibold uppercase text-slate-400">
                <th className="py-3 px-4">Target Keyword</th>
                <th className="py-3 px-4">Category / Intent</th>
                <th className="py-3 px-4">Trend Status</th>
                <th className="py-3 px-4">Mapped Tool</th>
                <th className="py-3 px-4">Mapped Article</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40 text-slate-300">
              {loading && keywords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RefreshCw className="w-6 h-6 animate-spin text-indigo-400" />
                      <span>Loading keywords from database...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredKeywords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No keywords matched your search filter criteria.
                  </td>
                </tr>
              ) : (
                filteredKeywords.map((item) => {
                  const mappedTool = TOOLS_DATA.find(
                    (t) => t.slug === item.mappedToolSlug || t.id === item.mappedToolSlug
                  );
                  const mappedArticle = BLOG_POSTS_DATA.find(
                    (p) => p.slug === item.mappedArticleSlug
                  );

                  return (
                    <tr key={item.id} className="hover:bg-slate-700/30 transition">
                      <td className="py-3.5 px-4 font-medium text-white">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-100">{item.keyword}</span>
                          <span className="text-xs text-slate-400 truncate max-w-xs" title={item.contentOpportunity}>
                            {item.contentOpportunity || "No content opportunity description"}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-slate-300">{item.category}</span>
                          <span className="text-[11px] text-slate-400">{item.searchIntent} • {item.keywordType}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            item.trendStatus === "TRENDING"
                              ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                              : item.trendStatus === "RISING"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : item.trendStatus === "STABLE"
                              ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                              : "bg-slate-700 text-slate-400 border border-slate-600"
                          }`}
                        >
                          {item.trendStatus === "TRENDING" && <Sparkles className="w-3 h-3" />}
                          {item.trendStatus === "RISING" && <ArrowUpRight className="w-3 h-3" />}
                          {item.trendStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {mappedTool ? (
                          <a
                            href={`/${mappedTool.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 font-medium"
                          >
                            <Link className="w-3 h-3" />
                            {mappedTool.name}
                          </a>
                        ) : (
                          <span className="text-xs text-slate-500 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {mappedArticle ? (
                          <a
                            href={`/blog/${mappedArticle.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 font-medium"
                          >
                            <BookOpen className="w-3 h-3" />
                            {mappedArticle.title.substring(0, 24)}...
                          </a>
                        ) : (
                          <span className="text-xs text-slate-500 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            item.priority === "High"
                              ? "bg-rose-500/20 text-rose-300"
                              : item.priority === "Medium"
                              ? "bg-amber-500/20 text-amber-300"
                              : "bg-slate-700 text-slate-300"
                          }`}
                        >
                          {item.priority}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/60 rounded-lg transition"
                            title="Edit Keyword"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, item.keyword)}
                            className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition"
                            title="Delete Keyword"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]">
            <h3 className="text-lg font-bold text-white">
              {editingId ? "Edit SEO Keyword Record" : "Add New SEO Keyword Record"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Keyword String</label>
                <input
                  type="text"
                  required
                  value={formData.keyword}
                  onChange={(e) => setFormData({ ...formData, keyword: e.target.value })}
                  placeholder="e.g. compress pdf to 200kb online"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    {CATEGORIES_DATA.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Search Intent</label>
                  <select
                    value={formData.searchIntent}
                    onChange={(e) => setFormData({ ...formData, searchIntent: e.target.value as any })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Transactional">Transactional</option>
                    <option value="Informational">Informational</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Navigational">Navigational</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Trend Status</label>
                  <select
                    value={formData.trendStatus}
                    onChange={(e) => setFormData({ ...formData, trendStatus: e.target.value as any })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="TRENDING">Trending</option>
                    <option value="RISING">Rising</option>
                    <option value="STABLE">Stable</option>
                    <option value="UNKNOWN">Unknown</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Keyword Type</label>
                  <select
                    value={formData.keywordType}
                    onChange={(e) => setFormData({ ...formData, keywordType: e.target.value as any })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Primary">Primary</option>
                    <option value="Secondary">Secondary</option>
                    <option value="Long-tail">Long-tail</option>
                    <option value="Question">Question</option>
                    <option value="Tool-intent">Tool-intent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Assign to Tool</label>
                  <select
                    value={formData.mappedToolSlug || ""}
                    onChange={(e) => setFormData({ ...formData, mappedToolSlug: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">-- No Tool Mapped --</option>
                    {TOOLS_DATA.map((t) => (
                      <option key={t.id} value={t.slug}>
                        {t.name} ({t.slug})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Assign to Article</label>
                  <select
                    value={formData.mappedArticleSlug || ""}
                    onChange={(e) => setFormData({ ...formData, mappedArticleSlug: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">-- No Article Mapped --</option>
                    {BLOG_POSTS_DATA.map((p) => (
                      <option key={p.id} value={p.slug}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Content / SEO Opportunity</label>
                <textarea
                  rows={2}
                  value={formData.contentOpportunity || ""}
                  onChange={(e) => setFormData({ ...formData, contentOpportunity: e.target.value })}
                  placeholder="Describe target user profile, search context, or content hook..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Search Volume Verification Note</label>
                <input
                  type="text"
                  value={formData.searchVolumeNote || ""}
                  onChange={(e) => setFormData({ ...formData, searchVolumeNote: e.target.value })}
                  placeholder="e.g. High search volume verified via Google Trends or Search volume not verified"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSaving}
                  className="px-4 py-2 bg-slate-700 text-slate-300 hover:bg-slate-600 rounded-lg text-sm font-medium transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition flex items-center gap-2 disabled:opacity-50"
                >
                  {isSaving && <RefreshCw className="w-4 h-4 animate-spin" />}
                  {isSaving ? "Saving to Database..." : "Save Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-indigo-400" />
              Bulk Import Keyword Research
            </h3>
            <p className="text-xs text-slate-400">
              Paste JSON array of keyword objects matching the schema. Duplicate keyword strings will be skipped.
            </p>
            <textarea
              rows={8}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder={`[\n  {\n    "keyword": "markdown to pdf converter",\n    "category": "PDF Tools",\n    "searchIntent": "Transactional",\n    "trendStatus": "RISING"\n  }\n]`}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs font-mono text-emerald-400 focus:outline-none focus:border-indigo-500"
            />
            <div className="flex justify-end gap-3 pt-2 border-t border-slate-700">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                disabled={isImporting}
                className="px-4 py-2 bg-slate-700 text-slate-300 hover:bg-slate-600 rounded-lg text-sm font-medium transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkImport}
                disabled={isImporting}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition flex items-center gap-2 disabled:opacity-50"
              >
                {isImporting && <RefreshCw className="w-4 h-4 animate-spin" />}
                {isImporting ? "Importing to DB..." : "Execute Import"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
