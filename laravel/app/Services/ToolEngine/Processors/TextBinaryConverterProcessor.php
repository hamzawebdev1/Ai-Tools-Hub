<?php

namespace App\Services\ToolEngine\Processors;

use App\Models\Tool;

class TextBinaryConverterProcessor extends BaseToolProcessor
{
    public function getSlug(): string
    {
        return 'binary-to-text';
    }

    public function getValidationRules(): array
    {
        return [
            'mode' => 'required|string|in:text_to_bin,bin_to_text,text_to_hex,hex_to_text,text_to_oct,oct_to_text',
            'input' => 'required|string|max:50000',
        ];
    }

    public function process(array $inputData, Tool $tool): array
    {
        return $this->executeSafely(function () use ($inputData) {
            $mode = $inputData['mode'];
            $val = $inputData['input'];

            $result = match ($mode) {
                'text_to_bin' => implode(' ', array_map(fn($c) => sprintf('%08b', ord($c)), str_split($val))),
                'bin_to_text' => implode('', array_map(fn($b) => chr((int) bindec($b)), preg_split('/\s+/', trim($val)))),
                'text_to_hex' => bin2hex($val),
                'hex_to_text' => hex2bin(preg_replace('/\s+/', '', $val)) ?: '',
                'text_to_oct' => implode(' ', array_map(fn($c) => sprintf('%03o', ord($c)), str_split($val))),
                'oct_to_text' => implode('', array_map(fn($o) => chr((int) octdec($o)), preg_split('/\s+/', trim($val)))),
            };

            return [
                'output' => [
                    'result' => $result,
                    'mode' => $mode,
                    'input_length' => strlen($val),
                    'output_length' => strlen($result),
                ],
                'download_token' => null,
            ];
        });
    }
}
