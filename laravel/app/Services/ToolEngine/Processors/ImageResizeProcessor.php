<?php

namespace App\Services\ToolEngine\Processors;

use App\Models\Tool;
use Exception;

class ImageResizeProcessor extends BaseToolProcessor
{
    public function getSlug(): string
    {
        return 'image-resize';
    }

    public function getValidationRules(): array
    {
        return [
            'file_token' => 'required|string|size:64',
            'width' => 'nullable|integer|min:1|max:8192',
            'height' => 'nullable|integer|min:1|max:8192',
            'maintain_aspect_ratio' => 'nullable|boolean',
            'quality' => 'nullable|integer|min:10|max:100',
            'output_name' => 'nullable|string|max:100',
        ];
    }

    public function process(array $input, Tool $tool): array
    {
        return $this->executeSafely(function () use ($input) {
            $token = $input['file_token'];
            $reqW = !empty($input['width']) ? (int) $input['width'] : null;
            $reqH = !empty($input['height']) ? (int) $input['height'] : null;
            $maintainAspect = $input['maintain_aspect_ratio'] ?? true;
            $quality = (int) ($input['quality'] ?? 90);

            $filePath = $this->storageService->getFilePathByToken($token);
            if (!$filePath || !file_exists($filePath)) {
                throw new Exception("Uploaded image file is expired or invalid.");
            }

            $imgInfo = @getimagesize($filePath);
            if (!$imgInfo) {
                throw new Exception("Uploaded file is not a valid recognized image format.");
            }

            $origW = $imgInfo[0];
            $origH = $imgInfo[1];
            $mime = $imgInfo['mime'];

            if (!$reqW && !$reqH) {
                throw new Exception("Please specify target width or height for resizing.");
            }

            // Compute target dimensions
            if ($maintainAspect) {
                if ($reqW && !$reqH) {
                    $targetW = $reqW;
                    $targetH = (int) round(($origH / $origW) * $reqW);
                } elseif (!$reqW && $reqH) {
                    $targetH = $reqH;
                    $targetW = (int) round(($origW / $origH) * $reqH);
                } else {
                    $scale = min($reqW / $origW, $reqH / $origH);
                    $targetW = (int) round($origW * $scale);
                    $targetH = (int) round($origH * $scale);
                }
            } else {
                $targetW = $reqW ?: $origW;
                $targetH = $reqH ?: $origH;
            }

            $src = match ($mime) {
                'image/jpeg' => @imagecreatefromjpeg($filePath),
                'image/png' => @imagecreatefrompng($filePath),
                'image/webp' => function_exists('imagecreatefromwebp') ? @imagecreatefromwebp($filePath) : false,
                'image/gif' => @imagecreatefromgif($filePath),
                default => false,
            };

            if (!$src) {
                throw new Exception("Unable to load source image for resizing.");
            }

            $dst = imagecreatetruecolor($targetW, $targetH);
            if ($mime === 'image/png' || $mime === 'image/webp') {
                imagealphablending($dst, false);
                imagesavealpha($dst, true);
                $transparent = imagecolorallocatealpha($dst, 255, 255, 255, 127);
                imagefilledrectangle($dst, 0, 0, $targetW, $targetH, $transparent);
            }

            imagecopyresampled($dst, $src, 0, 0, 0, 0, $targetW, $targetH, $origW, $origH);

            ob_start();
            if ($mime === 'image/png') {
                imagepng($dst, null, 6);
                $ext = 'png';
                $outMime = 'image/png';
            } elseif ($mime === 'image/webp' && function_exists('imagewebp')) {
                imagewebp($dst, null, $quality);
                $ext = 'webp';
                $outMime = 'image/webp';
            } else {
                imagejpeg($dst, null, $quality);
                $ext = 'jpg';
                $outMime = 'image/jpeg';
            }
            $outputData = ob_get_clean();

            imagedestroy($src);
            imagedestroy($dst);

            $outputName = $input['output_name'] ?? ("resized-{$targetW}x{$targetH}.{$ext}");
            $downloadToken = $this->storageService->storeRawOutput(
                $outputData,
                $outputName,
                $outMime,
                request()?->ip()
            );

            return [
                'output' => [
                    'message' => 'Image resized successfully',
                    'original_dimensions' => "{$origW}x{$origH}",
                    'target_dimensions' => "{$targetW}x{$targetH}",
                    'output_filename' => $outputName,
                ],
                'download_token' => $downloadToken,
                'download_url' => route('tools.download', ['token' => $downloadToken]),
                'metadata' => [
                    'width' => $targetW,
                    'height' => $targetH,
                    'output_bytes' => strlen($outputData),
                ],
            ];
        });
    }
}
