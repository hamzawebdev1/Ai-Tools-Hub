import React, { useState, useEffect } from "react";
import {
  Type,
  Copy,
  Download,
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
  Sliders,
  Scissors,
  Zap,
  RotateCcw,
  Upload,
} from "lucide-react";
import { saveHistoryItem } from "../../services/storageService";
import { useAuth } from "../../context/AuthContext";
import { canGuestExecute, incrementGuestUsage } from "../../services/guestUsageService";
import { GuestLimitModal } from "../auth/GuestLimitModal";
import * as TextEngine from "../../services/textProcessingEngine";

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

  // Input State
  const [inputText, setInputText] = useState(getInitialTextForTool(toolId));
  const [secondaryInput, setSecondaryInput] = useState("");
  const [outputText, setOutputText] = useState("");
  const [copied, setCopied] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Custom Controls State
  const [passwordLength, setPasswordLength] = useState(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);

  // Find & Replace
  const [findStr, setFindStr] = useState("lorem");
  const [replaceStr, setReplaceStr] = useState("ipsum");
  const [isRegex, setIsRegex] = useState(false);
  const [matchCase, setMatchCase] = useState(false);

  // Joiner / Splitter / Prefix-Suffix / Line Numbers
  const [delimiter, setDelimiter] = useState(", ");
  const [prefix, setPrefix] = useState("> ");
  const [suffix, setSuffix] = useState("");
  const [startLineNum, setStartLineNum] = useState(1);
  const [lineNumFormat, setLineNumFormat] = useState("1.");

  // Lorem Ipsum / Random Text
  const [loremType, setLoremType] = useState<"paragraphs" | "sentences" | "words">("paragraphs");
  const [loremCount, setLoremCount] = useState(3);

  // ASCII Art Font
  const [asciiFont, setAsciiFont] = useState<any>("Standard");

  // Diff Chunks
  const [diffChunks, setDiffChunks] = useState<TextEngine.DiffChunk[]>([]);

  // Text Stats Object
  const [stats, setStats] = useState<TextEngine.TextStats | null>(null);

  useEffect(() => {
    processText();
  }, [
    inputText,
    secondaryInput,
    passwordLength,
    includeUpper,
    includeLower,
    includeNumbers,
    includeSymbols,
    excludeSimilar,
    findStr,
    replaceStr,
    isRegex,
    matchCase,
    delimiter,
    prefix,
    suffix,
    startLineNum,
    lineNumFormat,
    loremType,
    loremCount,
    asciiFont,
    toolId,
  ]);

  function getInitialTextForTool(id: string): string {
    if (id === "password-generator" || id === "strong-password-generator" || id === "uuid-generator") return "";
    if (id === "lorem-ipsum-generator" || id === "random-text-generator") return "";
    if (id === "text-compare" || id === "text-diff-checker") return "Line 1: Original text content\nLine 2: Fast local browser engine\nLine 3: Shared text sample";
    return "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sustainable digital solutions transform modern productivity.\n\nContact support at admin@example.com or visit https://example.com for documentation. Call +1-800-555-0199 for inquiries!";
  }

  const processText = async () => {
    setValidationError("");
    setIsProcessing(true);

    try {
      // 1. Counters & Statistics
      if (toolId === "word-counter" || toolId === "character-counter" || toolId === "character-counter-no-spaces" || toolId === "sentence-counter" || toolId === "paragraph-counter" || toolId === "line-counter" || toolId === "reading-time-calculator" || toolId === "text-statistics") {
        const s = TextEngine.countTextStats(inputText);
        setStats(s);
        setOutputText(
          `📊 TEXT STATISTICS SUMMARY:\n---------------------------\nWords: ${s.words}\nCharacters (with spaces): ${s.charsWithSpaces}\nCharacters (no spaces): ${s.charsNoSpaces}\nSentences: ${s.sentences}\nParagraphs: ${s.paragraphs}\nTotal Lines: ${s.lines}\nEmpty Lines: ${s.emptyLines}\nEstimated Reading Time: ~${s.readingTimeMinutes} min\nEstimated Speaking Time: ~${s.speakingTimeMinutes} min\nAverage Word Length: ${s.avgWordLength} chars`
        );
      }
      // 2. Case Converters
      else if (toolId === "case-converter" || toolId === "text-case-converter") {
        setOutputText(
          `UPPERCASE:\n${TextEngine.convertCase(inputText, "uppercase")}\n\nlowercase:\n${TextEngine.convertCase(inputText, "lowercase")}\n\nTitle Case:\n${TextEngine.convertCase(inputText, "titlecase")}\n\nSentence case:\n${TextEngine.convertCase(inputText, "sentencecase")}\n\ncamelCase:\n${TextEngine.convertCase(inputText, "camelcase")}\n\nsnake_case:\n${TextEngine.convertCase(inputText, "snakecase")}\n\nkebab-case:\n${TextEngine.convertCase(inputText, "kebabcase")}`
        );
      } else if (toolId === "uppercase-converter") setOutputText(TextEngine.convertCase(inputText, "uppercase"));
      else if (toolId === "lowercase-converter") setOutputText(TextEngine.convertCase(inputText, "lowercase"));
      else if (toolId === "title-case-converter") setOutputText(TextEngine.convertCase(inputText, "titlecase"));
      else if (toolId === "sentence-case-converter") setOutputText(TextEngine.convertCase(inputText, "sentencecase"));
      else if (toolId === "camelcase-converter") setOutputText(TextEngine.convertCase(inputText, "camelcase"));
      else if (toolId === "pascalcase-converter") setOutputText(TextEngine.convertCase(inputText, "pascalcase"));
      else if (toolId === "snakecase-converter") setOutputText(TextEngine.convertCase(inputText, "snakecase"));
      else if (toolId === "kebabcase-converter") setOutputText(TextEngine.convertCase(inputText, "kebabcase"));
      else if (toolId === "text-case-swapper") setOutputText(TextEngine.convertCase(inputText, "swapcase"));

      // 3. Reverse Text / Words
      else if (toolId === "reverse-text") setOutputText(TextEngine.reverseText(inputText, "characters"));
      else if (toolId === "reverse-words") setOutputText(TextEngine.reverseText(inputText, "words"));

      // 4. Sort Lines
      else if (toolId === "sort-lines" || toolId === "sort-lines-a-z" || toolId === "text-sorter") setOutputText(TextEngine.sortLines(inputText, "az"));
      else if (toolId === "sort-lines-z-a") setOutputText(TextEngine.sortLines(inputText, "za"));

      // 5. Line Operations
      else if (toolId === "remove-duplicate-lines") setOutputText(TextEngine.removeDuplicateLines(inputText));
      else if (toolId === "remove-empty-lines") setOutputText(TextEngine.removeEmptyLines(inputText));
      else if (toolId === "remove-extra-spaces") setOutputText(TextEngine.removeExtraSpaces(inputText));
      else if (toolId === "remove-extra-line-breaks") setOutputText(TextEngine.removeExtraLineBreaks(inputText));
      else if (toolId === "trim-text") setOutputText(TextEngine.trimText(inputText));
      else if (toolId === "remove-special-characters") setOutputText(TextEngine.removeSpecialCharacters(inputText));
      else if (toolId === "remove-numbers") setOutputText(TextEngine.removeNumbers(inputText));
      else if (toolId === "extract-numbers") setOutputText(TextEngine.extractNumbers(inputText).join("\n"));
      else if (toolId === "extract-emails") setOutputText(TextEngine.extractEmails(inputText).join("\n") || "No valid emails found.");
      else if (toolId === "extract-urls") setOutputText(TextEngine.extractUrls(inputText).join("\n") || "No valid URLs found.");
      else if (toolId === "find-replace") setOutputText(TextEngine.findAndReplace(inputText, findStr, replaceStr, isRegex, matchCase));
      else if (toolId === "text-compare" || toolId === "text-difference-checker") {
        const chunks = TextEngine.diffText(inputText, secondaryInput || "Line 1: Original text content\nLine 2: Modified browser engine\nLine 3: Shared text sample");
        setDiffChunks(chunks);
        setOutputText(chunks.map((c) => (c.added ? `+ ${c.value}` : c.removed ? `- ${c.value}` : `  ${c.value}`)).join(""));
      } else if (toolId === "text-joiner") setOutputText(TextEngine.joinText(inputText, delimiter));
      else if (toolId === "text-splitter") setOutputText(TextEngine.splitText(inputText, delimiter));
      else if (toolId === "text-prefix-suffix-adder") setOutputText(TextEngine.addPrefixSuffix(inputText, prefix, suffix));
      else if (toolId === "line-number-generator") setOutputText(TextEngine.generateLineNumbers(inputText, startLineNum, lineNumFormat));

      // 6. Generators (Lorem, Passwords, UUID, Slug)
      else if (toolId === "lorem-ipsum-generator" || toolId === "random-text-generator") setOutputText(TextEngine.generateLoremIpsum(loremType, loremCount));
      else if (toolId === "random-string-generator") setOutputText(TextEngine.generatePassword({ length: passwordLength, includeUpper, includeLower, includeNumbers, includeSymbols: false, excludeSimilar }));
      else if (toolId === "password-generator" || toolId === "strong-password-generator") {
        const pass = TextEngine.generatePassword({ length: passwordLength, includeUpper, includeLower, includeNumbers, includeSymbols, excludeSimilar });
        setOutputText(pass);
      } else if (toolId === "password-strength-checker") {
        const audit = TextEngine.checkPasswordStrength(inputText);
        setOutputText(
          `🔒 PASSWORD SECURITY AUDIT:\n-------------------------\nScore: ${audit.score}/100 (${audit.label})\nEntropy: ${audit.entropy} bits\nEstimated Crack Time: ${audit.crackTime}\n\nLength: ${audit.details.length} chars\nUppercase Letters: ${audit.details.hasUpper ? "Yes" : "No"}\nLowercase Letters: ${audit.details.hasLower ? "Yes" : "No"}\nNumbers: ${audit.details.hasNumber ? "Yes" : "No"}\nSymbols: ${audit.details.hasSymbol ? "Yes" : "No"}`
        );
      } else if (toolId === "uuid-generator") setOutputText(TextEngine.generateUuid(5).join("\n"));
      else if (toolId === "slug-generator") setOutputText(TextEngine.generateSlug(inputText));

      // 7. Encoders & Decoders
      else if (toolId === "html-escape") setOutputText(TextEngine.escapeHtml(inputText));
      else if (toolId === "html-unescape") setOutputText(TextEngine.unescapeHtml(inputText));
      else if (toolId === "url-encode") setOutputText(encodeURIComponent(inputText));
      else if (toolId === "url-decode") setOutputText(decodeURIComponent(inputText));
      else if (toolId === "base64-encode") setOutputText(TextEngine.base64EncodeUnicode(inputText));
      else if (toolId === "base64-decode") setOutputText(TextEngine.base64DecodeUnicode(inputText));
      else if (toolId === "unicode-encoder") setOutputText(TextEngine.unicodeEncode(inputText));
      else if (toolId === "unicode-decoder") setOutputText(TextEngine.unicodeDecode(inputText));

      // 8. Markdown & ASCII Art
      else if (toolId === "markdown-preview" || toolId === "markdown-to-html") setOutputText(TextEngine.renderMarkdownToHtml(inputText));
      else if (toolId === "html-to-markdown") setOutputText(TextEngine.convertHtmlToMarkdown(inputText));
      else if (toolId === "ascii-art-generator" || toolId === "text-to-ascii-art") {
        const art = await TextEngine.generateAsciiArt(inputText || "AI STUDIO", asciiFont);
        setOutputText(art);
      } else if (toolId === "nato-phonetic-converter") setOutputText(TextEngine.convertToNatoPhonetic(inputText));
      else if (toolId === "morse-code-converter") setOutputText(TextEngine.convertMorseCode(inputText, true));
      else if (toolId === "binary-text-converter") setOutputText(TextEngine.convertBinaryText(inputText, true));
      else if (toolId === "hex-text-converter") setOutputText(TextEngine.convertHexText(inputText, true));
      else if (toolId === "sentence-extractor") setOutputText(TextEngine.countTextStats(inputText).words > 0 ? inputText.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean).join("\n\n") : "");
      else if (toolId === "text-cleaner") setOutputText(TextEngine.cleanTextContent(inputText));
      else {
        setOutputText(inputText.trim());
      }
    } catch (err: any) {
      setValidationError(err.message || "Execution error processing text.");
    } finally {
      setIsProcessing(false);
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
    a.download = `${toolSlug || "text"}-output.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) setInputText(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Tool Header Options & Custom Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Tool Configurations
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <label className="cursor-pointer px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload File</span>
              <input type="file" accept=".txt,.md,.json,.html,.csv,.xml,.log" onChange={handleFileUpload} className="hidden" />
            </label>
            <button
              onClick={() => {
                setInputText("");
                setOutputText("");
              }}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Custom Input Controls based on Tool */}
        {(toolId === "password-generator" || toolId === "strong-password-generator" || toolId === "random-string-generator") && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                Length: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{passwordLength}</span>
              </label>
              <input
                type="range"
                min="8"
                max="128"
                value={passwordLength}
                onChange={(e) => setPasswordLength(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>
            <div className="flex items-center gap-2 pt-2">
              <input type="checkbox" id="upper" checked={includeUpper} onChange={(e) => setIncludeUpper(e.target.checked)} className="rounded accent-indigo-600" />
              <label htmlFor="upper" className="text-xs font-semibold text-slate-700 dark:text-slate-300">Uppercase (A-Z)</label>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <input type="checkbox" id="numbers" checked={includeNumbers} onChange={(e) => setIncludeNumbers(e.target.checked)} className="rounded accent-indigo-600" />
              <label htmlFor="numbers" className="text-xs font-semibold text-slate-700 dark:text-slate-300">Numbers (0-9)</label>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <input type="checkbox" id="symbols" checked={includeSymbols} onChange={(e) => setIncludeSymbols(e.target.checked)} className="rounded accent-indigo-600" />
              <label htmlFor="symbols" className="text-xs font-semibold text-slate-700 dark:text-slate-300">Symbols (!@#$)</label>
            </div>
          </div>
        )}

        {toolId === "find-replace" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Find String:</label>
              <input type="text" value={findStr} onChange={(e) => setFindStr(e.target.value)} className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Replace With:</label>
              <input type="text" value={replaceStr} onChange={(e) => setReplaceStr(e.target.value)} className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono" />
            </div>
            <div className="flex items-center gap-2 pt-4">
              <input type="checkbox" id="regex" checked={isRegex} onChange={(e) => setIsRegex(e.target.checked)} className="rounded accent-indigo-600" />
              <label htmlFor="regex" className="text-xs font-semibold text-slate-700 dark:text-slate-300">Regex Pattern</label>
            </div>
            <div className="flex items-center gap-2 pt-4">
              <input type="checkbox" id="case" checked={matchCase} onChange={(e) => setMatchCase(e.target.checked)} className="rounded accent-indigo-600" />
              <label htmlFor="case" className="text-xs font-semibold text-slate-700 dark:text-slate-300">Match Case</label>
            </div>
          </div>
        )}

        {(toolId === "lorem-ipsum-generator" || toolId === "random-text-generator") && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Type:</label>
              <select value={loremType} onChange={(e) => setLoremType(e.target.value as any)} className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs">
                <option value="paragraphs">Paragraphs</option>
                <option value="sentences">Sentences</option>
                <option value="words">Words</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Count ({loremCount}):</label>
              <input type="range" min="1" max="20" value={loremCount} onChange={(e) => setLoremCount(Number(e.target.value))} className="w-full accent-indigo-600" />
            </div>
          </div>
        )}

        {(toolId === "ascii-art-generator" || toolId === "text-to-ascii-art") && (
          <div className="pt-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">ASCII Font Style:</label>
            <select value={asciiFont} onChange={(e) => setAsciiFont(e.target.value)} className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono">
              <option value="Standard">Standard</option>
              <option value="Slant">Slant</option>
              <option value="Shadow">Shadow</option>
              <option value="Doom">Doom</option>
              <option value="Banner">Banner</option>
            </select>
          </div>
        )}
      </div>

      {/* Primary Text Workspace (Input & Output) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Box */}
        {toolId !== "uuid-generator" && toolId !== "lorem-ipsum-generator" && toolId !== "random-text-generator" && toolId !== "password-generator" && toolId !== "strong-password-generator" && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-500" /> Input Text
              </label>
              <span className="text-[11px] font-mono text-slate-400">
                {inputText.length} chars • {inputText.split(/\s+/).filter(Boolean).length} words
              </span>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type or paste your content here..."
              rows={12}
              className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 font-mono leading-relaxed focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
            />
          </div>
        )}

        {/* Secondary Input for Compare */}
        {(toolId === "text-compare" || toolId === "text-difference-checker") && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-purple-500" /> Comparison Text (Modified)
              </label>
            </div>
            <textarea
              value={secondaryInput}
              onChange={(e) => setSecondaryInput(e.target.value)}
              placeholder="Paste modified text to compare against original..."
              rows={12}
              className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 font-mono leading-relaxed focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        )}

        {/* Output Box */}
        <div
          className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-3 ${
            toolId === "uuid-generator" || toolId === "lorem-ipsum-generator" || toolId === "password-generator" || toolId === "strong-password-generator"
              ? "lg:col-span-2"
              : ""
          }`}
        >
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-500" /> Processed Output
            </label>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                disabled={!outputText}
                className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-semibold flex items-center gap-1 hover:bg-indigo-100 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
              <button
                onClick={handleDownload}
                disabled={!outputText}
                className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>

          {toolId === "markdown-preview" ? (
            <div
              className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl min-h-[250px] text-sm prose dark:prose-invert max-w-none overflow-auto"
              dangerouslySetInnerHTML={{ __html: outputText }}
            />
          ) : (
            <textarea
              readOnly
              value={outputText}
              rows={12}
              className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 font-mono leading-relaxed focus:outline-none"
            />
          )}
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
