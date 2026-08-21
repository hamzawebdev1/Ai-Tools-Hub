<?php

namespace App\Services\ToolEngine\Processors;

use App\Models\Tool;
use Exception;

class BcryptGeneratorProcessor extends BaseToolProcessor
{
    public function getSlug(): string
    {
        return 'bcrypt-generator';
    }

    public function getValidationRules(): array
    {
        return [
            'action' => 'required|string|in:generate,verify',
            'password' => 'required|string|max:255',
            'rounds' => 'nullable|integer|min:4|max:16',
            'hash_to_verify' => 'required_if:action,verify|nullable|string',
        ];
    }

    public function process(array $input, Tool $tool): array
    {
        return $this->executeSafely(function () use ($input) {
            $action = $input['action'];
            $password = $input['password'];
            $rounds = (int) ($input['rounds'] ?? 10);

            if ($action === 'verify') {
                $hash = trim($input['hash_to_verify'] ?? '');
                $matches = password_verify($password, $hash);

                return [
                    'output' => [
                        'matches' => $matches,
                        'message' => $matches ? 'Password matches bcrypt hash' : 'Password does NOT match hash',
                        'algorithm' => password_get_info($hash)['algoName'] ?? 'unknown',
                    ],
                    'download_token' => null,
                ];
            } else {
                $hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => $rounds]);

                return [
                    'output' => [
                        'hash' => $hash,
                        'rounds' => $rounds,
                        'algorithm' => 'bcrypt',
                        'length' => strlen($hash),
                    ],
                    'download_token' => null,
                ];
            }
        });
    }
}
