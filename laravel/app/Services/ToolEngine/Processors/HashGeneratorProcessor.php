<?php

namespace App\Services\ToolEngine\Processors;

use App\Models\Tool;

class HashGeneratorProcessor extends BaseToolProcessor
{
    public function getSlug(): string
    {
        return 'hash-generator';
    }

    public function getValidationRules(): array
    {
        return [
            'text' => 'required|string|max:500000',
            'algorithm' => 'nullable|string|in:all,md5,sha1,sha256,sha512,sha3-256,sha3-512,ripemd160,crc32',
            'secret_key' => 'nullable|string|max:255',
        ];
    }

    public function process(array $input, Tool $tool): array
    {
        return $this->executeSafely(function () use ($input) {
            $text = $input['text'];
            $algo = $input['algorithm'] ?? 'all';
            $secretKey = $input['secret_key'] ?? null;

            if ($algo === 'all') {
                $hashes = [
                    'md5' => md5($text),
                    'sha1' => sha1($text),
                    'sha256' => hash('sha256', $text),
                    'sha512' => hash('sha512', $text),
                    'crc32' => hash('crc32b', $text),
                    'ripemd160' => hash('ripemd160', $text),
                ];

                if (!empty($secretKey)) {
                    $hashes['hmac_sha256'] = hash_hmac('sha256', $text, $secretKey);
                    $hashes['hmac_sha512'] = hash_hmac('sha512', $text, $secretKey);
                }

                return [
                    'output' => $hashes,
                    'metadata' => ['algorithms_calculated' => count($hashes)],
                ];
            }

            $result = !empty($secretKey) ? hash_hmac($algo, $text, $secretKey) : hash($algo, $text);

            return [
                'output' => [
                    $algo => $result,
                ],
                'metadata' => ['algorithm' => $algo],
            ];
        });
    }
}
