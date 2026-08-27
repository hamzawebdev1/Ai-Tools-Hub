import { recordToolExecution } from "./admin/submissionsStore.js";

export interface ExecuteToolParams {
  toolId: string;
  toolName: string;
  prompt: string;
  options?: {
    tone?: string;
    length?: string;
    language?: string;
    [key: string]: any;
  };
}

/**
 * 100% Self-Contained, Independent, Deterministic Text & Utility Processing Engine
 * Operates purely on local JavaScript logic with zero external AI/cloud API dependencies.
 */
export async function executeTool(params: ExecuteToolParams): Promise<{
  success: boolean;
  output: string;
  wordsCount: number;
  executionTimeMs: number;
  error?: string;
}> {
  const startTime = Date.now();
  const { toolId, toolName, prompt, options = {} } = params;

  if (!prompt || !prompt.trim()) {
    return {
      success: false,
      output: "",
      wordsCount: 0,
      executionTimeMs: 0,
      error: "Input text/prompt is required.",
    };
  }

  try {
    const output = generateLocalTransformation(toolId, toolName, prompt, options);
    const executionTimeMs = Date.now() - startTime;
    const wordsCount = output.trim().split(/\s+/).filter(Boolean).length;

    await recordToolExecution(toolId, toolName, true);

    return {
      success: true,
      output,
      wordsCount,
      executionTimeMs,
    };
  } catch (err: any) {
    const executionTimeMs = Date.now() - startTime;
    await recordToolExecution(toolId, toolName, false, err?.message);
    return {
      success: false,
      output: "",
      wordsCount: 0,
      executionTimeMs,
      error: err?.message || "Tool execution failed.",
    };
  }
}

function generateLocalTransformation(toolId: string, toolName: string, prompt: string, options: any): string {
  const tone = options.tone || "Professional";
  const trimmed = prompt.trim();

  if (toolId.includes("case") || toolId.includes("uppercase") || toolId.includes("lowercase")) {
    if (toolId.includes("upper")) return trimmed.toUpperCase();
    if (toolId.includes("lower")) return trimmed.toLowerCase();
    return trimmed.replace(/\b\w/g, (c) => c.toUpperCase());
  }

  if (toolId.includes("clean") || toolId.includes("whitespace")) {
    return trimmed.replace(/[ \t]+/g, " ").replace(/\n\s*\n/g, "\n\n");
  }

  if (toolId.includes("slug")) {
    return trimmed
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  if (toolId.includes("reverse")) {
    return trimmed.split("").reverse().join("");
  }

  return `[${toolName} - ${tone}]\n\n` + trimmed;
}
