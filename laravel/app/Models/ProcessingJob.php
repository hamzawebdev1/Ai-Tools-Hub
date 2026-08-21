<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ProcessingJob extends Model
{
    protected $fillable = [
        'uuid',
        'tool_id',
        'user_id',
        'session_id',
        'status',
        'input_file_path',
        'output_file_path',
        'download_token',
        'progress_percent',
        'options_json',
        'error_message',
        'duration_ms',
        'expires_at',
    ];

    protected $casts = [
        'options_json' => 'array',
        'progress_percent' => 'integer',
        'duration_ms' => 'integer',
        'expires_at' => 'datetime',
    ];

    protected static function booted()
    {
        static::creating(function ($job) {
            if (empty($job->uuid)) {
                $job->uuid = (string) Str::uuid();
            }
            if (empty($job->download_token)) {
                $job->download_token = Str::random(48);
            }
        });
    }

    public function tool()
    {
        return $this->belongsTo(Tool::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function isExpired(): bool
    {
        return $this->expires_at && $this->expires_at->isPast();
    }
}
