<?php

namespace App\Services\ToolEngine\Processors;

use App\Models\Tool;

class TextDuplicateRemoverProcessor extends BaseToolProcessor
{
    public function getSlug(): string
    {
        return 'remove-duplicate-lines';
    }

    public function getValidationRules(): array
    {
        return [
            'text' => 'required|string|max:100000',
            'case_sensitive' => 'nullable|boolean',
            'sort' => 'nullable|string|in:none,asc,desc',
            'trim_lines' => 'nullable|boolean',
        ];
    }

    public function process(array $input, Tool $tool): array
    {
        return $this->executeSafely(function () use ($input) {
            $rawText = $input['text'];
            $caseSensitive = $input['case_sensitive'] ?? true;
            $sortMode = $input['sort'] ?? 'none';
            $trimLines = $input['trim_lines'] ?? true;

            $lines = preg_split('/\r\n|\r|\n/', $rawText);
            $totalLines = count($lines);

            $seen = [];
            $uniqueLines = [];

            foreach ($lines as $line) {
                $checkLine = $trimLines ? trim($line) : $line;
                $key = $caseSensitive ? $checkLine : mb_strtolower($checkLine);
                if (!isset($seen[$key])) {
                    $seen[$key] = true;
                    $uniqueLines[] = $checkLine;
                }
            }

            if ($sortMode === 'asc') {
                natcasesort($uniqueLines);
                $uniqueLines = array_values($uniqueLines);
            } elseif ($sortMode === 'desc') {
                natcasesort($uniqueLines);
                $uniqueLines = array_values(array_reverse($uniqueLines));
            }

            $output = implode("\n", $uniqueLines);
            $duplicatesRemoved = $totalLines - count($uniqueLines);

            return [
                'output' => [
                    'cleaned_text' => $output,
                    'original_lines' => $totalLines,
                    'unique_lines' => count($uniqueLines),
                    'duplicates_removed' => $duplicatesRemoved,
                ],
                'download_token' => null,
            ];
        });
    }
}
