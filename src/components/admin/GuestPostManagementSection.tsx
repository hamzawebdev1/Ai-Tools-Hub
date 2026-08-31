import React, { useState, useEffect } from "react";
import {
  FileText,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Edit3,
  Trash2,
  Send,
  Eye,
  AlertTriangle,
  ShieldCheck,
  RefreshCw,
  Globe,
  User,
  Mail,
  Tag,
  BookOpen,
  Link,
} from "lucide-react";

export type GuestPostStatus = "Pending" | "Under Review" | "Approved" | "Rejected" | "Published";

export interface ExternalLinkInfo {
  url: string;
  text: string;
  isAllowed: boolean;
  rel?: string;
  flaggedReason?: string;
}

export interface GuestPostSubmission {
  id: string;
  slug: string;
  authorName: string;
  authorEmail: string;
  authorWebsite?: string;
  authorSocialUrl?: string;
  authorBio: string;
  title: string;
  category: string;
  content: string;
  sanitizedContent: string;
  excerpt: string;
  featuredImage?: string;
  additionalNotes?: string;
  status: GuestPostStatus;
  submittedAt: string;
  updatedAt?: string;
  publishedAt?: string;
  reviewedBy?: string;
  moderatorNotes?: string;
  externalLinks: ExternalLinkInfo[];
  publishedBlogId?: string;
}

interface GuestPostManagementSectionProps {
  onShowNotification: (msg: string) => void;
}

export const GuestPostManagementSection: React.FC<GuestPostManagementSectionProps> = ({
  onShowNotification,
}) => {
  const [submissions, setSubmissions] = useState<GuestPostSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [selectedItem, setSelectedItem] = useState<GuestPostSubmission | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [modalTab, setModalTab] = useState<"content" | "author" | "links">("content");
  const [moderatorNotes, setModeratorNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Editable fields in modal
  const [editTitle, setEditTitle] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editExcerpt, setEditExcerpt] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editFeaturedImage, setEditFeaturedImage] = useState("");
  const [editLinks, setEditLinks] = useState<ExternalLinkInfo[]>([]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (searchQuery) params.set("search", searchQuery);

      const res = await fetch(`/api/admin/guest-posts?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setSubmissions(data.submissions || []);
      } else {
        onShowNotification(data.error || "Failed to load guest posts.");
      }
    } catch (err) {
      console.error("Failed to fetch guest posts:", err);
      onShowNotification("Network error loading guest post submissions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [statusFilter]);

  const handleOpenReview = (item: GuestPostSubmission) => {
    setSelectedItem(item);
    setEditTitle(item.title);
    setEditSlug(item.slug);
    setEditCategory(item.category);
    setEditExcerpt(item.excerpt);
    setEditContent(item.content);
    setEditFeaturedImage(item.featuredImage || "");
    setEditLinks(item.externalLinks || []);
    setModeratorNotes(item.moderatorNotes || "");
    setModalTab("content");
    setEditMode(false);
  };

  const handleSaveModalEdits = async () => {
    if (!selectedItem) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/guest-posts/${selectedItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          slug: editSlug,
          category: editCategory,
          excerpt: editExcerpt,
          content: editContent,
          featuredImage: editFeaturedImage,
          externalLinks: editLinks,
          moderatorNotes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        onShowNotification("Guest post submission updated.");
        setSelectedItem(data.submission);
        setEditMode(false);
        fetchSubmissions();
      } else {
        onShowNotification(data.error || "Failed to update guest post.");
      }
    } catch (err) {
      onShowNotification("Error updating guest post.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: GuestPostStatus) => {
    if (!selectedItem) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/guest-posts/${selectedItem.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, moderatorNotes }),
      });
      const data = await res.json();
      if (data.success) {
        onShowNotification(`Status updated to ${newStatus}.`);
        setSelectedItem(data.submission);
        fetchSubmissions();
      } else {
        onShowNotification(data.error || "Failed to update status.");
      }
    } catch (err) {
      onShowNotification("Error updating status.");
    } finally {
      setActionLoading(false);
    }
  };

  const handlePublishNow = async () => {
    if (!selectedItem) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/guest-posts/${selectedItem.id}/publish`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        onShowNotification(`Published "${selectedItem.title}" to blog!`);
        setSelectedItem(data.submission);
        fetchSubmissions();
      } else {
        onShowNotification(data.error || "Failed to publish article.");
      }
    } catch (err) {
      onShowNotification("Error publishing article.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this guest post submission?")) return;
    try {
      const res = await fetch(`/api/admin/guest-posts/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        onShowNotification("Guest post deleted.");
        if (selectedItem?.id === id) setSelectedItem(null);
        fetchSubmissions();
      } else {
        onShowNotification(data.error || "Failed to delete submission.");
      }
    } catch (err) {
      onShowNotification("Error deleting submission.");
    }
  };

  const getStatusBadge = (status: GuestPostStatus) => {
    switch (status) {
      case "Pending":
        return "bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300";
      case "Under Review":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-300";
      case "Approved":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300";
      case "Rejected":
        return "bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-300";
      case "Published":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 border-indigo-300";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-xs">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-500" /> Guest Post Submissions & Editorial Review
          </h2>
          <p className="text-slate-500">
            Moderate, review external links, edit, approve, and publish community guest articles.
          </p>
        </div>

        <button
          onClick={fetchSubmissions}
          className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-slate-700 dark:text-slate-200 inline-flex items-center gap-2 cursor-pointer transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh List
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {["all", "Pending", "Under Review", "Approved", "Published", "Rejected"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer capitalize ${
                statusFilter === st
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchSubmissions()}
            placeholder="Search title, author, email..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-none"
          />
        </div>
      </div>

      {/* Submissions List */}
      {loading ? (
        <div className="p-12 text-center text-slate-500">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-500" />
          Loading guest post submissions...
        </div>
      ) : submissions.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-slate-500 space-y-2">
          <FileText className="w-8 h-8 mx-auto text-slate-400" />
          <p className="font-bold text-sm">No guest post submissions found.</p>
          <p className="text-xs">Submissions will appear here when authors submit articles.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-4">Article Title & Category</th>
                <th className="p-4">Author</th>
                <th className="p-4">Submitted Date</th>
                <th className="p-4">Links</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {submissions.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-slate-900 dark:text-white line-clamp-1">{item.title}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-semibold">{item.category}</span>
                      <span>Slug: /blog/{item.slug}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-slate-800 dark:text-slate-200">{item.authorName}</div>
                    <div className="text-slate-500 text-[11px]">{item.authorEmail}</div>
                  </td>
                  <td className="p-4 text-slate-500 whitespace-nowrap">
                    {new Date(item.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono font-bold">
                      {item.externalLinks?.length || 0} links
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => handleOpenReview(item)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 font-bold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" /> Review
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900/60 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Review & Moderation Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full p-6 shadow-2xl space-y-6 my-8 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(selectedItem.status)}`}>
                    {selectedItem.status}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">{selectedItem.id}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  {selectedItem.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Subtabs */}
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2 shrink-0">
              <button
                onClick={() => setModalTab("content")}
                className={`px-3 py-1.5 rounded-xl font-bold ${modalTab === "content" ? "bg-indigo-600 text-white" : "text-slate-500"}`}
              >
                Article Content & Sanitization
              </button>
              <button
                onClick={() => setModalTab("author")}
                className={`px-3 py-1.5 rounded-xl font-bold ${modalTab === "author" ? "bg-indigo-600 text-white" : "text-slate-500"}`}
              >
                Author Profile ({selectedItem.authorName})
              </button>
              <button
                onClick={() => setModalTab("links")}
                className={`px-3 py-1.5 rounded-xl font-bold ${modalTab === "links" ? "bg-indigo-600 text-white" : "text-slate-500"}`}
              >
                External Links Audit ({selectedItem.externalLinks?.length || 0})
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
              {modalTab === "content" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Edit Submission Mode</span>
                    <button
                      type="button"
                      onClick={() => setEditMode(!editMode)}
                      className="px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> {editMode ? "Viewing Mode" : "Edit Fields"}
                    </button>
                  </div>

                  {editMode ? (
                    <div className="space-y-4">
                      <div>
                        <label className="font-bold block mb-1">Title</label>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="font-bold block mb-1">Slug</label>
                          <input
                            type="text"
                            value={editSlug}
                            onChange={(e) => setEditSlug(e.target.value)}
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs"
                          />
                        </div>
                        <div>
                          <label className="font-bold block mb-1">Category</label>
                          <input
                            type="text"
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value)}
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="font-bold block mb-1">Featured Image URL</label>
                        <input
                          type="url"
                          value={editFeaturedImage}
                          onChange={(e) => setEditFeaturedImage(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                        />
                      </div>
                      <div>
                        <label className="font-bold block mb-1">Content (Markdown / HTML)</label>
                        <textarea
                          rows={10}
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleSaveModalEdits}
                        disabled={actionLoading}
                        className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold"
                      >
                        Save Article Edits
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                        <div className="font-bold text-slate-900 dark:text-white">Excerpt:</div>
                        <p className="text-slate-600 dark:text-slate-400 italic">{selectedItem.excerpt}</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                        <div className="font-bold text-slate-900 dark:text-white">Sanitized Article HTML Content:</div>
                        <div
                          className="prose dark:prose-invert max-w-none text-xs leading-relaxed max-h-80 overflow-y-auto p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-sans"
                          dangerouslySetInnerHTML={{ __html: selectedItem.sanitizedContent || selectedItem.content }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {modalTab === "author" && (
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-400 block font-semibold">Author Name</span>
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{selectedItem.authorName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold">Email</span>
                      <span className="font-bold text-slate-900 dark:text-white">{selectedItem.authorEmail}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold">Website</span>
                      {selectedItem.authorWebsite ? (
                        <a href={selectedItem.authorWebsite} target="_blank" rel="noreferrer" className="text-indigo-500 underline font-medium">
                          {selectedItem.authorWebsite}
                        </a>
                      ) : (
                        <span className="text-slate-400">None</span>
                      )}
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold">Social URL</span>
                      {selectedItem.authorSocialUrl ? (
                        <a href={selectedItem.authorSocialUrl} target="_blank" rel="noreferrer" className="text-indigo-500 underline font-medium">
                          {selectedItem.authorSocialUrl}
                        </a>
                      ) : (
                        <span className="text-slate-400">None</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-semibold mb-1">Author Bio</span>
                    <p className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                      {selectedItem.authorBio}
                    </p>
                  </div>
                </div>
              )}

              {modalTab === "links" && (
                <div className="space-y-3">
                  <div className="text-slate-500">
                    All external links found in article content. Toggle allowed status or customize rel tag before approving.
                  </div>
                  {(!selectedItem.externalLinks || selectedItem.externalLinks.length === 0) ? (
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-400 text-center">
                      No external links found in this article.
                    </div>
                  ) : (
                    selectedItem.externalLinks.map((link, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
                          link.flaggedReason
                            ? "bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800"
                            : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                        }`}
                      >
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span>{link.text}</span>
                            <a href={link.url} target="_blank" rel="noreferrer" className="text-indigo-500 hover:underline">
                              ({link.url})
                            </a>
                          </div>
                          {link.flaggedReason && (
                            <div className="text-rose-600 dark:text-rose-400 font-semibold text-[11px] mt-0.5">
                              ⚠️ {link.flaggedReason}
                            </div>
                          )}
                        </div>

                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {link.rel || "nofollow noopener"}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Moderator Notes */}
              <div>
                <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">Moderator Editorial Notes</label>
                <textarea
                  rows={2}
                  value={moderatorNotes}
                  onChange={(e) => setModeratorNotes(e.target.value)}
                  placeholder="Notes for editorial team..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Modal Action Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleStatusChange("Under Review")}
                  disabled={actionLoading}
                  className="px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold cursor-pointer"
                >
                  Mark Under Review
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange("Rejected")}
                  disabled={actionLoading}
                  className="px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 font-bold cursor-pointer"
                >
                  Reject
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleStatusChange("Approved")}
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer"
                >
                  Approve Article
                </button>
                <button
                  type="button"
                  onClick={handlePublishNow}
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-pointer shadow-md inline-flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Approve & Publish Live
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
