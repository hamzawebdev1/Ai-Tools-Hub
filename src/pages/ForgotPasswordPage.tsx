import React, { useState } from "react";
import {
  Mail,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Send
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Breadcrumb } from "../components/layout/Breadcrumb";
import { SchemaHead } from "../components/layout/SchemaHead";

interface ForgotPasswordPageProps {
  onNavigate: (tab: string) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate }) => {
  const { sendResetEmail } = useAuth();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await sendResetEmail(email);
      setSuccessMsg(`Password reset link sent to ${email}. Check your inbox or spam folder!`);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to send password reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SchemaHead
        title="Reset Password - Mehzan Tools Hub"
        description="Reset your account password securely via Firebase email verification."
      />

      <div className="max-w-md mx-auto space-y-8 pb-16 pt-4">
        <Breadcrumb items={[{ label: "Reset Password", active: true }]} />

        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-2xl p-6 sm:p-8 space-y-6 backdrop-blur-xl">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3.5 rounded-2xl bg-indigo-500/10 text-indigo-500">
              <KeyRound className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Reset Your Password
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Enter your registered account email to receive a password reset link
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Account Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@company.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Send Password Reset Email</span>
            </button>
          </form>

          <p className="text-center text-xs text-slate-500">
            Remembered your password?{" "}
            <button
              onClick={() => onNavigate("login")}
              className="font-bold text-indigo-500 hover:underline cursor-pointer"
            >
              Back to Sign In
            </button>
          </p>
        </div>
      </div>
    </>
  );
};
