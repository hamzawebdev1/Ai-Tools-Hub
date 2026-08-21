<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FileUploadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $maxSizeKb = (int) (config('tools.max_upload_size_mb', 25) * 1024);

        return [
            'file' => "required|file|max:{$maxSizeKb}",
            'tool_slug' => 'nullable|string|max:100',
        ];
    }

    public function messages(): array
    {
        return [
            'file.required' => 'Please select a file to upload.',
            'file.file' => 'The uploaded item must be a valid file.',
            'file.max' => 'The file size exceeds the allowed system limit.',
        ];
    }
}
