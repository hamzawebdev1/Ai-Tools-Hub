import React, { useState } from "react";
import { Sparkles, Send, CheckCircle } from "lucide-react";
import { Breadcrumb } from "../components/layout/Breadcrumb";
import { SchemaHead } from "../components/layout/SchemaHead";

export const SuggestToolPage: React.FC = () => {
  const [toolTitle, setToolTitle] = useState("");
  const [category, setCategory] = useState("Writing & Rephrasing");
  const [description, setDescription] = useState("");
  const [useCase, setUseCase] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!toolTitle || !description) return;

    setLoading(true);
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "suggest-tool", toolTitle, category, description, useCase }),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SchemaHead
        title="Suggest a New Tool - Mehzan Tools Hub"
        description="Request a custom AI utility or suggest a feature for our development team to build."
      />

      <div className="max-w-2xl mx-auto space-y-8 pb-16">
        <Breadcrumb items={[{ label: "Suggest a Tool", active: true }]} />

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Suggest a New Tool</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Need an AI utility that isn't in our directory yet? Describe it below and our team will build it!
          </p>
        </div>

        {submitted ? (
          <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center space-y-3 animate-fade-in">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Suggestion Received!</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Thank you! Our engineering team reviews popular tool suggestions weekly and adds new utilities continuously.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setToolTitle("");
                setDescription("");
              }}
              className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold cursor-pointer"
            >
              Suggest Another Tool
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 sm:p-8 space-y-4 shadow-xl">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Suggested Tool Name
              </label>
              <input
                type="text"
                required
                value={toolTitle}
                onChange={(e) => setToolTitle(e.target.value)}
                placeholder="e.g. AI Cold Email Generator"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Target Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 cursor-pointer"
              >
                <option value="Writing & Rephrasing">Writing & Rephrasing</option>
                <option value="Software Engineering">Software Engineering</option>
                <option value="SEO & Marketing">SEO & Marketing</option>
                <option value="Social & Prompts">Social & Prompts</option>
                <option value="Productive Summaries">Productive Summaries</option>
                <option value="Business & General">Business & General</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Tool Description & How It Works
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What inputs should the tool take, and what output should it generate?"
                className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? "Submitting..." : "Submit Tool Request"}</span>
            </button>
          </form>
        )}
      </div>
    </>
  );
};
