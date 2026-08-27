import React, { useState } from "react";
import { MessageSquare, Send, CheckCircle, Star } from "lucide-react";
import { Breadcrumb } from "../components/layout/Breadcrumb";
import { SchemaHead } from "../components/layout/SchemaHead";

export const FeedbackPage: React.FC = () => {
  const [rating, setRating] = useState<number>(5);
  const [comments, setComments] = useState("");
  const [toolName, setToolName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comments) return;

    setLoading(true);
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "feedback", rating, comments, toolName }),
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
        title="Community Feedback - Mehzan Tools Hub"
        description="Share your feedback, report execution quality, or request feature enhancements for our AI utilities."
      />

      <div className="max-w-2xl mx-auto space-y-8 pb-16">
        <Breadcrumb items={[{ label: "Feedback", active: true }]} />

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Community Feedback</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Help us improve our AI utilities. We review all submitted ratings and comments weekly.
          </p>
        </div>

        {submitted ? (
          <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center space-y-3 animate-fade-in">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Feedback Received!</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Thank you for helping us refine Mehzan Tools Hub. Your suggestions directly shape upcoming features.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setComments("");
              }}
              className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold cursor-pointer"
            >
              Submit Additional Feedback
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 sm:p-8 space-y-5 shadow-xl">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                Overall Experience Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1.5 transition-transform hover:scale-125 cursor-pointer"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-700"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Tool Name (Optional)
              </label>
              <input
                type="text"
                value={toolName}
                onChange={(e) => setToolName(e.target.value)}
                placeholder="e.g. AI Paraphraser"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Your Feedback or Suggestions
              </label>
              <textarea
                required
                rows={4}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="What did you like? What can we improve?"
                className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? "Submitting..." : "Send Feedback"}</span>
            </button>
          </form>
        )}
      </div>
    </>
  );
};
