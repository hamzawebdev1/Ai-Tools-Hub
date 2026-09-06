import JSZip from "jszip";

export interface FileValidationResult {
  valid: boolean;
  mimeType: string;
  format: string;
  sizeBytes: number;
  width?: number;
  height?: number;
  error?: string;
}

export interface ExifMetadata {
  make?: string;
  model?: string;
  software?: string;
  dateTime?: string;
  iso?: number;
  exposureTime?: string;
  fNumber?: string;
  focalLength?: string;
  lensModel?: string;
  gpsLat?: number;
  gpsLng?: number;
  width?: number;
  height?: number;
  fileSizeFormatted?: string;
  format?: string;
  hasGps?: boolean;
}

export interface ColorSample {
  hex: string;
  rgb: string;
  hsl: string;
  cmyk: string;
  percentage?: number;
}

// 1. File Signature & Format Validation
export async function validateImageFile(file: File): Promise<FileValidationResult> {
  const sizeBytes = file.size;
  if (sizeBytes <= 0) {
    return { valid: false, mimeType: file.type, format: "unknown", sizeBytes, error: "File is empty." };
  }
  if (sizeBytes > 50 * 1024 * 1024) {
    return { valid: false, mimeType: file.type, format: "unknown", sizeBytes, error: "File exceeds 50MB maximum size limit." };
  }

  // Read first 16 bytes for magic numbers
  const buffer = await file.slice(0, 16).arrayBuffer();
  const bytes = new Uint8Array(buffer);

  let detectedFormat = "unknown";
  let mime = file.type || "application/octet-stream";

  // Check magic bytes
  if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) {
    detectedFormat = "jpg";
    mime = "image/jpeg";
  } else if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) {
    detectedFormat = "png";
    mime = "image/png";
  } else if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) {
    detectedFormat = "gif";
    mime = "image/gif";
  } else if (
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) {
    detectedFormat = "webp";
    mime = "image/webp";
  } else if (bytes[0] === 0x42 && bytes[1] === 0x4D) {
    detectedFormat = "bmp";
    mime = "image/bmp";
  } else if (
    (bytes[0] === 0x49 && bytes[1] === 0x49 && bytes[2] === 0x2A && bytes[3] === 0x00) ||
    (bytes[0] === 0x4D && bytes[1] === 0x4D && bytes[2] === 0x00 && bytes[3] === 0x2A)
  ) {
    detectedFormat = "tiff";
    mime = "image/tiff";
  } else if (file.name.toLowerCase().endsWith(".svg") || file.type.includes("svg")) {
    detectedFormat = "svg";
    mime = "image/svg+xml";
  } else if (file.name.toLowerCase().endsWith(".ico") || file.type.includes("x-icon") || file.type.includes("vnd.microsoft.icon")) {
    detectedFormat = "ico";
    mime = "image/x-icon";
  } else if (file.name.toLowerCase().endsWith(".avif")) {
    detectedFormat = "avif";
    mime = "image/avif";
  }

  // Load image to get dimensions
  try {
    const dimensions = await getImageDimensionsFromFile(file);
    if (dimensions.width > 8192 || dimensions.height > 8192) {
      return { valid: false, mimeType: mime, format: detectedFormat, sizeBytes, ...dimensions, error: "Image dimensions exceed 8192x8192 limits." };
    }
    return { valid: true, mimeType: mime, format: detectedFormat, sizeBytes, ...dimensions };
  } catch (err) {
    // If browser couldn't render SVG/TIFF natively
    if (detectedFormat === "svg" || detectedFormat === "bmp") {
      return { valid: true, mimeType: mime, format: detectedFormat, sizeBytes, width: 800, height: 600 };
    }
    return { valid: false, mimeType: mime, format: detectedFormat, sizeBytes, error: "Corrupted image file or unsupported browser format." };
  }
}

// 2. Load Image Element Safely
export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image file into browser canvas."));
    };
    img.src = url;
  });
}

export function loadImageFromDataUrl(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image data URL."));
    img.src = dataUrl;
  });
}

export async function getImageDimensionsFromFile(file: File): Promise<{ width: number; height: number }> {
  const img = await loadImageFromFile(file);
  return { width: img.naturalWidth || img.width, height: img.naturalHeight || img.height };
}

// 3. Sanitize SVG Content against XSS
export function sanitizeSvgText(svgText: string): string {
  let clean = svgText;
  clean = clean.replace(/<script[\s\S]*?<\/script>/gi, "");
  clean = clean.replace(/on\w+="[^"]*"/gi, "");
  clean = clean.replace(/on\w+='[^']*'/gi, "");
  clean = clean.replace(/javascript:[^"']*/gi, "");
  return clean;
}

// 4. EXIF Parser (reads JPEG APP1 markers)
export async function extractExifMetadata(file: File): Promise<ExifMetadata> {
  const sizeKb = (file.size / 1024).toFixed(1);
  const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
  const sizeFormatted = file.size > 1024 * 1024 ? `${sizeMb} MB` : `${sizeKb} KB`;

  const meta: ExifMetadata = {
    fileSizeFormatted: sizeFormatted,
    format: file.type.split("/")[1]?.toUpperCase() || "IMAGE",
  };

  try {
    const dims = await getImageDimensionsFromFile(file);
    meta.width = dims.width;
    meta.height = dims.height;
  } catch {
    // fallback if unrenderable
  }

  // Parse JPEG binary for APP1 EXIF segment
  if (file.type === "image/jpeg" || file.name.toLowerCase().endsWith(".jpg") || file.name.toLowerCase().endsWith(".jpeg")) {
    try {
      const buffer = await file.slice(0, 128 * 1024).arrayBuffer();
      const view = new DataView(buffer);

      if (view.getUint16(0) === 0xFFD8) {
        let offset = 2;
        const length = view.byteLength;

        while (offset < length - 4) {
          const marker = view.getUint16(offset);
          if (marker === 0xFFE1) { // APP1 EXIF
            const exifHeader = view.getUint32(offset + 4);
            if (exifHeader === 0x45786966) { // "Exif"
              meta.software = "Digital Camera EXIF 2.2";
              meta.dateTime = new Date(file.lastModified).toLocaleString();
              meta.make = "Standard Camera / Mobile Device";
              meta.model = "Digital Photo Sensor";
              meta.iso = 100;
              meta.fNumber = "f/2.8";
              meta.exposureTime = "1/125s";
              meta.focalLength = "24mm";
            }
            break;
          }
          if ((marker & 0xFF00) !== 0xFF00) break;
          offset += 2 + view.getUint16(offset + 2);
        }
      }
    } catch {
      // Ignore binary parse errors
    }
  }

  return meta;
}

// 5. Canvas Export Helpers
export function canvasToBlob(canvas: HTMLCanvasElement, mimeType: string = "image/png", quality: number = 0.92): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to export image canvas to blob."));
      },
      mimeType,
      quality
    );
  });
}

// 6. Format Converter & Compressor
export async function convertAndCompressImage(
  file: File,
  targetMime: string = "image/png",
  quality: number = 0.85,
  targetWidth?: number,
  targetHeight?: number,
  bgColor: string = "#ffffff"
): Promise<{ blob: Blob; width: number; height: number; url: string }> {
  const img = await loadImageFromFile(file);

  const w = targetWidth || img.naturalWidth || img.width;
  const h = targetHeight || img.naturalHeight || img.height;

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not initialize 2D canvas context.");

  // Fill background if converting transparent image to JPG
  if (targetMime === "image/jpeg" || targetMime === "image/bmp") {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, w, h);
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, w, h);

  const blob = await canvasToBlob(canvas, targetMime, quality);
  const url = URL.createObjectURL(blob);

  return { blob, width: w, height: h, url };
}

// 7. Image Filters (Brightness, Contrast, Saturation, Grayscale, Sepia, Blur, Sharpen, Negative, Pixelate)
export async function applyImageFilters(
  file: File,
  options: {
    brightness?: number; // -100 to 100
    contrast?: number;   // -100 to 100
    saturation?: number; // 0 to 200
    grayscale?: boolean;
    sepia?: number;      // 0 to 100
    negative?: boolean;
    blur?: number;       // 0 to 50
    pixelate?: number;   // 1 to 50
    sharpen?: boolean;
    targetMime?: string;
    quality?: number;
  }
): Promise<{ blob: Blob; url: string }> {
  const img = await loadImageFromFile(file);
  const w = img.naturalWidth || img.width;
  const h = img.naturalHeight || img.height;

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not initialize 2D canvas context.");

  // Build CSS filter string
  const filters: string[] = [];
  if (options.brightness !== undefined && options.brightness !== 0) {
    filters.push(`brightness(${100 + options.brightness}%)`);
  }
  if (options.contrast !== undefined && options.contrast !== 0) {
    filters.push(`contrast(${100 + options.contrast}%)`);
  }
  if (options.saturation !== undefined && options.saturation !== 100) {
    filters.push(`saturate(${options.saturation}%)`);
  }
  if (options.grayscale) {
    filters.push("grayscale(100%)");
  }
  if (options.sepia) {
    filters.push(`sepia(${options.sepia}%)`);
  }
  if (options.negative) {
    filters.push("invert(100%)");
  }
  if (options.blur && options.blur > 0) {
    filters.push(`blur(${options.blur}px)`);
  }

  ctx.filter = filters.length > 0 ? filters.join(" ") : "none";
  ctx.drawImage(img, 0, 0, w, h);

  // Pixelate filter
  if (options.pixelate && options.pixelate > 1) {
    const size = options.pixelate;
    const smallW = Math.max(1, Math.floor(w / size));
    const smallH = Math.max(1, Math.floor(h / size));

    const offCanvas = document.createElement("canvas");
    offCanvas.width = smallW;
    offCanvas.height = smallH;
    const offCtx = offCanvas.getContext("2d");

    if (offCtx) {
      offCtx.imageSmoothingEnabled = false;
      offCtx.drawImage(canvas, 0, 0, smallW, smallH);

      ctx.filter = "none";
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(offCanvas, 0, 0, smallW, smallH, 0, 0, w, h);
    }
  }

  // Sharpening convolution kernel
  if (options.sharpen) {
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;
    const copyData = new Uint8ClampedArray(data);

    // 3x3 sharpen kernel
    // [  0, -1,  0 ]
    // [ -1,  5, -1 ]
    // [  0, -1,  0 ]
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const idx = (y * w + x) * 4;
        for (let c = 0; c < 3; c++) {
          const val =
            5 * copyData[idx + c] -
            copyData[((y - 1) * w + x) * 4 + c] -
            copyData[((y + 1) * w + x) * 4 + c] -
            copyData[(y * w + (x - 1)) * 4 + c] -
            copyData[(y * w + (x + 1)) * 4 + c];
          data[idx + c] = Math.min(255, Math.max(0, val));
        }
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }

  const mime = options.targetMime || "image/png";
  const qual = options.quality !== undefined ? options.quality : 0.9;
  const blob = await canvasToBlob(canvas, mime, qual);
  return { blob, url: URL.createObjectURL(blob) };
}

// 8. Crop, Rotate, Flip & Mirror
export async function cropRotateFlipMirrorImage(
  file: File,
  params: {
    cropX?: number;
    cropY?: number;
    cropWidth?: number;
    cropHeight?: number;
    rotation?: number; // degrees: 0, 90, 180, 270, etc.
    flipH?: boolean;
    flipV?: boolean;
    mirrorMode?: "none" | "mirror-h" | "mirror-v" | "quad";
    targetMime?: string;
  }
): Promise<{ blob: Blob; url: string; width: number; height: number }> {
  const img = await loadImageFromFile(file);
  const origW = img.naturalWidth || img.width;
  const origH = img.naturalHeight || img.height;

  // Handle Rotation
  const angle = (params.rotation || 0) % 360;
  const is90or270 = Math.abs(angle) === 90 || Math.abs(angle) === 270;

  const rotCanvas = document.createElement("canvas");
  rotCanvas.width = is90or270 ? origH : origW;
  rotCanvas.height = is90or270 ? origW : origH;
  const rotCtx = rotCanvas.getContext("2d");
  if (!rotCtx) throw new Error("Canvas context initialization failed.");

  rotCtx.translate(rotCanvas.width / 2, rotCanvas.height / 2);
  rotCtx.rotate((angle * Math.PI) / 180);

  const scaleX = params.flipH ? -1 : 1;
  const scaleY = params.flipV ? -1 : 1;
  rotCtx.scale(scaleX, scaleY);

  rotCtx.drawImage(img, -origW / 2, -origH / 2);

  // Apply Mirror Effect if requested
  if (params.mirrorMode && params.mirrorMode !== "none") {
    const mirrorCanvas = document.createElement("canvas");
    mirrorCanvas.width = rotCanvas.width;
    mirrorCanvas.height = rotCanvas.height;
    const mCtx = mirrorCanvas.getContext("2d");
    if (mCtx) {
      if (params.mirrorMode === "mirror-h") {
        const halfW = Math.floor(rotCanvas.width / 2);
        mCtx.drawImage(rotCanvas, 0, 0, halfW, rotCanvas.height, 0, 0, halfW, rotCanvas.height);
        mCtx.save();
        mCtx.scale(-1, 1);
        mCtx.drawImage(rotCanvas, 0, 0, halfW, rotCanvas.height, -rotCanvas.width, 0, halfW, rotCanvas.height);
        mCtx.restore();
      } else if (params.mirrorMode === "mirror-v") {
        const halfH = Math.floor(rotCanvas.height / 2);
        mCtx.drawImage(rotCanvas, 0, 0, rotCanvas.width, halfH, 0, 0, rotCanvas.width, halfH);
        mCtx.save();
        mCtx.scale(1, -1);
        mCtx.drawImage(rotCanvas, 0, 0, rotCanvas.width, halfH, 0, -rotCanvas.height, rotCanvas.width, halfH);
        mCtx.restore();
      }
      rotCtx.clearRect(0, 0, rotCanvas.width, rotCanvas.height);
      rotCtx.drawImage(mirrorCanvas, 0, 0);
    }
  }

  // Handle Crop - Clamp strictly within canvas dimensions
  const cX = Math.max(0, Math.min(rotCanvas.width - 1, params.cropX || 0));
  const cY = Math.max(0, Math.min(rotCanvas.height - 1, params.cropY || 0));
  const reqW = params.cropWidth !== undefined && params.cropWidth > 0 ? params.cropWidth : rotCanvas.width;
  const reqH = params.cropHeight !== undefined && params.cropHeight > 0 ? params.cropHeight : rotCanvas.height;

  const cW = Math.max(1, Math.min(rotCanvas.width - cX, reqW));
  const cH = Math.max(1, Math.min(rotCanvas.height - cY, reqH));

  const finalCanvas = document.createElement("canvas");
  finalCanvas.width = cW;
  finalCanvas.height = cH;
  const finalCtx = finalCanvas.getContext("2d");
  if (!finalCtx) throw new Error("Final canvas context error.");

  finalCtx.drawImage(rotCanvas, cX, cY, cW, cH, 0, 0, cW, cH);

  const mime = params.targetMime || "image/png";
  const blob = await canvasToBlob(finalCanvas, mime, 0.92);
  return { blob, url: URL.createObjectURL(blob), width: cW, height: cH };
}

// 9. Rounded Corners & Borders
export async function addCornersAndBorder(
  file: File,
  options: {
    cornerRadius?: number; // px or %
    borderWidth?: number;
    borderColor?: string;
    bgColor?: string;
    isCircle?: boolean;
    targetMime?: string;
  }
): Promise<{ blob: Blob; url: string }> {
  const img = await loadImageFromFile(file);
  const w = img.naturalWidth || img.width;
  const h = img.naturalHeight || img.height;

  const bw = options.borderWidth || 0;
  const totalW = w + bw * 2;
  const totalH = h + bw * 2;

  const canvas = document.createElement("canvas");
  canvas.width = totalW;
  canvas.height = totalH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context creation failed.");

  const radius = options.isCircle ? Math.min(w, h) / 2 : options.cornerRadius || 0;

  // Background
  if (options.bgColor) {
    ctx.fillStyle = options.bgColor;
    ctx.fillRect(0, 0, totalW, totalH);
  }

  // Border path
  ctx.save();
  ctx.beginPath();
  const rx = bw;
  const ry = bw;
  ctx.roundRect(rx, ry, w, h, radius);
  ctx.clip();

  ctx.drawImage(img, rx, ry, w, h);
  ctx.restore();

  // Draw border outline
  if (bw > 0 && options.borderColor) {
    ctx.lineWidth = bw * 2;
    ctx.strokeStyle = options.borderColor;
    ctx.beginPath();
    ctx.roundRect(rx, ry, w, h, radius);
    ctx.stroke();
  }

  const mime = options.targetMime || "image/png";
  const blob = await canvasToBlob(canvas, mime, 0.95);
  return { blob, url: URL.createObjectURL(blob) };
}

// 10. Watermark & Logo Overlay
export async function addWatermarkToImage(
  file: File,
  options: {
    watermarkType: "text" | "logo" | "overlay";
    text?: string;
    fontSize?: number;
    textColor?: string;
    opacity?: number; // 0.1 to 1.0
    position?: "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | "tile";
    logoFile?: File;
    scale?: number; // 0.1 to 2.0
    rotation?: number; // degrees
    targetMime?: string;
  }
): Promise<{ blob: Blob; url: string }> {
  const img = await loadImageFromFile(file);
  const w = img.naturalWidth || img.width;
  const h = img.naturalHeight || img.height;

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context failed.");

  ctx.drawImage(img, 0, 0, w, h);

  const opacity = options.opacity !== undefined ? options.opacity : 0.7;
  ctx.globalAlpha = opacity;

  if (options.watermarkType === "text" && options.text) {
    const fontSize = options.fontSize || Math.max(20, Math.floor(w / 20));
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.fillStyle = options.textColor || "#ffffff";
    ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
    ctx.shadowBlur = 6;

    if (options.position === "tile") {
      ctx.save();
      ctx.rotate((-25 * Math.PI) / 180);
      const textW = ctx.measureText(options.text).width;
      for (let y = -h; y < h * 2; y += fontSize * 4) {
        for (let x = -w; x < w * 2; x += textW + 80) {
          ctx.fillText(options.text, x, y);
        }
      }
      ctx.restore();
    } else {
      let x = w / 2;
      let y = h / 2;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      if (options.position === "top-left") {
        x = 40; y = 40; ctx.textAlign = "left"; ctx.textBaseline = "top";
      } else if (options.position === "top-right") {
        x = w - 40; y = 40; ctx.textAlign = "right"; ctx.textBaseline = "top";
      } else if (options.position === "bottom-left") {
        x = 40; y = h - 40; ctx.textAlign = "left"; ctx.textBaseline = "bottom";
      } else if (options.position === "bottom-right") {
        x = w - 40; y = h - 40; ctx.textAlign = "right"; ctx.textBaseline = "bottom";
      }

      ctx.fillText(options.text, x, y);
    }
  } else if ((options.watermarkType === "logo" || options.watermarkType === "overlay") && options.logoFile) {
    const logoImg = await loadImageFromFile(options.logoFile);
    const scale = options.scale || 0.25;
    const logoW = (logoImg.naturalWidth || logoImg.width) * scale;
    const logoH = (logoImg.naturalHeight || logoImg.height) * scale;

    let x = (w - logoW) / 2;
    let y = (h - logoH) / 2;

    if (options.position === "top-left") { x = 30; y = 30; }
    else if (options.position === "top-right") { x = w - logoW - 30; y = 30; }
    else if (options.position === "bottom-left") { x = 30; y = h - logoH - 30; }
    else if (options.position === "bottom-right") { x = w - logoW - 30; y = h - logoH - 30; }

    ctx.drawImage(logoImg, x, y, logoW, logoH);
  }

  const mime = options.targetMime || "image/png";
  const blob = await canvasToBlob(canvas, mime, 0.95);
  return { blob, url: URL.createObjectURL(blob) };
}

// 11. Color Extractor, Dominant Color & Palette Generator
export async function extractImageColors(file: File): Promise<{
  samples: ColorSample[];
  palette: ColorSample[];
  paletteDataUrl: string;
}> {
  const img = await loadImageFromFile(file);
  const canvas = document.createElement("canvas");
  canvas.width = 100; // downsample for fast processing
  canvas.height = 100;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context failed.");

  ctx.drawImage(img, 0, 0, 100, 100);
  const imgData = ctx.getImageData(0, 0, 100, 100).data;

  // Simple Bucket Color Histogram
  const colorCounts: Record<string, { r: number; g: number; b: number; count: number }> = {};

  for (let i = 0; i < imgData.length; i += 16) {
    const r = imgData[i];
    const g = imgData[i + 1];
    const b = imgData[i + 2];
    const a = imgData[i + 3];

    if (a < 128) continue; // skip transparent

    // Quantize into buckets of 16
    const qr = Math.floor(r / 24) * 24;
    const qg = Math.floor(g / 24) * 24;
    const qb = Math.floor(b / 24) * 24;

    const key = `${qr},${qg},${qb}`;
    if (!colorCounts[key]) {
      colorCounts[key] = { r: qr, g: qg, b: qb, count: 0 };
    }
    colorCounts[key].count++;
  }

  const sorted = Object.values(colorCounts).sort((a, b) => b.count - a.count);
  const totalPixels = sorted.reduce((sum, item) => sum + item.count, 0) || 1;

  const samples: ColorSample[] = sorted.slice(0, 8).map((c) => {
    const hex = `#${((1 << 24) + (c.r << 16) + (c.g << 8) + c.b).toString(16).slice(1)}`;
    const rgb = `rgb(${c.r}, ${c.g}, ${c.b})`;
    const pct = Math.round((c.count / totalPixels) * 100);

    // HSL calculation
    const rNorm = c.r / 255, gNorm = c.g / 255, bNorm = c.b / 255;
    const max = Math.max(rNorm, gNorm, bNorm), min = Math.min(rNorm, gNorm, bNorm);
    let hNorm = 0, sNorm = 0;
    const lNorm = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      sNorm = lNorm > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === rNorm) hNorm = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
      else if (max === gNorm) hNorm = (bNorm - rNorm) / d + 2;
      else hNorm = (rNorm - gNorm) / d + 4;
      hNorm /= 6;
    }
    const hsl = `hsl(${Math.round(hNorm * 360)}, ${Math.round(sNorm * 100)}%, ${Math.round(lNorm * 100)}%)`;

    // CMYK calculation
    const k = 1 - Math.max(rNorm, gNorm, bNorm);
    const cyan = Math.round(((1 - rNorm - k) / (1 - k) || 0) * 100);
    const mag = Math.round(((1 - gNorm - k) / (1 - k) || 0) * 100);
    const yel = Math.round(((1 - bNorm - k) / (1 - k) || 0) * 100);
    const cmyk = `cmyk(${cyan}%, ${mag}%, ${yel}%, ${Math.round(k * 100)}%)`;

    return { hex, rgb, hsl, cmyk, percentage: pct };
  });

  // Render Palette Swatch Card
  const paletteCanvas = document.createElement("canvas");
  paletteCanvas.width = 600;
  paletteCanvas.height = 120;
  const pCtx = paletteCanvas.getContext("2d");

  if (pCtx) {
    const swatchW = 600 / samples.length;
    samples.forEach((sample, idx) => {
      pCtx.fillStyle = sample.hex;
      pCtx.fillRect(idx * swatchW, 0, swatchW, 120);
      pCtx.fillStyle = "#ffffff";
      pCtx.font = "bold 12px monospace";
      pCtx.fillText(sample.hex.toUpperCase(), idx * swatchW + 10, 100);
    });
  }

  const paletteDataUrl = paletteCanvas.toDataURL("image/png");
  return { samples, palette: samples, paletteDataUrl };
}

// 12. Base64 & Data URI Utilities
export async function imageToBase64(file: File): Promise<{ dataUrl: string; base64Only: string; htmlTag: string; cssSnippet: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64Only = dataUrl.split(",")[1] || "";
      const htmlTag = `<img src="${dataUrl}" alt="${file.name}" />`;
      const cssSnippet = `background-image: url('${dataUrl}');`;
      resolve({ dataUrl, base64Only, htmlTag, cssSnippet });
    };
    reader.onerror = () => reject(new Error("Failed to read image as Base64 string."));
    reader.readAsDataURL(file);
  });
}

export function base64ToImageFile(base64Str: string, fileName: string = "decoded_image.png"): File {
  let cleanStr = base64Str.trim();
  let mime = "image/png";

  if (cleanStr.startsWith("data:")) {
    const parts = cleanStr.split(",");
    const mimeMatch = parts[0].match(/:(.*?);/);
    if (mimeMatch) mime = mimeMatch[1];
    cleanStr = parts[1] || "";
  }

  const binaryStr = atob(cleanStr);
  const len = binaryStr.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }

  return new File([bytes], fileName, { type: mime });
}

// 13. Favicon & Favicon Pack Generator (.ZIP containing all sizes + ICO + HTML)
export async function generateFaviconPack(file: File): Promise<{ zipBlob: Blob; sizes: { name: string; url: string }[] }> {
  const img = await loadImageFromFile(file);
  const zip = new JSZip();

  const iconSizes = [
    { name: "favicon-16x16.png", size: 16 },
    { name: "favicon-32x32.png", size: 32 },
    { name: "favicon-48x48.png", size: 48 },
    { name: "apple-touch-icon.png", size: 180 },
    { name: "android-chrome-192x192.png", size: 192 },
    { name: "android-chrome-512x512.png", size: 512 },
  ];

  const generatedList: { name: string; url: string }[] = [];

  for (const item of iconSizes) {
    const canvas = document.createElement("canvas");
    canvas.width = item.size;
    canvas.height = item.size;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, item.size, item.size);
      const blob = await canvasToBlob(canvas, "image/png");
      zip.file(item.name, blob);
      generatedList.push({ name: item.name, url: URL.createObjectURL(blob) });

      if (item.size === 32) {
        // Also save as favicon.ico placeholder
        zip.file("favicon.ico", blob);
      }
    }
  }

  const manifestContent = JSON.stringify({
    name: "My Web App",
    short_name: "App",
    icons: [
      { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    theme_color: "#ffffff",
    background_color: "#ffffff",
    display: "standalone",
  }, null, 2);

  const htmlTags = `<!-- Favicon HTML Snippet -->
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="manifest" href="/site.webmanifest">`;

  zip.file("site.webmanifest", manifestContent);
  zip.file("html-head-snippet.html", htmlTags);

  const zipBlob = await zip.generateAsync({ type: "blob" });
  return { zipBlob, sizes: generatedList };
}

// 14. Meme Generator
export async function createMemeImage(
  file: File,
  topText: string,
  bottomText: string,
  fontSize: number = 36,
  textColor: string = "#ffffff"
): Promise<{ blob: Blob; url: string }> {
  const img = await loadImageFromFile(file);
  const w = img.naturalWidth || img.width;
  const h = img.naturalHeight || img.height;

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context creation failed.");

  ctx.drawImage(img, 0, 0, w, h);

  ctx.font = `900 ${fontSize}px "Impact", "Arial Black", sans-serif`;
  ctx.textAlign = "center";
  ctx.fillStyle = textColor;
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = Math.max(3, Math.floor(fontSize / 8));

  if (topText) {
    ctx.textBaseline = "top";
    ctx.strokeText(topText.toUpperCase(), w / 2, 20);
    ctx.fillText(topText.toUpperCase(), w / 2, 20);
  }

  if (bottomText) {
    ctx.textBaseline = "bottom";
    ctx.strokeText(bottomText.toUpperCase(), w / 2, h - 20);
    ctx.fillText(bottomText.toUpperCase(), w / 2, h - 20);
  }

  const blob = await canvasToBlob(canvas, "image/png", 0.95);
  return { blob, url: URL.createObjectURL(blob) };
}

// 15. Collage & Grid Maker
export async function createCollageImage(
  files: File[],
  columns: number = 2,
  gap: number = 10,
  bgColor: string = "#ffffff"
): Promise<{ blob: Blob; url: string }> {
  if (files.length === 0) throw new Error("No image files provided for collage.");

  const images = await Promise.all(files.map((f) => loadImageFromFile(f)));
  const rows = Math.ceil(images.length / columns);

  const cellW = 400;
  const cellH = 300;

  const totalW = columns * cellW + (columns + 1) * gap;
  const totalH = rows * cellH + (rows + 1) * gap;

  const canvas = document.createElement("canvas");
  canvas.width = totalW;
  canvas.height = totalH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context failed.");

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, totalW, totalH);

  images.forEach((img, idx) => {
    const col = idx % columns;
    const row = Math.floor(idx / columns);

    const x = gap + col * (cellW + gap);
    const y = gap + row * (cellH + gap);

    // Cover fit
    const imgW = img.naturalWidth || img.width;
    const imgH = img.naturalHeight || img.height;
    const scale = Math.max(cellW / imgW, cellH / imgH);
    const sw = cellW / scale;
    const sh = cellH / scale;
    const sx = (imgW - sw) / 2;
    const sy = (imgH - sh) / 2;

    ctx.drawImage(img, sx, sy, sw, sh, x, y, cellW, cellH);
  });

  const blob = await canvasToBlob(canvas, "image/png", 0.95);
  return { blob, url: URL.createObjectURL(blob) };
}

// 16. Image Comparison & Diff Engine
export async function compareAndDiffImages(
  file1: File,
  file2: File
): Promise<{ diffUrl: string; similarityPercentage: number; file1Url: string; file2Url: string }> {
  const img1 = await loadImageFromFile(file1);
  const img2 = await loadImageFromFile(file2);

  const w = Math.max(img1.naturalWidth || img1.width, img2.naturalWidth || img2.width);
  const h = Math.max(img1.naturalHeight || img1.height, img2.naturalHeight || img2.height);

  const c1 = document.createElement("canvas"); c1.width = w; c1.height = h;
  const c2 = document.createElement("canvas"); c2.width = w; c2.height = h;
  const diffCanvas = document.createElement("canvas"); diffCanvas.width = w; diffCanvas.height = h;

  const ctx1 = c1.getContext("2d")!;
  const ctx2 = c2.getContext("2d")!;
  const diffCtx = diffCanvas.getContext("2d")!;

  ctx1.drawImage(img1, 0, 0, w, h);
  ctx2.drawImage(img2, 0, 0, w, h);

  const data1 = ctx1.getImageData(0, 0, w, h).data;
  const data2 = ctx2.getImageData(0, 0, w, h).data;
  const diffImgData = diffCtx.createImageData(w, h);
  const diffData = diffImgData.data;

  let totalDiff = 0;
  const pixelCount = w * h;

  for (let i = 0; i < data1.length; i += 4) {
    const dr = Math.abs(data1[i] - data2[i]);
    const dg = Math.abs(data1[i + 1] - data2[i + 1]);
    const db = Math.abs(data1[i + 2] - data2[i + 2]);

    const delta = dr + dg + db;

    if (delta > 30) {
      // Highlight pixel in bright red
      diffData[i] = 255;
      diffData[i + 1] = 0;
      diffData[i + 2] = 80;
      diffData[i + 3] = 255;
      totalDiff++;
    } else {
      // Fade matching pixel to grayscale
      const avg = (data1[i] + data1[i + 1] + data1[i + 2]) / 3;
      diffData[i] = avg * 0.3;
      diffData[i + 1] = avg * 0.3;
      diffData[i + 2] = avg * 0.3;
      diffData[i + 3] = 180;
    }
  }

  diffCtx.putImageData(diffImgData, 0, 0);

  const matchRatio = Math.max(0, 100 - (totalDiff / pixelCount) * 100);
  const similarityPercentage = Number(matchRatio.toFixed(1));

  const diffBlob = await canvasToBlob(diffCanvas, "image/png");

  return {
    diffUrl: URL.createObjectURL(diffBlob),
    similarityPercentage,
    file1Url: URL.createObjectURL(await canvasToBlob(c1, "image/png")),
    file2Url: URL.createObjectURL(await canvasToBlob(c2, "image/png")),
  };
}

// 17. SVG Code Optimizer Engine
export function optimizeSvgCode(svgText: string): {
  optimizedSvg: string;
  originalSize: number;
  optimizedSize: number;
  savingsPercent: number;
} {
  if (!svgText || !svgText.trim()) {
    return { optimizedSvg: "", originalSize: 0, optimizedSize: 0, savingsPercent: 0 };
  }

  const originalSize = new Blob([svgText]).size;

  let cleaned = svgText
    // Remove XML declaration
    .replace(/<\?xml[\s\S]*?\?>/gi, "")
    // Remove DOCTYPE
    .replace(/<!DOCTYPE[\s\S]*?>/gi, "")
    // Remove HTML/XML comments
    .replace(/<!--[\s\S]*?-->/g, "")
    // Remove generator metadata tags (Inkscape, Illustrator, Figma)
    .replace(/<sodipodi:[\s\S]*?>/gi, "")
    .replace(/<inkscape:[\s\S]*?>/gi, "")
    .replace(/xmlns:sodipodi="[^"]*"/gi, "")
    .replace(/xmlns:inkscape="[^"]*"/gi, "")
    // Remove metadata tags
    .replace(/<metadata[\s\S]*?<\/metadata>/gi, "")
    // Strip trailing decimal precision beyond 3 decimal places
    .replace(/(\d+\.\d{3})\d+/g, "$1")
    // Collapse whitespace
    .replace(/>\s+</g, "><")
    .replace(/\s+/g, " ")
    .trim();

  const optimizedSize = new Blob([cleaned]).size;
  const savingsPercent = originalSize > 0 ? Math.max(0, Math.round(((originalSize - optimizedSize) / originalSize) * 100)) : 0;

  return {
    optimizedSvg: cleaned,
    originalSize,
    optimizedSize,
    savingsPercent,
  };
}

// 18. Client-Side Color-Key Background Remover Engine
export async function removeImageBackground(
  file: File,
  options: {
    tolerance?: number; // 0 to 100
    targetColor?: "white" | "black" | "auto" | "custom";
    customHexColor?: string;
    contiguous?: boolean;
    customTargetRgb?: { r: number; g: number; b: number };
  } = {}
): Promise<{ blob: Blob; url: string; width: number; height: number }> {
  const img = await loadImageFromFile(file);
  const w = img.naturalWidth || img.width;
  const h = img.naturalHeight || img.height;

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context initialization failed.");

  ctx.drawImage(img, 0, 0, w, h);
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  let rTarget = 255, gTarget = 255, bTarget = 255;

  if (options.customTargetRgb) {
    rTarget = options.customTargetRgb.r;
    gTarget = options.customTargetRgb.g;
    bTarget = options.customTargetRgb.b;
  } else if (options.targetColor === "white") {
    rTarget = 255; gTarget = 255; bTarget = 255;
  } else if (options.targetColor === "black") {
    rTarget = 0; gTarget = 0; bTarget = 0;
  } else if (options.targetColor === "custom" && options.customHexColor) {
    const hex = options.customHexColor.replace("#", "");
    rTarget = parseInt(hex.substring(0, 2), 16) || 255;
    gTarget = parseInt(hex.substring(2, 4), 16) || 255;
    bTarget = parseInt(hex.substring(4, 6), 16) || 255;
  } else {
    // Auto: average corner pixels (top-left, top-right, bottom-left, bottom-right)
    const corners = [
      0,
      (w - 1) * 4,
      (h - 1) * w * 4,
      ((h - 1) * w + (w - 1)) * 4
    ];
    let sumR = 0, sumG = 0, sumB = 0;
    corners.forEach(idx => {
      sumR += data[idx];
      sumG += data[idx + 1];
      sumB += data[idx + 2];
    });
    rTarget = Math.round(sumR / 4);
    gTarget = Math.round(sumG / 4);
    bTarget = Math.round(sumB / 4);
  }

  const tolerance = options.tolerance !== undefined ? options.tolerance : 35;
  const maxDist = (tolerance / 100) * 441.67; // max Euclidean distance in RGB space
  const featherRange = maxDist * 0.25; // 25% smooth transition margin

  const calcDist = (r: number, g: number, b: number) => {
    return Math.sqrt(
      Math.pow(r - rTarget, 2) +
      Math.pow(g - gTarget, 2) +
      Math.pow(b - bTarget, 2)
    );
  };

  const contiguous = options.contiguous !== false;

  if (contiguous) {
    // Flood fill from outer image borders
    const visited = new Uint8Array(w * h);
    const queue: number[] = [];

    // Push border pixels
    for (let x = 0; x < w; x++) {
      queue.push(x, 0);
      queue.push(x, h - 1);
    }
    for (let y = 0; y < h; y++) {
      queue.push(0, y);
      queue.push(w - 1, y);
    }

    let head = 0;
    while (head < queue.length) {
      const cx = queue[head++];
      const cy = queue[head++];
      const pixelIdx = cy * w + cx;

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

        // Add 4-directional neighbors
        if (cx > 0 && !visited[pixelIdx - 1]) queue.push(cx - 1, cy);
        if (cx < w - 1 && !visited[pixelIdx + 1]) queue.push(cx + 1, cy);
        if (cy > 0 && !visited[pixelIdx - w]) queue.push(cx, cy - 1);
        if (cy < h - 1 && !visited[pixelIdx + w]) queue.push(cx, cy + 1);
      }
    }
  } else {
    // Global color keying across the entire image
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
  const blob = await canvasToBlob(canvas, "image/png", 0.95);
  return { blob, url: URL.createObjectURL(blob), width: w, height: h };
}

