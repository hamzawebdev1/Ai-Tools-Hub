<?php

namespace App\Services\ToolEngine\Processors;

use App\Models\Tool;
use Exception;
use ZipArchive;

class FaviconGeneratorProcessor extends BaseToolProcessor
{
    public function getSlug(): string
    {
        return 'favicon-generator';
    }

    public function getValidationRules(): array
    {
        return [
            'file_token' => 'required|string|size:64',
            'output_name' => 'nullable|string|max:100',
        ];
    }

    public function process(array $input, Tool $tool): array
    {
        return $this->executeSafely(function () use ($input) {
            $token = $input['file_token'];
            $outputName = $input['output_name'] ?? 'favicon-pack.zip';

            $filePath = $this->storageService->getFilePathByToken($token);
            if (!$filePath || !file_exists($filePath)) {
                throw new Exception("Uploaded logo/image is expired or invalid.");
            }

            $imgInfo = @getimagesize($filePath);
            if (!$imgInfo) {
                throw new Exception("Uploaded file is not a valid image.");
            }

            $mime = $imgInfo['mime'];
            $origW = $imgInfo[0];
            $origH = $imgInfo[1];

            $src = match ($mime) {
                'image/jpeg' => @imagecreatefromjpeg($filePath),
                'image/png' => @imagecreatefrompng($filePath),
                'image/webp' => function_exists('imagecreatefromwebp') ? @imagecreatefromwebp($filePath) : false,
                'image/gif' => @imagecreatefromgif($filePath),
                default => false,
            };

            if (!$src) {
                throw new Exception("Unable to decode image for favicon generation.");
            }

            $sizes = [16, 32, 48, 64, 180, 192, 512];
            $generatedImages = [];

            foreach ($sizes as $s) {
                $dst = imagecreatetruecolor($s, $s);
                imagealphablending($dst, false);
                imagesavealpha($dst, true);
                $transparent = imagecolorallocatealpha($dst, 255, 255, 255, 127);
                imagefilledrectangle($dst, 0, 0, $s, $s, $transparent);

                imagecopyresampled($dst, $src, 0, 0, 0, 0, $s, $s, $origW, $origH);

                ob_start();
                imagepng($dst, null, 9);
                $pngData = ob_get_clean();
                imagedestroy($dst);

                $generatedImages["favicon-{$s}x{$s}.png"] = $pngData;
                if ($s === 32) {
                    $generatedImages["favicon.ico"] = $pngData;
                }
                if ($s === 180) {
                    $generatedImages["apple-touch-icon.png"] = $pngData;
                }
            }

            imagedestroy($src);

            // Pack all favicon sizes into a standard ZIP archive
            $tmpZip = tempnam(sys_get_temp_dir(), 'fav_');
            $zip = new ZipArchive();
            if ($zip->open($tmpZip, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
                throw new Exception("Unable to initialize ZIP archive for favicon pack.");
            }

            foreach ($generatedImages as $filename => $bytes) {
                $zip->addFromString($filename, $bytes);
            }

            // Add HTML integration snippet
            $htmlSnippet = "<!-- Favicon HTML Tags -->\n" .
                "<link rel=\"icon\" type=\"image/png\" sizes=\"32x32\" href=\"/favicon-32x32.png\">\n" .
                "<link rel=\"icon\" type=\"image/png\" sizes=\"16x16\" href=\"/favicon-16x16.png\">\n" .
                "<link rel=\"apple-touch-icon\" sizes=\"180x180\" href=\"/apple-touch-icon.png\">\n";
            $zip->addFromString("README_HTML_TAGS.html", $htmlSnippet);
            $zip->close();

            $zipContent = file_get_contents($tmpZip);
            @unlink($tmpZip);

            $downloadToken = $this->storageService->storeRawOutput(
                $zipContent,
                $outputName,
                'application/zip',
                request()?->ip()
            );

            return [
                'output' => [
                    'message' => 'Favicon icon pack generated successfully',
                    'sizes_included' => array_keys($generatedImages),
                    'output_filename' => $outputName,
                ],
                'download_token' => $downloadToken,
                'download_url' => route('tools.download', ['token' => $downloadToken]),
                'metadata' => [
                    'icons_count' => count($generatedImages),
                    'output_bytes' => strlen($zipContent),
                ],
            ];
        });
    }
}
