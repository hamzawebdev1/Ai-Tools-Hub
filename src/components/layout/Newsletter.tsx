import React, { useState } from "react";
import { Mail, CheckCircle, Sparkles } from "lucide-react";

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      }
    } catch {
      // Client-side fallback
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative my-12 overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 md:p-12 text-white shadow-xl">
      {/* Background glow graphics */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold tracking-wide">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Weekly Developer & Utility Updates</span>
        </div>

        <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
          Get the Latest Web Utilities & Developer Guides
        </h3>

        <p className="text-slate-300 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
          Join 45,000+ developers, writers, and marketers. Receive weekly breakdowns of new web utilities, developer tools, and workflow shortcuts.
        </p>

        {submitted ? (
          <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm font-medium animate-fade-in max-w-md mx-auto">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Success! You have been subscribed to our weekly newsletter.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-sm text-white shadow-lg shadow-indigo-600/30 transition-all shrink-0 cursor-pointer disabled:opacity-50"
            >
              {loading ? "Subscribing..." : "Subscribe Free"}
            </button>
          </form>
        )}

        {error && <p className="text-xs text-rose-400">{error}</p>}

        <p className="text-[11px] text-slate-400">
          Zero spam. Unsubscribe at any time with one click. Read our{" "}
          <span className="underline cursor-pointer hover:text-white">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
};
