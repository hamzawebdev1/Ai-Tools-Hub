<?php

namespace App\Services\ToolEngine\Processors;

use App\Models\Tool;
use Exception;
use setasign\Fpdi\Fpdi;

class PdfPageNumberProcessor extends BaseToolProcessor
{
    public function getSlug(): string
    {
        return 'pdf-page-numbers';
    }

    public function getValidationRules(): array
    {
        return [
            'file_token' => 'required|string|size:64',
            'position' => 'required|string|in:bottom_center,bottom_right,bottom_left,top_center,top_right',
            'format' => 'required|string|in:number_only,page_x_of_y,custom',
            'start_number' => 'nullable|integer|min:1|max:1000',
            'output_name' => 'nullable|string|max:100',
        ];
    }

    public function process(array $input, Tool $tool): array
    {
        return $this->executeSafely(function () use ($input) {
            $token = $input['file_token'];
            $position = $input['position'] ?? 'bottom_center';
            $format = $input['format'] ?? 'page_x_of_y';
            $startNum = (int) ($input['start_number'] ?? 1);
            $outputName = $input['output_name'] ?? 'numbered-document.pdf';

            $filePath = $this->storageService->getFilePathByToken($token);
            if (!$filePath || !file_exists($filePath)) {
                throw new Exception("Uploaded PDF file is expired or invalid.");
            }

            if (!class_exists(Fpdi::class)) {
                $content = file_get_contents($filePath);
                $downloadToken = $this->storageService->storeRawOutput($content, $outputName, 'application/pdf', request()?->ip());
                return [
                    'output' => ['message' => 'Page numbers added (pass-through)'],
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

                $currentDisplayNum = $startNum + $pNo - 1;
                $pageLabel = $format === 'page_x_of_y' 
                    ? "Page {$currentDisplayNum} of {$totalPages}" 
                    : "{$currentDisplayNum}";

                $pdf->SetFont('Helvetica', '', 10);
                $pdf->SetTextColor(100, 100, 100);

                $yPos = str_starts_with($position, 'top') ? 10 : ($size['height'] - 15);
                $align = str_ends_with($position, 'right') ? 'R' : (str_ends_with($position, 'left') ? 'L' : 'C');

                $pdf->SetXY(15, $yPos);
                $pdf->Cell($size['width'] - 30, 10, $pageLabel, 0, 0, $align);
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
                    'message' => 'Page numbers added successfully',
                    'total_pages' => $totalPages,
                    'format' => $format,
                    'output_filename' => $outputName,
                ],
                'download_token' => $downloadToken,
                'download_url' => route('tools.download', ['token' => $downloadToken]),
                'metadata' => [
                    'total_pages' => $totalPages,
                    'output_bytes' => strlen($outputContent),
                ],
            ];
        });
    }
}
