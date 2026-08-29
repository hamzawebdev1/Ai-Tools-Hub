import React from "react";
import { FileText, ShieldAlert, CheckCircle2, Scale, Lock, AlertCircle } from "lucide-react";
import { Breadcrumb } from "../components/layout/Breadcrumb";
import { SchemaHead } from "../components/layout/SchemaHead";

export const TermsPage: React.FC = () => {
  return (
    <>
      <SchemaHead
        title="Terms of Service - Mehzan Digital Usage Agreement"
        description="Official Terms of Service for Mehzan Digital and Mehzan Tools Hub. Learn about permitted tool usage, prohibited activities, rate limits, intellectual property, and liability terms."
      />

      <div className="max-w-4xl mx-auto space-y-6 pb-16 text-slate-800 dark:text-slate-200">
        <Breadcrumb items={[{ label: "Terms of Service", active: true }]} />

        <div className="pb-4 border-b border-slate-200 dark:border-slate-800 space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-8 h-8 text-indigo-500" />
            Terms of Service &amp; User Agreement
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Effective Date: August 2026 | Compliant with International Web Standards &amp; AdSense Guidelines
          </p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Acceptance of Terms</h2>
            <p className="text-slate-600 dark:text-slate-300">
              Welcome to <strong>Mehzan Tools Hub</strong> (https://mehzandigital.com), owned and operated by Mehzan Digital. By accessing, browsing, or utilizing any of our online utility tools, web applications, or editorial content, you agree to be bound by these Terms of Service ("Terms") and all applicable laws and regulations. If you do not agree with any part of these Terms, you must immediately discontinue use of the website.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Description of Services &amp; Permitted Use</h2>
            <p className="text-slate-600 dark:text-slate-300">
              Mehzan Tools Hub provides a suite of free, browser-native web utility applications including PDF manipulation, image conversion, developer formatters, text processing, and mathematical calculators.
            </p>
            <p className="text-slate-600 dark:text-slate-300">
              You are granted a non-exclusive, non-transferable, revocable license to access and use the tools for personal, educational, professional, and commercial purposes in accordance with these Terms.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Prohibited Activities &amp; Security Rules</h2>
            <p className="text-slate-600 dark:text-slate-300">
              To preserve website integrity, server security, and fast execution for all visitors, you agree NOT to engage in any of the following prohibited activities:
            </p>
            <ul className="list-disc pl-5 text-slate-600 dark:text-slate-300 space-y-1">
              <li>Deploying automated scrapers, bots, spiders, or malicious scripts to flood or extract site content.</li>
              <li>Attempting to bypass, disable, or tamper with security rate-limiting mechanisms or CORS policies.</li>
              <li>Submitting malicious software, virus payloads, executable malware, or SQL injection vectors through input fields.</li>
              <li>Using our tools to generate, format, or process illegal, defamatory, fraudulent, or infringing materials.</li>
              <li>Framing or mirroring our site interfaces without explicit written authorization from Mehzan Digital.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. User Responsibilities &amp; File Verification</h2>
            <p className="text-slate-600 dark:text-slate-300">
              While our tools execute using tested algorithmic specifications, you are solely responsible for:
            </p>
            <ul className="list-disc pl-5 text-slate-600 dark:text-slate-300 space-y-1">
              <li>Reviewing and verifying all output files, converted formats, minified scripts, and calculation results prior to deployment in critical or production environments.</li>
              <li>Maintaining independent backup copies of all original files before processing them through web tools.</li>
              <li>Ensuring that you possess the lawful right and permission to upload and process any documents or media files.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">5. Tool Availability &amp; Rate Limiting</h2>
            <p className="text-slate-600 dark:text-slate-300">
              Our tools are provided on an "as is" and "as available" basis. To maintain high execution speeds and prevent Denial of Service (DoS) attacks, automated rate limiting is enforced (e.g., 30 requests per minute per IP address). Excessive requests may result in temporary execution throttles or IP blocks.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">6. Intellectual Property &amp; Output Ownership</h2>
            <p className="text-slate-600 dark:text-slate-300">
              <strong>Your Outputs:</strong> Mehzan Digital claims ZERO ownership over files, document outputs, formatted text, or images processed during your session. You retain full ownership and royalty-free commercial rights to all outputs generated by our tools.
            </p>
            <p className="text-slate-600 dark:text-slate-300">
              <strong>Website Assets:</strong> All original code, branding, logos, graphics, visual components, design themes, and articles created by Mehzan Digital remain the exclusive intellectual property of Mehzan Digital.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">7. Account Registration &amp; Termination</h2>
            <p className="text-slate-600 dark:text-slate-300">
              Account registration is optional for accessing basic tools. If you register an account, you are responsible for safeguarding your login credentials. Mehzan Digital reserves the right to suspend or terminate accounts that violate security rules or engage in fraudulent activities.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">8. Third-Party Services &amp; Advertisements</h2>
            <p className="text-slate-600 dark:text-slate-300">
              Mehzan Tools Hub displays advertisements provided by Google AdSense to fund site operations. Third-party ad links or services are governed by their respective privacy policies and terms. Inclusion of third-party links does not imply endorsement by Mehzan Digital.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">9. Website Modifications &amp; Updates</h2>
            <p className="text-slate-600 dark:text-slate-300">
              Mehzan Digital reserves the right to modify, upgrade, suspend, or discontinue any feature, tool, or section of the website at any time without prior notice or liability.
            </p>
          </section>

          {/* Section 10 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">10. Disclaimer of Warranties</h2>
            <p className="text-slate-600 dark:text-slate-300">
              THE WEBSITE AND ALL UTILITY TOOLS ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. MEHZAN DIGITAL DOES NOT WARRANT THAT TOOLS WILL BE ERROR-FREE, UNINTERRUPTED, OR FREE OF BUGS.
            </p>
          </section>

          {/* Section 11 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">11. Limitation of Liability</h2>
            <p className="text-slate-600 dark:text-slate-300">
              IN NO EVENT SHALL MEHZAN DIGITAL, ITS OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF DATA, PROFITS, OR BUSINESS INTERRUPTION ARISING FROM YOUR USE OR INABILITY TO USE THE TOOLS.
            </p>
          </section>

          {/* Section 12 */}
          <section className="space-y-2 border-t border-slate-200 dark:border-slate-800 pt-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">12. Contact Information</h2>
            <p className="text-slate-600 dark:text-slate-300">
              If you have any questions or concerns regarding these Terms of Service, please contact our administrative team:
            </p>
            <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1 font-mono text-xs">
              <p><strong>Entity:</strong> Mehzan Digital - Administrative Desk</p>
              <p><strong>Email:</strong> legal@mehzandigital.com</p>
              <p><strong>Support Page:</strong> https://mehzandigital.com/contact</p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};
