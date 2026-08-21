<?php

namespace App\Services\ToolEngine\Processors;

use App\Models\Tool;
use Exception;

class AesEncryptProcessor extends BaseToolProcessor
{
    public function getSlug(): string
    {
        return 'aes-encrypt-decrypt';
    }

    public function getValidationRules(): array
    {
        return [
            'mode' => 'required|string|in:encrypt,decrypt',
            'text' => 'required|string|max:100000',
            'secret_key' => 'required|string|min:4|max:255',
            'cipher' => 'nullable|string|in:aes-256-cbc,aes-128-cbc,aes-256-gcm',
        ];
    }

    public function process(array $input, Tool $tool): array
    {
        return $this->executeSafely(function () use ($input) {
            $mode = $input['mode'];
            $text = $input['text'];
            $key = hash('sha256', $input['secret_key'], true); // 32-byte key
            $cipher = 'aes-256-cbc';

            if ($mode === 'encrypt') {
                $ivLen = openssl_cipher_iv_length($cipher);
                $iv = openssl_random_pseudo_bytes($ivLen);
                $encrypted = openssl_encrypt($text, $cipher, $key, OPENSSL_RAW_DATA, $iv);

                if ($encrypted === false) {
                    throw new Exception("Encryption failed.");
                }

                $combined = $iv . $encrypted;
                $b64Output = base64_encode($combined);

                return [
                    'output' => [
                        'encrypted_base64' => $b64Output,
                        'cipher' => $cipher,
                        'mode' => 'encrypt',
                    ],
                    'download_token' => null,
                ];
            } else {
                $raw = base64_decode($text, true);
                if (!$raw) {
                    throw new Exception("Input is not valid Base64 encoded encrypted data.");
                }

                $ivLen = openssl_cipher_iv_length($cipher);
                if (strlen($raw) < $ivLen) {
                    throw new Exception("Ciphertext too short for IV extraction.");
                }

                $iv = substr($raw, 0, $ivLen);
                $ciphertext = substr($raw, $ivLen);
                $decrypted = openssl_decrypt($ciphertext, $cipher, $key, OPENSSL_RAW_DATA, $iv);

                if ($decrypted === false) {
                    throw new Exception("Decryption failed. Incorrect secret key or corrupted ciphertext.");
                }

                return [
                    'output' => [
                        'decrypted_text' => $decrypted,
                        'cipher' => $cipher,
                        'mode' => 'decrypt',
                    ],
                    'download_token' => null,
                ];
            }
        });
    }
}
