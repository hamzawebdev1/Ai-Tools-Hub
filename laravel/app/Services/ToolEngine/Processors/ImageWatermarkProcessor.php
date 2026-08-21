<?php

namespace App\Services\ToolEngine\Processors;

use App\Models\Tool;
use Exception;

class ImageWatermarkProcessor extends BaseToolProcessor
{
    public function getSlug(): string
    {
        return 'image-watermark';
    }

    public function getValidationRules(): array
    {
        return [
            'file_token' => 'required|string|size:64',
            'watermark_text' => 'required|string|max:100',
            'position' => 'nullable|string|in:bottom_right,bottom_left,center,top_right,top_left',
            'opacity' => 'nullable|integer|min:10|max:100',
            'font_size' => 'nullable|integer|min:12|max:96',
            'output_name' => 'nullable|string|max:100',
        ];
    }

    public function process(array $input, Tool $tool): array
    {
        return $this->executeSafely(function () use ($input) {
            $token = $input['file_token'];
            $text = $input['watermark_text'];
            $position = $input['position'] ?? 'bottom_right';
            $fontSize = (int) ($input['font_size'] ?? 24);

            $filePath = $this->storageService->getFilePathByToken($token);
            if (!$filePath || !file_exists($filePath)) {
                throw new Exception("Uploaded image file is expired or invalid.");
            }

            $imgInfo = @getimagesize($filePath);
            if (!$imgInfo) {
                throw new Exception("Uploaded file is not a valid image.");
            }

            $w = $imgInfo[0];
            $h = $imgInfo[1];
            $mime = $imgInfo['mime'];

            $img = match ($mime) {
                'image/jpeg' => @imagecreatefromjpeg($filePath),
                'image/png' => @imagecreatefrompng($filePath),
                'image/webp' => function_exists('imagecreatefromwebp') ? @imagecreatefromwebp($filePath) : false,
                'image/gif' => @imagecreatefromgif($filePath),
                default => false,
            };

            if (!$img) {
                throw new Exception("Unable to load image for watermarking.");
            }

            // Approximate text dimensions (built-in font 5 is ~9x15px)
            $fontWidth = imagefontwidth(5);
            $fontHeight = imagefontheight(5);
            $textWidth = strlen($text) * $fontWidth;

            $posX = match ($position) {
                'bottom_left', 'top_left' => 20,
                'center' => max(10, (int) (($w - $textWidth) / 2)),
                default => max(10, $w - $textWidth - 20),
            };

            $posY = match ($position) {
                'top_left', 'top_right' => 20,
                'center' => max(10, (int) (($h - $fontHeight) / 2)),
                default => max(10, $h - $fontHeight - 20),
            };

            $white = imagecolorallocatealpha($img, 255, 255, 255, 40);
            $black = imagecolorallocatealpha($img, 0, 0, 0, 60);

            // Shadow and main text
            imagestring($img, 5, $posX + 1, $posY + 1, $text, $black);
            imagestring($img, 5, $posX, $posY, $text, $white);

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

            $outputName = $input['output_name'] ?? ("watermarked-image.{$ext}");
            $downloadToken = $this->storageService->storeRawOutput(
                $outputData,
                $outputName,
                $outMime,
                request()?->ip()
            );

            return [
                'output' => [
                    'message' => 'Watermark added successfully',
                    'watermark_text' => $text,
                    'position' => $position,
                ],
                'download_token' => $downloadToken,
                'download_url' => route('tools.download', ['token' => $downloadToken]),
                'metadata' => [
                    'watermark' => $text,
                    'output_bytes' => strlen($outputData),
                ],
            ];
        });
    }
}
