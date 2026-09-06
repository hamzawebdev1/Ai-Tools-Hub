import React, { useState, useEffect } from "react";
import { MessageSquare, Star, CheckCircle, XCircle, Trash2, Shield, RefreshCw, Eye } from "lucide-react";
import { db } from "../../services/firebase";
import { collection, getDocs, updateDoc, doc, deleteDoc, query, orderBy } from "firebase/firestore";

interface AdminReviewItem {
  id: string;
  toolId: string;
  toolName?: string;
  toolSlug: string;
  authorName: string;
  authorEmail?: string;
  rating: number;
  comment: string;
  status: "approved" | "pending" | "hidden";
  createdAt: string | number;
}

export const ReviewsManagementSection: React.FC = () => {
  const [reviews, setReviews] = useState<AdminReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"all" | "approved" | "pending" | "hidden">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchAllReviews = async () => {
    setIsLoading(true);
    try {
      if (db) {
        const q = query(collection(db, "tool_reviews"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const list: AdminReviewItem[] = [];
        snapshot.forEach((d) => {
          const data = d.data();
          list.push({
            id: d.id,
            toolId: data.toolId || "unknown",
            toolName: data.toolName || data.toolSlug || data.toolId || "Utility Tool",
            toolSlug: data.toolSlug || "",
            authorName: data.authorName || "User",
            authorEmail: data.authorEmail || "",
            rating: data.rating || 5,
            comment: data.comment || "",
            status: data.status || "approved",
            createdAt: data.createdAt?.seconds ? data.createdAt.seconds * 1000 : Date.now(),
          });
        });
        setReviews(list);
      }
    } catch {
      // Load fallback local reviews
      const localKeys = Object.keys(localStorage).filter((k) => k.startsWith("mehzandigital_reviews_"));
      const list: AdminReviewItem[] = [];
      for (const k of localKeys) {
        try {
          const items = JSON.parse(localStorage.getItem(k) || "[]");
          items.forEach((it: any) => list.push(it));
        } catch {
          // ignore
        }
      }
      setReviews(list);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllReviews();
  }, []);

  const handleUpdateStatus = async (reviewId: string, newStatus: "approved" | "hidden") => {
    try {
      if (db) {
        await updateDoc(doc(db, "tool_reviews", reviewId), { status: newStatus });
      }
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, status: newStatus } : r))
      );
    } catch {
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, status: newStatus } : r))
      );
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      if (db) {
        await deleteDoc(doc(db, "tool_reviews", reviewId));
      }
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    } catch {
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    }
  };

  const filtered = reviews.filter((r) => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.authorName.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q) ||
        r.toolName?.toLowerCase().includes(q) ||
        r.toolId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-400" /> Tool Reviews & Comment Moderation
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage user reviews, star ratings, and community feedback across all utility pages.
          </p>
        </div>

        <button
          onClick={fetchAllReviews}
          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh List
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {(["all", "approved", "pending", "hidden"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl capitalize transition-colors ${
                statusFilter === st
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by author, comment or tool..."
          className="w-full sm:w-64 px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none"
        />
      </div>

      {/* Reviews Table / Cards */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading reviews database...</div>
      ) : filtered.length === 0 ? (
        <div className="p-12 bg-slate-900/40 border border-slate-800 rounded-2xl text-center text-xs text-slate-400">
          No user reviews matching your filter criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((rev) => (
            <div
              key={rev.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-md"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20">
                    {rev.toolName || rev.toolId}
                  </span>
                  <div className="flex items-center text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-700"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      rev.status === "approved"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : rev.status === "pending"
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                    }`}
                  >
                    {rev.status}
                  </span>

                  {rev.status !== "approved" && (
                    <button
                      onClick={() => handleUpdateStatus(rev.id, "approved")}
                      className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg transition-colors"
                      title="Approve Review"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}

                  {rev.status !== "hidden" && (
                    <button
                      onClick={() => handleUpdateStatus(rev.id, "hidden")}
                      className="p-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg transition-colors"
                      title="Hide Review"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(rev.id)}
                    className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg transition-colors"
                    title="Delete Review"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">"{rev.comment}"</p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                  <span>Author: <strong className="text-white">{rev.authorName}</strong> {rev.authorEmail ? `(${rev.authorEmail})` : ""}</span>
                  <span className="font-mono text-slate-500">{new Date(rev.createdAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
