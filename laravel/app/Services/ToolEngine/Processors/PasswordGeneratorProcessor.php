<?php

namespace App\Services\ToolEngine\Processors;

use App\Models\Tool;

class PasswordGeneratorProcessor extends BaseToolProcessor
{
    public function getSlug(): string
    {
        return 'password-generator';
    }

    public function getValidationRules(): array
    {
        return [
            'length' => 'required|integer|min:8|max:128',
            'count' => 'nullable|integer|min:1|max:50',
            'include_uppercase' => 'nullable|boolean',
            'include_lowercase' => 'nullable|boolean',
            'include_numbers' => 'nullable|boolean',
            'include_symbols' => 'nullable|boolean',
            'exclude_ambiguous' => 'nullable|boolean', // 0, O, l, 1, I
        ];
    }

    public function process(array $input, Tool $tool): array
    {
        return $this->executeSafely(function () use ($input) {
            $length = (int) $input['length'];
            $count = (int) ($input['count'] ?? 1);
            $incUpper = $input['include_uppercase'] ?? true;
            $incLower = $input['include_lowercase'] ?? true;
            $incNum = $input['include_numbers'] ?? true;
            $incSym = $input['include_symbols'] ?? true;
            $noAmbiguous = $input['exclude_ambiguous'] ?? false;

            $upper = $noAmbiguous ? 'ABCDEFGHJKLMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            $lower = $noAmbiguous ? 'abcdefghijkmnopqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz';
            $numbers = $noAmbiguous ? '23456789' : '0123456789';
            $symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

            $chars = '';
            if ($incUpper) $chars .= $upper;
            if ($incLower) $chars .= $lower;
            if ($incNum) $chars .= $numbers;
            if ($incSym) $chars .= $symbols;

            if (empty($chars)) {
                $chars = $lower . $numbers;
            }

            $passwords = [];
            for ($c = 0; $c < $count; $c++) {
                $pwd = '';
                $maxIndex = strlen($chars) - 1;
                for ($i = 0; $i < $length; $i++) {
                    $pwd .= $chars[random_int(0, $maxIndex)];
                }
                $passwords[] = $pwd;
            }

            // Estimate entropy: length * log2(poolSize)
            $entropy = round($length * log(strlen($chars), 2), 1);

            return [
                'output' => [
                    'passwords' => $passwords,
                    'primary_password' => $passwords[0],
                    'length' => $length,
                    'entropy_bits' => $entropy,
                    'strength' => $entropy > 80 ? 'Very Strong' : ($entropy > 60 ? 'Strong' : 'Moderate'),
                ],
                'download_token' => null,
            ];
        });
    }
}
