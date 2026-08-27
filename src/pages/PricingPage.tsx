import React from "react";
import { Check, Zap, ShieldCheck, Sparkles } from "lucide-react";
import { Breadcrumb } from "../components/layout/Breadcrumb";
import { SchemaHead } from "../components/layout/SchemaHead";

interface PricingPageProps {
  setActiveTab: (tab: string) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ setActiveTab }) => {
  return (
    <>
      <SchemaHead
        title="Simple, Transparent Pricing - Mehzan Tools Hub"
        description="Mehzan Tools Hub is 100% free with unlimited daily usage supported by Google AdSense."
      />

      <div className="max-w-4xl mx-auto space-y-10 pb-16">
        <Breadcrumb items={[{ label: "Pricing", active: true }]} />

        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
            <Sparkles className="w-4 h-4" />
            <span>100% Free Forever</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
            Zero Cost Web & Developer Tools for Everyone
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            All 30+ tools in our catalog are provided at zero cost with no credit card requirement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free Tier */}
          <div className="rounded-3xl border-2 border-indigo-500 bg-white dark:bg-slate-900 p-8 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl bg-indigo-600 text-white text-[10px] font-extrabold uppercase tracking-wider">
              Current Plan
            </div>

            <div>
              <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">Community Free</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Full access to 50+ developer & media tools</p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-slate-900 dark:text-white">$0</span>
              <span className="text-xs text-slate-400">/ forever</span>
            </div>

            <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>50+ Fast Online Web Utilities</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Sub-100ms Browser Processing</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>100% Private Client-Side Privacy</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Zero Credit Card Required</span>
              </li>
            </ul>

            <button
              onClick={() => setActiveTab("all-tools")}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md cursor-pointer"
            >
              Start Using Tools Now
            </button>
          </div>

          {/* Enterprise / API Tier */}
          <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-8 space-y-6 opacity-90">
            <div>
              <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">Enterprise API (Coming Soon)</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Dedicated endpoints for team integration</p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-slate-900 dark:text-white">Custom</span>
            </div>

            <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>Dedicated REST API Endpoints</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>Custom Brand Output Style</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>High SLA Rate Limits</span>
              </li>
            </ul>

            <button
              onClick={() => setActiveTab("contact")}
              className="w-full py-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs cursor-pointer"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
