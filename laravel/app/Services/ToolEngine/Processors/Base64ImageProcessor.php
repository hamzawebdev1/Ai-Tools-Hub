<?php

namespace App\Services\ToolEngine\Processors;

use App\Models\Tool;
use Exception;

class Base64ImageProcessor extends BaseToolProcessor
{
    public function getSlug(): string
    {
        return 'image-to-base64';
    }

    public function getValidationRules(): array
    {
        return [
            'mode' => 'required|string|in:encode,decode',
            'file_token' => 'required_if:mode,encode|nullable|string|size:64',
            'base64_string' => 'required_if:mode,decode|nullable|string',
            'output_format' => 'nullable|string|in:data_uri,raw_base64,html_img,css_bg',
        ];
    }

    public function process(array $input, Tool $tool): array
    {
        return $this->executeSafely(function () use ($input) {
            $mode = $input['mode'];
            $outputFormat = $input['output_format'] ?? 'data_uri';

            if ($mode === 'encode') {
                $token = $input['file_token'];
                $filePath = $this->storageService->getFilePathByToken($token);
                if (!$filePath || !file_exists($filePath)) {
                    throw new Exception("Uploaded image is expired or invalid.");
                }

                $imgInfo = @getimagesize($filePath);
                $mime = $imgInfo ? $imgInfo['mime'] : 'image/png';
                $rawBytes = file_get_contents($filePath);
                $rawBase64 = base64_encode($rawBytes);
                $dataUri = "data:{$mime};base64,{$rawBase64}";

                $formattedResult = match ($outputFormat) {
                    'raw_base64' => $rawBase64,
                    'html_img' => "<img src=\"{$dataUri}\" alt=\"Base64 Encoded Image\" />",
                    'css_bg' => "background-image: url('{$dataUri}');",
                    default => $dataUri,
                };

                return [
                    'output' => [
                        'message' => 'Image converted to Base64 successfully',
                        'data_uri' => $dataUri,
                        'formatted_result' => $formattedResult,
                        'mime_type' => $mime,
                        'original_bytes' => strlen($rawBytes),
                        'base64_length' => strlen($rawBase64),
                    ],
                    'download_token' => null,
                ];
            } else {
                // Decode base64 back into image file
                $b64 = trim($input['base64_string']);
                $mime = 'image/png';
                $ext = 'png';

                if (preg_match('/^data:(image\/(\w+));base64,/', $b64, $matches)) {
                    $mime = $matches[1];
                    $ext = $matches[2] === 'jpeg' ? 'jpg' : $matches[2];
                    $b64 = substr($b64, strpos($b64, ',') + 1);
                }

                $decodedData = base64_decode($b64);
                if (!$decodedData) {
                    throw new Exception("Invalid base64 string provided.");
                }

                $outputName = "decoded-image.{$ext}";
                $downloadToken = $this->storageService->storeRawOutput(
                    $decodedData,
                    $outputName,
                    $mime,
                    request()?->ip()
                );

                return [
                    'output' => [
                        'message' => 'Base64 decoded into image successfully',
                        'mime_type' => $mime,
                        'output_filename' => $outputName,
                        'image_bytes' => strlen($decodedData),
                    ],
                    'download_token' => $downloadToken,
                    'download_url' => route('tools.download', ['token' => $downloadToken]),
                ];
            }
        });
    }
}
