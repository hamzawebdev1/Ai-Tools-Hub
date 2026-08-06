import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const KEY_LEN = 32; // 256 bits
const IV_LEN = 16;  // 128 bits
const TAG_LEN = 16; // 128 bits

// Master key derived from env or generated deterministically
function getMasterKey(): Buffer {
  const secret = process.env.STORAGE_ENCRYPTION_SECRET || "ai-tools-hub-default-super-secret-key-32b";
  return crypto.createHash("sha256").update(secret).digest();
}

export interface EncryptedData {
  encryptedBuffer: Buffer;
  iv: string; // hex
  authTag: string; // hex
}

/**
 * Encrypts a file buffer using AES-256-GCM
 */
export function encryptBuffer(buffer: Buffer): EncryptedData {
  const iv = crypto.randomBytes(IV_LEN);
  const key = getMasterKey();
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return {
    encryptedBuffer: encrypted,
    iv: iv.toString("hex"),
    authTag: authTag.toString("hex"),
  };
}

/**
 * Decrypts an AES-256-GCM encrypted buffer
 */
export function decryptBuffer(encryptedBuffer: Buffer, ivHex: string, authTagHex: string): Buffer {
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const key = getMasterKey();

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);
  return decrypted;
}

/**
 * Calculates SHA-256 checksum for duplicate and integrity detection
 */
export function calculateChecksum(buffer: Buffer): string {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}
