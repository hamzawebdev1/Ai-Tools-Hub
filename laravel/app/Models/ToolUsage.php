<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ToolUsage extends Model
{
    protected $table = 'tool_usage';
    public $timestamps = false;

    protected $fillable = [
        'tool_id',
        'tool_slug',
        'user_id',
        'session_id',
        'ip_hash',
        'country',
        'country_code',
        'device',
        'browser',
        'operating_system',
        'status',
        'processing_duration_ms',
        'file_size_bytes',
        'error_message',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'processing_duration_ms' => 'integer',
        'file_size_bytes' => 'integer',
    ];

    public function tool()
    {
        return $this->belongsTo(Tool::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
