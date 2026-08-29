import express from "express";
import path from "path";
import fs from "fs";
import cookieParser from "cookie-parser";
import compression from "compression";
import seoServerRoutes from "../src/server/seoServerRoutes";
import webAnalysisRoutes from "../src/server/webAnalysisRoutes";
import storageRoutes from "../src/server/storage/storageRoutes";
import authRoutes from "../src/server/security/authRoutes";
import adminRoutes from "../src/server/admin/adminRoutes";
import { injectSEOMetadataIntoHTML } from "../src/server/seoHtmlRenderer";
import { addContactMessage, addBugReport, addFeatureRequest } from "../src/server/admin/submissionsStore.js";
import { addSubscriber } from "../src/server/admin/cmsStore.js";
import { executeTool } from "../src/server/toolsExecutor.js";
import {
  configureSecurityHeaders,
  globalRateLimiter,
  inputSanitizerMiddleware,
  csrfProtectionMiddleware,
} from "../src/server/security/securityMiddleware";
import { CATEGORIES_DATA } from "../src/data/categoriesData";

const app = express();

app.set("trust proxy", 1);
app.use(compression());
app.use(configureSecurityHeaders);

// Canonical & Redirect Middleware
app.use((req, res, next) => {
  if (
    req.path.startsWith("/api/") ||
    req.path.startsWith("/@") ||
    req.path.startsWith("/src/") ||
    req.path.startsWith("/node_modules/") ||
    req.path.includes(".")
  ) {
    return next();
  }

  const host = req.get("host") || "";
  const proto = req.get("x-forwarded-proto") || req.protocol || "https";

  if (host.startsWith("www.")) {
    const apexHost = host.replace(/^www\./i, "");
    return res.redirect(301, `${proto}://${apexHost}${req.originalUrl}`);
  }

  if (req.path.length > 1 && req.path.endsWith("/")) {
    const cleanPath = req.path.replace(/\/+$/, "");
    const queryString = req.url.includes("?") ? `?${req.url.split("?")[1]}` : "";
    return res.redirect(301, `${cleanPath}${queryString}`);
  }

  if (req.path !== req.path.toLowerCase()) {
    const cleanPath = req.path.toLowerCase();
    const queryString = req.url.includes("?") ? `?${req.url.split("?")[1]}` : "";
    return res.redirect(301, `${cleanPath}${queryString}`);
  }

  next();
});

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(globalRateLimiter);
app.use(inputSanitizerMiddleware);
app.use(csrfProtectionMiddleware);

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/storage", storageRoutes);
app.use(seoServerRoutes);
app.use(webAnalysisRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.post("/api/newsletter/subscribe", (req, res) => {
  try {
    const { email, name, source } = req.body;
    if (!email || !email.includes("@")) {
      return res.status(400).json({ success: false, error: "Valid email address required" });
    }
    const result = addSubscriber(email, source || "site_footer", name);
    if (!result.success) {
      return res.status(400).json({ success: false, error: result.error });
    }
    return res.json({
      success: true,
      alreadySubscribed: !!result.alreadySubscribed,
      message: result.alreadySubscribed
        ? "You are already subscribed to the newsletter!"
        : "Thank you for subscribing to Mehzan Tools Hub newsletter!",
      subscriber: result.subscriber,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: "Failed to process newsletter subscription." });
  }
});

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, subject, category, message, attachmentName, recaptchaVerified } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: "Name, email, and message are required." });
    }
    const clientIp = (req.headers["x-forwarded-for"] as string) || req.ip || "127.0.0.1";
    const userAgent = req.headers["user-agent"] || "";

    const item = await addContactMessage({
      name,
      email,
      subject: subject || "General Support",
      category: category || "General Support",
      message,
      attachmentName,
      recaptchaVerified: !!recaptchaVerified,
      ip: clientIp,
      userAgent,
    });

    return res.json({ success: true, referenceId: item.referenceId, message: "Contact message stored successfully." });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: "Failed to store contact message." });
  }
});

app.post("/api/reports", async (req, res) => {
  try {
    const { toolName, pageUrl, userEmail, issueType, description, screenshotName } = req.body;
    if (!toolName || !description) {
      return res.status(400).json({ success: false, error: "Tool name and description are required." });
    }
    const clientIp = (req.headers["x-forwarded-for"] as string) || req.ip || "127.0.0.1";

    const item = await addBugReport({
      toolName,
      pageUrl: pageUrl || "/",
      userEmail: userEmail || "anonymous@mehzandigital.com",
      issueType: issueType || "Bug",
      description,
      screenshotName,
      ip: clientIp,
    });
    return res.json({ success: true, referenceId: item.referenceId, message: "Problem report logged successfully." });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: "Failed to log problem report." });
  }
});

app.post("/api/feature-requests", async (req, res) => {
  try {
    const { toolName, description, category, priority, userEmail, userName, userId } = req.body;
    if (!toolName || !description) {
      return res.status(400).json({ success: false, error: "Tool name and description are required." });
    }

    const item = await addFeatureRequest({
      toolName,
      description,
      category: category || "General",
      priority: priority || "Medium",
      userEmail: userEmail || "anonymous@mehzandigital.com",
      userName: userName || undefined,
      userId: userId || undefined,
    });
    return res.json({ success: true, referenceId: item.referenceId, message: "Feature request submitted successfully.", featureRequest: item });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: "Failed to submit feature request." });
  }
});

app.post("/api/tools/execute", async (req, res) => {
  try {
    const { toolId, toolName, prompt, options } = req.body;
    if (!toolId || !prompt) {
      return res.status(400).json({ success: false, error: "Tool ID and prompt are required." });
    }

    const result = await executeTool({
      toolId,
      toolName: toolName || toolId,
      prompt,
      options,
    });

    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      output: "",
      wordsCount: 0,
      executionTimeMs: 0,
      error: err.message || "Failed to execute tool.",
    });
  }
});

app.post("/api/feedback", async (req, res) => {
  try {
    const { type, message, email, toolTitle, category, description } = req.body;
    if (type === "suggest-tool" && toolTitle) {
      const item = await addFeatureRequest({
        toolName: toolTitle,
        description: description || toolTitle,
        category: category || "General",
        priority: "Medium",
        userEmail: email || "anonymous@mehzandigital.com",
      });
      return res.json({ success: true, referenceId: item.referenceId, message: "Tool suggestion stored successfully." });
    }
    if (!message) {
      return res.status(400).json({ error: "Message content required" });
    }
    const item = await addContactMessage({
      name: email ? email.split("@")[0] : "Anonymous User",
      email: email || "anonymous@mehzandigital.com",
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
  } catch (err: any) {
    return res.status(500).json({ success: false, error: "Failed to record feedback." });
  }
});

export default app;
