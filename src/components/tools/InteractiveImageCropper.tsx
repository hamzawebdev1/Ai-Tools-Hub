import React, { useState, useEffect, useRef, useCallback } from "react";
import { Scissors, RefreshCw, RotateCw, FlipHorizontal, FlipVertical, Check, ZoomIn, ZoomOut, Maximize } from "lucide-react";
import { loadImageFromFile } from "../../services/imageEngine";

interface InteractiveImageCropperProps {
  file: File;
  onCropChange?: (crop: { cropX: number; cropY: number; cropW: number; cropH: number; rotation: number; flipH: boolean; flipV: boolean }) => void;
  onApplyCrop: (crop: { cropX: number; cropY: number; cropW: number; cropH: number; rotation: number; flipH: boolean; flipV: boolean }) => void;
}

export const InteractiveImageCropper: React.FC<InteractiveImageCropperProps> = ({ file, onCropChange, onApplyCrop }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Original Dimensions
  const [naturalWidth, setNaturalWidth] = useState<number>(0);
  const [naturalHeight, setNaturalHeight] = useState<number>(0);
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);

  // Transformations
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);
  const [aspectRatio, setAspectRatio] = useState<string>("free"); // free, 1:1, 16:9, 4:3, 3:2, 9:16

  // Crop Box in natural image pixels
  const [cropBox, setCropBox] = useState<{ x: number; y: number; w: number; h: number }>({ x: 0, y: 0, w: 0, h: 0 });

  // Dragging State
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragType, setDragType] = useState<string | null>(null); // 'move' or handle name e.g. 'tl', 'br'
  const [dragStart, setDragStart] = useState<{ mouseX: number; mouseY: number; boxX: number; boxY: number; boxW: number; boxH: number }>({
    mouseX: 0, mouseY: 0, boxX: 0, boxY: 0, boxW: 0, boxH: 0
  });

  // Display Scale Factor (canvas display width / actual image width)
  const [scale, setScale] = useState<number>(1);
  const [displaySize, setDisplaySize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  // Load Image File
  useEffect(() => {
    let active = true;
    loadImageFromFile(file).then((img) => {
      if (!active) return;
      const nw = img.naturalWidth || img.width;
      const nh = img.naturalHeight || img.height;
      setImgElement(img);
      setNaturalWidth(nw);
      setNaturalHeight(nh);

      // Default crop box = 80% centered box
      const defaultW = Math.round(nw * 0.8);
      const defaultH = Math.round(nh * 0.8);
      const defaultX = Math.round((nw - defaultW) / 2);
      const defaultY = Math.round((nh - defaultH) / 2);

      const initialBox = { x: defaultX, y: defaultY, w: defaultW, h: defaultH };
      setCropBox(initialBox);
      if (onCropChange) {
        onCropChange({ cropX: defaultX, cropY: defaultY, cropW: defaultW, cropH: defaultH, rotation, flipH, flipV });
      }
    }).catch(() => {});

    return () => { active = false; };
  }, [file]);

  // Recalculate container scale and render canvas whenever transform/img changes
  const renderCanvas = useCallback(() => {
    if (!imgElement || !canvasRef.current || !containerRef.current) return;

    const containerW = containerRef.current.clientWidth || 600;
    const is90or270 = Math.abs(rotation) === 90 || Math.abs(rotation) === 270;
    const effW = is90or270 ? naturalHeight : naturalWidth;
    const effH = is90or270 ? naturalWidth : naturalHeight;

    const maxDisplayH = 450;
    const computedScale = Math.min(containerW / effW, maxDisplayH / effH, 1);
    setScale(computedScale);

    const dispW = Math.round(effW * computedScale);
    const dispH = Math.round(effH * computedScale);
    setDisplaySize({ w: dispW, h: dispH });

    const canvas = canvasRef.current;
    canvas.width = dispW;
    canvas.height = dispH;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, dispW, dispH);
    ctx.save();
    ctx.translate(dispW / 2, dispH / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

    const drawW = naturalWidth * computedScale;
    const drawH = naturalHeight * computedScale;
    ctx.drawImage(imgElement, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();
  }, [imgElement, naturalWidth, naturalHeight, rotation, flipH, flipV]);

  useEffect(() => {
    renderCanvas();
    window.addEventListener("resize", renderCanvas);
    return () => window.removeEventListener("resize", renderCanvas);
  }, [renderCanvas]);

  // Handle Aspect Ratio Selection
  const applyPresetAspect = (preset: string) => {
    setAspectRatio(preset);
    if (!naturalWidth || !naturalHeight) return;

    let newW = naturalWidth;
    let newH = naturalHeight;

    if (preset === "1:1") {
      const side = Math.min(naturalWidth, naturalHeight);
      newW = side;
      newH = side;
    } else if (preset === "16:9") {
      newW = naturalWidth;
      newH = Math.round(naturalWidth * (9 / 16));
      if (newH > naturalHeight) {
        newH = naturalHeight;
        newW = Math.round(naturalHeight * (16 / 9));
      }
    } else if (preset === "4:3") {
      newW = naturalWidth;
      newH = Math.round(naturalWidth * (3 / 4));
      if (newH > naturalHeight) {
        newH = naturalHeight;
        newW = Math.round(naturalHeight * (4 / 3));
      }
    } else if (preset === "3:2") {
      newW = naturalWidth;
      newH = Math.round(naturalWidth * (2 / 3));
      if (newH > naturalHeight) {
        newH = naturalHeight;
        newW = Math.round(naturalHeight * (3 / 2));
      }
    } else if (preset === "9:16") {
      newH = naturalHeight;
      newW = Math.round(naturalHeight * (9 / 16));
      if (newW > naturalWidth) {
        newW = naturalWidth;
        newH = Math.round(naturalWidth * (16 / 9));
      }
    } else { // "free" or reset full
      newW = naturalWidth;
      newH = naturalHeight;
    }

    const newX = Math.max(0, Math.round((naturalWidth - newW) / 2));
    const newY = Math.max(0, Math.round((naturalHeight - newH) / 2));

    const updated = { x: newX, y: newY, w: newW, h: newH };
    setCropBox(updated);
    if (onCropChange) {
      onCropChange({ cropX: newX, cropY: newY, cropW: newW, cropH: newH, rotation, flipH, flipV });
    }
  };

  // Dragging logic for crop overlay box and corner handles
  const handleMouseDown = (e: React.MouseEvent, type: string) => {
    e.preventDefault();
    setIsDragging(true);
    setDragType(type);
    setDragStart({
      mouseX: e.clientX,
      mouseY: e.clientY,
      boxX: cropBox.x,
      boxY: cropBox.y,
      boxW: cropBox.w,
      boxH: cropBox.h,
    });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !dragType || scale <= 0) return;

    const dx = Math.round((e.clientX - dragStart.mouseX) / scale);
    const dy = Math.round((e.clientY - dragStart.mouseY) / scale);

    let { boxX, boxY, boxW, boxH } = dragStart;

    if (dragType === "move") {
      boxX = Math.max(0, Math.min(naturalWidth - boxW, dragStart.boxX + dx));
      boxY = Math.max(0, Math.min(naturalHeight - boxH, dragStart.boxY + dy));
    } else {
      // Handle resizing
      if (dragType.includes("r")) {
        boxW = Math.max(30, Math.min(naturalWidth - boxX, dragStart.boxW + dx));
      }
      if (dragType.includes("l")) {
        const potentialW = dragStart.boxW - dx;
        if (potentialW >= 30 && dragStart.boxX + dx >= 0) {
          boxX = dragStart.boxX + dx;
          boxW = potentialW;
        }
      }
      if (dragType.includes("b")) {
        boxH = Math.max(30, Math.min(naturalHeight - boxY, dragStart.boxH + dy));
      }
      if (dragType.includes("t")) {
        const potentialH = dragStart.boxH - dy;
        if (potentialH >= 30 && dragStart.boxY + dy >= 0) {
          boxY = dragStart.boxY + dy;
          boxH = potentialH;
        }
      }

      // Enforce Aspect Ratio if preset selected
      if (aspectRatio === "1:1") {
        const minDim = Math.min(boxW, boxH);
        boxW = minDim;
        boxH = minDim;
      } else if (aspectRatio === "16:9") {
        boxH = Math.round(boxW * (9 / 16));
      } else if (aspectRatio === "4:3") {
        boxH = Math.round(boxW * (3 / 4));
      } else if (aspectRatio === "3:2") {
        boxH = Math.round(boxW * (2 / 3));
      } else if (aspectRatio === "9:16") {
        boxW = Math.round(boxH * (9 / 16));
      }
    }

    // Clamp within bounds
    boxX = Math.max(0, Math.min(naturalWidth - 20, boxX));
    boxY = Math.max(0, Math.min(naturalHeight - 20, boxY));
    boxW = Math.min(naturalWidth - boxX, boxW);
    boxH = Math.min(naturalHeight - boxY, boxH);

    const newBox = { x: boxX, y: boxY, w: boxW, h: boxH };
    setCropBox(newBox);
    if (onCropChange) {
      onCropChange({ cropX: boxX, cropY: boxY, cropW: boxW, cropH: boxH, rotation, flipH, flipV });
    }
  }, [isDragging, dragType, dragStart, scale, naturalWidth, naturalHeight, aspectRatio, rotation, flipH, flipV, onCropChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragType(null);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Display coordinates for crop box overlay element
  const boxDispX = Math.round(cropBox.x * scale);
  const boxDispY = Math.round(cropBox.y * scale);
  const boxDispW = Math.round(cropBox.w * scale);
  const boxDispH = Math.round(cropBox.h * scale);

  return (
    <div className="space-y-5">
      {/* Aspect Ratio & Transform Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-slate-400">Aspect Ratio:</span>
          {[
            { id: "free", label: "Free Form" },
            { id: "1:1", label: "1:1 Square" },
            { id: "16:9", label: "16:9 HD" },
            { id: "4:3", label: "4:3 Standard" },
            { id: "3:2", label: "3:2 Photo" },
            { id: "9:16", label: "9:16 Story" },
          ].map((preset) => (
            <button
              key={preset.id}
              onClick={() => applyPresetAspect(preset.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                aspectRatio === preset.id
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const r = (rotation + 90) % 360;
              setRotation(r);
              if (onCropChange) onCropChange({ cropX: cropBox.x, cropY: cropBox.y, cropW: cropBox.w, cropH: cropBox.h, rotation: r, flipH, flipV });
            }}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1.5"
            title="Rotate 90 Degrees"
          >
            <RotateCw className="w-3.5 h-3.5 text-indigo-400" /> Rotate
          </button>
          <button
            onClick={() => {
              const f = !flipH;
              setFlipH(f);
              if (onCropChange) onCropChange({ cropX: cropBox.x, cropY: cropBox.y, cropW: cropBox.w, cropH: cropBox.h, rotation, flipH: f, flipV });
            }}
            className={`p-2 rounded-lg flex items-center gap-1.5 ${flipH ? "bg-indigo-600 text-white" : "bg-slate-800 hover:bg-slate-700 text-slate-200"}`}
            title="Flip Horizontally"
          >
            <FlipHorizontal className="w-3.5 h-3.5" /> Flip H
          </button>
          <button
            onClick={() => {
              const f = !flipV;
              setFlipV(f);
              if (onCropChange) onCropChange({ cropX: cropBox.x, cropY: cropBox.y, cropW: cropBox.w, cropH: cropBox.h, rotation, flipH, flipV: f });
            }}
            className={`p-2 rounded-lg flex items-center gap-1.5 ${flipV ? "bg-indigo-600 text-white" : "bg-slate-800 hover:bg-slate-700 text-slate-200"}`}
            title="Flip Vertically"
          >
            <FlipVertical className="w-3.5 h-3.5" /> Flip V
          </button>
          <button
            onClick={() => applyPresetAspect("free")}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
            title="Reset to Full Image"
          >
            <Maximize className="w-3.5 h-3.5" /> Full
          </button>
        </div>
      </div>

      {/* Interactive Canvas Container with Draggable Box */}
      <div
        ref={containerRef}
        className="relative bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex items-center justify-center p-4 min-h-[350px] select-none"
      >
        <div className="relative inline-block shadow-2xl" style={{ width: displaySize.w, height: displaySize.h }}>
          {/* Base Image Canvas */}
          <canvas ref={canvasRef} className="block rounded-lg" />

          {/* Semi-transparent dark overlay for unselected area */}
          <div className="absolute inset-0 bg-black/60 pointer-events-none rounded-lg" />

          {/* Interactive Crop Selection Window */}
          <div
            onMouseDown={(e) => handleMouseDown(e, "move")}
            className="absolute border-2 border-indigo-400 bg-transparent cursor-move shadow-2xl group transition-all"
            style={{
              left: `${boxDispX}px`,
              top: `${boxDispY}px`,
              width: `${boxDispW}px`,
              height: `${boxDispH}px`,
              boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.55)",
            }}
          >
            {/* Rule of Thirds Grid Lines */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-40 border border-indigo-300/30">
              <div className="border-r border-indigo-300/30" />
              <div className="border-r border-indigo-300/30" />
              <div />
              <div className="border-t border-indigo-300/30 border-r border-indigo-300/30" />
              <div className="border-t border-indigo-300/30 border-r border-indigo-300/30" />
              <div className="border-t border-indigo-300/30" />
              <div className="border-t border-indigo-300/30 border-r border-indigo-300/30" />
              <div className="border-t border-indigo-300/30 border-r border-indigo-300/30" />
              <div className="border-t border-indigo-300/30" />
            </div>

            {/* Dimensions Badge */}
            <div className="absolute -top-7 left-0 bg-indigo-600 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded shadow">
              {cropBox.w} × {cropBox.h} px
            </div>

            {/* Resize Handles (8 Corners/Edges) */}
            <div
              onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, "tl"); }}
              className="absolute -top-2 -left-2 w-4 h-4 bg-white border-2 border-indigo-600 rounded-full cursor-nwse-resize shadow"
            />
            <div
              onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, "tr"); }}
              className="absolute -top-2 -right-2 w-4 h-4 bg-white border-2 border-indigo-600 rounded-full cursor-nesw-resize shadow"
            />
            <div
              onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, "bl"); }}
              className="absolute -bottom-2 -left-2 w-4 h-4 bg-white border-2 border-indigo-600 rounded-full cursor-nesw-resize shadow"
            />
            <div
              onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, "br"); }}
              className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border-2 border-indigo-600 rounded-full cursor-nwse-resize shadow"
            />
            <div
              onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, "t"); }}
              className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-6 h-3 bg-white border-2 border-indigo-600 rounded cursor-ns-resize shadow"
            />
            <div
              onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, "b"); }}
              className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-6 h-3 bg-white border-2 border-indigo-600 rounded cursor-ns-resize shadow"
            />
            <div
              onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, "l"); }}
              className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-6 bg-white border-2 border-indigo-600 rounded cursor-ew-resize shadow"
            />
            <div
              onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, "r"); }}
              className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-6 bg-white border-2 border-indigo-600 rounded cursor-ew-resize shadow"
            />
          </div>
        </div>
      </div>

      {/* Manual Input Readouts & Apply Crop Action Button */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[10px]">X Position:</span>
            <span className="text-white font-bold">{cropBox.x} px</span>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Y Position:</span>
            <span className="text-white font-bold">{cropBox.y} px</span>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Crop Width:</span>
            <span className="text-indigo-400 font-bold">{cropBox.w} px</span>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Crop Height:</span>
            <span className="text-indigo-400 font-bold">{cropBox.h} px</span>
          </div>
        </div>

        <button
          onClick={() => {
            onApplyCrop({
              cropX: cropBox.x,
              cropY: cropBox.y,
              cropW: cropBox.w,
              cropH: cropBox.h,
              rotation,
              flipH,
              flipV,
            });
          }}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all ml-auto"
        >
          <Scissors className="w-4 h-4" /> Crop Image Now
        </button>
      </div>
    </div>
  );
};
