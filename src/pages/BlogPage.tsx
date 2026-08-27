import React, { useState } from "react";
import { BookOpen, Clock, ArrowRight, User } from "lucide-react";
import { BLOG_POSTS_DATA } from "../data/blogData";
import { Breadcrumb } from "../components/layout/Breadcrumb";
import { AdBanner } from "../components/layout/AdBanner";
import { Newsletter } from "../components/layout/Newsletter";
import { SchemaHead } from "../components/layout/SchemaHead";

interface BlogPageProps {
  onSelectPost: (postSlug: string) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onSelectPost }) => {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Productivity", "Media & Design", "SEO & Marketing"];

  const filteredPosts =
    activeCategory === "All"
      ? BLOG_POSTS_DATA
      : BLOG_POSTS_DATA.filter((p) => p.category === activeCategory);

  return (
    <>
      <SchemaHead
        title="Tech Blog & Insights - Developer Guides, PDF & SEO Tools"
        description="Read expert articles on AI workflow automation, prompt engineering, content strategy, and SEO optimization."
      />

      <div className="space-y-8 pb-12">
        <Breadcrumb items={[{ label: "Blog", active: true }]} />

        <div className="pb-4 border-b border-slate-200/80 dark:border-slate-800">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-indigo-500" />
            AI Workflow & SEO Blog
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            In-depth guides, prompt engineering cheat sheets, and organic traffic growth tactics
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold shrink-0 cursor-pointer transition-colors ${
                activeCategory === cat
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <AdBanner placement="header" slotId="blog-top-ad" />

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <a
              key={post.id}
              href={`/blog/${post.slug}`}
              onClick={(e) => {
                if (
                  !e.defaultPrevented &&
                  !e.ctrlKey &&
                  !e.metaKey &&
                  !e.shiftKey &&
                  !e.altKey &&
                  e.button === 0
                ) {
                  e.preventDefault();
                  onSelectPost(post.slug);
                }
              }}
              className="group rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md overflow-hidden shadow-xs hover:shadow-2xl hover:border-indigo-500/40 transition-all duration-300 cursor-pointer flex flex-col justify-between block"
            >
              <div className="space-y-4">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
                    {post.category}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {post.readTime}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                    {post.title}
                  </h2>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-2">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {post.author.name}
                  </span>
                </div>

                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                  Read Article <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </a>
          ))}
        </div>

        <Newsletter />
      </div>
    </>
  );
};
