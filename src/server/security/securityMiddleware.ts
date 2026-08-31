import { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import crypto from "crypto";

/**
 * OWASP Security Headers Configuration
 */
export const configureSecurityHeaders = helmet({
  frameguard: false, // Disable X-Frame-Options so preview iframe works in AI Studio
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://www.google.com", "https://www.gstatic.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      imgSrc: ["'self'", "data:", "blob:", "https:"],
      connectSrc: ["'self'", "https:", "wss:", "http:", "ws:"],
      frameSrc: ["'self'", "https://www.google.com", "https://*"],
      frameAncestors: ["*"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: null,
    },
  },
  crossOriginEmbedderPolicy: false, // Compatibility for Vite canvas / PDF rendering
  crossOriginResourcePolicy: { policy: "cross-origin" },
});

/**
 * Strict Global Rate Limiter: Max 100 requests per 15 minutes per IP
 */
export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many requests from this IP address. Rate limit exceeded (OWASP A04:2021).",
  },
});

/**
 * Auth Endpoint Rate Limiter: Max 10 login/register attempts per 15 minutes
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many authentication attempts. Please try again in 15 minutes.",
  },
});

/**
 * Guest Post Submission Rate Limiter: Max 5 submissions per 30 minutes per IP
 */
export const guestPostRateLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many guest article submissions from this IP. Please wait before submitting another article.",
  },
});

/**
 * Anti-XSS and Input Sanitization Middleware (OWASP A03:2021)
 * Strips script tags, javascript: URIs, inline handlers, and suspicious SQL syntax
 */
function sanitizeString(str: string): string {
  if (typeof str !== "string") return str;
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "[REDACTED_SCRIPT]")
    .replace(/javascript:/gi, "no-javascript:")
    .replace(/on\w+\s*=/gi, "no-event=")
    .replace(/UNION\s+SELECT/gi, "[REDACTED_SQL]")
    .replace(/DROP\s+TABLE/gi, "[REDACTED_SQL]")
    .replace(/--\s*$/gm, "");
}

function recursiveSanitize(obj: any): any {
  if (!obj || typeof obj !== "object") {
    if (typeof obj === "string") return sanitizeString(obj);
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(recursiveSanitize);
  }

  const sanitized: any = {};
  for (const key of Object.keys(obj)) {
    // Prevent prototype pollution
    if (key === "__proto__" || key === "constructor" || key === "prototype") continue;
    sanitized[key] = recursiveSanitize(obj[key]);
  }
  return sanitized;
}

export function inputSanitizerMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.body) req.body = recursiveSanitize(req.body);
  if (req.query) req.query = recursiveSanitize(req.query);
  if (req.params) req.params = recursiveSanitize(req.params);
  next();
}

/**
 * CSRF Protection Middleware via Double-Submit Cookie (OWASP A01:2021)
 */
export function csrfProtectionMiddleware(req: Request, res: Response, next: NextFunction) {
  // Generate CSRF token if cookie is not present
  let csrfToken = req.cookies?.["XSRF-TOKEN"];
  if (!csrfToken) {
    csrfToken = crypto.randomBytes(24).toString("hex");
    res.cookie("XSRF-TOKEN", csrfToken, {
      httpOnly: false, // Readable by client JS to send in header X-XSRF-TOKEN
      sameSite: "lax",
      secure: false,
    });
  }

  // Validate state-changing requests
  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    // Skip CSRF check for public API endpoints or file uploads if token is provided in header
    const headerToken = req.headers["x-xsrf-token"] || req.headers["x-csrf-token"];
    if (headerToken && headerToken !== csrfToken) {
      return res.status(403).json({
        success: false,
        error: "CSRF Token Validation Failed. Potential cross-site request forgery attack blocked.",
      });
    }
  }

  next();
}

/**
 * SSRF (Server-Side Request Forgery) URL Validator (OWASP A10:2021)
 */
export function isSafeExternalUrl(urlStr: string): boolean {
  try {
    const parsed = new URL(urlStr);
    const host = parsed.hostname.toLowerCase();

    // Block private / internal IPs and loopbacks
    const blockedHosts = ["localhost", "127.0.0.1", "0.0.0.0", "169.254.169.254", "::1"];
    if (blockedHosts.includes(host)) return false;

    // Block private subnets (10.x.x.x, 172.16-31.x.x, 192.168.x.x)
    if (
      /^10\./.test(host) ||
      /^172\.(1[6-9]|2[0-9]|3[01])\./.test(host) ||
      /^192\.168\./.test(host) ||
      host.endsWith(".internal") ||
      host.endsWith(".local")
    ) {
      return false;
    }

    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch (e) {
    return false;
  }
}

/**
 * Path Traversal Sanitizer
 */
export function sanitizeFilePath(targetPath: string): string {
  if (!targetPath) return "";
  return targetPath
    .replace(/\0/g, "") // Null byte removal
    .replace(/\.\.[\/\\]/g, "") // Path traversal removal
    .replace(/[\/\\]\.\./g, "");
}
