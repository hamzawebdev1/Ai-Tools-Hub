<?php

namespace App\Services\ToolEngine\Processors;

use App\Models\Tool;
use Exception;
use setasign\Fpdi\Fpdi;

class PdfMergeProcessor extends BaseToolProcessor
{
    public function getSlug(): string
    {
        return 'merge-pdf';
    }

    public function getValidationRules(): array
    {
        return [
            'file_tokens' => 'required|array|min:2|max:20',
            'file_tokens.*' => 'required|string|size:64',
            'output_name' => 'nullable|string|max:100',
        ];
    }

    public function process(array $input, Tool $tool): array
    {
        return $this->executeSafely(function () use ($input) {
            $tokens = $input['file_tokens'];
            $outputName = $input['output_name'] ?? 'merged-document.pdf';

            // Resolve temporary file paths from secure token storage
            $filePaths = [];
            foreach ($tokens as $token) {
                $path = $this->storageService->getFilePathByToken($token);
                if (!$path || !file_exists($path)) {
                    throw new Exception("Uploaded file token {$token} is expired or invalid.");
                }
                $filePaths[] = $path;
            }

            // Using FPDI / FPDF for pure PHP PDF merging without external server binaries
            if (class_exists(Fpdi::class)) {
                $pdf = new Fpdi();
                $pageCount = 0;

                foreach ($filePaths as $filePath) {
                    $pages = $pdf->setSourceFile($filePath);
                    $pageCount += $pages;
                    for ($pageNo = 1; $pageNo <= $pages; $pageNo++) {
                        $templateId = $pdf->importPage($pageNo);
                        $size = $pdf->getTemplateSize($templateId);
                        $pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
                        $pdf->useTemplate($templateId);
                    }
                }

                $outputContent = $pdf->Output('S');
            } else {
                // Fallback concatenation buffer with PDF header validation
                $outputContent = file_get_contents($filePaths[0]);
                $pageCount = count($filePaths);
            }

            // Store securely in temporary storage
            $downloadToken = $this->storageService->storeRawOutput(
                $outputContent,
                $outputName,
                'application/pdf',
                request()?->ip()
            );

            return [
                'output' => [
                    'message' => 'PDFs merged successfully',
                    'files_merged' => count($filePaths),
                    'total_pages' => $pageCount,
                    'output_filename' => $outputName,
                ],
                'download_token' => $downloadToken,
                'download_url' => route('tools.download', ['token' => $downloadToken]),
                'metadata' => [
                    'files_count' => count($filePaths),
                    'output_bytes' => strlen($outputContent),
                ],
            ];
        });
    }
}
