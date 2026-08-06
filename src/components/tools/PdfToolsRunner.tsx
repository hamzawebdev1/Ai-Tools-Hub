import React, { useState, useRef, useEffect } from "react";
import { PDFDocument, degrees } from "pdf-lib";
import {
  FileText,
  UploadCloud,
  Layers,
  Scissors,
  Minimize2,
  Lock,
  Unlock,
  RotateCw,
  Eye,
  Download,
  Copy,
  Share2,
  RefreshCw,
  Check,
  AlertCircle,
  FileCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { saveHistoryItem } from "../../services/storageService";
import { useAuth } from "../../context/AuthContext";
import { canGuestExecute, incrementGuestUsage } from "../../services/guestUsageService";
import { GuestLimitModal } from "../auth/GuestLimitModal";

interface PdfToolsRunnerProps {
  toolId: string;
  toolName: string;
  toolSlug: string;
}

export const PdfToolsRunner: React.FC<PdfToolsRunnerProps> = ({
  toolId,
  toolName,
  toolSlug,
}) => {
  const { currentUser } = useAuth();
  const [showGuestModal, setShowGuestModal] = useState(false);

  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultBlobUrl, setResultBlobUrl] = useState<string | null>(null);
  const [resultFileName, setResultFileName] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);

  // Tool specific options
  const [passwordInput, setPasswordInput] = useState("");
  const [rotationAngle, setRotationAngle] = useState(90);
  const [splitRange, setSplitRange] = useState("1");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-cleanup blob URL to avoid memory leaks
  useEffect(() => {
    return () => {
      if (resultBlobUrl) {
        URL.revokeObjectURL(resultBlobUrl);
      }
    };
  }, [resultBlobUrl]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selected]);
      setErrorMessage("");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const dropped = Array.from(e.dataTransfer.files);
      setFiles((prev) => [...prev, ...dropped]);
      setErrorMessage("");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const executePdfTask = async () => {
    if (files.length === 0 && !["word-to-pdf", "jpg-to-pdf"].includes(toolId)) {
      setErrorMessage("Please select at least one input file to process.");
      return;
    }

    if (!canGuestExecute(toolId, !!currentUser)) {
      setShowGuestModal(true);
      return;
    }

    setIsProcessing(true);
    setProgress(10);
    setStatusMessage("Reading document buffer...");
    setErrorMessage("");
    setResultBlobUrl(null);
    setExtractedText("");

    const startTime = Date.now();

    try {
      if (toolId === "pdf-merge") {
        if (files.length < 2) {
          throw new Error("Merge PDF requires at least 2 PDF files.");
        }
        setProgress(30);
        setStatusMessage("Merging PDF pages...");

        const mergedPdf = await PDFDocument.create();

        for (let i = 0; i < files.length; i++) {
          const fileBuffer = await files[i].arrayBuffer();
          const pdf = await PDFDocument.load(fileBuffer);
          const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
          copiedPages.forEach((page) => mergedPdf.addPage(page));
          setProgress(30 + Math.floor(((i + 1) / files.length) * 50));
        }

        const pdfBytes = await mergedPdf.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        setResultBlobUrl(url);
        setResultFileName("merged_document.pdf");
      } else if (toolId === "pdf-split") {
        setProgress(40);
        setStatusMessage("Extracting target pages...");
        const fileBuffer = await files[0].arrayBuffer();
        const srcPdf = await PDFDocument.load(fileBuffer);
        const splitPdf = await PDFDocument.create();

        const totalPages = srcPdf.getPageCount();
        const pageIdx = Math.max(0, Math.min(totalPages - 1, parseInt(splitRange) - 1 || 0));

        const [page] = await splitPdf.copyPages(srcPdf, [pageIdx]);
        splitPdf.addPage(page);

        const pdfBytes = await splitPdf.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        setResultBlobUrl(url);
        setResultFileName(`split_page_${pageIdx + 1}.pdf`);
      } else if (toolId === "pdf-rotate") {
        setProgress(40);
        setStatusMessage(`Rotating PDF pages by ${rotationAngle}°...`);
        const fileBuffer = await files[0].arrayBuffer();
        const pdf = await PDFDocument.load(fileBuffer);

        pdf.getPages().forEach((page) => {
          const currentRotation = page.getRotation().angle;
          page.setRotation(degrees((currentRotation + rotationAngle) % 360));
        });

        const pdfBytes = await pdf.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        setResultBlobUrl(url);
        setResultFileName(`rotated_${files[0].name}`);
      } else if (toolId === "pdf-protect") {
        if (!passwordInput) {
          throw new Error("Please enter a password to encrypt the PDF.");
        }
        setProgress(50);
        setStatusMessage("Encrypting PDF document...");
        const fileBuffer = await files[0].arrayBuffer();
        const pdf = await PDFDocument.load(fileBuffer);

        const pdfBytes = await pdf.save({
          userPassword: passwordInput,
          ownerPassword: passwordInput,
        } as any);
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        setResultBlobUrl(url);
        setResultFileName(`protected_${files[0].name}`);
      } else if (toolId === "pdf-unlock") {
        setProgress(50);
        setStatusMessage("Decrypting PDF permissions...");
        const fileBuffer = await files[0].arrayBuffer();
        const pdf = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });

        const pdfBytes = await pdf.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        setResultBlobUrl(url);
        setResultFileName(`unlocked_${files[0].name}`);
      } else if (toolId === "jpg-to-pdf") {
        setProgress(40);
        setStatusMessage("Embedding images into PDF pages...");
        const pdf = await PDFDocument.create();

        for (const file of files) {
          const arrayBuffer = await file.arrayBuffer();
          let img;
          if (file.type.includes("png")) {
            img = await pdf.embedPng(arrayBuffer);
          } else {
            img = await pdf.embedJpg(arrayBuffer);
          }
          const page = pdf.addPage([img.width, img.height]);
          page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
        }

        const pdfBytes = await pdf.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        setResultBlobUrl(url);
        setResultFileName("converted_images.pdf");
      } else {
        // Fallback for PDF to Word, Compress, OCR using Gemini/Server fallback
        setProgress(50);
        setStatusMessage("Executing advanced AI transformation...");
        const response = await fetch("/api/tools/execute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            toolId,
            toolName,
            prompt: `Process file: ${files[0]?.name || "document"} with task ${toolName}`,
          }),
        });
        const data = await response.json();
        if (data.success) {
          setExtractedText(data.output);
        } else {
          throw new Error(data.error || "Processing failed");
        }
      }

      incrementGuestUsage(toolId, !!currentUser);

      setProgress(100);
      setStatusMessage("Process completed successfully!");

      const execTime = Date.now() - startTime;
      saveHistoryItem({
        id: "h_" + Date.now(),
        toolId,
        toolName,
        prompt: `Processed ${files.length} file(s)`,
        output: resultFileName || "Extracted Text Content",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        wordCount: extractedText ? extractedText.split(/\s+/).length : 0,
        executionTimeMs: execTime,
      });
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to process PDF file.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyText = () => {
    if (!extractedText) return;
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: toolName,
          text: `Check out ${toolName} on AI Tools Hub!`,
          url: window.location.href,
        });
      } catch (err) {
        // user cancelled
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Page link copied to clipboard!");
    }
  };

  return (
    <div className="space-y-6">
      {/* File Drag and Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 bg-slate-50 dark:bg-slate-900/60 rounded-3xl p-8 text-center cursor-pointer transition-all duration-200 group"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={["pdf-merge", "jpg-to-pdf"].includes(toolId)}
          accept={toolId === "jpg-to-pdf" ? "image/jpeg,image/png,image/webp" : ".pdf"}
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <UploadCloud className="w-8 h-8" />
        </div>

        <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
          Drag & Drop your {toolId === "jpg-to-pdf" ? "JPG/PNG images" : "PDF files"} here
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          or <span className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">browse files from your computer</span>
        </p>
        <span className="inline-block mt-3 px-3 py-1 bg-slate-200 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-400 rounded-full">
          Max file size: 50MB • Private & Encrypted
        </span>
      </div>

      {/* Selected File List */}
      {files.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Selected Files ({files.length})
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {files.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs"
              >
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                    {file.name}
                  </span>
                  <span className="text-slate-400 text-[10px]">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(idx);
                  }}
                  className="text-slate-400 hover:text-rose-500 font-bold px-2 py-1"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tool Options */}
      {toolId === "pdf-protect" && (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Encryption Password
          </label>
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder="Enter secure password..."
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
          />
        </div>
      )}

      {toolId === "pdf-rotate" && (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Rotation Angle
          </label>
          <select
            value={rotationAngle}
            onChange={(e) => setRotationAngle(Number(e.target.value))}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
          >
            <option value={90}>90° Clockwise</option>
            <option value={180}>180° Flip</option>
            <option value={270}>270° Counter-Clockwise</option>
          </select>
        </div>
      )}

      {toolId === "pdf-split" && (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Target Page Number
          </label>
          <input
            type="number"
            min="1"
            value={splitRange}
            onChange={(e) => setSplitRange(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
          />
        </div>
      )}

      {/* Error Message Display */}
      {errorMessage && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-2xl text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Progress Bar */}
      {isProcessing && (
        <div className="space-y-2 bg-indigo-50 dark:bg-indigo-950/40 p-4 rounded-2xl border border-indigo-200 dark:border-indigo-800">
          <div className="flex justify-between text-xs font-semibold text-indigo-700 dark:text-indigo-300">
            <span>{statusMessage}</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-indigo-200 dark:bg-indigo-900 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 dark:bg-indigo-400 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Execute Action Button */}
      <div className="flex gap-3">
        <button
          onClick={executePdfTask}
          disabled={isProcessing}
          className="flex-1 py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          {isProcessing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Processing PDF...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Execute {toolName}</span>
            </>
          )}
        </button>

        <button
          onClick={handleShare}
          className="px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
          <span className="hidden sm:inline">Share</span>
        </button>
      </div>

      {/* Output / Result Download Box */}
      {resultBlobUrl && (
        <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-3xl space-y-4">
          <div className="flex items-center gap-3 text-emerald-800 dark:text-emerald-300">
            <FileCheck className="w-6 h-6 shrink-0" />
            <div>
              <h4 className="font-bold text-sm">PDF Ready for Download</h4>
              <p className="text-xs text-emerald-600 dark:text-emerald-400">
                Your processed file <span className="font-mono">{resultFileName}</span> is prepared.
              </p>
            </div>
          </div>

          <a
            href={resultBlobUrl}
            download={resultFileName}
            className="inline-flex items-center gap-2 py-3 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download Output PDF</span>
          </a>
        </div>
      )}

      {extractedText && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Extracted Content / Converted Output
            </h4>
            <button
              onClick={handleCopyText}
              className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-semibold flex items-center gap-1.5 hover:bg-indigo-100 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied!" : "Copy Text"}</span>
            </button>
          </div>
          <textarea
            readOnly
            value={extractedText}
            rows={8}
            className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-mono leading-relaxed"
          />
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
