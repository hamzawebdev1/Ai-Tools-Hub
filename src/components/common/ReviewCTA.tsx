import React from 'react';
import { ExternalLink, Star, MessageSquare } from 'lucide-react';

export const ReviewCTA: React.FC = () => {
  const trustpilotUrl = 'https://www.trustpilot.com/review/mehzandigital.com';
  const googleUrl = 'https://www.google.com/search?q=Mehzan+Tools+Hub&stick=H4sIAAAAAAAA_-NgU1I1qDC2NLQ0ME8zMDQyTU1KtUyxMqhINEpLMkgxM0yyNEtKMTJJXsQq4JuaUZWYpxCSn59TrOBRmgQA4kQEQzwAAAA&hl=en-GB&mat=CZy-uBxieYntElcBa0lj_0r0wEXXYyH0DDNDnnK5o-jrSON9WgqgkQ_o_zH00e84uQ6OyiEp2Mm-awbUKDSshbC0EKJwypWg6JczFukG5JN9PgDTBKwyFekQbGZjYr73jY&authuser=0#lrd=0x391907f0125ebe9d:0xa2fb0d61b96bd24c,3,,,,';

  return (
    <section className="my-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-50/80 via-white to-slate-50 dark:from-slate-900/80 dark:via-slate-900 dark:to-slate-800 border border-indigo-100/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
      <div className="max-w-3xl mx-auto text-center space-y-4 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold tracking-wide">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Share Your Experience</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Help Us Improve Mehzan Digital
        </h3>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
          Enjoying Mehzan Digital? We'd love to hear about your experience. Share your honest feedback with us on Trustpilot or Google to help us build better tools for everyone.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href={trustpilotUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#00b67a] hover:bg-[#009e6a] text-white text-xs sm:text-sm font-semibold shadow-sm transition-all duration-200 transform hover:-translate-y-0.5"
          >
            <span>Review us on Trustpilot</span>
            <ExternalLink className="w-4 h-4 opacity-90" />
          </a>

          <a
            href={googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 text-slate-800 dark:text-white text-xs sm:text-sm font-semibold shadow-sm transition-all duration-200 transform hover:-translate-y-0.5"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.19v3.15C3.17 21.32 7.24 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.19C.43 8.1 0 9.99 0 12s.43 3.9 1.19 5.42l4.09-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.24 0 3.17 2.68 1.19 6.58l4.09 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Review us on Google</span>
            <ExternalLink className="w-4 h-4 opacity-70" />
          </a>
        </div>
      </div>
    </section>
  );
};
