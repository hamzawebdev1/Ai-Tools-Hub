import React from "react";
import { AlertTriangle, ShieldCheck, CheckCircle } from "lucide-react";
import { Breadcrumb } from "../components/layout/Breadcrumb";
import { SchemaHead } from "../components/layout/SchemaHead";

export const DisclaimerPage: React.FC = () => {
  return (
    <>
      <SchemaHead
        title="Utility Content & Advertising Disclaimer - Utility Tools Hub"
        description="Important notice regarding online utility tools output accuracy, AdSense advertising, and user verification requirements."
      />

      <div className="max-w-4xl mx-auto space-y-6 pb-16 text-slate-800 dark:text-slate-200">
        <Breadcrumb items={[{ label: "Disclaimer & Advertising Disclosure", active: true }]} />

        <div className="pb-4 border-b border-slate-200 dark:border-slate-800 space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-8 h-8 text-amber-500" />
            Utility Content & Advertising Disclaimer
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Official Accuracy Notice & Advertising Disclosure | Updated August 2026
          </p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Nature of Utility Tool Output</h2>
            <p className="text-slate-600 dark:text-slate-300">
              Outputs generated across Utility Tools Hub are produced by deterministic algorithms, local browser parsers, and secure client-side calculation engines. While our tools are optimized for high precision and adherence to standard data protocols, users should always verify critical generated code, conversions, and files prior to production use.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. No Professional Advice (Legal, Medical, Financial)</h2>
            <p className="text-slate-600 dark:text-slate-300">
              The content and calculators provided by our utility tools and blog articles are strictly for informational, educational, and productivity enhancement purposes. Nothing on this website constitutes certified legal, financial, accounting, or medical advice.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Third-Party Advertising & Google AdSense Disclosure</h2>
            <p className="text-slate-600 dark:text-slate-300">
              Utility Tools Hub participates in Google AdSense and third-party advertising networks to support website maintenance and infrastructure costs. Advertisements served on this platform are distinctly marked with "Advertisement" or "AdSense Placement Zone" labels.
            </p>
            <ul className="list-disc pl-5 text-slate-600 dark:text-slate-300 space-y-1">
              <li>Ad placements are designed to never interfere with user navigation, tool operation, or content readability.</li>
              <li>Inclusion of an advertisement on Utility Tools Hub does not constitute an endorsement or warranty of the advertised product or service.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. User Responsibility & Code Audit</h2>
            <p className="text-slate-600 dark:text-slate-300">
              Users are solely responsible for reviewing and testing any code snippets, minified scripts, SQL queries, or converted files prior to deploying them to live or production environments.
            </p>
          </section>
        </div>
      </div>
    </>
  );
};
