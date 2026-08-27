import React from "react";
import { Search, Home, ArrowRight, Sparkles } from "lucide-react";
import { SchemaHead } from "../components/layout/SchemaHead";

interface NotFoundPageProps {
  setActiveTab: (tab: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ setActiveTab }) => {
  return (
    <>
      <SchemaHead
        title="404 Page Not Found - Mehzan Tools Hub"
        description="The page or tool you requested could not be found. Search our catalog of 30+ free AI utilities."
      />

      <div className="py-16 md:py-24 text-center space-y-6 max-w-xl mx-auto">
        <div className="inline-flex p-4 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 font-mono text-4xl font-extrabold">
          404
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Page or Tool Not Found
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          The link you followed may be broken or the tool may have been renamed. Explore our popular tools below or return home.
        </p>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setActiveTab("home")}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </button>

          <button
            onClick={() => setActiveTab("all-tools")}
            className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            Browse All Tools
          </button>
        </div>
      </div>
    </>
  );
};
