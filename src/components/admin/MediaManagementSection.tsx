import React, { useState, useEffect, useRef } from "react";
import {
  Image as ImageIcon,
  Upload,
  Trash2,
  Search,
  Filter,
  Copy,
  Check,
  Eye,
  FileText,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Grid,
  List,
  FolderOpen,
  Info,
} from "lucide-react";

export interface MediaItem {
  id: string;
  name: string;
  originalName: string;
  url: string;
  sizeBytes: number;
  mimeType: string;
  category: "image" | "document" | "logo" | "favicon" | "icon" | "other";
  width?: number;
  height?: number;
  uploadedBy: string;
  createdAt: string;
}

interface MediaManagementSectionProps {
  onSelectMedia?: (url: string) => void;
  isModal?: boolean;
}

export const MediaManagementSection: React.FC<MediaManagementSectionProps> = ({
  onSelectMedia,
  isModal = false,
}) => {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Upload Form State
  const [customName, setCustomName] = useState("");
  const [uploadCategory, setUploadCategory] = useState<"image" | "document" | "logo" | "favicon" | "icon">("image");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchMedia = async () => {
    setLoading(true);
    try {
      let url = "/api/admin/media";
      const params = new URLSearchParams();
      if (selectedCategory !== "all") params.append("category", selectedCategory);
      if (searchQuery) params.append("search", searchQuery);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setMediaList(data.media || []);
      } else {
        showToast(data.error || "Failed to load media files.", "error");
      }
    } catch (e) {
      console.error("Error fetching media:", e);
      showToast("Could not load media library.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [selectedCategory, searchQuery]);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    // Security pre-check for dangerous files
    const dangerousExts = [".exe", ".bat", ".sh", ".cmd", ".msi", ".php", ".js", ".py", ".vbs", ".bin", ".elf", ".dll", ".ps1"];
    const ext = "." + (file.name.split(".").pop() || "").toLowerCase();
    if (dangerousExts.includes(ext)) {
      showToast(`Upload blocked: File extension ${ext} is strictly prohibited for security.`, "error");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast("File exceeds maximum allowed size of 10MB.", "error");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    if (customName.trim()) formData.append("customName", customName.trim());
    formData.append("category", uploadCategory);

    try {
      const res = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Media "${data.media?.name || file.name}" uploaded successfully!`);
        setCustomName("");
        if (fileInputRef.current) fileInputRef.current.value = "";
        fetchMedia();
        if (onSelectMedia && data.media?.url) {
          onSelectMedia(data.media.url);
        }
      } else {
        showToast(data.error || "Failed to upload file.", "error");
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      showToast("Upload network failure.", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" permanently?`)) return;

    try {
      const res = await fetch(`/api/admin/media/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        showToast(`File "${name}" deleted.`);
        setMediaList((prev) => prev.filter((m) => m.id !== id));
        if (selectedItem?.id === id) setSelectedItem(null);
        setSelectedIds((prev) => prev.filter((item) => item !== id));
      } else {
        showToast(data.error || "Failed to delete file.", "error");
      }
    } catch (err) {
      console.error("Delete error:", err);
      showToast("Could not delete file.", "error");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Delete ${selectedIds.length} selected media files permanently?`)) return;

    for (const id of selectedIds) {
      try {
        await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
      } catch (e) {}
    }
    showToast(`Deleted ${selectedIds.length} media items.`);
    setSelectedIds([]);
    fetchMedia();
  };

  const handleCopyUrl = (item: MediaItem) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    showToast("Media URL copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6" id="media-management-section">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`p-4 rounded-xl shadow-lg border flex items-center justify-between text-sm font-medium transition-all ${
            toastMessage.type === "success"
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
              : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
          }`}
        >
          <div className="flex items-center gap-2">
            {toastMessage.type === "success" ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span>{toastMessage.text}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="opacity-70 hover:opacity-100">
            &times;
          </button>
        </div>
      )}

      {/* Top Header & Quick Upload */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Media Library
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Upload, manage, and attach images, site logos, favicons, and documents securely.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchMedia}
              disabled={loading}
              className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition flex items-center gap-2 text-sm font-medium"
              title="Refresh Media"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === "grid"
                    ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === "table"
                    ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Drag and Drop Upload Area */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            handleFileUpload(e.dataTransfer.files);
          }}
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
            dragActive
              ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20"
              : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-900/50"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileUpload(e.target.files)}
            className="hidden"
            accept="image/*,application/pdf,text/plain,.svg,.ico"
          />

          <div className="max-w-md mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
              <Upload className={`w-6 h-6 ${uploading ? "animate-bounce" : ""}`} />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Drag & Drop files here or click to browse
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Supports PNG, JPG, WEBP, SVG, ICO, GIF (Max 10MB). Scanned for malware and sanitized.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Optional custom title..."
                className="px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <select
                value={uploadCategory}
                onChange={(e: any) => setUploadCategory(e.target.value)}
                className="px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="image">Standard Image</option>
                <option value="logo">Site Logo</option>
                <option value="favicon">Favicon</option>
                <option value="icon">Tool Icon</option>
                <option value="document">Document / PDF</option>
              </select>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition flex items-center gap-1.5"
              >
                {uploading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Select File</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Bulk Action Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search & Category Filter */}
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search media by filename..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
            >
              <option value="all">All Media Types</option>
              <option value="image">Images</option>
              <option value="logo">Logos</option>
              <option value="favicon">Favicons</option>
              <option value="icon">Icons</option>
              <option value="document">Documents</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {selectedIds.length} item{selectedIds.length > 1 ? "s" : ""} selected
            </span>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Selected</span>
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-xs font-medium transition"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Media Grid / Table View */}
      {loading ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
          <RefreshCw className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Loading media library...</p>
        </div>
      ) : mediaList.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <FolderOpen className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">No media items found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {searchQuery || selectedCategory !== "all"
              ? "Try adjusting your search filters or category."
              : "Upload images, icons, or logos above to start building your media assets library."}
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {mediaList.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            const isImage = item.mimeType.startsWith("image/");

            return (
              <div
                key={item.id}
                className={`group relative bg-white dark:bg-slate-900 border rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col ${
                  isSelected
                    ? "border-indigo-500 ring-2 ring-indigo-500/20"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                {/* Selection Checkbox */}
                <div className="absolute top-2 left-2 z-10">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedIds((prev) => [...prev, item.id]);
                      } else {
                        setSelectedIds((prev) => prev.filter((id) => id !== item.id));
                      }
                    }}
                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer shadow-xs"
                  />
                </div>

                {/* Preview Thumbnail */}
                <div
                  onClick={() => setSelectedItem(item)}
                  className="aspect-square bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-2 cursor-pointer relative overflow-hidden group-hover:opacity-90 transition"
                >
                  {isImage ? (
                    <img
                      src={item.url}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-center p-2">
                      <FileText className="w-10 h-10 text-slate-400 mx-auto mb-1" />
                      <span className="text-[10px] uppercase font-bold text-slate-500">{item.mimeType.split("/")[1] || "DOC"}</span>
                    </div>
                  )}

                  {/* Overlay Quick Actions */}
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItem(item);
                      }}
                      className="p-1.5 bg-white/20 hover:bg-white text-white hover:text-slate-900 rounded-lg backdrop-blur-xs transition"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyUrl(item);
                      }}
                      className="p-1.5 bg-white/20 hover:bg-white text-white hover:text-slate-900 rounded-lg backdrop-blur-xs transition"
                      title="Copy URL"
                    >
                      {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Info Bar */}
                <div className="p-2.5 border-t border-slate-100 dark:border-slate-800/80 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate" title={item.name}>
                      {item.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{formatBytes(item.sizeBytes)}</p>
                  </div>

                  {onSelectMedia && (
                    <button
                      onClick={() => onSelectMedia(item.url)}
                      className="mt-2 w-full py-1 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded text-[11px] font-semibold transition"
                    >
                      Select
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="p-3.5 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === mediaList.length && mediaList.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedIds(mediaList.map((m) => m.id));
                      else setSelectedIds([]);
                    }}
                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                </th>
                <th className="p-3.5 w-16">Preview</th>
                <th className="p-3.5">File Name</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Size</th>
                <th className="p-3.5">Uploaded</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {mediaList.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                const isImage = item.mimeType.startsWith("image/");

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition ${
                      isSelected ? "bg-indigo-50/30 dark:bg-indigo-950/20" : ""
                    }`}
                  >
                    <td className="p-3.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedIds((prev) => [...prev, item.id]);
                          else setSelectedIds((prev) => prev.filter((id) => id !== item.id));
                        }}
                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                    </td>
                    <td className="p-3.5">
                      <div
                        onClick={() => setSelectedItem(item)}
                        className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden cursor-pointer"
                      >
                        {isImage ? (
                          <img src={item.url} alt={item.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        ) : (
                          <FileText className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{item.name}</div>
                      <div className="text-[11px] text-slate-400">{item.originalName}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-[10px] font-medium uppercase">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-500">{formatBytes(item.sizeBytes)}</td>
                    <td className="p-3.5 text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {onSelectMedia && (
                          <button
                            onClick={() => onSelectMedia(item.url)}
                            className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded text-xs font-semibold transition"
                          >
                            Use
                          </button>
                        )}
                        <button
                          onClick={() => handleCopyUrl(item)}
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg transition"
                          title="Copy Link"
                        >
                          {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg transition"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.name)}
                          className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 rounded-lg transition"
                          title="Delete File"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Details & Preview Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Media Details
              </h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg"
              >
                &times;
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Media Preview Window */}
              <div className="max-h-64 bg-slate-950/80 rounded-xl p-4 flex items-center justify-center overflow-hidden border border-slate-800">
                {selectedItem.mimeType.startsWith("image/") ? (
                  <img
                    src={selectedItem.url}
                    alt={selectedItem.name}
                    referrerPolicy="no-referrer"
                    className="max-h-56 object-contain rounded"
                  />
                ) : (
                  <div className="text-center p-6 text-slate-400">
                    <FileText className="w-16 h-16 mx-auto mb-2 text-indigo-400" />
                    <p className="text-sm font-semibold text-slate-200">{selectedItem.originalName}</p>
                    <p className="text-xs text-slate-500">{selectedItem.mimeType}</p>
                  </div>
                )}
              </div>

              {/* Metadata Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-slate-400 uppercase font-semibold text-[10px]">File Name</label>
                  <p className="font-semibold text-slate-900 dark:text-white mt-0.5">{selectedItem.name}</p>
                </div>
                <div>
                  <label className="text-slate-400 uppercase font-semibold text-[10px]">Original Name</label>
                  <p className="text-slate-700 dark:text-slate-300 mt-0.5">{selectedItem.originalName}</p>
                </div>
                <div>
                  <label className="text-slate-400 uppercase font-semibold text-[10px]">File Size</label>
                  <p className="text-slate-700 dark:text-slate-300 mt-0.5">{formatBytes(selectedItem.sizeBytes)}</p>
                </div>
                <div>
                  <label className="text-slate-400 uppercase font-semibold text-[10px]">Category / MIME</label>
                  <p className="text-slate-700 dark:text-slate-300 mt-0.5">
                    {selectedItem.category.toUpperCase()} • {selectedItem.mimeType}
                  </p>
                </div>
                <div>
                  <label className="text-slate-400 uppercase font-semibold text-[10px]">Uploaded At</label>
                  <p className="text-slate-700 dark:text-slate-300 mt-0.5">{new Date(selectedItem.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-slate-400 uppercase font-semibold text-[10px]">Uploaded By</label>
                  <p className="text-slate-700 dark:text-slate-300 mt-0.5">{selectedItem.uploadedBy || "System"}</p>
                </div>
              </div>

              {/* URL Field with Copy Button */}
              <div>
                <label className="text-slate-400 uppercase font-semibold text-[10px] block mb-1">Direct URL / Data Path</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={selectedItem.url}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-600 dark:text-slate-300 truncate focus:outline-none"
                  />
                  <button
                    onClick={() => handleCopyUrl(selectedItem)}
                    className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shrink-0"
                  >
                    {copiedId === selectedItem.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedId === selectedItem.id ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
              <button
                onClick={() => handleDelete(selectedItem.id, selectedItem.name)}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Permanently</span>
              </button>

              <div className="flex items-center gap-2">
                {onSelectMedia && (
                  <button
                    onClick={() => {
                      onSelectMedia(selectedItem.url);
                      setSelectedItem(null);
                    }}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition"
                  >
                    Use This Image
                  </button>
                )}
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
