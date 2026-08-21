<?php

namespace App\Services\ToolEngine\Processors;

use App\Models\Tool;
use Exception;

class PercentageCalculatorProcessor extends BaseToolProcessor
{
    public function getSlug(): string
    {
        return 'percentage-calculator';
    }

    public function getValidationRules(): array
    {
        return [
            'mode' => 'required|string|in:what_is_p_of_x,x_is_what_p_of_y,percentage_change,increase_by,decrease_by',
            'value_a' => 'required|numeric',
            'value_b' => 'required|numeric',
        ];
    }

    public function process(array $input, Tool $tool): array
    {
        return $this->executeSafely(function () use ($input) {
            $mode = $input['mode'];
            $a = (float) $input['value_a'];
            $b = (float) $input['value_b'];

            $result = match ($mode) {
                'what_is_p_of_x' => ($a / 100) * $b,
                'x_is_what_p_of_y' => $b != 0 ? ($a / $b) * 100 : throw new Exception("Cannot divide by zero."),
                'percentage_change' => $a != 0 ? (($b - $a) / abs($a)) * 100 : throw new Exception("Base value cannot be zero."),
                'increase_by' => $a * (1 + ($b / 100)),
                'decrease_by' => $a * (1 - ($b / 100)),
            };

            return [
                'output' => [
                    'result' => round($result, 4),
                    'mode' => $mode,
                    'value_a' => $a,
                    'value_b' => $b,
                ],
                'download_token' => null,
            ];
        });
    }
}
