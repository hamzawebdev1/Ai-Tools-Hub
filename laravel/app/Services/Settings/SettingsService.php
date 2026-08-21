<?php

namespace App\Services\Settings;

use App\Models\Setting;
use Illuminate\Support\Facades\Cache;

class SettingsService
{
    /**
     * Default core application settings schema.
     */
    protected array $defaults = [
        'site_name' => ['value' => 'ToolsHub Pro', 'group' => 'general', 'type' => 'string', 'is_public' => true],
        'site_tagline' => ['value' => 'Professional Web Tools & Document Converters', 'group' => 'general', 'type' => 'string', 'is_public' => true],
        'contact_email' => ['value' => 'support@toolshub.io', 'group' => 'general', 'type' => 'string', 'is_public' => true],
        'temp_file_lifetime_minutes' => ['value' => '60', 'group' => 'storage', 'type' => 'integer', 'is_public' => false],
        'max_upload_size_mb' => ['value' => '25', 'group' => 'storage', 'type' => 'integer', 'is_public' => true],
        'enable_guest_usage' => ['value' => 'true', 'group' => 'security', 'type' => 'boolean', 'is_public' => true],
        'maintenance_mode' => ['value' => 'false', 'group' => 'general', 'type' => 'boolean', 'is_public' => true],
        'default_seo_title' => ['value' => 'ToolsHub - Free Online Productivity, PDF & Developer Tools', 'group' => 'seo', 'type' => 'string', 'is_public' => true],
        'default_seo_description' => ['value' => 'Fast, private, and secure online utility tools for PDF editing, image conversion, code formatting, and text processing.', 'group' => 'seo', 'type' => 'string', 'is_public' => true],
        'google_analytics_id' => ['value' => '', 'group' => 'seo', 'type' => 'string', 'is_public' => true],
    ];

    /**
     * Get a setting value with fallback.
     */
    public function get(string $key, $fallback = null)
    {
        $defaultVal = $this->defaults[$key]['value'] ?? $fallback;
        return Setting::get($key, $defaultVal);
    }

    /**
     * Update or set a setting.
     */
    public function set(string $key, $value, ?string $group = null, ?string $type = null, ?bool $isPublic = null): Setting
    {
        $schema = $this->defaults[$key] ?? [];
        $group = $group ?? $schema['group'] ?? 'general';
        $type = $type ?? $schema['type'] ?? 'string';
        $isPublic = $isPublic ?? $schema['is_public'] ?? false;

        return Setting::set($key, $value, $group, $type, $isPublic);
    }

    /**
     * Seed or sync default application settings.
     */
    public function syncDefaults(): void
    {
        foreach ($this->defaults as $key => $config) {
            if (!Setting::where('key', $key)->exists()) {
                Setting::set(
                    $key,
                    $config['value'],
                    $config['group'],
                    $config['type'],
                    $config['is_public']
                );
            }
        }
    }
}
