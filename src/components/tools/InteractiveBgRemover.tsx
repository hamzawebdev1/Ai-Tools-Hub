import React, { useState, useEffect, useRef, useCallback } from "react";
import { Sparkles, Pipette, CheckCircle, RefreshCw, Zap, ShieldCheck } from "lucide-react";
import { loadImageFromFile } from "../../services/imageEngine";

interface InteractiveBgRemoverProps {
  file: File;
  onApplyBgRemoval: (options: {
    tolerance: number;
    targetColor: "white" | "black" | "auto" | "custom";
    customHexColor: string;
    customTargetRgb?: { r: number; g: number; b: number };
    contiguous: boolean;
  }) => void;
}

export const InteractiveBgRemover: React.FC<InteractiveBgRemoverProps> = ({ file, onApplyBgRemoval }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Background removal options
  const [targetMode, setTargetMode] = useState<"auto" | "white" | "black" | "custom">("auto");
  const [customHex, setCustomHex] = useState<string>("#ffffff");
  const [pickedRgb, setPickedRgb] = useState<{ r: number; g: number; b: number } | null>(null);
  const [tolerance, setTolerance] = useState<number>(35);
  const [contiguous, setContiguous] = useState<boolean>(true);
  const [isEyedropperActive, setIsEyedropperActive] = useState<boolean>(false);

  // Original image state
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);
  const [naturalWidth, setNaturalWidth] = useState<number>(0);
  const [naturalHeight, setNaturalHeight] = useState<number>(0);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [isRenderingPreview, setIsRenderingPreview] = useState<boolean>(false);

  // Load image
  useEffect(() => {
    let active = true;
    loadImageFromFile(file).then((img) => {
      if (!active) return;
      setImgElement(img);
      setNaturalWidth(img.naturalWidth || img.width);
      setNaturalHeight(img.naturalHeight || img.height);
    });
    return () => { active = false; };
  }, [file]);

  // Live Preview Generator
  const renderLivePreview = useCallback(() => {
    if (!imgElement) return;

    setIsRenderingPreview(true);

    const nw = imgElement.naturalWidth || imgElement.width;
    const nh = imgElement.naturalHeight || imgElement.height;

    // Scale down preview for instant 60fps response
    const maxPrevDim = 800;
    const scale = Math.min(maxPrevDim / nw, maxPrevDim / nh, 1);
    const prevW = Math.round(nw * scale);
    const prevH = Math.round(nh * scale);

    const canvas = document.createElement("canvas");
    canvas.width = prevW;
    canvas.height = prevH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(imgElement, 0, 0, prevW, prevH);
    const imgData = ctx.getImageData(0, 0, prevW, prevH);
    const data = imgData.data;

    let rTarget = 255, gTarget = 255, bTarget = 255;

    if (pickedRgb) {
      rTarget = pickedRgb.r;
      gTarget = pickedRgb.g;
      bTarget = pickedRgb.b;
    } else if (targetMode === "white") {
      rTarget = 255; gTarget = 255; bTarget = 255;
    } else if (targetMode === "black") {
      rTarget = 0; gTarget = 0; bTarget = 0;
    } else if (targetMode === "custom" && customHex) {
      const hex = customHex.replace("#", "");
      rTarget = parseInt(hex.substring(0, 2), 16) || 255;
      gTarget = parseInt(hex.substring(2, 4), 16) || 255;
      bTarget = parseInt(hex.substring(4, 6), 16) || 255;
    } else {
      // Auto: corner average
      const corners = [0, (prevW - 1) * 4, (prevH - 1) * prevW * 4, ((prevH - 1) * prevW + (prevW - 1)) * 4];
      let sumR = 0, sumG = 0, sumB = 0;
      corners.forEach((idx) => {
        sumR += data[idx];
        sumG += data[idx + 1];
        sumB += data[idx + 2];
      });
      rTarget = Math.round(sumR / 4);
      gTarget = Math.round(sumG / 4);
      bTarget = Math.round(sumB / 4);
    }

    const maxDist = (tolerance / 100) * 441.67;
    const featherRange = maxDist * 0.25;

    const calcDist = (r: number, g: number, b: number) => {
      return Math.sqrt(Math.pow(r - rTarget, 2) + Math.pow(g - gTarget, 2) + Math.pow(b - bTarget, 2));
    };

    if (contiguous) {
      const visited = new Uint8Array(prevW * prevH);
      const queue: number[] = [];

      for (let x = 0; x < prevW; x++) {
        queue.push(x, 0);
        queue.push(x, prevH - 1);
      }
      for (let y = 0; y < prevH; y++) {
        queue.push(0, y);
        queue.push(prevW - 1, y);
      }

      let head = 0;
      while (head < queue.length) {
        const cx = queue[head++];
        const cy = queue[head++];
        const pixelIdx = cy * prevW + cx;

        if (visited[pixelIdx]) continue;
        visited[pixelIdx] = 1;

        const dataIdx = pixelIdx * 4;
        const dist = calcDist(data[dataIdx], data[dataIdx + 1], data[dataIdx + 2]);

        if (dist <= maxDist) {
          if (dist <= maxDist - featherRange) {
            data[dataIdx + 3] = 0;
          } else {
            const alphaFactor = (dist - (maxDist - featherRange)) / featherRange;
            data[dataIdx + 3] = Math.round(data[dataIdx + 3] * alphaFactor);
          }

          if (cx > 0 && !visited[pixelIdx - 1]) queue.push(cx - 1, cy);
          if (cx < prevW - 1 && !visited[pixelIdx + 1]) queue.push(cx + 1, cy);
          if (cy > 0 && !visited[pixelIdx - prevW]) queue.push(cx, cy - 1);
          if (cy < prevH - 1 && !visited[pixelIdx + prevW]) queue.push(cx, cy + prevH);
        }
      }
    } else {
      for (let i = 0; i < data.length; i += 4) {
        const dist = calcDist(data[i], data[i + 1], data[i + 2]);
        if (dist <= maxDist - featherRange) {
          data[i + 3] = 0;
        } else if (dist <= maxDist) {
          const alphaFactor = (dist - (maxDist - featherRange)) / featherRange;
          data[i + 3] = Math.round(data[i + 3] * alphaFactor);
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);
    setPreviewDataUrl(canvas.toDataURL("image/png"));
    setIsRenderingPreview(false);
  }, [imgElement, targetMode, customHex, pickedRgb, tolerance, contiguous]);

  useEffect(() => {
    const timer = setTimeout(renderLivePreview, 100);
    return () => clearTimeout(timer);
  }, [renderLivePreview]);

  // Click Canvas Eyedropper handler
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isEyedropperActive || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;

    const canvasX = Math.round(clickX * scaleX);
    const canvasY = Math.round(clickY * scaleY);

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const pixel = ctx.getImageData(canvasX, canvasY, 1, 1).data;
    const rgb = { r: pixel[0], g: pixel[1], b: pixel[2] };
    const hex = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1)}`;

    setPickedRgb(rgb);
    setCustomHex(hex);
    setTargetMode("custom");
    setIsEyedropperActive(false);
  };

  return (
    <div className="space-y-6">
      {/* Controls Header Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Background Mode:</label>
            <select
              value={targetMode}
              onChange={(e: any) => {
                setTargetMode(e.target.value);
                setPickedRgb(null);
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="auto">Auto Corner Detect</option>
              <option value="white">Pure White Backdrop (#FFFFFF)</option>
              <option value="black">Pure Black Backdrop (#000000)</option>
              <option value="custom">Custom Color Picker</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Tolerance Sensitivity: <span className="text-indigo-400 font-bold">{tolerance}%</span>
            </label>
            <input
              type="range"
              min="5"
              max="85"
              value={tolerance}
              onChange={(e) => setTolerance(Number(e.target.value))}
              className="w-full accent-indigo-500 mt-2"
            />
          </div>

          <div className="flex flex-col justify-end">
            <button
              onClick={() => setIsEyedropperActive(!isEyedropperActive)}
              className={`w-full py-2 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 border transition-all ${
                isEyedropperActive
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/50 animate-pulse"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
              }`}
            >
              <Pipette className="w-4 h-4 text-amber-400" />
              {isEyedropperActive ? "Click image to pick color..." : "Pick Color from Image"}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800 text-xs">
          <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={contiguous}
              onChange={(e) => setContiguous(e.target.checked)}
              className="accent-indigo-500 rounded"
            />
            Contiguous Edge Removal (Protects subject interior details)
          </label>

          {pickedRgb && (
            <div className="flex items-center gap-2 text-slate-300 font-mono">
              <div className="w-4 h-4 rounded border border-white/20" style={{ backgroundColor: customHex }} />
              <span>Target RGB: {pickedRgb.r}, {pickedRgb.g}, {pickedRgb.b}</span>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Checkerboard Canvas Preview */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 px-2">
          <span>Live Interactive Transparent Canvas Preview:</span>
          {isRenderingPreview && <span className="text-indigo-400 animate-pulse">Rendering preview...</span>}
        </div>

        <div
          className={`relative max-h-[450px] overflow-hidden rounded-xl border border-slate-800 flex items-center justify-center p-2 cursor-${isEyedropperActive ? "crosshair" : "default"}`}
          style={{
            backgroundImage: `
              linear-gradient(45deg, #1e293b 25%, transparent 25%), 
              linear-gradient(-45deg, #1e293b 25%, transparent 25%), 
              linear-gradient(45deg, transparent 75%, #1e293b 75%), 
              linear-gradient(-45deg, transparent 75%, #1e293b 75%)
            `,
            backgroundSize: "20px 20px",
            backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
            backgroundColor: "#0f172a",
          }}
        >
          {previewDataUrl ? (
            <img
              src={previewDataUrl}
              alt="Background Removed Preview"
              className="max-h-[400px] w-auto object-contain shadow-2xl"
            />
          ) : (
            <div className="p-12 text-slate-500 text-xs flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" /> Loading preview canvas...
            </div>
          )}
        </div>
      </div>

      {/* Primary Execution Action Button */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
          <ShieldCheck className="w-4 h-4" /> 100% Client-Side In-Browser Execution
        </div>

        <button
          onClick={() => {
            onApplyBgRemoval({
              tolerance,
              targetColor: targetMode,
              customHexColor: customHex,
              customTargetRgb: pickedRgb || undefined,
              contiguous,
            });
          }}
          className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all"
        >
          <Sparkles className="w-4 h-4" /> Remove Background & Download PNG
        </button>
      </div>
    </div>
  );
};
