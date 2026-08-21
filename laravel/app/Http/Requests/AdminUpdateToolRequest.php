<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AdminUpdateToolRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->hasPermission('tools.edit');
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:150',
            'category' => 'required|string|max:50',
            'description' => 'required|string',
            'status' => 'required|string|in:active,maintenance,deprecated,beta',
            'is_active' => 'required|boolean',
            'is_featured' => 'nullable|boolean',
            'is_popular' => 'nullable|boolean',
            'max_file_size_mb' => 'required|integer|min:1|max:500',
            'seo_title' => 'nullable|string|max:255',
            'seo_description' => 'nullable|string',
            'seo_keywords' => 'nullable|array',
        ];
    }
}
