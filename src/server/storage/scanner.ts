/**
 * Malware and MIME Validation Service
 */

// Allowed magic numbers (file headers) for strict MIME validation
const FILE_SIGNATURES: Record<string, { mime: string; ext: string; bytes: number[] }[]> = {
  pdf: [{ mime: "application/pdf", ext: "pdf", bytes: [0x25, 0x50, 0x44, 0x46] }], // %PDF
  jpg: [
    { mime: "image/jpeg", ext: "jpg", bytes: [0xff, 0xd8, 0xff] },
    { mime: "image/jpeg", ext: "jpeg", bytes: [0xff, 0xd8, 0xff] },
  ],
  png: [{ mime: "image/png", ext: "png", bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] }],
  gif: [{ mime: "image/gif", ext: "gif", bytes: [0x47, 0x49, 0x46, 0x38] }],
  webp: [{ mime: "image/webp", ext: "webp", bytes: [0x52, 0x49, 0x46, 0x46] }], // RIFF
};

// Known malware test signature fragments (e.g. EICAR test string)
const MALWARE_SIGNATURES = [
  "X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*",
  "<script>evil_payload",
  "eval(compile(",
  "<?php system(",
  "/bin/sh -c",
];

export interface ValidationResult {
  valid: boolean;
  error?: string;
  detectedMime?: string;
}

export function validateFileSafety(buffer: Buffer, originalFilename: string, declaredMime: string): ValidationResult {
  // 1. Check size limit (max 25 MB)
  const MAX_SIZE = 25 * 1024 * 1024;
  if (buffer.length > MAX_SIZE) {
    return { valid: false, error: "File size exceeds maximum allowed limit of 25MB." };
  }

  if (buffer.length === 0) {
    return { valid: false, error: "File is empty." };
  }

  // 2. Malware Signature Scan (Scanning binary text representation for EICAR & known exploit payloads)
  const contentHead = buffer.slice(0, 4096).toString("latin1");
  for (const sig of MALWARE_SIGNATURES) {
    if (contentHead.includes(sig)) {
      return { valid: false, error: "Malware threat detected in file content scan. File rejected." };
    }
  }

  // 3. Strict Magic Number / MIME Header Verification
  const fileExt = originalFilename.split(".").pop()?.toLowerCase() || "";
  
  // Basic extension block for dangerous executables
  const BANNED_EXTENSIONS = ["exe", "bat", "cmd", "sh", "vbs", "js", "jar", "scr", "pif", "php", "py", "pl"];
  if (BANNED_EXTENSIONS.includes(fileExt)) {
    return { valid: false, error: `Executable or script extension .${fileExt} is strictly prohibited.` };
  }

  // Validate header magic bytes
  let verifiedMime = declaredMime;
  if (fileExt === "pdf") {
    if (buffer[0] !== 0x25 || buffer[1] !== 0x50 || buffer[2] !== 0x44 || buffer[3] !== 0x46) {
      return { valid: false, error: "Invalid PDF header magic bytes. File appears corrupted or spoofed." };
    }
    verifiedMime = "application/pdf";
  } else if (fileExt === "png") {
    if (buffer[0] !== 0x89 || buffer[1] !== 0x50 || buffer[2] !== 0x4e || buffer[3] !== 0x47) {
      return { valid: false, error: "Invalid PNG header magic bytes." };
    }
    verifiedMime = "image/png";
  } else if (fileExt === "jpg" || fileExt === "jpeg") {
    if (buffer[0] !== 0xff || buffer[1] !== 0xd8 || buffer[2] !== 0xff) {
      return { valid: false, error: "Invalid JPEG header magic bytes." };
    }
    verifiedMime = "image/jpeg";
  }

  return { valid: true, detectedMime: verifiedMime };
}
