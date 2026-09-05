import React from "react";

export const DirectoryBadgesMarquee: React.FC = () => {
  const badges = [
    {
      href: "https://confettisaas.com/saas/mehzandigital-com?ref=badge",
      src: "https://confettisaas.com/badge-light.svg",
      alt: "Mehzan Tools Hub on ConfettiSaaS",
      width: 200,
      height: 44,
      target: "_blank",
      rel: "noopener",
    },
    {
      href: "https://neeed.directory/products/mehzan-tools-hub?utm_source=mehzan-tools-hub",
      src: "https://neeed.directory/badges/neeed-badge-light.svg",
      alt: "Featured on neeed.directory",
      width: 139,
      height: 44,
      target: "_blank",
      rel: "noopener",
    },
    {
      href: "https://thedevtoolsdir.com/product/mehzan-tools-hub?ref=badge",
      src: "https://thedevtoolsdir.com/badge/mehzan-tools-hub.svg",
      alt: "Featured on TheDevToolsDir",
      width: 182,
      height: 46,
      target: "_blank",
      rel: "dofollow",
    },
    {
      href: "https://thesaasdir.com/product/mehzan-tools-hub?ref=badge",
      src: "https://thesaasdir.com/badge/mehzan-tools-hub.svg",
      alt: "Featured on TheSaaSDir",
      width: 182,
      height: 46,
      target: "_blank",
      rel: "dofollow",
    },
    {
      href: "https://aiagentsdirectory.com/agent/mehzan-tools-hub",
      src: "https://aiagentsdirectory.com/featured-badge.svg?v=2024",
      alt: "Mehzan Tools Hub - Featured on AI Agents Directory",
      width: 200,
      height: 50,
      target: "_blank",
      rel: "noopener",
    },
    {
      href: "https://findly.tools/mehzan-tools-hub?utm_source=mehzan-tools-hub",
      src: "https://findly.tools/badges/findly-tools-badge-light.svg",
      alt: "Featured on Findly.tools",
      width: 175,
      height: 55,
      target: "_blank",
      rel: "noopener noreferrer",
    },
    {
      href: "https://alternativeto.net/software/mehzan-tools-hub/about/?utm_source=badge&utm_medium=referral",
      src: "https://alternativeto.net/static/badges/badge-compact-color.svg",
      alt: "Mehzan Tools Hub | AlternativeTo",
      width: 244,
      height: 79,
      target: "_blank",
      rel: "noopener",
    },
  ];

  return (
    <div className="w-full py-4 overflow-hidden relative bg-slate-900/5 dark:bg-slate-900/40 border-y border-slate-200/60 dark:border-slate-800/60 my-4 rounded-2xl">
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-slate-50 dark:from-slate-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-50 dark:from-slate-950 to-transparent z-10 pointer-events-none" />

      <div className="flex overflow-hidden">
        <div className="animate-marquee flex items-center space-x-8 shrink-0 px-4">
          {badges.map((b, idx) => (
            <a
              key={idx}
              href={b.href}
              target={b.target}
              rel={b.rel}
              className="transition-transform duration-300 hover:scale-105 shrink-0 opacity-95 hover:opacity-100 flex items-center"
              aria-label={b.alt}
            >
              <img
                src={b.src}
                alt={b.alt}
                width={b.width}
                height={b.height}
                loading="lazy"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = "none";
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = "inline-flex";
                }}
                style={{ height: "42px", width: "auto", display: "block" }}
              />
              <span
                style={{ display: "none" }}
                className="items-center px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-xs font-semibold text-indigo-600 dark:text-indigo-400 whitespace-nowrap"
              >
                ⭐ {b.alt}
              </span>
            </a>
          ))}
        </div>
        <div className="animate-marquee flex items-center space-x-8 shrink-0 px-4" aria-hidden="true">
          {badges.map((b, idx) => (
            <a
              key={`dup-${idx}`}
              href={b.href}
              target={b.target}
              rel={b.rel}
              className="transition-transform duration-300 hover:scale-105 shrink-0 opacity-95 hover:opacity-100 flex items-center"
              tabIndex={-1}
            >
              <img
                src={b.src}
                alt={b.alt}
                width={b.width}
                height={b.height}
                loading="lazy"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = "none";
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = "inline-flex";
                }}
                style={{ height: "42px", width: "auto", display: "block" }}
              />
              <span
                style={{ display: "none" }}
                className="items-center px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-xs font-semibold text-indigo-600 dark:text-indigo-400 whitespace-nowrap"
              >
                ⭐ {b.alt}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
