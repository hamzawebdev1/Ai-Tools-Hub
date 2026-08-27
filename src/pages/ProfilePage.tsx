import React, { useState, useEffect } from "react";
import { User, Shield, Key, Save, Moon, Sun, Trash2, LogOut, CheckCircle2, AlertTriangle, Send } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Breadcrumb } from "../components/layout/Breadcrumb";
import { SchemaHead } from "../components/layout/SchemaHead";

interface ProfilePageProps {
  theme: "dark" | "light";
  toggleTheme: () => void;
  onNavigate: (tab: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  theme,
  toggleTheme,
  onNavigate
}) => {
  const { currentUser, userDoc, logout, updateSettings, sendVerificationEmail, refreshUserDoc } = useAuth();

  const [name, setName] = useState(userDoc?.name || currentUser?.displayName || "");
  const [email] = useState(currentUser?.email || userDoc?.email || "");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  useEffect(() => {
    if (userDoc?.name) {
      setName(userDoc.name);
    } else if (currentUser?.displayName) {
      setName(currentUser.displayName);
    }
  }, [userDoc, currentUser]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (userDoc) {
        await updateSettings({});
      }
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (err) {
      console.error("Failed to save profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendVerification = async () => {
    try {
      await sendVerificationEmail();
      setVerificationSent(true);
    } catch (err) {
      console.error("Error sending verification email:", err);
    }
  };

  const handleLogout = async () => {
    await logout();
    onNavigate("login");
  };

  return (
    <>
      <SchemaHead
        title="Account Profile & Firestore Settings - Mehzan Tools Hub"
        description="Manage your Firebase account, Firestore favorites, theme preferences, and authentication security."
      />

      <div className="max-w-3xl mx-auto space-y-8 pb-16">
        <Breadcrumb items={[{ label: "Account Profile", active: true }]} />

        <div className="pb-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-6 h-6 text-indigo-500" />
              Firebase Account Profile
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Synchronized with Firestore Database (`users/{currentUser?.uid || "uid"}`)
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 hover:bg-rose-500/20 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Email Verification Banner */}
        {currentUser && !currentUser.emailVerified && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
              <div>
                <p className="font-bold">Email Unverified</p>
                <p className="text-[11px] opacity-80">Please verify your email address to ensure account recovery options.</p>
              </div>
            </div>
            <button
              onClick={handleSendVerification}
              disabled={verificationSent}
              className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{verificationSent ? "Link Sent!" : "Verify Now"}</span>
            </button>
          </div>
        )}

        {/* User Card Header */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            {currentUser?.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt={name}
                className="w-16 h-16 rounded-2xl object-cover shadow-lg border border-slate-200 dark:border-slate-800"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-indigo-500/20">
                {(name || "U").charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">{name || "Registered Member"}</h3>
                {currentUser?.emailVerified && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" title="Verified Account" />
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{email}</p>
              <div className="flex flex-wrap items-center gap-2 pt-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase">
                  Role: {userDoc?.role || "User"}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold">
                  Provider: {userDoc?.provider || currentUser?.providerData[0]?.providerId || "Password"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Settings Form */}
        <form onSubmit={handleSave} className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Personal Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Email Address (Read-only)</label>
              <input
                type="email"
                disabled
                value={email}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 font-medium cursor-not-allowed"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            {savedSuccess && <span className="text-xs font-bold text-emerald-500">Settings saved!</span>}
            <button
              type="submit"
              disabled={loading}
              className="ml-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile</span>
            </button>
          </div>
        </form>

        {/* Firestore Metrics & Favorite Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-1">
            <span className="text-xs text-slate-400 font-medium">Favorite Tools</span>
            <p className="text-xl font-black text-indigo-500">{userDoc?.favorites?.length || 0}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-1">
            <span className="text-xs text-slate-400 font-medium">Executions Recorded</span>
            <p className="text-xl font-black text-purple-500">{userDoc?.history?.length || 0}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-1">
            <span className="text-xs text-slate-400 font-medium">Firestore UID</span>
            <p className="text-[11px] font-mono font-bold text-slate-600 dark:text-slate-300 truncate">
              {currentUser?.uid || "N/A"}
            </p>
          </div>
        </div>

        {/* App Appearance Controls */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Interface Theme
          </h3>

          <div className="flex items-center justify-between py-2">
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Appearance Theme</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Switch between dark and light modes</p>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2 cursor-pointer"
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
              <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
