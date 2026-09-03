import React, { useState, useRef, useEffect } from "react";
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
  EyeOff,
  Download,
  Copy,
  Share2,
  RefreshCw,
  Check,
  AlertCircle,
  FileCheck,
  Sparkles,
  ArrowRight,
  Search,
  Grid,
  Settings,
  Image as ImageIcon,
  Type,
  Trash2,
  HelpCircle,
  BarChart2,
  Maximize2,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Shield,
  Key,
  CheckCircle2,
  XCircle,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { saveHistoryItem } from "../../services/storageService";
import { useAuth } from "../../context/AuthContext";
import { canGuestExecute, incrementGuestUsage } from "../../services/guestUsageService";
import { GuestLimitModal } from "../auth/GuestLimitModal";
import { validatePdfFile } from "../../config/pdfConfig";
import { trackToolAction } from "../../services/toolTrackingService";
import {
  mergePdfs,
  splitPdf,
  extractPdfPages,
  deletePdfPages,
  reorderPdfPages,
  rotatePdf,
  compressPdf,
  protectPdf,
  unlockPdf,
  evaluatePasswordStrength,
  addTextWatermarkToPdf,
  addImageWatermarkToPdf,
  addPageNumbersToPdf,
  addHeaderFooterToPdf,
  pdfToImages,
  imagesToPdf,
  getPdfMetrics,
  getPdfMetadataInfo,
  editPdfMetadataInfo,
  removePdfMetadataInfo,
  extractImagesFromPdf,
  extractTextFromPdf,
  generatePdfThumbnails,
  detectPdfPageLayouts,
  cropPdfMargins,
  resizePdfPages,
  organizePdfWithOperations,
  createPdfBooklet,
  generateContactSheet,
  generatePrintLayoutNUp,
  performPdfOcr,
  convertPdfToGrayscale,
  searchPdfText,
  applyIndependentPageRotations,
  duplicatePdfPages,
  reversePdfPages,
  pdfToWebpImages,
  imagesToPdfCustom,
  pdfToHtmlString,
  pdfToDocxBlob,
  docxToPdfBlob,
  docxToTxtString,
  csvToPdfBlob,
  applyAnnotationsToPdf,
  PdfAnnotation,
  PdfMetrics,
  PdfMetadata,
  PageLayoutInfo,
  SearchResultMatch,
} from "../../services/pdfEngine";

interface PdfToolsRunnerProps {
  toolId: string;
  toolName: string;
  toolSlug: string;
}

export const PdfToolsRunner: React.FC<PdfToolsRunnerProps> = ({ toolId, toolName, toolSlug }) => {
  const { currentUser } = useAuth();
  const [showGuestModal, setShowGuestModal] = useState(false);

  const [files, setFiles] = useState<File[]>([]);
  const [watermarkImageFile, setWatermarkImageFile] = useState<File | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Output States
  const [resultBlobUrl, setResultBlobUrl] = useState<string | null>(null);
  const [resultFileName, setResultFileName] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [copied, setCopied] = useState(false);

  // Complex Output Data
  const [metrics, setMetrics] = useState<PdfMetrics | null>(null);
  const [metadata, setMetadata] = useState<PdfMetadata | null>(null);
  const [layoutInfo, setLayoutInfo] = useState<PageLayoutInfo[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResultMatch[]>([]);
  const [thumbnails, setThumbnails] = useState<Array<{ pageNumber: number; dataUrl: string }>>([]);

  // Preview & Reader State
  const [previewPage, setPreviewPage] = useState(1);
  const [previewZoom, setPreviewZoom] = useState(1.0);

  // Editable Form Inputs
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [ownerPasswordInput, setOwnerPasswordInput] = useState("");
  const [showOwnerPassword, setShowOwnerPassword] = useState(false);
  const [allowPrinting, setAllowPrinting] = useState(true);
  const [allowCopying, setAllowCopying] = useState(false);
  const [allowModifying, setAllowModifying] = useState(false);
  const [showAdvancedProtection, setShowAdvancedProtection] = useState(false);
  const [passwordCopied, setPasswordCopied] = useState(false);
  const [pageRangeInput, setPageRangeInput] = useState("1");
  const [rotationAngle, setRotationAngle] = useState(90);
  const [rotateTarget, setRotateTarget] = useState<"all" | "odd" | "even">("all");
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [watermarkFontSize, setWatermarkFontSize] = useState(48);
  const [watermarkColor, setWatermarkColor] = useState("#6366f1");
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.3);
  const [watermarkPos, setWatermarkPos] = useState<"center" | "top-left" | "top-right" | "bottom-left" | "bottom-right">("center");
  const [headerText, setHeaderText] = useState("Mehzan Tools Hub Header");
  const [footerText, setFooterText] = useState("Page Copyright Mehzan Tools Hub");
  const [searchQuery, setSearchQuery] = useState("");
  const [ocrLanguage, setOcrLanguage] = useState("eng");
  const [targetPaperSize, setTargetPaperSize] = useState<"A4" | "LETTER" | "LEGAL" | "A3" | "A5">("A4");
  const [cropTop, setCropTop] = useState(20);
  const [cropBottom, setCropBottom] = useState(20);
  const [cropLeft, setCropLeft] = useState(20);
  const [cropRight, setCropRight] = useState(20);
  const [gridSelection, setGridSelection] = useState<"2x2" | "3x3" | "4x4">("3x3");

  // Editable Metadata Fields
  const [metaTitle, setMetaTitle] = useState("");
  const [metaAuthor, setMetaAuthor] = useState("");
  const [metaSubject, setMetaSubject] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");

  // Visual Organizer State
  const [organizerPages, setOrganizerPages] = useState<Array<{ originalIndex: number; rotation: number; thumbnail: string }>>([]);

  // Phase 4 New States
  const [duplicateCopies, setDuplicateCopies] = useState(1);
  const [csvTextInput, setCsvTextInput] = useState("Name, Department, Role, Salary\nJohn Doe, Engineering, Senior Lead, $145,000\nJane Smith, Design, Creative Lead, $130,000\nAlex Rivera, Product, Product Manager, $138,000");
  const [pdfAnnotations, setPdfAnnotations] = useState<PdfAnnotation[]>([]);
  const [annotationType, setAnnotationType] = useState<"text" | "highlight" | "rect" | "stamp" | "redaction">("stamp");
  const [annText, setAnnText] = useState("APPROVED");
  const [annColor, setAnnColor] = useState("#ef4444");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Track initial tool view
  useEffect(() => {
    trackToolAction({
      toolId,
      toolSlug,
      toolName,
      category: "pdf",
      action: "VIEW",
    });
  }, [toolId, toolSlug, toolName]);

  // Auto-cleanup blob URLs
  useEffect(() => {
    return () => {
      if (resultBlobUrl) URL.revokeObjectURL(resultBlobUrl);
    };
  }, [resultBlobUrl]);

  // Log execution result to tool health store
  const logToolHealth = async (success: boolean, errMessage?: string) => {
    try {
      await fetch("/api/tool-health/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolId,
          toolName,
          success,
          lastError: errMessage,
        }),
      });
    } catch {
      // Ignore background log network issues
    }
  };

  // Handle File Selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const selected = Array.from(e.target.files) as File[];
    await processUploadedFiles(selected);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;
    const dropped = Array.from(e.dataTransfer.files) as File[];
    await processUploadedFiles(dropped);
  };

  const processUploadedFiles = async (fileList: File[]) => {
    setErrorMessage("");
    setResultBlobUrl(null);
    setExtractedText("");
    setMetrics(null);
    setMetadata(null);
    setLayoutInfo([]);
    setSearchResults([]);
    setThumbnails([]);

    // Validate main file for PDF tools
    const isNonPdfTool = ["jpg-to-pdf", "png-to-pdf", "webp-to-pdf", "bmp-to-pdf", "images-to-pdf", "docx-to-pdf", "csv-to-pdf"].includes(toolId);
    const firstFile = fileList[0];
    if (!isNonPdfTool && firstFile) {
      const validation = await validatePdfFile(firstFile);
      if (!validation.valid && validation.error) {
        setErrorMessage(validation.error.message);
        return;
      }
    }

    if (toolId === "csv-to-pdf" && firstFile) {
      try {
        const text = await firstFile.text();
        if (text) setCsvTextInput(text);
      } catch {
        // keep existing default
      }
    }

    setFiles(fileList);

    // Initial inspection for metadata/metrics/organizer
    try {
      if (firstFile.type === "application/pdf" || firstFile.name.toLowerCase().endsWith(".pdf")) {
        const m = await getPdfMetadataInfo(firstFile);
        setMetadata(m);
        setMetaTitle(m.title);
        setMetaAuthor(m.author);
        setMetaSubject(m.subject);
        setMetaKeywords(m.keywords);

        // Load thumbnails for organizer or preview if needed
        if (["pdf-organizer", "pdf-preview", "pdf-thumbnail-generator"].includes(toolId)) {
          const thumbs = await generatePdfThumbnails(firstFile, 0.3);
          setThumbnails(thumbs);
          setOrganizerPages(
            thumbs.map((t, i) => ({
              originalIndex: i,
              rotation: 0,
              thumbnail: t.dataUrl,
            }))
          );
        }
      }
    } catch {
      // Continue even if metadata pre-read fails
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAllFiles = () => {
    setFiles([]);
    setResultBlobUrl(null);
    setErrorMessage("");
    setStatusMessage("");
    setExtractedText("");
    setMetrics(null);
    setMetadata(null);
    setLayoutInfo([]);
    setSearchResults([]);
    setThumbnails([]);
  };

  // Main Execution Function
  const handleExecute = async () => {
    if (files.length === 0) {
      setErrorMessage("Please select at least one input file.");
      return;
    }

    if (!currentUser && !canGuestExecute(toolId, !!currentUser)) {
      setShowGuestModal(true);
      return;
    }

    setIsProcessing(true);
    setProgress(10);
    setErrorMessage("");
    setStatusMessage("Validating and parsing file structure...");

    const startTime = Date.now();

    trackToolAction({
      toolId,
      toolSlug,
      toolName,
      category: "pdf",
      action: "START",
      fileName: files[0]?.name,
      fileSizeBytes: files[0]?.size,
    });

    try {
      const primaryFile = files[0];
      let outBytes: Uint8Array | null = null;
      let outBlobUrl: string | null = null;
      let outFileName = `processed_${primaryFile.name}`;

      // Progress animation phase
      setProgress(35);
      setStatusMessage("Processing PDF document...");

      switch (toolId) {
        case "pdf-merge":
          outBytes = await mergePdfs(files);
          outFileName = `merged_${files.length}_files.pdf`;
          break;

        case "pdf-split":
          const splitRes = await splitPdf(primaryFile, "single", pageRangeInput);
          outBlobUrl = URL.createObjectURL(splitRes.blob);
          outFileName = splitRes.fileName;
          break;

        case "pdf-extract-pages":
          outBytes = await extractPdfPages(primaryFile, pageRangeInput);
          outFileName = `extracted_pages_${primaryFile.name}`;
          break;

        case "pdf-delete-pages":
          outBytes = await deletePdfPages(primaryFile, pageRangeInput);
          outFileName = `pages_deleted_${primaryFile.name}`;
          break;

        case "pdf-reorder-pages":
          outBytes = await reorderPdfPages(primaryFile, pageRangeInput);
          outFileName = `reordered_${primaryFile.name}`;
          break;

        case "pdf-rotate":
        case "pdf-rotator-180":
          outBytes = await rotatePdf(primaryFile, rotationAngle, rotateTarget);
          outFileName = `rotated_${primaryFile.name}`;
          break;

        case "pdf-compress":
        case "pdf-optimizer":
          outBytes = await compressPdf(primaryFile);
          outFileName = `compressed_${primaryFile.name}`;
          break;

        case "pdf-protect":
        case "protect-pdf":
        case "pdf-encrypt":
        case "pdf-password-protector":
        case "encrypt-pdf":
        case "password-protect-pdf":
          if (!passwordInput || !passwordInput.trim()) {
            throw new Error("Password is required. Please enter a valid password to encrypt this PDF document.");
          }
          if (passwordInput.trim().length < 4) {
            throw new Error("Password must be at least 4 characters long.");
          }
          if (confirmPasswordInput && passwordInput !== confirmPasswordInput) {
            throw new Error("Passwords do not match. Please verify your confirmation password.");
          }
          outBytes = await protectPdf(primaryFile, passwordInput, {
            ownerPassword: (ownerPasswordInput || passwordInput).trim(),
            algorithm: "AES-256",
            allowPrinting,
            allowCopying,
            allowModifying,
          });
          outFileName = `protected_${primaryFile.name}`;
          break;

        case "pdf-unlock":
        case "unlock-pdf":
        case "pdf-decrypt":
        case "decrypt-pdf":
        case "pdf-password-remover":
          if (!passwordInput || !passwordInput.trim()) {
            throw new Error("Password is required to decrypt and unlock this PDF document.");
          }
          outBytes = await unlockPdf(primaryFile, passwordInput);
          outFileName = `unlocked_${primaryFile.name}`;
          break;

        case "pdf-watermark":
        case "pdf-watermark-text":
          outBytes = await addTextWatermarkToPdf(primaryFile, watermarkText, {
            fontSize: watermarkFontSize,
            colorHex: watermarkColor,
            opacity: watermarkOpacity,
            rotation: 45,
            position: watermarkPos,
          });
          outFileName = `watermarked_${primaryFile.name}`;
          break;

        case "pdf-watermark-image":
          if (!watermarkImageFile) throw new Error("Please upload a watermark logo image.");
          outBytes = await addImageWatermarkToPdf(primaryFile, watermarkImageFile, {
            opacity: watermarkOpacity,
            scale: 0.5,
            position: watermarkPos,
          });
          outFileName = `watermarked_image_${primaryFile.name}`;
          break;

        case "pdf-page-numbers":
          outBytes = await addPageNumbersToPdf(primaryFile, {
            format: "page_of_total",
            position: "bottom-right",
          });
          outFileName = `page_numbered_${primaryFile.name}`;
          break;

        case "pdf-header":
          outBytes = await addHeaderFooterToPdf(primaryFile, headerText, undefined, "center");
          outFileName = `header_added_${primaryFile.name}`;
          break;

        case "pdf-footer":
        case "pdf-header-footer":
          outBytes = await addHeaderFooterToPdf(primaryFile, headerText, footerText, "center");
          outFileName = `header_footer_${primaryFile.name}`;
          break;

        case "pdf-to-jpg":
          const jpgRes = await pdfToImages(primaryFile, "jpg");
          outBlobUrl = URL.createObjectURL(jpgRes.blob);
          outFileName = jpgRes.fileName;
          break;

        case "pdf-to-png":
          const pngRes = await pdfToImages(primaryFile, "png");
          outBlobUrl = URL.createObjectURL(pngRes.blob);
          outFileName = pngRes.fileName;
          break;

        case "jpg-to-pdf":
        case "png-to-pdf":
        case "webp-to-pdf":
        case "bmp-to-pdf":
        case "tiff-to-pdf":
        case "images-to-pdf":
          outBytes = await imagesToPdf(files);
          outFileName = `converted_images.pdf`;
          break;

        case "pdf-page-counter":
          const calculatedMetrics = await getPdfMetrics(primaryFile);
          setMetrics(calculatedMetrics);
          break;

        case "pdf-metadata-viewer":
          const metaRes = await getPdfMetadataInfo(primaryFile);
          setMetadata(metaRes);
          break;

        case "pdf-metadata-editor":
          outBytes = await editPdfMetadataInfo(primaryFile, {
            title: metaTitle,
            author: metaAuthor,
            subject: metaSubject,
            keywords: metaKeywords,
          });
          outFileName = `metadata_updated_${primaryFile.name}`;
          break;

        case "pdf-metadata-remover":
          outBytes = await removePdfMetadataInfo(primaryFile);
          outFileName = `sanitized_${primaryFile.name}`;
          break;

        case "pdf-extract-images":
          const imgExtRes = await extractImagesFromPdf(primaryFile);
          outBlobUrl = URL.createObjectURL(imgExtRes.blob);
          outFileName = imgExtRes.fileName;
          break;

        case "pdf-extract-text":
          const txtContent = await extractTextFromPdf(primaryFile);
          setExtractedText(txtContent);
          break;

        case "pdf-preview":
          const previewThumbs = await generatePdfThumbnails(primaryFile, 0.8);
          setThumbnails(previewThumbs);
          break;

        case "pdf-thumbnail-generator":
          const generatedThumbs = await generatePdfThumbnails(primaryFile, 0.4);
          setThumbnails(generatedThumbs);
          break;

        case "pdf-page-size-detector":
          const detectedLayouts = await detectPdfPageLayouts(primaryFile);
          setLayoutInfo(detectedLayouts);
          break;

        case "pdf-orientation-detector":
          const orientations = await detectPdfPageLayouts(primaryFile);
          setLayoutInfo(orientations);
          break;

        case "pdf-crop":
          outBytes = await cropPdfMargins(primaryFile, {
            top: cropTop,
            bottom: cropBottom,
            left: cropLeft,
            right: cropRight,
          });
          outFileName = `cropped_${primaryFile.name}`;
          break;

        case "pdf-resize":
          outBytes = await resizePdfPages(primaryFile, targetPaperSize);
          outFileName = `resized_${targetPaperSize}_${primaryFile.name}`;
          break;

        case "pdf-organizer":
          const ops = organizerPages.map((p) => ({
            originalIndex: p.originalIndex,
            rotation: p.rotation,
          }));
          outBytes = await organizePdfWithOperations(primaryFile, ops);
          outFileName = `organized_${primaryFile.name}`;
          break;

        case "pdf-booklet-creator":
          outBytes = await createPdfBooklet(primaryFile);
          outFileName = `booklet_${primaryFile.name}`;
          break;

        case "pdf-contact-sheet":
          outBytes = await generateContactSheet(primaryFile, gridSelection);
          outFileName = `contact_sheet_${primaryFile.name}`;
          break;

        case "pdf-print-layout":
        case "pdf-nup":
          outBytes = await generatePrintLayoutNUp(primaryFile, 2);
          outFileName = `print_layout_${primaryFile.name}`;
          break;

        case "pdf-ocr-extractor":
          const ocrTextResult = await performPdfOcr(primaryFile, ocrLanguage, (p, msg) => {
            setProgress(p);
            setStatusMessage(msg);
          });
          setExtractedText(ocrTextResult);
          break;

        case "pdf-grayscale":
          outBytes = await convertPdfToGrayscale(primaryFile);
          outFileName = `grayscale_${primaryFile.name}`;
          break;

        case "pdf-text-search":
          const searchRes = await searchPdfText(primaryFile, searchQuery);
          setSearchResults(searchRes.matches);
          break;

        case "pdf-page-rotation-manager":
          const rotMap: Record<number, number> = {};
          organizerPages.forEach((p, idx) => {
            if (p.rotation !== 0) rotMap[idx + 1] = p.rotation;
          });
          outBytes = await applyIndependentPageRotations(primaryFile, rotMap);
          outFileName = `page_rotated_${primaryFile.name}`;
          break;

        case "pdf-duplicate-pages":
          outBytes = await duplicatePdfPages(primaryFile, pageRangeInput, duplicateCopies);
          outFileName = `duplicated_${primaryFile.name}`;
          break;

        case "pdf-reverse-pages":
          outBytes = await reversePdfPages(primaryFile);
          outFileName = `reversed_${primaryFile.name}`;
          break;

        case "pdf-to-webp":
          const webpRes = await pdfToWebpImages(primaryFile);
          outBlobUrl = URL.createObjectURL(webpRes.blob);
          outFileName = webpRes.fileName;
          break;

        case "pdf-to-html":
          const htmlContent = await pdfToHtmlString(primaryFile);
          const htmlBlob = new Blob([htmlContent], { type: "text/html" });
          outBlobUrl = URL.createObjectURL(htmlBlob);
          outFileName = `${primaryFile.name.replace(".pdf", "")}.html`;
          setExtractedText(htmlContent);
          break;

        case "pdf-to-docx":
          const docxBlob = await pdfToDocxBlob(primaryFile);
          outBlobUrl = URL.createObjectURL(docxBlob);
          outFileName = `${primaryFile.name.replace(".pdf", "")}.docx`;
          break;

        case "docx-to-pdf":
          const docxPdfBlob = await docxToPdfBlob(primaryFile);
          outBlobUrl = URL.createObjectURL(docxPdfBlob);
          outFileName = `${primaryFile.name.replace(/\.docx$/i, "")}.pdf`;
          break;

        case "csv-to-pdf":
          const csvPdfBlob = await csvToPdfBlob(csvTextInput);
          outBlobUrl = URL.createObjectURL(csvPdfBlob);
          outFileName = `table_report.pdf`;
          break;

        case "pdf-editor":
          outBytes = await applyAnnotationsToPdf(primaryFile, pdfAnnotations);
          outFileName = `edited_annotated_${primaryFile.name}`;
          break;

        default:
          outBytes = await compressPdf(primaryFile);
          outFileName = `processed_${primaryFile.name}`;
      }

      setProgress(90);
      setStatusMessage("Finalizing output document...");

      if (outBytes) {
        const blob = new Blob([outBytes], { type: "application/pdf" });
        outBlobUrl = URL.createObjectURL(blob);
      }

      if (outBlobUrl) {
        setResultBlobUrl(outBlobUrl);
        setResultFileName(outFileName);
      }

      setProgress(100);
      setStatusMessage("Processing finished successfully!");

      if (!currentUser) incrementGuestUsage(toolId, !!currentUser);

      const duration = Date.now() - startTime;

      trackToolAction({
        toolId,
        toolSlug,
        toolName,
        category: "pdf",
        action: "SUCCESS",
        durationMs: duration,
        fileName: outFileName || primaryFile.name,
      });

      saveHistoryItem({
        id: "hist_" + Date.now(),
        toolId,
        toolName,
        prompt: primaryFile.name,
        output: outFileName || "PDF processing completed",
        timestamp: new Date().toISOString(),
        wordCount: 0,
        executionTimeMs: duration,
      });

      await logToolHealth(true);
    } catch (err: any) {
      console.error("PDF Processing Error:", err);
      const errMsg = err.message || "An error occurred while processing the PDF file.";
      setErrorMessage(errMsg);
      trackToolAction({
        toolId,
        toolSlug,
        toolName,
        category: "pdf",
        action: "ERROR",
        errorMessage: errMsg,
      });
      await logToolHealth(false, errMsg);
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

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* TOOL HEADER BANNER */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-red-500/10 via-rose-500/10 to-pink-500/10 border border-red-500/20 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-red-500/20 text-red-500 dark:text-red-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{toolName}</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                100% Client-Side Private PDF Processing Engine
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Check className="w-3.5 h-3.5" /> High Precision Engine
          </span>
        </div>
      </div>

      {/* ERROR ALERT BANNER */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 flex items-start gap-3 animate-fade-in">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="flex-1 text-sm font-medium">{errorMessage}</div>
          <button
            onClick={() => setErrorMessage("")}
            className="text-xs font-semibold underline hover:text-rose-700 dark:hover:text-rose-300"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* FILE UPLOAD & SELECTION AREA */}
      <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 backdrop-blur-xl transition-all">
        {files.length === 0 ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-700 hover:border-red-500/60 rounded-2xl p-10 text-center cursor-pointer transition-all bg-slate-950/40 hover:bg-slate-900/60 group"
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple={["pdf-merge", "jpg-to-pdf", "png-to-pdf", "webp-to-pdf", "bmp-to-pdf", "images-to-pdf"].includes(toolId)}
              accept={
                ["jpg-to-pdf", "png-to-pdf", "webp-to-pdf", "bmp-to-pdf", "images-to-pdf"].includes(toolId)
                  ? "image/jpeg,image/png,image/webp,image/bmp"
                  : toolId === "docx-to-pdf"
                  ? ".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  : toolId === "csv-to-pdf"
                  ? ".csv,text/csv,text/plain"
                  : ".pdf,application/pdf"
              }
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center group-hover:scale-110 transition-transform border border-red-500/20">
              <UploadCloud className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              Click or Drag & Drop File(s) Here
            </h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto mb-4">
              Supported formats: PDF, JPG, PNG, WEBP up to 50MB. Files are processed locally inside your browser and never saved externally.
            </p>
            <button
              type="button"
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium text-sm transition-all shadow-lg shadow-red-600/20"
            >
              Browse Local Files
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="text-sm font-semibold text-slate-300">
                Selected Input Files ({files.length})
              </h4>
              <button
                onClick={clearAllFiles}
                className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
              {files.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="w-5 h-5 text-red-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">{f.name}</p>
                      <p className="text-xs text-slate-400">
                        {(f.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(i)}
                    className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* DYNAMIC TOOL OPTIONS PANEL */}
      {files.length > 0 && (
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Settings className="w-4 h-4 text-red-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Tool Configuration Options
            </h3>
          </div>

          {/* SPLIT / EXTRACT / DELETE / REORDER PAGE RANGE */}
          {["pdf-split", "pdf-extract-pages", "pdf-delete-pages", "pdf-reorder-pages"].includes(toolId) && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Page Sequence or Range (e.g., "1, 3-5, 8")
              </label>
              <input
                type="text"
                value={pageRangeInput}
                onChange={(e) => setPageRangeInput(e.target.value)}
                placeholder="1, 3-5, 8"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-red-500"
              />
            </div>
          )}

          {/* ROTATE ANGLE & TARGET */}
          {["pdf-rotate", "pdf-rotator-180"].includes(toolId) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Rotation Angle
                </label>
                <select
                  value={rotationAngle}
                  onChange={(e) => setRotationAngle(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-red-500"
                >
                  <option value={90}>90° Clockwise</option>
                  <option value={180}>180° Flip</option>
                  <option value={270}>270° Counter-Clockwise</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Target Pages
                </label>
                <select
                  value={rotateTarget}
                  onChange={(e) => setRotateTarget(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-red-500"
                >
                  <option value="all">All Pages</option>
                  <option value="odd">Odd Pages Only (1, 3, 5...)</option>
                  <option value="even">Even Pages Only (2, 4, 6...)</option>
                </select>
              </div>
            </div>
          )}

          {/* PROTECT / UNLOCK PASSWORD INPUT */}
          {["pdf-protect", "protect-pdf", "pdf-encrypt", "pdf-password-protector", "encrypt-pdf", "password-protect-pdf"].includes(toolId) && (
            <div className="space-y-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    AES-256 PDF Encryption Standard
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%&*";
                    let generated = "";
                    for (let i = 0; i < 16; i++) {
                      generated += chars.charAt(Math.floor(Math.random() * chars.length));
                    }
                    setPasswordInput(generated);
                    setConfirmPasswordInput(generated);
                    navigator.clipboard.writeText(generated);
                    setPasswordCopied(true);
                    setTimeout(() => setPasswordCopied(false), 3000);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Key className="w-3.5 h-3.5" />
                  {passwordCopied ? "Copied to Clipboard!" : "Generate Strong Password"}
                </button>
              </div>

              {/* Primary Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-300">
                    Document Password <span className="text-rose-400">*</span>
                  </label>
                  {passwordInput && (
                    <span className={`text-[11px] font-semibold ${evaluatePasswordStrength(passwordInput).color}`}>
                      {evaluatePasswordStrength(passwordInput).label}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter a strong password (minimum 4 characters)..."
                    className="w-full pl-4 pr-11 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500 font-mono tracking-wide"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer transition-colors"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Meter Bar */}
                {passwordInput && (
                  <div className="space-y-1 pt-1">
                    <div className="grid grid-cols-4 gap-1.5 h-1.5">
                      {[1, 2, 3, 4].map((step) => {
                        const currentScore = evaluatePasswordStrength(passwordInput).score;
                        const active = currentScore >= step;
                        let bg = "bg-slate-800";
                        if (active) {
                          if (currentScore === 1) bg = "bg-rose-500";
                          else if (currentScore === 2) bg = "bg-yellow-400";
                          else if (currentScore === 3) bg = "bg-blue-400";
                          else bg = "bg-emerald-400";
                        }
                        return <div key={step} className={`rounded-full transition-all duration-300 ${bg}`} />;
                      })}
                    </div>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Info className="w-3 h-3 shrink-0 text-slate-400" />
                      {evaluatePasswordStrength(passwordInput).feedback}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Confirm Password <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPasswordInput}
                    onChange={(e) => setConfirmPasswordInput(e.target.value)}
                    placeholder="Re-enter your password to confirm..."
                    className={`w-full pl-4 pr-11 py-2.5 rounded-xl bg-slate-900 border ${
                      confirmPasswordInput && passwordInput !== confirmPasswordInput
                        ? "border-rose-500/80 focus:border-rose-500"
                        : confirmPasswordInput && passwordInput === confirmPasswordInput
                        ? "border-emerald-500/80 focus:border-emerald-500"
                        : "border-slate-700 focus:border-indigo-500"
                    } text-white text-sm focus:outline-none font-mono tracking-wide`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer transition-colors"
                    title={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPasswordInput && passwordInput !== confirmPasswordInput && (
                  <p className="text-[11px] text-rose-400 flex items-center gap-1">
                    <XCircle className="w-3 h-3 shrink-0" />
                    Passwords do not match. Please verify your password.
                  </p>
                )}
                {confirmPasswordInput && passwordInput === confirmPasswordInput && passwordInput.length >= 4 && (
                  <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 shrink-0" />
                    Passwords match perfectly.
                  </p>
                )}
              </div>

              {/* Advanced Protection Options Accordion */}
              <div className="pt-2 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setShowAdvancedProtection(!showAdvancedProtection)}
                  className="flex items-center justify-between w-full text-xs font-semibold text-slate-400 hover:text-slate-200 py-1 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <Settings className="w-3.5 h-3.5 text-indigo-400" />
                    Advanced Permissions & Owner Password (Optional)
                  </span>
                  {showAdvancedProtection ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {showAdvancedProtection && (
                  <div className="mt-3 space-y-3 p-3 rounded-lg bg-slate-900/60 border border-slate-800 animate-fade-in">
                    {/* Owner Master Password */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Owner / Master Password (Optional)
                      </label>
                      <div className="relative">
                        <input
                          type={showOwnerPassword ? "text" : "password"}
                          value={ownerPasswordInput}
                          onChange={(e) => setOwnerPasswordInput(e.target.value)}
                          placeholder="Separate master password to override permissions (optional)..."
                          className="w-full pl-3 pr-10 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowOwnerPassword(!showOwnerPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                        >
                          {showOwnerPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Granular Permission Toggles */}
                    <div className="space-y-2 pt-1">
                      <span className="block text-[11px] font-semibold text-slate-400">User Document Permissions:</span>
                      <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={allowPrinting}
                          onChange={(e) => setAllowPrinting(e.target.checked)}
                          className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-950"
                        />
                        <span>Allow high-resolution printing</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={allowCopying}
                          onChange={(e) => setAllowCopying(e.target.checked)}
                          className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-950"
                        />
                        <span>Allow copying text and graphic content</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={allowModifying}
                          onChange={(e) => setAllowModifying(e.target.checked)}
                          className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-950"
                        />
                        <span>Allow modifying annotations and filling forms</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {["pdf-unlock", "unlock-pdf", "pdf-decrypt", "decrypt-pdf", "pdf-password-remover"].includes(toolId) && (
            <div className="space-y-3 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800/80">
                <Unlock className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Remove PDF Encryption & Password Lock
                </span>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Current PDF Password <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter current password to decrypt..."
                    className="w-full pl-4 pr-11 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500 font-mono tracking-wide"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer transition-colors"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Info className="w-3 h-3 shrink-0 text-slate-400" />
                  Decrypts and strips the password from this document so it can be opened instantly in any reader.
                </p>
              </div>
            </div>
          )}

          {/* WATERMARK TEXT OPTIONS */}
          {["pdf-watermark", "pdf-watermark-text"].includes(toolId) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Watermark Text
                </label>
                <input
                  type="text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Font Size (pt)
                </label>
                <input
                  type="number"
                  value={watermarkFontSize}
                  onChange={(e) => setWatermarkFontSize(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Position
                </label>
                <select
                  value={watermarkPos}
                  onChange={(e) => setWatermarkPos(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-red-500"
                >
                  <option value="center">Center Diagonal</option>
                  <option value="top-left">Top Left</option>
                  <option value="top-right">Top Right</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="bottom-right">Bottom Right</option>
                </select>
              </div>
            </div>
          )}

          {/* WATERMARK IMAGE LOGO UPLOAD */}
          {toolId === "pdf-watermark-image" && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Upload Logo / Stamp Image (PNG/JPG)
              </label>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/png,image/jpeg"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) setWatermarkImageFile(e.target.files[0]);
                }}
                className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
              />
            </div>
          )}

          {/* HEADER & FOOTER TEXT */}
          {["pdf-header", "pdf-footer", "pdf-header-footer"].includes(toolId) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Top Header Text
                </label>
                <input
                  type="text"
                  value={headerText}
                  onChange={(e) => setHeaderText(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Bottom Footer Text
                </label>
                <input
                  type="text"
                  value={footerText}
                  onChange={(e) => setFooterText(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
          )}

          {/* METADATA EDIT FIELDS */}
          {toolId === "pdf-metadata-editor" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Document Title
                </label>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Author Name
                </label>
                <input
                  type="text"
                  value={metaAuthor}
                  onChange={(e) => setMetaAuthor(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* RESIZE PAPER SIZE TARGET */}
          {toolId === "pdf-resize" && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Target Page Size Standard
              </label>
              <select
                value={targetPaperSize}
                onChange={(e) => setTargetPaperSize(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
              >
                <option value="A4">A4 (210 x 297 mm)</option>
                <option value="LETTER">Letter (8.5 x 11 in)</option>
                <option value="LEGAL">Legal (8.5 x 14 in)</option>
                <option value="A3">A3 (297 x 420 mm)</option>
                <option value="A5">A5 (148 x 210 mm)</option>
              </select>
            </div>
          )}

          {/* OCR LANGUAGE SELECTOR */}
          {toolId === "pdf-ocr-extractor" && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                OCR Language Recognition
              </label>
              <select
                value={ocrLanguage}
                onChange={(e) => setOcrLanguage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
              >
                <option value="eng">English (eng)</option>
                <option value="spa">Spanish (spa)</option>
                <option value="fra">French (fra)</option>
                <option value="deu">German (deu)</option>
              </select>
            </div>
          )}

          {/* SEARCH QUERY INPUT */}
          {toolId === "pdf-text-search" && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Search Term / Phrase
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type keyword to search inside document..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-red-500"
              />
            </div>
          )}

          {/* DUPLICATE PAGES OPTIONS */}
          {toolId === "pdf-duplicate-pages" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Pages to Duplicate (Leave empty for all pages, or e.g. "1, 3-5")
                </label>
                <input
                  type="text"
                  value={pageRangeInput}
                  onChange={(e) => setPageRangeInput(e.target.value)}
                  placeholder="All pages or 1, 2, 3..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Number of Duplicate Copies
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={duplicateCopies}
                  onChange={(e) => setDuplicateCopies(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
          )}

          {/* CSV TO PDF EDITOR */}
          {toolId === "csv-to-pdf" && (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-300">
                CSV Data Table Content (Paste or Edit CSV)
              </label>
              <textarea
                rows={6}
                value={csvTextInput}
                onChange={(e) => setCsvTextInput(e.target.value)}
                placeholder="Column1, Column2, Column3..."
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-red-500"
              />
            </div>
          )}

          {/* PDF EDITOR & ANNOTATOR PANEL */}
          {toolId === "pdf-editor" && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Add Annotation / Stamp Layer
                </span>
                <span className="text-xs text-slate-400">
                  {pdfAnnotations.length} annotations added
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Annotation Type
                  </label>
                  <select
                    value={annotationType}
                    onChange={(e) => setAnnotationType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                  >
                    <option value="stamp">Official Stamp</option>
                    <option value="text">Text Note</option>
                    <option value="highlight">Yellow Highlight</option>
                    <option value="redaction">Black Redaction Box</option>
                    <option value="rect">Border Rectangle</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Stamp / Note Text
                  </label>
                  <input
                    type="text"
                    value={annText}
                    onChange={(e) => setAnnText(e.target.value)}
                    placeholder="e.g. APPROVED, CONFIDENTIAL"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => {
                      const newAnn: PdfAnnotation = {
                        type: annotationType,
                        text: annText,
                        color: annotationType === "highlight" ? "#fef08a" : annColor,
                        x: 50,
                        y: 100 + pdfAnnotations.length * 40,
                        width: 160,
                        height: 40,
                        pageNumber: 1,
                        fontSize: 16,
                        opacity: annotationType === "highlight" ? 0.4 : 0.9,
                      };
                      setPdfAnnotations([...pdfAnnotations, newAnn]);
                    }}
                    className="w-full py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" /> + Add to Page 1
                  </button>
                </div>
              </div>

              {/* Quick Stamps Bar */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/80">
                <span className="text-[11px] text-slate-400 self-center mr-1">Quick Stamps:</span>
                {["APPROVED", "CONFIDENTIAL", "URGENT", "DRAFT", "FINAL", "PAID"].map((stamp) => (
                  <button
                    key={stamp}
                    type="button"
                    onClick={() => {
                      setAnnText(stamp);
                      setAnnotationType("stamp");
                    }}
                    className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-medium transition-all"
                  >
                    {stamp}
                  </button>
                ))}
              </div>

              {/* Added Annotations List */}
              {pdfAnnotations.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="text-[11px] font-semibold text-slate-400">Current Annotations:</div>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {pdfAnnotations.map((ann, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-xs"
                      >
                        <span className="font-mono text-red-400 font-medium uppercase">
                          [{ann.type}] {ann.text || "Shape overlay"} (Page {ann.pageNumber})
                        </span>
                        <button
                          type="button"
                          onClick={() => setPdfAnnotations(pdfAnnotations.filter((_, idx) => idx !== i))}
                          className="text-rose-400 hover:text-rose-300 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* EXECUTE ACTION BUTTON */}
          <button
            onClick={handleExecute}
            disabled={isProcessing}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-base transition-all shadow-xl shadow-red-600/25 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Processing PDF Document...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Execute {toolName}</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* PROGRESS INDICATOR */}
      {isProcessing && (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-3 animate-pulse">
          <div className="flex justify-between text-xs font-bold text-slate-300">
            <span>{statusMessage || "Processing..."}</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-rose-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* VISUAL ORGANIZER COMPONENT */}
      {toolId === "pdf-organizer" && thumbnails.length > 0 && (
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 backdrop-blur-xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Interactive Page Grid
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {organizerPages.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 flex flex-col items-center"
              >
                <div className="text-xs font-bold text-slate-400">Page {idx + 1}</div>
                <img
                  src={item.thumbnail}
                  alt={`Page ${idx + 1}`}
                  className="w-full h-36 object-contain rounded-lg border border-slate-800 bg-white"
                  style={{ transform: `rotate(${item.rotation}deg)` }}
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setOrganizerPages((prev) =>
                        prev.map((p, i) => (i === idx ? { ...p, rotation: (p.rotation + 90) % 360 } : p))
                      );
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs flex items-center gap-1"
                  >
                    <RotateCw className="w-3.5 h-3.5" /> Rotate
                  </button>
                  <button
                    onClick={() => {
                      setOrganizerPages((prev) => prev.filter((_, i) => i !== idx));
                    }}
                    className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 text-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RESULT SECTION */}
      {resultBlobUrl && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-emerald-500/30 backdrop-blur-xl space-y-4 animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
              <Check className="w-5 h-5" />
              <span>Document Processed Successfully</span>
            </div>
            <a
              href={resultBlobUrl}
              download={resultFileName}
              onClick={() => {
                trackToolAction({
                  toolId,
                  toolSlug,
                  toolName,
                  category: "pdf",
                  action: "DOWNLOAD",
                  fileName: resultFileName,
                });
              }}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-600/25 flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Download Result File
            </a>
          </div>

          <p className="text-xs text-slate-400">
            File Name: <span className="text-white font-medium">{resultFileName}</span>
          </p>
        </div>
      )}

      {/* METRICS DISPLAY TABLE */}
      {metrics && (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-red-400" /> Document Metrics Breakdown
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <p className="text-xs text-slate-400">Total Pages</p>
              <p className="text-2xl font-bold text-white">{metrics.pageCount}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <p className="text-xs text-slate-400">Total Words</p>
              <p className="text-2xl font-bold text-white">{metrics.wordCount}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <p className="text-xs text-slate-400">Total Characters</p>
              <p className="text-2xl font-bold text-white">{metrics.charCount}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <p className="text-xs text-slate-400">Est. Reading Time</p>
              <p className="text-2xl font-bold text-white">{metrics.readingTimeMinutes} min</p>
            </div>
          </div>
        </div>
      )}

      {/* METADATA DISPLAY TABLE */}
      {metadata && (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-red-400" /> Document Metadata Tags
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400 block">Title:</span>
              <span className="text-white font-medium">{metadata.title}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400 block">Author:</span>
              <span className="text-white font-medium">{metadata.author}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400 block">Subject:</span>
              <span className="text-white font-medium">{metadata.subject}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400 block">Keywords:</span>
              <span className="text-white font-medium">{metadata.keywords}</span>
            </div>
          </div>
        </div>
      )}

      {/* EXTRACTED TEXT DISPLAY AREA */}
      {extractedText && (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Extracted Plain Text Output
            </h3>
            <button
              onClick={handleCopyText}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white flex items-center gap-1.5 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Copy Text"}
            </button>
          </div>
          <textarea
            readOnly
            value={extractedText}
            rows={10}
            className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs focus:outline-none"
          />
        </div>
      )}

      {/* SEARCH MATCHES DISPLAY AREA */}
      {searchResults.length > 0 && (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Search Matches Found ({searchResults.length})
          </h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {searchResults.map((m, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="font-bold text-red-400">Page {m.pageNumber}: </span>
                <span className="text-slate-300 font-mono">{m.matchSnippet}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GUEST LIMIT MODAL */}
      <GuestLimitModal isOpen={showGuestModal} onClose={() => setShowGuestModal(false)} />
    </div>
  );
};
