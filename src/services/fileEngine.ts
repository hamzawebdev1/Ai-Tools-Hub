import CryptoJS from "crypto-js";
import JSZip from "jszip";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import YAML from "yaml";
import { marked } from "marked";

// --- FILE METADATA & CHECKSUM ---

export interface FileMetadataResult {
  fileName: string;
  fileSize: number;
  formattedSize: string;
  mimeType: string;
  lastModified: string;
  extension: string;
  lineCount?: number;
  wordCount?: number;
  charCount?: number;
  entropy?: number;
  magicBytesHex?: string;
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export async function computeFileChecksums(file: File): Promise<{
  md5: string;
  sha1: string;
  sha256: string;
  sha512: string;
}> {
  const buffer = await file.arrayBuffer();

  // Web Crypto API for SHA-1, SHA-256, SHA-512
  const sha1Buffer = await crypto.subtle.digest("SHA-1", buffer);
  const sha256Buffer = await crypto.subtle.digest("SHA-256", buffer);
  const sha512Buffer = await crypto.subtle.digest("SHA-512", buffer);

  const bufferToHex = (buf: ArrayBuffer) =>
    Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

  // CryptoJS for MD5
  const wordArray = CryptoJS.lib.WordArray.create(buffer as any);
  const md5Hex = CryptoJS.MD5(wordArray).toString();

  return {
    md5: md5Hex,
    sha1: bufferToHex(sha1Buffer),
    sha256: bufferToHex(sha256Buffer),
    sha512: bufferToHex(sha512Buffer),
  };
}

export async function getFileMagicBytes(file: File): Promise<string> {
  const slice = file.slice(0, 16);
  const buffer = await slice.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0").toUpperCase())
    .join(" ");
}

export function calculateEntropy(buffer: Uint8Array): number {
  if (buffer.length === 0) return 0;
  const frequencies = new Array(256).fill(0);
  for (let i = 0; i < buffer.length; i++) {
    frequencies[buffer[i]]++;
  }
  let entropy = 0;
  const len = buffer.length;
  for (let i = 0; i < 256; i++) {
    if (frequencies[i] > 0) {
      const p = frequencies[i] / len;
      entropy -= p * Math.log2(p);
    }
  }
  return parseFloat(entropy.toFixed(4));
}

export async function fileToBase64DataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

export function base64ToFileBlob(base64Data: string, fallbackMime = "application/octet-stream"): Blob {
  let pureB64 = base64Data.trim();
  let mime = fallbackMime;

  if (pureB64.startsWith("data:")) {
    const parts = pureB64.split(";base64,");
    mime = parts[0].replace("data:", "");
    pureB64 = parts[1] || "";
  }

  const byteCharacters = atob(pureB64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mime });
}

// --- HEX DUMP GENERATOR ---

export function generateHexDump(uint8Array: Uint8Array, maxBytes = 4096): string {
  const slice = uint8Array.slice(0, maxBytes);
  const lines: string[] = [];

  for (let i = 0; i < slice.length; i += 16) {
    const address = i.toString(16).padStart(8, "0").toUpperCase();
    const chunk = slice.slice(i, i + 16);
    const hexPart: string[] = [];
    let asciiPart = "";

    for (let j = 0; j < 16; j++) {
      if (j < chunk.length) {
        const b = chunk[j];
        hexPart.push(b.toString(16).padStart(2, "0").toUpperCase());
        asciiPart += b >= 32 && b <= 126 ? String.fromCharCode(b) : ".";
      } else {
        hexPart.push("  ");
      }
    }

    const hexFormatted = hexPart.slice(0, 8).join(" ") + "  " + hexPart.slice(8).join(" ");
    lines.push(`${address}  ${hexFormatted.padEnd(48, " ")}  |${asciiPart}|`);
  }

  if (uint8Array.length > maxBytes) {
    lines.push(`\n... [Truncated ${uint8Array.length - maxBytes} remaining bytes for performance]`);
  }

  return lines.join("\n");
}

// --- ZIP & ARCHIVE TOOLS ---

export async function createZipFromFiles(files: File[], zipName = "archive.zip"): Promise<Blob> {
  const zip = new JSZip();
  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    zip.file(file.name, arrayBuffer);
  }
  return await zip.generateAsync({ type: "blob" });
}

export interface ZipFileInfo {
  name: string;
  size: number;
  compressedSize: number;
  dir: boolean;
  date: Date;
}

export async function readZipContents(file: File): Promise<{
  entries: ZipFileInfo[];
  totalUncompressedSize: number;
  totalCompressedSize: number;
  fileCount: number;
}> {
  const arrayBuffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);
  const entries: ZipFileInfo[] = [];
  let totalUncompressedSize = 0;
  let totalCompressedSize = 0;
  let fileCount = 0;

  zip.forEach((relativePath, zipEntry) => {
    const uncompressed = (zipEntry as any)._data?.uncompressedSize || 0;
    const compressed = (zipEntry as any)._data?.compressedSize || 0;

    totalUncompressedSize += uncompressed;
    totalCompressedSize += compressed;
    if (!zipEntry.dir) fileCount++;

    entries.push({
      name: relativePath,
      size: uncompressed,
      compressedSize: compressed,
      dir: zipEntry.dir,
      date: zipEntry.date,
    });
  });

  return {
    entries,
    totalUncompressedSize,
    totalCompressedSize,
    fileCount,
  };
}

export async function extractZipFile(zipFile: File, entryName: string): Promise<Blob> {
  const arrayBuffer = await zipFile.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);
  const fileEntry = zip.file(entryName);
  if (!fileEntry) throw new Error(`File ${entryName} not found in ZIP archive.`);
  return await fileEntry.async("blob");
}

// --- DATA FORMAT CONVERTERS (CSV, JSON, XML, YAML, TSV, Markdown) ---

export function csvToJson(csvText: string, delimiter = ","): string {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return "[]";

  const headers = lines[0].split(delimiter).map((h) => h.trim().replace(/^["']|["']$/g, ""));
  const result = [];

  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i].split(delimiter);
    if (currentLine.length !== headers.length && currentLine.join("").trim() === "") continue;

    const obj: Record<string, any> = {};
    for (let j = 0; j < headers.length; j++) {
      let val = currentLine[j] !== undefined ? currentLine[j].trim() : "";
      val = val.replace(/^["']|["']$/g, "");

      // Auto cast numbers and booleans
      if (val === "true") obj[headers[j]] = true;
      else if (val === "false") obj[headers[j]] = false;
      else if (!isNaN(Number(val)) && val !== "") obj[headers[j]] = Number(val);
      else obj[headers[j]] = val;
    }
    result.push(obj);
  }

  return JSON.stringify(result, null, 2);
}

export function jsonToCsv(jsonText: string, delimiter = ","): string {
  const parsed = JSON.parse(jsonText);
  const arr = Array.isArray(parsed) ? parsed : [parsed];
  if (arr.length === 0) return "";

  const headers = Array.from(new Set(arr.flatMap((item) => Object.keys(item))));
  const csvRows: string[] = [];

  csvRows.push(headers.join(delimiter));

  for (const item of arr) {
    const values = headers.map((header) => {
      let val = item[header];
      if (val === undefined || val === null) return "";
      if (typeof val === "object") val = JSON.stringify(val);
      const strVal = String(val).replace(/"/g, '""');
      return strVal.includes(delimiter) || strVal.includes("\n") ? `"${strVal}"` : strVal;
    });
    csvRows.push(values.join(delimiter));
  }

  return csvRows.join("\n");
}

export function xmlToJson(xmlText: string): string {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, "text/xml");

  const parseNode = (node: Node): any => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.nodeValue?.trim();
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const obj: Record<string, any> = {};
      const element = node as Element;

      if (element.attributes.length > 0) {
        obj["@attributes"] = {};
        for (let i = 0; i < element.attributes.length; i++) {
          const attr = element.attributes[i];
          obj["@attributes"][attr.name] = attr.value;
        }
      }

      if (element.hasChildNodes()) {
        for (let i = 0; i < element.childNodes.length; i++) {
          const child = element.childNodes[i];
          if (child.nodeType === Node.TEXT_NODE) {
            const val = child.nodeValue?.trim();
            if (val) {
              if (Object.keys(obj).length === 0) return val;
              obj["#text"] = val;
            }
          } else if (child.nodeType === Node.ELEMENT_NODE) {
            const childName = child.nodeName;
            const childVal = parseNode(child);
            if (obj[childName]) {
              if (!Array.isArray(obj[childName])) {
                obj[childName] = [obj[childName]];
              }
              obj[childName].push(childVal);
            } else {
              obj[childName] = childVal;
            }
          }
        }
      }
      return obj;
    }
    return null;
  };

  const jsonResult = parseNode(xmlDoc.documentElement);
  return JSON.stringify({ [xmlDoc.documentElement.nodeName]: jsonResult }, null, 2);
}

export function jsonToXml(jsonText: string, rootName = "root"): string {
  const parsed = JSON.parse(jsonText);

  const buildXml = (obj: any, name: string): string => {
    if (obj === null || obj === undefined) return `<${name}/>`;
    if (typeof obj !== "object") return `<${name}>${String(obj)}</${name}>`;

    if (Array.isArray(obj)) {
      return obj.map((item) => buildXml(item, name)).join("");
    }

    let children = "";
    for (const key of Object.keys(obj)) {
      if (key === "@attributes") continue;
      children += buildXml(obj[key], key);
    }

    return `<${name}>${children}</${name}>`;
  };

  return `<?xml version="1.0" encoding="UTF-8"?>\n` + buildXml(parsed, rootName);
}

export function yamlToJson(yamlText: string): string {
  const doc = YAML.parse(yamlText);
  return JSON.stringify(doc, null, 2);
}

export function jsonToYaml(jsonText: string): string {
  const doc = JSON.parse(jsonText);
  return YAML.stringify(doc);
}

export function csvToMarkdownTable(csvText: string, delimiter = ","): string {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return "";

  const rows = lines.map((line) =>
    line.split(delimiter).map((c) => c.trim().replace(/^["']|["']$/g, ""))
  );

  const headers = rows[0];
  const markdownRows: string[] = [];

  markdownRows.push("| " + headers.join(" | ") + " |");
  markdownRows.push("| " + headers.map(() => "---").join(" | ") + " |");

  for (let i = 1; i < rows.length; i++) {
    markdownRows.push("| " + rows[i].join(" | ") + " |");
  }

  return markdownRows.join("\n");
}

// --- DOCUMENT UTILITIES ---

export async function textToPdfBlob(text: string, title = "Document"): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([595.28, 841.89]); // A4 Size
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 11;
  const lineHeight = 16;
  const margin = 50;
  const maxWidth = 595.28 - margin * 2;

  let y = 841.89 - margin;

  // Add Title
  page.drawText(title, {
    x: margin,
    y: y,
    size: 18,
    font,
    color: rgb(0.1, 0.1, 0.2),
  });
  y -= 30;

  const lines = text.split(/\r?\n/);

  for (const rawLine of lines) {
    if (y < margin + lineHeight) {
      page = pdfDoc.addPage([595.28, 841.89]);
      y = 841.89 - margin;
    }

    if (rawLine.trim().length === 0) {
      y -= lineHeight;
      continue;
    }

    // Word Wrap calculation
    const words = rawLine.split(" ");
    let currentLine = "";

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const textWidth = font.widthOfTextAtSize(testLine, fontSize);

      if (textWidth > maxWidth) {
        page.drawText(currentLine, {
          x: margin,
          y: y,
          size: fontSize,
          font,
          color: rgb(0.2, 0.2, 0.2),
        });
        y -= lineHeight;
        currentLine = word;

        if (y < margin + lineHeight) {
          page = pdfDoc.addPage([595.28, 841.89]);
          y = 841.89 - margin;
        }
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) {
      page.drawText(currentLine, {
        x: margin,
        y: y,
        size: fontSize,
        font,
        color: rgb(0.2, 0.2, 0.2),
      });
      y -= lineHeight;
    }
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: "application/pdf" });
}

export function markdownToHtmlString(mdText: string): string {
  return marked.parse(mdText) as string;
}

export function htmlToMarkdownString(htmlText: string): string {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlText;

  // Simple clean HTML -> Markdown conversion
  let markdown = tempDiv.innerText || tempDiv.textContent || "";
  markdown = markdown
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, "# $1\n\n")
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, "## $1\n\n")
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, "### $1\n\n")
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, "**$1**")
    .replace(/<b[^>]*>(.*?)<\/b>/gi, "**$1**")
    .replace(/<em[^>]*>(.*?)<\/em>/gi, "*$1*")
    .replace(/<i[^>]*>(.*?)<\/i>/gi, "*$1*")
    .replace(/<a href="(.*?)"[^>]*>(.*?)<\/a>/gi, "[$2]($1)")
    .replace(/<p[^>]*>(.*?)<\/p>/gi, "$1\n\n");

  return markdown.trim();
}
