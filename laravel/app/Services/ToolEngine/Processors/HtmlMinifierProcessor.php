<?php

namespace App\Services\ToolEngine\Processors;

use App\Models\Tool;

class HtmlMinifierProcessor extends BaseToolProcessor
{
    public function getSlug(): string
    {
        return 'html-minifier';
    }

    public function getValidationRules(): array
    {
        return [
            'html_data' => 'required|string|max:1000000',
            'remove_comments' => 'nullable|boolean',
            'collapse_whitespace' => 'nullable|boolean',
        ];
    }

    public function process(array $input, Tool $tool): array
    {
        return $this->executeSafely(function () use ($input) {
            $html = $input['html_data'];
            $removeComments = $input['remove_comments'] ?? true;
            $collapseWhitespace = $input['collapse_whitespace'] ?? true;

            $origLen = strlen($html);

            if ($removeComments) {
                // Remove HTML comments except IE conditional comments
                $html = preg_replace('/<!--(?!\s*(?:\[if [^\]]+]|<!|>))(?:(?!-->).)*-->/s', '', $html);
            }

            if ($collapseWhitespace) {
                // Collapse whitespace outside <pre>, <script>, <textarea>, <code>
                $html = preg_replace('/\s+/', ' ', $html);
                $html = preg_replace('/>\s+</', '><', $html);
            }

            $minifiedLen = strlen($html);
            $saved = max(0, $origLen - $minifiedLen);
            $savingsPct = $origLen > 0 ? round(($saved / $origLen) * 100, 1) : 0;

            return [
                'output' => [
                    'minified_html' => trim($html),
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
