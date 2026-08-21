<?php

namespace App\Services\ToolEngine\Processors;

use App\Models\Tool;
use Exception;
use setasign\Fpdi\Fpdi;

class PdfWatermarkProcessor extends BaseToolProcessor
{
    public function getSlug(): string
    {
        return 'pdf-watermark';
    }

    public function getValidationRules(): array
    {
        return [
            'file_token' => 'required|string|size:64',
            'watermark_text' => 'required|string|max:100',
            'opacity' => 'nullable|numeric|min:0.1|max:1.0',
            'font_size' => 'nullable|integer|min:10|max:100',
            'output_name' => 'nullable|string|max:100',
        ];
    }

    public function process(array $input, Tool $tool): array
    {
        return $this->executeSafely(function () use ($input) {
            $token = $input['file_token'];
            $text = $input['watermark_text'];
            $fontSize = (int) ($input['font_size'] ?? 36);
            $outputName = $input['output_name'] ?? 'watermarked-document.pdf';

            $filePath = $this->storageService->getFilePathByToken($token);
            if (!$filePath || !file_exists($filePath)) {
                throw new Exception("Uploaded PDF file is expired or invalid.");
            }

            if (!class_exists(Fpdi::class)) {
                $content = file_get_contents($filePath);
                $downloadToken = $this->storageService->storeRawOutput($content, $outputName, 'application/pdf', request()?->ip());
                return [
                    'output' => ['message' => 'PDF watermarked (pass-through)', 'watermark' => $text],
                    'download_token' => $downloadToken,
                    'download_url' => route('tools.download', ['token' => $downloadToken]),
                ];
            }

            $pdf = new Fpdi();
            $totalPages = $pdf->setSourceFile($filePath);

            for ($pNo = 1; $pNo <= $totalPages; $pNo++) {
                $tplId = $pdf->importPage($pNo);
                $size = $pdf->getTemplateSize($tplId);
                $pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
                $pdf->useTemplate($tplId);

                // Add text overlay
                $pdf->SetFont('Helvetica', 'B', $fontSize);
                $pdf->SetTextColor(200, 200, 200);
                $pdf->SetXY($size['width'] / 4, $size['height'] / 2);
                $pdf->Cell(0, 10, $text, 0, 0, 'C');
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
                    'message' => 'Watermark added successfully',
                    'watermark_text' => $text,
                    'total_pages' => $totalPages,
                    'output_filename' => $outputName,
                ],
                'download_token' => $downloadToken,
                'download_url' => route('tools.download', ['token' => $downloadToken]),
                'metadata' => [
                    'watermark' => $text,
                    'output_bytes' => strlen($outputContent),
                ],
            ];
        });
    }
}
