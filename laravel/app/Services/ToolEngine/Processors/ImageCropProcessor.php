<?php

namespace App\Services\ToolEngine\Processors;

use App\Models\Tool;
use Exception;

class ImageCropProcessor extends BaseToolProcessor
{
    public function getSlug(): string
    {
        return 'image-crop';
    }

    public function getValidationRules(): array
    {
        return [
            'file_token' => 'required|string|size:64',
            'x' => 'required|integer|min:0',
            'y' => 'required|integer|min:0',
            'width' => 'required|integer|min:1|max:8192',
            'height' => 'required|integer|min:1|max:8192',
            'quality' => 'nullable|integer|min:10|max:100',
            'output_name' => 'nullable|string|max:100',
        ];
    }

    public function process(array $input, Tool $tool): array
    {
        return $this->executeSafely(function () use ($input) {
            $token = $input['file_token'];
            $cropX = (int) $input['x'];
            $cropY = (int) $input['y'];
            $cropW = (int) $input['width'];
            $cropH = (int) $input['height'];
            $quality = (int) ($input['quality'] ?? 90);

            $filePath = $this->storageService->getFilePathByToken($token);
            if (!$filePath || !file_exists($filePath)) {
                throw new Exception("Uploaded image file is expired or invalid.");
            }

            $imgInfo = @getimagesize($filePath);
            if (!$imgInfo) {
                throw new Exception("Uploaded file is not a valid image.");
            }

            $origW = $imgInfo[0];
            $origH = $imgInfo[1];
            $mime = $imgInfo['mime'];

            // Boundary validation
            if ($cropX + $cropW > $origW || $cropY + $cropH > $origH) {
                $cropW = min($cropW, $origW - $cropX);
                $cropH = min($cropH, $origH - $cropY);
            }

            $src = match ($mime) {
                'image/jpeg' => @imagecreatefromjpeg($filePath),
                'image/png' => @imagecreatefrompng($filePath),
                'image/webp' => function_exists('imagecreatefromwebp') ? @imagecreatefromwebp($filePath) : false,
                'image/gif' => @imagecreatefromgif($filePath),
                default => false,
            };

            if (!$src) {
                throw new Exception("Unable to decode image for cropping.");
            }

            $dst = imagecreatetruecolor($cropW, $cropH);
            if ($mime === 'image/png' || $mime === 'image/webp') {
                imagealphablending($dst, false);
                imagesavealpha($dst, true);
            }

            imagecopyresampled($dst, $src, 0, 0, $cropX, $cropY, $cropW, $cropH, $cropW, $cropH);

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

            $outputName = $input['output_name'] ?? ("cropped-{$cropW}x{$cropH}.{$ext}");
            $downloadToken = $this->storageService->storeRawOutput(
                $outputData,
                $outputName,
                $outMime,
                request()?->ip()
            );

            return [
                'output' => [
                    'message' => 'Image cropped successfully',
                    'crop_box' => ['x' => $cropX, 'y' => $cropY, 'width' => $cropW, 'height' => $cropH],
                    'output_filename' => $outputName,
                ],
                'download_token' => $downloadToken,
                'download_url' => route('tools.download', ['token' => $downloadToken]),
                'metadata' => [
                    'width' => $cropW,
                    'height' => $cropH,
                    'output_bytes' => strlen($outputData),
                ],
            ];
        });
    }
}
