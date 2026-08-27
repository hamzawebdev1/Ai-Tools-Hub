import React, { useState } from "react";
import {
  Lock,
  Mail,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Breadcrumb } from "../components/layout/Breadcrumb";
import { SchemaHead } from "../components/layout/SchemaHead";

interface LoginPageProps {
  onNavigate: (tab: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { loginWithEmail, loginWithGoogle, rememberMe, setRememberMe } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await loginWithEmail(email, password, rememberMe);
      setSuccessMsg("Signed in successfully! Redirecting...");
      setTimeout(() => onNavigate("profile"), 1000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to log in.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await loginWithGoogle();
      setSuccessMsg("Google Authentication successful! Redirecting...");
      setTimeout(() => onNavigate("profile"), 1000);
    } catch (err: any) {
      setErrorMsg(err.message || "Google Sign-In failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SchemaHead
        title="Sign In - Mehzan Tools Hub"
        description="Access your saved favorite tools, activity history, and custom settings with Firebase Authentication."
      />

      <div className="max-w-md mx-auto space-y-8 pb-16 pt-4">
        <Breadcrumb items={[{ label: "Sign In", active: true }]} />

        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-2xl p-6 sm:p-8 space-y-6 backdrop-blur-xl">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3.5 rounded-2xl bg-indigo-500/10 text-indigo-500">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Welcome Back
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Log in securely to sync your favorites and activity across devices
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
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => onNavigate("forgot-password")}
                  className="text-[11px] font-semibold text-indigo-500 hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rememberPage"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <label htmlFor="rememberPage" className="text-xs font-medium text-slate-600 dark:text-slate-400 cursor-pointer">
                Remember login session
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              <span>Log In</span>
            </button>

            <div className="relative flex items-center justify-center my-4">
              <span className="bg-white dark:bg-slate-900 px-3 text-[10px] text-slate-400 uppercase font-bold z-10">
                Or Continue With
              </span>
              <div className="absolute w-full border-t border-slate-200 dark:border-slate-800" />
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Sign in with Google</span>
            </button>
          </form>

          <p className="text-center text-xs text-slate-500">
            Don't have an account?{" "}
            <button
              onClick={() => onNavigate("register")}
              className="font-bold text-indigo-500 hover:underline cursor-pointer"
            >
              Create an Account
            </button>
          </p>
        </div>
      </div>
    </>
  );
};
