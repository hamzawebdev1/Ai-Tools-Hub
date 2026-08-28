import React, { useState, useEffect } from "react";
import {
  Mail,
  Send,
  Plus,
  Trash2,
  Download,
  RefreshCw,
  Search,
  CheckCircle2,
  Users,
  AlertTriangle,
  History,
  FileCode,
  Eye,
  Edit3,
  UserCheck,
  UserX,
  Filter,
} from "lucide-react";
import { CMSSubscriber } from "../../server/admin/cmsStore";

interface NewsletterManagementSectionProps {
  onShowNotification: (msg: string) => void;
}

export const NewsletterManagementSection: React.FC<NewsletterManagementSectionProps> = ({
  onShowNotification,
}) => {
  const [subscribers, setSubscribers] = useState<CMSSubscriber[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "unsubscribed">("all");

  // Selected subscriber for Detail or Edit modal
  const [selectedSubDetail, setSelectedSubDetail] = useState<CMSSubscriber | null>(null);
  const [editingSub, setEditingSub] = useState<CMSSubscriber | null>(null);

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editStatus, setEditStatus] = useState<"active" | "unsubscribed">("active");

  // Add subscriber modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newSource, setNewSource] = useState("admin_manual");

  // Campaign State
  const [subject, setSubject] = useState("");
  const [htmlContent, setHtmlContent] = useState(
    `<h2>New Updates from Mehzan Tools Hub</h2>\n<p>We've added new fast, privacy-focused online developer tools to our directory.</p>\n<p><a href="https://mehzandigital.com">Explore the new tools now &rarr;</a></p>`
  );
  const [testEmail, setTestEmail] = useState("");
  const [sendingCampaign, setSendingCampaign] = useState(false);

  const fetchNewsletterData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/newsletter/subscribers");
      const data = await res.json();
      if (data.success) setSubscribers(data.subscribers || []);

      const campRes = await fetch("/api/admin/campaigns/history");
      const campData = await campRes.json();
      if (campData.success) setCampaigns(campData.campaigns || []);
    } catch (err) {
      console.error("Failed to load subscribers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsletterData();
  }, []);

  const handleAddSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newEmail.includes("@")) {
      onShowNotification("Please enter a valid email address.");
      return;
    }
    try {
      const res = await fetch("/api/admin/newsletter/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail, name: newName, source: newSource }),
      });
      const data = await res.json();
      if (data.success) {
        onShowNotification(`Subscriber ${newEmail} saved successfully.`);
        setNewName("");
        setNewEmail("");
        setIsAddModalOpen(false);
        fetchNewsletterData();
      } else {
        onShowNotification(data.error || "Failed to add subscriber.");
      }
    } catch {
      onShowNotification("Error adding subscriber.");
    }
  };

  const handleToggleStatus = async (sub: CMSSubscriber) => {
    try {
      const res = await fetch(`/api/admin/newsletter/subscribers/${sub.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success) {
        onShowNotification(data.message || "Subscriber status updated.");
        fetchNewsletterData();
      } else {
        onShowNotification(data.error || "Failed to update subscriber status.");
      }
    } catch {
      onShowNotification("Error updating subscriber status.");
    }
  };

  const handleOpenEditModal = (sub: CMSSubscriber) => {
    setEditingSub(sub);
    setEditName(sub.name || "");
    setEditEmail(sub.email);
    setEditStatus(sub.status);
  };

  const handleSaveEditSub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSub) return;
    try {
      const res = await fetch(`/api/admin/newsletter/subscribers/${editingSub.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, email: editEmail, status: editStatus }),
      });
      const data = await res.json();
      if (data.success) {
        onShowNotification("Subscriber updated successfully.");
        setEditingSub(null);
        fetchNewsletterData();
      } else {
        onShowNotification(data.error || "Failed to update subscriber.");
      }
    } catch {
      onShowNotification("Error saving subscriber edits.");
    }
  };

  const handleDeleteSubscriber = async (sub: CMSSubscriber) => {
    if (!confirm(`Are you sure you want to delete subscriber ${sub.email}?`)) return;
    try {
      const res = await fetch(`/api/admin/newsletter/subscribers/${sub.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        onShowNotification(`Subscriber ${sub.email} deleted.`);
        setSubscribers((prev) => prev.filter((s) => s.id !== sub.id));
      } else {
        onShowNotification(data.error || "Failed to delete subscriber.");
      }
    } catch {
      onShowNotification("Error deleting subscriber.");
    }
  };

  const handleSendCampaign = async (isTest: boolean) => {
    if (!subject.trim() || !htmlContent.trim()) {
      onShowNotification("Please provide both subject and campaign HTML content.");
      return;
    }

    if (isTest && !testEmail.includes("@")) {
      onShowNotification("Please provide a valid test email address.");
      return;
    }

    setSendingCampaign(true);
    try {
      const res = await fetch("/api/admin/campaigns/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          htmlContent,
          testEmail: isTest ? testEmail : undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        onShowNotification(data.message);
        fetchNewsletterData();
      } else {
        onShowNotification(data.error || "Failed to broadcast campaign.");
      }
    } catch {
      onShowNotification("Error broadcasting campaign.");
    } finally {
      setSendingCampaign(false);
    }
  };

  const filteredSubs = subscribers.filter((s) => {
    const matchesSearch =
      search === "" ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      (s.name && s.name.toLowerCase().includes(search.toLowerCase())) ||
      (s.source && s.source.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = subscribers.filter((s) => s.status === "active").length;
  const unsubCount = subscribers.filter((s) => s.status === "unsubscribed").length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-indigo-500" /> Newsletter Subscribers & Broadcast Campaigns
          </h2>
          <p className="text-xs text-slate-500">
            Real subscriber database registry with status management, CSV export, and live email campaign delivery.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/api/admin/newsletter/export"
            download
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Subscribers</span>
          </a>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Subscriber</span>
          </button>
        </div>
      </div>

      {/* Grid: Left Column = Subscribers Table, Right Column = Campaign Composer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Subscribers Table (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search subscribers by name or email..."
                className="w-full pl-10 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs focus:outline-hidden focus:border-indigo-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium cursor-pointer"
            >
              <option value="all">All ({subscribers.length})</option>
              <option value="active">Active ({activeCount})</option>
              <option value="unsubscribed">Unsubscribed ({unsubCount})</option>
            </select>
          </div>

          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden max-h-[500px] overflow-y-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="sticky top-0 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Subscriber</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4 text-center">Joined</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredSubs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      No matching subscribers found in database.
                    </td>
                  </tr>
                ) : (
                  filteredSubs.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50/75 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">
                        <div className="flex flex-col">
                          <span>{sub.name || sub.email}</span>
                          {sub.name && <span className="text-[10px] text-slate-400">{sub.email}</span>}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            sub.status === "active"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {sub.status === "active" ? "Active" : "Unsubscribed"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-mono text-[10px]">
                        {sub.source || "site_footer"}
                      </td>
                      <td className="py-3 px-4 text-center text-slate-400 font-mono text-[10px]">
                        {sub.subscribedAt ? new Date(sub.subscribedAt).toLocaleDateString() : "Recent"}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelectedSubDetail(sub)}
                            className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 cursor-pointer"
                            title="View Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(sub)}
                            className={`p-1.5 rounded-lg cursor-pointer ${
                              sub.status === "active"
                                ? "text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50"
                                : "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
                            }`}
                            title={sub.status === "active" ? "Deactivate Subscription" : "Reactivate Subscription"}
                          >
                            {sub.status === "active" ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(sub)}
                            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                            title="Edit Subscriber"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteSubscriber(sub)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer"
                            title="Delete Subscriber"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

        {/* Campaign Composer (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-indigo-500" /> Broadcast Email Campaign
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Email Subject Line *
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Discover 5 New Fast AI Utilities & Product Updates"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  HTML Body Content *
                </label>
                <textarea
                  rows={5}
                  value={htmlContent}
                  onChange={(e) => setHtmlContent(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="Test recipient email (e.g. dev@hub.com)"
                  className="flex-1 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
                />
                <button
                  type="button"
                  onClick={() => handleSendCampaign(true)}
                  disabled={sendingCampaign}
                  className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 font-bold text-slate-700 dark:text-slate-300 cursor-pointer disabled:opacity-50"
                >
                  Send Test
                </button>
              </div>

              <div className="pt-2 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => handleSendCampaign(false)}
                  disabled={sendingCampaign || activeCount === 0}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {sendingCampaign ? "Broadcasting..." : `Broadcast to ${activeCount} Active Subscribers`}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subscriber Detail Modal */}
      {selectedSubDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Subscriber Details</h3>
              <button onClick={() => setSelectedSubDetail(null)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <span className="font-bold text-slate-400 block text-[10px] uppercase">ID</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">{selectedSubDetail.id}</span>
              </div>
              <div>
                <span className="font-bold text-slate-400 block text-[10px] uppercase">Email</span>
                <span className="font-semibold text-slate-900 dark:text-white">{selectedSubDetail.email}</span>
              </div>
              <div>
                <span className="font-bold text-slate-400 block text-[10px] uppercase">Name</span>
                <span className="text-slate-800 dark:text-slate-200">{selectedSubDetail.name || "N/A"}</span>
              </div>
              <div>
                <span className="font-bold text-slate-400 block text-[10px] uppercase">Status</span>
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold mt-0.5 ${
                    selectedSubDetail.status === "active"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {selectedSubDetail.status.toUpperCase()}
                </span>
              </div>
              <div>
                <span className="font-bold text-slate-400 block text-[10px] uppercase">Source</span>
                <span className="text-slate-700 dark:text-slate-300">{selectedSubDetail.source || "site_footer"}</span>
              </div>
              <div>
                <span className="font-bold text-slate-400 block text-[10px] uppercase">Subscribed At</span>
                <span className="text-slate-700 dark:text-slate-300">
                  {selectedSubDetail.subscribedAt ? new Date(selectedSubDetail.subscribedAt).toLocaleString() : "N/A"}
                </span>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedSubDetail(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Subscriber Modal */}
      {editingSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Edit Subscriber</h3>
              <button onClick={() => setEditingSub(null)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveEditSub} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Optional subscriber name"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Subscription Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-medium"
                >
                  <option value="active">Active</option>
                  <option value="unsubscribed">Unsubscribed</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingSub(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-500 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Subscriber Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Add Subscriber</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400">
                ✕
              </button>
            </div>
            <form onSubmit={handleAddSubscriber} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="subscriber@example.com"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Subscriber Name
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Source Tag
                </label>
                <input
                  type="text"
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  placeholder="admin_manual, landing_page, etc."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-500 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold"
                >
                  Save Subscriber
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
