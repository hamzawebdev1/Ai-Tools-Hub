<?php

namespace App\Services\ToolEngine\Processors;

use App\Models\Tool;
use Exception;

class JsonFormatterProcessor extends BaseToolProcessor
{
    public function getSlug(): string
    {
        return 'json-formatter';
    }

    public function getValidationRules(): array
    {
        return [
            'json' => 'required|string|max:2000000',
            'action' => 'required|string|in:format,minify,validate',
            'indent' => 'nullable|integer|min:2|max:8',
        ];
    }

    public function process(array $input, Tool $tool): array
    {
        return $this->executeSafely(function () use ($input) {
            $jsonString = trim($input['json']);
            $action = $input['action'] ?? 'format';
            $indent = (int) ($input['indent'] ?? 2);

            $decoded = json_decode($jsonString, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new Exception('Invalid JSON: ' . json_last_error_msg());
            }

            if ($action === 'validate') {
                return [
                    'output' => [
                        'valid' => true,
                        'message' => 'Valid JSON structure',
                        'type' => is_array($decoded) ? (array_is_list($decoded) ? 'Array' : 'Object') : gettype($decoded),
                        'item_count' => is_array($decoded) ? count($decoded) : 1,
                    ],
                    'metadata' => ['valid' => true],
                ];
            }

            if ($action === 'minify') {
                $output = json_encode($decoded, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
            } else {
                $flags = JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE;
                $output = json_encode($decoded, $flags);
            }

            return [
                'output' => $output,
                'metadata' => [
                    'original_bytes' => strlen($jsonString),
                    'result_bytes' => strlen($output),
                    'compression_ratio' => strlen($jsonString) > 0 ? round((1 - (strlen($output) / strlen($jsonString))) * 100, 1) . '%' : '0%',
                ],
            ];
        });
    }
}
