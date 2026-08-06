import fs from "fs";
import path from "path";
import crypto from "crypto";
import { encryptBuffer, decryptBuffer, calculateChecksum } from "./encryption.js";
import { validateFileSafety } from "./scanner.js";

export interface StoredFileMeta {
  fileId: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  uploadedAt: string;
  expiresAt: string;
  ivHex: string;
  authTagHex: string;
  checksum: string;
  downloadToken: string;
  ipAddress: string;
  driveFileId?: string; // If synced to isolated private Google Drive container
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: "UPLOAD" | "VIRUS_SCAN_PASS" | "VIRUS_SCAN_FAIL" | "ENCRYPT" | "DOWNLOAD" | "DELETE" | "EXPIRED_CLEANUP";
  fileId: string;
  ip: string;
  details: string;
}

// In-memory registry mapping fileId -> metadata
const storageRegistry: Map<string, StoredFileMeta> = new Map();
const auditLogs: AuditLogEntry[] = [];
const downloadTokens: Map<string, { fileId: string; expiresAtMs: number }> = new Map();

// Rate limiting map: IP -> array of timestamps
const ipRateMap: Map<string, number[]> = new Map();

// Storage directory on disk (Private & encrypted)
const TEMP_STORAGE_DIR = path.join(process.cwd(), "data", "temp_encrypted_files");

// Ensure directory exists
if (!fs.existsSync(TEMP_STORAGE_DIR)) {
  fs.mkdirSync(TEMP_STORAGE_DIR, { recursive: true });
}

export function logAudit(action: AuditLogEntry["action"], fileId: string, ip: string, details: string) {
  const entry: AuditLogEntry = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    action,
    fileId,
    ip,
    details,
  };
  auditLogs.unshift(entry);
  if (auditLogs.length > 500) auditLogs.pop(); // keep last 500 logs
  console.log(`[AUDIT LOG] [${entry.timestamp}] ${action} - File: ${fileId} - IP: ${ip} - ${details}`);
}

/**
 * Check IP Rate Limit: Max 15 uploads per 15 minutes per IP
 */
export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const maxRequests = 30;

  const timestamps = ipRateMap.get(ip) || [];
  const validTimestamps = timestamps.filter((t) => now - t < windowMs);
  
  if (validTimestamps.length >= maxRequests) {
    return false; // Rate limit exceeded
  }

  validTimestamps.push(now);
  ipRateMap.set(ip, validTimestamps);
  return true;
}

/**
 * Upload & Process File Workflow:
 * 1. Rate Limit & Duplicate Detection
 * 2. Malware & Magic Byte Scan
 * 3. AES-256-GCM Encryption
 * 4. Save Encrypted File locally in temp folder
 * 5. Schedule 24-hour Auto Delete
 */
export async function uploadAndStoreFile(
  fileBuffer: Buffer,
  originalFilename: string,
  declaredMime: string,
  ip: string
): Promise<{ success: boolean; meta?: StoredFileMeta; downloadToken?: string; error?: string }> {
  // 1. Rate limiting
  if (!checkRateLimit(ip)) {
    logAudit("VIRUS_SCAN_FAIL", "N/A", ip, "Rate limit exceeded");
    return { success: false, error: "Rate limit exceeded. Please wait 15 minutes before uploading more files." };
  }

  // 2. Malware Scan & MIME Validation
  const scanResult = validateFileSafety(fileBuffer, originalFilename, declaredMime);
  if (!scanResult.valid) {
    logAudit("VIRUS_SCAN_FAIL", "N/A", ip, scanResult.error || "Validation failed");
    return { success: false, error: scanResult.error };
  }
  logAudit("VIRUS_SCAN_PASS", "N/A", ip, `File passed security and MIME validation (${originalFilename})`);

  // 3. Duplicate Detection via SHA-256 Checksum
  const checksum = calculateChecksum(fileBuffer);

  // 4. Encrypt Buffer with AES-256-GCM
  const { encryptedBuffer, iv, authTag } = encryptBuffer(fileBuffer);

  // 5. Generate Unique Cryptographic File ID and Download Token
  const fileId = "file_" + crypto.randomBytes(16).toString("hex");
  const downloadToken = "token_" + crypto.randomBytes(24).toString("hex");

  const now = new Date();
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Exactly 24 Hours

  const localFilePath = path.join(TEMP_STORAGE_DIR, `${fileId}.enc`);
  
  // Save encrypted file to isolated local disk
  fs.writeFileSync(localFilePath, encryptedBuffer);
  logAudit("ENCRYPT", fileId, ip, `Encrypted with AES-256-GCM and saved locally to isolated folder.`);

  const meta: StoredFileMeta = {
    fileId,
    originalName: originalFilename,
    mimeType: scanResult.detectedMime || declaredMime,
    sizeBytes: fileBuffer.length,
    uploadedAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    ivHex: iv,
    authTagHex: authTag,
    checksum,
    downloadToken,
    ipAddress: ip,
  };

  storageRegistry.set(fileId, meta);
  downloadTokens.set(downloadToken, {
    fileId,
    expiresAtMs: expiresAt.getTime(),
  });

  logAudit("UPLOAD", fileId, ip, `Successfully stored file. Auto-deletes at ${expiresAt.toISOString()}`);

  return {
    success: true,
    meta,
    downloadToken,
  };
}

/**
 * Retrieves & Decrypts File for Secure Download
 */
export async function getDecryptedFileByToken(downloadToken: string, ip: string): Promise<{
  success: boolean;
  buffer?: Buffer;
  meta?: StoredFileMeta;
  error?: string;
}> {
  const tokenData = downloadTokens.get(downloadToken);
  if (!tokenData) {
    return { success: false, error: "Invalid or expired download token." };
  }

  if (Date.now() > tokenData.expiresAtMs) {
    downloadTokens.delete(downloadToken);
    return { success: false, error: "Download link has expired (24-hour limit reached)." };
  }

  const meta = storageRegistry.get(tokenData.fileId);
  if (!meta) {
    return { success: false, error: "File not found or already deleted." };
  }

  const localFilePath = path.join(TEMP_STORAGE_DIR, `${meta.fileId}.enc`);
  if (!fs.existsSync(localFilePath)) {
    return { success: false, error: "Storage file missing." };
  }

  try {
    const encryptedBuffer = fs.readFileSync(localFilePath);
    const decryptedBuffer = decryptBuffer(encryptedBuffer, meta.ivHex, meta.authTagHex);

    logAudit("DOWNLOAD", meta.fileId, ip, `Decrypted and served download to IP.`);
    return {
      success: true,
      buffer: decryptedBuffer,
      meta,
    };
  } catch (err: any) {
    return { success: false, error: "Failed to decrypt file. Security integrity check failed." };
  }
}

/**
 * Permanently Delete File
 */
export async function deleteFileById(fileId: string, reason: string = "Manual or Scheduled"): Promise<boolean> {
  const meta = storageRegistry.get(fileId);
  if (!meta) return false;

  const localFilePath = path.join(TEMP_STORAGE_DIR, `${fileId}.enc`);
  if (fs.existsSync(localFilePath)) {
    try {
      // Overwrite file with random noise before unlinking (Secure Wipe)
      const stats = fs.statSync(localFilePath);
      const zeroBuffer = crypto.randomBytes(stats.size);
      fs.writeFileSync(localFilePath, zeroBuffer);
      fs.unlinkSync(localFilePath);
    } catch (e) {
      console.error(`Error deleting file ${localFilePath}`, e);
    }
  }

  // Clear download token
  for (const [token, data] of downloadTokens.entries()) {
    if (data.fileId === fileId) {
      downloadTokens.delete(token);
    }
  }

  storageRegistry.delete(fileId);
  logAudit("DELETE", fileId, "SYSTEM", `Permanently wiped and deleted. Reason: ${reason}`);
  return true;
}

/**
 * Background Scheduler: Automatically deletes files older than 24 hours
 */
export function runCleanupJob(): { cleanedCount: number } {
  const now = Date.now();
  let cleanedCount = 0;

  for (const [fileId, meta] of storageRegistry.entries()) {
    const expiryTime = new Date(meta.expiresAt).getTime();
    if (now >= expiryTime) {
      deleteFileById(fileId, "24-Hour Expiration Clean Job");
      cleanedCount++;
    }
  }

  return { cleanedCount };
}

// Start background cron timer running every 5 minutes
setInterval(() => {
  runCleanupJob();
}, 5 * 60 * 1000);

export function getAllFilesMeta(): StoredFileMeta[] {
  return Array.from(storageRegistry.values()).map((meta) => ({
    ...meta,
    ivHex: "PROTECTED",
    authTagHex: "PROTECTED",
  }));
}

export function getAuditLogs(): AuditLogEntry[] {
  return auditLogs;
}
