import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import cookieParser from "cookie-parser";
import compression from "compression";
import seoServerRoutes from "./src/server/seoServerRoutes";
import webAnalysisRoutes from "./src/server/webAnalysisRoutes";
import storageRoutes from "./src/server/storage/storageRoutes";
import authRoutes from "./src/server/security/authRoutes";
import adminRoutes from "./src/server/admin/adminRoutes";
import { injectSEOMetadataIntoHTML } from "./src/server/seoHtmlRenderer";
import { parseRoute } from "./src/services/routerService";
import { addContactMessage, addBugReport, addFeatureRequest } from "./src/server/admin/submissionsStore.js";
import { addSubscriber } from "./src/server/admin/cmsStore.js";
import { executeTool } from "./src/server/toolsExecutor.js";
import {
  configureSecurityHeaders,
  globalRateLimiter,
  inputSanitizerMiddleware,
  csrfProtectionMiddleware,
} from "./src/server/security/securityMiddleware";
import { CATEGORIES_DATA } from "./src/data/categoriesData";

const currentFile = typeof __filename !== "undefined" ? __filename : (typeof import.meta !== "undefined" && import.meta.url ? fileURLToPath(import.meta.url) : process.cwd());
const currentDir = typeof __dirname !== "undefined" ? __dirname : path.dirname(currentFile);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Trust proxy for reverse proxy / Cloud Run / nginx
  app.set("trust proxy", 1);

  // Gzip Compression for 95+ PageSpeed scores
  app.use(compression());

  // OWASP Security Headers & Middleware
  app.use(configureSecurityHeaders);

  // ==========================================
  // Canonical URL & Duplicate URL 301 Middleware
  // ==========================================
  app.use((req, res, next) => {
    // Skip static assets, Vite internal files, and API routes
    if (
      req.path.startsWith("/api/") ||
      req.path.startsWith("/@") ||
      req.path.startsWith("/src/") ||
      req.path.startsWith("/node_modules/") ||
      req.path.includes(".") // .js, .css, .png, .ico, .svg, .json, .xml, etc.
    ) {
      return next();
    }

    const host = req.get("host") || "";
    const proto = req.get("x-forwarded-proto") || req.protocol || "https";
    const isLocalOrContainer =
      host.includes("localhost") ||
      host.includes("127.0.0.1") ||
      host.endsWith(".run.app");

    // 1. Enforce HTTPS in production (on custom apex domains)
    if (req.get("x-forwarded-proto") === "http" && process.env.NODE_ENV === "production" && !isLocalOrContainer) {
      return res.redirect(301, `https://${host}${req.originalUrl}`);
    }

    // 2. Strip WWW prefix to guarantee canonical apex domain
    if (host.startsWith("www.")) {
      const apexHost = host.replace(/^www\./i, "");
      return res.redirect(301, `${proto}://${apexHost}${req.originalUrl}`);
    }

    // 3. Strip Trailing Slash (except root "/")
    if (req.path.length > 1 && req.path.endsWith("/")) {
      const cleanPath = req.path.replace(/\/+$/, "");
      const queryString = req.url.includes("?") ? `?${req.url.split("?")[1]}` : "";
      return res.redirect(301, `${cleanPath}${queryString}`);
    }

    // 4. Enforce Lowercase Path
    if (req.path !== req.path.toLowerCase()) {
      const cleanPath = req.path.toLowerCase();
      const queryString = req.url.includes("?") ? `?${req.url.split("?")[1]}` : "";
      return res.redirect(301, `${cleanPath}${queryString}`);
    }

    // 5. Query Parameter Route Redirects on Root & /tool /tools (e.g. /?tool=jpg-to-pdf -> /jpg-to-pdf, /tool?id=jpg-to-pdf -> /jpg-to-pdf)
    if (req.path === "/" || req.path === "/tool" || req.path === "/tools") {
      const toolParam = (req.query.tool || req.query.slug || req.query.id) as string;
      if (toolParam && typeof toolParam === "string") {
        const cleanSlug = toolParam.toLowerCase().trim();
        return res.redirect(301, `/${cleanSlug}`);
      }
      if (req.path === "/" && req.query.category) {
        const cat = req.query.category as string;
        if (cat && typeof cat === "string") {
          return res.redirect(301, `/category/${cat.toLowerCase().trim()}`);
        }
      }
      if (req.path === "/tool") {
        return res.redirect(301, `/tools`);
      }
    }

    // 6. Duplicate Prefix Aliases 301 Redirection
    // /tools/:slug or /tool/:slug -> /:slug (or /category/:slug)
    if (req.path.startsWith("/tools/") || req.path.startsWith("/tool/")) {
      const rawSlug = req.path.replace(/^\/(tools|tool)\//, "").toLowerCase().trim();
      if (rawSlug) {
        const isCat = CATEGORIES_DATA.some((c) => c.slug === rawSlug || c.id === rawSlug);
        if (isCat) {
          return res.redirect(301, `/category/${rawSlug}`);
        }
        return res.redirect(301, `/${rawSlug}`);
      }
    }

    // /categories/:slug -> /category/:slug
    if (req.path.startsWith("/categories/")) {
      const rawSlug = req.path.replace(/^\/categories\//, "").toLowerCase().trim();
      if (rawSlug) {
        return res.redirect(301, `/category/${rawSlug}`);
      }
    }

    // 7. Language Prefix Redirect
    if (/^\/[a-z]{2}\//.test(req.path)) {
      const cleanPath = req.path.replace(/^\/[a-z]{2}/, "");
      return res.redirect(301, cleanPath || "/");
    }

    // Static route alias redirects
    const STATIC_REDIRECTS: Record<string, string> = {
      "/all-tools": "/tools",
      "/about-us": "/about",
      "/contact-us": "/contact",
      "/privacy-policy": "/privacy",
      "/terms-of-service": "/terms",
      "/terms-and-conditions": "/terms",
      "/cookies": "/cookie-policy",
      "/cookie": "/cookie-policy",
      "/disclaimers": "/disclaimer",
      "/signup": "/register",
      "/signin": "/login",
    };

    if (STATIC_REDIRECTS[req.path]) {
      const queryString = req.url.includes("?") ? `?${req.url.split("?")[1]}` : "";
      return res.redirect(301, `${STATIC_REDIRECTS[req.path]}${queryString}`);
    }

    next();
  });
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

  // Newsletter endpoint
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
      console.error("⚠️ Error processing /api/newsletter/subscribe:", err);
      return res.status(500).json({ success: false, error: "Failed to process newsletter subscription." });
    }
  });

  // Contact message endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, subject, category, message, attachmentName, recaptchaVerified } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({ success: false, error: "Name, email, and message are required." });
      }
      const clientIp = (req.headers["x-forwarded-for"] as string) || req.ip || "127.0.0.1";
      const userAgent = req.headers["user-agent"] || "";

      console.log(`[CONTACT INCOMING] From: ${email} (${name}) | Subject: ${subject} | IP: ${clientIp}`);

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
      console.error("⚠️ Error processing /api/contact:", err);
      return res.status(500).json({ success: false, error: "Failed to store contact message. Please try again." });
    }
  });

  // Tool problem report endpoint
  app.post("/api/reports", async (req, res) => {
    try {
      const { toolName, pageUrl, userEmail, issueType, description, screenshotName } = req.body;
      if (!toolName || !description) {
        return res.status(400).json({ success: false, error: "Tool name and description are required." });
      }
      const clientIp = (req.headers["x-forwarded-for"] as string) || req.ip || "127.0.0.1";
      console.log(`[REPORT INCOMING] Tool: ${toolName} | Issue: ${issueType} | From: ${userEmail}`);

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
      console.error("⚠️ Error processing /api/reports:", err);
      return res.status(500).json({ success: false, error: "Failed to log problem report." });
    }
  });

  // Feature request endpoint
  app.post("/api/feature-requests", async (req, res) => {
    try {
      const { toolName, description, category, priority, userEmail, userName, userId } = req.body;
      if (!toolName || !description) {
        return res.status(400).json({ success: false, error: "Tool name and description are required." });
      }
      console.log(`[FEATURE REQUEST INCOMING] Tool: ${toolName} | Priority: ${priority} | From: ${userEmail || userName}`);

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
      console.error("⚠️ Error processing /api/feature-requests:", err);
      return res.status(500).json({ success: false, error: "Failed to submit feature request." });
    }
  });

  // Unified Tool Execution Endpoint (Sub-300ms Deterministic Local Code Engine)
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
      console.error("⚠️ Error in /api/tools/execute:", err);
      return res.status(500).json({
        success: false,
        output: "",
        wordsCount: 0,
        executionTimeMs: 0,
        error: err.message || "Failed to execute tool.",
      });
    }
  });

  // Feedback / Suggestion endpoint
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

  // Dynamic HTML Pre-Rendering Engine for Search Crawlers & Previews
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });

    app.use(async (req, res, next) => {
      if (
        req.method === "GET" &&
        !req.path.startsWith("/api/") &&
        !req.path.startsWith("/@") &&
        !req.path.startsWith("/src/") &&
        !req.path.startsWith("/node_modules/") &&
        !req.path.includes(".")
      ) {
        try {
          const rawHtml = fs.readFileSync(path.join(process.cwd(), "index.html"), "utf-8");
          const template = await vite.transformIndexHtml(req.originalUrl, rawHtml);
          const host = req.get("host") || "";
          const proto = req.get("x-forwarded-proto") || req.protocol || "https";
          const queryStr = req.url.includes("?") ? req.url.split("?")[1] : "";
          const routeState = parseRoute(req.path, queryStr);
          const statusCode = (routeState.isNotFound || routeState.tab === "404") ? 404 : 200;

          const injectedHtml = injectSEOMetadataIntoHTML(template, req.path, queryStr, host, proto);
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          return res.status(statusCode).send(injectedHtml);
        } catch (e) {
          return next(e);
        }
      }
      next();
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    const indexPath = path.join(distPath, "index.html");

    app.use(
      express.static(distPath, {
        index: false,
        maxAge: "1d",
        setHeaders: (res, filePath) => {
          if (filePath.includes("/assets/")) {
            res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
          } else if (filePath.endsWith(".html")) {
            res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
          } else {
            res.setHeader("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");
          }
        },
      })
    );

    app.get("*", (req, res) => {
      try {
        const rawHtml = fs.readFileSync(indexPath, "utf-8");
        const host = req.get("host") || "";
        const proto = req.get("x-forwarded-proto") || req.protocol || "https";
        const queryStr = req.url.includes("?") ? req.url.split("?")[1] : "";
        const routeState = parseRoute(req.path, queryStr);
        const statusCode = (routeState.isNotFound || routeState.tab === "404") ? 404 : 200;

        const injectedHtml = injectSEOMetadataIntoHTML(rawHtml, req.path, queryStr, host, proto);
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        return res.status(statusCode).send(injectedHtml);
      } catch (err) {
        return res.status(404).sendFile(indexPath);
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
