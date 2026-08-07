/**
 * Network & Security Calculation Engine using Web Crypto API and pure mathematical algorithms.
 */

// ==========================================
// NETWORK UTILITIES
// ==========================================

export function ipToLong(ip: string): number {
  return ip.split(".").reduce((acc, octet) => ((acc << 8) + parseInt(octet, 10)) >>> 0, 0);
}

export function longToIp(long: number): string {
  return [
    (long >>> 24) & 255,
    (long >>> 16) & 255,
    (long >>> 8) & 255,
    long & 255,
  ].join(".");
}

export function validateIPv4(ip: string): {
  valid: boolean;
  ipClass?: string;
  isPrivate?: boolean;
  isLoopback?: boolean;
  binary?: string;
  integer?: number;
} {
  const parts = ip.trim().split(".");
  if (parts.length !== 4) return { valid: false };

  for (const part of parts) {
    if (!/^\d+$/.test(part)) return { valid: false };
    const num = parseInt(part, 10);
    if (num < 0 || num > 255) return { valid: false };
    if (part.length > 1 && part.startsWith("0")) return { valid: false };
  }

  const long = ipToLong(ip);
  const firstOctet = parseInt(parts[0], 10);

  let ipClass = "A";
  if (firstOctet >= 128 && firstOctet <= 191) ipClass = "B";
  else if (firstOctet >= 192 && firstOctet <= 223) ipClass = "C";
  else if (firstOctet >= 224 && firstOctet <= 239) ipClass = "D (Multicast)";
  else if (firstOctet >= 240) ipClass = "E (Experimental)";

  const isLoopback = firstOctet === 127;
  const isPrivate =
    firstOctet === 10 ||
    (firstOctet === 172 && parseInt(parts[1], 10) >= 16 && parseInt(parts[1], 10) <= 31) ||
    (firstOctet === 192 && parseInt(parts[1], 10) === 168);

  const binary = parts.map((p) => parseInt(p, 10).toString(2).padStart(8, "0")).join(".");

  return {
    valid: true,
    ipClass,
    isPrivate,
    isLoopback,
    binary,
    integer: long,
  };
}

export function validateIPv6(ip: string): {
  valid: boolean;
  expanded?: string;
  isLoopback?: boolean;
  isLinkLocal?: boolean;
} {
  const trimmed = ip.trim().toLowerCase();

  // Basic IPv6 regex
  const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;

  if (!ipv6Regex.test(trimmed)) {
    return { valid: false };
  }

  const isLoopback = trimmed === "::1" || trimmed === "0000:0000:0000:0000:0000:0000:0000:0001";
  const isLinkLocal = trimmed.startsWith("fe80:");

  return {
    valid: true,
    isLoopback,
    isLinkLocal,
  };
}

export interface CIDRResult {
  ip: string;
  cidr: number;
  netmask: string;
  wildcard: string;
  networkAddress: string;
  broadcastAddress: string;
  firstUsableIp: string;
  lastUsableIp: string;
  totalHosts: number;
  usableHosts: number;
}

export function calculateSubnet(ipInput: string, cidrInput: number): CIDRResult {
  const ipCheck = validateIPv4(ipInput);
  if (!ipCheck.valid) {
    throw new Error("Invalid IPv4 Address format.");
  }

  const cidr = Math.max(0, Math.min(32, cidrInput));
  const ipLong = ipToLong(ipInput);

  const maskLong = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
  const wildcardLong = (~maskLong) >>> 0;

  const networkLong = (ipLong & maskLong) >>> 0;
  const broadcastLong = (networkLong | wildcardLong) >>> 0;

  const totalHosts = Math.pow(2, 32 - cidr);
  const usableHosts = cidr >= 31 ? totalHosts : Math.max(0, totalHosts - 2);

  const firstUsableLong = cidr >= 31 ? networkLong : networkLong + 1;
  const lastUsableLong = cidr >= 31 ? broadcastLong : broadcastLong - 1;

  return {
    ip: ipInput,
    cidr,
    netmask: longToIp(maskLong),
    wildcard: longToIp(wildcardLong),
    networkAddress: longToIp(networkLong),
    broadcastAddress: longToIp(broadcastLong),
    firstUsableIp: longToIp(firstUsableLong),
    lastUsableIp: longToIp(lastUsableLong),
    totalHosts,
    usableHosts,
  };
}

export function validateMACAddress(mac: string): {
  valid: boolean;
  colonFormat?: string;
  hyphenFormat?: string;
  dotFormat?: string;
} {
  const clean = mac.replace(/[^a-fA-F0-9]/g, "");
  if (clean.length !== 12) return { valid: false };

  const pairs = clean.match(/.{1,2}/g) || [];
  const colonFormat = pairs.join(":").toUpperCase();
  const hyphenFormat = pairs.join("-").toUpperCase();
  const dotFormat = `${clean.slice(0, 4)}.${clean.slice(4, 8)}.${clean.slice(8, 12)}`.toLowerCase();

  return {
    valid: true,
    colonFormat,
    hyphenFormat,
    dotFormat,
  };
}

export function lookupPortService(portNum: number): {
  valid: boolean;
  service?: string;
  description?: string;
} {
  if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
    return { valid: false };
  }

  const portsMap: Record<number, { service: string; desc: string }> = {
    21: { service: "FTP", desc: "File Transfer Protocol" },
    22: { service: "SSH / SFTP", desc: "Secure Shell / Secure File Transfer" },
    23: { service: "Telnet", desc: "Unencrypted Text Communications" },
    25: { service: "SMTP", desc: "Simple Mail Transfer Protocol" },
    53: { service: "DNS", desc: "Domain Name System" },
    80: { service: "HTTP", desc: "Hypertext Transfer Protocol" },
    110: { service: "POP3", desc: "Post Office Protocol v3" },
    143: { service: "IMAP", desc: "Internet Message Access Protocol" },
    443: { service: "HTTPS", desc: "HTTP Secure (SSL/TLS)" },
    465: { service: "SMTPS", desc: "SMTP over SSL" },
    587: { service: "SMTP Submission", desc: "Modern Email Sending" },
    993: { service: "IMAPS", desc: "IMAP over SSL" },
    995: { service: "POP3S", desc: "POP3 over SSL" },
    3306: { service: "MySQL / MariaDB", desc: "Relational Database Management System" },
    5432: { service: "PostgreSQL", desc: "PostgreSQL Database" },
    6379: { service: "Redis", desc: "In-Memory Key-Value Store" },
    8080: { service: "HTTP Alternate", desc: "Common Web Server Dev Port" },
    27017: { service: "MongoDB", desc: "NoSQL Document Database" },
  };

  const known = portsMap[portNum];
  return {
    valid: true,
    service: known ? known.service : "User / Dynamic Port",
    description: known ? known.desc : "General network service application port",
  };
}

// ==========================================
// SECURITY UTILITIES
// ==========================================

export function evaluatePasswordStrength(password: string): {
  score: number; // 0 - 100
  label: "Weak" | "Fair" | "Good" | "Strong" | "Excellent";
  length: number;
  entropyBits: number;
  checks: {
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumbers: boolean;
    hasSymbols: boolean;
  };
  crackTimeEstimate: string;
} {
  const length = password.length;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSymbols = /[^A-Za-z0-9]/.test(password);

  let poolSize = 0;
  if (hasLowercase) poolSize += 26;
  if (hasUppercase) poolSize += 26;
  if (hasNumbers) poolSize += 10;
  if (hasSymbols) poolSize += 33;

  const entropyBits = poolSize > 0 ? Math.round(length * Math.log2(poolSize)) : 0;

  let score = 0;
  if (entropyBits >= 80) score = 100;
  else if (entropyBits >= 60) score = 80;
  else if (entropyBits >= 40) score = 60;
  else if (entropyBits >= 25) score = 40;
  else score = Math.min(25, entropyBits);

  let label: "Weak" | "Fair" | "Good" | "Strong" | "Excellent" = "Weak";
  if (score >= 90) label = "Excellent";
  else if (score >= 75) label = "Strong";
  else if (score >= 50) label = "Good";
  else if (score >= 30) label = "Fair";

  let crackTimeEstimate = "Instantly";
  if (entropyBits >= 80) crackTimeEstimate = "Centuries";
  else if (entropyBits >= 60) crackTimeEstimate = "Several Years";
  else if (entropyBits >= 45) crackTimeEstimate = "A few Months";
  else if (entropyBits >= 30) crackTimeEstimate = "Hours to Days";

  return {
    score,
    label,
    length,
    entropyBits,
    checks: {
      hasUppercase,
      hasLowercase,
      hasNumbers,
      hasSymbols,
    },
    crackTimeEstimate,
  };
}

export function generateSecurePassword(options: {
  length?: number;
  uppercase?: boolean;
  lowercase?: boolean;
  numbers?: boolean;
  symbols?: boolean;
}): string {
  const len = options.length || 16;
  let chars = "";
  if (options.lowercase !== false) chars += "abcdefghijklmnopqrstuvwxyz";
  if (options.uppercase !== false) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (options.numbers !== false) chars += "0123456789";
  if (options.symbols !== false) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";

  if (!chars) chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  const randomValues = new Uint32Array(len);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(randomValues);
  } else {
    for (let i = 0; i < len; i++) randomValues[i] = Math.floor(Math.random() * 1000000);
  }

  let result = "";
  for (let i = 0; i < len; i++) {
    result += chars[randomValues[i] % chars.length];
  }
  return result;
}

export async function computeHash(text: string, algorithm: "SHA-256" | "SHA-384" | "SHA-512"): Promise<string> {
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  throw new Error("Web Crypto API is not supported in this browser environment.");
}

export async function computeHMAC(message: string, secret: string): Promise<string> {
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const messageData = encoder.encode(message);

    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const signature = await crypto.subtle.sign("HMAC", cryptoKey, messageData);
    return Array.from(new Uint8Array(signature))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
  throw new Error("Web Crypto API is not supported in this environment.");
}

export function decodeJWT(jwtString: string): {
  valid: boolean;
  header?: any;
  payload?: any;
  signature?: string;
  isExpired?: boolean;
  expiresAt?: string;
  issuedAt?: string;
  error?: string;
} {
  const parts = jwtString.trim().split(".");
  if (parts.length !== 3) {
    return { valid: false, error: "Invalid JWT format. Must contain 3 dot-separated parts." };
  }

  try {
    const headerJson = JSON.parse(atob(parts[0].replace(/-/g, "+").replace(/_/g, "/")));
    const payloadJson = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));

    let isExpired = false;
    let expiresAt = "None set";
    let issuedAt = "None set";

    if (payloadJson.exp) {
      const expDate = new Date(payloadJson.exp * 1000);
      expiresAt = expDate.toISOString();
      if (Date.now() >= payloadJson.exp * 1000) {
        isExpired = true;
      }
    }

    if (payloadJson.iat) {
      issuedAt = new Date(payloadJson.iat * 1000).toISOString();
    }

    return {
      valid: true,
      header: headerJson,
      payload: payloadJson,
      signature: parts[2],
      isExpired,
      expiresAt,
      issuedAt,
    };
  } catch (err: any) {
    return { valid: false, error: `Failed to decode JWT base64 payloads: ${err.message}` };
  }
}

export function generateSRIHash(codeText: string, algorithm: "sha256" | "sha384" | "sha512" = "sha384"): Promise<string> {
  const algoMap = {
    sha256: "SHA-256",
    sha384: "SHA-384",
    sha512: "SHA-512",
  };

  return crypto.subtle
    .digest(algoMap[algorithm], new TextEncoder().encode(codeText))
    .then((buffer) => {
      const binary = String.fromCharCode(...new Uint8Array(buffer));
      const base64 = btoa(binary);
      return `${algorithm}-${base64}`;
    });
}
