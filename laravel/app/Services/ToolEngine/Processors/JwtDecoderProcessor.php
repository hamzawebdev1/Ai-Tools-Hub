<?php

namespace App\Services\ToolEngine\Processors;

use App\Models\Tool;
use Exception;

class JwtDecoderProcessor extends BaseToolProcessor
{
    public function getSlug(): string
    {
        return 'jwt-decoder';
    }

    public function getValidationRules(): array
    {
        return [
            'jwt_token' => 'required|string|max:10000',
        ];
    }

    public function process(array $input, Tool $tool): array
    {
        return $this->executeSafely(function () use ($input) {
            $jwt = trim($input['jwt_token']);
            $parts = explode('.', $jwt);

            if (count($parts) < 2) {
                throw new Exception("Invalid JWT format: A JSON Web Token must contain at least a header and payload separated by a dot.");
            }

            $b64UrlDecode = function ($data) {
                $remainder = strlen($data) % 4;
                if ($remainder) {
                    $data .= str_repeat('=', 4 - $remainder);
                }
                return base64_decode(strtr($data, '-_', '+/'));
            };

            $headerJson = $b64UrlDecode($parts[0]);
            $payloadJson = $b64UrlDecode($parts[1]);

            $header = json_decode($headerJson, true);
            $payload = json_decode($payloadJson, true);

            if ($header === null || $payload === null) {
                throw new Exception("Unable to decode JWT header or payload JSON.");
            }

            // Inspect standard timestamps
            $issuedAt = isset($payload['iat']) ? date('Y-m-d H:i:s T', (int) $payload['iat']) : null;
            $expiresAt = isset($payload['exp']) ? date('Y-m-d H:i:s T', (int) $payload['exp']) : null;
            $isExpired = isset($payload['exp']) ? (time() > (int) $payload['exp']) : false;

            return [
                'output' => [
                    'header' => $header,
                    'payload' => $payload,
                    'signature_present' => isset($parts[2]) && !empty($parts[2]),
                    'issued_at' => $issuedAt,
                    'expires_at' => $expiresAt,
                    'is_expired' => $isExpired,
                ],
                'download_token' => null,
            ];
        });
    }
}
