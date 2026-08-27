import React from "react";
import { Sparkles, ShieldCheck, Zap, Globe, Cpu, Users } from "lucide-react";
import { Breadcrumb } from "../components/layout/Breadcrumb";
import { SchemaHead } from "../components/layout/SchemaHead";

interface AboutPageProps {
  setActiveTab: (tab: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ setActiveTab }) => {
  return (
    <>
      <SchemaHead
        title="About Mehzan Tools Hub - Free Web-Native Developer Suite"
        description="Learn about our mission to provide lightning-fast, privacy-respecting, free AI tools for developers, creators, and marketers."
      />

      <div className="max-w-4xl mx-auto space-y-10 pb-16">
        <Breadcrumb items={[{ label: "About Us", active: true }]} />

        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
            <Sparkles className="w-4 h-4" />
            <span>Democratizing Artificial Intelligence</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
            Built for Speed, Privacy, and Organic Excellence
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Mehzan Tools Hub was founded with a singular purpose: to deliver production-ready, zero-friction online browser utility tools accessible to everyone without paywalls or invasive tracking.
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 space-y-3 shadow-xs">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 w-fit">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Sub-100ms Performance</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Powered by high-performance browser engines and Cloud Run edge containers to deliver instant processing.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 space-y-3 shadow-xs">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 w-fit">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Zero Data Storage</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Your files and inputs process locally or transiently in RAM. We never store, sell, or log your personal data.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 space-y-3 shadow-xs">
            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 w-fit">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Global SEO Quality</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Built following strict Google Webmaster and AdSense policies with complete JSON-LD Schema markup for rich indexing.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-8 space-y-4 text-center">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Have Questions or Suggestions?</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            We actively update our AI tools catalog based on community feedback.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab("suggest-tool")}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md cursor-pointer"
            >
              Suggest a Tool
            </button>
            <button
              onClick={() => setActiveTab("contact")}
              className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
            >
              Contact Team
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
