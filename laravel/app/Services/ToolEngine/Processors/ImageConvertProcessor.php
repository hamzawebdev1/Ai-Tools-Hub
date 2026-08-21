<?php

namespace App\Services\ToolEngine\Processors;

use App\Models\Tool;
use Exception;

class ImageConvertProcessor extends BaseToolProcessor
{
    public function getSlug(): string
    {
        return 'image-converter';
    }

    public function getValidationRules(): array
    {
        return [
            'file_token' => 'required|string|size:64',
            'target_format' => 'required|string|in:jpg,jpeg,png,webp,gif,bmp',
            'quality' => 'nullable|integer|min:10|max:100',
        ];
    }

    public function process(array $input, Tool $tool): array
    {
        return $this->executeSafely(function () use ($input) {
            $token = $input['file_token'];
            $targetFormat = strtolower($input['target_format']);
            if ($targetFormat === 'jpeg') $targetFormat = 'jpg';
            $quality = (int) ($input['quality'] ?? 90);

            $filePath = $this->storageService->getFilePathByToken($token);
            if (!$filePath || !file_exists($filePath)) {
                throw new Exception("Source image file is missing or expired.");
            }

            $imgData = file_get_contents($filePath);
            $img = @imagecreatefromstring($imgData);

            if (!$img) {
                throw new Exception("Unable to decode source image. Ensure the uploaded file is a valid image.");
            }

            // Preserve alpha channel for PNG/WEBP
            imagealphablending($img, true);
            imagesavealpha($img, true);

            ob_start();
            $mime = 'image/jpeg';
            switch ($targetFormat) {
                case 'png':
                    $mime = 'image/png';
                    $pngQuality = (int) round((100 - $quality) / 10);
                    imagepng($img, null, $pngQuality);
                    break;
                case 'webp':
                    $mime = 'image/webp';
                    if (function_exists('imagewebp')) {
                        imagewebp($img, null, $quality);
                    } else {
                        imagejpeg($img, null, $quality);
                        $mime = 'image/jpeg';
                        $targetFormat = 'jpg';
                    }
                    break;
                case 'gif':
                    $mime = 'image/gif';
                    imagegif($img);
                    break;
                default:
                    $mime = 'image/jpeg';
                    // Create solid white background if transparency exists
                    $bg = imagecreatetruecolor(imagesx($img), imagesy($img));
                    $white = imagecolorallocate($bg, 255, 255, 255);
                    imagefilledrectangle($bg, 0, 0, imagesx($img), imagesy($img), $white);
                    imagecopy($bg, $img, 0, 0, 0, 0, imagesx($img), imagesy($img));
                    imagejpeg($bg, null, $quality);
                    imagedestroy($bg);
                    break;
            }

            $outputBytes = ob_get_clean();
            $origWidth = imagesx($img);
            $origHeight = imagesy($img);
            imagedestroy($img);

            $outputName = "converted-image.{$targetFormat}";
            $downloadToken = $this->storageService->storeRawOutput(
                $outputBytes,
                $outputName,
                $mime,
                request()?->ip()
            );

            return [
                'output' => [
                    'message' => "Image successfully converted to {$targetFormat}",
                    'width' => $origWidth,
                    'height' => $origHeight,
                    'target_format' => $targetFormat,
                    'file_size_bytes' => strlen($outputBytes),
                ],
                'download_token' => $downloadToken,
                'download_url' => route('tools.download', ['token' => $downloadToken]),
                'metadata' => [
                    'dimensions' => "{$origWidth}x{$origHeight}",
                    'output_bytes' => strlen($outputBytes),
                ],
            ];
        });
    }
}
