import React, { useState, useEffect } from "react";
import {
  Layers,
  Plus,
  Search,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  ArrowUpDown,
  Download,
  Upload,
  RefreshCw,
  ExternalLink,
  Eye,
  Activity,
  Filter,
  Shield,
  Tag,
  Clock,
  Check,
  X,
  AlertTriangle,
} from "lucide-react";
import { CMSTool } from "../../server/admin/cmsStore";

interface ToolManagementSectionProps {
  onShowNotification: (msg: string) => void;
  onNavigate?: (tab: string, params?: any) => void;
}

export const ToolManagementSection: React.FC<ToolManagementSectionProps> = ({
  onShowNotification,
  onNavigate,
}) => {
  const [tools, setTools] = useState<CMSTool[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<CMSTool | null>(null);
  const [formData, setFormData] = useState<Partial<CMSTool>>({
    name: "",
    slug: "",
    category: "developer",
    description: "",
    metaTitle: "",
    metaDescription: "",
    keywords: [],
    iconName: "Code",
    rateLimit: 30,
    status: "active",
    isPopular: false,
    isNew: true,
  });
  const [keywordInput, setKeywordInput] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchTools = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/tools");
      const data = await res.json();
      if (data.success) {
        setTools(data.tools);
      }
      const catRes = await fetch("/api/admin/categories");
      const catData = await catRes.json();
      if (catData.success) {
        setCategories(catData.categories);
      }
    } catch (err) {
      console.error("Failed to fetch tools:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingTool(null);
    setFormData({
      name: "",
      slug: "",
      category: categories[0]?.id || "developer",
      description: "",
      metaTitle: "",
      metaDescription: "",
      keywords: ["utility", "online tool"],
      iconName: "Code",
      rateLimit: 30,
      status: "active",
      isPopular: false,
      isNew: true,
    });
    setKeywordInput("utility, online tool");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (tool: CMSTool) => {
    setEditingTool(tool);
    setFormData({ ...tool });
    setKeywordInput(Array.isArray(tool.keywords) ? tool.keywords.join(", ") : "");
    setIsModalOpen(true);
  };

  const handleNameChange = (name: string) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    if (!editingTool) {
      setFormData((prev) => ({
        ...prev,
        name,
        slug,
        metaTitle: `${name} - Free Online Tool`,
        metaDescription: prev.description || `Fast client-side ${name} utility.`,
      }));
    } else {
      setFormData((prev) => ({ ...prev, name }));
    }
  };

  const handleSaveTool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category) {
      onShowNotification("Please provide tool name and category.");
      return;
    }

    const keywordsArray = keywordInput
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    const payload = {
      ...formData,
      keywords: keywordsArray,
      rateLimit: Number(formData.rateLimit) || 30,
    };

    try {
      if (editingTool) {
        const res = await fetch(`/api/admin/tools/${editingTool.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          onShowNotification(`Tool "${payload.name}" updated successfully.`);
          setIsModalOpen(false);
          fetchTools();
        } else {
          onShowNotification(data.error || "Failed to update tool.");
        }
      } else {
        const res = await fetch("/api/admin/tools", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          onShowNotification(`Tool "${payload.name}" created successfully.`);
          setIsModalOpen(false);
          fetchTools();
        } else {
          onShowNotification(data.error || "Failed to create tool.");
        }
      }
    } catch (err: any) {
      onShowNotification("Error connecting to server.");
    }
  };

  const handleToggleStatus = async (tool: CMSTool) => {
    const newStatus = tool.status === "active" ? "disabled" : "active";
    try {
      const res = await fetch(`/api/admin/tools/${tool.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        onShowNotification(`Tool "${tool.name}" is now ${newStatus.toUpperCase()}.`);
        setTools((prev) => prev.map((t) => (t.id === tool.id ? { ...t, status: newStatus } : t)));
      }
    } catch {
      onShowNotification("Failed to update status.");
    }
  };

  const handleDeleteTool = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/tools/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        onShowNotification("Tool deleted from database.");
        setTools((prev) => prev.filter((t) => t.id !== id));
        setDeleteConfirmId(null);
      } else {
        onShowNotification(data.error || "Could not delete tool.");
      }
    } catch {
      onShowNotification("Error deleting tool.");
    }
  };

  const handleMoveOrder = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= tools.length) return;

    const newTools = [...tools];
    const temp = newTools[index];
    newTools[index] = newTools[targetIndex];
    newTools[targetIndex] = temp;

    setTools(newTools);
    try {
      await fetch("/api/admin/tools/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds: newTools.map((t) => t.id) }),
      });
      onShowNotification("Tool order saved.");
    } catch {
      onShowNotification("Failed to save reordering.");
    }
  };

  // Filter tools
  const filteredTools = tools.filter((t) => {
    const matchesSearch =
      search === "" ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.slug.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = categoryFilter === "all" || t.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-500" /> Tool Management & Live Catalog
          </h2>
          <p className="text-xs text-slate-500">
            Create, edit, reorder, and enable/disable public tools with persistent database storage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchTools}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-indigo-500" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Tool</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by tool name, slug, or keywords..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs focus:outline-hidden focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            <option value="all">All Categories ({categories.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="disabled">Disabled Only</option>
          </select>
        </div>
      </div>

      {/* Tools Table / Grid */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                <th className="py-3.5 px-4">Tool Name & Slug</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Rate Limit</th>
                <th className="py-3.5 px-4 text-center">Badges</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredTools.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No tools found matching your search or filters.
                  </td>
                </tr>
              ) : (
                filteredTools.map((tool, idx) => (
                  <tr
                    key={tool.id}
                    className="hover:bg-slate-50/75 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 text-center text-slate-400 font-mono text-[11px]">
                      {tool.order || idx + 1}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {tool.name}
                          </span>
                          {tool.isPopular && (
                            <span className="px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-[9px]">
                              POPULAR
                            </span>
                          )}
                          {tool.isNew && (
                            <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[9px]">
                              NEW
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-[11px] text-slate-400">/{tool.slug}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-400 capitalize">
                        {tool.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(tool)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[10px] cursor-pointer transition-colors ${
                          tool.status === "active"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                            : "bg-slate-500/10 text-slate-500 border border-slate-500/30 hover:bg-slate-500/20"
                        }`}
                      >
                        {tool.status === "active" ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" /> Active
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" /> Disabled
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono text-[11px] text-slate-600 dark:text-slate-400">
                      {tool.rateLimit || 30} req/m
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {tool.keywords?.slice(0, 2).map((k) => (
                          <span
                            key={k}
                            className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[9px] text-slate-400"
                          >
                            {k}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleMoveOrder(idx, "up")}
                          disabled={idx === 0}
                          title="Move Up"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-30 cursor-pointer"
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => handleMoveOrder(idx, "down")}
                          disabled={idx === tools.length - 1}
                          title="Move Down"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-30 cursor-pointer"
                        >
                          ▼
                        </button>

                        <button
                          onClick={() => handleOpenEditModal(tool)}
                          className="p-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 cursor-pointer"
                          title="Edit Tool"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setDeleteConfirmId(tool.id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer"
                          title="Delete Tool"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Tool Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-500" />
                {editingTool ? `Edit Tool: ${editingTool.name}` : "Create New Catalog Tool"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTool} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Tool Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ""}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. SVG to PNG Converter"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug || ""}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="svg-to-png-converter"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category || ""}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Rate Limit (req/min)
                  </label>
                  <input
                    type="number"
                    value={formData.rateLimit || 30}
                    onChange={(e) => setFormData({ ...formData, rateLimit: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status || "active"}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold"
                  >
                    <option value="active">Active (Public)</option>
                    <option value="disabled">Disabled (Hidden)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Short description of what the tool does..."
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-indigo-500" /> SEO & Meta Optimization
                </p>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">SEO Title Tag</label>
                  <input
                    type="text"
                    value={formData.metaTitle || ""}
                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Meta Description</label>
                  <input
                    type="text"
                    value={formData.metaDescription || ""}
                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">
                    Keywords (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    placeholder="pdf compress, reduce size, document"
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!formData.isPopular}
                    onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                  />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Mark as Popular</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!formData.isNew}
                    onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                  />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Mark as New</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-slate-500 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-pointer shadow-md"
                >
                  {editingTool ? "Save Changes" : "Create Tool"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Delete Tool Permanently?</h3>
              <p className="text-xs text-slate-500">
                This will remove the tool from the database and public views immediately.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteTool(deleteConfirmId)}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer shadow-md"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
