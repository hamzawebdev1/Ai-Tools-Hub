<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProcessToolRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'tool_slug' => 'required|string|exists:tools,slug',
            'payload' => 'nullable|array',
            'file_tokens' => 'nullable|array',
            'file_tokens.*' => 'string|size:64',
            'file_token' => 'nullable|string|size:64',
        ];
    }
}
