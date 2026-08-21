<?php

namespace App\Services\ToolEngine\Processors;

use App\Models\Tool;
use Illuminate\Support\Str;

class TextCaseProcessor extends BaseToolProcessor
{
    public function getSlug(): string
    {
        return 'case-converter';
    }

    public function getValidationRules(): array
    {
        return [
            'text' => 'required|string|max:500000',
            'target_case' => 'required|string|in:uppercase,lowercase,titlecase,sentencecase,camelcase,snakecase,kebabcase,constantcase',
        ];
    }

    public function process(array $input, Tool $tool): array
    {
        return $this->executeSafely(function () use ($input) {
            $text = $input['text'];
            $case = $input['target_case'];

            $output = match ($case) {
                'uppercase' => mb_strtoupper($text, 'UTF-8'),
                'lowercase' => mb_strtolower($text, 'UTF-8'),
                'titlecase' => mb_convert_case($text, MB_CASE_TITLE, 'UTF-8'),
                'sentencecase' => preg_replace_callback('/(^|[.!?]\s+)([a-z])/u', fn($m) => $m[1] . mb_strtoupper($m[2], 'UTF-8'), mb_strtolower($text, 'UTF-8')),
                'camelcase' => Str::camel($text),
                'snakecase' => Str::snake($text),
                'kebabcase' => Str::kebab($text),
                'constantcase' => strtoupper(Str::snake($text)),
                default => $text,
            };

            return [
                'output' => $output,
                'metadata' => [
                    'original_length' => mb_strlen($text, 'UTF-8'),
                    'result_length' => mb_strlen($output, 'UTF-8'),
                    'target_case' => $case,
                ],
            ];
        });
    }
}
