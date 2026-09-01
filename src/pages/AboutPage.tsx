import React from "react";
import { Sparkles, ShieldCheck, Zap, Globe, UserCheck, Mail } from "lucide-react";
import { Breadcrumb } from "../components/layout/Breadcrumb";
import { SchemaHead } from "../components/layout/SchemaHead";
import { getUrlForRoute } from "../services/routerService";

interface AboutPageProps {
  setActiveTab: (tab: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ setActiveTab }) => {
  return (
    <>
      <SchemaHead
        title="About Mehzan Digital & Mehzan Tools Hub"
        description="Mehzan Digital is operated by Hamza, a Web Developer & Digital Marketing Expert with 5+ years of experience building high-performance, browser-native web utilities."
      />

      <div className="max-w-4xl mx-auto space-y-10 pb-16">
        <Breadcrumb items={[{ label: "About Us", active: true }]} />

        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
            <Sparkles className="w-4 h-4" />
            <span>Mehzan Digital Web Utilities</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
            Built for Speed, Privacy, and Practical Utility
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Mehzan Tools Hub was founded by <strong>Hamza</strong>, a Web Developer and Digital Marketing Expert with over 5 years of industry experience. Our mission is to provide fast, privacy-first, zero-friction online web utilities for developers, students, content creators, and businesses worldwide.
          </p>
        </div>

        {/* Founder & Operator Card */}
        <div className="rounded-3xl border border-indigo-200/80 dark:border-indigo-900/50 bg-gradient-to-br from-indigo-50/50 via-white to-slate-50 dark:from-indigo-950/20 dark:via-slate-900 dark:to-slate-950 p-6 sm:p-8 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
              alt="Hamza - Founder of Mehzan Digital"
              className="w-20 h-20 rounded-2xl object-cover shadow-md border-2 border-indigo-500/30 shrink-0"
            />
            <div className="space-y-2 text-center sm:text-left flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Hamza
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase">
                  Founder & Lead Developer
                </span>
              </div>
              <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                Web Developer & Digital Marketing Expert (5+ Years Experience)
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Hamza manages digital marketing strategy and web application engineering for Mehzan Digital. He builds client-side browser utilities, PDF tools, image converters, and developer automation suites designed to eliminate unnecessary server latency and safeguard user privacy.
              </p>
              <div className="pt-2">
                <a
                  href={getUrlForRoute("author-hamza")}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab("author-hamza");
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <UserCheck className="w-4 h-4" /> View Full Author Profile & Articles &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 space-y-3 shadow-xs">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 w-fit">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Client-Side Speed</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Most of our PDF, image, text, and calculator utilities run directly inside your browser memory using WebAssembly and HTML5 APIs for sub-100ms processing.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 space-y-3 shadow-xs">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 w-fit">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Transparent Privacy</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Files processed locally remain in browser memory and are never uploaded or stored on external servers. For AI tools, prompts are proxied securely to generate responses without persistent storage.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 space-y-3 shadow-xs">
            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 w-fit">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Editorial Quality</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Every tool and guide is published under strict Google E-E-A-T standards, verified for technical accuracy and accessibility compliance.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-8 space-y-4 text-center">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Contact & Inquiries</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Have questions, feedback, or tool requests? Reach out directly via our contact form or send an email to <a href="mailto:hamza.web.dev5324@gmail.com" className="text-indigo-600 dark:text-indigo-400 font-semibold underline">hamza.web.dev5324@gmail.com</a>.
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

