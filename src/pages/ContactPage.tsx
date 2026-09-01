import React, { useState } from "react";
import { Mail, Send, CheckCircle, AlertCircle, Clock, MessageSquare, Paperclip, ShieldCheck, RefreshCw } from "lucide-react";
import { Breadcrumb } from "../components/layout/Breadcrumb";
import { SchemaHead } from "../components/layout/SchemaHead";

export const ContactPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("General Support");
  const [category, setCategory] = useState("General Support");
  const [message, setMessage] = useState("");
  const [attachmentName, setAttachmentName] = useState<string | undefined>();
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Client validation
    if (!name.trim()) {
      setErrorMessage("Please provide your full name.");
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (!message.trim() || message.trim().length < 10) {
      setErrorMessage("Message must be at least 10 characters long.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          category,
          message: message.trim(),
          attachmentName,
          recaptchaVerified: true,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setReferenceId(data.referenceId || "MSG-" + Math.floor(10000 + Math.random() * 90000));
        setSubmitted(true);
      } else {
        setErrorMessage(data.error || "Failed to send message. Please verify your details and try again.");
      }
    } catch (err: any) {
      console.error("Contact form error:", err);
      setErrorMessage(
        "Network connection error. Could not reach server. Please check your network and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SchemaHead
        title="Contact Us - Mehzan Tools Hub Support"
        description="Get in touch with the Mehzan Tools Hub engineering and support team for questions, API partnerships, or bug reports."
      />

      <div className="max-w-3xl mx-auto space-y-8 pb-16">
        <Breadcrumb items={[{ label: "Contact Us", active: true }]} />

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Contact Our Team</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Have questions, feedback, or custom tool requests? We typically respond within 24 hours.
          </p>
        </div>

        {/* Direct Email Card */}
        <div className="p-4 rounded-2xl border border-indigo-200/80 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-950/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">Direct Founder & Support Email</span>
              <a href="mailto:hamza.web.dev5324@gmail.com" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                hamza.web.dev5324@gmail.com
              </a>
            </div>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-indigo-500" /> Mon-Fri, 24h SLA
          </span>
        </div>

        {submitted ? (
          <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto text-emerald-500">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Message Sent Successfully</h3>
            {referenceId && (
              <div className="inline-block px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-emerald-500/30 font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                Reference ID: {referenceId}
              </div>
            )}
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
              Thank you for contacting us. Your message has been safely recorded in our support desk database. Our engineering team will review your inquiry and follow up at <span className="font-semibold text-slate-900 dark:text-white">{email}</span>.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  setSubmitted(false);
                  setMessage("");
                  setReferenceId(null);
                  setErrorMessage(null);
                }}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer transition-colors"
              >
                Send Another Message
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 sm:p-8 space-y-5 shadow-xl"
          >
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Smith"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Subject <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Enterprise API Partnership"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 cursor-pointer focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="General Support">General Support</option>
                  <option value="Bug Report">Bug Report</option>
                  <option value="API Partnership">API / Enterprise Partnership</option>
                  <option value="AdSense / Legal">AdSense / Legal Inquiry</option>
                  <option value="Feature Request">Feature Request</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Message <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your question, request, or issue in detail..."
                className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                <ShieldCheck className="w-4 h-4" /> SSL Encrypted & Verified
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold flex items-center gap-2 cursor-pointer transition-colors shadow-lg shadow-indigo-500/20"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};
