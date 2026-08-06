import React, { useState } from "react";
import { History, Trash2, Copy, Check, Clock, Sparkles } from "lucide-react";
import { HistoryItem } from "../types";
import { clearHistory } from "../services/storageService";
import { Breadcrumb } from "../components/layout/Breadcrumb";
import { AdBanner } from "../components/layout/AdBanner";
import { SchemaHead } from "../components/layout/SchemaHead";

interface HistoryPageProps {
  history: HistoryItem[];
  setHistory: (h: HistoryItem[]) => void;
  setActiveTab: (tab: string) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  history,
  setHistory,
  setActiveTab,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearAll = () => {
    if (confirm("Are you sure you want to delete all execution history logs?")) {
      clearHistory();
      setHistory([]);
    }
  };

  return (
    <>
      <SchemaHead
        title="Execution History Log - AI Tools Hub"
        description="Review, search, and copy past AI outputs generated during your session. Auto-purges after 24 hours."
      />

      <div className="space-y-6 pb-16">
        <Breadcrumb items={[{ label: "Execution History", active: true }]} />

        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <History className="w-6 h-6 text-indigo-500" />
              AI Output History Log
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Transient history of your recent AI tool generations ({history.length} items)
            </p>
          </div>

          {history.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 hover:bg-rose-500/20 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        <AdBanner placement="header" slotId="history-top-ad" />

        {history.length === 0 ? (
          <div className="py-16 text-center space-y-3 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
            <History className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
              No History Logged
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Your recent prompt outputs will automatically display here for 24 hours so you can easily review and copy them.
            </p>
            <button
              onClick={() => setActiveTab("all-tools")}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs cursor-pointer shadow-md"
            >
              Try An AI Tool Now
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 space-y-3 shadow-xs"
              >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs text-indigo-600 dark:text-indigo-400 px-2.5 py-0.5 rounded-lg bg-indigo-500/10">
                      {item.toolName}
                    </span>
                    <span className="text-[11px] text-slate-400">{item.timestamp}</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1 text-emerald-500 font-mono text-[11px]">
                      <Clock className="w-3.5 h-3.5" /> {item.executionTimeMs}ms
                    </span>
                    <button
                      onClick={() => handleCopy(item.id, item.output)}
                      className="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-500">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Output</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-bold text-slate-500 dark:text-slate-400 block mb-0.5">Prompt Input:</span>
                    <p className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                      {item.prompt}
                    </p>
                  </div>

                  <div>
                    <span className="font-bold text-slate-500 dark:text-slate-400 block mb-0.5">AI Output:</span>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-mono text-[11px] whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                      {item.output}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
