<?php

namespace App\Services\ToolEngine\Processors;

use App\Models\Tool;
use Exception;

class SslCertCheckerProcessor extends BaseToolProcessor
{
    public function getSlug(): string
    {
        return 'ssl-checker';
    }

    public function getValidationRules(): array
    {
        return [
            'domain' => 'required|string|max:255',
            'port' => 'nullable|integer|min:1|max:65535',
        ];
    }

    public function process(array $input, Tool $tool): array
    {
        return $this->executeSafely(function () use ($input) {
            $rawDomain = trim($input['domain']);
            $port = (int) ($input['port'] ?? 443);

            // Clean domain URL
            $host = parse_url($rawDomain, PHP_URL_HOST) ?: $rawDomain;
            $host = preg_replace('/^https?:\/\//i', '', $host);
            $host = explode('/', $host)[0];
            $host = explode(':', $host)[0];

            if (!filter_var($host, FILTER_VALIDATE_DOMAIN, FILTER_FLAG_HOSTNAME) && !filter_var($host, FILTER_VALIDATE_IP)) {
                throw new Exception("Invalid domain name or hostname provided.");
            }

            $g = stream_context_create([
                "ssl" => [
                    "capture_peer_cert" => true,
                    "verify_peer" => false,
                    "verify_peer_name" => false,
                ]
            ]);

            $errno = 0;
            $errstr = '';
            $timeout = 5;
            $client = @stream_socket_client(
                "ssl://{$host}:{$port}",
                $errno,
                $errstr,
                $timeout,
                STREAM_CLIENT_CONNECT,
                $g
            );

            if (!$client) {
                throw new Exception("Could not connect to {$host}:{$port} over SSL: {$errstr} ({$errno})");
            }

            $params = stream_context_get_params($client);
            fclose($client);

            if (empty($params['options']['ssl']['peer_certificate'])) {
                throw new Exception("No peer SSL certificate retrieved from host.");
            }

            $cert = openssl_x509_parse($params['options']['ssl']['peer_certificate']);
            if (!$cert) {
                throw new Exception("Unable to parse SSL certificate payload.");
            }

            $validFrom = isset($cert['validFrom_time_t']) ? date('Y-m-d H:i:s T', $cert['validFrom_time_t']) : null;
            $validTo = isset($cert['validTo_time_t']) ? date('Y-m-d H:i:s T', $cert['validTo_time_t']) : null;
            $daysRemaining = isset($cert['validTo_time_t']) ? (int) round(($cert['validTo_time_t'] - time()) / 86400) : 0;
            $isExpired = $daysRemaining < 0;

            return [
                'output' => [
                    'domain' => $host,
                    'port' => $port,
                    'common_name' => $cert['subject']['CN'] ?? $host,
                    'issuer' => $cert['issuer']['O'] ?? ($cert['issuer']['CN'] ?? 'Unknown Issuer'),
                    'valid_from' => $validFrom,
                    'valid_to' => $validTo,
                    'days_remaining' => $daysRemaining,
                    'is_expired' => $isExpired,
                    'signature_type' => $cert['signatureTypeSN'] ?? 'RSA-SHA256',
                    'san' => isset($cert['extensions']['subjectAltName']) ? explode(', ', $cert['extensions']['subjectAltName']) : [],
                ],
                'download_token' => null,
            ];
        });
    }
}
