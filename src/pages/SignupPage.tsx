import React, { useState } from "react";
import {
  Lock,
  Mail,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Eye,
  EyeOff,
  Sparkles
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Breadcrumb } from "../components/layout/Breadcrumb";
import { SchemaHead } from "../components/layout/SchemaHead";

interface SignupPageProps {
  onNavigate: (tab: string) => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({ onNavigate }) => {
  const { signupWithEmail, loginWithGoogle } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const checkPasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[@$!%*?&]/.test(pwd)) score++;
    return score;
  };

  const passwordScore = checkPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!name.trim()) {
      setErrorMsg("Full Name is required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    if (!acceptTerms) {
      setErrorMsg("You must accept the Terms of Service and Privacy Policy to create an account.");
      return;
    }

    setLoading(true);

    try {
      await signupWithEmail(email, password, name);
      setSuccessMsg("Account created! A verification link has been sent to your email. Redirecting...");
      setTimeout(() => onNavigate("profile"), 2000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (!acceptTerms) {
      setErrorMsg("You must accept the Terms of Service and Privacy Policy to continue.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await loginWithGoogle();
      setSuccessMsg("Google Authentication successful! Redirecting...");
      setTimeout(() => onNavigate("profile"), 1000);
    } catch (err: any) {
      setErrorMsg(err.message || "Google Sign-Up failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SchemaHead
        title="Create Account - Mehzan Tools Hub"
        description="Join Mehzan Tools Hub to save favorites, sync history across devices, and unlock higher rate limits."
      />

      <div className="max-w-md mx-auto space-y-8 pb-16 pt-4">
        <Breadcrumb items={[{ label: "Create Account", active: true }]} />

        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-2xl p-6 sm:p-8 space-y-6 backdrop-blur-xl">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3.5 rounded-2xl bg-indigo-500/10 text-indigo-500">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Create Your Account
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Free account with unlimited access to 50+ client-side productivity tools
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
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address</label>
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

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Password</label>
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

              {password.length > 0 && (
                <div className="space-y-1 pt-1">
                  <div className="flex gap-1 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        passwordScore <= 1
                          ? "w-1/4 bg-rose-500"
                          : passwordScore === 2
                          ? "w-2/4 bg-amber-500"
                          : passwordScore === 3
                          ? "w-3/4 bg-indigo-500"
                          : "w-full bg-emerald-500"
                      }`}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Strength:{" "}
                    {passwordScore <= 1 ? "Weak" : passwordScore === 2 ? "Fair" : passwordScore === 3 ? "Good" : "Strong"}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="flex items-start gap-2.5 pt-1">
              <input
                type="checkbox"
                id="acceptTermsCheckbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <label htmlFor="acceptTermsCheckbox" className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                I accept the{" "}
                <button
                  type="button"
                  onClick={() => onNavigate("terms")}
                  className="font-bold text-indigo-500 hover:underline cursor-pointer"
                >
                  Terms of Service
                </button>{" "}
                and acknowledge the{" "}
                <button
                  type="button"
                  onClick={() => onNavigate("privacy")}
                  className="font-bold text-indigo-500 hover:underline cursor-pointer"
                >
                  Privacy Policy
                </button>
                .
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              <span>Register Account</span>
            </button>

            <div className="relative flex items-center justify-center my-4">
              <span className="bg-white dark:bg-slate-900 px-3 text-[10px] text-slate-400 uppercase font-bold z-10">
                Or Register With
              </span>
              <div className="absolute w-full border-t border-slate-200 dark:border-slate-800" />
            </div>

            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={loading}
              className="w-full py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Sign up with Google</span>
            </button>
          </form>

          <p className="text-center text-xs text-slate-500">
            Already have an account?{" "}
            <button
              onClick={() => onNavigate("login")}
              className="font-bold text-indigo-500 hover:underline cursor-pointer"
            >
              Log In
            </button>
          </p>
        </div>
      </div>
    </>
  );
};
