import React, { useState, useRef } from "react";
import {
  FileText,
  ShieldCheck,
  Code,
  Download,
  Copy,
  Check,
  Upload,
  Archive,
  FolderOpen,
  FolderTree,
  FileSpreadsheet,
  FileCode,
  FileDown,
  ArrowLeftRight,
  Table,
  FileCode2,
  GitCompare,
  ListX,
  Cpu,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import {
  formatBytes,
  computeFileChecksums,
  getFileMagicBytes,
  calculateEntropy,
  fileToBase64DataUrl,
  base64ToFileBlob,
  generateHexDump,
  createZipFromFiles,
  readZipContents,
  extractZipFile,
  ZipFileInfo,
  csvToJson,
  jsonToCsv,
  xmlToJson,
  jsonToXml,
  yamlToJson,
  jsonToYaml,
  csvToMarkdownTable,
  textToPdfBlob,
  markdownToHtmlString,
  htmlToMarkdownString,
} from "../../services/fileEngine";
import { saveHistoryItem } from "../../services/storageService";
import { useAuth } from "../../context/AuthContext";
import { canGuestExecute, incrementGuestUsage } from "../../services/guestUsageService";
import { GuestLimitModal } from "../auth/GuestLimitModal";

interface FileToolsRunnerProps {
  toolId: string;
  toolName: string;
  toolSlug: string;
}

export const FileToolsRunner: React.FC<FileToolsRunnerProps> = ({
  toolId,
  toolName,
  toolSlug,
}) => {
  const { currentUser } = useAuth();
  const [showGuestModal, setShowGuestModal] = useState(false);

  // File states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [textInput, setTextInput] = useState("");
  const [textInput2, setTextInput2] = useState("");

  // Outputs
  const [fileMetadata, setFileMetadata] = useState<any>(null);
  const [checksums, setChecksums] = useState<{ md5: string; sha1: string; sha256: string; sha512: string } | null>(null);
  const [hexDump, setHexDump] = useState<string>("");
  const [diffOutput, setDiffOutput] = useState<{ added: number; removed: number; text: string } | null>(null);
  const [zipEntries, setZipEntries] = useState<ZipFileInfo[]>([]);
  const [zipMetrics, setZipMetrics] = useState<any>(null);
  const [convertedResult, setConvertedResult] = useState<string>("");
  const [downloadBlob, setDownloadBlob] = useState<{ blob: Blob; filename: string } | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle single file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setSelectedFile(file);
    executeFileTool(file);
  };

  // Handle multi-file upload for zip creation
  const handleMultiFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const executeFileTool = async (fileOverride?: File) => {
    const file = fileOverride || selectedFile;
    setErrorMessage("");
    setIsProcessing(true);
    setConvertedResult("");
    setDownloadBlob(null);

    try {
      if (toolId === "file-metadata-viewer") {
        if (!file) throw new Error("Please select a file to inspect.");
        const magicBytes = await getFileMagicBytes(file);
        const arrayBuf = new Uint8Array(await file.arrayBuffer());
        const entropy = calculateEntropy(arrayBuf);

        let lineCount = 0;
        let charCount = 0;
        if (file.type.startsWith("text/") || file.name.match(/\.(txt|md|json|js|ts|csv|html|xml|css)$/i)) {
          const text = new TextDecoder().decode(arrayBuf);
          lineCount = text.split("\n").length;
          charCount = text.length;
        }

        setFileMetadata({
          fileName: file.name,
          fileSize: file.size,
          formattedSize: formatBytes(file.size),
          mimeType: file.type || "application/octet-stream",
          lastModified: new Date(file.lastModified).toLocaleString(),
          magicBytesHex: magicBytes,
          entropy,
          lineCount,
          charCount,
        });
      } else if (toolId === "file-checksum-generator") {
        if (!file) throw new Error("Please select a file to generate checksums.");
        const hashes = await computeFileChecksums(file);
        setChecksums(hashes);
      } else if (toolId === "file-base64-encoder") {
        if (!file) throw new Error("Please select a file to encode.");
        const base64Str = await fileToBase64DataUrl(file);
        setConvertedResult(base64Str);
      } else if (toolId === "file-base64-decoder") {
        if (!textInput.trim()) throw new Error("Please paste a Base64 string.");
        const blob = base64ToFileBlob(textInput);
        setDownloadBlob({ blob, filename: "decoded_file.bin" });
        setConvertedResult("Successfully decoded Base64 into binary payload. Click Download to save.");
      } else if (toolId === "text-hex-viewer") {
        if (file) {
          const bytes = new Uint8Array(await file.arrayBuffer());
          setHexDump(generateHexDump(bytes));
        } else if (textInput.trim()) {
          const bytes = new TextEncoder().encode(textInput);
          setHexDump(generateHexDump(bytes));
        } else {
          throw new Error("Please select a file or enter text.");
        }
      } else if (toolId === "file-compare-diff") {
        if (!textInput.trim() || !textInput2.trim()) throw new Error("Please enter content for both File 1 and File 2.");
        const lines1 = textInput.split("\n");
        const lines2 = textInput2.split("\n");
        let added = 0;
        let removed = 0;
        const diffLines: string[] = [];

        const max = Math.max(lines1.length, lines2.length);
        for (let i = 0; i < max; i++) {
          const l1 = lines1[i];
          const l2 = lines2[i];
          if (l1 === l2) {
            diffLines.push(`  ${l1 || ""}`);
          } else {
            if (l1 !== undefined) {
              diffLines.push(`- ${l1}`);
              removed++;
            }
            if (l2 !== undefined) {
              diffLines.push(`+ ${l2}`);
              added++;
            }
          }
        }
        setDiffOutput({ added, removed, text: diffLines.join("\n") });
      } else if (toolId === "file-duplicate-line-remover") {
        const raw = file ? await file.text() : textInput;
        if (!raw.trim()) throw new Error("Please enter text or select a file.");
        const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
        const unique = Array.from(new Set(lines));
        const resText = unique.join("\n");
        setConvertedResult(resText);
      } else if (toolId === "zip-creator") {
        if (selectedFiles.length === 0) throw new Error("Please select at least one file to compress.");
        const zipBlob = await createZipFromFiles(selectedFiles);
        setDownloadBlob({ blob: zipBlob, filename: "archive.zip" });
        setConvertedResult(`Created ZIP archive containing ${selectedFiles.length} files (${formatBytes(zipBlob.size)}).`);
      } else if (toolId === "zip-extractor" || toolId === "zip-contents-viewer") {
        if (!file) throw new Error("Please select a .ZIP file.");
        const info = await readZipContents(file);
        setZipEntries(info.entries);
        setZipMetrics({
          count: info.fileCount,
          uncompressed: formatBytes(info.totalUncompressedSize),
          compressed: formatBytes(info.totalCompressedSize),
          ratio: (((info.totalUncompressedSize - info.totalCompressedSize) / (info.totalUncompressedSize || 1)) * 100).toFixed(1),
        });
      } else if (toolId === "doc-word-char-counter") {
        const text = file ? await file.text() : textInput;
        const words = text.trim().split(/\s+/).filter(Boolean).length;
        const chars = text.length;
        const charsNoSpace = text.replace(/\s/g, "").length;
        const sentences = text.split(/[.!?]+/).filter(Boolean).length;
        const paragraphs = text.split(/\n\s*\n/).filter(Boolean).length;
        const readingTimeMinutes = (words / 200).toFixed(1);

        setConvertedResult(`Words: ${words}\nCharacters (with spaces): ${chars}\nCharacters (no spaces): ${charsNoSpace}\nSentences: ${sentences}\nParagraphs: ${paragraphs}\nEstimated Reading Time: ${readingTimeMinutes} min`);
      } else if (toolId === "markdown-to-html") {
        const raw = file ? await file.text() : textInput;
        setConvertedResult(markdownToHtmlString(raw));
      } else if (toolId === "html-to-markdown") {
        const raw = file ? await file.text() : textInput;
        setConvertedResult(htmlToMarkdownString(raw));
      } else if (toolId === "text-to-pdf-client") {
        const raw = file ? await file.text() : textInput;
        if (!raw.trim()) throw new Error("Please enter text content to convert to PDF.");
        const pdfBlob = await textToPdfBlob(raw, toolName);
        setDownloadBlob({ blob: pdfBlob, filename: "document.pdf" });
        setConvertedResult("PDF successfully generated! Click Download PDF to save.");
      } else if (toolId === "csv-to-json-converter") {
        const raw = file ? await file.text() : textInput;
        setConvertedResult(csvToJson(raw));
      } else if (toolId === "json-to-csv-converter") {
        const raw = file ? await file.text() : textInput;
        setConvertedResult(jsonToCsv(raw));
      } else if (toolId === "xml-to-json-converter") {
        const raw = file ? await file.text() : textInput;
        setConvertedResult(xmlToJson(raw));
      } else if (toolId === "json-to-xml-converter") {
        const raw = file ? await file.text() : textInput;
        setConvertedResult(jsonToXml(raw));
      } else if (toolId === "yaml-to-json-converter") {
        const raw = file ? await file.text() : textInput;
        setConvertedResult(yamlToJson(raw));
      } else if (toolId === "json-to-yaml-converter") {
        const raw = file ? await file.text() : textInput;
        setConvertedResult(jsonToYaml(raw));
      } else if (toolId === "csv-to-markdown-table") {
        const raw = file ? await file.text() : textInput;
        setConvertedResult(csvToMarkdownTable(raw));
      }

      incrementGuestUsage(toolId, !!currentUser);
    } catch (err: any) {
      setErrorMessage(err.message || "Execution error.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    if (!convertedResult && !hexDump) return;
    navigator.clipboard.writeText(convertedResult || hexDump);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadBlob = () => {
    if (!downloadBlob) return;
    const url = URL.createObjectURL(downloadBlob.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = downloadBlob.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        {/* Upload Box for File Tools */}
        {["file-metadata-viewer", "file-checksum-generator", "file-base64-encoder", "zip-extractor", "zip-contents-viewer"].includes(toolId) ? (
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-8 text-center space-y-4 hover:border-indigo-500 transition-colors">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {selectedFile ? `Selected: ${selectedFile.name} (${formatBytes(selectedFile.size)})` : "Drag and drop file here or click to upload"}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">100% private client browser processing</p>
            </div>
            <input ref={fileInputRef} type="file" onChange={handleFileUpload} className="hidden" />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="py-2.5 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
            >
              Select File
            </button>
          </div>
        ) : toolId === "zip-creator" ? (
          /* Multi File Selection for Zip */
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-8 text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 text-indigo-400 flex items-center justify-center">
              <Archive className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {selectedFiles.length > 0 ? `Selected ${selectedFiles.length} files` : "Select multiple files to compress into ZIP"}
              </p>
            </div>
            <input ref={fileInputRef} type="file" multiple onChange={handleMultiFileUpload} className="hidden" />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="py-2.5 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
            >
              Choose Multiple Files
            </button>

            {selectedFiles.length > 0 && (
              <div className="pt-2 text-left space-y-1 max-h-32 overflow-y-auto">
                {selectedFiles.map((f, i) => (
                  <div key={i} className="text-xs font-mono text-slate-600 dark:text-slate-400">
                    • {f.name} ({formatBytes(f.size)})
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : toolId === "file-compare-diff" ? (
          /* Two Text Inputs for Diff */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">File / Text 1 (Original)</label>
              <textarea
                rows={8}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Paste original text here..."
                className="w-full p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">File / Text 2 (Modified)</label>
              <textarea
                rows={8}
                value={textInput2}
                onChange={(e) => setTextInput2(e.target.value)}
                placeholder="Paste modified text here..."
                className="w-full p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs"
              />
            </div>
          </div>
        ) : (
          /* Single Text Input / Paste Box */
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Paste Input Text or Data:
              </label>
              <button
                onClick={() => setTextInput("")}
                className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Clear
              </button>
            </div>
            <textarea
              rows={8}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Paste content here or upload..."
              className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs text-slate-900 dark:text-slate-100"
            />
          </div>
        )}

        {errorMessage && (
          <p className="text-xs text-rose-500 font-medium bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
            {errorMessage}
          </p>
        )}

        {/* Action Execute Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={() => executeFileTool()}
            disabled={isProcessing}
            className="py-3 px-8 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs rounded-2xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isProcessing ? "animate-spin" : ""}`} />
            <span>{isProcessing ? "Processing..." : `Run ${toolName}`}</span>
          </button>
        </div>
      </div>

      {/* Output Results Section */}
      {fileMetadata && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            File Inspection Properties
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block">File Name</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">{fileMetadata.fileName}</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block">Size</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{fileMetadata.formattedSize}</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block">MIME Type</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">{fileMetadata.mimeType}</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block">Magic Header Bytes</span>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{fileMetadata.magicBytesHex}</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block">Entropy Score (0 - 8)</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{fileMetadata.entropy}</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block">Total Lines</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{fileMetadata.lineCount || "N/A"}</span>
            </div>
          </div>
        </div>
      )}

      {checksums && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Calculated Cryptographic Checksums
          </h4>
          <div className="space-y-3 font-mono text-xs">
            {Object.entries(checksums).map(([algorithm, hash]) => (
              <div key={algorithm} className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 block uppercase">{algorithm}</span>
                  <span className="text-slate-800 dark:text-slate-200 break-all">{hash}</span>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(String(hash))}
                  className="px-2.5 py-1 text-[11px] font-sans font-bold border rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Copy
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {hexDump && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Hexadecimal Dump
            </span>
            <button onClick={handleCopy} className="px-3 py-1 border text-xs font-bold rounded-lg">
              {copied ? "Copied!" : "Copy Dump"}
            </button>
          </div>
          <pre className="p-4 bg-slate-950 text-emerald-400 rounded-2xl font-mono text-[11px] overflow-x-auto max-h-96">
            {hexDump}
          </pre>
        </div>
      )}

      {diffOutput && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-700 dark:text-slate-300">Line Difference Metrics</span>
            <div className="flex gap-3">
              <span className="text-emerald-500">+{diffOutput.added} Added</span>
              <span className="text-rose-500">-{diffOutput.removed} Removed</span>
            </div>
          </div>
          <pre className="p-4 bg-slate-950 rounded-2xl font-mono text-xs overflow-x-auto max-h-96 whitespace-pre">
            {diffOutput.text.split("\n").map((line, idx) => (
              <div key={idx} className={line.startsWith("+") ? "text-emerald-400 bg-emerald-950/30" : line.startsWith("-") ? "text-rose-400 bg-rose-950/30" : "text-slate-400"}>
                {line}
              </div>
            ))}
          </pre>
        </div>
      )}

      {zipEntries.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              ZIP Contents ({zipMetrics?.count} Files)
            </h4>
            <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
              Saved {zipMetrics?.ratio}% Space
            </span>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden max-h-80 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold">
                <tr>
                  <th className="p-3">File Name</th>
                  <th className="p-3">Uncompressed</th>
                  <th className="p-3">Compressed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                {zipEntries.map((entry, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-950">
                    <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">{entry.name}</td>
                    <td className="p-3">{formatBytes(entry.size)}</td>
                    <td className="p-3">{formatBytes(entry.compressedSize)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {convertedResult && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Output Result
            </span>
            <div className="flex gap-2">
              <button onClick={handleCopy} className="px-3.5 py-1.5 border rounded-xl text-xs font-semibold cursor-pointer">
                {copied ? "Copied!" : "Copy"}
              </button>
              {downloadBlob && (
                <button
                  onClick={handleDownloadBlob}
                  className="px-4 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              )}
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs sm:text-sm text-slate-900 dark:text-slate-100 whitespace-pre-wrap max-h-96 overflow-y-auto">
            {convertedResult}
          </div>
        </div>
      )}

      <GuestLimitModal isOpen={showGuestModal} onClose={() => setShowGuestModal(false)} toolName={toolName} />
    </div>
  );
};
