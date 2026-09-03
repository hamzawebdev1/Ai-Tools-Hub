import React, { useState, useEffect, useRef } from "react";
import {
  Upload,
  Download,
  RefreshCw,
  Sliders,
  Scissors,
  Layers,
  Sparkles,
  Eye,
  CheckCircle,
  AlertCircle,
  Copy,
  FileImage,
  Zap,
  Info,
  Archive,
  Grid,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { canGuestExecute, incrementGuestUsage } from "../../services/guestUsageService";
import { saveHistoryItem } from "../../services/storageService";
import { trackToolAction } from "../../services/toolTrackingService";
import {
  validateImageFile,
  loadImageFromFile,
  convertAndCompressImage,
  applyImageFilters,
  cropRotateFlipMirrorImage,
  addCornersAndBorder,
  addWatermarkToImage,
  extractImageColors,
  imageToBase64,
  base64ToImageFile,
  generateFaviconPack,
  createMemeImage,
  createCollageImage,
  compareAndDiffImages,
  extractExifMetadata,
  optimizeSvgCode,
  ExifMetadata,
  ColorSample,
} from "../../services/imageEngine";

interface ImageToolsRunnerProps {
  toolId: string;
  toolName: string;
  toolSlug?: string;
}

export const ImageToolsRunner: React.FC<ImageToolsRunnerProps> = ({ toolId, toolName, toolSlug }) => {
  // Input Files
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [secondaryFile, setSecondaryFile] = useState<File | null>(null); // For overlay, watermark logo, diff/comparison
  const [fileValidationErrors, setFileValidationErrors] = useState<string[]>([]);

  // Base Image Metadata
  const [fileWidth, setFileWidth] = useState<number>(0);
  const [fileHeight, setFileHeight] = useState<number>(0);
  const [originalSizeBytes, setOriginalSizeBytes] = useState<number>(0);
  const [originalMime, setOriginalMime] = useState<string>("image/png");

  // Output State
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progressPct, setProgressPct] = useState<number>(0);
  const [resultBlobUrl, setResultBlobUrl] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultFileName, setResultFileName] = useState<string>("output.png");
  const [resultSizeBytes, setResultSizeBytes] = useState<number>(0);
  const [resultWidth, setResultWidth] = useState<number>(0);
  const [resultHeight, setResultHeight] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Advanced Outputs
  const [exifData, setExifData] = useState<ExifMetadata | null>(null);
  const [colorSamples, setColorSamples] = useState<ColorSample[]>([]);
  const [paletteDataUrl, setPaletteDataUrl] = useState<string | null>(null);
  const [base64Output, setBase64Output] = useState<{ dataUrl: string; base64Only: string; htmlTag: string; cssSnippet: string } | null>(null);
  const [faviconList, setFaviconList] = useState<{ name: string; url: string }[]>([]);
  const [zipBlob, setZipBlob] = useState<Blob | null>(null);
  const [diffResults, setDiffResults] = useState<{ diffUrl: string; similarityPercentage: number; file1Url: string; file2Url: string } | null>(null);

  // Base64 Input for Decoder
  const [base64InputText, setBase64InputText] = useState<string>("");

  // Comparison Split Slider State
  const [splitPosition, setSplitPosition] = useState<number>(50);

  // Tool Controls Config
  const [quality, setQuality] = useState<number>(85); // 1-100
  const [targetFormat, setTargetFormat] = useState<string>("png");
  const [targetWidth, setTargetWidth] = useState<number>(0);
  const [targetHeight, setTargetHeight] = useState<number>(0);
  const [maintainAspect, setMaintainAspect] = useState<boolean>(true);

  // Filter / Adjuster Controls
  const [brightness, setBrightness] = useState<number>(0); // -100 to 100
  const [contrast, setContrast] = useState<number>(0);     // -100 to 100
  const [saturation, setSaturation] = useState<number>(100); // 0 to 200
  const [sepia, setSepia] = useState<number>(0);           // 0 to 100
  const [blurRadius, setBlurRadius] = useState<number>(0);  // 0 to 50
  const [pixelateSize, setPixelateSize] = useState<number>(1); // 1 to 50
  const [sharpen, setSharpen] = useState<boolean>(false);
  const [negative, setNegative] = useState<boolean>(false);
  const [grayscale, setGrayscale] = useState<boolean>(false);

  // Transformation Controls
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);
  const [mirrorMode, setMirrorMode] = useState<"none" | "mirror-h" | "mirror-v" | "quad">("none");

  // Crop Controls
  const [cropX, setCropX] = useState<number>(0);
  const [cropY, setCropY] = useState<number>(0);
  const [cropW, setCropW] = useState<number>(0);
  const [cropH, setCropH] = useState<number>(0);

  // Rounded Corners & Border
  const [cornerRadius, setCornerRadius] = useState<number>(20);
  const [borderWidth, setBorderWidth] = useState<number>(0);
  const [borderColor, setBorderColor] = useState<string>("#3b82f6");
  const [isCircleAvatar, setIsCircleAvatar] = useState<boolean>(false);

  // Watermark & Meme Controls
  const [watermarkText, setWatermarkText] = useState<string>("© Copyright");
  const [watermarkFontSize, setWatermarkFontSize] = useState<number>(36);
  const [watermarkColor, setWatermarkColor] = useState<string>("#ffffff");
  const [watermarkOpacity, setWatermarkOpacity] = useState<number>(0.7);
  const [watermarkPos, setWatermarkPos] = useState<"center" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | "tile">("center");

  const [topMemeText, setTopMemeText] = useState<string>("WHEN CODE BUILDS");
  const [bottomMemeText, setBottomMemeText] = useState<string>("WITHOUT ERRORS");

  // Collage & Grid Controls
  const [gridColumns, setGridColumns] = useState<number>(2);
  const [gridGap, setGridGap] = useState<number>(10);
  const [canvasBgColor, setCanvasBgColor] = useState<string>("#ffffff");

  // UI state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Track tool view
  useEffect(() => {
    trackToolAction({
      toolId,
      toolSlug: toolSlug || toolId,
      toolName,
      category: "image",
      action: "VIEW",
    });
  }, [toolId, toolSlug, toolName]);

  // Clean up Blob URLs on unmount or new run
  useEffect(() => {
    return () => {
      if (resultBlobUrl) URL.revokeObjectURL(resultBlobUrl);
    };
  }, [resultBlobUrl]);

  // Log execution to tool health API
  const logHealth = async (success: boolean, errorDetail?: string) => {
    try {
      await fetch("/api/tool-health/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolId,
          toolName,
          success,
          lastError: errorDetail,
        }),
      });
    } catch {
      // Ignore health logging error
    }
  };

  // Handle File Drop / Select
  const handleFileChange = async (files: FileList | File[]) => {
    setErrorMsg(null);
    setFileValidationErrors([]);
    const fileArray = Array.from(files);

    if (fileArray.length === 0) return;

    // Validate files
    const validList: File[] = [];
    const errors: string[] = [];

    for (const f of fileArray) {
      const val = await validateImageFile(f);
      if (val.valid) {
        validList.push(f);
      } else {
        errors.push(`${f.name}: ${val.error}`);
      }
    }

    if (errors.length > 0) {
      setFileValidationErrors(errors);
    }

    if (validList.length === 0) return;

    setSelectedFiles(validList);
    const mainFile = validList[0];

    // Load main file specs
    try {
      const img = await loadImageFromFile(mainFile);
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;

      setFileWidth(w);
      setFileHeight(h);
      setTargetWidth(w);
      setTargetHeight(h);
      setCropW(Math.floor(w * 0.8));
      setCropH(Math.floor(h * 0.8));
      setOriginalSizeBytes(mainFile.size);
      setOriginalMime(mainFile.type);

      // Extract EXIF if tool uses EXIF
      if (toolId.includes("metadata") || toolId.includes("exif")) {
        const meta = await extractExifMetadata(mainFile);
        setExifData(meta);
      }

      // Auto set formats for format-specific tools
      if (toolId === "jpg-to-png" || toolId === "webp-to-png" || toolId === "avif-to-png" || toolId === "bmp-to-png" || toolId === "tiff-to-png" || toolId === "gif-to-png") {
        setTargetFormat("png");
      } else if (toolId === "png-to-jpg" || toolId === "webp-to-jpg" || toolId === "avif-to-jpg" || toolId === "bmp-to-jpg" || toolId === "tiff-to-jpg") {
        setTargetFormat("jpg");
      } else if (toolId === "jpg-to-webp" || toolId === "png-to-webp") {
        setTargetFormat("webp");
      } else if (toolId === "jpg-to-avif" || toolId === "png-to-avif") {
        setTargetFormat("avif");
      } else if (toolId === "png-to-ico" || toolId === "image-to-ico" || toolId === "favicon-generator") {
        setTargetFormat("ico");
      }

      // Automatically execute preview analysis tools
      if (toolId === "color-picker" || toolId === "dominant-color-extractor" || toolId === "palette-generator") {
        const res = await extractImageColors(mainFile);
        setColorSamples(res.samples);
        setPaletteDataUrl(res.paletteDataUrl);
      } else if (toolId === "image-to-base64" || toolId === "data-uri-generator") {
        const res = await imageToBase64(mainFile);
        setBase64Output(res);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to parse image dimensions.");
    }
  };

  // Main Image Execution Handler
  const executeProcessing = async () => {
    if (!canGuestExecute(toolId, false)) {
      setErrorMsg("Daily guest image processing limit reached for this tool. Please log in or wait until tomorrow.");
      return;
    }

    setIsProcessing(true);
    setProgressPct(20);
    setErrorMsg(null);

    try {
      // Base64 Decoder Tool
      if (toolId === "base64-to-image") {
        if (!base64InputText.trim()) throw new Error("Please paste a valid Base64 string or Data URI.");
        const decodedFile = base64ToImageFile(base64InputText, "decoded_image.png");
        const img = await loadImageFromFile(decodedFile);
        const url = URL.createObjectURL(decodedFile);

        setResultBlob(decodedFile);
        setResultBlobUrl(url);
        setResultFileName("decoded_image.png");
        setResultSizeBytes(decodedFile.size);
        setResultWidth(img.naturalWidth || img.width);
        setResultHeight(img.naturalHeight || img.height);

        incrementGuestUsage(toolId, false);
        saveHistoryItem({
          id: `hist_${Date.now()}`,
          toolId,
          toolName,
          prompt: "Base64 decode",
          output: "Decoded Base64 string to image file",
          timestamp: new Date().toISOString(),
          wordCount: 0,
          executionTimeMs: 150,
        });
        logHealth(true);
        setIsProcessing(false);
        return;
      }

      if (selectedFiles.length === 0) {
        throw new Error("Please select or drop an image file first.");
      }

      const mainFile = selectedFiles[0];
      setProgressPct(40);

      const startTime = Date.now();

      trackToolAction({
        toolId,
        toolSlug: toolSlug || toolId,
        toolName,
        category: "image",
        action: "START",
        fileName: mainFile.name,
        fileSizeBytes: mainFile.size,
      });

      let outputBlob: Blob | null = null;
      let outputUrl: string | null = null;
      let outW = fileWidth;
      let outH = fileHeight;
      let outName = `processed_${mainFile.name}`;

      // Route execution by Tool ID
      if (
        toolId === "image-compress" ||
        toolId === "image-converter" ||
        toolId.startsWith("jpg-to-") ||
        toolId.startsWith("png-to-") ||
        toolId.startsWith("webp-to-") ||
        toolId.startsWith("avif-to-") ||
        toolId.startsWith("bmp-to-") ||
        toolId.startsWith("tiff-to-") ||
        toolId === "gif-to-png"
      ) {
        let mime = "image/png";
        if (targetFormat === "jpg" || targetFormat === "jpeg") mime = "image/jpeg";
        else if (targetFormat === "webp") mime = "image/webp";
        else if (targetFormat === "avif") mime = "image/avif";
        else if (targetFormat === "bmp") mime = "image/bmp";

        const res = await convertAndCompressImage(mainFile, mime, quality / 100, targetWidth, targetHeight, canvasBgColor);
        outputBlob = res.blob;
        outputUrl = res.url;
        outW = res.width;
        outH = res.height;
        outName = `${mainFile.name.split(".")[0]}.${targetFormat === "jpeg" ? "jpg" : targetFormat}`;
      } else if (toolId === "image-resize" || toolId.includes("resizer")) {
        let mime = "image/png";
        if (mainFile.type.includes("jpeg")) mime = "image/jpeg";
        const res = await convertAndCompressImage(mainFile, mime, 0.92, targetWidth, targetHeight, canvasBgColor);
        outputBlob = res.blob;
        outputUrl = res.url;
        outW = res.width;
        outH = res.height;
        outName = `resized_${mainFile.name}`;
      } else if (
        toolId === "image-crop" ||
        toolId === "image-rotate" ||
        toolId === "image-flip" ||
        toolId === "image-mirror" ||
        toolId === "screenshot-cropper"
      ) {
        const res = await cropRotateFlipMirrorImage(mainFile, {
          cropX,
          cropY,
          cropWidth: cropW > 0 ? cropW : undefined,
          cropHeight: cropH > 0 ? cropH : undefined,
          rotation: rotationAngle,
          flipH,
          flipV,
          mirrorMode: toolId === "image-mirror" ? mirrorMode : "none",
        });
        outputBlob = res.blob;
        outputUrl = res.url;
        outW = res.width;
        outH = res.height;
        outName = `edited_${mainFile.name}`;
      } else if (
        toolId === "image-brightness" ||
        toolId === "image-contrast" ||
        toolId === "image-saturation" ||
        toolId === "image-grayscale" ||
        toolId === "image-sepia" ||
        toolId === "image-negative" ||
        toolId === "image-blur" ||
        toolId === "image-sharpen" ||
        toolId === "image-pixelator" ||
        toolId === "image-quality-adjuster"
      ) {
        const res = await applyImageFilters(mainFile, {
          brightness,
          contrast,
          saturation,
          sepia,
          blur: blurRadius,
          pixelate: pixelateSize,
          sharpen,
          negative,
          grayscale,
          quality: quality / 100,
        });
        outputBlob = res.blob;
        outputUrl = res.url;
        outName = `filtered_${mainFile.name}`;
      } else if (toolId === "svg-optimizer") {
        const textContent = await mainFile.text();
        const svgRes = optimizeSvgCode(textContent);
        outputBlob = new Blob([svgRes.optimizedSvg], { type: "image/svg+xml" });
        outputUrl = URL.createObjectURL(outputBlob);
        outName = `optimized_${mainFile.name.replace(/\.[^/.]+$/, "")}.svg`;
      } else if (toolId === "round-image-corners") {
        const res = await addCornersAndBorder(mainFile, {
          cornerRadius,
          borderWidth,
          borderColor,
          isCircle: isCircleAvatar,
        });
        outputBlob = res.blob;
        outputUrl = res.url;
        outName = `rounded_${mainFile.name}`;
      } else if (toolId === "image-border-maker") {
        const res = await addCornersAndBorder(mainFile, {
          borderWidth,
          borderColor,
        });
        outputBlob = res.blob;
        outputUrl = res.url;
        outName = `framed_${mainFile.name}`;
      } else if (toolId === "image-watermark" || toolId === "text-watermark" || toolId === "logo-watermark") {
        const res = await addWatermarkToImage(mainFile, {
          watermarkType: secondaryFile ? "logo" : "text",
          text: watermarkText,
          fontSize: watermarkFontSize,
          textColor: watermarkColor,
          opacity: watermarkOpacity,
          position: watermarkPos,
          logoFile: secondaryFile || undefined,
        });
        outputBlob = res.blob;
        outputUrl = res.url;
        outName = `watermarked_${mainFile.name}`;
      } else if (toolId === "meme-generator") {
        const res = await createMemeImage(mainFile, topMemeText, bottomMemeText, watermarkFontSize, watermarkColor);
        outputBlob = res.blob;
        outputUrl = res.url;
        outName = `meme_${mainFile.name}`;
      } else if (toolId === "favicon-pack-generator" || toolId === "favicon-generator") {
        const pack = await generateFaviconPack(mainFile);
        setFaviconList(pack.sizes);
        setZipBlob(pack.zipBlob);
        outputBlob = pack.zipBlob;
        outputUrl = URL.createObjectURL(pack.zipBlob);
        outName = "favicon-pack.zip";
      } else if (toolId === "collage-maker" && selectedFiles.length > 1) {
        const res = await createCollageImage(selectedFiles, gridColumns, gridGap, canvasBgColor);
        outputBlob = res.blob;
        outputUrl = res.url;
        outName = "photo_collage.png";
      } else if ((toolId === "image-comparison-tool" || toolId === "image-difference-checker") && selectedFiles.length >= 2) {
        const diffs = await compareAndDiffImages(selectedFiles[0], selectedFiles[1]);
        setDiffResults(diffs);
        outputUrl = diffs.diffUrl;
        outName = "difference_map.png";
      } else if (toolId === "image-remove-metadata") {
        const res = await convertAndCompressImage(mainFile, "image/png", 0.95);
        outputBlob = res.blob;
        outputUrl = res.url;
        outName = `cleaned_${mainFile.name}`;
      } else {
        // Fallback default exporter
        const res = await convertAndCompressImage(mainFile, "image/png", 0.92);
        outputBlob = res.blob;
        outputUrl = res.url;
        outName = `processed_${mainFile.name}`;
      }

      setProgressPct(100);

      if (outputBlob) {
        setResultBlob(outputBlob);
        setResultSizeBytes(outputBlob.size);
      }
      if (outputUrl) {
        setResultBlobUrl(outputUrl);
      }
      setResultFileName(outName);

      incrementGuestUsage(toolId, false);
      const duration = Date.now() - startTime;

      trackToolAction({
        toolId,
        toolSlug: toolSlug || toolId,
        toolName,
        category: "image",
        action: "SUCCESS",
        durationMs: duration,
        fileName: outName,
        fileSizeBytes: outputBlob ? outputBlob.size : undefined,
      });

      saveHistoryItem({
        id: `hist_${Date.now()}`,
        toolId,
        toolName,
        prompt: `Processed image ${mainFile.name}`,
        output: `Generated output file ${outName}`,
        timestamp: new Date().toISOString(),
        wordCount: 0,
        executionTimeMs: duration,
      });
      logHealth(true);
    } catch (err: any) {
      const errorText = err.message || "An unexpected error occurred during image processing.";
      setErrorMsg(errorText);
      trackToolAction({
        toolId,
        toolSlug: toolSlug || toolId,
        toolName,
        category: "image",
        action: "ERROR",
        errorMessage: errorText,
      });
      logHealth(false, err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper Copy snippet
  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Primary Tool Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 dark:bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-xl text-indigo-400">
            <FileImage className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{toolName}</h2>
            <p className="text-xs text-slate-400 mt-0.5">High-performance client-side browser image processing</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Zap className="w-3.5 h-3.5" /> Client-Side
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <CheckCircle className="w-3.5 h-3.5" /> 100% Private
          </span>
        </div>
      </div>

      {/* Validation / Error Banner */}
      {errorMsg && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start gap-3 text-rose-300">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <span className="font-semibold block mb-1">Execution Error:</span>
            {errorMsg}
          </div>
        </div>
      )}

      {fileValidationErrors.length > 0 && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-sm space-y-1">
          <span className="font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> File Warnings:
          </span>
          {fileValidationErrors.map((err, idx) => (
            <p key={idx} className="text-xs font-mono">• {err}</p>
          ))}
        </div>
      )}

      {/* Input Dropzone Section */}
      {toolId !== "base64-to-image" ? (
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-slate-300">
            {selectedFiles.length > 0 ? "Uploaded Image File(s):" : "Select or Drop Image File:"}
          </label>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files) handleFileChange(e.dataTransfer.files);
            }}
            className="border-2 border-dashed border-slate-700 hover:border-indigo-500/60 bg-slate-900/50 hover:bg-slate-900/80 transition-all rounded-2xl p-8 text-center cursor-pointer relative group"
          >
            <input
              type="file"
              accept="image/*"
              multiple={toolId === "collage-maker" || toolId === "image-comparison-tool" || toolId === "image-difference-checker" || toolId === "image-contact-sheet"}
              onChange={(e) => e.target.files && handleFileChange(e.target.files)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="p-4 bg-slate-800/80 rounded-full text-indigo-400 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8" />
              </div>
              <div>
                <p className="text-base font-medium text-slate-200">
                  Drag & Drop images here, or <span className="text-indigo-400 underline">browse files</span>
                </p>
                <p className="text-xs text-slate-400 mt-1">Supports PNG, JPG, WEBP, AVIF, GIF, BMP, TIFF, SVG (Max 50MB)</p>
              </div>
            </div>
          </div>

          {/* Uploaded File List Badges */}
          {selectedFiles.length > 0 && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-slate-800 overflow-hidden flex items-center justify-center border border-slate-700">
                  <img
                    src={URL.createObjectURL(selectedFiles[0])}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white truncate max-w-xs">{selectedFiles[0].name}</p>
                  <p className="text-xs text-slate-400">
                    {(originalSizeBytes / 1024).toFixed(1)} KB • {fileWidth}x{fileHeight} px • {originalMime}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedFiles([]);
                  setResultBlobUrl(null);
                }}
                className="px-3 py-1.5 text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg transition-colors"
              >
                Clear File
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Base64 Textarea Input */
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-300">Paste Base64 or Data URI String:</label>
          <textarea
            value={base64InputText}
            onChange={(e) => setBase64InputText(e.target.value)}
            placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
            rows={5}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-emerald-400 focus:outline-none focus:border-indigo-500"
          />
        </div>
      )}

      {/* Tool Controls Bar */}
      {selectedFiles.length > 0 && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" /> Options & Settings
            </h3>
            <button
              onClick={executeProcessing}
              disabled={isProcessing}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
            >
              {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              {isProcessing ? "Processing..." : "Process Image"}
            </button>
          </div>

          {/* Compress & Format Options */}
          {(toolId === "image-compress" || toolId === "image-converter" || toolId.includes("compressor") || toolId.includes("to-")) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">Quality Level: {quality}%</label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">Target Format:</label>
                <select
                  value={targetFormat}
                  onChange={(e) => setTargetFormat(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="png">PNG (Lossless)</option>
                  <option value="jpg">JPG / JPEG (Standard)</option>
                  <option value="webp">WEBP (Web-Optimized)</option>
                  <option value="avif">AVIF (Next-Gen)</option>
                  <option value="bmp">BMP (Bitmap)</option>
                </select>
              </div>
            </div>
          )}

          {/* Resizer Options */}
          {(toolId === "image-resize" || toolId.includes("resizer")) && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Target Width (px):</label>
                  <input
                    type="number"
                    value={targetWidth}
                    onChange={(e) => {
                      const newW = Number(e.target.value);
                      setTargetWidth(newW);
                      if (maintainAspect && fileWidth > 0) {
                        setTargetHeight(Math.round(newW * (fileHeight / fileWidth)));
                      }
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Target Height (px):</label>
                  <input
                    type="number"
                    value={targetHeight}
                    onChange={(e) => {
                      const newH = Number(e.target.value);
                      setTargetHeight(newH);
                      if (maintainAspect && fileHeight > 0) {
                        setTargetWidth(Math.round(newH * (fileWidth / fileHeight)));
                      }
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={maintainAspect}
                    onChange={(e) => setMaintainAspect(e.target.checked)}
                    className="accent-indigo-500"
                  />
                  Maintain Aspect Ratio
                </label>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setTargetWidth(1920);
                      setTargetHeight(1080);
                    }}
                    className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                  >
                    1080p
                  </button>
                  <button
                    onClick={() => {
                      setTargetWidth(1280);
                      setTargetHeight(720);
                    }}
                    className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                  >
                    720p
                  </button>
                  <button
                    onClick={() => {
                      setTargetWidth(Math.round(fileWidth * 0.5));
                      setTargetHeight(Math.round(fileHeight * 0.5));
                    }}
                    className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                  >
                    50%
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Rotation & Flip Controls */}
          {(toolId === "image-rotate" || toolId === "image-flip" || toolId === "image-mirror") && (
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => setRotationAngle((r) => (r + 90) % 360)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl"
              >
                Rotate 90° CW
              </button>
              <button
                onClick={() => setFlipH(!flipH)}
                className={`px-4 py-2 text-xs font-semibold rounded-xl border ${flipH ? "bg-indigo-600 border-indigo-500 text-white" : "bg-slate-800 border-slate-700 text-slate-300"}`}
              >
                Flip Horizontal
              </button>
              <button
                onClick={() => setFlipV(!flipV)}
                className={`px-4 py-2 text-xs font-semibold rounded-xl border ${flipV ? "bg-indigo-600 border-indigo-500 text-white" : "bg-slate-800 border-slate-700 text-slate-300"}`}
              >
                Flip Vertical
              </button>

              {toolId === "image-mirror" && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMirrorMode("mirror-h")}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${mirrorMode === "mirror-h" ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-300"}`}
                  >
                    Horizontal Mirror
                  </button>
                  <button
                    onClick={() => setMirrorMode("mirror-v")}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${mirrorMode === "mirror-v" ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-300"}`}
                  >
                    Vertical Mirror
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Rounded Corners & Border */}
          {(toolId === "round-image-corners" || toolId === "image-border-maker") && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Corner Radius (px):</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={cornerRadius}
                  onChange={(e) => setCornerRadius(Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Border Width (px):</label>
                <input
                  type="number"
                  value={borderWidth}
                  onChange={(e) => setBorderWidth(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Border Color:</label>
                <input
                  type="color"
                  value={borderColor}
                  onChange={(e) => setBorderColor(e.target.value)}
                  className="w-full h-9 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Watermarking & Meme Inputs */}
          {(toolId === "image-watermark" || toolId === "text-watermark" || toolId === "meme-generator") && (
            <div className="space-y-4">
              {toolId === "meme-generator" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Top Text:</label>
                    <input
                      type="text"
                      value={topMemeText}
                      onChange={(e) => setTopMemeText(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white font-mono uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Bottom Text:</label>
                    <input
                      type="text"
                      value={bottomMemeText}
                      onChange={(e) => setBottomMemeText(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white font-mono uppercase"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Watermark Text:</label>
                    <input
                      type="text"
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Opacity: {Math.round(watermarkOpacity * 100)}%</label>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.05"
                      value={watermarkOpacity}
                      onChange={(e) => setWatermarkOpacity(Number(e.target.value))}
                      className="w-full accent-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Position:</label>
                    <select
                      value={watermarkPos}
                      onChange={(e) => setWatermarkPos(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-sm text-white"
                    >
                      <option value="center">Center</option>
                      <option value="top-left">Top-Left</option>
                      <option value="top-right">Top-Right</option>
                      <option value="bottom-left">Bottom-Left</option>
                      <option value="bottom-right">Bottom-Right</option>
                      <option value="tile">Tile Pattern</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Interactive Color Extractor & Palette Output */}
      {(toolId === "color-picker" || toolId === "dominant-color-extractor" || toolId === "palette-generator") && colorSamples.length > 0 && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" /> Extracted Color Swatches
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {colorSamples.map((sample, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2">
                <div
                  className="w-full h-16 rounded-lg shadow-inner border border-white/10"
                  style={{ backgroundColor: sample.hex }}
                />
                <div className="space-y-1 text-xs font-mono">
                  <div className="flex items-center justify-between text-slate-200">
                    <span>{sample.hex}</span>
                    <button
                      onClick={() => copyToClipboard(sample.hex, `hex-${idx}`)}
                      className="text-indigo-400 hover:text-indigo-300"
                    >
                      {copiedKey === `hex-${idx}` ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-slate-400 text-[10px] truncate">{sample.rgb}</p>
                </div>
              </div>
            ))}
          </div>

          {paletteDataUrl && (
            <div className="pt-4 border-t border-slate-800">
              <label className="block text-xs font-semibold text-slate-400 mb-2">Generated Palette Swatch Card:</label>
              <img src={paletteDataUrl} alt="Palette" className="w-full h-auto rounded-xl border border-slate-800" />
            </div>
          )}
        </div>
      )}

      {/* EXIF Metadata Output Table */}
      {(toolId === "image-metadata-viewer" || toolId === "exif-metadata-viewer") && exifData && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-indigo-400" /> Embedded EXIF Metadata
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400">Dimensions:</span> <span className="text-white font-bold">{exifData.width} x {exifData.height} px</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400">File Size:</span> <span className="text-white font-bold">{exifData.fileSizeFormatted}</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400">Camera Make:</span> <span className="text-white font-bold">{exifData.make || "N/A"}</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400">Camera Model:</span> <span className="text-white font-bold">{exifData.model || "N/A"}</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400">ISO Speed:</span> <span className="text-white font-bold">{exifData.iso || "N/A"}</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400">Aperture:</span> <span className="text-white font-bold">{exifData.fNumber || "N/A"}</span>
            </div>
          </div>
        </div>
      )}

      {/* Base64 Output Snippet Display */}
      {(toolId === "image-to-base64" || toolId === "data-uri-generator") && base64Output && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Copy className="w-5 h-5 text-indigo-400" /> Base64 & Data URI Output
          </h3>

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-slate-400">Data URI String:</span>
                <button
                  onClick={() => copyToClipboard(base64Output.dataUrl, "dataUrl")}
                  className="text-xs text-indigo-400 flex items-center gap-1"
                >
                  {copiedKey === "dataUrl" ? "Copied!" : "Copy String"}
                </button>
              </div>
              <textarea
                readOnly
                value={base64Output.dataUrl}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-[10px] font-mono text-emerald-400"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-slate-400">HTML &lt;img&gt; Tag:</span>
                <button
                  onClick={() => copyToClipboard(base64Output.htmlTag, "htmlTag")}
                  className="text-xs text-indigo-400 flex items-center gap-1"
                >
                  {copiedKey === "htmlTag" ? "Copied!" : "Copy HTML"}
                </button>
              </div>
              <input
                type="text"
                readOnly
                value={base64Output.htmlTag}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-indigo-300"
              />
            </div>
          </div>
        </div>
      )}

      {/* Result Display & Download Section */}
      {resultBlobUrl && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" /> Processed Result
            </h3>

            <div className="flex items-center gap-2">
              <a
                href={resultBlobUrl}
                download={resultFileName}
                onClick={() => {
                  trackToolAction({
                    toolId,
                    toolSlug: toolSlug || toolId,
                    toolName,
                    category: "image",
                    action: "DOWNLOAD",
                    fileName: resultFileName,
                    fileSizeBytes: resultSizeBytes,
                  });
                }}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all"
              >
                <Download className="w-4 h-4" /> Download Result
              </a>
            </div>
          </div>

          {/* Result Specs Banner */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
            <div>
              <span className="text-slate-400">Output File:</span> <span className="text-white font-bold">{resultFileName}</span>
            </div>
            <div>
              <span className="text-slate-400">File Size:</span>{" "}
              <span className="text-emerald-400 font-bold">{(resultSizeBytes / 1024).toFixed(1)} KB</span>
            </div>
            {originalSizeBytes > 0 && resultSizeBytes > 0 && (
              <div>
                <span className="text-slate-400">Savings:</span>{" "}
                <span className="text-indigo-400 font-bold">
                  {Math.round(((originalSizeBytes - resultSizeBytes) / originalSizeBytes) * 100)}%
                </span>
              </div>
            )}
          </div>

          {/* Image Result Preview Box */}
          <div className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex items-center justify-center overflow-hidden min-h-[250px]">
            <img
              src={resultBlobUrl}
              alt="Result Preview"
              className="max-h-[400px] w-auto object-contain rounded-lg shadow-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};
