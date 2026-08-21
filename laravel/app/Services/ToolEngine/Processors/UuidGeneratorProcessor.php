<?php

namespace App\Services\ToolEngine\Processors;

use App\Models\Tool;
use Illuminate\Support\Str;

class UuidGeneratorProcessor extends BaseToolProcessor
{
    public function getSlug(): string
    {
        return 'uuid-generator';
    }

    public function getValidationRules(): array
    {
        return [
            'count' => 'required|integer|min:1|max:100',
            'version' => 'nullable|string|in:v4,v7',
            'uppercase' => 'nullable|boolean',
            'remove_hyphens' => 'nullable|boolean',
        ];
    }

    public function process(array $input, Tool $tool): array
    {
        return $this->executeSafely(function () use ($input) {
            $count = (int) $input['count'];
            $version = $input['version'] ?? 'v4';
            $uppercase = $input['uppercase'] ?? false;
            $noHyphens = $input['remove_hyphens'] ?? false;

            $uuids = [];
            for ($i = 0; $i < $count; $i++) {
                $u = $version === 'v7' && method_exists(Str::class, 'uuid7')
                    ? (string) Str::uuid7()
                    : (string) Str::uuid();

                if ($noHyphens) {
                    $u = str_replace('-', '', $u);
                }
                if ($uppercase) {
                    $u = strtoupper($u);
                }
                $uuids[] = $u;
            }

            return [
                'output' => [
                    'uuids' => $uuids,
                    'count' => count($uuids),
                    'version' => $version,
                    'bulk_text' => implode("\n", $uuids),
                ],
                'download_token' => null,
            ];
        });
    }
}
