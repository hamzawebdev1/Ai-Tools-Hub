<?php

namespace App\Services\Storage;

use App\Models\Setting;
use App\Models\SystemLog;
use App\Services\Security\PathSanitizer;
use Exception;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class SecureStorageService
{
    protected string $disk = 'local';
    protected string $tempDir = 'temp_files';
    protected PathSanitizer $sanitizer;

    public function __construct(PathSanitizer $sanitizer)
    {
        $this->sanitizer = $sanitizer;
    }

    /**
     * Store an uploaded file securely with virus/MIME validation and random UUID name.
     */
    public function storeUploadedFile(UploadedFile $file, ?string $clientIp = null): array
    {
        // 1. Validate file extension and MIME safety
        $this->sanitizer->validateFileSafety($file);

        // 2. Generate secure non-guessable storage filename
        $uuid = (string) Str::uuid();
        $safeExt = $this->sanitizer->sanitizeExtension($file->getClientOriginalExtension());
        $storedFilename = "{$uuid}.{$safeExt}";
        $storagePath = "{$this->tempDir}/{$storedFilename}";

        // 3. Store file securely
        $path = $file->storeAs($this->tempDir, $storedFilename, $this->disk);
        if (!$path) {
            throw new Exception("Failed to store uploaded file.");
        }

        // 4. Generate signed download token
        $downloadToken = Str::random(64);
        $lifetimeMinutes = (int) Setting::get('temp_file_lifetime_minutes', 60);

        $metadata = [
            'uuid' => $uuid,
            'original_name' => $this->sanitizer->sanitizeFilename($file->getClientOriginalName()),
            'mime_type' => $file->getMimeType(),
            'size_bytes' => $file->getSize(),
            'storage_path' => $storagePath,
            'client_ip' => $clientIp ?? request()?->ip(),
            'created_at' => now()->toISOString(),
            'expires_at' => now()->addMinutes($lifetimeMinutes)->toISOString(),
        ];

        // Store token in Cache / Redis for rapid O(1) lookup
        Cache::put("download_token_{$downloadToken}", $metadata, now()->addMinutes($lifetimeMinutes));
        Cache::put("file_meta_{$uuid}", $metadata, now()->addMinutes($lifetimeMinutes));

        return [
            'success' => true,
            'uuid' => $uuid,
            'token' => $downloadToken,
            'original_name' => $metadata['original_name'],
            'size_bytes' => $metadata['size_bytes'],
            'expires_at' => $metadata['expires_at'],
        ];
    }

    /**
     * Store raw generated string or binary output securely and produce a download token.
     */
    public function storeRawOutput(string $binaryData, string $originalName, string $mimeType, ?string $clientIp = null): string
    {
        $uuid = (string) Str::uuid();
        $safeName = $this->sanitizer->sanitizeFilename($originalName);
        $ext = pathinfo($safeName, PATHINFO_EXTENSION) ?: 'bin';
        $storedFilename = "{$uuid}.{$ext}";
        $storagePath = "{$this->tempDir}/{$storedFilename}";

        Storage::disk($this->disk)->put($storagePath, $binaryData);

        $downloadToken = Str::random(64);
        $lifetimeMinutes = (int) Setting::get('temp_file_lifetime_minutes', 60);

        $metadata = [
            'uuid' => $uuid,
            'original_name' => $safeName,
            'mime_type' => $mimeType,
            'size_bytes' => strlen($binaryData),
            'storage_path' => $storagePath,
            'client_ip' => $clientIp ?? request()?->ip(),
            'created_at' => now()->toISOString(),
            'expires_at' => now()->addMinutes($lifetimeMinutes)->toISOString(),
        ];

        Cache::put("download_token_{$downloadToken}", $metadata, now()->addMinutes($lifetimeMinutes));

        return $downloadToken;
    }

    /**
     * Retrieve file metadata and verify token.
     */
    public function getFileMetadataByToken(string $token): ?array
    {
        return Cache::get("download_token_{$token}");
    }

    /**
     * Retrieve absolute system file path by token.
     */
    public function getFilePathByToken(string $token): ?string
    {
        $meta = $this->getFileMetadataByToken($token);
        if (!$meta || empty($meta['storage_path'])) {
            return null;
        }

        $fullPath = Storage::disk($this->disk)->path($meta['storage_path']);
        return file_exists($fullPath) ? $fullPath : null;
    }

    /**
     * Automatic purge of expired temporary files.
     */
    public function cleanupExpiredFiles(): int
    {
        $lifetimeMinutes = (int) Setting::get('temp_file_lifetime_minutes', 60);
        $cutoff = now()->subMinutes($lifetimeMinutes)->getTimestamp();
        $files = Storage::disk($this->disk)->files($this->tempDir);
        $deletedCount = 0;

        foreach ($files as $file) {
            $lastModified = Storage::disk($this->disk)->lastModified($file);
            if ($lastModified < $cutoff) {
                Storage::disk($this->disk)->delete($file);
                $deletedCount++;
            }
        }

        if ($deletedCount > 0) {
            SystemLog::log('info', 'storage', "Cleaned up {$deletedCount} expired temporary files.");
        }

        return $deletedCount;
    }
}
