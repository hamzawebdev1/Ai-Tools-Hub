import React, { useState, useEffect } from "react";
import {
  History,
  Search,
  Filter,
  RefreshCw,
  User,
  Shield,
  Clock,
  Terminal,
} from "lucide-react";
import { CMSAuditLog } from "../../server/admin/cmsStore";

interface AuditLogsSectionProps {
  onShowNotification: (msg: string) => void;
}

export const AuditLogsSection: React.FC<AuditLogsSectionProps> = ({
  onShowNotification,
}) => {
  const [logs, setLogs] = useState<CMSAuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const url = filter !== "all" ? `/api/admin/audit-logs?filter=${filter}` : "/api/admin/audit-logs";
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error("Failed to load audit logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [filter]);

  const filteredLogs = logs.filter(
    (l) =>
      search === "" ||
      l.adminEmail.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.details.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-500" /> Admin Activity Audit Logs
          </h2>
          <p className="text-xs text-slate-500">
            Immutable tracking of all admin actions, configuration modifications, and entity lifecycle changes.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-indigo-500" : ""}`} />
          <span>Refresh Logs</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search audit logs by admin email, action, or details..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs focus:outline-hidden focus:border-indigo-500"
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
        >
          <option value="all">All Entity Types</option>
          <option value="tool">Tools</option>
          <option value="category">Categories</option>
          <option value="blog">Blog</option>
          <option value="user">Users</option>
          <option value="campaign">Campaigns</option>
          <option value="settings">Settings</option>
        </select>
      </div>

      {/* Logs Table */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Admin Actor</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Entity</th>
                <th className="py-3.5 px-4">Details</th>
                <th className="py-3.5 px-4 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono text-[11px]">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 font-sans">
                    No activity logs recorded.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/75 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-indigo-600 dark:text-indigo-400 font-bold font-sans">
                      {log.adminEmail}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[10px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-sans uppercase text-[10px] font-semibold">
                      {log.entityType}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-sans">
                      {log.details}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-400">
                      {log.ip || "127.0.0.1"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
