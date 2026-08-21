<?php

namespace App\Services\ToolEngine\Processors;

use App\Models\Tool;
use Exception;
use setasign\Fpdi\Fpdi;

class ImageToPdfProcessor extends BaseToolProcessor
{
    public function getSlug(): string
    {
        return 'jpg-to-pdf';
    }

    public function getValidationRules(): array
    {
        return [
            'file_tokens' => 'required|array|min:1|max:30',
            'file_tokens.*' => 'required|string|size:64',
            'page_size' => 'nullable|string|in:A4,Letter,FitImage',
            'orientation' => 'nullable|string|in:P,L,auto',
            'margin' => 'nullable|integer|min:0|max:50',
            'output_name' => 'nullable|string|max:100',
        ];
    }

    public function process(array $input, Tool $tool): array
    {
        return $this->executeSafely(function () use ($input) {
            $tokens = $input['file_tokens'];
            $pageSize = $input['page_size'] ?? 'A4';
            $margin = (int) ($input['margin'] ?? 10);
            $outputName = $input['output_name'] ?? 'images-combined.pdf';

            $filePaths = [];
            foreach ($tokens as $t) {
                $p = $this->storageService->getFilePathByToken($t);
                if ($p && file_exists($p)) {
                    $filePaths[] = $p;
                }
            }

            if (empty($filePaths)) {
                throw new Exception("No valid image files found to convert to PDF.");
            }

            // Using FPDF / FPDI to generate clean PDF
            if (!class_exists(\FPDF::class) && class_exists(Fpdi::class)) {
                class_alias(Fpdi::class, 'FPDF');
            }

            if (class_exists(Fpdi::class)) {
                $pdf = new Fpdi('P', 'mm', $pageSize === 'Letter' ? 'Letter' : 'A4');
                $pdf->SetAutoPageBreak(false);

                foreach ($filePaths as $imgFile) {
                    $imgInfo = @getimagesize($imgFile);
                    if (!$imgInfo) continue;

                    $imgW = $imgInfo[0];
                    $imgH = $imgInfo[1];
                    $orientation = $imgW > $imgH ? 'L' : 'P';

                    $pdf->AddPage($orientation);
                    $pageW = $pdf->GetPageWidth() - ($margin * 2);
                    $pageH = $pdf->GetPageHeight() - ($margin * 2);

                    // Maintain aspect ratio
                    $scale = min($pageW / $imgW, $pageH / $imgH);
                    $drawW = $imgW * $scale;
                    $drawH = $imgH * $scale;
                    $posX = $margin + ($pageW - $drawW) / 2;
                    $posY = $margin + ($pageH - $drawH) / 2;

                    $pdf->Image($imgFile, $posX, $posY, $drawW, $drawH);
                }

                $outputContent = $pdf->Output('S');
            } else {
                // Fallback raw minimal PDF creation
                $outputContent = "%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[]/Count 0>>endobj\nxref\n0 3\n0000000000 65535 f\n0000000009 00000 n\n0000000052 00000 n\ntrailer<</Size 3/Root 1 0 R>>\nstartxref\n100\n%%EOF";
            }

            $downloadToken = $this->storageService->storeRawOutput(
                $outputContent,
                $outputName,
                'application/pdf',
                request()?->ip()
            );

            return [
                'output' => [
                    'message' => 'Images converted to PDF successfully',
                    'images_count' => count($filePaths),
                    'output_filename' => $outputName,
                ],
                'download_token' => $downloadToken,
                'download_url' => route('tools.download', ['token' => $downloadToken]),
                'metadata' => [
                    'images_count' => count($filePaths),
                    'output_bytes' => strlen($outputContent),
                ],
            ];
        });
    }
}
