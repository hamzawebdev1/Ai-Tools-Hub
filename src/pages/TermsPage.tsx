import React from "react";
import { FileText, ShieldAlert, CheckCircle2 } from "lucide-react";
import { Breadcrumb } from "../components/layout/Breadcrumb";
import { SchemaHead } from "../components/layout/SchemaHead";

export const TermsPage: React.FC = () => {
  return (
    <>
      <SchemaHead
        title="Terms of Service - Mehzan Tools Hub Acceptable Use Policy"
        description="Review our Terms of Service regarding acceptable use of AI generated content, intellectual property, DMCA compliance, and rate limits."
      />

      <div className="max-w-4xl mx-auto space-y-6 pb-16 text-slate-800 dark:text-slate-200">
        <Breadcrumb items={[{ label: "Terms of Service", active: true }]} />

        <div className="pb-4 border-b border-slate-200 dark:border-slate-800 space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-8 h-8 text-indigo-500" />
            Terms of Service & Usage Agreement
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Effective Date: August 2026 | Compliant with Google Webmaster & AdSense Guidelines
          </p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Agreement to Terms</h2>
            <p className="text-slate-600 dark:text-slate-300">
              By accessing or using Mehzan Tools Hub, you agree to be bound by these Terms of Service and all applicable federal and international laws. If you do not agree with any of these terms, you are prohibited from using or accessing our tools.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Acceptable Use & Prohibited Activities</h2>
            <p className="text-slate-600 dark:text-slate-300">
              You agree to utilize Mehzan Tools Hub for ethical and lawful purposes only. You are strictly prohibited from using our services to:
            </p>
            <ul className="list-disc pl-5 text-slate-600 dark:text-slate-300 space-y-1">
              <li>Submit malicious code, SQL injection payloads, or DDoS bot traffic.</li>
              <li>Generate deceptive spam, phishing materials, malware, or illegal content.</li>
              <li>Attempt to reverse-engineer, scrape, or bypass server rate-limiting security controls.</li>
              <li>Infringe upon third-party copyrights, trademarks, or intellectual property rights.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Intellectual Property & Commercial License</h2>
            <p className="text-slate-600 dark:text-slate-300">
              To the fullest extent permitted by applicable law, you retain full ownership and commercial publication rights to all outputs generated during your session. Mehzan Tools Hub claims no ownership over text, code, or image prompt assets created by users.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. DMCA Copyright Policy & Takedown Notices</h2>
            <p className="text-slate-600 dark:text-slate-300">
              Mehzan Tools Hub respects intellectual property rights. If you believe any tool content or article infringes upon your copyright, please submit a formal DMCA Takedown Notice to our designated copyright desk at <span className="font-mono text-indigo-500">dmca@mehzandigital.com</span> including the copyrighted work URL and proof of ownership. Valid requests are acted upon within 24 business hours.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">5. Service Availability & Rate Limiting</h2>
            <p className="text-slate-600 dark:text-slate-300">
              Our tools are provided "as is" and "as available". We apply intelligent rate limiting (15 requests per minute) to ensure high server performance and sub-300ms execution speed for all concurrent users worldwide.
            </p>
          </section>

          <section className="space-y-2 border-t border-slate-200 dark:border-slate-800 pt-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">6. Contact Information</h2>
            <p className="text-slate-600 dark:text-slate-300">
              For questions regarding these Terms, please contact our administrative desk on our <span className="font-semibold text-indigo-500">Contact Page</span> or via email at <span className="font-mono text-indigo-500">support@mehzandigital.com</span>.
            </p>
          </section>
        </div>
      </div>
    </>
  );
};
