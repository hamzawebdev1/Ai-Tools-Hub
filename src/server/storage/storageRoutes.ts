import { Router } from "express";
import multer from "multer";
import {
  uploadAndStoreFile,
  getDecryptedFileByToken,
  deleteFileById,
  getAllFilesMeta,
  getAuditLogs,
  runCleanupJob,
} from "./storageService.js";

const router = Router();

// Memory storage for multer to process buffer through malware scanner before disk write
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB max
  },
});

/**
 * Upload endpoint
 */
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No file uploaded." });
    }

    const clientIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1";

    const result = await uploadAndStoreFile(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      clientIp
    );

    if (!result.success) {
      return res.status(400).json({ success: false, error: result.error });
    }

    return res.json({
      success: true,
      message: "File uploaded, malware scanned, AES-256 encrypted, and scheduled for 24h auto-deletion.",
      fileId: result.meta?.fileId,
      originalName: result.meta?.originalName,
      sizeBytes: result.meta?.sizeBytes,
      uploadedAt: result.meta?.uploadedAt,
      expiresAt: result.meta?.expiresAt,
      downloadToken: result.downloadToken,
      downloadUrl: `/api/storage/download/${result.downloadToken}`,
    });
  } catch (err: any) {
    console.error("Upload handler error:", err);
    return res.status(500).json({ success: false, error: err.message || "Failed to process upload." });
  }
});

/**
 * File Metadata inspection endpoint
 */
router.get("/files", (req, res) => {
  const files = getAllFilesMeta();
  return res.json({ success: true, count: files.length, files });
});

/**
 * Secure Download Endpoint via Signed Download Token
 */
router.get("/download/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const clientIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1";

    const result = await getDecryptedFileByToken(token, clientIp);

    if (!result.success || !result.buffer || !result.meta) {
      return res.status(404).send(`
        <html>
          <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #0f172a; color: #f8fafc;">
            <div style="text-align: center; max-width: 400px; padding: 2rem; border: 1px solid #334155; rounded: 12px; background: #1e293b;">
              <h2 style="color: #f43f5e;">Download Link Expired or Invalid</h2>
              <p style="color: #94a3b8; font-size: 14px;">${result.error || "File is no longer available."}</p>
            </div>
          </body>
        </html>
      `);
    }

    // Set secure download headers
    res.setHeader("Content-Type", result.meta.mimeType || "application/octet-stream");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(result.meta.originalName)}"`
    );
    res.setHeader("Content-Length", result.buffer.length);
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");

    return res.send(result.buffer);
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || "Error streaming download." });
  }
});

/**
 * Delete File Manually
 */
router.delete("/file/:fileId", async (req, res) => {
  const { fileId } = req.params;
  const deleted = await deleteFileById(fileId, "User manual request");
  if (!deleted) {
    return res.status(404).json({ success: false, error: "File not found." });
  }
  return res.json({ success: true, message: "File permanently erased and zero-wiped." });
});

/**
 * Audit Trail Endpoint
 */
router.get("/audit-logs", (req, res) => {
  const logs = getAuditLogs();
  return res.json({ success: true, logs });
});

/**
 * Force Trigger Cleanup
 */
router.post("/trigger-cleanup", (req, res) => {
  const result = runCleanupJob();
  return res.json({ success: true, message: `Cleanup completed. Removed ${result.cleanedCount} expired files.` });
});

export default router;
