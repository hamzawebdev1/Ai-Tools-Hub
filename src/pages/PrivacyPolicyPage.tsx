import React from "react";
import { Shield, Lock, FileText, CheckCircle } from "lucide-react";
import { Breadcrumb } from "../components/layout/Breadcrumb";
import { SchemaHead } from "../components/layout/SchemaHead";

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <>
      <SchemaHead
        title="Privacy Policy - Mehzan Digital Tools Hub Data Protection & AdSense Compliance"
        description="Read our GDPR and CCPA compliant Privacy Policy. Learn how we handle transient AI prompt data, local memory storage, and AdSense cookies."
      />

      <div className="max-w-4xl mx-auto space-y-6 pb-16 text-slate-800 dark:text-slate-200">
        <Breadcrumb items={[{ label: "Privacy Policy", active: true }]} />

        <div className="pb-4 border-b border-slate-200 dark:border-slate-800 space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="w-8 h-8 text-emerald-500" />
            Privacy Policy & Cookie Disclosure
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Last updated: August 2026 | Compliant with Google AdSense Policies, GDPR, & CCPA
          </p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Overview & Data Philosophy</h2>
            <p className="text-slate-600 dark:text-slate-300">
              Mehzan Digital Tools Hub ("we", "our", or "us") is committed to protecting your privacy while delivering lightning-fast, web-native online utilities. This Privacy Policy details how information is collected, used, processed, and safeguarded when you visit or interact with our suite of free online tools.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Data Processing & Privacy</h2>
            <p className="text-slate-600 dark:text-slate-300">
              When you submit text, code, files, or parameters to our tools, processing occurs locally in your browser or is transmitted securely over TLS/SSL encryption to isolated server-side endpoints.
            </p>
            <ul className="list-disc pl-5 text-slate-600 dark:text-slate-300 space-y-1">
              <li><strong>Zero Permanent Storage:</strong> Your inputs and uploaded files are never sold or logged permanently.</li>
              <li><strong>Transient Execution:</strong> Uploaded files and processing outputs are held strictly in memory for execution and automatically deleted.</li>
              <li><strong>Local Memory Storage:</strong> Tool usage history and preferences are saved locally on your device via browser LocalStorage and cleared whenever you click "Clear History".</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Google AdSense & Third-Party Advertising Cookies</h2>
            <p className="text-slate-600 dark:text-slate-300">
              We serve non-intrusive advertisements provided by Google AdSense to keep our online tools 100% free for all users. In accordance with Google Advertising Policies:
            </p>
            <ul className="list-disc pl-5 text-slate-600 dark:text-slate-300 space-y-1">
              <li>Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to our website or other websites.</li>
              <li>Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet.</li>
              <li>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-indigo-500 font-semibold hover:underline">Google Ad Settings</a> or <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-indigo-500 font-semibold hover:underline">www.aboutads.info</a>.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. GDPR Rights for European Union Visitors</h2>
            <p className="text-slate-600 dark:text-slate-300">
              Under the General Data Protection Regulation (GDPR), users residing in the European Economic Area (EEA) have the right to:
            </p>
            <ul className="list-disc pl-5 text-slate-600 dark:text-slate-300 space-y-1">
              <li>Request access to or copies of any personal data held about you.</li>
              <li>Request rectification of inaccurate personal information.</li>
              <li>Request complete erasure ("Right to be Forgotten") of temporary session records.</li>
              <li>Manage cookie consent choices anytime via our interactive Cookie Consent banner.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">5. CCPA/CPRA Privacy Rights for California Residents</h2>
            <p className="text-slate-600 dark:text-slate-300">
              Under the California Consumer Privacy Act (CCPA), California residents have specific rights regarding personal information:
            </p>
            <ul className="list-disc pl-5 text-slate-600 dark:text-slate-300 space-y-1">
              <li><strong>Do Not Sell My Personal Information:</strong> Mehzan Digital Tools Hub NEVER sells, rents, or trades user personal data to third parties.</li>
              <li><strong>Right to Know & Delete:</strong> You can request disclosure or deletion of any stored metadata by contacting our privacy compliance desk.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">6. Security & OWASP Top 10 Protections</h2>
            <p className="text-slate-600 dark:text-slate-300">
              We employ military-grade AES-256 encryption, HTTP-only cookie security, automated CSRF double-submit protection, and aggressive rate limiting to prevent unauthorized access or automated scraping abuse.
            </p>
          </section>

          <section className="space-y-2 border-t border-slate-200 dark:border-slate-800 pt-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">7. Contact Our Privacy Officer</h2>
            <p className="text-slate-600 dark:text-slate-300">
              If you have any questions or concerns regarding this Privacy Policy, please submit an inquiry on our <span className="font-semibold text-indigo-500">Contact Page</span> or email our legal team at <span className="font-mono text-indigo-500">privacy@utilitytoolshub.com</span>.
            </p>
          </section>
        </div>
      </div>
    </>
  );
};
