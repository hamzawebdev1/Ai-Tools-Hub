import React from "react";
import { Cookie } from "lucide-react";
import { Breadcrumb } from "../components/layout/Breadcrumb";
import { SchemaHead } from "../components/layout/SchemaHead";

export const CookiePolicyPage: React.FC = () => {
  return (
    <>
      <SchemaHead
        title="Cookie Policy - Mehzan Tools Hub Preference Center"
        description="Detailed information regarding necessary session cookies, performance measurement, and Google AdSense publisher cookies."
      />

      <div className="max-w-4xl mx-auto space-y-6 pb-16 text-slate-800 dark:text-slate-200">
        <Breadcrumb items={[{ label: "Cookie Policy", active: true }]} />

        <div className="pb-4 border-b border-slate-200 dark:border-slate-800 space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Cookie className="w-8 h-8 text-amber-500" />
            Cookie Policy
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            How We Use Cookies and Local Storage
          </p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Necessary Cookies & LocalStorage</h2>
            <p className="text-slate-600 dark:text-slate-300">
              We use client-side local storage (`localStorage`) strictly to preserve your dark/light theme preference, bookmarked favorite tools, and recent execution history logs. This data remains on your device and is never uploaded to external analytics servers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Google AdSense Cookies</h2>
            <p className="text-slate-600 dark:text-slate-300">
              Google, as a third-party vendor, uses cookies to serve ads on our site. Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our site or other sites on the Internet.
            </p>
          </section>
        </div>
      </div>
    </>
  );
};
