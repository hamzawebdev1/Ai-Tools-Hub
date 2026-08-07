import React, { useState, useEffect } from "react";
import {
  Code,
  Globe,
  Lock,
  Search,
  CheckCircle,
  AlertTriangle,
  Clock,
  Palette,
  Activity,
  Copy,
  Download,
  Share2,
  RefreshCw,
  Check,
  Sparkles,
  RotateCcw,
  Upload,
  Layers,
  Terminal,
  ShieldCheck,
  FileSpreadsheet,
  KeyRound,
  Network,
  Cpu,
} from "lucide-react";
import { saveHistoryItem } from "../../services/storageService";
import { useAuth } from "../../context/AuthContext";
import { canGuestExecute, incrementGuestUsage } from "../../services/guestUsageService";
import { GuestLimitModal } from "../auth/GuestLimitModal";
import * as DevEngine from "../../services/devProcessingEngine";
import * as NetSecEngine from "../../services/networkSecurityEngine";

interface DeveloperToolsRunnerProps {
  toolId: string;
  toolName: string;
  toolSlug: string;
}

export const DeveloperToolsRunner: React.FC<DeveloperToolsRunnerProps> = ({
  toolId,
  toolName,
  toolSlug,
}) => {
  const { currentUser } = useAuth();
  const [showGuestModal, setShowGuestModal] = useState(false);

  // Core State
  const [inputVal, setInputVal] = useState(getInitialDevInput(toolId));
  const [secondaryInput, setSecondaryInput] = useState("");
  const [resultOutput, setResultOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [validationSuccess, setValidationSuccess] = useState<string | null>(null);

  // Tool Specific Parameters
  const [regexFlags, setRegexFlags] = useState("g");
  const [regexTestText, setRegexTestText] = useState("User contact emails: john.doe@company.org or sales@domain.com");
  const [hmacSecret, setHmacSecret] = useState("super-secret-key-123");
  const [cidrBits, setCidrBits] = useState(24);

  useEffect(() => {
    executeDevTool();
  }, [inputVal, secondaryInput, regexFlags, regexTestText, hmacSecret, cidrBits, toolId]);

  function getInitialDevInput(id: string): string {
    if (id.includes("json")) {
      return JSON.stringify(
        {
          appName: "AI Tools Hub",
          version: "2.0.0",
          features: ["SEO Tools", "Developer Tools", "Security Tools"],
          active: true,
        },
        null,
        2
      );
    }
    if (id.includes("csv")) {
      return "id,name,role,email\n1,Alice,Engineer,alice@example.com\n2,Bob,Designer,bob@example.com";
    }
    if (id.includes("xml")) {
      return '<?xml version="1.0" encoding="UTF-8"?><root><app>AI Tools Hub</app><version>2.0</version></root>';
    }
    if (id.includes("yaml")) {
      return "name: AI Tools Hub\nversion: 2.0.0\nenvironment: production";
    }
    if (id.includes("sql")) {
      return "SELECT id, name, email FROM users WHERE status = 'active' ORDER BY created_at DESC;";
    }
    if (id.includes("jwt")) {
      return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjI1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
    }
    if (id.includes("password")) {
      return "P@ssw0rd2026!SecureKey";
    }
    if (id.includes("ip") || id.includes("cidr") || id.includes("subnet")) {
      return "192.168.1.100";
    }
    if (id.includes("mac")) {
      return "00:1A:2B:3C:4D:5E";
    }
    if (id.includes("port")) {
      return "443";
    }

    return "Sample developer string for processing";
  }

  const executeDevTool = async () => {
    setErrorMsg("");
    setValidationSuccess(null);
    if (!inputVal.trim() && !toolId.includes("generator")) return;

    try {
      // 1. SECURITY & PASSWORD TOOLS
      if (toolId === "password-strength-checker") {
        const evalRes = NetSecEngine.evaluatePasswordStrength(inputVal);
        setResultOutput(
          `PASSWORD STRENGTH REPORT:\n-------------------------\nScore: ${evalRes.score}/100 (${evalRes.label})\nEntropy: ${evalRes.entropyBits} bits\nLength: ${evalRes.length} chars\nCrack Time Estimate: ${evalRes.crackTimeEstimate}\n\nCHARACTER COMPLEXITY:\n- Uppercase: ${evalRes.checks.hasUppercase ? "Yes ✅" : "No ❌"}\n- Lowercase: ${evalRes.checks.hasLowercase ? "Yes ✅" : "No ❌"}\n- Numbers: ${evalRes.checks.hasNumbers ? "Yes ✅" : "No ❌"}\n- Symbols: ${evalRes.checks.hasSymbols ? "Yes ✅" : "No ❌"}`
        );
        if (evalRes.score >= 75) setValidationSuccess("Strong password configuration");
      } else if (toolId === "secure-password-generator") {
        const pwd = NetSecEngine.generateSecurePassword({ length: 20 });
        setResultOutput(pwd);
      } else if (toolId === "random-token-generator") {
        const token = NetSecEngine.generateSecurePassword({ length: 32, symbols: false });
        setResultOutput(token);
      } else if (toolId === "uuid-generator" || toolId === "uuid-v4-generator") {
        setResultOutput(DevEngine.generateUuidV4(5).join("\n"));
      } else if (toolId === "sha-256-generator") {
        const hash = await NetSecEngine.computeHash(inputVal, "SHA-256");
        setResultOutput(hash);
      } else if (toolId === "sha-384-generator") {
        const hash = await NetSecEngine.computeHash(inputVal, "SHA-384");
        setResultOutput(hash);
      } else if (toolId === "sha-512-generator") {
        const hash = await NetSecEngine.computeHash(inputVal, "SHA-512");
        setResultOutput(hash);
      } else if (toolId === "hmac-generator") {
        const hmac = await NetSecEngine.computeHMAC(inputVal, hmacSecret);
        setResultOutput(hmac);
      } else if (toolId === "base64-encoder") {
        setResultOutput(btoa(inputVal));
      } else if (toolId === "base64-decoder") {
        setResultOutput(atob(inputVal));
      } else if (toolId.includes("html-entity")) {
        setResultOutput(inputVal.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"));
      } else if (toolId.includes("jwt")) {
        const jwt = NetSecEngine.decodeJWT(inputVal);
        if (!jwt.valid) throw new Error(jwt.error);
        setResultOutput(
          `JWT AUDIT:\nStatus: ${jwt.isExpired ? "EXPIRED ❌" : "VALID / ACTIVE 🔒"}\nExpires At: ${jwt.expiresAt}\nIssued At: ${jwt.issuedAt}\n\nHEADER:\n${JSON.stringify(jwt.header, null, 2)}\n\nPAYLOAD:\n${JSON.stringify(jwt.payload, null, 2)}`
        );
      } else if (toolId === "csp-header-generator" || toolId.includes("security-headers")) {
        setResultOutput(
          `Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; frame-ancestors 'self';\nStrict-Transport-Security: max-age=31536000; includeSubDomains; preload\nX-Frame-Options: SAMEORIGIN\nX-Content-Type-Options: nosniff\nReferrer-Policy: strict-origin-when-cross-origin\nPermissions-Policy: camera=(), microphone=(), geolocation=(self)`
        );
      } else if (toolId === "sri-hash-generator") {
        const sri = await NetSecEngine.generateSRIHash(inputVal, "sha384");
        setResultOutput(sri);
      }

      // 2. NETWORK & IP TOOLS
      else if (toolId === "ipv4-validator" || toolId === "ip-address-parser" || toolId === "ip-inspector") {
        const res = NetSecEngine.validateIPv4(inputVal);
        if (!res.valid) throw new Error("Invalid IPv4 address format.");
        setResultOutput(
          `IPv4 PARSE REPORT:\nIP Address: ${inputVal}\nClass: ${res.ipClass}\nPrivate Range: ${res.isPrivate ? "Yes ✅" : "No (Public) 🌐"}\nLoopback: ${res.isLoopback ? "Yes 🔄" : "No"}\nBinary: ${res.binary}\n32-bit Integer: ${res.integer}`
        );
      } else if (toolId === "ipv6-validator") {
        const res = NetSecEngine.validateIPv6(inputVal);
        setResultOutput(res.valid ? `✅ VALID IPv6 ADDRESS: ${inputVal}` : `❌ INVALID IPv6 ADDRESS`);
      } else if (toolId === "cidr-calculator" || toolId === "subnet-calculator" || toolId.includes("mask") || toolId.includes("host-range") || toolId.includes("broadcast") || toolId.includes("network-address")) {
        const res = NetSecEngine.calculateSubnet(inputVal, cidrBits);
        setResultOutput(
          `SUBNET CALCULATOR REPORT:\nIP Address: ${res.ip}\nCIDR Notation: /${res.cidr}\nNetmask: ${res.netmask}\nWildcard Mask: ${res.wildcard}\nNetwork Address: ${res.networkAddress}\nBroadcast Address: ${res.broadcastAddress}\nFirst Usable Host: ${res.firstUsableIp}\nLast Usable Host: ${res.lastUsableIp}\nTotal Hosts: ${res.totalHosts.toLocaleString()}\nUsable Hosts: ${res.usableHosts.toLocaleString()}`
        );
      } else if (toolId === "binary-ip-converter") {
        const res = NetSecEngine.validateIPv4(inputVal);
        setResultOutput(res.valid ? `IPv4 Dotted Decimal: ${inputVal}\nBinary Representation: ${res.binary}` : "Invalid IP address");
      } else if (toolId === "decimal-ip-converter" || toolId === "ipv4-to-integer") {
        const longVal = NetSecEngine.ipToLong(inputVal);
        setResultOutput(`IPv4 Address: ${inputVal}\n32-bit Unsigned Integer: ${longVal}`);
      } else if (toolId === "integer-to-ipv4") {
        const num = parseInt(inputVal, 10);
        setResultOutput(`Integer: ${num}\nIPv4 Address: ${NetSecEngine.longToIp(num)}`);
      } else if (toolId === "mac-address-validator") {
        const mac = NetSecEngine.validateMACAddress(inputVal);
        if (!mac.valid) throw new Error("Invalid MAC Address format.");
        setResultOutput(
          `MAC ADDRESS FORMATS:\nColon Format: ${mac.colonFormat}\nHyphen Format: ${mac.hyphenFormat}\nDot Notation: ${mac.dotFormat}`
        );
      } else if (toolId === "port-number-validator") {
        const port = NetSecEngine.lookupPortService(parseInt(inputVal, 10));
        setResultOutput(
          port.valid
            ? `PORT ${inputVal} ANALYSIS:\nService: ${port.service}\nDescription: ${port.description}`
            : "Invalid port number (must be 1-65535)."
        );
      } else if (toolId.includes("dns-record")) {
        setResultOutput(
          `EXAMPLE ZONE FILE DNS RECORDS:\nexample.com. IN A 192.168.1.100\nexample.com. IN AAAA 2001:db8::1\nwww.example.com. IN CNAME example.com.\nexample.com. IN MX 10 mail.example.com.\nexample.com. IN TXT "v=spf1 include:_spf.google.com ~all"`
        );
      }

      // 3. STANDARD JSON/XML/YAML/SQL/REGEX DEV TOOLS
      else if (toolId.includes("json")) {
        if (toolId.includes("validator")) {
          const val = DevEngine.validateJson(inputVal);
          setResultOutput(val.valid ? "✅ VALID JSON SYNTAX" : `❌ INVALID JSON:\n${val.error}`);
        } else if (toolId.includes("minifi")) {
          setResultOutput(DevEngine.minifyJson(inputVal));
        } else {
          setResultOutput(DevEngine.formatJson(inputVal, 2));
        }
      } else if (toolId.includes("xml")) {
        setResultOutput(DevEngine.formatXml(inputVal));
      } else if (toolId.includes("yaml")) {
        setResultOutput(DevEngine.formatYaml(inputVal));
      } else if (toolId.includes("sql")) {
        setResultOutput(DevEngine.formatSql(inputVal));
      } else if (toolId.includes("regex")) {
        const res = DevEngine.executeRegexTest(inputVal, regexFlags, regexTestText);
        setResultOutput(
          `Regex Pattern: /${res.pattern}/${res.flags}\nMatches Count: ${res.matchCount}\n` +
            res.matches.map((m, i) => `#${i + 1}: "${m.match}"`).join("\n")
        );
      } else {
        setResultOutput(inputVal.trim());
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Execution error in developer tool.");
      setResultOutput(`Error: ${err.message}`);
    }
  };

  const handleCopy = () => {
    if (!resultOutput) return;
    navigator.clipboard.writeText(resultOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Workspace Inputs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Terminal className="w-4 h-4 text-indigo-500" />
            {toolName} Workspace
          </span>
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Client Cryptography & Math Engine
          </span>
        </div>

        {toolId.includes("subnet") || toolId.includes("cidr") ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 block mb-1">
                IP Address
              </label>
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 block mb-1">
                CIDR Prefix Length (/{cidrBits})
              </label>
              <input
                type="range"
                min={0}
                max={32}
                value={cidrBits}
                onChange={(e) => setCidrBits(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-600"
              />
            </div>
          </div>
        ) : (
          <div>
            <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 block mb-1">
              Input String / Payload
            </label>
            <textarea
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              rows={5}
              className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono leading-relaxed"
            />
          </div>
        )}

        {toolId.includes("hmac") && (
          <div>
            <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 block mb-1">
              HMAC Secret Key
            </label>
            <input
              type="text"
              value={hmacSecret}
              onChange={(e) => setHmacSecret(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono"
            />
          </div>
        )}
      </div>

      {/* Output Console Workspace */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Execution Console Result
          </label>
          <button
            onClick={handleCopy}
            className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-semibold flex items-center gap-1 hover:bg-indigo-100 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy Output"}</span>
          </button>
        </div>

        <textarea
          readOnly
          value={resultOutput}
          rows={10}
          className="w-full p-4 bg-slate-950 text-indigo-300 border border-slate-800 rounded-2xl text-xs font-mono leading-relaxed"
        />
      </div>
    </div>
  );
};
