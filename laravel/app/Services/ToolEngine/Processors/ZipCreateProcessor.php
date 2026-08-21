<?php

namespace App\Services\ToolEngine\Processors;

use App\Models\Tool;
use Exception;
use ZipArchive;

class ZipCreateProcessor extends BaseToolProcessor
{
    public function getSlug(): string
    {
        return 'zip-files';
    }

    public function getValidationRules(): array
    {
        return [
            'file_tokens' => 'required|array|min:1|max:50',
            'file_tokens.*' => 'required|string|size:64',
            'zip_name' => 'nullable|string|max:100',
        ];
    }

    public function process(array $input, Tool $tool): array
    {
        return $this->executeSafely(function () use ($input) {
            $tokens = $input['file_tokens'];
            $zipName = $input['zip_name'] ?? 'archive.zip';
            if (!str_ends_with($zipName, '.zip')) {
                $zipName .= '.zip';
            }

            $tmpZip = tempnam(sys_get_temp_dir(), 'zip_');
            $zip = new ZipArchive();
            if ($zip->open($tmpZip, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
                throw new Exception("Unable to create zip file on server.");
            }

            $addedFiles = 0;
            foreach ($tokens as $token) {
                $filePath = $this->storageService->getFilePathByToken($token);
                if ($filePath && file_exists($filePath)) {
                    $entryName = basename($filePath);
                    $zip->addFile($filePath, $entryName);
                    $addedFiles++;
                }
            }

            $zip->close();

            if ($addedFiles === 0) {
                @unlink($tmpZip);
                throw new Exception("No valid files could be packaged into the zip archive.");
            }

            $zipContent = file_get_contents($tmpZip);
            @unlink($tmpZip);

            $downloadToken = $this->storageService->storeRawOutput(
                $zipContent,
                $zipName,
                'application/zip',
                request()?->ip()
            );

            return [
                'output' => [
                    'message' => 'ZIP archive created successfully',
                    'files_compressed' => $addedFiles,
                    'archive_name' => $zipName,
                ],
                'download_token' => $downloadToken,
                'download_url' => route('tools.download', ['token' => $downloadToken]),
                'metadata' => [
                    'files_count' => $addedFiles,
                    'output_bytes' => strlen($zipContent),
                ],
            ];
        });
    }
}
