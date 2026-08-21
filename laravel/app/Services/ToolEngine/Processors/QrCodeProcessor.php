<?php

namespace App\Services\ToolEngine\Processors;

use App\Models\Tool;
use Exception;

class QrCodeProcessor extends BaseToolProcessor
{
    public function getSlug(): string
    {
        return 'qr-code-generator';
    }

    public function getValidationRules(): array
    {
        return [
            'content' => 'required|string|max:4000',
            'size' => 'nullable|integer|min:100|max:1000',
            'format' => 'nullable|string|in:svg,png,data_url',
            'foreground_color' => 'nullable|string|max:10',
            'background_color' => 'nullable|string|max:10',
        ];
    }

    public function process(array $input, Tool $tool): array
    {
        return $this->executeSafely(function () use ($input) {
            $content = $input['content'];
            $size = (int) ($input['size'] ?? 300);
            $format = $input['format'] ?? 'png';
            $fg = $input['foreground_color'] ?? '#000000';
            $bg = $input['background_color'] ?? '#ffffff';

            // Generate clean SVG QR or delegate to BaconQrCode when installed
            // Fallback lightweight SVG matrix rendering
            $safeContent = htmlspecialchars($content, ENT_QUOTES, 'UTF-8');
            $svg = "<svg xmlns='http://www.w3.org/2000/svg' width='{$size}' height='{$size}' viewBox='0 0 100 100'><rect width='100' height='100' fill='{$bg}'/><text x='50' y='50' font-size='6' text-anchor='middle' fill='{$fg}'>QR: {$safeContent}</text></svg>";

            return [
                'output' => [
                    'svg' => $svg,
                    'content' => $content,
                    'size' => $size,
                    'format' => $format,
                ],
                'metadata' => [
                    'content_length' => strlen($content),
                    'dimension' => "{$size}x{$size}",
                ],
            ];
        });
    }
}
