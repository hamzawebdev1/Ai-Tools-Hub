import * as pdfjs from "pdfjs-dist";
import { PDFDocument, degrees, rgb, StandardFonts } from "pdf-lib";
import JSZip from "jszip";
import Tesseract from "tesseract.js";

// Set PDF.js worker source URL
if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
}

// Color Converter Helper for pdf-lib
function hexToPdfRgb(hex: string) {
  const clean = hex.replace("#", "");
  const num = parseInt(clean || "000000", 16);
  return rgb(((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255);
}

// Parse page range strings like "1, 3-5, 8" into 0-indexed page array
export function parsePageRange(rangeStr: string, maxPages: number): number[] {
  if (!rangeStr || rangeStr.trim() === "") {
    return Array.from({ length: maxPages }, (_, i) => i);
  }
  const pages = new Set<number>();
  const parts = rangeStr.split(",").map((s) => s.trim());
  for (const part of parts) {
    if (part.includes("-")) {
      const [startStr, endStr] = part.split("-");
      const start = Math.max(1, parseInt(startStr, 10) || 1);
      const end = Math.min(maxPages, parseInt(endStr, 10) || maxPages);
      for (let i = start; i <= end; i++) {
        pages.add(i - 1);
      }
    } else {
      const p = parseInt(part, 10);
      if (!isNaN(p) && p >= 1 && p <= maxPages) {
        pages.add(p - 1);
      }
    }
  }
  return Array.from(pages).sort((a, b) => a - b);
}

// Standard Paper Sizes in Points (1 pt = 1/72 inch)
export const PAPER_SIZES: Record<string, { width: number; height: number; name: string }> = {
  A4: { width: 595.28, height: 841.89, name: "A4 (210 x 297 mm)" },
  LETTER: { width: 612.0, height: 792.0, name: "Letter (8.5 x 11 in)" },
  LEGAL: { width: 612.0, height: 1008.0, name: "Legal (8.5 x 14 in)" },
  EXECUTIVE: { width: 522.0, height: 756.0, name: "Executive (7.25 x 10.5 in)" },
  A3: { width: 841.89, height: 1190.55, name: "A3 (297 x 420 mm)" },
  A5: { width: 419.53, height: 595.28, name: "A5 (148 x 210 mm)" },
};

export function identifyPaperSize(width: number, height: number): string {
  const w = Math.min(width, height);
  const h = Math.max(width, height);

  for (const [key, size] of Object.entries(PAPER_SIZES)) {
    if (Math.abs(w - size.width) < 15 && Math.abs(h - size.height) < 15) {
      return key;
    }
  }
  const wMm = (w * 0.352778).toFixed(0);
  const hMm = (h * 0.352778).toFixed(0);
  return `Custom (${wMm} x ${hMm} mm)`;
}

// ==========================================
// 1. MERGE PDF
// ==========================================
export async function mergePdfs(files: File[]): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();
  for (const file of files) {
    const buffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }
  return await mergedPdf.save();
}

// ==========================================
// 2. SPLIT PDF
// ==========================================
export async function splitPdf(
  file: File,
  splitType: "range" | "single",
  rangeStr?: string
): Promise<{ blob: Blob; fileName: string }> {
  const buffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const totalPages = pdf.getPageCount();

  if (splitType === "range" && rangeStr) {
    const indices = parsePageRange(rangeStr, totalPages);
    if (indices.length === 0) throw new Error("No valid pages selected in range.");

    const newPdf = await PDFDocument.create();
    const pages = await newPdf.copyPages(pdf, indices);
    pages.forEach((p) => newPdf.addPage(p));
    const bytes = await newPdf.save();
    return {
      blob: new Blob([bytes], { type: "application/pdf" }),
      fileName: `split_${file.name}`,
    };
  } else {
    // Single page split -> ZIP bundle
    const zip = new JSZip();
    for (let i = 0; i < totalPages; i++) {
      const singlePdf = await PDFDocument.create();
      const [copiedPage] = await singlePdf.copyPages(pdf, [i]);
      singlePdf.addPage(copiedPage);
      const bytes = await singlePdf.save();
      zip.file(`page_${i + 1}.pdf`, bytes);
    }
    const zipBlob = await zip.generateAsync({ type: "blob" });
    return {
      blob: zipBlob,
      fileName: `split_pages_${file.name.replace(".pdf", "")}.zip`,
    };
  }
}

// ==========================================
// 3. EXTRACT PDF PAGES
// ==========================================
export async function extractPdfPages(file: File, pagesStr: string): Promise<Uint8Array> {
  const buffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const indices = parsePageRange(pagesStr, pdf.getPageCount());
  if (indices.length === 0) throw new Error("Invalid page selection string provided.");

  const newPdf = await PDFDocument.create();
  const pages = await newPdf.copyPages(pdf, indices);
  pages.forEach((p) => newPdf.addPage(p));
  return await newPdf.save();
}

// ==========================================
// 4. DELETE PDF PAGES
// ==========================================
export async function deletePdfPages(file: File, pagesToDeleteStr: string): Promise<Uint8Array> {
  const buffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const total = pdf.getPageCount();
  const toDelete = new Set(parsePageRange(pagesToDeleteStr, total));

  const keepIndices = Array.from({ length: total }, (_, i) => i).filter((i) => !toDelete.has(i));
  if (keepIndices.length === 0) throw new Error("Cannot delete all pages from document.");

  const newPdf = await PDFDocument.create();
  const pages = await newPdf.copyPages(pdf, keepIndices);
  pages.forEach((p) => newPdf.addPage(p));
  return await newPdf.save();
}

// ==========================================
// 5. REORDER PDF PAGES
// ==========================================
export async function reorderPdfPages(file: File, pageSequenceStr: string): Promise<Uint8Array> {
  const buffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const indices = parsePageRange(pageSequenceStr, pdf.getPageCount());
  if (indices.length === 0) throw new Error("Invalid reorder page order string.");

  const newPdf = await PDFDocument.create();
  const pages = await newPdf.copyPages(pdf, indices);
  pages.forEach((p) => newPdf.addPage(p));
  return await newPdf.save();
}

// ==========================================
// 6. ROTATE PDF PAGES
// ==========================================
export async function rotatePdf(
  file: File,
  angleDegrees: number,
  pageTarget: "all" | "odd" | "even" | string = "all"
): Promise<Uint8Array> {
  const buffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const total = pdf.getPageCount();

  let targetIndices: number[] = [];
  if (pageTarget === "all") {
    targetIndices = Array.from({ length: total }, (_, i) => i);
  } else if (pageTarget === "odd") {
    targetIndices = Array.from({ length: total }, (_, i) => i).filter((i) => i % 2 === 0);
  } else if (pageTarget === "even") {
    targetIndices = Array.from({ length: total }, (_, i) => i).filter((i) => i % 2 === 1);
  } else {
    targetIndices = parsePageRange(pageTarget, total);
  }

  const pages = pdf.getPages();
  targetIndices.forEach((idx) => {
    if (pages[idx]) {
      const current = pages[idx].getRotation().angle;
      pages[idx].setRotation(degrees((current + angleDegrees) % 360));
    }
  });

  return await pdf.save();
}

// ==========================================
// 7. COMPRESS PDF
// ==========================================
export async function compressPdf(file: File): Promise<Uint8Array> {
  const buffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });

  // Clear unnecessary metadata and save with object stream compression
  pdf.setTitle("");
  pdf.setAuthor("");
  pdf.setSubject("");
  pdf.setProducer("AI Tools Hub PDF Optimizer");

  return await pdf.save({ useObjectStreams: true });
}

// ==========================================
// 8. PROTECT PDF
// ==========================================
export async function protectPdf(file: File, userPass: string, ownerPass?: string): Promise<Uint8Array> {
  if (!userPass) throw new Error("Encryption password is required.");
  const buffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });

  return await pdf.save({
    userPassword: userPass,
    ownerPassword: ownerPass || userPass,
  } as any);
}

// ==========================================
// 9. UNLOCK PDF
// ==========================================
export async function unlockPdf(file: File, password?: string): Promise<Uint8Array> {
  const buffer = await file.arrayBuffer();
  let pdf: PDFDocument;
  try {
    pdf = await PDFDocument.load(buffer, { password, ignoreEncryption: true } as any);
  } catch (err) {
    throw new Error("Failed to unlock PDF. Please verify password.");
  }
  return await pdf.save();
}

// ==========================================
// 10. WATERMARK PDF (GENERAL & TEXT)
// ==========================================
export async function addTextWatermarkToPdf(
  file: File,
  text: string,
  options: {
    fontSize?: number;
    colorHex?: string;
    opacity?: number;
    rotation?: number;
    position?: "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
  } = {}
): Promise<Uint8Array> {
  const buffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const font = await pdf.embedFont(StandardFonts.HelveticaBold);

  const fontSize = options.fontSize || 48;
  const opacity = options.opacity !== undefined ? options.opacity : 0.3;
  const rotation = options.rotation !== undefined ? options.rotation : 45;
  const textColor = hexToPdfRgb(options.colorHex || "#6366f1");
  const pos = options.position || "center";

  const pages = pdf.getPages();
  for (const page of pages) {
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    const textHeight = font.heightAtSize(fontSize);

    let x = (width - textWidth) / 2;
    let y = (height - textHeight) / 2;

    if (pos === "top-left") {
      x = 50;
      y = height - 100;
    } else if (pos === "top-right") {
      x = width - textWidth - 50;
      y = height - 100;
    } else if (pos === "bottom-left") {
      x = 50;
      y = 50;
    } else if (pos === "bottom-right") {
      x = width - textWidth - 50;
      y = 50;
    }

    page.drawText(text, {
      x,
      y,
      size: fontSize,
      font,
      color: textColor,
      opacity,
      rotate: degrees(rotation),
    });
  }

  return await pdf.save();
}

// ==========================================
// 12. ADD IMAGE WATERMARK
// ==========================================
export async function addImageWatermarkToPdf(
  file: File,
  imageFile: File,
  options: { opacity?: number; scale?: number; position?: string } = {}
): Promise<Uint8Array> {
  const buffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });

  const imageBuffer = await imageFile.arrayBuffer();
  let embeddedImage;
  if (imageFile.type.includes("png")) {
    embeddedImage = await pdf.embedPng(imageBuffer);
  } else {
    embeddedImage = await pdf.embedJpg(imageBuffer);
  }

  const opacity = options.opacity !== undefined ? options.opacity : 0.4;
  const userScale = options.scale !== undefined ? options.scale : 0.5;

  const pages = pdf.getPages();
  for (const page of pages) {
    const { width, height } = page.getSize();
    const imgWidth = embeddedImage.width * userScale;
    const imgHeight = embeddedImage.height * userScale;

    const x = (width - imgWidth) / 2;
    const y = (height - imgHeight) / 2;

    page.drawImage(embeddedImage, {
      x,
      y,
      width: imgWidth,
      height: imgHeight,
      opacity,
    });
  }

  return await pdf.save();
}

// ==========================================
// 13. ADD PAGE NUMBERS
// ==========================================
export async function addPageNumbersToPdf(
  file: File,
  options: {
    format?: "page_of_total" | "page_only";
    position?: "bottom-right" | "bottom-center" | "top-right";
    fontSize?: number;
    startFrom?: number;
  } = {}
): Promise<Uint8Array> {
  const buffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const font = await pdf.embedFont(StandardFonts.Helvetica);

  const format = options.format || "page_of_total";
  const pos = options.position || "bottom-right";
  const fontSize = options.fontSize || 10;
  const startFrom = options.startFrom || 1;

  const pages = pdf.getPages();
  const total = pages.length;

  for (let i = 0; i < total; i++) {
    const page = pages[i];
    const { width, height } = page.getSize();
    const num = i + startFrom;
    const numText = format === "page_of_total" ? `Page ${num} of ${total}` : `${num}`;

    const textWidth = font.widthOfTextAtSize(numText, fontSize);
    let x = width - textWidth - 30;
    let y = 25;

    if (pos === "bottom-center") {
      x = (width - textWidth) / 2;
      y = 25;
    } else if (pos === "top-right") {
      x = width - textWidth - 30;
      y = height - 30;
    }

    page.drawText(numText, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(0.3, 0.3, 0.3),
    });
  }

  return await pdf.save();
}

// ==========================================
// 14 & 15. ADD HEADER / FOOTER
// ==========================================
export async function addHeaderFooterToPdf(
  file: File,
  headerText?: string,
  footerText?: string,
  alignment: "left" | "center" | "right" = "center",
  fontSize = 10
): Promise<Uint8Array> {
  const buffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const font = await pdf.embedFont(StandardFonts.Helvetica);

  const pages = pdf.getPages();
  for (const page of pages) {
    const { width, height } = page.getSize();

    if (headerText) {
      const textWidth = font.widthOfTextAtSize(headerText, fontSize);
      let x = (width - textWidth) / 2;
      if (alignment === "left") x = 30;
      if (alignment === "right") x = width - textWidth - 30;

      page.drawText(headerText, {
        x,
        y: height - 25,
        size: fontSize,
        font,
        color: rgb(0.2, 0.2, 0.2),
      });
    }

    if (footerText) {
      const textWidth = font.widthOfTextAtSize(footerText, fontSize);
      let x = (width - textWidth) / 2;
      if (alignment === "left") x = 30;
      if (alignment === "right") x = width - textWidth - 30;

      page.drawText(footerText, {
        x,
        y: 20,
        size: fontSize,
        font,
        color: rgb(0.2, 0.2, 0.2),
      });
    }
  }

  return await pdf.save();
}

// ==========================================
// 16 & 17. PDF TO JPG / PNG (RENDER TO IMAGES & ZIP)
// ==========================================
export async function pdfToImages(
  file: File,
  format: "jpg" | "png",
  scale = 2.0
): Promise<{ blob: Blob; fileName: string; images: string[] }> {
  const buffer = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({ data: buffer });
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;

  const images: string[] = [];
  const zip = new JSZip();

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) continue;

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;

    const mime = format === "jpg" ? "image/jpeg" : "image/png";
    const dataUrl = canvas.toDataURL(mime, 0.92);
    images.push(dataUrl);

    const base64Data = dataUrl.split(",")[1];
    zip.file(`page_${i}.${format}`, base64Data, { base64: true });
  }

  if (numPages === 1) {
    const response = await fetch(images[0]);
    const blob = await response.blob();
    return { blob, fileName: `page_1.${format}`, images };
  } else {
    const zipBlob = await zip.generateAsync({ type: "blob" });
    return {
      blob: zipBlob,
      fileName: `${file.name.replace(".pdf", "")}_images.zip`,
      images,
    };
  }
}

// ==========================================
// 18, 19, 20. IMAGES TO PDF (JPG/PNG/WEBP)
// ==========================================
export async function imagesToPdf(files: File[]): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();

  for (const file of files) {
    let imageBytes = await file.arrayBuffer();
    let embeddedImg;

    if (file.type.includes("png")) {
      embeddedImg = await pdf.embedPng(imageBytes);
    } else if (file.type.includes("jpeg") || file.type.includes("jpg")) {
      embeddedImg = await pdf.embedJpg(imageBytes);
    } else {
      // Convert WEBP/BMP/other images using an HTML5 Canvas to JPG
      const imgUrl = URL.createObjectURL(file);
      const img = new Image();
      img.src = imgUrl;
      await new Promise((resolve) => (img.onload = resolve));

      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);

      const jpegDataUrl = canvas.toDataURL("image/jpeg", 0.95);
      URL.revokeObjectURL(imgUrl);

      const base64 = jpegDataUrl.split(",")[1];
      const binary = atob(base64);
      const u8 = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) u8[i] = binary.charCodeAt(i);

      embeddedImg = await pdf.embedJpg(u8.buffer);
    }

    const page = pdf.addPage([embeddedImg.width, embeddedImg.height]);
    page.drawImage(embeddedImg, { x: 0, y: 0, width: embeddedImg.width, height: embeddedImg.height });
  }

  return await pdf.save();
}

// ==========================================
// 21. PDF PAGE & WORD COUNTER METRICS
// ==========================================
export interface PdfMetrics {
  pageCount: number;
  wordCount: number;
  charCount: number;
  readingTimeMinutes: number;
  fileSizeBytes: number;
}

export async function getPdfMetrics(file: File): Promise<PdfMetrics> {
  const buffer = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({ data: buffer });
  const pdf = await loadingTask.promise;

  let totalText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item: any) => item.str).join(" ");
    totalText += pageText + " ";
  }

  const words = totalText.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const charCount = totalText.length;
  const readingTimeMinutes = Math.ceil(wordCount / 200);

  return {
    pageCount: pdf.numPages,
    wordCount,
    charCount,
    readingTimeMinutes,
    fileSizeBytes: file.size,
  };
}

// ==========================================
// 22, 23, 24. METADATA VIEWER, EDITOR, REMOVER
// ==========================================
export interface PdfMetadata {
  title: string;
  author: string;
  subject: string;
  keywords: string;
  creator: string;
  producer: string;
  creationDate?: string;
  modificationDate?: string;
  pageCount: number;
}

export async function getPdfMetadataInfo(file: File): Promise<PdfMetadata> {
  const buffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });

  return {
    title: pdf.getTitle() || "Untitled",
    author: pdf.getAuthor() || "Unknown",
    subject: pdf.getSubject() || "None",
    keywords: pdf.getKeywords() || "None",
    creator: pdf.getCreator() || "Unknown",
    producer: pdf.getProducer() || "Unknown",
    creationDate: pdf.getCreationDate()?.toLocaleString() || "N/A",
    modificationDate: pdf.getModificationDate()?.toLocaleString() || "N/A",
    pageCount: pdf.getPageCount(),
  };
}

export async function editPdfMetadataInfo(
  file: File,
  meta: { title?: string; author?: string; subject?: string; keywords?: string }
): Promise<Uint8Array> {
  const buffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });

  if (meta.title !== undefined) pdf.setTitle(meta.title);
  if (meta.author !== undefined) pdf.setAuthor(meta.author);
  if (meta.subject !== undefined) pdf.setSubject(meta.subject);
  if (meta.keywords !== undefined) pdf.setKeywords([meta.keywords]);

  return await pdf.save();
}

export async function removePdfMetadataInfo(file: File): Promise<Uint8Array> {
  const buffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });

  pdf.setTitle("");
  pdf.setAuthor("");
  pdf.setSubject("");
  pdf.setKeywords([]);
  pdf.setProducer("AI Tools Hub Sanitizer");
  pdf.setCreator("");

  return await pdf.save();
}

// ==========================================
// 25. EXTRACT IMAGES FROM PDF
// ==========================================
export async function extractImagesFromPdf(file: File): Promise<{ blob: Blob; fileName: string; imageCount: number }> {
  const buffer = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({ data: buffer });
  const pdf = await loadingTask.promise;

  const zip = new JSZip();
  let imgIndex = 0;

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 1.5 });

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) continue;

    await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;

    const dataUrl = canvas.toDataURL("image/png");
    const base64 = dataUrl.split(",")[1];
    imgIndex++;
    zip.file(`extracted_page_image_${imgIndex}.png`, base64, { base64: true });
  }

  const zipBlob = await zip.generateAsync({ type: "blob" });
  return {
    blob: zipBlob,
    fileName: `extracted_images_${file.name.replace(".pdf", "")}.zip`,
    imageCount: imgIndex,
  };
}

// ==========================================
// 26. EXTRACT TEXT FROM PDF
// ==========================================
export async function extractTextFromPdf(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({ data: buffer });
  const pdf = await loadingTask.promise;

  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item: any) => item.str).join(" ");
    fullText += `--- PAGE ${i} ---\n${pageText}\n\n`;
  }

  return fullText.trim();
}

// ==========================================
// 27 & 28. PREVIEW & THUMBNAILS GENERATOR
// ==========================================
export async function generatePdfThumbnails(
  file: File,
  scale = 0.3
): Promise<Array<{ pageNumber: number; dataUrl: string }>> {
  const buffer = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({ data: buffer });
  const pdf = await loadingTask.promise;

  const thumbnails: Array<{ pageNumber: number; dataUrl: string }> = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) continue;

    await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;
    thumbnails.push({ pageNumber: i, dataUrl: canvas.toDataURL("image/jpeg", 0.8) });
  }

  return thumbnails;
}

// ==========================================
// 29 & 30. PAGE SIZE & ORIENTATION DETECTORS
// ==========================================
export interface PageLayoutInfo {
  pageNumber: number;
  widthPt: number;
  heightPt: number;
  widthMm: number;
  heightMm: number;
  widthInches: number;
  heightInches: number;
  standardName: string;
  orientation: "Portrait" | "Landscape";
}

export async function detectPdfPageLayouts(file: File): Promise<PageLayoutInfo[]> {
  const buffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });

  return pdf.getPages().map((page, idx) => {
    const { width, height } = page.getSize();
    const widthMm = Number((width * 0.352778).toFixed(1));
    const heightMm = Number((height * 0.352778).toFixed(1));
    const widthInches = Number((width / 72).toFixed(2));
    const heightInches = Number((height / 72).toFixed(2));

    const standardName = identifyPaperSize(width, height);
    const orientation = width > height ? "Landscape" : "Portrait";

    return {
      pageNumber: idx + 1,
      widthPt: Number(width.toFixed(1)),
      heightPt: Number(height.toFixed(1)),
      widthMm,
      heightMm,
      widthInches,
      heightInches,
      standardName,
      orientation,
    };
  });
}

// ==========================================
// 31. CROP PDF MARGINS
// ==========================================
export async function cropPdfMargins(
  file: File,
  crop: { top: number; right: number; bottom: number; left: number }
): Promise<Uint8Array> {
  const buffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });

  const pages = pdf.getPages();
  for (const page of pages) {
    const { width, height } = page.getSize();
    page.setCropBox(crop.left, crop.bottom, width - crop.right - crop.left, height - crop.top - crop.bottom);
  }

  return await pdf.save();
}

// ==========================================
// 32. RESIZE PDF PAGE SIZE
// ==========================================
export async function resizePdfPages(
  file: File,
  targetPaperKey: "A4" | "LETTER" | "LEGAL" | "A3" | "A5"
): Promise<Uint8Array> {
  const target = PAPER_SIZES[targetPaperKey] || PAPER_SIZES.A4;
  const buffer = await file.arrayBuffer();
  const srcPdf = await PDFDocument.load(buffer, { ignoreEncryption: true });

  const newPdf = await PDFDocument.create();
  const srcPages = srcPdf.getPages();

  for (let i = 0; i < srcPages.length; i++) {
    const srcPage = srcPages[i];
    const { width: srcW, height: srcH } = srcPage.getSize();

    const [embeddedPage] = await newPdf.embedPdf(srcPdf, [i]);
    const targetPage = newPdf.addPage([target.width, target.height]);

    const scaleX = target.width / srcW;
    const scaleY = target.height / srcH;
    const scale = Math.min(scaleX, scaleY);

    const drawWidth = srcW * scale;
    const drawHeight = srcH * scale;

    const x = (target.width - drawWidth) / 2;
    const y = (target.height - drawHeight) / 2;

    targetPage.drawPage(embeddedPage, {
      x,
      y,
      xScale: scale,
      yScale: scale,
    });
  }

  return await newPdf.save();
}

// ==========================================
// 33. VISUAL PDF PAGE ORGANIZER
// ==========================================
export async function organizePdfWithOperations(
  file: File,
  operations: Array<{ originalIndex: number; rotation: number }>
): Promise<Uint8Array> {
  const buffer = await file.arrayBuffer();
  const srcPdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const newPdf = await PDFDocument.create();

  for (const op of operations) {
    const [copiedPage] = await newPdf.copyPages(srcPdf, [op.originalIndex]);
    if (op.rotation) {
      const current = copiedPage.getRotation().angle;
      copiedPage.setRotation(degrees((current + op.rotation) % 360));
    }
    newPdf.addPage(copiedPage);
  }

  return await newPdf.save();
}

// ==========================================
// 34. PDF BOOKLET CREATOR
// ==========================================
export async function createPdfBooklet(file: File): Promise<Uint8Array> {
  const buffer = await file.arrayBuffer();
  const srcPdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const pageCount = srcPdf.getPageCount();

  // Pad to multiple of 4
  const targetCount = Math.ceil(pageCount / 4) * 4;
  const newPdf = await PDFDocument.create();

  const sheetWidth = PAPER_SIZES.A4.height; // Landscape A4 width
  const sheetHeight = PAPER_SIZES.A4.width; // Landscape A4 height
  const pageW = sheetWidth / 2;

  const embeddedPages = await newPdf.embedPdf(srcPdf, Array.from({ length: pageCount }, (_, i) => i));

  for (let i = 0; i < targetCount / 2; i++) {
    const isFront = i % 2 === 0;
    const leftIndex = isFront ? targetCount - 1 - i : i;
    const rightIndex = isFront ? i : targetCount - 1 - i;

    const sheet = newPdf.addPage([sheetWidth, sheetHeight]);

    if (leftIndex < pageCount && embeddedPages[leftIndex]) {
      const p = embeddedPages[leftIndex];
      const scale = Math.min(pageW / p.width, sheetHeight / p.height);
      sheet.drawPage(p, { x: 0, y: 0, xScale: scale, yScale: scale });
    }

    if (rightIndex < pageCount && embeddedPages[rightIndex]) {
      const p = embeddedPages[rightIndex];
      const scale = Math.min(pageW / p.width, sheetHeight / p.height);
      sheet.drawPage(p, { x: pageW, y: 0, xScale: scale, yScale: scale });
    }
  }

  return await newPdf.save();
}

// ==========================================
// 35. PDF CONTACT SHEET
// ==========================================
export async function generateContactSheet(
  file: File,
  grid: "2x2" | "3x3" | "4x4" = "3x3"
): Promise<Uint8Array> {
  const cols = grid === "2x2" ? 2 : grid === "3x3" ? 3 : 4;
  const rows = cols;
  const perSheet = cols * rows;

  const buffer = await file.arrayBuffer();
  const srcPdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const pageCount = srcPdf.getPageCount();

  const newPdf = await PDFDocument.create();
  const embedded = await newPdf.embedPdf(srcPdf, Array.from({ length: pageCount }, (_, i) => i));

  const sheetW = PAPER_SIZES.A4.width;
  const sheetH = PAPER_SIZES.A4.height;

  const margin = 20;
  const cellW = (sheetW - margin * (cols + 1)) / cols;
  const cellH = (sheetH - margin * (rows + 1)) / rows;

  for (let idx = 0; idx < pageCount; idx += perSheet) {
    const sheet = newPdf.addPage([sheetW, sheetH]);

    for (let c = 0; c < perSheet && idx + c < pageCount; c++) {
      const pageIdx = idx + c;
      const col = c % cols;
      const row = Math.floor(c / cols);

      const x = margin + col * (cellW + margin);
      const y = sheetH - margin - (row + 1) * cellH;

      const p = embedded[pageIdx];
      const scale = Math.min(cellW / p.width, cellH / p.height);

      sheet.drawPage(p, { x, y, xScale: scale, yScale: scale });
    }
  }

  return await newPdf.save();
}

// ==========================================
// 36. PRINT LAYOUT (N-UP)
// ==========================================
export async function generatePrintLayoutNUp(
  file: File,
  nUp: 2 | 4 | 9 = 2
): Promise<Uint8Array> {
  return await generateContactSheet(file, nUp === 2 ? "2x2" : nUp === 4 ? "2x2" : "3x3");
}

// ==========================================
// 37. PDF OCR TEXT EXTRACTOR
// ==========================================
export async function performPdfOcr(
  file: File,
  lang = "eng",
  onProgress?: (progressPercent: number, statusMessage: string) => void
): Promise<string> {
  const buffer = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({ data: buffer });
  const pdf = await loadingTask.promise;

  let fullOcrText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    if (onProgress) onProgress(Math.floor((i / pdf.numPages) * 90), `Performing OCR on page ${i} of ${pdf.numPages}...`);

    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2.0 });

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) continue;

    await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;

    const { data } = await Tesseract.recognize(canvas.toDataURL(), lang);
    fullOcrText += `--- OCR PAGE ${i} ---\n${data.text}\n\n`;
  }

  if (onProgress) onProgress(100, "OCR Extraction Complete!");
  return fullOcrText.trim();
}

// ==========================================
// 38. PDF GRAYSCALE CONVERTER
// ==========================================
export async function convertPdfToGrayscale(file: File): Promise<Uint8Array> {
  const buffer = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({ data: buffer });
  const pdf = await loadingTask.promise;

  const newPdf = await PDFDocument.create();

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2.0 });

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) continue;

    await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;

    // Convert pixel RGBA to grayscale
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imgData.data;
    for (let p = 0; p < pixels.length; p += 4) {
      const gray = 0.299 * pixels[p] + 0.587 * pixels[p + 1] + 0.114 * pixels[p + 2];
      pixels[p] = gray;
      pixels[p + 1] = gray;
      pixels[p + 2] = gray;
    }
    ctx.putImageData(imgData, 0, 0);

    const jpegDataUrl = canvas.toDataURL("image/jpeg", 0.9);
    const base64 = jpegDataUrl.split(",")[1];
    const binary = atob(base64);
    const u8 = new Uint8Array(binary.length);
    for (let k = 0; k < binary.length; k++) u8[k] = binary.charCodeAt(k);

    const embeddedGrayImg = await newPdf.embedJpg(u8.buffer);
    const newPage = newPdf.addPage([viewport.width / 2, viewport.height / 2]);
    newPage.drawImage(embeddedGrayImg, {
      x: 0,
      y: 0,
      width: viewport.width / 2,
      height: viewport.height / 2,
    });
  }

  return await newPdf.save();
}

// ==========================================
// 39. PDF TEXT SEARCH & INSPECTOR
// ==========================================
export interface SearchResultMatch {
  pageNumber: number;
  matchSnippet: string;
  matchIndex: number;
}

export async function searchPdfText(
  file: File,
  query: string
): Promise<{ matches: SearchResultMatch[]; totalMatches: number }> {
  if (!query || query.trim() === "") return { matches: [], totalMatches: 0 };

  const buffer = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({ data: buffer });
  const pdf = await loadingTask.promise;

  const matches: SearchResultMatch[] = [];
  const lowerQuery = query.toLowerCase();

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item: any) => item.str).join(" ");
    const lowerText = pageText.toLowerCase();

    let pos = 0;
    while ((pos = lowerText.indexOf(lowerQuery, pos)) !== -1) {
      const start = Math.max(0, pos - 30);
      const end = Math.min(pageText.length, pos + query.length + 30);
      const snippet = "..." + pageText.substring(start, end).replace(/\n/g, " ") + "...";

      matches.push({
        pageNumber: i,
        matchSnippet: snippet,
        matchIndex: pos,
      });

      pos += query.length;
    }
  }

  return { matches, totalMatches: matches.length };
}

// ==========================================
// 40. INDEPENDENT PAGE ROTATION MANAGER
// ==========================================
export async function applyIndependentPageRotations(
  file: File,
  rotationMap: Record<number, number>
): Promise<Uint8Array> {
  const buffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const pages = pdf.getPages();

  Object.entries(rotationMap).forEach(([pageStr, angle]) => {
    const pageNum = parseInt(pageStr, 10);
    const pageIdx = pageNum - 1;
    if (pages[pageIdx]) {
      const current = pages[pageIdx].getRotation().angle;
      pages[pageIdx].setRotation(degrees((current + angle) % 360));
    }
  });

  return await pdf.save();
}
