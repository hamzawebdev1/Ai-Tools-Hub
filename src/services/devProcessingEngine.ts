import YAML from "yaml";
import { format as formatSqlString } from "sql-formatter";
import CryptoJS from "crypto-js";
import * as diff from "diff";

/**
 * JSON Engine
 */
export interface JsonValidationResult {
  valid: boolean;
  error?: string;
  line?: number;
  column?: number;
}

export function validateJson(jsonStr: string): JsonValidationResult {
  if (!jsonStr || !jsonStr.trim()) {
    return { valid: false, error: "Input JSON is empty." };
  }
  try {
    JSON.parse(jsonStr);
    return { valid: true };
  } catch (err: any) {
    const msg = err.message || "Invalid JSON syntax";
    let line: number | undefined;
    let column: number | undefined;

    // Extract line/column from error message if available
    const match = msg.match(/at position (\d+)/i) || msg.match(/line (\d+) column (\d+)/i);
    if (match) {
      if (match[2]) {
        line = parseInt(match[1], 10);
        column = parseInt(match[2], 10);
      } else {
        const pos = parseInt(match[1], 10);
        const textUpToPos = jsonStr.substring(0, pos);
        const lines = textUpToPos.split("\n");
        line = lines.length;
        column = lines[lines.length - 1].length + 1;
      }
    }

    return { valid: false, error: msg, line, column };
  }
}

export function formatJson(jsonStr: string, indent = 2): string {
  const parsed = JSON.parse(jsonStr);
  return JSON.stringify(parsed, null, indent);
}

export function minifyJson(jsonStr: string): string {
  const parsed = JSON.parse(jsonStr);
  return JSON.stringify(parsed);
}

export function sortJsonKeys(jsonStr: string): string {
  const parsed = JSON.parse(jsonStr);
  const sortObjectKeys = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.map(sortObjectKeys);
    }
    if (obj !== null && typeof obj === "object") {
      return Object.keys(obj)
        .sort()
        .reduce((acc: any, key) => {
          acc[key] = sortObjectKeys(obj[key]);
          return acc;
        }, {});
    }
    return obj;
  };

  const sorted = sortObjectKeys(parsed);
  return JSON.stringify(sorted, null, 2);
}

export function escapeJsonString(jsonStr: string): string {
  return JSON.stringify(jsonStr);
}

export function unescapeJsonString(escapedStr: string): string {
  try {
    return JSON.parse(escapedStr);
  } catch {
    return escapedStr.replace(/\\"/g, '"').replace(/\\\\/g, "\\");
  }
}

/**
 * CSV & JSON Converters
 */
export function jsonToCsv(jsonInput: string): string {
  const parsed = JSON.parse(jsonInput);
  const dataArray = Array.isArray(parsed) ? parsed : [parsed];

  if (dataArray.length === 0) return "";

  // Collect all unique keys
  const headersSet = new Set<string>();
  dataArray.forEach((item) => {
    if (item && typeof item === "object") {
      Object.keys(item).forEach((k) => headersSet.add(k));
    }
  });

  const headers = Array.from(headersSet);
  const csvRows: string[] = [];

  // Header row
  csvRows.push(headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(","));

  // Value rows
  dataArray.forEach((item) => {
    const row = headers.map((header) => {
      let val = item && typeof item === "object" ? item[header] : "";
      if (val === null || val === undefined) val = "";
      else if (typeof val === "object") val = JSON.stringify(val);
      else val = String(val);

      // Escape quotes and wrap in quotes
      return `"${val.replace(/"/g, '""')}"`;
    });
    csvRows.push(row.join(","));
  });

  return csvRows.join("\n");
}

export function csvToJson(csvInput: string): string {
  if (!csvInput || !csvInput.trim()) return "[]";

  const lines = parseCsvRows(csvInput);
  if (lines.length === 0) return "[]";

  const headers = lines[0].map((h) => h.trim());
  const result: any[] = [];

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i];
    if (row.length === 1 && row[0].trim() === "") continue; // Skip blank line

    const obj: Record<string, any> = {};
    headers.forEach((header, index) => {
      let val: any = row[index] !== undefined ? row[index] : "";
      // Try type coercion for numbers/booleans
      if (val === "true") val = true;
      else if (val === "false") val = false;
      else if (val !== "" && !isNaN(Number(val))) val = Number(val);

      obj[header || `column_${index + 1}`] = val;
    });
    result.push(obj);
  }

  return JSON.stringify(result, null, 2);
}

function parseCsvRows(csvText: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentVal = "";
  let insideQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentVal += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === "," && !insideQuotes) {
      currentRow.push(currentVal);
      currentVal = "";
    } else if ((char === "\r" || char === "\n") && !insideQuotes) {
      if (char === "\r" && nextChar === "\n") i++;
      currentRow.push(currentVal);
      rows.push(currentRow);
      currentRow = [];
      currentVal = "";
    } else {
      currentVal += char;
    }
  }

  if (currentVal || currentRow.length > 0) {
    currentRow.push(currentVal);
    rows.push(currentRow);
  }

  return rows;
}

export function validateCsv(csvText: string) {
  if (!csvText || !csvText.trim()) return { valid: false, error: "CSV input is empty." };
  const rows = parseCsvRows(csvText);
  if (rows.length === 0) return { valid: false, error: "No rows found in CSV." };

  const expectedCols = rows[0].length;
  for (let i = 1; i < rows.length; i++) {
    if (rows[i].length === 1 && rows[i][0] === "") continue;
    if (rows[i].length !== expectedCols) {
      return {
        valid: false,
        error: `Row ${i + 1} has ${rows[i].length} columns, expected ${expectedCols} based on header row.`,
        row: i + 1,
      };
    }
  }

  return { valid: true, rowCount: rows.length, colCount: expectedCols };
}

/**
 * XML Engine
 */
export function validateXml(xmlStr: string) {
  if (!xmlStr || !xmlStr.trim()) return { valid: false, error: "XML input is empty." };
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlStr, "text/xml");
  const parserError = xmlDoc.getElementsByTagName("parsererror");

  if (parserError.length > 0) {
    return { valid: false, error: parserError[0].textContent || "XML parse error." };
  }
  return { valid: true };
}

export function formatXml(xmlStr: string): string {
  const val = validateXml(xmlStr);
  if (!val.valid) throw new Error(val.error);

  let formatted = "";
  let indent = "";
  const tab = "  ";

  xmlStr.split(/>\s*</).forEach((node) => {
    if (node.match(/^\/\w/)) {
      indent = indent.substring(tab.length);
    }
    formatted += `${indent}<${node}>\n`;
    if (node.match(/^<?\w[^>]*[^/]$/) && !node.startsWith("!")) {
      indent += tab;
    }
  });

  return formatted.substring(1, formatted.length - 2).trim();
}

export function minifyXml(xmlStr: string): string {
  return xmlStr
    .replace(/>\s+</g, "><")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * YAML Engine
 */
export function validateYaml(yamlStr: string) {
  if (!yamlStr || !yamlStr.trim()) return { valid: false, error: "YAML input is empty." };
  try {
    YAML.parse(yamlStr);
    return { valid: true };
  } catch (err: any) {
    return { valid: false, error: err.message };
  }
}

export function formatYaml(yamlStr: string): string {
  const parsed = YAML.parse(yamlStr);
  return YAML.stringify(parsed);
}

export function yamlToJson(yamlStr: string): string {
  const parsed = YAML.parse(yamlStr);
  return JSON.stringify(parsed, null, 2);
}

export function jsonToYaml(jsonStr: string): string {
  const parsed = JSON.parse(jsonStr);
  return YAML.stringify(parsed);
}

/**
 * Code Formatters (HTML, CSS, JS, SQL)
 */
export function formatSql(sqlStr: string): string {
  return formatSqlString(sqlStr, {
    language: "sql",
    keywordCase: "upper",
    tabWidth: 2,
  });
}

export function minifySql(sqlStr: string): string {
  return sqlStr
    .replace(/--.*$/gm, "") // remove single-line comments
    .replace(/\/\*[\s\S]*?\*\//g, "") // remove block comments
    .replace(/\s+/g, " ")
    .trim();
}

export function formatCss(cssStr: string): string {
  return cssStr
    .replace(/\s*([{\}:;,])\s*/g, "$1")
    .replace(/;/g, ";\n  ")
    .replace(/\{/g, " {\n  ")
    .replace(/\}/g, "\n}\n")
    .replace(/\n\s*\n/g, "\n")
    .trim();
}

export function minifyCss(cssStr: string): string {
  return cssStr
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s*([\{\}\:\;\,])\s*/g, "$1")
    .replace(/;\}/g, "}")
    .trim();
}

export function formatHtml(htmlStr: string): string {
  let indent = 0;
  const pad = (count: number) => "  ".repeat(count);
  return htmlStr
    .replace(/>\s*</g, ">\n<")
    .split("\n")
    .map((line) => {
      line = line.trim();
      if (!line) return "";
      if (line.match(/^<\//)) {
        indent = Math.max(0, indent - 1);
      }
      const formatted = pad(indent) + line;
      if (line.match(/^<[^\/!\?][^>]*[^\/]>$/) && !line.match(/<(img|hr|br|input|meta|link)[^>]*>/i)) {
        indent++;
      }
      return formatted;
    })
    .filter(Boolean)
    .join("\n");
}

export function minifyHtml(htmlStr: string): string {
  return htmlStr
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/>\s+</g, "><")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Regex Tester
 */
export interface RegexTestResult {
  pattern: string;
  flags: string;
  matchCount: number;
  matches: { index: number; match: string; groups?: Record<string, string> }[];
  replacedText: string;
}

export function executeRegexTest(
  pattern: string,
  flags: string,
  testText: string,
  replaceWith = ""
): RegexTestResult {
  if (!pattern) {
    return { pattern: "", flags, matchCount: 0, matches: [], replacedText: testText };
  }

  const regex = new RegExp(pattern, flags.includes("g") ? flags : `${flags}g`);
  const matches: { index: number; match: string; groups?: Record<string, string> }[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(testText)) !== null) {
    matches.push({
      index: match.index,
      match: match[0],
      groups: match.groups ? { ...match.groups } : undefined,
    });
    if (match.index === regex.lastIndex) {
      regex.lastIndex++;
    }
  }

  const replaceRegex = new RegExp(pattern, flags);
  const replacedText = testText.replace(replaceRegex, replaceWith);

  return {
    pattern,
    flags,
    matchCount: matches.length,
    matches,
    replacedText,
  };
}

/**
 * JWT Decoder & Claims Inspector
 */
export interface JwtDecoded {
  header: any;
  payload: any;
  signature: string;
  isExpired: boolean;
  issuedAtDate?: string;
  expirationDate?: string;
  issuer?: string;
  subject?: string;
  audience?: string;
}

export function decodeJwtToken(tokenStr: string): JwtDecoded {
  const parts = tokenStr.trim().split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid JWT format. A valid JWT must consist of 3 dot-separated base64url sections.");
  }

  const decodeBase64Url = (str: string) => {
    let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }
    return JSON.parse(decodeURIComponent(escape(atob(base64))));
  };

  const header = decodeBase64Url(parts[0]);
  const payload = decodeBase64Url(parts[1]);

  let isExpired = false;
  let issuedAtDate: string | undefined;
  let expirationDate: string | undefined;

  if (payload.iat) {
    issuedAtDate = new Date(payload.iat * 1000).toLocaleString();
  }
  if (payload.exp) {
    expirationDate = new Date(payload.exp * 1000).toLocaleString();
    if (Date.now() >= payload.exp * 1000) {
      isExpired = true;
    }
  }

  return {
    header,
    payload,
    signature: parts[2],
    isExpired,
    issuedAtDate,
    expirationDate,
    issuer: payload.iss,
    subject: payload.sub,
    audience: payload.aud,
  };
}

/**
 * Timestamp Converter
 */
export function convertTimestampToDate(tsInput: string | number) {
  let num = typeof tsInput === "number" ? tsInput : parseInt(tsInput.trim(), 10);
  if (isNaN(num)) {
    const d = new Date(tsInput);
    if (isNaN(d.getTime())) throw new Error("Invalid timestamp or date input");
    num = Math.floor(d.getTime() / 1000);
  }

  // Handle seconds vs milliseconds auto-detect
  const isMs = num > 10000000000;
  const ms = isMs ? num : num * 1000;
  const date = new Date(ms);

  return {
    seconds: Math.floor(ms / 1000),
    milliseconds: ms,
    utcString: date.toUTCString(),
    isoString: date.toISOString(),
    localString: date.toLocaleString(),
    relative: getRelativeTimeString(date),
  };
}

function getRelativeTimeString(date: Date): string {
  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (Math.abs(diffSec) < 60) return `${diffSec} seconds ago`;
  if (Math.abs(diffSec) < 3600) return `${Math.floor(diffSec / 60)} minutes ago`;
  if (Math.abs(diffSec) < 86400) return `${Math.floor(diffSec / 3600)} hours ago`;
  return `${Math.floor(diffSec / 86400)} days ago`;
}

/**
 * Hash & HMAC Generator
 */
export function generateHashes(text: string) {
  if (!text) return { md5: "", sha1: "", sha256: "", sha384: "", sha512: "" };
  return {
    md5: CryptoJS.MD5(text).toString(),
    sha1: CryptoJS.SHA1(text).toString(),
    sha256: CryptoJS.SHA256(text).toString(),
    sha384: CryptoJS.SHA384(text).toString(),
    sha512: CryptoJS.SHA512(text).toString(),
  };
}

export function generateHmacHash(text: string, secret: string, algo: "md5" | "sha1" | "sha256" | "sha512" = "sha256") {
  if (!text || !secret) return "";
  switch (algo) {
    case "md5":
      return CryptoJS.HmacMD5(text, secret).toString();
    case "sha1":
      return CryptoJS.HmacSHA1(text, secret).toString();
    case "sha256":
      return CryptoJS.HmacSHA256(text, secret).toString();
    case "sha512":
      return CryptoJS.HmacSHA512(text, secret).toString();
    default:
      return CryptoJS.HmacSHA256(text, secret).toString();
  }
}

/**
 * URL Parser & Query String
 */
export function parseUrlDetails(urlStr: string) {
  if (!urlStr) throw new Error("URL input is empty");
  let formattedUrl = urlStr.trim();
  if (!/^https?:\/\//i.test(formattedUrl)) {
    formattedUrl = `https://${formattedUrl}`;
  }

  const url = new URL(formattedUrl);
  const queryParams: Record<string, string> = {};
  url.searchParams.forEach((val, key) => {
    queryParams[key] = val;
  });

  return {
    origin: url.origin,
    protocol: url.protocol,
    hostname: url.hostname,
    port: url.port || (url.protocol === "https:" ? "443" : "80"),
    pathname: url.pathname,
    search: url.search,
    hash: url.hash,
    queryParams,
  };
}

/**
 * Color Converter
 */
export function convertColorCode(inputStr: string) {
  const str = inputStr.trim().toLowerCase();
  let r = 0, g = 0, b = 0, a = 1;

  if (str.startsWith("#")) {
    let hex = str.substring(1);
    if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
    r = parseInt(hex.substring(0, 2), 16) || 0;
    g = parseInt(hex.substring(2, 4), 16) || 0;
    b = parseInt(hex.substring(4, 6), 16) || 0;
  } else if (str.startsWith("rgb")) {
    const match = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (match) {
      r = parseInt(match[1], 10);
      g = parseInt(match[2], 10);
      b = parseInt(match[3], 10);
      if (match[4]) a = parseFloat(match[4]);
    }
  } else {
    // Default fallback hex if unknown
    r = 99; g = 102; b = 241;
  }

  const hexR = r.toString(16).padStart(2, "0");
  const hexG = g.toString(16).padStart(2, "0");
  const hexB = b.toString(16).padStart(2, "0");

  const hex = `#${hexR}${hexG}${hexB}`;
  const rgb = `rgb(${r}, ${g}, ${b})`;
  const rgba = `rgba(${r}, ${g}, ${b}, ${a})`;

  return { hex, rgb, rgba, r, g, b };
}

/**
 * HTTP Status Lookup
 */
export const HTTP_STATUS_CODES: Record<number, { title: string; description: string }> = {
  200: { title: "200 OK", description: "Standard successful HTTP response." },
  201: { title: "201 Created", description: "Request succeeded and a new resource was created." },
  204: { title: "204 No Content", description: "Request processed successfully, no body returned." },
  301: { title: "301 Moved Permanently", description: "Resource has been permanently moved to a new URI." },
  302: { title: "302 Found", description: "Resource temporarily resides under a different URI." },
  400: { title: "400 Bad Request", description: "Server cannot process request due to client error/syntax." },
  401: { title: "401 Unauthorized", description: "Authentication required and has failed or not been provided." },
  403: { title: "403 Forbidden", description: "Server understands request but refuses to authorize it." },
  404: { title: "404 Not Found", description: "Requested resource could not be found on the server." },
  409: { title: "409 Conflict", description: "Request conflicts with current state of the target resource." },
  422: { title: "422 Unprocessable Entity", description: "Semantic errors prevent server from processing request." },
  429: { title: "429 Too Many Requests", description: "User has sent too many requests in a given amount of time." },
  500: { title: "500 Internal Server Error", description: "Server encountered an unexpected error." },
  502: { title: "502 Bad Gateway", description: "Server received an invalid response from upstream server." },
  503: { title: "503 Service Unavailable", description: "Server is currently unable to handle the request." },
  504: { title: "504 Gateway Timeout", description: "Upstream server failed to send a timely response." },
};

/**
 * Validators (IP, Email, Domain)
 */
export function validateIpAddress(ip: string) {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

  if (ipv4Regex.test(ip)) {
    const parts = ip.split(".").map(Number);
    const validOctets = parts.every((p) => p >= 0 && p <= 255);
    if (!validOctets) return { valid: false, version: "IPv4", error: "Octets must be between 0 and 255." };

    const isPrivate =
      parts[0] === 10 ||
      (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
      (parts[0] === 192 && parts[1] === 168) ||
      parts[0] === 127;

    return { valid: true, version: "IPv4", isPrivate, type: isPrivate ? "Private / Local" : "Public Internet" };
  }

  if (ipv6Regex.test(ip)) {
    return { valid: true, version: "IPv6", isPrivate: false, type: "IPv6 Global Address" };
  }

  return { valid: false, error: "Invalid IPv4 or IPv6 address format." };
}

export function validateEmail(email: string) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const valid = emailRegex.test(email.trim());
  if (!valid) return { valid: false, error: "Invalid email syntax format." };

  const [user, domain] = email.split("@");
  return { valid: true, user, domain };
}

export function validateDomain(domain: string) {
  const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
  const valid = domainRegex.test(domain.trim());
  return { valid, domain: domain.trim(), error: valid ? undefined : "Invalid domain name syntax." };
}

export function generateUuidV4(count = 1): string[] {
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      result.push(crypto.randomUUID());
    } else {
      result.push(
        "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
          const r = (Math.random() * 16) | 0;
          const v = c === "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        })
      );
    }
  }
  return result;
}
