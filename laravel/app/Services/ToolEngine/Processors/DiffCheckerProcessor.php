<?php

namespace App\Services\ToolEngine\Processors;

use App\Models\Tool;

class DiffCheckerProcessor extends BaseToolProcessor
{
    public function getSlug(): string
    {
        return 'diff-checker';
    }

    public function getValidationRules(): array
    {
        return [
            'original_text' => 'required|string|max:500000',
            'modified_text' => 'required|string|max:500000',
            'ignore_whitespace' => 'nullable|boolean',
            'case_sensitive' => 'nullable|boolean',
        ];
    }

    public function process(array $input, Tool $tool): array
    {
        return $this->executeSafely(function () use ($input) {
            $orig = $input['original_text'];
            $mod = $input['modified_text'];
            $ignoreWs = !empty($input['ignore_whitespace']);
            $caseSensitive = isset($input['case_sensitive']) ? (bool) $input['case_sensitive'] : true;

            $origLines = explode("\n", $orig);
            $modLines = explode("\n", $mod);

            $diffLines = [];
            $added = 0;
            $removed = 0;
            $unchanged = 0;

            $maxLines = max(count($origLines), count($modLines));

            for ($i = 0; $i < $maxLines; $i++) {
                $lineA = $origLines[$i] ?? null;
                $lineB = $modLines[$i] ?? null;

                $compareA = $lineA;
                $compareB = $lineB;

                if ($ignoreWs) {
                    $compareA = $compareA !== null ? trim($compareA) : null;
                    $compareB = $compareB !== null ? trim($compareB) : null;
                }

                if (!$caseSensitive) {
                    $compareA = $compareA !== null ? mb_strtolower($compareA) : null;
                    $compareB = $compareB !== null ? mb_strtolower($compareB) : null;
                }

                if ($lineA === null) {
                    $diffLines[] = ['type' => 'added', 'line' => $i + 1, 'content' => $lineB];
                    $added++;
                } elseif ($lineB === null) {
                    $diffLines[] = ['type' => 'removed', 'line' => $i + 1, 'content' => $lineA];
                    $removed++;
                } elseif ($compareA === $compareB) {
                    $diffLines[] = ['type' => 'unchanged', 'line' => $i + 1, 'content' => $lineA];
                    $unchanged++;
                } else {
                    $diffLines[] = ['type' => 'modified', 'line' => $i + 1, 'old' => $lineA, 'new' => $lineB];
                    $added++;
                    $removed++;
                }
            }

            return [
                'output' => [
                    'lines' => $diffLines,
                    'summary' => [
                        'added_lines' => $added,
                        'removed_lines' => $removed,
                        'unchanged_lines' => $unchanged,
                        'total_lines' => count($diffLines),
                    ],
                ],
                'metadata' => [
                    'added_lines' => $added,
                    'removed_lines' => $removed,
                ],
            ];
        });
    }
}
