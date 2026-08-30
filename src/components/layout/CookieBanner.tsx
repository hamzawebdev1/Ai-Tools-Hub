import React, { useState, useEffect } from "react";
import { Cookie, X, Check, Settings } from "lucide-react";

export const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(true);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent_accepted");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem("cookie_consent_accepted", "all");
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem(
      "cookie_consent_accepted",
      JSON.stringify({ necessary: true, analytics, marketing })
    );
    setIsVisible(false);
    setShowPreferences(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-md z-50 animate-slide-up">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-5 shadow-2xl text-slate-800 dark:text-slate-100">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Cookie className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold">Cookie Preferences</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">GDPR & Privacy Compliance</p>
            </div>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            aria-label="Close cookie consent banner"
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!showPreferences ? (
          <>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              We use necessary cookies for core functionality, analytics cookies to measure traffic, and AdSense cookies to serve customized ads.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleAcceptAll}
                className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Accept All</span>
              </button>
              <button
                onClick={() => setShowPreferences(true)}
                className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Customize</span>
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-200">Necessary (Always Active)</span>
              <span className="text-[10px] text-slate-400">Required</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="cookie-analytics" className="text-slate-600 dark:text-slate-300 cursor-pointer">Analytics & Performance</label>
              <input
                id="cookie-analytics"
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                className="rounded-sm text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                aria-label="Allow Analytics & Performance Cookies"
              />
            </div>
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="cookie-marketing" className="text-slate-600 dark:text-slate-300 cursor-pointer">AdSense & Personalization</label>
              <input
                id="cookie-marketing"
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
                className="rounded-sm text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                aria-label="Allow AdSense & Personalization Cookies"
              />
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleSavePreferences}
                className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
