import React, { useState, useEffect } from "react";
import {
  Mail,
  Search,
  CheckCircle2,
  Clock,
  Send,
  Trash2,
  Download,
  RefreshCw,
  MessageSquare,
  AlertTriangle,
  FileCode,
  Shield,
  Eye,
  Check,
  X,
  ExternalLink,
  Bug,
  Lightbulb,
  ThumbsUp,
  User,
  Calendar,
  Tag,
  Edit,
} from "lucide-react";
import { ContactMessage, BugReport, FeatureRequest } from "../../server/admin/submissionsStore";

interface InboxManagementSectionProps {
  onShowNotification: (msg: string) => void;
}

export const InboxManagementSection: React.FC<InboxManagementSectionProps> = ({
  onShowNotification,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"contact" | "bugs" | "features">("contact");
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [bugReports, setBugReports] = useState<BugReport[]>([]);
  const [featureRequests, setFeatureRequests] = useState<FeatureRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Selected message for detail / reply modal
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  // Selected Bug Report
  const [selectedBug, setSelectedBug] = useState<BugReport | null>(null);
  const [bugNotes, setBugNotes] = useState("");

  // Selected Feature Request
  const [selectedFeature, setSelectedFeature] = useState<FeatureRequest | null>(null);
  const [featureNotes, setFeatureNotes] = useState("");

  const fetchInbox = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/inbox");
      const data = await res.json();
      if (data.success) {
        setContactMessages(data.contactMessages || []);
        setBugReports(data.bugReports || []);
        setFeatureRequests(data.featureRequests || []);
      }
    } catch (err) {
      console.error("Failed to load inbox:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInbox();
  }, []);

  const handleToggleRead = async (msg: ContactMessage) => {
    const newRead = !msg.read;
    try {
      const res = await fetch(`/api/admin/inbox/${msg.id}/read`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: newRead }),
      });
      const data = await res.json();
      if (data.success) {
        setContactMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, read: newRead } : m))
        );
        if (selectedMessage?.id === msg.id) {
          setSelectedMessage((prev) => (prev ? { ...prev, read: newRead } : null));
        }
      }
    } catch {
      onShowNotification("Error updating read status.");
    }
  };

  const handleUpdateStatus = async (id: string, status: "Open" | "In Progress" | "Resolved" | "Closed") => {
    try {
      const res = await fetch(`/api/admin/inbox/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        onShowNotification(`Status updated to ${status}.`);
        setContactMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status } : m))
        );
        if (selectedMessage?.id === id) {
          setSelectedMessage((prev) => (prev ? { ...prev, status } : null));
        }
      }
    } catch {
      onShowNotification("Error updating status.");
    }
  };

  const handleSendReply = async () => {
    if (!selectedMessage || !replyText.trim()) {
      onShowNotification("Please enter reply text.");
      return;
    }
    setSendingReply(true);
    try {
      const res = await fetch(`/api/admin/inbox/${selectedMessage.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyText, sendEmail: true }),
      });
      const data = await res.json();
      if (data.success) {
        onShowNotification(`Reply dispatched to ${selectedMessage.email}`);
        setReplyText("");
        if (data.messageDoc) {
          setSelectedMessage(data.messageDoc);
          setContactMessages((prev) =>
            prev.map((m) => (m.id === selectedMessage.id ? data.messageDoc : m))
          );
        }
      } else {
        onShowNotification(data.error || "Failed to dispatch reply.");
      }
    } catch {
      onShowNotification("Error sending reply.");
    } finally {
      setSendingReply(false);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this contact message?")) return;
    try {
      const res = await fetch(`/api/admin/inbox/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        onShowNotification("Message deleted.");
        setContactMessages((prev) => prev.filter((m) => m.id !== id));
        if (selectedMessage?.id === id) setSelectedMessage(null);
      }
    } catch {
      onShowNotification("Error deleting message.");
    }
  };

  // Bug Report Actions
  const handleUpdateBugStatus = async (id: string, status: BugReport["status"], notes?: string) => {
    try {
      const res = await fetch(`/api/admin/reports/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, adminNotes: notes }),
      });
      const data = await res.json();
      if (data.success) {
        onShowNotification(`Bug report status updated to ${status}.`);
        setBugReports((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status, adminNotes: notes ?? b.adminNotes } : b))
        );
        if (selectedBug?.id === id) {
          setSelectedBug((prev) => (prev ? { ...prev, status, adminNotes: notes ?? prev.adminNotes } : null));
        }
      }
    } catch {
      onShowNotification("Error updating bug report.");
    }
  };

  const handleDeleteBug = async (id: string) => {
    if (!confirm("Are you sure you want to delete this bug report?")) return;
    try {
      const res = await fetch(`/api/admin/reports/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        onShowNotification("Bug report deleted.");
        setBugReports((prev) => prev.filter((b) => b.id !== id));
        if (selectedBug?.id === id) setSelectedBug(null);
      }
    } catch {
      onShowNotification("Error deleting bug report.");
    }
  };

  // Feature Request Actions
  const handleUpdateFeatureStatus = async (id: string, status: FeatureRequest["status"], notes?: string) => {
    try {
      const res = await fetch(`/api/admin/feature-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, adminNotes: notes }),
      });
      const data = await res.json();
      if (data.success) {
        onShowNotification(`Feature request status updated to ${status}.`);
        setFeatureRequests((prev) =>
          prev.map((f) => (f.id === id ? { ...f, status, adminNotes: notes ?? f.adminNotes } : f))
        );
        if (selectedFeature?.id === id) {
          setSelectedFeature((prev) => (prev ? { ...prev, status, adminNotes: notes ?? prev.adminNotes } : null));
        }
      }
    } catch {
      onShowNotification("Error updating feature request.");
    }
  };

  const handleDeleteFeature = async (id: string) => {
    if (!confirm("Are you sure you want to delete this feature request?")) return;
    try {
      const res = await fetch(`/api/admin/feature-requests/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        onShowNotification("Feature request deleted.");
        setFeatureRequests((prev) => prev.filter((f) => f.id !== id));
        if (selectedFeature?.id === id) setSelectedFeature(null);
      }
    } catch {
      onShowNotification("Error deleting feature request.");
    }
  };

  const handleExportCSV = () => {
    window.location.href = "/api/admin/inbox/export";
  };

  const filteredContact = contactMessages.filter((m) => {
    const matchesSearch =
      search === "" ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      m.referenceId.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "all" || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredBugs = bugReports.filter((b) => {
    const matchesSearch =
      search === "" ||
      b.toolName.toLowerCase().includes(search.toLowerCase()) ||
      b.userEmail.toLowerCase().includes(search.toLowerCase()) ||
      b.description.toLowerCase().includes(search.toLowerCase()) ||
      b.referenceId.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredFeatures = featureRequests.filter((f) => {
    const matchesSearch =
      search === "" ||
      f.toolName.toLowerCase().includes(search.toLowerCase()) ||
      f.description.toLowerCase().includes(search.toLowerCase()) ||
      (f.userEmail && f.userEmail.toLowerCase().includes(search.toLowerCase())) ||
      (f.userName && f.userName.toLowerCase().includes(search.toLowerCase())) ||
      f.referenceId.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "all" || f.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-indigo-500" /> Support Inbox & Submissions
          </h2>
          <p className="text-xs text-slate-500">
            Real contact requests, issue reports, feature suggestions, and live email dispatcher.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={fetchInbox}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-indigo-500" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => { setActiveSubTab("contact"); setStatusFilter("all"); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "contact"
              ? "bg-indigo-600 text-white shadow-md"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          Contact Messages ({contactMessages.length})
        </button>
        <button
          onClick={() => { setActiveSubTab("bugs"); setStatusFilter("all"); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "bugs"
              ? "bg-indigo-600 text-white shadow-md"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          Bug Reports ({bugReports.length})
        </button>
        <button
          onClick={() => { setActiveSubTab("features"); setStatusFilter("all"); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "features"
              ? "bg-indigo-600 text-white shadow-md"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          Feature Requests ({featureRequests.length})
        </button>
      </div>

      {/* TAB 1: CONTACT MESSAGES */}
      {activeSubTab === "contact" && (
        <>
          <div className="p-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search messages by name, email, subject, or Reference ID..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs focus:outline-hidden focus:border-indigo-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-4 w-8"></th>
                    <th className="py-3.5 px-4">Sender & Ref</th>
                    <th className="py-3.5 px-4">Subject & Category</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-center">Date</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredContact.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500">
                        No contact messages in inbox.
                      </td>
                    </tr>
                  ) : (
                    filteredContact.map((msg) => (
                      <tr
                        key={msg.id}
                        onClick={() => setSelectedMessage(msg)}
                        className={`hover:bg-slate-50/75 dark:hover:bg-slate-800/40 transition-colors cursor-pointer ${
                          !msg.read ? "font-bold bg-indigo-50/20 dark:bg-indigo-950/10" : ""
                        }`}
                      >
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleRead(msg);
                            }}
                            className={`w-2.5 h-2.5 rounded-full ${
                              !msg.read ? "bg-indigo-600 ring-4 ring-indigo-500/20" : "bg-slate-300 dark:bg-slate-700"
                            }`}
                            title={msg.read ? "Mark as unread" : "Mark as read"}
                          />
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex flex-col">
                            <span className="text-slate-900 dark:text-white">{msg.name}</span>
                            <span className="text-slate-400 text-[11px]">{msg.email}</span>
                            <span className="font-mono text-[10px] text-indigo-500">{msg.referenceId}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex flex-col">
                            <span className="text-slate-800 dark:text-slate-200 line-clamp-1">{msg.subject}</span>
                            <span className="text-slate-400 text-[11px]">{msg.category}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              msg.status === "Open"
                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                : msg.status === "In Progress"
                                ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            }`}
                          >
                            {msg.status}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-center text-slate-400 font-mono text-[11px]">
                          {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : "Recent"}
                        </td>

                        <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedMessage(msg)}
                              className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 cursor-pointer"
                              title="View & Reply"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer"
                              title="Delete"
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
        </>
      )}

      {/* TAB 2: BUG REPORTS */}
      {activeSubTab === "bugs" && (
        <>
          <div className="p-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search bug reports by tool, reporter email, or Ref ID..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs focus:outline-hidden focus:border-indigo-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-4">Tool & Ref</th>
                    <th className="py-3.5 px-4">Issue & User</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-center">Date</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredBugs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-500">
                        No bug reports logged.
                      </td>
                    </tr>
                  ) : (
                    filteredBugs.map((bug) => (
                      <tr
                        key={bug.id}
                        onClick={() => { setSelectedBug(bug); setBugNotes(bug.adminNotes || ""); }}
                        className="hover:bg-slate-50/75 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              <Bug className="w-3.5 h-3.5 text-rose-500" /> {bug.toolName}
                            </span>
                            <span className="font-mono text-[10px] text-indigo-500">{bug.referenceId}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex flex-col">
                            <span className="text-slate-800 dark:text-slate-200 line-clamp-1">{bug.description}</span>
                            <span className="text-slate-400 text-[11px]">{bug.userEmail} ({bug.issueType})</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              bug.status === "Open"
                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                : bug.status === "In Progress"
                                ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            }`}
                          >
                            {bug.status}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-center text-slate-400 font-mono text-[11px]">
                          {bug.createdAt ? new Date(bug.createdAt).toLocaleDateString() : "Recent"}
                        </td>

                        <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => { setSelectedBug(bug); setBugNotes(bug.adminNotes || ""); }}
                              className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 cursor-pointer"
                              title="View & Edit Bug"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteBug(bug.id)}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer"
                              title="Delete Bug Report"
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
        </>
      )}

      {/* TAB 3: FEATURE REQUESTS */}
      {activeSubTab === "features" && (
        <>
          <div className="p-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search feature requests by title, email, user, or Ref ID..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs focus:outline-hidden focus:border-indigo-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="NEW">NEW</option>
              <option value="IN REVIEW">IN REVIEW</option>
              <option value="PLANNED">PLANNED</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>

          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-4">Feature & Ref</th>
                    <th className="py-3.5 px-4">Description & User</th>
                    <th className="py-3.5 px-4 text-center">Priority</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-center">Votes</th>
                    <th className="py-3.5 px-4 text-center">Submitted</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredFeatures.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-500">
                        No feature requests logged.
                      </td>
                    </tr>
                  ) : (
                    filteredFeatures.map((req) => (
                      <tr
                        key={req.id}
                        onClick={() => { setSelectedFeature(req); setFeatureNotes(req.adminNotes || ""); }}
                        className="hover:bg-slate-50/75 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> {req.toolName}
                            </span>
                            <span className="font-mono text-[10px] text-indigo-500">{req.referenceId}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex flex-col">
                            <span className="text-slate-800 dark:text-slate-200 line-clamp-1">{req.description}</span>
                            <span className="text-slate-400 text-[11px]">
                              {req.userName || req.userEmail} {req.userId ? `(UID: ${req.userId.substring(0, 8)})` : ""}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                            {req.priority || "Medium"}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              req.status === "NEW"
                                ? "bg-sky-500/10 text-sky-600 dark:text-sky-400"
                                : req.status === "IN REVIEW"
                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                : req.status === "PLANNED"
                                ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                                : req.status === "COMPLETED"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                            }`}
                          >
                            {req.status}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-center font-bold text-slate-700 dark:text-slate-300">
                          {req.votes || 1}
                        </td>

                        <td className="py-3.5 px-4 text-center text-slate-400 font-mono text-[11px]">
                          {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : "Recent"}
                        </td>

                        <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => { setSelectedFeature(req); setFeatureNotes(req.adminNotes || ""); }}
                              className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 cursor-pointer"
                              title="View & Edit Feature Request"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteFeature(req.id)}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer"
                              title="Delete Feature Request"
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
        </>
      )}

      {/* Contact Message Detail & Reply Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="font-mono text-[11px] text-indigo-500 font-bold">{selectedMessage.referenceId}</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  {selectedMessage.subject}
                </h3>
                <p className="text-xs text-slate-400">
                  From: {selectedMessage.name} &lt;{selectedMessage.email}&gt;
                </p>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            {/* Status Selector */}
            <div className="flex items-center gap-3 text-xs">
              <span className="font-bold text-slate-500">Status:</span>
              {(["Open", "In Progress", "Resolved", "Closed"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => handleUpdateStatus(selectedMessage.id, s)}
                  className={`px-3 py-1 rounded-xl font-bold cursor-pointer transition-colors ${
                    selectedMessage.status === s
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Message Body */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {selectedMessage.message}
            </div>

            {/* Reply Thread */}
            {selectedMessage.replyHistory && selectedMessage.replyHistory.length > 0 && (
              <div className="space-y-3">
                <p className="font-bold text-slate-900 dark:text-white text-xs">Reply History:</p>
                {selectedMessage.replyHistory.map((rep) => (
                  <div
                    key={rep.id}
                    className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Admin: {rep.adminEmail}</span>
                      <span>{new Date(rep.sentAt).toLocaleString()}</span>
                    </div>
                    <p className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap">{rep.replyText}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Reply Input */}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <p className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-indigo-500" /> Send Email Response
              </p>
              <textarea
                rows={4}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your response to the user here. An email will be dispatched immediately..."
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
              />
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={handleSendReply}
                  disabled={sendingReply}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{sendingReply ? "Sending..." : "Dispatch Reply"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bug Report Detail & Management Modal */}
      {selectedBug && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in overflow-y-auto">
          <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="font-mono text-[11px] text-indigo-500 font-bold">{selectedBug.referenceId}</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-2">
                  <Bug className="w-4 h-4 text-rose-500" /> {selectedBug.toolName} Bug Report
                </h3>
                <p className="text-xs text-slate-400">Reporter: {selectedBug.userEmail}</p>
              </div>
              <button onClick={() => setSelectedBug(null)} className="text-slate-400 hover:text-slate-600 text-sm">
                ✕
              </button>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="font-bold text-slate-500">Status:</span>
              {(["Open", "In Progress", "Resolved", "Closed"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => handleUpdateBugStatus(selectedBug.id, st, bugNotes)}
                  className={`px-3 py-1 rounded-xl font-bold cursor-pointer transition-colors ${
                    selectedBug.status === st
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="space-y-2 text-xs">
              <p className="font-bold text-slate-700 dark:text-slate-300">Description:</p>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 leading-relaxed whitespace-pre-wrap text-slate-800 dark:text-slate-200">
                {selectedBug.description}
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <label className="font-bold text-slate-700 dark:text-slate-300 block">Admin Notes:</label>
              <textarea
                rows={3}
                value={bugNotes}
                onChange={(e) => setBugNotes(e.target.value)}
                placeholder="Add internal notes about this bug resolution..."
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => handleDeleteBug(selectedBug.id)}
                className="px-4 py-2 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 text-xs font-bold"
              >
                Delete Report
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedBug(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-500 text-xs font-bold"
                >
                  Close
                </button>
                <button
                  onClick={() => handleUpdateBugStatus(selectedBug.id, selectedBug.status, bugNotes)}
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md"
                >
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feature Request Detail & Management Modal */}
      {selectedFeature && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in overflow-y-auto">
          <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="font-mono text-[11px] text-indigo-500 font-bold">{selectedFeature.referenceId}</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" /> {selectedFeature.toolName}
                </h3>
                <p className="text-xs text-slate-400">
                  User: {selectedFeature.userName || selectedFeature.userEmail || "Anonymous"} {selectedFeature.userId ? `(UID: ${selectedFeature.userId})` : ""}
                </p>
              </div>
              <button onClick={() => setSelectedFeature(null)} className="text-slate-400 hover:text-slate-600 text-sm">
                ✕
              </button>
            </div>

            {/* Status Selector (NEW, IN REVIEW, PLANNED, COMPLETED, REJECTED) */}
            <div className="space-y-1.5">
              <span className="font-bold text-slate-500 text-xs block">Request Status:</span>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {(["NEW", "IN REVIEW", "PLANNED", "COMPLETED", "REJECTED"] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateFeatureStatus(selectedFeature.id, st, featureNotes)}
                    className={`px-3 py-1 rounded-xl font-bold cursor-pointer transition-colors ${
                      selectedFeature.status === st
                        ? "bg-indigo-600 text-white shadow-md"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Request Description */}
            <div className="space-y-2 text-xs">
              <p className="font-bold text-slate-700 dark:text-slate-300">Feature Description:</p>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 leading-relaxed whitespace-pre-wrap text-slate-800 dark:text-slate-200">
                {selectedFeature.description}
              </div>
            </div>

            {/* Admin Notes */}
            <div className="space-y-2 text-xs">
              <label className="font-bold text-slate-700 dark:text-slate-300 block">Admin Internal Notes:</label>
              <textarea
                rows={3}
                value={featureNotes}
                onChange={(e) => setFeatureNotes(e.target.value)}
                placeholder="Add internal roadmap or status notes for this feature..."
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => handleDeleteFeature(selectedFeature.id)}
                className="px-4 py-2 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 text-xs font-bold"
              >
                Delete Request
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedFeature(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-500 text-xs font-bold"
                >
                  Close
                </button>
                <button
                  onClick={() => handleUpdateFeatureStatus(selectedFeature.id, selectedFeature.status, featureNotes)}
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md"
                >
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
