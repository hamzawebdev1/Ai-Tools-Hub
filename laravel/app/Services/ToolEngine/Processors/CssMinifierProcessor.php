<?php

namespace App\Services\ToolEngine\Processors;

use App\Models\Tool;

class CssMinifierProcessor extends BaseToolProcessor
{
    public function getSlug(): string
    {
        return 'css-minifier';
    }

    public function getValidationRules(): array
    {
        return [
            'css_data' => 'required|string|max:500000',
        ];
    }

    public function process(array $input, Tool $tool): array
    {
        return $this->executeSafely(function () use ($input) {
            $css = $input['css_data'];
            $origLen = strlen($css);

            // Strip comments
            $minified = preg_replace('!/\*[^*]*\*+([^/][^*]*\*+)*/!', '', $css);
            // Remove whitespace around characters
            $minified = preg_replace('/\s*([{}|:;,>+~])\s*/', '$1', $minified);
            // Remove trailing semicolons in blocks
            $minified = str_replace(';}', '}', $minified);
            // Replace multiple spaces with single space
            $minified = preg_replace('/\s+/', ' ', $minified);
            $minified = trim($minified);

            $minifiedLen = strlen($minified);
            $saved = max(0, $origLen - $minifiedLen);
            $savingsPct = $origLen > 0 ? round(($saved / $origLen) * 100, 1) : 0;

            return [
                'output' => [
                    'minified_css' => $minified,
                    'original_bytes' => $origLen,
                    'minified_bytes' => $minifiedLen,
                    'saved_bytes' => $saved,
                    'savings_percentage' => $savingsPct,
                ],
                'download_token' => null,
            ];
        });
    }
}
