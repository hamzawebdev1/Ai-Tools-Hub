import React, { useState } from "react";
import { X, Sparkles, ShieldCheck, Mail, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface GuestLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolName?: string;
  onSelectEmailSignUp?: () => void;
}

export const GuestLimitModal: React.FC<GuestLimitModalProps> = ({
  isOpen,
  onClose,
  toolName,
  onSelectEmailSignUp,
}) => {
  const { loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await loginWithGoogle();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Google Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = () => {
    onClose();
    if (onSelectEmailSignUp) {
      onSelectEmailSignUp();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 sm:p-8 space-y-6 text-center">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Title Header */}
        <div className="space-y-3">
          <div className="inline-flex p-3.5 rounded-2xl bg-gradient-to-tr from-indigo-500/20 via-violet-500/20 to-pink-500/20 text-indigo-500 border border-indigo-500/30 shadow-lg shadow-indigo-500/10">
            <Sparkles className="w-8 h-8 text-indigo-500" />
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Continue For Free
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed px-2">
            Create your free account and unlock unlimited tool usage, save your history, favorites and settings.
          </p>
        </div>

        {/* Feature Highlights List */}
        <div className="grid grid-cols-2 gap-2 text-left bg-slate-50 dark:bg-slate-950/70 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 text-[11px] text-slate-700 dark:text-slate-300 font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Unlimited Tool Usage</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>100% Free Forever</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Cloud Sync History</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Save Favorites</span>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pt-1">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Continue with Google</span>
          </button>

          <button
            onClick={handleEmailSignUp}
            disabled={loading}
            className="w-full py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <Mail className="w-4 h-4 text-indigo-500" />
            <span>Continue with Email</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
          >
            Maybe Later
          </button>
        </div>

        <div className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>No credit card required • No subscriptions • 100% Free</span>
        </div>
      </div>
    </div>
  );
};
