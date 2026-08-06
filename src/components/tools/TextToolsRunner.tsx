import React, { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import {
  Type,
  Copy,
  Download,
  Share2,
  RefreshCw,
  Check,
  Sparkles,
  ShieldCheck,
  Hash,
  Key,
  FileCode,
  FileText,
  AlertCircle,
  Eye,
  BarChart2,
} from "lucide-react";
import { saveHistoryItem } from "../../services/storageService";
import { useAuth } from "../../context/AuthContext";
import { canGuestExecute, incrementGuestUsage } from "../../services/guestUsageService";
import { GuestLimitModal } from "../auth/GuestLimitModal";

interface TextToolsRunnerProps {
  toolId: string;
  toolName: string;
  toolSlug: string;
}

export const TextToolsRunner: React.FC<TextToolsRunnerProps> = ({
  toolId,
  toolName,
  toolSlug,
}) => {
  const { currentUser } = useAuth();
  const [showGuestModal, setShowGuestModal] = useState(false);

  const [inputText, setInputText] = useState(
    toolId === "password-generator"
      ? ""
      : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sustainable digital solutions transform modern productivity."
  );
  const [outputText, setOutputText] = useState("");
  const [copied, setCopied] = useState(false);
  const [passwordLength, setPasswordLength] = useState(16);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    processText();
  }, [inputText, passwordLength, includeSymbols, includeNumbers, toolId]);

  const processText = () => {
    setValidationError("");
    if (!inputText && toolId !== "password-generator" && toolId !== "uuid-generator") {
      setOutputText("");
      return;
    }

    try {
      if (toolId === "case-converter") {
        setOutputText(
          `UPPERCASE:\n${inputText.toUpperCase()}\n\nlowercase:\n${inputText.toLowerCase()}\n\nTitle Case:\n${inputText.replace(/\b\w/g, (c) => c.toUpperCase())}`
        );
      } else if (toolId === "word-counter" || toolId === "character-counter") {
        const words = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
        const chars = inputText.length;
        const charsNoSpaces = inputText.replace(/\s+/g, "").length;
        const lines = inputText.split("\n").length;
        const readTime = Math.ceil(words / 200);

        setOutputText(
          `📊 TEXT ANALYSIS STATISTICS:\n-----------------------------\nWords Count: ${words}\nCharacters (with spaces): ${chars}\nCharacters (no spaces): ${charsNoSpaces}\nParagraph Lines: ${lines}\nEstimated Reading Time: ~${readTime} min`
        );
      } else if (toolId === "remove-duplicate-lines") {
        const lines = inputText.split("\n");
        const unique = Array.from(new Set(lines));
        setOutputText(unique.join("\n"));
      } else if (toolId === "remove-extra-spaces") {
        setOutputText(inputText.replace(/\s+/g, " ").trim());
      } else if (toolId === "reverse-text") {
        setOutputText(inputText.split("").reverse().join(""));
      } else if (toolId === "slug-generator") {
        const slug = inputText
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_-]+/g, "-")
          .replace(/^-+|-+$/g, "");
        setOutputText(slug);
      } else if (toolId === "password-generator") {
        let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        if (includeNumbers) chars += "0123456789";
        if (includeSymbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
        let pass = "";
        for (let i = 0; i < passwordLength; i++) {
          pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setOutputText(pass);
      } else if (toolId === "password-strength-checker") {
        const lengthScore = inputText.length >= 12 ? 30 : inputText.length >= 8 ? 15 : 5;
        const hasUpper = /[A-Z]/.test(inputText) ? 20 : 0;
        const hasLower = /[a-z]/.test(inputText) ? 15 : 0;
        const hasNum = /[0-9]/.test(inputText) ? 15 : 0;
        const hasSym = /[^A-Za-z0-9]/.test(inputText) ? 20 : 0;
        const total = lengthScore + hasUpper + hasLower + hasNum + hasSym;

        let rating = "Weak";
        if (total > 80) rating = "Very Strong 🔒";
        else if (total > 60) rating = "Strong 💪";
        else if (total > 40) rating = "Moderate ⚠️";

        setOutputText(
          `SECURITY AUDIT SCORE: ${total}/100 (${rating})\n\nLength: ${inputText.length} chars\nUppercase: ${hasUpper ? "Yes" : "No"}\nLowercase: ${hasLower ? "Yes" : "No"}\nNumbers: ${hasNum ? "Yes" : "No"}\nSymbols: ${hasSym ? "Yes" : "No"}`
        );
      } else if (toolId === "uuid-generator") {
        const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
          const r = (Math.random() * 16) | 0;
          const v = c === "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });
        setOutputText(uuid);
      } else if (toolId === "hash-generator") {
        const md5 = CryptoJS.MD5(inputText).toString();
        const sha1 = CryptoJS.SHA1(inputText).toString();
        const sha256 = CryptoJS.SHA256(inputText).toString();
        const sha512 = CryptoJS.SHA512(inputText).toString();
        setOutputText(
          `MD5:\n${md5}\n\nSHA1:\n${sha1}\n\nSHA256:\n${sha256}\n\nSHA512:\n${sha512}`
        );
      } else if (toolId === "base64-encode-decode") {
        try {
          const encoded = btoa(inputText);
          setOutputText(encoded);
        } catch {
          const decoded = atob(inputText);
          setOutputText(decoded);
        }
      } else if (toolId === "url-encode-decode") {
        setOutputText(
          `Encoded URL:\n${encodeURIComponent(inputText)}\n\nDecoded URL:\n${decodeURIComponent(inputText)}`
        );
      } else if (toolId === "json-formatter" || toolId === "json-validator") {
        const parsed = JSON.parse(inputText);
        setOutputText(JSON.stringify(parsed, null, 2));
      } else if (toolId === "code-beautifier" || toolId === "css-minifier" || toolId === "js-minifier" || toolId === "html-minifier") {
        setOutputText(inputText.replace(/\s+/g, " ").trim());
      } else {
        setOutputText(inputText.trim());
      }
    } catch (err: any) {
      setValidationError(err.message || "Invalid input text syntax.");
    }
  };

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!outputText) return;
    const blob = new Blob([outputText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${toolSlug}-result.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Tool Generator Options */}
      {toolId === "password-generator" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
              Length ({passwordLength})
            </label>
            <input
              type="range"
              min="8"
              max="64"
              value={passwordLength}
              onChange={(e) => setPasswordLength(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>
          <div className="flex items-center gap-2 pt-4">
            <input
              type="checkbox"
              id="symbols"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
              className="rounded text-indigo-600"
            />
            <label htmlFor="symbols" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Include Symbols (!@#$)
            </label>
          </div>
          <div className="flex items-center gap-2 pt-4">
            <input
              type="checkbox"
              id="numbers"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
              className="rounded text-indigo-600"
            />
            <label htmlFor="numbers" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Include Numbers (0-9)
            </label>
          </div>
        </div>
      )}

      {/* Primary Workspace Box */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Box */}
        {toolId !== "uuid-generator" && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Input Content
              </label>
              <span className="text-[11px] text-slate-400">
                {inputText.length} chars
              </span>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste or type string contents here..."
              rows={10}
              className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 font-mono leading-relaxed focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
        )}

        {/* Output Box */}
        <div
          className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-3 ${
            toolId === "uuid-generator" ? "lg:col-span-2" : ""
          }`}
        >
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Processed Output Result
            </label>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-semibold flex items-center gap-1 hover:bg-indigo-100"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
              <button
                onClick={handleDownload}
                className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1 hover:bg-slate-200"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>

          <textarea
            readOnly
            value={outputText}
            rows={10}
            className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 font-mono leading-relaxed"
          />
        </div>
      </div>

      {validationError && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-2xl text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      <GuestLimitModal
        isOpen={showGuestModal}
        onClose={() => setShowGuestModal(false)}
        toolName={toolName}
      />
    </div>
  );
};
