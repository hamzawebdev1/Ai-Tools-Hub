import React from "react";
import { Clock, Calendar, ArrowLeft, Share2, Sparkles } from "lucide-react";
import { BLOG_POSTS_DATA } from "../data/blogData";
import { Breadcrumb } from "../components/layout/Breadcrumb";
import { AdBanner } from "../components/layout/AdBanner";
import { Newsletter } from "../components/layout/Newsletter";
import { SchemaHead } from "../components/layout/SchemaHead";

interface BlogPostPageProps {
  postSlug: string;
  setActiveTab: (tab: string) => void;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({ postSlug, setActiveTab }) => {
  const post = BLOG_POSTS_DATA.find((p) => p.slug === postSlug) || BLOG_POSTS_DATA[0];

  return (
    <>
      <SchemaHead
        title={post.title}
        description={post.excerpt}
        schemaType="Article"
        schemaData={{
          headline: post.title,
          image: [post.image],
          datePublished: post.date,
          author: {
            "@type": "Person",
            name: post.author.name,
          },
        }}
      />

      <div className="max-w-4xl mx-auto space-y-8 pb-16">
        <Breadcrumb
          items={[
            { label: "Blog", onClick: () => setActiveTab("blog") },
            { label: post.title, active: true },
          ]}
        />

        <article className="space-y-6">
          <div className="space-y-4">
            <span className="px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
              {post.category}
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 border-y border-slate-200 dark:border-slate-800 py-3">
              <div className="flex items-center gap-2">
                <img src={post.author.avatar} alt={post.author.name} className="w-7 h-7 rounded-full object-cover" />
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-200">{post.author.name}</div>
                  <div className="text-[10px]">{post.author.role}</div>
                </div>
              </div>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {post.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {post.readTime}
              </span>
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden shadow-xl max-h-[400px]">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </div>

          <AdBanner placement="header" slotId="blog-post-top-ad" />

          {/* Article HTML Body */}
          <div
            className="prose prose-slate dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <AdBanner placement="in-content" slotId="blog-post-bottom-ad" />

          <Newsletter />
        </article>
      </div>
    </>
  );
};
