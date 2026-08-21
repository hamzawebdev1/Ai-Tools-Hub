<?php

use App\Models\Setting;

if (!function_exists('setting')) {
    /**
     * Retrieve a setting value or fallback.
     */
    function setting(string $key, $default = null)
    {
        return Setting::get($key, $default);
    }
}

if (!function_exists('format_bytes')) {
    /**
     * Format bytes to human-readable format.
     */
    function format_bytes(int $bytes, int $precision = 2): string
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        $bytes /= (1 << (10 * $pow));

        return round($bytes, $precision) . ' ' . $units[$pow];
    }
}

if (!function_exists('format_duration')) {
    /**
     * Format milliseconds into human readable time.
     */
    function format_duration(int $ms): string
    {
        if ($ms < 1000) {
            return "{$ms}ms";
        }
        return round($ms / 1000, 2) . 's';
    }
}
