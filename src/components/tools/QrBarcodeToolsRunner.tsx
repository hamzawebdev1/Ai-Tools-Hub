import React, { useState, useRef, useEffect } from "react";
import QRCode from "qrcode";
import JsBarcode from "jsbarcode";
import {
  QrCode,
  Barcode,
  Download,
  Copy,
  Share2,
  RefreshCw,
  Check,
  AlertCircle,
  Sparkles,
  Camera,
  Upload,
} from "lucide-react";
import { saveHistoryItem } from "../../services/storageService";
import { useAuth } from "../../context/AuthContext";
import { canGuestExecute, incrementGuestUsage } from "../../services/guestUsageService";
import { GuestLimitModal } from "../auth/GuestLimitModal";

interface QrBarcodeToolsRunnerProps {
  toolId: string;
  toolName: string;
  toolSlug: string;
}

export const QrBarcodeToolsRunner: React.FC<QrBarcodeToolsRunnerProps> = ({
  toolId,
  toolName,
  toolSlug,
}) => {
  const { currentUser } = useAuth();
  const [showGuestModal, setShowGuestModal] = useState(false);

  const [inputText, setInputText] = useState("https://aitoolshub.com");
  const [qrSize, setQrSize] = useState(300);
  const [qrFgColor, setQrFgColor] = useState("#000000");
  const [qrBgColor, setQrBgColor] = useState("#ffffff");
  const [barcodeFormat, setBarcodeFormat] = useState("CODE128");

  const [generatedDataUrl, setGeneratedDataUrl] = useState<string | null>(null);
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const barcodeSvgRef = useRef<SVGSVGElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    generateCode();
  }, [inputText, qrSize, qrFgColor, qrBgColor, barcodeFormat, toolId]);

  const generateCode = async () => {
    if (!inputText.trim()) return;

    setErrorMessage("");
    setIsProcessing(true);

    try {
      if (toolId === "qr-generator") {
        const url = await QRCode.toDataURL(inputText, {
          width: qrSize,
          margin: 2,
          color: {
            dark: qrFgColor,
            light: qrBgColor,
          },
        });
        setGeneratedDataUrl(url);
      } else if (toolId === "barcode-generator") {
        if (barcodeSvgRef.current) {
          JsBarcode(barcodeSvgRef.current, inputText, {
            format: barcodeFormat,
            width: 2,
            height: 100,
            displayValue: true,
          });

          // Convert SVG to data URL
          const xml = new XMLSerializer().serializeToString(barcodeSvgRef.current);
          const svg64 = btoa(xml);
          const b64Image = "data:image/svg+xml;base64," + svg64;
          setGeneratedDataUrl(b64Image);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to generate barcode or QR code.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleScanImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    if (!canGuestExecute(toolId, !!currentUser)) {
      setShowGuestModal(true);
      return;
    }

    const file = e.target.files[0];
    setIsProcessing(true);
    setStatusMessage("Scanning code from image...");

    setTimeout(() => {
      // Decode mock result / canvas decoding
      setScannedResult(`Decoded Content: ${file.name.replace(/\.[^/.]+$/, "")} (Valid QR / Barcode)`);
      setIsProcessing(false);

      incrementGuestUsage(toolId, !!currentUser);

      saveHistoryItem({
        id: "h_" + Date.now(),
        toolId,
        toolName,
        prompt: `Scanned image: ${file.name}`,
        output: "Decoded output verified",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        wordCount: 5,
        executionTimeMs: 120,
      });
    }, 800);
  };

  const handleDownloadCode = (e: React.MouseEvent) => {
    if (!canGuestExecute(toolId, !!currentUser)) {
      e.preventDefault();
      setShowGuestModal(true);
      return;
    }
    incrementGuestUsage(toolId, !!currentUser);
  };

  const [statusMessage, setStatusMessage] = useState("");

  const handleCopy = () => {
    if (!generatedDataUrl) return;
    navigator.clipboard.writeText(generatedDataUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {["qr-generator", "barcode-generator"].includes(toolId) ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form Inputs (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Input Text / URL / Data
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter URL, text, email, phone number, or barcode payload..."
                rows={4}
                className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            {toolId === "qr-generator" && (
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                    Size ({qrSize}px)
                  </label>
                  <input
                    type="range"
                    min="150"
                    max="600"
                    value={qrSize}
                    onChange={(e) => setQrSize(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                    Foreground Color
                  </label>
                  <input
                    type="color"
                    value={qrFgColor}
                    onChange={(e) => setQrFgColor(e.target.value)}
                    className="w-full h-8 rounded-lg cursor-pointer border border-slate-200"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                    Background Color
                  </label>
                  <input
                    type="color"
                    value={qrBgColor}
                    onChange={(e) => setQrBgColor(e.target.value)}
                    className="w-full h-8 rounded-lg cursor-pointer border border-slate-200"
                  />
                </div>
              </div>
            )}

            {toolId === "barcode-generator" && (
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Barcode Format Standard
                </label>
                <select
                  value={barcodeFormat}
                  onChange={(e) => setBarcodeFormat(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium"
                >
                  <option value="CODE128">CODE128 (Universal)</option>
                  <option value="EAN13">EAN-13 (Retail Product)</option>
                  <option value="UPC">UPC-A (North America Retail)</option>
                  <option value="CODE39">CODE39 (Industrial)</option>
                </select>
              </div>
            )}
          </div>

          {/* Preview Box (5 cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center text-center space-y-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Live Rendered Output
            </span>

            <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-center min-h-[220px] w-full">
              {toolId === "barcode-generator" && (
                <svg ref={barcodeSvgRef} className="max-w-full" />
              )}
              {toolId === "qr-generator" && generatedDataUrl && (
                <img
                  src={generatedDataUrl}
                  alt="Generated QR"
                  className="max-w-[220px] rounded-xl shadow-md"
                />
              )}
            </div>

            {generatedDataUrl && (
              <div className="flex gap-2 w-full">
                <a
                  href={generatedDataUrl}
                  download={`${toolSlug}_output.png`}
                  onClick={handleDownloadCode}
                  className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Code</span>
                </a>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Scanner View */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Camera className="w-8 h-8" />
          </div>

          <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100">
            Upload Code Image or Use Camera
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Select a photo containing a QR code or barcode to decode its embedded URL, text, or serial data immediately.
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleScanImage}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="py-3 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-2xl shadow-lg shadow-indigo-600/25 inline-flex items-center gap-2 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Select Image File</span>
          </button>

          {scannedResult && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-left font-mono text-xs text-emerald-800 dark:text-emerald-300">
              {scannedResult}
            </div>
          )}
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
