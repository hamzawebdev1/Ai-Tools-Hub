import React from "react";
import { UserCheck, Award, BookOpen, ShieldCheck, Mail, ArrowLeft } from "lucide-react";
import { AUTHORS_DATA } from "../data/authorsData";
import { BLOG_POSTS_DATA } from "../data/blogData";
import { getUrlForRoute } from "../services/routerService";
import { Breadcrumb } from "../components/layout/Breadcrumb";
import { SchemaHead } from "../components/layout/SchemaHead";

interface AuthorPageProps {
  authorSlug?: string;
  setActiveTab: (tab: string) => void;
  onSelectPost?: (slug: string) => void;
}

export const AuthorPage: React.FC<AuthorPageProps> = ({
  authorSlug = "alex-rivera",
  setActiveTab,
  onSelectPost,
}) => {
  const author = AUTHORS_DATA.find((a) => a.slug === authorSlug) || AUTHORS_DATA[0];
  const authorPosts = BLOG_POSTS_DATA.filter((p) => p.author.name === author.name);

  return (
    <>
      <SchemaHead
        title={`${author.name} - Author Profile & Editorial Standards`}
        description={`Learn more about ${author.name}, ${author.role} at Mehzan Tools Hub. Read expert articles, technical guides, and security research.`}
        schemaType="Article"
        schemaData={{
          "@type": "Person",
          name: author.name,
          jobTitle: author.role,
          description: author.bio,
        }}
      />

      <div className="max-w-4xl mx-auto space-y-8 pb-16">
        <Breadcrumb
          items={[
            { label: "About Us", href: getUrlForRoute("about"), onClick: () => setActiveTab("about") },
            { label: author.name, href: getUrlForRoute(`author-${author.slug}`), active: true },
          ]}
        />

        {/* Author Bio Card */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <img
              src={author.avatar}
              alt={author.name}
              className="w-24 h-24 rounded-3xl object-cover shadow-md border-2 border-indigo-500/20 shrink-0"
            />

            <div className="space-y-3 flex-1">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[11px] font-bold uppercase tracking-wider mb-1">
                  <UserCheck className="w-3.5 h-3.5" /> Verified Technical Author
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  {author.name}
                </h1>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {author.role}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {author.bio}
              </p>

              {/* Expertise tags */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Core Expertise & Technical Focus:
                </span>
                <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
                  {author.expertise.map((exp, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300"
                    >
                      {exp}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* E-E-A-T Editorial Commitment Badge */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0" />
            <div className="text-xs text-slate-600 dark:text-slate-400">
              <span className="font-bold text-slate-900 dark:text-slate-200 block">
                Google E-E-A-T Quality Commitment
              </span>
              All content published by {author.name} is rigorously reviewed for technical accuracy, zero copyright infringement, and strict OWASP security standards.
            </div>
          </div>
        </div>

        {/* Other Authors Picker */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-500" /> Meets Our Editorial Board
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {AUTHORS_DATA.map((a) => (
              <div
                key={a.id}
                onClick={() => {
                  setActiveTab(`author-${a.slug}`);
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                  a.slug === author.slug
                    ? "border-indigo-500 bg-indigo-500/5 shadow-md"
                    : "border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <img src={a.avatar} alt={a.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                <div className="overflow-hidden">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{a.name}</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{a.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Written Articles Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-500" /> Articles Authored by {author.name}
          </h2>

          {authorPosts.length === 0 ? (
            <p className="text-xs text-slate-500 italic p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              New articles by {author.name} are currently in editorial review. Check back soon!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {authorPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => {
                    if (onSelectPost) onSelectPost(post.slug);
                    setActiveTab("blog-post");
                  }}
                  className="group rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="p-5 space-y-3">
                    <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase">
                      {post.category}
                    </span>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-400 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/50">
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
