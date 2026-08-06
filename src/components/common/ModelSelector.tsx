import React, { useState, useEffect } from "react";
import { Zap, ChevronDown, Sparkles } from "lucide-react";
import { DEFAULT_GEMINI_MODELS, GeminiModelConfig } from "../../config/geminiModels";

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  className?: string;
  compact?: boolean;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  onModelChange,
  className = "",
  compact = false,
}) => {
  const [models, setModels] = useState<GeminiModelConfig[]>(DEFAULT_GEMINI_MODELS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch latest admin-configured models if available
    const fetchModels = async () => {
      try {
        const res = await fetch("/api/admin/ai-settings");
        const data = await res.json();
        if (data.success && data.settings?.models) {
          setModels(data.settings.models.filter((m: GeminiModelConfig) => m.enabled));
        }
      } catch (e) {
        // Fallback to default models
        setModels(DEFAULT_GEMINI_MODELS.filter((m) => m.enabled));
      }
    };
    fetchModels();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    onModelChange(val);
    localStorage.setItem("preferred_gemini_model", val);
  };

  const currentModel = models.find((m) => m.id === selectedModel) || models[0] || DEFAULT_GEMINI_MODELS[0];

  if (compact) {
    return (
      <div className={`relative flex items-center ${className}`}>
        <div className="absolute left-3 pointer-events-none text-indigo-500">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <select
          value={selectedModel}
          onChange={handleChange}
          aria-label="Select Gemini model"
          className="w-full pl-9 pr-8 py-2 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/80 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer appearance-none shadow-sm"
        >
          {models.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
        <div className="absolute right-3 pointer-events-none text-slate-400">
          <ChevronDown className="w-3.5 h-3.5" />
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-indigo-500" /> Active Google Gemini AI Model
        </label>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 font-bold">
          Auto-Fallback Enabled
        </span>
      </div>

      <div className="relative">
        <select
          value={selectedModel}
          onChange={handleChange}
          aria-label="Select Gemini model"
          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer appearance-none shadow-sm"
        >
          {models.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} — {m.description}
            </option>
          ))}
        </select>
        <div className="absolute right-3.5 top-3.5 pointer-events-none text-slate-400">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      <p className="text-[11px] text-slate-500 dark:text-slate-400">
        Currently using <strong className="text-indigo-600 dark:text-indigo-400">{currentModel?.name}</strong>. Preference is securely saved in your browser.
      </p>
    </div>
  );
};
