import net from "net";
import dns from "dns/promises";

export interface SSRFValidationResult {
  valid: boolean;
  error?: string;
  ip?: string;
}

/**
 * Checks if an IPv4 address is in a forbidden private, loopback, or reserved range.
 */
function isForbiddenIPv4(ip: string): boolean {
  const parts = ip.split(".").map((p) => parseInt(p, 10));
  if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
    return true; // Malformed IPv4
  }

  const [a, b, c, d] = parts;

  // 0.0.0.0/8
  if (a === 0) return true;

  // 127.0.0.0/8 (Loopback)
  if (a === 127) return true;

  // 10.0.0.0/8 (Private)
  if (a === 10) return true;

  // 172.16.0.0/12 (Private)
  if (a === 172 && b >= 16 && b <= 31) return true;

  // 192.168.0.0/16 (Private)
  if (a === 192 && b === 168) return true;

  // 169.254.0.0/16 (Link-local / Cloud Metadata)
  if (a === 169 && b === 254) return true;

  // 224.0.0.0/4 (Multicast) & 240.0.0.0/4 (Reserved)
  if (a >= 224) return true;

  return false;
}

/**
 * Checks if an IPv6 address is in a forbidden private, loopback, or reserved range.
 */
function isForbiddenIPv6(ip: string): boolean {
  const normalized = ip.toLowerCase();

  // Loopback ::1
  if (normalized === "::1" || normalized === "0:0:0:0:0:0:0:1") return true;

  // Link-local fe80::/10
  if (normalized.startsWith("fe8") || normalized.startsWith("fe9") || normalized.startsWith("fea") || normalized.startsWith("feb")) {
    return true;
  }

  // Unique local fc00::/7 (fc00::, fd00::)
  if (normalized.startsWith("fc") || normalized.startsWith("fd")) {
    return true;
  }

  // IPv4-mapped IPv6 addresses (::ffff:127.0.0.1, etc.)
  if (normalized.includes("::ffff:")) {
    const ipv4Part = normalized.split("::ffff:")[1];
    if (ipv4Part && net.isIPv4(ipv4Part)) {
      return isForbiddenIPv4(ipv4Part);
    }
  }

  return false;
}

/**
 * Validates a target URL against SSRF rules.
 */
export async function validateUrlForSSRF(urlString: string): Promise<SSRFValidationResult> {
  if (!urlString || typeof urlString !== "string") {
    return { valid: false, error: "URL string is required." };
  }

  let parsed: URL;
  try {
    parsed = new URL(urlString.trim());
  } catch {
    return { valid: false, error: "Invalid URL format." };
  }

  // Only allow HTTP and HTTPS
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { valid: false, error: `Forbidden URL scheme: ${parsed.protocol}. Only http and https are allowed.` };
  }

  const hostname = parsed.hostname.toLowerCase();

  // Reject explicit localhost or cloud metadata hostnames
  const forbiddenHostnames = [
    "localhost",
    "loopback",
    "metadata.google.internal",
    "metadata",
    "instance-data",
    "169.254.169.254",
  ];

  if (forbiddenHostnames.includes(hostname) || hostname.endsWith(".localhost") || hostname.endsWith(".local") || hostname.endsWith(".internal")) {
    return { valid: false, error: `Access to restricted hostname '${hostname}' is prohibited.` };
  }

  // Check if hostname is directly an IP address
  if (net.isIP(hostname)) {
    if (net.isIPv4(hostname) && isForbiddenIPv4(hostname)) {
      return { valid: false, error: `Access to private or restricted IPv4 address '${hostname}' is prohibited.` };
    }
    if (net.isIPv6(hostname) && isForbiddenIPv6(hostname)) {
      return { valid: false, error: `Access to private or restricted IPv6 address '${hostname}' is prohibited.` };
    }
    return { valid: true, ip: hostname };
  }

  // Resolve hostname via DNS lookup
  try {
    const lookupResults = await dns.lookup(hostname, { all: true });
    if (!lookupResults || lookupResults.length === 0) {
      return { valid: false, error: `Could not resolve hostname '${hostname}'.` };
    }

    for (const res of lookupResults) {
      if (res.family === 4 && isForbiddenIPv4(res.address)) {
        return { valid: false, error: `Hostname '${hostname}' resolves to restricted IP range (${res.address}).` };
      }
      if (res.family === 6 && isForbiddenIPv6(res.address)) {
        return { valid: false, error: `Hostname '${hostname}' resolves to restricted IPv6 range (${res.address}).` };
      }
    }

    return { valid: true, ip: lookupResults[0].address };
  } catch (err: any) {
    return { valid: false, error: `DNS resolution failed for hostname '${hostname}': ${err.message || "Unknown error"}` };
  }
}
