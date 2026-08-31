import React, { useState, useEffect } from "react";
import {
  FileText,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Link2,
  BookOpen,
  User,
  Mail,
  Globe,
  Tag,
  Sparkles,
  ArrowRight,
  Info,
} from "lucide-react";

interface GuestPostSettings {
  enabled: boolean;
  guidelines: string;
  minWordCount: number;
  maxWordCount: number;
  allowedCategories: string[];
  requireFeaturedImage: boolean;
  requireAuthorBio: boolean;
  moderationRequired: boolean;
  autoPublish: boolean;
}

export const GuestPostPage: React.FC = () => {
  const [settings, setSettings] = useState<GuestPostSettings | null>(null);
  const [loadingSettings, setLoadingSettings] = useState(true);

  // Form Fields
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [authorWebsite, setAuthorWebsite] = useState("");
  const [authorSocialUrl, setAuthorSocialUrl] = useState("");
  const [authorBio, setAuthorBio] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Web Development");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    submissionId: string;
    slug: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/guest-posts/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setSettings(data.settings);
          if (data.settings.allowedCategories && data.settings.allowedCategories.length > 0) {
            setCategory(data.settings.allowedCategories[0]);
          }
        }
      })
      .catch((err) => console.error("Error fetching guest post settings:", err))
      .finally(() => setLoadingSettings(false));
  }, []);

  // Word Count Calculation
  const getWordCount = (text: string) => {
    const plain = text.replace(/<[^>]+>/g, " ").trim();
    if (!plain) return 0;
    return plain.split(/\s+/).length;
  };

  const wordCount = getWordCount(content);
  const minWords = settings?.minWordCount || 500;
  const maxWords = settings?.maxWordCount || 5000;
  const isWordCountValid = wordCount >= minWords && wordCount <= maxWords;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!agreedToTerms) {
      setError("Please confirm that your article is original content and complies with our editorial terms.");
      return;
    }

    if (!isWordCountValid) {
      setError(`Article word count (${wordCount} words) must be between ${minWords} and ${maxWords} words.`);
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/guest-posts/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName,
          authorEmail,
          authorWebsite,
          authorSocialUrl,
          authorBio,
          title,
          category,
          content,
          featuredImage,
          additionalNotes,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccessData({
          submissionId: data.submissionId,
          slug: data.slug,
          message: data.message,
        });
      } else {
        setError(data.error || "Failed to submit guest article. Please check your inputs.");
      }
    } catch (err: any) {
      setError(err.message || "Network error submitting article. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 space-y-10">
      {/* Hero Header */}
        <section className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Editorial Contributions & Guest Posts
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Write for <span className="text-indigo-600 dark:text-indigo-400">Mehzan Digital</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Share your web development tutorials, digital marketing insights, technical software guides, or SEO strategies with our developer and tech community.
          </p>
        </section>

        {/* Guidelines Card */}
        <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-500" /> Editorial Guidelines & Quality Requirements
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 dark:text-slate-300">
            <div className="space-y-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Original & In-Depth Content
              </div>
              <p>
                Articles must be 100% original, written by you, and not published on any other website or medium. Minimum requirement is <strong>{minWords} words</strong>.
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-sm">
                <Link2 className="w-4 h-4 text-indigo-500" /> Link Policy & Safety
              </div>
              <p>
                External links must be relevant and contextual. Low-quality link-farm promos, casino, gambling, adult, or malicious domains will result in immediate rejection.
              </p>
            </div>
          </div>

          {settings?.guidelines && (
            <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs text-slate-700 dark:text-slate-300 space-y-1">
              <span className="font-bold text-indigo-900 dark:text-indigo-200 block">
                Publisher's Terms:
              </span>
              <p className="whitespace-pre-line leading-relaxed">{settings.guidelines}</p>
            </div>
          )}
        </section>

        {/* Success Confirmation or Form */}
        {successData ? (
          <section className="p-8 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-4 max-w-2xl mx-auto shadow-xl">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h2 className="text-xl font-bold text-emerald-900 dark:text-emerald-100">
              Article Submitted Successfully!
            </h2>
            <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 leading-relaxed">
              {successData.message}
            </p>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Submission Reference ID:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{successData.submissionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Proposed Article Slug:</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400">/blog/{successData.slug}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setSuccessData(null);
                setTitle("");
                setContent("");
                setAuthorBio("");
              }}
              className="mt-4 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs inline-flex items-center gap-2 cursor-pointer transition-colors shadow-md"
            >
              Submit Another Article <ArrowRight className="w-4 h-4" />
            </button>
          </section>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
              <FileText className="w-5 h-5 text-indigo-500" /> Article Submission Form
            </h2>

            {error && (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Submission Error</span>
                  {error}
                </div>
              </div>
            )}

            {/* Author Details Section */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                1. Author & Profile Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="e.g. Jane Doe"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={authorEmail}
                      onChange={(e) => setAuthorEmail(e.target.value)}
                      placeholder="e.g. author@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Website / Portfolio URL <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="url"
                      value={authorWebsite}
                      onChange={(e) => setAuthorWebsite(e.target.value)}
                      placeholder="https://yourwebsite.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    LinkedIn / Twitter URL <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Link2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="url"
                      value={authorSocialUrl}
                      onChange={(e) => setAuthorSocialUrl(e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Author Bio <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={authorBio}
                  onChange={(e) => setAuthorBio(e.target.value)}
                  placeholder="Short 2-3 sentence biography outlining your experience and expertise..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            {/* Article Content Section */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                2. Article Details & Content
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Article Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. How to Optimize Web Vitals & Page Speed in 2026"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    {(
                      settings?.allowedCategories || [
                        "Web Development",
                        "Digital Marketing",
                        "SEO",
                        "Developer Tools",
                        "PDF Utilities",
                        "Student Tools",
                      ]
                    ).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Featured Cover Image URL <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="url"
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Article Content (Markdown or Clean HTML) <span className="text-rose-500">*</span>
                  </label>

                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      isWordCountValid
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300"
                    }`}
                  >
                    {wordCount} / min {minWords} words
                  </span>
                </div>

                <textarea
                  required
                  rows={12}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste your formatted article text here..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-mono leading-relaxed focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Additional Notes to Editors <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="Any special requests or context for our editorial team..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-indigo-600 w-4 h-4 focus:ring-indigo-500"
                />
                <span className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                  I confirm that this article is original work written by me, contains no copyrighted or promotional spam material, and I agree to Mehzan Digital's editorial guidelines.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="submit"
                disabled={submitting || !agreedToTerms || !isWordCountValid}
                className="px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl inline-flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting Article...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Guest Article
                  </>
                )}
              </button>
            </div>
          </form>
        )}
    </div>
  );
};
