import { Router, Request, Response } from "express";
import http from "http";
import https from "https";
import { validateUrlForSSRF } from "./security/ssrfProtection.js";

const router = Router();

const MAX_REDIRECTS = 5;
const MAX_RESPONSE_BYTES = 1024 * 1024; // 1MB Limit
const REQUEST_TIMEOUT_MS = 5000; // 5 Seconds Timeout

export interface RedirectStep {
  step: number;
  url: string;
  statusCode: number;
  statusText: string;
  headers: Record<string, string | string[] | undefined>;
  redirectType?: string;
  responseTimeMs: number;
}

/**
 * Safely fetches a URL following redirects with SSRF validation at every step.
 */
async function safeFetchUrl(
  initialUrl: string,
  maxRedirects = MAX_REDIRECTS
): Promise<{
  finalUrl: string;
  statusCode: number;
  statusText: string;
  headers: Record<string, string | string[] | undefined>;
  redirectChain: RedirectStep[];
  body: string;
  contentType: string;
  contentLength: number;
  totalTimeMs: number;
}> {
  let currentUrl = initialUrl;
  const redirectChain: RedirectStep[] = [];
  let redirectsCount = 0;
  const startTime = Date.now();

  while (redirectsCount <= maxRedirects) {
    // Validate current URL against SSRF
    const ssrfCheck = await validateUrlForSSRF(currentUrl);
    if (!ssrfCheck.valid) {
      throw new Error(`SSRF Blocked: ${ssrfCheck.error}`);
    }

    const stepStart = Date.now();
    const fetchResult = await performSingleRequest(currentUrl);
    const stepDuration = Date.now() - stepStart;

    const statusCode = fetchResult.statusCode;
    const isRedirect = [301, 302, 303, 307, 308].includes(statusCode);

    redirectChain.push({
      step: redirectsCount + 1,
      url: currentUrl,
      statusCode: fetchResult.statusCode,
      statusText: fetchResult.statusText,
      headers: fetchResult.headers,
      redirectType: getRedirectTypeName(statusCode),
      responseTimeMs: stepDuration,
    });

    if (isRedirect && fetchResult.headers.location) {
      redirectsCount++;
      if (redirectsCount > maxRedirects) {
        throw new Error(`Too many redirects (exceeded maximum of ${maxRedirects}).`);
      }

      // Resolve relative redirect location against currentUrl
      const rawLocation = Array.isArray(fetchResult.headers.location)
        ? fetchResult.headers.location[0]
        : fetchResult.headers.location;

      currentUrl = new URL(rawLocation, currentUrl).href;
    } else {
      // Reached final destination
      return {
        finalUrl: currentUrl,
        statusCode: fetchResult.statusCode,
        statusText: fetchResult.statusText,
        headers: fetchResult.headers,
        redirectChain,
        body: fetchResult.body,
        contentType: (fetchResult.headers["content-type"] as string) || "text/plain",
        contentLength: fetchResult.body.length,
        totalTimeMs: Date.now() - startTime,
      };
    }
  }

  throw new Error("Unexpected end of redirect loop.");
}

function getRedirectTypeName(code: number): string {
  switch (code) {
    case 301: return "301 Moved Permanently";
    case 302: return "302 Found (Temporary Redirect)";
    case 303: return "303 See Other";
    case 307: return "307 Temporary Redirect";
    case 308: return "308 Permanent Redirect";
    default: return `${code} Redirect`;
  }
}

function performSingleRequest(
  targetUrl: string
): Promise<{
  statusCode: number;
  statusText: string;
  headers: Record<string, string | string[] | undefined>;
  body: string;
}> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(targetUrl);
    const transport = parsed.protocol === "https:" ? https : http;

    const reqOptions = {
      hostname: parsed.hostname,
      port: parsed.port || (parsed.protocol === "https:" ? 443 : 80),
      path: `${parsed.pathname}${parsed.search}`,
      method: "GET",
      headers: {
        "User-Agent": "AIToolsHub-UrlChecker/2.0 (+https://aitoolshub.com)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
      timeout: REQUEST_TIMEOUT_MS,
    };

    const req = transport.request(reqOptions, (res) => {
      let receivedBytes = 0;
      const chunks: Buffer[] = [];

      res.on("data", (chunk: Buffer) => {
        receivedBytes += chunk.length;
        if (receivedBytes > MAX_RESPONSE_BYTES) {
          req.destroy();
          // Still resolve with accumulated body chunk to avoid failing whole check
          const bodyStr = Buffer.concat(chunks).toString("utf8");
          resolve({
            statusCode: res.statusCode || 200,
            statusText: res.statusMessage || "OK",
            headers: res.headers,
            body: bodyStr,
          });
          return;
        }
        chunks.push(chunk);
      });

      res.on("end", () => {
        const bodyStr = Buffer.concat(chunks).toString("utf8");
        resolve({
          statusCode: res.statusCode || 200,
          statusText: res.statusMessage || "OK",
          headers: res.headers,
          body: bodyStr,
        });
      });
    });

    req.on("timeout", () => {
      req.destroy();
      reject(new Error(`Request timed out after ${REQUEST_TIMEOUT_MS}ms.`));
    });

    req.on("error", (err) => {
      reject(new Error(`Network request error: ${err.message}`));
    });

    req.end();
  });
}

// POST /api/analysis/fetch-url
router.post("/api/analysis/fetch-url", async (req: Request, res: Response) => {
  const { url } = req.body;
  if (!url || typeof url !== "string") {
    return res.status(400).json({ success: false, error: "Target URL parameter is required." });
  }

  try {
    const result = await safeFetchUrl(url);
    return res.json({
      success: true,
      url: result.finalUrl,
      initialUrl: url,
      statusCode: result.statusCode,
      statusText: result.statusText,
      contentType: result.contentType,
      contentLength: result.contentLength,
      totalTimeMs: result.totalTimeMs,
      headers: result.headers,
      redirectChain: result.redirectChain,
      bodyHtml: result.body,
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      error: err.message || "Failed to fetch target URL safely.",
    });
  }
});

// POST /api/analysis/redirects
router.post("/api/analysis/redirects", async (req: Request, res: Response) => {
  const { url } = req.body;
  if (!url || typeof url !== "string") {
    return res.status(400).json({ success: false, error: "Target URL parameter is required." });
  }

  try {
    const result = await safeFetchUrl(url);
    return res.json({
      success: true,
      initialUrl: url,
      finalUrl: result.finalUrl,
      totalRedirects: Math.max(0, result.redirectChain.length - 1),
      statusCode: result.statusCode,
      totalTimeMs: result.totalTimeMs,
      redirectChain: result.redirectChain,
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      error: err.message || "Failed to check redirects.",
    });
  }
});

// POST /api/analysis/headers
router.post("/api/analysis/headers", async (req: Request, res: Response) => {
  const { url } = req.body;
  if (!url || typeof url !== "string") {
    return res.status(400).json({ success: false, error: "Target URL parameter is required." });
  }

  try {
    const result = await safeFetchUrl(url);

    // Group security headers
    const headers = result.headers;
    const securityHeadersCheck = {
      strictTransportSecurity: !!headers["strict-transport-security"],
      contentSecurityPolicy: !!headers["content-security-policy"],
      xContentTypeOptions: !!headers["x-content-type-options"],
      xFrameOptions: !!headers["x-frame-options"],
      referrerPolicy: !!headers["referrer-policy"],
      permissionsPolicy: !!headers["permissions-policy"],
    };

    return res.json({
      success: true,
      url: result.finalUrl,
      statusCode: result.statusCode,
      statusText: result.statusText,
      headers: result.headers,
      securityHeadersCheck,
      contentType: result.contentType,
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      error: err.message || "Failed to inspect headers.",
    });
  }
});

export default router;
