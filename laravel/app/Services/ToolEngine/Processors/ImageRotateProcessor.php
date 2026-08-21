<?php

namespace App\Services\ToolEngine\Processors;

use App\Models\Tool;
use Exception;

class ImageRotateProcessor extends BaseToolProcessor
{
    public function getSlug(): string
    {
        return 'image-rotate';
    }

    public function getValidationRules(): array
    {
        return [
            'file_token' => 'required|string|size:64',
            'angle' => 'required|integer|in:90,180,270',
            'flip_horizontal' => 'nullable|boolean',
            'flip_vertical' => 'nullable|boolean',
            'output_name' => 'nullable|string|max:100',
        ];
    }

    public function process(array $input, Tool $tool): array
    {
        return $this->executeSafely(function () use ($input) {
            $token = $input['file_token'];
            $angle = (int) $input['angle'];
            $flipH = $input['flip_horizontal'] ?? false;
            $flipV = $input['flip_vertical'] ?? false;

            $filePath = $this->storageService->getFilePathByToken($token);
            if (!$filePath || !file_exists($filePath)) {
                throw new Exception("Uploaded image file is expired or invalid.");
            }

            $imgInfo = @getimagesize($filePath);
            if (!$imgInfo) {
                throw new Exception("Uploaded file is not a valid image.");
            }

            $mime = $imgInfo['mime'];
            $src = match ($mime) {
                'image/jpeg' => @imagecreatefromjpeg($filePath),
                'image/png' => @imagecreatefrompng($filePath),
                'image/webp' => function_exists('imagecreatefromwebp') ? @imagecreatefromwebp($filePath) : false,
                'image/gif' => @imagecreatefromgif($filePath),
                default => false,
            };

            if (!$src) {
                throw new Exception("Unable to decode image for rotation.");
            }

            // Rotate angle (GD imagerotate is counter-clockwise, so 360 - angle)
            $gdAngle = 360 - $angle;
            $rotated = imagerotate($src, $gdAngle, 0);

            if ($flipH && function_exists('imageflip')) {
                imageflip($rotated, IMG_FLIP_HORIZONTAL);
            }
            if ($flipV && function_exists('imageflip')) {
                imageflip($rotated, IMG_FLIP_VERTICAL);
            }

            ob_start();
            if ($mime === 'image/png') {
                imagealphablending($rotated, false);
                imagesavealpha($rotated, true);
                imagepng($rotated, null, 6);
                $ext = 'png';
                $outMime = 'image/png';
            } elseif ($mime === 'image/webp' && function_exists('imagewebp')) {
                imagewebp($rotated, null, 90);
                $ext = 'webp';
                $outMime = 'image/webp';
            } else {
                imagejpeg($rotated, null, 90);
                $ext = 'jpg';
                $outMime = 'image/jpeg';
            }
            $outputData = ob_get_clean();

            imagedestroy($src);
            imagedestroy($rotated);

            $outputName = $input['output_name'] ?? ("rotated-{$angle}deg.{$ext}");
            $downloadToken = $this->storageService->storeRawOutput(
                $outputData,
                $outputName,
                $outMime,
                request()?->ip()
            );

            return [
                'output' => [
                    'message' => 'Image rotated successfully',
                    'angle' => $angle,
                    'flipped_horizontal' => $flipH,
                    'flipped_vertical' => $flipV,
                ],
                'download_token' => $downloadToken,
                'download_url' => route('tools.download', ['token' => $downloadToken]),
                'metadata' => [
                    'angle' => $angle,
                    'output_bytes' => strlen($outputData),
                ],
            ];
        });
    }
}
