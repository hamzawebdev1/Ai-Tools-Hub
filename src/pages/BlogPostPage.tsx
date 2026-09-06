import React, { useState } from "react";
import {
  Clock,
  Calendar,
  ArrowLeft,
  Share2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Wrench,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  BookOpen
} from "lucide-react";
import { BLOG_POSTS_DATA, getRelatedBlogPosts } from "../data/blogData";
import { getUrlForRoute } from "../services/routerService";
import { TOOLS_DATA } from "../data/toolsData";
import { Breadcrumb } from "../components/layout/Breadcrumb";
import { AdBanner } from "../components/layout/AdBanner";
import { Newsletter } from "../components/layout/Newsletter";
import { SchemaHead } from "../components/layout/SchemaHead";
import { getRelatedTools } from "../utils/linkBuilder";
import { injectLinksIntoContent } from "../utils/seoLinkInjector";
import { ReviewCTA } from "../components/common/ReviewCTA";

interface BlogPostPageProps {
  postSlug: string;
  setActiveTab: (tab: string) => void;
  onSelectTool?: (toolId: string) => void;
  onSelectPost?: (slug: string) => void;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({
  postSlug,
  setActiveTab,
  onSelectTool,
  onSelectPost
}) => {
  const post = BLOG_POSTS_DATA.find((p) => p.slug === postSlug) || BLOG_POSTS_DATA[0];
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [copied, setCopied] = useState(false);

  const relatedTools = (post.relatedToolIds || [])
    .map((id) => TOOLS_DATA.find((t) => t.id === id || t.slug === id))
    .filter(Boolean);

  const relatedPosts = getRelatedBlogPosts(post, 3);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <>
      <SchemaHead
        title={post.seoTitle || `${post.title} | Expert Guide`}
        description={post.metaDescription || post.excerpt}
        canonicalUrl={`https://www.mehzandigital.com/blog/${post.slug}`}
        schemaType="Article"
        schemaData={{
          headline: post.title,
          image: post.image,
          datePublished: post.date,
          dateModified: post.updatedDate || post.date,
          authorName: post.author.name,
          breadcrumbs: [
            { name: "Home", url: "/" },
            { name: "Blog & Guides", url: "/blog" },
            { name: post.title, url: `/blog/${post.slug}` }
          ],
          faqs: post.faqs || []
        }}
      />

      <div className="max-w-4xl mx-auto space-y-8 pb-16 px-4 sm:px-6">
        <Breadcrumb
          items={[
            { label: "Blog & Guides", href: getUrlForRoute("blog"), onClick: () => setActiveTab("blog") },
            { label: post.category, href: getUrlForRoute("blog"), onClick: () => setActiveTab("blog") },
            { label: post.title, href: getUrlForRoute("blog-post", { postSlug: post.slug }), active: true },
          ]}
        />

        <article className="space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <span className="px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
                {post.category}
              </span>

              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors"
                title="Share this guide"
              >
                <Share2 className="w-3.5 h-3.5" />
                {copied ? "Link Copied!" : "Share"}
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {post.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {post.excerpt}
            </p>

            {/* Author Meta Strip */}
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400 border-y border-slate-200 dark:border-slate-800 py-3.5">
              <div className="flex items-center gap-3">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                />
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-200">{post.author.name}</div>
                  <div className="text-[11px] text-slate-500">{post.author.role}</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Published: {post.date}
                </span>
                {post.updatedDate && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold">
                      <Calendar className="w-3.5 h-3.5" /> Updated: {post.updatedDate}
                    </span>
                  </>
                )}
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {post.readTime}
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified Expertise
                </span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 max-h-[420px] bg-slate-100 dark:bg-slate-800">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          <AdBanner placement="header" slotId="blog-post-top-ad" />

          {/* Interactive Tools Highlight Box (if related tools exist) */}
          {relatedTools.length > 0 && (
            <div className="p-5 rounded-2xl bg-linear-to-br from-indigo-50/80 to-purple-50/50 dark:from-indigo-950/30 dark:to-slate-900/50 border border-indigo-200/80 dark:border-indigo-800/50">
              <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-sm mb-3">
                <Wrench className="w-4 h-4" />
                Featured Free Interactive Tool{relatedTools.length > 1 ? "s" : ""}:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {relatedTools.map((tool) => (
                  <div
                    key={tool?.id}
                    className="p-3.5 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 shadow-xs"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {tool?.name}
                      </div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">
                        {tool?.description}
                      </div>
                    </div>
                    <a
                      href={`/${tool?.slug || tool?.id}`}
                      onClick={(e) => {
                        if (
                          onSelectTool &&
                          tool &&
                          !e.defaultPrevented &&
                          !e.ctrlKey &&
                          !e.metaKey &&
                          !e.shiftKey &&
                          !e.altKey &&
                          e.button === 0
                        ) {
                          e.preventDefault();
                          onSelectTool(tool.id);
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold shrink-0 hover:bg-indigo-700 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      Open <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Article HTML Body */}
          <div
            className="prose prose-slate dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed space-y-4 prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-lg prose-table:my-6 prose-a:text-indigo-600 dark:prose-a:text-indigo-400"
            dangerouslySetInnerHTML={{ __html: (() => {
                const tools = getRelatedTools(post.category);
                const links = tools.map(t => ({ text: t.name, url: t.url }));
                return injectLinksIntoContent(post.content, links);
            })() }}
          />

          {/* FAQ Accordion Section */}
          {post.faqs && post.faqs.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Frequently Asked Questions
                </h3>
              </div>

              <div className="space-y-3">
                {post.faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                      className="w-full p-4 text-left font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                    >
                      <span>{faq.question}</span>
                      {openFaqIndex === idx ? (
                        <ChevronUp className="w-4 h-4 text-indigo-500 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>
                    {openFaqIndex === idx && (
                      <div className="p-4 pt-0 text-xs sm:text-sm text-slate-600 dark:text-slate-300 border-t border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 leading-relaxed">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* E-E-A-T Author Card */}
          <div className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500 shrink-0"
            />
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">
                    Written by {post.author.name}
                  </h4>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                    Verified Author
                  </span>
                </div>
                <a
                  href={getUrlForRoute(`author-${post.author.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`)}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab(`author-${post.author.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`);
                  }}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
                >
                  View Author Profile &rarr;
                </a>
              </div>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                {post.author.role}
              </p>
              {post.author.bio && (
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {post.author.bio}
                </p>
              )}
            </div>
          </div>

          <AdBanner placement="in-content" slotId="blog-post-bottom-ad" />

          {/* Related Articles Strip */}
          {relatedPosts.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-500" />
                  Related Guides & Tutorials
                </h3>
                <button
                  onClick={() => setActiveTab("blog")}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  View All Guides
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedPosts.map((rel) => (
                  <a
                    key={rel.id}
                    href={`/blog/${rel.slug}`}
                    onClick={(e) => {
                      if (
                        onSelectPost &&
                        !e.defaultPrevented &&
                        !e.ctrlKey &&
                        !e.metaKey &&
                        !e.shiftKey &&
                        !e.altKey &&
                        e.button === 0
                      ) {
                        e.preventDefault();
                        onSelectPost(rel.slug);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    }}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-indigo-500/50 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                        {rel.category}
                      </span>
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">
                        {rel.title}
                      </h5>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 mt-3 flex items-center gap-1">
                      Read Guide <ArrowRight className="w-3 h-3" />
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          <ReviewCTA />

          <Newsletter />
        </article>
      </div>
    </>
  );
};
