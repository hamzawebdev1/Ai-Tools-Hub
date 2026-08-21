<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Submission extends Model
{
    protected $fillable = [
        'reference_id',
        'type',
        'name',
        'email',
        'subject',
        'tool_name',
        'category',
        'priority',
        'message',
        'attachment_path',
        'status',
        'assigned_user_id',
        'admin_notes',
        'ip_address',
    ];

    protected static function booted()
    {
        static::creating(function ($submission) {
            if (empty($submission->reference_id)) {
                $prefix = match ($submission->type) {
                    'bug_report' => 'BUG-',
                    'feature_request' => 'REQ-',
                    'tool_suggestion' => 'SUG-',
                    default => 'MSG-',
                };
                $submission->reference_id = $prefix . strtoupper(Str::random(6));
            }
        });
    }

    public function assignedUser()
    {
        return $this->belongsTo(User::class, 'assigned_user_id');
    }
}
