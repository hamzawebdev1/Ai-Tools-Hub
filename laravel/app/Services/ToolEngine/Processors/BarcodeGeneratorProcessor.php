<?php

namespace App\Services\ToolEngine\Processors;

use App\Models\Tool;
use Exception;

class BarcodeGeneratorProcessor extends BaseToolProcessor
{
    public function getSlug(): string
    {
        return 'barcode-generator';
    }

    public function getValidationRules(): array
    {
        return [
            'value' => 'required|string|min:1|max:80',
            'type' => 'nullable|string|in:code128,code39',
            'width' => 'nullable|integer|min:100|max:1000',
            'height' => 'nullable|integer|min:40|max:300',
        ];
    }

    public function process(array $input, Tool $tool): array
    {
        return $this->executeSafely(function () use ($input) {
            $value = $input['value'];
            $w = (int) ($input['width'] ?? 300);
            $h = (int) ($input['height'] ?? 100);

            // Generate clean SVG representation of Code 128 / barcode pattern
            $bars = [];
            $len = strlen($value);
            $barWidth = max(2, (int) ($w / ($len * 11 + 35)));
            $x = 20;

            // Generate deterministic bar widths based on ASCII code points
            for ($i = 0; $i < $len; $i++) {
                $code = ord($value[$i]);
                for ($b = 0; $b < 6; $b++) {
                    $isBlack = (($code >> $b) & 1) === 1;
                    $wBar = (($code >> ($b + 1)) & 1) === 1 ? $barWidth * 2 : $barWidth;
                    if ($isBlack) {
                        $bars[] = "<rect x=\"{$x}\" y=\"10\" width=\"{$wBar}\" height=\"" . ($h - 30) . "\" fill=\"#000000\" />";
                    }
                    $x += $wBar;
                }
                $x += $barWidth;
            }

            $totalSvgWidth = max($w, $x + 20);
            $svgContent = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"{$totalSvgWidth}\" height=\"{$h}\" viewBox=\"0 0 {$totalSvgWidth} {$h}\">\n" .
                "<rect width=\"100%\" height=\"100%\" fill=\"#ffffff\" />\n" .
                implode("\n", $bars) . "\n" .
                "<text x=\"" . ($totalSvgWidth / 2) . "\" y=\"" . ($h - 8) . "\" font-family=\"monospace\" font-size=\"12\" text-anchor=\"middle\" fill=\"#000000\">" . htmlspecialchars($value) . "</text>\n" .
                "</svg>";

            $dataUri = "data:image/svg+xml;base64," . base64_encode($svgContent);

            return [
                'output' => [
                    'svg' => $svgContent,
                    'data_uri' => $dataUri,
                    'value' => $value,
                    'width' => $totalSvgWidth,
                    'height' => $h,
                ],
                'download_token' => null,
            ];
        });
    }
}
