import { marked } from "marked";
import figlet from "figlet";
import * as diff from "diff";

/**
 * Text Statistics & Analysis
 */
export interface TextStats {
  words: number;
  charsWithSpaces: number;
  charsNoSpaces: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  emptyLines: number;
  readingTimeMinutes: number;
  speakingTimeMinutes: number;
  avgWordLength: number;
}

export function countTextStats(text: string): TextStats {
  if (!text) {
    return {
      words: 0,
      charsWithSpaces: 0,
      charsNoSpaces: 0,
      sentences: 0,
      paragraphs: 0,
      lines: 0,
      emptyLines: 0,
      readingTimeMinutes: 0,
      speakingTimeMinutes: 0,
      avgWordLength: 0,
    };
  }

  const charsWithSpaces = text.length;
  const charsNoSpaces = text.replace(/\s/g, "").length;
  const lines = text.split("\n");
  const lineCount = lines.length;
  const emptyLines = lines.filter((l) => l.trim() === "").length;

  const trimmed = text.trim();
  const wordsArray = trimmed ? trimmed.split(/\s+/) : [];
  const words = wordsArray.length;

  const sentencesArray = trimmed ? trimmed.split(/[.!?]+(?:\s+|$)/).filter(Boolean) : [];
  const sentences = sentencesArray.length;

  const paragraphsArray = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
  const paragraphs = paragraphsArray.length;

  const readingTimeMinutes = Math.ceil(words / 200);
  const speakingTimeMinutes = Math.ceil(words / 130);

  const totalCharInWords = wordsArray.reduce((acc, w) => acc + w.length, 0);
  const avgWordLength = words > 0 ? parseFloat((totalCharInWords / words).toFixed(1)) : 0;

  return {
    words,
    charsWithSpaces,
    charsNoSpaces,
    sentences,
    paragraphs,
    lines: lineCount,
    emptyLines,
    readingTimeMinutes,
    speakingTimeMinutes,
    avgWordLength,
  };
}

/**
 * Case Conversion Options
 */
export type CaseType =
  | "uppercase"
  | "lowercase"
  | "titlecase"
  | "sentencecase"
  | "camelcase"
  | "pascalcase"
  | "snakecase"
  | "kebabcase"
  | "constantcase"
  | "dotcase"
  | "swapcase";

export function convertCase(text: string, targetCase: CaseType): string {
  if (!text) return "";

  switch (targetCase) {
    case "uppercase":
      return text.toUpperCase();
    case "lowercase":
      return text.toLowerCase();
    case "titlecase":
      return text.replace(/\b[a-z]/gi, (match) => match.toUpperCase());
    case "sentencecase":
      return text
        .toLowerCase()
        .replace(/(^\s*|[.!?]\s+)([a-z])/g, (_, p1, p2) => p1 + p2.toUpperCase());
    case "camelcase": {
      const words = text.replace(/[^a-zA-Z0-9\s-_]/g, "").split(/[\s-_]+/);
      return words
        .map((w, i) => {
          if (!w) return "";
          const lower = w.toLowerCase();
          return i === 0 ? lower : lower.charAt(0).toUpperCase() + lower.slice(1);
        })
        .join("");
    }
    case "pascalcase": {
      const words = text.replace(/[^a-zA-Z0-9\s-_]/g, "").split(/[\s-_]+/);
      return words
        .map((w) => {
          if (!w) return "";
          const lower = w.toLowerCase();
          return lower.charAt(0).toUpperCase() + lower.slice(1);
        })
        .join("");
    }
    case "snakecase": {
      return text
        .replace(/([a-z])([A-Z])/g, "$1_$2")
        .replace(/[^a-zA-Z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "")
        .toLowerCase();
    }
    case "kebabcase": {
      return text
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .toLowerCase();
    }
    case "constantcase": {
      return text
        .replace(/([a-z])([A-Z])/g, "$1_$2")
        .replace(/[^a-zA-Z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "")
        .toUpperCase();
    }
    case "dotcase": {
      return text
        .replace(/([a-z])([A-Z])/g, "$1.$2")
        .replace(/[^a-zA-Z0-9]+/g, ".")
        .replace(/^\.+|\.+$/g, "")
        .toLowerCase();
    }
    case "swapcase": {
      return text
        .split("")
        .map((c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()))
        .join("");
    }
    default:
      return text;
  }
}

/**
 * Reverse Text
 */
export function reverseText(text: string, mode: "characters" | "words" | "lines" = "characters"): string {
  if (!text) return "";
  if (mode === "characters") {
    return Array.from(text).reverse().join("");
  }
  if (mode === "words") {
    return text
      .split("\n")
      .map((line) => line.split(" ").reverse().join(" "))
      .join("\n");
  }
  if (mode === "lines") {
    return text.split("\n").reverse().join("\n");
  }
  return text;
}

/**
 * Sort Lines
 */
export function sortLines(
  text: string,
  mode: "az" | "za" | "length-asc" | "length-desc" | "reverse" | "natural" = "az"
): string {
  if (!text) return "";
  const lines = text.split("\n");
  switch (mode) {
    case "az":
      return lines.sort((a, b) => a.localeCompare(b)).join("\n");
    case "za":
      return lines.sort((a, b) => b.localeCompare(a)).join("\n");
    case "length-asc":
      return lines.sort((a, b) => a.length - b.length).join("\n");
    case "length-desc":
      return lines.sort((a, b) => b.length - a.length).join("\n");
    case "reverse":
      return lines.reverse().join("\n");
    case "natural":
      return lines.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })).join("\n");
    default:
      return text;
  }
}

/**
 * Remove Duplicate Lines
 */
export function removeDuplicateLines(text: string, caseSensitive: boolean = true): string {
  if (!text) return "";
  const lines = text.split("\n");
  const seen = new Set<string>();
  const result: string[] = [];

  for (const line of lines) {
    const key = caseSensitive ? line : line.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      result.push(line);
    }
  }

  return result.join("\n");
}

/**
 * Remove Empty Lines
 */
export function removeEmptyLines(text: string): string {
  if (!text) return "";
  return text
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .join("\n");
}

/**
 * Remove Extra Spaces
 */
export function removeExtraSpaces(text: string): string {
  if (!text) return "";
  return text
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .join("\n");
}

/**
 * Remove Extra Line Breaks
 */
export function removeExtraLineBreaks(text: string): string {
  if (!text) return "";
  return text.replace(/\n\s*\n+/g, "\n\n").trim();
}

/**
 * Trim Text
 */
export function trimText(text: string): string {
  if (!text) return "";
  return text
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .trim();
}

/**
 * Remove Special Characters
 */
export function removeSpecialCharacters(text: string, allowNumbers = true, allowSpaces = true): string {
  if (!text) return "";
  let pattern = "[^a-zA-Z";
  if (allowNumbers) pattern += "0-9";
  if (allowSpaces) pattern += "\\s";
  pattern += "]";
  const regex = new RegExp(pattern, "g");
  return text.replace(regex, "");
}

/**
 * Extract / Remove Numbers
 */
export function removeNumbers(text: string): string {
  return text.replace(/[0-9]/g, "");
}

export function extractNumbers(text: string): string[] {
  if (!text) return [];
  const matches = text.match(/-?\d+(?:\.\d+)?/g);
  return matches || [];
}

/**
 * Extract Emails
 */
export function extractEmails(text: string): string[] {
  if (!text) return [];
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const matches = text.match(emailRegex);
  return matches ? Array.from(new Set(matches)) : [];
}

/**
 * Extract URLs
 */
export function extractUrls(text: string): string[] {
  if (!text) return [];
  const urlRegex = /(?:https?:\/\/|www\.)[^\s<>"'{}|\\^`[\]]+/gi;
  const matches = text.match(urlRegex);
  return matches ? Array.from(new Set(matches)) : [];
}

/**
 * Find & Replace
 */
export function findAndReplace(
  text: string,
  find: string,
  replace: string,
  isRegex = false,
  matchCase = true
): string {
  if (!text || !find) return text;
  try {
    const flags = matchCase ? "g" : "gi";
    const pattern = isRegex ? find : find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(pattern, flags);
    return text.replace(regex, replace);
  } catch (err: any) {
    throw new Error(`Regex Error: ${err.message}`);
  }
}

/**
 * Text Difference Checker
 */
export interface DiffChunk {
  value: string;
  added?: boolean;
  removed?: boolean;
}

export function diffText(oldText: string, newText: string): DiffChunk[] {
  return diff.diffLines(oldText, newText);
}

/**
 * Joiner & Splitter
 */
export function joinText(text: string, delimiter: string = ", "): string {
  if (!text) return "";
  const lines = text.split("\n").filter((l) => l.trim().length > 0);
  return lines.join(delimiter);
}

export function splitText(text: string, delimiter: string = ","): string {
  if (!text) return "";
  const parts = text.split(delimiter);
  return parts.map((p) => p.trim()).join("\n");
}

/**
 * Prefix & Suffix Adder
 */
export function addPrefixSuffix(text: string, prefix = "", suffix = ""): string {
  if (!text) return "";
  return text
    .split("\n")
    .map((line) => (line ? `${prefix}${line}${suffix}` : ""))
    .join("\n");
}

/**
 * Line Number Generator
 */
export function generateLineNumbers(text: string, startFrom = 1, format = "1. "): string {
  if (!text) return "";
  const lines = text.split("\n");
  return lines
    .map((line, idx) => {
      const num = startFrom + idx;
      let label = `${num}`;
      if (format.includes("1.")) label = `${num}. `;
      else if (format.includes("[1]")) label = `[${num}] `;
      else if (format.includes("01.")) label = `${num.toString().padStart(2, "0")}. `;
      return `${label}${line}`;
    })
    .join("\n");
}

/**
 * Lorem Ipsum & Random Text Generator
 */
const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "ut", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "ut", "aliquip", "ex", "ea",
  "commodo", "consequat", "duis", "aute", "irure", "in", "reprehenderit", "in",
  "voluptate", "velit", "esse", "cillum", "dolore", "eu", "fugiat", "nulla",
  "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident",
  "sunt", "in", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum"
];

export function generateLoremIpsum(type: "paragraphs" | "sentences" | "words", count = 3): string {
  if (type === "words") {
    const result: string[] = [];
    for (let i = 0; i < count; i++) {
      result.push(LOREM_WORDS[i % LOREM_WORDS.length]);
    }
    return result.join(" ");
  }

  if (type === "sentences") {
    const sentences: string[] = [];
    for (let i = 0; i < count; i++) {
      const len = 8 + (i % 6);
      const sentenceWords: string[] = [];
      for (let j = 0; j < len; j++) {
        const w = LOREM_WORDS[(i * 7 + j) % LOREM_WORDS.length];
        sentenceWords.push(j === 0 ? w.charAt(0).toUpperCase() + w.slice(1) : w);
      }
      sentences.push(`${sentenceWords.join(" ")}.`);
    }
    return sentences.join(" ");
  }

  // Paragraphs
  const paragraphs: string[] = [];
  for (let p = 0; p < count; p++) {
    const sentCount = 4 + (p % 3);
    const sentences: string[] = [];
    for (let s = 0; s < sentCount; s++) {
      const len = 9 + ((p + s) % 7);
      const sentenceWords: string[] = [];
      for (let j = 0; j < len; j++) {
        const w = LOREM_WORDS[(p * 13 + s * 5 + j) % LOREM_WORDS.length];
        sentenceWords.push(j === 0 ? w.charAt(0).toUpperCase() + w.slice(1) : w);
      }
      sentences.push(`${sentenceWords.join(" ")}.`);
    }
    paragraphs.push(sentences.join(" "));
  }
  return paragraphs.join("\n\n");
}

/**
 * Password Generator & Password Strength
 */
export interface PasswordOptions {
  length: number;
  includeUpper: boolean;
  includeLower: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
}

export function generatePassword(opts: PasswordOptions): string {
  let lower = "abcdefghijklmnopqrstuvwxyz";
  let upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let numbers = "0123456789";
  let symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  if (opts.excludeSimilar) {
    lower = lower.replace(/[il]/g, "");
    upper = upper.replace(/[IO]/g, "");
    numbers = numbers.replace(/[01]/g, "");
  }

  let charset = "";
  const requiredChars: string[] = [];

  if (opts.includeLower) {
    charset += lower;
    requiredChars.push(lower.charAt(Math.floor(Math.random() * lower.length)));
  }
  if (opts.includeUpper) {
    charset += upper;
    requiredChars.push(upper.charAt(Math.floor(Math.random() * upper.length)));
  }
  if (opts.includeNumbers) {
    charset += numbers;
    requiredChars.push(numbers.charAt(Math.floor(Math.random() * numbers.length)));
  }
  if (opts.includeSymbols) {
    charset += symbols;
    requiredChars.push(symbols.charAt(Math.floor(Math.random() * symbols.length)));
  }

  if (!charset) charset = lower;

  const result: string[] = [...requiredChars];
  const remainingLen = opts.length - requiredChars.length;

  const cryptoObj = window.crypto || (window as any).msCrypto;
  if (cryptoObj && cryptoObj.getRandomValues) {
    const randomArray = new Uint32Array(remainingLen > 0 ? remainingLen : 0);
    cryptoObj.getRandomValues(randomArray);
    for (let i = 0; i < remainingLen; i++) {
      result.push(charset.charAt(randomArray[i] % charset.length));
    }
  } else {
    for (let i = 0; i < remainingLen; i++) {
      result.push(charset.charAt(Math.floor(Math.random() * charset.length)));
    }
  }

  // Shuffle array
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result.join("");
}

export function checkPasswordStrength(password: string) {
  if (!password) {
    return {
      score: 0,
      label: "Empty",
      color: "text-slate-400",
      entropy: 0,
      crackTime: "Instant",
      details: { length: 0, hasUpper: false, hasLower: false, hasNumber: false, hasSymbol: false },
    };
  }

  let poolSize = 0;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^a-zA-Z0-9]/.test(password);

  if (hasLower) poolSize += 26;
  if (hasUpper) poolSize += 26;
  if (hasNumber) poolSize += 10;
  if (hasSymbol) poolSize += 32;

  const entropy = Math.round(password.length * Math.log2(poolSize || 1));

  let score = 0;
  if (entropy < 28) score = 20;
  else if (entropy < 36) score = 40;
  else if (entropy < 60) score = 65;
  else if (entropy < 80) score = 85;
  else score = 100;

  let label = "Very Weak";
  let color = "text-rose-500";
  if (score >= 85) {
    label = "Very Strong 🔒";
    color = "text-emerald-400";
  } else if (score >= 65) {
    label = "Strong 💪";
    color = "text-emerald-500";
  } else if (score >= 40) {
    label = "Moderate ⚠️";
    color = "text-amber-400";
  } else if (score >= 20) {
    label = "Weak ❌";
    color = "text-rose-400";
  }

  // Crack time estimation based on 10 billion guesses/sec
  const combinations = Math.pow(poolSize || 1, password.length);
  const secondsToCrack = combinations / 10000000000;

  let crackTime = "Instant";
  if (secondsToCrack > 315360000000) crackTime = "Trillions of years";
  else if (secondsToCrack > 31536000) crackTime = `${Math.round(secondsToCrack / 31536000)} years`;
  else if (secondsToCrack > 86400) crackTime = `${Math.round(secondsToCrack / 86400)} days`;
  else if (secondsToCrack > 3600) crackTime = `${Math.round(secondsToCrack / 3600)} hours`;
  else if (secondsToCrack > 60) crackTime = `${Math.round(secondsToCrack / 60)} minutes`;
  else if (secondsToCrack > 1) crackTime = `${Math.round(secondsToCrack)} seconds`;

  return {
    score,
    label,
    color,
    entropy,
    crackTime,
    details: {
      length: password.length,
      hasUpper,
      hasLower,
      hasNumber,
      hasSymbol,
    },
  };
}

/**
 * UUID Generator
 */
export function generateUuid(count = 1): string[] {
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

/**
 * Slug Generator
 */
export function generateSlug(text: string, separator = "-"): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s-]+/g, separator)
    .replace(new RegExp(`^${separator}+|${separator}+$`, "g"), "");
}

/**
 * HTML Escape & Unescape
 */
export function escapeHtml(text: string): string {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function unescapeHtml(text: string): string {
  if (!text) return "";
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#39;/g, "'");
}

/**
 * Base64 Encode & Decode (Unicode Safe)
 */
export function base64EncodeUnicode(text: string): string {
  if (!text) return "";
  const bytes = new TextEncoder().encode(text);
  let binString = "";
  for (let i = 0; i < bytes.length; i++) {
    binString += String.fromCharCode(bytes[i]);
  }
  return btoa(binString);
}

export function base64DecodeUnicode(base64Str: string): string {
  if (!base64Str) return "";
  const binString = atob(base64Str.trim());
  const bytes = Uint8Array.from(binString, (m) => m.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/**
 * Unicode Encoder & Decoder
 */
export function unicodeEncode(text: string): string {
  if (!text) return "";
  return Array.from(text)
    .map((char) => {
      const code = char.charCodeAt(0).toString(16).padStart(4, "0");
      return `\\u${code}`;
    })
    .join("");
}

export function unicodeDecode(text: string): string {
  if (!text) return "";
  return text.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

/**
 * Markdown & HTML Converters
 */
export function renderMarkdownToHtml(markdown: string): string {
  if (!markdown) return "";
  return marked.parse(markdown) as string;
}

export function convertHtmlToMarkdown(html: string): string {
  if (!html) return "";
  return html
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, "# $1\n\n")
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, "## $1\n\n")
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, "### $1\n\n")
    .replace(/<h4[^>]*>(.*?)<\/h4>/gi, "#### $1\n\n")
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, "**$1**")
    .replace(/<b[^>]*>(.*?)<\/b>/gi, "**$1**")
    .replace(/<em[^>]*>(.*?)<\/em>/gi, "*$1*")
    .replace(/<i[^>]*>(.*?)<\/i>/gi, "*$1*")
    .replace(/<code[^>]*>(.*?)<\/code>/gi, "`$1`")
    .replace(/<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi, "[$2]($1)")
    .replace(/<li[^>]*>(.*?)<\/li>/gi, "- $1\n")
    .replace(/<p[^>]*>(.*?)<\/p>/gi, "$1\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<hr\s*\/?>/gi, "\n---\n")
    .replace(/<[^>]+>/g, "") // Strip any remaining HTML tags
    .replace(/\n\s*\n\s*\n/g, "\n\n")
    .trim();
}

/**
 * ASCII Art Generator using figlet
 */
export async function generateAsciiArt(text: string, fontName: figlet.Fonts = "Standard"): Promise<string> {
  if (!text) return "";
  return new Promise((resolve) => {
    figlet(text, { font: fontName }, (err, data) => {
      if (err || !data) {
        resolve(text);
      } else {
        resolve(data);
      }
    });
  });
}

/**
 * NATO Phonetic Converter
 */
const NATO_MAP: Record<string, string> = {
  A: "Alpha", B: "Bravo", C: "Charlie", D: "Delta", E: "Echo", F: "Foxtrot",
  G: "Golf", H: "Hotel", I: "India", J: "Juliett", K: "Kilo", L: "Lima",
  M: "Mike", N: "November", O: "Oscar", P: "Papa", Q: "Quebec", R: "Romeo",
  S: "Sierra", T: "Tango", U: "Uniform", V: "Victor", W: "Whiskey", X: "X-ray",
  Y: "Yankee", Z: "Zulu",
  "0": "Zero", "1": "One", "2": "Two", "3": "Three", "4": "Four", "5": "Five",
  "6": "Six", "7": "Seven", "8": "Eight", "9": "Nine"
};

export function convertToNatoPhonetic(text: string): string {
  if (!text) return "";
  return text
    .toUpperCase()
    .split("")
    .map((c) => NATO_MAP[c] || c)
    .join(" ");
}

/**
 * Morse Code Converter
 */
const MORSE_MAP: Record<string, string> = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.",
  H: "....", I: "..", J: ".---", K: "-.-", L: ".-..", M: "--", N: "-.",
  O: "---", P: ".--.", Q: "--.-", R: ".-.", S: "...", T: "-", U: "..-",
  V: "...-", W: ".--", X: "-..-", Y: "-.--", Z: "--..",
  "1": ".----", "2": "..---", "3": "...--", "4": "....-", "5": ".....",
  "6": "-....", "7": "--...", "8": "---..", "9": "----.", "0": "-----",
  " ": "/"
};

const REVERSE_MORSE: Record<string, string> = Object.fromEntries(
  Object.entries(MORSE_MAP).map(([k, v]) => [v, k])
);

export function convertMorseCode(text: string, toMorse = true): string {
  if (!text) return "";
  if (toMorse) {
    return text
      .toUpperCase()
      .split("")
      .map((c) => MORSE_MAP[c] || c)
      .join(" ");
  } else {
    return text
      .trim()
      .split(" ")
      .map((code) => REVERSE_MORSE[code] || code)
      .join("");
  }
}

/**
 * Binary & Hex Text Converters
 */
export function convertBinaryText(text: string, toBinary = true): string {
  if (!text) return "";
  if (toBinary) {
    return Array.from(text)
      .map((c) => c.charCodeAt(0).toString(2).padStart(8, "0"))
      .join(" ");
  } else {
    return text
      .trim()
      .split(/\s+/)
      .map((bin) => String.fromCharCode(parseInt(bin, 2)))
      .join("");
  }
}

export function convertHexText(text: string, toHex = true): string {
  if (!text) return "";
  if (toHex) {
    return Array.from(text)
      .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
      .join(" ");
  } else {
    return text
      .trim()
      .split(/\s+/)
      .map((hex) => String.fromCharCode(parseInt(hex, 16)))
      .join("");
  }
}

/**
 * Text Cleaner
 */
export function cleanTextContent(text: string): string {
  if (!text) return "";
  return text
    .replace(/\r\n/g, "\n") // normalize carriage returns
    .replace(/[\u200B-\u200D\uFEFF]/g, "") // remove zero-width spaces
    .replace(/[\u2018\u2019]/g, "'") // smart single quotes
    .replace(/[\u201C\u201D]/g, '"') // smart double quotes
    .replace(/\u2026/g, "...") // ellipsis
    .replace(/[^\x09\x0A\x0D\x20-\x7E\xA0-\xFF]/g, ""); // non-printable ASCII
}
