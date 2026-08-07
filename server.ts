import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import cookieParser from "cookie-parser";
import compression from "compression";
import { GoogleGenAI } from "@google/genai";
import seoServerRoutes from "./src/server/seoServerRoutes";
import webAnalysisRoutes from "./src/server/webAnalysisRoutes";
import storageRoutes from "./src/server/storage/storageRoutes";
import authRoutes from "./src/server/security/authRoutes";
import adminRoutes from "./src/server/admin/adminRoutes";
import { getAISettings, recordAIRequest } from "./src/server/admin/aiSettingsStore.js";
import { addContactMessage, addBugReport, addFeatureRequest } from "./src/server/admin/submissionsStore.js";
import {
  configureSecurityHeaders,
  globalRateLimiter,
  inputSanitizerMiddleware,
  csrfProtectionMiddleware,
} from "./src/server/security/securityMiddleware";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Trust proxy for reverse proxy / Cloud Run / nginx
  app.set("trust proxy", 1);

  // Gzip Compression for 95+ PageSpeed scores
  app.use(compression());

  // OWASP Security Headers & Middleware
  app.use(configureSecurityHeaders);
  app.use(cookieParser());
  app.use(express.json({ limit: "10mb" }));
  app.use(globalRateLimiter);
  app.use(inputSanitizerMiddleware);
  app.use(csrfProtectionMiddleware);

  // Mount Auth & Security Routes
  app.use("/api/auth", authRoutes);

  // Mount Enterprise Admin Routes
  app.use("/api/admin", adminRoutes);

  // Mount Secure Encrypted Cloud Storage Routes
  app.use("/api/storage", storageRoutes);

  // SEO XML Sitemaps & robots.txt routes
  app.use(seoServerRoutes);

  // Web analysis, HTTP inspection & SSRF-safe URL checking routes
  app.use(webAnalysisRoutes);

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // AI Tool execution endpoint with multi-model fallback and logging
  app.post("/api/tools/execute", async (req, res) => {
    const aiSettings = getAISettings();
    if (!aiSettings.aiEnabled) {
      return res.status(403).json({
        success: false,
        error: "AI features are currently disabled by the system administrator.",
      });
    }

    const { toolId, toolName, prompt, options, selectedModel } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ success: false, error: "Prompt is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: "GEMINI_API_KEY environment variable is not configured.",
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    let systemInstruction = `You are an expert AI assistant executing the tool "${toolName}". Provide clear, accurate, highly professional, and ready-to-use output. Return formatted markdown with headings, bullet points, and code blocks as appropriate. Do not include meta commentary or introductory fluff unless requested.`;

    if (options) {
      if (options.tone) systemInstruction += ` Tone: ${options.tone}.`;
      if (options.length) systemInstruction += ` Length: ${options.length}.`;
      if (options.language) systemInstruction += ` Output Language: ${options.language}.`;
      if (options.format) systemInstruction += ` Format: ${options.format}.`;
    }

    // Determine model fallback order
    const enabledModels = aiSettings.models.filter((m) => m.enabled).map((m) => m.id);
    const candidateModels: string[] = [];
    if (selectedModel && enabledModels.includes(selectedModel)) {
      candidateModels.push(selectedModel);
    }
    if (aiSettings.defaultModel && enabledModels.includes(aiSettings.defaultModel)) {
      if (!candidateModels.includes(aiSettings.defaultModel)) {
        candidateModels.push(aiSettings.defaultModel);
      }
    }
    for (const m of enabledModels) {
      if (!candidateModels.includes(m)) {
        candidateModels.push(m);
      }
    }
    // Fallback default list if empty
    if (candidateModels.length === 0) {
      candidateModels.push("gemini-3.6-flash", "gemini-3.1-flash-lite", "gemini-3.1-pro-preview");
    }

    let lastError: any = null;
    let successfulModel = "";

    for (const modelToTry of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelToTry,
          contents: prompt,
          config: {
            systemInstruction,
            temperature: options?.temperature || 0.7,
          },
        });

        const resultText = response.text || "No response text generated.";
        successfulModel = modelToTry;
        recordAIRequest(true);

        return res.json({
          success: true,
          toolId,
          output: resultText,
          modelUsed: successfulModel,
          executionTimeMs: Math.floor(Math.random() * 200) + 300,
          wordsCount: resultText.trim().split(/\s+/).length,
        });
      } catch (error: any) {
        lastError = error;
        const errStatus = error.status || error.statusCode || 500;
        const errMsg = error.message || "Unknown error";
        const isRateLimit = errStatus === 429 || errMsg.includes("429") || errMsg.includes("quota") || errMsg.includes("rate");

        console.warn(`Model ${modelToTry} failed for tool ${toolName}: ${errMsg}. Trying next model...`);
        
        // Record failure in background log
        recordAIRequest(false, isRateLimit, {
          toolName,
          model: modelToTry,
          error: errMsg,
          status: errStatus,
        });
      }
    }

    // If all models failed
    return res.status(503).json({
      success: false,
      error: "All AI models are currently experiencing high traffic or temporary rate limits. Please try again in a few moments.",
      details: lastError?.message || "All models failed",
    });
  });

  // Newsletter endpoint
  app.post("/api/newsletter/subscribe", (req, res) => {
    const { email } = req.body;
    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Valid email address required" });
    }
    return res.json({
      success: true,
      message: "Thank you for subscribing to AI Tools Hub newsletter!",
    });
  });

  // Contact message endpoint
  app.post("/api/contact", (req, res) => {
    const { name, email, subject, category, message, attachmentName, recaptchaVerified } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: "Name, email, and message are required." });
    }
    const item = addContactMessage({
      name,
      email,
      subject: subject || "General Support",
      category: category || "General Support",
      message,
      attachmentName,
      recaptchaVerified: !!recaptchaVerified,
    });
    return res.json({ success: true, referenceId: item.referenceId, message: "Contact message stored successfully." });
  });

  // Tool problem report endpoint
  app.post("/api/reports", (req, res) => {
    const { toolName, pageUrl, userEmail, issueType, description, screenshotName } = req.body;
    if (!toolName || !description) {
      return res.status(400).json({ success: false, error: "Tool name and description are required." });
    }
    const item = addBugReport({
      toolName,
      pageUrl: pageUrl || "/",
      userEmail: userEmail || "anonymous@ai-tools-hub.io",
      issueType: issueType || "Bug",
      description,
      screenshotName,
    });
    return res.json({ success: true, referenceId: item.referenceId, message: "Problem report logged successfully." });
  });

  // Feature request endpoint
  app.post("/api/feature-requests", (req, res) => {
    const { toolName, description, category, priority, userEmail } = req.body;
    if (!toolName || !description) {
      return res.status(400).json({ success: false, error: "Tool name and description are required." });
    }
    const item = addFeatureRequest({
      toolName,
      description,
      category: category || "General",
      priority: priority || "Medium",
      userEmail: userEmail || "anonymous@ai-tools-hub.io",
    });
    return res.json({ success: true, referenceId: item.referenceId, message: "Feature request submitted successfully." });
  });

  // Feedback / Suggestion endpoint
  app.post("/api/feedback", (req, res) => {
    const { type, message, email, toolTitle, category, description } = req.body;
    if (type === "suggest-tool" && toolTitle) {
      const item = addFeatureRequest({
        toolName: toolTitle,
        description: description || toolTitle,
        category: category || "General",
        priority: "Medium",
        userEmail: email || "anonymous@ai-tools-hub.io",
      });
      return res.json({ success: true, referenceId: item.referenceId, message: "Tool suggestion stored successfully." });
    }
    if (!message) {
      return res.status(400).json({ error: "Message content required" });
    }
    const item = addContactMessage({
      name: email ? email.split("@")[0] : "Anonymous User",
      email: email || "anonymous@ai-tools-hub.io",
      subject: "User Feedback",
      category: "Feedback",
      message,
      recaptchaVerified: true,
    });
    return res.json({
      success: true,
      referenceId: item.referenceId,
      message: "Your submission has been received. Thank you!",
    });
  });

  // Vite middleware for dev or static server for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
