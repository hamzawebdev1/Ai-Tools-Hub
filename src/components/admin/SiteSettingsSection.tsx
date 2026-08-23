import React, { useState, useEffect } from "react";
import {
  Settings,
  Shield,
  Save,
  Globe,
  DollarSign,
  AlertTriangle,
  Download,
  Upload,
  RefreshCw,
  FileCode,
  CheckCircle2,
  Lock,
  Share2,
  Terminal,
  Radio,
} from "lucide-react";
import { CMSSiteSettings } from "../../server/admin/cmsStore";

interface SiteSettingsSectionProps {
  onShowNotification: (msg: string) => void;
}

export const SiteSettingsSection: React.FC<SiteSettingsSectionProps> = ({
  onShowNotification,
}) => {
  const [settings, setSettings] = useState<CMSSiteSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Sub Tab
  const [activeSubTab, setActiveSubTab] = useState<"general" | "seo_robots" | "ads" | "backup">("general");

  // Sitemap & Index Ping
  const [sitemapXml, setSitemapXml] = useState("");
  const [sitemapCount, setSitemapCount] = useState(0);
  const [pingUrl, setPingUrl] = useState("");
  const [pingResult, setPingResult] = useState<string | null>(null);

  // SEO & GSC Canonical Audit State
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<any>(null);

  const handleRunAudit = async () => {
    setAuditLoading(true);
    try {
      const res = await fetch("/api/admin/seo-audit");
      const data = await res.json();
      setAuditResult(data);
      onShowNotification("SEO & Canonical URL Audit completed successfully!");
    } catch (err) {
      console.error("Audit error:", err);
      onShowNotification("Failed to execute live SEO audit.");
    } finally {
      setAuditLoading(false);
    }
  };

  // Backup restore file state
  const [backupFileContent, setBackupFileContent] = useState<string | null>(null);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        onShowNotification("Site settings saved and applied sitewide.");
        setSettings(data.settings);
      } else {
        onShowNotification(data.error || "Failed to save settings.");
      }
    } catch {
      onShowNotification("Error saving settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleFetchSitemap = async () => {
    try {
      const res = await fetch("/api/admin/sitemap-generate");
      const data = await res.json();
      if (data.success) {
        setSitemapXml(data.xml);
        setSitemapCount(data.count);
        onShowNotification(`Dynamic XML sitemap generated with ${data.count} canonical URLs.`);
      }
    } catch {
      onShowNotification("Failed to generate sitemap.");
    }
  };

  const handlePingGoogle = async () => {
    try {
      const res = await fetch("/api/admin/google-index-ping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: pingUrl }),
      });
      const data = await res.json();
      if (data.success) {
        setPingResult(data.message);
        onShowNotification(data.message);
      }
    } catch {
      onShowNotification("Failed to ping indexing API.");
    }
  };

  const handleBackupUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        setBackupFileContent(text);
        onShowNotification(`Backup file loaded: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
      } catch {
        onShowNotification("Invalid backup file.");
      }
    };
    reader.readAsText(file);
  };

  const handleRestoreBackup = async () => {
    if (!backupFileContent) {
      onShowNotification("Please choose a valid JSON backup file first.");
      return;
    }
    try {
      const parsed = JSON.parse(backupFileContent);
      const res = await fetch("/api/admin/backup-restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ backupData: parsed }),
      });
      const data = await res.json();
      if (data.success) {
        onShowNotification("System database restored successfully from backup.");
        fetchSettings();
      } else {
        onShowNotification(data.error || "Failed to restore backup.");
      }
    } catch {
      onShowNotification("Malformed JSON backup data.");
    }
  };

  if (!settings) {
    return (
      <div className="p-12 text-center text-slate-500">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-500" />
        Loading site settings...
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-500" /> Sitewide Settings & Maintenance Control
          </h2>
          <p className="text-xs text-slate-500">
            Configure metadata, maintenance mode, robots.txt, dynamic sitemaps, ads, and system backups.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveSettings}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving..." : "Save All Settings"}</span>
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveSubTab("general")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "general"
              ? "bg-indigo-600 text-white shadow-md"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          General & Brand
        </button>
        <button
          onClick={() => setActiveSubTab("seo_robots")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "seo_robots"
              ? "bg-indigo-600 text-white shadow-md"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          SEO, Robots & Sitemaps
        </button>
        <button
          onClick={() => setActiveSubTab("ads")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "ads"
              ? "bg-indigo-600 text-white shadow-md"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          Monetization & Ads
        </button>
        <button
          onClick={() => setActiveSubTab("backup")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "backup"
              ? "bg-indigo-600 text-white shadow-md"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          Backup & Disaster Recovery
        </button>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {activeSubTab === "general" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* General Information Card */}
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl space-y-4 text-xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-500" /> Platform Brand & Contact
              </h3>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Site Name
                </label>
                <input
                  type="text"
                  value={settings.siteName || ""}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Tagline / Header Description
                </label>
                <input
                  type="text"
                  value={settings.tagline || ""}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Primary Contact / Support Email
                </label>
                <input
                  type="email"
                  value={settings.contactEmail || ""}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Logo URL
                </label>
                <input
                  type="text"
                  value={settings.logoUrl || ""}
                  onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono"
                />
              </div>
            </div>

            {/* Maintenance Mode & Announcement Card */}
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl space-y-4 text-xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> Maintenance & Announcement Bar
              </h3>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">Maintenance Mode</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!settings.maintenanceMode}
                      onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>
                <input
                  type="text"
                  value={settings.maintenanceMessage || ""}
                  onChange={(e) => setSettings({ ...settings, maintenanceMessage: e.target.value })}
                  placeholder="Custom message shown to visitors during maintenance..."
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
                />
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">Announcement Top Bar</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!settings.announcementBarActive}
                      onChange={(e) => setSettings({ ...settings, announcementBarActive: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                <input
                  type="text"
                  value={settings.announcementBarText || ""}
                  onChange={(e) => setSettings({ ...settings, announcementBarText: e.target.value })}
                  placeholder="e.g. 🚀 Pro Web Tools v2.0 released with 10x faster execution!"
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {activeSubTab === "seo_robots" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Default SEO Metas */}
              <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl space-y-4 text-xs">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-indigo-500" /> Default Search Engine Meta
                </h3>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Default Meta Title
                  </label>
                  <input
                    type="text"
                    value={settings.defaultSeoTitle || ""}
                    onChange={(e) => setSettings({ ...settings, defaultSeoTitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Default Meta Description
                  </label>
                  <textarea
                    rows={3}
                    value={settings.defaultSeoDescription || ""}
                    onChange={(e) => setSettings({ ...settings, defaultSeoDescription: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                  />
                </div>
              </div>

              {/* Robots.txt editor */}
              <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl space-y-4 text-xs">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-indigo-500" /> Live Robots.txt Configuration
                </h3>
                <textarea
                  rows={6}
                  value={settings.robotsTxt || ""}
                  onChange={(e) => setSettings({ ...settings, robotsTxt: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs"
                />
              </div>
            </div>

            {/* Sitemap & IndexNow/Google Indexing Section */}
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl space-y-4 text-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Radio className="w-4 h-4 text-indigo-500" /> Dynamic XML Sitemaps & Search Engine Indexing
                  </h3>
                  <p className="text-xs text-slate-400">
                    Real-time generation reflecting all active tools, categories, and published blog posts.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleFetchSitemap}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-pointer"
                >
                  Generate Live Sitemap
                </button>
              </div>

              {sitemapXml && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                    <span>Generated XML Preview ({sitemapCount} URLs)</span>
                    <a href="/sitemap.xml" target="_blank" className="text-indigo-600 hover:underline">
                      Open /sitemap.xml &rarr;
                    </a>
                  </div>
                  <pre className="p-4 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-[11px] max-h-48 overflow-y-auto border border-slate-800">
                    {sitemapXml}
                  </pre>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="url"
                  value={pingUrl}
                  onChange={(e) => setPingUrl(e.target.value)}
                  placeholder="https://utilitytoolshub.com/sitemap.xml"
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono"
                />
                <button
                  type="button"
                  onClick={handlePingGoogle}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer whitespace-nowrap"
                >
                  Ping Google & IndexNow
                </button>
              </div>
            </div>

            {/* Live GSC Indexing & Canonical Audit Inspector */}
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl space-y-4 text-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-500" /> Google Search Console & Canonical URL Audit Engine
                  </h3>
                  <p className="text-xs text-slate-400">
                    Crawl and verify all canonical tags, eliminate trailing slash duplicates, legacy prefixes, and ensure 100% GSC compliance.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleRunAudit}
                  disabled={auditLoading}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold cursor-pointer flex items-center gap-2"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${auditLoading ? "animate-spin" : ""}`} />
                  {auditLoading ? "Auditing URLs..." : "Run URL Audit"}
                </button>
              </div>

              {auditResult && (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                      <span className="text-slate-400 block text-[11px]">Health Score</span>
                      <span className="text-lg font-bold text-emerald-500">{auditResult.summary.healthScore}%</span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                      <span className="text-slate-400 block text-[11px]">Canonical URLs</span>
                      <span className="text-lg font-bold text-indigo-500">{auditResult.summary.canonicalPagesCount}</span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                      <span className="text-slate-400 block text-[11px]">Sitemap URLs</span>
                      <span className="text-lg font-bold text-blue-500">{auditResult.summary.sitemapEntriesCount}</span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                      <span className="text-slate-400 block text-[11px]">301 Redirects Protected</span>
                      <span className="text-lg font-bold text-teal-500">{auditResult.summary.redirectsProtectedCount}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">GSC Issues Fixed & Protected:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {auditResult.summary.gscIssuesResolved.map((issue: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>{issue}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeSubTab === "ads" && (
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl space-y-4 text-xs max-w-2xl">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-indigo-500" /> Monetization & Analytics
            </h3>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Google Analytics Measurement ID
              </label>
              <input
                type="text"
                value={settings.analyticsId || ""}
                onChange={(e) => setSettings({ ...settings, analyticsId: e.target.value })}
                placeholder="G-XXXXXXXXXX"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Google AdSense Publisher ID
              </label>
              <input
                type="text"
                value={settings.adSensePublisherId || ""}
                onChange={(e) => setSettings({ ...settings, adSensePublisherId: e.target.value })}
                placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={!!settings.adSenseEnabled}
                onChange={(e) => setSettings({ ...settings, adSenseEnabled: e.target.checked })}
                className="rounded border-slate-300 text-indigo-600 w-4 h-4"
              />
              <span className="font-bold text-slate-700 dark:text-slate-300">
                Enable Ad Placements on Tools & Blog Posts
              </span>
            </label>
          </div>
        )}

        {activeSubTab === "backup" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Backup Export */}
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl space-y-4 text-xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Download className="w-4 h-4 text-indigo-500" /> Export System Database Backup
              </h3>
              <p className="text-slate-500">
                Downloads complete JSON configuration containing all tools, categories, blog posts, subscribers, and site settings.
              </p>
              <a
                href="/api/admin/backup-export"
                download
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Database JSON</span>
              </a>
            </div>

            {/* Backup Restore */}
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl space-y-4 text-xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-rose-500" /> Restore System Database
              </h3>
              <p className="text-slate-500">
                Upload a verified backup JSON file to restore the platform state.
              </p>
              <input
                type="file"
                accept=".json"
                onChange={handleBackupUpload}
                className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
              />
              <button
                type="button"
                onClick={handleRestoreBackup}
                disabled={!backupFileContent}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-md cursor-pointer disabled:opacity-40"
              >
                Restore Database
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
