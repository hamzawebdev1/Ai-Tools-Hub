<?php

namespace App\Services\ToolEngine\Processors;

use App\Models\Tool;

class UrlEncoderProcessor extends BaseToolProcessor
{
    public function getSlug(): string
    {
        return 'url-encoder';
    }

    public function getValidationRules(): array
    {
        return [
            'mode' => 'required|string|in:encode,decode,component_encode,component_decode',
            'input' => 'required|string|max:50000',
        ];
    }

    public function process(array $inputData, Tool $tool): array
    {
        return $this->executeSafely(function () use ($inputData) {
            $mode = $inputData['mode'];
            $val = $inputData['input'];

            $result = match ($mode) {
                'encode' => urlencode($val),
                'decode' => urldecode($val),
                'component_encode' => rawurlencode($val),
                'component_decode' => rawurldecode($val),
            };

            return [
                'output' => [
                    'result' => $result,
                    'mode' => $mode,
                    'original' => $val,
                ],
                'download_token' => null,
            ];
        });
    }
}
