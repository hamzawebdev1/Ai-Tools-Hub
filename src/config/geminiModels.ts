export interface GeminiModelConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  isDefault?: boolean;
}

export const DEFAULT_GEMINI_MODELS: GeminiModelConfig[] = [
  {
    id: "gemini-3.6-flash",
    name: "Gemini 3.6 Flash",
    description: "Blazing fast & highly versatile for text generation, summaries & writing",
    enabled: true,
    isDefault: true,
  },
  {
    id: "gemini-3.1-flash-lite",
    name: "Gemini 3.1 Flash Lite",
    description: "Ultra-low latency lightweight model for rapid tasks",
    enabled: true,
  },
  {
    id: "gemini-3.1-pro-preview",
    name: "Gemini 3.1 Pro Preview",
    description: "Advanced reasoning, complex coding, and deep analytical tasks",
    enabled: true,
  },
];
