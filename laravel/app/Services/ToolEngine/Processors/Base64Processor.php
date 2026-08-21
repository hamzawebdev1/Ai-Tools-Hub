<?php

namespace App\Services\ToolEngine\Processors;

use App\Models\Tool;
use Exception;

class Base64Processor extends BaseToolProcessor
{
    public function getSlug(): string
    {
        return 'base64-encode-decode';
    }

    public function getValidationRules(): array
    {
        return [
            'mode' => 'required|string|in:encode,decode,url_encode,url_decode',
            'input' => 'required|string|max:1000000',
        ];
    }

    public function process(array $inputData, Tool $tool): array
    {
        return $this->executeSafely(function () use ($inputData) {
            $mode = $inputData['mode'];
            $val = $inputData['input'];

            $result = match ($mode) {
                'encode' => base64_encode($val),
                'decode' => base64_decode($val, true) ?: throw new Exception("Invalid standard Base64 string."),
                'url_encode' => rtrim(strtr(base64_encode($val), '+/', '-_'), '='),
                'url_decode' => base64_decode(strtr($val, '-_', '+/')) ?: throw new Exception("Invalid URL-safe Base64 string."),
            };

            return [
                'output' => [
                    'result' => $result,
                    'mode' => $mode,
                    'input_bytes' => strlen($val),
                    'output_bytes' => strlen($result),
                ],
                'download_token' => null,
            ];
        });
    }
}
