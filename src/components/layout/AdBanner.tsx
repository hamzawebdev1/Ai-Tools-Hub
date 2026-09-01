import React from "react";

interface AdBannerProps {
  placement: "header" | "sidebar" | "in-content" | "footer";
  className?: string;
  slotId?: string;
}

const LOW_VALUE_SYSTEM_PATHS = [
  "/login",
  "/register",
  "/admin",
  "/dashboard",
  "/pricing",
  "/history",
  "/favorites",
  "/forgot-password",
  "/404",
  "/search",
];

export const AdBanner: React.FC<AdBannerProps> = ({
  placement,
  className = "",
  slotId = "default-ad-slot",
}) => {
  // Prevent rendering ads on low-value system, private, or auth pages
  if (typeof window !== "undefined") {
    const currentPath = window.location.pathname.toLowerCase();
    const isExcluded = LOW_VALUE_SYSTEM_PATHS.some(
      (path) => currentPath === path || currentPath.startsWith(`${path}/`)
    );
    if (isExcluded) {
      return null;
    }
  }

  const getDimensions = () => {
    switch (placement) {
      case "header":
        return "h-20 max-w-4xl w-full mx-auto";
      case "sidebar":
        return "h-64 md:h-96 w-full";
      case "in-content":
        return "h-28 w-full max-w-3xl mx-auto my-6";
      case "footer":
        return "h-24 w-full max-w-5xl mx-auto my-8";
      default:
        return "h-28 w-full";
    }
  };

  return (
    <div className={`ad-wrapper my-4 px-2 ${className}`}>
      <div className="flex items-center justify-between text-[10px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase mb-1">
        <span>Advertisement</span>
        <span>AdSense Placement Zone</span>
      </div>
      <div
        id={slotId}
        className={`relative overflow-hidden rounded-xl border border-slate-200/80 dark:border-slate-800 bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 dark:from-slate-900/60 dark:via-slate-900/90 dark:to-slate-900/60 flex flex-col items-center justify-center text-center p-4 shadow-xs ${getDimensions()}`}
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Google AdSense Banner Slot
          </span>
        </div>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-md hidden sm:block">
          Optimized for maximum viewability & CTR adherence without disrupting user experience.
        </p>

        {/* Real AdSense Script Placeholder */}
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-0000000000000000"
          data-ad-slot="1234567890"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
};

