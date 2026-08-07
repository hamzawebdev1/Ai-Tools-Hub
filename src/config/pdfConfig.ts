export const PDF_CONFIG = {
  maxFileSizeMB: 50,
  maxFileSizeBytes: 50 * 1024 * 1024,
  maxFilesPerBatch: 20,
  maxPagesPerPdf: 500,
  tempRetentionMinutes: 60,
  allowedMimeTypes: [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/bmp",
  ],
};

export interface FileValidationResult {
  valid: boolean;
  error?: {
    code: string;
    message: string;
  };
}

export async function validatePdfFile(file: File): Promise<FileValidationResult> {
  if (!file) {
    return {
      valid: false,
      error: { code: "NO_FILE", message: "No file was provided." },
    };
  }

  // 1. File size check
  if (file.size > PDF_CONFIG.maxFileSizeBytes) {
    return {
      valid: false,
      error: {
        code: "FILE_TOO_LARGE",
        message: `File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds maximum limit of ${PDF_CONFIG.maxFileSizeMB}MB.`,
      },
    };
  }

  // 2. File magic bytes verification (check first 8 bytes)
  const buffer = await file.slice(0, 8).arrayBuffer();
  const header = new Uint8Array(buffer);

  const isPdf = file.name.toLowerCase().endsWith(".pdf") || file.type === "application/pdf";
  const isImage = /\.(jpg|jpeg|png|webp|bmp)$/i.test(file.name);

  if (isPdf) {
    // Magic bytes for PDF: %PDF- (% = 0x25, P = 0x50, D = 0x44, F = 0x46, - = 0x2d)
    if (header[0] !== 0x25 || header[1] !== 0x50 || header[2] !== 0x44 || header[3] !== 0x46) {
      return {
        valid: false,
        error: {
          code: "INVALID_PDF_HEADER",
          message: "The uploaded file does not have a valid PDF header or is corrupted.",
        },
      };
    }
  } else if (isImage) {
    // JPG: FF D8 FF
    // PNG: 89 50 4E 47
    const isJpg = header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff;
    const isPng = header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4e && header[3] === 0x47;
    const isRiff = header[0] === 0x52 && header[1] === 0x49 && header[2] === 0x46 && header[3] === 0x46; // WEBP

    if (!isJpg && !isPng && !isRiff) {
      return {
        valid: false,
        error: {
          code: "INVALID_IMAGE_HEADER",
          message: "The uploaded image file is corrupted or unsupported.",
        },
      };
    }
  } else {
    return {
      valid: false,
      error: {
        code: "UNSUPPORTED_FORMAT",
        message: "Only PDF documents and image files (JPG, PNG, WEBP) are supported.",
      },
    };
  }

  return { valid: true };
}
