<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
        'status',
        'avatar',
        'two_factor_enabled',
        'two_factor_secret',
        'last_login_at',
        'last_login_ip',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'last_login_at' => 'datetime',
            'two_factor_enabled' => 'boolean',
        ];
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function hasPermission(string $permission): bool
    {
        if (!$this->role) {
            return false;
        }
        if ($this->role->name === 'super_admin') {
            return true;
        }
        return $this->role->permissions()->where('name', $permission)->exists();
    }

    public function isSuperAdmin(): bool
    {
        return $this->role && $this->role->name === 'super_admin';
    }

    public function isAdmin(): bool
    {
        return $this->role && in_array($this->role->name, ['super_admin', 'admin']);
    }

    public function isEditor(): bool
    {
        return $this->role && in_array($this->role->name, ['super_admin', 'admin', 'editor']);
    }

    public function isAnalyticsViewer(): bool
    {
        return $this->role && in_array($this->role->name, ['super_admin', 'admin', 'editor', 'analytics_viewer']);
    }

    public function toolUsages()
    {
        return $this->hasMany(ToolUsage::class);
    }

    public function processingJobs()
    {
        return $this->hasMany(ProcessingJob::class);
    }
}
