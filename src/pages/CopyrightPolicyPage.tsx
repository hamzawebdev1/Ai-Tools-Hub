import React from "react";
import { ShieldCheck, Copyright as CopyrightIcon, FileCheck, Mail, Scale } from "lucide-react";
import { Breadcrumb } from "../components/layout/Breadcrumb";
import { SchemaHead } from "../components/layout/SchemaHead";

export const CopyrightPolicyPage: React.FC = () => {
  return (
    <>
      <SchemaHead
        title="Copyright Policy & DMCA Notice - Mehzan Digital"
        description="Learn about copyright ownership of Mehzan Digital tools, articles, and branding, third-party software licenses, and DMCA takedown procedures."
      />

      <div className="max-w-4xl mx-auto space-y-6 pb-16 text-slate-800 dark:text-slate-200">
        <Breadcrumb items={[{ label: "Copyright Policy", active: true }]} />

        <div className="pb-4 border-b border-slate-200 dark:border-slate-800 space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <CopyrightIcon className="w-8 h-8 text-indigo-500" />
            Copyright Policy &amp; DMCA Notice
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Official Intellectual Property Statement &amp; DMCA Guidelines | Updated August 2026
          </p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Ownership of Site Content &amp; Intellectual Property</h2>
            <p className="text-slate-600 dark:text-slate-300">
              Unless otherwise explicitly indicated, all original website design, graphical interfaces, custom branding, visual logos, written articles, blog posts, documentation, source code, scripts, layout architectures, and web application components available on <strong>Mehzan Tools Hub</strong> and <strong>Mehzan Digital</strong> are the exclusive intellectual property of Mehzan Digital and are protected by applicable national copyright laws and international intellectual property treaties.
            </p>
            <p className="text-slate-600 dark:text-slate-300">
              Unauthorized copying, republication, redistribution, automated scraping, or commercial exploitation of Mehzan Digital's original written content or visual interface assets without prior written consent is strictly prohibited.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. User Ownership of Input Data &amp; Tool Outputs</h2>
            <p className="text-slate-600 dark:text-slate-300">
              Mehzan Digital claims zero copyright or proprietary ownership over the files, document data, images, text inputs, or code snippets that users process through our browser-native utility tools.
            </p>
            <ul className="list-disc pl-5 text-slate-600 dark:text-slate-300 space-y-1">
              <li><strong>Input Files &amp; Content:</strong> You retain full ownership, title, and intellectual property rights to all files and text you upload or input into our tools.</li>
              <li><strong>Processed Outputs:</strong> You retain full ownership and royalty-free commercial publication rights for all outputs generated during your session (such as compressed PDFs, resized images, converted formats, or formatted JSON).</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Third-Party Software, Open-Source Libraries &amp; Trademarks</h2>
            <p className="text-slate-600 dark:text-slate-300">
              Mehzan Tools Hub incorporates open-source libraries and standard file specifications. Mehzan Digital does not claim ownership of third-party software dependencies, open-source packages, or registered trademarks owned by external organizations:
            </p>
            <ul className="list-disc pl-5 text-slate-600 dark:text-slate-300 space-y-1">
              <li><strong>Open-Source Libraries:</strong> Third-party client-side processing libraries (including pdf-lib, JSZip, Lucide React, React, Tailwind CSS, etc.) remain subject to their respective MIT, Apache 2.0, or BSD licenses.</li>
              <li><strong>File Format Standards:</strong> File formats such as PDF, PNG, JPG, WebP, JSON, and SVG are standard open formats or industry specifications and belong to their respective standard bodies or owners.</li>
              <li><strong>Trademarks:</strong> All product names, trademarks, and registered trademarks mentioned on this website belong to their respective owners. Their mention is strictly for identification and compatibility purposes and does not imply sponsorship or affiliation.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. Digital Millennium Copyright Act (DMCA) Notice &amp; Takedown Procedure</h2>
            <p className="text-slate-600 dark:text-slate-300">
              Mehzan Digital complies with the provisions of the Digital Millennium Copyright Act (17 U.S.C. § 512) and international copyright protection frameworks. If you believe that any material or content residing on or accessible through our website infringes your copyright, please send a written DMCA Copyright Takedown Notice to our designated Copyright Agent with the following information:
            </p>
            <ol className="list-decimal pl-5 text-slate-600 dark:text-slate-300 space-y-1.5">
              <li>A physical or electronic signature of a person authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
              <li>Identification of the copyrighted work claimed to have been infringed, or, if multiple copyrighted works are covered by a single notification, a representative list of such works.</li>
              <li>Identification of the material that is claimed to be infringing or to be the subject of infringing activity and that is to be removed or access to which is to be disabled, along with the specific URL(s) on our website.</li>
              <li>Information reasonably sufficient to permit us to contact you, such as an address, telephone number, and email address.</li>
              <li>A statement that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.</li>
              <li>A statement that the information in the notification is accurate, and under penalty of perjury, that you are authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
            </ol>
          </section>

          {/* Section 5 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">5. DMCA Counter-Notification Procedure</h2>
            <p className="text-slate-600 dark:text-slate-300">
              If you believe that your content was removed or access to it was disabled by mistake or misidentification, you may file a written Counter-Notification with our designated agent containing:
            </p>
            <ul className="list-disc pl-5 text-slate-600 dark:text-slate-300 space-y-1">
              <li>Your physical or electronic signature.</li>
              <li>Identification of the material that has been removed or to which access has been disabled and the location at which the material appeared before it was removed.</li>
              <li>A statement under penalty of perjury that you have a good faith belief that the material was removed or disabled as a result of mistake or misidentification.</li>
              <li>Your name, address, telephone number, and email address.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-2 border-t border-slate-200 dark:border-slate-800 pt-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">6. Designated Copyright Agent Contact Information</h2>
            <p className="text-slate-600 dark:text-slate-300">
              Please send all formal DMCA notices, legal inquiries, and copyright clearance requests to our designated copyright desk:
            </p>
            <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1 font-mono text-xs">
              <p><strong>Attn:</strong> Legal &amp; Copyright Compliance Desk</p>
              <p><strong>Entity:</strong> Mehzan Digital</p>
              <p><strong>Email:</strong> dmca@mehzandigital.com</p>
              <p><strong>Website:</strong> https://mehzandigital.com/contact</p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};
