<?php

namespace App\Services\ToolEngine\Processors;

use App\Models\Tool;
use Exception;

class ImageGrayscaleProcessor extends BaseToolProcessor
{
    public function getSlug(): string
    {
        return 'image-grayscale';
    }

    public function getValidationRules(): array
    {
        return [
            'file_token' => 'required|string|size:64',
            'contrast' => 'nullable|integer|min:-100|max:100',
            'brightness' => 'nullable|integer|min:-100|max:100',
            'output_name' => 'nullable|string|max:100',
        ];
    }

    public function process(array $input, Tool $tool): array
    {
        return $this->executeSafely(function () use ($input) {
            $token = $input['file_token'];
            $contrast = (int) ($input['contrast'] ?? 0);
            $brightness = (int) ($input['brightness'] ?? 0);

            $filePath = $this->storageService->getFilePathByToken($token);
            if (!$filePath || !file_exists($filePath)) {
                throw new Exception("Uploaded image file is expired or invalid.");
            }

            $imgInfo = @getimagesize($filePath);
            if (!$imgInfo) {
                throw new Exception("Uploaded file is not a valid image.");
            }

            $mime = $imgInfo['mime'];
            $img = match ($mime) {
                'image/jpeg' => @imagecreatefromjpeg($filePath),
                'image/png' => @imagecreatefrompng($filePath),
                'image/webp' => function_exists('imagecreatefromwebp') ? @imagecreatefromwebp($filePath) : false,
                'image/gif' => @imagecreatefromgif($filePath),
                default => false,
            };

            if (!$img) {
                throw new Exception("Unable to decode image for grayscale conversion.");
            }

            // Apply GD Grayscale filter
            imagefilter($img, IMG_FILTER_GRAYSCALE);
            if ($contrast !== 0) {
                imagefilter($img, IMG_FILTER_CONTRAST, -$contrast);
            }
            if ($brightness !== 0) {
                imagefilter($img, IMG_FILTER_BRIGHTNESS, $brightness);
            }

            ob_start();
            if ($mime === 'image/png') {
                imagealphablending($img, false);
                imagesavealpha($img, true);
                imagepng($img, null, 6);
                $ext = 'png';
                $outMime = 'image/png';
            } elseif ($mime === 'image/webp' && function_exists('imagewebp')) {
                imagewebp($img, null, 90);
                $ext = 'webp';
                $outMime = 'image/webp';
            } else {
                imagejpeg($img, null, 90);
                $ext = 'jpg';
                $outMime = 'image/jpeg';
            }
            $outputData = ob_get_clean();
            imagedestroy($img);

            $outputName = $input['output_name'] ?? ("grayscale-image.{$ext}");
            $downloadToken = $this->storageService->storeRawOutput(
                $outputData,
                $outputName,
                $outMime,
                request()?->ip()
            );

            return [
                'output' => [
                    'message' => 'Image converted to grayscale successfully',
                    'contrast_adjustment' => $contrast,
                    'brightness_adjustment' => $brightness,
                ],
                'download_token' => $downloadToken,
                'download_url' => route('tools.download', ['token' => $downloadToken]),
                'metadata' => [
                    'output_bytes' => strlen($outputData),
                ],
            ];
        });
    }
}
