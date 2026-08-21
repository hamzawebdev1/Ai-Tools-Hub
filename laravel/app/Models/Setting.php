<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    protected $fillable = [
        'key',
        'value',
        'group',
        'type',
        'is_public',
        'description',
    ];

    protected $casts = [
        'is_public' => 'boolean',
    ];

    public static function get(string $key, $default = null)
    {
        return Cache::rememberForever("app_setting_{$key}", function () use ($key, $default) {
            $setting = self::where('key', $key)->first();
            if (!$setting) {
                return $default;
            }

            return match ($setting->type) {
                'boolean' => filter_var($setting->value, FILTER_VALIDATE_BOOLEAN),
                'integer' => (int) $setting->value,
                'json', 'array' => json_decode($setting->value, true) ?? $default,
                default => $setting->value ?? $default,
            };
        });
    }

    public static function set(string $key, $value, string $group = 'general', string $type = 'string', bool $isPublic = false, ?string $description = null): self
    {
        $stringValue = is_array($value) || is_object($value) ? json_encode($value) : (string) $value;

        $setting = self::updateOrCreate(
            ['key' => $key],
            [
                'value' => $stringValue,
                'group' => $group,
                'type' => $type,
                'is_public' => $isPublic,
                'description' => $description,
            ]
        );

        Cache::forget("app_setting_{$key}");
        Cache::forget("app_public_settings");

        return $setting;
    }

    public static function getPublicSettings(): array
    {
        return Cache::rememberForever("app_public_settings", function () {
            return self::where('is_public', true)
                ->get()
                ->mapWithKeys(function ($item) {
                    $val = match ($item->type) {
                        'boolean' => filter_var($item->value, FILTER_VALIDATE_BOOLEAN),
                        'integer' => (int) $item->value,
                        'json', 'array' => json_decode($item->value, true),
                        default => $item->value,
                    };
                    return [$item->key => $val];
                })
                ->toArray();
        });
    }
}
