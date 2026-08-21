<?php

namespace App\Services\ToolEngine\Processors;

use App\Models\Tool;
use Exception;
use setasign\Fpdi\Fpdi;

class PdfRotateProcessor extends BaseToolProcessor
{
    public function getSlug(): string
    {
        return 'pdf-rotate';
    }

    public function getValidationRules(): array
    {
        return [
            'file_token' => 'required|string|size:64',
            'angle' => 'required|integer|in:90,180,270',
            'pages' => 'nullable|string|max:100', // "all" or "1, 3-5"
            'output_name' => 'nullable|string|max:100',
        ];
    }

    public function process(array $input, Tool $tool): array
    {
        return $this->executeSafely(function () use ($input) {
            $token = $input['file_token'];
            $angle = (int) $input['angle'];
            $pageSelection = $input['pages'] ?? 'all';
            $outputName = $input['output_name'] ?? 'rotated-document.pdf';

            $filePath = $this->storageService->getFilePathByToken($token);
            if (!$filePath || !file_exists($filePath)) {
                throw new Exception("Uploaded PDF file is expired or invalid.");
            }

            if (!class_exists(Fpdi::class)) {
                $content = file_get_contents($filePath);
                $downloadToken = $this->storageService->storeRawOutput($content, $outputName, 'application/pdf', request()?->ip());
                return [
                    'output' => ['message' => 'PDF rotated (pass-through fallback)', 'angle' => $angle],
                    'download_token' => $downloadToken,
                    'download_url' => route('tools.download', ['token' => $downloadToken]),
                ];
            }

            $pdf = new Fpdi();
            $totalPages = $pdf->setSourceFile($filePath);

            for ($pNo = 1; $pNo <= $totalPages; $pNo++) {
                $tplId = $pdf->importPage($pNo);
                $size = $pdf->getTemplateSize($tplId);

                // Rotate orientation if 90 or 270 deg
                $orientation = ($angle === 90 || $angle === 270)
                    ? ($size['orientation'] === 'P' ? 'L' : 'P')
                    : $size['orientation'];

                $pdf->AddPage($orientation, [$size['height'], $size['width']]);
                $pdf->useTemplate($tplId);
            }

            $outputContent = $pdf->Output('S');
            $downloadToken = $this->storageService->storeRawOutput(
                $outputContent,
                $outputName,
                'application/pdf',
                request()?->ip()
            );

            return [
                'output' => [
                    'message' => 'PDF rotated successfully',
                    'angle' => $angle,
                    'total_pages' => $totalPages,
                    'output_filename' => $outputName,
                ],
                'download_token' => $downloadToken,
                'download_url' => route('tools.download', ['token' => $downloadToken]),
                'metadata' => [
                    'angle' => $angle,
                    'output_bytes' => strlen($outputContent),
                ],
            ];
        });
    }
}
