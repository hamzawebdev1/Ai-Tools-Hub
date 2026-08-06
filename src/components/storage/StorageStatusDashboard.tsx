import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Lock,
  UploadCloud,
  FileCheck2,
  Trash2,
  Clock,
  RefreshCw,
  AlertTriangle,
  Download,
  Key,
  Database,
  Activity,
  CheckCircle2,
} from "lucide-react";

interface StorageFile {
  fileId: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  uploadedAt: string;
  expiresAt: string;
  downloadToken: string;
  ipAddress: string;
}

interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  fileId: string;
  ip: string;
  details: string;
}

export const StorageStatusDashboard: React.FC = () => {
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [files, setFiles] = useState<StorageFile[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [lastUploadedLink, setLastUploadedLink] = useState<string | null>(null);

  const fetchFilesAndLogs = async () => {
    setLoadingFiles(true);
    try {
      const [filesRes, logsRes] = await Promise.all([
        fetch("/api/storage/files"),
        fetch("/api/storage/audit-logs"),
      ]);

      const filesData = await filesRes.json();
      const logsData = await logsRes.json();

      if (filesData.success) setFiles(filesData.files || []);
      if (logsData.success) setAuditLogs(logsData.logs || []);
    } catch (err) {
      console.error("Failed to load storage dashboard state", err);
    } finally {
      setLoadingFiles(false);
    }
  };

  useEffect(() => {
    fetchFilesAndLogs();
    const interval = setInterval(fetchFilesAndLogs, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileToUpload(e.target.files[0]);
      setErrorMsg(null);
      setUploadStatus(null);
    }
  };

  const handleUpload = async () => {
    if (!fileToUpload) return;
    setUploading(true);
    setErrorMsg(null);
    setUploadStatus("Scanning for malware signature & verifying MIME magic bytes...");

    try {
      const formData = new FormData();
      formData.append("file", fileToUpload);

      const res = await fetch("/api/storage/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!data.success) {
        setErrorMsg(data.error || "Upload failed validation checks.");
        setUploadStatus(null);
      } else {
        setUploadStatus("File encrypted with AES-256-GCM and stored. Auto-delete timer active.");
        setLastUploadedLink(data.downloadUrl);
        setFileToUpload(null);
        fetchFilesAndLogs();
      }
    } catch (err: any) {
      setErrorMsg("Network error during secure file transmission.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileId: string) => {
    try {
      const res = await fetch(`/api/storage/file/${fileId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchFilesAndLogs();
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleForceCleanup = async () => {
    try {
      await fetch("/api/storage/trigger-cleanup", { method: "POST" });
      fetchFilesAndLogs();
    } catch (e) {
      console.error(e);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const getTimeRemaining = (expiresAtStr: string) => {
    const diff = new Date(expiresAtStr).getTime() - Date.now();
    if (diff <= 0) return "Expired (Pending Clean)";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m remaining`;
  };

  return (
    <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 md:p-8 shadow-xl space-y-8 my-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-500" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Secure Encrypted Temporary Storage
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Isolated AES-256-GCM zero-trust storage. Files auto-delete after exactly 24 hours.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Lock className="w-3.5 h-3.5" /> Private Container Active
          </span>
          <button
            onClick={fetchFilesAndLogs}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium transition-colors"
            title="Refresh Status"
          >
            <RefreshCw className={`w-4 h-4 ${loadingFiles ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Security Guarantees Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
            <Key className="w-3.5 h-3.5 text-indigo-500" /> AES-256 Encryption
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
            Client-isolated payload encryption
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
            <Clock className="w-3.5 h-3.5 text-amber-500" /> 24h Auto Wipe
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
            Zero-overwrite disk deletion
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-500" /> Malware Scanner
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
            MIME & signature verification
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
            <Database className="w-3.5 h-3.5 text-sky-500" /> No Public Access
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
            Signed short-lived tokens
          </p>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <UploadCloud className="w-4 h-4 text-indigo-500" /> Secure Storage File Upload
        </h3>

        <div className="p-6 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 text-center space-y-4">
          <input
            type="file"
            id="secure-file-input"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="secure-file-input"
            className="cursor-pointer inline-flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
          >
            <UploadCloud className="w-10 h-10 text-indigo-500 animate-bounce" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {fileToUpload ? fileToUpload.name : "Click or drag file here to test secure storage"}
            </span>
            <span className="text-[11px] text-slate-400">
              PDF, JPG, PNG, WEBP allowed (Max 25MB)
            </span>
          </label>

          {fileToUpload && (
            <div className="pt-2">
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 mx-auto disabled:opacity-50"
              >
                {uploading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
                <span>{uploading ? "Encrypting & Storing..." : "Upload & Encrypt File"}</span>
              </button>
            </div>
          )}

          {uploadStatus && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> {uploadStatus}
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-medium flex items-center justify-center gap-2">
              <AlertTriangle className="w-4 h-4" /> {errorMsg}
            </div>
          )}

          {lastUploadedLink && (
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs space-y-1">
              <p className="font-semibold text-indigo-600 dark:text-indigo-400">Signed Download URL:</p>
              <a
                href={lastUploadedLink}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-indigo-500 underline break-all font-mono"
              >
                {window.location.origin}{lastUploadedLink}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Active Stored Files Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Database className="w-4 h-4 text-indigo-500" /> Active Encrypted Files ({files.length})
          </h3>
          <button
            onClick={handleForceCleanup}
            className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            Trigger 24h Purge
          </button>
        </div>

        {files.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/20 text-xs text-slate-400">
            No files currently stored. Upload a file above to test encrypted storage.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-100 dark:bg-slate-800/80 text-[11px] uppercase font-bold text-slate-500 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3">Filename</th>
                  <th className="p-3">Size</th>
                  <th className="p-3">Uploaded</th>
                  <th className="p-3">Expiry</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {files.map((file) => (
                  <tr key={file.fileId} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-medium text-slate-900 dark:text-slate-100">
                      <div className="flex items-center gap-2">
                        <Lock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span className="truncate max-w-[180px] sm:max-w-xs">{file.originalName}</span>
                      </div>
                    </td>
                    <td className="p-3 text-slate-500">{formatSize(file.sizeBytes)}</td>
                    <td className="p-3 text-slate-500">{new Date(file.uploadedAt).toLocaleTimeString()}</td>
                    <td className="p-3 font-mono text-[11px] text-amber-500">
                      {getTimeRemaining(file.expiresAt)}
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <a
                        href={`/api/storage/download/${file.downloadToken}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold text-[11px] hover:bg-indigo-500/20 transition-colors"
                      >
                        <Download className="w-3 h-3" /> Download
                      </a>
                      <button
                        onClick={() => handleDelete(file.fileId)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-500 font-semibold text-[11px] hover:bg-rose-500/20 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" /> Wipe
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Security Audit Trail */}
      <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-indigo-500" /> Security Audit Log Trail
        </h3>

        <div className="max-h-48 overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 p-4 font-mono text-[11px] text-slate-300 space-y-1.5">
          {auditLogs.length === 0 ? (
            <p className="text-slate-500">No audit events logged yet.</p>
          ) : (
            auditLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-2 border-b border-slate-800/60 pb-1">
                <span className="text-slate-500 shrink-0">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                <span
                  className={
                    log.action.includes("FAIL")
                      ? "text-rose-400 font-bold"
                      : log.action.includes("PASS") || log.action.includes("ENCRYPT")
                      ? "text-emerald-400 font-bold"
                      : "text-indigo-400 font-bold"
                  }
                >
                  {log.action}
                </span>
                <span className="text-slate-400 truncate">{log.details}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
