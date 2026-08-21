<?php

namespace App\Services\ToolEngine\Processors;

use App\Models\Tool;
use Exception;

class ImageCompressProcessor extends BaseToolProcessor
{
    public function getSlug(): string
    {
        return 'image-compress';
    }

    public function getValidationRules(): array
    {
        return [
            'file_token' => 'required|string|size:64',
            'quality' => 'required|integer|min:10|max:95', // percentage
            'target_format' => 'nullable|string|in:auto,jpg,jpeg,png,webp',
            'output_name' => 'nullable|string|max:100',
        ];
    }

    public function process(array $input, Tool $tool): array
    {
        return $this->executeSafely(function () use ($input) {
            $token = $input['file_token'];
            $quality = (int) $input['quality'];
            $targetFormat = $input['target_format'] ?? 'auto';

            $filePath = $this->storageService->getFilePathByToken($token);
            if (!$filePath || !file_exists($filePath)) {
                throw new Exception("Uploaded image file is expired or invalid.");
            }

            $originalSize = filesize($filePath);
            $imgInfo = @getimagesize($filePath);
            if (!$imgInfo) {
                throw new Exception("Uploaded file is not a valid recognized image format.");
            }

            $mime = $imgInfo['mime'];
            $width = $imgInfo[0];
            $height = $imgInfo[1];

            // Load GD Image resource
            $img = match ($mime) {
                'image/jpeg' => @imagecreatefromjpeg($filePath),
                'image/png' => @imagecreatefrompng($filePath),
                'image/webp' => function_exists('imagecreatefromwebp') ? @imagecreatefromwebp($filePath) : false,
                'image/gif' => @imagecreatefromgif($filePath),
                default => false,
            };

            if (!$img) {
                throw new Exception("Unable to decode image file using GD extension.");
            }

            // Determine output format
            $ext = ($targetFormat === 'auto' || empty($targetFormat))
                ? match ($mime) {
                    'image/png' => 'png',
                    'image/webp' => 'webp',
                    default => 'jpg',
                }
                : $targetFormat;

            ob_start();
            if ($ext === 'png') {
                imagealphablending($img, false);
                imagesavealpha($img, true);
                // PNG quality compression is 0-9 in GD (invert 100-scale)
                $pngQuality = (int) round((100 - $quality) / 11);
                imagepng($img, null, $pngQuality);
                $outMime = 'image/png';
            } elseif ($ext === 'webp' && function_exists('imagewebp')) {
                imagewebp($img, null, $quality);
                $outMime = 'image/webp';
            } else {
                imagejpeg($img, null, $quality);
                $outMime = 'image/jpeg';
                $ext = 'jpg';
            }
            $outputData = ob_get_clean();
            imagedestroy($img);

            $outputBytes = strlen($outputData);
            $savedBytes = max(0, $originalSize - $outputBytes);
            $savingsPct = $originalSize > 0 ? round(($savedBytes / $originalSize) * 100, 1) : 0;

            $outputName = $input['output_name'] ?? ('compressed-image.' . $ext);
            $downloadToken = $this->storageService->storeRawOutput(
                $outputData,
                $outputName,
                $outMime,
                request()?->ip()
            );

            return [
                'output' => [
                    'message' => 'Image compressed successfully',
                    'original_bytes' => $originalSize,
                    'compressed_bytes' => $outputBytes,
                    'saved_bytes' => $savedBytes,
                    'savings_percentage' => $savingsPct,
                    'dimensions' => "{$width}x{$height}",
                    'quality_applied' => $quality,
                ],
                'download_token' => $downloadToken,
                'download_url' => route('tools.download', ['token' => $downloadToken]),
                'metadata' => [
                    'original_bytes' => $originalSize,
                    'output_bytes' => $outputBytes,
                    'savings_percentage' => $savingsPct,
                ],
            ];
        });
    }
}
