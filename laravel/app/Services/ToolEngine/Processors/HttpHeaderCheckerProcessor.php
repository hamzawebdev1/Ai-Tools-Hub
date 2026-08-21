<?php

namespace App\Services\ToolEngine\Processors;

use App\Models\Tool;
use Exception;

class HttpHeaderCheckerProcessor extends BaseToolProcessor
{
    public function getSlug(): string
    {
        return 'http-header-checker';
    }

    public function getValidationRules(): array
    {
        return [
            'url' => 'required|url|max:500',
            'user_agent' => 'nullable|string|max:200',
        ];
    }

    public function process(array $input, Tool $tool): array
    {
        return $this->executeSafely(function () use ($input) {
            $targetUrl = trim($input['url']);
            $host = parse_url($targetUrl, PHP_URL_HOST);

            // SSRF Protection: forbid localhost / loopback / private IP
            $ip = @gethostbyname($host);
            if ($ip && filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) === false) {
                throw new Exception("Access to private/local network address {$ip} is forbidden.");
            }

            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $targetUrl);
            curl_setopt($ch, CURLOPT_HEADER, true);
            curl_setopt($ch, CURLOPT_NOBODY, true); // HEAD request
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_TIMEOUT, 6);
            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
            curl_setopt($ch, CURLOPT_MAXREDIRS, 3);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ToolsHub/1.0');

            $rawHeaders = curl_exec($ch);
            $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $totalTime = curl_getinfo($ch, CURLINFO_TOTAL_TIME);
            $effectiveUrl = curl_getinfo($ch, CURLINFO_EFFECTIVE_URL);
            $curlError = curl_error($ch);
            curl_close($ch);

            if ($curlError) {
                throw new Exception("HTTP request failed: " . $curlError);
            }

            // Parse response header lines
            $headersList = [];
            $lines = explode("\r\n", $rawHeaders);
            foreach ($lines as $line) {
                if (strpos($line, ':') !== false) {
                    [$name, $value] = explode(':', $line, 2);
                    $headersList[trim($name)] = trim($value);
                }
            }

            // Security checks
            $hasHsts = isset($headersList['Strict-Transport-Security']);
            $hasCsp = isset($headersList['Content-Security-Policy']);
            $hasXFrame = isset($headersList['X-Frame-Options']);
            $hasXContentType = isset($headersList['X-Content-Type-Options']);

            return [
                'output' => [
                    'status_code' => $statusCode,
                    'effective_url' => $effectiveUrl,
                    'response_time_sec' => round($totalTime, 3),
                    'headers' => $headersList,
                    'security_analysis' => [
                        'hsts' => $hasHsts,
                        'content_security_policy' => $hasCsp,
                        'x_frame_options' => $hasXFrame,
                        'x_content_type_options' => $hasXContentType,
                    ],
                ],
                'download_token' => null,
            ];
        });
    }
}
