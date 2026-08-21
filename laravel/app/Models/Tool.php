<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tool extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'category',
        'subcategory',
        'description',
        'icon',
        'status',
        'processor_class',
        'is_active',
        'is_featured',
        'is_popular',
        'is_new',
        'validation_rules',
        'allowed_file_types',
        'max_file_size_mb',
        'processing_mode',
        'seo_title',
        'seo_description',
        'seo_keywords',
        'rating',
        'rating_count',
        'total_runs',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'is_popular' => 'boolean',
        'is_new' => 'boolean',
        'validation_rules' => 'array',
        'allowed_file_types' => 'array',
        'seo_keywords' => 'array',
        'max_file_size_mb' => 'integer',
        'rating' => 'float',
        'rating_count' => 'integer',
        'total_runs' => 'integer',
    ];

    public function usages()
    {
        return $this->hasMany(ToolUsage::class);
    }

    public function jobs()
    {
        return $this->hasMany(ProcessingJob::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true)->where('status', 'active');
    }

    public function scopeCategory($query, string $category)
    {
        return $query->where('category', $category);
    }
}
