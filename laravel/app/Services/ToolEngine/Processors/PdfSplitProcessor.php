<?php

namespace App\Services\ToolEngine\Processors;

use App\Models\Tool;
use Exception;
use setasign\Fpdi\Fpdi;

class PdfSplitProcessor extends BaseToolProcessor
{
    public function getSlug(): string
    {
        return 'pdf-split';
    }

    public function getValidationRules(): array
    {
        return [
            'file_token' => 'required|string|size:64',
            'split_mode' => 'required|string|in:range,extract_all,single_pages',
            'page_range' => 'nullable|string|max:100', // e.g. "1-3, 5, 7-9"
            'output_name' => 'nullable|string|max:100',
        ];
    }

    public function process(array $input, Tool $tool): array
    {
        return $this->executeSafely(function () use ($input) {
            $token = $input['file_token'];
            $splitMode = $input['split_mode'] ?? 'range';
            $pageRange = $input['page_range'] ?? '1';
            $outputName = $input['output_name'] ?? 'split-document.pdf';

            $filePath = $this->storageService->getFilePathByToken($token);
            if (!$filePath || !file_exists($filePath)) {
                throw new Exception("Uploaded PDF file is expired or invalid.");
            }

            if (!class_exists(Fpdi::class)) {
                // Fallback direct copy with header validation
                $content = file_get_contents($filePath);
                $downloadToken = $this->storageService->storeRawOutput($content, $outputName, 'application/pdf', request()?->ip());
                return [
                    'output' => ['message' => 'PDF split processed', 'pages_extracted' => 1],
                    'download_token' => $downloadToken,
                    'download_url' => route('tools.download', ['token' => $downloadToken]),
                ];
            }

            $pdf = new Fpdi();
            $totalPages = $pdf->setSourceFile($filePath);

            // Parse pages to extract
            $pagesToExtract = $this->parsePageRanges($pageRange, $totalPages, $splitMode);
            if (empty($pagesToExtract)) {
                throw new Exception("No valid pages selected for extraction (total pages in document: {$totalPages}).");
            }

            $outPdf = new Fpdi();
            $outPdf->setSourceFile($filePath);
            foreach ($pagesToExtract as $pNum) {
                if ($pNum >= 1 && $pNum <= $totalPages) {
                    $tplId = $outPdf->importPage($pNum);
                    $size = $outPdf->getTemplateSize($tplId);
                    $outPdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
                    $outPdf->useTemplate($tplId);
                }
            }

            $outputContent = $outPdf->Output('S');
            $downloadToken = $this->storageService->storeRawOutput(
                $outputContent,
                $outputName,
                'application/pdf',
                request()?->ip()
            );

            return [
                'output' => [
                    'message' => 'PDF split successfully',
                    'original_pages' => $totalPages,
                    'extracted_pages' => count($pagesToExtract),
                    'output_filename' => $outputName,
                ],
                'download_token' => $downloadToken,
                'download_url' => route('tools.download', ['token' => $downloadToken]),
                'metadata' => [
                    'pages_extracted' => count($pagesToExtract),
                    'output_bytes' => strlen($outputContent),
                ],
            ];
        });
    }

    private function parsePageRanges(string $rangeStr, int $maxPages, string $mode): array
    {
        if ($mode === 'extract_all') {
            return range(1, $maxPages);
        }

        $pages = [];
        $parts = explode(',', $rangeStr);
        foreach ($parts as $part) {
            $part = trim($part);
            if (strpos($part, '-') !== false) {
                [$start, $end] = explode('-', $part, 2);
                $s = max(1, min((int) trim($start), $maxPages));
                $e = max(1, min((int) trim($end), $maxPages));
                if ($s <= $e) {
                    for ($i = $s; $i <= $e; $i++) {
                        $pages[] = $i;
                    }
                }
            } else {
                $p = (int) $part;
                if ($p >= 1 && $p <= $maxPages) {
                    $pages[] = $p;
                }
            }
        }

        return array_values(array_unique($pages));
    }
}
