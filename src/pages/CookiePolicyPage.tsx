import React from "react";
import { Cookie, ShieldCheck, Sliders, HardDrive, Eye } from "lucide-react";
import { Breadcrumb } from "../components/layout/Breadcrumb";
import { SchemaHead } from "../components/layout/SchemaHead";

export const CookiePolicyPage: React.FC = () => {
  return (
    <>
      <SchemaHead
        title="Cookie Policy - Mehzan Digital Preference & Storage Center"
        description="Detailed Cookie Policy for Mehzan Digital. Learn about essential session cookies, LocalStorage usage, user preferences, and Google AdSense cookie choices."
      />

      <div className="max-w-4xl mx-auto space-y-6 pb-16 text-slate-800 dark:text-slate-200">
        <Breadcrumb items={[{ label: "Cookie Policy", active: true }]} />

        <div className="pb-4 border-b border-slate-200 dark:border-slate-800 space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Cookie className="w-8 h-8 text-amber-500" />
            Cookie Policy &amp; Storage Preferences
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            How We Use Cookies, Local Storage, &amp; Advertising Preferences | Updated August 2026
          </p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. What Are Cookies and Web Storage?</h2>
            <p className="text-slate-600 dark:text-slate-300">
              Cookies are small text files stored on your computer or mobile device when you visit a website. Web storage technologies—such as <code>localStorage</code> and <code>sessionStorage</code>—allow web applications to store preference data locally inside your browser without sending that data to remote servers.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Storage Technologies We Use</h2>
            <p className="text-slate-600 dark:text-slate-300">
              Mehzan Tools Hub uses web storage and cookies exclusively to maintain core application functionality, store your interface choices, and support advertising:
            </p>
            <ul className="list-disc pl-5 text-slate-600 dark:text-slate-300 space-y-2">
              <li>
                <strong>Essential LocalStorage (Client-Side Only):</strong>
                <ul className="list-circle pl-5 mt-1 space-y-1 text-slate-600 dark:text-slate-300">
                  <li><code>mehzandigital_theme</code>: Remembers your dark mode or light mode visual preference.</li>
                  <li><code>mehzandigital_favorites</code>: Saves your bookmarked tools list locally on your device.</li>
                  <li><code>mehzandigital_history</code>: Logs your recent tool execution history so you can review recent actions.</li>
                  <li><code>mehzandigital_cookie_consent</code>: Stores your cookie banner consent choices.</li>
                </ul>
              </li>
              <li>
                <strong>Authentication &amp; Session State:</strong> If you choose to sign in to a free account, Firebase Authentication uses secure tokens (stored in browser IndexedDB/cookies) to maintain your active login session across visits.
              </li>
              <li>
                <strong>Google AdSense Advertising Cookies:</strong> Google AdSense uses cookies to serve non-intrusive advertisements on our site. These cookies enable Google and its partners to serve relevant ads based on your visits to our site and other websites across the web.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. What We Do NOT Track</h2>
            <p className="text-slate-600 dark:text-slate-300">
              We strictly adhere to accurate privacy disclosures matching our implementation:
            </p>
            <ul className="list-disc pl-5 text-slate-600 dark:text-slate-300 space-y-1">
              <li>We do NOT track or store the contents of your uploaded documents, images, or code inputs.</li>
              <li>We do NOT use invasive cross-site tracking pixels (such as Meta Pixel).</li>
              <li>We do NOT sell or monetize your browsing preferences.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. How to Control and Manage Cookies</h2>
            <p className="text-slate-600 dark:text-slate-300">
              You have full control over cookies and local storage on your device:
            </p>
            <ul className="list-disc pl-5 text-slate-600 dark:text-slate-300 space-y-1">
              <li><strong>In-App Controls:</strong> You can clear your stored tool history and favorites anytime using the "Clear History" button on the History page or Dashboard.</li>
              <li><strong>Google Ad Preferences:</strong> You can manage or disable personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-indigo-500 font-semibold hover:underline">Google Ad Settings</a>.</li>
              <li><strong>Browser Settings:</strong> Most modern browsers (Chrome, Firefox, Safari, Edge) allow you to block, manage, or delete cookies and LocalStorage via browser Settings -&gt; Privacy and Security.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-2 border-t border-slate-200 dark:border-slate-800 pt-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">5. Contact Information</h2>
            <p className="text-slate-600 dark:text-slate-300">
              For questions or further information regarding our Cookie Policy, please contact our support desk on our <span className="font-semibold text-indigo-500">Contact Page</span> or via email at <span className="font-mono text-indigo-500">privacy@mehzandigital.com</span>.
            </p>
          </section>
        </div>
      </div>
    </>
  );
};
