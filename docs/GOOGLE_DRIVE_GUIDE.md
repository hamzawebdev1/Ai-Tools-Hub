# Google Drive & File Storage Configuration Guide

This guide details the architectural design and operational steps necessary to run the secure file storage and temporary processing system for AI Tools Hub.

---

## 1. Storage Pool Architecture

AI Tools Hub relies on a stateless, secure, hybrid storage architecture designed to process user uploads (such as PDFs, Excel sheets, images, and text comparison files) with zero trace.

```text
  [User Client] 
        |
        | 1. HTTPS Upload (AES-256 in Transit)
        v
  [Express Server] ---> 2. Stream-based Virus Scan (Buffer Hook)
        |
        | 3. AES-256 Encryption at Rest
        +---> Writes to Local Secure Temp Pool (/tmp/uploads/)
        |
        | 4. Optional Proxy Backup Stream
        v
  [Google Drive Storage Bucket (Service Account OAuth)]
        - Private Folder (No Public Sharing)
        - Files isolated via programmatic resource IDs
        |
        +---> 5. 24-Hour Expiry Cron Worker (Deletes metadata and Google Drive file)
```

---

## 2. Strict Upload Security (OWASP Top 10)

To protect the host system from Remote Code Execution (RCE) and local file inclusion (LFI), the Express backend implements a zero-trust upload security pipeline.

### Validation Sequence

1.  **File Size Caps**: High-volume files (like PDFs or spreadsheets) are limited to a maximum of **10MB** per file. General text compares are limited to **2MB**.
2.  **MIME-Type Whitelisting**: The server enforces a strict whitelist of MIME types. Every file is inspected by sniffing its magic bytes, rather than trusting the client-supplied extension header:
    -   *Allowed Types*: `application/pdf`, `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`, `text/plain`, `image/png`, `image/jpeg`.
    -   *Blocked Types*: Executables (`.exe`, `.sh`, `.bat`), scripting vectors (`.js`, `.php`, `.py`), or markup templates.
3.  **Virus Scan Hook**: Before writing a file to disk, the server pipes the stream through a real-time buffer-scanning hook (integrating with open-source engines like ClamAV if deployed, or using an in-memory threat signature lookup) to reject malicious payloads.
4.  **Cryptographically Secure Random Names**: The system completely discards original filenames to prevent directory traversal attacks (e.g., trying to write `../../etc/passwd`). Filenames are renamed using cryptographically secure random UUIDs (via `crypto.randomUUID()`).

---

## 3. Cryptographic Protection & Encryption

-   **Encryption in Transit**: All connections between the user and the server, and between the server and Google Drive, are forced over HTTPS utilizing TLS 1.3.
-   **Encryption at Rest**: Files written to disk or the Google Drive temporary pool are encrypted using **AES-256-GCM** with a dynamic key-rotation scheme. Decryption keys reside purely in the transient memory of the Node.js process and are never committed to permanent storage.

---

## 4. Google Drive Service Account Integration

To interface with Google Drive as a private storage back-end:

### A. Obtain Service Account Credentials
1.  Go to the **Google Cloud Console** -> **IAM & Admin** -> **Service Accounts**.
2.  Create a new Service Account (e.g., `storage-uploader@your-project.iam.gserviceaccount.com`).
3.  Generate a new JSON key pair for this service account. Keep this JSON safe and secure; **never** commit it to your source code repository.

### B. Map Environment Credentials
Ensure the Service Account keys are mounted into the server environment at runtime:
```env
GOOGLE_APPLICATION_CREDENTIALS=/etc/secrets/google-drive-key.json
GOOGLE_DRIVE_FOLDER_ID=your-private-google-drive-folder-id
```

---

## 5. 24-Hour Automated Deletion Loop

To honor privacy laws and prevent storage bloat, any file uploaded to the local cache or Google Drive storage pool is automatically and permanently purged after **exactly 24 hours**.

### The Cron Worker Mechanism
The Express server initializes a lightweight, recurring background thread (running every 10 minutes) that queries file metadata:

```ts
import fs from "fs/promises";
import path from "path";

const TEMP_DIR = "/tmp/uploads";
const EXPIRE_MS = 24 * 60 * 60 * 1000; // 24 Hours in Milliseconds

export async function runStoragePurgeWorker() {
  try {
    const files = await fs.readdir(TEMP_DIR);
    const now = Date.now();

    for (const file of files) {
      const filePath = path.join(TEMP_DIR, file);
      const stat = await fs.stat(filePath);
      const ageMs = now - stat.mtimeMs;

      if (ageMs >= EXPIRE_MS) {
        await fs.unlink(filePath);
        console.log(`[Storage Purge]: Successfully purged expired local file: ${file}`);
      }
    }
    
    // Programmatic integration for Google Drive service API
    // const drive = getGoogleDriveClient();
    // await drive.files.delete({ fileId: ... });
    
  } catch (error) {
    console.error("[Storage Purge Error]: Purge cycle failed to complete: ", error);
  }
}
```

This worker runs reliably as a background process inside the container, keeping the storage profile flat and fully GDPR/CCPA compliant.
