import React from "react";
import { Shield, Lock, FileText, CheckCircle, Mail, Database, Cookie, UserCheck } from "lucide-react";
import { Breadcrumb } from "../components/layout/Breadcrumb";
import { SchemaHead } from "../components/layout/SchemaHead";

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <>
      <SchemaHead
        title="Privacy Policy - Mehzan Digital Data Protection & Security"
        description="Comprehensive Privacy Policy for Mehzan Digital and Mehzan Tools Hub. Learn how we handle client-side tool execution, local storage, optional account credentials, cookies, and data privacy."
      />

      <div className="max-w-4xl mx-auto space-y-6 pb-16 text-slate-800 dark:text-slate-200">
        <Breadcrumb items={[{ label: "Privacy Policy", active: true }]} />

        <div className="pb-4 border-b border-slate-200 dark:border-slate-800 space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="w-8 h-8 text-emerald-500" />
            Privacy Policy &amp; Data Protection Notice
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Effective Date: August 2026 | Compliant with GDPR, CCPA/CPRA, and Google Publishing Guidelines
          </p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Overview &amp; Privacy Commitment</h2>
            <p className="text-slate-600 dark:text-slate-300">
              Mehzan Digital ("we", "our", or "us") operates <strong>Mehzan Tools Hub</strong> (https://mehzandigital.com). We respect your privacy and are committed to protecting any information collected through your interaction with our online utility tools, web applications, and editorial guides. This Privacy Policy details our data collection practices, security standards, and your privacy rights.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Information We Collect</h2>
            <p className="text-slate-600 dark:text-slate-300">
              We collect information only as necessary to deliver fast, functional, and secure web services. The types of data processed include:
            </p>
            <ul className="list-disc pl-5 text-slate-600 dark:text-slate-300 space-y-1">
              <li><strong>Account Information:</strong> If you choose to create a free account, we store your email address, display name, hashed account credentials, and profile preferences via secure Firebase Authentication. Account creation is optional.</li>
              <li><strong>Email Addresses &amp; Subscriptions:</strong> If you subscribe to our newsletter, request support, or submit tool feedback, we collect your email address and message contents to respond to your request.</li>
              <li><strong>Contact &amp; Support Messages:</strong> Communication sent via our contact forms or support desks is stored to resolve inquiries and provide customer assistance.</li>
              <li><strong>Technical &amp; Network Telemetry:</strong> Standard web logs automatically record your IP address, browser user-agent, operating system, timestamp, and requested endpoint URLs for rate limiting and server security.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Uploaded Files &amp; Client-Side Processing</h2>
            <p className="text-slate-600 dark:text-slate-300">
              Our utility tools (including PDF compressors, image converters, formatters, and calculators) execute <strong>100% locally inside your web browser sandbox</strong> using JavaScript and WebAssembly technologies.
            </p>
            <ul className="list-disc pl-5 text-slate-600 dark:text-slate-300 space-y-1">
              <li><strong>Zero Permanent Server Storage:</strong> Your uploaded documents, PDF files, image files, and text inputs are NOT uploaded to, saved on, or retained by remote servers.</li>
              <li><strong>Transient In-Memory Execution:</strong> Processing occurs strictly in your device's browser memory. Once execution finishes or your browser tab is closed, temporary memory buffers are freed automatically.</li>
              <li><strong>Confidentiality:</strong> We do not inspect, index, analyze, sell, or share your document contents or processed files.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. Browser LocalStorage &amp; Session History</h2>
            <p className="text-slate-600 dark:text-slate-300">
              To provide a seamless user experience, Mehzan Tools Hub uses client-side browser storage (<code>localStorage</code>) to maintain:
            </p>
            <ul className="list-disc pl-5 text-slate-600 dark:text-slate-300 space-y-1">
              <li>Your dark or light interface theme selection.</li>
              <li>Your bookmarked favorite tools list.</li>
              <li>Your recent tool usage history logs.</li>
            </ul>
            <p className="text-slate-600 dark:text-slate-300">
              This data remains strictly stored on your own device and is never transmitted to external analytics databases. You can clear this history anytime using the in-app "Clear History" button or your browser settings.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">5. Cookies &amp; Third-Party Advertising</h2>
            <p className="text-slate-600 dark:text-slate-300">
              We use essential cookies necessary for website operation and optional third-party advertising cookies provided by Google AdSense:
            </p>
            <ul className="list-disc pl-5 text-slate-600 dark:text-slate-300 space-y-1">
              <li><strong>Essential Cookies:</strong> Cookies used to manage user authentication sessions and security state.</li>
              <li><strong>Google AdSense Advertising:</strong> Google and its advertising partners use cookies (such as the DoubleClick cookie) to serve ads based on prior visits to our site or other websites on the Internet.</li>
              <li><strong>Ad Choice &amp; Opt-Out:</strong> Users can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-indigo-500 font-semibold hover:underline">Google Ad Settings</a> or <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-indigo-500 font-semibold hover:underline">AboutAds.info</a>.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">6. How We Use Collected Information</h2>
            <p className="text-slate-600 dark:text-slate-300">
              Information collected is used strictly for the following purposes:
            </p>
            <ul className="list-disc pl-5 text-slate-600 dark:text-slate-300 space-y-1">
              <li>To provide, operate, and maintain high-performance utility tools.</li>
              <li>To authenticate registered users and manage account profiles.</li>
              <li>To deliver newsletter updates and respond to customer support requests.</li>
              <li>To detect, prevent, and mitigate automated bot traffic, rate-limit violations, and security attacks.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">7. Data Retention &amp; Security</h2>
            <p className="text-slate-600 dark:text-slate-300">
              We retain user account data and newsletter records only for as long as your account remains active or as needed to provide services. Technical logs are retained for a maximum of 30 days for security auditing before automated purging.
            </p>
            <p className="text-slate-600 dark:text-slate-300">
              We employ HTTPS/TLS encryption across all site traffic, strict Content Security Policies (CSP), HTTP-only cookie attributes, double-submit CSRF protection, and rate limiting to safeguard data integrity.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">8. Third-Party Services &amp; Infrastructure</h2>
            <p className="text-slate-600 dark:text-slate-300">
              We rely on trusted infrastructure providers operating under strict security and confidentiality commitments:
            </p>
            <ul className="list-disc pl-5 text-slate-600 dark:text-slate-300 space-y-1">
              <li><strong>Firebase (Google Cloud Platform):</strong> Secure database and user authentication service.</li>
              <li><strong>Google AdSense:</strong> Advertising network for non-intrusive display ads.</li>
            </ul>
            <p className="text-slate-600 dark:text-slate-300">
              We do not sell, rent, or trade your personal data to third parties under any circumstances.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">9. User Privacy Rights (GDPR &amp; CCPA/CPRA)</h2>
            <p className="text-slate-600 dark:text-slate-300">
              Depending on your jurisdiction, you have specific rights regarding your personal information:
            </p>
            <ul className="list-disc pl-5 text-slate-600 dark:text-slate-300 space-y-1">
              <li><strong>GDPR (European Union):</strong> Right to access, rectify, port, or request complete erasure of your personal data, and the right to object to or restrict processing.</li>
              <li><strong>CCPA / CPRA (California Residents):</strong> Right to know what personal information is collected, right to request deletion, and right to non-discrimination for exercising your rights. <strong>Notice:</strong> Mehzan Digital does NOT sell personal information.</li>
            </ul>
          </section>

          {/* Section 10 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">10. Children's Privacy Notice</h2>
            <p className="text-slate-600 dark:text-slate-300">
              Mehzan Tools Hub is designed for general audiences and is not directed at children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us for immediate deletion.
            </p>
          </section>

          {/* Section 11 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">11. Policy Changes &amp; Updates</h2>
            <p className="text-slate-600 dark:text-slate-300">
              We may update this Privacy Policy periodically to reflect technological updates, regulatory requirements, or service modifications. Changes become effective immediately upon posting to this page with an updated effective date.
            </p>
          </section>

          {/* Section 12 */}
          <section className="space-y-2 border-t border-slate-200 dark:border-slate-800 pt-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">12. Contact Our Privacy Officer</h2>
            <p className="text-slate-600 dark:text-slate-300">
              If you have any questions, requests, or concerns regarding this Privacy Policy or data protection, please contact our privacy compliance desk:
            </p>
            <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1 font-mono text-xs">
              <p><strong>Entity:</strong> Mehzan Digital - Privacy Compliance Office</p>
              <p><strong>Email:</strong> privacy@mehzandigital.com</p>
              <p><strong>Contact Form:</strong> https://mehzandigital.com/contact</p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};
