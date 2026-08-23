import React, { useState, useEffect } from "react";
import {
  Tag,
  Plus,
  Search,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Folder,
  AlertTriangle,
  ArrowUpDown,
  Layers,
} from "lucide-react";
import { CMSCategory } from "../../server/admin/cmsStore";

interface CategoryManagementSectionProps {
  onShowNotification: (msg: string) => void;
}

export const CategoryManagementSection: React.FC<CategoryManagementSectionProps> = ({
  onShowNotification,
}) => {
  const [categories, setCategories] = useState<CMSCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CMSCategory | null>(null);
  const [formData, setFormData] = useState<Partial<CMSCategory>>({
    name: "",
    slug: "",
    description: "",
    iconName: "Folder",
    color: "from-indigo-500 to-purple-600",
    status: "active",
  });
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      iconName: "Folder",
      color: "from-indigo-500 to-purple-600",
      status: "active",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: CMSCategory) => {
    setEditingCategory(cat);
    setFormData({ ...cat });
    setIsModalOpen(true);
  };

  const handleNameChange = (name: string) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-tools";
    if (!editingCategory) {
      setFormData((prev) => ({ ...prev, name, slug }));
    } else {
      setFormData((prev) => ({ ...prev, name }));
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      onShowNotification("Category name is required.");
      return;
    }

    try {
      if (editingCategory) {
        const res = await fetch(`/api/admin/categories/${editingCategory.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success) {
          onShowNotification(`Category "${formData.name}" updated successfully.`);
          setIsModalOpen(false);
          fetchCategories();
        } else {
          onShowNotification(data.error || "Failed to update category.");
        }
      } else {
        const res = await fetch("/api/admin/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success) {
          onShowNotification(`Category "${formData.name}" created successfully.`);
          setIsModalOpen(false);
          fetchCategories();
        } else {
          onShowNotification(data.error || "Failed to create category.");
        }
      }
    } catch {
      onShowNotification("Network error occurred.");
    }
  };

  const handleToggleStatus = async (cat: CMSCategory) => {
    const newStatus = cat.status === "active" ? "disabled" : "active";
    try {
      const res = await fetch(`/api/admin/categories/${cat.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        onShowNotification(`Category "${cat.name}" is now ${newStatus.toUpperCase()}.`);
        setCategories((prev) => prev.map((c) => (c.id === cat.id ? { ...c, status: newStatus } : c)));
      }
    } catch {
      onShowNotification("Failed to toggle status.");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        onShowNotification("Category deleted.");
        setCategories((prev) => prev.filter((c) => c.id !== id));
        setDeleteConfirmId(null);
      } else {
        onShowNotification(data.error || "Could not delete category.");
        setDeleteConfirmId(null);
      }
    } catch {
      onShowNotification("Error deleting category.");
    }
  };

  const handleMoveOrder = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const newCats = [...categories];
    const temp = newCats[index];
    newCats[index] = newCats[targetIndex];
    newCats[targetIndex] = temp;

    setCategories(newCats);
    try {
      await fetch("/api/admin/categories/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds: newCats.map((c) => c.id) }),
      });
      onShowNotification("Category order saved.");
    } catch {
      onShowNotification("Failed to save reordering.");
    }
  };

  const filteredCategories = categories.filter(
    (c) =>
      search === "" ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Tag className="w-5 h-5 text-indigo-500" /> Category Management
          </h2>
          <p className="text-xs text-slate-500">
            Manage public tool categories, slug mappings, icons, and display ordering.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchCategories}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-indigo-500" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories by name or slug..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs focus:outline-hidden focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Categories Table */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                <th className="py-3.5 px-4">Category Name & Slug</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4 text-center">Active Tools</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No categories found.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat, idx) => (
                  <tr
                    key={cat.id}
                    className="hover:bg-slate-50/75 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 text-center text-slate-400 font-mono text-[11px]">
                      {cat.order || idx + 1}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {cat.name}
                        </span>
                        <span className="font-mono text-[11px] text-slate-400">
                          /category/{cat.slug}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">
                      {cat.description || "No description provided."}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-[11px]">
                        {cat.count || 0} tools
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(cat)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[10px] cursor-pointer ${
                          cat.status === "active"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                            : "bg-slate-500/10 text-slate-500 border border-slate-500/30"
                        }`}
                      >
                        {cat.status === "active" ? (
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

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleMoveOrder(idx, "up")}
                          disabled={idx === 0}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 disabled:opacity-30 cursor-pointer"
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => handleMoveOrder(idx, "down")}
                          disabled={idx === categories.length - 1}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 disabled:opacity-30 cursor-pointer"
                        >
                          ▼
                        </button>

                        <button
                          onClick={() => handleOpenEditModal(cat)}
                          className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setDeleteConfirmId(cat.id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer"
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Tag className="w-5 h-5 text-indigo-500" />
                {editingCategory ? `Edit: ${editingCategory.name}` : "Create Category"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name || ""}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Media Tools"
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
                  placeholder="media-tools"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                />
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
                  {editingCategory ? "Save Changes" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Delete Category?</h3>
              <p className="text-xs text-slate-500">
                If active tools are assigned to this category, you must reassign them first.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteCategory(deleteConfirmId)}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer shadow-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
