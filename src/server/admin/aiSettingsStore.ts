import { DEFAULT_GEMINI_MODELS, GeminiModelConfig } from "../../config/geminiModels";

export interface AISettingsState {
  aiEnabled: boolean;
  defaultModel: string;
  models: GeminiModelConfig[];
  stats: {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    rateLimitErrors: number;
  };
  failedRequestsLog: Array<{
    id: string;
    timestamp: string;
    toolName: string;
    model: string;
    error: string;
    status: number;
  }>;
}

let aiSettingsStore: AISettingsState = {
  aiEnabled: true,
  defaultModel: "gemini-3.6-flash",
  models: DEFAULT_GEMINI_MODELS,
  stats: {
    totalRequests: 1420,
    successfulRequests: 1395,
    failedRequests: 25,
    rateLimitErrors: 8,
  },
  failedRequestsLog: [
    {
      id: "err_1",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      toolName: "AI Text Paraphraser",
      model: "gemini-3.1-pro-preview",
      error: "429 Too Many Requests (Rate limit exceeded)",
      status: 429,
    },
    {
      id: "err_2",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      toolName: "AI Blog Article Generator",
      model: "gemini-3.1-flash-lite",
      error: "503 Service Temporarily Overloaded",
      status: 503,
    },
  ],
};

export const getAISettings = () => aiSettingsStore;

export const updateAISettings = (newSettings: Partial<AISettingsState>) => {
  aiSettingsStore = { ...aiSettingsStore, ...newSettings };
  return aiSettingsStore;
};

export const recordAIRequest = (success: boolean, isRateLimit = false, errorDetails?: { toolName: string; model: string; error: string; status: number }) => {
  aiSettingsStore.stats.totalRequests += 1;
  if (success) {
    aiSettingsStore.stats.successfulRequests += 1;
  } else {
    aiSettingsStore.stats.failedRequests += 1;
    if (isRateLimit) {
      aiSettingsStore.stats.rateLimitErrors += 1;
    }
    if (errorDetails) {
      aiSettingsStore.failedRequestsLog.unshift({
        id: "err_" + Date.now(),
        timestamp: new Date().toISOString(),
        ...errorDetails,
      });
      // Keep last 50 logs
      if (aiSettingsStore.failedRequestsLog.length > 50) {
        aiSettingsStore.failedRequestsLog.pop();
      }
    }
  }
};
