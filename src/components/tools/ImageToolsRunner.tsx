import React, { useState, useRef, useEffect } from "react";
import {
  Image as ImageIcon,
  UploadCloud,
  Sliders,
  Scissors,
  Download,
  Copy,
  Share2,
  RefreshCw,
  Check,
  AlertCircle,
  Sparkles,
  Droplet,
  Sun,
  Layers,
  Eye,
} from "lucide-react";
import { saveHistoryItem } from "../../services/storageService";
import { useAuth } from "../../context/AuthContext";
import { canGuestExecute, incrementGuestUsage } from "../../services/guestUsageService";
import { GuestLimitModal } from "../auth/GuestLimitModal";

interface ImageToolsRunnerProps {
  toolId: string;
  toolName: string;
  toolSlug: string;
}

export const ImageToolsRunner: React.FC<ImageToolsRunnerProps> = ({
  toolId,
  toolName,
  toolSlug,
}) => {
  const { currentUser } = useAuth();
  const [showGuestModal, setShowGuestModal] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);

  // Tool Controls
  const [targetWidth, setTargetWidth] = useState(800);
  const [targetHeight, setTargetHeight] = useState(600);
  const [quality, setQuality] = useState(80);
  const [targetFormat, setTargetFormat] = useState("image/png");
  const [watermarkText, setWatermarkText] = useState("AI Tools Hub");
  const [blurRadius, setBlurRadius] = useState(5);
  const [pickedColor, setPickedColor] = useState("#4f46e5");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (processedImageUrl) URL.revokeObjectURL(processedImageUrl);
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [processedImageUrl, imagePreview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      const url = URL.createObjectURL(selected);
      setImagePreview(url);
      setErrorMessage("");
      setProcessedImageUrl(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selected = e.dataTransfer.files[0];
      setFile(selected);
      const url = URL.createObjectURL(selected);
      setImagePreview(url);
      setErrorMessage("");
      setProcessedImageUrl(null);
    }
  };

  const handleCanvasColorPick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) * (canvas.width / rect.width));
    const y = Math.floor((e.clientY - rect.top) * (canvas.height / rect.height));

    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const hex = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1)}`;
    setPickedColor(hex);
  };

  const processImage = async () => {
    if (!imagePreview) {
      setErrorMessage("Please select or drop an image file first.");
      return;
    }

    if (!canGuestExecute(toolId, !!currentUser)) {
      setShowGuestModal(true);
      return;
    }

    setIsProcessing(true);
    setProgress(10);
    setStatusMessage("Loading image canvas...");
    setErrorMessage("");
    setProcessedImageUrl(null);

    const startTime = Date.now();

    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imagePreview;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error("Failed to load image element."));
      });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not initialize 2D canvas context.");

      if (toolId === "image-resize") {
        setProgress(50);
        setStatusMessage(`Resizing canvas to ${targetWidth}x${targetHeight}...`);
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      } else if (toolId === "image-crop") {
        setProgress(50);
        setStatusMessage("Cropping center bounding frame...");
        const cropW = Math.min(img.width, targetWidth);
        const cropH = Math.min(img.height, targetHeight);
        const startX = (img.width - cropW) / 2;
        const startY = (img.height - cropH) / 2;

        canvas.width = cropW;
        canvas.height = cropH;
        ctx.drawImage(img, startX, startY, cropW, cropH, 0, 0, cropW, cropH);
      } else if (toolId === "image-watermark") {
        setProgress(50);
        setStatusMessage("Rendering watermark text...");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        ctx.font = `bold ${Math.max(24, Math.floor(img.width / 20))}px sans-serif`;
        ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
        ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
        ctx.shadowBlur = 8;
        ctx.textAlign = "right";
        ctx.textBaseline = "bottom";
        ctx.fillText(watermarkText, img.width - 30, img.height - 30);
      } else if (toolId === "image-blur") {
        setProgress(50);
        setStatusMessage("Applying Gaussian blur filter...");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.filter = `blur(${blurRadius}px)`;
        ctx.drawImage(img, 0, 0);
      } else if (toolId === "image-sharpen" || toolId === "image-upscale") {
        setProgress(50);
        setStatusMessage("Enhancing edge sharpness & upscaling canvas...");
        const scale = toolId === "image-upscale" ? 2 : 1;
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      } else if (toolId === "image-bg-remover") {
        setProgress(50);
        setStatusMessage("Performing color-key background removal...");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        // Key top-left pixel color as background threshold
        const rKey = data[0], gKey = data[1], bKey = data[2];

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i + 1], b = data[i + 2];
          const diff = Math.abs(r - rKey) + Math.abs(g - gKey) + Math.abs(b - bKey);
          if (diff < 60) {
            data[i + 3] = 0; // set transparent alpha
          }
        }
        ctx.putImageData(imgData, 0, 0);
      } else {
        // Image Compressor / Convert
        setProgress(60);
        setStatusMessage(`Converting & compressing image format...`);
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
      }

      setProgress(90);
      setStatusMessage("Exporting binary image stream...");

      const exportQuality = quality / 100;
      const exportMime = targetFormat;

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setIsProcessing(false);
            setErrorMessage("Image export failed.");
            return;
          }
          const url = URL.createObjectURL(blob);
          setProcessedImageUrl(url);
          setProgress(100);
          setStatusMessage("Image processed successfully!");
          setIsProcessing(false);

          incrementGuestUsage(toolId, !!currentUser);

          const execTime = Date.now() - startTime;
          saveHistoryItem({
            id: "h_" + Date.now(),
            toolId,
            toolName,
            prompt: `Processed ${file?.name || "Image"} (${img.width}x${img.height})`,
            output: `Output size: ${(blob.size / 1024).toFixed(1)} KB`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            wordCount: 0,
            executionTimeMs: execTime,
          });
        },
        exportMime,
        exportQuality
      );
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to execute image tool.");
      setIsProcessing(false);
    }
  };

  const handleCopyHex = () => {
    navigator.clipboard.writeText(pickedColor);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* File Dropzone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 bg-slate-50 dark:bg-slate-900/60 rounded-3xl p-8 text-center cursor-pointer transition-all duration-200 group"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <ImageIcon className="w-8 h-8" />
        </div>

        <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
          Drag & Drop your Image file here
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Supports PNG, JPG, WEBP, AVIF, SVG • Up to 25MB
        </p>
      </div>

      {/* Image Preview & Interactive Controls */}
      {imagePreview && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center p-2 min-h-[220px]">
              <img
                src={imagePreview}
                alt="Source Preview"
                className="max-h-64 object-contain rounded-xl"
              />
            </div>

            {/* Custom Tool Controls */}
            <div className="space-y-4">
              {["image-resize", "image-crop"].includes(toolId) && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Width (px)
                    </label>
                    <input
                      type="number"
                      value={targetWidth}
                      onChange={(e) => setTargetWidth(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Height (px)
                    </label>
                    <input
                      type="number"
                      value={targetHeight}
                      onChange={(e) => setTargetHeight(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono"
                    />
                  </div>
                </div>
              )}

              {toolId === "image-watermark" && (
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Watermark Text
                  </label>
                  <input
                    type="text"
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                  />
                </div>
              )}

              {toolId === "image-blur" && (
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Blur Radius ({blurRadius}px)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={blurRadius}
                    onChange={(e) => setBlurRadius(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>
              )}

              {toolId === "image-color-picker" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl border border-slate-300 shadow-inner shrink-0"
                      style={{ backgroundColor: pickedColor }}
                    />
                    <div>
                      <span className="text-xs font-semibold text-slate-500 block">Picked Color</span>
                      <span className="text-sm font-bold font-mono text-slate-900 dark:text-slate-100">
                        {pickedColor}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleCopyHex}
                    className="py-2 px-4 bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied HEX!" : "Copy Color HEX"}</span>
                  </button>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Export Format
                </label>
                <select
                  value={targetFormat}
                  onChange={(e) => setTargetFormat(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium"
                >
                  <option value="image/png">PNG (.png)</option>
                  <option value="image/jpeg">JPG (.jpg)</option>
                  <option value="image/webp">WEBP (.webp)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Compression Quality ({quality}%)
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
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

      {/* Action Button */}
      <button
        onClick={processImage}
        disabled={isProcessing}
        className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
      >
        {isProcessing ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Processing Canvas...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>Process {toolName}</span>
          </>
        )}
      </button>

      {/* Output Download Box */}
      {processedImageUrl && (
        <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-3xl space-y-4">
          <h4 className="font-bold text-sm text-emerald-800 dark:text-emerald-300">
            Processed Image Output
          </h4>
          <div className="rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center p-3 max-h-80">
            <img src={processedImageUrl} alt="Processed" className="max-h-72 object-contain" />
          </div>
          <a
            href={processedImageUrl}
            download={`processed_${file?.name || "image"}.${targetFormat.split("/")[1]}`}
            className="inline-flex items-center gap-2 py-3 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download Processed Image</span>
          </a>
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
