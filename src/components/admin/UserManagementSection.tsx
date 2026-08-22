import React, { useState, useEffect, useMemo } from "react";
import {
  Users,
  Search,
  Filter,
  Plus,
  Download,
  RefreshCw,
  MoreVertical,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Mail,
  Key,
  Trash2,
  Eye,
  Edit3,
  Copy,
  Check,
  Calendar,
  Clock,
  Activity,
  Star,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX,
  X,
  FileSpreadsheet,
  FileCode2,
  Lock,
} from "lucide-react";
import { collection, getDocs, doc, updateDoc, deleteDoc, setDoc } from "firebase/firestore";
import { db, sendPasswordResetEmail, auth } from "../../services/firebase";
import { Role, RoleConfig, ROLE_CONFIGS } from "../../pages/AdminDashboardPage";
import { TOOLS_DATA } from "../../data/toolsData";

export interface ManagedUser {
  id: string;
  name: string;
  displayName?: string;
  email: string;
  role: Role;
  status: "Active" | "Suspended" | "Banned";
  provider: "google" | "password" | "email" | string;
  photo?: string;
  photoURL?: string;
  createdAt: string;
  lastLogin: string;
  guestUsageCount?: number;
  favorites?: string[];
  history?: Array<{
    toolId: string;
    toolName: string;
    timestamp: string;
    action?: string;
  }>;
}

interface UserManagementSectionProps {
  currentAdminRole: Role;
  onShowNotification: (msg: string) => void;
  onNavigate?: (tab: string) => void;
}

export const UserManagementSection: React.FC<UserManagementSectionProps> = ({
  currentAdminRole,
  onShowNotification,
  onNavigate,
}) => {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Filters, Search, Sort
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [providerFilter, setProviderFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"joined_desc" | "joined_asc" | "login_desc" | "name_asc" | "name_desc" | "usage_desc">("joined_desc");

  // Selection & Pagination
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals
  const [viewingUser, setViewingUser] = useState<ManagedUser | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<ManagedUser | null>(null);
  const [copiedUid, setCopiedUid] = useState<string | null>(null);

  // Create User Form State
  const [createForm, setCreateForm] = useState({
    name: "",
    email: "",
    role: "user" as Role,
    status: "Active" as "Active" | "Suspended" | "Banned",
    sendWelcomeEmail: true,
  });
  const [createLoading, setCreateLoading] = useState(false);

  const permissions = ROLE_CONFIGS[currentAdminRole]?.permissions || ROLE_CONFIGS["super_admin"].permissions;

  // Fetch real users from Firestore
  const fetchUsers = async () => {
    setRefreshing(true);
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const loaded: ManagedUser[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        loaded.push({
          id: docSnap.id,
          name: data.displayName || data.name || data.email?.split("@")[0] || "User",
          displayName: data.displayName || data.name,
          email: data.email || "",
          role: (data.role as Role) || "user",
          status: data.status || "Active",
          provider: data.provider || (data.photoURL?.includes("google") ? "google" : "email"),
          photo: data.photoURL || data.photo,
          photoURL: data.photoURL || data.photo,
          createdAt: data.createdAt ? data.createdAt : new Date().toISOString(),
          lastLogin: data.lastLogin ? data.lastLogin : data.createdAt || new Date().toISOString(),
          guestUsageCount: data.guestUsageCount || 0,
          favorites: data.favorites || [],
          history: data.history || [],
        });
      });

      setUsers(loaded);

      // Sync with backend API
      try {
        await fetch("/api/admin/users/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ users: loaded }),
        });
      } catch (syncErr) {
        console.warn("Backend user sync skipped:", syncErr);
      }
    } catch (err: any) {
      console.error("Error fetching users from Firestore:", err);
      onShowNotification(`Could not fetch users: ${err.message}`);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchUsers();
  }, []);

  // Filtered & Sorted Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q);

      const matchRole = roleFilter === "all" || u.role === roleFilter;
      const matchStatus = statusFilter === "all" || u.status === statusFilter;
      const matchProvider =
        providerFilter === "all" ||
        (providerFilter === "google" && u.provider?.toLowerCase().includes("google")) ||
        (providerFilter === "email" && !u.provider?.toLowerCase().includes("google"));

      return matchSearch && matchRole && matchStatus && matchProvider;
    });
  }, [users, searchQuery, roleFilter, statusFilter, providerFilter]);

  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      if (sortBy === "joined_desc") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === "joined_asc") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === "login_desc") return new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime();
      if (sortBy === "name_asc") return a.name.localeCompare(b.name);
      if (sortBy === "name_desc") return b.name.localeCompare(a.name);
      if (sortBy === "usage_desc") {
        const usageA = (a.history?.length || 0) + (a.favorites?.length || 0);
        const usageB = (b.history?.length || 0) + (b.favorites?.length || 0);
        return usageB - usageA;
      }
      return 0;
    });
  }, [filteredUsers, sortBy]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(sortedUsers.length / pageSize));
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedUsers.slice(start, start + pageSize);
  }, [sortedUsers, currentPage, pageSize]);

  // Adjust page if out of range
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  // Actions
  const handleRoleChange = async (userId: string, newRole: Role) => {
    if (!permissions.manageRoles && newRole === "super_admin") {
      onShowNotification("Only Super Admins can assign Super Admin role.");
      return;
    }
    try {
      await updateDoc(doc(db, "users", userId), { role: newRole });
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
      if (viewingUser?.id === userId) {
        setViewingUser({ ...viewingUser, role: newRole });
      }
      onShowNotification(`User role successfully changed to ${ROLE_CONFIGS[newRole]?.label || newRole}.`);
    } catch (err: any) {
      onShowNotification(`Failed to update role: ${err.message}`);
    }
  };

  const handleStatusChange = async (userId: string, newStatus: "Active" | "Suspended" | "Banned") => {
    try {
      await updateDoc(doc(db, "users", userId), { status: newStatus });
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)));
      if (viewingUser?.id === userId) {
        setViewingUser({ ...viewingUser, status: newStatus });
      }
      onShowNotification(`User status updated to ${newStatus}.`);
    } catch (err: any) {
      onShowNotification(`Failed to update status: ${err.message}`);
    }
  };

  const handleSendPasswordReset = async (email: string) => {
    if (!email) return;
    try {
      await sendPasswordResetEmail(auth, email);
      onShowNotification(`Password reset instructions sent to ${email}.`);
    } catch (err: any) {
      onShowNotification(`Password reset request failed: ${err.message}`);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteDoc(doc(db, "users", userId));
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setSelectedUserIds((prev) => prev.filter((id) => id !== userId));
      if (viewingUser?.id === userId) setViewingUser(null);
      setUserToDelete(null);
      onShowNotification("User account permanently deleted from Firestore.");
    } catch (err: any) {
      onShowNotification(`Failed to delete user: ${err.message}`);
    }
  };

  // Bulk Operations
  const handleBulkAction = async (action: "activate" | "suspend" | "ban" | "delete" | "role", targetRole?: Role) => {
    if (selectedUserIds.length === 0) return;

    if (action === "delete") {
      if (!confirm(`Are you sure you want to permanently delete ${selectedUserIds.length} selected users? This cannot be undone.`)) {
        return;
      }
      for (const id of selectedUserIds) {
        try {
          await deleteDoc(doc(db, "users", id));
        } catch (e) {}
      }
      setUsers((prev) => prev.filter((u) => !selectedUserIds.includes(u.id)));
      setSelectedUserIds([]);
      onShowNotification(`Successfully deleted ${selectedUserIds.length} users.`);
      return;
    }

    if (action === "activate" || action === "suspend" || action === "ban") {
      const statusMap: Record<string, "Active" | "Suspended" | "Banned"> = {
        activate: "Active",
        suspend: "Suspended",
        ban: "Banned",
      };
      const newStatus = statusMap[action];
      for (const id of selectedUserIds) {
        try {
          await updateDoc(doc(db, "users", id), { status: newStatus });
        } catch (e) {}
      }
      setUsers((prev) =>
        prev.map((u) => (selectedUserIds.includes(u.id) ? { ...u, status: newStatus } : u))
      );
      setSelectedUserIds([]);
      onShowNotification(`Updated ${selectedUserIds.length} users to ${newStatus}.`);
      return;
    }

    if (action === "role" && targetRole) {
      for (const id of selectedUserIds) {
        try {
          await updateDoc(doc(db, "users", id), { role: targetRole });
        } catch (e) {}
      }
      setUsers((prev) =>
        prev.map((u) => (selectedUserIds.includes(u.id) ? { ...u, role: targetRole } : u))
      );
      setSelectedUserIds([]);
      onShowNotification(`Updated ${selectedUserIds.length} users to ${ROLE_CONFIGS[targetRole]?.label}.`);
    }
  };

  // Create User Handler
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.email || !createForm.email.includes("@")) {
      onShowNotification("Please enter a valid email address.");
      return;
    }

    setCreateLoading(true);
    try {
      const newUid = "usr_" + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
      const newUserDoc = {
        id: newUid,
        uid: newUid,
        name: createForm.name || createForm.email.split("@")[0],
        displayName: createForm.name || createForm.email.split("@")[0],
        email: createForm.email.toLowerCase().trim(),
        role: createForm.role,
        status: createForm.status,
        provider: "email",
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        favorites: [],
        history: [],
      };

      await setDoc(doc(db, "users", newUid), newUserDoc);

      setUsers((prev) => [newUserDoc as ManagedUser, ...prev]);
      setIsCreateModalOpen(false);
      setCreateForm({
        name: "",
        email: "",
        role: "user",
        status: "Active",
        sendWelcomeEmail: true,
      });

      if (createForm.sendWelcomeEmail) {
        try {
          await sendPasswordResetEmail(auth, createForm.email);
          onShowNotification(`User created and onboarding / password setup email sent to ${createForm.email}.`);
        } catch {
          onShowNotification(`User account created successfully in Firestore.`);
        }
      } else {
        onShowNotification(`User account created successfully.`);
      }
    } catch (err: any) {
      onShowNotification(`Failed to create user: ${err.message}`);
    } finally {
      setCreateLoading(false);
    }
  };

  // Export Users to CSV
  const handleExportCSV = () => {
    if (sortedUsers.length === 0) {
      onShowNotification("No users available to export.");
      return;
    }
    const headers = ["User ID", "Name", "Email", "Role", "Status", "Provider", "Joined Date", "Last Login", "Favorites Count", "History Runs"];
    const rows = sortedUsers.map((u) => [
      `"${u.id}"`,
      `"${u.name.replace(/"/g, '""')}"`,
      `"${u.email.replace(/"/g, '""')}"`,
      `"${u.role}"`,
      `"${u.status}"`,
      `"${u.provider}"`,
      `"${u.createdAt}"`,
      `"${u.lastLogin}"`,
      u.favorites?.length || 0,
      u.history?.length || 0,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `mehzandigital-users-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowNotification("Users list exported to CSV successfully.");
  };

  // Export Users to JSON
  const handleExportJSON = () => {
    if (sortedUsers.length === 0) {
      onShowNotification("No users available to export.");
      return;
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sortedUsers, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `mehzandigital-users-${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onShowNotification("Users list exported to JSON successfully.");
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUid(id);
    setTimeout(() => setCopiedUid(null), 2000);
    onShowNotification("User ID copied to clipboard.");
  };

  // Metrics Summary
  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.status === "Active").length;
    const googleCount = users.filter((u) => u.provider?.toLowerCase().includes("google")).length;
    const emailCount = total - googleCount;
    const staffCount = users.filter((u) => u.role !== "user" && u.role !== "guest").length;

    return { total, active, googleCount, emailCount, staffCount };
  }, [users]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Dynamic Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Users</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{stats.total}</div>
          <p className="text-[10px] text-slate-500 font-medium">Registered on platform</p>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active Status</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{stats.active}</div>
          <p className="text-[10px] text-slate-500 font-medium">Unrestricted accounts</p>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Google OAuth</span>
            <Shield className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{stats.googleCount}</div>
          <p className="text-[10px] text-slate-500 font-medium">SSO verified users</p>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Email / Password</span>
            <Mail className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{stats.emailCount}</div>
          <p className="text-[10px] text-slate-500 font-medium">Direct credentials</p>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Staff / Admins</span>
            <ShieldCheck className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{stats.staffCount}</div>
          <p className="text-[10px] text-slate-500 font-medium">Elevated permissions</p>
        </div>
      </div>

      {/* Main Controls & Search Bar */}
      <div className="p-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by Name, Email, or User ID..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filters & Actions */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold cursor-pointer text-slate-700 dark:text-slate-300"
            >
              <option value="all">All Roles</option>
              <option value="super_admin">Super Admin</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="editor">Editor</option>
              <option value="moderator">Moderator</option>
              <option value="support">Support</option>
              <option value="user">User</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold cursor-pointer text-slate-700 dark:text-slate-300"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
              <option value="Banned">Banned</option>
            </select>

            {/* Provider Filter */}
            <select
              value={providerFilter}
              onChange={(e) => {
                setProviderFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold cursor-pointer text-slate-700 dark:text-slate-300"
            >
              <option value="all">All Providers</option>
              <option value="google">Google SSO</option>
              <option value="email">Email / Pass</option>
            </select>

            {/* Sort Selector */}
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold cursor-pointer text-slate-700 dark:text-slate-300"
            >
              <option value="joined_desc">Newest Joined</option>
              <option value="joined_asc">Oldest Joined</option>
              <option value="login_desc">Recent Login</option>
              <option value="name_asc">Name (A-Z)</option>
              <option value="name_desc">Name (Z-A)</option>
              <option value="usage_desc">Most Active</option>
            </select>

            {/* Refresh */}
            <button
              onClick={fetchUsers}
              disabled={refreshing}
              title="Refresh users list"
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-indigo-500" : ""}`} />
            </button>

            {/* Export Menu */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleExportCSV}
                title="Export as CSV"
                className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
                <span className="hidden sm:inline">CSV</span>
              </button>
              <button
                onClick={handleExportJSON}
                title="Export as JSON"
                className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <FileCode2 className="w-3.5 h-3.5 text-blue-500" />
                <span className="hidden sm:inline">JSON</span>
              </button>
            </div>

            {/* Create / Invite Button */}
            {permissions.manageUsers && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-500/20 cursor-pointer shrink-0 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create User</span>
              </button>
            )}
          </div>
        </div>

        {/* Floating Bulk Action Bar */}
        {selectedUserIds.length > 0 && (
          <div className="p-3.5 rounded-2xl bg-indigo-900/90 text-white border border-indigo-700/80 flex flex-wrap items-center justify-between gap-3 text-xs animate-fade-in shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-2 font-bold">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
              <span>{selectedUserIds.length} user{selectedUserIds.length > 1 ? "s" : ""} selected</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => handleBulkAction("activate")}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-bold cursor-pointer transition-colors"
              >
                Activate All
              </button>
              <button
                onClick={() => handleBulkAction("suspend")}
                className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 font-bold cursor-pointer transition-colors"
              >
                Suspend All
              </button>
              <button
                onClick={() => handleBulkAction("ban")}
                className="px-3 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-600 font-bold cursor-pointer transition-colors"
              >
                Ban All
              </button>

              {permissions.deleteUsers && (
                <button
                  onClick={() => handleBulkAction("delete")}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Selected</span>
                </button>
              )}

              <button
                onClick={() => setSelectedUserIds([])}
                className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 font-medium cursor-pointer"
              >
                Deselect
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-400 font-bold uppercase tracking-wider">
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    checked={paginatedUsers.length > 0 && paginatedUsers.every((u) => selectedUserIds.includes(u.id))}
                    onChange={(e) => {
                      if (e.target.checked) {
                        const pageUids = paginatedUsers.map((u) => u.id);
                        setSelectedUserIds(Array.from(new Set([...selectedUserIds, ...pageUids])));
                      } else {
                        const pageUids = new Set(paginatedUsers.map((u) => u.id));
                        setSelectedUserIds(selectedUserIds.filter((id) => !pageUids.has(id)));
                      }
                    }}
                    className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                </th>
                <th className="p-4">User & Identity</th>
                <th className="p-4">User ID (UID)</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Auth Provider</th>
                <th className="p-4">Activity</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4">Last Active</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={10} className="p-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <RefreshCw className="w-6 h-6 animate-spin text-indigo-500" />
                      <p className="font-semibold text-xs">Loading registered users from Firestore database...</p>
                    </div>
                  </td>
                </tr>
              ) : paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users className="w-8 h-8 text-slate-400 stroke-1" />
                      <p className="font-bold text-sm text-slate-700 dark:text-slate-300">No users found</p>
                      <p className="text-xs text-slate-500 max-w-sm">
                        {searchQuery || roleFilter !== "all" || statusFilter !== "all" || providerFilter !== "all"
                          ? "No user accounts match the selected filters. Try clearing your search query."
                          : "No user accounts registered yet. New signups on the website will be synced here automatically."}
                      </p>
                      {(searchQuery || roleFilter !== "all" || statusFilter !== "all" || providerFilter !== "all") && (
                        <button
                          onClick={() => {
                            setSearchQuery("");
                            setRoleFilter("all");
                            setStatusFilter("all");
                            setProviderFilter("all");
                          }}
                          className="mt-2 px-3 py-1.5 rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold cursor-pointer"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((usr) => {
                  const roleCfg = ROLE_CONFIGS[usr.role] || ROLE_CONFIGS["user"];
                  const isSelected = selectedUserIds.includes(usr.id);
                  const isGoogle = usr.provider?.toLowerCase().includes("google");

                  // User avatar initials
                  const initials = usr.name
                    ? usr.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)
                        .toUpperCase()
                    : "U";

                  return (
                    <tr
                      key={usr.id}
                      className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors ${
                        isSelected ? "bg-indigo-50/40 dark:bg-indigo-950/20" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedUserIds([...selectedUserIds, usr.id]);
                            else setSelectedUserIds(selectedUserIds.filter((id) => id !== usr.id));
                          }}
                          className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                      </td>

                      {/* User & Identity */}
                      <td className="p-4 font-bold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-3">
                          {usr.photo ? (
                            <img
                              src={usr.photo}
                              alt={usr.name}
                              referrerPolicy="no-referrer"
                              className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-black text-xs shrink-0">
                              {initials}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="truncate font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                              <span>{usr.name}</span>
                              {usr.role === "super_admin" && (
                                <span title="Super Admin" className="text-purple-500">
                                  👑
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 font-normal truncate">{usr.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* UID */}
                      <td className="p-4">
                        <div className="flex items-center gap-1 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                          <span>{usr.id.substring(0, 8)}...</span>
                          <button
                            onClick={() => copyToClipboard(usr.id, usr.id)}
                            title="Copy full UID"
                            className="p-1 hover:text-indigo-500 cursor-pointer transition-colors"
                          >
                            {copiedUid === usr.id ? (
                              <Check className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Role Selector */}
                      <td className="p-4">
                        <select
                          value={usr.role}
                          disabled={!permissions.manageRoles && usr.role === "super_admin"}
                          onChange={(e) => handleRoleChange(usr.id, e.target.value as Role)}
                          className={`px-2.5 py-1 rounded-lg border font-bold text-[11px] cursor-pointer ${roleCfg.color} transition-colors`}
                        >
                          <option value="super_admin">Super Admin</option>
                          <option value="admin">Admin</option>
                          <option value="manager">Manager</option>
                          <option value="editor">Editor</option>
                          <option value="moderator">Moderator</option>
                          <option value="support">Support</option>
                          <option value="user">User</option>
                        </select>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <div className="inline-flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              usr.status === "Active"
                                ? "bg-emerald-500"
                                : usr.status === "Suspended"
                                ? "bg-amber-500"
                                : "bg-rose-500"
                            }`}
                          />
                          <select
                            value={usr.status}
                            onChange={(e) => handleStatusChange(usr.id, e.target.value as any)}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold cursor-pointer border ${
                              usr.status === "Active"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                : usr.status === "Suspended"
                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                                : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                            }`}
                          >
                            <option value="Active">Active</option>
                            <option value="Suspended">Suspended</option>
                            <option value="Banned">Banned</option>
                          </select>
                        </div>
                      </td>

                      {/* Provider */}
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            isGoogle
                              ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                              : "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20"
                          }`}
                        >
                          {isGoogle ? "Google SSO" : "Email / Pass"}
                        </span>
                      </td>

                      {/* Activity */}
                      <td className="p-4">
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-0.5">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-amber-500" />
                            <span>{usr.favorites?.length || 0} favs</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Activity className="w-3 h-3 text-indigo-500" />
                            <span>{usr.history?.length || 0} runs</span>
                          </div>
                        </div>
                      </td>

                      {/* Joined Date */}
                      <td className="p-4 text-[11px] text-slate-500 dark:text-slate-400">
                        {usr.createdAt ? new Date(usr.createdAt).toLocaleDateString() : "—"}
                      </td>

                      {/* Last Active */}
                      <td className="p-4 text-[11px] text-slate-500 dark:text-slate-400">
                        {usr.lastLogin ? new Date(usr.lastLogin).toLocaleDateString() : "Recently"}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* View Details */}
                          <button
                            onClick={() => setViewingUser(usr)}
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-indigo-600 dark:text-indigo-400 cursor-pointer transition-colors"
                            title="Inspect User Details & History"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Send Reset Email */}
                          <button
                            onClick={() => handleSendPasswordReset(usr.email)}
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-amber-500 cursor-pointer transition-colors"
                            title="Send Password Reset Email"
                          >
                            <Key className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          {permissions.deleteUsers && usr.role !== "super_admin" && (
                            <button
                              onClick={() => setUserToDelete(usr)}
                              className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50 text-rose-500 cursor-pointer transition-colors"
                              title="Delete User"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>
              Showing{" "}
              <strong className="text-slate-800 dark:text-slate-200">
                {sortedUsers.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
              </strong>{" "}
              to{" "}
              <strong className="text-slate-800 dark:text-slate-200">
                {Math.min(currentPage * pageSize, sortedUsers.length)}
              </strong>{" "}
              of <strong className="text-slate-800 dark:text-slate-200">{sortedUsers.length}</strong> users
            </span>

            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="ml-2 px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-semibold cursor-pointer text-slate-700 dark:text-slate-300"
            >
              <option value={10}>10 / page</option>
              <option value={25}>25 / page</option>
              <option value={50}>50 / page</option>
              <option value={100}>100 / page</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pNum = i + 1;
              if (totalPages > 5 && currentPage > 3) {
                pNum = currentPage - 3 + i + 1;
                if (pNum > totalPages) pNum = totalPages - (4 - i);
              }
              return (
                <button
                  key={pNum}
                  onClick={() => setCurrentPage(pNum)}
                  className={`w-8 h-8 rounded-xl font-bold text-xs cursor-pointer transition-colors ${
                    currentPage === pNum
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                      : "border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {pNum}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* CREATE USER MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Create New User</h3>
                  <p className="text-xs text-slate-400">Add a verified user account to Firestore</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                  placeholder="sarah@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Role Assignment</label>
                  <select
                    value={createForm.role}
                    onChange={(e) => setCreateForm({ ...createForm, role: e.target.value as Role })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-semibold cursor-pointer text-slate-800 dark:text-slate-200"
                  >
                    <option value="user">User</option>
                    <option value="support">Support</option>
                    <option value="moderator">Moderator</option>
                    <option value="editor">Editor</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                    {permissions.manageRoles && <option value="super_admin">Super Admin</option>}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Initial Status</label>
                  <select
                    value={createForm.status}
                    onChange={(e) => setCreateForm({ ...createForm, status: e.target.value as any })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-semibold cursor-pointer text-slate-800 dark:text-slate-200"
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/50 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="sendWelcome"
                  checked={createForm.sendWelcomeEmail}
                  onChange={(e) => setCreateForm({ ...createForm, sendWelcomeEmail: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor="sendWelcome" className="text-[11px] text-indigo-900 dark:text-indigo-200 cursor-pointer font-medium">
                  Dispatch password setup link to user's email
                </label>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/20 cursor-pointer transition-colors disabled:opacity-50"
                >
                  {createLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  <span>Create Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* USER DETAILS INSPECTOR MODAL */}
      {viewingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3.5">
                {viewingUser.photo ? (
                  <img
                    src={viewingUser.photo}
                    alt={viewingUser.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-indigo-500/30"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-black text-lg">
                    {viewingUser.name.substring(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">{viewingUser.name}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-extrabold uppercase ${ROLE_CONFIGS[viewingUser.role]?.color}`}>
                      {ROLE_CONFIGS[viewingUser.role]?.label || viewingUser.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{viewingUser.email}</p>
                </div>
              </div>

              <button
                onClick={() => setViewingUser(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Account Status</span>
                <div className="font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${viewingUser.status === "Active" ? "bg-emerald-500" : "bg-rose-500"}`} />
                  {viewingUser.status}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Provider</span>
                <div className="font-black text-slate-900 dark:text-white capitalize">{viewingUser.provider}</div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Joined Date</span>
                <div className="font-bold text-slate-800 dark:text-slate-200">
                  {viewingUser.createdAt ? new Date(viewingUser.createdAt).toLocaleDateString() : "—"}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Last Active</span>
                <div className="font-bold text-slate-800 dark:text-slate-200">
                  {viewingUser.lastLogin ? new Date(viewingUser.lastLogin).toLocaleDateString() : "Recently"}
                </div>
              </div>
            </div>

            {/* UID Bar */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 font-sans font-bold uppercase">Firestore User UID</span>
                <p className="text-indigo-600 dark:text-indigo-400 font-semibold">{viewingUser.id}</p>
              </div>
              <button
                onClick={() => copyToClipboard(viewingUser.id, viewingUser.id)}
                className="px-3 py-1.5 rounded-xl bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy UID</span>
              </button>
            </div>

            {/* Favorites List */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-500" />
                <span>Favorited Tools ({viewingUser.favorites?.length || 0})</span>
              </h4>
              {viewingUser.favorites && viewingUser.favorites.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {viewingUser.favorites.map((toolId) => {
                    const tool = TOOLS_DATA.find((t) => t.id === toolId || t.slug === toolId);
                    return (
                      <span
                        key={toolId}
                        className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1"
                      >
                        <span>{tool?.name || toolId}</span>
                      </span>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No tools bookmarked yet.</p>
              )}
            </div>

            {/* Execution History */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-indigo-500" />
                <span>Recent Tool Runs ({viewingUser.history?.length || 0})</span>
              </h4>
              {viewingUser.history && viewingUser.history.length > 0 ? (
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 max-h-40 overflow-y-auto space-y-2 text-xs">
                  {viewingUser.history.slice(0, 10).map((hist, idx) => (
                    <div key={idx} className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-1.5 last:border-0 last:pb-0">
                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{hist.toolName || hist.toolId}</span>
                        {hist.action && <span className="text-slate-400 text-[10px] ml-1.5">({hist.action})</span>}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {hist.timestamp ? new Date(hist.timestamp).toLocaleString() : "Recently"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No recorded tool execution history.</p>
              )}
            </div>

            {/* Admin Management Controls */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Administrative Actions
              </h4>
              <div className="flex items-center gap-2 flex-wrap">
                {/* Role Switch */}
                <select
                  value={viewingUser.role}
                  onChange={(e) => handleRoleChange(viewingUser.id, e.target.value as Role)}
                  className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold cursor-pointer"
                >
                  <option value="user">Role: User</option>
                  <option value="support">Role: Support</option>
                  <option value="moderator">Role: Moderator</option>
                  <option value="editor">Role: Editor</option>
                  <option value="manager">Role: Manager</option>
                  <option value="admin">Role: Admin</option>
                  {permissions.manageRoles && <option value="super_admin">Role: Super Admin</option>}
                </select>

                {/* Status Switch */}
                <select
                  value={viewingUser.status}
                  onChange={(e) => handleStatusChange(viewingUser.id, e.target.value as any)}
                  className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold cursor-pointer"
                >
                  <option value="Active">Status: Active</option>
                  <option value="Suspended">Status: Suspended</option>
                  <option value="Banned">Status: Banned</option>
                </select>

                {/* Reset Password Button */}
                <button
                  onClick={() => handleSendPasswordReset(viewingUser.email)}
                  className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Send Password Reset</span>
                </button>

                {/* Delete Button */}
                {permissions.deleteUsers && viewingUser.role !== "super_admin" && (
                  <button
                    onClick={() => {
                      setUserToDelete(viewingUser);
                      setViewingUser(null);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete User</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-black text-slate-900 dark:text-white">Delete User Account</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to permanently delete the account for{" "}
                <strong className="text-slate-900 dark:text-white">{userToDelete.name}</strong> ({userToDelete.email})?
              </p>
              <p className="text-[11px] text-rose-500 font-semibold pt-1">
                This action will delete all Firestore document data and cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setUserToDelete(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(userToDelete.id)}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/20 cursor-pointer transition-colors"
              >
                Yes, Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
