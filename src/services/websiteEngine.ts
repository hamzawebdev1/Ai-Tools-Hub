/**
 * Production-ready Website & Web-Developer utilities engine.
 */

export interface ParsedUrlDetails {
  valid: boolean;
  href?: string;
  protocol?: string;
  hostname?: string;
  port?: string;
  pathname?: string;
  search?: string;
  hash?: string;
  origin?: string;
  params?: Record<string, string>;
  error?: string;
}

export function parseUrlDetails(urlString: string): ParsedUrlDetails {
  try {
    const parsed = new URL(urlString.trim());
    const params: Record<string, string> = {};
    parsed.searchParams.forEach((val, key) => {
      params[key] = val;
    });

    return {
      valid: true,
      href: parsed.href,
      protocol: parsed.protocol,
      hostname: parsed.hostname,
      port: parsed.port || (parsed.protocol === "https:" ? "443" : "80"),
      pathname: parsed.pathname,
      search: parsed.search,
      hash: parsed.hash,
      origin: parsed.origin,
      params,
    };
  } catch (err: any) {
    return {
      valid: false,
      error: `Invalid URL: ${err.message || "Failed to parse URL string"}`,
    };
  }
}

export function lookupHttpStatusCode(code: number): {
  code: number;
  phrase: string;
  category: string;
  description: string;
  spec: string;
} {
  const codes: Record<number, { phrase: string; category: string; desc: string; spec: string }> = {
    200: { phrase: "OK", category: "2xx Success", desc: "Standard successful HTTP response.", spec: "RFC 7231" },
    201: { phrase: "Created", category: "2xx Success", desc: "The request has been fulfilled and resulted in a new resource.", spec: "RFC 7231" },
    204: { phrase: "No Content", category: "2xx Success", desc: "Server successfully processed request but returns no content body.", spec: "RFC 7231" },
    301: { phrase: "Moved Permanently", category: "3xx Redirection", desc: "The target resource has been assigned a new permanent URI.", spec: "RFC 7231" },
    302: { phrase: "Found (Temporary Redirect)", category: "3xx Redirection", desc: "The target resource resides temporarily under a different URI.", spec: "RFC 7231" },
    304: { phrase: "Not Modified", category: "3xx Redirection", desc: "Resource has not been modified since the specified version.", spec: "RFC 7232" },
    307: { phrase: "Temporary Redirect", category: "3xx Redirection", desc: "Temporary redirect while maintaining original HTTP method.", spec: "RFC 7231" },
    308: { phrase: "Permanent Redirect", category: "3xx Redirection", desc: "Permanent redirect while maintaining original HTTP method.", spec: "RFC 7538" },
    400: { phrase: "Bad Request", category: "4xx Client Error", desc: "Server cannot process request due to client syntax error.", spec: "RFC 7231" },
    401: { phrase: "Unauthorized", category: "4xx Client Error", desc: "Authentication is required and has failed or not been provided.", spec: "RFC 7235" },
    403: { phrase: "Forbidden", category: "4xx Client Error", desc: "Client does not have access rights to the content.", spec: "RFC 7231" },
    404: { phrase: "Not Found", category: "4xx Client Error", desc: "The server cannot find the requested resource.", spec: "RFC 7231" },
    405: { phrase: "Method Not Allowed", category: "4xx Client Error", desc: "Request method is known by server but not supported for target.", spec: "RFC 7231" },
    429: { phrase: "Too Many Requests", category: "4xx Client Error", desc: "User has sent too many requests in a given amount of time (Rate Limit).", spec: "RFC 6585" },
    500: { phrase: "Internal Server Error", category: "5xx Server Error", desc: "Server encountered an unexpected condition that prevented it from fulfilling request.", spec: "RFC 7231" },
    502: { phrase: "Bad Gateway", category: "5xx Server Error", desc: "Server received an invalid response from upstream server.", spec: "RFC 7231" },
    503: { phrase: "Service Unavailable", category: "5xx Server Error", desc: "Server is currently unable to handle request due to maintenance or overload.", spec: "RFC 7231" },
    504: { phrase: "Gateway Timeout", category: "5xx Server Error", desc: "Upstream server failed to send timely response.", spec: "RFC 7231" },
  };

  const found = codes[code];
  if (found) {
    return { code, phrase: found.phrase, category: found.category, description: found.desc, spec: found.spec };
  }

  const category =
    code >= 100 && code < 200
      ? "1xx Informational"
      : code >= 200 && code < 300
      ? "2xx Success"
      : code >= 300 && code < 400
      ? "3xx Redirection"
      : code >= 400 && code < 500
      ? "4xx Client Error"
      : "5xx Server Error";

  return {
    code,
    phrase: "Custom Status Code",
    category,
    description: `HTTP Status Code ${code}`,
    spec: "HTTP Standard",
  };
}

export function lookupMimeType(extensionOrName: string): {
  extension: string;
  mimeType: string;
  category: string;
} {
  const clean = extensionOrName.trim().toLowerCase().replace(/^\./, "");

  const mimeMap: Record<string, { mime: string; category: string }> = {
    html: { mime: "text/html", category: "Document" },
    htm: { mime: "text/html", category: "Document" },
    css: { mime: "text/css", category: "Stylesheet" },
    js: { mime: "text/javascript", category: "Script" },
    json: { mime: "application/json", category: "Data" },
    png: { mime: "image/png", category: "Image" },
    jpg: { mime: "image/jpeg", category: "Image" },
    jpeg: { mime: "image/jpeg", category: "Image" },
    gif: { mime: "image/gif", category: "Image" },
    svg: { mime: "image/svg+xml", category: "Image" },
    webp: { mime: "image/webp", category: "Image" },
    pdf: { mime: "application/pdf", category: "Document" },
    zip: { mime: "application/zip", category: "Archive" },
    xml: { mime: "application/xml", category: "Data" },
    mp3: { mime: "audio/mpeg", category: "Audio" },
    mp4: { mime: "video/mp4", category: "Video" },
    wasm: { mime: "application/wasm", category: "Binary" },
    woff2: { mime: "font/woff2", category: "Font" },
  };

  const item = mimeMap[clean];
  if (item) {
    return { extension: clean, mimeType: item.mime, category: item.category };
  }

  return { extension: clean, mimeType: "application/octet-stream", category: "Binary / Unknown" };
}

export function parseUserAgentString(ua: string): {
  browser: string;
  os: string;
  device: string;
  engine: string;
} {
  const clean = ua.trim();
  let browser = "Unknown Browser";
  let os = "Unknown OS";
  let device = "Desktop";
  let engine = "Unknown Engine";

  if (clean.includes("Chrome") && !clean.includes("Edg")) browser = "Google Chrome";
  else if (clean.includes("Edg")) browser = "Microsoft Edge";
  else if (clean.includes("Firefox")) browser = "Mozilla Firefox";
  else if (clean.includes("Safari") && !clean.includes("Chrome")) browser = "Apple Safari";

  if (clean.includes("Windows NT 10.0")) os = "Windows 10 / 11";
  else if (clean.includes("Mac OS X")) os = "macOS";
  else if (clean.includes("Android")) {
    os = "Android";
    device = "Mobile";
  } else if (clean.includes("iPhone") || clean.includes("iPad")) {
    os = "iOS";
    device = clean.includes("iPad") ? "Tablet" : "Mobile";
  } else if (clean.includes("Linux")) os = "Linux";

  if (clean.includes("AppleWebKit")) engine = "Blink / WebKit";
  else if (clean.includes("Gecko")) engine = "Gecko";

  return { browser, os, device, engine };
}

export function generateWebManifest(config: {
  name: string;
  shortName: string;
  startUrl?: string;
  display?: string;
  themeColor?: string;
  backgroundColor?: string;
}): string {
  const manifest = {
    name: config.name || "My Web Application",
    short_name: config.shortName || config.name || "WebApp",
    start_url: config.startUrl || "/",
    display: config.display || "standalone",
    background_color: config.backgroundColor || "#ffffff",
    theme_color: config.themeColor || "#4f46e5",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };

  return JSON.stringify(manifest, null, 2);
}

export function generateRedirectRules(
  type: "apache" | "nginx" | "htaccess",
  fromPath: string,
  toUrl: string,
  statusCode = 301
): string {
  const cleanFrom = fromPath.startsWith("/") ? fromPath : "/" + fromPath;

  if (type === "apache" || type === "htaccess") {
    return `RewriteEngine On\nRewriteRule ^${cleanFrom.replace(/^\//, "")}$ ${toUrl} [R=${statusCode},L]`;
  }

  if (type === "nginx") {
    return `location = ${cleanFrom} {\n    return ${statusCode} ${toUrl};\n}`;
  }

  return "";
}
