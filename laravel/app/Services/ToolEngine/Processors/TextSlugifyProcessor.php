<?php

namespace App\Services\ToolEngine\Processors;

use App\Models\Tool;
use Illuminate\Support\Str;

class TextSlugifyProcessor extends BaseToolProcessor
{
    public function getSlug(): string
    {
        return 'slug-generator';
    }

    public function getValidationRules(): array
    {
        return [
            'text' => 'required|string|max:5000',
            'separator' => 'nullable|string|in:-_.,',
            'lowercase' => 'nullable|boolean',
        ];
    }

    public function process(array $input, Tool $tool): array
    {
        return $this->executeSafely(function () use ($input) {
            $text = $input['text'];
            $sep = $input['separator'] ?? '-';
            $lowercase = $input['lowercase'] ?? true;

            $slug = Str::slug($text, $sep);
            if (!$lowercase) {
                $slug = strtoupper($slug);
            }

            return [
                'output' => [
                    'slug' => $slug,
                    'original_text' => $text,
                    'separator' => $sep,
                    'length' => strlen($slug),
                ],
                'download_token' => null,
            ];
        });
    }
}
