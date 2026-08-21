<?php

namespace App\Services\Security;

use Exception;
use Illuminate\Http\UploadedFile;

class PathSanitizer
{
    /**
     * Dangerous executable and script file extensions.
     */
    protected array $blacklistedExtensions = [
        'php', 'php3', 'php4', 'php5', 'phtml', 'phar',
        'exe', 'bat', 'sh', 'bin', 'cmd', 'vbs', 'ps1',
        'js', 'jsp', 'asp', 'aspx', 'cgi', 'pl', 'py',
        'htaccess', 'htpasswd', 'env', 'config', 'ini'
    ];

    /**
     * Dangerous executable MIME types.
     */
    protected array $blacklistedMimes = [
        'application/x-php',
        'application/x-httpd-php',
        'application/x-executable',
        'application/x-msdownload',
        'application/x-sh',
        'application/javascript',
        'text/javascript',
    ];

    /**
     * Sanitize filename preventing path traversal characters.
     */
    public function sanitizeFilename(string $filename): string
    {
        // Remove null bytes and directory separators
        $cleaned = str_replace(["\0", '/', '\\', '..'], '', $filename);
        // Remove unsafe non-alphanumeric characters except basic dots/dashes
        $cleaned = preg_replace('/[^a-zA-Z0-9\._-]/', '_', $cleaned);
        return substr($cleaned, 0, 150) ?: 'file';
    }

    /**
     * Sanitize and normalize file extension.
     */
    public function sanitizeExtension(string $extension): string
    {
        $ext = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $extension));
        if (in_array($ext, $this->blacklistedExtensions)) {
            throw new Exception("File type .{$ext} is not allowed for security reasons.");
        }
        return $ext ?: 'dat';
    }

    /**
     * Comprehensive upload security verification.
     */
    public function validateFileSafety(UploadedFile $file): void
    {
        $ext = strtolower($file->getClientOriginalExtension());
        $mime = strtolower($file->getMimeType() ?: '');

        // 1. Check extension against blacklists
        if (in_array($ext, $this->blacklistedExtensions)) {
            throw new Exception("Uploading executable or script files (.{$ext}) is strictly prohibited.");
        }

        // 2. Check MIME against blacklists
        if (in_array($mime, $this->blacklistedMimes)) {
            throw new Exception("The file MIME type ({$mime}) is prohibited.");
        }

        // 3. Prevent PHP header injection in image / text files
        $sample = file_get_contents($file->getRealPath(), false, null, 0, 1024);
        if (preg_match('/<\?php|<\?=|<script\b/i', $sample)) {
            throw new Exception("File failed security signature validation.");
        }
    }
}
